-- AlterTable
ALTER TABLE "beta_testers" ADD COLUMN     "androidInviteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "androidInvitedAt" TIMESTAMP(3),
ADD COLUMN     "androidStatus" TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "iosInviteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "iosInvitedAt" TIMESTAMP(3),
ADD COLUMN     "iosStatus" TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY['ANDROID']::TEXT[],
ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "testFlightLinkSent" TEXT,
ADD COLUMN     "unsubscribeReason" TEXT,
ADD COLUMN     "unsubscribeToken" TEXT,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "beta_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#4A6741',
    "targetPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_versions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "buildNumber" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT,
    "releaseNotes" TEXT,
    "knownIssues" TEXT,
    "downloadUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_feedbacks" (
    "id" TEXT NOT NULL,
    "testerId" TEXT,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "appVersion" TEXT,
    "deviceInfo" TEXT,
    "screenshotUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "internalNotes" TEXT,
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_email_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "senderName" TEXT,
    "contentHtml" TEXT NOT NULL,
    "contentText" TEXT,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "secondaryButtonText" TEXT,
    "secondaryButtonUrl" TEXT,
    "footerText" TEXT,
    "accentColor" TEXT DEFAULT '#4A6741',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_automation_configs" (
    "id" TEXT NOT NULL,
    "autoConfirmRegistration" BOOLEAN NOT NULL DEFAULT true,
    "autoInviteOnApproval" BOOLEAN NOT NULL DEFAULT false,
    "autoNotifyNewVersions" BOOLEAN NOT NULL DEFAULT true,
    "reminderIntervalDays" INTEGER NOT NULL DEFAULT 7,
    "feedbackRequestDays" INTEGER NOT NULL DEFAULT 14,
    "playStoreWebLink" TEXT NOT NULL DEFAULT 'https://play.google.com/apps/testing/com.devengalere.kantomg',
    "playStoreAppLink" TEXT NOT NULL DEFAULT 'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
    "testFlightPublicLink" TEXT,
    "supportEmail" TEXT NOT NULL DEFAULT 'contact@kanto.mg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_automation_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beta_groups_name_key" ON "beta_groups"("name");

-- CreateIndex
CREATE INDEX "beta_versions_platform_status_idx" ON "beta_versions"("platform", "status");

-- CreateIndex
CREATE INDEX "beta_versions_version_idx" ON "beta_versions"("version");

-- CreateIndex
CREATE INDEX "beta_feedbacks_category_idx" ON "beta_feedbacks"("category");

-- CreateIndex
CREATE INDEX "beta_feedbacks_platform_idx" ON "beta_feedbacks"("platform");

-- CreateIndex
CREATE INDEX "beta_feedbacks_status_idx" ON "beta_feedbacks"("status");

-- CreateIndex
CREATE INDEX "beta_feedbacks_priority_idx" ON "beta_feedbacks"("priority");

-- CreateIndex
CREATE INDEX "beta_feedbacks_createdAt_idx" ON "beta_feedbacks"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "beta_email_templates_code_key" ON "beta_email_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "beta_testers_unsubscribeToken_key" ON "beta_testers"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "beta_testers_androidStatus_idx" ON "beta_testers"("androidStatus");

-- CreateIndex
CREATE INDEX "beta_testers_iosStatus_idx" ON "beta_testers"("iosStatus");

-- CreateIndex
CREATE INDEX "beta_testers_groupId_idx" ON "beta_testers"("groupId");

-- AddForeignKey
ALTER TABLE "beta_testers" ADD CONSTRAINT "beta_testers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "beta_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_feedbacks" ADD CONSTRAINT "beta_feedbacks_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "beta_testers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

