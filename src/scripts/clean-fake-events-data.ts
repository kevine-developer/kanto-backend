import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/kanto_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 [Clean Fake Events Data] Démarrage du nettoyage des données fictives...');

  const targetSlugs = [
    'herinandron-ny-teny-malagasy',
    'tournoi-quiz-tantara-malagasy',
    'fankalazana-ny-fihavanana',
  ];

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const fourteenDaysAhead = new Date(now.getTime() + 14 * 24 * 3600 * 1000);

  // Dates futures pour l'événement programmé
  const scheduledStart = new Date(now.getTime() + 13 * 24 * 3600 * 1000); // ~21 nov
  const scheduledEnd = new Date(now.getTime() + 20 * 24 * 3600 * 1000);   // ~28 nov

  // 1. Récupérer les événements cibles
  const events = await prisma.event.findMany({
    where: { slug: { in: targetSlugs } },
    include: { participations: true },
  });

  console.log(`📌 ${events.length} événements trouvés pour nettoyage :`);

  for (const ev of events) {
    console.log(`\n--- Nettoyage de "${ev.titleFr}" (${ev.slug}) ---`);
    console.log(`  Avant :`);
    console.log(`    Statut: ${ev.status}`);
    console.log(`    Période: ${ev.startDate.toISOString().slice(0, 10)} -> ${ev.endDate.toISOString().slice(0, 10)}`);
    console.log(`    Compteur participants: ${ev.currentParticipantsCount}`);
    console.log(`    Participations en base: ${ev.participations.length}`);

    // 2. Supprimer les participations fictives / de test pour cet événement
    if (ev.participations.length > 0) {
      const deletedPart = await prisma.eventParticipation.deleteMany({
        where: { eventId: ev.id },
      });
      console.log(`  🗑️ ${deletedPart.count} participation(s) supprimée(s).`);
    }

    // 3. Définir les nouvelles dates et le bon statut
    let nextStatus: any = 'ACTIVE';
    let nextStart = twoDaysAgo;
    let nextEnd = sevenDaysAhead;

    if (ev.slug === 'fankalazana-ny-fihavanana') {
      nextStatus = 'SCHEDULED';
      nextStart = scheduledStart;
      nextEnd = scheduledEnd;
    } else if (ev.slug === 'tournoi-quiz-tantara-malagasy') {
      nextStatus = 'ACTIVE';
      nextStart = now;
      nextEnd = fourteenDaysAhead;
    } else if (ev.slug === 'herinandron-ny-teny-malagasy') {
      nextStatus = 'ACTIVE';
      nextStart = twoDaysAgo;
      nextEnd = sevenDaysAhead;
    }

    // 4. Mettre à jour l'événement avec 0 participants et dates/statuts cohérents
    const updated = await prisma.event.update({
      where: { id: ev.id },
      data: {
        currentParticipantsCount: 0,
        status: nextStatus,
        startDate: nextStart,
        endDate: nextEnd,
      },
    });

    console.log(`  Après :`);
    console.log(`    Statut: ${updated.status}`);
    console.log(`    Période: ${updated.startDate.toISOString().slice(0, 10)} -> ${updated.endDate.toISOString().slice(0, 10)}`);
    console.log(`    Compteur participants: ${updated.currentParticipantsCount}`);
  }

  console.log('\n✅ Nettoyage terminé avec succès ! Tous les compteurs sont à 0 et les statuts/dates sont cohérents.');
}

main()
  .catch((err) => {
    console.error('❌ Erreur lors du nettoyage :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

