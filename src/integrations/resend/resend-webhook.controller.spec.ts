import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { Webhook } from 'svix';
import { ResendWebhookController } from './resend-webhook.controller.js';

describe('ResendWebhookController', () => {
  let controller: ResendWebhookController;
  let webhookServiceMock: any;
  const testSecret = 'whsec_MfKQ9r8GKYqrTwjmtGtUpSCvJwtHNKG5';

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = testSecret;

    webhookServiceMock = {
      handleWebhookEvent: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ handled: true })),
    };

    controller = new ResendWebhookController(webhookServiceMock);
  });

  it('doit rejeter si RESEND_WEBHOOK_SECRET n est pas configuré', async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;

    await expect(
      controller.handleResendWebhook(
        { body: {} } as any,
        'msg_1',
        '1234567890',
        'v1,sig',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('doit rejeter si les en-têtes Svix sont manquants', async () => {
    await expect(
      controller.handleResendWebhook(
        { body: { type: 'email.sent' } } as any,
        undefined,
        undefined,
        undefined,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('doit rejeter si la signature Svix est invalide', async () => {
    const rawPayload = JSON.stringify({
      type: 'email.sent',
      data: { id: 're_1' },
    });

    await expect(
      controller.handleResendWebhook(
        { body: rawPayload } as any,
        'msg_fake',
        Math.floor(Date.now() / 1000).toString(),
        'v1,signature_totalement_invalide',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('doit accepter et traiter la requête si la signature Svix est valide', async () => {
    const payload = {
      type: 'email.delivered',
      created_at: new Date().toISOString(),
      data: {
        email_id: 're_valid_123',
      },
    };
    const rawPayload = JSON.stringify(payload);

    // Génération d'une signature Svix authentique avec le secret de test
    const wh = new Webhook(testSecret);
    const timestamp = new Date();
    const svixId = 'msg_test_' + Date.now();
    const signature = wh.sign(svixId, timestamp, rawPayload);

    const result = await controller.handleResendWebhook(
      { body: rawPayload } as any,
      svixId,
      Math.floor(timestamp.getTime() / 1000).toString(),
      signature,
    );

    expect(result.received).toBe(true);
    expect(webhookServiceMock.handleWebhookEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'email.delivered',
      }),
    );
  });
});
