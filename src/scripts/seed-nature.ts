import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { DEFAULT_NATURE_EMBLEMS } from '../history/constants/history-defaults.constant.js';

export async function seedNature() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `[Seed Nature] Synchronisation de ${DEFAULT_NATURE_EMBLEMS.length} emblèmes naturels...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const item of DEFAULT_NATURE_EMBLEMS) {
      const existing = await prisma.natureEmblem.findUnique({
        where: { id: item.id },
      });

      const preservedImageUrl = existing?.imageUrl || item.imageUrl || null;

      if (existing) {
        await prisma.natureEmblem.update({
          where: { id: item.id },
          data: {
            nameFr: item.nameFr,
            nameMg: item.nameMg,
            scientificName: item.scientificName,
            type: item.type,
            statusFr: item.statusFr,
            statusMg: item.statusMg,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            culturalRoleFr: item.culturalRoleFr,
            culturalRoleMg: item.culturalRoleMg,
            proverbMg: item.proverbMg,
            proverbFr: item.proverbFr,
            accentColor: item.accentColor,
            imageUrl: preservedImageUrl,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        updated++;
      } else {
        await prisma.natureEmblem.create({
          data: {
            id: item.id,
            nameFr: item.nameFr,
            nameMg: item.nameMg,
            scientificName: item.scientificName,
            type: item.type,
            statusFr: item.statusFr,
            statusMg: item.statusMg,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            culturalRoleFr: item.culturalRoleFr,
            culturalRoleMg: item.culturalRoleMg,
            proverbMg: item.proverbMg,
            proverbFr: item.proverbFr,
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
      `[Seed Nature] Succès : ${inserted} ajoutés, ${updated} mis à jour (images préservées).`,
    );
  } catch (error) {
    console.error('[Seed Nature] Erreur :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1]?.endsWith('seed-nature.ts') ||
  process.argv[1]?.endsWith('seed-nature.js')
) {
  seedNature()
    .then(() => {
      console.log('[Seed Nature] Terminé.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
