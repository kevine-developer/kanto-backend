import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_TEMPLATES = [
  {
    code: 'CONFIRMATION',
    name: '1. Confirmation d’inscription',
    subject: 'Bienvenue dans le programme Bêta Kanto MG !',
    title: 'Votre candidature est bien enregistrée',
    senderName: 'Kanto MG • Bêta Test',
    buttonText: 'Consulter mon statut',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta?tab=already_registered',
    accentColor: '#4A6741',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Nous avons bien reçu votre inscription au programme de bêta-test de <strong>Kanto MG</strong> pour la ou les plateforme(s) : <strong>{{platform}}</strong>.</p>
<p>Notre équipe valide les accès par vagues successives afin d'assurer un suivi qualitatif de chaque testeur. Vous recevrez une notification par email dès que votre accès sera prêt à être activé.</p>
<p>Merci pour votre engagement à faire rayonner la culture, la langue et le patrimoine malgaches !</p>`,
    contentText: `Manao ahoana {{userName}}, nous avons bien reçu votre inscription au programme bêta Kanto MG pour la plateforme {{platform}}. Vous recevrez vos accès dès validation.`,
    footerText:
      'Kanto MG — Ny harena ara-kolontsaina malagasy eo am-pelatananao.',
  },
  {
    code: 'PENDING',
    name: '2. Inscription en attente',
    subject: 'Votre candidature au test Kanto MG est en cours d’examen',
    title: 'Préparation de votre accès au test',
    senderName: 'Kanto MG • Bêta Test',
    buttonText: 'En savoir plus sur le programme',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta',
    accentColor: '#C58B38',
    contentHtml: `<p>Bonjour {{userName}},</p>
<p>Votre candidature pour tester <strong>Kanto MG</strong> sur <strong>{{platform}}</strong> est actuellement placée dans notre liste d’attente prioritaire.</p>
<p>Nous ouvrons régulièrement de nouvelles places sur Google Play et TestFlight. Surveillez votre boîte de réception pour ne pas manquer votre invitation officielle.</p>`,
    contentText: `Bonjour {{userName}}, votre candidature Kanto MG sur {{platform}} est en attente. Vous serez notifié dès l'ouverture de nouveaux créneaux.`,
    footerText: 'Fihavanana & Fampandrosoana — Kanto MG.',
  },
  {
    code: 'ACCEPTANCE',
    name: '3. Acceptation de candidature',
    subject: 'Félicitations ! Vous êtes admis au programme bêta Kanto MG',
    title: 'Votre candidature a été retenue',
    senderName: 'Kanto MG • Bêta Test',
    buttonText: 'Accéder à mes invitations',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta?tab=already_registered',
    accentColor: '#4A6741',
    contentHtml: `<p>Bonjour {{userName}},</p>
<p>Excellente nouvelle : votre profil a été sélectionné pour participer au bêta-test de <strong>Kanto MG</strong> sur <strong>{{platform}}</strong> !</p>
<p>Vous allez recevoir dans les prochains instants vos liens de téléchargement personnalisés pour installer l'application et commencer l'aventure.</p>`,
    contentText: `Félicitations {{userName}}, votre candidature au bêta-test Kanto MG sur {{platform}} est acceptée ! Vos accès arrivent très vite.`,
    footerText: 'Kanto MG — Le sanctuaire de la culture malgache.',
  },
  {
    code: 'INVITE_ANDROID',
    name: '4. Invitation bêta Android (Google Play)',
    subject: 'Votre accès Google Play au test fermé Kanto MG est prêt !',
    title: 'Installez Kanto MG sur Android',
    senderName: 'Kanto MG • Équipe Android',
    buttonText: 'Rejoindre le test sur Google Play',
    buttonUrl: '{{androidTestingLink}}',
    secondaryButtonText: 'Télécharger sur le Play Store',
    secondaryButtonUrl: '{{downloadLink}}',
    accentColor: '#4A6741',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Votre compte Google Play (<strong>{{userEmail}}</strong>) est désormais autorisé à rejoindre le test fermé de <strong>Kanto MG</strong>.</p>
<div style="background-color: #F4F7F2; border-left: 4px solid #4A6741; padding: 14px 18px; margin: 18px 0; border-radius: 6px;">
  <strong style="color: #2D4227;">Instructions d'installation en 2 étapes :</strong>
  <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #3A4B35; line-height: 1.5;">
    <li>Cliquez sur le bouton ci-dessous pour accepter l'invitation avec votre compte Google (<strong>{{userEmail}}</strong>).</li>
    <li>Cliquez sur « Télécharger sur Google Play » pour installer l'application sur votre smartphone ou tablette Android.</li>
  </ol>
</div>
<p><em>Important : Vous devez être connecté sur Google Play avec l'adresse {{userEmail}} pour voir la fiche privée de l'application.</em></p>`,
    contentText: `Votre invitation Google Play pour Kanto MG est prête. Validez votre accès ici : {{androidTestingLink}} puis téléchargez sur le Play Store : {{downloadLink}}`,
    footerText: 'Une question ? Écrivez-nous à {{supportEmail}}.',
  },
  {
    code: 'INVITE_IOS',
    name: '5. Invitation bêta iOS (Apple TestFlight)',
    subject: 'Votre invitation Apple TestFlight pour Kanto MG est arrivée !',
    title: 'Installez Kanto MG sur iPhone & iPad',
    senderName: 'Kanto MG • Équipe iOS',
    buttonText: 'Ouvrir dans TestFlight',
    buttonUrl: '{{testFlightLink}}',
    accentColor: '#16442A',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Vous êtes officiellement invité à tester <strong>Kanto MG</strong> sur iOS via <strong>Apple TestFlight</strong> !</p>
<div style="background-color: #F5F7FA; border-left: 4px solid #16442A; padding: 14px 18px; margin: 18px 0; border-radius: 6px;">
  <strong style="color: #0E2919;">Comment installer l'application sur iOS :</strong>
  <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #2C3E33; line-height: 1.5;">
    <li>Téléchargez l'application gratuite <strong>Apple TestFlight</strong> depuis l'App Store de votre iPhone ou iPad si vous ne l'avez pas encore.</li>
    <li>Cliquez sur le bouton ci-dessous depuis votre appareil iOS pour rejoindre la bêta et installer Kanto MG.</li>
    <li>Ouvrez l'application et commencez votre exploration !</li>
  </ol>
</div>
<p>TestFlight vous permettra de recevoir automatiquement les mises à jour et d'envoyer facilement des captures d'écran de bugs.</p>`,
    contentText: `Votre invitation TestFlight pour Kanto MG est prête. Installez Apple TestFlight puis cliquez sur : {{testFlightLink}} pour installer l'application.`,
    footerText: 'Support iOS Kanto MG : {{supportEmail}}.',
  },
  {
    code: 'NEW_VERSION',
    name: '6. Nouvelle version bêta disponible',
    subject: 'Nouvelle version Kanto MG v{{appVersion}} disponible au test !',
    title: 'Mise à jour v{{appVersion}} disponible',
    senderName: 'Kanto MG • Bêta Test',
    buttonText: 'Mettre à jour l’application',
    buttonUrl: '{{downloadLink}}',
    accentColor: '#C58B38',
    contentHtml: `<p>Bonjour {{userName}},</p>
<p>Une nouvelle version de <strong>Kanto MG</strong> (version <strong>{{appVersion}}</strong>) vient d'être déployée sur votre plateforme (<strong>{{platform}}</strong>) !</p>
<p>Ouvrez votre store (Google Play ou TestFlight) pour installer les dernières améliorations, correctifs et nouveaux contenus culturels.</p>
<p>Nous attendons vos retours avec impatience !</p>`,
    contentText: `Nouvelle version v{{appVersion}} de Kanto MG disponible sur {{platform}}. Mettez à jour via {{downloadLink}}.`,
    footerText: 'Kanto MG — Mivoatra hatrany ho anao.',
  },
  {
    code: 'ANNOUNCEMENT',
    name: '7. Annonce importante du programme',
    subject: 'Information importante concernant le bêta-test Kanto MG',
    title: 'Nouvelles du programme Kanto MG',
    senderName: 'Kanto MG • Coordination',
    buttonText: 'Découvrir les nouveautés',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta',
    accentColor: '#4A6741',
    contentHtml: `<p>Chers testeurs,</p>
<p>Nous tenons à partager avec vous une mise au point essentielle sur l'avancement du projet Kanto MG et sur les prochaines étapes majeures de nos tests.</p>
<p>Votre fidélité et vos remarques précises nous aident à bâtir chaque jour l'expérience culturelle la plus fidèle et immersive possible.</p>`,
    contentText: `Chers testeurs, découvrez les dernières avancées du projet Kanto MG sur https://app-kanto.gastsar.fr/beta`,
    footerText: "Misaotra betsaka amin'ny fiaraha-miasa.",
  },
  {
    code: 'FEEDBACK_REQUEST',
    name: '8. Demande de retour d’expérience',
    subject: 'Votre avis compte : donnez votre feedback sur Kanto MG',
    title: 'Partagez vos impressions et suggestions',
    senderName: 'Kanto MG • Qualité & UX',
    buttonText: 'Transmettre mon feedback',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta?tab=feedback',
    accentColor: '#C0392B',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Vous avez eu l'occasion de découvrir et tester <strong>Kanto MG</strong> depuis quelques jours sur votre appareil (<strong>{{platform}}</strong>).</p>
<p>Avez-vous rencontré des bugs ? Quels jeux ou contes vous ont le plus marqué ? Quelles améliorations souhaiteriez-vous voir dans la version finale ?</p>
<p>Prenez 2 minutes pour nous faire part de vos ressentis via notre formulaire dédié.</p>`,
    contentText: `Manao ahoana {{userName}}, partagez vos impressions et remarques sur Kanto MG sur https://app-kanto.gastsar.fr/beta?tab=feedback`,
    footerText: "Votre retour façonne l'avenir de Kanto MG.",
  },
  {
    code: 'THANK_YOU',
    name: '9. Remerciement après participation',
    subject: 'Misaotra betsaka pour votre participation au test Kanto MG !',
    title: 'Un immense merci pour votre contribution',
    senderName: 'Kanto MG • Direction',
    buttonText: 'Voir notre hommage aux contributeurs',
    buttonUrl: 'https://app-kanto.gastsar.fr/pages/about',
    accentColor: '#4A6741',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Toute l’équipe de <strong>Kanto MG</strong> tient à vous adresser ses plus chaleureux remerciements pour le temps précieux que vous avez consacré à tester notre application.</p>
<p>Grâce à vos signalements, vos encouragements et vos suggestions constructives, Kanto MG est aujourd'hui plus robuste, plus beau et encore plus riche.</p>`,
    contentText: `Misaotra betsaka {{userName}} pour votre précieuse contribution au bêta-test de Kanto MG !`,
    footerText: 'Ny Firaisan-kina no herintsika — Kanto MG.',
  },
  {
    code: 'PROGRAM_END',
    name: '10. Fin du programme bêta',
    subject: 'Kanto MG arrive sur les stores publics : fin du programme bêta',
    title: 'Le lancement public officiel est là !',
    senderName: 'Kanto MG • Équipe Officielle',
    buttonText: 'Installer la version officielle',
    buttonUrl: 'https://app-kanto.gastsar.fr/download',
    accentColor: '#16442A',
    contentHtml: `<p>Chers bêta-testeurs,</p>
<p>C’est avec une grande fierté que nous vous annonçons le lancement officiel de <strong>Kanto MG</strong> sur Google Play et l’Apple App Store !</p>
<p>Cette étape franchie marque la fin de la période de bêta-test fermé. Nous vous invitons à installer dès maintenant la version publique définitive.</p>
<p>Encore merci pour votre rôle fondamental dans cette belle aventure !</p>`,
    contentText: `Kanto MG est officiellement publié sur les stores ! Téléchargez la version finale : https://app-kanto.gastsar.fr/download`,
    footerText: "Kanto MG — Ravan'ny fitiavana, velon'ny fihavanana.",
  },
  {
    code: 'UNSUBSCRIBE_CONFIRMATION',
    name: '11. Confirmation de désinscription (RGPD)',
    subject: 'Confirmation de votre désinscription du programme Bêta Kanto MG',
    title: 'Votre désinscription a bien été prise en compte',
    senderName: 'Kanto MG • Bêta Test',
    buttonText: 'Rejoindre à nouveau le programme',
    buttonUrl: 'https://app-kanto.gastsar.fr/beta',
    secondaryButtonText: 'Partager une suggestion',
    secondaryButtonUrl: 'https://app-kanto.gastsar.fr/beta?tab=feedback',
    accentColor: '#C0392B',
    contentHtml: `<p>Manao ahoana {{userName}},</p>
<p>Nous vous confirmons que votre demande de retrait du programme de bêta-test de <strong>Kanto MG</strong> a bien été enregistrée et traitée.</p>
<div style="background-color: #FDF7F7; border-left: 4px solid #C0392B; padding: 14px 18px; margin: 18px 0; border-radius: 6px;">
  <strong style="color: #922B21;">Protection de vos données &amp; Accès :</strong>
  <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #5B2C27; line-height: 1.5;">
    <li>Vos accès aux versions de test fermé (Google Play / TestFlight) ont été révoqués.</li>
    <li>Votre adresse e-mail a été immédiatement retirée de nos listes de diffusion.</li>
    <li>Conformément au RGPD, aucune sollicitation ultérieure ne vous sera adressée.</li>
  </ul>
</div>
<p><em>Misaotra betsaka</em> pour l'intérêt et le temps que vous avez accordés à Kanto MG et au rayonnement de la culture malgache.</p>
<p>Si cette démarche résulte d'une fausse manipulation ou si vous souhaitez nous rejoindre à l'avenir, la porte de Kanto MG vous reste toujours ouverte.</p>`,
    contentText: `Manao ahoana {{userName}}, votre désinscription du programme bêta Kanto MG est confirmée. Vos accès aux tests et listes de diffusion ont été révoqués conformément au RGPD. Misaotra betsaka pour votre participation. Vous pouvez vous réinscrire à tout moment : https://app-kanto.gastsar.fr/beta`,
    footerText:
      'Kanto MG — Ny harena ara-kolontsaina malagasy eo am-pelatananao.',
  },
];

async function seedBetaPlatform() {
  console.log(
    '🚀 Initialisation des données de la plateforme Bêta Kanto MG...',
  );

  // 1. Groupes par défaut
  const defaultGroups = [
    {
      name: 'Early Access',
      description:
        'Pionniers du programme bêta ayant accès en avant-première absolue aux nouveautés.',
      color: '#4A6741',
      targetPlatforms: ['ANDROID', 'IOS'],
      isDefault: true,
    },
    {
      name: 'Beta 1 - Testeurs Généraux',
      description:
        'Groupe principal de testeurs pour validation des parcours nominaux.',
      color: '#C58B38',
      targetPlatforms: ['ANDROID', 'IOS'],
      isDefault: false,
    },
    {
      name: 'Testeurs VIP & Partenaires',
      description:
        'Enseignants, linguistes et partenaires culturels de Madagascar.',
      color: '#C0392B',
      targetPlatforms: ['ANDROID', 'IOS'],
      isDefault: false,
    },
  ];

  for (const group of defaultGroups) {
    await prisma.betaGroup.upsert({
      where: { name: group.name },
      update: group,
      create: group,
    });
  }
  console.log('✅ Groupes bêta synchronisés (3 groupes).');

  // 2. Templates d'emails
  for (const tpl of DEFAULT_TEMPLATES) {
    await prisma.betaEmailTemplate.upsert({
      where: { code: tpl.code },
      update: tpl,
      create: tpl,
    });
  }
  console.log('✅ Modèles d’emails synchronisés (10 templates).');

  // 3. Configuration d'automatisation
  const existingConfig = await prisma.betaAutomationConfig.findFirst();
  if (!existingConfig) {
    await prisma.betaAutomationConfig.create({
      data: {
        autoConfirmRegistration: true,
        autoInviteOnApproval: false,
        autoNotifyNewVersions: true,
        reminderIntervalDays: 7,
        feedbackRequestDays: 14,
        playStoreWebLink:
          'https://play.google.com/apps/testing/com.devengalere.kantomg',
        playStoreAppLink:
          'https://play.google.com/store/apps/details?id=com.devengalere.kantomg',
        testFlightPublicLink: 'https://testflight.apple.com/join/kantomg',
        supportEmail: 'contact@kanto.mg',
      },
    });
    console.log('✅ Configuration d’automatisation initialisée.');
  } else {
    console.log('ℹ️ Configuration d’automatisation déjà existante.');
  }

  console.log(
    '🎉 Initialisation de la plateforme de bêta-test terminée avec succès !',
  );
  await prisma.$disconnect();
  await pool.end();
}

seedBetaPlatform().catch((err) => {
  console.error('❌ Erreur lors du seed bêta-test:', err);
  process.exit(1);
});
