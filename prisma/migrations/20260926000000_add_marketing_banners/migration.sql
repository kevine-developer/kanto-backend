-- Migration Prisma : Ajout de la table marketing_banners

CREATE TABLE IF NOT EXISTS "marketing_banners" (
    "id" TEXT NOT NULL,
    "badgeFr" TEXT NOT NULL,
    "badgeMg" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleMg" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionMg" TEXT NOT NULL,
    "ctaFr" TEXT NOT NULL DEFAULT 'Découvrir',
    "ctaMg" TEXT NOT NULL DEFAULT 'Hizaha',
    "imageUrl" TEXT NOT NULL,
    "deepLink" TEXT NOT NULL DEFAULT '/(screens)/subscription',
    "accentColor" TEXT NOT NULL DEFAULT '#F59E0B',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_banners_pkey" PRIMARY KEY ("id")
);

-- Index de performance
CREATE INDEX IF NOT EXISTS "marketing_banners_isActive_idx" ON "marketing_banners"("isActive");
CREATE INDEX IF NOT EXISTS "marketing_banners_orderIndex_idx" ON "marketing_banners"("orderIndex");
