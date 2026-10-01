-- Migration: add_terms_accepted_to_user
-- Ajout de l'horodatage d'acceptation des CGU et de la version pour conformité légale et protection juridique

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "termsAcceptedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "termsVersion" TEXT DEFAULT '1.0';

-- Rétro-compatibilité : les utilisateurs existants ont accepté implicitement les CGU lors de leur inscription
UPDATE "users"
SET "termsAcceptedAt" = "createdAt", "termsVersion" = '1.0'
WHERE "termsAcceptedAt" IS NULL;
