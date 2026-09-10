import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { INITIAL_MISSING_WORD_LEVELS } from '../games/missing-word/seeds/missing-word.seed.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Missing Word levels and questions...');
  let totalQuestions = 0;

  for (const lvl of INITIAL_MISSING_WORD_LEVELS) {
    let level = await prisma.missingWordLevel.findUnique({
      where: { levelNumber: lvl.levelNumber },
    });

    if (!level) {
      level = await prisma.missingWordLevel.create({
        data: {
          levelNumber: lvl.levelNumber,
          titleMg: lvl.titleMg,
          titleFr: lvl.titleFr,
          description: lvl.description,
          difficulty: lvl.difficulty,
          passThreshold: 5,
          totalQuestions: lvl.questions.length,
          status: 'PUBLISHED',
        },
      });
      console.log(`Created level ${lvl.levelNumber}: ${lvl.titleMg}`);
    } else {
      console.log(
        `Level ${lvl.levelNumber} already exists, checking questions...`,
      );
    }

    for (let i = 0; i < lvl.questions.length; i++) {
      const q = lvl.questions[i];
      const existing = await prisma.missingWordQuestion.findFirst({
        where: {
          levelId: level.id,
          correctWord: q.correctWord,
          french: q.french,
        },
      });

      if (!existing) {
        await prisma.missingWordQuestion.create({
          data: {
            levelId: level.id,
            orderIndex: i + 1,
            template: q.template,
            correctWord: q.correctWord,
            choices: q.choices,
            french: q.french,
            explanation: q.explanation,
            status: 'PUBLISHED',
          },
        });
        totalQuestions++;
      }
    }
  }

  console.log(
    `\nImport complete! Added ${totalQuestions} Missing Word questions.`,
  );
  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error('Seeding missing word error:', err);
  process.exit(1);
});
