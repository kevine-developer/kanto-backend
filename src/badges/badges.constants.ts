export type BadgeCategory =
  'streak' | 'proverbs' | 'games' | 'community' | 'civic' | 'xp' | 'all';

export interface BadgeDefinition {
  id: string;
  titleMg: string;
  titleFr: string;
  descriptionMg: string;
  descriptionFr: string;
  category: BadgeCategory;
  iconKey: string; // Ex: "Flame", "Scroll", "Gamepad2", "Users", "Landmark", "Trophy", "Swords"
  color: string;
  targetValue: number;
  xpReward: number; // Bonus XP attribué lors de l'obtention
}

export const OFFICIAL_BADGES: BadgeDefinition[] = [
  // 1. SÉRIES & ASSIDUITÉ (STREAK)
  {
    id: 'streak_3',
    titleMg: 'Afo Velona',
    titleFr: 'Flamme Naissante',
    descriptionMg:
      "Niditra nisesy nandritra ny 3 andro teo amin'ny fampiharana.",
    descriptionFr: "Se connecter 3 jours consécutifs sur l'application.",
    category: 'streak',
    iconKey: 'Flame',
    color: '#E05615',
    targetValue: 3,
    xpReward: 30,
  },
  {
    id: 'streak_7',
    titleMg: 'Mpiandry Afo',
    titleFr: 'Gardien de la Flamme',
    descriptionMg:
      "Niditra nisesy nandritra ny 7 andro teo amin'ny fampiharana.",
    descriptionFr: "Se connecter 7 jours consécutifs sur l'application.",
    category: 'streak',
    iconKey: 'Flame',
    color: '#D97706',
    targetValue: 7,
    xpReward: 70,
  },
  {
    id: 'streak_30',
    titleMg: "Tompondaka amin'ny Faharetana",
    titleFr: 'Maître de la Persévérance',
    descriptionMg: 'Niditra nisesy nandritra ny 30 andro tsy tapaka.',
    descriptionFr:
      'Maintenir une série active pendant 30 jours sans interruption.',
    category: 'streak',
    iconKey: 'Flame',
    color: '#B45309',
    targetValue: 30,
    xpReward: 300,
  },

  // 2. EXPLORATION CULTURELLE (PROVERBES / OHABOLANA)
  {
    id: 'proverbs_10',
    titleMg: 'Mpandray Fahendrena',
    titleFr: 'Initié aux Proverbes',
    descriptionMg: 'Namaky sy nandinika ohabolana mihoatra ny 10.',
    descriptionFr: 'Explorer et méditer au moins 10 proverbes traditionnels.',
    category: 'proverbs',
    iconKey: 'Scroll',
    color: '#4A6741',
    targetValue: 10,
    xpReward: 40,
  },
  {
    id: 'proverbs_20',
    titleMg: 'Mpankafy Ohabolana',
    titleFr: 'Amoureux des Proverbes',
    descriptionMg: 'Nandray sy namaky ohabolana mihoatra ny 20.',
    descriptionFr: 'Découvrir plus de 20 proverbes et leurs explications.',
    category: 'proverbs',
    iconKey: 'Scroll',
    color: '#3B5534',
    targetValue: 20,
    xpReward: 80,
  },
  {
    id: 'proverbs_50',
    titleMg: 'Olon-kendry',
    titleFr: 'Sage de la Tradition',
    descriptionMg: 'Nikaroka sy nandalina ohabolana 50 mahery.',
    descriptionFr: 'Explorer plus de 50 sagesses et maximes ancestrales.',
    category: 'proverbs',
    iconKey: 'Scroll',
    color: '#243421',
    targetValue: 50,
    xpReward: 200,
  },

  // 3. JEUX & DÉFIS (GAMES & DUELS)
  {
    id: 'games_5',
    titleMg: 'Mpilalao Vao Manomboka',
    titleFr: 'Initié au Défi',
    descriptionMg: "Nandresy tamin'ny lalao ara-kolontsaina 5.",
    descriptionFr: 'Remporter 5 parties de jeux de mots ou quiz culturels.',
    category: 'games',
    iconKey: 'Gamepad2',
    color: '#2563EB',
    targetValue: 5,
    xpReward: 50,
  },
  {
    id: 'games_10',
    titleMg: 'Mpilalao Mahay',
    titleFr: 'Maître du Jeu',
    descriptionMg: "Nandresy tamin'ny lalao 10 (Quiz sy Teny mikorontana).",
    descriptionFr: 'Réussir 10 parties de jeux de mots et quiz culturels.',
    category: 'games',
    iconKey: 'Gamepad2',
    color: '#1D4ED8',
    targetValue: 10,
    xpReward: 100,
  },
  {
    id: 'duel_winner',
    titleMg: "Mpanjakan'ny Kianja",
    titleFr: 'Champion de Duel',
    descriptionMg:
      "Nandresy tamin'ny fifanandrinana mivantana 1v1 multijoueur.",
    descriptionFr:
      'Remporter un duel multijoueur en direct face à un adversaire.',
    category: 'games',
    iconKey: 'Swords',
    color: '#7C3AED',
    targetValue: 1,
    xpReward: 60,
  },

  // 4. COMMUNAUTÉ & PARTAGE (COMMUNITY)
  {
    id: 'contributor_1',
    titleMg: 'Mpandray Anjara Voalohany',
    titleFr: 'Premier Partage',
    descriptionMg: 'Namoaka fandraisana anjara 1 voamarina sy nankatoavina.',
    descriptionFr:
      'Publier 1 contribution culturelle validée par la communauté.',
    category: 'community',
    iconKey: 'Users',
    color: '#059669',
    targetValue: 1,
    xpReward: 50,
  },
  {
    id: 'contributor_3',
    titleMg: 'Mpandray Anjara Mavitrika',
    titleFr: 'Contributeur Actif',
    descriptionMg: "Namoaka fandraisana anjara 3 nankatoavin'ny vahoaka.",
    descriptionFr: 'Publier 3 contributions culturelles dans la communauté.',
    category: 'community',
    iconKey: 'Users',
    color: '#047857',
    targetValue: 3,
    xpReward: 150,
  },

  // 5. CITOYENNETÉ & HISTOIRE (CIVIC)
  {
    id: 'civic_master',
    titleMg: 'Olom-pirenena Gasy',
    titleFr: 'Citoyen Éclairé',
    descriptionMg:
      "Nahavita lesona 5 momba ny zon'ny olom-pirenena sy ny andrim-panjakana.",
    descriptionFr:
      'Compléter 5 leçons sur les institutions et devoirs civiques.',
    category: 'civic',
    iconKey: 'Landmark',
    color: '#8B5CF6',
    targetValue: 5,
    xpReward: 80,
  },

  // 6. TOTAL XP & PRESTIGE
  {
    id: 'xp_500',
    titleMg: 'Mpianatra Mazoto',
    titleFr: 'Érudit en Marche',
    descriptionMg: "Nahatratra 500 isa XP tamin'ny fampiharana.",
    descriptionFr: 'Cumuler 500 points XP à travers vos activités.',
    category: 'xp',
    iconKey: 'Trophy',
    color: '#D97706',
    targetValue: 500,
    xpReward: 50,
  },
  {
    id: 'xp_1000',
    titleMg: 'Mpanazava Fahendrena',
    titleFr: 'Guide de Sagesse',
    descriptionMg:
      "Nahatratra 1000 isa XP tamin'ny lalao sy fianarana rehetra.",
    descriptionFr: 'Cumuler 1000 points XP à travers les jeux et explorations.',
    category: 'xp',
    iconKey: 'Trophy',
    color: '#EA580C',
    targetValue: 1000,
    xpReward: 100,
  },
  {
    id: 'xp_5000',
    titleMg: 'Raiamandreny',
    titleFr: 'Pilier Culturel',
    descriptionMg: "Nahatratra 5000 isa XP teo amin'ny sehatry ny Kanto.",
    descriptionFr:
      'Atteindre 5000 points XP et devenir un pilier de la communauté.',
    category: 'xp',
    iconKey: 'Crown',
    color: '#C8A84B',
    targetValue: 5000,
    xpReward: 500,
  },
];
