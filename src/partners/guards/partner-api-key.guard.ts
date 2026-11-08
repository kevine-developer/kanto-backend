import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PartnerStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class PartnerApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(PartnerApiKeyGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & {
      partner?: any;
      apiKey?: any;
      partnerScopes?: string[];
      startTime?: number;
    }>();

    request.startTime = Date.now();

    // Extraction de la clé depuis les headers standards
    const rawHeader =
      request.headers['x-api-key'] || request.headers['authorization'];

    if (!rawHeader || typeof rawHeader !== 'string') {
      throw new UnauthorizedException(
        'Clé API Partenaire manquante. Veuillez fournir le header X-API-Key ou Authorization: Bearer <clé>.',
      );
    }

    let keyString = rawHeader.trim();
    if (keyString.toLowerCase().startsWith('bearer ')) {
      keyString = keyString.slice(7).trim();
    }

    if (!keyString || keyString.length < 24) {
      throw new UnauthorizedException('Format de clé API Partenaire invalide.');
    }

    // Calcul du hash SHA-256 de la clé reçue
    const keyHash = crypto
      .createHash('sha256')
      .update(keyString)
      .digest('hex');

    // Recherche de la clé en base
    const apiKey = await this.prisma.partnerApiKey.findUnique({
      where: { keyHash },
      include: {
        partner: true,
      },
    });

    if (!apiKey) {
      throw new UnauthorizedException(
        'Clé API Partenaire invalide ou inexistante.',
      );
    }

    // Vérification de révocation
    if (apiKey.revokedAt) {
      throw new ForbiddenException(
        `Cette clé API a été révoquée le ${apiKey.revokedAt.toISOString()}.${apiKey.revocationReason ? ` Motif : ${apiKey.revocationReason}` : ''}`,
      );
    }

    // Vérification d'expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new ForbiddenException(
        'Cette clé API Partenaire a expiré. Veuillez générer une nouvelle clé sur le portail organisateurs.',
      );
    }

    // Vérification du statut du partenaire
    if (apiKey.partner.status !== PartnerStatus.VERIFIED) {
      if (apiKey.partner.status === PartnerStatus.PENDING_VERIFICATION) {
        throw new ForbiddenException(
          'Votre compte partenaire est en cours de vérification par l’équipe Kanto MG. Les accès API seront activés dès validation.',
        );
      } else if (apiKey.partner.status === PartnerStatus.SUSPENDED) {
        throw new ForbiddenException(
          'Votre compte partenaire est actuellement suspendu. Veuillez contacter l’équipe Kanto MG.',
        );
      } else {
        throw new ForbiddenException(
          `Accès API refusé. Votre compte partenaire a été refusé.${apiKey.partner.rejectionReason ? ` Motif : ${apiKey.partner.rejectionReason}` : ''}`,
        );
      }
    }

    // Injection du contexte partenaire dans la requête
    request.partner = apiKey.partner;
    request.apiKey = apiKey;
    request.partnerScopes = apiKey.scopes;

    // Mise à jour asynchrone non-bloquante du dernier usage
    const clientIp =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.ip ||
      request.socket.remoteAddress ||
      '';

    void this.prisma.partnerApiKey
      .update({
        where: { id: apiKey.id },
        data: {
          lastUsedAt: new Date(),
          lastUsedIp: clientIp,
        },
      })
      .catch(() => {});

    return true;
  }
}

