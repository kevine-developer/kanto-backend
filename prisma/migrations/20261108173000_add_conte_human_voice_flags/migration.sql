-- AlterTable Conte to support isHumanVoiceMg and isHumanVoiceFr
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "isHumanVoiceMg" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "contes" ADD COLUMN IF NOT EXISTS "isHumanVoiceFr" BOOLEAN NOT NULL DEFAULT false;

