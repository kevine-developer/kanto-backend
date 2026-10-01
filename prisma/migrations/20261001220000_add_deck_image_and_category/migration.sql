-- CreateTable: user_quiz_sets (Decks communautaires UGC)
CREATE TABLE IF NOT EXISTS "user_quiz_sets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "category" TEXT DEFAULT 'culture_generale',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "playsCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quiz_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_questions (Questions des Decks UGC)
CREATE TABLE IF NOT EXISTS "user_questions" (
    "id" TEXT NOT NULL,
    "quizSetId" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "questionMg" TEXT NOT NULL,
    "questionFr" TEXT,
    "isTrue" BOOLEAN,
    "choices" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answerIndex" INTEGER,
    "explanationMg" TEXT,
    "explanationFr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_questions_pkey" PRIMARY KEY ("id")
);

-- AlterTable duel_sessions (Support des parties multijoueurs avec un deck personnalisé UGC)
ALTER TABLE "duel_sessions" ADD COLUMN IF NOT EXISTS "customQuizSetId" TEXT;

-- AlterTable user_quiz_sets (Garantie de présence des colonnes au cas où la table existait déjà)
ALTER TABLE "user_quiz_sets" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "user_quiz_sets" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'culture_generale';

-- Foreign Keys
DO $$ BEGIN
  ALTER TABLE "user_quiz_sets" 
    ADD CONSTRAINT "user_quiz_sets_authorId_fkey" 
    FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_questions" 
    ADD CONSTRAINT "user_questions_quizSetId_fkey" 
    FOREIGN KEY ("quizSetId") REFERENCES "user_quiz_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "duel_sessions" 
    ADD CONSTRAINT "duel_sessions_customQuizSetId_fkey" 
    FOREIGN KEY ("customQuizSetId") REFERENCES "user_quiz_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS "user_quiz_sets_authorId_idx" ON "user_quiz_sets"("authorId");
CREATE INDEX IF NOT EXISTS "user_quiz_sets_isPublic_idx" ON "user_quiz_sets"("isPublic");
CREATE INDEX IF NOT EXISTS "user_quiz_sets_category_idx" ON "user_quiz_sets"("category");
CREATE INDEX IF NOT EXISTS "user_questions_quizSetId_idx" ON "user_questions"("quizSetId");
CREATE INDEX IF NOT EXISTS "duel_sessions_customQuizSetId_idx" ON "duel_sessions"("customQuizSetId");
