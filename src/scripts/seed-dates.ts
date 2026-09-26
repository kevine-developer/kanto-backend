import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { DEFAULT_HISTORY_DATES } from '../history/constants/history-defaults.constant.js';

export async function seedDates() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `[Seed Dates] Synchronisation de ${DEFAULT_HISTORY_DATES.length} dates historiques...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const item of DEFAULT_HISTORY_DATES) {
      const existing = await prisma.historyDate.findUnique({
        where: { id: item.id },
      });

      const preservedImageUrl = existing?.imageUrl || item.imageUrl || null;

      if (existing) {
        await prisma.historyDate.update({
          where: { id: item.id },
          data: {
            year: item.year,
            exactDate: item.exactDate,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            era: item.era,
            summaryFr: item.summaryFr,
            summaryMg: item.summaryMg,
            impactFr: item.impactFr,
            impactMg: item.impactMg,
            accentColor: item.accentColor,
            imageUrl: preservedImageUrl,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        updated++;
      } else {
        await prisma.historyDate.create({
          data: {
            id: item.id,
            year: item.year,
            exactDate: item.exactDate,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            era: item.era,
            summaryFr: item.summaryFr,
            summaryMg: item.summaryMg,
            impactFr: item.impactFr,
            impactMg: item.impactMg,
            accentColor: item.accentColor,
            imageUrl: item.imageUrl || null,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        inserted++;
      }
    }

    console.log(
      `[Seed Dates] Succès : ${inserted} ajoutés, ${updated} mis à jour (images préservées).`,
    );
  } catch (error) {
    console.error('[Seed Dates] Erreur :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1]?.endsWith('seed-dates.ts') ||
  process.argv[1]?.endsWith('seed-dates.js')
) {
  seedDates()
    .then(() => {
      console.log('[Seed Dates] Terminé.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
