-- Migration Prisma : 20261110150000_add_partners_and_marketing_platform
-- Ajout des enums, tables et relations pour la plateforme Partenaires, Organisateurs et Prestations Marketing
-- Mise à jour non-destructive de la table events (partnerId, moderationStatus, etc.)

-- 1. Création des Enums Partenaires & Marketing
DO $$ BEGIN
    CREATE TYPE "PartnerType" AS ENUM ('ASSOCIATION', 'COMPANY', 'INSTITUTION', 'INDEPENDENT_ORGANIZER', 'DEVELOPER', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PartnerStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'SUSPENDED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ApiKeyEnvironment" AS ENUM ('TEST', 'LIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EventModerationStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MarketingRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'ACCEPTED', 'REJECTED', 'PENDING_PAYMENT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Création de la table partners
CREATE TABLE IF NOT EXISTS "partners" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PartnerType" NOT NULL DEFAULT 'ASSOCIATION',
    "description" TEXT,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "socialLinks" JSONB,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "partners_slug_key" ON "partners"("slug");
CREATE INDEX IF NOT EXISTS "partners_status_idx" ON "partners"("status");
CREATE INDEX IF NOT EXISTS "partners_type_idx" ON "partners"("type");
CREATE INDEX IF NOT EXISTS "partners_userId_idx" ON "partners"("userId");

-- 3. Création de la table partner_api_keys
CREATE TABLE IF NOT EXISTS "partner_api_keys" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "scopes" TEXT[],
    "environment" "ApiKeyEnvironment" NOT NULL DEFAULT 'LIVE',
    "rateLimit" INTEGER NOT NULL DEFAULT 120,
    "lastUsedAt" TIMESTAMP(3),
    "lastUsedIp" TEXT,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_api_keys_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "partner_api_keys_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "partner_api_keys_keyHash_key" ON "partner_api_keys"("keyHash");
CREATE INDEX IF NOT EXISTS "partner_api_keys_partnerId_idx" ON "partner_api_keys"("partnerId");
CREATE INDEX IF NOT EXISTS "partner_api_keys_environment_idx" ON "partner_api_keys"("environment");
CREATE INDEX IF NOT EXISTS "partner_api_keys_expiresAt_idx" ON "partner_api_keys"("expiresAt");

-- 4. Création de la table partner_api_logs
CREATE TABLE IF NOT EXISTS "partner_api_logs" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "responseTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_api_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "partner_api_logs_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "partner_api_logs_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "partner_api_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "partner_api_logs_partnerId_createdAt_idx" ON "partner_api_logs"("partnerId", "createdAt");
CREATE INDEX IF NOT EXISTS "partner_api_logs_apiKeyId_idx" ON "partner_api_logs"("apiKeyId");
CREATE INDEX IF NOT EXISTS "partner_api_logs_statusCode_idx" ON "partner_api_logs"("statusCode");

-- 5. Création de la table marketing_placements
CREATE TABLE IF NOT EXISTS "marketing_placements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameMg" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "specifications" JSONB,
    "basePrice" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'MGA',
    "allowedDurationsDays" INTEGER[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_placements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "marketing_placements_code_key" ON "marketing_placements"("code");
CREATE INDEX IF NOT EXISTS "marketing_placements_isActive_idx" ON "marketing_placements"("isActive");
CREATE INDEX IF NOT EXISTS "marketing_placements_orderIndex_idx" ON "marketing_placements"("orderIndex");

-- 6. Création de la table marketing_requests
CREATE TABLE IF NOT EXISTS "marketing_requests" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "MarketingRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "requestedStartDate" TIMESTAMP(3) NOT NULL,
    "requestedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "campaignGoals" TEXT,
    "targetAudience" TEXT,
    "proposedBudget" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'MGA',
    "creatives" JSONB,
    "adminFeedback" TEXT,
    "messages" JSONB,
    "impressionsCount" INTEGER NOT NULL DEFAULT 0,
    "clicksCount" INTEGER NOT NULL DEFAULT 0,
    "conversionsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_requests_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "marketing_requests_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "marketing_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "marketing_requests_partnerId_idx" ON "marketing_requests"("partnerId");
CREATE INDEX IF NOT EXISTS "marketing_requests_eventId_idx" ON "marketing_requests"("eventId");
CREATE INDEX IF NOT EXISTS "marketing_requests_status_idx" ON "marketing_requests"("status");

-- 7. Création de la table marketing_request_placements
CREATE TABLE IF NOT EXISTS "marketing_request_placements" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "placementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_request_placements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "marketing_request_placements_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "marketing_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "marketing_request_placements_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "marketing_placements"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "marketing_request_placements_requestId_placementId_key" ON "marketing_request_placements"("requestId", "placementId");
CREATE INDEX IF NOT EXISTS "marketing_request_placements_requestId_idx" ON "marketing_request_placements"("requestId");
CREATE INDEX IF NOT EXISTS "marketing_request_placements_placementId_idx" ON "marketing_request_placements"("placementId");

-- 8. Mise à jour de la table events
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "moderationStatus" "EventModerationStatus" DEFAULT 'APPROVED';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "moderationRejectionReason" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "moderatedAt" TIMESTAMP(3);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "moderatedById" TEXT;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'events_partnerId_fkey'
    ) THEN
        ALTER TABLE "events" ADD CONSTRAINT "events_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "events_partnerId_idx" ON "events"("partnerId");
CREATE INDEX IF NOT EXISTS "events_moderationStatus_idx" ON "events"("moderationStatus");

