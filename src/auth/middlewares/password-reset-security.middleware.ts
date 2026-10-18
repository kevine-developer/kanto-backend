import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

/**
 * Middleware d'étanchéité stricte pour la réinitialisation de mot de passe Kanto MG.
 * Empêche formellement qu'un jeton émis pour l'application mobile native ne soit utilisé
 * sur l'interface d'administration, et inversement.
 */
@Injectable()
export class PasswordResetSecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PasswordResetSecurityMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Ne vérifier que les requêtes POST de réinitialisation effective de mot de passe
    if (req.method !== 'POST') {
      return next();
    }

    const token = (req.body?.token || req.query?.token) as string | undefined;
    if (!token || typeof token !== 'string') {
      return next();
    }

    try {
      // 1. Récupération du contexte de sécurité associé au jeton
      const contextRecord = await this.prisma.verification.findFirst({
        where: { identifier: `reset-password-context:${token}` },
      });

      if (contextRecord) {
        let meta: {
          context?: 'native' | 'admin';
          userId?: string;
          role?: string;
        } = {};

        try {
          meta = JSON.parse(contextRecord.value);
        } catch {
          meta = { context: contextRecord.value as 'native' | 'admin' };
        }

        const origin = (req.headers.origin || '').toLowerCase();
        const referer = (req.headers.referer || '').toLowerCase();
        const clientContext = (
          (req.headers['x-client-context'] as string) || ''
        ).toLowerCase();

        const configuredAdminUrl = (
          process.env.ADMIN_FRONTEND_URL ||
          process.env.ADMIN_URL ||
          ''
        ).toLowerCase();

        let adminHost = '';
        if (configuredAdminUrl) {
          try {
            adminHost = new URL(configuredAdminUrl).host.toLowerCase();
          } catch {
            // URL non analysable
          }
        }

        const isRequestFromAdmin =
          clientContext === 'admin' ||
          (adminHost &&
            (origin.includes(adminHost) || referer.includes(adminHost))) ||
          (configuredAdminUrl &&
            (origin.includes(configuredAdminUrl) ||
              referer.includes(configuredAdminUrl))) ||
          origin.includes('kanto-admin') ||
          origin.includes('admin') ||
          origin.includes(':3001') ||
          referer.includes('kanto-admin') ||
          referer.includes('admin') ||
          referer.includes(':3001');

        // Cas 1 : Tentative d'utiliser un jeton natif dans l'interface d'administration
        if (isRequestFromAdmin && meta.context === 'native') {
          this.logger.warn(
            `🛡️ [Auth Security] Tentative bloquée : jeton natif (${token.slice(0, 8)}...) utilisé sur l'interface d'administration.`,
          );
          res.status(403).json({
            error: {
              code: 'FORBIDDEN_CONTEXT',
              message:
                "Ce lien de réinitialisation est réservé à l'application mobile Kanto MG et ne peut pas être utilisé sur l'interface d'administration.",
            },
          });
          return;
        }

        // Cas 2 : Tentative d'utiliser un jeton administrateur dans l'application mobile ou son site web public
        if (!isRequestFromAdmin && meta.context === 'admin') {
          this.logger.warn(
            `🛡️ [Auth Security] Tentative bloquée : jeton administrateur (${token.slice(0, 8)}...) utilisé sur le parcours mobile natif.`,
          );
          res.status(403).json({
            error: {
              code: 'FORBIDDEN_CONTEXT',
              message:
                "Ce lien de réinitialisation est réservé aux administrateurs et ne peut pas être utilisé dans l'application mobile.",
            },
          });
          return;
        }

        // Cas 3 : Vérification stricte des permissions administrateur
        if (
          isRequestFromAdmin &&
          meta.role &&
          meta.role !== 'ADMIN' &&
          meta.role !== 'admin'
        ) {
          this.logger.warn(
            `🛡️ [Auth Security] Tentative bloquée : rôle utilisateur (${meta.role}) non autorisé sur le parcours administrateur.`,
          );
          res.status(403).json({
            error: {
              code: 'FORBIDDEN_ROLE',
              message:
                "Accès refusé : ce compte ne dispose pas des droits d'administration nécessaires.",
            },
          });
          return;
        }
      }
    } catch (err: unknown) {
      this.logger.warn(
        `⚠️ [Auth Security] Erreur lors de la vérification du contexte du jeton : ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    next();
  }
}
