-- ============================================================
-- Migration Prisma : 20261030220000_add_events_and_missing_tables
-- Ajout des tables et enums pour :
-- 1. Événements culturels & Fanamby (events, event_rewards, event_participations, event_reward_claims, event_leaderboard_entries)
-- 2. Système d'envoi et suivi des e-mails Resend (email_logs, email_suppressions)
-- 3. Onboarding slides (onboarding_slides)
-- ============================================================

-- ------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE "EventCategory" AS ENUM ('CULTURE', 'CHALLENGE', 'REWARD', 'SEASONAL', 'COMMUNITY', 'SPECIAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ACTIVE', 'SUSPENDED', 'COMPLETED', 'CANCELLED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventParticipationType" AS ENUM ('OPEN', 'REGISTRATION_REQUIRED', 'EXCLUSIVE_TIER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventParticipationStatus" AS ENUM ('REGISTERED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'DISQUALIFIED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventRewardType" AS ENUM ('XP', 'COINS', 'BADGE', 'PREMIUM_ACCESS', 'PHYSICAL_LOT', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'SENT', 'DELIVERED', 'DELIVERY_DELAYED', 'BOUNCED', 'COMPLAINED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------
-- 2. TABLES : ÉVÉNEMENTS & FANAMBY
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "shortDescMg" TEXT,
    "shortDescFr" TEXT,
    "category" "EventCategory" NOT NULL DEFAULT 'CULTURE',
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "participationType" "EventParticipationType" NOT NULL DEFAULT 'OPEN',
    "minTier" TEXT DEFAULT 'FREE',
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "location" TEXT,
    "externalUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3),
    "maxParticipants" INTEGER,
    "currentParticipantsCount" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "sharesCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rulesMg" TEXT,
    "rulesFr" TEXT,
    "metadata" JSONB,
    "creatorId" TEXT,
    "cancelledReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_key" ON "events"("slug");
CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events"("status");
CREATE INDEX IF NOT EXISTS "events_category_idx" ON "events"("category");
CREATE INDEX IF NOT EXISTS "events_startDate_idx" ON "events"("startDate");
CREATE INDEX IF NOT EXISTS "events_endDate_idx" ON "events"("endDate");
CREATE INDEX IF NOT EXISTS "events_isFeatured_idx" ON "events"("isFeatured");

CREATE TABLE IF NOT EXISTS "event_rewards" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "rewardType" "EventRewardType" NOT NULL,
    "titleMg" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "badgeId" TEXT,
    "lotDescription" TEXT,
    "criteria" TEXT,
    "maxWinners" INTEGER,
    "claimsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rewards_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "event_rewards_eventId_idx" ON "event_rewards"("eventId");

CREATE TABLE IF NOT EXISTS "event_participations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "EventParticipationStatus" NOT NULL DEFAULT 'REGISTERED',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "attemptsCount" INTEGER NOT NULL DEFAULT 1,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_participations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "event_participations_eventId_userId_key" ON "event_participations"("eventId", "userId");
CREATE INDEX IF NOT EXISTS "event_participations_eventId_status_idx" ON "event_participations"("eventId", "status");
CREATE INDEX IF NOT EXISTS "event_participations_userId_idx" ON "event_participations"("userId");

CREATE TABLE IF NOT EXISTS "event_reward_claims" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "participationId" TEXT,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFulfilled" BOOLEAN NOT NULL DEFAULT true,
    "fulfillmentNotes" TEXT,

    CONSTRAINT "event_reward_claims_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "event_reward_claims_rewardId_userId_key" ON "event_reward_claims"("rewardId", "userId");
CREATE INDEX IF NOT EXISTS "event_reward_claims_eventId_idx" ON "event_reward_claims"("eventId");
CREATE INDEX IF NOT EXISTS "event_reward_claims_userId_idx" ON "event_reward_claims"("userId");

CREATE TABLE IF NOT EXISTS "event_leaderboard_entries" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "timeTakenSeconds" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_leaderboard_entries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "event_leaderboard_entries_eventId_userId_key" ON "event_leaderboard_entries"("eventId", "userId");
CREATE INDEX IF NOT EXISTS "event_leaderboard_entries_eventId_rank_idx" ON "event_leaderboard_entries"("eventId", "rank");

-- ------------------------------------------------------------
-- 3. TABLES : SYSTÈME EMAIL RESEND
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "email_logs" (
    "id" TEXT NOT NULL,
    "resendId" TEXT,
    "idempotencyKey" TEXT,
    "recipient" TEXT NOT NULL,
    "recipientName" TEXT,
    "from" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "status" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "bounceType" TEXT,
    "bounceSubtype" TEXT,
    "errorReason" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastAttemptAt" TIMESTAMP(3),
    "metadata" JSONB,
    "events" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "email_logs_idempotencyKey_key" ON "email_logs"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "email_logs_recipient_idx" ON "email_logs"("recipient");
CREATE INDEX IF NOT EXISTS "email_logs_status_idx" ON "email_logs"("status");
CREATE INDEX IF NOT EXISTS "email_logs_templateType_idx" ON "email_logs"("templateType");
CREATE INDEX IF NOT EXISTS "email_logs_resendId_idx" ON "email_logs"("resendId");
CREATE INDEX IF NOT EXISTS "email_logs_createdAt_idx" ON "email_logs"("createdAt");

CREATE TABLE IF NOT EXISTS "email_suppressions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_suppressions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "email_suppressions_email_key" ON "email_suppressions"("email");
CREATE INDEX IF NOT EXISTS "email_suppressions_email_idx" ON "email_suppressions"("email");

-- ------------------------------------------------------------
-- 4. TABLES : UI & ONBOARDING
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "onboarding_slides" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "accentColor" TEXT DEFAULT '#4A6741',
    "iconName" TEXT DEFAULT 'BookOpen',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_slides_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "onboarding_slides_order_idx" ON "onboarding_slides"("order");
CREATE INDEX IF NOT EXISTS "onboarding_slides_isActive_idx" ON "onboarding_slides"("isActive");

-- ------------------------------------------------------------
-- 5. RELATIONS & CONTRAINTES DE CLÉS ÉTRANGÈRES
-- ------------------------------------------------------------

DO $$ BEGIN
    ALTER TABLE "event_rewards" ADD CONSTRAINT "event_rewards_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_participations" ADD CONSTRAINT "event_participations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_participations" ADD CONSTRAINT "event_participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_reward_claims" ADD CONSTRAINT "event_reward_claims_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "event_rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_reward_claims" ADD CONSTRAINT "event_reward_claims_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_reward_claims" ADD CONSTRAINT "event_reward_claims_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "event_participations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_leaderboard_entries" ADD CONSTRAINT "event_leaderboard_entries_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "event_leaderboard_entries" ADD CONSTRAINT "event_leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
