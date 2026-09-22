import 'dotenv/config';
import pg from 'pg';

const createTableSql = `
CREATE TABLE IF NOT EXISTS "welcome_slides" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleMg" TEXT,
  "badge" TEXT NOT NULL,
  "badgeMg" TEXT NOT NULL,
  "tag" TEXT,
  "imageUrl" TEXT NOT NULL,
  "accentColor" TEXT NOT NULL DEFAULT '#4A6741',
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "welcome_slides_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "welcome_slides_isActive_idx" ON "welcome_slides"("isActive");
CREATE INDEX IF NOT EXISTS "welcome_slides_orderIndex_idx" ON "welcome_slides"("orderIndex");
`;

export const DEFAULT_WELCOME_SLIDES = [
  {
    id: 'angano',
    badge: 'Contes',
    badgeMg: 'Angano',
    title: 'Ikotofetsy sy Imahakà',
    titleMg: 'Ikotofetsy sy Imahakà',
    tag: 'Récits & Audio',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022553/kanto/images/onboarding/capture_d__cran_2026-06-15_183248_1788022552959.png',
    accentColor: '#4A6741',
    orderIndex: 0,
  },
  {
    id: 'kabary',
    badge: 'Art Oratoire',
    badgeMg: 'Kabary',
    title: 'Kabary am-panambadiana',
    titleMg: 'Kabary am-panambadiana',
    tag: 'Poésie & Rituels',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022563/kanto/images/onboarding/capture_d__cran_2026-01-08_161138_1788022563950.png',
    accentColor: '#3E6B55',
    orderIndex: 1,
  },
  {
    id: 'ohabolana',
    badge: 'Proverbes',
    badgeMg: 'Ohabolana',
    title: 'Ny Fihavanana no lehibe',
    titleMg: 'Ny Fihavanana no lehibe',
    tag: 'Sagesses Malagasy',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1788022560/kanto/images/onboarding/capture_d__cran_2025-12-08_164642_1788022559754.png',
    accentColor: '#5C7A3E',
    orderIndex: 2,
  },
  {
    id: 'hainteny',
    badge: 'Poésie',
    badgeMg: 'Hainteny',
    title: 'Haintenin-dRazana',
    titleMg: 'Haintenin-dRazana',
    tag: 'Orfèvrerie des Mots',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    accentColor: '#7A5B3E',
    orderIndex: 3,
  },
  {
    id: 'valiha',
    badge: 'Musique',
    badgeMg: 'Feon-kira',
    title: 'Valiha sy Kalon-dRazana',
    titleMg: 'Valiha sy Kalon-dRazana',
    tag: 'Instruments Sacrés',
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    accentColor: '#8C6D3B',
    orderIndex: 4,
  },
  {
    id: 'lalao',
    badge: 'Jeux',
    badgeMg: 'Lalao',
    title: 'Vrai ou Faux & Défis',
    titleMg: 'Marina sa Diso',
    tag: 'Quiz & Multijoueur',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433200/Photoroom-20250725_025113719_voarxl.png',
    accentColor: '#C58B38',
    orderIndex: 5,
  },
  {
    id: 'tantara',
    badge: 'Histoire',
    badgeMg: 'Tantara',
    title: 'Andrianampoinimerina',
    titleMg: 'Mpanjaka sy Lova',
    tag: 'Rois & Héritage',
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
    accentColor: '#B84040',
    orderIndex: 6,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL non définie');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('🔌 Connecté à PostgreSQL');

    // 1. Création de la table
    await client.query(createTableSql);
    console.log('✅ Table welcome_slides et ses index vérifiés/créés');

    // 2. Vérification s'il y a déjà des données
    const checkRes = await client.query(
      'SELECT COUNT(*) FROM "welcome_slides"',
    );
    const count = parseInt(checkRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Insertion des 7 photos culturelles initiales...');
      for (const item of DEFAULT_WELCOME_SLIDES) {
        await client.query(
          `INSERT INTO "welcome_slides" 
           ("id", "title", "titleMg", "badge", "badgeMg", "tag", "imageUrl", "accentColor", "orderIndex", "isActive", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW(), NOW())
           ON CONFLICT ("id") DO NOTHING`,
          [
            item.id,
            item.title,
            item.titleMg,
            item.badge,
            item.badgeMg,
            item.tag,
            item.imageUrl,
            item.accentColor,
            item.orderIndex,
          ],
        );
      }
      console.log('✅ 7 photos insérées avec succès en BDD !');
    } else {
      console.log(
        `ℹ️ La table welcome_slides contient déjà ${count} entrée(s).`,
      );
    }
  } catch (err) {
    console.error("❌ Erreur d'application DDL/Seed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
