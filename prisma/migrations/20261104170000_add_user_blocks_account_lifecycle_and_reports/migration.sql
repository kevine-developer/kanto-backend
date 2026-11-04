-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED', 'PENDING_DELETION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enrich ReportReason Enum
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'HARASSMENT';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'IMPERSONATION';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'SPAM_SCAM';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'INAPPROPRIATE_BEHAVIOR';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'OFFENSIVE_CONTENT';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'WRONG_ANSWER';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'INAPPROPRIATE_CONTENT';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'PLAGIARISM';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'SPELLING_GRAMMAR';

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" "UserStatus" DEFAULT 'ACTIVE';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deactivatedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletionScheduledAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "suspendedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_status_deletionScheduledAt_idx" ON "users"("status", "deletionScheduledAt");

-- CreateTable user_blocks
CREATE TABLE IF NOT EXISTS "user_blocks" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_blocks_blockerId_blockedId_key" ON "user_blocks"("blockerId", "blockedId");
CREATE INDEX IF NOT EXISTS "user_blocks_blockerId_idx" ON "user_blocks"("blockerId");
CREATE INDEX IF NOT EXISTS "user_blocks_blockedId_idx" ON "user_blocks"("blockedId");

-- AddForeignKey user_blocks
DO $$ BEGIN
  ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable content_reports
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "status" "ReportStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "moderatorNotes" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "actionTaken" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "resolvedAt" TIMESTAMP(3);
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "resolvedById" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "reportedUserId" TEXT;
ALTER TABLE "content_reports" ADD COLUMN IF NOT EXISTS "questionId" TEXT;

-- CreateIndex content_reports
CREATE INDEX IF NOT EXISTS "content_reports_status_idx" ON "content_reports"("status");
CREATE INDEX IF NOT EXISTS "content_reports_reportedUserId_idx" ON "content_reports"("reportedUserId");
CREATE INDEX IF NOT EXISTS "content_reports_questionId_idx" ON "content_reports"("questionId");

-- AddForeignKey content_reports
DO $$ BEGIN
  ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "content_reports" ADD CONSTRAINT "content_reports_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "user_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

