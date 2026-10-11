/* eslint-disable @typescript-eslint/unbound-method */
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BetaTestersController } from './beta-testers.controller.js';
import { BetaTestersService } from './beta-testers.service.js';
import { AuthGuard } from '../auth/index.js';
import type { Request, Response } from 'express';

describe('BetaTestersController', () => {
  let controller: BetaTestersController;
  let service: {
    register: jest.Mock<any>;
    getPublicTesterCount: jest.Mock<any>;
    verifyParticipation: jest.Mock<any>;
    resendInvitePublic: jest.Mock<any>;
  };

  beforeEach(async () => {
    service = {
      register: jest.fn<any>(),
      getPublicTesterCount: jest.fn<any>().mockResolvedValue(42),
      verifyParticipation: jest.fn<any>(),
      resendInvitePublic: jest.fn<any>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetaTestersController],
      providers: [
        {
          provide: BetaTestersService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BetaTestersController>(BetaTestersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWaitlistScript', () => {
    it('doit servir le script client avec le moteur de consentement et la gestion des doublons', () => {
      const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      controller.getWaitlistScript(res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/javascript; charset=utf-8',
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('KantoConsent'),
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('alreadyRegistered'),
      );
    });
  });

  describe('getBetaLandingPage', () => {
    it('doit générer la page d’accueil avec la bannière et le modal de consentement', async () => {
      const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.getBetaLandingPage(undefined, undefined, undefined, res);

      expect(service.getPublicTesterCount).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('kanto-cookie-banner'),
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('kanto-cookie-modal'),
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('btn-cookie-settings'),
      );
    });
  });

  describe('register', () => {
    it('doit renvoyer une réponse JSON de succès pour un nouveau candidat', async () => {
      const mockResult = {
        success: true,
        alreadyRegistered: false,
        testerId: 'tester-123',
        message: 'Votre candidature a été enregistrée avec succès !',
      };
      service.register.mockResolvedValue(mockResult);

      const req = {
        headers: { 'user-agent': 'JestClient' },
        ip: '127.0.0.1',
        is: jest.fn().mockReturnValue(true),
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.register(
        { email: 'nouveau@example.com', fullName: 'Nouveau Testeur' },
        req,
        res,
      );

      expect(service.register).toHaveBeenCalledWith(
        { email: 'nouveau@example.com', fullName: 'Nouveau Testeur' },
        '127.0.0.1',
        'JestClient',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('doit renvoyer le message de doublon sans erreur 500 pour une adresse déjà enregistrée', async () => {
      const duplicateResult = {
        success: false,
        alreadyRegistered: true,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Cette adresse e-mail est déjà inscrite au programme bêta.',
      };
      service.register.mockResolvedValue(duplicateResult);

      const req = {
        headers: { 'user-agent': 'JestClient' },
        ip: '127.0.0.1',
        is: jest.fn().mockReturnValue(true),
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.register({ email: 'existant@example.com' }, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(duplicateResult);
    });
  });
});
