import 'dotenv/config';
import { Client } from 'pg';

/**
 * Script de nettoyage et réparation exhaustive des URLs de médias brisées ou manquantes sur Cloudinary.
 *
 * Corrige :
 * 1. Les images de slides d'accueil (welcome_slides) pointant vers des captures d'écran temporaires ou Photoroom 404.
 * 2. Les bannières marketing (marketing_banners) pointant vers placeholder.jpg ou Photoroom 404.
 * 3. Les verrous de modules (module_locks) avec des images Photoroom 404.
 * 4. Les illustrations de discours culturels (kabaries) avec des images Photoroom 404.
 * 5. Les fichiers audio introuvables sur les contes (contes) pour éviter les requêtes 404 et permettre la synthèse TTS propre.
 * 6. Les avatars orphelins introuvables sur Cloudinary (users, duel_players, duel_sessions).
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

    // 1. Correction des slides d'accueil (welcome_slides)
    const rWs1 = await client.query(`
      UPDATE "welcome_slides"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
      WHERE "id" = 'angano' OR "imageUrl" ILIKE '%capture_d__cran_2026-06-15%';
    `);

    const rWs2 = await client.query(`
      UPDATE "welcome_slides"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80'
      WHERE "id" = 'kabary' OR "imageUrl" ILIKE '%capture_d__cran_2026-01-08%';
    `);

    const rWs3 = await client.query(`
      UPDATE "welcome_slides"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80'
      WHERE "id" = 'ohabolana' OR "imageUrl" ILIKE '%capture_d__cran_2025-12-08%';
    `);

    const rWs4 = await client.query(`
      UPDATE "welcome_slides"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      WHERE "id" = 'lalao' OR "imageUrl" ILIKE '%Photoroom-20250725_025113719_voarxl.png%';
    `);

    const totalWsUpdated =
      (rWs1.rowCount ?? 0) +
      (rWs2.rowCount ?? 0) +
      (rWs3.rowCount ?? 0) +
      (rWs4.rowCount ?? 0);
    console.log(`🖼️ Slides d'accueil (welcome_slides) mises à jour : ${totalWsUpdated} ligne(s).`);

    // 2. Correction des bannières marketing (marketing_banners)
    const rBanners = await client.query(`
      UPDATE "marketing_banners"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
      WHERE "imageUrl" ILIKE '%banners/placeholder.jpg%'
         OR "imageUrl" ILIKE '%placeholder.jpg%'
         OR "imageUrl" ILIKE '%Photoroom%';
    `);
    console.log(`📢 Bannières marketing mises à jour : ${rBanners.rowCount ?? 0} ligne(s).`);

    // 3. Correction des jeux dans module_locks
    const rLock1 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_025113719_voarxl.png%';
    `);

    const rLock2 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024251458_je18mm.png%';
    `);

    const rLock3 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024716464_vp5ivb.png%';
    `);

    const rLock4 = await client.query(`
      UPDATE "module_locks"
      SET "imageUrl" = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      WHERE "imageUrl" ILIKE '%Photoroom-20250725_024504502_zotwmr.png%'
         OR "imageUrl" ILIKE '%Photoroom%';
    `);

    const totalLocksUpdated =
      (rLock1.rowCount ?? 0) +
      (rLock2.rowCount ?? 0) +
      (rLock3.rowCount ?? 0) +
      (rLock4.rowCount ?? 0);
    console.log(`🎮 Module locks mis à jour : ${totalLocksUpdated} ligne(s).`);

    // 4. Correction des illustrations dans kabaries
    const rKabaries = await client.query(`
      UPDATE "kabaries"
      SET "illustration" = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80'
      WHERE "illustration" ILIKE '%Photoroom%';
    `);
    console.log(`📜 Kabaries mis à jour : ${rKabaries.rowCount ?? 0} ligne(s).`);

    // 5. Réinitialisation des audios introuvables (404) sur les contes
    const rAudiosFr = await client.query(`
      UPDATE "contes"
      SET "audioUrlFr" = NULL
      WHERE "audioUrlFr" ILIKE '%ny-nofinizy-telo-mirahalahy-11-fr.wav%'
         OR "audioUrlFr" ILIKE '%ny-bitro-sy-ny-rambony-12-fr.wav%'
         OR "audioUrlFr" ILIKE '%farakely-sy-itrimobe-9-fr.wav%'
         OR "audioUrlFr" ILIKE '%ny-vorona-nifidy-mpanjaka-7-fr.mp3%'
         OR "audioUrlFr" ILIKE '%v178802%';
    `);

    const rAudiosMg = await client.query(`
      UPDATE "contes"
      SET "audioUrlMg" = NULL
      WHERE "audioUrlMg" ILIKE '%farakely-sy-itrimobe-9-mg.wav%'
         OR "audioUrlMg" ILIKE '%v178802%';
    `);

    console.log(
      `🎧 Contes avec audio 404 réinitialisés : ${(rAudiosFr.rowCount ?? 0) + (rAudiosMg.rowCount ?? 0)} piste(s).`,
    );

    // 6. Nettoyage des avatars orphelins (utilisateurs, duels)
    const rUsers = await client.query(`
      UPDATE "users"
      SET "image" = NULL
      WHERE "image" ILIKE '%7a5075f5-8704-4fcb-a128-6151f83a437c_1789497230117.jpg%'
         OR "image" ILIKE '%default-avatar%'
         OR "image" ILIKE '%default_avatar%';
    `);

    const rDuelPlayers = await client.query(`
      UPDATE "duel_players"
      SET "avatar" = NULL
      WHERE "avatar" ILIKE '%7a5075f5-8704-4fcb-a128-6151f83a437c_1789497230117.jpg%'
         OR "avatar" ILIKE '%default-avatar%'
         OR "avatar" ILIKE '%default_avatar%';
    `);

    const rDuelSessions = await client.query(`
      UPDATE "duel_sessions"
      SET "player1Avatar" = NULL
      WHERE "player1Avatar" ILIKE '%7a5075f5-8704-4fcb-a128-6151f83a437c_1789497230117.jpg%'
         OR "player1Avatar" ILIKE '%default-avatar%'
         OR "player1Avatar" ILIKE '%default_avatar%';
    `);

    console.log(
      `👤 Avatars orphelins nettoyés : ${(rUsers.rowCount ?? 0) + (rDuelPlayers.rowCount ?? 0) + (rDuelSessions.rowCount ?? 0)} ligne(s).`,
    );

    console.log('✅ Correction de toutes les URLs terminée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la correction des URLs :', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

void main();
