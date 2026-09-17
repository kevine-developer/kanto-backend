import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin, bearer } from 'better-auth/plugins';
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

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    'kanto://',
    'kantomg://',
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
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',').map((o) => o.trim())
      : []),
    ...(process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
      : []),
  ],
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600, // 1 heure
    sendResetPassword: async ({ user, url, token }) => {
      console.log(
        `[Better-Auth] 🔑 Demande de réinitialisation de mot de passe pour : ${user.email}`,
      );
      try {
        await resendService.sendPasswordResetEmail({
          to: user.email,
          resetUrl: url,
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
  account: {
    modelName: 'Account',
  },
});

export type Auth = typeof auth;
