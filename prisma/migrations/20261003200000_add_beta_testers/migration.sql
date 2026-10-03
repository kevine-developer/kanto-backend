-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "TesterStatus" AS ENUM ('PENDING', 'APPROVED', 'INVITED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "beta_testers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "deviceModel" TEXT,
    "androidVersion" TEXT,
    "notes" TEXT,
    "status" "TesterStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3),
    "inviteCount" INTEGER NOT NULL DEFAULT 0,
    "playLinkSent" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_email_key" ON "beta_testers"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "beta_testers_status_idx" ON "beta_testers"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "beta_testers_createdAt_idx" ON "beta_testers"("createdAt");
