import { Logger } from '@nestjs/common';
import type { Request } from 'express';

const logger = new Logger('DomainRoutingSecurity');

export const DOMAINS = {
  AUTH: 'auth-kanto.gastsar.fr',
  APP: 'app-kanto.gastsar.fr',
  API: 'api-kanto.gastsar.fr',
  ADMIN: 'admin.kanto.mg',
  ADMIN_VERCEL: 'kanto-admin.vercel.app',
} as const;

export const DEFAULT_AUTH_BASE_URL = 'https://auth-kanto.gastsar.fr';
export const DEFAULT_APP_BASE_URL = 'https://app-kanto.gastsar.fr';
export const DEFAULT_ADMIN_BASE_URL = 'https://admin.kanto.mg';

/**
 * Liste blanche explicite des hôtes autorisés pour les redirections
 */
export const ALLOWED_REDIRECT_HOSTS = new Set<string>([
  'auth-kanto.gastsar.fr',
  'app-kanto.gastsar.fr',
  'api-kanto.gastsar.fr',
  'admin.kanto.mg',
  'app.kanto.mg',
  'auth.kanto.mg',
  'kanto.mg',
  'kanto-admin.vercel.app',
  'localhost',
  '127.0.0.1',
]);

/**
 * Protocoles de deep link autorisés pour l'application mobile
 */
export const ALLOWED_DEEP_LINK_SCHEMES = new Set<string>([
  'kantomg:',
  'kanto:',
  'exp:',
]);

/**
 * Extrait et normalise l'hôte d'une requête HTTP (en tenant compte des proxys inverses)
 */
export function extractHost(req: Request | any): string {
  const forwardedHost = req?.headers?.['x-forwarded-host'];
  const hostHeader =
    (typeof forwardedHost === 'string'
      ? forwardedHost
      : req?.headers?.host) || '';
  const firstHost = hostHeader.split(',')[0].trim().toLowerCase();
  // Enlever le port éventuel (ex: localhost:3000 -> localhost)
  return firstHost.split(':')[0].trim();
}

/**
 * Vérifie si l'hôte correspond au domaine d'authentification exclusive (auth-kanto.gastsar.fr)
 */
export function isAuthDomain(host: string): boolean {
  const h = (host || '').toLowerCase().trim();
  return (
    h === DOMAINS.AUTH ||
    h === 'auth.kanto.mg' ||
    h.startsWith('auth-kanto.') ||
    h.startsWith('auth.')
  );
}

/**
 * Vérifie si l'hôte correspond au domaine public institutionnel (app-kanto.gastsar.fr)
 */
export function isAppDomain(host: string): boolean {
  const h = (host || '').toLowerCase().trim();
  return (
    h === DOMAINS.APP ||
    h === 'app.kanto.mg' ||
    h === 'beta-kanto.gastsar.fr' ||
    h.startsWith('app-kanto.') ||
    h.startsWith('beta-kanto.') ||
    h.startsWith('app.')
  );
}

/**
 * Vérifie si l'hôte ou le referer correspond à l'interface d'administration
 */
export function isAdminDomain(host: string, referer?: string): boolean {
  const h = (host || '').toLowerCase().trim();
  const ref = (referer || '').toLowerCase().trim();
  return (
    h === DOMAINS.ADMIN ||
    h === DOMAINS.ADMIN_VERCEL ||
    h.includes('kanto-admin') ||
    h.startsWith('admin.') ||
    h.includes(':3001') ||
    ref.includes(DOMAINS.ADMIN) ||
    ref.includes(DOMAINS.ADMIN_VERCEL) ||
    ref.includes('kanto-admin') ||
    ref.includes('admin') ||
    ref.includes(':3001')
  );
}

/**
 * Vérifie si le chemin demandé correspond à une fonctionnalité d'authentification
 */
export function isAuthPath(pathname: string): boolean {
  const p = (pathname || '').toLowerCase().split('?')[0].replace(/\/+$/, '');
  const cleanPath = p === '' ? '/' : p;

  return (
    cleanPath === '/reset-password' ||
    cleanPath === '/confirmation' ||
    cleanPath === '/verify-email' ||
    cleanPath === '/email-verified' ||
    cleanPath === '/auth/email-verified' ||
    cleanPath === '/login' ||
    cleanPath === '/register' ||
    cleanPath === '/logout' ||
    cleanPath === '/api/auth' ||
    cleanPath.startsWith('/api/auth/') ||
    cleanPath === '/auth/reset-password'
  );
}

/**
 * Vérifie si le chemin demandé correspond à une page publique ou institutionnelle
 */
export function isPublicPagePath(pathname: string): boolean {
  const p = (pathname || '').toLowerCase().split('?')[0].replace(/\/+$/, '');
  const cleanPath = p === '' ? '/' : p;

  if (
    cleanPath === '/cgu' ||
    cleanPath === '/terms' ||
    cleanPath === '/privacy' ||
    cleanPath === '/confidentialite' ||
    cleanPath === '/mentions-legales' ||
    cleanPath === '/cookies' ||
    cleanPath === '/robots.txt' ||
    cleanPath === '/sitemap.xml' ||
    cleanPath === '/llms.txt'
  ) {
    return true;
  }

  if (
    cleanPath.startsWith('/pages') ||
    cleanPath.startsWith('/beta') ||
    cleanPath.startsWith('/ohabolana') ||
    cleanPath.startsWith('/angano') ||
    cleanPath.startsWith('/kabary') ||
    cleanPath.startsWith('/tononkalo') ||
    cleanPath.startsWith('/raki-teny') ||
    cleanPath.startsWith('/histoire') ||
    cleanPath.startsWith('/feedback')
  ) {
    return true;
  }

  return false;
}

/**
 * Vérifie si un nom d'hôte fait partie de la liste blanche autorisée
 */
export function isSafeRedirectHost(hostname: string): boolean {
  const h = (hostname || '').toLowerCase().trim();

  if (ALLOWED_REDIRECT_HOSTS.has(h)) {
    return true;
  }

  // Sous-domaines autorisés de gastsar.fr ou kanto.mg
  if (h.endsWith('.gastsar.fr') || h === 'gastsar.fr') {
    return true;
  }
  if (h.endsWith('.kanto.mg') || h === 'kanto.mg') {
    return true;
  }

  // Déploiements preview Vercel de l'administration
  if (/^kanto-admin.*\.vercel\.app$/.test(h)) {
    return true;
  }

  // Réseau local et développement
  if (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    /^192\.168\.\d+\.\d+$/.test(h) ||
    /^10\.\d+\.\d+\.\d+$/.test(h) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h) ||
    /^169\.254\.\d+\.\d+$/.test(h)
  ) {
    return true;
  }

  return false;
}

/**
 * Assainit et valide rigoureusement une URL de redirection contre les attaques Open Redirect.
 *
 * Règles de sécurité :
 * 1. Rejette les caractères nuls, sauts de ligne (CRLF) et caractères de contrôle.
 * 2. Rejette les séquences de traversée / barres obliques inversées (\\, \/, /\).
 * 3. Rejette les URLs relatives au protocole (//evil.com).
 * 4. Autorise les chemins relatifs sûrs (/chemin/vers/page).
 * 5. Autorise les schémas d'application mobile approuvés (kantomg://, kanto://).
 * 6. Pour les URLs absolues HTTP(S) :
 *    - Rejette les informations d'authentification utilisateur intégrées (user:pass@host).
 *    - Vérifie que l'hôte est dans la liste blanche stricte.
 *    - Rejette tout schéma non HTTP(S) comme javascript:, data:, etc.
 * 7. En cas de non-conformité, repli automatique sur une URL sûre.
 */
export function sanitizeRedirectUrl(
  targetUrl: string | null | undefined,
  fallbackUrl: string = DEFAULT_APP_BASE_URL,
): string {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return fallbackUrl;
  }

  const trimmed = targetUrl.trim();
  if (!trimmed) {
    return fallbackUrl;
  }

  // 1. Détection des caractères de contrôle, CRLF injection et encodages malveillants
  if (
    /[\r\n\t\0]/.test(trimmed) ||
    /%0[ad0]/i.test(trimmed) ||
    /%250[ad0]/i.test(trimmed)
  ) {
    logger.warn(
      `🛡️ [OpenRedirect] Tentative d'injection CRLF bloquée : "${trimmed}"`,
    );
    return fallbackUrl;
  }

  // 2. Détection des séquences de contournement avec antislash
  if (
    trimmed.includes('\\') ||
    trimmed.startsWith('//') ||
    trimmed.includes('/\\') ||
    trimmed.includes('\\/')
  ) {
    logger.warn(
      `🛡️ [OpenRedirect] Séquence de barre oblique invalide bloquée : "${trimmed}"`,
    );
    return fallbackUrl;
  }

  // 3. Cas des chemins relatifs locaux sûrs (ex: /pages/terms, /reset-password?token=...)
  if (trimmed.startsWith('/')) {
    // Si le 2e caractère est '/' ou '\', déjà intercepté plus haut, mais double sécurité
    if (trimmed.length > 1 && (trimmed[1] === '/' || trimmed[1] === '\\')) {
      return fallbackUrl;
    }
    return trimmed;
  }

  // 4. Cas des deep links mobiles approuvés (ex: kantomg://login?verified=true)
  for (const scheme of ALLOWED_DEEP_LINK_SCHEMES) {
    if (trimmed.toLowerCase().startsWith(scheme)) {
      // Vérifier que le deep link ne contient pas de caractères suspects
      if (!/^[a-zA-Z0-9+.-]+:\/\/[a-zA-Z0-9_.\-~%!$&'()*+,;=:@/?#]+$/.test(trimmed)) {
        return fallbackUrl;
      }
      return trimmed;
    }
  }

  // 5. Cas des URLs absolues
  try {
    const parsed = new URL(trimmed);

    // Vérification du protocole : uniquement https (ou http sur localhost/dev)
    const isLocalhost =
      parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const isDev = process.env.NODE_ENV !== 'production';
    const isAllowedHttp = (isLocalhost || isDev) && parsed.protocol === 'http:';

    if (parsed.protocol !== 'https:' && !isAllowedHttp) {
      logger.warn(
        `🛡️ [OpenRedirect] Protocole non autorisé bloqué : "${parsed.protocol}" dans "${trimmed}"`,
      );
      return fallbackUrl;
    }

    // Protection contre l'attaque userinfo (@ dans l'URL : https://auth-kanto.gastsar.fr@evil.com)
    if (parsed.username || parsed.password) {
      logger.warn(
        `🛡️ [OpenRedirect] Identifiants userinfo détectés et bloqués : "${trimmed}"`,
      );
      return fallbackUrl;
    }

    // Vérification de la liste blanche d'hôtes
    if (!isSafeRedirectHost(parsed.hostname)) {
      logger.warn(
        `🛡️ [OpenRedirect] Hôte non autorisé bloqué : "${parsed.hostname}" dans "${trimmed}"`,
      );
      return fallbackUrl;
    }

    return trimmed;
  } catch {
    logger.warn(
      `🛡️ [OpenRedirect] URL malformée impossible à parser : "${trimmed}"`,
    );
    return fallbackUrl;
  }
}
