import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { SEED_LEARNING_TRACKS } from '../src/learning/learning.seed-data.js';

export interface SeedLearningStats {
  tracksCreated: number;
  tracksUpdated: number;
  lessonsCreated: number;
  lessonsUpdated: number;
  totalQuizzes: number;
}

/**
 * Fonction de synchronisation pédagogique strictement idempotente.
 * Peut être appelée depuis le script CLI dédié ou importée dans les pipelines de seed de production.
 */
export async function seedLearning(client?: PrismaClient): Promise<SeedLearningStats> {
  let prisma = client;
  let pool: pg.Pool | null = null;

  if (!prisma) {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:9528@localhost:5432/kanto?schema=public';
    pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  const stats: SeedLearningStats = {
    tracksCreated: 0,
    tracksUpdated: 0,
    lessonsCreated: 0,
    lessonsUpdated: 0,
    totalQuizzes: 0,
  };

  console.log('🌱 [Seed Learning] Démarrage de la synchronisation des parcours & cours didactiques...');

  try {
    for (const trackData of SEED_LEARNING_TRACKS) {
      const existingTrack = await prisma.learningTrack.findUnique({
        where: { slug: trackData.slug },
      });

      let track: any;
      if (existingTrack) {
        track = await prisma.learningTrack.update({
          where: { slug: trackData.slug },
          data: {
            title: trackData.title,
            titleMg: trackData.titleMg,
            description: trackData.description,
            descriptionMg: trackData.descriptionMg,
            level: trackData.level,
            icon: trackData.icon,
            color: trackData.color,
            orderIndex: trackData.orderIndex,
            estimatedMinutes: trackData.estimatedMinutes,
          },
        });
        stats.tracksUpdated++;
      } else {
        track = await prisma.learningTrack.create({
          data: {
            slug: trackData.slug,
            title: trackData.title,
            titleMg: trackData.titleMg,
            description: trackData.description,
            descriptionMg: trackData.descriptionMg,
            level: trackData.level,
            icon: trackData.icon,
            color: trackData.color,
            orderIndex: trackData.orderIndex,
            estimatedMinutes: trackData.estimatedMinutes,
            isPublished: true,
          },
        });
        stats.tracksCreated++;
      }

      console.log(`  ✓ Parcours : ${track.title} [${track.slug}] (${trackData.lessons.length} leçons)`);

      // Synchronisation idempotente des leçons
      for (const lessonData of trackData.lessons) {
        const existingLesson = await prisma.learningLesson.findUnique({
          where: { slug: lessonData.slug },
        });

        // Préservation de la configuration personnalisée (ex: audioEnabled) si définie en base
        let sectionsToSave: any[] = [...lessonData.sections];
        if (existingLesson && existingLesson.sections) {
          let existingSections: any[] = [];
          if (Array.isArray(existingLesson.sections)) {
            existingSections = existingLesson.sections;
          } else if (typeof existingLesson.sections === 'string') {
            try {
              existingSections = JSON.parse(existingLesson.sections);
            } catch {
              existingSections = [];
            }
          }
          const existingConfig = existingSections.find((s) => s && s.type === 'config');
          if (existingConfig) {
            sectionsToSave = [
              existingConfig,
              ...lessonData.sections.filter((s: any) => s.type !== 'config'),
            ];
          }
        }

        const quizCount = lessonData.sections.filter((s: any) => s.type === 'quiz').length;
        stats.totalQuizzes += quizCount;

        if (existingLesson) {
          await prisma.learningLesson.update({
            where: { slug: lessonData.slug },
            data: {
              trackId: track.id,
              title: lessonData.title,
              titleMg: lessonData.titleMg,
              summary: lessonData.summary,
              summaryMg: lessonData.summaryMg,
              type: lessonData.type,
              orderIndex: lessonData.orderIndex,
              durationMinutes: lessonData.durationMinutes,
              sections: sectionsToSave as any,
            },
          });
          stats.lessonsUpdated++;
        } else {
          await prisma.learningLesson.create({
            data: {
              trackId: track.id,
              slug: lessonData.slug,
              title: lessonData.title,
              titleMg: lessonData.titleMg,
              summary: lessonData.summary,
              summaryMg: lessonData.summaryMg,
              type: lessonData.type,
              orderIndex: lessonData.orderIndex,
              durationMinutes: lessonData.durationMinutes,
              sections: sectionsToSave as any,
              isPublished: true,
            },
          });
          stats.lessonsCreated++;
        }

        console.log(`    ↳ [${lessonData.orderIndex}] ${lessonData.title} (${quizCount} quiz)`);
      }
    }

    console.log(
      `✅ [Seed Learning] Succès : ${stats.tracksCreated} parcours créés, ${stats.tracksUpdated} mis à jour | ` +
      `${stats.lessonsCreated} leçons créées, ${stats.lessonsUpdated} mises à jour | ${stats.totalQuizzes} questions de quiz vérifiées.`
    );

    return stats;
  } catch (error) {
    console.error('❌ [Seed Learning] Erreur lors de la synchronisation :', error);
    throw error;
  } finally {
    if (pool) {
      await prisma!.$disconnect();
      await pool.end();
    }
  }
}

async function main() {
  try {
    await seedLearning();
  } catch {
    process.exit(1);
  }
}

if (
  process.argv[1]?.endsWith('seed-learning.ts') ||
  process.argv[1]?.endsWith('seed-learning.js')
) {
  main();
}


