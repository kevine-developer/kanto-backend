import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import {
  DEFAULT_CIVIC_LESSONS,
  DEFAULT_PRESIDENTS,
  DEFAULT_BANKNOTES,
  DEFAULT_PROVINCE_BLASONS,
  DEFAULT_NATURE_EMBLEMS,
  DEFAULT_HISTORY_DATES,
  DEFAULT_NATIONAL_EMBLEMS,
} from '../history/constants/history-defaults.constant.js';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('[Seed History] Variable DATABASE_URL manquante dans .env');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log(
    '[Seed History] Démarrage du peuplement Histoire, Mémoire & Patrimoine...',
  );

  try {
    // 1. Leçons civiques (ExploreList)
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_CIVIC_LESSONS.length} leçons civiques...`,
    );
    for (const item of DEFAULT_CIVIC_LESSONS) {
      const existing = await prisma.civicLesson.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      await prisma.civicLesson.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          category: item.category,
          titleFr: item.titleFr,
          titleMg: item.titleMg,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          imageUrl: preservedImage,
          status: item.status,
          orderIndex: item.orderIndex,
        },
        update: {
          category: item.category,
          titleFr: item.titleFr,
          titleMg: item.titleMg,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          imageUrl: preservedImage,
        },
      });
    }

    // 2. Présidents de la République
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_PRESIDENTS.length} chefs d'État...`,
    );
    for (const item of DEFAULT_PRESIDENTS) {
      const existing = await prisma.president.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      await prisma.president.upsert({
        where: { id: item.id },
        create: {
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
          achievementsFr: item.achievementsFr,
          achievementsMg: item.achievementsMg,
          badgeColor: item.badgeColor,
          imageUrl: preservedImage,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
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
          achievementsFr: item.achievementsFr,
          achievementsMg: item.achievementsMg,
          badgeColor: item.badgeColor,
          imageUrl: preservedImage,
        },
      });
    }

    // 3. Billets de banque
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_BANKNOTES.length} billets de banque...`,
    );
    for (const item of DEFAULT_BANKNOTES) {
      const existing = await prisma.banknote.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;
      const preservedImageVerso =
        existing?.imageUrlVerso || item.imageUrlVerso || null;
      const preservedComingSoon =
        existing?.isComingSoon !== undefined
          ? existing.isComingSoon
          : Boolean(item.isComingSoon);

      await prisma.banknote.upsert({
        where: { id: item.id },
        create: {
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
          securityFeaturesFr: item.securityFeaturesFr,
          imageUrl: preservedImage,
          imageUrlVerso: preservedImageVerso,
          isComingSoon: preservedComingSoon,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
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
          securityFeaturesFr: item.securityFeaturesFr,
          imageUrl: preservedImage,
          imageUrlVerso: preservedImageVerso,
          isComingSoon: preservedComingSoon,
        },
      });
    }

    // 4. Blasons des provinces
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_PROVINCE_BLASONS.length} blasons des provinces...`,
    );
    for (const item of DEFAULT_PROVINCE_BLASONS) {
      const existing = await prisma.provinceBlason.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      await prisma.provinceBlason.upsert({
        where: { id: item.id },
        create: {
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
          keyFactsFr: item.keyFactsFr,
          keyFactsMg: item.keyFactsMg,
          imageUrl: preservedImage,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
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
          keyFactsFr: item.keyFactsFr,
          keyFactsMg: item.keyFactsMg,
          imageUrl: preservedImage,
        },
      });
    }

    // 5. Nature & Emblèmes Vivants
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_NATURE_EMBLEMS.length} emblèmes naturels...`,
    );
    for (const item of DEFAULT_NATURE_EMBLEMS) {
      const existing = await prisma.natureEmblem.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      await prisma.natureEmblem.upsert({
        where: { id: item.id },
        create: {
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
          imageUrl: preservedImage,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
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
          imageUrl: preservedImage,
        },
      });
    }

    // 6. Dates Historiques Clés
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_HISTORY_DATES.length} dates historiques...`,
    );
    for (const item of DEFAULT_HISTORY_DATES) {
      const existing = await prisma.historyDate.findUnique({
        where: { id: item.id },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      await prisma.historyDate.upsert({
        where: { id: item.id },
        create: {
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
          imageUrl: preservedImage,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
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
          imageUrl: preservedImage,
        },
      });
    }

    // 7. Emblèmes & Sceaux d'État
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_NATIONAL_EMBLEMS.length} emblèmes nationaux...`,
    );
    for (const item of DEFAULT_NATIONAL_EMBLEMS) {
      const existing = await prisma.nationalEmblem.findFirst({
        where: { period: item.period },
      });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;

      if (existing) {
        await prisma.nationalEmblem.update({
          where: { id: existing.id },
          data: {
            period: item.period,
            government: item.government,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            notesFr: item.notesFr,
            notesMg: item.notesMg,
            imageUrl: preservedImage,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
      } else {
        await prisma.nationalEmblem.create({
          data: {
            period: item.period,
            government: item.government,
            descriptionFr: item.descriptionFr,
            descriptionMg: item.descriptionMg,
            notesFr: item.notesFr,
            notesMg: item.notesMg,
            imageUrl: item.imageUrl || null,
            orderIndex: item.orderIndex,
            status: item.status,
          },
        });
      }
    }

    const counts = {
      lessons: await prisma.civicLesson.count(),
      presidents: await prisma.president.count(),
      banknotes: await prisma.banknote.count(),
      provinces: await prisma.provinceBlason.count(),
      nature: await prisma.natureEmblem.count(),
      dates: await prisma.historyDate.count(),
      emblems: await prisma.nationalEmblem.count(),
    };

    console.log(
      '[Seed History] Peuple avec succes ! Totaux en base de donnees :',
      counts,
    );
  } catch (error) {
    console.error('[Seed History] Erreur durant la synchronisation :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
