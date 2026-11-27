import {
  AiFeatureStatus,
  AiKnowledgeStatus,
  AiKnowledgeVisibility,
} from '../../../generated/prisma/client.js';

export interface DefaultFeatureSeed {
  key: string;
  nameFr: string;
  nameMg: string;
  category: string;
  status: AiFeatureStatus;
  platforms: string[];
  description: string;
  notes?: string;
}

export const DEFAULT_FEATURE_REGISTRY_SEEDS: DefaultFeatureSeed[] = [
  {
    key: 'ohabolana',
    nameFr: 'Proverbes & Expressions (Ohabolana)',
    nameMg: 'Ohabolana sy Oha-pitenenana',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Catalogue bilingue de proverbes, expressions et dictons malgaches avec traduction française, explication culturelle, variantes dialectales et proverbe du jour.',
  },
  {
    key: 'angano',
    nameFr: 'Contes traditionnels (Angano)',
    nameMg: 'Angano sy Tantara',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Contes traditionnels bilingues structurés par paragraphes, avec morale et narration audio (voix de conteurs et synthèse vocale).',
  },
  {
    key: 'kabary',
    nameFr: 'Art oratoire (Kabary)',
    nameMg: 'Kabary Malagasy',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Discours cérémoniels structurés étape par étape (vodiondry, famangiana, fisaorana) avec rôles, étiquette rituelle et proverbe conclusif.',
  },
  {
    key: 'tononkalo',
    nameFr: 'Poésie & Hainteny (Tononkalo)',
    nameMg: 'Tononkalo sy Hainteny',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Anthologie de poèmes classiques et contemporains malgaches découpés par strophes bilingues avec contexte littéraire.',
  },
  {
    key: 'tsianjery',
    nameFr: 'Récitations (Tsianjery)',
    nameMg: 'Tsianjery',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Textes de récitation et exercices de mémorisation issus du répertoire scolaire et littéraire malgache.',
  },
  {
    key: 'raki_teny',
    nameFr: 'Mots rares & étymologies (Raki-teny)',
    nameMg: 'Raki-teny Miafina',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Dictionnaire des mots rares, poétiques ou anciens malgaches avec transcription phonétique, exemple contextualisé et étymologie.',
  },
  {
    key: 'histoire_heritage',
    nameFr: 'Histoire, Emblèmes & Vintana',
    nameMg: 'Tantara, Sary famantarana & Vintana',
    category: 'PATRIMOINE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Fiches sur les présidents, billets historiques, blasons des provinces, emblèmes naturels, dates clés et astrologie traditionnelle (Vintana).',
  },
  {
    key: 'apprendre',
    nameFr: 'Parcours pédagogiques (Apprendre)',
    nameMg: 'Fianarana',
    category: 'PEDAGOGIE',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Parcours progressifs de langue et culture malgaches avec leçons interactives, phonétique et révision espacée.',
  },
  {
    key: 'jeux_culturels',
    nameFr: 'Jeux éducatifs (Quiz, Ankamantatra, Mots)',
    nameMg: 'Lalao ara-kolontsaina',
    category: 'JEUX',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Mini-jeux culturels : Vrai ou Faux (Marina sa Diso), Remets dans l’ordre, Mot manquant (Fenoy ny banga), Devinettes (Ankamantatra) et Quiz civiques.',
  },
  {
    key: 'multijoueur_duel',
    nameFr: 'Défis & Duels 1v1 en direct',
    nameMg: 'Fanamby mivantana',
    category: 'JEUX',
    status: AiFeatureStatus.BETA,
    platforms: ['android', 'ios'],
    description:
      'Affrontements culturels en temps réel entre amis ou joueurs via WebSocket.',
  },
  {
    key: 'offline_partial',
    nameFr: 'Consultation hors-ligne partielle',
    nameMg: 'Fijerena tsy mila aterineto (ampahany)',
    category: 'SYSTEME',
    status: AiFeatureStatus.BETA,
    platforms: ['android', 'ios'],
    description:
      'Disponible progressivement uniquement sur certains contenus déjà chargés ; une connexion réseau reste requise pour le reste de l’application.',
    notes: 'Ne jamais promouvoir comme 100 % hors-ligne à ce stade.',
  },
  {
    key: 'beta_program',
    nameFr: 'Programme Bêta (Android Google Groups & iOS TestFlight)',
    nameMg: 'Fandaharan’asa Bêta',
    category: 'SYSTEME',
    status: AiFeatureStatus.BETA,
    platforms: ['android', 'ios', 'web'],
    description:
      'Accès Android direct via le Google Group officiel puis Google Play ; inscription iOS via formulaire web puis invitation Apple TestFlight (accès non instantané).',
  },
  {
    key: 'contributions_communaute',
    nameFr: 'Contributions communautaires & Classements',
    nameMg: 'Fandraisan’anjara & Filaharana',
    category: 'SOCIAL',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios'],
    description:
      'Soumission de proverbes par la communauté avec modération avant publication, système d’XP, séries et badges.',
  },
  {
    key: 'evenements_billetterie',
    nameFr: 'Événements culturels & Billetterie QR',
    nameMg: 'Hetsika ara-kolontsaina',
    category: 'SOCIAL',
    status: AiFeatureStatus.AVAILABLE,
    platforms: ['android', 'ios', 'web'],
    description:
      'Découverte et inscription à des événements culturels partenaires avec billets sécurisés par QR code.',
  },
  {
    key: 'abonnements_vip',
    nameFr: 'Offres & Statut Premium / VIP',
    nameMg: 'Tolotra Premium / VIP',
    category: 'SYSTEME',
    status: AiFeatureStatus.IN_DEVELOPMENT,
    platforms: ['android', 'ios'],
    description:
      'Modèle d’abonnement et paiement intégré en cours de finalisation (bêta actuelle 100 % gratuite sans achat intégré).',
    notes:
      'Ne pas annoncer de paiement ou d’abonnement payant ouvert tant que la bêta gratuite est active.',
  },
];

export interface DefaultKnowledgeSeed {
  slug: string;
  title: string;
  category: string;
  version: string;
  source: string;
  validationStatus: AiKnowledgeStatus;
  visibilityScope: AiKnowledgeVisibility;
  content: string;
}

export const DEFAULT_KNOWLEDGE_DOCUMENTS: DefaultKnowledgeSeed[] = [
  {
    slug: 'kanto-identite-charte-editoriale',
    title: 'Identité, Vision & Charte Éditoriale Kanto MG (FR / MG)',
    category: 'IDENTITY',
    version: '1.0',
    source: 'Direction Éditoriale Kanto MG',
    validationStatus: AiKnowledgeStatus.VALIDATED,
    visibilityScope: AiKnowledgeVisibility.INTERNAL_TEAM,
    content: `## Mission et valeurs de Kanto MG
Kanto MG est une application culturelle et éducative dédiée à la transmission vivante de la langue, de la littérature orale et du patrimoine de Madagascar.
Les relations et les prises de parole de Kanto MG reposent sur deux valeurs cardinales malgaches : le Fihavanana (solidarité, lien fraternel) et l'Haja (respect mutuel, dignité).

## Positionnement et ton éditorial
- Ton : digne, chaleureux, cultivé, accessible et contemporain. Jamais folklorique ni moralisateur.
- Sobriété : éviter les accroches publicitaires tapageuses, le jargon startup creux et l'accumulation d'emojis.
- Authenticité culturelle : chaque proverbe (Ohabolana), expression (Oha-pitenenana) ou référence historique doit être vérifié dans le corpus réel avant publication.
- Identité visuelle : Papier minéral (#F5F4F0), Ébène mat (#0D0D0B), Vert olive Tanimbary (#4A6741 / #6B9E61), Terre cuite (#C0392B) et Ocre doré (#C58B38).`,
  },
  {
    slug: 'kanto-programme-beta-distribution',
    title:
      'Modalités du Programme Bêta (Android Google Groups & iOS TestFlight)',
    category: 'BETA',
    version: '1.1',
    source: 'Équipe Produit & Release Kanto MG',
    validationStatus: AiKnowledgeStatus.VALIDATED,
    visibilityScope: AiKnowledgeVisibility.INTERNAL_TEAM,
    content: `## Parcours d'accès officiel (portail app-kanto.gastsar.fr)
- Programme 100 % gratuit, sans publicité et sans achat intégré pendant toute la phase bêta.
- Parcours Android : aucun formulaire sur le site web. L'utilisateur rejoint directement le Google Group officiel (https://groups.google.com/g/communaute-kanto), confirme son inscription sur Google Play puis télécharge l'application Android (9.0+).
- Parcours iOS (iPhone / iPad) : inscription via le formulaire web avec l'adresse e-mail Apple (chiffrée au repos en AES-256-GCM). L'accès n'est pas instantané : le testeur reçoit une invitation Apple TestFlight par e-mail après ajout de son compte.

## Règle de communication importante
- Ne jamais promettre un mode "100 % hors-ligne" sur toute l'application : l'accès hors connexion est actuellement partiel sur certains contenus déjà chargés et en cours de stabilisation.`,
  },
  {
    slug: 'kanto-guide-formats-reseaux-sociaux',
    title: 'Guide de rédaction par plateforme (Social, Newsletter & Vidéo)',
    category: 'EDITORIAL',
    version: '1.0',
    source: 'Studio Marketing Kanto MG',
    validationStatus: AiKnowledgeStatus.VALIDATED,
    visibilityScope: AiKnowledgeVisibility.INTERNAL_TEAM,
    content: `## Adaptation par canal
- Facebook : texte narratif lisible (120 à 250 mots), contextualisation culturelle d'un proverbe ou d'un conte, invitation au dialogue en commentaire et lien vers app-kanto.gastsar.fr.
- Instagram : format visuel 4:5 (carrousel ou carte typographique Papier/Tanimbary), légende structurée avec citation malgache + traduction claire + 4 à 7 hashtags ciblés.
- TikTok / Reels / Shorts (9:16) : script vidéo court (30 à 45 s) structuré en Accroche (0-3 s), Récit ou anecdote culturelle (3-30 s), Conclusion + CTA sobre.
- LinkedIn : angle produit, transmission patrimoniale, ingénierie ou impact éducatif (150 à 300 mots), zéro racolage.
- Newsletter / Communiqué : objet net sans majuscules abusives, résumé éditorial, nouveautés vérifiées et un seul CTA principal.`,
  },
  {
    slug: 'kanto-faq-confidentialite-donnees',
    title: 'FAQ Produit, Confidentialité & Transparence des Données',
    category: 'FAQ',
    version: '1.0',
    source: 'Conformité & Support Kanto MG',
    validationStatus: AiKnowledgeStatus.VALIDATED,
    visibilityScope: AiKnowledgeVisibility.INTERNAL_TEAM,
    content: `## Protection des données et vie privée
- Aucune donnée personnelle n'est vendue ou cédée à des régies publicitaires.
- Les adresses e-mails des bêta-testeurs iOS sont chiffrées au repos (AES-256-GCM) et hachées par HMAC-SHA-256.
- Les avis communautaires affichés publiquement sur le portail web sont uniquement ceux autorisés explicitement par leurs auteurs et validés par la modération.
- Les utilisateurs peuvent signaler une anomalie sur /feedback ou directement depuis l'application mobile (kantomg://feedback?type=bug).`,
  },
];
