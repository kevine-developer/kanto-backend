import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// 1. LES 10 THÈMES / LEÇONS (CIVIC_LESSONS)
// ============================================================
const CIVIC_LESSONS_SEED = [
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
    orderIndex: 1,
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
    orderIndex: 2,
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
    orderIndex: 3,
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
    orderIndex: 4,
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
      "Fihetsika tsara ho an'ny tontolo iainana sy ny tanàna: fikajiana ny natiora sy ny fahadiovana.",
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    status: true,
    orderIndex: 10,
  },
];

// ============================================================
// 2. PRÉSIDENTS DE MADAGASCAR
// ============================================================
const PRESIDENTS_SEED = [
  {
    id: 'tsiranana',
    name: 'Philibert Tsiranana',
    titleFr: "Père de l'Indépendance",
    titleMg: "Rain'ny Fahaleovantena",
    republic: '1ère République',
    republicMg: 'Repoblika Voalohany',
    period: '1959 - 1972',
    quoteFr: "« La paix est le premier capital d'une nation. »",
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
    imageUrl: null,
    orderIndex: 1,
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
      "« C'est dans la discipline et la rigueur que le pays se relève. »",
    quoteMg:
      "« Amin'ny filaminana sy ny fitsipi-pifehezana no hanarenana ny firenena. »",
    bioFr:
      'Général de division diplômé de Saint-Cyr, il reçoit les pleins pouvoirs du Président Tsiranana à la suite des événements de mai 1972. Il amorce la renégociation des accords de coopération et la malgachisation.',
    bioMg:
      "Jeneraly nahazo fiofanana tao Saint-Cyr, nandray ny fahefana feno taorian'ny hetsi-bahoaka May 1972. Nanomboka ny famerenana ny fiandrianam-pirenena sy ny fanagasiana.",
    achievementsFr: [
      'Sortie de la zone franc et création de la Banque Centrale de Madagascar (1973)',
      'Départ des troupes militaires françaises de la base de Diégo-Suarez',
      "Adoption d'un nouveau modèle de développement autocentré",
    ],
    achievementsMg: [
      "Fialana tamin'ny faritra Franc sy fananganana ny Banky Foiben'i Madagasikara (1973)",
      "Fialan'ny toby miaramila frantsay tao Antsiranana",
      "Fampanjakana ny toe-karena miankina amin'ny tena",
    ],
    badgeColor: '#4A5568',
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'ratsimandrava',
    name: 'Colonel Richard Ratsimandrava',
    titleFr: 'Héros Populaire & Fokonolona',
    titleMg: 'Mpanorina ny Fokonolona',
    republic: 'Transition Militaire',
    republicMg: 'Tetezamita Miaramila',
    period: '5 Fév. 1975 - 11 Fév. 1975',
    quoteFr:
      '« Tsy hiamboho adidy aho, Tompoko ! » (Je ne fuirai point mon devoir)',
    quoteMg: '« Tsy hiamboho adidy aho, Tompoko ! »',
    bioFr:
      'Officier intègre et visionnaire, il théorise la décentralisation par les communautés de base (Fokonolona). Son assassinat tragique six jours après son investiture marque profondément la mémoire nationale.',
    bioMg:
      "Manamboninahitra mendrika sy hendry, nampandroso ny foto-kevitry ny Fokonolona ho fototry ny fampandrosoana. Namoy ny ainy 6 andro monja taorian'ny nandraisany ny fahefana.",
    achievementsFr: [
      'Théorisation et mise en œuvre du Fokonolona comme socle économique',
      "Symbole éternel d'intégrité républicaine et de dévouement à la patrie",
    ],
    achievementsMg: [
      'Fametrahana ny Fokonolona ho herim-pamokarana fototra',
      'Lasa mahery fo naneho ny fitiavan-tanindrazana tsy miolakolana',
    ],
    badgeColor: '#C53030',
    imageUrl: null,
    orderIndex: 3,
  },
  {
    id: 'ratsiraka-1',
    name: 'Didier Ratsiraka (Amiral)',
    titleFr: "L'Amiral Rouge",
    titleMg: 'Ny Amiraly Mena',
    republic: '2ème République (RDM)',
    republicMg: 'Repoblika Faharoa',
    period: '1975 - 1993',
    quoteFr:
      '« La révolution socialiste est la voie vers la dignité nationale. »',
    quoteMg:
      "« Ny tolom-piavotana no lalana mankany amin'ny fahaleovantena marina. »",
    bioFr:
      "Officier de marine et diplomate, il instaure la République Démocratique de Madagascar guidée par le 'Boky Mena'. Il nationalise les secteurs clés et développe l'enseignement provincial décentralisé.",
    bioMg:
      "Miaramila an-dranomasina sy mpitondra fanjakana, nanorina ny Repoblika Demokratika Malagasy tamin'ny alalan'ny Boky Mena. Nanamarina ny sehatra stratejika sy ny oniversite isam-paritany.",
    achievementsFr: [
      'Création des 6 universités décentralisées dans chaque province',
      "Généralisation de l'accès aux soins de santé de base communautaires",
      'Diplomatie active du non-alignement sur la scène internationale',
    ],
    achievementsMg: [
      'Fananganana ny oniversite 6 isam-paritany',
      'Fanitarana ny tobim-pahasalamana fototra manerana ny Nosy',
      "Fanamarihana an'i Madagasikara teo amin'ny sehatra iraisam-pirenena",
    ],
    badgeColor: '#9B2C2C',
    imageUrl: null,
    orderIndex: 4,
  },
  {
    id: 'zafy',
    name: 'Professeur Albert Zafy',
    titleFr: "L'Homme au Chapeau de Paille",
    titleMg: "Mpitolona ho an'ny Demokrasia",
    republic: '3ème République',
    republicMg: 'Repoblika Fahatelo',
    period: '1993 - 1996',
    quoteFr:
      '« La démocratie véritable réside dans la réconciliation nationale. »',
    quoteMg:
      '« Ny fampihavanam-pirenena no lalan-tokana hanarenana ny firenena. »',
    bioFr:
      "Chirurgien cardiologue de renommée mondiale originaire d'Ambilobe, figure de proue du mouvement des Forces Vives de 1991. Il instaure un régime parlementaire et consacre sa vie à la réconciliation nationale.",
    bioMg:
      "Dokotera mpandidy fo malaza avy any Ambilobe, nitarika ny Hery Velona Rasalama tamin'ny 1991. Nanandratra ny fitondrana parlemantera sy ny fampihavanam-pirenena.",
    achievementsFr: [
      'Avènement du multipartisme démocratique et de la liberté de presse',
      'Création des institutions de réconciliation (CRN)',
      'Plaidoyer constant pour une décentralisation effective',
    ],
    achievementsMg: [
      'Fahafahana maneho hevitra sy fampiroboroboana ny demokrasia',
      'Fametrahana ny komity fampihavanam-pirenena (CRN)',
      "Tolona ho an'ny fitsinjaram-pahefana tena izy",
    ],
    badgeColor: '#D69E2E',
    imageUrl: null,
    orderIndex: 5,
  },
  {
    id: 'ravalomanana',
    name: 'Marc Ravalomanana',
    titleFr: 'Le Bâtisseur Entrepreneur',
    titleMg: 'Mpanorina sy Mpandraharaha',
    republic: '3ème République',
    republicMg: 'Repoblika Fahatelo',
    period: '2002 - 2009',
    quoteFr:
      '« Aza matahotra, minoa fotsiny ihany ! » (Ne crains pas, crois seulement !)',
    quoteMg: '« Aza matahotra, minoa fotsiny ihany ! »',
    bioFr:
      "Entrepreneur autodidacte d'Imerinkasinina, maire d'Antananarivo avant d'accéder à la présidence en 2002. Il lance le Madagascar Action Plan (MAP) axé sur les routes, l'éducation et la croissance économique.",
    bioMg:
      "Mpandraharaha niorina avy tamin'ny herin'ny tenany tao Imerinkasinina, Ben'ny tanànan'Antananarivo talohan'ny naha filoha azy tamin'ny 2002. Nampiroborobo ny MAP sy ny fotodrafitrasa.",
    achievementsFr: [
      'Construction et réhabilitation massive du réseau routier national (RN)',
      "Réforme monétaire : adoption officielle de l'Ariary comme monnaie unique",
      "Programme d'éducation primaire universelle avec kits scolaires",
    ],
    achievementsMg: [
      "Fanamboarana lalam-pirenena maro manerana an'i Madagasikara",
      'Famerenana ny Ariary ho vola tokana manerana ny firenena',
      "Fampitaovana sy fampianarana maimaimpoana ho an'ny ankizy",
    ],
    badgeColor: '#2B6CB0',
    imageUrl: null,
    orderIndex: 6,
  },
  {
    id: 'rajoelina',
    name: 'Andry Rajoelina',
    titleFr: 'Initiateur de la 4ème République',
    titleMg: 'Mpanorina ny Repoblika Faha-4',
    republic: 'Transition & 4ème République',
    republicMg: 'Repoblika Faha-4',
    period: '2009 - 2014 / 2019 - Présent',
    quoteFr: "« Fampandrosoana haingana ho an'ny Malagasy rehetra. »",
    quoteMg: "« Fampandrosoana haingana ho an'ny Malagasy rehetra. »",
    bioFr:
      'Jeune entrepreneur et maire de la capitale en 2007, il préside la Haute Autorité de Transition avant de promulguer la Constitution de la 4ème République. Réélu au suffrage universel direct en 2018 et 2023.',
    bioMg:
      "Mpandraharaha tanora sady Ben'ny tanànan'Antananarivo tamin'ny 2007, nitarika ny Tetezamita ary nanorina ny Lalàmpanorenan'ny Repoblika faha-4. Voafidy tamin'ny 2018 sy 2023.",
    achievementsFr: [
      'Promulgation de la Constitution de la IVème République (11 Déc. 2010)',
      'Modernisation des infrastructures hospitalières (Manara-penitra) et sportives',
      'Projets énergétiques renouvelables et téléphérique urbain à Antananarivo',
    ],
    achievementsMg: [
      "Fandaniana ny Lalàmpanorenan'ny Repoblika Faha-4 (11 Des. 2010)",
      'Fananganana hopitaly sy kianja manara-penitra isam-paritra',
      'Tetikasa fampandrosoana ny herinaratra azo havaozina',
    ],
    badgeColor: '#DD6B20',
    imageUrl: null,
    orderIndex: 7,
  },
];

// ============================================================
// 3. MUSÉE DES BILLETS MALGACHES
// ============================================================
const BANKNOTES_SEED = [
  {
    id: 'billet-20000',
    valueAriary: 20000,
    valueFmg: 100000,
    titleFr: 'Billet de 20 000 Ariary (Le Sommet)',
    titleMg: 'Billet 20 000 Ariary (Ny Tanjona)',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 - Madagascar et ses Richesses',
    seriesLabelMg: 'Sokajy 2017 - Madagasikara sy ny Harenany',
    period: '2017 - Présent',
    colorLight: '#3B4A9B',
    colorDark: '#1E2756',
    obverseDescriptionFr:
      "Usine moderne de transformation de nickel d'Ambatovy à Toamasina, symbole de l'essor industriel et technologique.",
    obverseDescriptionMg:
      'Orinasa fanadiovana nikela Ambatovy ao Toamasina, mariky ny fampiroboroboana ny indostria.',
    reverseDescriptionFr:
      "Gousses de vanille de la SAVA, poivre sauvage et fleurs de girofle, illustrant l'excellence de l'agroalimentaire malgache.",
    reverseDescriptionMg:
      "Lavany avy any SAVA, dipoavatra sy jirofo, maneho ny kalitaon'ny vokatra fanondrana malagasy.",
    symbolismFr:
      "Plus haute coupure jamais émise par la Banque Centrale, elle incarne la modernité et l'ouverture commerciale internationale.",
    symbolismMg:
      'Ny vola taratasy lehibe indrindra, maneho ny fandrosoana sy ny fivelarana ara-toekarena.',
    securityFeaturesFr: [
      'Fil de sécurité animé avec changement de couleur violet/or',
      'Filigrane tête de zébu avec électrotype 20000',
      'Bande holographique brillante avec le logo BCM',
    ],
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'billet-10000',
    valueAriary: 10000,
    valueFmg: 50000,
    titleFr: 'Billet de 10 000 Ariary (Les Transports)',
    titleMg: 'Billet 10 000 Ariary (Ny Fifandraisana)',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 - Madagascar et ses Richesses',
    seriesLabelMg: 'Sokajy 2017 - Madagasikara sy ny Harenany',
    period: '2017 - Présent',
    colorLight: '#2E7D32',
    colorDark: '#1B5E20',
    obverseDescriptionFr:
      "Port fluvial et maritime d'Ehoala à Taolagnaro, reliant les échanges commerciaux du Sud à l'océan Indien.",
    obverseDescriptionMg:
      "Seranan-tsambon'i Ehoala ao Taolagnaro, mampifandray ny varotra an-dranomasina.",
    reverseDescriptionFr:
      "Oiseaux emblématiques et artisanat d'art malgache, valorisant la dextérité des bâtisseurs et créateurs.",
    reverseDescriptionMg:
      "Vorona mampiavaka an'i Madagasikara sy asa tanana malagasy.",
    symbolismFr:
      "Symbole de la souveraineté logistique et de l'interconnexion régionale des provinces côtières.",
    symbolismMg:
      "Mariky ny fifandraisana an-dranomasina sy ny haren'ny faritra atsimon'ny Nosy.",
    securityFeaturesFr: [
      'Encre optiquement variable passant du vert au bleu',
      'Micro-impressions Banque Centrale de Madagascar',
    ],
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'billet-5000',
    valueAriary: 5000,
    valueFmg: 25000,
    titleFr: 'Billet de 5 000 Ariary (La Biodiversité)',
    titleMg: 'Billet 5 000 Ariary (Ny Tontolo Iainana)',
    series: 'SERIE_2017',
    seriesLabelFr: 'Série 2017 - Madagascar et ses Richesses',
    seriesLabelMg: 'Sokajy 2017 - Madagasikara sy ny Harenany',
    period: '2017 - Présent',
    colorLight: '#C0392B',
    colorDark: '#7B1FA2',
    obverseDescriptionFr:
      "Site naturel féerique des Tsingy de Bemaraha (Patrimoine mondial UNESCO) et baleine à bosse de l'île Sainte-Marie.",
    obverseDescriptionMg:
      "Tsingin'i Bemaraha lova maneran-tany sy trozona mitsambikina ao Nosy Boraha.",
    reverseDescriptionFr:
      'Forêt primaire dense et caméléons endémiques, symbole de la richesse faunique unique au monde.',
    reverseDescriptionMg:
      'Ala mando sy tanalahy mampiavaka ny harena voajanahary.',
    symbolismFr:
      "Sensibilisation à la préservation des écosystèmes fragiles et au rayonnement de l'écotourisme.",
    symbolismMg:
      "Fanairana ny saina amin'ny fiarovana ny tontolo iainana sy ny fizahantany maitso.",
    securityFeaturesFr: [
      'Bande de sécurité iridescente scintillante',
      'Motif tactile en relief pour personnes malvoyantes',
    ],
    imageUrl: null,
    orderIndex: 3,
  },
];

// ============================================================
// 4. BLASONS DES 6 PROVINCES
// ============================================================
const PROVINCES_SEED = [
  {
    id: 'province-antananarivo',
    province: 'Antananarivo',
    chefLieu: 'Antananarivo-Renivohitra',
    titleFr: "Le Cœur de l'Imerina",
    titleMg: 'Imerina Enin-toko',
    color: '#2B6CB0',
    bgLight: '#EBF8FF',
    borderLight: '#BEE3F8',
    descriptionFr:
      'Capitale historique et administrative, berceau des royaumes merina et des douze collines sacrées.',
    descriptionMg:
      "Renivohitr'i Madagasikara, fonenan'ny mpanjaka tamin'ny vohitra roambin'ny folo masina.",
    symbols: [
      {
        labelFr: 'Le Palais du Rova (Manjakamiadana)',
        labelMg: "Lapan'i Manjakamiadana",
        meaningFr: 'Symbole de la souveraineté nationale',
        meaningMg: 'Mariky ny fiandrianam-pirenena',
      },
      {
        labelFr: "La couronne d'or",
        labelMg: 'Satron-boninahitra',
        meaningFr: 'Gloire et unité des six provinces',
        meaningMg: 'Voninahitra sy firaisan-kina',
      },
    ],
    keyFactsFr: [
      'Altitude moyenne : 1 280 m',
      'Centre économique, universitaire et politique majeur',
      "Site patrimonial : Rova d'Ambohimanga (UNESCO)",
    ],
    keyFactsMg: [
      "Haavo ambonin'ny ranomasina : 1 280 m",
      "Foiben'ny fandraharahana sy ny fianarana ambony",
      "Rovan'Ambohimanga lova maneran-tany",
    ],
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'province-fianarantsoa',
    province: 'Fianarantsoa',
    chefLieu: 'Fianarantsoa',
    titleFr: 'Le Berceau de la Sagesse & du Savoir',
    titleMg: 'Renivohitry ny Fahendrena sy ny Fianarana',
    color: '#2F855A',
    bgLight: '#F0FFF4',
    borderLight: '#C6F6D5',
    descriptionFr:
      'Terre des Betsileo, réputée pour ses rizières en terrasses sculptées, son vignoble et son artisanat Zafimaniry.',
    descriptionMg:
      "Tanin'ny Betsileo, malaza amin'ny tanimbary voavoly am-bavahady, ny divay ary ny hazo kanto Zafimaniry.",
    symbols: [
      {
        labelFr: 'Le livre ouvert et la plume',
        labelMg: 'Boky sy penina',
        meaningFr: 'Excellence académique et intellectuelle',
        meaningMg: 'Fianarana tsara sy fahaizana',
      },
      {
        labelFr: 'Les rizières en terrasses',
        labelMg: 'Tanimbary an-tohatra',
        meaningFr: 'Labeur acharné et fihavanana agricole',
        meaningMg: 'Fikajiana ny tany sy asa mafy',
      },
    ],
    keyFactsFr: [
      'Patrimoine mondial UNESCO du travail du bois Zafimaniry',
      'Seul vignoble traditionnel de Madagascar',
      'Point de départ du train pittoresque FCE vers Manakara',
    ],
    keyFactsMg: [
      "Asa hazo Zafimaniry eken'ny UNESCO ho lova maneran-tany",
      'Toerana tokana mpamokatra divay malagasy',
      "Lalamby FCE mampitohy an'i Fianarantsoa amin'i Manakara",
    ],
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'province-toamasina',
    province: 'Toamasina',
    chefLieu: 'Toamasina',
    titleFr: 'La Porte Océane & Poumon Économique',
    titleMg: "Vavahadin'ny Ranomasina sy Varotra",
    color: '#319795',
    bgLight: '#E6FFFA',
    borderLight: '#B2F5EA',
    descriptionFr:
      "Premier port de commerce de l'île, côte luxuriante du Canal des Pangalanes, région de la vanille et du girofle.",
    descriptionMg:
      "Seranan-tsambo voalohany eto Madagasikara, lakandranon'ny Pangalanes, tanin'ny lavany sy ny jirofo.",
    symbols: [
      {
        labelFr: "L'ancre marine et le navire",
        labelMg: 'Vanim-bato sy sambo',
        meaningFr: 'Ouverture sur le monde et commerce maritime',
        meaningMg: "Fivelarana amin'izao tontolo izao",
      },
      {
        labelFr: "L'arbre du voyageur (Ravinala)",
        labelMg: 'Ravinala',
        meaningFr: 'Hospitalité et ressource vitale',
        meaningMg: 'Fandrisihana sy fanampiana',
      },
    ],
    keyFactsFr: [
      'Manipule plus de 75% du trafic de conteneurs de Madagascar',
      "Parc national d'Andasibe-Mantadia (royaume de l'Indri Indri)",
      "Canal des Pangalanes s'étendant sur plus de 600 km",
    ],
    keyFactsMg: [
      "Mikarakara ny 75%-n'ny entana miditra sy mivoaka an-dranomasina",
      "Valan-javaboary Andasibe fonenan'ny Babakoto",
      "Lakandranon'ny Pangalanes mirefy 600 km mahery",
    ],
    imageUrl: null,
    orderIndex: 3,
  },
];

// ============================================================
// 5. NATURE & EMBLÈMES VIVANTS
// ============================================================
const NATURE_EMBLEMS_SEED = [
  {
    id: 'ravinala',
    nameFr: "L'Arbre du Voyageur (Ravinala)",
    nameMg: 'Ny Ravinala',
    scientificName: 'Ravenala madagascariensis',
    type: 'FLORA',
    statusFr: 'Endémique / Emblème National',
    statusMg: 'Harena Malagasy / Marika Iombonana',
    descriptionFr:
      "Plante emblématique majestueuse en forme d'éventail géant, capable de stocker une eau pure à la base de ses pétioles.",
    descriptionMg:
      "Zavamaniry mampiavaka an'i Madagasikara toy ny tana-maro, manangona rano madio azo sotroina amin'ny tahony.",
    culturalRoleFr:
      "Symbole universel de Madagascar, présent sur le sceau officiel de la République, les billets et les avions d'Air Madagascar.",
    culturalRoleMg:
      "Mariky ny firenena hita amin'ny tombo-kase ofisialy, ny vola ary ny fiaramanidina Air Madagascar.",
    proverbMg:
      '« Toy ny ravinala : an-tsaha mahavelon-tena, an-tanàna mahatsara endrika. »',
    proverbFr:
      '« Comme le ravinala : dans les champs il pourvoit à la vie, dans le village il embellit le paysage. »',
    accentColor: '#1B5E20',
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'renala-baobab',
    nameFr: 'Le Baobab Majestueux (Renala)',
    nameMg: 'Ny Renala (Baobaba)',
    scientificName: 'Adansonia grandidieri',
    type: 'FLORA',
    statusFr: 'Endémique (6 espèces sur 8)',
    statusMg: "Karazana 6 amin'ny 8 maneran-tany",
    descriptionFr:
      "Géant millénaire des savanes du Menabe et du Sud, surnommé la 'Mère de la Forêt'. L'Allée des Baobabs de Morondava est célèbre dans le monde entier.",
    descriptionMg:
      "Hazo lehibe mahatratra an-jato taonany any Menabe sy Atsimo, antsoina hoe 'Renin'ny Ala'. Malaza maneran-tany ny Allée des Baobabs any Morondava.",
    culturalRoleFr:
      "Considéré comme un arbre sacré reliant le monde des ancêtres et des vivants. Refuge spirituel et réserve d'eau vitale.",
    culturalRoleMg:
      "Hazo masina ifandraisan'ny razana sy ny velona. Toerana fialofana sady fitehirizan-drano.",
    proverbMg:
      "« Ny hazo avo halan'ny rivotra, fa ny renala kosa mahazaka tafiotra. »",
    proverbFr:
      "« L'arbre haut défie le vent, mais le baobab résiste à la tempête. »",
    accentColor: '#795548',
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'maki-catta',
    nameFr: 'Le Lémurien Maki Catta',
    nameMg: 'Ny Gidro Maki Catta',
    scientificName: 'Lemur catta',
    type: 'FAUNA',
    statusFr: 'Espèce protégée / Emblème faunique',
    statusMg: "Biby arovana / Reharehan'ny Nosy",
    descriptionFr:
      "Lémurien célèbre à la longue queue annelée noire et blanche. Vivant en bandes matriarcales dans les forêts du Sud d'Isalo et d'Anja.",
    descriptionMg:
      "Gidro manana rambo misy vava mainty sy fotsy mifandimby. Miara-miaina anaty andiany tarihin'ny vavy any Isalo sy Anja.",
    culturalRoleFr:
      'Figure incontournable des contes et fables malgaches, protecteur traditionnel de certaines forêts sacrées.',
    culturalRoleMg:
      "Biby manan-danja amin'ny angano sy tantara malagasy, arovana amin'ny ala masina sasany.",
    proverbMg:
      '« Ny gidro no tsy mahafoy ala, fa ny olona no tsy mahafoy fihavanana. »',
    proverbFr:
      "« Le lémurien n'abandonne point la forêt, tout comme l'homme n'abandonne point le fihavanana. »",
    accentColor: '#D97706',
    imageUrl: null,
    orderIndex: 3,
  },
];

// ============================================================
// 6. GRANDES DATES DE LA NATION
// ============================================================
const HISTORY_DATES_SEED = [
  {
    id: 'date-1960-06-26',
    year: '1960',
    exactDate: '26 Juin 1960',
    titleFr: "Proclamation de l'Indépendance Nationale",
    titleMg: 'Fahazoana ny Fahaleovantena',
    era: 'Première République',
    summaryFr:
      'Madagascar recouvre officiellement sa souveraineté internationale après 64 ans de colonisation. Le Président Philibert Tsiranana prononce le discours historique devant le peuple en liesse.',
    summaryMg:
      "Namerenana tamin'i Madagasikara ny fiandrianany feno taorian'ny 64 taona naha teo ambany fifehezan'ny mpanjanaka. Nambaran'ny Filoha Tsiranana tamin'ny vahoaka ny fahafahana.",
    impactFr:
      "Naissance de la fête nationale commémorée chaque année le 26 juin dans l'allégresse patriotique.",
    impactMg:
      'Lasa fetim-pirenena ankalazaina isaky ny 26 jona am-piravoravoana manerana ny Nosy.',
    accentColor: '#15803D',
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'date-1947-03-29',
    year: '1947',
    exactDate: '29 Mars 1947',
    titleFr: "L'Insurrection Anticoloniale pour la Liberté",
    titleMg: "Ny Tolom-bahoaka tamin'ny 29 Martsa 1947",
    era: 'Période Coloniale',
    summaryFr:
      'Soulèvement héroïque des patriotes malgaches pour briser le joug colonial. Un combat sacrificiel qui pavera la voie vers la libération nationale.',
    summaryMg:
      "Fikomiana feno fahasahiana nataon'ireo tia tanindrazana hanoherana ny mpanjanaka. Sorona goavana nanokatra ny lalana mankany amin'ny fahaleovantena.",
    impactFr:
      "Journée sacrée de commémoration des martyrs de la liberté (Martioran'ny Fahafahana).",
    impactMg:
      "Andro fahatsiarovana ireo maritiora nanolotra ny ainy ho an'ny tanindrazana.",
    accentColor: '#B91C1C',
    imageUrl: null,
    orderIndex: 2,
  },
];

// ============================================================
// 7. EMBLÈMES & SCEAUX D'ÉTAT HISTORIQUES (Période, Illustration, Gouvernement, Description et notes)
// ============================================================
const NATIONAL_EMBLEMS_SEED = [
  {
    id: 'embleme-royaume-merina',
    period: '1828 - 1896',
    government: "Royaume de Madagascar (Fanjakan'i Madagasikara)",
    descriptionFr:
      "Armoiries royales arborant l'Aigle royal (Voromahery), surmonté de la couronne d'or de Ranavalona, flanqué des lances sacrées et du dais royal pourpre.",
    descriptionMg:
      'Mari-piandrianana mampiseho ny Voromahery, ny satro-boninahitra volamena, lefona masina ary ny lamba mena mpanjaka.',
    notesFr:
      "Utilisé sur les décrets royaux, traités diplomatiques et drapeaux jusqu'à l'annexion coloniale française de 1896.",
    notesMg:
      "Nampiasaina tamin'ny didim-panjakana sy fifanekena iraisam-pirenena mandra-pahatongan'ny fanjanahan-tany tamin'ny 1896.",
    imageUrl: null,
    orderIndex: 1,
  },
  {
    id: 'embleme-premiere-republique',
    period: '1959 - 1972',
    government: 'Première République Malgache (Philibert Tsiranana)',
    descriptionFr:
      "Sceau circulaire représentant au centre une tête de zébu stylisée, encadrée de deux branches de caféier en fleur, surmontée des rayons dorés du soleil levant, avec la devise 'Fahafahana, Tanindrazana, Fandrosoana' (Liberté, Patrie, Progrès).",
    descriptionMg:
      "Tombo-kase boribory ahitana lohan'omby eo afovoany, fehezin'ny rantsana kafe roa, hazavan'ny masoandro miposaka, ary ny teny filamatra 'Fahafahana, Tanindrazana, Fandrosoana'.",
    notesFr:
      'Adopté lors de la promulgation de la Constitution de la 1ère République en 1959.',
    notesMg:
      "Nolaniana tamin'ny fampiharana ny Lalàmpanorenan'ny Repoblika Voalohany tamin'ny 1959.",
    imageUrl: null,
    orderIndex: 2,
  },
  {
    id: 'embleme-deuxieme-republique-rdm',
    period: '1975 - 1992',
    government:
      'Deuxième République / République Démocratique de Madagascar (Didier Ratsiraka)',
    descriptionFr:
      "Emblème socialiste intégrant une étoile rouge au sommet, une roue dentée industrielle, un livre ouvert (le Livre Rouge), un fusil et une bêche croisés, une tête de zébu, avec la devise 'Tanindrazana, Tolom-piavotana, Fahafahana' (Patrie, Révolution, Liberté).",
    descriptionMg:
      "Mari-piandrianana sosialista misy kintana mena, kodiarana indostrialy, boky misokatra (Boky Mena), basy sy angady mifampiditra, ary ny teny filamatra 'Tanindrazana, Tolom-piavotana, Fahafahana'.",
    notesFr:
      'Symbole de la Charte de la Révolution Socialiste malgache et de la transition vers le socialisme scientifique.',
    notesMg:
      "Mariky ny Satan'ny Tolom-piavotana Sosialista sy ny vanim-potoana Repoblika Faharoa.",
    imageUrl: null,
    orderIndex: 3,
  },
  {
    id: 'embleme-troisieme-republique',
    period: '1992 - 2010',
    government:
      'Troisième République de Madagascar (Albert Zafy / Marc Ravalomanana)',
    descriptionFr:
      "Disque d'argent arborant l'arbre du voyageur (Ravinala) stylisé en éventail, surmonté d'épis de riz et de la tête de zébu, entouré de la devise 'Tanindrazana, Fahafahana, Fandrosoana' (Patrie, Liberté, Progrès).",
    descriptionMg:
      "Diska volafotsy ahitana ny Ravinala, salohim-bary sy lohan'omby, voahodidin'ny teny filamatra 'Tanindrazana, Fahafahana, Fandrosoana'.",
    notesFr:
      'Restauration des emblèmes écologiques et traditionnels après la conférence nationale de 1992.',
    notesMg:
      "Famerenana ny marika nentim-paharazana sy ny natiora taorian'ny fihaonambem-pirenena 1992.",
    imageUrl: null,
    orderIndex: 4,
  },
  {
    id: 'embleme-quatrieme-republique',
    period: '2010 - Présent',
    government: 'Quatrième République de Madagascar (Régime Actuel)',
    descriptionFr:
      "Sceau officiel de l'État : disque d'argent figurant au centre le Ravinala verdoyant évasé, surmonté de la tête de zébu rouge et des épis de riz dorés, ceinturé de la devise nationale 'Fitiavana, Tanindrazana, Fandrosoana' (Amour, Patrie, Progrès) et de la mention 'Repoblikan'i Madagasikara'.",
    descriptionMg:
      "Tombo-kase ofisialin'ny Fanjakana : Ravinala maitso misokatra, lohan'omby mena sy salohim-bary volamena, miaraka amin'ny teny filamatra 'Fitiavana, Tanindrazana, Fandrosoana'.",
    notesFr:
      "Sceau officiel en vigueur aujourd'hui sur l'ensemble des actes gouvernementaux, passeports, décrets républicains et représentations diplomatiques de Madagascar.",
    notesMg:
      "Tombo-kase manan-kery ampiasaina amin'ny antontan-taratasim-panjakana rehetra, pasipaoro sy solontena ara-diplaomatika.",
    imageUrl: null,
    orderIndex: 5,
  },
];

async function seedHistory() {
  console.log('🌱 Démarrage du seed Histoire, Mémoire & Emblèmes...');

  // 1. CivicLessons
  for (const item of CIVIC_LESSONS_SEED) {
    await prisma.civicLesson.upsert({
      where: { id: item.id },
      create: item,
      update: item,
    });
  }
  console.log(`✅ ${CIVIC_LESSONS_SEED.length} thèmes et leçons insérés`);

  // 2. Presidents
  for (const item of PRESIDENTS_SEED) {
    const existing = await prisma.president.findUnique({
      where: { id: item.id },
    });
    await prisma.president.upsert({
      where: { id: item.id },
      create: item,
      update: {
        ...item,
        imageUrl: existing?.imageUrl || item.imageUrl || null,
      },
    });
  }
  console.log(`✅ ${PRESIDENTS_SEED.length} présidents insérés`);

  // 3. Banknotes
  for (const item of BANKNOTES_SEED) {
    const existing = await prisma.banknote.findUnique({
      where: { id: item.id },
    });
    await prisma.banknote.upsert({
      where: { id: item.id },
      create: item,
      update: {
        ...item,
        imageUrl: existing?.imageUrl || item.imageUrl || null,
        imageUrlVerso: existing?.imageUrlVerso || item.imageUrlVerso || null,
      },
    });
  }
  console.log(`✅ ${BANKNOTES_SEED.length} billets insérés`);

  // 4. ProvinceBlasons
  for (const item of PROVINCES_SEED) {
    const existing = await prisma.provinceBlason.findUnique({
      where: { id: item.id },
    });
    await prisma.provinceBlason.upsert({
      where: { id: item.id },
      create: item,
      update: {
        ...item,
        imageUrl: existing?.imageUrl || item.imageUrl || null,
      },
    });
  }
  console.log(`✅ ${PROVINCES_SEED.length} provinces et blasons insérés`);

  // 5. NatureEmblems
  for (const item of NATURE_EMBLEMS_SEED) {
    const existing = await prisma.natureEmblem.findUnique({
      where: { id: item.id },
    });
    await prisma.natureEmblem.upsert({
      where: { id: item.id },
      create: item,
      update: {
        ...item,
        imageUrl: existing?.imageUrl || item.imageUrl || null,
      },
    });
  }
  console.log(`✅ ${NATURE_EMBLEMS_SEED.length} emblèmes naturels insérés`);

  // 6. HistoryDates
  for (const item of HISTORY_DATES_SEED) {
    const existing = await prisma.historyDate.findUnique({
      where: { id: item.id },
    });
    await prisma.historyDate.upsert({
      where: { id: item.id },
      create: item,
      update: {
        ...item,
        imageUrl: existing?.imageUrl || item.imageUrl || null,
      },
    });
  }
  console.log(`✅ ${HISTORY_DATES_SEED.length} dates historiques insérées`);

  // 7. NationalEmblems
  for (const item of NATIONAL_EMBLEMS_SEED) {
    const existing = await prisma.nationalEmblem.findFirst({
      where: { period: item.period },
    });
    if (existing) {
      await prisma.nationalEmblem.update({
        where: { id: existing.id },
        data: {
          ...item,
          imageUrl: existing.imageUrl || item.imageUrl || null,
        },
      });
    } else {
      await prisma.nationalEmblem.create({ data: item });
    }
  }
  console.log(
    `✅ ${NATIONAL_EMBLEMS_SEED.length} emblèmes d'État historiques insérés`,
  );

  console.log('🎉 Seed Histoire & Emblèmes terminé avec succès !');
}

seedHistory()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
