export interface DefaultPlacementItem {
  code: string;
  nameFr: string;
  nameMg: string;
  descriptionFr: string;
  descriptionMg: string;
  specifications: Record<string, unknown>;
  basePrice: number;
  currency: string;
  allowedDurationsDays: number[];
  orderIndex: number;
}

export const DEFAULT_MARKETING_PLACEMENTS: DefaultPlacementItem[] = [
  {
    code: 'HERO_BANNER',
    nameFr: 'Bannière principale de l’application',
    nameMg: 'Sary lehibe fandraisana (Bannière Hero)',
    descriptionFr:
      'Mise en avant visuelle premium au sommet de l’écran d’accueil de Kanto MG pour une visibilité maximale dès l’ouverture de l’application.',
    descriptionMg:
      'Fisehoana lohalaharana amin’ny fidirana ao amin’ny fampiharana Kanto MG hahazoana mpijery sy mpitsidika betsaka indrindra.',
    specifications: {
      format: 'JPEG, PNG, WebP',
      recommendedWidth: 1080,
      recommendedHeight: 600,
      aspectRatio: '16:9',
      maxFileSizeMb: 2,
    },
    basePrice: 150000,
    currency: 'MGA',
    allowedDurationsDays: [7, 14, 30],
    orderIndex: 1,
  },
  {
    code: 'FEATURED_SPOTLIGHT',
    nameFr: 'Section Événements « À la une »',
    nameMg: 'Hetsika asongadina lohalaharana',
    descriptionFr:
      'Positionnement prioritaire dans l’en-tête de la section Événements avec badge distinctif « À la une » et affichage enrichi.',
    descriptionMg:
      'Toerana manokana asongadina ao amin’ny pejin’ny hetsika miaraka amin’ny marika « À la une » manintona.',
    specifications: {
      format: 'JPEG, PNG, WebP',
      recommendedWidth: 800,
      recommendedHeight: 500,
      aspectRatio: '16:10',
      maxFileSizeMb: 2,
    },
    basePrice: 100000,
    currency: 'MGA',
    allowedDurationsDays: [7, 14, 30],
    orderIndex: 2,
  },
  {
    code: 'RECOMMENDED_SECTION',
    nameFr: 'Section Événements recommandés',
    nameMg: 'Hetsika atoro sy aroso manokana',
    descriptionFr:
      'Mise en avant dans les sélections thématiques et culturelles recommandées de l’application auprès des membres actifs.',
    descriptionMg:
      'Fanolorana ny hetsikao ho an’ireo mpikambana mavitrika sy liana amin’ny lohahevitra mitovy.',
    specifications: {
      format: 'JPEG, PNG, WebP',
      recommendedWidth: 700,
      recommendedHeight: 450,
      aspectRatio: '14:9',
      maxFileSizeMb: 2,
    },
    basePrice: 60000,
    currency: 'MGA',
    allowedDurationsDays: [7, 14, 21],
    orderIndex: 3,
  },
  {
    code: 'PUSH_NOTIFICATION',
    nameFr: 'Notification push ciblée',
    nameMg: 'Fampandrenesana mivantana amin’ny finday (Push)',
    descriptionFr:
      'Diffusion d’une notification push officielle directe sur les smartphones des utilisateurs ayant manifesté un intérêt culturel.',
    descriptionMg:
      'Fandefasana fampahafantarana mivantana amin’ny findain’ireo mpampiasa Kanto MG mba tsy hisy hahadino ny fotoana.',
    specifications: {
      titleMaxChars: 60,
      bodyMaxChars: 160,
      deepLinkSupported: true,
    },
    basePrice: 80000,
    currency: 'MGA',
    allowedDurationsDays: [1, 3],
    orderIndex: 4,
  },
  {
    code: 'CULTURAL_CAMPAIGN',
    nameFr: 'Campagne thématique ou saisonnière',
    nameMg: 'Fampahafantarana mandritra ny vanim-potoana manokana',
    descriptionFr:
      'Intégration au sein des grandes campagnes culturelles de Kanto MG (Mois de la langue malgache, Asaramanitra, fêtes traditionnelles).',
    descriptionMg:
      'Fandraisana anjara amin’ireo hetsika sy vanim-potoana lehibe ankalazaina ao amin’ny Kanto MG.',
    specifications: {
      multiFormat: true,
      editorialSupport: true,
    },
    basePrice: 200000,
    currency: 'MGA',
    allowedDurationsDays: [14, 30],
    orderIndex: 5,
  },
  {
    code: 'SOCIAL_MEDIA',
    nameFr: 'Publication sur les réseaux sociaux officiels',
    nameMg: 'Famoahana amin’ny tambajotra sosialy ofisialy Kanto MG',
    descriptionFr:
      'Publication dédiée et promotionnelle sur les pages et canaux officiels de Kanto MG (Facebook, Instagram, LinkedIn).',
    descriptionMg:
      'Fanehoana ny hetsika ao amin’ny pejy ofisialin’ny Kanto MG mba hanatratra mpanaraka maro.',
    specifications: {
      customVisuals: true,
      partnerMentions: true,
    },
    basePrice: 75000,
    currency: 'MGA',
    allowedDurationsDays: [1, 7],
    orderIndex: 6,
  },
];
