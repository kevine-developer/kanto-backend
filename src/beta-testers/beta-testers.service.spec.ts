import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BetaTestersService } from './beta-testers.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import { TesterStatus, Prisma } from '../../generated/prisma/client.js';

describe('BetaTestersService', () => {
  let service: BetaTestersService;
  let prisma: {
    betaTester: {
      findUnique: jest.Mock<any>;
      create: jest.Mock<any>;
      count: jest.Mock<any>;
    };
  };
  let resendService: {
    sendBetaTesterRegistrationEmail: jest.Mock<any>;
    sendBetaTesterStatusUpdateEmail: jest.Mock<any>;
  };

  beforeEach(async () => {
    prisma = {
      betaTester: {
        findUnique: jest.fn<any>(),
        create: jest.fn<any>(),
        count: jest.fn<any>(),
      },
    };

    resendService = {
      sendBetaTesterRegistrationEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'msg_123' }),
      sendBetaTesterStatusUpdateEmail: jest
        .fn<any>()
        .mockResolvedValue({ id: 'msg_456' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetaTestersService,
        { provide: PrismaService, useValue: prisma },
        { provide: ResendService, useValue: resendService },
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
        deviceModel: 'Pixel 7',
        status: TesterStatus.PENDING,
      });

      const result = await service.register(
        {
          email: '  Jean.Dupont@Example.COM  ',
          fullName: 'Jean Dupont',
          deviceModel: 'Pixel 7',
        },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      // Vérifie la normalisation
      expect(prisma.betaTester.findUnique).toHaveBeenCalledWith({
        where: { email: 'jean.dupont@example.com' },
      });

      // Vérifie la création en base
      expect(prisma.betaTester.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'jean.dupont@example.com',
          fullName: 'Jean Dupont',
          deviceModel: 'Pixel 7',
          status: TesterStatus.PENDING,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        }),
      });

      // Vérifie l'envoi d'un seul email d'information
      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).toHaveBeenCalledTimes(1);
      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).toHaveBeenCalledWith({
        to: 'jean.dupont@example.com',
        fullName: 'Jean Dupont',
        deviceModel: 'Pixel 7',
      });

      expect(result).toEqual({
        success: true,
        alreadyRegistered: false,
        testerId: 'tester_1',
        message: expect.stringContaining('enregistrée avec succès'),
      });
    });

    it('doit inscrire un testeur avec uniquement son email (sans pseudo ni modèle de téléphone)', async () => {
      prisma.betaTester.findUnique.mockResolvedValue(null);
      prisma.betaTester.create.mockResolvedValue({
        id: 'tester_email_only',
        email: 'simple@example.com',
        fullName: null,
        deviceModel: null,
        status: TesterStatus.PENDING,
      });

      const result = await service.register({
        email: 'simple@example.com',
      });

      expect(prisma.betaTester.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'simple@example.com',
          fullName: null,
          deviceModel: null,
          status: TesterStatus.PENDING,
        }),
      });

      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).toHaveBeenCalledWith({
        to: 'simple@example.com',
        fullName: undefined,
        deviceModel: undefined,
      });

      expect(result.success).toBe(true);
      expect(result.alreadyRegistered).toBe(false);
    });

    it('ne doit pas créer de doublon ni renvoyer d’email si l’adresse est déjà enregistrée', async () => {
      prisma.betaTester.findUnique.mockResolvedValue({
        id: 'existing_tester_1',
        email: 'deja.inscrit@example.com',
        status: TesterStatus.APPROVED,
      });

      const result = await service.register({
        email: 'DEJA.INSCRIT@EXAMPLE.COM',
        fullName: 'Doublon Test',
      });

      expect(prisma.betaTester.findUnique).toHaveBeenCalledWith({
        where: { email: 'deja.inscrit@example.com' },
      });

      // Aucune création en base
      expect(prisma.betaTester.create).not.toHaveBeenCalled();

      // Aucun email réexpédié
      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).not.toHaveBeenCalled();

      expect(result).toEqual({
        success: false,
        alreadyRegistered: true,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
        status: TesterStatus.APPROVED,
      });
    });

    it('doit capturer les conflits de concurrence (erreur Prisma P2002) et retourner un message de doublon', async () => {
      prisma.betaTester.findUnique.mockResolvedValue(null);

      // Simule une erreur de contrainte unique Prisma levée lors d'une soumission simultanée
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
      });

      expect(prisma.betaTester.create).toHaveBeenCalled();
      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).not.toHaveBeenCalled();

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
        },
        '192.168.1.1',
      );

      expect(prisma.betaTester.findUnique).not.toHaveBeenCalled();
      expect(prisma.betaTester.create).not.toHaveBeenCalled();
      expect(
        resendService.sendBetaTesterRegistrationEmail,
      ).not.toHaveBeenCalled();

      expect(result).toEqual({
        success: true,
        message: 'Candidature enregistrée avec succès.',
      });
    });
  });
});
