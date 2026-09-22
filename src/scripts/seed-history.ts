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
    '[Seed History] Demarrage du peuplement Histoire, Memoire & Patrimoine...',
  );

  try {
    // 1. Leçons civiques (ExploreList)
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_CIVIC_LESSONS.length} lecons civiques...`,
    );
    for (const item of DEFAULT_CIVIC_LESSONS) {
      await prisma.civicLesson.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          category: item.category,
          titleFr: item.titleFr,
          titleMg: item.titleMg,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          imageUrl: item.imageUrl,
          status: item.status,
          orderIndex: item.orderIndex,
        },
        update: {
          category: item.category,
          titleFr: item.titleFr,
          titleMg: item.titleMg,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          imageUrl: item.imageUrl,
        },
      });
    }

    // 2. Présidents de la République
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_PRESIDENTS.length} chefs d'Etat...`,
    );
    for (const item of DEFAULT_PRESIDENTS) {
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
          imageUrl: item.imageUrl,
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
          imageUrl: item.imageUrl,
        },
      });
    }

    // 3. Billets de banque
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_BANKNOTES.length} billets de banque...`,
    );
    for (const item of DEFAULT_BANKNOTES) {
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
          imageUrl: item.imageUrl,
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
          imageUrl: item.imageUrl,
        },
      });
    }

    // 4. Blasons des provinces
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_PROVINCE_BLASONS.length} blasons des provinces...`,
    );
    for (const item of DEFAULT_PROVINCE_BLASONS) {
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
          imageUrl: item.imageUrl,
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
          imageUrl: item.imageUrl,
        },
      });
    }

    // 5. Faune & Flore emblématiques
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_NATURE_EMBLEMS.length} emblemes naturels...`,
    );
    for (const item of DEFAULT_NATURE_EMBLEMS) {
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
          imageUrl: item.imageUrl,
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
          imageUrl: item.imageUrl,
        },
      });
    }

    // 6. Grandes dates historiques
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_HISTORY_DATES.length} dates historiques...`,
    );
    for (const item of DEFAULT_HISTORY_DATES) {
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
          imageUrl: item.imageUrl,
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
          imageUrl: item.imageUrl,
        },
      });
    }

    // 7. Sceaux & Emblèmes d'État
    console.log(
      `[Seed History] Synchronisation de ${DEFAULT_NATIONAL_EMBLEMS.length} sceaux republicains...`,
    );
    for (const item of DEFAULT_NATIONAL_EMBLEMS) {
      await prisma.nationalEmblem.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          period: item.period,
          imageUrl: item.imageUrl,
          government: item.government,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          notesFr: item.notesFr,
          notesMg: item.notesMg,
          orderIndex: item.orderIndex,
          status: item.status,
        },
        update: {
          period: item.period,
          imageUrl: item.imageUrl,
          government: item.government,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          notesFr: item.notesFr,
          notesMg: item.notesMg,
        },
      });
    }

    const counts = {
      civicLessons: await prisma.civicLesson.count(),
      presidents: await prisma.president.count(),
      banknotes: await prisma.banknote.count(),
      provinceBlasons: await prisma.provinceBlason.count(),
      natureEmblems: await prisma.natureEmblem.count(),
      historyDates: await prisma.historyDate.count(),
      nationalEmblems: await prisma.nationalEmblem.count(),
    };

    console.log('[Seed History] Synchronisation terminee avec succes.');
    console.table(counts);
  } catch (err) {
    console.error(
      '[Seed History] Erreur lors du seed Histoire & Patrimoine :',
      err,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
