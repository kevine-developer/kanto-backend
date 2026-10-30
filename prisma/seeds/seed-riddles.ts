import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient, DifficultyLevel } from '../../generated/prisma/client.js';
import { SeedCategoryStats, RawRiddle } from './types.js';
import { validateRiddlesBatch } from './validator.js';

export async function seedRiddles(
  prisma: PrismaClient,
  seedDataDir: string,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Devinettes (Ankamantatra)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  // Chargement des devinettes depuis riddles.data.js ou riddles.data.ts
  let riddlesList: RawRiddle[] = [];
  try {
    const dataModule = await import('../seed-data/riddles.data.js');
    riddlesList = dataModule.RIDDLES_DATA || [];
  } catch {
    // Si import TS direct sous tsx
    try {
      const dataModule = await import('../seed-data/riddles.data.ts');
      riddlesList = dataModule.RIDDLES_DATA || [];
    } catch (err) {
      console.error('❌ [Seed Devinettes] Impossible de charger RIDDLES_DATA:', err);
      stats.errors++;
      return stats;
    }
  }

  const validation = validateRiddlesBatch(riddlesList);
  if (!validation.isValid) {
    console.warn(`⚠️ [Seed Devinettes] ${validation.issues.length} anomalie(s) dans riddles.data.`);
  }

  stats.totalInFile = riddlesList.length;

  for (const r of riddlesList) {
    if (!r.riddleMg || !r.correctAnswer) {
      stats.skipped++;
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
        await prisma.riddleQuestion.update({
          where: { id: existing.id },
          data: riddleData,
        });
        stats.updated++;
      } else {
        await prisma.riddleQuestion.create({
          data: {
            ...(r.id ? { id: r.id } : {}),
            riddleMg: r.riddleMg.trim(),
            ...riddleData,
          },
        });
        stats.created++;
      }
    } catch (err) {
      console.error(`⚠️ [Seed Devinettes] Erreur sur la devinette "${r.riddleMg.substring(0, 30)}..." :`, err);
      stats.errors++;
    }
  }

  return stats;
}
