import { PrismaService } from './dist/src/prisma/prisma.service.js';

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();
  console.log('=== RAPPORT DE DONNEES POSTGRESQL ===\n');

  const categories = {
    "1. Utilisateurs & Authentification": [
      'user', 'session', 'account', 'verification'
    ],
    "2. Progression & Gamification": [
      'userProgress', 'gameProgression', 'xpTransaction', 'userBadge'
    ],
    "3. Éducation Civique (Leçons & Quiz)": [
      'civicContent', 'civicStructureRole', 'civicQuizQuestion', 'civicQuizSession', 'civicQuizAnswer'
    ],
    "4. Jeux Solo & Sessions": [
      'trueFalseQuestion', 'trueFalseSession', 'trueFalseAnswer',
      'riddleQuestion', 'riddleSession', 'riddleAnswer',
      'missingWordLevel', 'missingWordQuestion',
      'wordPuzzleLevel', 'wordPuzzleSentence'
    ],
    "5. Mode Duel / Multijoueur": [
      'duelSession', 'duelPlayer', 'duelAnswer'
    ],
    "6. Astrologie Malagasy (Vintana)": [
      'vintanaSign', 'vintanaForecast'
    ],
    "7. Culture Malagasy (Littérature, Contes, Kabary, etc.)": [
      'malagasyItem', 'citation', 'conte', 'conteParagraph', 'kabary', 'kabaryStep', 'poesie', 'poesieStanza', 'recitation', 'theme', 'region'
    ],
    "8. Système, Paramètres, Verrous & Onboarding": [
      'moduleLock', 'onboardingSlide', 'systemAnnouncement', 'notification'
    ],
    "9. Communauté & Interactions": [
      'contribution', 'contributionVote', 'contributionComment', 'contentReport', 'favorite', 'like', 'viewHistory'
    ]
  };

  for (const [section, models] of Object.entries(categories)) {
    console.log(`\n--- ${section} ---`);
    for (const m of models) {
      try {
        if (prisma[m]) {
          const count = await prisma[m].count();
          console.log(`  ${m.padEnd(26)} : ${count} enregistrements`);
        } else {
          console.log(`  ${m.padEnd(26)} : [Absent du client Prisma]`);
        }
      } catch (e) {
        console.log(`  ${m.padEnd(26)} : ERREUR (${e.message})`);
      }
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
