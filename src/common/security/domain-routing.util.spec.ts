import { describe, it, expect } from '@jest/globals';
import {
  extractHost,
  isAuthDomain,
  isAppDomain,
  isAdminDomain,
  isAuthPath,
  isPublicPagePath,
  isSafeRedirectHost,
  sanitizeRedirectUrl,
  DEFAULT_APP_BASE_URL,
  DEFAULT_AUTH_BASE_URL,
} from './domain-routing.util.js';

describe('domain-routing.util — Sécurité et routage des domaines', () => {
  describe('extractHost', () => {
    it('doit extraire l hôte depuis les en-têtes standard', () => {
      expect(extractHost({ headers: { host: 'app-kanto.gastsar.fr' } })).toBe(
        'app-kanto.gastsar.fr',
      );
    });

    it('doit prioriser x-forwarded-host et enlever les ports', () => {
      expect(
        extractHost({
          headers: {
            'x-forwarded-host': 'auth-kanto.gastsar.fr:443, proxy.internal:8080',
            host: 'internal.local',
          },
        }),
      ).toBe('auth-kanto.gastsar.fr');
    });

    it('doit gérer les valeurs vides proprement', () => {
      expect(extractHost({})).toBe('');
      expect(extractHost(null)).toBe('');
    });
  });

  describe('isAuthDomain', () => {
    it('doit reconnaître auth-kanto.gastsar.fr et ses variantes', () => {
      expect(isAuthDomain('auth-kanto.gastsar.fr')).toBe(true);
      expect(isAuthDomain('AUTH-KANTO.GASTSAR.FR')).toBe(true);
      expect(isAuthDomain('auth.kanto.mg')).toBe(true);
    });

    it('doit rejeter les domaines non auth', () => {
      expect(isAuthDomain('app-kanto.gastsar.fr')).toBe(false);
      expect(isAuthDomain('api-kanto.gastsar.fr')).toBe(false);
      expect(isAuthDomain('admin.kanto.mg')).toBe(false);
      expect(isAuthDomain('evil.com')).toBe(false);
    });
  });

  describe('isAppDomain', () => {
    it('doit reconnaître app-kanto.gastsar.fr et ses variantes', () => {
      expect(isAppDomain('app-kanto.gastsar.fr')).toBe(true);
      expect(isAppDomain('APP-KANTO.GASTSAR.FR')).toBe(true);
      expect(isAppDomain('app.kanto.mg')).toBe(true);
      expect(isAppDomain('beta-kanto.gastsar.fr')).toBe(true);
    });

    it('doit rejeter les domaines non app', () => {
      expect(isAppDomain('auth-kanto.gastsar.fr')).toBe(false);
      expect(isAppDomain('admin.kanto.mg')).toBe(false);
      expect(isAppDomain('evil.com')).toBe(false);
    });
  });

  describe('isAdminDomain', () => {
    it('doit reconnaître les domaines admin', () => {
      expect(isAdminDomain('admin.kanto.mg')).toBe(true);
      expect(isAdminDomain('kanto-admin.vercel.app')).toBe(true);
      expect(isAdminDomain('localhost:3001')).toBe(true);
      expect(isAdminDomain('api-kanto.gastsar.fr', 'https://admin.kanto.mg')).toBe(
        true,
      );
    });

    it('doit rejeter les domaines publics natifs', () => {
      expect(isAdminDomain('app-kanto.gastsar.fr')).toBe(false);
      expect(isAdminDomain('auth-kanto.gastsar.fr')).toBe(false);
    });
  });

  describe('isAuthPath & isPublicPagePath', () => {
    it('doit identifier les chemins d authentification', () => {
      expect(isAuthPath('/reset-password')).toBe(true);
      expect(isAuthPath('/confirmation')).toBe(true);
      expect(isAuthPath('/verify-email')).toBe(true);
      expect(isAuthPath('/email-verified')).toBe(true);
      expect(isAuthPath('/api/auth/verify-email')).toBe(true);
      expect(isAuthPath('/login')).toBe(true);

      expect(isAuthPath('/pages/terms')).toBe(false);
      expect(isAuthPath('/ohabolana')).toBe(false);
    });

    it('doit identifier les chemins de pages publiques', () => {
      expect(isPublicPagePath('/cgu')).toBe(true);
      expect(isPublicPagePath('/terms')).toBe(true);
      expect(isPublicPagePath('/privacy')).toBe(true);
      expect(isPublicPagePath('/confidentialite')).toBe(true);
      expect(isPublicPagePath('/pages/help')).toBe(true);
      expect(isPublicPagePath('/pages/about')).toBe(true);
      expect(isPublicPagePath('/beta-waitlist.js')).toBe(true);
      expect(isPublicPagePath('/ohabolana')).toBe(true);
      expect(isPublicPagePath('/angano/ravahiny')).toBe(true);

      expect(isPublicPagePath('/reset-password')).toBe(false);
      expect(isPublicPagePath('/confirmation')).toBe(false);
    });
  });

  describe('isSafeRedirectHost', () => {
    it('doit autoriser les domaines de la whitelist Kanto', () => {
      expect(isSafeRedirectHost('auth-kanto.gastsar.fr')).toBe(true);
      expect(isSafeRedirectHost('app-kanto.gastsar.fr')).toBe(true);
      expect(isSafeRedirectHost('api-kanto.gastsar.fr')).toBe(true);
      expect(isSafeRedirectHost('admin.kanto.mg')).toBe(true);
      expect(isSafeRedirectHost('sub.kanto.mg')).toBe(true);
      expect(isSafeRedirectHost('kanto-admin-pr-12.vercel.app')).toBe(true);
      expect(isSafeRedirectHost('localhost')).toBe(true);
    });

    it('doit bloquer les domaines non autorisés ou malveillants', () => {
      expect(isSafeRedirectHost('evil.com')).toBe(false);
      expect(isSafeRedirectHost('auth-kanto.gastsar.fr.evil.com')).toBe(false);
      expect(isSafeRedirectHost('notgastsar.fr')).toBe(false);
      expect(isSafeRedirectHost('kanto.mg.attacker.org')).toBe(false);
    });
  });

  describe('sanitizeRedirectUrl — Protection Open Redirect', () => {
    const fallback = 'https://app-kanto.gastsar.fr/';

    it('doit autoriser les chemins relatifs locaux légitimes', () => {
      expect(sanitizeRedirectUrl('/pages/terms', fallback)).toBe('/pages/terms');
      expect(
        sanitizeRedirectUrl('/reset-password?token=safe_token', fallback),
      ).toBe('/reset-password?token=safe_token');
    });

    it('doit autoriser les deep links autorisés', () => {
      expect(
        sanitizeRedirectUrl('kantomg://login?verified=true', fallback),
      ).toBe('kantomg://login?verified=true');
      expect(
        sanitizeRedirectUrl('kanto://reset-password?token=xyz', fallback),
      ).toBe('kanto://reset-password?token=xyz');
    });

    it('doit autoriser les URLs absolues sûres de la whitelist', () => {
      expect(
        sanitizeRedirectUrl(
          'https://auth-kanto.gastsar.fr/confirmation?status=success',
          fallback,
        ),
      ).toBe('https://auth-kanto.gastsar.fr/confirmation?status=success');

      expect(
        sanitizeRedirectUrl('https://app-kanto.gastsar.fr/pages/privacy', fallback),
      ).toBe('https://app-kanto.gastsar.fr/pages/privacy');
    });

    it('doit bloquer les URLs absolues vers des domaines non autorisés', () => {
      expect(sanitizeRedirectUrl('https://evil.com/phishing', fallback)).toBe(
        fallback,
      );
      expect(
        sanitizeRedirectUrl(
          'https://attacker.com/steal-token?token=123',
          fallback,
        ),
      ).toBe(fallback);
    });

    it('doit bloquer les attaques par URL relative au protocole (//evil.com)', () => {
      expect(sanitizeRedirectUrl('//evil.com', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('//evil.com/path', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('///evil.com', fallback)).toBe(fallback);
    });

    it('doit bloquer les attaques par barre oblique inversée (/\\evil.com, \\\\evil.com)', () => {
      expect(sanitizeRedirectUrl('/\\evil.com', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('\\/evil.com', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('\\\\evil.com', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('/pages\\test', fallback)).toBe(fallback);
    });

    it('doit bloquer les attaques userinfo (@ dans l URL)', () => {
      expect(
        sanitizeRedirectUrl('https://auth-kanto.gastsar.fr@evil.com', fallback),
      ).toBe(fallback);
      expect(
        sanitizeRedirectUrl(
          'https://app-kanto.gastsar.fr:pass@attacker.org',
          fallback,
        ),
      ).toBe(fallback);
    });

    it('doit bloquer les attaques par injection CRLF (%0d%0a, \\r\\n)', () => {
      expect(
        sanitizeRedirectUrl('https://app-kanto.gastsar.fr\r\nSet-Cookie:bad=1', fallback),
      ).toBe(fallback);
      expect(
        sanitizeRedirectUrl(
          'https://app-kanto.gastsar.fr%0d%0aLocation:http://evil.com',
          fallback,
        ),
      ).toBe(fallback);
    });

    it('doit bloquer les protocoles dangereux (javascript:, data:, file:)', () => {
      expect(sanitizeRedirectUrl('javascript:alert(1)', fallback)).toBe(fallback);
      expect(sanitizeRedirectUrl('data:text/html,<script>alert(1)</script>', fallback)).toBe(
        fallback,
      );
      expect(sanitizeRedirectUrl('file:///etc/passwd', fallback)).toBe(fallback);
    });

    it('doit retourner le fallback par défaut si targetUrl est vide ou nul', () => {
      expect(sanitizeRedirectUrl(null)).toBe(DEFAULT_APP_BASE_URL);
      expect(sanitizeRedirectUrl(undefined)).toBe(DEFAULT_APP_BASE_URL);
      expect(sanitizeRedirectUrl('')).toBe(DEFAULT_APP_BASE_URL);
      expect(sanitizeRedirectUrl('   ')).toBe(DEFAULT_APP_BASE_URL);
    });
  });
});
