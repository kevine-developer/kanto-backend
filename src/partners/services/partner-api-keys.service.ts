import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateApiKeyDto,
  RevokeApiKeyDto,
} from '../dto/partner-api-key.dto.js';
import { ApiKeyEnvironment } from '../../../generated/prisma/client.js';

@Injectable()
export class PartnerApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Génère une nouvelle clé API pour un partenaire.
   * La clé secrète brute n'est retournée QU'UNE SEULE FOIS lors de cette création.
   */
  async createApiKey(partnerId: string, dto: CreateApiKeyDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    const env = dto.environment || ApiKeyEnvironment.LIVE;
    const prefix =
      env === ApiKeyEnvironment.TEST ? 'kanto_test_' : 'kanto_live_';

    // Génération de 32 octets aléatoires cryptographiques sécurisés (64 caractères hex)
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const fullSecretKey = `${prefix}${randomBytes}`;

    // Le préfixe d'affichage public (16 premiers caractères)
    const displayPrefix = fullSecretKey.slice(0, 16);

    // Calcul du hash SHA-256 irréversible
    const keyHash = crypto
      .createHash('sha256')
      .update(fullSecretKey)
      .digest('hex');

    const expiresAt = dto.expiresInDays
      ? new Date(Date.now() + dto.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const apiKey = await this.prisma.partnerApiKey.create({
      data: {
        partnerId,
        name: dto.name.trim(),
        keyPrefix: displayPrefix,
        keyHash,
        scopes: dto.scopes,
        environment: env,
        rateLimit: dto.rateLimit || 120,
        expiresAt,
      },
      select: {
        id: true,
        partnerId: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        environment: true,
        rateLimit: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return {
      apiKey,
      secretKey: fullSecretKey,
      warning:
        'ATTENTION : Conservez cette clé secrète en lieu sûr. Elle ne vous sera plus jamais affichée.',
    };
  }

  /**
   * Liste les clés API d'un partenaire (sans jamais exposer le secret).
   */
  async getPartnerApiKeys(partnerId: string) {
    return this.prisma.partnerApiKey.findMany({
      where: { partnerId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        environment: true,
        rateLimit: true,
        lastUsedAt: true,
        lastUsedIp: true,
        expiresAt: true,
        revokedAt: true,
        revocationReason: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Révoque immédiatement une clé API.
   */
  async revokeApiKey(partnerId: string, keyId: string, dto?: RevokeApiKeyDto) {
    const key = await this.prisma.partnerApiKey.findFirst({
      where: { id: keyId, partnerId },
    });

    if (!key) {
      throw new NotFoundException('Clé API introuvable pour ce partenaire.');
    }

    if (key.revokedAt) {
      throw new BadRequestException('Cette clé API est déjà révoquée.');
    }

    return this.prisma.partnerApiKey.update({
      where: { id: keyId },
      data: {
        revokedAt: new Date(),
        revocationReason:
          dto?.reason?.trim() ||
          'Révocation manuelle demandée par le partenaire',
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        revokedAt: true,
        revocationReason: true,
      },
    });
  }

  /**
   * Journalise une requête passée par l'API partenaire.
   */
  async logApiRequest(params: {
    partnerId: string;
    apiKeyId?: string;
    endpoint: string;
    method: string;
    statusCode: number;
    ipAddress?: string;
    userAgent?: string;
    responseTimeMs?: number;
  }) {
    try {
      await this.prisma.partnerApiLog.create({
        data: params,
      });
    } catch {
      // Éviter de bloquer la réponse en cas d'erreur de journalisation
    }
  }

  /**
   * Récupère l'historique récent des appels API pour le tableau de bord développeur.
   */
  async getPartnerApiLogs(partnerId: string, limit = 50) {
    return this.prisma.partnerApiLog.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });
  }
}
