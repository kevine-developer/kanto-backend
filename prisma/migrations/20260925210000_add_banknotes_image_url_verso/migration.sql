-- Migration Prisma : Rétablissement et mise à niveau de la table banknotes avec imageUrlVerso

DO $$ BEGIN
  CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "banknotes" (
    "id" TEXT NOT NULL,
    "valueAriary" INTEGER NOT NULL,
    "valueFmg" INTEGER NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "seriesLabelFr" TEXT NOT NULL,
    "seriesLabelMg" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "colorLight" TEXT NOT NULL,
    "colorDark" TEXT NOT NULL,
    "obverseDescriptionFr" TEXT NOT NULL,
    "obverseDescriptionMg" TEXT NOT NULL,
    "reverseDescriptionFr" TEXT NOT NULL,
    "reverseDescriptionMg" TEXT NOT NULL,
    "symbolismFr" TEXT NOT NULL,
    "symbolismMg" TEXT NOT NULL,
    "securityFeaturesFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "imageUrlVerso" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banknotes_pkey" PRIMARY KEY ("id")
);

-- Rétrocompatibilité : garantie de la présence de la colonne imageUrlVerso
ALTER TABLE "banknotes" ADD COLUMN IF NOT EXISTS "imageUrlVerso" TEXT;

-- Index de performance
CREATE INDEX IF NOT EXISTS "banknotes_status_idx" ON "banknotes"("status");
CREATE INDEX IF NOT EXISTS "banknotes_series_idx" ON "banknotes"("series");
CREATE INDEX IF NOT EXISTS "banknotes_orderIndex_idx" ON "banknotes"("orderIndex");
