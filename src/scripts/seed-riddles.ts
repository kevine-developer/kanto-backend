import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  DifficultyLevel,
} from '../../generated/prisma/client.js';
import { RIDDLES_DATA } from '../../prisma/seed-data/riddles.data.js';

export async function seedRiddles(force = false) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL manquante dans les variables d'environnement",
    );
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(
      `\n🧩 [Seed Devinettes] Synchronisation de ${RIDDLES_DATA.length} Ankamantatra traditionnels malgaches...`,
    );

    let inserted = 0;
    let updated = 0;

    for (const r of RIDDLES_DATA) {
      const existing = await prisma.riddleQuestion.findFirst({
        where: { riddleMg: r.riddleMg },
      });

      const diff: DifficultyLevel =
        r.difficulty === 'HARD'
          ? DifficultyLevel.HARD
          : r.difficulty === 'MEDIUM'
            ? DifficultyLevel.MEDIUM
            : DifficultyLevel.EASY;

      if (existing) {
        await prisma.riddleQuestion.update({
          where: { id: existing.id },
          data: {
            riddleFr: r.riddleFr,
            options: r.options,
            correctAnswer: r.correctAnswer,
            acceptedAnswers: r.acceptedAnswers,
            explanation: r.explanation,
            clue: r.clue || null,
            level: r.level,
            difficulty: diff,
            sourceReference: r.sourceReference || null,
            contentSourceType: r.contentSourceType || 'MALAGASY_ITEM',
            status: 'PUBLISHED',
          },
        });
        updated++;
      } else {
        await prisma.riddleQuestion.create({
          data: {
            riddleMg: r.riddleMg,
            riddleFr: r.riddleFr,
            options: r.options,
            correctAnswer: r.correctAnswer,
            acceptedAnswers: r.acceptedAnswers,
            explanation: r.explanation,
            clue: r.clue || null,
            level: r.level,
            difficulty: diff,
            sourceReference: r.sourceReference || null,
            contentSourceType: r.contentSourceType || 'MALAGASY_ITEM',
            status: 'PUBLISHED',
          },
        });
        inserted++;
      }
    }

    console.log(`✅ [Seed Devinettes] Terminé avec succès :`);
    console.log(`   • ${inserted} devinettes insérées`);
    console.log(`   • ${updated} devinettes mises à jour`);
    console.log(
      `   • Total géré : ${RIDDLES_DATA.length} questions Ankamantatra`,
    );
  } catch (error) {
    console.error('❌ Erreur lors du seed des devinettes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Exécution directe si appelé par CLI
if (
  process.argv[1]?.endsWith('seed-riddles.ts') ||
  process.argv[1]?.endsWith('seed-riddles.js')
) {
  seedRiddles()
    .then(() => {
      console.log('🎉 Seed devinettes exécuté avec succès.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
