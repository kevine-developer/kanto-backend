export interface DefaultMarketingBanner {
  id: string;
  badgeFr: string;
  badgeMg: string;
  titleFr: string;
  titleMg: string;
  descriptionFr: string;
  descriptionMg: string;
  ctaFr: string;
  ctaMg: string;
  imageUrl: string;
  deepLink: string;
  accentColor: string;
  orderIndex: number;
}

export const DEFAULT_MARKETING_BANNERS: DefaultMarketingBanner[] = [
  {
    id: 'banner-kanto-pro',
    badgeFr: 'OFFRE PRIVILÈGE',
    badgeMg: 'TOLOTRA MANOKANA',
    titleFr: "L'expérience Kanto sans aucune limite",
    titleMg: "Iainao feno ny haren-tsain'ny Razana",
    descriptionFr:
      'Audio studio HD illimité, mode hors-ligne complet et contenus exclusifs.',
    descriptionMg:
      "Feo mirindra tsy misy fetra, fitaovana ivelan'ny aterineto ary vontoaty manokana.",
    ctaFr: 'Découvrir Kanto Pro',
    ctaMg: 'Hizaha Kanto Pro',
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80',
    deepLink: '/(screens)/subscription',
    accentColor: '#F59E0B',
    orderIndex: 0,
  },
  {
    id: 'banner-multiplayer',
    badgeFr: 'DÉFI EN DIRECT',
    badgeMg: 'FANAMBY MANGIDY',
    titleFr: 'Affrontez vos proches en duel culturel',
    titleMg: 'Hizaha toetra ny fahaizanao an-tsehatra',
    descriptionFr:
      'Quiz en direct, devinettes ancestrales et batailles de proverbes : hissez votre nom au sommet !',
    descriptionMg:
      "Mifanandrina amin'ireo namana amin'ny lalao ohabolana sy ankamantatra mba hisandratana.",
    ctaFr: 'Lancer un duel',
    ctaMg: 'Hiditra kianja',
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&auto=format&fit=crop&q=80',
    deepLink: '/(screens)/gamesAllScreen/multiplayerGame',
    accentColor: '#10B981',
    orderIndex: 1,
  },
  {
    id: 'banner-contributions',
    badgeFr: 'TRANSMISSION & MÉMOIRE',
    badgeMg: 'FIARAHANA & FITANISANA',
    titleFr: 'Partagez la parole de votre région',
    titleMg: 'Zarao ny haren-tsaina sy fomban-tany',
    descriptionFr:
      'Faites vivre un proverbe, un conte de vos aînés ou une sagesse locale au sein de la communauté.',
    descriptionMg:
      'Ampahafantaro eto ny ohabolana, angano na fomba mampiavaka ny foko sy ny faritra misy anao.',
    ctaFr: 'Proposer un ajout',
    ctaMg: 'Handray anjara',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80',
    deepLink: '/(screens)/profile/contributions',
    accentColor: '#F97316',
    orderIndex: 2,
  },
  {
    id: 'banner-raki-teny',
    badgeFr: 'LETTRES ANCESTRALES',
    badgeMg: 'RAKI-TENY MIAFINA',
    titleFr: 'Les mystères du vocabulaire oublié',
    titleMg: 'Diniho ireo teny tranainy sy miafina',
    descriptionFr:
      "Éveillez votre éloquence avec les sens cachés, les métaphores rares et l'étymologie du Malagasy.",
    descriptionMg:
      "Fantaro ny hevitra lalina fonosin'ireo teny malagasy tranainy sy ny fandrotsirotsin'ny fiteny.",
    ctaFr: 'Parcourir le recueil',
    ctaMg: 'Hamaky ny raki-teny',
    imageUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1000&auto=format&fit=crop&q=80',
    deepLink: '/(screens)/rakiTenyScreen',
    accentColor: '#818CF8',
    orderIndex: 3,
  },
];
