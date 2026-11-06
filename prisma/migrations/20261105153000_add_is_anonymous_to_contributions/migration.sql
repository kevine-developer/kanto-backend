-- =============================================================================
-- Migration: 20261105153000_add_is_anonymous_to_contributions
-- Ajout non destructif de la colonne isAnonymous à la table contributions
-- =============================================================================

ALTER TABLE "contributions" ADD COLUMN IF NOT EXISTS "isAnonymous" BOOLEAN NOT NULL DEFAULT false;

