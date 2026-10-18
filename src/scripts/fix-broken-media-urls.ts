import 'dotenv/config';
import { Client } from 'pg';

/**
 * Script de correction des URLs de médias brisées ou manquantes sur Cloudinary.
 * Met à jour :
 * 1. Les images des modules de jeux vers des URLs Unsplash valides.
 * 2. Les bannières marketing pointant vers le placeholder Cloudinary inexistant.
 * 3. Réinitialise à null les URLs des contes audio manquants afin de permettre leur régénération TTS propre.
 */
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL non définie');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('🔌 Connecté à la base de données PostgreSQL.');

    // 1. Correction des URLs de jeux dans module_locks
    const r1 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_025113719_voarxl.png%';
    `);

    const r2 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024251458_je18mm.png%';
    `);

    const r3 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024716464_vp5ivb.png%';
    `);

    const r4 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024504502_zotwmr.png%';
    `);

    const totalLocksUpdated =
      (r1.rowCount ?? 0) +
      (r2.rowCount ?? 0) +
      (r3.rowCount ?? 0) +
      (r4.rowCount ?? 0);

    console.log(`🎮 Module locks mis à jour : ${totalLocksUpdated} ligne(s).`);

    // 2. Correction des bannières marketing avec placeholder inexistant
    const rBanners = await client.query(`
      UPDATE "marketing_banners"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
      WHERE "imageUrl" ILIKE '%banners/placeholder.jpg%';
    `);
    console.log(
      `📢 Bannières marketing mises à jour : ${rBanners.rowCount ?? 0} ligne(s).`,
    );

    // 3. Réinitialisation des audios introuvables sur les contes pour permettre leur re-synthèse TTS
    const rAudios = await client.query(`
      UPDATE "contes"
      SET "audioUrlFr" = NULL
      WHERE "audioUrlFr" ILIKE '%ny-nofinizy-telo-mirahalahy-11-fr.wav%'
         OR "audioUrlFr" ILIKE '%ny-bitro-sy-ny-rambony-12-fr.wav%';
    `);
    console.log(
      `🎧 Contes avec audio 404 réinitialisés : ${rAudios.rowCount ?? 0} ligne(s).`,
    );

    console.log('✅ Correction des URLs terminée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la correction des URLs :', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
