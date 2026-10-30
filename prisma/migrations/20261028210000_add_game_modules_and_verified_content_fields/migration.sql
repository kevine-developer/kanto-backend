-- AlterTable: civic_quiz_questions
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "explanationMg" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "levelNumber" INTEGER DEFAULT 1;
ALTER TABLE "civic_quiz_questions" ADD COLUMN IF NOT EXISTS "historicalPeriod" TEXT;

CREATE INDEX IF NOT EXISTS "civic_quiz_questions_contentSourceType_contentSourceId_idx" ON "civic_quiz_questions"("contentSourceType", "contentSourceId");

-- AlterTable: true_false_questions
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationTrueMg" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationTrueFr" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationFalseMg" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "explanationFalseFr" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "levelNumber" INTEGER DEFAULT 1;
ALTER TABLE "true_false_questions" ADD COLUMN IF NOT EXISTS "historicalPeriod" TEXT;

CREATE INDEX IF NOT EXISTS "true_false_questions_contentSourceType_contentSourceId_idx" ON "true_false_questions"("contentSourceType", "contentSourceId");

-- AlterTable: riddle_questions
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "acceptedAnswers" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY';
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "sourceReference" TEXT;
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "contentSourceType" TEXT;
ALTER TABLE "riddle_questions" ADD COLUMN IF NOT EXISTS "contentSourceId" TEXT;

CREATE INDEX IF NOT EXISTS "riddle_questions_contentSourceType_contentSourceId_idx" ON "riddle_questions"("contentSourceType", "contentSourceId");

