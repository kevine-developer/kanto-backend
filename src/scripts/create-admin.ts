import 'dotenv/config';
import { auth } from '../auth/auth.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createDefaultAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@kanto.mg';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminKanto2026!';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Administrateur Kanto';

  console.log(
    `🔐 [Admin] Initialisation du compte administrateur par défaut : ${adminEmail}`,
  );

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true },
  });

  if (existingUser) {
    console.log(`ℹ️ [Admin] L'utilisateur ${adminEmail} existe déjà.`);
    if (existingUser.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'ADMIN' },
      });
      console.log(`✅ [Admin] Rôle mis à jour en ADMIN pour ${adminEmail}`);
    } else {
      console.log(`✅ [Admin] Le compte possède déjà le rôle ADMIN.`);
    }
  } else {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      if (result?.user) {
        await prisma.user.update({
          where: { id: result.user.id },
          data: { role: 'ADMIN' },
        });
        console.log(`🎉 [Admin] Compte administrateur créé avec succès !`);
        console.log(`   👉 Email       : ${adminEmail}`);
        console.log(`   👉 Mot de passe: ${adminPassword}`);
        console.log(`   👉 Rôle        : ADMIN`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ [Admin] Erreur création :`, message);
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

createDefaultAdmin().catch(console.error);
