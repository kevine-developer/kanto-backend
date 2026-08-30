import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

const DATA_URLS = [
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/CultureTraditions.data.json',
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/GeographieNature.data.json',
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/HistoireSociete.data.json',
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/LitteratureArts.data.json',
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/ProverbesExpressions.data.json',
  'https://raw.githubusercontent.com/gastsar/data-kantomg/main/data/game/trueOrFalse/General.data.json',
];

const THEME_MAP: Record<string, any> = {
  CULT: 'CULT',
  GEO: 'GEO',
  HIST: 'HIST',
  LITT: 'LITT',
  PROV: 'PROV',
  GEN: 'GEN',
};

const DIFFICULTY_MAP: Record<string, any> = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EXPERT: 'EXPERT',
};

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Fetching questions from remote datasets...');
  let totalImported = 0;

  for (const url of DATA_URLS) {
    try {
      console.log(`Loading: ${url.split('/').pop()}...`);
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch ${url}: ${response.status}`);
        continue;
      }
      const data = await response.json();
      const questions: any[] = data.questions || [];

      for (const q of questions) {
        const theme = THEME_MAP[q.themeId] || 'GEN';
        const difficulty = DIFFICULTY_MAP[q.levelId] || 'EASY';

        await prisma.trueFalseQuestion.create({
          data: {
            questionMg: q.questionText,
            questionFr: q.questionTextFr || q.questionText,
            isTrue: Boolean(q.isTrue),
            explanationMg: q.explanation,
            explanationFr: q.explanationFr || q.explanation,
            theme,
            difficulty,
            source: q.source || null,
            image: q.image || null,
            status: 'PUBLISHED',
          },
        });
        totalImported++;
      }
    } catch (err) {
      console.error(`Error importing from ${url}:`, err);
    }
  }

  console.log(
    `\nImport complete! Successfully imported ${totalImported} True/False questions.`,
  );
  await pool.end();
}

main().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
