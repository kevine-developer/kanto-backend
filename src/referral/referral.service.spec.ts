import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ReferralService } from './referral.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ReferralStatus } from '../../generated/prisma/client.js';

describe('ReferralService', () => {
  let service: ReferralService;
  let prisma: any;
  let progressionService: any;
  let notificationsService: any;

  const mockConfig = {
    id: 'default',
    isEnabled: true,
    referrerXp: 250,
    referrerCoins: 50,
    refereeXp: 100,
    refereeCoins: 20,
    maxRewardsPerReferrer: 20,
    requireFirstActivity: true,
    welcomeMessageMg: 'Tonga soa',
    welcomeMessageFr: 'Bienvenue',
  };

  beforeEach(async () => {
    prisma = {
      referralConfig: {
        findUnique: jest.fn().mockResolvedValue(mockConfig),
        create: jest.fn().mockResolvedValue(mockConfig),
        update: jest.fn(),
      },
      referralCode: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(15),
        aggregate: jest.fn().mockResolvedValue({ _sum: { clicksCount: 120 } }),
      },
      referral: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(10),
        aggregate: jest.fn().mockResolvedValue({
          _sum: {
            referrerXpAwarded: 2500,
            referrerCoinsAwarded: 500,
            refereeXpAwarded: 1000,
            refereeCoinsAwarded: 200,
          },
        }),
      },
      user: {
        findUnique: jest.fn(),
      },
      userProgress: {
        upsert: jest.fn(),
      },
      adminAuditLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prisma)),
    };

    progressionService = {
      awardXp: jest.fn().mockResolvedValue({ totalXp: 500, level: 2, streakDays: 1 }),
    };

    notificationsService = {
      createNotification: jest.fn().mockResolvedValue({ id: 'notif_1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProgressionService, useValue: progressionService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
  });

  describe('getOrCreateUserCode', () => {
    it('renvoie le code existant si trouvé', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_1',
        userId: 'user_1',
        code: 'KANTO-TEST1',
      });

      const code = await service.getOrCreateUserCode('user_1');
      expect(code).toBe('KANTO-TEST1');
      expect(prisma.referralCode.create).not.toHaveBeenCalled();
    });

    it('génère et persiste un nouveau code si inexistant', async () => {
      prisma.referralCode.findUnique
        .mockResolvedValueOnce(null) // recherche initiale par userId
        .mockResolvedValueOnce(null); // vérification d'unicité du code généré

      prisma.user.findUnique.mockResolvedValueOnce({
        name: 'Toky Randria',
        username: 'toky_r',
      });

      prisma.referralCode.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'refc_new', ...data }),
      );

      const code = await service.getOrCreateUserCode('user_2');
      expect(code).toBeDefined();
      expect(code.startsWith('TOKYR-') || code.startsWith('KANTO-')).toBe(true);
      expect(prisma.referralCode.create).toHaveBeenCalled();
    });
  });

  describe('claimReferral (Contrôles de sécurité)', () => {
    it('interdit formellement l’auto-parrainage', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_self',
        userId: 'user_same',
        code: 'KANTO-SELF1',
        isActive: true,
        user: { id: 'user_same', name: 'Moi Même', banned: false },
      });

      await expect(
        service.claimReferral('user_same', 'KANTO-SELF1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('interdit d’associer un code inexistant ou inactif', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.claimReferral('user_3', 'UNKNOWN-CODE'),
      ).rejects.toThrow(NotFoundException);
    });

    it('interdit un second parrainage si le filleul est déjà parrainé', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_4',
        userId: 'user_referrer',
        code: 'KANTO-VALID1',
        isActive: true,
        user: { id: 'user_referrer', name: 'Parrain', banned: false },
      });

      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'existing_ref',
        refereeId: 'user_referee',
      });

      await expect(
        service.claimReferral('user_referee', 'KANTO-VALID1'),
      ).rejects.toThrow(ConflictException);
    });

    it('interdit le parrainage réciproque / en boucle', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_loop',
        userId: 'user_a',
        code: 'KANTO-LOOP',
        isActive: true,
        user: { id: 'user_a', name: 'User A', banned: false },
      });

      prisma.referral.findUnique.mockResolvedValueOnce(null);
      // Simule que user_b a déjà parrainé user_a dans le passé
      prisma.referral.findFirst.mockResolvedValueOnce({
        id: 'reverse_ref',
        referrerId: 'user_b',
        refereeId: 'user_a',
      });

      await expect(
        service.claimReferral('user_b', 'KANTO-LOOP'),
      ).rejects.toThrow(BadRequestException);
    });

    it('crée avec succès une invitation en statut PENDING et crédite le bonus de bienvenue', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_ok',
        userId: 'user_referrer_ok',
        code: 'KANTO-WELCOME',
        isActive: true,
        user: { id: 'user_referrer_ok', name: 'Rakoto Parrain', banned: false },
      });

      prisma.referral.findUnique.mockResolvedValueOnce(null);
      prisma.referral.findFirst.mockResolvedValueOnce(null);
      prisma.referral.create.mockResolvedValueOnce({
        id: 'ref_new',
        referrerId: 'user_referrer_ok',
        refereeId: 'user_new',
        status: ReferralStatus.PENDING,
      });
      prisma.referral.update.mockResolvedValueOnce({
        id: 'ref_new',
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
      });

      const res = await service.claimReferral('user_new', 'kanto-welcome');
      expect(res.success).toBe(true);
      expect(res.status).toBe(ReferralStatus.PENDING);
      expect(res.refereeXpAwarded).toBe(100);
      expect(res.refereeCoinsAwarded).toBe(20);
      expect(progressionService.awardXp).toHaveBeenCalledWith(
        'user_new',
        100,
        'welcome_referral_reward',
        expect.any(String),
      );
      expect(prisma.referral.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            referrerId: 'user_referrer_ok',
            refereeId: 'user_new',
            code: 'KANTO-WELCOME',
            status: ReferralStatus.PENDING,
          }),
        }),
      );
    });

    it('accepte avec idempotence une nouvelle soumission du même code pour un filleul déjà en attente', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_ok',
        userId: 'user_referrer_ok',
        code: 'KANTO-WELCOME',
        isActive: true,
        user: { id: 'user_referrer_ok', name: 'Rakoto Parrain', banned: false },
      });

      // Le parrainage existe déjà pour ce filleul avec le même code
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_existing',
        referrerId: 'user_referrer_ok',
        refereeId: 'user_new',
        code: 'KANTO-WELCOME',
        status: ReferralStatus.PENDING,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
        referrer: { id: 'user_referrer_ok', name: 'Rakoto Parrain' },
      });

      const res = await service.claimReferral('user_new', 'kanto-welcome');
      expect(res.success).toBe(true);
      expect(res.status).toBe(ReferralStatus.PENDING);
      expect(res.refereeXpAwarded).toBe(100);
      expect(res.refereeCoinsAwarded).toBe(20);
      expect(prisma.referral.create).not.toHaveBeenCalled();
    });
  });

  describe('completeReferral (Distribution atomique et idempotence)', () => {
    it('attribue correctement les XP & pièces au parrain et au filleul lors de la validation', async () => {
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_pending',
        referrerId: 'user_parrain',
        refereeId: 'user_filleul',
        status: ReferralStatus.PENDING,
        refereeXpAwarded: 0,
        refereeCoinsAwarded: 0,
        referrer: { id: 'user_parrain', name: 'Parrain Rakoto' },
        referee: { id: 'user_filleul', name: 'Filleul Rasoa' },
      });

      prisma.referral.count.mockResolvedValueOnce(5); // 5 parrainages complétés (sous le plafond de 20)
      prisma.referral.update.mockResolvedValueOnce({ id: 'ref_pending', status: ReferralStatus.COMPLETED });

      const result = await service.completeReferral('user_filleul');

      expect(result.completed).toBe(true);
      expect(result.referrerXp).toBe(250);
      expect(result.referrerCoins).toBe(50);
      expect(result.refereeXp).toBe(100);
      expect(result.refereeCoins).toBe(20);

      // Vérifie l'attribution d'XP
      expect(progressionService.awardXp).toHaveBeenCalledWith(
        'user_parrain',
        250,
        'referral_reward',
        expect.any(String),
      );
      expect(progressionService.awardXp).toHaveBeenCalledWith(
        'user_filleul',
        100,
        'welcome_referral_reward',
        expect.any(String),
      );

      // Vérifie l'incrément des pièces
      expect(prisma.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user_parrain' },
          update: { coins: { increment: 50 } },
        }),
      );
      expect(prisma.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user_filleul' },
          update: { coins: { increment: 20 } },
        }),
      );

      // Vérifie l'envoi de notification au parrain
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_parrain',
          category: 'reward',
        }),
      );
    });

    it('est parfaitement idempotent si le parrainage a déjà été complété', async () => {
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_done',
        referrerId: 'user_parrain',
        refereeId: 'user_filleul',
        status: ReferralStatus.COMPLETED,
        referrerXpAwarded: 250,
        referrerCoinsAwarded: 50,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
      });

      const result = await service.completeReferral('user_filleul');
      expect(result.completed).toBe(true);
      expect(progressionService.awardXp).not.toHaveBeenCalled();
      expect(prisma.referral.update).not.toHaveBeenCalled();
    });

    it('respecte le plafond maximal de récompenses pour le parrain (sans bloquer le filleul)', async () => {
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_limit',
        referrerId: 'user_power_referrer',
        refereeId: 'user_filleul_21',
        status: ReferralStatus.PENDING,
        referrer: { id: 'user_power_referrer', name: 'Grand Parrain' },
        referee: { id: 'user_filleul_21', name: 'Nouveau 21' },
      });

      // Le parrain a déjà atteint le plafond (20 récompenses)
      prisma.referral.count.mockResolvedValueOnce(20);
      prisma.referral.update.mockResolvedValueOnce({ id: 'ref_limit', status: ReferralStatus.COMPLETED });

      const result = await service.completeReferral('user_filleul_21');

      expect(result.completed).toBe(true);
      expect(result.referrerXp).toBe(0); // Pas d'XP au-delà du plafond
      expect(result.referrerCoins).toBe(0);
      expect(result.refereeXp).toBe(100); // Le filleul reçoit bien son bonus de bienvenue
      expect(result.refereeCoins).toBe(20);
    });
  });

  describe('Administration', () => {
    it('renvoie les statistiques globales d’administration', async () => {
      const overview = await service.getAdminOverview();
      expect(overview.metrics.totalCodes).toBe(15);
      expect(overview.metrics.totalClicks).toBe(120);
      expect(overview.metrics.conversionRate).toBeGreaterThan(0);
    });

    it('met à jour la configuration avec journalisation dans AdminAuditLog', async () => {
      prisma.referralConfig.update.mockResolvedValueOnce({
        ...mockConfig,
        referrerXp: 300,
      });

      const updated = await service.updateAdminConfig(
        { referrerXp: 300 },
        'admin_user_1',
      );

      expect(updated.referrerXp).toBe(300);
      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'admin_user_1',
            action: 'SETTINGS_UPDATED',
          }),
        }),
      );
    });
  });
});
