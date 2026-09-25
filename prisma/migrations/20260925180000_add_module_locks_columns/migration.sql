-- Migration Prisma : Création / mise à niveau de la table module_locks avec bgImageUrl

DO $$ BEGIN
  CREATE TYPE "ModuleType" AS ENUM ('GAME', 'CATEGORY', 'FEATURE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "module_locks" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "type" "ModuleType" NOT NULL,
  "nameFr" TEXT NOT NULL,
  "nameMg" TEXT NOT NULL,
  "isLocked" BOOLEAN NOT NULL DEFAULT false,
  "lockReason" TEXT,
  "imageUrl" TEXT,
  "bgImageUrl" TEXT,
  "minTier" TEXT DEFAULT 'FREE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "module_locks_pkey" PRIMARY KEY ("id")
);

-- Index unique sur key
DO $$ BEGIN
  CREATE UNIQUE INDEX "module_locks_key_key" ON "module_locks"("key");
EXCEPTION
  WHEN duplicate_table THEN null;
  WHEN duplicate_object THEN null;
END $$;

-- Rétrocompatibilité absolue : garantit l'existence de toutes les colonnes
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "bgImageUrl" TEXT;
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "minTier" TEXT DEFAULT 'FREE';

CREATE INDEX IF NOT EXISTS "module_locks_type_idx" ON "module_locks"("type");
CREATE INDEX IF NOT EXISTS "module_locks_isLocked_idx" ON "module_locks"("isLocked");
