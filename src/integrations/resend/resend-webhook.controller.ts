import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { Throttle } from '@nestjs/throttler';

import {
  ResendWebhookService,
  ResendWebhookPayload,
} from './resend-webhook.service.js';

@Controller('webhooks/resend')
export class ResendWebhookController {
  private readonly logger = new Logger(ResendWebhookController.name);

  constructor(private readonly webhookService: ResendWebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  async handleResendWebhook(
    @Req() req: Request,
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') svixTimestamp?: string,
    @Headers('svix-signature') svixSignature?: string,
  ): Promise<{ received: boolean; handled?: boolean }> {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // 1. Validation de la configuration du secret
    if (!webhookSecret || webhookSecret.trim() === '') {
      this.logger.error(
        '❌ [Resend Webhook] RESEND_WEBHOOK_SECRET est manquant dans les variables d’environnement.',
      );
      throw new UnauthorizedException(
        'Le service de webhook n’est pas configuré pour valider la signature.',
      );
    }

    // 2. Validation de la présence des en-têtes Svix obligatoires
    if (!svixId || !svixTimestamp || !svixSignature) {
      this.logger.warn(
        '⚠️ [Resend Webhook] Requête reçue sans les en-têtes de signature Svix obligatoires.',
      );
      throw new UnauthorizedException(
        'En-têtes de signature de webhook manquants.',
      );
    }

    // 3. Récupération du corps brut (Raw Body) pour le calcul cryptographique
    const rawBodyBuffer = (req as any).rawBody;
    let payloadString: string;

    if (rawBodyBuffer && Buffer.isBuffer(rawBodyBuffer)) {
      payloadString = rawBodyBuffer.toString('utf-8');
    } else if (typeof req.body === 'string') {
      payloadString = req.body;
    } else if (req.body && Object.keys(req.body).length > 0) {
      payloadString = JSON.stringify(req.body);
    } else {
      throw new BadRequestException('Corps de requête de webhook vide.');
    }

    // 4. Vérification officielle de signature cryptographique Svix
    try {
      const wh = new Webhook(webhookSecret.trim());
      wh.verify(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `🚨 [Resend Webhook] Signature invalide ou attaque par rejeu détectée : ${errorMsg}`,
      );
      throw new UnauthorizedException(
        'Signature de webhook Resend invalide ou expirée.',
      );
    }

    let event: ResendWebhookPayload;
    try {
      event =
        typeof req.body === 'object' &&
        req.body !== null &&
        !Buffer.isBuffer(req.body)
          ? (req.body as ResendWebhookPayload)
          : (JSON.parse(payloadString) as ResendWebhookPayload);
    } catch {
      throw new BadRequestException(
        'Format JSON du corps de webhook invalide.',
      );
    }

    // 5. Traitement métier de l'événement validé
    const result = await this.webhookService.handleWebhookEvent(event);

    return {
      received: true,
      handled: result.handled,
    };
  }
}
