import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import {
  extractHost,
  isAuthDomain,
  isAppDomain,
  isAuthPath,
  isPublicPagePath,
  sanitizeRedirectUrl,
  DEFAULT_AUTH_BASE_URL,
  DEFAULT_APP_BASE_URL,
} from './domain-routing.util.js';

/**
 * Middleware de séparation stricte des responsabilités entre domaines Kanto MG :
 * 1. auth-kanto.gastsar.fr : Réservé EXCLUSIVEMENT à l'authentification (login, tokens, reset-password, confirmation, etc.).
 *    Toute page publique ou institutionnelle demandée sur ce domaine est redirigée vers app-kanto.gastsar.fr.
 * 2. app-kanto.gastsar.fr : Réservé EXCLUSIVEMENT au site web public (CGU, confidentialité, hubs culturels, waitlist bêta, etc.).
 *    Toute fonctionnalité d'authentification demandée sur ce domaine est redirigée vers auth-kanto.gastsar.fr.
 * 3. Sécurité absolue contre les attaques de type Open Redirect lors des redirections inter-domaines.
 */
@Injectable()
export class DomainSeparationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DomainSeparationMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const rawPath = (req.baseUrl || '') + (req.path || req.url.split('?')[0]);
    const path = rawPath.toLowerCase();

    // 1. Ignorer les fichiers statiques, assets, uploads et sondes de santé
    if (
      path.startsWith('/logo.png') ||
      path.startsWith('/images/') ||
      path.startsWith('/favicon.') ||
      path.startsWith('/fonts/') ||
      path.startsWith('/uploads/') ||
      path.startsWith('/health') ||
      path.startsWith('/api/citations') ||
      path.startsWith('/api/items') ||
      path.startsWith('/api/users') ||
      path.startsWith('/api/games')
    ) {
      return next();
    }

    const host = extractHost(req);

    // 2. DOMAINE D'AUTHENTIFICATION : auth-kanto.gastsar.fr
    if (isAuthDomain(host)) {
      // Cas de la racine "/" :
      // - Si des paramètres d'auth sont présents (?error=... ou ?token=...), laisser AppController traiter
      // - Si aucun paramètre : rediriger vers le portail public app-kanto.gastsar.fr/
      if (path === '/' || path === '') {
        const query = req.query || {};
        const hasAuthParams = Boolean(
          query.error || query.token || query.status || query.email,
        );
        if (!hasAuthParams) {
          this.logger.log(
            `🔄 [Domaine Auth] Redirection racine auth-kanto -> ${DEFAULT_APP_BASE_URL}/`,
          );
          res.redirect(302, `${DEFAULT_APP_BASE_URL}/`);
          return;
        }
        return next();
      }

      // Cas des pages publiques ou institutionnelles accédées par erreur sur auth-kanto :
      // Redirection permanente 301 vers app-kanto.gastsar.fr
      if (isPublicPagePath(path)) {
        const queryString = req.originalUrl.includes('?')
          ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
          : '';
        const targetUrl = `${DEFAULT_APP_BASE_URL}${path}${queryString}`;
        const safeUrl = sanitizeRedirectUrl(targetUrl, `${DEFAULT_APP_BASE_URL}/`);

        this.logger.log(
          `🔄 [Domaine Auth] Page publique demandée sur auth-kanto (${path}) -> 301 vers ${safeUrl}`,
        );
        res.redirect(301, safeUrl);
        return;
      }

      // Toutes les fonctionnalités d'authentification restent sur auth-kanto
      return next();
    }

    // 3. DOMAINE PUBLIC : app-kanto.gastsar.fr
    if (isAppDomain(host)) {
      // Cas où un utilisateur accède à une page d'authentification sur app-kanto.gastsar.fr
      // Redirection 302 vers le domaine d'authentification dédié : auth-kanto.gastsar.fr
      if (isAuthPath(path)) {
        const queryString = req.originalUrl.includes('?')
          ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
          : '';
        const targetUrl = `${DEFAULT_AUTH_BASE_URL}${path}${queryString}`;
        const safeUrl = sanitizeRedirectUrl(targetUrl, `${DEFAULT_AUTH_BASE_URL}/`);

        this.logger.log(
          `🔄 [Domaine Public] Fonctionnalité d'auth demandée sur app-kanto (${path}) -> 302 vers ${safeUrl}`,
        );
        res.redirect(302, safeUrl);
        return;
      }

      // Toutes les pages publiques, légales et culturelles restent sur app-kanto
      return next();
    }

    // Autres domaines (API mobile directe, administration, environnement local)
    return next();
  }
}
