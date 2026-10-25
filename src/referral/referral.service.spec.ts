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
        findUnique: jest.fn().mockImplementation(({ where }) =>
          Promise.resolve({
            id: where?.id || 'default_user',
            name: 'Utilisateur Test',
            username: 'testuser',
            banned: false,
          }),
        ),
      },
      userProgress: {
        upsert: jest.fn(),
      },
      notification: {
        count: jest.fn().mockResolvedValue(8),
        findMany: jest.fn().mockResolvedValue([]),
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

  describe('claimReferral (Règles métier & Contrôles de sécurité)', () => {
    it('Cas 1 : A parraine B — autorisé si les conditions sont remplies', async () => {
      // Configuration : User A a le code KANTO-USRA
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_usra',
        userId: 'user_a',
        code: 'KANTO-USRA',
        isActive: true,
        user: { id: 'user_a', name: 'User A', username: 'usera', banned: false },
      });

      // B n'a aucun parrain existant
      prisma.referral.findUnique.mockResolvedValueOnce(null);
      // Pas de réciprocité directe
      prisma.referral.findFirst.mockResolvedValueOnce(null);
      // A n'a pas de parrain (pas de cycle)
      prisma.referral.findUnique.mockResolvedValueOnce(null);

      // Création du referral
      prisma.referral.create.mockResolvedValueOnce({
        id: 'ref_a_b',
        referrerId: 'user_a',
        refereeId: 'user_b',
        code: 'KANTO-USRA',
        status: ReferralStatus.PENDING,
      });

      prisma.referral.update.mockResolvedValueOnce({
        id: 'ref_a_b',
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
      });

      const res = await service.claimReferral('user_b', 'KANTO-USRA');

      expect(res.success).toBe(true);
      expect(res.status).toBe(ReferralStatus.PENDING);
      expect(res.refereeXpAwarded).toBe(100);
      expect(res.refereeCoinsAwarded).toBe(20);
      expect(prisma.referral.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            referrerId: 'user_a',
            refereeId: 'user_b',
            code: 'KANTO-USRA',
          }),
        }),
      );
      expect(progressionService.awardXp).toHaveBeenCalledWith(
        'user_b',
        100,
        'welcome_referral_reward',
        expect.any(String),
      );
    });

    it('Cas 2 : B tente ensuite de parrainer A — parrainage croisé direct formellement refusé', async () => {
      // B possède le code KANTO-USRB
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_usrb',
        userId: 'user_b',
        code: 'KANTO-USRB',
        isActive: true,
        user: { id: 'user_b', name: 'User B', username: 'userb', banned: false },
      });

      // A n'a pas encore de parrain enregistré
      prisma.referral.findUnique.mockResolvedValueOnce(null);

      // Simulation de la relation existante : A parraine B (donc B a pour parrain A)
      prisma.referral.findFirst.mockResolvedValueOnce({
        id: 'ref_a_b',
        referrerId: 'user_a',
        refereeId: 'user_b',
        status: ReferralStatus.PENDING,
      });

      // A tente d'utiliser le code de B : doit être strictement rejeté
      await expect(
        service.claimReferral('user_a', 'KANTO-USRB'),
      ).rejects.toThrow(BadRequestException);

      // Vérification qu'aucune récompense n'a été créditée
      expect(prisma.referral.create).not.toHaveBeenCalled();
      expect(progressionService.awardXp).not.toHaveBeenCalled();
    });

    it('Cas 3 : Un utilisateur tente de se parrainer lui-même — strictement refusé', async () => {
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

      expect(prisma.referral.create).not.toHaveBeenCalled();
      expect(progressionService.awardXp).not.toHaveBeenCalled();
    });

    it('Cas 4 : Un utilisateur tente de changer de parrain après validation — strictement refusé', async () => {
      // Code soumis d'un nouveau parrain C
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_c',
        userId: 'user_c',
        code: 'KANTO-NEWC',
        isActive: true,
        user: { id: 'user_c', name: 'Parrain C', banned: false },
      });

      // L'utilisateur B a DÉJÀ un parrainage validé (COMPLETED) avec un autre code
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_existing_validated',
        refereeId: 'user_b',
        referrerId: 'user_a',
        code: 'KANTO-OLDA',
        status: ReferralStatus.COMPLETED,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
      });

      await expect(
        service.claimReferral('user_b', 'KANTO-NEWC'),
      ).rejects.toThrow(ConflictException);

      // Aucune nouvelle récompense ni modification
      expect(prisma.referral.create).not.toHaveBeenCalled();
      expect(progressionService.awardXp).not.toHaveBeenCalled();
    });

    it('Cas 5 : Une tentative de cycle indirect (A -> B -> C -> A) — formellement refusée', async () => {
      // Scénario :
      // 1. A a parrainé B (B a pour refereeId 'user_b', referrerId 'user_a')
      // 2. B a parrainé C (C a pour refereeId 'user_c', referrerId 'user_b')
      // 3. Maintenant, C tente de parrainer A avec son code KANTO-USRC
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_usrc',
        userId: 'user_c',
        code: 'KANTO-USRC',
        isActive: true,
        user: { id: 'user_c', name: 'User C', banned: false },
      });

      // A n'a pas encore de parrain direct dans findUnique({ where: { refereeId: 'user_a' } })
      prisma.referral.findUnique.mockResolvedValueOnce(null);

      // findFirst direct entre C et A ne trouve rien (car c'est un cycle indirect de longueur 3)
      prisma.referral.findFirst.mockResolvedValueOnce(null);

      // Détection de cycle indirect par remontée de la chaîne :
      // 1ère itération : parrain de C = B
      // 2ème itération : parrain de B = A (qui est le candidateRefereeId 'user_a')
      prisma.referral.findUnique
        .mockResolvedValueOnce({
          referrerId: 'user_b',
          status: ReferralStatus.COMPLETED,
        })
        .mockResolvedValueOnce({
          referrerId: 'user_a',
          status: ReferralStatus.COMPLETED,
        });

      await expect(
        service.claimReferral('user_a', 'KANTO-USRC'),
      ).rejects.toThrow(BadRequestException);

      // Vérifie qu'aucun enregistrement n'a été créé et aucune récompense octroyée
      expect(prisma.referral.create).not.toHaveBeenCalled();
      expect(progressionService.awardXp).not.toHaveBeenCalled();
    });

    it('Cas 6A : Concurrence simultanée (erreur P2002 Prisma sur refereeId) — rejet propre sans double attribution', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_ok',
        userId: 'user_a',
        code: 'KANTO-CONC',
        isActive: true,
        user: { id: 'user_a', name: 'User A', banned: false },
      });

      // Le findUnique initial ne voit rien encore car les deux requêtes sont simultanées
      prisma.referral.findUnique.mockResolvedValueOnce(null);
      prisma.referral.findFirst.mockResolvedValueOnce(null);
      prisma.referral.findUnique.mockResolvedValueOnce(null); // cycle check

      // La contrainte d'unicité de la base de données se déclenche lors de l'insertion simultanée
      const prismaP2002Error: any = new Error('Unique constraint failed on the fields: (`refereeId`)');
      prismaP2002Error.code = 'P2002';
      prisma.referral.create.mockRejectedValueOnce(prismaP2002Error);

      await expect(
        service.claimReferral('user_b', 'KANTO-CONC'),
      ).rejects.toThrow(ConflictException);

      // Aucune récompense attribuée
      expect(progressionService.awardXp).not.toHaveBeenCalled();
    });

    it('Cas 6B : Deux demandes avec le même code déjà validé — idempotence absolue, aucune double récompense', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_ok',
        userId: 'user_referrer_ok',
        code: 'KANTO-WELCOME',
        isActive: true,
        user: { id: 'user_referrer_ok', name: 'Rakoto Parrain', banned: false },
      });

      // Le parrainage existe déjà, validé avec récompenses déjà versées
      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_done',
        referrerId: 'user_referrer_ok',
        refereeId: 'user_new',
        code: 'KANTO-WELCOME',
        status: ReferralStatus.COMPLETED,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
        referrer: { id: 'user_referrer_ok', name: 'Rakoto Parrain' },
      });

      const res = await service.claimReferral('user_new', 'kanto-welcome');

      expect(res.success).toBe(true);
      expect(res.status).toBe(ReferralStatus.COMPLETED);
      expect(res.message).toBe('Votre parrainage est déjà validé et actif.');
      // Aucune réattribution d'XP ni de Coins
      expect(progressionService.awardXp).not.toHaveBeenCalled();
      expect(prisma.referral.create).not.toHaveBeenCalled();
      expect(prisma.userProgress.upsert).not.toHaveBeenCalled();
    });

    it('interdit d’associer un code inexistant ou inactif', async () => {
      prisma.referralCode.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.claimReferral('user_3', 'UNKNOWN-CODE'),
      ).rejects.toThrow(NotFoundException);
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

    it('renvoie la liste diagnostique des notifications de parrainage', async () => {
      prisma.notification.findMany.mockResolvedValueOnce([
        {
          id: 'notif_ref_1',
          userId: 'user_a',
          titleFr: 'Nouveau filleul validé !',
          titleMg: 'Mpiara-dia vaovao tonga soa !',
          messageFr: 'Votre proche a rejoint Kanto MG !',
          badgeText: '+250 XP',
          badgeType: 'reward',
          targetRoute: '/(screens)/profile/referral',
          isRead: false,
          createdAt: new Date(),
          user: { id: 'user_a', name: 'Parrain A', email: 'parrain@kanto.mg' },
        },
      ]);

      const diag = await service.getAdminReferralNotifications(10);
      expect(diag.items).toHaveLength(1);
      expect(diag.items[0].recipientName).toBe('Parrain A');
      expect(diag.items[0].targetRoute).toBe('/(screens)/profile/referral');
    });
  });

  describe('Notifications du Parrainage (Règles métier, UX & Idempotence)', () => {
    it('1. Lors d’un claim réussi, notifie le parrain (nouveau filleul) et le filleul (bonus de bienvenue) avec idempotence', async () => {
      notificationsService.createNotification.mockClear();

      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_notif',
        userId: 'user_referrer_notif',
        code: 'KANTO-NOTIF',
        isActive: true,
        user: { id: 'user_referrer_notif', name: 'Parrain Notif', banned: false },
      });

      prisma.referral.findUnique.mockResolvedValueOnce(null); // Pas de parrain existant
      prisma.referral.findFirst.mockResolvedValueOnce(null); // Pas de réciprocité
      prisma.referral.findUnique.mockResolvedValueOnce(null); // Pas de cycle

      prisma.referral.create.mockResolvedValueOnce({
        id: 'ref_notif_123',
        referrerId: 'user_referrer_notif',
        refereeId: 'user_referee_notif',
        code: 'KANTO-NOTIF',
        status: ReferralStatus.PENDING,
      });

      prisma.referral.update.mockResolvedValueOnce({
        id: 'ref_notif_123',
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
      });

      await service.claimReferral('user_referee_notif', 'KANTO-NOTIF');

      // Doit avoir envoyé exactement 2 notifications : une au parrain et une au filleul
      expect(notificationsService.createNotification).toHaveBeenCalledTimes(2);

      // Notification au parrain avec clé d'idempotence et bon deep link
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_referrer_notif',
          idempotencyKey: 'referral_claimed_referrer:ref_notif_123',
          targetRoute: '/(screens)/profile/referral',
          category: 'community',
        }),
      );

      // Notification au filleul avec clé d'idempotence
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_referee_notif',
          idempotencyKey: 'referral_claimed_referee:ref_notif_123',
          targetRoute: '/(screens)/profile/referral',
          badgeText: '+100 XP',
        }),
      );
    });

    it('2. Lors de la validation définitive, notifie le parrain avec les récompenses réelles et le filleul', async () => {
      notificationsService.createNotification.mockClear();

      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_val_456',
        referrerId: 'user_parrain_val',
        refereeId: 'user_filleul_val',
        status: ReferralStatus.PENDING,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
        referrer: { id: 'user_parrain_val', name: 'Parrain Validé' },
        referee: { id: 'user_filleul_val', name: 'Filleul Validé' },
      });

      prisma.referral.count.mockResolvedValueOnce(2); // 2 parrainages existants (sous le plafond de 20)
      prisma.referral.update.mockResolvedValueOnce({
        id: 'ref_val_456',
        status: ReferralStatus.COMPLETED,
      });

      await service.completeReferral('user_filleul_val');

      // Notification de validation envoyée au parrain
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_parrain_val',
          idempotencyKey: 'referral_completed_referrer:ref_val_456',
          category: 'reward',
          badgeText: '+250 XP',
          targetRoute: '/(screens)/profile/referral',
        }),
      );

      // Notification de validation envoyée au filleul
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_filleul_val',
          idempotencyKey: 'referral_completed_referee:ref_val_456',
          badgeText: 'Voamarina',
          targetRoute: '/(screens)/profile/referral',
        }),
      );
    });

    it('3. Si le parrain a atteint le plafond de récompenses, la notification annonce honnêtement le statut sans fausse récompense', async () => {
      notificationsService.createNotification.mockClear();

      prisma.referral.findUnique.mockResolvedValueOnce({
        id: 'ref_cap_789',
        referrerId: 'user_parrain_cap',
        refereeId: 'user_filleul_cap',
        status: ReferralStatus.PENDING,
        refereeXpAwarded: 100,
        refereeCoinsAwarded: 20,
        referrer: { id: 'user_parrain_cap', name: 'Grand Parrain' },
        referee: { id: 'user_filleul_cap', name: 'Filleul Cap' },
      });

      // 20 parrainages déjà complétés (plafond atteint)
      prisma.referral.count.mockResolvedValueOnce(20);
      prisma.referral.update.mockResolvedValueOnce({
        id: 'ref_cap_789',
        status: ReferralStatus.COMPLETED,
      });

      await service.completeReferral('user_filleul_cap');

      // Notification envoyée au parrain sans fausse annonce de récompense XP/Vola
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_parrain_cap',
          idempotencyKey: 'referral_completed_max_reached_referrer:ref_cap_789',
          badgeText: 'Fihavanana',
          messageFr: expect.stringContaining('plafond maximal'),
        }),
      );
    });

    it('4. Une tentative de parrainage refusée ne déclenche AUCUNE fausse notification', async () => {
      notificationsService.createNotification.mockClear();

      // Auto-parrainage
      prisma.referralCode.findUnique.mockResolvedValueOnce({
        id: 'refc_self',
        userId: 'user_same',
        code: 'KANTO-SELF',
        isActive: true,
        user: { id: 'user_same', name: 'Self', banned: false },
      });

      await expect(
        service.claimReferral('user_same', 'KANTO-SELF'),
      ).rejects.toThrow(BadRequestException);

      // ZÉRO notification envoyée
      expect(notificationsService.createNotification).not.toHaveBeenCalled();
    });

    it('5. Les utilisateurs désactivés ou bannis ne reçoivent aucune notification', async () => {
      notificationsService.createNotification.mockClear();

      // Mock user.findUnique pour retourner un utilisateur banni
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user_banned',
        banned: true,
      });

      const sent = await service.sendReferralNotificationSafe({
        userId: 'user_banned',
        idempotencyKey: 'test_key',
        titleMg: 'Lohateny',
        titleFr: 'Titre',
        messageMg: 'Hafatra',
        messageFr: 'Message',
      });

      expect(sent).toBe(false);
      expect(notificationsService.createNotification).not.toHaveBeenCalled();
    });

    it('6. Une défaillance réseau push/notification ne fait jamais échouer l’opération de parrainage (résilience)', async () => {
      // Simule une panne réseau Expo Push / Redis
      notificationsService.createNotification.mockRejectedValueOnce(
        new Error('Expo Push Service Unavailable (503)'),
      );

      const sent = await service.sendReferralNotificationSafe({
        userId: 'user_ok',
        idempotencyKey: 'test_key_fail',
        titleMg: 'Lohateny',
        titleFr: 'Titre',
        messageMg: 'Hafatra',
        messageFr: 'Message',
      });

      // L'erreur est absorbée et logguée sans propager d'exception
      expect(sent).toBe(false);
    });
  });
});
