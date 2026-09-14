import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin, bearer } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

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
    'http://192.168.1.100:3000',
    'http://192.168.1.100:3001',
    'http://192.168.1.100:3002',
    'http://192.168.1.100:8081',
  ],
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600, // 1 heure
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(
        `[Better-Auth] 🔑 Réinitialisation de mot de passe pour : ${user.email}`,
      );
      console.log(`[Better-Auth] 🔗 URL de réinitialisation : ${url}`);
      console.log(`[Better-Auth] 🎟️ Code / Token : ${token}`);
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
