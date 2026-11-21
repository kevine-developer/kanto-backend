import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DomainSeparationMiddleware } from './domain-separation.middleware.js';
import {
  DEFAULT_AUTH_BASE_URL,
  DEFAULT_APP_BASE_URL,
} from './domain-routing.util.js';

describe('DomainSeparationMiddleware — Séparation stricte auth-kanto vs app-kanto', () => {
  let middleware: DomainSeparationMiddleware;
  let mockRes: any;
  let nextFn: any;

  beforeEach(() => {
    middleware = new DomainSeparationMiddleware();
    mockRes = {
      redirect: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    nextFn = jest.fn();
  });

  // ─── 1. Comportement sur auth-kanto.gastsar.fr ─────────────────────────────
  describe('Sur le domaine d authentification exclusive (auth-kanto.gastsar.fr)', () => {
    const authHeaders = { host: 'auth-kanto.gastsar.fr' };

    it('1.1. Doit rediriger (302) la racine "/" sans paramètre vers app-kanto.gastsar.fr/', () => {
      const mockReq = {
        headers: authHeaders,
        path: '/',
        url: '/',
        originalUrl: '/',
        query: {},
      };

      middleware.use(mockReq as any, mockRes, nextFn);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        `${DEFAULT_APP_BASE_URL}/`,
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('1.2. Doit laisser passer la racine "/" si des paramètres d auth sont présents (ex: error)', () => {
      const mockReq = {
        headers: authHeaders,
        path: '/',
        url: '/?error=TOKEN_EXPIRED&email=user%40kanto.mg',
        originalUrl: '/?error=TOKEN_EXPIRED&email=user%40kanto.mg',
        query: { error: 'TOKEN_EXPIRED', email: 'user@kanto.mg' },
      };

      middleware.use(mockReq as any, mockRes, nextFn);

      expect(mockRes.redirect).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
    });

    it('1.3. Doit rediriger en 301 Permanent les pages légales et CGU vers app-kanto', () => {
      const paths = ['/cgu', '/terms', '/privacy', '/confidentialite', '/pages/terms', '/pages/privacy'];

      for (const p of paths) {
        jest.clearAllMocks();
        const mockReq = {
          headers: authHeaders,
          path: p,
          url: p,
          originalUrl: p,
          query: {},
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).toHaveBeenCalledWith(
          301,
          `${DEFAULT_APP_BASE_URL}${p}`,
        );
        expect(nextFn).not.toHaveBeenCalled();
      }
    });

    it('1.4. Doit rediriger en 301 Permanent les hubs culturels et le centre d aide vers app-kanto', () => {
      const paths = ['/ohabolana', '/angano', '/kabary', '/tononkalo', '/raki-teny', '/histoire', '/pages/help'];

      for (const p of paths) {
        jest.clearAllMocks();
        const mockReq = {
          headers: authHeaders,
          path: p,
          url: p,
          originalUrl: p,
          query: {},
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).toHaveBeenCalledWith(
          301,
          `${DEFAULT_APP_BASE_URL}${p}`,
        );
        expect(nextFn).not.toHaveBeenCalled();
      }
    });

    it('1.5. Doit laisser passer les routes d authentification légitimes sur auth-kanto', () => {
      const authRoutes = [
        '/reset-password',
        '/confirmation',
        '/verify-email',
        '/email-verified',
        '/api/auth/sign-in',
      ];

      for (const p of authRoutes) {
        jest.clearAllMocks();
        const mockReq = {
          headers: authHeaders,
          path: p,
          url: p,
          originalUrl: p,
          query: {},
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
      }
    });
  });

  // ─── 2. Comportement sur app-kanto.gastsar.fr ──────────────────────────────
  describe('Sur le site web public (app-kanto.gastsar.fr)', () => {
    const appHeaders = { host: 'app-kanto.gastsar.fr' };

    it('2.1. Doit laisser passer les pages publiques, légales et hubs culturels', () => {
      const publicPaths = ['/', '/cgu', '/terms', '/privacy', '/pages/help', '/ohabolana', '/beta-waitlist.js'];

      for (const p of publicPaths) {
        jest.clearAllMocks();
        const mockReq = {
          headers: appHeaders,
          path: p,
          url: p,
          originalUrl: p,
          query: {},
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
      }
    });

    it('2.2. Doit rediriger (302) les routes d authentification vers auth-kanto.gastsar.fr', () => {
      const authRoutes = [
        { path: '/reset-password', query: '?token=tok123' },
        { path: '/confirmation', query: '?token=conf456' },
        { path: '/verify-email', query: '?token=verif789' },
        { path: '/email-verified', query: '?status=success' },
      ];

      for (const route of authRoutes) {
        jest.clearAllMocks();
        const fullUrl = `${route.path}${route.query}`;
        const mockReq = {
          headers: appHeaders,
          path: route.path,
          url: fullUrl,
          originalUrl: fullUrl,
          query: { token: 'tok123' },
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).toHaveBeenCalledWith(
          302,
          `${DEFAULT_AUTH_BASE_URL}${fullUrl}`,
        );
        expect(nextFn).not.toHaveBeenCalled();
      }
    });
  });

  // ─── 3. Fichiers statiques et autres domaines ──────────────────────────────
  describe('Fichiers statiques, health check et domaines tiers', () => {
    it('3.1. Ne doit jamais rediriger les assets publics statiques ou le health check', () => {
      const staticPaths = ['/logo.png', '/favicon.ico', '/fonts/LazyDog.ttf', '/health', '/uploads/audio.mp3'];

      for (const p of staticPaths) {
        jest.clearAllMocks();
        const mockReq = {
          headers: { host: 'auth-kanto.gastsar.fr' },
          path: p,
          url: p,
          originalUrl: p,
          query: {},
        };

        middleware.use(mockReq as any, mockRes, nextFn);

        expect(mockRes.redirect).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
      }
    });

    it('3.2. Ne doit pas interférer avec les requêtes sur api-kanto.gastsar.fr ou localhost', () => {
      const mockReq = {
        headers: { host: 'api-kanto.gastsar.fr' },
        path: '/api/citations',
        url: '/api/citations',
        originalUrl: '/api/citations',
        query: {},
      };

      middleware.use(mockReq as any, mockRes, nextFn);

      expect(mockRes.redirect).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
    });
  });
});
