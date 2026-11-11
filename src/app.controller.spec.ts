import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import vm from 'node:vm';
import { buildFeedbackAdminEmail } from './integrations/resend/templates/index.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

/** Crée un mock minimal de la réponse Express. */
function makeMockRes() {
  const calls: { method: string; args: unknown[] }[] = [];
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    sendFile: jest.fn().mockReturnThis(),
    _calls: calls,
  };
  return res;
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            verification: {
              findFirst: () => Promise.resolve(null),
            },
            user: {
              findUnique: () => Promise.resolve(null),
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root (GET /)', () => {
    it('should return discreet JSON status { status: "ok", service: "kanto-backend" }', () => {
      const mockRes = makeMockRes();
      appController.getHello(undefined, undefined, mockRes as any);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'ok',
        service: 'kanto-backend',
      });
    });

    it('should redirect to /confirmation when error query param is present with res', () => {
      const mockRes = makeMockRes();
      appController.getHello('TOKEN_EXPIRED', 'test@kanto.mg', mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('/confirmation?error=TOKEN_EXPIRED'),
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('email=test%40kanto.mg'),
      );
    });

    it('should serve beta landing page when host is app-kanto.gastsar.fr', () => {
      const mockRes = makeMockRes();
      const mockReq = {
        headers: {
          host: 'app-kanto.gastsar.fr',
        },
      };
      appController.getHello(
        undefined,
        undefined,
        mockRes as any,
        mockReq as any,
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining('<!DOCTYPE html>'),
      );
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining('Bêta-Testeur Kanto'),
      );
    });

    it('should serve beta waitlist script on /beta-waitlist.js', () => {
      const mockRes = makeMockRes();
      appController.getBetaWaitlistScript(mockRes as any);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/javascript; charset=utf-8',
      );
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining('waitlist-form'),
      );
    });
  });

  describe('community reviews client script', () => {
    it('should render community reviews on /beta-waitlist.js without ReferenceError on escapeHtml', async () => {
      const mockRes = makeMockRes();
      appController.getBetaWaitlistScript(mockRes as any);
      const script = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';

      const makeEl = () => ({
        textContent: '',
        innerHTML: '',
        style: { display: '' },
        children: [] as Array<{ innerHTML: string; className: string }>,
        appendChild(child: { innerHTML: string; className: string }) {
          this.children.push(child);
        },
        addEventListener() {},
      });

      const els: Record<string, ReturnType<typeof makeEl>> = {
        'reviews-avg-rating': makeEl(),
        'reviews-avg-stars': makeEl(),
        'reviews-total-count': makeEl(),
        'reviews-cards-list': makeEl(),
        'reviews-pagination-box': makeEl(),
      };

      const fetchMock = jest.fn((url: string) => {
        if (url.includes('/api/reviews/public/stats')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ averageRating: 5, totalReviews: 1 }),
          });
        }
        if (url.includes('/api/reviews/public?')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'rev_rose',
                    rating: 5,
                    comment: 'Parfait en général <script>alert(1)</script>',
                    publicDisplayName: 'Rose',
                    appVersion: '1.0.0',
                    createdAt: '2026-11-11T12:43:03.000Z',
                  },
                ],
                pagination: { totalPages: 1 },
              }),
          });
        }
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        });
      });

      const sandbox: Record<string, unknown> = {
        document: {
          getElementById: (id: string) => els[id] ?? null,
          querySelector: () => null,
          querySelectorAll: () => [],
          createElement: () => ({ className: '', innerHTML: '' }),
          documentElement: {
            getAttribute: () => 'dark',
            setAttribute: () => {},
          },
        },
        window: { location: 'https://app-kanto.gastsar.fr/' },
        localStorage: { getItem: () => null, setItem: () => {} },
        fetch: fetchMock,
        URL,
        URLSearchParams,
        console,
        setTimeout,
      };

      expect(() => vm.runInNewContext(script, sandbox)).not.toThrow();
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(els['reviews-total-count'].textContent).toContain(
        '1 avis certifié',
      );
      expect(els['reviews-cards-list'].children).toHaveLength(1);
      expect(els['reviews-cards-list'].children[0].innerHTML).toContain('Rose');
      expect(els['reviews-cards-list'].children[0].innerHTML).toContain(
        '&lt;script&gt;alert(1)&lt;/script&gt;',
      );
      expect(els['reviews-cards-list'].innerHTML).not.toContain(
        'Impossible de charger les avis',
      );
    });
  });

  describe('feedback admin email template', () => {
    it('should mention Kanto Admin moderation when message comes from [Avis Kanto]', () => {
      const rendered = buildFeedbackAdminEmail({
        type: 'suggestion',
        userName: 'Rose',
        userEmail: 'roliannerose@gmail.com',
        message: '[Note: ⭐⭐⭐⭐⭐ (5/5)] [Avis Kanto]\n\nParfait en général',
      });
      expect(rendered.html).toContain('Avis &amp; Témoignages');
      expect(rendered.html).toContain('PENDING');
      expect(rendered.text).toContain('/reviews');
    });
  });

  describe('email verification routes', () => {
    it('should return email verification page on /email-verified', () => {
      const res = appController.getEmailVerified();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Kanto');
      expect(res).toContain('kantomg://login?verified=true');
    });

    it('should handle error query param on /email-verified', () => {
      const res = appController.getEmailVerified('INVALID_TOKEN');
      expect(res).toContain('Lien invalide ou déjà utilisé');
    });

    it('should handle already_confirmed status on /email-verified', () => {
      const res = appController.getEmailVerified(
        undefined,
        'user@example.com',
        'already_confirmed',
      );
      expect(res).toContain('Adresse email déjà confirmée');
      expect(res).toContain('Compte déjà actif');
    });

    it('should return email verification page on /auth/email-verified', () => {
      const res = appController.getAuthEmailVerified();
      expect(res).toContain('<!DOCTYPE html>');
      expect(res).toContain('Adresse email confirmée');
    });
  });

  describe('/confirmation route', () => {
    it('should send email verification page on /confirmation without token', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        undefined,
        undefined,
        mockRes as any,
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('<!DOCTYPE html>');
      expect(sentHtml).toContain('Kanto');
      expect(sentHtml).toContain('Adresse email confirmée');
    });

    it('should handle error query param on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        'TOKEN_EXPIRED',
        undefined,
        undefined,
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Temps limite dépassé');
      expect(sentHtml).toContain('Lien de confirmation expiré');
    });

    it('should handle status=already_confirmed on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'already_confirmed',
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Adresse email déjà confirmée');
      expect(sentHtml).toContain('Compte déjà actif');
    });

    it('should handle status=expired on /confirmation', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        undefined,
        undefined,
        'user@example.com',
        'expired',
        mockRes as any,
      );
      const sentHtml = (mockRes.send.mock.calls[0]?.[0] as string) ?? '';
      expect(sentHtml).toContain('Temps limite dépassé');
      expect(sentHtml).toContain('Lien de confirmation expiré');
    });

    it('should redirect to Better-Auth verify-email when token is present', async () => {
      const mockRes = makeMockRes();
      await appController.getConfirmation(
        'sample-token-xyz',
        undefined,
        undefined,
        undefined,
        mockRes as any,
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining(
          '/api/auth/verify-email?token=sample-token-xyz',
        ),
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('callbackURL='),
      );
    });
  });

  describe('legal routes redirects', () => {
    it('should redirect /cgu and /terms to /pages/terms with 301', () => {
      const mockRes = makeMockRes();
      appController.handleTermsRedirect(mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(301, '/pages/terms');
    });

    it('should redirect /confidentialite and /privacy to /pages/privacy with 301', () => {
      const mockRes = makeMockRes();
      appController.handlePrivacyRedirect(mockRes as any);
      expect(mockRes.redirect).toHaveBeenCalledWith(301, '/pages/privacy');
    });
  });

  describe('static assets routes', () => {
    it('should serve official logo with cache headers on /logo.png', () => {
      const mockRes = makeMockRes();
      appController.getLogo(mockRes as any);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/png',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        expect.stringContaining('public'),
      );
      expect(mockRes.sendFile).toHaveBeenCalled();
    });

    it('should serve official favicon with cache headers on /favicon.ico', () => {
      const mockRes = makeMockRes();
      appController.getFavicon(mockRes as any);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/x-icon',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        expect.stringContaining('public'),
      );
      expect(mockRes.sendFile).toHaveBeenCalled();
    });

    it('should serve official logo font on /fonts/LazyDog.ttf', () => {
      const mockRes = makeMockRes();
      appController.getLogoFont(mockRes as any);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'font/ttf',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        expect.stringContaining('public'),
      );
      expect(mockRes.sendFile).toHaveBeenCalled();
    });
  });
});
