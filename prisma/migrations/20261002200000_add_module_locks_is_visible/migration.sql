-- AlterTable module_locks : Ajout du champ isVisible pour contrôler l'affichage dans l'application mobile
ALTER TABLE "module_locks" ADD COLUMN IF NOT EXISTS "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- Index pour optimiser les requêtes de filtrage par visibilité
CREATE INDEX IF NOT EXISTS "module_locks_isVisible_idx" ON "module_locks"("isVisible");
