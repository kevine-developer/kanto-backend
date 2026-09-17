import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!" for non-HTML client', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return HTML page when browser requests text/html', () => {
      const res = appController.getHello('text/html,application/xhtml+xml');
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Kanto');
      expect(res).toContain('Adresse email confirmée');
    });

    it('should return HTML error page when error query param is present', () => {
      const res = appController.getHello('', 'TOKEN_EXPIRED');
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Lien de confirmation expiré');
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

    it('should return email verification page on /auth/email-verified', () => {
      const res = appController.getAuthEmailVerified();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Adresse email confirmée');
    });
  });
});
