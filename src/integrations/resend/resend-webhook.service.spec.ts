import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ResendWebhookService } from './resend-webhook.service.js';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

describe('ResendWebhookService', () => {
  let service: ResendWebhookService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      emailLog: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
      },
      emailSuppression: {
        upsert: jest.fn().mockResolvedValue({ id: 'suppression_1' }),
      },
    };

    service = new ResendWebhookService(prismaMock as unknown as PrismaService);
  });

  describe('Transition d état normale', () => {
    it('doit passer le statut à SENT lors de la réception de email.sent', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_123',
        status: 'ACCEPTED',
        recipient: 'rakoto@kanto.mg',
        events: [],
      });

      const result = await service.handleWebhookEvent({
        type: 'email.sent',
        created_at: '2026-10-18T10:00:00Z',
        data: {
          email_id: 're_123',
        },
      });

      expect(result.handled).toBe(true);
      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'log_1' },
          data: expect.objectContaining({
            status: 'SENT',
          }),
        }),
      );
    });

    it('doit passer le statut à DELIVERED lors de email.delivered', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_123',
        status: 'SENT',
        recipient: 'rakoto@kanto.mg',
        events: [],
      });

      const result = await service.handleWebhookEvent({
        type: 'email.delivered',
        created_at: '2026-10-18T10:01:00Z',
        data: {
          email_id: 're_123',
        },
      });

      expect(result.handled).toBe(true);
      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'log_1' },
          data: expect.objectContaining({
            status: 'DELIVERED',
          }),
        }),
      );
    });
  });

  describe('Gestion des événements dans le désordre', () => {
    it('ne doit pas rétrograder un statut DELIVERED si un email.sent arrive en retard', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_123',
        status: 'DELIVERED', // Déjà livré
        recipient: 'rakoto@kanto.mg',
        events: [],
      });

      await service.handleWebhookEvent({
        type: 'email.sent',
        created_at: '2026-10-18T10:02:00Z',
        data: {
          email_id: 're_123',
        },
      });

      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DELIVERED', // Le statut reste DELIVERED
          }),
        }),
      );
    });
  });

  describe('Déduplication des webhooks reçus plusieurs fois', () => {
    it('doit ignorer sans mise à jour un événement déjà consigné avec la même date', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_123',
        status: 'DELIVERED',
        recipient: 'rakoto@kanto.mg',
        events: [
          {
            type: 'email.delivered',
            at: '2026-10-18T10:01:00Z',
          },
        ],
      });

      const result = await service.handleWebhookEvent({
        type: 'email.delivered',
        created_at: '2026-10-18T10:01:00Z', // Même timestamp
        data: {
          email_id: 're_123',
        },
      });

      expect(result.handled).toBe(true);
      expect(result.reason).toContain('Doublon idempotent');
      expect(prismaMock.emailLog.update).not.toHaveBeenCalled();
    });
  });

  describe('Gestion des rebonds et des plaintes (Suppression)', () => {
    it('doit marquer BOUNCED et ajouter à EmailSuppression lors d un rebond permanent', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_bounce_1',
        status: 'SENT',
        recipient: 'invalide@domaine-inexistant.com',
        events: [],
      });

      await service.handleWebhookEvent({
        type: 'email.bounced',
        created_at: '2026-10-18T10:05:00Z',
        data: {
          email_id: 're_bounce_1',
          bounce: {
            type: 'Permanent',
            subType: 'NoEmail',
            message: 'Mailbox does not exist',
          },
        },
      });

      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'BOUNCED',
            bounceType: 'Permanent',
            bounceSubtype: 'NoEmail',
          }),
        }),
      );

      expect(prismaMock.emailSuppression.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'invalide@domaine-inexistant.com' },
          create: expect.objectContaining({
            reason: 'BOUNCE_PERMANENT',
          }),
        }),
      );
    });

    it('ne doit PAS ajouter à EmailSuppression lors d un rebond temporaire (Transient)', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_soft_1',
        status: 'SENT',
        recipient: 'boite-pleine@example.com',
        events: [],
      });

      await service.handleWebhookEvent({
        type: 'email.bounced',
        created_at: '2026-10-18T10:06:00Z',
        data: {
          email_id: 're_soft_1',
          bounce: {
            type: 'Transient',
            subType: 'MailboxFull',
            message: 'Quota exceeded',
          },
        },
      });

      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'BOUNCED',
            bounceType: 'Transient',
          }),
        }),
      );

      // Ne doit pas exclure l'adresse
      expect(prismaMock.emailSuppression.upsert).not.toHaveBeenCalled();
    });

    it('doit marquer COMPLAINED et exclure immédiatement l adresse lors d un signalement de spam', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_complaint_1',
        status: 'DELIVERED',
        recipient: 'plaignant@example.com',
        events: [],
      });

      await service.handleWebhookEvent({
        type: 'email.complained',
        created_at: '2026-10-18T10:07:00Z',
        data: {
          email_id: 're_complaint_1',
        },
      });

      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'COMPLAINED',
          }),
        }),
      );

      expect(prismaMock.emailSuppression.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'plaignant@example.com' },
          create: expect.objectContaining({
            reason: 'COMPLAINT',
          }),
        }),
      );
    });
  });

  describe('Ouvertures et clics', () => {
    it('ne doit pas changer le statut de livraison lors de email.opened ou email.clicked', async () => {
      prismaMock.emailLog.findFirst.mockResolvedValueOnce({
        id: 'log_1',
        resendId: 're_click_1',
        status: 'DELIVERED',
        recipient: 'lecteur@kanto.mg',
        events: [],
      });

      await service.handleWebhookEvent({
        type: 'email.clicked',
        created_at: '2026-10-18T10:08:00Z',
        data: {
          email_id: 're_click_1',
          click: {
            link: 'https://kanto.mg',
          },
        },
      });

      expect(prismaMock.emailLog.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DELIVERED', // Le statut de livraison est préservé
            events: expect.arrayContaining([
              expect.objectContaining({
                type: 'email.clicked',
              }),
            ]),
          }),
        }),
      );
    });
  });
});
