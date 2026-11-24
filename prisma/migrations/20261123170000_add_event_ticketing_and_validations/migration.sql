-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('VALID', 'USED', 'CANCELLED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TicketEntryMode" AS ENUM ('SINGLE', 'MULTI', 'UNLIMITED');

-- AlterTable
ALTER TABLE "events" ADD COLUMN "ticketingEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "events" ADD COLUMN "ticketEntryMode" "TicketEntryMode" DEFAULT 'SINGLE';
ALTER TABLE "events" ADD COLUMN "ticketMaxEntries" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "event_tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "secureToken" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'VALID',
    "entryMode" "TicketEntryMode" NOT NULL DEFAULT 'SINGLE',
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "maxEntries" INTEGER NOT NULL DEFAULT 1,
    "cancelledAt" TIMESTAMP(3),
    "cancelledById" TEXT,
    "cancellationReason" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedById" TEXT,
    "revokeReason" TEXT,
    "googleWalletObjectId" TEXT,
    "appleWalletSerialNumber" TEXT,
    "totpSecret" TEXT,
    "qrMode" TEXT NOT NULL DEFAULT 'STATIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_validations" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "scannedById" TEXT NOT NULL,
    "scannedByName" TEXT,
    "result" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_validations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_tickets_ticketNumber_key" ON "event_tickets"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "event_tickets_secureToken_key" ON "event_tickets"("secureToken");

-- CreateIndex
CREATE UNIQUE INDEX "event_tickets_participationId_key" ON "event_tickets"("participationId");

-- CreateIndex
CREATE INDEX "event_tickets_eventId_idx" ON "event_tickets"("eventId");

-- CreateIndex
CREATE INDEX "event_tickets_userId_idx" ON "event_tickets"("userId");

-- CreateIndex
CREATE INDEX "event_tickets_status_idx" ON "event_tickets"("status");

-- CreateIndex
CREATE INDEX "event_tickets_secureToken_idx" ON "event_tickets"("secureToken");

-- CreateIndex
CREATE INDEX "ticket_validations_ticketId_idx" ON "ticket_validations"("ticketId");

-- CreateIndex
CREATE INDEX "ticket_validations_eventId_idx" ON "ticket_validations"("eventId");

-- CreateIndex
CREATE INDEX "ticket_validations_scannedById_idx" ON "ticket_validations"("scannedById");

-- CreateIndex
CREATE INDEX "ticket_validations_scannedAt_idx" ON "ticket_validations"("scannedAt");

-- AddForeignKey
ALTER TABLE "event_tickets" ADD CONSTRAINT "event_tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tickets" ADD CONSTRAINT "event_tickets_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "event_participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tickets" ADD CONSTRAINT "event_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_validations" ADD CONSTRAINT "ticket_validations_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "event_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
