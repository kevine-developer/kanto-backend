-- AlterEnum: Ajout des statuts STARTING et EXPIRED dans DuelStatus
ALTER TYPE "DuelStatus" ADD VALUE IF NOT EXISTS 'STARTING';
ALTER TYPE "DuelStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

-- AlterTable: Ajout de expiresAt sur duel_sessions
ALTER TABLE "duel_sessions" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "duel_sessions_expiresAt_idx" ON "duel_sessions"("expiresAt");

