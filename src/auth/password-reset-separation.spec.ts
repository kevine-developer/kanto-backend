import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  buildNativeUserPasswordResetEmail,
  buildAdminPasswordResetEmail,
} from '../integrations/resend/templates/templates.js';
import { PasswordResetSecurityMiddleware } from './middlewares/password-reset-security.middleware.js';
import { AppController } from '../app.controller.js';

describe('Séparation stricte de la gestion des mots de passe (Native vs Administration)', () => {
  // ─── 1. Tests des modèles d'e-mails séparés ─────────────────────────────────
  describe("Modèles d'e-mails transactionnels séparés", () => {
    it('1. Email utilisateur natif doit cibler app-kanto.gastsar.fr avec la charte mobile', () => {
      const resetUrl =
        'https://app-kanto.gastsar.fr/reset-password?token=native_token_123';
      const output = buildNativeUserPasswordResetEmail({
        to: 'utilisateur@gmail.com',
        resetUrl,
        userName: 'Soa',
        token: 'native_token_123',
      });

      // Vérification du sujet et du pré-en-tête
      expect(output.subject).toContain('Kanto MG');
      expect(output.text).toContain('application mobile Kanto MG');
      expect(output.html).toContain('Application Kanto MG');

      // Vérification du domaine obligatoire de l'application native
      expect(output.html).toContain('https://app-kanto.gastsar.fr');
      expect(output.text).toContain('https://app-kanto.gastsar.fr');
      expect(output.html).toContain(resetUrl);

      // Vérification des exigences UX & Sécurité
      expect(output.html).toContain('Réinitialiser mon mot de passe');
      expect(output.html).toContain('1 heure');
      expect(output.html).toContain('usage unique');
      expect(output.text).toContain('votre compte demeure protégé');

      // Ne doit jamais faire référence à l'interface d'administration
      expect(output.html).not.toContain('administrateur');
      expect(output.html).not.toContain('admin.kanto.mg');
    });

    it("2. Email administrateur doit cibler le domaine admin avec les règles d'administration", () => {
      const adminUrl =
        'https://admin.kanto.mg/reset-password?token=admin_token_456';
      const output = buildAdminPasswordResetEmail({
        to: 'admin@kanto.mg',
        resetUrl: adminUrl,
        userName: 'Rakoto Admin',
        token: 'admin_token_456',
      });

      // Vérification du sujet et de l'identification claire de l'administration
      expect(output.subject).toContain('administrateur');
      expect(output.html).toContain('Administration Kanto MG');
      expect(output.html).toContain('Accès Administrateur');

      // Vérification de l'URL pointant exclusivement vers l'administration
      expect(output.html).toContain('https://admin.kanto.mg');
      expect(output.html).toContain(adminUrl);
      expect(output.html).toContain(
        'Réinitialiser mon mot de passe administrateur',
      );

      // Vérification de la sécurité renforcée
      expect(output.html).toContain('données sensibles');
      expect(output.html).toContain('usage unique');

      // Ne doit jamais faire référence à l'URL de l'application native
      expect(output.html).not.toContain('https://app-kanto.gastsar.fr');
    });
  });

  // ─── 2. Tests du Middleware d'étanchéité des jetons ────────────────────────
  describe('PasswordResetSecurityMiddleware (Étanchéité des contextes)', () => {
    let middleware: PasswordResetSecurityMiddleware;
    let prismaMock: any;
    let mockReq: any;
    let mockRes: any;
    let nextFn: any;

    beforeEach(() => {
      prismaMock = {
        verification: {
          findFirst: jest.fn(),
        },
      };

      middleware = new PasswordResetSecurityMiddleware(prismaMock);

      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      nextFn = jest.fn();
    });

    it("3. Doit bloquer (403) un jeton émis pour l'application native utilisé sur l'interface admin", async () => {
      // Jeton enregistré pour le contexte natif
      prismaMock.verification.findFirst.mockResolvedValueOnce({
        id: 'v_1',
        identifier: 'reset-password-context:tok_native_abc',
        value: JSON.stringify({
          context: 'native',
          userId: 'usr_1',
          role: 'USER',
        }),
      });

      // Requête provenant du domaine d'administration
      mockReq = {
        method: 'POST',
        body: { token: 'tok_native_abc', newPassword: 'NewPassword123!' },
        headers: {
          origin: 'https://admin.kanto.mg',
          referer: 'https://admin.kanto.mg/reset-password',
        },
      };

      await middleware.use(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'FORBIDDEN_CONTEXT',
            message: expect.stringContaining(
              "Ce lien de réinitialisation est réservé à l'application mobile",
            ),
          }),
        }),
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('4. Doit bloquer (403) un jeton administrateur utilisé sur le parcours mobile natif', async () => {
      // Jeton enregistré pour le contexte administrateur
      prismaMock.verification.findFirst.mockResolvedValueOnce({
        id: 'v_2',
        identifier: 'reset-password-context:tok_admin_xyz',
        value: JSON.stringify({
          context: 'admin',
          userId: 'usr_admin',
          role: 'ADMIN',
        }),
      });

      // Requête provenant de l'application native (ou de app-kanto.gastsar.fr)
      mockReq = {
        method: 'POST',
        body: { token: 'tok_admin_xyz', newPassword: 'AdminSecret123!' },
        headers: {
          origin: 'https://app-kanto.gastsar.fr',
          referer: 'https://app-kanto.gastsar.fr/reset-password',
        },
      };

      await middleware.use(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'FORBIDDEN_CONTEXT',
            message: expect.stringContaining(
              'Ce lien de réinitialisation est réservé aux administrateurs',
            ),
          }),
        }),
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("5. Doit bloquer (403) un rôle non-administrateur qui tente de réinitialiser sur l'admin", async () => {
      prismaMock.verification.findFirst.mockResolvedValueOnce({
        id: 'v_3',
        identifier: 'reset-password-context:tok_user_fake',
        value: JSON.stringify({
          context: 'admin',
          userId: 'usr_fake',
          role: 'USER', // Rôle insuffisant
        }),
      });

      mockReq = {
        method: 'POST',
        body: { token: 'tok_user_fake', newPassword: 'Password123!' },
        headers: {
          origin: 'https://admin.kanto.mg',
        },
      };

      await middleware.use(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'FORBIDDEN_ROLE',
          }),
        }),
      );
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('6. Doit autoriser (next) une réinitialisation native légitime', async () => {
      prismaMock.verification.findFirst.mockResolvedValueOnce({
        id: 'v_4',
        identifier: 'reset-password-context:tok_native_valid',
        value: JSON.stringify({
          context: 'native',
          userId: 'usr_regular',
          role: 'USER',
        }),
      });

      mockReq = {
        method: 'POST',
        body: { token: 'tok_native_valid', newPassword: 'ValidUserPass123!' },
        headers: {
          origin: 'https://app-kanto.gastsar.fr',
          'x-client-context': 'native',
        },
      };

      await middleware.use(mockReq, mockRes, nextFn);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
    });

    it('7. Doit autoriser (next) une réinitialisation administrateur légitime', async () => {
      prismaMock.verification.findFirst.mockResolvedValueOnce({
        id: 'v_5',
        identifier: 'reset-password-context:tok_admin_valid',
        value: JSON.stringify({
          context: 'admin',
          userId: 'usr_admin_real',
          role: 'ADMIN',
        }),
      });

      mockReq = {
        method: 'POST',
        body: { token: 'tok_admin_valid', newPassword: 'SuperAdminPass123!' },
        headers: {
          origin: 'https://admin.kanto.mg',
          'x-client-context': 'admin',
        },
      };

      await middleware.use(mockReq, mockRes, nextFn);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
    });
  });

  // ─── 3. Tests du routage AppController sur /reset-password ────────────────
  describe('AppController.handleResetPasswordRedirect', () => {
    let appController: AppController;
    let mockRes: any;

    beforeEach(() => {
      appController = new AppController(
        null as any,
        null as any,
        null as any,
        null as any,
      );
      mockRes = {
        redirect: jest.fn(),
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    });

    it("8. Sur domaine admin, doit rediriger vers l'interface d'administration", () => {
      const mockReq = {
        headers: {
          host: 'admin.kanto.mg',
        },
      };

      appController.handleResetPasswordRedirect(
        'admin_token_test',
        '',
        mockRes,
        mockReq as any,
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('admin'),
      );
      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        expect.stringContaining('token=admin_token_test'),
      );
    });

    it("9. Sur app-kanto.gastsar.fr, doit servir la page web native sans rediriger vers l'admin", () => {
      const mockReq = {
        headers: {
          host: 'app-kanto.gastsar.fr',
        },
      };

      appController.handleResetPasswordRedirect(
        'native_token_test',
        '',
        mockRes,
        mockReq as any,
      );

      // Ne doit JAMAIS rediriger
      expect(mockRes.redirect).not.toHaveBeenCalled();

      // Doit servir la page HTML native avec deep link et solution de secours
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/html; charset=utf-8',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining(
          'kantomg://reset-password?token=native_token_test',
        ),
      );
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining('Nouveau mot de passe'),
      );
    });

    it("10. Doit respecter prioritairement ADMIN_FRONTEND_URL lorsqu'elle est configurée (ex: https://kanto-admin.vercel.app)", () => {
      process.env.ADMIN_FRONTEND_URL = 'https://kanto-admin.vercel.app';

      const mockReq = {
        headers: {
          host: 'kanto-admin.vercel.app',
        },
      };

      appController.handleResetPasswordRedirect(
        'custom_vercel_tok',
        '',
        mockRes,
        mockReq as any,
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(
        302,
        'https://kanto-admin.vercel.app/reset-password?token=custom_vercel_tok',
      );
    });
  });
});
