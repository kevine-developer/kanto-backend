import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BetaTestersService } from './beta-testers.service.js';
import { BetaEmailDispatcherService } from './services/beta-email-dispatcher.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminAuditService } from '../admin/admin-audit.service.js';
import { TesterStatus, Prisma } from '../../generated/prisma/client.js';
import { hashEmail, encryptEmail, maskEmail } from './utils/beta-crypto.util.js';

describe('BetaTestersService', () => {
  let service: BetaTestersService;
  let prisma: {
    betaTester: {
      findUnique: jest.Mock<any>;
      findFirst: jest.Mock<any>;
      findMany: jest.Mock<any>;
      create: jest.Mock<any>;
      update: jest.Mock<any>;
      delete: jest.Mock<any>;
      count: jest.Mock<any>;
    };
    betaGroup: {
      findFirst: jest.Mock<any>;
    };
    betaAutomationConfig: {
      findFirst: jest.Mock<any>;
      create: jest.Mock<any>;
      update: jest.Mock<any>;
    };
    betaFeedback: {
      count: jest.Mock<any>;
    };
  };
  let emailDispatcher: {
    sendTemplateEmail: jest.Mock<any>;
  };
  let auditService: {
    logAction: jest.Mock<any>;
  };

  beforeEach(async () => {
    prisma = {
      betaTester: {
        findUnique: jest.fn<any>(),
        findFirst: jest.fn<any>(),
        findMany: jest.fn<any>(),
        create: jest.fn<any>(),
        update: jest.fn<any>(),
        delete: jest.fn<any>(),
        count: jest.fn<any>(),
      },
      betaGroup: {
        findFirst: jest.fn<any>().mockResolvedValue(null),
      },
      betaAutomationConfig: {
        findFirst: jest
          .fn<any>()
          .mockResolvedValue({ autoConfirmRegistration: true }),
        create: jest.fn<any>(),
        update: jest.fn<any>(),
      },
      betaFeedback: {
        count: jest.fn<any>().mockResolvedValue(0),
      },
    };

    emailDispatcher = {
      sendTemplateEmail: jest
        .fn<any>()
        .mockResolvedValue({ success: true, to: 'test@example.com' }),
    };

    auditService = {
      logAction: jest.fn<any>().mockResolvedValue({ id: 'audit_1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetaTestersService,
        { provide: PrismaService, useValue: prisma },
        { provide: BetaEmailDispatcherService, useValue: emailDispatcher },
        { provide: AdminAuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<BetaTestersService>(BetaTestersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register (Protection des données et chiffrement)', () => {
    it('chiffre réversiblement l’adresse et génère un hash HMAC-SHA-256 déterministe', async () => {
      prisma.betaTester.findFirst.mockResolvedValue(null);
      prisma.betaTester.create.mockResolvedValue({
        id: 'tester_1',
        email: encryptEmail('jean.dupont@example.com'),
        emailHash: hashEmail('jean.dupont@example.com'),
        fullName: 'Jean Dupont',
        platforms: ['ANDROID'],
        status: TesterStatus.PENDING,
      });

      const result = await service.register(
        {
          email: '  Jean.Dupont@Example.COM  ',
          fullName: 'Jean Dupont',
          platforms: ['ANDROID'],
          termsAccepted: true,
        },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      // Vérifie la recherche par hash et email
      expect(prisma.betaTester.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { emailHash: hashEmail('jean.dupont@example.com') },
            { email: 'jean.dupont@example.com' },
          ],
        },
        include: { group: true },
      });

      // Vérifie la création en base avec données chiffrées et hash HMAC
      expect(prisma.betaTester.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: expect.stringMatching(/^enc:v1:/),
          emailHash: hashEmail('jean.dupont@example.com'),
          fullName: 'Jean Dupont',
          platforms: ['ANDROID'],
          status: TesterStatus.PENDING,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        }),
      });

      // Vérifie que l'email en mémoire a bien été transmis au dispatcher pour envoi
      expect(emailDispatcher.sendTemplateEmail).toHaveBeenCalledTimes(1);
      expect(emailDispatcher.sendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jean.dupont@example.com',
          templateCode: 'CONFIRMATION',
        }),
      );

      expect(result).toEqual({
        success: true,
        alreadyRegistered: false,
        testerId: 'tester_1',
        platforms: ['ANDROID'],
        message: expect.stringContaining('confirmée avec succès'),
      });
    });

    it('ne crée pas de doublon et masque l’adresse email dans la réponse de doublon', async () => {
      prisma.betaTester.findFirst.mockResolvedValue({
        id: 'existing_tester_1',
        email: encryptEmail('deja.inscrit@example.com'),
        fullName: 'Doublon Test',
        platforms: ['ANDROID'],
        status: TesterStatus.APPROVED,
        androidStatus: 'ACCEPTED',
        iosStatus: 'NOT_REQUESTED',
        createdAt: new Date(),
      });

      const result = await service.register({
        email: 'DEJA.INSCRIT@EXAMPLE.COM',
        fullName: 'Doublon Test',
        platforms: ['ANDROID'],
        termsAccepted: true,
      });

      expect(prisma.betaTester.findFirst).toHaveBeenCalled();
      expect(prisma.betaTester.create).not.toHaveBeenCalled();
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();

      expect(result.success).toBe(false);
      expect(result.alreadyRegistered).toBe(true);
      expect(result.code).toBe('EMAIL_ALREADY_REGISTERED');
      // L'email dans la réponse de doublon doit être masqué pour éviter l'énumération
      expect(result.tester?.email).toBe('dej***@example.com');
    });

    it('ignore silencieusement la requête si le piège Honeypot est rempli', async () => {
      const result = await service.register(
        {
          email: 'bot@spam.com',
          website: 'http://spam-link.com',
          platforms: ['ANDROID'],
          termsAccepted: true,
        },
        '192.168.1.1',
      );

      expect(prisma.betaTester.findFirst).not.toHaveBeenCalled();
      expect(prisma.betaTester.create).not.toHaveBeenCalled();
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('verifyParticipation (Sécurité des réponses publiques)', () => {
    it('renvoie les informations du participant avec email masqué', async () => {
      prisma.betaTester.findFirst.mockResolvedValue({
        id: 'tester_1',
        email: encryptEmail('rakoto@kanto.mg'),
        fullName: 'Rakoto',
        platforms: ['ANDROID'],
        status: TesterStatus.APPROVED,
        androidStatus: 'ACCEPTED',
        iosStatus: 'NOT_REQUESTED',
        group: null,
        createdAt: new Date(),
      });

      const result = await service.verifyParticipation('rakoto@kanto.mg');

      expect(result.success).toBe(true);
      expect(result.exists).toBe(true);
      expect(result.tester?.email).toBe('rak***@kanto.mg');
      expect(result.tester?.maskedEmail).toBe('rak***@kanto.mg');
      expect(result.message).toContain('rak***@kanto.mg');
    });
  });

  describe('findAll (Masquage par défaut dans l’administration)', () => {
    it('masque les adresses email par défaut dans la liste administrative', async () => {
      prisma.betaTester.count.mockResolvedValue(1);
      prisma.betaTester.findMany.mockResolvedValue([
        {
          id: 't1',
          email: encryptEmail('admin.test@kanto.mg'),
          fullName: 'Test User',
          platforms: ['ANDROID'],
          status: TesterStatus.APPROVED,
          androidStatus: 'PENDING',
          iosStatus: 'NOT_REQUESTED',
          group: null,
          createdAt: new Date(),
        },
      ]);

      const res = await service.findAll({});

      expect(res.data[0].email).toBe('adm***@kanto.mg');
      expect(res.data[0].maskedEmail).toBe('adm***@kanto.mg');
    });

    it('recherche via HMAC-SHA-256 lorsque la requête contient une adresse email', async () => {
      prisma.betaTester.count.mockResolvedValue(0);
      prisma.betaTester.findMany.mockResolvedValue([]);

      await service.findAll({ search: 'target@orange.mg' });

      expect(prisma.betaTester.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { emailHash: hashEmail('target@orange.mg') },
            ]),
          }),
        }),
      );
    });
  });

  describe('revealEmail & Audit (Journalisation des accès sensibles)', () => {
    it('déchiffre l’email et enregistre l’opération dans le journal d’audit immuable', async () => {
      prisma.betaTester.findUnique.mockResolvedValue({
        id: 't_sensitive',
        email: encryptEmail('secret.user@kanto.mg'),
        platforms: ['ANDROID'],
      });

      const result = await service.revealEmail(
        't_sensitive',
        { id: 'admin_42', name: 'Super Admin' },
        '10.0.0.1',
      );

      expect(result.success).toBe(true);
      expect(result.email).toBe('secret.user@kanto.mg');
      expect(result.maskedEmail).toBe('sec***@kanto.mg');

      // Vérifie l'enregistrement dans AdminAuditLog
      expect(auditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'admin_42',
          userName: 'Super Admin',
          action: 'BETA_TESTER_REVEAL_EMAIL',
          targetType: 'BETA_TESTER',
          targetId: 't_sensitive',
          targetLabel: 'sec***@kanto.mg',
          ipAddress: '10.0.0.1',
        }),
      );
    });
  });

  describe('exportCsv (Protection contre l’injection CSV et traçabilité)', () => {
    it('neutralise les cellules malveillantes et journalise l’export', async () => {
      prisma.betaTester.findMany.mockResolvedValue([
        {
          id: 't_malicious',
          email: encryptEmail('malicious@calc.com'),
          fullName: '=cmd|/c calc',
          platforms: ['ANDROID'],
          status: TesterStatus.APPROVED,
          androidStatus: 'ACTIVE',
          iosStatus: 'NOT_REQUESTED',
          group: null,
          createdAt: new Date('2026-01-01T00:00:00Z'),
          lastContactedAt: null,
        },
      ]);

      const result = await service.exportCsv(
        { platform: 'ANDROID' },
        { id: 'admin_1', name: 'Admin Test' },
        '192.168.1.50',
      );

      // Vérifie la neutralisation de la formule
      expect(result.csv).toContain(`"'=cmd|/c calc"`);
      expect(result.csv).toContain(`"malicious@calc.com"`);

      // Vérifie la trace dans l'audit log
      expect(auditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'admin_1',
          action: 'BETA_EXPORT_CSV',
          targetType: 'BETA_TESTER',
          ipAddress: '192.168.1.50',
        }),
      );
    });
  });

  describe('remove (Suppression et conformité RGPD)', () => {
    it('journalise l’identité masquée du participant avant suppression effective', async () => {
      prisma.betaTester.findUnique.mockResolvedValue({
        id: 't_to_delete',
        email: encryptEmail('to.delete@kanto.mg'),
        platforms: ['IOS'],
        status: TesterStatus.REJECTED,
      });
      prisma.betaTester.delete.mockResolvedValue({ id: 't_to_delete' });

      const result = await service.remove(
        't_to_delete',
        { id: 'admin_1', name: 'Admin RGPD' },
        '127.0.0.1',
      );

      expect(result.success).toBe(true);
      expect(auditService.logAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'BETA_TESTER_DELETED',
          targetId: 't_to_delete',
          targetLabel: 'to.***@kanto.mg',
        }),
      );
      expect(prisma.betaTester.delete).toHaveBeenCalledWith({
        where: { id: 't_to_delete' },
      });
    });
  });

  describe('unsubscribe (Désinscription et e-mail de confirmation RGPD)', () => {
    it('met à jour le statut du testeur et expédie un e-mail officiel de confirmation', async () => {
      const emailClair = 'candidat.retrait@example.com';
      prisma.betaTester.findFirst.mockResolvedValue({
        id: 'tester_unsub',
        email: encryptEmail(emailClair),
        emailHash: hashEmail(emailClair),
        fullName: 'Testeur Retrait',
        status: TesterStatus.APPROVED,
        androidStatus: 'INVITED',
        iosStatus: 'NOT_REQUESTED',
        unsubscribedAt: null,
        unsubscribeToken: 'valid_unsub_token',
      });
      prisma.betaTester.update.mockResolvedValue({
        id: 'tester_unsub',
        status: TesterStatus.REJECTED,
      });

      const result = await service.unsubscribe({
        email: emailClair,
        reason: 'Manque de temps',
      });

      expect(result.success).toBe(true);
      expect(prisma.betaTester.update).toHaveBeenCalledWith({
        where: { id: 'tester_unsub' },
        data: expect.objectContaining({
          status: TesterStatus.REJECTED,
          androidStatus: 'REJECTED',
          iosStatus: 'REJECTED',
          unsubscribeReason: 'Manque de temps',
        }),
      });

      // Vérifie l'envoi de l'email de confirmation de désinscription
      expect(emailDispatcher.sendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: emailClair,
          templateCode: 'UNSUBSCRIBE_CONFIRMATION',
          bypassSuppression: true,
          variables: expect.objectContaining({
            userName: 'Testeur Retrait',
            reason: 'Manque de temps',
          }),
        }),
      );
    });

    it('gère l’idempotence si le testeur était déjà désinscrit sans relancer d’e-mail parasite', async () => {
      const emailClair = 'deja.parti@example.com';
      prisma.betaTester.findFirst.mockResolvedValue({
        id: 'tester_deja_unsub',
        email: encryptEmail(emailClair),
        status: TesterStatus.REJECTED,
        unsubscribedAt: new Date('2026-10-01'),
      });
      prisma.betaTester.update.mockResolvedValue({ id: 'tester_deja_unsub' });

      const result = await service.unsubscribe({ email: emailClair });

      expect(result.success).toBe(true);
      expect(result.alreadyUnsubscribed).toBe(true);
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();
    });
  });

  describe('register (Réactivation après désinscription)', () => {
    it('permet à un ancien testeur désinscrit de se réinscrire avec succès', async () => {
      prisma.betaAutomationConfig.findFirst.mockResolvedValue({
        autoInviteOnApproval: true,
        autoConfirmRegistration: true,
      });
      const emailClair = 'revenant@example.com';
      prisma.betaTester.findFirst.mockResolvedValue({
        id: 'tester_reactivated',
        email: encryptEmail(emailClair),
        fullName: 'Ancien Partant',
        status: TesterStatus.REJECTED,
        unsubscribedAt: new Date('2026-10-15'),
        unsubscribeToken: 'tok_123',
      });
      prisma.betaTester.update.mockResolvedValue({
        id: 'tester_reactivated',
        fullName: 'Ancien Partant',
        platforms: ['ANDROID', 'IOS'],
        status: TesterStatus.APPROVED,
      });

      const result = await service.register({
        email: emailClair,
        platforms: ['ANDROID', 'IOS'],
        termsAccepted: true,
      });

      expect(result.success).toBe(true);
      expect(result.isReactivated).toBe(true);
      expect(prisma.betaTester.update).toHaveBeenCalledWith({
        where: { id: 'tester_reactivated' },
        data: expect.objectContaining({
          unsubscribedAt: null,
          unsubscribeReason: null,
          status: TesterStatus.APPROVED,
        }),
      });
      expect(emailDispatcher.sendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: emailClair,
          templateCode: 'CONFIRMATION',
        }),
      );
    });
  });

  describe('getAutomationConfig & updateAutomationConfig', () => {
    it('retourne la configuration existante si présente en base', async () => {
      const mockConfig = {
        id: 'cfg_123',
        autoConfirmRegistration: true,
        autoInviteOnApproval: true,
        autoNotifyNewVersions: true,
        reminderIntervalDays: 7,
        feedbackRequestDays: 14,
        playStoreWebLink: 'https://play.google.com/test',
        playStoreAppLink: 'https://play.google.com/store',
        testFlightPublicLink: 'https://testflight.apple.com/join/kanto',
        supportEmail: 'support@kanto.mg',
      };
      prisma.betaAutomationConfig.findFirst.mockResolvedValue(mockConfig);

      const result = await service.getAutomationConfig();
      expect(result).toEqual(mockConfig);
      expect(prisma.betaAutomationConfig.findFirst).toHaveBeenCalled();
    });

    it('initialise la configuration par défaut si aucune ligne n’existe', async () => {
      prisma.betaAutomationConfig.findFirst.mockResolvedValue(null);
      prisma.betaAutomationConfig.create.mockResolvedValue({
        id: 'new_cfg',
        autoConfirmRegistration: true,
        feedbackRequestDays: 14,
      });

      const result = await service.getAutomationConfig();
      expect(result.id).toBe('new_cfg');
      expect(prisma.betaAutomationConfig.create).toHaveBeenCalled();
    });

    it('retourne le fallback par défaut résilient si Prisma lève une exception (table manquante)', async () => {
      prisma.betaAutomationConfig.findFirst.mockRejectedValue(
        new Error('relation "beta_automation_configs" does not exist'),
      );

      const result = await service.getAutomationConfig();
      expect(result).toBeDefined();
      expect(result.id).toBe('default');
      expect(result.autoConfirmRegistration).toBe(true);
      expect(result.supportEmail).toBe('contact@kanto.mg');
    });

    it('met à jour la configuration existante proprement', async () => {
      prisma.betaAutomationConfig.findFirst.mockResolvedValue({
        id: 'cfg_123',
      });
      prisma.betaAutomationConfig.update.mockResolvedValue({
        id: 'cfg_123',
        feedbackRequestDays: 10,
      });

      const result = await service.updateAutomationConfig({
        feedbackRequestDays: 10,
      });
      expect(result.feedbackRequestDays).toBe(10);
      expect(prisma.betaAutomationConfig.update).toHaveBeenCalledWith({
        where: { id: 'cfg_123' },
        data: { feedbackRequestDays: 10 },
      });
    });
  });
});
