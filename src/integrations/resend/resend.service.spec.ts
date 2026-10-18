import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ResendService } from './resend.service.js';

describe('ResendService', () => {
  let service: ResendService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      emailLog: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 'log_cuid_123',
            ...data,
            attempts: data.attempts || 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 'log_cuid_123',
            ...data,
          }),
        ),
      },
      emailSuppression: {
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(null)),
        upsert: jest.fn(),
      },
    };

    // Par défaut, pas de clé API dans l'environnement de test pour éviter tout envoi externe accidentel
    delete process.env.RESEND_API_KEY;
    service = new ResendService(prismaMock);
  });

  describe('Validation des adresses et sécurité', () => {
    it('doit rejeter une adresse vide ou inexistante', async () => {
      await expect(
        service.sendEmail({
          to: '',
          subject: 'Test',
          html: '<p>Contenu</p>',
        }),
      ).rejects.toThrow();
    });

    it('doit rejeter une tentative d injection CRLF dans l adresse e-mail', async () => {
      await expect(
        service.sendEmail({
          to: 'hacker@example.com\r\nBcc: victim@example.com',
          subject: 'Attaque CRLF',
          html: '<p>Test</p>',
        }),
      ).rejects.toThrow(/caractères interdits/);
    });

    it('doit refuser un format d e-mail syntaxiquement invalide', async () => {
      await expect(
        service.sendEmail({
          to: 'adresse-non-valide',
          subject: 'Test',
          html: '<p>Contenu</p>',
        }),
      ).rejects.toThrow(/invalide/);
    });
  });

  describe('Mode Simulation (Sans clé API de production)', () => {
    it('doit simuler l envoi et enregistrer le statut ACCEPTED sans appeler Resend', async () => {
      const result = await service.sendEmail({
        to: 'destinataire@example.com',
        subject: 'Bienvenue sur Kanto',
        html: '<p>Bienvenue !</p>',
        text: 'Bienvenue !',
        templateType: 'WELCOME',
      });

      expect(result.simulated).toBe(true);
      expect(result.id).toMatch(/^sim_/);
      expect(prismaMock.emailLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            recipient: 'destinataire@example.com',
            templateType: 'WELCOME',
            status: 'PENDING',
          }),
        }),
      );
      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'log_cuid_123' },
          data: expect.objectContaining({
            status: 'ACCEPTED',
          }),
        }),
      );
    });
  });

  describe('Idempotence et prévention des doublons', () => {
    it('doit retourner le résultat en cache sans réémettre d envoi si la clé d idempotence est déjà traitée', async () => {
      prismaMock.emailLog.findUnique.mockResolvedValueOnce({
        id: 'existing_log_1',
        resendId: 're_deja_envoye_123',
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 3600000),
      });

      const result = await service.sendEmail({
        to: 'membre@kanto.mg',
        subject: 'Contribution approuvée',
        html: '<p>Félicitations</p>',
        idempotencyKey: 'contrib-approved-xyz',
      });

      expect(result.cached).toBe(true);
      expect(result.id).toBe('re_deja_envoye_123');
      // Ne doit pas recréer de log d'envoi
      expect(prismaMock.emailLog.create).not.toHaveBeenCalled();
    });

    it('doit bloquer les envois concurrents sur une même clé d idempotence en cours (PENDING < 30s)', async () => {
      prismaMock.emailLog.findUnique.mockResolvedValueOnce({
        id: 'existing_log_pending',
        resendId: null,
        status: 'PENDING',
        createdAt: new Date(Date.now() - 5000), // Créé il y a 5 secondes
      });

      const result = await service.sendEmail({
        to: 'membre@kanto.mg',
        subject: 'Double clic utilisateur',
        html: '<p>Contenu</p>',
        idempotencyKey: 'double-click-key',
      });

      expect(result.cached).toBe(true);
      expect(prismaMock.emailLog.create).not.toHaveBeenCalled();
    });
  });

  describe('Protection par liste d exclusion (Hard Bounce & Spam Complaints)', () => {
    it('doit bloquer un envoi standard si le destinataire est présent dans EmailSuppression', async () => {
      prismaMock.emailSuppression.findUnique.mockResolvedValueOnce({
        email: 'bounced@example.com',
        reason: 'BOUNCE_PERMANENT',
        details: 'Boîte de messagerie inexistante',
      });

      const result = await service.sendEmail({
        to: 'bounced@example.com',
        subject: 'Email marketing ou non essentiel',
        html: '<p>Contenu</p>',
      });

      // L'envoi est court-circuité
      expect(result.simulated).toBe(true);
      expect(prismaMock.emailLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            recipient: 'bounced@example.com',
            status: 'FAILED',
            errorReason: expect.stringContaining('liste de suppression'),
          }),
        }),
      );
    });

    it('doit autoriser les notifications de sécurité critiques même si l adresse est en suppression', async () => {
      prismaMock.emailSuppression.findUnique.mockResolvedValueOnce({
        email: 'securite@example.com',
        reason: 'BOUNCE_PERMANENT',
      });

      const result = await service.sendSecurityChangeEmail({
        to: 'securite@example.com',
        userName: 'Rakoto',
        action: 'changed',
      });

      // Le bypassSuppression permet d'exécuter la tentative
      expect(result.id).toBeDefined();
    });
  });

  describe('Relance administrative sécurisée (retryEmail)', () => {
    it('doit refuser la relance d un message déjà marqué comme DELIVERED', async () => {
      prismaMock.emailLog.findUnique.mockResolvedValueOnce({
        id: 'log_delivered',
        recipient: 'dest@example.com',
        status: 'DELIVERED',
        attempts: 1,
      });

      await expect(service.retryEmail('log_delivered')).rejects.toThrow(
        /déjà accusé comme livré/,
      );
    });

    it('doit refuser la relance d un message ACCEPTED il y a moins de 5 minutes', async () => {
      prismaMock.emailLog.findUnique.mockResolvedValueOnce({
        id: 'log_recent',
        recipient: 'dest@example.com',
        status: 'ACCEPTED',
        lastAttemptAt: new Date(Date.now() - 60000), // il y a 1 minute
        attempts: 1,
      });

      await expect(service.retryEmail('log_recent')).rejects.toThrow(
        /moins de 5 minutes/,
      );
    });

    it('doit exécuter la relance d un message en échec FAILED', async () => {
      prismaMock.emailLog.findUnique.mockResolvedValueOnce({
        id: 'log_failed',
        recipient: 'dest@example.com',
        subject: 'Notification importante',
        from: 'Kanto <noreply@kanto.mg>',
        status: 'FAILED',
        attempts: 1,
        lastAttemptAt: new Date(Date.now() - 600000),
        events: [],
      });

      const result = await service.retryEmail('log_failed');

      expect(result.id).toBeDefined();
      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'log_failed' },
          data: expect.objectContaining({
            attempts: { increment: 1 },
          }),
        }),
      );
    });
  });
});
