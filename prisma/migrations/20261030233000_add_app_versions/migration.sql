-- CreateTable
CREATE TABLE "app_versions" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "minVersion" TEXT,
    "buildNumber" INTEGER,
    "titleFr" TEXT,
    "titleMg" TEXT,
    "messageFr" TEXT,
    "messageMg" TEXT,
    "releaseNotesFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "releaseNotesMg" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storeUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_versions_platform_isPublished_idx" ON "app_versions"("platform", "isPublished");

-- CreateIndex
CREATE INDEX "app_versions_version_idx" ON "app_versions"("version");

