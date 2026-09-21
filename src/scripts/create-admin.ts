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
  const adminEmail = (
    process.env.DEFAULT_ADMIN_EMAIL || 'yvesnarsonkevine@gmail.com'
  ).trim();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

  console.log(
    `🔐 [Admin] Vérification du compte administrateur pour : ${adminEmail}...`,
  );

  // ─── 1. Vérifier si l'utilisateur existe déjà ───────────────────────────
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, email: true, role: true },
  });

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      console.log(
        `ℹ️  [Admin] Le compte administrateur (${existingUser.email}) existe déjà et possède les droits ADMIN.`,
      );
      return;
    }

    console.log(
      `🆙 [Admin] L'utilisateur ${adminEmail} existe déjà mais avec le rôle ${existingUser.role}. Promotion en ADMIN...`,
    );
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: 'ADMIN',
        emailVerified: true,
      },
    });
    console.log(`✅ [Admin] Rôle ADMIN attribué avec succès à ${adminEmail}.`);
    return;
  }

  // ─── 2. Création du compte administrateur ─────────────────────────────────
  const finalPassword = adminPassword || generateTemporaryPassword();
  const adminName = 'Admin Kanto';

  console.log(
    `🛠️  [Admin] Création du compte administrateur pour : ${adminEmail}`,
  );

  let createdUserId: string;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: finalPassword,
        name: adminName,
      },
    });

    if (!result?.user?.id) {
      throw new Error("Better Auth n'a retourné aucun utilisateur.");
    }

    createdUserId = result.user.id;
  } catch (err: unknown) {
    // Vérification de secours au cas où une concurrence aurait créé le compte
    const concurrentUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!concurrentUser) {
      throw err;
    }

    createdUserId = concurrentUser.id;
  }

  // ─── 3. Attribuer le rôle ADMIN et marquer l'email comme vérifié ─────────
  await prisma.user.update({
    where: { id: createdUserId },
    data: {
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log(
    `✅ [Admin] Compte administrateur créé et configuré avec succès pour ${adminEmail}.`,
  );

  // ─── 4. Gestion de l'accès / mot de passe ────────────────────────────────
  if (adminPassword) {
    console.log(
      `🔑 [Admin] Le compte est accessible avec le mot de passe spécifié dans DEFAULT_ADMIN_PASSWORD.`,
    );
  } else {
    // Si aucun mot de passe n'était fourni, envoyer un lien de réinitialisation
    console.log(
      `📧 [Admin] Aucun DEFAULT_ADMIN_PASSWORD spécifié. Envoi d'un lien de configuration...`,
    );
    try {
      await auth.api.requestPasswordReset({
        body: {
          email: adminEmail,
          // ADMIN_FRONTEND_URL doit pointer vers le frontend admin (ex: https://admin.kanto.mg)
          // et NON vers l'API. Fallback sur ADMIN_URL pour compatibilité rétrograde.
          redirectTo: `${process.env.ADMIN_FRONTEND_URL || process.env.ADMIN_URL || 'http://localhost:3001'}/reset-password`,
        },
      });

      console.log(
        `✅ [Admin] Email de configuration envoyé à ${adminEmail} (lien valide 1h).`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(
        `⚠️  [Admin] Impossible d'envoyer l'email de setup (${message}). Vous pourrez définir le mot de passe via l'interface ou DEFAULT_ADMIN_PASSWORD.`,
      );
    }
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
