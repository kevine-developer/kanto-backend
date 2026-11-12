import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient, DifficultyLevel } from '../../generated/prisma/client.js';
import { SeedCategoryStats, RawQuizQuestion } from './types.js';
import { validateQuizBatch } from './validator.js';

export async function seedQuiz(
  prisma: PrismaClient,
  seedDataDir: string,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Quiz (Civique & Vérifié)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const processedPrompts = new Set<string>();

  // 1. Quiz vérifiés (Priorité haute, corpus de référence)
  const verifiedPath = path.join(seedDataDir, 'quiz-verified.data.json');
  if (fs.existsSync(verifiedPath)) {
    try {
      const rawVerified: RawQuizQuestion[] = JSON.parse(fs.readFileSync(verifiedPath, 'utf-8'));
      const validation = validateQuizBatch(rawVerified);
      if (!validation.isValid) {
        console.warn(`⚠️ [Seed Quiz] ${validation.issues.length} anomalie(s) dans quiz-verified.data.json.`);
      }

      stats.totalInFile += rawVerified.length;

      for (const q of rawVerified) {
        const promptFr = q.promptFr || q.prompt;
        const promptMg = q.promptMg;
        if (!promptFr && !promptMg) {
          stats.skipped++;
          continue;
        }

        const mainPrompt = (promptFr || promptMg)!.trim();
        const normKey = mainPrompt.toLowerCase();
        if (processedPrompts.has(normKey)) {
          stats.skipped++;
          continue;
        }
        processedPrompts.add(normKey);

        const diff: DifficultyLevel =
          q.difficulty?.toUpperCase() === 'HARD'
            ? DifficultyLevel.HARD
            : q.difficulty?.toUpperCase() === 'MEDIUM'
              ? DifficultyLevel.MEDIUM
              : DifficultyLevel.EASY;

        const choices = q.optionsFr || q.choices || [];
        const answerIndex = typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : typeof q.answerIndex === 'number' ? q.answerIndex : 0;

        const quizData = {
          category: q.category || 'culture_generale',
          prompt: mainPrompt,
          choices,
          answerIndex,
          explanation: q.explanation || '',
          explanationMg: promptMg || null,
          difficulty: diff,
          tags: [q.category, q.contentSourceType].filter((t): t is string => Boolean(t)),
          imageUrl: q.imageUrl || null,
          imageAlt: q.imageAlt || null,
          sourceReference: q.sourceReference || null,
          sourceUrl: q.sourceUrl || null,
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
                ...(promptMg ? [{ prompt: { equals: promptMg.trim(), mode: 'insensitive' as const } }] : []),
              ],
            },
          });

          if (existing) {
            await prisma.civicQuizQuestion.update({
              where: { id: existing.id },
              data: quizData,
            });
            stats.updated++;
          } else {
            await prisma.civicQuizQuestion.create({
              data: {
                ...(q.id ? { id: q.id } : {}),
                ...quizData,
              },
            });
            stats.created++;
          }
        } catch (err) {
          console.error(`⚠️ [Seed Quiz] Erreur sur la question "${mainPrompt.substring(0, 30)}..." :`, err);
          stats.errors++;
        }
      }
    } catch (err) {
      console.error('❌ [Seed Quiz] Erreur de lecture de quiz-verified.data.json:', err);
      stats.errors++;
    }
  }

  // 2. Quiz civiques généralistes
  const civicQuizPath = path.join(seedDataDir, 'civic-quiz.data.json');
  if (fs.existsSync(civicQuizPath)) {
    try {
      const rawCivic: RawQuizQuestion[] = JSON.parse(fs.readFileSync(civicQuizPath, 'utf-8'));
      stats.totalInFile += rawCivic.length;

      for (const q of rawCivic) {
        const prompt = (q.prompt || q.promptFr)?.trim();
        if (!prompt) {
          stats.skipped++;
          continue;
        }

        const normKey = prompt.toLowerCase();
        if (processedPrompts.has(normKey)) {
          stats.skipped++;
          continue;
        }
        processedPrompts.add(normKey);

        const diff: DifficultyLevel =
          q.difficulty?.toUpperCase() === 'HARD'
            ? DifficultyLevel.HARD
            : q.difficulty?.toUpperCase() === 'MEDIUM'
              ? DifficultyLevel.MEDIUM
              : DifficultyLevel.EASY;

        try {
          const existing = await prisma.civicQuizQuestion.findFirst({
            where: {
              OR: [
                ...(q.id ? [{ id: q.id }] : []),
                { prompt: { equals: prompt, mode: 'insensitive' as const } },
              ],
            },
          });

          if (existing) {
            stats.unchanged++;
          } else {
            await prisma.civicQuizQuestion.create({
              data: {
                ...(q.id ? { id: q.id } : {}),
                category: q.category || 'droits_devoirs_vote',
                prompt,
                choices: Array.isArray(q.choices) ? q.choices : [],
                answerIndex: typeof q.answerIndex === 'number' ? q.answerIndex : 0,
                explanation: q.explanation || '',
                difficulty: diff,
                tags: Array.isArray(q.tags) ? q.tags : [],
                status: 'PUBLISHED',
              },
            });
            stats.created++;
          }
        } catch (err) {
          console.error(`⚠️ [Seed Quiz] Erreur sur la question civique "${prompt.substring(0, 30)}..." :`, err);
          stats.errors++;
        }
      }
    } catch (err) {
      console.error('❌ [Seed Quiz] Erreur de lecture de civic-quiz.data.json:', err);
      stats.errors++;
    }
  }

  // 3. Quiz Géographie & Trésors Naturels (50 questions vérifiées sur 5 niveaux)
  const geoPath = path.join(seedDataDir, 'madagascar-geography-nature-quizzes.json');
  const sourcesPath = path.join(seedDataDir, 'sources-references.json');
  if (fs.existsSync(geoPath)) {
    try {
      const geoPayload = JSON.parse(fs.readFileSync(geoPath, 'utf-8'));
      const rawGeoQuestions = geoPayload.questions || [];

      // Dictionnaire des sources vérifiées (traçabilité documentaire)
      const sourcesMap = new Map<string, any>();
      if (fs.existsSync(sourcesPath)) {
        try {
          const sourcesPayload = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
          if (Array.isArray(sourcesPayload.sources)) {
            for (const s of sourcesPayload.sources) {
              sourcesMap.set(s.id, s);
            }
          }
        } catch (srcErr) {
          console.warn('⚠️ [Seed Quiz] Impossible de lire sources-references.json:', srcErr);
        }
      }

      stats.totalInFile += rawGeoQuestions.length;

      for (const q of rawGeoQuestions) {
        const prompt = (q.question || q.prompt)?.trim();
        if (!prompt) {
          stats.skipped++;
          continue;
        }

        const normKey = prompt.toLowerCase();
        if (processedPrompts.has(normKey)) {
          stats.skipped++;
          continue;
        }
        processedPrompts.add(normKey);

        const diff: DifficultyLevel =
          q.difficulty?.toUpperCase() === 'DIFFICULT' || q.difficulty?.toUpperCase() === 'HARD'
            ? DifficultyLevel.HARD
            : q.difficulty?.toUpperCase() === 'INTERMEDIATE' || q.difficulty?.toUpperCase() === 'MEDIUM'
              ? DifficultyLevel.MEDIUM
              : DifficultyLevel.EASY;

        const choices = q.options
          ? [q.options.A, q.options.B, q.options.C, q.options.D]
          : q.choices || [];

        let answerIndex = 0;
        if (typeof q.answerIndex === 'number') {
          answerIndex = q.answerIndex;
        } else if (q.correctOption) {
          const mapOpt: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          answerIndex = mapOpt[q.correctOption] ?? 0;
        }

        const source = q.sourceId ? sourcesMap.get(q.sourceId) : null;
        const sourceRef = source
          ? `${source.organization} — ${source.title}`
          : q.sourceId || null;
        const sourceUrl = source?.url || null;

        const explanationText = q.explanations?.correct
          ? `${q.explanations.correct}${q.hint ? `\n\n💡 Indice : ${q.hint}` : ''}`
          : q.explanation || '';

        const quizData = {
          category: 'geographie_regions',
          prompt,
          choices,
          answerIndex,
          explanation: explanationText,
          explanationMg: q.hint ? `Toro-lalana: ${q.hint}` : null,
          difficulty: diff,
          tags: [
            'geographie_regions',
            q.category,
            q.theme,
            q.sourceId,
            q.levelId,
          ].filter((t): t is string => Boolean(t)),
          imageUrl: q.imageUrl || null,
          imageAlt: q.imageAlt || null,
          sourceReference: sourceRef,
          sourceUrl: sourceUrl,
          contentSourceType: 'GEOGRAPHY_NATURE',
          contentSourceId: q.sourceId || null,
          levelNumber: typeof q.levelNumber === 'number' ? q.levelNumber : 1,
          status: 'PUBLISHED' as const,
        };

        try {
          const existing = await prisma.civicQuizQuestion.findFirst({
            where: {
              OR: [
                ...(q.id ? [{ id: q.id }] : []),
                { prompt: { equals: prompt, mode: 'insensitive' as const } },
              ],
            },
          });

          if (existing) {
            await prisma.civicQuizQuestion.update({
              where: { id: existing.id },
              data: quizData,
            });
            stats.updated++;
          } else {
            await prisma.civicQuizQuestion.create({
              data: {
                ...(q.id ? { id: q.id } : {}),
                ...quizData,
              },
            });
            stats.created++;
          }
        } catch (err) {
          console.error(`⚠️ [Seed Quiz] Erreur sur la question géographie "${prompt.substring(0, 30)}..." :`, err);
          stats.errors++;
        }
      }
    } catch (err) {
      console.error('❌ [Seed Quiz] Erreur de lecture de madagascar-geography-nature-quizzes.json:', err);
      stats.errors++;
    }
  }

  return stats;
}
