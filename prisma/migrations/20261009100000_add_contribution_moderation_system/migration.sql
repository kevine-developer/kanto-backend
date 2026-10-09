-- =============================================================================
-- Migration: 20261009100000_add_contribution_moderation_system
-- Ajout du système complet de modération automatique, des statuts de contribution,
-- des champs de modération et de l'historique d'audit des décisions.
-- =============================================================================

-- 1. Création de l'enum ContributionStatus (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContributionStatus') THEN
    CREATE TYPE "ContributionStatus" AS ENUM (
      'DRAFT',
      'PENDING_REVIEW',
      'CHANGES_REQUESTED',
      'APPROVED',
      'REJECTED',
      'ARCHIVED'
    );
  ELSE
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'DRAFT'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'CHANGES_REQUESTED'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'APPROVED'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'REJECTED'; EXCEPTION WHEN others THEN null; END;
    BEGIN ALTER TYPE "ContributionStatus" ADD VALUE IF NOT EXISTS 'ARCHIVED'; EXCEPTION WHEN others THEN null; END;
  END IF;
END
$$;

-- 2. Migration de la colonne status existante vers ContributionStatus avec conservation des données
DO $$
DECLARE
  col_type text;
BEGIN
  SELECT udt_name INTO col_type
  FROM information_schema.columns
  WHERE table_name = 'contributions' AND column_name = 'status';

  IF col_type = 'ContentStatus' THEN
    ALTER TABLE "contributions" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "contributions" ALTER COLUMN "status" TYPE "ContributionStatus" USING (
      CASE
        WHEN "status"::text = 'PUBLISHED' THEN 'APPROVED'::"ContributionStatus"
        WHEN "status"::text = 'DRAFT' THEN 'PENDING_REVIEW'::"ContributionStatus"
        WHEN "status"::text = 'ARCHIVED' THEN 'ARCHIVED'::"ContributionStatus"
        ELSE 'PENDING_REVIEW'::"ContributionStatus"
      END
    );
    ALTER TABLE "contributions" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"ContributionStatus";
  END IF;
END
$$;

-- 3. Ajout des colonnes de modération automatique et feedback administratif
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "moderationFlagged"      BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "moderationCategories"   TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "moderationReason"       TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "moderationDetails"      JSONB;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "moderatedAt"            TIMESTAMP(3);
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "adminFeedback"          TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "adminReviewedBy"        TEXT;
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "adminReviewedAt"        TIMESTAMP(3);
ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "lastNotificationSentAt" TIMESTAMP(3);

-- 4. Index sur moderationFlagged
CREATE INDEX IF NOT EXISTS "contributions_moderationFlagged_idx" ON "contributions"("moderationFlagged");

-- 5. Création de la table de logs d'audit (contribution_audit_logs)
CREATE TABLE IF NOT EXISTS "contribution_audit_logs" (
  "id"             TEXT NOT NULL,
  "contributionId" TEXT NOT NULL,
  "userId"         TEXT,
  "userRole"       TEXT,
  "action"         TEXT NOT NULL,
  "fromStatus"     "ContributionStatus",
  "toStatus"       "ContributionStatus",
  "reason"         TEXT,
  "metadata"       JSONB,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "contribution_audit_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "contribution_audit_logs_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index pour la table d'audit
CREATE INDEX IF NOT EXISTS "contribution_audit_logs_contributionId_idx" ON "contribution_audit_logs"("contributionId");
CREATE INDEX IF NOT EXISTS "contribution_audit_logs_action_idx"         ON "contribution_audit_logs"("action");
CREATE INDEX IF NOT EXISTS "contribution_audit_logs_createdAt_idx"      ON "contribution_audit_logs"("createdAt");
