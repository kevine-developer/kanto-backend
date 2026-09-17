import 'dotenv/config';
import crypto from 'crypto';
import { auth } from '../auth/auth.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Génère un mot de passe temporaire fort (usage interne uniquement, jamais envoyé).
 * Il sera remplacé par l'admin lors de son premier login via le lien de setup.
 */
function generateTemporaryPassword(length = 20): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

// ---------------------------------------------------------------------------
// Setup Prisma (standalone, hors NestJS)
// ---------------------------------------------------------------------------

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Script principal
// ---------------------------------------------------------------------------

async function createDefaultAdmin(): Promise<void> {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;

  if (!adminEmail || adminEmail.trim() === '') {
    console.error(
      '❌ [Admin] DEFAULT_ADMIN_EMAIL manquant dans .env. Abandon.',
    );
    process.exit(1);
  }

  console.log(`🔐 [Admin] Vérification du compte administrateur…`);

  // ─── 1. Skip si un admin existe déjà ────────────────────────────────────
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true },
  });

  if (existingAdmin) {
    console.log(
      `ℹ️  [Admin] Un compte administrateur existe déjà (${existingAdmin.email}). Aucune action.`,
    );
    return;
  }

  // ─── 2. Créer le compte avec un mot de passe temporaire (jamais partagé) ──
  const tempPassword = generateTemporaryPassword();
  const adminName = `Admin Kanto`;

  console.log(`🛠️  [Admin] Création du compte pour : ${adminEmail}`);

  let createdUserId: string;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: tempPassword,
        name: adminName,
      },
    });

    if (!result?.user?.id) {
      throw new Error("Better Auth n'a retourné aucun utilisateur.");
    }

    createdUserId = result.user.id;
  } catch (err: unknown) {
    // Si l'email existe déjà en tant que user normal, on le promeut
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      throw err;
    }

    console.warn(
      `⚠️  [Admin] L'email ${adminEmail} est déjà enregistré en tant qu'utilisateur. Promotion en ADMIN.`,
    );
    createdUserId = existingUser.id;
  }

  // ─── 3. Attribuer le rôle ADMIN ─────────────────────────────────────────
  await prisma.user.update({
    where: { id: createdUserId },
    data: {
      role: 'ADMIN',
      emailVerified: true, // L'admin n'a pas besoin de vérifier son email
    },
  });

  console.log(`✅ [Admin] Rôle ADMIN attribué à ${adminEmail}.`);

  // ─── 4. Générer un lien de setup via Better Auth (forgetPassword) ────────
  //
  //  BONNE PRATIQUE : on n'envoie JAMAIS le mot de passe par email.
  //  On envoie un lien "Définir mon mot de passe" (token one-time, expire dans 1h).
  //  Better Auth appelle automatiquement sendResetPassword → ResendService.
  //
  console.log(`📧 [Admin] Génération du lien de configuration du compte…`);

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: adminEmail,
        redirectTo: `${process.env.ADMIN_URL || 'http://localhost:3001'}/reset-password`,
      },
    });

    console.log(
      `✅ [Admin] Email de configuration envoyé à ${adminEmail} (lien valide 1h).`,
    );
    console.log(
      `   👉 L'admin doit cliquer sur le lien reçu pour définir son mot de passe.`,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [Admin] Erreur lors de l'envoi du lien de setup : ${message}`,
    );
    console.warn(
      `⚠️  Le compte ADMIN a été créé mais l'email n'a pas pu être envoyé.`,
    );
    console.warn(
      `   Relancez le script ou utilisez "Mot de passe oublié" depuis l'interface admin.`,
    );
  }
}

createDefaultAdmin()
  .catch((err: unknown) => {
    console.error('❌ [Admin] Erreur fatale :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
