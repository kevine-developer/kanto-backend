-- CreateEnum DeckVisibility
DO $$ BEGIN
    CREATE TYPE "DeckVisibility" AS ENUM ('PUBLIC', 'LINK_ONLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterEnum ReportReason (Add SPAM, MISLEADING, ILLEGAL)
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'SPAM';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'MISLEADING';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'ILLEGAL';

-- AlterTable user_quiz_sets
ALTER TABLE "user_quiz_sets" 
  ADD COLUMN IF NOT EXISTS "visibility" "DeckVisibility" NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "verifiedBy" TEXT;

-- Synchronise visibility with existing isPublic
UPDATE "user_quiz_sets"
SET "visibility" = CASE WHEN "isPublic" = true THEN 'PUBLIC'::"DeckVisibility" ELSE 'LINK_ONLY'::"DeckVisibility" END;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_quiz_sets_visibility_idx" ON "user_quiz_sets"("visibility");
CREATE INDEX IF NOT EXISTS "user_quiz_sets_verified_idx" ON "user_quiz_sets"("verified");

-- AlterTable content_reports
ALTER TABLE "content_reports" 
  ADD COLUMN IF NOT EXISTS "quizSetId" TEXT;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "content_reports" 
    ADD CONSTRAINT "content_reports_quizSetId_fkey" 
    FOREIGN KEY ("quizSetId") REFERENCES "user_quiz_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "content_reports_quizSetId_idx" ON "content_reports"("quizSetId");
