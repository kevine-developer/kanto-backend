-- AlterTable: Suivi de confirmation et progression du testeur
ALTER TABLE "beta_testers" ADD COLUMN IF NOT EXISTS "confirmationStatus" TEXT DEFAULT 'INSCRIT';
ALTER TABLE "beta_testers" ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3);
ALTER TABLE "beta_testers" ADD COLUMN IF NOT EXISTS "installedAt" TIMESTAMP(3);
ALTER TABLE "beta_testers" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "beta_testers_confirmationStatus_idx" ON "beta_testers"("confirmationStatus");

-- AlterTable: Disponibilités et instructions administrables sur beta_automation_configs
ALTER TABLE "beta_automation_configs" ADD COLUMN IF NOT EXISTS "appStorePublicLink" TEXT;
ALTER TABLE "beta_automation_configs" ADD COLUMN IF NOT EXISTS "androidAvailability" TEXT NOT NULL DEFAULT 'BETA_OPEN';
ALTER TABLE "beta_automation_configs" ADD COLUMN IF NOT EXISTS "iosAvailability" TEXT NOT NULL DEFAULT 'BETA_OPEN';
ALTER TABLE "beta_automation_configs" ADD COLUMN IF NOT EXISTS "instructionsAndroid" TEXT;
ALTER TABLE "beta_automation_configs" ADD COLUMN IF NOT EXISTS "instructionsIos" TEXT;

