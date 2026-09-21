import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataDir = path.resolve(__dirname, '../../prisma/seed-data');

const DATA_FILES = [
  'tf-culture.data.json',
  'tf-geographie.data.json',
  'tf-histoire.data.json',
  'tf-litterature.data.json',
  'tf-proverbes.data.json',
  'tf-general.data.json',
];

interface RemoteQuestion {
  themeId?: string;
  levelId?: string;
  questionText: string;
  questionTextFr?: string;
  isTrue: boolean;
  explanation: string;
  explanationFr?: string;
  source?: string | null;
  image?: string | null;
}

interface RemoteData {
  questions?: RemoteQuestion[];
}

const THEME_MAP: Record<
  string,
  'CULT' | 'GEO' | 'HIST' | 'LITT' | 'PROV' | 'GEN'
> = {
  CULT: 'CULT',
  GEO: 'GEO',
  HIST: 'HIST',
  LITT: 'LITT',
  PROV: 'PROV',
  GEN: 'GEN',
};

const DIFFICULTY_MAP: Record<string, 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'> = {
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

  const existingCount = await prisma.trueFalseQuestion.count();
  if (existingCount > 0) {
    console.log(
      `ℹ️ ${existingCount} questions Vrai/Faux existent déjà en base de données. Étape ignorée.`,
    );
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  console.log('Loading questions from local datasets...');
  let totalImported = 0;

  for (const fileName of DATA_FILES) {
    try {
      console.log(`Loading: ${fileName}...`);
      const filePath = path.join(seedDataDir, fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RemoteData;
      const questions: RemoteQuestion[] = data.questions || [];

      for (const q of questions) {
        const theme = (q.themeId && THEME_MAP[q.themeId]) || 'GEN';
        const difficulty = (q.levelId && DIFFICULTY_MAP[q.levelId]) || 'EASY';

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
      console.error(`Error importing from ${fileName}:`, err);
    }
  }

  console.log(
    `\nImport complete! Successfully imported ${totalImported} True/False questions.`,
  );
  await prisma.$disconnect();
  await pool.end();
}

main().catch((err: unknown) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
