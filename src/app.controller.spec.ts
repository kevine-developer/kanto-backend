import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

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
      expect(appController.getHello()).toEqual({
        status: 'ok',
        service: 'kanto-backend',
      });
    });

    it('should return HTML error page when error query param is present on root without res', () => {
      const res = appController.getHello('TOKEN_EXPIRED') as string;
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Temps limite dépassé');
      expect(res).toContain('Lien de confirmation expiré');
    });

    it('should redirect to /confirmation when error query param is present with res', () => {
      let redirectedCode = 0;
      let redirectedUrl = '';
      const mockRes = {
        redirect: (code: number, url: string) => {
          redirectedCode = code;
          redirectedUrl = url;
        },
      } as any;

      const res = appController.getHello(
        'TOKEN_EXPIRED',
        'test@kanto.mg',
        mockRes,
      );
      expect(redirectedCode).toBe(302);
      expect(redirectedUrl).toContain('/confirmation?error=TOKEN_EXPIRED');
      expect(redirectedUrl).toContain('email=test%40kanto.mg');
      expect(res).toBe('');
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
    it('should return email verification page on /confirmation without token', async () => {
      const res = await appController.getConfirmation();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Kanto');
      expect(res).toContain('Adresse email confirmée');
    });

    it('should handle error query param on /confirmation', async () => {
      const res = await appController.getConfirmation(
        undefined,
        'TOKEN_EXPIRED',
      );
      expect(res).toContain('Temps limite dépassé');
      expect(res).toContain('Lien de confirmation expiré');
    });

    it('should handle status=already_confirmed on /confirmation', async () => {
      const res = await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'already_confirmed',
      );
      expect(res).toContain('Adresse email déjà confirmée');
      expect(res).toContain('Compte déjà actif');
    });

    it('should handle status=expired on /confirmation', async () => {
      const res = await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'expired',
      );
      expect(res).toContain('Temps limite dépassé');
      expect(res).toContain('Lien de confirmation expiré');
    });

    it('should redirect to Better-Auth verify-email when token is present', async () => {
      let redirectedCode = 0;
      let redirectedUrl = '';
      const mockRes = {
        redirect: (code: number, url: string) => {
          redirectedCode = code;
          redirectedUrl = url;
        },
      } as any;
      const res = await appController.getConfirmation(
        'sample-token-xyz',
        undefined,
        undefined,
        undefined,
        mockRes,
      );
      expect(redirectedCode).toBe(302);
      expect(redirectedUrl).toContain(
        '/api/auth/verify-email?token=sample-token-xyz',
      );
      expect(redirectedUrl).toContain('callbackURL=');
      expect(res).toBe('');
    });
  });
});
