import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, DifficultyLevel, TrueFalseTheme, WordRarity } from '../../generated/prisma/client.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function slugify(text: string): string {
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
 * Localise le dossier `prisma/seed-data` de manière robuste quel que soit l'environnement
 * (exécuté compilé depuis dist/src/scripts ou source depuis src/scripts ou à la racine)
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
  console.log('🚀 [Kanto Backend] Démarrage du seed idempotent de production...');
  await ensureSchemaColumns();
  const seedDataDir = findSeedDataDir();
  console.log(`📁 [Kanto Backend] Répertoire de données : ${seedDataDir}`);

  const allStats: SeedStats[] = [];

  // Initialisation du cache des thèmes
  const themeMap = new Map<string, string>();
  const existingThemes = await prisma.theme.findMany();
  for (const t of existingThemes) {
    themeMap.set(t.slug, t.id);
  }

  // ─── 1. Proverbes, Dictons & Expressions de référence ────────────────────────
  const itemsStats: SeedStats = {
    category: 'Proverbes & Dictons (MalagasyItem)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const malagasyItemsFile = path.join(seedDataDir, 'malagasy-items.data.json');
  if (fs.existsSync(malagasyItemsFile)) {
    const rawItems: any[] = JSON.parse(fs.readFileSync(malagasyItemsFile, 'utf-8'));
    itemsStats.totalInFile = rawItems.length;

    for (let i = 0; i < rawItems.length; i++) {
      const item = rawItems[i];
      if (!item.malagasy || !item.french || !item.meaning) {
        itemsStats.skipped++;
        continue;
      }

      const cleanMalagasy = item.malagasy.trim();
      let category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' = 'PROVERBE';
      const rawCat = String(item.category || '').toUpperCase();
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
                  data: {
                    dialectName: dName,
                    text: v.text,
                    itemId: targetId,
                  },
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
              const existingTheme = await prisma.theme.findFirst({
                where: { OR: [{ slug: tSlug }, { nameFr: trimmedTheme }, { nameMg: trimmedTheme }] },
              });
              if (existingTheme) {
                tId = existingTheme.id;
              } else {
                const newT = await prisma.theme.create({
                  data: { nameFr: trimmedTheme, nameMg: trimmedTheme, slug: tSlug },
                });
                tId = newT.id;
              }
              themeMap.set(tSlug, tId);
            }

            await prisma.malagasyItemTheme.upsert({
              where: {
                itemId_themeId: {
                  itemId: targetId,
                  themeId: tId,
                },
              },
              update: {},
              create: {
                itemId: targetId,
                themeId: tId,
              },
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

  // ─── 2. Citations & Auteurs de référence ──────────────────────────────────────
  const citationsStats: SeedStats = {
    category: 'Citations & Auteurs (Citation)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const citationsFile = path.join(seedDataDir, 'citations.data.json');
  if (fs.existsSync(citationsFile)) {
    const rawCitations: any[] = JSON.parse(fs.readFileSync(citationsFile, 'utf-8'));
    citationsStats.totalInFile = rawCitations.length;

    for (const c of rawCitations) {
      if (!c.citationMg || !c.citationFr) {
        citationsStats.skipped++;
        continue;
      }

      const cleanCitationMg = c.citationMg.trim();
      const sourceName = (c.source || c.sourceName || 'Anonyme').trim();

      try {
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
            existing.citationFr !== c.citationFr ||
            existing.sourceName !== sourceName ||
            existing.contexte !== (c.contexte || null) ||
            existing.authorId !== authorId;

          if (hasDiff) {
            await prisma.citation.update({
              where: { id: existing.id },
              data: {
                citationFr: c.citationFr,
                sourceName,
                contexte: c.contexte || null,
                authorId,
                isPremium: Boolean(c.isPremium),
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
              citationFr: c.citationFr,
              sourceName,
              contexte: c.contexte || null,
              authorId,
              isPremium: Boolean(c.isPremium),
              status: 'PUBLISHED',
            },
          });
          targetId = created.id;
          citationsStats.created++;
        }

        if (Array.isArray(c.themes)) {
          for (const tName of c.themes) {
            const trimmedTheme = String(tName).trim();
            if (!trimmedTheme) continue;
            const tSlug = slugify(trimmedTheme);
            let tId = themeMap.get(tSlug);
            if (!tId) {
              const existingTheme = await prisma.theme.findFirst({
                where: { OR: [{ slug: tSlug }, { nameFr: trimmedTheme }, { nameMg: trimmedTheme }] },
              });
              if (existingTheme) {
                tId = existingTheme.id;
              } else {
                const newT = await prisma.theme.create({
                  data: { nameFr: trimmedTheme, nameMg: trimmedTheme, slug: tSlug },
                });
                tId = newT.id;
              }
              themeMap.set(tSlug, tId);
            }

            await prisma.citationTheme.upsert({
              where: {
                citationId_themeId: {
                  citationId: targetId,
                  themeId: tId,
                },
              },
              update: {},
              create: {
                citationId: targetId,
                themeId: tId,
              },
            });
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
            existing.phonetic !== (item.phonetic || null) ||
            existing.wordClassMg !== item.wordClassMg ||
            existing.wordClassFr !== item.wordClassFr ||
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

  // ─── 4. Quiz vérifiés (CivicQuizQuestion) ─────────────────────────────────────
  const quizStats: SeedStats = {
    category: 'Quiz vérifiés (CivicQuizQuestion)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const quizFile = path.join(seedDataDir, 'quiz-verified.data.json');
  if (fs.existsSync(quizFile)) {
    const rawQuiz: any[] = JSON.parse(fs.readFileSync(quizFile, 'utf-8'));
    quizStats.totalInFile = rawQuiz.length;

    for (const q of rawQuiz) {
      const promptFr = q.promptFr || q.prompt;
      const promptMg = q.promptMg;
      if (!promptFr && !promptMg) {
        quizStats.skipped++;
        continue;
      }
      const mainPrompt = (promptFr || promptMg)!.trim();

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

  // ─── 5. Questions Vrai ou Faux vérifiées (TrueFalseQuestion) ──────────────────
  const tfStats: SeedStats = {
    category: 'Vrai ou Faux vérifiés (TrueFalseQuestion)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const tfFile = path.join(seedDataDir, 'true-false-verified.data.json');
  if (fs.existsSync(tfFile)) {
    const rawTf: any[] = JSON.parse(fs.readFileSync(tfFile, 'utf-8'));
    tfStats.totalInFile = rawTf.length;

    for (const vf of rawTf) {
      const questionMg = (vf.promptMg || vf.questionMg)?.trim();
      const questionFr = (vf.promptFr || vf.questionFr)?.trim();
      if (!questionMg && !questionFr) {
        tfStats.skipped++;
        continue;
      }
      const mainQ = (questionMg || questionFr)!;

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
            existing.difficulty !== riddleData.difficulty ||
            existing.sourceReference !== riddleData.sourceReference ||
            JSON.stringify(existing.options) !== JSON.stringify(riddleData.options) ||
            JSON.stringify(existing.acceptedAnswers) !== JSON.stringify(riddleData.acceptedAnswers);

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

  // ─── Synthèse & Observabilité ────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════════════════════');
  console.log('🎉 COMPTE RENDU DU SEED DE PRODUCTION (KANTO MG)');
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
    console.log('✨ [Seed Prod] Synchronisation 100% réussie. Intégrité des données garantie.');
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
