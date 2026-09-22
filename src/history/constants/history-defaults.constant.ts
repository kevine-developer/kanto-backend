/**
 * Constantes initiales des données du module Histoire, Mémoire & Patrimoine de Madagascar
 * Utilisées pour le bootstrap automatique et les scripts de seed (PostgreSQL).
 */

export interface DefaultCivicLesson {
  id: string;
  category: string[];
  titleFr: string;
  titleMg: string;
  descriptionFr: string;
  descriptionMg: string;
  imageUrl?: string | null;
  status: boolean;
  orderIndex: number;
}

export interface DefaultPresident {
  id: string;
  name: string;
  titleFr: string;
  titleMg: string;
  republic: string;
  republicMg: string;
  period: string;
  quoteFr?: string | null;
  quoteMg?: string | null;
  bioFr: string;
  bioMg: string;
  achievementsFr: string[];
  achievementsMg: string[];
  badgeColor?: string;
  imageUrl?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

export interface DefaultBanknote {
  id: string;
  valueAriary: number;
  valueFmg: number;
  titleFr: string;
  titleMg: string;
  series: string;
  seriesLabelFr: string;
  seriesLabelMg: string;
  period: string;
  colorLight: string;
  colorDark: string;
  obverseDescriptionFr: string;
  obverseDescriptionMg: string;
  reverseDescriptionFr: string;
  reverseDescriptionMg: string;
  symbolismFr: string;
  symbolismMg: string;
  securityFeaturesFr: string[];
  imageUrl?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

export interface DefaultProvinceBlason {
  id: string;
  province: string;
  chefLieu: string;
  titleFr: string;
  titleMg: string;
  color: string;
  bgLight: string;
  borderLight: string;
  descriptionFr: string;
  descriptionMg: string;
  symbols: Array<{
    labelFr: string;
    labelMg: string;
    meaningFr: string;
    meaningMg: string;
  }>;
  keyFactsFr: string[];
  keyFactsMg: string[];
  imageUrl?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

export interface DefaultNatureEmblem {
  id: string;
  nameFr: string;
  nameMg: string;
  scientificName: string;
  type: string;
  statusFr: string;
  statusMg: string;
  descriptionFr: string;
  descriptionMg: string;
  culturalRoleFr: string;
  culturalRoleMg: string;
  proverbMg?: string | null;
  proverbFr?: string | null;
  accentColor?: string;
  imageUrl?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

export interface DefaultHistoryDate {
  id: string;
  year: string;
  exactDate: string;
  titleFr: string;
  titleMg: string;
  era: string;
  summaryFr: string;
  summaryMg: string;
  impactFr: string;
  impactMg: string;
  accentColor?: string;
  imageUrl?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

export interface DefaultNationalEmblem {
  id: string;
  period: string;
  imageUrl?: string | null;
  government: string;
  descriptionFr: string;
  descriptionMg?: string | null;
  notesFr?: string | null;
  notesMg?: string | null;
  orderIndex: number;
  status: 'PUBLISHED';
}

// =========================================================================
// 1. LEÇONS CIVIQUES & EXPLORATION THÉMATIQUE (11 leçons)
// =========================================================================
export const DEFAULT_CIVIC_LESSONS: DefaultCivicLesson[] = [
  {
    id: 'presidents-histoire',
    category: ['histoire', 'politique', 'république'],
    titleFr: 'Les Présidents de Madagascar',
    titleMg: 'Ireo Filoham-pirenena',
    descriptionFr:
      "Chronologie complète des chefs d'État de 1959 à nos jours, leurs citations et leurs mandats.",
    descriptionMg:
      "Tantaran'ireo filoha nifandimby nitondra ny Repoblika nanomboka tamin'ny 1959 ka hatramin'izao.",
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 0,
  },
  {
    id: 'billets-monnaies',
    category: ['culture-histoire', 'économie', 'patrimoine'],
    titleFr: 'Musée des Billets Malgaches',
    titleMg: 'Ireo Vola Taratasy Malagasy',
    descriptionFr:
      "L'art numismatique, le passage du Franc Malgache à l'Ariary et les symboles illustrés.",
    descriptionMg:
      "Ny tantara sy ny hevitr'ireo sary sy marika voasokitra amin'ny vola taratasy Ariary sy FMG.",
    imageUrl:
      'https://images.unsplash.com/photo-1621981386864-7221bc360f09?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 1,
  },
  {
    id: 'blasons-provinces',
    category: ['culture-histoire', 'territoire'],
    titleFr: 'Blasons des 6 Provinces',
    titleMg: 'Mari-paritany Enina',
    descriptionFr:
      "Découvrez les armoiries, les emblèmes et l'identité des six provinces de Madagascar.",
    descriptionMg:
      "Diniho ny tantara sy ny hevitr'ireo marika mandravaka ny faritany 6 eto Madagasikara.",
    imageUrl:
      'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 2,
  },
  {
    id: 'nature-emblemes',
    category: ['écologie', 'nature', 'culture-histoire'],
    titleFr: 'Nature & Emblèmes Vivants',
    titleMg: 'Harena Voajanahary & Biby',
    descriptionFr:
      'Le Ravinala, les Baobabs séculaires, le Maki et le Zébu : trésors de notre biodiversité.',
    descriptionMg:
      "Ny Ravinala, ny Renala, ny Gidro ary ny Omby : reharehan'ny harena voajanahary malagasy.",
    imageUrl:
      'https://images.unsplash.com/photo-1574063413132-355dbfd83e25?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 3,
  },
  {
    id: 'dates-histoire',
    category: ['histoire', 'culture-histoire'],
    titleFr: 'Grandes Dates de la Nation',
    titleMg: "Vanin'andro Manan-tantara",
    descriptionFr:
      'Revivez les moments clés et les jalons patriotiques qui ont façonné le destin de Madagascar.',
    descriptionMg:
      "Ireo andro manan-danja nanamarika ny tantara, ny ady ho an'ny fahafahana ary ny firenena.",
    imageUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 4,
  },
  {
    id: 'emblemes-sceaux',
    category: ['histoire', 'culture-histoire', 'république'],
    titleFr: "Sceaux & Emblèmes d'État",
    titleMg: 'Tombo-kase & Mari-panjakana',
    descriptionFr:
      'Périodes, illustrations officielles, gouvernements successifs et notes historiques des sceaux nationaux.',
    descriptionMg:
      "Ireo mari-piandrianana, tombo-kase ofisialy ary ny teny filamatra nifandimby teo amin'ny tantaram-pirenena.",
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 5,
  },
  {
    id: 'symboles-histoire',
    category: ['culture-histoire', 'valeurs'],
    titleFr: 'Nos Symboles & Notre Histoire',
    titleMg: 'Marika sy Tantara Ireharehantsika',
    descriptionFr:
      "Découvre le drapeau tricolore, l'hymne national, le fihavanana et notre mémoire collective.",
    descriptionMg:
      'Fantaro ny sainam-pirenena, ny hira, ny fihavanana ary ny tantara iombonana.',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 6,
  },
  {
    id: 'institutions',
    category: ['institutions'],
    titleFr: 'Qui Fait Quoi ?',
    titleMg: 'Iza no Manao Inona ?',
    descriptionFr:
      'Le rôle du Président, des députés, du gouvernement et des institutions républicaines.',
    descriptionMg:
      "Asan'ny filoha, solombavambahoaka, ary ireo andrim-panjakana mpanapa-kevitra.",
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 7,
  },
  {
    id: 'citoyennete-droits-vote',
    category: ['citoyenneté', 'valeurs'],
    titleFr: 'Tes Droits, Tes Devoirs !',
    titleMg: 'Zo sy Adidy Nao',
    descriptionFr:
      "Comprends tes droits fondamentaux, la liberté d'expression et l'importance civique du vote.",
    descriptionMg:
      'Fantaro ny zo, fahalalahana miteny ary ny maha-zava-dehibe ny fifidianana.',
    imageUrl:
      'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 8,
  },
  {
    id: 'vivre-ensemble',
    category: ['valeurs', 'citoyenneté'],
    titleFr: 'Vivre Ensemble en Harmonie',
    titleMg: 'Miaina Miaraka Am-pilaminana',
    descriptionFr:
      'Respect mutuel, tolérance, solidarité et pratique ancestrale du valin-tanana.',
    descriptionMg:
      "Fifanajana, fandeferana, firaisankina ary ny soatoavina malagasy amin'ny valin-tanana.",
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 9,
  },
  {
    id: 'ecologie-civisme',
    category: ['écologie', 'citoyenneté', 'valeurs'],
    titleFr: 'Agir pour la Terre & la Société',
    titleMg: "Mihetsika ho an'ny Tany sy ny Fiarahamonina",
    descriptionFr:
      'Les bons gestes écologiques et citoyens : protection de la faune, propreté et reboisement.',
    descriptionMg:
      'Fihetsika tsara ho an’ny tontolo iainana sy ny tanàna: fikajiana ny natiora sy ny fahadiovana.',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 10,
  },
];

// =========================================================================
// 2. LES PRÉSIDENTS DE MADAGASCAR (8 figures républicaines)
// =========================================================================
export const DEFAULT_PRESIDENTS: DefaultPresident[] = [
  {
    id: 'tsiranana',
    name: 'Philibert Tsiranana',
    titleFr: "Père de l'Indépendance",
    titleMg: "Rain'ny Fahaleovantena",
    republic: '1ère République',
    republicMg: 'Repoblika Voalohany',
    period: '1959 - 1972',
    quoteFr: '« La paix est le premier capital d’une nation. »',
    quoteMg: '« Ny fandriampahalemana no fototry ny fampandrosoana. »',
    bioFr:
      "Instituteur originaire d'Anahidrano (Majunga), il proclame l'indépendance de Madagascar le 26 juin 1960 et fonde le Parti Social Démocrate (PSD). Il prône un socialisme pragmatique et le développement agricole.",
    bioMg:
      "Mpampianatra avy any Anahidrano (Mahajanga), nanambara ny fahaleovantenan'i Madagasikara tamin'ny 26 jona 1960. Nitarika ny antoko PSD ary nanandratra ny fambolena sy ny fihavanana.",
    achievementsFr: [
      "Proclamation de l'Indépendance nationale (26 Juin 1960)",
      'Création des infrastructures universitaires et scolaires provinciales',
      "Mise en place de l'administration républicaine moderne",
    ],
    achievementsMg: [
      'Fanambarana ny Fahaleovantena (26 Jona 1960)',
      'Fananganana sekoly sy oniversite manerana ny Nosy',
      'Fandaminana ny fitantanan-draharaham-panjakana',
    ],
    badgeColor: '#2A6B3D',
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=700&auto=format&fit=crop&q=80',
    orderIndex: 0,
    status: 'PUBLISHED',
  },
  {
    id: 'ramanantsoa',
    name: 'Général Gabriel Ramanantsoa',
    titleFr: 'Chef du Gouvernement Militaire',
    titleMg: "Lehiben'ny Governemanta Miaramila",
    republic: 'Transition Militaire',
    republicMg: 'Tetezamita Miaramila',
    period: '1972 - 1975',
    quoteFr:
      '« C’est dans la discipline et la rigueur que le pays se relève. »',
    quoteMg:
      '« Amin’ny filaminana sy ny fitsipi-pifehezana no hanarenana ny firenena. »',
    bioFr:
      'Général de division diplômé de Saint-Cyr, il reçoit les pleins pouvoirs du Président Tsiranana à la suite des événements de mai 1972. Il amorce la renégociation des accords de coopération et la malgachisation.',
    bioMg:
      "Jeneraly nahazo fiofanana tao Saint-Cyr, nandray ny fahefana feno taorian'ny hetsika tamin'ny Mey 1972. Nanomboka ny fandinihana indray ny fiaraha-miasa sy ny fanagasiana.",
    achievementsFr: [
      'Renégociation des accords de coopération franco-malgaches (1973)',
      'Sortie de la zone Franc CFA et création de la Banque Centrale',
      "Réforme de la politique d'enseignement national",
    ],
    achievementsMg: [
      "Fandinihana indray ny fifanarahana tamin'ny Frantsay (1973)",
      'Fialana tamin’ny faritra Franc CFA sy famoronana ny Banky Foibe',
      'Fanavaozana ny fampianarana malagasy',
    ],
    badgeColor: '#4A5D6E',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'ratsimandrava',
    name: 'Colonel Richard Ratsimandrava',
    titleFr: 'Héros National du Fokonolona',
    titleMg: "Maherifon'ny Fokonolona",
    republic: "Chef d'État (6 Jours)",
    republicMg: 'Filoham-panjakana (6 Andro)',
    period: 'Février 1975',
    quoteFr: '« Tsy hiamboho adidy aho, mon Général ! »',
    quoteMg: '« Tsy hiamboho adidy aho, mon Général ! »',
    bioFr:
      'Officier intègre et visionnaire, il théorise la maîtrise populaire du développement par le Fokonolona. Son mandat tragique de 6 jours est interrompu par son assassinat le 11 février 1975 à Ambohijatovo.',
    bioMg:
      "Manamboninahitra mendrika sy nahitsy, nanandratra ny Fokonolona ho fototry ny fampandrosoana. Nisy namono tamin'ny fomba mampalahelo tamin'ny 11 febroary 1975 tao Ambohijatovo.",
    achievementsFr: [
      'Consécration constitutionnelle du rôle décisionnel du Fokonolona',
      "Doctrine de l'auto-développement villageois et communautaire",
      'Symbole impérissable du sens du devoir républicain',
    ],
    achievementsMg: [
      'Fampanjakana ny Fokonolona sy ny fitsinjaram-pahefana',
      'Fampandrosoana miainga eny ifotony',
      'Fakan-tahaka amin’ny fitiavan-tanindrazana sy tsy fiambohoana adidy',
    ],
    badgeColor: '#9B3D3D',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'ratsiraka',
    name: 'Didier Ratsiraka',
    titleFr: 'Fondateur de la 2ème République',
    titleMg: 'Mpanorina ny Repoblika Faharoa',
    republic: '2ème République & 3ème Rép.',
    republicMg: 'Repoblika Faharoa sy Fahatelo',
    period: '1975 - 1993 & 1997 - 2002',
    quoteFr: '« La souveraineté de Madagascar est inaliénable. »',
    quoteMg:
      '« Tsy azo amidy na ovana ny fiandrianam-pirenen’i Madagasikara. »',
    bioFr:
      "Officier de marine surnommé l'Amiral, il installe la République Démocratique de Madagascar avec la Charte de la Révolution Socialiste (Boky Mena). Il marque la politique étrangère du non-alignement avant de revenir démocratiquement en 1997.",
    bioMg:
      "Manamboninahitra amin'ny Tafika an-dranomasina, nanorina ny Repoblika Demokratika Malagasy tamin'ny alalan'ny Boky Mena. Nitarika ny firenena tamin'ny vanim-potoana roa lehibe.",
    achievementsFr: [
      "Création des grands corps de l'État et des académies militaires",
      'Diplomatie active au sein des pays non-alignés et de l’Afrique australe',
      "Construction du Palais d'État d'Iavoloha et des grands axes routiers",
    ],
    achievementsMg: [
      'Fanorenana ny Lapam-panjakana Iavoloha sy ny lalam-pirenena',
      'Fampiroboroboana ny diplaomasia teo anivon’ny firenena tsy miandany',
      'Fananganana orinasa sy rafitra miaramila matanjaka',
    ],
    badgeColor: '#8C4820',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'zafy',
    name: 'Professeur Albert Zafy',
    titleFr: 'Apôtre de la Démocratie & Fampihavanana',
    titleMg: 'Mpampianatra ny Demokrasia sy Fampihavanana',
    republic: '3ème République',
    republicMg: 'Repoblika Fahatelo',
    period: '1993 - 1996',
    quoteFr:
      '« Sans réconciliation nationale sincère, aucun essor n’est durable. »',
    quoteMg:
      '« Tsy misy fampandrosoana vanona raha tsy misy fampihavanana marina. »',
    bioFr:
      "Chirurgien thoracique de renommée mondiale surnommé « L'Homme au chapeau de paille », il conduit le mouvement des Forces Vives de 1991 et instaure un régime parlementaire prônant la réconciliation nationale.",
    bioMg:
      'Dokotera mpandidy fo malaza eran-tany, nitarika ny Hery Velona tamin’ny 1991. Nampihatra ny demokrasia parlemetera sy ny fampihavanam-pirenena marina.',
    achievementsFr: [
      'Adoption de la Constitution pluraliste de la 3ème République',
      'Création du Comité de Réconciliation Nationale (CRN)',
      'Liberté totale de la presse et du paysage audiovisuel',
    ],
    achievementsMg: [
      'Fandrafetana ny Lalàmpanorenana demokratika tamin’ny 1992',
      'Fametrahana ny fahalalahan’ny asa fanaovan-gazety sy ny fanehoan-kevitra',
      'Fisokafana tanteraka amin’ny hevitra marolafy',
    ],
    badgeColor: '#B57C1E',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'ravalomanana',
    name: 'Marc Ravalomanana',
    titleFr: 'Bâtisseur & Madagascar Action Plan',
    titleMg: 'Mpanorina sy Madagasikara Am-perinasa',
    republic: '3ème République',
    republicMg: 'Repoblika Fahatelo',
    period: '2002 - 2009',
    quoteFr: '« Aza matahotra, minoa fotsiny ihany ! »',
    quoteMg: '« Aza matahotra, minoa fotsiny ihany ! »',
    bioFr:
      "Entrepreneur autodidacte fondateur du groupe Tiko et ancien maire d'Antananarivo, il accède à la présidence en 2002. Son mandat est marqué par une croissance économique forte, la réhabilitation routière massive et le plan MAP.",
    bioMg:
      'Mpamorona ny orinasa Tiko sady Ben’ny tanànan’Antananarivo teo aloha. Nampiroborobo ny fotodrafitrasa, ny fanamboaran-dalana ary ny fanabeazana tamin’ny alalan’ny MAP.',
    achievementsFr: [
      "Adoption de l'Ariary comme monnaie officielle unique (2003)",
      'Réhabilitation et bitumage de milliers de kilomètres de routes nationales',
      'Lancement du Madagascar Action Plan (MAP) et essor agricole',
    ],
    achievementsMg: [
      'Famerenana ny Ariary ho vola ofisialy tokana (2003)',
      'Fanamboarana lalam-pirenena an’arivony kilometatra',
      'Fampiharana ny fandaharan’asa MAP sy fanampiana ny tantsaha',
    ],
    badgeColor: '#1E6B6B',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80',
    orderIndex: 5,
    status: 'PUBLISHED',
  },
  {
    id: 'rajoelina',
    name: 'Andry Rajoelina',
    titleFr: 'Fondateur de la 4ème République',
    titleMg: 'Mpanorina ny Repoblika Fahaefatra',
    republic: 'Transition & 4ème Rép.',
    republicMg: 'Tetezamita sy Repoblika Fahaefatra',
    period: '2009 - 2014 & 2019 - Présent',
    quoteFr: '« Ny fitiavan-tanindrazana no hery mampiray antsika. »',
    quoteMg: '« Ny fitiavan-tanindrazana no hery mampiray antsika. »',
    bioFr:
      'Maire de la capitale puis président de la Haute Autorité de Transition en 2009, il fait adopter la Constitution de la 4ème République en 2010. Élu en 2018 et réélu en 2023, il lance le Plan Émergence de Madagascar.',
    bioMg:
      "Ben'ny tanànan'Antananarivo teo aloha, nitarika ny Tetezamita tamin'ny 2009 ary nametraka ny Repoblika faha-4 tamin'ny 2010. Voafidy tamin'ny 2018 sy 2023 hitondra ny fampandrosoana.",
    achievementsFr: [
      'Adoption de la Constitution de la 4ème République (11 Décembre 2010)',
      'Constructions de grands complexes hospitaliers, scolaires et sportifs',
      "Projets d'infrastructures d'envergure nationale (Rocades, téléphérique)",
    ],
    achievementsMg: [
      "Lalàmpanorenan'ny Repoblika faha-4 (11 Desambra 2010)",
      'Hopitaly manara-penitra sy sekoly manerana ny faritra',
      'Fotodrafitrasa goavana sy fampitaovana ny tanora',
    ],
    badgeColor: '#E05A1B',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=700&auto=format&fit=crop&q=80',
    orderIndex: 6,
    status: 'PUBLISHED',
  },
  {
    id: 'rajaonarimampianina',
    name: 'Hery Rajaonarimampianina',
    titleFr: 'Premier Président élu de la 4ème Rép.',
    titleMg: 'Filoha Voalohany voafidin’ny Repoblika Faha-4',
    republic: '4ème République',
    republicMg: 'Repoblika Fahaefatra',
    period: '2014 - 2018',
    quoteFr:
      '« Le redressement de notre patrie exige la réconciliation et l’apaisement. »',
    quoteMg:
      '« Ny fanarenana ny firenena dia mitaky fitoniana sy fifanatonana. »',
    bioFr:
      "Expert-comptable et ministre des Finances, il est élu premier président constitutionnel de la IVe République en 2013. Il assure le retour à l'ordre constitutionnel et réintègre Madagascar dans le concert des nations.",
    bioMg:
      "Manampahaizana momba ny kaonty sy Minisitry ny Vola teo aloha. Filoha voalohany voafidy tamin'ny Repoblika faha-4, namerina an'i Madagasikara teo amin'ny sehatra iraisam-pirenena.",
    achievementsFr: [
      "Retour à l'ordre constitutionnel reconnu par la communauté internationale",
      'Organisation réussie du XVIe Sommet de la Francophonie à Antananarivo (2016)',
      'Lancement de la nouvelle série moderne de billets en Ariary (2017)',
    ],
    achievementsMg: [
      "Famerenana an'i Madagasikara teo anivon'ny fianakaviambe iraisam-pirenena",
      'Fandraisana ny Fihaonana an-tampon’ny Frankôfônia tamin’ny 2016',
      'Famoahana ireo vola taratasy vaovao amin’ny Ariary tamin’ny 2017',
    ],
    badgeColor: '#2F4A75',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&auto=format&fit=crop&q=80',
    orderIndex: 7,
    status: 'PUBLISHED',
  },
];

// =========================================================================
// 3. LES BILLETS DE MADAGASCAR (6 coupures de la Série 2017)
// =========================================================================
export const DEFAULT_BANKNOTES: DefaultBanknote[] = [
  {
    id: 'billet-20000',
    valueAriary: 20000,
    valueFmg: 100000,
    titleFr: 'Madagascar Moderne & Énergie',
    titleMg: 'Madagasikara Mandroso & Angovo',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#2C4075',
    colorDark: '#3E5AA1',
    obverseDescriptionFr:
      'Usine moderne de Sherritt Ambatovy, pylônes électriques haute tension et réseau industriel.',
    obverseDescriptionMg:
      'Orinasa mamoderna Ambatovy, tsatokazo mpitondra herinaratra sy fampandrosoana indostrialy.',
    reverseDescriptionFr:
      'Gousses de vanille de Sava, boutons de girofle et poivre de Madagascar.',
    reverseDescriptionMg:
      'Lavanila avy any Sava, jirofo ary dipoavatra malagasy.',
    symbolismFr:
      "Plus grosse coupure jamais émise à Madagascar. Elle symbolise la transition vers l'industrialisation tout en honorant la vanille, fleuron agricole mondial du pays.",
    symbolismMg:
      'Vola taratasy lehibe indrindra eto Madagasikara, maneho ny firoboroboan’ny orinasa sy ny harena avy amin’ny lavanila.',
    securityFeaturesFr: [
      'Fil de sécurité à fenêtre changeant de couleur',
      'Fleur de vanille en filigrane transparent',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1621981386864-7221bc360f09?w=800&auto=format&fit=crop&q=80',
    orderIndex: 0,
    status: 'PUBLISHED',
  },
  {
    id: 'billet-10000',
    valueAriary: 10000,
    valueFmg: 50000,
    titleFr: 'Transports & Échanges Maritimes',
    titleMg: 'Fitaterana sy Varotra An-dranomasina',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#9B3D3D',
    colorDark: '#C25555',
    obverseDescriptionFr:
      'Port autonome de Toamasina avec porte-conteneurs et grues de déchargement.',
    obverseDescriptionMg:
      'Seranantsambon’i Toamasina, sambo mpitondra kaontenera sy fitaovana fampidinana entana.',
    reverseDescriptionFr:
      'Valiha traditionnelle malgache, zafimaniry sculpté et instruments de musique.',
    reverseDescriptionMg:
      'Valiha nentim-paharazana, sary sokitra zafimaniry ary zavamaneno malagasy.',
    symbolismFr:
      "Célèbre l'ouverture de l'île sur le monde à travers son grand port et la noblesse musicale de la Valiha, instrument national.",
    symbolismMg:
      'Maneho ny fisokafana amin’izao tontolo izao sy ny haikanto malagasy amin’ny alalan’ny Valiha.',
    securityFeaturesFr: [
      'Bande holographique brillante',
      'Filigrane à tête de zébu et motif géométrique',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'billet-5000',
    valueAriary: 5000,
    valueFmg: 25000,
    titleFr: 'Baobabs & Flore Ancestrale',
    titleMg: 'Renala sy Zavamaniry Mampalaza',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#3B6E4A',
    colorDark: '#529465',
    obverseDescriptionFr:
      'La majestueuse Allée des Baobabs de Morondava (Adansonia grandidieri).',
    obverseDescriptionMg:
      'Ny Lalan’ny Renala malaza any Morondava (Adansonia grandidieri).',
    reverseDescriptionFr:
      'Chute d’eau de cascade préservée et forêt tropicale humide primaire.',
    reverseDescriptionMg: 'Riandrano madio sy ala mikitroka voaaro.',
    symbolismFr:
      "Consacré au sanctuaire naturel de l'île. Le Baobab (Renala) est l'arbre-symbole par excellence de la résistance et de l'âme malgache.",
    symbolismMg:
      'Fanomezam-boninahitra ny harena voajanahary sy ny Renala, hazo manan-tantara sy reharehan’ny Nosy.',
    securityFeaturesFr: [
      'Bande de sécurité iridescente',
      'Filigrane Baobab visible en contre-jour',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'billet-2000',
    valueAriary: 2000,
    valueFmg: 10000,
    titleFr: 'Faune Endémique & Lémuriens',
    titleMg: 'Biby Miavaka sy Gidro',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#995C23',
    colorDark: '#C47C35',
    obverseDescriptionFr:
      'Maki Catta (Lémurien à queue annelée) dans son habitat arboré.',
    obverseDescriptionMg:
      'Hira na Maki Catta eo ambony hazo amin’ny fonenany voajanahary.',
    reverseDescriptionFr:
      'Tortue étoilée endémique (Astrochelys radiata) et flore du bush épineux.',
    reverseDescriptionMg:
      'Sokake (Sokatra) sy zavamaniry tsilo avy any Atsimo.',
    symbolismFr:
      'Rappelle au citoyen que 90% de la faune de Madagascar est unique au monde et constitue un devoir absolu de préservation.',
    symbolismMg:
      'Mampahatsiahy ny maha-tokana ny biby malagasy eran-tany sy ny adidy hiaro azy ireo.',
    securityFeaturesFr: [
      'Micro-impressions haute précision',
      'Motif de lémurien fluorescent sous UV',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'billet-1000',
    valueAriary: 1000,
    valueFmg: 5000,
    titleFr: 'Le Ravinala & Ponts Historiques',
    titleMg: 'Ny Ravinala sy Tetezana Manan-tantara',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#35667A',
    colorDark: '#4B8BA6',
    obverseDescriptionFr:
      'Pont suspendu moderne reliant les régions et l’Arbre du voyageur (Ravinala).',
    obverseDescriptionMg: 'Tetezana mampitohy ny faritra sy ny hazo Ravinala.',
    reverseDescriptionFr:
      'Oiseaux chanteurs endémiques de Madagascar et végétation riveraine.',
    reverseDescriptionMg:
      'Vorona mpihira malagasy sy zava-maitso manamorona ny rano.',
    symbolismFr:
      'Le Ravinala, emblème national de la soif étanchée et de la protection des voyageurs.',
    symbolismMg:
      'Ny Ravinala, mariky ny tanindrazana manome rano madio sy mialoka ny mpandeha.',
    securityFeaturesFr: [
      'Filigrane Ravinala',
      'Transvision parfaite recto-verso',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'billet-500',
    valueAriary: 500,
    valueFmg: 2500,
    titleFr: 'Artisanat & Pêche Traditionnelle',
    titleMg: 'Asa Tanana sy Jono Nentin-drazana',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 « Madagascar & ses Richesses »',
    seriesLabelMg: 'Andiany 2017 « Madagasikara sy ny Harenany »',
    period: '2017 - Présent',
    colorLight: '#6B4370',
    colorDark: '#945D9A',
    obverseDescriptionFr:
      'Pirogue traditionnelle Vezo à balancier naviguant sur le canal de Mozambique.',
    obverseDescriptionMg:
      'Lakam-pihany Vezo misy vilo mandeha amin’ny ranomasina.',
    reverseDescriptionFr:
      'Tisserande malgache confectionnant des nattes et paniers en raphia.',
    reverseDescriptionMg:
      'Mpanenona malagasy manao tsihy sy sobika amin’ny rofia.',
    symbolismFr:
      'Rend hommage aux pêcheurs des côtes et aux artisanes qui perpétuent les gestes ancestraux.',
    symbolismMg:
      'Fisaorana ireo mpanjono sy mpanao asa tanana mitahiry ny fahaiza-manao nolovaina.',
    securityFeaturesFr: [
      'Encre scintillante changeante',
      'Fil de sécurité continu',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    orderIndex: 5,
    status: 'PUBLISHED',
  },
];

// =========================================================================
// 4. BLASONS & ARMOIRIES DES 6 PROVINCES
// =========================================================================
export const DEFAULT_PROVINCE_BLASONS: DefaultProvinceBlason[] = [
  {
    id: 'antananarivo',
    province: 'Antananarivo',
    chefLieu: 'Antananarivo (Iarivo)',
    titleFr: 'Province des Mille & des Collines Sacrées',
    titleMg: "Faritanin'Iarivo sy ny Vohitra Masina",
    color: '#8B2E2E',
    bgLight: '#FBF0F0',
    borderLight: '#E8C8C8',
    descriptionFr:
      "Cœur politique et historique des hautes terres centrales, la province d'Antananarivo est le berceau du Royaume d'Imerina unifié par Andrianampoinimerina autour des 12 collines sacrées.",
    descriptionMg:
      "Foiben'ny fitondrana sy ny tantara teo anivon'ny fari-tany afovoany, toerana nampiraisan'Andrianampoinimerina an'Imerina tamin'ny alalan'ny vohitra masina 12.",
    symbols: [
      {
        labelFr: 'La Tête de Zébu Royale',
        labelMg: "Lohan'omby mpanjaka",
        meaningFr:
          "Symbole de prospérité, d'autorité bienveillante et pilier de la société agraire.",
        meaningMg:
          "Mariky ny fiandrianana, ny harena ary ny asa tany teo amin'ny fiarahamonina.",
      },
      {
        labelFr: 'Les 7 Collines Sacrées',
        labelMg: 'Ireo Vohitra Masina',
        meaningFr:
          'Représentées sur le blason pour honorer la mémoire des souverains et la terre des ancêtres.',
        meaningMg:
          "Maneho ny tantaran'ireo mpanjaka sy ny hasin'ny tanindrazana.",
      },
      {
        labelFr: 'La Fleur de Lys & Couronne',
        labelMg: 'Satro-boninahitra',
        meaningFr:
          "Héritage des armoiries municipales historiques d'Antananarivo accordées en 1897.",
        meaningMg:
          'Lova ara-panjakana sy mari-pamantarana ny renivohitry ny Nosy.',
      },
    ],
    keyFactsFr: [
      'Altitude moyenne : 1 280 m',
      "Site du Rova d'Antananarivo (Manjakamiadana)",
      'Capitale économique, universitaire et diplomatique',
    ],
    keyFactsMg: [
      'Haavo ambonin’ny ranomasina : 1 280 m',
      'Toeran’ny Rovan’i Manjakamiadana',
      'Foiben’ny toekarena sy ny fampianarana ambony',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    orderIndex: 0,
    status: 'PUBLISHED',
  },
  {
    id: 'antsiranana',
    province: 'Antsiranana (Diego Suarez)',
    chefLieu: 'Antsiranana',
    titleFr: 'La Porte du Nord & la 2e Plus Grande Baie du Monde',
    titleMg: 'Vavahadin’ny Avaratra & Helodrano Faharoa Eran-tany',
    color: '#2C5B7A',
    bgLight: '#EFF6FA',
    borderLight: '#C7DCED',
    descriptionFr:
      'Bordée par l’océan Indien et le canal de Mozambique, Antsiranana abrite la majestueuse baie de Diego Suarez, le Mont Français, les Tsingy Rouges et la montagne d’Ambre.',
    descriptionMg:
      'Voahodidin’ny ranomasina roa, ahitana ny helodrano lehibe indrindra maneran-tany, ny Tsingy Mena ary ny Tendrombohitra Ambre.',
    symbols: [
      {
        labelFr: 'L’Ancre de Marine & la Baie',
        labelMg: 'Vankon-tsambo sy Helodrano',
        meaningFr:
          'Rappelle la vocation navale et stratégique exceptionnelle du port naturel du Nord.',
        meaningMg:
          'Maneho ny seranantsambo voajanahary sy ny tantaran’ny tafika an-dranomasina.',
      },
      {
        labelFr: 'Le Pain de Sucre (Nosy Lonjo)',
        labelMg: 'Nosy Lonjo (Vatomainty)',
        meaningFr:
          'Îlot conique sacré émergeant de la baie, lieu de rituels traditionnels et de respect.',
        meaningMg:
          'Nosy kely masina anaty rano fanaovana joro sy fomban-drazana.',
      },
      {
        labelFr: 'Fleurs d’Ylang-Ylang & Girofle',
        labelMg: 'Voninkazo Ylang-Ylang & Jirofo',
        meaningFr:
          'Richesse agricole parfumée du Nord et de l’île voisine de Nosy Be.',
        meaningMg: 'Harena manitra mampalaza ny faritra avaratra sy Nosy Be.',
      },
    ],
    keyFactsFr: [
      'Deuxième plus grande baie naturelle du monde après Rio',
      'Berceau de la culture Sakalava et Antankarana',
      'Parc National de la Montagne d’Ambre (forêt tropicale d’altitude)',
    ],
    keyFactsMg: [
      'Helodrano voajanahary faharoa lehibe indrindra maneran-tany',
      'Tanin’ny Sakalava sy Antankarana',
      'Valan-javaboary Tendrombohitra Ambre',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'fianarantsoa',
    province: 'Fianarantsoa',
    chefLieu: 'Fianarantsoa',
    titleFr: 'Terre du Savoir, des Rizières & de la Vigne',
    titleMg: 'Tanin’ny Fahalalana, ny Tanimbary sy ny Voaloboka',
    color: '#3B6E4A',
    bgLight: '#F0F7F2',
    borderLight: '#C6E3CE',
    descriptionFr:
      'Baptisée « Là où l’on apprend le bien », Fianarantsoa est réputée pour ses écoles prestigieuses, ses rizières en terrasses taillées à la main et l’artisanat Zafimaniry classé à l’UNESCO.',
    descriptionMg:
      '« Toerana ianarana ny soa », malaza amin’ny sekoly ambony, ny tanimbary amin’ny tanety voakarakara ary ny asan-tànana Zafimaniry eken’ny UNESCO.',
    symbols: [
      {
        labelFr: 'Les Terrasses de Rizières',
        labelMg: 'Tanimbary voatety',
        meaningFr:
          'Le génie agraire du peuple Betsileo, bâtisseurs émérites des plus belles rizières du pays.',
        meaningMg:
          'Fahaiza-manao miavaka an’ny Betsileo amin’ny fanamboarana tanimbary an-tendrombohitra.',
      },
      {
        labelFr: 'Le Livre & la Plume du Savoir',
        labelMg: 'Boky sy Pene fianarana',
        meaningFr:
          'Hommage au rôle historique de la province dans l’éducation et la haute culture littéraire.',
        meaningMg:
          'Fanamarihana ny lazan’ny faritra amin’ny fampianarana sy ny fahaizana.',
      },
      {
        labelFr: 'La Grappe de Raisin & le Thé',
        labelMg: 'Voaloboka sy Dite Sahambavy',
        meaningFr:
          'Unique région viticole de Madagascar (Ambalavao) et plantations de thé de Sahambavy.',
        meaningMg: 'Toerana tokana mamokatra divay sy dite eto Madagasikara.',
      },
    ],
    keyFactsFr: [
      'Patrimoine mondial UNESCO du travail du bois Zafimaniry',
      'Ligne de chemin de fer historique FCE (Fianarantsoa-Côte Est)',
      'Falaises spectaculaires d’Isalo et d’Andringitra',
    ],
    keyFactsMg: [
      'Haikanto Zafimaniry voasoratra ao amin’ny UNESCO',
      'Lalam-by manan-tantara FCE mampitohy amin’ny ranomasina',
      'Tendrombohitra Andringitra sy Isalo',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'mahajanga',
    province: 'Mahajanga (Majunga)',
    chefLieu: 'Mahajanga',
    titleFr: 'La Cité des Fleurs & du Grand Baobab',
    titleMg: 'Tanànan’ny Voninkazo sy ny Renala Be',
    color: '#A05A20',
    bgLight: '#FBF3ED',
    borderLight: '#ECCFBC',
    descriptionFr:
      "Bordée par les eaux chaudes du canal de Mozambique à l'embouchure du fleuve Betsiboka, Mahajanga est une ville cosmopolite et chaleureuse, carrefour historique du commerce maritime Sakalava et arabo-swahili.",
    descriptionMg:
      "Manamorona ny lakandranon'i Mozambika sy ny renirano Betsiboka, tanàna mafana sy be mpirahalahy, fihaonan'ny foko maro sy ny tantara Sakalava.",
    symbols: [
      {
        labelFr: 'Le Grand Baobab Séculaire',
        labelMg: 'Ny Renala Be amoron-dranomasina',
        meaningFr:
          'Arbre gigantesque de plus de 14 mètres de circonférence au bord de mer, cœur battant de la ville.',
        meaningMg:
          'Hazo goavana manan-tantara maherin’ny 14 metatra ny manodidina azy, reharehan’ny tanàna.',
      },
      {
        labelFr: 'La Boutre à Voile (Dhow)',
        labelMg: 'Ny Lakam-be sy ny Sambokely',
        meaningFr:
          'Navire traditionnel à voiles triangulaires sillonnant les côtes occidentales depuis des siècles.',
        meaningMg:
          'Sambokely nentim-paharazana nampiasaina tamin’ny varotra an-dranomasina hatry ny ela.',
      },
      {
        labelFr: 'Le Reliquaire Royal (Doany)',
        labelMg: 'Ny Doany sy ny Fitampoha',
        meaningFr:
          'Rituels royaux Sakalava du bain des reliques assurant la protection et la continuité de la lignée.',
        meaningMg:
          'Fomban-drazana fandroana ny taolam-balon’ireo mpanjaka Sakalava.',
      },
    ],
    keyFactsFr: [
      'Parc National d’Ankarafantsika et Tsingy de Namoroka',
      'Coucher de soleil légendaire sur le bord de mer',
      'Grottes sacrées d’Anjohibe aux stalactites géantes',
    ],
    keyFactsMg: [
      'Valan-javaboary Ankarafantsika sy Tsingin’i Namoroka',
      'Filentehan’ny masoandro malaza eny amin’ny « Bord »',
      'Zohy masin’Anjohibe',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1574063413132-355dbfd83e25?w=800&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'toamasina',
    province: 'Toamasina (Tamatave)',
    chefLieu: 'Toamasina',
    titleFr: 'Le Poumon Économique & la Côte Épicée',
    titleMg: 'Fidiran’ny Toekarena & Morontsiraka Manitra',
    color: '#246B6B',
    bgLight: '#EEF7F7',
    borderLight: '#C2E5E5',
    descriptionFr:
      'Premier port de commerce de Madagascar, Toamasina s’étend le long de la côte Est tropicale, traversée par le mythique Canal des Pangalanes et bordée de forêts de girofliers, de litchis et de vanille.',
    descriptionMg:
      'Seranantsambo voalohany eto Madagasikara, mamakivaky ny morontsiraka atsinanana sy ny Lakandranon’ny Pangalanes, manankarena jirofo, letisia ary lavanila.',
    symbols: [
      {
        labelFr: 'Le Port de Commerce & le Navire',
        labelMg: 'Seranamboninahitra sy Sambo',
        meaningFr:
          'Par où transitent plus de 80% du commerce international de Madagascar.',
        meaningMg:
          'Fidirana sy fivoahan’ny 80% amin’ny entana ara-barotra iraisam-pirenena.',
      },
      {
        labelFr: 'L’Arbre du Voyageur (Ravinala)',
        labelMg: 'Hazo Ravinala',
        meaningFr:
          'Particulièrement abondant sur les coteaux verdoyants de la côte Est bien arrosée.',
        meaningMg:
          'Maniry betsaka amin’ny tendrombohitra maitso mavana atsinanana.',
      },
      {
        labelFr: 'Le Clou de Girofle & le Litchi',
        labelMg: 'Jirofo sy Letisia',
        meaningFr:
          'Richesses agricoles qui font de Madagascar le premier exportateur mondial.',
        meaningMg:
          'Vokatra manome laza an’i Madagasikara eo amin’ny tsena iraisam-pirenena.',
      },
    ],
    keyFactsFr: [
      'Canal des Pangalanes long de plus de 600 kilomètres',
      'Île Sainte-Marie (Nosy Boraha), sanctuaire mondial des baleines à bosse',
      'Climat tropical humide assurant une végétation luxuriante',
    ],
    keyFactsMg: [
      'Lakandranon’ny Pangalanes mirefy 600 km mahery',
      'Nosy Boraha (Sainte-Marie), fandalovan’ny trozona',
      'Toetrandro mando manome zava-maniry maitso lalandava',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'toliara',
    province: 'Toliara (Tuléar)',
    chefLieu: 'Toliara',
    titleFr: 'Le Grand Sud Ensoleillé & le Peuple de la Mer',
    titleMg: 'Atsimo Mafana sy Ireo Mponin’ny Ranomasina',
    color: '#B54522',
    bgLight: '#FCF2EF',
    borderLight: '#F2CEBF',
    descriptionFr:
      'Terre du soleil éternel, des forêts d’épineux (Didiereaceae), des tombeaux Mahafaly richement décorés d’Aloalo et des marins Vezo naviguant sur la grande barrière de corail.',
    descriptionMg:
      'Tanin’ny masoandro tsy maty, ala tsilo miavaka, fasan’ny Mahafaly misy Aloalo voasokitra ary ny Vezo mpitaingina onja amin’ny haran-dranomasina.',
    symbols: [
      {
        labelFr: 'L’Aloalo Mahafaly',
        labelMg: 'Ny Aloalo',
        meaningFr:
          'Poteau funéraire en bois sculpté de motifs géométriques racontant la vie et le statut du défunt.',
        meaningMg:
          'Hazo voasokitra ambony fasana mitantara ny fiainan’ny maty sy ny hasin’ny razana.',
      },
      {
        labelFr: 'La Pirogue Vezo à Balancier',
        labelMg: 'Lakam-pihany misy Vilo',
        meaningFr:
          'Emblème des nomades de la mer, maîtres de la navigation sur le lagon du Sud-Ouest.',
        meaningMg:
          'Mariky ny Vezo tompon-dranomasina mahay miasa onja sy manarato.',
      },
      {
        labelFr: 'Le Soleil Flamboyant du Tropique',
        labelMg: 'Masoandro am-paravodilanitra',
        meaningFr:
          'Traversée par le tropique du Capricorne, c’est la région la plus ensoleillée de Madagascar.',
        meaningMg: 'Faritra mafana indrindra lalovan’ny fehin-tany Adijady.',
      },
    ],
    keyFactsFr: [
      'Troisième plus grand récif corallien de la planète',
      'Biodiversité florale à 95% endémique dans le bush épineux',
      'Tradition sacrée des tombeaux et des troupeaux de zébus',
    ],
    keyFactsMg: [
      'Haran-dranomasina fahatelo lehibe indrindra maneran-tany',
      '95% amin’ny zavamaniry ao an’ala tsilo dia tsy misy afa-tsy eto',
      'Fomban-drazana masina momba ny fandevenana sy ny omby',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    orderIndex: 5,
    status: 'PUBLISHED',
  },
];

// =========================================================================
// 5. FAUNE & FLORE EMBLÉMATIQUES (6 emblèmes du sanctuaire vivant)
// =========================================================================
export const DEFAULT_NATURE_EMBLEMS: DefaultNatureEmblem[] = [
  {
    id: 'ravinala',
    nameFr: "L'Arbre du Voyageur",
    nameMg: 'Ny Ravinala',
    scientificName: 'Ravenala madagascariensis',
    type: 'FLORA',
    statusFr: 'Emblème National de Madagascar',
    statusMg: 'Marika Ofisialin’ny Firenena',
    descriptionFr:
      'Plante endémique majestueuse formant un éventail parfait de feuilles géantes. Sa base creuse retient une eau de pluie pure que les voyageurs pouvaient boire pour étancher leur soif, d’où son surnom universel.',
    descriptionMg:
      'Zavamaniry mampalaza an’i Madagasikara manana ravina miendrika fikopahana. Mitahiry rano madio azo sotroina eny am-potony ka manavotra ny mpandalo.',
    culturalRoleFr:
      "Figure sur le sceau officiel de la République de Madagascar et le logo historique d'Air Madagascar. Ses feuilles robustes (ravina) servent traditionnellement de toiture et d'assiettes de fête.",
    culturalRoleMg:
      'Hita eo amin’ny kianjan’ny Repoblika sy ny fiaramanidina malagasy. Ny ravin-dravinala dia atao tafo amin’ny trano nentim-paharazana sy fihinanan-kanina.',
    proverbMg:
      '« Toy ny ravinala : an-tsaha manome aloka, an-tanàna manome tafo. »',
    proverbFr:
      '« Comme le ravinala : aux champs il donne l’ombre, au village il donne le toit. »',
    accentColor: '#2D7048',
    imageUrl:
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    orderIndex: 0,
    status: 'PUBLISHED',
  },
  {
    id: 'baobab',
    nameFr: 'Le Baobab (Mère de la Forêt)',
    nameMg: 'Ny Renala',
    scientificName: 'Adansonia grandidieri / za / rubrostipa',
    type: 'FLORA',
    statusFr: '6 espèces endémiques sur 8 au monde',
    statusMg: 'Karazana 6 amin’ny 8 maneran-tany',
    descriptionFr:
      'Géant millénaire aux allures d’arbre planté à l’envers. Madagascar est le sanctuaire mondial des baobabs. L’espèce la plus célèbre, l’Adansonia grandidieri, s’élève jusqu’à 30 mètres de hauteur à Morondava.',
    descriptionMg:
      'Hazo goavana maharitra aman-jato taonany maro, toy ny natsimbadika ny fakany. Madagasikara no manana karazana Renala be indrindra maneran-tany.',
    culturalRoleFr:
      'Arbre sacré habité par les esprits ancestraux. Les villageois y déposent des offrandes (voky) et l’écorce sert à fabriquer des cordages très résistants sans abattre l’arbre.',
    culturalRoleMg:
      'Hazo masina ipetrahan’ny fanahin’ny razana. Tsy azo kapaina amin’ny fomba tsotra ary ny hodiny dia anaovana kofehy mafy dia mafy.',
    proverbMg:
      '« Ny Renala tsy mba maniry an-tsena, fa any an-ala vao mahita azy. »',
    proverbFr:
      '« Le grand baobab ne pousse pas au marché, c’est dans la forêt profonde qu’on le trouve. »',
    accentColor: '#8C4F1A',
    imageUrl:
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'lemurien',
    nameFr: 'Le Lémurien Maki Catta',
    nameMg: 'Ny Maki Catta (Hira)',
    scientificName: 'Lemur catta',
    type: 'FAUNA',
    statusFr: 'Primate 100% Endémique',
    statusMg: 'Biby Tsy Misy Afa-tsy Eto',
    descriptionFr:
      'Célèbre lémurien à la queue annelée de 13 bandes blanches et 14 bandes noires. Vivant au sol et dans les arbres du Sud malgache, il prend d’étonnants « bains de soleil » assis en lotus le matin.',
    descriptionMg:
      'Gidro malaza manana rambo misy tsipika mainty sy fotsy mifandimby. Mipetraka any amin’ny faritra atsimo, tia mianina andro maraina toy ny olona misaintsaina.',
    culturalRoleFr:
      'Considéré dans de nombreuses régions comme un frère de l’homme (fady ny mamono azy). Il incarne la fragilité et la splendeur unique de la biodiversité malgache.',
    culturalRoleMg:
      'Fady amin’ny faritra maro ny mamono azy satria heverina ho manam-pihavanana amin’ny olombelona. Rehareha lehibe ho an’ny fizahan-tany.',
    proverbMg:
      '« Gidro miadana an-ala : tsy mba manao fanahy ratsy fa miaro ny toerany. »',
    proverbFr:
      '« Le lémurien tranquille en forêt ne cherche querelle à personne, il préserve son domaine. »',
    accentColor: '#9C6328',
    imageUrl:
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'zebu',
    nameFr: 'Le Zébu Bossu Malgache',
    nameMg: 'Ny Omby Malagasy',
    scientificName: 'Bos taurus indicus',
    type: 'FAUNA',
    statusFr: 'Symbole de Force & de Richesse',
    statusMg: 'Mariky ny Harena sy ny Fiarahamonina',
    descriptionFr:
      'Reconnaissable à sa bosse graisseuse et à ses longues cornes arquées en lyre. Plus qu’un animal d’élevage, le zébu est le pilier économique, spirituel et social de la civilisation malgache.',
    descriptionMg:
      'Omby manana trafo sy tandroka lava miendrika valiha. Tsy biby fiompy fotsiny fa fototry ny fari-piainana, ny hasina ary ny fombafomba malagasy rehetra.',
    culturalRoleFr:
      'Présent à chaque étape de la vie : mariage (vodiondry), circoncision, labours des rizières (tany manitsaka), cérémonies funéraires et discours royaux (Kabary).',
    culturalRoleMg:
      'Eo foana amin’ny fotoan-dehibe : fampakaram-bady, famorana, fampandehanana tanimbary, fandevenana ary kabary am-pahibemaso.',
    proverbMg: '« Ny omby fisaorana, ny hena fisotroan-dronono. »',
    proverbFr:
      '« Le zébu est l’expression de la gratitude, son don honore celui qui le reçoit. »',
    accentColor: '#A63838',
    imageUrl:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'cameleon',
    nameFr: 'Le Caméléon de Madagascar',
    nameMg: 'Ny Tana / Tanalahy',
    scientificName: 'Furcifer pardalis / Brookesia micra',
    type: 'FAUNA',
    statusFr: 'Madagascar abrite la moitié des espèces mondiales',
    statusMg: 'Ny antsasaky ny tana maneran-tany dia eto',
    descriptionFr:
      'Maître du camouflage, capable de changer de couleur selon son humeur et la lumière. Madagascar abrite à la fois le plus grand caméléon (Parson) et le plus minuscule vertébré connu au monde (Brookesia).',
    descriptionMg:
      'Biby mahay miova loko araka ny toetr’andro sy ny fihetseham-pony. Eto no ahitana ny tana lehibe indrindra sy ny kely indrindra maneran-tany.',
    culturalRoleFr:
      'Modèle de sagesse et de circonspection proverbiale. Ses yeux indépendants lui permettent de regarder le passé d’un côté et l’avenir de l’autre sans précipitation.',
    culturalRoleMg:
      'Maneho ny fahendrena : ny masony iray mijery ny lasa, ny iray mijery ny hoavy. Modely amin’ny fahamalinana sy fahaiza-miaina.',
    proverbMg: '« Toy ny tana : mijery aloha, mijery aoriana vao mandia. »',
    proverbFr:
      '« Tel le caméléon : il regarde devant, il regarde derrière avant d’avancer un pas. »',
    accentColor: '#438258',
    imageUrl:
      'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'orchidee',
    nameFr: "L'Orchidée Comète (Étoile de Madagascar)",
    nameMg: 'Ny Voronkazo / Angraecum',
    scientificName: 'Angraecum sesquipedale',
    type: 'FLORA',
    statusFr: 'Fleur Mythique de Darwin',
    statusMg: 'Voninkazo Miavaka Laza Eran-tany',
    descriptionFr:
      'Splendide orchidée blanche aux pétales cireux en forme d’étoile. Elle possède un éperon nectarifère de près de 30 cm de long. Charles Darwin avait prédit l’existence d’un papillon géant capable de la polliniser 40 ans avant sa découverte.',
    descriptionMg:
      'Orkide fotsy madio miendrika kintana. Manana lava-bavony mahatratra 30 sm. Charles Darwin dia efa nilaza mialoha ny fisian’ny lolo lehibe mitsentsitra azy 40 taona talohan’ny nahitana izany.',
    culturalRoleFr:
      'Symbole de pureté, de mystère et d’élégance naturelle. Fleur emblématique protégée des forêts côtières de l’Est.',
    culturalRoleMg:
      'Mariky ny fahadiovana, ny haingo voajanahary ary ny zava-miafina mahavariana amin’ny natiora malagasy.',
    proverbMg:
      '« Ny voninkazo tsara tarehy tsy mba mitabataba, fa ny fofony no manintona. »',
    proverbFr:
      '« La belle fleur ne fait point de tapage, c’est son doux parfum qui attire le regard. »',
    accentColor: '#2F6E7A',
    imageUrl:
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&auto=format&fit=crop&q=80',
    orderIndex: 5,
    status: 'PUBLISHED',
  },
];

// =========================================================================
// 6. GRANDES DATES DE LA NATION MALGACHE (5 jalons patriotiques)
// =========================================================================
export const DEFAULT_HISTORY_DATES: DefaultHistoryDate[] = [
  {
    id: 'date-1960',
    year: '1960',
    exactDate: '26 Juin 1960',
    titleFr: "Proclamation de l'Indépendance",
    titleMg: 'Fanambarana ny Fahaleovantena',
    era: 'Naissance de la République Moderne',
    summaryFr:
      'Après 64 années de colonisation française, Madagascar recouvre solennellement sa souveraineté nationale au stade de Mahamasina, sous la présidence de Philibert Tsiranana.',
    summaryMg:
      'Taorian’ny 64 taona naha-zanatany, niverina tamin’i Madagasikara ny fiandrianam-pirenena teny amin’ny kianjan’i Mahamasina teo ambany fitarihan’ny Filoha Philibert Tsiranana.',
    impactFr:
      'Fête nationale annuelle célébrée par tous les Malgaches dans le monde entier.',
    impactMg:
      'Fetim-pirenena ankalazaina isan-taona manerana an’izao tontolo izao.',
    accentColor: '#2A6B3D',
    imageUrl:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
    orderIndex: 0,
    status: 'PUBLISHED',
  },
  {
    id: 'date-1958',
    year: '1958',
    exactDate: '14 Octobre 1958',
    titleFr: 'Proclamation de la République Malgache',
    titleMg: 'Fijoroan’ny Repoblika Malagasy',
    era: 'Fondation des Institutions',
    summaryFr:
      'Adoption du statut d’État membre de la Communauté et création officielle de la République Malgache, avec son drapeau blanc-rouge-vert et son hymne « Ry Tanindrazanay Malala ô ».',
    summaryMg:
      'Famoronana ofisialy ny Repoblika Malagasy, niaraka tamin’ny sainam-pirenena fotsy-mena-maitso sy ny hiram-pirenena « Ry Tanindrazanay Malala ô ».',
    impactFr:
      'Naissance de l’État de droit républicain et choix des symboles nationaux.',
    impactMg:
      'Fipoiran’ny fanjakana repoblikanina sy ny marika famantarana ny firenena.',
    accentColor: '#8C4F1A',
    imageUrl:
      'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'date-1947',
    year: '1947',
    exactDate: '29 Mars 1947',
    titleFr: 'L’Insurrection Patriotique Nationale',
    titleMg: 'Ny Fikomian’ny Maherifon’ny 1947',
    era: 'Lutte pour la Liberté',
    summaryFr:
      'Soulèvement héroïque du peuple malgache (MDRM et patriotes) contre le régime colonial pour exiger l’indépendance immédiate. La répression sanglante fit des dizaines de milliers de martyrs.',
    summaryMg:
      'Fikatrohana mahery vaika nataon’ireo tia tanindrazana nanerana ny Nosy nitakiana ny fahafahana. Nahafatesana maherifo an’aliny maro ho an’ny firenena.',
    impactFr:
      'Journée nationale du souvenir des martyrs (Mahery fo) et réveil décisif de la conscience anticoloniale.',
    impactMg:
      'Andro fahatsiarovana ireo Mahery Fon’ny firenena maty ho an’ny tanindrazana.',
    accentColor: '#9B3D3D',
    imageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'date-1896',
    year: '1896',
    exactDate: '6 Août 1896',
    titleFr: 'Loi d’Annexion & Fin de la Royauté',
    titleMg: 'Lalàna Naha-zanatany & Faran’ny Fanjakana',
    era: 'Période Coloniale',
    summaryFr:
      'Le parlement français déclare Madagascar colonie française. La reine Ranavalona III est exilée à la Réunion puis à Alger, mettant fin à des siècles de royauté unifiée.',
    summaryMg:
      'Nambaran’ny fanjakana frantsay ho zanatany i Madagasikara. Nalefa sesitany tany Alger ny Mpanjakavavy Ranavalona III ka nifarana teo ny fitondrana mpanjaka.',
    impactFr:
      'Début de la résistance des Menalamba et perte temporaire de la souveraineté.',
    impactMg: 'Fiandohan’ny hetsika Menalamba sy fiarovana ny fiandrianana.',
    accentColor: '#5B4468',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'date-1817',
    year: '1817',
    exactDate: '23 Octobre 1817',
    titleFr: 'Traité d’Amitié & Reconnaissance du Royaume',
    titleMg: 'Fifanarahana Fihavanana & Fankatoavana ny Fanjakana',
    era: 'Royaume de Madagascar',
    summaryFr:
      'Le Roi Radama Ier signe avec le gouverneur britannique Farquhar un traité historique qui abolit l’exportation d’esclaves et reconnaît Radama comme « Roi de Madagascar ».',
    summaryMg:
      'Nanao sonia fifanarahana tamin’ny governora anglisy ny Mpanjaka Radama I, nampitsahatra ny fivarotana andevo ary nankatoavina ho « Mpanjakan’i Madagasikara ».',
    impactFr:
      "Introduction de l'écriture latine du malgache, de l'imprimerie et de l'école moderne.",
    impactMg:
      'Fampidirana ny soratra latina ho an’ny teny malagasy, ny fanaovan-gazety sy ny sekoly.',
    accentColor: '#2F5C75',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
];

// =========================================================================
// 7. EMBLÈMES & SCEAUX D'ÉTAT HISTORIQUES (5 sceaux républicains & royaux)
// =========================================================================
export const DEFAULT_NATIONAL_EMBLEMS: DefaultNationalEmblem[] = [
  {
    id: 'embleme-royaume-merina',
    period: '1828 - 1896',
    government: "Royaume de Madagascar (Fanjakan'i Madagasikara)",
    descriptionFr:
      "Armoiries royales arborant l'Aigle royal (Voromahery), surmonté de la couronne d'or de Ranavalona, flanqué des lances sacrées et du dais royal pourpre.",
    descriptionMg:
      'Mari-piandrianana mampiseho ny Voromahery, ny satro-boninahitra volamena, lefona masina ary ny lamba mena mpanjaka.',
    notesFr:
      'Utilisé sur les décrets royaux, traités diplomatiques et drapeaux jusqu’à l’annexion coloniale française de 1896.',
    notesMg:
      'Nampiasaina tamin’ny didim-panjakana sy fifanekena iraisam-pirenena mandra-pahatongan’ny fanjanahan-tany tamin’ny 1896.',
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=700&auto=format&fit=crop&q=80',
    orderIndex: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'embleme-premiere-republique',
    period: '1959 - 1972',
    government: 'Première République Malgache (Philibert Tsiranana)',
    descriptionFr:
      'Sceau circulaire représentant au centre une tête de zébu stylisée, encadrée de deux branches de caféier en fleur, surmontée des rayons dorés du soleil levant, avec la devise « Fahafahana, Tanindrazana, Fandrosoana » (Liberté, Patrie, Progrès).',
    descriptionMg:
      'Tombo-kase boribory ahitana lohan’omby eo afovoany, fehezin’ny rantsana kafe roa, hazavan’ny masoandro miposaka, ary ny teny filamatra « Fahafahana, Tanindrazana, Fandrosoana ».',
    notesFr:
      'Adopté lors de la promulgation de la Constitution de la 1ère République en 1959.',
    notesMg:
      'Nolaniana tamin’ny fampiharana ny Lalàmpanorenan’ny Repoblika Voalohany tamin’ny 1959.',
    imageUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80',
    orderIndex: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'embleme-deuxieme-republique-rdm',
    period: '1975 - 1992',
    government:
      'Deuxième République / République Démocratique de Madagascar (Didier Ratsiraka)',
    descriptionFr:
      'Emblème socialiste intégrant une étoile rouge au sommet, une roue dentée industrielle, un livre ouvert (le Livre Rouge), un fusil et une bêche croisés, une tête de zébu, avec la devise « Tanindrazana, Tolom-piavotana, Fahafahana » (Patrie, Révolution, Liberté).',
    descriptionMg:
      'Mari-piandrianana sosialista misy kintana mena, kodiarana indostrialy, boky misokatra (Boky Mena), basy sy angady mifampiditra, ary ny teny filamatra « Tanindrazana, Tolom-piavotana, Fahafahana ».',
    notesFr:
      'Symbole de la Charte de la Révolution Socialiste malgache et de la transition vers le socialisme scientifique.',
    notesMg:
      'Mariky ny Satan’ny Tolom-piavotana Sosialista sy ny vanim-potoana Repoblika Faharoa.',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=700&auto=format&fit=crop&q=80',
    orderIndex: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'embleme-troisieme-republique',
    period: '1992 - 2010',
    government:
      'Troisième République de Madagascar (Albert Zafy / Marc Ravalomanana)',
    descriptionFr:
      "Disque d'argent arborant l'arbre du voyageur (Ravinala) stylisé en éventail, surmonté d'épis de riz et de la tête de zébu, entouré de la devise « Tanindrazana, Fahafahana, Fandrosoana » (Patrie, Liberté, Progrès).",
    descriptionMg:
      'Diska volafotsy ahitana ny Ravinala, salohim-bary sy lohan’omby, voahodidin’ny teny filamatra « Tanindrazana, Fahafahana, Fandrosoana ».',
    notesFr:
      'Restauration des emblèmes écologiques et traditionnels après la conférence nationale de 1992.',
    notesMg:
      'Famerenana ny marika nentim-paharazana sy ny natiora taorian’ny fihaonambem-pirenena 1992.',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&auto=format&fit=crop&q=80',
    orderIndex: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'embleme-quatrieme-republique',
    period: '2010 - Présent',
    government: 'Quatrième République de Madagascar (Régime Actuel)',
    descriptionFr:
      'Sceau officiel de l’État : disque d’argent figurant au centre le Ravinala verdoyant évasé, surmonté de la tête de zébu rouge et des épis de riz dorés, ceinturé de la devise nationale « Fitiavana, Tanindrazana, Fandrosoana » (Amour, Patrie, Progrès) et de la mention « Repoblikan’i Madagasikara ».',
    descriptionMg:
      'Tombo-kase ofisialin’ny Fanjakana : Ravinala maitso misokatra, lohan’omby mena sy salohim-bary volamena, miaraka amin’ny teny filamatra « Fitiavana, Tanindrazana, Fandrosoana ».',
    notesFr:
      'Sceau officiel en vigueur aujourd’hui sur l’ensemble des actes gouvernementaux, passeports, décrets républicains et représentations diplomatiques de Madagascar.',
    notesMg:
      'Tombo-kase manan-kery ampiasaina amin’ny antontan-taratasim-panjakana rehetra, pasipaoro sy solontena ara-diplaomatika.',
    imageUrl:
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=700&auto=format&fit=crop&q=80',
    orderIndex: 5,
    status: 'PUBLISHED',
  },
];
