import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BetaTestersService } from './beta-testers.service.js';
import { BetaEmailDispatcherService } from './services/beta-email-dispatcher.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TesterStatus, Prisma } from '../../generated/prisma/client.js';

describe('BetaTestersService', () => {
  let service: BetaTestersService;
  let prisma: {
    betaTester: {
      findUnique: jest.Mock<any>;
      create: jest.Mock<any>;
      count: jest.Mock<any>;
    };
    betaGroup: {
      findFirst: jest.Mock<any>;
    };
    betaAutomationConfig: {
      findFirst: jest.Mock<any>;
    };
  };
  let emailDispatcher: {
    sendTemplateEmail: jest.Mock<any>;
  };

  beforeEach(async () => {
    prisma = {
      betaTester: {
        findUnique: jest.fn<any>(),
        create: jest.fn<any>(),
        count: jest.fn<any>(),
      },
      betaGroup: {
        findFirst: jest.fn<any>().mockResolvedValue(null),
      },
      betaAutomationConfig: {
        findFirst: jest.fn<any>().mockResolvedValue({ autoConfirmRegistration: true }),
      },
    };

    emailDispatcher = {
      sendTemplateEmail: jest.fn<any>().mockResolvedValue({ success: true, to: 'test@example.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetaTestersService,
        { provide: PrismaService, useValue: prisma },
        { provide: BetaEmailDispatcherService, useValue: emailDispatcher },
      ],
    }).compile();

    service = module.get<BetaTestersService>(BetaTestersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('doit normaliser l’e-mail et inscrire un nouveau candidat sans lien de validation bloquant', async () => {
      prisma.betaTester.findUnique.mockResolvedValue(null);
      prisma.betaTester.create.mockResolvedValue({
        id: 'tester_1',
        email: 'jean.dupont@example.com',
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

      // Vérifie la normalisation
      expect(prisma.betaTester.findUnique).toHaveBeenCalledWith({
        where: { email: 'jean.dupont@example.com' },
        include: { group: true },
      });

      // Vérifie la création en base
      expect(prisma.betaTester.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'jean.dupont@example.com',
          fullName: 'Jean Dupont',
          platforms: ['ANDROID'],
          status: TesterStatus.PENDING,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        }),
      });

      // Vérifie l'envoi de l'email de confirmation via le dispatcher
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

    it('doit inscrire un testeur avec uniquement son email et les valeurs par défaut', async () => {
      prisma.betaTester.findUnique.mockResolvedValue(null);
      prisma.betaTester.create.mockResolvedValue({
        id: 'tester_email_only',
        email: 'simple@example.com',
        fullName: null,
        platforms: ['ANDROID'],
        status: TesterStatus.PENDING,
      });

      const result = await service.register({
        email: 'simple@example.com',
        platforms: ['ANDROID'],
        termsAccepted: true,
      });

      expect(prisma.betaTester.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'simple@example.com',
          fullName: null,
          platforms: ['ANDROID'],
          status: TesterStatus.PENDING,
        }),
      });

      expect(emailDispatcher.sendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'simple@example.com',
          templateCode: 'CONFIRMATION',
        }),
      );

      expect(result.success).toBe(true);
      expect(result.alreadyRegistered).toBe(false);
    });

    it('ne doit pas créer de doublon ni renvoyer d’email si l’adresse est déjà enregistrée', async () => {
      prisma.betaTester.findUnique.mockResolvedValue({
        id: 'existing_tester_1',
        email: 'deja.inscrit@example.com',
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

      expect(prisma.betaTester.findUnique).toHaveBeenCalledWith({
        where: { email: 'deja.inscrit@example.com' },
        include: { group: true },
      });

      // Aucune création en base
      expect(prisma.betaTester.create).not.toHaveBeenCalled();

      // Aucun email réexpédié
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();

      expect(result.success).toBe(false);
      expect(result.alreadyRegistered).toBe(true);
      expect(result.code).toBe('EMAIL_ALREADY_REGISTERED');
    });

    it('doit capturer les conflits de concurrence (erreur Prisma P2002) et retourner un message de doublon', async () => {
      prisma.betaTester.findUnique.mockResolvedValue(null);

      const p2002Error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`email`)',
        {
          code: 'P2002',
          clientVersion: '7.9.1',
        },
      );
      prisma.betaTester.create.mockRejectedValue(p2002Error);

      const result = await service.register({
        email: 'concurrence@example.com',
        platforms: ['ANDROID'],
        termsAccepted: true,
      });

      expect(prisma.betaTester.create).toHaveBeenCalled();
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();

      expect(result).toEqual({
        success: false,
        alreadyRegistered: true,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
      });
    });

    it('doit ignorer silencieusement la requête si le piège Honeypot (website) est rempli', async () => {
      const result = await service.register(
        {
          email: 'bot@spam.com',
          website: 'http://spam-link.com',
          platforms: ['ANDROID'],
          termsAccepted: true,
        },
        '192.168.1.1',
      );

      expect(prisma.betaTester.findUnique).not.toHaveBeenCalled();
      expect(prisma.betaTester.create).not.toHaveBeenCalled();
      expect(emailDispatcher.sendTemplateEmail).not.toHaveBeenCalled();

      expect(result).toEqual({
        success: true,
        message: 'Candidature enregistrée avec succès.',
      });
    });
  });
});
