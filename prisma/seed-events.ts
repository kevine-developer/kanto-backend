import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
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
  console.log('🌱 [Seed Events] Démarrage du peuplement des événements Kanto MG...');

  // Date de référence
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const twoWeeksAhead = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
  const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

  // 1. Événement Actif & Vedette : Semaine de la Langue & des Proverbes Malgaches
  const event1 = await prisma.event.upsert({
    where: { slug: 'herinandron-ny-teny-malagasy' },
    create: {
      slug: 'herinandron-ny-teny-malagasy',
      titleMg: 'Herinandron’ny Teny Malagasy & Ohabolana',
      titleFr: 'Semaine de la Langue Malgache & des Proverbes',
      shortDescMg: 'Hikaroka ny lanjan’ny teny sy ny fahendrena nolovaina tamin’ireo razana.',
      shortDescFr: 'Découvrez la richesse des proverbes ancestraux et les subtilités du vocabulaire malgache.',
      descriptionMg:
        'Hetsika lehibe natao hanandratana ny teny malagasy sy ny fahendrena voarakitra anatin’ireo ohabolana. Mandritra ity herinandro ity, asaina ny rehetra handalina ny ohabolana, hamaly ireo fanontaniana momba ny teny tsy fahita matetika, ary hanangona ireo teny sarobidy.',
      descriptionFr:
        'Un événement culturel exceptionnel dédié à la célébration de la langue malgache et de la sagesse ancestrale. Durant cette semaine, relevez les défis de proverbes, explorez le Raki-teny et enrichissez vos connaissances.',
      rulesMg:
        'Misokatra ho an’ny rehetra. Valio ireo fanamby isan’andro ary tano ny fahatongavana misesy mba hahazoana ny loka feno.',
      rulesFr:
        'Ouvert à tous les utilisateurs. Complétez les défis quotidiens de proverbes pour débloquer les récompenses exclusives.',
      category: 'CULTURE',
      status: 'ACTIVE',
      participationType: 'OPEN',
      startDate: oneWeekAgo,
      endDate: oneWeekAhead,
      location: 'Fampiharana Kanto MG (Toerana nomerika)',
      isFeatured: true,
      currentParticipantsCount: 42,
      rewards: {
        create: [
          {
            rewardType: 'XP',
            titleMg: 'Tamby traikefa +200 XP',
            titleFr: 'Bonus d’expérience +200 XP',
            amount: 200,
            criteria: 'completion',
          },
          {
            rewardType: 'COINS',
            titleMg: 'Vola volamena +50',
            titleFr: '50 Pièces Vola',
            amount: 50,
            criteria: 'completion',
          },
          {
            rewardType: 'BADGE',
            titleMg: 'Mari-boninahitra : Mpikabary Hendry',
            titleFr: 'Badge Exclusif : Maître des Proverbes',
            badgeId: 'badge_proverbs_master',
            criteria: 'completion',
          },
        ],
      },
    },
    update: {
      status: 'ACTIVE',
      isFeatured: true,
    },
  });

  // 2. Événement Défi & Compétition : Grand Tournoi Quiz Histoire & Patrimoine
  const event2 = await prisma.event.upsert({
    where: { slug: 'tournoi-quiz-tantara-malagasy' },
    create: {
      slug: 'tournoi-quiz-tantara-malagasy',
      titleMg: 'Fiadiana ny Tompondaka : Tantara & Vakoka',
      titleFr: 'Grand Défi Quiz : Histoire & Souverains de Madagascar',
      shortDescMg: 'Hatraiza ny fahalalanao ny tantaran’ireo Mpanjaka sy ny tanindrazana ?',
      shortDescFr: 'Testez vos connaissances sur l’histoire des royaumes et des grandes figures malgaches.',
      descriptionMg:
        'Fanamby lehibe mifaninana ho an’ireo mpankafy tantara sy kolontsaina. Valio ireo andian-panontaniana haingana sy sarotra, angony ny isa ambony indrindra ary miakara eo amin’ny lampihazo.',
      descriptionFr:
        'Compétition chronométrée ouverte aux passionnés d’histoire. Répondez aux séries de questions, accumulez des points et hissez-vous au sommet du classement national.',
      rulesMg:
        'Andrana 3 no azon’ny mpandray anjara tsirairay atao. Ny isa ambony indrindra no raisina amin’ny filaharana.',
      rulesFr:
        '3 tentatives autorisées par joueur. Le meilleur score est retenu pour le classement final.',
      category: 'CHALLENGE',
      status: 'ACTIVE',
      participationType: 'REGISTRATION_REQUIRED',
      startDate: now,
      endDate: twoWeeksAhead,
      location: 'Kanto MG — Efitrano Lalao Quiz',
      isFeatured: false,
      metadata: {
        gameModuleId: 'quizGame',
      },
      currentParticipantsCount: 88,
      rewards: {
        create: [
          {
            rewardType: 'XP',
            titleMg: 'Traikefa Tompondaka +350 XP',
            titleFr: 'Bonus Compétiteur +350 XP',
            amount: 350,
            criteria: 'top_10',
          },
          {
            rewardType: 'BADGE',
            titleMg: 'Mari-boninahitra : Olon’ny Tantara',
            titleFr: 'Badge Prestige : Gardien de la Mémoire',
            badgeId: 'badge_history_champion',
            criteria: 'top_3',
          },
        ],
      },
    },
    update: {
      status: 'ACTIVE',
    },
  });

  // 3. Événement à Venir : Célébration du Fihavanana & Solidarité
  const event3 = await prisma.event.upsert({
    where: { slug: 'fankalazana-ny-fihavanana' },
    create: {
      slug: 'fankalazana-ny-fihavanana',
      titleMg: 'Fankalazana ny Fihavanana Malagasy',
      titleFr: 'Journée du Fihavanana & Fraternité',
      shortDescMg: 'Andro natokana hifampizarana sy hanamafisana ny fifankatiavana.',
      shortDescFr: 'Célébration des liens communautaires et des valeurs d’entraide malgaches.',
      descriptionMg:
        'Hetsika iaraha-mientana hanangonana ohabolana sy angano vaovao miaraka amin’ny fiaraha-monina Kanto MG. Tanjona : hahatratra fandraisana anjara miisa 500 nankatoavina.',
      descriptionFr:
        'Objectif collectif : proposer et valider ensemble plus de 500 nouveaux proverbes et contes populaires.',
      category: 'COMMUNITY',
      status: 'SCHEDULED',
      participationType: 'OPEN',
      startDate: oneWeekAhead,
      endDate: oneMonthAhead,
      location: 'Espace Communauté Kanto MG',
      isFeatured: false,
      currentParticipantsCount: 15,
      rewards: {
        create: [
          {
            rewardType: 'COINS',
            titleMg: 'Vola firaisankina +100',
            titleFr: '100 Vola Communautaires',
            amount: 100,
            criteria: 'completion',
          },
        ],
      },
    },
    update: {
      status: 'SCHEDULED',
    },
  });

  console.log(`✅ [Seed Events] 3 événements créés avec succès :
  - ${event1.titleFr} (${event1.id})
  - ${event2.titleFr} (${event2.id})
  - ${event3.titleFr} (${event3.id})`);
}

main()
  .catch((err) => {
    console.error('❌ Erreur lors du seed des événements :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
