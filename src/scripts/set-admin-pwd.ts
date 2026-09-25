import 'dotenv/config';
import { hashPassword } from 'better-auth/crypto';
import { auth } from '../auth/auth.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function resetAdminPassword() {
  const adminEmail = (
    process.env.DEFAULT_ADMIN_EMAIL || 'yvesnarsonkevine@gmail.com'
  ).trim();
  const newPassword =
    process.env.DEFAULT_ADMIN_PASSWORD?.trim() || 'AdminKanto2026!';

  console.log(`Recherche de l'administrateur : ${adminEmail}...`);
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true },
  });

  if (!admin) {
    throw new Error(`Utilisateur ${adminEmail} introuvable !`);
  }

  console.log(`Utilisateur trouvé : ID=${admin.id}, Rôle=${admin.role}`);

  // 1. Hachage du mot de passe avec l'algorithme natif de Better Auth
  const hashedPassword = await hashPassword(newPassword);
  console.log('Mot de passe haché avec succès.');

  // 2. Mise à jour ou création du compte credential
  const credentialAccount = admin.accounts.find(
    (a) => a.providerId === 'credential',
  );
  if (credentialAccount) {
    await prisma.account.update({
      where: { id: credentialAccount.id },
      data: { password: hashedPassword },
    });
    console.log(
      `Compte credential existant (${credentialAccount.id}) mis à jour.`,
    );
  } else {
    await prisma.account.create({
      data: {
        userId: admin.id,
        providerId: 'credential',
        accountId: admin.email,
        password: hashedPassword,
      },
    });
    console.log(`Nouveau compte credential créé.`);
  }

  // 3. Rôle ADMIN et emailVerified garantis
  await prisma.user.update({
    where: { id: admin.id },
    data: {
      role: 'ADMIN',
      emailVerified: true,
      banned: false,
    },
  });

  // 4. Test d'authentification réel via Better-Auth
  console.log('Test de connexion en cours avec Better-Auth...');
  try {
    const signInRes = await auth.api.signInEmail({
      body: {
        email: adminEmail,
        password: newPassword,
      },
    });
    console.log(
      '✅ TEST DE CONNEXION RÉUSSI ! Token session généré :',
      Boolean(signInRes?.token),
    );
  } catch (authErr: unknown) {
    console.warn(
      '⚠️ Avertissement test signIn:',
      authErr instanceof Error ? authErr.message : authErr,
    );
  }

  console.log(`\n======================================================`);
  console.log(`🎉 IDENTIFIANTS ADMINISTRATEUR CONFIGURÉS AVEC SUCCÈS :`);
  console.log(`📧 Email    : ${adminEmail}`);
  console.log(`🔑 Password : ${newPassword}`);
  console.log(`🛡️ Rôle     : ADMIN`);
  console.log(`======================================================\n`);
}

resetAdminPassword()
  .catch((err) => console.error('Erreur fatale :', err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
