import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin, bearer } from 'better-auth/plugins';
import { adminAc, userAc } from 'better-auth/plugins/admin/access';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import { ResendService } from '../integrations/resend/resend.service.js';

// Instance Resend pour les emails d'authentification
const resendService = new ResendService();

// Instance Prisma dédiée à Better Auth
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isProduction = process.env.NODE_ENV === 'production';

const devOrigins = [
  'exp://',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:8081',
  'http://localhost:*',
  'http://127.0.0.1:*',
  'http://169.254.123.153:3000',
  'http://169.254.123.153:3001',
  'http://169.254.123.153:3002',
  'http://169.254.123.153:8081',
  'http://169.254.*:*',
  'http://169.254.*',
  'http://192.168.*:*',
  'http://192.168.*',
  'http://10.*:*',
  'http://10.*',
  'http://172.*:*',
  'http://172.*',
  'https://kanto-admin.vercel.app',
  'https://*.vercel.app',
];

const prodOrigins = [
  'https://admin.kanto.mg',
  'https://app.kanto.mg',
  'https://kanto.mg',
  'https://api-kanto.gastsar.fr',
  'https://kanto-admin.vercel.app',
  'https://*.vercel.app',
  'https://*.kanto.mg',
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'kanto://',
    'kantomg://',
    ...(isProduction ? prodOrigins : devOrigins),
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',').map((o) => o.trim())
      : []),
    ...(process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : []),
  ],
  rateLimit: {
    enabled: true,
    window: 60, // Fenêtre glissante de 60s
    max: 100, // Protection contre brute force et saturation d'emails
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 heures de validité
    sendVerificationEmail: async ({ user, url, token }) => {
      // 🛡️ SÉCURITÉ & SÉPARATION DES RÔLES :
      // Les comptes administrateurs ne doivent JAMAIS recevoir d'email de confirmation utilisateur.
      // Leur compte est vérifié automatiquement à l'initialisation et ils reçoivent exclusivement
      // l'email de réinitialisation/définition de mot de passe pointant vers l'interface admin.
      const defaultAdminEmail =
        process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase();
      const userEmailNormalized = user.email.trim().toLowerCase();

      if (defaultAdminEmail && userEmailNormalized === defaultAdminEmail) {
        console.log(
          `[Better-Auth] 🛡️ Compte administrateur (${user.email}) : email de confirmation ignoré (l'admin reçoit uniquement le lien de réinitialisation admin).`,
        );
        return;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: userEmailNormalized },
          select: { role: true },
        });
        if (existingUser?.role === 'ADMIN') {
          console.log(
            `[Better-Auth] 🛡️ Rôle ADMIN actif pour (${user.email}) : email de confirmation ignoré (non applicable aux administrateurs).`,
          );
          return;
        }
      } catch (checkErr: unknown) {
        console.warn(
          `[Better-Auth] ⚠️ Vérification du rôle ignorée pour (${user.email}) :`,
          checkErr instanceof Error ? checkErr.message : String(checkErr),
        );
      }

      console.log(
        `[Better-Auth] ✉️ Envoi de l'email de confirmation à : ${user.email}`,
      );
      try {
        const baseUrl =
          process.env.BETTER_AUTH_URL || 'https://api-kanto.gastsar.fr';
        let origin = baseUrl;
        try {
          const parsed = new URL(url);
          origin = parsed.origin;
        } catch {
          origin = baseUrl;
        }

        // Format d'URL de confirmation : https://api-kanto.gastsar.fr/confirmation?token=...
        const confirmationUrl = new URL('/confirmation', origin);
        confirmationUrl.searchParams.set('token', token);
        const verifyUrl = confirmationUrl.toString();

        await resendService.sendVerificationEmail({
          to: user.email,
          verifyUrl,
          token,
          userName: user.name || undefined,
        });
      } catch (err: unknown) {
        console.error(
          `[Better-Auth] ❌ Erreur lors de l'envoi de l'email de confirmation :`,
          err,
        );
      }
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  account: {
    modelName: 'Account',
    accountLinking: {
      // Permet la liaison automatique d'un compte Google à un compte email/mdp existant
      // si l'email correspond — même si l'email local n'est pas encore vérifié.
      // Google garantit lui-même que l'email est vérifié (emailVerified: true).
      enabled: true,
      requireLocalEmailVerified: false,
      // Si la liaison est effectuée, on marque l'email local comme vérifié
      // (cohérent : Google a prouvé que l'utilisateur possède cet email)
      trustedProviders: ['google'],
    },
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600, // 1 heure
    sendResetPassword: async ({ user, token }) => {
      console.log(
        `[Better-Auth] 🔑 Demande de réinitialisation de mot de passe pour : ${user.email}`,
      );
      try {
        const adminFrontendUrl =
          process.env.ADMIN_FRONTEND_URL ||
          process.env.ADMIN_URL ||
          (isProduction
            ? 'https://admin.kanto.mg'
            : 'http://192.168.1.100:3001');
        const resetPasswordUrl = new URL('/reset-password', adminFrontendUrl);
        resetPasswordUrl.searchParams.set('token', token);
        const effectiveResetUrl = resetPasswordUrl.toString();

        await resendService.sendPasswordResetEmail({
          to: user.email,
          resetUrl: effectiveResetUrl,
          token,
          userName: user.name || undefined,
        });
      } catch (err: unknown) {
        console.error(
          `[Better-Auth] ❌ Erreur lors de l'envoi de l'email via Resend :`,
          err,
        );
      }
    },
  },
  plugins: [
    expo(),
    bearer(),
    admin({
      defaultRole: 'USER',
      adminRoles: ['ADMIN', 'admin'],
      roles: {
        ADMIN: adminAc,
        admin: adminAc,
        USER: userAc,
        user: userAc,
      },
    }),
  ],
  user: {
    modelName: 'User',
    additionalFields: {
      tier: {
        type: 'string',
        defaultValue: 'FREE',
        input: false,
      },
      username: {
        type: 'string',
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
    },
  },
  session: {
    modelName: 'Session',
    // Durée de vie d'une session : 7 jours
    expiresIn: 60 * 60 * 24 * 7,
    // Renouvellement automatique si la session est utilisée dans les 24 dernières heures
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip'],
    },
    defaultCookieAttributes: {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction ? true : false,
      partitioned: isProduction ? true : false,
    },
  },
});

export type Auth = typeof auth;
