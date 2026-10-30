import 'dotenv/config';
import {
  PrismaClient,
  CivicSubCategory,
} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VINTANA_SIGNS } from './seed-data/vintana.data.js';
import {
  DEFAULT_CIVIC_LESSONS,
  DEFAULT_PRESIDENTS,
  DEFAULT_BANKNOTES,
  DEFAULT_PROVINCE_BLASONS,
  DEFAULT_NATURE_EMBLEMS,
  DEFAULT_HISTORY_DATES,
  DEFAULT_NATIONAL_EMBLEMS,
} from '../src/history/constants/history-defaults.constant.js';

import {
  seedMalagasyItems,
  seedCitations,
  seedRakiTeny,
  seedQuiz,
  seedTrueFalse,
  seedRiddles,
  printConsolidatedReport,
  SeedCategoryStats,
} from './seeds/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const DEFAULT_THEMES = [
  {
    nameMg: 'Fahendrena',
    nameFr: 'Sagesse',
    slug: 'sagesse',
    icon: 'bulb-outline',
    color: '#E0533C',
  },
  {
    nameMg: 'Fihavanana',
    nameFr: 'Solidarité',
    slug: 'solidarite',
    icon: 'people-outline',
    color: '#2E7D32',
  },
  {
    nameMg: 'Fitiavana',
    nameFr: 'Amour',
    slug: 'amour',
    icon: 'heart-outline',
    color: '#D81B60',
  },
  {
    nameMg: 'Fianakaviana',
    nameFr: 'Famille',
    slug: 'famille',
    icon: 'home-outline',
    color: '#1565C0',
  },
  {
    nameMg: 'Asa sy Faharisihana',
    nameFr: 'Travail & Effort',
    slug: 'travail',
    icon: 'hammer-outline',
    color: '#EF6C00',
  },
  {
    nameMg: 'Fanabeazana',
    nameFr: 'Éducation',
    slug: 'education',
    icon: 'book-outline',
    color: '#6A1B9A',
  },
  {
    nameMg: 'Faharetana',
    nameFr: 'Persévérance',
    slug: 'perseverance',
    icon: 'shield-checkmark-outline',
    color: '#00838F',
  },
  {
    nameMg: 'Fitondran-tena',
    nameFr: 'Morale & Vertu',
    slug: 'morale',
    icon: 'leaf-outline',
    color: '#2E7D32',
  },
  {
    nameMg: 'Zavaboary',
    nameFr: 'Nature & Environnement',
    slug: 'nature',
    icon: 'earth-outline',
    color: '#1B5E20',
  },
  {
    nameMg: 'Fahafatesana sy Fisaonana',
    nameFr: 'Mort & Deuil',
    slug: 'mort-deuil',
    icon: 'moon-outline',
    color: '#37474F',
  },
  {
    nameMg: 'Tantara sy Fomba',
    nameFr: 'Histoire & Coutumes',
    slug: 'histoire-coutumes',
    icon: 'library-outline',
    color: '#795548',
  },
  {
    nameMg: 'Fitantanana sy Fanjakana',
    nameFr: 'Pouvoir & Justice',
    slug: 'pouvoir-justice',
    icon: 'scale-outline',
    color: '#455A64',
  },
];

const DEFAULT_REGIONS = [
  { name: 'Analamanga', code: '101' },
  { name: 'Vakinankaratra', code: '102' },
  { name: 'Itasy', code: '103' },
  { name: 'Bongolava', code: '104' },
  { name: 'Haute Matsiatra', code: '201' },
  { name: 'Amoron\'i Mania', code: '202' },
  { name: 'Vatovavy-Fitovinany', code: '203' },
  { name: 'Ihorombe', code: '204' },
  { name: 'Atsimo-Atsinanana', code: '205' },
  { name: 'Atsinanana', code: '301' },
  { name: 'Analanjirofo', code: '302' },
  { name: 'Alaotra-Mangoro', code: '303' },
  { name: 'Boeny', code: '401' },
  { name: 'Sofia', code: '402' },
  { name: 'Betsiboka', code: '403' },
  { name: 'Melaky', code: '404' },
  { name: 'Atsimo-Andrefana', code: '501' },
  { name: 'Androy', code: '502' },
  { name: 'Anosy', code: '503' },
  { name: 'Menabe', code: '504' },
  { name: 'Diana', code: '601' },
  { name: 'Sava', code: '602' },
];

async function main() {
  console.log('🚀 Démarrage du seed de la base de données Kanto MG...');
  const seedDataDir = path.join(__dirname, 'seed-data');

  // 1. Initialisation idempotente des Thèmes
  const themeMap = new Map<string, string>();
  for (const t of DEFAULT_THEMES) {
    const upserted = await prisma.theme.upsert({
      where: { slug: t.slug },
      update: {
        nameMg: t.nameMg,
        nameFr: t.nameFr,
        icon: t.icon,
        color: t.color,
      },
      create: {
        nameMg: t.nameMg,
        nameFr: t.nameFr,
        slug: t.slug,
        icon: t.icon,
        color: t.color,
      },
    });
    themeMap.set(t.slug, upserted.id);
  }
  console.log(`✅ ${DEFAULT_THEMES.length} thèmes synchronisés`);

  // 2. Initialisation idempotente des Régions
  for (const r of DEFAULT_REGIONS) {
    await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: { name: r.name, code: r.code },
    });
  }
  console.log(`✅ ${DEFAULT_REGIONS.length} régions synchronisées`);

  const reportStats: SeedCategoryStats[] = [];

  // 3. Proverbes, Dictons & Expressions (Corpus vérifié + fichiers historiques)
  console.log('\n📖 [1/6] Synchronisation des Proverbes, Dictons & Expressions...');
  const itemsStats = await seedMalagasyItems(prisma, seedDataDir, themeMap);
  reportStats.push(itemsStats);

  // 4. Citations & Auteurs (Corpus vérifié + citations historiques)
  console.log('\n📖 [2/6] Synchronisation des Citations & Auteurs...');
  const citationsStats = await seedCitations(prisma, seedDataDir, themeMap);
  reportStats.push(citationsStats);

  // 5. Mots Rares (Raki-teny Miafina)
  console.log('\n📖 [3/6] Synchronisation des Mots Rares (Raki-teny)...');
  const rakiStats = await seedRakiTeny(prisma, seedDataDir);
  reportStats.push(rakiStats);

  // 6. Questions de Quiz (Quiz civiques & Questions vérifiées)
  console.log('\n📖 [4/6] Synchronisation des Quiz (Civique & Vérifié)...');
  const quizStats = await seedQuiz(prisma, seedDataDir);
  reportStats.push(quizStats);

  // 7. Questions Vrai ou Faux (Marina sa Diso & Vérifiées)
  console.log('\n📖 [5/6] Synchronisation des questions Vrai/Faux...');
  const tfStats = await seedTrueFalse(prisma, seedDataDir);
  reportStats.push(tfStats);

  // 8. Devinettes (Ankamantatra)
  console.log('\n📖 [6/6] Synchronisation des Devinettes (Ankamantatra)...');
  const riddlesStats = await seedRiddles(prisma, seedDataDir);
  reportStats.push(riddlesStats);

  // 9. Initialisation du Proverbe du jour si absent
  const dailyProverbCount = await prisma.dailyProverb.count();
  if (dailyProverbCount === 0) {
    const firstP = await prisma.malagasyItem.findFirst({
      where: { category: 'PROVERBE' },
    });
    if (firstP) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.dailyProverb.create({
        data: {
          date: today,
          itemId: firstP.id,
          editorial: 'Proverbe d\'ouverture de Kanto MG',
        },
      });
      console.log('✅ Proverbe du jour initialisé');
    }
  }

  // 10. Import des Contes traditionnels (Angano)
  const existingContesCount = await prisma.conte.count();
  const conteFilePath = path.join(seedDataDir, 'conte.data.json');
  if (existingContesCount === 0 && fs.existsSync(conteFilePath)) {
    const rawContes = JSON.parse(fs.readFileSync(conteFilePath, 'utf-8'));
    console.log(`📖 Chargement de ${rawContes.length} contes depuis ${conteFilePath}...`);
    const DEFAULT_CONTE_IMAGE = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';

    for (let i = 0; i < rawContes.length; i++) {
      const c = rawContes[i];
      const baseSlug = slugify(c.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const conteIllustration = c.illustration?.trim() || DEFAULT_CONTE_IMAGE;

      const createdConte = await prisma.conte.create({
        data: {
          id: c.id || undefined,
          slug: uniqueSlug,
          title: c.title,
          titleFr: c.titleFr,
          subtitle: c.subtitle || null,
          subtitleFr: c.subtitleFr || null,
          author: c.author || 'Angano Malagasy',
          source: c.source || null,
          illustration: conteIllustration,
          moralMg: c.moral?.textMg || null,
          moralFr: c.moral?.textFr || null,
          variantIds: Array.isArray(c.variants || c.varient) ? c.variants || c.varient : [],
          isFeatured: i < 3,
        },
      });

      if (Array.isArray(c.content)) {
        for (let pIdx = 0; pIdx < c.content.length; pIdx++) {
          const p = c.content[pIdx];
          await prisma.conteParagraph.create({
            data: {
              conteId: createdConte.id,
              paragraphNumber: p.paragraph || pIdx + 1,
              textMg: p.textMg || '',
              textFr: p.textFr || '',
              illustration: p.illustration || null,
            },
          });
        }
      }

      if (Array.isArray(c.themes)) {
        for (const tName of c.themes) {
          const tSlug = slugify(tName);
          let tId = themeMap.get(tSlug);
          if (!tId) {
            const newTheme = await prisma.theme.create({
              data: { nameFr: tName, nameMg: tName, slug: tSlug },
            });
            tId = newTheme.id;
            themeMap.set(tSlug, tId);
          }
          await prisma.conteTheme.create({
            data: { conteId: createdConte.id, themeId: tId },
          });
        }
      }
    }
    console.log(`✅ ${rawContes.length} contes (Angano) importés`);
  }

  // 11. Import des Discours traditionnels (Kabary)
  const existingKabaryCount = await prisma.kabary.count();
  const kabaryFilePath = path.join(seedDataDir, 'kabary.data.json');
  if (existingKabaryCount === 0 && fs.existsSync(kabaryFilePath)) {
    const rawKabaries = JSON.parse(fs.readFileSync(kabaryFilePath, 'utf-8'));
    console.log(`🗣️ Chargement de ${rawKabaries.length} discours (Kabary)...`);
    const DEFAULT_KABARY_IMAGE = 'https://res.cloudinary.com/dhe585mze/image/upload/v1752952347/Photoroom-20250719_204052441_vlyahm.png';

    for (let i = 0; i < rawKabaries.length; i++) {
      const k = rawKabaries[i];
      const baseSlug = slugify(k.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;
      const kabaryIllustration = k.illustration?.trim() || DEFAULT_KABARY_IMAGE;

      const createdKabary = await prisma.kabary.create({
        data: {
          id: k.id || undefined,
          slug: uniqueSlug,
          title: k.title,
          titleFr: k.titleFr,
          subtitle: k.subtitle || null,
          subtitleFr: k.subtitleFr || null,
          occasion: k.occasion,
          occasionFr: k.occasionFr || null,
          speakerRoleMg: k.speakerRoleMg || null,
          speakerRoleFr: k.speakerRoleFr || null,
          recipientRoleMg: k.recipientRoleMg || null,
          recipientRoleFr: k.recipientRoleFr || null,
          region: k.region || null,
          illustration: kabaryIllustration,
          concludingProverbMg: k.concludingProverb?.mg || null,
          concludingProverbFr: k.concludingProverb?.fr || null,
          etiquetteNotesMg: k.etiquetteNotes?.mg || null,
          etiquetteNotesFr: k.etiquetteNotes?.fr || null,
          isFeatured: i < 3,
        },
      });

      if (Array.isArray(k.steps)) {
        for (let sIdx = 0; sIdx < k.steps.length; sIdx++) {
          const s = k.steps[sIdx];
          await prisma.kabaryStep.create({
            data: {
              kabaryId: createdKabary.id,
              stepOrder: s.order || sIdx + 1,
              titleMg: s.titleMg || `Dingana ${sIdx + 1}`,
              titleFr: s.titleFr || null,
              contentMg: s.contentMg || '',
              contentFr: s.contentFr || null,
              purposeNotesMg: s.purposeNotesMg || null,
              purposeNotesFr: s.purposeNotesFr || null,
            },
          });
        }
      }

      if (Array.isArray(k.themes)) {
        for (const tName of k.themes) {
          const tSlug = slugify(tName);
          let tId = themeMap.get(tSlug);
          if (!tId) {
            const newTheme = await prisma.theme.create({
              data: { nameFr: tName, nameMg: tName, slug: tSlug },
            });
            tId = newTheme.id;
            themeMap.set(tSlug, tId);
          }
          await prisma.kabaryTheme.create({
            data: { kabaryId: createdKabary.id, themeId: tId },
          });
        }
      }
    }
    console.log(`✅ ${rawKabaries.length} discours (Kabary) importés`);
  }

  // 12. Import des Poésies (Tononkalo)
  const existingPoesieCount = await prisma.poesie.count();
  const poesieFilePath = path.join(seedDataDir, 'poesie.data.json');
  if (existingPoesieCount === 0 && fs.existsSync(poesieFilePath)) {
    const rawPoesies = JSON.parse(fs.readFileSync(poesieFilePath, 'utf-8'));
    console.log(`📜 Chargement de ${rawPoesies.length} poésies...`);
    for (let i = 0; i < rawPoesies.length; i++) {
      const p = rawPoesies[i];
      const baseSlug = slugify(p.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;

      let authorId: string | null = null;
      if (p.author && p.author.trim()) {
        const author = await prisma.author.upsert({
          where: { name: p.author.trim() },
          update: {},
          create: { name: p.author.trim() },
        });
        authorId = author.id;
      }

      const createdPoesie = await prisma.poesie.create({
        data: {
          id: p.id || undefined,
          slug: uniqueSlug,
          title: p.title,
          titleFr: p.titleFr || null,
          authorName: p.author || 'Mpanoratra Malagasy',
          authorId,
          year: typeof p.year === 'number' ? p.year : null,
          contentMg: p.contentMg || '',
          contentFr: p.contentFr || null,
          explanationMg: p.explanationMg || null,
          explanationFr: p.explanationFr || null,
          isFeatured: i < 3,
        },
      });

      if (Array.isArray(p.themes)) {
        for (const tName of p.themes) {
          const tSlug = slugify(tName);
          let tId = themeMap.get(tSlug);
          if (!tId) {
            const newTheme = await prisma.theme.create({
              data: { nameFr: tName, nameMg: tName, slug: tSlug },
            });
            tId = newTheme.id;
            themeMap.set(tSlug, tId);
          }
          await prisma.poesieTheme.create({
            data: { poesieId: createdPoesie.id, themeId: tId },
          });
        }
      }
    }
    console.log(`✅ ${rawPoesies.length} poésies importées`);
  }

  // 13. Import des Récitations (Tsianjery)
  const existingRecitationCount = await prisma.recitation.count();
  const recitationFilePath = path.join(seedDataDir, 'recitation.data.json');
  if (existingRecitationCount === 0 && fs.existsSync(recitationFilePath)) {
    const rawRecitations = JSON.parse(fs.readFileSync(recitationFilePath, 'utf-8'));
    console.log(`📖 Chargement de ${rawRecitations.length} récitations...`);
    for (let i = 0; i < rawRecitations.length; i++) {
      const r = rawRecitations[i];
      const baseSlug = slugify(r.title);
      const uniqueSlug = `${baseSlug}-${i + 1}`;

      await prisma.recitation.create({
        data: {
          id: r.id || undefined,
          slug: uniqueSlug,
          title: r.title,
          titleFr: r.titleFr || null,
          category: r.category || 'ANKIZY',
          contentMg: r.contentMg || '',
          contentFr: r.contentFr || null,
          moralMg: r.moralMg || null,
          moralFr: r.moralFr || null,
          isFeatured: i < 3,
        },
      });
    }
    console.log(`✅ ${rawRecitations.length} récitations importées`);
  }

  // 14. Import des Signes du Zodiaque (Vintana)
  const existingVintanaCount = await prisma.vintanaSign.count();
  if (existingVintanaCount === 0 && Array.isArray(VINTANA_SIGNS)) {
    for (const v of VINTANA_SIGNS) {
      await prisma.vintanaSign.upsert({
        where: { name: v.name },
        create: {
          name: v.name,
          order: v.order,
          nature: v.nature,
          characteristics: v.characteristics,
          fady: v.fady,
          recommendations: v.recommendations,
          color: v.color,
          symbol: v.symbol,
          season: v.season,
          cardinalPoint: v.cardinalPoint,
        },
        update: {},
      });
    }
    console.log(`✅ ${VINTANA_SIGNS.length} signes Vintana importés`);
  }

  // 15. Contenus civiques institutionnels
  const CIVIC_FILES: Array<{ file: string; subCategory: CivicSubCategory }> = [
    { file: 'droits-et-vote.data.json', subCategory: CivicSubCategory.DROITS_DEVOIRS },
    { file: 'civic-institution.data.json', subCategory: CivicSubCategory.INSTITUTIONS },
    { file: 'symboles-histoire.data.json', subCategory: CivicSubCategory.SYMBOLES_NATIONAUX },
    { file: 'vivre-ensemble.data.json', subCategory: CivicSubCategory.FIHAVANANA_VIVRE_ENSEMBLE },
    { file: 'ecologie-civisme.data.json', subCategory: CivicSubCategory.ENVIRONNEMENT_PATRIMOINE },
  ];

  for (const { file: fileName, subCategory } of CIVIC_FILES) {
    const fPath = path.join(seedDataDir, 'civique', fileName);
    if (!fs.existsSync(fPath)) continue;

    const rawList = JSON.parse(fs.readFileSync(fPath, 'utf-8'));
    for (const item of rawList) {
      const slug = item.slug || slugify(item.titleFr || item.titleMg);
      const existing = await prisma.civicContent.findUnique({ where: { slug } });
      if (!existing) {
        await prisma.civicContent.create({
          data: {
            slug,
            subCategory,
            titleFr: item.titleFr,
            titleMg: item.titleMg,
            summaryFr: item.summaryFr || null,
            summaryMg: item.summaryMg || null,
            contentFr: Array.isArray(item.contentFr) ? item.contentFr : [],
            contentMg: Array.isArray(item.contentMg) ? item.contentMg : [],
            themes: Array.isArray(item.themes) ? item.themes : [],
            sources: Array.isArray(item.sources) ? item.sources : [],
            imageUrl: item.imageUrl || null,
            status: 'PUBLISHED',
          },
        });
      }
    }
  }

  // 16. Histoire, Mémoire & Patrimoine (Leçons, Présidents, Billets, Blasons, Emblèmes, Dates, Sceaux)
  for (const item of DEFAULT_CIVIC_LESSONS) {
    await prisma.civicLesson.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        levelNumber: item.levelNumber,
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        summaryFr: item.summaryFr,
        summaryMg: item.summaryMg,
        historicalPeriod: item.historicalPeriod,
        readingTimeMinutes: item.readingTimeMinutes,
        sourceReference: item.sourceReference,
        status: item.status,
      },
      update: {
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        summaryFr: item.summaryFr,
        summaryMg: item.summaryMg,
        historicalPeriod: item.historicalPeriod,
      },
    });
  }

  for (const item of DEFAULT_PRESIDENTS) {
    await prisma.president.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        name: item.name,
        birthDate: item.birthDate,
        deathDate: item.deathDate,
        mandates: item.mandates,
        republic: item.republic,
        biographyFr: item.biographyFr,
        biographyMg: item.biographyMg,
        achievementsFr: item.achievementsFr,
        achievementsMg: item.achievementsMg,
        challengesFr: item.challengesFr,
        challengesMg: item.challengesMg,
        famousQuoteFr: item.famousQuoteFr,
        famousQuoteMg: item.famousQuoteMg,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        name: item.name,
        mandates: item.mandates,
        biographyFr: item.biographyFr,
        biographyMg: item.biographyMg,
        achievementsFr: item.achievementsFr,
        achievementsMg: item.achievementsMg,
        famousQuoteFr: item.famousQuoteFr,
        famousQuoteMg: item.famousQuoteMg,
      },
    });
  }

  for (const item of DEFAULT_BANKNOTES) {
    await prisma.banknote.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        faceValue: item.faceValue,
        fmgValue: item.fmgValue,
        series: item.series,
        releaseDate: item.releaseDate,
        themeFr: item.themeFr,
        themeMg: item.themeMg,
        dominantColor: item.dominantColor,
        dimensions: item.dimensions,
        rectoDescriptionFr: item.rectoDescriptionFr,
        rectoDescriptionMg: item.rectoDescriptionMg,
        versoDescriptionFr: item.versoDescriptionFr,
        versoDescriptionMg: item.versoDescriptionMg,
        securityFeaturesFr: item.securityFeaturesFr,
        securityFeaturesMg: item.securityFeaturesMg,
        imageUrl: item.imageUrl,
        imageUrlVerso: item.imageUrlVerso,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        faceValue: item.faceValue,
        themeFr: item.themeFr,
        themeMg: item.themeMg,
        dominantColor: item.dominantColor,
        rectoDescriptionFr: item.rectoDescriptionFr,
        rectoDescriptionMg: item.rectoDescriptionMg,
        versoDescriptionFr: item.versoDescriptionFr,
        versoDescriptionMg: item.versoDescriptionMg,
      },
    });
  }

  for (const item of DEFAULT_PROVINCE_BLASONS) {
    await prisma.provinceBlason.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        provinceName: item.provinceName,
        capitalName: item.capitalName,
        mottoFr: item.mottoFr,
        mottoMg: item.mottoMg,
        symbolismFr: item.symbolismFr,
        symbolismMg: item.symbolismMg,
        keyFigures: item.keyFigures,
        accentColor: item.accentColor,
        imageUrl: item.imageUrl,
        orderIndex: item.orderIndex,
        status: item.status,
      },
      update: {
        provinceName: item.provinceName,
        capitalName: item.capitalName,
        mottoFr: item.mottoFr,
        mottoMg: item.mottoMg,
        symbolismFr: item.symbolismFr,
        symbolismMg: item.symbolismMg,
      },
    });
  }

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
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
      },
    });
  }

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
        titleFr: item.titleFr,
        titleMg: item.titleMg,
        summaryFr: item.summaryFr,
        summaryMg: item.summaryMg,
      },
    });
  }

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
        government: item.government,
        descriptionFr: item.descriptionFr,
        descriptionMg: item.descriptionMg,
      },
    });
  }

  // 17. Rapport consolidé d'observabilité
  printConsolidatedReport(reportStats);
}

main()
  .catch((e) => {
    console.error('❌ Erreur critique lors de l\'exécution du seed :', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch {}
    process.exit(process.exitCode || 0);
  });
