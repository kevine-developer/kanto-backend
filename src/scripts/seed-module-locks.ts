import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { INITIAL_MODULES } from '../locks/constants/initial-modules.constant.js';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    for (const item of INITIAL_MODULES) {
      await prisma.moduleLock.upsert({
        where: { key: item.key },
        create: {
          key: item.key,
          type: item.type,
          nameFr: item.nameFr,
          nameMg: item.nameMg,
          isLocked: item.isLocked,
          lockReason: item.lockReason,
          minTier: item.minTier || 'FREE',
        },
        update: {
          nameFr: item.nameFr,
          nameMg: item.nameMg,
        },
      });
    }
    const count = await prisma.moduleLock.count();
    console.log(
      `✅ ${count} modules synchronisés avec succès dans PostgreSQL !`,
    );
  } catch (err) {
    console.error('❌ Erreur de synchronisation des modules :', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
