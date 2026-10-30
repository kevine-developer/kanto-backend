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

  return stats;
}
