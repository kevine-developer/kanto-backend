import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

/** Crée un mock minimal de la réponse Express. */
function makeMockRes() {
  const calls: { method: string; args: unknown[] }[] = [];
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    _calls: calls,
  };
  return res;
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            verification: {
              findFirst: () => Promise.resolve(null),
            },
            user: {
              findUnique: () => Promise.resolve(null),
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root (GET /)', () => {
    it('should return discreet JSON status { status: "ok", service: "kanto-backend" }', () => {
      const mockRes = makeMockRes();
      appController.getHello(undefined, undefined, mockRes as any);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'ok',
        service: 'kanto-backend',
      });
    });

    it('should redirect to /confirmation when error query param is present with res', () => {
      const mockRes = makeMockRes();
      appController.getHello('TOKEN_EXPIRED', 'test@kanto.mg', mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('/confirmation?error=TOKEN_EXPIRED'),
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('email=test%40kanto.mg'),
      );
    });
  });

  describe('email verification routes', () => {
    it('should return email verification page on /email-verified', () => {
      const res = appController.getEmailVerified();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Kanto');
      expect(res).toContain('kantomg://login?verified=true');
    });

    it('should handle error query param on /email-verified', () => {
      const res = appController.getEmailVerified('INVALID_TOKEN');
      expect(res).toContain('Lien invalide ou déjà utilisé');
    });

    it('should handle already_confirmed status on /email-verified', () => {
      const res = appController.getEmailVerified(
        undefined,
        'user@example.com',
        'already_confirmed',
      );
      expect(res).toContain('Adresse email déjà confirmée');
      expect(res).toContain('Compte déjà actif');
    });

    it('should return email verification page on /auth/email-verified', () => {
      const res = appController.getAuthEmailVerified();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Adresse email confirmée');
    });
  });

  describe('/confirmation route', () => {
    it('should send email verification page on /confirmation without token', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        undefined,
        undefined,
        mockRes as any,
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('<!DOCTYPE html>');
      expect(sentHtml).toContain('Kanto');
      expect(sentHtml).toContain('Adresse email confirmée');
    });

    it('should handle error query param on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        'TOKEN_EXPIRED',
        undefined,
        undefined,
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Temps limite dépassé');
      expect(sentHtml).toContain('Lien de confirmation expiré');
    });

    it('should handle status=already_confirmed on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'already_confirmed',
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Adresse email déjà confirmée');
      expect(sentHtml).toContain('Compte déjà actif');
    });

    it('should handle status=expired on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'expired',
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Temps limite dépassé');
      expect(sentHtml).toContain('Lien de confirmation expiré');
    });

    it('should redirect to Better-Auth verify-email when token is present', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        'sample-token-xyz',
        undefined,
        undefined,
        undefined,
        mockRes as any,
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining(
          '/api/auth/verify-email?token=sample-token-xyz',
        ),
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('callbackURL='),
      );
    });
  });
});
