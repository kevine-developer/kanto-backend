-- AlterTable: Ajout de l'index et du hash déterministe HMAC-SHA-256 pour les emails bêta-testeurs
ALTER TABLE "beta_testers" ADD COLUMN IF NOT EXISTS "emailHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "beta_testers_emailHash_key" ON "beta_testers"("emailHash");
CREATE INDEX IF NOT EXISTS "beta_testers_emailHash_idx" ON "beta_testers"("emailHash");

-- AlterTable: Ajout du hash déterministe pour les retours bêta
ALTER TABLE "beta_feedbacks" ADD COLUMN IF NOT EXISTS "emailHash" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "beta_feedbacks_emailHash_idx" ON "beta_feedbacks"("emailHash");

