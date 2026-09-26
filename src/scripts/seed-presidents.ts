import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { DEFAULT_PRESIDENTS } from '../history/constants/history-defaults.constant.js';

export async function seedPresidents() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `[Seed Présidents] Début de synchronisation de ${DEFAULT_PRESIDENTS.length} présidents...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const item of DEFAULT_PRESIDENTS) {
      const existing = await prisma.president.findUnique({
        where: { id: item.id },
      });

      // Règle d'or : Ne JAMAIS écraser une image manuellement uploadée
      const preservedImageUrl = existing?.imageUrl || item.imageUrl || null;

      if (existing) {
        await prisma.president.update({
          where: { id: item.id },
          data: {
            name: item.name,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            republic: item.republic,
            republicMg: item.republicMg,
            period: item.period,
            quoteFr: item.quoteFr,
            quoteMg: item.quoteMg,
            bioFr: item.bioFr,
            bioMg: item.bioMg,
            achievementsFr: item.achievementsFr || [],
            achievementsMg: item.achievementsMg || [],
            badgeColor: item.badgeColor,
            imageUrl: preservedImageUrl,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        updated++;
      } else {
        await prisma.president.create({
          data: {
            id: item.id,
            name: item.name,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            republic: item.republic,
            republicMg: item.republicMg,
            period: item.period,
            quoteFr: item.quoteFr,
            quoteMg: item.quoteMg,
            bioFr: item.bioFr,
            bioMg: item.bioMg,
            achievementsFr: item.achievementsFr || [],
            achievementsMg: item.achievementsMg || [],
            badgeColor: item.badgeColor,
            imageUrl: item.imageUrl || null,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        inserted++;
      }
    }

    console.log(
      `[Seed Présidents] Succès : ${inserted} ajoutés, ${updated} mis à jour (images préservées).`,
    );
  } catch (error) {
    console.error('[Seed Présidents] Erreur :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1]?.endsWith('seed-presidents.ts') ||
  process.argv[1]?.endsWith('seed-presidents.js')
) {
  seedPresidents()
    .then(() => {
      console.log('[Seed Présidents] Terminé.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
