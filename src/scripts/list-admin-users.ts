import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- DIAGNOSTIC DES COMPTES UTILISATEURS ---');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      pushToken: true,
      emailVerified: true,
      banned: true,
      createdAt: true,
      accounts: {
        select: {
          id: true,
          providerId: true,
          password: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Nombre total de comptes : ${users.length}`);
  for (const u of users) {
    const hasPassword = u.accounts.some((a) => !!a.password);
    const providers = u.accounts.map((a) => a.providerId).join(', ') || 'aucun';
    console.log(
      `• [${u.role}] ${u.email} | Nom: ${u.name} | Token: ${u.pushToken || 'AUCUN'} | Vérifié: ${u.emailVerified} | Pwd: ${hasPassword ? 'OUI' : 'NON'} | Providers: ${providers}`,
    );
  }

  console.log('\n--- DERNIÈRES SESSIONS CRÉÉES ---');
  const sessions = await prisma.session.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });
  for (const s of sessions) {
    console.log(
      `• Session de ${s.user.email} (${s.user.role}) | Créée le: ${s.createdAt.toISOString()} | Expire le: ${s.expiresAt.toISOString()}`,
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
