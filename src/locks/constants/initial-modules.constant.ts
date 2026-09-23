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
    key: 'game:multiplayerGame',
    type: 'GAME',
    nameFr: 'Quiz Multijoueur',
    nameMg: 'Lalao Multijoueur',
    imageUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:trueFalseGame',
    type: 'GAME',
    nameFr: 'Vrai ou Faux',
    nameMg: 'Marina sa Diso',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433200/Photoroom-20250725_025113719_voarxl.png',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:wordPuzzleGame',
    type: 'GAME',
    nameFr: "Remets dans l'ordre",
    nameMg: 'Alamino ny fehezanteny',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433199/Photoroom-20250725_024251458_je18mm.png',
    isLocked: true,
    lockReason:
      "En cours d'optimisation tactile et ergonomique pour la version 2.0.",
  },
  {
    key: 'game:missingWordGame',
    type: 'GAME',
    nameFr: 'Mot manquant',
    nameMg: 'Fenohy ny banga',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433199/Photoroom-20250725_024716464_vp5ivb.png',
    isLocked: true,
    lockReason: 'Arrive très prochainement dans la mise à jour version 1.1 !',
  },
  {
    key: 'game:riddlesGame',
    type: 'GAME',
    nameFr: 'Devinettes & Énigmes',
    nameMg: 'Ankamantatra',
    imageUrl:
      'https://res.cloudinary.com/dhe585mze/image/upload/v1753433199/Photoroom-20250725_024504502_zotwmr.png',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'game:quizGame',
    type: 'GAME',
    nameFr: 'Quiz Culturel',
    nameMg: 'Fanontaniana maro safidy',
    imageUrl:
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },

  // CATÉGORIES
  {
    key: 'category:proverbe',
    type: 'CATEGORY',
    nameFr: 'Proverbes & Sagesses',
    nameMg: 'Ohabolana',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:expression',
    type: 'CATEGORY',
    nameFr: 'Expressions Courantes',
    nameMg: 'Fomba fiteny',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:dicton',
    type: 'CATEGORY',
    nameFr: 'Dictons & Fady',
    nameMg: 'Oha-pitenenana',
    imageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:citation',
    type: 'CATEGORY',
    nameFr: 'Citations & Auteurs',
    nameMg: "Tenin'olona malaza",
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:poesie',
    type: 'CATEGORY',
    nameFr: 'Poésies & Hainteny',
    nameMg: 'Tononkalo & Hainteny',
    imageUrl:
      'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:discours',
    type: 'CATEGORY',
    nameFr: 'Discours & Kabary',
    nameMg: 'Kabary Malagasy',
    imageUrl:
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:conte',
    type: 'CATEGORY',
    nameFr: 'Contes & Légendes',
    nameMg: 'Angano sy Tantara',
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },
  {
    key: 'category:recitation',
    type: 'CATEGORY',
    nameFr: 'Récitations & Éloquence',
    nameMg: 'Tsianjery & Fahaizana miteny',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    isLocked: false,
    lockReason: null,
  },

  // FONCTIONNALITÉS
  {
    key: 'feature:subscription',
    type: 'FEATURE',
    nameFr: 'Abonnement Kanto Pro',
    nameMg: 'Fikambanana Kanto Pro',
    imageUrl: null,
    isLocked: true,
    lockReason: 'Module bientôt disponible dans la prochaine mise à jour.',
    minTier: 'PREMIUM',
  },
  {
    key: 'feature:contributor',
    type: 'FEATURE',
    nameFr: 'Espace Contributeur',
    nameMg: 'Toerana fandraisana anjara',
    imageUrl: null,
    isLocked: false,
    lockReason: null,
  },
];
