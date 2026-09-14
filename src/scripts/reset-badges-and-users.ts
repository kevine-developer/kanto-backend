import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL non définie');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetAllToZero() {
  console.log(
    '🚀 Début de la réinitialisation complète des badges et de la progression utilisateur...',
  );

  // 1. Supprimer tous les badges utilisateurs (UserBadge)
  const deletedBadges = await prisma.userBadge.deleteMany({});
  console.log(`✅ Badges supprimés (UserBadge) : ${deletedBadges.count}`);

  // 2. Supprimer toutes les transactions XP (XpTransaction)
  const deletedXpTx = await prisma.xpTransaction.deleteMany({});
  console.log(
    `✅ Transactions XP supprimées (XpTransaction) : ${deletedXpTx.count}`,
  );

  // 3. Supprimer toutes les progressions de jeu (GameProgression)
  const deletedGameProg = await prisma.gameProgression.deleteMany({});
  console.log(
    `✅ Progressions de jeu supprimées (GameProgression) : ${deletedGameProg.count}`,
  );

  // 4. Réinitialiser la progression globale de tous les utilisateurs (UserProgress)
  const updatedProgress = await prisma.userProgress.updateMany({
    data: {
      totalXp: 0,
      level: 1,
      coins: 0,
      streakDays: 0,
      lastLoginDate: null,
    },
  });
  console.log(
    `✅ Profils utilisateur réinitialisés à 0 (UserProgress) : ${updatedProgress.count}`,
  );

  // 5. Supprimer les historiques de consultations (ViewHistory)
  const deletedViews = await prisma.viewHistory.deleteMany({});
  console.log(
    `✅ Historiques de consultation réinitialisés (ViewHistory) : ${deletedViews.count}`,
  );

  // 6. Supprimer les notifications de badges / récompenses créées lors des tests
  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      OR: [{ badgeType: 'reward' }, { category: 'reward' }],
    },
  });
  console.log(
    `✅ Notifications de récompense nettoyées : ${deletedNotifications.count}`,
  );

  // 7. Vérification finale
  const remainingBadges = await prisma.userBadge.count();
  const remainingXpTx = await prisma.xpTransaction.count();
  const remainingGameProg = await prisma.gameProgression.count();
  const sampleProgress = await prisma.userProgress.findMany({ take: 3 });

  console.log('\n--- VÉRIFICATION FINALE ---');
  console.log(`Badges restants en BDD : ${remainingBadges}`);
  console.log(`Transactions XP restantes : ${remainingXpTx}`);
  console.log(`Game progressions restantes : ${remainingGameProg}`);
  console.log('Échantillon UserProgress après reset :', sampleProgress);
  console.log('🎉 Réinitialisation complète terminée avec succès !');

  await prisma.$disconnect();
  await pool.end();
}

resetAllToZero().catch((err) => {
  console.error('❌ Erreur lors de la réinitialisation :', err);
  process.exit(1);
});
