-- ============================================================
-- Migration: Automatisation du transfert des contributions validées
-- Non-destructive, 100% rétrocompatible (Règles data-preservation.md)
-- ============================================================

-- 1. Extension de l'enum CategoryType
ALTER TYPE "CategoryType" ADD VALUE IF NOT EXISTS 'POESIE';
ALTER TYPE "CategoryType" ADD VALUE IF NOT EXISTS 'RECITATION';

-- 2. Rattachement au contenu officiel dans la table contributions
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "officialItemId" TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "officialItemType" TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "officialItemSlug" TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "contributions_officialItemId_idx" ON "contributions"("officialItemId");

-- 3. Champs d'attribution communautaire dans les contenus officiels
-- Malagasy Items (Proverbes, Expressions, Dictons)
ALTER TABLE "malagasy_items" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "malagasy_items" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "malagasy_items" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "malagasy_items" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "malagasy_items_isCommunityContribution_idx" ON "malagasy_items"("isCommunityContribution");

-- Citations
ALTER TABLE "citations" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "citations" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "citations" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "citations" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "citations_isCommunityContribution_idx" ON "citations"("isCommunityContribution");

-- Contes (Angano)
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "contes_isCommunityContribution_idx" ON "contes"("isCommunityContribution");

-- Discours (Kabary)
ALTER TABLE "kabaries" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "kabaries" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "kabaries" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "kabaries" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "kabaries_isCommunityContribution_idx" ON "kabaries"("isCommunityContribution");

-- Poésies (Tononkalo)
ALTER TABLE "poesies" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "poesies" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "poesies" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "poesies" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "poesies_isCommunityContribution_idx" ON "poesies"("isCommunityContribution");

-- Récitations (Tsianjery)
ALTER TABLE "recitations" ADD COLUMN IF NOT EXISTS "contributorId" TEXT;
ALTER TABLE "recitations" ADD COLUMN IF NOT EXISTS "contributorName" TEXT;
ALTER TABLE "recitations" ADD COLUMN IF NOT EXISTS "contributionId" TEXT;
ALTER TABLE "recitations" ADD COLUMN IF NOT EXISTS "isCommunityContribution" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "recitations_isCommunityContribution_idx" ON "recitations"("isCommunityContribution");

