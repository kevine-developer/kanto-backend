import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { DEFAULT_BANKNOTES } from '../history/constants/history-defaults.constant.js';

export async function seedBanknotes(force = false) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `[Seed Billets] Début de synchronisation de ${DEFAULT_BANKNOTES.length} billets malgaches...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const item of DEFAULT_BANKNOTES) {
      const existing = await prisma.banknote.findUnique({
        where: { id: item.id },
      });

      // Règle d'or : Ne JAMAIS écraser une image manuellement uploadée par l'administrateur
      const preservedImageUrl = existing?.imageUrl || item.imageUrl || null;
      const preservedImageUrlVerso =
        existing?.imageUrlVerso || item.imageUrlVerso || null;
      const preservedComingSoon =
        existing?.isComingSoon !== undefined
          ? existing.isComingSoon
          : Boolean(item.isComingSoon);

      if (existing) {
        await prisma.banknote.update({
          where: { id: item.id },
          data: {
            valueAriary: item.valueAriary,
            valueFmg: item.valueFmg,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            series: item.series,
            seriesLabelFr: item.seriesLabelFr,
            seriesLabelMg: item.seriesLabelMg,
            period: item.period,
            colorLight: item.colorLight,
            colorDark: item.colorDark,
            obverseDescriptionFr: item.obverseDescriptionFr,
            obverseDescriptionMg: item.obverseDescriptionMg,
            reverseDescriptionFr: item.reverseDescriptionFr,
            reverseDescriptionMg: item.reverseDescriptionMg,
            symbolismFr: item.symbolismFr,
            symbolismMg: item.symbolismMg,
            securityFeaturesFr: item.securityFeaturesFr || [],
            imageUrl: preservedImageUrl,
            imageUrlVerso: preservedImageUrlVerso,
            isComingSoon: preservedComingSoon,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        updated++;
      } else {
        await prisma.banknote.create({
          data: {
            id: item.id,
            valueAriary: item.valueAriary,
            valueFmg: item.valueFmg,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            series: item.series,
            seriesLabelFr: item.seriesLabelFr,
            seriesLabelMg: item.seriesLabelMg,
            period: item.period,
            colorLight: item.colorLight,
            colorDark: item.colorDark,
            obverseDescriptionFr: item.obverseDescriptionFr,
            obverseDescriptionMg: item.obverseDescriptionMg,
            reverseDescriptionFr: item.reverseDescriptionFr,
            reverseDescriptionMg: item.reverseDescriptionMg,
            symbolismFr: item.symbolismFr,
            symbolismMg: item.symbolismMg,
            securityFeaturesFr: item.securityFeaturesFr || [],
            imageUrl: item.imageUrl || null,
            imageUrlVerso: item.imageUrlVerso || null,
            isComingSoon: Boolean(item.isComingSoon),
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
        inserted++;
      }
    }

    console.log(
      `[Seed Billets] Succès : ${inserted} ajoutés, ${updated} mis à jour (images préservées).`,
    );
  } catch (error) {
    console.error('[Seed Billets] Erreur lors de la synchronisation :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1]?.endsWith('seed-banknotes.ts') ||
  process.argv[1]?.endsWith('seed-banknotes.js')
) {
  seedBanknotes()
    .then(() => {
      console.log('[Seed Billets] Terminé.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
