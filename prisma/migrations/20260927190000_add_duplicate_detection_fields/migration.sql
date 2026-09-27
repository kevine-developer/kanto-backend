-- =============================================================================
-- Migration: add_duplicate_detection_fields_to_contributions
-- Adds all duplicate detection, moderation and dispute columns to the
-- contributions table, which were present in the Prisma schema but never
-- included in a SQL migration file.
-- =============================================================================

-- 1. Create the DisputeStatus enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DisputeStatus') THEN
    CREATE TYPE "DisputeStatus" AS ENUM ('NONE', 'PENDING', 'ACCEPTED', 'REJECTED');
  ELSE
    -- Ensure all enum values exist in case the type was already partially created
    BEGIN ALTER TYPE "DisputeStatus" ADD VALUE IF NOT EXISTS 'NONE'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "DisputeStatus" ADD VALUE IF NOT EXISTS 'PENDING'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "DisputeStatus" ADD VALUE IF NOT EXISTS 'ACCEPTED'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "DisputeStatus" ADD VALUE IF NOT EXISTS 'REJECTED'; EXCEPTION WHEN others THEN null; END;
  END IF;
END
$$;

-- 2. Add all missing duplicate detection columns (idempotent via IF NOT EXISTS)
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "duplicateScore"       DOUBLE PRECISION;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "duplicateOfId"        TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "duplicateTypeOf"      TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "duplicateTargetTitle" TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "isDuplicateConfirmed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "markedForDeletionAt"  TIMESTAMP(3);

-- 3. Add dispute / contestation columns
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "disputeMessage"  TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "disputeStatus"   "DisputeStatus" NOT NULL DEFAULT 'NONE';
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "disputedAt"      TIMESTAMP(3);

-- 4. Create indexes (idempotent)
CREATE INDEX IF NOT EXISTS "contributions_isDuplicateConfirmed_idx" ON "contributions"("isDuplicateConfirmed");
CREATE INDEX IF NOT EXISTS "contributions_markedForDeletionAt_idx"  ON "contributions"("markedForDeletionAt");
