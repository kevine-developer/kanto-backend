-- =============================================================================
-- Migration: 20261018120000_add_contribution_and_comment_to_content_reports
-- Ajout des colonnes contributionId et commentId sur content_reports avec
-- clés étrangères et index pour la modération des contributions et commentaires.
-- =============================================================================

-- 1. AlterTable content_reports : ajout des colonnes
ALTER TABLE "content_reports" 
  ADD COLUMN IF NOT EXISTS "contributionId" TEXT,
  ADD COLUMN IF NOT EXISTS "commentId" TEXT;

-- 2. AddForeignKey : relations avec contributions et contribution_comments
DO $$ BEGIN
  ALTER TABLE "content_reports" 
    ADD CONSTRAINT "content_reports_contributionId_fkey" 
    FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "content_reports" 
    ADD CONSTRAINT "content_reports_commentId_fkey" 
    FOREIGN KEY ("commentId") REFERENCES "contribution_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. CreateIndex
CREATE INDEX IF NOT EXISTS "content_reports_contributionId_idx" ON "content_reports"("contributionId");
CREATE INDEX IF NOT EXISTS "content_reports_commentId_idx" ON "content_reports"("commentId");
