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
import type { PrismaService } from '../infrastructure/database/prisma.service.js';

// Instance Prisma dédiée à Better Auth
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Instance Resend pour les emails d'authentification avec traçabilité complète
const resendService = new ResendService(prisma as unknown as PrismaService);

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
];

const prodOrigins = [
  'https://admin.kanto.mg',
  'https://app.kanto.mg',
  'https://kanto.mg',
  'https://auth.kanto.mg',
  'https://api-kanto.gastsar.fr',
  'https://auth-kanto.gastsar.fr',
  'https://app-kanto.gastsar.fr',
  'https://*.gastsar.fr',
  'https://kanto-admin.vercel.app',
  'https://*.kanto.mg',
];

export function getConfiguredAdminUrl(): string {
  if (process.env.ADMIN_FRONTEND_URL) {
    return process.env.ADMIN_FRONTEND_URL.replace(/\/+$/, '');
  }
  if (process.env.ADMIN_URL) {
    return process.env.ADMIN_URL.replace(/\/+$/, '');
  }
  return isProduction
    ? 'https://kanto-admin.vercel.app'
    : 'http://localhost:3001';
}

export function getConfiguredNativeUrl(): string {
  if (process.env.NATIVE_APP_URL) {
    return process.env.NATIVE_APP_URL.replace(/\/+$/, '');
  }
  return isProduction
    ? 'https://app-kanto.gastsar.fr'
    : 'http://192.168.1.100:3000';
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'kanto://',
    'kantomg://',
    ...(process.env.ADMIN_FRONTEND_URL ? [process.env.ADMIN_FRONTEND_URL] : []),
    ...(process.env.ADMIN_URL ? [process.env.ADMIN_URL] : []),
    ...(process.env.NATIVE_APP_URL ? [process.env.NATIVE_APP_URL] : []),
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
          process.env.PUBLIC_AUTH_URL ||
          process.env.BETTER_AUTH_URL ||
          'https://api-kanto.gastsar.fr';
        let origin = baseUrl;
        if (!process.env.PUBLIC_AUTH_URL) {
          try {
            const parsed = new URL(url);
            origin = parsed.origin;
          } catch {
            origin = baseUrl;
          }
        }

        // Format d'URL de confirmation : https://auth.kanto.mg/confirmation?token=...
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
    // Indispensable pour l'authentification mobile Expo / React Native :
    // WebBrowser (Chrome Custom Tabs / Safari) ne partage pas les cookies de session avec le fetch natif.
    // L'intégrité du state reste entièrement sécurisée et vérifiée via la table de verification en base de données.
    skipStateCookieCheck: true,
    storeStateStrategy: 'database',
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
    revokeSessionsOnPasswordReset: true, // Invalidation automatique de toutes les sessions actives
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(
        `[Better-Auth] 🔑 Demande de réinitialisation de mot de passe pour : ${user.email}`,
      );
      try {
        // 1. Détection intelligente et vérification stricte du contexte (Admin vs Native)
        // Priorité absolue aux variables d'environnement (ADMIN_FRONTEND_URL, ADMIN_URL, NATIVE_APP_URL)
        const configuredAdminBase = getConfiguredAdminUrl();
        let configuredAdminHost = '';
        try {
          configuredAdminHost = new URL(configuredAdminBase).host.toLowerCase();
        } catch {
          // Format d'URL non standard
        }

        let isTargetingAdmin = false;

        // Analyse de callbackURL dans l'url fournie par Better-Auth
        if (url) {
          try {
            const parsedUrl = new URL(url);
            const callbackParam =
              parsedUrl.searchParams.get('callbackURL') || '';
            if (callbackParam) {
              const decoded = decodeURIComponent(callbackParam).toLowerCase();
              if (
                (configuredAdminHost &&
                  decoded.includes(configuredAdminHost)) ||
                decoded.includes('kanto-admin') ||
                decoded.includes('admin') ||
                decoded.includes(':3001') ||
                decoded.includes('vercel.app')
              ) {
                isTargetingAdmin = true;
              }
            }
          } catch {
            // URL non analysable
          }
        }

        // Analyse des en-têtes HTTP de la requête (origin, referer, x-client-context)
        if (request && typeof (request as any).headers?.get === 'function') {
          const origin = (
            (request as any).headers.get('origin') || ''
          ).toLowerCase();
          const referer = (
            (request as any).headers.get('referer') || ''
          ).toLowerCase();
          const clientContext = (
            (request as any).headers.get('x-client-context') || ''
          ).toLowerCase();

          if (
            clientContext === 'admin' ||
            (configuredAdminHost &&
              (origin.includes(configuredAdminHost) ||
                referer.includes(configuredAdminHost))) ||
            origin.includes('kanto-admin') ||
            origin.includes('admin') ||
            origin.includes(':3001') ||
            referer.includes('kanto-admin') ||
            referer.includes('admin') ||
            referer.includes(':3001')
          ) {
            isTargetingAdmin = true;
          }
        }

        // 2. RÈGLE CRITIQUE DE SÉCURITÉ :
        // Un utilisateur ayant le rôle standard (USER) ne peut JAMAIS réinitialiser dans le contexte admin.
        // Seuls les comptes avec rôle effectif ADMIN peuvent recevoir un lien d'administration.
        const isAdminUser =
          (user as any).role === 'ADMIN' || (user as any).role === 'admin';
        const context: 'admin' | 'native' =
          isTargetingAdmin && isAdminUser ? 'admin' : 'native';

        // 3. Verrouillage du jeton en base pour assurer l'étanchéité stricte des parcours
        try {
          await prisma.verification.create({
            data: {
              identifier: `reset-password-context:${token}`,
              value: JSON.stringify({
                context,
                userId: user.id,
                role: (user as any).role || 'USER',
              }),
              expiresAt: new Date(Date.now() + 3600 * 1000),
            },
          });
        } catch (ctxErr) {
          console.warn(
            `[Better-Auth] ⚠️ Impossible de persister le contexte du jeton :`,
            ctxErr,
          );
        }

        // 4. Génération de l'URL sécurisée et envoi de l'e-mail dédié
        if (context === 'admin') {
          // Parcours Administrateur Kanto MG (priorité absolue à la variable d'environnement)
          const adminFrontendUrl = getConfiguredAdminUrl();
          const resetPasswordUrl = new URL('/reset-password', adminFrontendUrl);
          resetPasswordUrl.searchParams.set('token', token);

          console.log(
            `[Better-Auth] 🛡️ Envoi d'email de réinitialisation administrateur vers ${user.email} (${resetPasswordUrl.origin})`,
          );

          await resendService.sendAdminPasswordResetEmail({
            to: user.email,
            resetUrl: resetPasswordUrl.toString(),
            token,
            userName: user.name || undefined,
          });
        } else {
          // Parcours Application Native Kanto MG (priorité absolue à la variable d'environnement)
          const nativeAppUrl = getConfiguredNativeUrl();
          const resetPasswordUrl = new URL('/reset-password', nativeAppUrl);
          resetPasswordUrl.searchParams.set('token', token);

          console.log(
            `[Better-Auth] 📱 Envoi d'email de réinitialisation natif vers ${user.email} (${resetPasswordUrl.origin})`,
          );

          await resendService.sendNativeUserPasswordResetEmail({
            to: user.email,
            resetUrl: resetPasswordUrl.toString(),
            token,
            userName: user.name || undefined,
          });
        }
      } catch (err: unknown) {
        console.error(
          `[Better-Auth] ❌ Erreur lors de l'envoi de l'email via Resend :`,
          err,
        );
      }
    },
    onPasswordReset: ({ user }): Promise<void> => {
      console.log(
        `[Better-Auth] 🔒 Mot de passe réinitialisé avec succès pour : ${user.email}`,
      );
      return Promise.resolve();
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
      termsAcceptedAt: {
        type: 'date',
        required: false,
        input: true,
      },
      termsVersion: {
        type: 'string',
        required: false,
        defaultValue: '1.0',
        input: true,
      },
    },
    changeEmail: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: (user) =>
          Promise.resolve({
            data: {
              ...user,
              // Photo de profil : null par défaut si aucune image fournie (ex: inscription email/mot de passe).
              // Les clients mobile et admin affichent automatiquement le logo officiel sans générer d'asset Cloudinary.
              image: (user as any).image || null,
              // Preuve d'audit légale : horodatage systématique de l'acceptation des CGU
              termsAcceptedAt: (user as any).termsAcceptedAt || new Date(),
              termsVersion: (user as any).termsVersion || '1.0',
            },
          }),
        after: async (user) => {
          // Si l'utilisateur est déjà vérifié lors de sa création (ex: inscription via Google OAuth),
          // lui faire parvenir l'email de bienvenue de la plateforme
          if ((user as any).emailVerified && (user as any).email) {
            try {
              await resendService.sendWelcomeEmail({
                to: (user as any).email,
                userName: (user as any).name || undefined,
              });
            } catch (err) {
              console.warn(
                `[Better-Auth] ⚠️ Échec envoi email de bienvenue pour ${(user as any).email} :`,
                err,
              );
            }
          }
        },
      },
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
