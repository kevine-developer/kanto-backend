import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient, DifficultyLevel, TrueFalseTheme } from '../../generated/prisma/client.js';
import { SeedCategoryStats, RawTrueFalseQuestion } from './types.js';
import { validateTrueFalseBatch } from './validator.js';

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
  culture: TrueFalseTheme.CULT,
  general: TrueFalseTheme.GEN,
  geographie: TrueFalseTheme.GEO,
  histoire: TrueFalseTheme.HIST,
  litterature: TrueFalseTheme.LITT,
  proverbes: TrueFalseTheme.PROV,
};

export async function seedTrueFalse(
  prisma: PrismaClient,
  seedDataDir: string,
): Promise<SeedCategoryStats> {
  const stats: SeedCategoryStats = {
    category: 'Vrai ou Faux (Marina sa Diso)',
    totalInFile: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  const processedQuestions = new Set<string>();

  // 1. Questions vérifiées prioritaires
  const verifiedPath = path.join(seedDataDir, 'true-false-verified.data.json');
  if (fs.existsSync(verifiedPath)) {
    try {
      const rawVerified: RawTrueFalseQuestion[] = JSON.parse(fs.readFileSync(verifiedPath, 'utf-8'));
      const validation = validateTrueFalseBatch(rawVerified);
      if (!validation.isValid) {
        console.warn(`⚠️ [Seed Vrai/Faux] ${validation.issues.length} anomalie(s) dans true-false-verified.data.json.`);
      }

      stats.totalInFile += rawVerified.length;

      for (const vf of rawVerified) {
        const questionMg = (vf.promptMg || vf.questionMg)?.trim();
        const questionFr = (vf.promptFr || vf.questionFr)?.trim();

        if (!questionMg && !questionFr) {
          stats.skipped++;
          continue;
        }

        const mainQuestion = (questionMg || questionFr)!;
        const normKey = mainQuestion.toLowerCase();
        if (processedQuestions.has(normKey)) {
          stats.skipped++;
          continue;
        }
        processedQuestions.add(normKey);

        const diff: DifficultyLevel =
          vf.difficulty?.toUpperCase() === 'HARD'
            ? DifficultyLevel.HARD
            : vf.difficulty?.toUpperCase() === 'MEDIUM'
              ? DifficultyLevel.MEDIUM
              : DifficultyLevel.EASY;

        const theme = (vf.category && TF_THEME_CATEGORY_MAP[vf.category]) || TrueFalseTheme.GEN;

        const tfData = {
          questionMg: questionMg || mainQuestion,
          questionFr: questionFr || null,
          isTrue: Boolean(vf.isTrue),
          explanationMg: vf.explanationTrueMg || vf.explanationMg || vf.explanation || '',
          explanationFr: vf.explanationFr || vf.explanation || '',
          explanationTrueFr: vf.explanationTrueFr || null,
          explanationTrueMg: vf.explanationTrueMg || null,
          explanationFalseFr: vf.explanationFalseFr || null,
          explanationFalseMg: vf.explanationFalseMg || null,
          theme,
          difficulty: diff,
          source: vf.sourceReference || vf.source || null,
          sourceReference: vf.sourceReference || null,
          image: vf.imageUrl || vf.image || null,
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
            stats.updated++;
          } else {
            await prisma.trueFalseQuestion.create({
              data: {
                ...(vf.id ? { id: vf.id } : {}),
                ...tfData,
              },
            });
            stats.created++;
          }
        } catch (err) {
          console.error(`⚠️ [Seed Vrai/Faux] Erreur sur la question "${mainQuestion.substring(0, 30)}..." :`, err);
          stats.errors++;
        }
      }
    } catch (err) {
      console.error('❌ [Seed Vrai/Faux] Erreur de lecture de true-false-verified.data.json:', err);
      stats.errors++;
    }
  }

  // 2. Questions thématiques secondaires (tf-*.data.json)
  const TF_FILES = [
    { file: 'tf-culture.data.json', defaultTheme: TrueFalseTheme.CULT },
    { file: 'tf-general.data.json', defaultTheme: TrueFalseTheme.GEN },
    { file: 'tf-geographie.data.json', defaultTheme: TrueFalseTheme.GEO },
    { file: 'tf-histoire.data.json', defaultTheme: TrueFalseTheme.HIST },
    { file: 'tf-litterature.data.json', defaultTheme: TrueFalseTheme.LITT },
    { file: 'tf-proverbes.data.json', defaultTheme: TrueFalseTheme.PROV },
  ];

  for (const source of TF_FILES) {
    const fPath = path.join(seedDataDir, source.file);
    if (!fs.existsSync(fPath)) continue;

    try {
      const rawData: any = JSON.parse(fs.readFileSync(fPath, 'utf-8'));
      const rawList: any[] = Array.isArray(rawData) ? rawData : (rawData.questions || []);
      stats.totalInFile += rawList.length;

      for (const item of rawList) {
        const questionMg = (item.questionMg || item.promptMg || item.questionText)?.trim();
        const questionFr = (item.questionFr || item.promptFr || item.questionTextFr || item.questionText)?.trim();

        if (!questionMg && !questionFr) {
          stats.skipped++;
          continue;
        }

        const normKey = (questionMg || questionFr)!.toLowerCase();
        if (processedQuestions.has(normKey)) {
          stats.skipped++;
          continue;
        }
        processedQuestions.add(normKey);

        const diffRaw = String(item.levelId || item.difficulty || 'EASY').toUpperCase();
        let diff: DifficultyLevel = DifficultyLevel.EASY;
        if (diffRaw === 'HARD') diff = DifficultyLevel.HARD;
        else if (diffRaw === 'MEDIUM') diff = DifficultyLevel.MEDIUM;
        else if (diffRaw === 'EXPERT') diff = DifficultyLevel.EXPERT;

        try {
          const existing = await prisma.trueFalseQuestion.findFirst({
            where: {
              OR: [
                ...(item.id || item.questionId ? [{ id: item.id || item.questionId }] : []),
                ...(questionMg ? [{ questionMg: { equals: questionMg, mode: 'insensitive' as const } }] : []),
              ],
            },
          });

          if (existing) {
            stats.unchanged++;
          } else {
            await prisma.trueFalseQuestion.create({
              data: {
                ...(item.id || item.questionId ? { id: item.id || item.questionId } : {}),
                questionMg: questionMg || questionFr || '',
                questionFr: questionFr || null,
                isTrue: Boolean(item.isTrue),
                explanationMg: item.explanationMg || item.explanation || '',
                explanationFr: item.explanationFr || item.explanation || '',
                theme: (item.themeId && TF_THEME_CATEGORY_MAP[item.themeId.toLowerCase()]) || source.defaultTheme,
                difficulty: diff,
                source: item.source || null,
                status: 'PUBLISHED',
              },
            });
            stats.created++;
          }
        } catch (err) {
          console.error(`⚠️ [Seed Vrai/Faux] Erreur sur la question thématique "${normKey.substring(0, 30)}..." :`, err);
          stats.errors++;
        }
      }
    } catch (err) {
      console.error(`❌ [Seed Vrai/Faux] Erreur de lecture de ${source.file}:`, err);
      stats.errors++;
    }
  }

  return stats;
}
