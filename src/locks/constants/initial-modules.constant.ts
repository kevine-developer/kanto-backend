export interface DefaultModuleConfig {
  key: string;
  type: 'GAME' | 'CATEGORY' | 'FEATURE';
  nameFr: string;
  nameMg: string;
  imageUrl?: string | null;
  isLocked: boolean;
  lockReason?: string | null;
  minTier?: string;
}

export const INITIAL_MODULES: DefaultModuleConfig[] = [
  // JEUX
  {
    key: 'game:trueFalseGame',
    type: 'GAME',
    nameFr: 'Vrai ou Faux',
    nameMg: 'Marina sa Diso',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:wordPuzzleGame',
    type: 'GAME',
    nameFr: "Remets dans l'ordre",
    nameMg: 'Alamino ny fehezanteny',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:missingWordGame',
    type: 'GAME',
    nameFr: 'Mot manquant',
    nameMg: 'Fenohy ny banga',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:riddlesGame',
    type: 'GAME',
    nameFr: 'Devinettes & Énigmes',
    nameMg: 'Ankamantatra',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:hangmanGame',
    type: 'GAME',
    nameFr: 'Mot Mystère (Pendu)',
    nameMg: 'Teny Miafina',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:quizGame',
    type: 'GAME',
    nameFr: 'Quiz Culturel',
    nameMg: 'Fanontaniana maro safidy',
    isLocked: false,
    lockReason: null,
  },

  // CATÉGORIES
  {
    key: 'category:proverbe',
    type: 'CATEGORY',
    nameFr: 'Proverbes & Sagesses',
    nameMg: 'Ohabolana',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:expression',
    type: 'CATEGORY',
    nameFr: 'Expressions Courantes',
    nameMg: 'Fomba fiteny',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:dicton',
    type: 'CATEGORY',
    nameFr: 'Dictons & Fady',
    nameMg: 'Oha-pitenenana',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:citation',
    type: 'CATEGORY',
    nameFr: 'Citations & Auteurs',
    nameMg: "Tenin'olona malaza",
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:poesie',
    type: 'CATEGORY',
    nameFr: 'Poésies & Hainteny',
    nameMg: 'Tononkalo & Hainteny',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:discours',
    type: 'CATEGORY',
    nameFr: 'Discours & Kabary',
    nameMg: 'Kabary Malagasy',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:conte',
    type: 'CATEGORY',
    nameFr: 'Contes & Légendes',
    nameMg: 'Angano sy Tantara',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:recitation',
    type: 'CATEGORY',
    nameFr: 'Récitations & Éloquence',
    nameMg: 'Tsianjery & Fahaizana miteny',
    isLocked: false,
    lockReason: null,
  },

  // FONCTIONNALITÉS
  {
    key: 'feature:subscription',
    type: 'FEATURE',
    nameFr: 'Abonnement Kanto Pro',
    nameMg: 'Fikambanana Kanto Pro',
    isLocked: true,
    lockReason: 'Module bientôt disponible dans la prochaine mise à jour.',
    minTier: 'PREMIUM',
  },
  {
    key: 'feature:contributor',
    type: 'FEATURE',
    nameFr: 'Espace Contributeur',
    nameMg: 'Toerana fandraisana anjara',
    isLocked: false,
    lockReason: null,
  },
];
