import 'dotenv/config';
import crypto from 'crypto';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

// ─── 1. VERROU DE SÉCURITÉ : ENVIRONNEMENT DE DÉVELOPPEMENT UNIQUEMENT ──────────
const isProd =
  process.env.NODE_ENV === 'production' ||
  process.env.APP_ENV === 'production' ||
  process.env.ENVIRONMENT === 'production';

if (isProd) {
  console.error(
    '🚫 [SÉCURITÉ BLOCANTE] Ce script de simulation d’événement avec billetterie est strictement réservé à l’environnement de DÉVELOPPEMENT (interdit en Production).',
  );
  process.exit(1);
}

// ─── 2. CONNEXION PRISMA STANDALONE ───────────────────────────────────────────
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/kanto?schema=public';

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedDevTicketEvent() {
  console.log('🎟️  [Seed Dev Event] Initialisation de l’événement de simulation avec billetterie...');

  const now = new Date();
  const startDate = new Date(now.getTime() - 24 * 3600 * 1000); // Début hier (déjà actif)
  const endDate = new Date(now.getTime() + 14 * 24 * 3600 * 1000); // Fin dans 14 jours
  const registrationDeadline = new Date(now.getTime() + 12 * 24 * 3600 * 1000);

  const eventSlug = 'alina-kanto-tsianjery-billet-dev';

  // ─── 3. CRÉATION OU MISE À JOUR IDEMPOTENTE DE L'ÉVÉNEMENT (UPSERT) ───────────
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      titleMg: 'Alin-kanto sy Tsianjery Malagasy (Andrana)',
      titleFr: 'Nuit Culturelle & Tsianjery Malgache (Simulation Billet)',
      descriptionMg:
        'Hetsika ara-kolontsaina an-tsehatra ho fankalazana ny haisoratra, kabary ary ny tsianjery malagasy. Ilàna tapakila nomerika manokana miaraka amin\'ny QR Code ny fidirana amin\'ity hetsika ity.',
      descriptionFr:
        'Événement culturel immersif célébrant les traditions orales, le kabary et la poésie tsianjery. Un billet numérique individuel avec QR Code sécurisé est obligatoire pour accéder au site.',
      shortDescMg: 'Hetsika manokana misy tapakila nomerika sy fanamarinana fidirana QR Code.',
      shortDescFr: 'Événement culturel avec billetterie numérique et contrôle d’accès par QR Code.',
      category: 'CULTURE',
      status: 'ACTIVE',
      participationType: 'OPEN',
      minTier: 'FREE',
      location: 'Lapan’ny Kolontsaina sy ny Fanatanjahantena, Mahamasina (Antananarivo)',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants: 100,
      enableWaitlist: true,
      waitlistCapacity: 25,
      isPaid: false,
      ticketingEnabled: true,
      ticketEntryMode: 'SINGLE',
      ticketMaxEntries: 1,
      isFeatured: true,
      rulesMg:
        '1. Tsy maintsy aseho eo am-pidirana ny tapakila nomerika (QR Code) avy amin\'ny fampiharana Kanto.\n2. Tapakila mitondra ny anaran\'ny mpandray anjara ary tsy azo afindra.\n3. Fanajana ny fomba amam-panao, ny toerana masina sy ny Fihavanana.',
      rulesFr:
        '1. Présentation obligatoire du billet numérique (QR Code) généré sur l’application Kanto à l’entrée.\n2. Billet strictement nominatif, individuel et non transférable.\n3. Respect des us et coutumes traditionnels malgaches et du Fihavanana.',
    },
    create: {
      slug: eventSlug,
      titleMg: 'Alin-kanto sy Tsianjery Malagasy (Andrana)',
      titleFr: 'Nuit Culturelle & Tsianjery Malgache (Simulation Billet)',
      descriptionMg:
        'Hetsika ara-kolontsaina an-tsehatra ho fankalazana ny haisoratra, kabary ary ny tsianjery malagasy. Ilàna tapakila nomerika manokana miaraka amin\'ny QR Code ny fidirana amin\'ity hetsika ity.',
      descriptionFr:
        'Événement culturel immersif célébrant les traditions orales, le kabary et la poésie tsianjery. Un billet numérique individuel avec QR Code sécurisé est obligatoire pour accéder au site.',
      shortDescMg: 'Hetsika manokana misy tapakila nomerika sy fanamarinana fidirana QR Code.',
      shortDescFr: 'Événement culturel avec billetterie numérique et contrôle d’accès par QR Code.',
      category: 'CULTURE',
      status: 'ACTIVE',
      participationType: 'OPEN',
      minTier: 'FREE',
      location: 'Lapan’ny Kolontsaina sy ny Fanatanjahantena, Mahamasina (Antananarivo)',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants: 100,
      enableWaitlist: true,
      waitlistCapacity: 25,
      isPaid: false,
      ticketingEnabled: true,
      ticketEntryMode: 'SINGLE',
      ticketMaxEntries: 1,
      isFeatured: true,
      rulesMg:
        '1. Tsy maintsy aseho eo am-pidirana ny tapakila nomerika (QR Code) avy amin\'ny fampiharana Kanto.\n2. Tapakila mitondra ny anaran\'ny mpandray anjara ary tsy azo afindra.\n3. Fanajana ny fomba amam-panao, ny toerana masina sy ny Fihavanana.',
      rulesFr:
        '1. Présentation obligatoire du billet numérique (QR Code) généré sur l’application Kanto à l’entrée.\n2. Billet strictement nominatif, individuel et non transférable.\n3. Respect des us et coutumes traditionnels malgaches et du Fihavanana.',
    },
  });

  console.log(`✅ [Événement] ID: ${event.id}`);
  console.log(`   Titre : "${event.titleFr}"`);
  console.log(`   Slug  : /${event.slug}`);
  console.log(`   Billetterie activée : ${event.ticketingEnabled ? 'OUI' : 'NON'}`);
  console.log(`   Statut : ${event.status}`);

  // ─── 4. RECOMPENSES DE L'ÉVÉNEMENT (XP & VOLA) ───────────────────────────────
  await prisma.eventReward.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventReward.createMany({
    data: [
      {
        eventId: event.id,
        rewardType: 'XP',
        titleMg: '+250 Isa traikefa (XP)',
        titleFr: '+250 Points d’expérience (XP)',
        amount: 250,
        criteria: 'participation',
      },
      {
        eventId: event.id,
        rewardType: 'COINS',
        titleMg: '+100 Vola Kanto',
        titleFr: '+100 Pièces Vola Kanto',
        amount: 100,
        criteria: 'participation',
      },
    ],
  });
  console.log('   Récompenses configurées : +250 XP, +100 Vola');

  // ─── 5. SIMULATION D'UN BILLET TEST POUR LE PREMIER UTILISATEUR DISPONIBLE ───
  const firstUser = await prisma.user.findFirst({
    where: {
      email: {
        not: {
          contains: 'deleted',
        },
      },
    },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'asc' },
  });

  if (firstUser) {
    console.log(`\n👤 [Participant Démo] Utilisateur trouvé pour simulation : ${firstUser.name} (${firstUser.email})`);

    // Inscription / Participation
    const participation = await prisma.eventParticipation.upsert({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: firstUser.id,
        },
      },
      update: {
        status: 'REGISTERED',
      },
      create: {
        userId: firstUser.id,
        eventId: event.id,
        status: 'REGISTERED',
      },
    });

    // Génération du Billet de simulation
    const secureToken = crypto.randomBytes(32).toString('hex');
    const hexSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const ticketNumber = `KT-TSI-${hexSuffix}`;

    const existingTicket = await prisma.eventTicket.findUnique({
      where: { participationId: participation.id },
    });

    let ticket;
    if (existingTicket) {
      ticket = await prisma.eventTicket.update({
        where: { id: existingTicket.id },
        data: {
          status: 'VALID',
          validFrom: startDate,
          validUntil: endDate,
          usedCount: 0,
        },
      });
      console.log(`🎫 [Billet Existant Actualisé] N° ${ticket.ticketNumber}`);
    } else {
      ticket = await prisma.eventTicket.create({
        data: {
          ticketNumber,
          secureToken,
          eventId: event.id,
          participationId: participation.id,
          userId: firstUser.id,
          status: 'VALID',
          entryMode: 'SINGLE',
          validFrom: startDate,
          validUntil: endDate,
          maxEntries: 1,
          usedCount: 0,
        },
      });
      console.log(`🎫 [Nouveau Billet Généré] N° ${ticket.ticketNumber}`);
    }

    console.log(`   Token sécurisé : ${ticket.secureToken.substring(0, 16)}...`);
    console.log(`   Statut billet  : ${ticket.status}`);
    console.log(`   URL QR Code    : kanto://ticket/validate/${ticket.secureToken}`);

    // Mettre à jour le compteur de participants
    const totalParticipants = await prisma.eventParticipation.count({
      where: { eventId: event.id, status: 'REGISTERED' },
    });
    await prisma.event.update({
      where: { id: event.id },
      data: { currentParticipantsCount: totalParticipants },
    });
  } else {
    console.log('ℹ️  Aucun utilisateur existant en base pour attacher un billet automatique. L’événement est prêt pour inscription.');
  }

  console.log('\n✨ Simulation terminée avec succès !');
  console.log('📱 L’événement est visible sur l’application mobile Kanto et sur le panneau d’administration.');
}

seedDevTicketEvent()
  .catch((err) => {
    console.error('❌ Erreur lors du seed dev de l’événement :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
