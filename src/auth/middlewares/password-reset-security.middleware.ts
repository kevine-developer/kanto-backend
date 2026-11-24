import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

const jsonParser = express.json({ limit: '1mb' });

/**
 * Middleware d'étanchéité stricte pour la réinitialisation de mot de passe Kanto MG.
 * Empêche formellement qu'un jeton émis pour l'application mobile native ne soit utilisé
 * sur l'interface d'administration, et inversement.
 * Interdit formellement toute demande de réinitialisation initiée depuis l'administration
 * pour un compte non-administrateur (rôle USER standard).
 */
@Injectable()
export class PasswordResetSecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PasswordResetSecurityMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Ne vérifier que les requêtes POST d'authentification par mot de passe
    if (req.method !== 'POST') {
      return next();
    }

    // Assurer que req.body est parsé même si NestFactory utilise bodyParser: false
    if (!req.body && (req.is('application/json') || req.headers['content-type']?.includes('json'))) {
      await new Promise<void>((resolve) => {
        jsonParser(req, res, () => resolve());
      });
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

    const redirectTo =
      typeof req.body?.redirectTo === 'string'
        ? (req.body.redirectTo as string).toLowerCase()
        : '';

    const isRequestFromAdmin =
      clientContext === 'admin' ||
      (adminHost &&
        (origin.includes(adminHost) ||
          referer.includes(adminHost) ||
          redirectTo.includes(adminHost))) ||
      (configuredAdminUrl &&
        (origin.includes(configuredAdminUrl) ||
          referer.includes(configuredAdminUrl))) ||
      origin.includes('kanto-admin') ||
      origin.includes('admin') ||
      origin.includes(':3001') ||
      referer.includes('kanto-admin') ||
      referer.includes('admin') ||
      referer.includes(':3001') ||
      redirectTo.includes('admin') ||
      redirectTo.includes(':3001');

    const path = req.path || req.originalUrl || '';

    // ─── 1. INTERCEPTION DE LA DEMANDE DE RÉINITIALISATION (FORGET-PASSWORD) ────
    if (path.includes('forget-password') || path.includes('request-password-reset')) {
      const email = (req.body?.email as string | undefined)?.trim()?.toLowerCase();

      if (isRequestFromAdmin && email) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true },
          });

          if (!user || user.role !== 'ADMIN') {
            this.logger.warn(
              `🛡️ [Auth Security] Tentative bloquée : demande de réinitialisation initiée depuis l'interface ADMIN pour un compte non-administrateur ("${email}", rôle: ${user?.role || 'INEXISTANT'}).`,
            );
            res.status(403).json({
              error: {
                code: 'FORBIDDEN_ROLE',
                message:
                  "Cette interface de réinitialisation est strictement réservée aux comptes administrateurs de Kanto MG.",
              },
            });
            return;
          }
        } catch (dbErr) {
          this.logger.warn(`⚠️ [Auth Security] Erreur vérification rôle sur forget-password :`, dbErr);
        }
      }

      return next();
    }

    // ─── 2. INTERCEPTION DE LA VALIDATION DU MOT DE PASSE (RESET-PASSWORD) ─────
    const token = (req.body?.token || req.query?.token) as string | undefined;
    if (!token || typeof token !== 'string') {
      return next();
    }

    try {
      // Récupération du contexte de sécurité associé au jeton
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
