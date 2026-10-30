import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  DifficultyLevel,
  TrueFalseTheme,
  WordRarity,
  CivicSubCategory,
} from '../../generated/prisma/client.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_CIVIC_LESSONS,
  DEFAULT_PRESIDENTS,
  DEFAULT_BANKNOTES,
  DEFAULT_PROVINCE_BLASONS,
  DEFAULT_NATURE_EMBLEMS,
  DEFAULT_HISTORY_DATES,
  DEFAULT_NATIONAL_EMBLEMS,
} from '../history/constants/history-defaults.constant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ [Seed Prod] Variable DATABASE_URL manquante dans l\'environnement.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Localise le dossier `prisma/seed-data` quel que soit l'environnement
 * (exécuté compilé depuis dist/src/scripts ou source depuis src/scripts)
 */
function findSeedDataDir(): string {
  const candidates = [
    path.resolve(process.cwd(), 'prisma/seed-data'),
    path.resolve(process.cwd(), '../prisma/seed-data'),
    path.resolve(__dirname, '../../prisma/seed-data'),
    path.resolve(__dirname, '../../../prisma/seed-data'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }
  throw new Error(`Répertoire seed-data introuvable. Candidats explorés : ${candidates.join(', ')}`);
}

interface SeedStats {
  category: string;
  totalInFile: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: number;
}

const DEFAULT_THEMES = [
  { nameMg: 'Fahendrena', nameFr: 'Sagesse', slug: 'sagesse', icon: 'bulb-outline', color: '#E0533C' },
  { nameMg: 'Fihavanana', nameFr: 'Solidarité', slug: 'solidarite', icon: 'people-outline', color: '#2E7D32' },
  { nameMg: 'Fitiavana', nameFr: 'Amour', slug: 'amour', icon: 'heart-outline', color: '#D81B60' },
  { nameMg: 'Fianakaviana', nameFr: 'Famille', slug: 'famille', icon: 'home-outline', color: '#1565C0' },
  { nameMg: 'Asa sy Faharisihana', nameFr: 'Travail & Effort', slug: 'travail', icon: 'hammer-outline', color: '#EF6C00' },
  { nameMg: 'Fanabeazana', nameFr: 'Éducation', slug: 'education', icon: 'book-outline', color: '#6A1B9A' },
  { nameMg: 'Faharetana', nameFr: 'Persévérance', slug: 'perseverance', icon: 'shield-checkmark-outline', color: '#00838F' },
  { nameMg: 'Fitondran-tena', nameFr: 'Morale & Vertu', slug: 'morale', icon: 'leaf-outline', color: '#2E7D32' },
  { nameMg: 'Zavaboary', nameFr: 'Nature & Environnement', slug: 'nature', icon: 'earth-outline', color: '#1B5E20' },
  { nameMg: 'Fahafatesana sy Fisaonana', nameFr: 'Mort & Deuil', slug: 'mort-deuil', icon: 'moon-outline', color: '#37474F' },
  { nameMg: 'Tantara sy Fomba', nameFr: 'Histoire & Coutumes', slug: 'histoire-coutumes', icon: 'library-outline', color: '#795548' },
  { nameMg: 'Fitantanana sy Fanjakana', nameFr: 'Pouvoir & Justice', slug: 'pouvoir-justice', icon: 'scale-outline', color: '#455A64' },
];

const DEFAULT_REGIONS = [
  'Analamanga',
  'Vakinankaratra',
  'Itasy',
  'Bongolava',
  'Haute Matsiatra',
  'Amoron\'i Mania',
  'Vatovavy-Fitovinany',
  'Ihorombe',
  'Atsimo-Atsinanana',
  'Atsinanana',
  'Analanjirofo',
  'Alaotra-Mangoro',
  'Boeny',
  'Sofia',
  'Betsiboka',
  'Melaky',
  'Atsimo-Andrefana',
  'Androy',
  'Anosy',
  'Menabe',
  'Diana',
  'Sava',
];

const TF_THEME_CATEGORY_MAP: Record<string, TrueFalseTheme> = {
  monnaie_economie: TrueFalseTheme.HIST,
  histoire_dates: TrueFalseTheme.HIST,
  presidents_dirigeants: TrueFalseTheme.HIST,
  citoyennete_fihavanana: TrueFalseTheme.CULT,
  patrimoine_culture: TrueFalseTheme.CULT,
  geographie_territoires: TrueFalseTheme.GEO,
  symboles_emblemes: TrueFalseTheme.CULT,
  personnalites_historiques: TrueFalseTheme.HIST,
  traditions_valeurs: TrueFalseTheme.CULT,
};

async function ensureSchemaColumns() {
  try {
    await pool.query(`
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "explanationMg" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "levelNumber" INTEGER DEFAULT 1;
      ALTER TABLE IF EXISTS "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "historicalPeriod" TEXT;

      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationTrueMg" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationTrueFr" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationFalseMg" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationFalseFr" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "levelNumber" INTEGER DEFAULT 1;
      ALTER TABLE IF EXISTS "true_false_questions" ADD COLUMN IF NOT EXISTS "historicalPeriod" TEXT;

      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "acceptedAnswers" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY';
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
      ALTER TABLE IF EXISTS "riddle_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;
    `);
  } catch (err: any) {
    console.warn('⚠️ [Preflight Schema] Contrôle de schéma non bloquant :', err.message);
  }
}

async function seedProduction() {
  console.log('🚀 [Kanto Backend] Démarrage du seed idempotent intégral de production...');
  await ensureSchemaColumns();
  const seedDataDir = findSeedDataDir();
  console.log(`📁 [Kanto Backend] Répertoire de données de référence : ${seedDataDir}`);

  const allStats: SeedStats[] = [];

  // ─── 0. Initialisation des Thèmes & Régions ─────────────────────────────────
  const themeMap = new Map<string, string>();
  for (const t of DEFAULT_THEMES) {
    const upserted = await prisma.theme.upsert({
      where: { slug: t.slug },
      update: { nameMg: t.nameMg, nameFr: t.nameFr, icon: t.icon, color: t.color },
      create: { nameMg: t.nameMg, nameFr: t.nameFr, slug: t.slug, icon: t.icon, color: t.color },
    });
    themeMap.set(t.slug, upserted.id);
  }
  for (const rName of DEFAULT_REGIONS) {
    await prisma.region.upsert({
      where: { name: rName },
      update: {},
      create: { name: rName },
    });
  }

  // ─── 1. Proverbes, Dictons & Expressions (Corpus complet de 4 fichiers) ─────
  const itemsStats: SeedStats = {
    category: 'Proverbes & Dictons (MalagasyItem)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const ITEM_FILES = [
    { file: 'malagasy-items.data.json', defaultCat: 'PROVERBE' },
    { file: 'proverbes.data.json', defaultCat: 'PROVERBE' },
    { file: 'dictons.data.json', defaultCat: 'DICTON' },
    { file: 'expressions.data.json', defaultCat: 'EXPRESSION' },
  ];
  const processedMgTexts = new Set<string>();

  for (const src of ITEM_FILES) {
    const fPath = path.join(seedDataDir, src.file);
    if (!fs.existsSync(fPath)) continue;

    const rawList: any[] = JSON.parse(fs.readFileSync(fPath, 'utf-8'));
    itemsStats.totalInFile += rawList.length;

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!item.malagasy || !item.french || !item.meaning) {
        itemsStats.skipped++;
        continue;
      }

      const cleanMalagasy = item.malagasy.trim();
      const normKey = cleanMalagasy.toLowerCase();
      if (processedMgTexts.has(normKey)) {
        itemsStats.skipped++;
        continue;
      }
      processedMgTexts.add(normKey);

      let category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' = 'PROVERBE';
      const rawCat = String(item.category || src.defaultCat).toUpperCase();
      if (rawCat.includes('DICTON')) category = 'DICTON';
      else if (rawCat.includes('EXPRESSION')) category = 'EXPRESSION';

      try {
        const existing = await prisma.malagasyItem.findFirst({
          where: {
            OR: [
              ...(item.id ? [{ id: item.id }] : []),
              { malagasy: { equals: cleanMalagasy, mode: 'insensitive' as const } },
            ],
          },
        });

        let targetId: string;

        if (existing) {
          targetId = existing.id;
          const hasDiff =
            existing.french !== item.french ||
            existing.meaning !== item.meaning ||
            existing.example !== (item.example || null) ||
            existing.phonetic !== (item.phonetic || null) ||
            existing.category !== category;

          if (hasDiff) {
            await prisma.malagasyItem.update({
              where: { id: existing.id },
              data: {
                french: item.french,
                meaning: item.meaning,
                example: item.example || null,
                phonetic: item.phonetic || null,
                category,
                origins: Array.isArray(item.origins) ? item.origins : existing.origins,
                difficulty: item.difficulty || existing.difficulty,
              },
            });
            itemsStats.updated++;
          } else {
            itemsStats.unchanged++;
          }
        } else {
          const baseSlug = slugify(item.slug || cleanMalagasy.substring(0, 50)) || 'item';
          let slug = baseSlug;
          let counter = 1;
          while (await prisma.malagasyItem.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
          }

          const created = await prisma.malagasyItem.create({
            data: {
              ...(item.id ? { id: item.id } : {}),
              slug,
              malagasy: cleanMalagasy,
              french: item.french,
              meaning: item.meaning,
              example: item.example || null,
              phonetic: item.phonetic || null,
              category,
              difficulty: item.difficulty || 'EASY',
              origins: Array.isArray(item.origins) ? item.origins : [],
              status: 'PUBLISHED',
              isFeatured: i < 5,
            },
          });
          targetId = created.id;

          if (Array.isArray(item.dialectVariants)) {
            for (const v of item.dialectVariants) {
              const dName = v.dialectName || v.dialect;
              if (dName && v.text) {
                await prisma.dialectVariant.create({
                  data: { dialectName: dName, text: v.text, itemId: targetId },
                });
              }
            }
          }
          itemsStats.created++;
        }

        // Liaison idempotente des thèmes
        if (Array.isArray(item.themes)) {
          for (const tName of item.themes) {
            const trimmedTheme = String(tName).trim();
            if (!trimmedTheme) continue;
            const tSlug = slugify(trimmedTheme);
            let tId = themeMap.get(tSlug);
            if (!tId) {
              const exTheme = await prisma.theme.findFirst({
                where: { OR: [{ slug: tSlug }, { nameFr: trimmedTheme }, { nameMg: trimmedTheme }] },
              });
              if (exTheme) {
                tId = exTheme.id;
              } else {
                const newT = await prisma.theme.create({
                  data: { nameFr: trimmedTheme, nameMg: trimmedTheme, slug: tSlug },
                });
                tId = newT.id;
              }
              themeMap.set(tSlug, tId);
            }
            await prisma.malagasyItemTheme.upsert({
              where: { itemId_themeId: { itemId: targetId, themeId: tId } },
              update: {},
              create: { itemId: targetId, themeId: tId },
            });
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Items] Erreur sur "${cleanMalagasy.substring(0, 30)}..." :`, err);
        itemsStats.errors++;
      }
    }
  }
  allStats.push(itemsStats);

  // ─── 2. Citations & Auteurs (2 fichiers) ─────────────────────────────────────
  const citationsStats: SeedStats = {
    category: 'Citations & Auteurs (Citation)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const CITATION_FILES = ['citations.data.json', 'citation.data.json'];
  const processedCitations = new Set<string>();

  for (const cFileName of CITATION_FILES) {
    const cPath = path.join(seedDataDir, cFileName);
    if (!fs.existsSync(cPath)) continue;

    const rawCitations: any[] = JSON.parse(fs.readFileSync(cPath, 'utf-8'));
    citationsStats.totalInFile += rawCitations.length;

    for (let i = 0; i < rawCitations.length; i++) {
      const c = rawCitations[i];
      const mgText = c.citationMg || c.textMg || c.citation;
      const frText = c.citationFr || c.textFr || c.translation;
      if (!mgText || !frText) {
        citationsStats.skipped++;
        continue;
      }

      const cleanCitationMg = String(mgText).trim();
      const normKey = cleanCitationMg.toLowerCase();
      if (processedCitations.has(normKey)) {
        citationsStats.skipped++;
        continue;
      }
      processedCitations.add(normKey);

      try {
        const sourceName = (c.source || c.sourceName || c.author || 'Ntaolo Malagasy').trim();
        let authorId: string | null = null;
        if (sourceName && sourceName.toLowerCase() !== 'anonyme') {
          const author = await prisma.author.upsert({
            where: { name: sourceName },
            update: {},
            create: { name: sourceName },
          });
          authorId = author.id;
        }

        const existing = await prisma.citation.findFirst({
          where: {
            OR: [
              ...(c.id ? [{ id: c.id }] : []),
              { citationMg: { equals: cleanCitationMg, mode: 'insensitive' as const } },
            ],
          },
        });

        let targetId: string;
        if (existing) {
          targetId = existing.id;
          const hasDiff =
            existing.citationFr !== frText ||
            existing.sourceName !== sourceName ||
            existing.contexte !== (c.contexte || c.context || null) ||
            existing.authorId !== authorId;

          if (hasDiff) {
            await prisma.citation.update({
              where: { id: existing.id },
              data: {
                citationFr: frText,
                sourceName,
                contexte: c.contexte || c.context || null,
                authorId,
              },
            });
            citationsStats.updated++;
          } else {
            citationsStats.unchanged++;
          }
        } else {
          const created = await prisma.citation.create({
            data: {
              ...(c.id ? { id: c.id } : {}),
              citationMg: cleanCitationMg,
              citationFr: frText,
              sourceName,
              contexte: c.contexte || c.context || null,
              authorId,
              status: 'PUBLISHED',
              isPremium: Boolean(c.isPremium),
            },
          });
          targetId = created.id;
          citationsStats.created++;
        }

        if (Array.isArray(c.themes)) {
          for (const tName of c.themes) {
            const tSlug = slugify(String(tName).trim());
            const tId = themeMap.get(tSlug);
            if (tId) {
              await prisma.citationTheme.upsert({
                where: { citationId_themeId: { citationId: targetId, themeId: tId } },
                update: {},
                create: { citationId: targetId, themeId: tId },
              });
            }
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Citations] Erreur sur "${cleanCitationMg.substring(0, 30)}..." :`, err);
        citationsStats.errors++;
      }
    }
  }
  allStats.push(citationsStats);

  // ─── 3. Mots Rares (Raki-teny Miafina) ────────────────────────────────────────
  const rakiStats: SeedStats = {
    category: 'Mots Rares (RakiTenyWord)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const rakiFile = path.join(seedDataDir, 'raki-teny.data.json');
  if (fs.existsSync(rakiFile)) {
    const rawRaki: any[] = JSON.parse(fs.readFileSync(rakiFile, 'utf-8'));
    rakiStats.totalInFile = rawRaki.length;

    const validRarities: Record<string, WordRarity> = {
      LITERAL: WordRarity.LITERAL,
      VERY_RARE: WordRarity.VERY_RARE,
      ARCHAIC: WordRarity.ARCHAIC,
      POETIC: WordRarity.POETIC,
      PROVERBIAL: WordRarity.PROVERBIAL,
    };

    for (let i = 0; i < rawRaki.length; i++) {
      const item = rawRaki[i];
      if (!item.word || !item.meaningMg || !item.meaningFr) {
        rakiStats.skipped++;
        continue;
      }

      const cleanWord = item.word.trim();
      const slug = item.slug ? item.slug.trim() : slugify(cleanWord);
      const rarity: WordRarity = (item.rarity && validRarities[item.rarity]) || WordRarity.VERY_RARE;

      try {
        const existing = await prisma.rakiTenyWord.findFirst({
          where: {
            OR: [
              { slug },
              ...(item.id ? [{ id: item.id }] : []),
              { word: { equals: cleanWord, mode: 'insensitive' as const } },
            ],
          },
        });

        if (existing) {
          const hasDiff =
            existing.meaningMg !== item.meaningMg ||
            existing.meaningFr !== item.meaningFr ||
            existing.exampleMg !== item.exampleMg ||
            existing.exampleFr !== item.exampleFr ||
            existing.wordClassMg !== item.wordClassMg ||
            existing.rarity !== rarity;

          if (hasDiff) {
            await prisma.rakiTenyWord.update({
              where: { id: existing.id },
              data: {
                word: cleanWord,
                phonetic: item.phonetic || null,
                category: item.category || 'nature_temps',
                wordClassMg: item.wordClassMg,
                wordClassFr: item.wordClassFr,
                rarity,
                rarityLabelMg: item.rarityLabelMg || 'Tena Vitsy Mpampiasa',
                rarityLabelFr: item.rarityLabelFr || 'Très Rare',
                meaningMg: item.meaningMg,
                meaningFr: item.meaningFr,
                exampleMg: item.exampleMg,
                exampleFr: item.exampleFr,
                contextUsage: item.contextUsage || '',
                etymology: item.etymology || null,
              },
            });
            rakiStats.updated++;
          } else {
            rakiStats.unchanged++;
          }
        } else {
          await prisma.rakiTenyWord.create({
            data: {
              ...(item.id ? { id: item.id } : {}),
              slug,
              word: cleanWord,
              phonetic: item.phonetic || null,
              category: item.category || 'nature_temps',
              wordClassMg: item.wordClassMg,
              wordClassFr: item.wordClassFr,
              rarity,
              rarityLabelMg: item.rarityLabelMg || 'Tena Vitsy Mpampiasa',
              rarityLabelFr: item.rarityLabelFr || 'Très Rare',
              meaningMg: item.meaningMg,
              meaningFr: item.meaningFr,
              exampleMg: item.exampleMg,
              exampleFr: item.exampleFr,
              contextUsage: item.contextUsage || '',
              etymology: item.etymology || null,
              status: 'PUBLISHED',
              isFeatured: item.isFeatured !== undefined ? item.isFeatured : i < 3,
            },
          });
          rakiStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Raki-Teny] Erreur sur "${cleanWord}" :`, err);
        rakiStats.errors++;
      }
    }
  }
  allStats.push(rakiStats);

  // ─── 4. Quiz vérifiés & Civiques (2 fichiers) ────────────────────────────────
  const quizStats: SeedStats = {
    category: 'Quiz vérifiés (CivicQuizQuestion)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const QUIZ_FILES = ['quiz-verified.data.json', 'civic-quiz.data.json'];
  const processedQuizPrompts = new Set<string>();

  for (const qFile of QUIZ_FILES) {
    const qPath = path.join(seedDataDir, qFile);
    if (!fs.existsSync(qPath)) continue;

    const rawQuiz: any[] = JSON.parse(fs.readFileSync(qPath, 'utf-8'));
    quizStats.totalInFile += rawQuiz.length;

    for (const q of rawQuiz) {
      const promptFr = q.promptFr || q.prompt;
      const promptMg = q.promptMg;
      if (!promptFr && !promptMg) {
        quizStats.skipped++;
        continue;
      }
      const mainPrompt = (promptFr || promptMg)!.trim();
      const normKey = mainPrompt.toLowerCase();
      if (processedQuizPrompts.has(normKey)) {
        quizStats.skipped++;
        continue;
      }
      processedQuizPrompts.add(normKey);

      const diff: DifficultyLevel =
        q.difficulty === 'HARD'
          ? DifficultyLevel.HARD
          : q.difficulty === 'MEDIUM'
            ? DifficultyLevel.MEDIUM
            : DifficultyLevel.EASY;

      const choices = q.optionsFr || q.choices || [];
      const answerIndex = typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0;

      const quizData = {
        category: q.category || 'culture_generale',
        prompt: mainPrompt,
        choices,
        answerIndex,
        explanation: q.explanation || '',
        explanationMg: promptMg || null,
        difficulty: diff,
        tags: [q.category, q.contentSourceType].filter(Boolean),
        imageUrl: q.imageUrl || null,
        imageAlt: q.imageAlt || null,
        sourceReference: q.sourceReference || null,
        contentSourceType: q.contentSourceType || null,
        contentSourceId: q.contentSourceId || null,
        levelNumber: q.levelNumber || 1,
        historicalPeriod: q.historicalPeriod || null,
        status: 'PUBLISHED' as const,
      };

      try {
        const existing = await prisma.civicQuizQuestion.findFirst({
          where: {
            OR: [
              ...(q.id ? [{ id: q.id }] : []),
              { prompt: { equals: mainPrompt, mode: 'insensitive' as const } },
            ],
          },
        });

        if (existing) {
          await prisma.civicQuizQuestion.update({
            where: { id: existing.id },
            data: quizData,
          });
          quizStats.updated++;
        } else {
          await prisma.civicQuizQuestion.create({
            data: {
              ...(q.id ? { id: q.id } : {}),
              ...quizData,
            },
          });
          quizStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Quiz] Erreur sur "${mainPrompt.substring(0, 30)}..." :`, err);
        quizStats.errors++;
      }
    }
  }
  allStats.push(quizStats);

  // ─── 5. Questions Vrai ou Faux (7 fichiers : vérifiées + 6 packs thématiques) ─
  const tfStats: SeedStats = {
    category: 'Vrai ou Faux (TrueFalseQuestion)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const TF_FILES = [
    'true-false-verified.data.json',
    'tf-culture.data.json',
    'tf-general.data.json',
    'tf-geographie.data.json',
    'tf-histoire.data.json',
    'tf-litterature.data.json',
    'tf-proverbes.data.json',
  ];
  const processedTfQuestions = new Set<string>();

  for (const tfFileName of TF_FILES) {
    const tfPath = path.join(seedDataDir, tfFileName);
    if (!fs.existsSync(tfPath)) continue;

    const parsedContent = JSON.parse(fs.readFileSync(tfPath, 'utf-8'));
    const rawTf: any[] = Array.isArray(parsedContent)
      ? parsedContent
      : Array.isArray(parsedContent?.questions)
        ? parsedContent.questions
        : [];

    tfStats.totalInFile += rawTf.length;

    for (const vf of rawTf) {
      const questionMg = (vf.promptMg || vf.questionMg)?.trim();
      const questionFr = (vf.promptFr || vf.questionFr)?.trim();
      if (!questionMg && !questionFr) {
        tfStats.skipped++;
        continue;
      }
      const mainQ = (questionMg || questionFr)!;
      const normKey = mainQ.toLowerCase();
      if (processedTfQuestions.has(normKey)) {
        tfStats.skipped++;
        continue;
      }
      processedTfQuestions.add(normKey);

      const diff: DifficultyLevel =
        vf.difficulty === 'HARD'
          ? DifficultyLevel.HARD
          : vf.difficulty === 'MEDIUM'
            ? DifficultyLevel.MEDIUM
            : DifficultyLevel.EASY;

      const theme = (vf.category && TF_THEME_CATEGORY_MAP[vf.category]) || TrueFalseTheme.GEN;

      const tfData = {
        questionMg: questionMg || mainQ,
        questionFr: questionFr || null,
        isTrue: Boolean(vf.isTrue),
        explanationMg: vf.explanationTrueMg || vf.explanation || '',
        explanationFr: vf.explanation || '',
        explanationTrueFr: vf.explanationTrueFr || null,
        explanationTrueMg: vf.explanationTrueMg || null,
        explanationFalseFr: vf.explanationFalseFr || null,
        explanationFalseMg: vf.explanationFalseMg || null,
        theme,
        difficulty: diff,
        source: vf.sourceReference || null,
        sourceReference: vf.sourceReference || null,
        image: vf.imageUrl || null,
        imageAlt: vf.imageAlt || null,
        contentSourceType: vf.contentSourceType || null,
        contentSourceId: vf.contentSourceId || null,
        levelNumber: vf.levelNumber || 1,
        historicalPeriod: vf.historicalPeriod || null,
        status: 'PUBLISHED' as const,
      };

      try {
        const existing = await prisma.trueFalseQuestion.findFirst({
          where: {
            OR: [
              ...(vf.id ? [{ id: vf.id }] : []),
              ...(questionMg ? [{ questionMg: { equals: questionMg, mode: 'insensitive' as const } }] : []),
              ...(questionFr ? [{ questionFr: { equals: questionFr, mode: 'insensitive' as const } }] : []),
            ],
          },
        });

        if (existing) {
          await prisma.trueFalseQuestion.update({
            where: { id: existing.id },
            data: tfData,
          });
          tfStats.updated++;
        } else {
          await prisma.trueFalseQuestion.create({
            data: {
              ...(vf.id ? { id: vf.id } : {}),
              ...tfData,
            },
          });
          tfStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Vrai/Faux] Erreur sur "${mainQ.substring(0, 30)}..." :`, err);
        tfStats.errors++;
      }
    }
  }
  allStats.push(tfStats);

  // ─── 6. Devinettes Traditionnelles (RiddleQuestion - Ankamantatra) ───────────
  const riddlesStats: SeedStats = {
    category: 'Devinettes (RiddleQuestion)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const riddlesFile = path.join(seedDataDir, 'riddles.data.json');
  if (fs.existsSync(riddlesFile)) {
    const rawRiddles: any[] = JSON.parse(fs.readFileSync(riddlesFile, 'utf-8'));
    riddlesStats.totalInFile = rawRiddles.length;

    for (const r of rawRiddles) {
      if (!r.riddleMg || !r.correctAnswer) {
        riddlesStats.skipped++;
        continue;
      }

      const diff: DifficultyLevel =
        r.difficulty?.toUpperCase() === 'HARD'
          ? DifficultyLevel.HARD
          : r.difficulty?.toUpperCase() === 'MEDIUM'
            ? DifficultyLevel.MEDIUM
            : DifficultyLevel.EASY;

      const riddleData = {
        riddleFr: r.riddleFr || '',
        options: Array.isArray(r.options) ? r.options : [],
        correctAnswer: r.correctAnswer,
        acceptedAnswers: Array.isArray(r.acceptedAnswers) ? r.acceptedAnswers : [],
        explanation: r.explanation || '',
        clue: r.clue || null,
        level: typeof r.level === 'number' ? r.level : 1,
        difficulty: diff,
        sourceReference: r.sourceReference || null,
        contentSourceType: r.contentSourceType || 'MALAGASY_ITEM',
        contentSourceId: r.contentSourceId || null,
        status: 'PUBLISHED' as const,
      };

      try {
        const existing = await prisma.riddleQuestion.findFirst({
          where: {
            OR: [
              ...(r.id ? [{ id: r.id }] : []),
              { riddleMg: { equals: r.riddleMg.trim(), mode: 'insensitive' as const } },
            ],
          },
        });

        if (existing) {
          const hasDiff =
            existing.riddleFr !== riddleData.riddleFr ||
            existing.correctAnswer !== riddleData.correctAnswer ||
            existing.explanation !== riddleData.explanation ||
            existing.clue !== riddleData.clue ||
            existing.level !== riddleData.level ||
            existing.difficulty !== riddleData.difficulty;

          if (hasDiff) {
            await prisma.riddleQuestion.update({
              where: { id: existing.id },
              data: riddleData,
            });
            riddlesStats.updated++;
          } else {
            riddlesStats.unchanged++;
          }
        } else {
          await prisma.riddleQuestion.create({
            data: {
              ...(r.id ? { id: r.id } : {}),
              riddleMg: r.riddleMg.trim(),
              ...riddleData,
            },
          });
          riddlesStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Devinettes] Erreur sur "${r.riddleMg.substring(0, 30)}..." :`, err);
        riddlesStats.errors++;
      }
    }
  }
  allStats.push(riddlesStats);

  // ─── 7. Remets dans l'ordre (Word Puzzle / Alamino) ──────────────────────────
  const wordPuzzleStats: SeedStats = {
    category: 'Word Puzzle (WordPuzzleLevel)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const wordPuzzleFile = path.join(seedDataDir, 'word-puzzle.data.json');
  if (fs.existsSync(wordPuzzleFile)) {
    const rawLevels: any[] = JSON.parse(fs.readFileSync(wordPuzzleFile, 'utf-8'));
    wordPuzzleStats.totalInFile = rawLevels.length;

    for (const lvl of rawLevels) {
      try {
        const level = await prisma.wordPuzzleLevel.upsert({
          where: { levelNumber: lvl.levelNumber },
          create: {
            levelNumber: lvl.levelNumber,
            titleMg: lvl.titleMg,
            titleFr: lvl.titleFr || null,
            description: lvl.description || null,
            difficulty: lvl.difficulty || 'EASY',
            passThreshold: lvl.passThreshold || 5,
            totalSentences: Array.isArray(lvl.sentences) ? lvl.sentences.length : 10,
            status: 'PUBLISHED',
          },
          update: {
            titleMg: lvl.titleMg,
            titleFr: lvl.titleFr || null,
            description: lvl.description || null,
          },
        });

        if (Array.isArray(lvl.sentences)) {
          for (const s of lvl.sentences) {
            const existingSentence = await prisma.wordPuzzleSentence.findFirst({
              where: { levelId: level.id, orderIndex: s.orderIndex },
            });
            if (existingSentence) {
              await prisma.wordPuzzleSentence.update({
                where: { id: existingSentence.id },
                data: {
                  malagasy: s.malagasy,
                  french: s.french,
                  hint: s.hint || null,
                  explanationMg: s.explanationMg || null,
                  explanationFr: s.explanationFr || null,
                },
              });
            } else {
              await prisma.wordPuzzleSentence.create({
                data: {
                  levelId: level.id,
                  orderIndex: s.orderIndex,
                  malagasy: s.malagasy,
                  french: s.french,
                  hint: s.hint || null,
                  explanationMg: s.explanationMg || null,
                  explanationFr: s.explanationFr || null,
                },
              });
            }
          }
        }
        wordPuzzleStats.created++;
      } catch (err) {
        console.error(`⚠️ [Seed Prod WordPuzzle] Erreur sur niveau ${lvl.levelNumber}:`, err);
        wordPuzzleStats.errors++;
      }
    }
  }
  allStats.push(wordPuzzleStats);

  // ─── 8. Mot manquant (Missing Word / Fenoy ny banga) ─────────────────────────
  const missingWordStats: SeedStats = {
    category: 'Mot manquant (MissingWordLevel)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const missingWordFile = path.join(seedDataDir, 'missing-word.data.json');
  if (fs.existsSync(missingWordFile)) {
    const rawLevels: any[] = JSON.parse(fs.readFileSync(missingWordFile, 'utf-8'));
    missingWordStats.totalInFile = rawLevels.length;

    for (const lvl of rawLevels) {
      try {
        const level = await prisma.missingWordLevel.upsert({
          where: { levelNumber: lvl.levelNumber },
          create: {
            levelNumber: lvl.levelNumber,
            titleMg: lvl.titleMg,
            titleFr: lvl.titleFr || null,
            description: lvl.description || null,
            difficulty: lvl.difficulty || 'EASY',
            passThreshold: lvl.passThreshold || 5,
            totalQuestions: Array.isArray(lvl.questions) ? lvl.questions.length : 10,
            status: 'PUBLISHED',
          },
          update: {
            titleMg: lvl.titleMg,
            titleFr: lvl.titleFr || null,
            description: lvl.description || null,
          },
        });

        if (Array.isArray(lvl.questions)) {
          for (let i = 0; i < lvl.questions.length; i++) {
            const q = lvl.questions[i];
            const existingQ = await prisma.missingWordQuestion.findFirst({
              where: { levelId: level.id, orderIndex: i + 1 },
            });
            if (existingQ) {
              await prisma.missingWordQuestion.update({
                where: { id: existingQ.id },
                data: {
                  template: Array.isArray(q.template) ? q.template : [],
                  correctWord: q.correctWord,
                  choices: Array.isArray(q.choices) ? q.choices : [],
                  french: q.french,
                  explanation: q.explanation || null,
                },
              });
            } else {
              await prisma.missingWordQuestion.create({
                data: {
                  levelId: level.id,
                  orderIndex: i + 1,
                  template: Array.isArray(q.template) ? q.template : [],
                  correctWord: q.correctWord,
                  choices: Array.isArray(q.choices) ? q.choices : [],
                  french: q.french,
                  explanation: q.explanation || null,
                  status: 'PUBLISHED',
                },
              });
            }
          }
        }
        missingWordStats.created++;
      } catch (err) {
        console.error(`⚠️ [Seed Prod MissingWord] Erreur sur niveau ${lvl.levelNumber}:`, err);
        missingWordStats.errors++;
      }
    }
  }
  allStats.push(missingWordStats);

  // ─── 9. Contes traditionnels (Angano) ───────────────────────────────────────
  const conteStats: SeedStats = {
    category: 'Contes (Angano / Conte)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const conteFile = path.join(seedDataDir, 'conte.data.json');
  if (fs.existsSync(conteFile)) {
    const rawContes: any[] = JSON.parse(fs.readFileSync(conteFile, 'utf-8'));
    conteStats.totalInFile = rawContes.length;

    for (let i = 0; i < rawContes.length; i++) {
      const c = rawContes[i];
      const baseSlug = slugify(c.title || `conte-${i + 1}`);

      try {
        const existing = await prisma.conte.findFirst({
          where: { OR: [...(c.id ? [{ id: c.id }] : []), { title: c.title }] },
        });

        let conteId: string;
        if (existing) {
          conteId = existing.id;
          await prisma.conte.update({
            where: { id: existing.id },
            data: {
              titleFr: c.titleFr,
              subtitle: c.subtitle || null,
              subtitleFr: c.subtitleFr || null,
              author: c.author || 'Angano Malagasy',
              source: c.source || null,
              moralMg: c.moral?.textMg || null,
              moralFr: c.moral?.textFr || null,
            },
          });
          conteStats.updated++;
        } else {
          let slug = baseSlug;
          let cnt = 1;
          while (await prisma.conte.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${cnt++}`;
          }

          const created = await prisma.conte.create({
            data: {
              ...(c.id ? { id: c.id } : {}),
              slug,
              title: c.title,
              titleFr: c.titleFr,
              subtitle: c.subtitle || null,
              subtitleFr: c.subtitleFr || null,
              author: c.author || 'Angano Malagasy',
              source: c.source || null,
              illustration: c.illustration?.trim() || null,
              moralMg: c.moral?.textMg || null,
              moralFr: c.moral?.textFr || null,
              variantIds: Array.isArray(c.variants || c.varient) ? c.variants || c.varient : [],
              isFeatured: i < 3,
              status: 'PUBLISHED',
            },
          });
          conteId = created.id;
          conteStats.created++;

          if (Array.isArray(c.content)) {
            for (let pIdx = 0; pIdx < c.content.length; pIdx++) {
              const p = c.content[pIdx];
              await prisma.conteParagraph.create({
                data: {
                  conteId,
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
              const tSlug = slugify(String(tName).trim());
              const tId = themeMap.get(tSlug);
              if (tId) {
                await prisma.conteTheme.upsert({
                  where: { conteId_themeId: { conteId, themeId: tId } },
                  update: {},
                  create: { conteId, themeId: tId },
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Conte] Erreur sur "${c.title}" :`, err);
        conteStats.errors++;
      }
    }
  }
  allStats.push(conteStats);

  // ─── 10. Discours traditionnels (Kabary) ────────────────────────────────────
  const kabaryStats: SeedStats = {
    category: 'Discours traditionnels (Kabary)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const kabaryFile = path.join(seedDataDir, 'kabary.data.json');
  if (fs.existsSync(kabaryFile)) {
    const rawKabaries: any[] = JSON.parse(fs.readFileSync(kabaryFile, 'utf-8'));
    kabaryStats.totalInFile = rawKabaries.length;

    for (let i = 0; i < rawKabaries.length; i++) {
      const k = rawKabaries[i];
      const baseSlug = slugify(k.title || `kabary-${i + 1}`);

      try {
        const existing = await prisma.kabary.findFirst({
          where: { OR: [...(k.id ? [{ id: k.id }] : []), { title: k.title }] },
        });

        let kabaryId: string;
        if (existing) {
          kabaryId = existing.id;
          await prisma.kabary.update({
            where: { id: existing.id },
            data: {
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
            },
          });
          kabaryStats.updated++;
        } else {
          let slug = baseSlug;
          let cnt = 1;
          while (await prisma.kabary.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${cnt++}`;
          }

          const created = await prisma.kabary.create({
            data: {
              ...(k.id ? { id: k.id } : {}),
              slug,
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
              illustration: k.illustration?.trim() || null,
              concludingProverbMg: k.concludingProverb?.mg || null,
              concludingProverbFr: k.concludingProverb?.fr || null,
              etiquetteNotesMg: k.etiquetteNotes?.mg || null,
              etiquetteNotesFr: k.etiquetteNotes?.fr || null,
              isFeatured: i < 3,
              status: 'PUBLISHED',
            },
          });
          kabaryId = created.id;
          kabaryStats.created++;

          if (Array.isArray(k.steps)) {
            for (let sIdx = 0; sIdx < k.steps.length; sIdx++) {
              const s = k.steps[sIdx];
              await prisma.kabaryStep.create({
                data: {
                  kabaryId,
                  stepNumber: s.stepNumber || sIdx + 1,
                  stepNameMg: s.stepNameMg || `Dingana ${sIdx + 1}`,
                  stepNameFr: s.stepNameFr || `Étape ${sIdx + 1}`,
                  explanationMg: s.explanationMg || null,
                  explanationFr: s.explanationFr || null,
                  textMg: s.textMg || '',
                  textFr: s.textFr || '',
                },
              });
            }
          }

          if (Array.isArray(k.themes)) {
            for (const tName of k.themes) {
              const tSlug = slugify(String(tName).trim());
              const tId = themeMap.get(tSlug);
              if (tId) {
                await prisma.kabaryTheme.upsert({
                  where: { kabaryId_themeId: { kabaryId, themeId: tId } },
                  update: {},
                  create: { kabaryId, themeId: tId },
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Kabary] Erreur sur "${k.title}" :`, err);
        kabaryStats.errors++;
      }
    }
  }
  allStats.push(kabaryStats);

  // ─── 11. Poésies & Hainteny (Tononkalo) ──────────────────────────────────────
  const poesieStats: SeedStats = {
    category: 'Poésies (Tononkalo / Poesie)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const poesieFile = path.join(seedDataDir, 'poesie.data.json');
  if (fs.existsSync(poesieFile)) {
    const rawPoesies: any[] = JSON.parse(fs.readFileSync(poesieFile, 'utf-8'));
    poesieStats.totalInFile = rawPoesies.length;

    for (let i = 0; i < rawPoesies.length; i++) {
      const p = rawPoesies[i];
      const baseSlug = slugify(p.title || `poesie-${i + 1}`);

      try {
        const existing = await prisma.poesie.findFirst({
          where: { OR: [...(p.id ? [{ id: p.id }] : []), { title: p.title }] },
        });

        if (existing) {
          await prisma.poesie.update({
            where: { id: existing.id },
            data: {
              titleFr: p.titleFr,
              author: p.author || null,
              period: p.period || null,
              category: p.category || 'tononkalo',
              explanationMg: p.explanationMg || null,
              explanationFr: p.explanationFr || null,
            },
          });
          poesieStats.updated++;
        } else {
          let slug = baseSlug;
          let cnt = 1;
          while (await prisma.poesie.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${cnt++}`;
          }

          const created = await prisma.poesie.create({
            data: {
              ...(p.id ? { id: p.id } : {}),
              slug,
              title: p.title,
              titleFr: p.titleFr,
              author: p.author || 'Mpanoratra Malagasy',
              period: p.period || null,
              category: p.category || 'tononkalo',
              explanationMg: p.explanationMg || null,
              explanationFr: p.explanationFr || null,
              isFeatured: i < 3,
              status: 'PUBLISHED',
            },
          });

          if (Array.isArray(p.stanzas)) {
            for (let sIdx = 0; sIdx < p.stanzas.length; sIdx++) {
              const st = p.stanzas[sIdx];
              await prisma.poesieStanza.create({
                data: {
                  poesieId: created.id,
                  stanzaNumber: sIdx + 1,
                  versesMg: Array.isArray(st.versesMg) ? st.versesMg : [],
                  versesFr: Array.isArray(st.versesFr) ? st.versesFr : [],
                },
              });
            }
          }
          poesieStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Poesie] Erreur sur "${p.title}" :`, err);
        poesieStats.errors++;
      }
    }
  }
  allStats.push(poesieStats);

  // ─── 12. Récitations (Tsianjery) ────────────────────────────────────────────
  const recitationStats: SeedStats = {
    category: 'Récitations (Tsianjery)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const recitationFile = path.join(seedDataDir, 'recitation.data.json');
  if (fs.existsSync(recitationFile)) {
    const rawRecitations: any[] = JSON.parse(fs.readFileSync(recitationFile, 'utf-8'));
    recitationStats.totalInFile = rawRecitations.length;

    for (let i = 0; i < rawRecitations.length; i++) {
      const r = rawRecitations[i];
      const baseSlug = slugify(r.title || `recitation-${i + 1}`);

      try {
        const existing = await prisma.recitation.findFirst({
          where: { OR: [...(r.id ? [{ id: r.id }] : []), { title: r.title }] },
        });

        if (existing) {
          await prisma.recitation.update({
            where: { id: existing.id },
            data: {
              titleFr: r.titleFr || existing.titleFr,
              author: r.author || existing.author,
              description: r.description || existing.description,
              durationMinutes: r.durationMinutes || existing.durationMinutes,
              contentLines: Array.isArray(r.content) ? r.content : existing.contentLines,
              references: Array.isArray(r.references) ? r.references : existing.references,
              tags: Array.isArray(r.tags) ? r.tags : existing.tags,
            },
          });
          recitationStats.updated++;
        } else {
          let slug = baseSlug;
          let cnt = 1;
          while (await prisma.recitation.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${cnt++}`;
          }

          await prisma.recitation.create({
            data: {
              ...(r.id ? { id: r.id } : {}),
              slug,
              title: r.title,
              titleFr: r.titleFr || r.title,
              author: r.author || 'Lovantsofina',
              description: r.description || null,
              durationMinutes: r.durationMinutes || null,
              contentLines: Array.isArray(r.content) ? r.content : [],
              references: Array.isArray(r.references) ? r.references : [],
              tags: Array.isArray(r.tags) ? r.tags : [],
              isFeatured: i < 3,
              status: 'PUBLISHED',
            },
          });
          recitationStats.created++;
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Recitation] Erreur sur "${r.title}" :`, err);
        recitationStats.errors++;
      }
    }
  }
  allStats.push(recitationStats);

  // ─── 13. Zodiaque Malgache (Vintana) ────────────────────────────────────────
  const vintanaStats: SeedStats = {
    category: 'Zodiaque Malgache (VintanaSign)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const vintanaFile = path.join(seedDataDir, 'vintana.data.json');
  if (fs.existsSync(vintanaFile)) {
    const rawVintana: any[] = JSON.parse(fs.readFileSync(vintanaFile, 'utf-8'));
    vintanaStats.totalInFile = rawVintana.length;

    for (const v of rawVintana) {
      try {
        await prisma.vintanaSign.upsert({
          where: { nameMg: v.name },
          create: {
            nameMg: v.name,
            nameFr: v.nameFr || v.name,
            element: v.element || 'tany',
            description: v.personalityMg || v.personalityFr || '',
            luckyColor: v.cardinalFr || null,
            luckyDay: v.luckyDayMg || v.luckyDayFr || null,
          },
          update: {
            nameFr: v.nameFr || v.name,
            element: v.element || 'tany',
            description: v.personalityMg || v.personalityFr || '',
            luckyColor: v.cardinalFr || null,
            luckyDay: v.luckyDayMg || v.luckyDayFr || null,
          },
        });
        vintanaStats.created++;
      } catch (err) {
        console.error(`⚠️ [Seed Prod Vintana] Erreur sur "${v.name}" :`, err);
        vintanaStats.errors++;
      }
    }
  }
  allStats.push(vintanaStats);

  // ─── 14. Contenus Civiques Institutionnels ──────────────────────────────────
  const civicContentStats: SeedStats = {
    category: 'Contenus Civiques (CivicContent)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const CIVIC_DOC_FILES = [
    { file: 'droits-et-vote.data.json', subCategory: CivicSubCategory.DROITS_VOTE },
    { file: 'civic-institution.data.json', subCategory: CivicSubCategory.INSTITUTION },
    { file: 'symboles-histoire.data.json', subCategory: CivicSubCategory.SYMBOLES_HISTOIRE },
    { file: 'vivre-ensemble.data.json', subCategory: CivicSubCategory.VIVRE_ENSEMBLE },
    { file: 'ecologie-civisme.data.json', subCategory: CivicSubCategory.ECOLOGIE_CIVISME },
  ];

  for (const { file: fileName, subCategory } of CIVIC_DOC_FILES) {
    const fPath = path.join(seedDataDir, 'civique', fileName);
    if (!fs.existsSync(fPath)) continue;

    const rawList: any[] = JSON.parse(fs.readFileSync(fPath, 'utf-8'));
    civicContentStats.totalInFile += rawList.length;

    for (const item of rawList) {
      const titleFr = typeof item.title === 'object' && item.title !== null
        ? (item.title.fr || item.title.mg || '')
        : (item.titleFr || item.title || '');
      const titleMg = typeof item.title === 'object' && item.title !== null
        ? (item.title.mg || item.title.fr || '')
        : (item.titleMg || item.title || '');

      const summaryFr = typeof item.summary === 'object' && item.summary !== null
        ? (item.summary.fr || null)
        : (item.summaryFr || null);
      const summaryMg = typeof item.summary === 'object' && item.summary !== null
        ? (item.summary.mg || null)
        : (item.summaryMg || null);

      const contentFr = Array.isArray(item.contentFr)
        ? item.contentFr
        : (typeof item.content === 'object' && Array.isArray(item.content?.fr) ? item.content.fr : []);
      const contentMg = Array.isArray(item.contentMg)
        ? item.contentMg
        : (typeof item.content === 'object' && Array.isArray(item.content?.mg) ? item.content.mg : []);

      const themes = Array.isArray(item.themes)
        ? item.themes
        : (Array.isArray(item.theme) ? item.theme : []);
      const sources = Array.isArray(item.sources) ? item.sources : [];

      const rawSlug = item.slug || item.id || slugify(titleFr) || slugify(titleMg) || `civic-${subCategory.toLowerCase()}-${civicContentStats.totalInFile}`;
      const slug = slugify(rawSlug) || `civic-${Date.now()}`;

      try {
        const existing = await prisma.civicContent.findUnique({ where: { slug } });
        let contentId = existing?.id;
        if (!existing) {
          const created = await prisma.civicContent.create({
            data: {
              slug,
              subCategory,
              titleFr: titleFr || 'Document civique',
              titleMg: titleMg || 'Tahirin-kevitra ara-pirenena',
              summaryFr,
              summaryMg,
              contentFr,
              contentMg,
              themes,
              sources,
              imageUrl: item.imageUrl || null,
              status: 'PUBLISHED',
            },
          });
          contentId = created.id;
          civicContentStats.created++;
        } else {
          await prisma.civicContent.update({
            where: { id: existing.id },
            data: {
              titleFr: titleFr || existing.titleFr,
              titleMg: titleMg || existing.titleMg,
              summaryFr: summaryFr || existing.summaryFr,
              summaryMg: summaryMg || existing.summaryMg,
              contentFr: contentFr.length > 0 ? contentFr : existing.contentFr,
              contentMg: contentMg.length > 0 ? contentMg : existing.contentMg,
              themes: themes.length > 0 ? themes : existing.themes,
              sources: sources.length > 0 ? sources : existing.sources,
            },
          });
          civicContentStats.updated++;
        }

        // Structure roles si présents
        if (contentId && Array.isArray(item.structure) && item.structure.length > 0) {
          for (let sIdx = 0; sIdx < item.structure.length; sIdx++) {
            const s = item.structure[sIdx];
            const sTitleFr = typeof s.title === 'object' ? (s.title?.fr || s.title?.mg || '') : (s.titleFr || s.title || '');
            const sTitleMg = typeof s.title === 'object' ? (s.title?.mg || s.title?.fr || '') : (s.titleMg || s.title || '');
            const sRoleFr = typeof s.role === 'object' ? (s.role?.fr || s.role?.mg || '') : (s.roleFr || s.role || '');
            const sRoleMg = typeof s.role === 'object' ? (s.role?.mg || s.role?.fr || '') : (s.roleMg || s.role || '');

            const existingRole = await prisma.civicStructureRole.findFirst({
              where: { civicContentId: contentId, orderIndex: sIdx },
            });

            if (!existingRole) {
              await prisma.civicStructureRole.create({
                data: {
                  civicContentId: contentId,
                  orderIndex: sIdx,
                  titleFr: sTitleFr,
                  titleMg: sTitleMg,
                  roleFr: sRoleFr,
                  roleMg: sRoleMg,
                },
              });
            }
          }
        }
      } catch (err) {
        console.error(`⚠️ [Seed Prod Civique] Erreur sur "${slug}" :`, err);
        civicContentStats.errors++;
      }
    }
  }
  allStats.push(civicContentStats);

  // ─── 15. Histoire, Mémoire & Patrimoine (Constantes vérifiées) ───────────────
  const historyStats: SeedStats = {
    category: 'Patrimoine, Mémoire & Histoire',
    totalInFile:
      DEFAULT_CIVIC_LESSONS.length +
      DEFAULT_PRESIDENTS.length +
      DEFAULT_BANKNOTES.length +
      DEFAULT_PROVINCE_BLASONS.length +
      DEFAULT_NATURE_EMBLEMS.length +
      DEFAULT_HISTORY_DATES.length +
      DEFAULT_NATIONAL_EMBLEMS.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    for (const item of DEFAULT_CIVIC_LESSONS) {
      const existing = await prisma.civicLesson.findUnique({ where: { id: item.id } });
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
      historyStats.created++;
    }

    for (const item of DEFAULT_PRESIDENTS) {
      const existing = await prisma.president.findUnique({ where: { id: item.id } });
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
      historyStats.created++;
    }

    for (const item of DEFAULT_BANKNOTES) {
      const existing = await prisma.banknote.findUnique({ where: { id: item.id } });
      const preservedImage = existing?.imageUrl || item.imageUrl || null;
      const preservedImageVerso = existing?.imageUrlVerso || item.imageUrlVerso || null;
      const preservedComingSoon =
        existing?.isComingSoon !== undefined ? existing.isComingSoon : Boolean(item.isComingSoon);

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
      historyStats.created++;
    }

    for (const item of DEFAULT_PROVINCE_BLASONS) {
      const existing = await prisma.provinceBlason.findUnique({ where: { id: item.id } });
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
      historyStats.created++;
    }

    for (const item of DEFAULT_NATURE_EMBLEMS) {
      const existing = await prisma.natureEmblem.findUnique({ where: { id: item.id } });
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
      historyStats.created++;
    }

    for (const item of DEFAULT_HISTORY_DATES) {
      const existing = await prisma.historyDate.findUnique({ where: { id: item.id } });
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
      historyStats.created++;
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
          imageUrl: item.imageUrl,
          government: item.government,
          descriptionFr: item.descriptionFr,
          descriptionMg: item.descriptionMg,
          notesFr: item.notesFr,
          notesMg: item.notesMg,
        },
      });
      historyStats.created++;
    }
  } catch (err) {
    console.error('⚠️ [Seed Prod Histoire/Patrimoine] Erreur lors de l\'upsert des constantes :', err);
    historyStats.errors++;
  }
  allStats.push(historyStats);

  // ─── 16. Proverbe du jour ───────────────────────────────────────────────────
  const dailyProverbCount = await prisma.dailyProverb.count();
  if (dailyProverbCount === 0) {
    const firstP = await prisma.malagasyItem.findFirst({ where: { category: 'PROVERBE' } });
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
    }
  }

  // ─── Synthèse & Observabilité Consolidée ────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════════════════════');
  console.log('🎉 COMPTE RENDU DU SEED INTÉGRAL DE PRODUCTION (KANTO MG)');
  console.log('═══════════════════════════════════════════════════════════════════════════════════════');
  for (const s of allStats) {
    console.log(
      `  • ${s.category.padEnd(42)} : ${String(s.created).padStart(3)} créé(s), ${String(s.updated).padStart(3)} mis à jour, ${String(s.unchanged).padStart(3)} inchangé(s), ${String(s.errors).padStart(2)} erreur(s)`
    );
  }
  console.log('═══════════════════════════════════════════════════════════════════════════════════════\n');

  const totalErrors = allStats.reduce((sum, s) => sum + s.errors, 0);
  if (totalErrors > 0) {
    console.warn(`⚠️ [Seed Prod] ${totalErrors} anomalie(s) rencontrée(s).`);
  } else {
    console.log('✨ [Seed Prod] Synchronisation intégrale 100% réussie. Tous les jeux et contenus sont prêts.');
  }
}

seedProduction()
  .catch((e) => {
    console.error('❌ Erreur critique lors du seed production :', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch {}
    process.exit(process.exitCode || 0);
  });
