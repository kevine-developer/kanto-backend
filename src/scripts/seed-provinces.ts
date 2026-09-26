import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { DEFAULT_PROVINCE_BLASONS } from '../history/constants/history-defaults.constant.js';

export async function seedProvinces() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `[Seed Provinces] Synchronisation de ${DEFAULT_PROVINCE_BLASONS.length} blasons des provinces...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const item of DEFAULT_PROVINCE_BLASONS) {
      const existing = await prisma.provinceBlason.findUnique({
        where: { id: item.id },
      });

      const preservedImageUrl = existing?.imageUrl || item.imageUrl || null;

      if (existing) {
        await prisma.provinceBlason.update({
          where: { id: item.id },
          data: {
            province: item.province,
            chefLieu: item.chefLieu,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            color: item.color,
            bgLight: item.bgLight,
            borderLight: item.borderLight,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            symbols: item.symbols,
            keyFactsFr: item.keyFactsFr || [],
            keyFactsMg: item.keyFactsMg || [],
            imageUrl: preservedImageUrl,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        updated++;
      } else {
        await prisma.provinceBlason.create({
          data: {
            id: item.id,
            province: item.province,
            chefLieu: item.chefLieu,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            color: item.color,
            bgLight: item.bgLight,
            borderLight: item.borderLight,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            symbols: item.symbols,
            keyFactsFr: item.keyFactsFr || [],
            keyFactsMg: item.keyFactsMg || [],
            imageUrl: item.imageUrl || null,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        inserted++;
      }
    }

    console.log(
      `[Seed Provinces] Succès : ${inserted} ajoutés, ${updated} mis à jour (images préservées).`,
    );
  } catch (error) {
    console.error('[Seed Provinces] Erreur :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1]?.endsWith('seed-provinces.ts') ||
  process.argv[1]?.endsWith('seed-provinces.js')
) {
  seedProvinces()
    .then(() => {
      console.log('[Seed Provinces] Terminé.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
