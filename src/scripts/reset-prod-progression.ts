/**
 * Script de réinitialisation complète de la progression et des niveaux pour la mise en production.
 *
 * Exécution :
 *   npx tsx src/scripts/reset-prod-progression.ts
 *
 * Ce script :
 * 1. Remet tous les profils UserProgress à zéro (Level 0, 0 XP, 0 Coins, 0 Streak)
 * 2. Purge l'historique des transactions d'XP (XpTransaction)
 * 3. Réinitialise toutes les progressions intra-jeux (GameProgression)
 * 4. Nettoie les clés Redis associées au Leaderboard / Classement
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { Redis } from 'ioredis';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL non définie dans l'environnement.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetProdProgression() {
  console.log('\n============================================================');
  console.log('  KANTO — RÉINITIALISATION COMPLÈTE DE LA PROGRESSION EN PROD');
  console.log('============================================================\n');

  try {
    // 1. Réinitialiser UserProgress (Tous les utilisateurs au Niveau 0, 0 XP, 0 Coins, 0 Streak)
    console.log(
      '🔄 1. Réinitialisation des fiches UserProgress (Level 0, 0 XP)...',
    );
    const updatedUsers = await prisma.userProgress.updateMany({
      data: {
        totalXp: 0,
        level: 0,
        coins: 0,
        streakDays: 0,
        lastLoginDate: null,
      },
    });
    console.log(
      `   ✅ ${updatedUsers.count} profil(s) utilisateur(s) remis à zéro (Niveau 0).`,
    );

    // 2. Supprimer les transactions XP (historique)
    console.log("🔄 2. Suppression de l'historique des transactions XP...");
    const deletedXp = await prisma.xpTransaction.deleteMany({});
    console.log(`   ✅ ${deletedXp.count} transaction(s) XP supprimée(s).`);

    // 3. Supprimer ou réinitialiser les progressions de jeux
    console.log(
      '🔄 3. Réinitialisation des progressions de jeux (GameProgression)...',
    );
    const deletedGames = await prisma.gameProgression.deleteMany({});
    console.log(
      `   ✅ ${deletedGames.count} progression(s) de jeux réinitialisée(s).`,
    );

    // 4. Nettoyage du cache Redis (Leaderboard, Classements, etc.)
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      console.log('🔄 4. Purge des clés Redis de Classement & Leaderboard...');
      const redis = new Redis(redisUrl, { lazyConnect: true });
      await redis.connect();

      const keys = await redis.keys('*leaderboard*');
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(
          `   ✅ ${keys.length} clé(s) Redis de leaderboard purgée(s).`,
        );
      } else {
        console.log('   ℹ️ Aucune clé de leaderboard trouvée dans Redis.');
      }

      const progressKeys = await redis.keys('*progress*');
      if (progressKeys.length > 0) {
        await redis.del(...progressKeys);
        console.log(
          `   ✅ ${progressKeys.length} clé(s) Redis de progression purgée(s).`,
        );
      }

      await redis.quit();
    } catch (redisErr) {
      console.warn(
        `   ⚠️ Connexion Redis non disponible (${redisErr}) — étape ignorée.`,
      );
    }

    console.log(
      '\n============================================================',
    );
    console.log('  🎉 RÉINITIALISATION TERMINÉE AVEC SUCCÈS POUR LA PROD !');
    console.log(
      '  Tous les joueurs commenceront désormais au Niveau 0 (Mpitsidika)',
    );
    console.log("  avec 0 XP et les nouveaux seuils d'exigence doublés.");
    console.log(
      '============================================================\n',
    );
  } catch (error) {
    console.error('❌ Erreur critique lors de la réinitialisation :', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void resetProdProgression();
