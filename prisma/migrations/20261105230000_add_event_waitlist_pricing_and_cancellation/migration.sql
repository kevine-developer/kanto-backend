-- ============================================================
-- Migration Prisma : 20261105230000_add_event_waitlist_pricing_and_cancellation
-- Ajout des champs pour la gestion de la liste d'attente,
-- la tarification et la traçabilité des annulations d'inscriptions.
-- ============================================================

-- 1. Ajout de la valeur WAITLIST à l'enum EventParticipationStatus
ALTER TYPE "EventParticipationStatus" ADD VALUE IF NOT EXISTS 'WAITLIST';

-- 2. Ajout des colonnes sur la table events
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "enableWaitlist" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "waitlistCapacity" INTEGER;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "isPaid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "ticketPrice" DOUBLE PRECISION;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'MGA';

-- 3. Ajout des colonnes sur la table event_participations
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT;
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "cancelledByRole" TEXT;
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "cancelledById" TEXT;
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "waitlistPosition" INTEGER;
ALTER TABLE "event_participations" ADD COLUMN IF NOT EXISTS "promotedFromWaitlistAt" TIMESTAMP(3);

