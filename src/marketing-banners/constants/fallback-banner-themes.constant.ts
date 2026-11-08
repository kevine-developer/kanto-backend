export interface FallbackBannerThemeContent {
  badgeFr: string;
  badgeMg: string;
  titleFr: string;
  titleMg: string;
  descriptionFr: string;
  descriptionMg: string;
  ctaFr: string;
  ctaMg: string;
  accentColor: string;
  deepLink: string;
  imageUrl?: string;
}

/**
 * Catalogue de secours culturel bilingue (Français & Malagasy officiel)
 * utilisé lorsque l'API Gemini ou la connexion réseau est indisponible.
 * Respecte scrupuleusement l'identité de marque, la dignité patrimoniale (Haja)
 * et le vocabulaire traditionnel de Madagascar.
 */
export const FALLBACK_BANNER_THEMES: Record<
  string,
  FallbackBannerThemeContent
> = {
  'culture et patrimoine malgache (musique, danse, fady)': {
    badgeFr: 'PATRIMOINE VIVANT',
    badgeMg: 'HAREN-TSAIN-DRAZANA',
    titleFr: 'Rythmes, traditions et sagesses ancestrales',
    titleMg: 'Feo, dihy ary fady mamelona ny fomban-tany',
    descriptionFr:
      'Explorez la richesse des instruments traditionnels, des danses et des coutumes de la Grande Île.',
    descriptionMg:
      'Diniho ny feon-kiran’ny valiha, ny hetsiky ny dihy ary ny fomba mampiavaka ny Nosintsika.',
    ctaFr: 'Explorer le patrimoine',
    ctaMg: 'Hikaroka ny lova',
    accentColor: '#4A6741', // Vert Tanimbary identitaire
    deepLink: '/(tabs)/explore',
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
  },
  'apprentissage de la langue malgache (vocabulaire, proverbes)': {
    badgeFr: 'LANGUE & SAGESSE',
    badgeMg: 'FITENY & FAHENDRENA',
    titleFr: 'Enrichissez votre vocabulaire et vos proverbes',
    titleMg: 'Mianara teny vaovao sy ohabolana feno fahendrena',
    descriptionFr:
      'Découvrez le sens profond des métaphores malgaches pour vous exprimer avec justesse et poésie.',
    descriptionMg:
      'Halalino ny hevitra fonosin’ny ohabolana sy ireo teny tranainy mampanan-karena ny teny malagasy.',
    ctaFr: 'Apprendre maintenant',
    ctaMg: 'Hianatra dieny izao',
    accentColor: '#C58B38', // Ocre Doré
    deepLink: '/(tabs)/learn',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
  'contes et récits traditionnels malgaches (angano)': {
    badgeFr: 'ANGANO ANCESTRAUX',
    badgeMg: 'ANGANO NTAOLO',
    titleFr: 'Les légendes et contes de nos ancêtres',
    titleMg: 'Ireo angano nampandry fahalemana ny tany',
    descriptionFr:
      'Écoutez et lisez les récits fondateurs transmis de génération en génération sous le grand baobab.',
    descriptionMg:
      'Henoy sy vakio ireo angano nifandovan’ny razana, mitahiry fahendrena sy fananarana lehibe.',
    ctaFr: 'Lire les contes',
    ctaMg: 'Hamaky ny angano',
    accentColor: '#C0392B', // Terracotta
    deepLink: '/(tabs)/explore',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
  },
  'quiz et jeux éducatifs sur Madagascar': {
    badgeFr: 'DÉFI DU JOUR',
    badgeMg: 'FANAMBY ANIO',
    titleFr: 'Testez vos connaissances sur la Grande Île',
    titleMg: 'Hizaha toetra ny fahalalanao an’i Madagasikara',
    descriptionFr:
      'Devinettes, quiz culturels et mots croisés pour apprendre en s’amusant chaque jour.',
    descriptionMg:
      'Ankamantatra, fanontaniana ara-kolontsaina ary lalao teny mba handalinana ny fahalalana.',
    ctaFr: 'Relever le défi',
    ctaMg: 'Hiditra kianja',
    accentColor: '#2563EB',
    deepLink: '/(tabs)/play',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  },
  'engagement communautaire et contributions des utilisateurs': {
    badgeFr: 'FIHAVANANA & PARTAGE',
    badgeMg: 'FIHAVANANA & FIZARANA',
    titleFr: 'Contribuez à préserver notre mémoire culturelle',
    titleMg: 'Handray anjara amin’ny fitehirizana ny vakoka',
    descriptionFr:
      'Partagez un proverbe de votre village, une expression locale ou un souvenir transmis par vos aînés.',
    descriptionMg:
      'Zarao ny ohabolana, ny fomba amam-panao ary ny teny mampiavaka ny faritra misy anao.',
    ctaFr: 'Partager un savoir',
    ctaMg: 'Handray anjara',
    accentColor: '#10B981',
    deepLink: '/(tabs)/community',
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
  'histoire et géographie de Madagascar': {
    badgeFr: 'MÉMOIRE & ROYAUMES',
    badgeMg: 'TANTARA & FARA-TANY',
    titleFr: 'Sur les traces des royaumes et des souverains',
    titleMg: 'Diniho ny tantaran’ireo mpanjaka sy ny Nosy',
    descriptionFr:
      'Parcourez les hauts lieux historiques, les collines sacrées et les récits des temps passés.',
    descriptionMg:
      'Zahao ireo vohitra masina, ny tantaran’ny fitondrana ary ny lalan-tsarotra nodiavin’ny firenena.',
    ctaFr: 'Découvrir l’histoire',
    ctaMg: 'Hahalala ny tantara',
    accentColor: '#7C3AED',
    deepLink: '/(tabs)/explore',
    imageUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
  },
  'kabary et art oratoire malgache': {
    badgeFr: 'ART DU KABARY',
    badgeMg: 'HAIN-TENY & KABARY',
    titleFr: 'L’éloquence et la courtoisie de la parole',
    titleMg: 'Ny kanto sy ny fahaizana mandaha-teny malagasy',
    descriptionFr:
      'Maîtrisez les formules rituelles, les excuses d’usage et la poésie du discours traditionnel.',
    descriptionMg:
      'Ianaro ny azafady, ny fitarihan-dresaka ary ny fahaizana miresaka am-panajana sy am-pahendrena.',
    ctaFr: 'Écouter les kabary',
    ctaMg: 'Hihaino ny kabary',
    accentColor: '#D97706',
    deepLink: '/(tabs)/explore',
    imageUrl:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  },
  'poésie et littérature malgache': {
    badgeFr: 'BELLES LETTRES',
    badgeMg: 'TONONKALO MALAGASY',
    titleFr: 'La sensibilité des grands poètes malgaches',
    titleMg: 'Kanton’ny tononkalo sy aingam-panahy',
    descriptionFr:
      'Redécouvrez les vers émouvants de Rado, Dox, Ny Avana et des voix qui chantent Madagascar.',
    descriptionMg:
      'Iainao ny zava-kanton’i Rado, Dox, Ny Avana Ramanantoanina sy ireo mpanoratra sangany.',
    ctaFr: 'Lire les poèmes',
    ctaMg: 'Hamaky tononkalo',
    accentColor: '#DB2777',
    deepLink: '/(tabs)/explore',
    imageUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
  },
  'défis linguistiques et gamification': {
    badgeFr: 'PROGRESSION & NIVEAUX',
    badgeMg: 'FIHAKARANA AMBARATONGA',
    titleFr: 'Montez en niveau et remportez vos badges',
    titleMg: 'Miakara ambaratonga ary mahazoa mari-boninahitra',
    descriptionFr:
      'Gagnez de l’expérience, entretenez votre série quotidienne et devenus un maître de la langue.',
    descriptionMg:
      'Manangòna isa, tohizo ny ezaka isan’andro ary aoka ianao ho lohany amin’ny fifehezana ny teny.',
    ctaFr: 'Voir mes badges',
    ctaMg: 'Hijery ny zava-bita',
    accentColor: '#059669',
    deepLink: '/(tabs)/play',
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
  },
  "découverte des régions et dialectes de l'île": {
    badgeFr: 'DIALECTES & TERROIRS',
    badgeMg: 'FARITRA & FITENIM-PARITRA',
    titleFr: 'Les 18 tribus et leurs trésors linguistiques',
    titleMg: 'Ireo foko 18 sy ny fomba fiteniny mampiavaka',
    descriptionFr:
      'Voyagez à travers les dialectes du Nord, du Sud, des côtes et des hauts plateaux de Madagascar.',
    descriptionMg:
      'Fantaro ny fahasamihafan’ny tenim-paritra manerana an’i Madagasikara, an-tsiraka sy an-tampon-tanàna.',
    ctaFr: 'Découvrir la carte',
    ctaMg: 'Hizaha ny saritany',
    accentColor: '#0891B2',
    deepLink: '/(tabs)/learn',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
};
