-- AlterTable: Ajout de tierExpiresAt à la table users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tierExpiresAt" TIMESTAMP(3);

-- CreateIndex: Index sur tier et tierExpiresAt pour le scheduler d'expiration
CREATE INDEX IF NOT EXISTS "users_tier_tierExpiresAt_idx" ON "users"("tier", "tierExpiresAt");
