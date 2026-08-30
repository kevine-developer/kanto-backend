import 'dotenv/config';
import pg from 'pg';

const sql = `
DO $$ BEGIN
  ALTER TYPE "DifficultyLevel" ADD VALUE IF NOT EXISTS 'EXPERT';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "TrueFalseTheme" AS ENUM ('GEN', 'CULT', 'GEO', 'HIST', 'LITT', 'PROV');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "true_false_questions" (
  "id" TEXT PRIMARY KEY,
  "questionMg" TEXT NOT NULL,
  "questionFr" TEXT,
  "isTrue" BOOLEAN NOT NULL,
  "explanationMg" TEXT NOT NULL,
  "explanationFr" TEXT,
  "theme" "TrueFalseTheme" NOT NULL DEFAULT 'GEN',
  "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
  "source" TEXT,
  "image" TEXT,
  "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  "timesPlayed" INTEGER NOT NULL DEFAULT 0,
  "timesCorrect" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "true_false_questions_theme_idx" ON "true_false_questions"("theme");
CREATE INDEX IF NOT EXISTS "true_false_questions_difficulty_idx" ON "true_false_questions"("difficulty");
CREATE INDEX IF NOT EXISTS "true_false_questions_status_idx" ON "true_false_questions"("status");

CREATE TABLE IF NOT EXISTS "true_false_sessions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "theme" "TrueFalseTheme" NOT NULL DEFAULT 'GEN',
  "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
  "score" INTEGER NOT NULL DEFAULT 0,
  "totalQuestions" INTEGER NOT NULL DEFAULT 10,
  "streakMax" INTEGER NOT NULL DEFAULT 0,
  "durationSeconds" INTEGER NOT NULL DEFAULT 0,
  "isCompleted" BOOLEAN NOT NULL DEFAULT false,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "true_false_sessions_userId_idx" ON "true_false_sessions"("userId");
CREATE INDEX IF NOT EXISTS "true_false_sessions_createdAt_idx" ON "true_false_sessions"("createdAt");

CREATE TABLE IF NOT EXISTS "true_false_answers" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES "true_false_sessions"("id") ON DELETE CASCADE,
  "questionId" TEXT NOT NULL REFERENCES "true_false_questions"("id") ON DELETE CASCADE,
  "userAnswer" BOOLEAN NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "true_false_answers_sessionId_idx" ON "true_false_answers"("sessionId");
CREATE INDEX IF NOT EXISTS "true_false_answers_questionId_idx" ON "true_false_answers"("questionId");
`;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new pg.Pool({ connectionString });
  console.log('Connecting to PostgreSQL...');
  const client = await pool.connect();
  try {
    console.log('Applying True/False DDL migration...');
    await client.query(sql);
    console.log('Migration applied successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
