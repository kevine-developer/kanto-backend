import { SeedTrack } from './seed.types.js';

export const wisdomTrack: SeedTrack = {
  slug: 'fahendrena-sy-fihavanana',
  title: 'Sagesse ancestrale & Fihavanana',
  titleMg: 'Fahendrena & Fihavanana Malagasy',
  description:
    'Pénétrez au cœur de la philosophie malgache : proverbes clés expliqués et valeurs de solidarité.',
  descriptionMg:
    "Midira lalina amin'ny fahendrena nentin-drazana sy ny lanjan'ny fihavanana miray hina.",
  level: 'INTERMEDIATE',
  icon: 'Compass',
  color: '#C58B38',
  orderIndex: 2,
  estimatedMinutes: 45,
  lessons: [
    {
      slug: 'le-concept-fondamental-du-fihavanana',
      title: 'Le Fihavanana : lien sacré de fraternité',
      titleMg: 'Ny Fihavanana : fatorana masina mampiray',
      summary:
        'Explorez la notion de Fihavanana, pilier absolu de la cohésion sociale et de la paix à Madagascar.',
      summaryMg:
        "Famakafakana ny hevitra fototry ny Fihavanana, fototra iorenan'ny firaisankina sy ny fihavanana.",
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le Fihavanana dépasse la simple fraternité de sang : c'est l'art de reconnaître chaque être humain comme un frère et de cultiver la solidarité inconditionnelle.",
          textMg:
            "Ny Fihavanana dia mihoatra lavitra noho ny fifamatorana ara-dra : fahaizana miaina miaraka sy fifanampiana amin'ny fotoan-tsarotra.",
        },
        {
          type: 'concept',
          termMg: 'Fihavanana',
          phonetic: 'fi-ha-va-na-na',
          meaningFr: "Fraternité, lien d'harmonie sociale, solidarité vivante",
          explanation:
            'Concept cardinal de la culture malgache liant les individus dans une responsabilité mutuelle.',
        },
        {
          type: 'concept',
          termMg: 'Valin-tanana',
          phonetic: 'va-lin ta-na-na',
          meaningFr:
            'Entraide mutuelle réciproque (littéralement : retour de main)',
          explanation:
            "Système solidaire d'aide aux champs ou à la construction : aujourd'hui je t'aide, demain tu m'aideras.",
        },
        {
          type: 'example',
          textMg: 'Aleo very tsikalakalam-bola toy izay very fihavanana.',
          textFr:
            "Mieux vaut perdre de l'argent que de briser le lien de fraternité (Fihavanana).",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Chez les Malgaches, rompre le Fihavanana est considéré comme l'une des fautes morales les plus graves. Dans les villages, les conflits se règlent traditionnellement sous l'arbre à palabres devant les anciens.",
          textMg:
            "Ny fanapahana fihavanana dia fady sy fahotana lehibe eo amin'ny fiarahamonina malagasy.",
        },
        // ─── 3 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Que préconise le proverbe célèbre : « Aleo very tsikalakalam-bola toy izay... » ?',
          questionMg:
            "Ahoana no tohin'ny ohabolana : « Aleo very tsikalakalam-bola toy izay... » ?",
          choices: [
            'Very fihavanana (Perdre le lien de fraternité)',
            'Very fananana (Perdre des biens matériels)',
            'Tsy misakafo (Ne pas manger)',
            'Tsy matory (Ne pas dormir)',
          ],
          correctIndex: 0,
          explanation:
            'Le proverbe sacralise le lien humain par-dessus toute richesse matérielle ou financière.',
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Valin-tanana » dans la vie communautaire ?",
          questionMg:
            "Inona no dikan'ny hoe « Valin-tanana » eo amin'ny fiainam-bahoaka ?",
          choices: [
            "L'entraide agricole et solidaire réciproque entre voisins",
            'Un impôt versé au chef du village',
            "Un jeu d'adresse traditionnel",
            'Un rituel de guérison nocturne',
          ],
          correctIndex: 0,
          explanation:
            'Le « Valin-tanana » (retour de main) désigne le système solidaire où la communauté aide à tour de rôle chaque famille pour les travaux lourds.',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la traduction la plus juste du concept de « Fihavanana » ?',
          questionMg:
            'Inona no famaritana mahitsy indrindra ny « Fihavanana » ?',
          choices: [
            'La fraternité solidaire et la cohésion harmonieuse du groupe',
            'Une simple transaction commerciale',
            "Une règle juridique imposée par l'État",
            'Une querelle de voisinage',
          ],
          correctIndex: 0,
          explanation:
            "Le Fihavanana est une valeur cardinale qui fait de l'harmonie sociale et de la solidarité un devoir sacré.",
        },
        {
          type: 'quiz',
          question:
            'Quel acte est considéré comme une faute morale majeure dans la société malgache ?',
          questionMg:
            "Inona no heverina ho fandikana lalàna ara-moraly lehibe indrindra eo amin'ny fiarahamonina ?",
          choices: [
            'Rompre délibérément le lien de fraternité (manapaka fihavanana)',
            'Refuser poliment un cadeau inutile',
            'Partir travailler dans une autre commune',
            'Acheter des terres agricoles supplémentaires',
          ],
          correctIndex: 0,
          explanation:
            'Le Fihavanana garantissant la paix communautaire, sa rupture délibérée est réprouvée et considérée comme fady.',
        },
        {
          type: 'quiz',
          question:
            'Sur quel principe repose la pratique communautaire du « Valin-tanana » ?',
          questionMg:
            "Inona no fototra iorenan'ny fomba nentin-drazana hoe « Valin-tanana » ?",
          choices: [
            "La réciprocité solidaire et l'entraide mutuelle bénévole",
            "Le versement d'un impôt obligatoire au chef du village",
            "Un contrat de prêt bancaire à taux d'intérêt",
            "L'embauche d'ouvriers salariés rémunérés à la journée",
          ],
          correctIndex: 0,
          explanation:
            "Le Valin-tanana (retour de main) repose sur l'aide mutuelle sans transaction monétaire pour les travaux communautaires.",
        },
      ],
    },
    {
      slug: 'les-proverbes-de-la-parole-et-du-lien',
      title: 'Les proverbes sacrés : parole et fraternité (Ohabolana)',
      titleMg: 'Ny Ohabolana momba ny Teny sy ny Fihavanana',
      summary:
        "Découvrez la force des métaphores malgaches qui guident la sagesse quotidienne et protègent l'amitié.",
      summaryMg:
        "Fantaro ny herin'ny ohabolana nentin-drazana manoro lalana ny fiainana sy miaro ny firaisankina.",
      type: 'LITERATURE',
      orderIndex: 2,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, « les proverbes sont la lampe qui éclaire l'esprit » (*Ny ohabolana no fanilo manazava ny saina*). Un discours sans proverbe est comme un plat sans sel.",
          textMg:
            "Ny ohabolana dia lova soa nentin-drazana. Ny teny tsy misy ohabolana dia toy ny sakafo tsy misy sira, tsy manana hanitra eo amin'ny fiarahamonina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'ND',
          phonetic: 'nd',
          frenchEquivalent:
            'Son doux et lié entre la dentale « N » et la sonore « D » (ex: Landy = soie).',
          sampleWordMg: 'Landy',
          sampleTranslationFr: 'La soie précieuse',
        },
        {
          type: 'concept',
          termMg: 'Ohabolana',
          phonetic: 'ow-ha-bou-la-na',
          meaningFr: 'Proverbe, sentence de sagesse, parole proverbiale',
          explanation:
            'Condensé de la mémoire ancestrale servant à conseiller, apaiser et préserver le respect sans heurter.',
        },
        {
          type: 'concept',
          termMg: 'Fihavanan-dandy',
          phonetic: 'fi-ha-va-nan-dan-di',
          meaningFr:
            "Une fraternité comparable à la soie (qui s'entretient et se répare)",
          explanation:
            "Par opposition à l'amitié de pierre qui casse, le lien de soie peut toujours être raccordé avec soin.",
        },
        {
          type: 'concept',
          termMg: 'Ny teny toy ny atody',
          phonetic: 'ni te-ni toui ni a-tou-di',
          meaningFr:
            'La parole est comme un œuf (une fois tombée, on ne peut la rattraper)',
          explanation:
            'Mise en garde fondamentale sur la prudence verbale : une parole blessante brise la confiance pour toujours.',
        },
        {
          type: 'example',
          textMg:
            'Aza atao fihavanam-bato, fa ataovy fihavanan-dandy ka raha madilana azo tohizana.',
          textFr:
            "Ne faites pas une amitié de pierre (qui casse net), faites une amitié de fil de soie : si elle s'amincit, on peut la renouer.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans la diplomatie villageoise malgache, les anciens n'utilisent jamais d'invectives directes en cas de litige : ils citent un ohabolana imagé. Cela permet à la personne fautive de comprendre son erreur sans jamais perdre la face.",
          textMg:
            "Eo anatrehan'ny ady na olana, ny Ntaolo dia mampiasa ohabolana fa tsy masiaka am-bava. Izany dia fomba fananarana am-pahamendrehana mba tsy hahamenatra ny hafa.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Que préconise le proverbe sur l'amitié de soie (« fihavanan-dandy ») ?",
          questionMg:
            'Inona no hevitry ny ohabolana mikasika ny « fihavanan-dandy » ?',
          choices: [
            'Le lien doit être souple et réparable avec soin, comme un fil de soie',
            "L'amitié doit être dure et tranchante comme la pierre",
            'Il ne faut faire confiance à personne dans le village',
            "L'amitié doit être achetée avec de l'argent",
          ],
          correctIndex: 0,
          explanation:
            "La soie symbolise la valeur et la possibilité de renouer le fil quand il s'amenuise, contrairement à la pierre qui se brise.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi compare-t-on la parole à un œuf (« Ny teny toy ny atody ») ?',
          questionMg:
            "Nahoana no ampitahaina amin'ny atody ny teny (« Ny teny toy ny atody ») ?",
          choices: [
            "Parce qu'une parole prononcée ne peut plus être rattrapée une fois sortie",
            'Parce que la parole a une forme ovale',
            "Parce qu'il faut manger des œufs avant de parler",
            'Parce que les paroles sont fragiles au soleil',
          ],
          correctIndex: 0,
          explanation:
            'Si un œuf tombe au sol, il éclate et nul ne peut le ramasser. Il en va de même pour une parole imprudente ou blessante.',
        },
        {
          type: 'quiz',
          question:
            'À quoi compare-t-on traditionnellement un discours malgache sans proverbes ?',
          questionMg:
            "Ampitahaina amin'ny inona ny kabary na kabary tsy misy ohabolana ?",
          choices: [
            'À un repas fade sans sel (« sakafo tsy misy sira »)',
            'À un arbre sans feuilles',
            'À une maison sans porte',
            'À un ciel sans étoiles',
          ],
          correctIndex: 0,
          explanation:
            "Les proverbes apportent le sel, la saveur et l'autorité morale indispensable à l'art oratoire.",
        },
        {
          type: 'quiz',
          question:
            'Quel terme malgache désigne les proverbes et maximes de sagesse ?',
          questionMg:
            'Inona no teny malagasy manondro ireo oha-pitenenana sy lova ara-panahy ?',
          choices: ['Ohabolana', 'Hainteny', 'Tsodrano', 'Vakodrazana'],
          correctIndex: 0,
          explanation:
            '« Ohabolana » est le mot précis pour désigner les proverbes malgaches ancestraux.',
        },
        {
          type: 'quiz',
          question:
            "Quel rôle joue le proverbe lors de la résolution d'un conflit villageois ?",
          questionMg:
            "Inona no anjara toeran'ny ohabolana rehefa mamaha olana eo amin'ny fiaraha-monina ?",
          choices: [
            'Délivrer un conseil juste sans humilier ni faire perdre la face',
            'Imposer une amende financière immédiate',
            'Interdire toute négociation entre les familles',
            'Obliger un exil hors du village',
          ],
          correctIndex: 0,
          explanation:
            "Le proverbe éclaire la faute avec métaphore et tact, permettant la réconciliation sans blesser l'amour-propre.",
        },
      ],
    },
    {
      slug: 'la-culture-du-riz-et-repas-sacres',
      title: 'Le riz et les repas sacrés : « Ny vary no aina »',
      titleMg: 'Ny Vary no Aina sy ny Fihavanana eo am-Pihinanana',
      summary:
        "Comprenez la place sacrée du riz dans l'âme malgache, symbole de vie, d'accueil et de cohésion.",
      summaryMg:
        "Ianaro ny lanjan'ny vary amin'ny maha aina azy sy ny fitsipika mifehy ny sakafo iombonana.",
      type: 'TRADITION',
      orderIndex: 3,
      durationMinutes: 6,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, « le riz est la vie » (*Ny vary no aina*). Sans riz, un repas n'est pas considéré comme achevé. Partager le repas scelle la communion fraternelle.",
          textMg:
            'Ny vary no fototry ny fiainana malagasy. Raha tsy misy vary ny sakafo dia mbola tsy nihinana ny olona. Mariky ny fihavanana sy ny firaisan-kina ny fizarana vary.',
        },
        {
          type: 'phonetic',
          letterOrSound: 'NG',
          phonetic: 'ng',
          frenchEquivalent:
            'Son nasal guttural semblable au « ng » de « parking » ou « gong » (ex: Ranonampango).',
          sampleWordMg: 'Ranonampango',
          sampleTranslationFr: 'Eau de riz doré traditionnel',
        },
        {
          type: 'concept',
          termMg: 'Vary',
          phonetic: 'va-ri',
          meaningFr: 'Le riz (aliment fondamental et sacré)',
          explanation:
            'Au-delà de la nourriture, le riz est le don de Zanahary, emblème de fertilité et de subsistance.',
        },
        {
          type: 'concept',
          termMg: 'Laoka',
          phonetic: 'low-ka',
          meaningFr: 'Accompagnement du riz (viande, brèdes, poisson)',
          explanation:
            'Tout aliment accompagnant le plat de riz est désigné sous le terme de laoka.',
        },
        {
          type: 'concept',
          termMg: 'Ranonampango (Ranovola)',
          phonetic: 'ra-noun-am-pang-ou (ra-nou-vou-la)',
          meaningFr:
            'Eau de riz bouillie sur la croûte dorée au fond de la marmite',
          explanation:
            'Boisson nationale chaude, digestive et saine, servie avec générosité à la fin de chaque repas.',
        },
        {
          type: 'concept',
          termMg: 'Vary be menaka',
          phonetic: 'va-ri be me-na-ka',
          meaningFr: 'Le grand repas de fête (riz à la viande grasse de zébu)',
          explanation:
            "Repas rituel partagé lors des circoncisions, mariages et famadihana, symbole de fête et d'abondance.",
        },
        {
          type: 'example',
          textMg:
            'Mandehana mihinana vary tompoko ! — Misaotra tompoko, mazotoa homana !',
          textFr:
            'Venez partager le repas de riz ! — Merci beaucoup à vous, bon appétit !',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Madagascar compte parmi les pays où la consommation de riz par habitant est la plus élevée au monde (plus de 120 kg/an). Lors d'un repas familial traditionnel, l'étiquette veut que les plus jeunes attendent que le « Zoky » (l'aîné) donne le premier coup de cuillère.",
          textMg:
            "Mitana ny laharana voalohany amin'ny fihinanana vary eran-tany ny Malagasy. Fomba fanajana ny miandry ny zoky hikasika voalohany ny sakafo mialoha ny hihinanana.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Que signifie la célèbre maxime malgache « Ny vary no aina » ?',
          questionMg:
            'Inona no hevitry ny ohabolana fanta-daza hoe « Ny vary no aina » ?',
          choices: [
            "Le riz est la vie / l'âme de l'existence",
            'Le riz coûte très cher cette saison',
            'Le riz doit être planté la nuit',
            "Le riz ne sert qu'aux personnes âgées",
          ],
          correctIndex: 0,
          explanation:
            "« Aina » signifie vie, souffle, âme. Le riz est considéré comme l'énergie vitale indispensable du Malgache.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on tout accompagnement servi avec le plat de riz ?',
          questionMg:
            "Ahoana no iantsoana ny sakafo rehetra mpiara-dia amin'ny vary (hena, anana, trondro) ?",
          choices: ['Laoka', 'Ranovola', 'Tsena', 'Mofo'],
          correctIndex: 0,
          explanation:
            'Tout mets qui accompagne le riz (viande, brèdes, haricots) est universellement nommé « laoka ».',
        },
        {
          type: 'quiz',
          question: "Qu'est-ce que le « Ranonampango » (ou « Ranovola ») ?",
          questionMg:
            'Inona moa ny atao hoe « Ranonampango » na « Ranovola » ?',
          choices: [
            "L'infusion d'eau bouillante sur le riz doré au fond de la cocotte",
            'Un jus de fruits exotiques glacé',
            'Une huile de friture pour la viande',
            'Une soupe de légumes salée',
          ],
          correctIndex: 0,
          explanation:
            "C'est la boisson chaude emblématique obtenue en faisant bouillir de l'eau sur le fond de riz roussi (ampango).",
        },
        {
          type: 'quiz',
          question:
            "Quelle politesse élémentaire s'impose lors du repas familial traditionnel malgache ?",
          questionMg:
            "Inona no fomba amam-panao hajaina eo am-pihinanana miaraka amin'ny fianakaviana ?",
          choices: [
            'Attendre que les aînés (Zoky) commencent à manger avant de se servir',
            'Manger le plus vite possible avant les autres',
            "Quitter la table dès qu'on a fini son assiette sans rien dire",
            "Ne jamais boire d'eau pendant le repas",
          ],
          correctIndex: 0,
          explanation:
            'Le respect de la préséance des aînés (Haja) est une règle sacrée : les cadets attendent le premier geste du Zoky.',
        },
        {
          type: 'quiz',
          question:
            "Que désigne l'expression rituelle « Vary be menaka » lors des grandes fêtes ?",
          questionMg:
            'Inona no atao hoe « Vary be menaka » mandritra ireo lanonana nentin-drazana ?',
          choices: [
            'Le grand repas festif de riz à la viande grasse de zébu offert aux invités',
            'Un riz mal cuit qui a brûlé',
            'Un riz vendu au marché sous la pluie',
            'Un dessert sucré au lait',
          ],
          correctIndex: 0,
          explanation:
            "Le « Vary be menaka » est le repas d'abondance et de fête par excellence partagé lors des grands événements familiaux.",
        },
      ],
    },
    {
      slug: 'le-haja-et-le-dina-pacte-communautaire',
      title:
        'Le Haja et le Dina : respect mutuel et pacte solidaire (Ny Haja sy ny Dina)',
      titleMg: 'Ny Haja sy ny Dina : Fanajana sy Fifanekem-piarahamonina',
      summary:
        'Découvrez comment le Haja (déférence sacrée) et le Dina (convention communautaire) cimentent la paix villageoise.',
      summaryMg:
        "Fantaro ny lanjan'ny Haja mifehy ny fiainana sy ny Dina mampandry fahalemana ny Fokonolona.",
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la pensée traditionnelle malgache, le respect (Haja) n'est pas une simple marque d'obéissance, c'est la reconnaissance sacrée de la valeur d'autrui. Associé au Dina, pacte communautaire juré ensemble, il assure l'harmonie et l'ordre sans nécessiter de police extérieure.",
          textMg:
            "Ao amin'ny fahendrena malagasy, ny Haja dia tsy fanandevozan-tena fa fanomezana lanja ny maha-olona sy ny soatoavina. Rehefa mifamatotra amin'ny Dina izany dia milamina sy milamina ny fiarahamonina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'J',
          phonetic: 'dz',
          frenchEquivalent:
            'Le « J » malgache se prononce toujours comme une consonne affriquée « dz » (semblable au « ds » dans « kids » ou « zz » dans « pizza »), jamais comme le « j » français doux (ex: Haja = ha-dza).',
          sampleWordMg: 'Haja',
          sampleTranslationFr: 'Le respect / La dignité / L’honneur',
        },
        {
          type: 'concept',
          termMg: 'Haja',
          phonetic: 'ha-dza',
          meaningFr: 'Respect, déférence, dignité d’autrui',
          explanation:
            'Vertu cardinale qui impose de traiter chacun avec considération, des plus jeunes aux ancêtres.',
        },
        {
          type: 'concept',
          termMg: 'Dina',
          phonetic: 'di-na',
          meaningFr: 'Convention collective, pacte communautaire juré',
          explanation:
            'Règlement traditionnel établi et accepté par le Fokonolona pour protéger le village, les récoltes et la paix.',
        },
        {
          type: 'concept',
          termMg: 'Fokonolona',
          phonetic: 'fou-kou-nou-lou-na',
          meaningFr: 'Assemblée des villageois, communauté solidaire de base',
          explanation:
            'Cellule fondamentale de la démocratie participative malgache où chaque voix compte dans le consensus.',
        },
        {
          type: 'concept',
          termMg: 'Fanajana',
          phonetic: 'fa-na-dza-na',
          meaningFr: 'L’action de respecter, politesse en acte',
          explanation:
            'Pratique concrète du respect au quotidien : saluer humblement, écouter sans couper la parole, laisser passer l’aîné.',
        },
        {
          type: 'concept',
          termMg: 'Firaisankina',
          phonetic: 'fi-rye-san-ki-na',
          meaningFr: 'Union solidaire, cohésion indéfectible',
          explanation:
            'La force née de l’assemblage de volontés unies, comme le rappelle le proverbe : « Ny firaisankina no hery ».',
        },
        {
          type: 'example',
          textMg: 'Manaja ny Dina ny Fokonolona ka mandry feizay ny tanàna.',
          textFr:
            'La communauté villageoise respecte le Dina, ainsi la paix et la quiétude règnent sur le village.',
        },
        {
          type: 'example',
          textMg: 'Ny haja omena ny hafa no haja iverenana aminao.',
          textFr:
            'Le respect que vous offrez aux autres est celui qui vous reviendra en retour.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le Dina malgache est si profondément ancré dans l'histoire qu'il a été reconnu par la législation moderne à Madagascar. Aujourd'hui encore, un Dina validé par le tribunal a force exécutoire dans les campagnes pour la surveillance du bétail et des forêts sacrées.",
          textMg:
            "Ny Dina dia manana hery lehibe eo amin'ny lalàna malagasy ankehitriny. Eken'ny fitsarana ny Dina ifanaovan'ny mponina any ambanivohitra mba hiarovana ny omby sy ny ala.",
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            'Que désigne le concept de « Dina » dans la société traditionnelle malgache ?',
          questionMg:
            "Inona no hevitry ny « Dina » eo amin'ny fiarahamonina malagasy ?",
          choices: [
            'Un pacte social ou une convention communautaire adoptée ensemble',
            'Un instrument de musique traditionnel à cordes',
            'Un type de riz rouge réservé aux rois',
            'Une fête de naissance',
          ],
          correctIndex: 0,
          explanation:
            "Le « Dina » est un accord ou pacte traditionnel juré par les membres d'une communauté pour régir la sécurité et l'harmonie.",
        },
        {
          type: 'quiz',
          question:
            'Comment se prononce la lettre « J » en langue malgache (ex: Haja) ?',
          questionMg:
            "Ahoana no fanononana ny litera « J » amin'ny teny malagasy ?",
          choices: [
            'Comme le son « dz » (ex: ha-dza)',
            'Comme le « j » doux français de « jardin »',
            'Comme un « ch » soufflé',
            'Comme un « g » dur de « gare »',
          ],
          correctIndex: 0,
          explanation:
            'En malgache, le « J » correspond systématiquement au son affriqué « dz ».',
        },
        {
          type: 'quiz',
          question:
            "Quelle institution traditionnelle représente l'assemblée des villageois délibérant ensemble ?",
          questionMg:
            "Inona no rafitra nentin-drazana ivorian'ny vahoaka rehetra handray fanapahan-kevitra ?",
          choices: ['Ny Fokonolona', 'Ny Kabary', 'Ny Lova', 'Ny Tsena'],
          correctIndex: 0,
          explanation:
            "Le « Fokonolona » est l'assemblée villageoise communautaire, base de la démocratie directe malgache.",
        },
        {
          type: 'quiz',
          question:
            "Quel célèbre proverbe illustre la force de l'union fraternelle ?",
          questionMg:
            "Inona no ohabolana mampiseho fa herin'ny vahoaka ny firaisana ?",
          choices: [
            '« Ny firaisankina no hery » (L’union fait la force)',
            '« Ny vola no hery »',
            '« Ny feo no hery »',
            '« Ny hazo no hery »',
          ],
          correctIndex: 0,
          explanation:
            "« Ny firaisankina no hery » est l'adage fondamental proclamant que la solidarité collective dépasse toutes les forces individuelles.",
        },
        {
          type: 'quiz',
          question: 'Que signifie le terme fondamental « Haja » ?',
          questionMg: "Inona no dikan'ny teny fototra hoe « Haja » ?",
          choices: [
            'Le respect, la dignité et la déférence',
            'La richesse financière',
            'La force physique au combat',
            'La ruse politique',
          ],
          correctIndex: 0,
          explanation:
            '« Haja » est le respect et la déférence sacrée accordée à chaque être humain et aux traditions.',
        },
      ],
    },
    {
      slug: 'le-tsiny-et-le-tody-boussole-morale',
      title:
        'Le Tsiny et le Tody : blâme cosmique et justice immanente (Ny Tsiny sy ny Tody)',
      titleMg: 'Ny Tsiny sy ny Tody : Lalàm-panahy sy Fitsaran-tena',
      summary:
        'Comprenez la crainte du Tsiny (le blâme moral) et la certitude du Tody (la loi cosmique du retour des actes).',
      summaryMg:
        "Iantohan'ny tahotra ny Tsiny sy ny fahalalana ny Tody ny fahitsiana sy ny fahamendrehana Malagasy.",
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la philosophie malgache, deux forces invisibles mais omniprésentes régulent la conscience : le « Tsiny » (le reproche ou blâme moral invisible qu'on s'attire par une maladresse) et le « Tody » (la loi inéluctable du retour, où chaque acte semé finit par revenir à son auteur).",
          textMg:
            "Ao amin'ny fisainan'ny Ntaolo, ny « Tsiny » sy ny « Tody » no mitantana ny fiasan'ny feon'ny fieritreretana : tahotra sao mahazo tsiny, sy fahalalana fa izay afafy ihany no jinjaina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TS',
          phonetic: 'ts',
          frenchEquivalent:
            'Le digraphe « TS » (ex: Tsiny) se prononce d’un seul bloc énergique et sifflant comme dans « tsar » ou « tsunami ».',
          sampleWordMg: 'Tsiny',
          sampleTranslationFr:
            'Le blâme / Le reproche moral / La faute d’étiquette',
        },
        {
          type: 'concept',
          termMg: 'Tsiny',
          phonetic: 'tsi-ni',
          meaningFr: 'Blâme cosmique, reproche moral intérieur',
          explanation:
            'Force invisible engendrée par un faux pas social, une arrogance ou un manque de tact envers autrui.',
        },
        {
          type: 'concept',
          termMg: 'Tody',
          phonetic: 'tou-di',
          meaningFr: 'La loi du retour des actes, justice immanente',
          explanation:
            'Principe universel : le bien comme le mal posé finit inévitablement par atteindre son auteur ou sa lignée.',
        },
        {
          type: 'concept',
          termMg: 'Miala tsiny',
          phonetic: 'mi-a-la tsi-ni',
          meaningFr: 'Demander pardon, écarter préventivement le blâme',
          explanation:
            'L’art oratoire suprême de débuter chaque prise de parole en reconnaissant humblement son imperfection devant l’auditoire.',
        },
        {
          type: 'concept',
          termMg: 'Fahamarinana',
          phonetic: 'fa-ha-ma-ri-na-na',
          meaningFr: 'La droiture, la justice, la vérité authentique',
          explanation:
            'Agir avec pureté d’intention pour être à l’abri du Tsiny et attirer le Tody favorable.',
        },
        {
          type: 'example',
          textMg:
            'Miala tsiny tompoko raha misy ny teny tafahoatra na tsy voalaza am-pahendrena.',
          textFr:
            'Je m’excuse humblement s’il y a eu un mot de trop ou une parole maladroite dans mon propos.',
        },
        {
          type: 'example',
          textMg: 'Aza manao ratsy olona fandrao tratry ny tody.',
          textFr:
            'Ne faites pas de tort à autrui de peur que la loi du retour ne vous frappe.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le philosophe malgache Richard Andriamanjato a défini le Tsiny comme « l'ombre portée de nos actes imparfaits ». Dans tout discours de Kabary, un long prologue appelé « Fanalana tsiny » est obligatoirement dédié à supplier les anciens et l'assemblée d'effacer d'avance toute maladresse oratoire.",
          textMg:
            "Ao amin'ny Kabary malagasy, tsy maintsy misy ny « Fanalana tsiny » : fombafomba kanto sy lalina angatahan'ny mpikabary famelan-keloka mialoha sao misy diso teny.",
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            'Que représente le concept de « Tody » dans la philosophie malgache ?',
          questionMg:
            "Inona no hevitry ny hoe « Tody » eo amin'ny finoana nentin-drazana ?",
          choices: [
            'La loi du retour inéluctable : chaque acte commis revient vers son auteur',
            'Un plat traditionnel de poisson séché',
            'Le chapeau de paille porté par les hommes',
            'La saison des pluies dans l’Est',
          ],
          correctIndex: 0,
          explanation:
            "Le « Tody » est la conviction absolue que nos actions bonnes ou mauvaises reviennent immanquablement vers nous (l'équivalent malgache de la justice immanente).",
        },
        {
          type: 'quiz',
          question:
            "Que signifie littéralement l'expression de politesse « Miala tsiny » ?",
          questionMg:
            "Inona no dikan'ny teny hoe « Miala tsiny » ara-bakiteny ?",
          choices: [
            'Écarter / ôter le blâme (s’excuser avec déférence)',
            'Partir en voyage loin du village',
            'Changer d’avis sur un sujet',
            'Donner une récompense financière',
          ],
          correctIndex: 0,
          explanation:
            "« Miala tsiny » signifie textuellement « faire partir le blâme », c'est la formule consacrée pour s'excuser et préserver l'harmonie.",
        },
        {
          type: 'quiz',
          question:
            'Quel proverbe célèbre résume la nature invisible et subtile du Tsiny ?',
          questionMg:
            "Inona no ohabolana mampitaha ny tsiny amin'ny zavaboary ?",
          choices: [
            '« Ny tsiny toy ny rivotra, tsy hita fa mahamay » (Le blâme est comme le vent, invisible mais brûlant)',
            '« Ny tsiny toy ny vato »',
            '« Ny tsiny toy ny volamena »',
            '« Ny tsiny toy ny hazo avo »',
          ],
          correctIndex: 0,
          explanation:
            "« Ny tsiny toy ny rivotra, tsy hita fa mahamay » illustre que même invisible à l'œil, le blâme moral blesse profondément le cœur et l'âme.",
        },
        {
          type: 'quiz',
          question:
            "Dans le discours traditionnel du Kabary, comment appelle-t-on le passage où l'orateur s'excuse préventivement ?",
          questionMg:
            "Inona no anaran'ilay dingana fialan-tsiny mialoha ataon'ny mpikabary ?",
          choices: [
            'Ny Fanalana tsiny',
            'Ny Fisaorana',
            'Ny Tsodrano',
            'Ny Veloma',
          ],
          correctIndex: 0,
          explanation:
            "Le « Fanalana tsiny » est l'étape rituelle d'humilité où l'orateur désamorce toute rancœur ou maladresse verbale.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les anciens disent-ils « Ny tody tsy miady fa ny atao no miverina » ?',
          questionMg:
            'Nahoana no lazaina fa « Ny tody tsy miady fa ny atao no miverina » ?',
          choices: [
            'Parce que la justice du destin n’a pas besoin d’arme : ce sont nos propres actes qui nous reviennent',
            'Parce qu’il faut toujours se battre en duel',
            'Parce que le temps efface tout sans trace',
            'Parce que les ennemis finissent par fuir',
          ],
          correctIndex: 0,
          explanation:
            "Ce proverbe souligne que le Tody n'a nul besoin de violence : la conséquence naturelle de nos actes se charge elle-même du dénouement.",
        },
      ],
    },
    {
      slug: 'le-valin-tanana-et-le-fampihavanana',
      title:
        'Le Valin-tanana et le Fampihavanana : entraide paysanne et réconciliation (Ny Valin-tanana)',
      titleMg:
        'Ny Valin-tanana sy ny Fampihavanana : Fifanampiana sy Fihavanana Vaovao',
      summary:
        "Explorez la puissance de l'entraide gratuite sans argent et les rituels de paix pour éteindre les conflits.",
      summaryMg:
        "Diniho ny herin'ny fifanampiana maimaim-poana eo an-tanimbary sy ny fahendrena mamadika ny fifandrafiana ho fihavanana.",
      type: 'TRADITION',
      orderIndex: 6,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, la survie des rizières et la solidité des villages reposent sur le « Valin-tanana » (littéralement « le retour de main ») : un réseau d'entraide solidaire où l'on travaille gratuitement pour son voisin en sachant qu'il viendra travailler pour nous demain. Et lorsque survient une discorde, le « Fampihavanana » rétablit la paix sans rancune.",
          textMg:
            "Ny fambolena sy ny fiarahamonina malagasy dia mifototra amin'ny « Valin-tanana » : asa iombonana tsy andoavam-bola. Ary rehefa misy disadisa dia ny « Fampihavanana » tarihin'ny Raiamandreny no mamerina ny firindrana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DR',
          phonetic: 'dzr',
          frenchEquivalent:
            'Le digraphe « DR » (ex: Fampihavanana, Andriana, Draka) se prononce avec une légère friction sonore « dz-r » vigoureuse.',
          sampleWordMg: 'Andriana',
          sampleTranslationFr: 'Noble / Souverain / Respectable',
        },
        {
          type: 'concept',
          termMg: 'Valin-tanana',
          phonetic: 'va-lin ta-na-na',
          meaningFr: 'Entraide réciproque par le travail solidaire',
          explanation:
            'Pratique séculaire où l’argent est absent : on échange du temps et des bras pour les labours, le repiquage ou la moisson.',
        },
        {
          type: 'concept',
          termMg: 'Fampihavanana',
          phonetic: 'fam-pi-ha-va-na-na',
          meaningFr: 'Réconciliation, rétablissement de la concorde',
          explanation:
            'Processus de médiation mené par les Raiamandreny pour guérir les blessures relationnelles et réconcilier les parties.',
        },
        {
          type: 'concept',
          termMg: 'Raiamandreny',
          phonetic: 'rye-man-dre-ni',
          meaningFr: 'Parents, aînés, sages respectés de la communauté',
          explanation:
            'Autorités morales et spirituelles dont la parole bienveillante apaise les conflits et éclaire les décisions.',
        },
        {
          type: 'concept',
          termMg: 'Asa vadi-drano',
          phonetic: 'a-sa va-di-dra-nou',
          meaningFr: 'Travaux de repiquage collectif dans les rizières',
          explanation:
            'La grande fête du travail paysan où femmes et hommes se rassemblent en chants pour ensemencer les rizières du village.',
        },
        {
          type: 'example',
          textMg:
            'Nanao valin-tanana tamin’ny vadi-bainga izahay omaly ka vita haingana ny asa.',
          textFr:
            'Nous avons fait du Valin-tanana pour retourner la terre hier, ainsi le travail a été achevé promptement.',
        },
        {
          type: 'example',
          textMg:
            'Nampihavana ny mpirahalahy niady ny Raiamandreny teo an-tanàna.',
          textFr:
            'Les aînés du village ont réconcilié avec sagesse les deux frères en conflit.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans la tradition du Fampihavanana, la réconciliation ne s'achève jamais par la désignation d'un perdant humilié. Au contraire, les deux parties partagent un repas symbolique (souvent un poulet ou du zébu avec du riz) et prononcent le pardon mutuel pour que le Fihavanana renaisse plus fort.",
          textMg:
            'Rehefa vita ny Fampihavanana malagasy, tsy misy resy na mpandresy manambany : miara-mihinana sy mifamela heloka ny roa tonta mba tsy hisy lolompo tavela ao am-po.',
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            'Que signifie littéralement la formule solidaire « Valin-tanana » ?',
          questionMg:
            "Inona no dikan'ny teny hoe « Valin-tanana » ara-bakiteny ?",
          choices: [
            'Le retour de la main (l’échange de travail solidaire sans argent)',
            'Une poignée de main rapide',
            'Un bracelet traditionnel en argent',
            'Un coup de poing de défi',
          ],
          correctIndex: 0,
          explanation:
            "« Valin-tanana » signifie littéralement « retour de main » : l'assistance mutuelle bénévole entre voisins pour les travaux pénibles.",
        },
        {
          type: 'quiz',
          question:
            "Quel rôle jouent les « Raiamandreny » lors d'une dispute dans le village ?",
          questionMg:
            'Inona no andraikitry ny Raiamandreny rehefa misy fifanolanana eo an-tanàna ?',
          choices: [
            'Médiateurs sages qui réconcilient les parties par le Fampihavanana',
            'Gardiens de prison qui enferment les coupables',
            'Collecteurs d’impôts qui prennent l’argent des familles',
            'Spectateurs qui ne s’expriment jamais',
          ],
          correctIndex: 0,
          explanation:
            'Les Raiamandreny (sages et aînés) interviennent avec déférence pour écouter, conseiller et réconcilier durablement les esprits.',
        },
        {
          type: 'quiz',
          question:
            'Comment se termine traditionnellement un rituel de Fampihavanana réussi ?',
          questionMg:
            'Ahoana no famaranana ny fampihavanana vita soa aman-tsara ?',
          choices: [
            'Par un repas fraternel partagé et le pardon mutuel scellé',
            'Par l’expulsion de l’une des familles hors du village',
            'Par un duel public d’arts martiaux',
            'Par le paiement d’une lourde amende en or',
          ],
          correctIndex: 0,
          explanation:
            "La vraie réconciliation malgache se scelle autour d'un repas de fête partagé, effaçant toute trace de rancune.",
        },
        {
          type: 'quiz',
          question:
            "Que désigne l'expression « Asa vadi-drano » chez les paysans malgaches ?",
          questionMg:
            "Inona no atao hoe « Asa vadi-drano » eo amin'ny tantsaha ?",
          choices: [
            'Le travail collectif solidaire de repiquage du riz dans l’eau des rizières',
            'La pêche nocturne en pirogue',
            'La traversée d’un fleuve en crue',
            'La lessive collective au bord de la rivière',
          ],
          correctIndex: 0,
          explanation:
            "L'« Asa vadi-drano » désigne les grands travaux agricoles collectifs d'inondation et de repiquage du riz où tout le village s'entraide.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le Valin-tanana est-il considéré comme supérieur au salariat dans les rizières traditionnelles ?',
          questionMg:
            "Nahoana no sarobidy lavitra noho ny karama ny Valin-tanana amin'ny fambolena ?",
          choices: [
            'Parce qu’il resserre le lien humain et l’amitié fraternelle au lieu de diviser par l’argent',
            'Parce que cela ne coûte absolument rien en riz',
            'Parce qu’on peut obliger les voisins par la force',
            'Parce que le gouvernement l’interdit',
          ],
          correctIndex: 0,
          explanation:
            "Le Valin-tanana repose sur le cœur, l'honneur et l'amitié, fortifiant le tissu social au-delà des considérations financières.",
        },
      ],
    },
    {
      slug: 'le-ziva-alliance-et-plaisanterie-sacree',
      title:
        "Le Ziva : l'alliance sacrée et le devoir d'humour pacificateur (Ny Ziva sy ny Fihavanana)",
      titleMg: 'Ny Ziva : Fifamatorana Masina sy Firahalahiana Mandrakizay',
      summary:
        "Plongez dans l'un des rituels les plus originaux de Madagascar : le Ziva, alliance d'immunité et de fraternité indéfectible.",
      summaryMg:
        "Fantaro ny fomban'ny Ziva, fanekena masina mandrara ny ady sy mampiasa ny fihomehezana ho fitaovam-pihavanana.",
      type: 'TRADITION',
      orderIndex: 7,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le « Ziva » (ou « Fatidra » d'alliance) est une institution sociale unique au monde : un pacte séculaire conclu entre deux ethnies, clans ou familles, interdisant formellement et pour toujours toute guerre ou animosité entre leurs descendants. Entre alliés de Ziva, la dispute est taboue, et la dérision joyeuse est un devoir pour désamorcer les tensions.",
          textMg:
            "Ny « Ziva » dia fomba nentin-drazana miavaka tokoa : fifanekena masina teo amin'ny foko na fianakaviana roa, mandrara tanteraka ny fifandrafiana mandrakizay. Afaka mifanaraby am-pitiavana ny mpiziva mba hampihomehy sy handravona ny olana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'Z',
          phonetic: 'z',
          frenchEquivalent:
            'Le « Z » malgache est doux et voisé, vibrant comme dans « zèbre » ou « horizon » (ex: Ziva, Zanaka, Zoky).',
          sampleWordMg: 'Ziva',
          sampleTranslationFr:
            'Allié de parenté à plaisanterie / Pacte fraternel sacré',
        },
        {
          type: 'concept',
          termMg: 'Ziva',
          phonetic: 'zi-va',
          meaningFr: 'Pacte d’alliance sacrée et parenté à plaisanterie',
          explanation:
            'Statut liant deux groupes où toute effusion de sang ou querelle sérieuse est un sacrilège absolu (Fady).',
        },
        {
          type: 'concept',
          termMg: 'Lova tsy mifamono',
          phonetic: 'lou-va tsi mi-fa-mou-nou',
          meaningFr: 'Héritage sacré d’immunité mutuelle',
          explanation:
            'Expression solennelle rappelant qu’entre alliés de sang ou de ziva, le meurtre et la trahison sont impossibles.',
        },
        {
          type: 'concept',
          termMg: 'Fihavanana am-pilalaovana',
          phonetic: 'fi-ha-va-na-na am-pi-la-low-va-na',
          meaningFr: 'Fraternité joviale par le jeu et l’humour',
          explanation:
            'Le droit sacré pour deux alliés de Ziva de se taquiner et de plaisanter ouvertement sans que nul ne puisse s’en offusquer.',
        },
        {
          type: 'concept',
          termMg: 'Fatidra',
          phonetic: 'fa-ti-dra',
          meaningFr: 'Serment du sang, pacte d’adoption fraternelle',
          explanation:
            'Rituel où deux personnes ou clans scellent leur union par une goutte de sang partagée, devenant frères pour l’éternité.',
        },
        {
          type: 'example',
          textMg:
            'Mpi-ziva izahay sy ry zareo ka tsy misy fahatezerana mahazo mitoetra eo aminay.',
          textFr:
            'Nous sommes liés par le Ziva avec eux, ainsi aucune rancœur ni animosité ne peut subsister entre nous.',
        },
        {
          type: 'example',
          textMg:
            'Ny fihomehezan’ny mpi-ziva dia mandevona ny disadisa rehetra.',
          textFr:
            'L’humour bienveillant entre alliés de Ziva dissout instantanément tous les malentendus.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Lors des funérailles traditionnelles, c'est souvent l'allié de Ziva qui a le privilège de monter sur le tombeau pour raconter des anecdotes joyeuses, faire sourire les endeuillés et les aider à traverser la douleur par la chaleur du rire.",
          textMg:
            'Mandritra ny fandevenana, ny mpi-ziva dia afaka mananihany sy mampihomehy ny mpisaona eo am-pasan-drazana mba hanamaivanana ny alahelo sy hampahery ny fianakaviana.',
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la règle suprême entre deux clans ou personnes liés par le « Ziva » ?',
          questionMg:
            "Inona no fitsipika masina tsy azo dikaina eo amin'ny mpi-ziva ?",
          choices: [
            'Toute querelle, guerre ou violence est strictement interdite pour l’éternité',
            'Ils doivent obligatoirement habiter dans la même maison',
            'Ils n’ont pas le droit de se parler en public',
            'Ils doivent donner tous leurs biens au roi',
          ],
          correctIndex: 0,
          explanation:
            'Le Ziva est une alliance sacrée de paix absolue : toute haine ou effusion de sang entre alliés est un interdit suprême (Fady).',
        },
        {
          type: 'quiz',
          question:
            "Quel rôle bienveillant l'humour et la plaisanterie jouent-ils entre alliés de Ziva ?",
          questionMg:
            "Inona no antony ampiasan'ny mpi-ziva ny sangisangy sy ny fihomehezana ?",
          choices: [
            'Désamorcer les tensions et maintenir la fraternité sans orgueil ni rancœur',
            'Humilier les pauvres devant le village',
            'Se moquer méchamment des ancêtres',
            'Gagner de l’argent lors des foires',
          ],
          correctIndex: 0,
          explanation:
            "L'humour sacré du Ziva permet d'aborder les sujets délicats avec légèreté, neutralisant toute tentation d'orgueil ou de conflit.",
        },
        {
          type: 'quiz',
          question: "Que désigne l'expression « Lova tsy mifamono » ?",
          questionMg: 'Inona no hevitry ny hoe « Lova tsy mifamono » ?',
          choices: [
            'L’héritage ancestral sacré qui interdit de s’entretuer entre frères et alliés',
            'Un testament écrit sur une feuille de papier',
            'Un troupeau de zébus légué au premier né',
            'Une maison en bois qu’on ne démolit jamais',
          ],
          correctIndex: 0,
          explanation:
            "« Lova tsy mifamono » est le pacte éternel d'inviolabilité de la vie humaine entre deux groupes unis par la tradition.",
        },
        {
          type: 'quiz',
          question:
            "Lors des funérailles traditionnelles, quelle mission spéciale revient souvent à l'allié de Ziva ?",
          questionMg:
            "Inona no ataon'ny mpi-ziva mandritra ny fisaonana sy ny fandevenana ?",
          choices: [
            'Apporter la consolation par le réconfort chaleureux et dédramatiser la douleur par des paroles vivifiantes',
            'Pleurer plus fort que tout le monde pendant sept jours',
            'Creuser la tombe tout seul sans aide',
            'Fermer les portes du village aux étrangers',
          ],
          correctIndex: 0,
          explanation:
            "L'allié de Ziva a le rôle libérateur d'aider la famille en deuil à surmonter l'accablement en insufflant l'espoir et la vie.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le rituel traditionnel du serment scellé par le sang créant une fraternité éternelle ?',
          questionMg:
            "Inona no anaran'ny fianianana masina ifamatorana ho mpirahalahy mandrakizay ?",
          choices: [
            'Ny Fatidra',
            'Ny Famadihana',
            'Ny Fitampoha',
            'Ny Tsaboraha',
          ],
          correctIndex: 0,
          explanation:
            "Le « Fatidra » (serment du sang) est l'alliance suprême d'adoption mutuelle qui transforme deux étrangers en frères de sang inviolables.",
        },
      ],
    },
    // ─── LEÇON 8 : L'ART DU SILENCE ET DE LA PAROLE MESURÉE ───
    {
      slug: 'l-art-du-silence-et-parole-mesuree',
      title:
        'L’art du silence et de la parole mesurée : Ny fahanginana volamena',
      titleMg:
        'Ny Fahanginana sy ny Teny voalanjalanja : Fahendrena amin’ny fitenenana',
      summary:
        "Découvrez la puissance du silence et de la retenue verbale dans la sagesse malgache : savoir écouter l'assemblée avant de parler avec gravité.",
      summaryMg:
        "Fantaro ny herin'ny fahanginana sy ny lanjan'ny teny : fahaizana mihaino alohan'ny hiteny eo anatrehan'ny fokonolona.",
      type: 'VOCABULARY',
      orderIndex: 8,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Pour les Malgaches, la parole n'est pas un souffle anodin : elle est créatrice de liens ou destructrice d'harmonie. Les anciens enseignaient que 'Celui qui sait se taire est celui qui sait parler' (Izay mahay mangina no mahay miteny). Dans les assemblées villageoises (Fokonolona), la parole hâtive est signe d'immaturité, tandis que le silence attentif prépare la formule juste qui rassemble et apaise les cœurs.",
          textMg:
            "Amin'ny Ntaolo, zava-masina ny teny ka tsy azo atao maimaika. 'Izay mahay mangina no mahay miteny' : ny fahanginana no manomana ny teny marina mampitony sy mampiray ny fokonolona.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / HA / NGI / NA / NA',
          phonetic: 'fa-han-gi-na-na',
          frenchEquivalent:
            "Le mot « Fahanginana » (silence recueilli) s'articule doucement avec un 'H' légèrement expiré et un son 'NGI' nasal fluide.",
          sampleWordMg: 'Fahanginana',
          sampleTranslationFr: 'Le silence / La paix intérieure',
        },
        {
          type: 'concept',
          termMg:
            'Ny teny toy ny atody, ka raha latsaka tsy azo raofina intsony',
          phonetic:
            'ni te-ni toui ni a-tou-di, ka ra-ha la-tsa-ka tsi a-zou ra-ou-fi-na in-tsou-ni',
          meaningFr:
            'La parole est comme un œuf : tombée par terre, on ne peut plus la ramasser',
          explanation:
            'Proverbe immortel rappelant le caractère irréversible de la parole prononcée : une parole blessante brise la confiance à jamais.',
        },
        {
          type: 'concept',
          termMg: 'Ny fahanginana volamena',
          phonetic: 'ni fa-han-gi-na-na vou-la-me-na',
          meaningFr: 'Le silence d’or et la réserve bienveillante',
          explanation:
            "Savoir retenir sa colère, écouter l'avis des aînés et ne pas répondre aux provocations pour préserver le Fihavanana.",
        },
        {
          type: 'concept',
          termMg: 'Teny zato, kabary arivo : iray ihany no fotony',
          phonetic:
            'te-ni za-tou, ka-ba-ri a-ri-vou : i-rai i-ha-ni nou fou-tou-ni',
          meaningFr:
            'Cent mots, mille discours : une seule vérité en est la racine',
          explanation:
            "Éloge de la concision et de la droiture morale : l'éloquence véritable ne réside pas dans le bavardage interminable mais dans la vérité du cœur.",
        },
        {
          type: 'example',
          textMg:
            'Rehefa misy ady hevitra dia aleo mihaino tsara aloha vao miteny, mba ho teny mampihavana no hivoaka ny vava.',
          textFr:
            "Lorsqu'un désaccord survient, il est plus sage d'écouter attentivement avant de s'exprimer, afin que la parole qui sorte de la bouche soit réconciliatrice.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les délibérations traditionnelles du Fokonolona, les jeunes écoutent en silence les anciens pendant des heures sans interrompre. Ce n'est qu'après l'intervention des sages qu'ils sont invités avec bienveillance à apporter leur vision neuve.",
          textMg:
            "Amin'ny fivorian'ny fokonolona, mihaino am-panajana ny tenin'ny zokiolona ny tanora alohan'ny handraisana anjara am-pahendrena.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'À quoi le proverbe malgache compare-t-il la parole imprudente qu’on ne peut plus rattraper ?',
          questionMg:
            'Amin’inona no ampitahan’ny ohabolana ny teny efa naloaky ny vava ?',
          choices: [
            'À un œuf tombé par terre qu’on ne peut plus ramasser (toy ny atody latsaka)',
            'À une flèche tirée dans le ciel',
            'À une pierre jetée dans la rizière',
            'À un oiseau qui s’envole',
          ],
          correctIndex: 0,
          explanation:
            "« Ny teny toy ny atody » : une fois lâchée, la parole blessante casse le lien de confiance comme une coquille d'œuf brisée.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie la maxime « Izay mahay mangina no mahay miteny » ?',
          questionMg:
            'Inona no hevitry ny hoe « Izay mahay mangina no mahay miteny » ?',
          choices: [
            'Celui qui sait écouter avec discernement est celui qui parlera avec le plus de justesse',
            'Il est interdit de parler pour toujours',
            'Seuls les sourds ont de la sagesse',
            'Parler beaucoup est toujours une bonne chose',
          ],
          correctIndex: 0,
          explanation:
            "La maîtrise de la parole commence par la maîtrise de l'écoute silencieuse et du recueillement intérieur.",
        },
        {
          type: 'quiz',
          question:
            'Quelle attitude doit adopter un participant lors d’une assemblée villageoise (Fokonolona) ?',
          questionMg:
            'Inona no fihetsika mendrika eo anivon’ny fivorian’ny Fokonolona ?',
          choices: [
            'Écouter attentivement sans couper la parole aux autres et peser ses mots avec respect',
            'Crier plus fort que tout le monde',
            'Interrompre le doyen du village',
            'Partir avant la conclusion',
          ],
          correctIndex: 0,
          explanation:
            "L'étiquette du Fokonolona repose sur la bienséance, le respect du tour de parole et l'écoute scrupuleuse des arguments de chacun.",
        },
        {
          type: 'quiz',
          question:
            'Que préconise la sagesse populaire lorsqu’on ressent une vive colère passagère ?',
          questionMg:
            'Inona no torohevitry ny fahendrena malagasy rehefa tezitra mafy ?',
          choices: [
            'Garder le silence et respirer calmement avant de répondre afin d’éviter les regrets irréparables',
            'Insulter son voisin immédiatement',
            'Casser les meubles de la maison',
            'Prendre les armes',
          ],
          correctIndex: 0,
          explanation:
            '« Ny hatezerana toy ny rivotra mandalo » : retenir sa langue sous la colère protège du remords éternel.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie « Teny zato, kabary arivo : iray ihany no fotony » ?',
          questionMg:
            'Inona ny hevitry ny hoe « Teny zato, kabary arivo : iray ihany no fotony » ?',
          choices: [
            'Toutes les longues paroles doivent finalement converger vers une seule vérité essentielle : l’harmonie',
            'Il faut parler mille fois par jour',
            'Les discours sont inutiles',
            'Seul le roi a le droit de parler',
          ],
          correctIndex: 0,
          explanation:
            'La multiplicité des arguments ne doit jamais perdre de vue le but suprême : la vérité qui réunit les hommes dans la paix.',
        },
      ],
    },
    // ─── LEÇON 9 : L'HOSPITALITÉ SACRÉE (FANDRAISAM-BAHINY) ───
    {
      slug: 'l-hospitalite-sacree-fandraisam-bahiny',
      title: 'L’hospitalité sacrée envers l’étranger : Ny Fandraisam-bahiny',
      titleMg:
        'Ny Fandraisam-bahiny sy ny Hasin’ny Mpandalo : Fon’ny Fihavanana',
      summary:
        "Explorez la noblesse de l'hospitalité malgache : pourquoi l'étranger de passage est accueilli comme un envoyé sacré de Zanahary.",
      summaryMg:
        "Diniho ny hatsaran'ny fandraisam-bahiny malagasy : fandraisana am-pitiavana ny vahiny toy ny irak'Andriamanitra.",
      type: 'CULTURE',
      orderIndex: 9,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, l'étranger (vahiny) ou le voyageur de passage n'est jamais vu comme une menace mais comme une bénédiction divine. La tradition du 'Lapa-mivoha' (le palais aux portes ouvertes) stipule que quiconque frappe à la porte à la tombée de la nuit doit recevoir de l'eau claire pour se désaltérer, une natte propre pour reposer ses membres et une part du riz familial, sans demander son nom ni son origine.",
          textMg:
            "Tsy mba raisina ho fahavalo ny vahiny na ny mpandalo amin'ny kolontsaina malagasy, fa heverina ho fitahiana. Ny fomba lapa-mivoha dia mampianatra hanome rano madio, tsihy madio hipetrahana ary anjara vary mafana ho an'izay mandalo.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VA / HI / NY',
          phonetic: 'va-hi-ni',
          frenchEquivalent:
            "Le mot « Vahiny » (étranger / invité bienvenu) se prononce avec un 'H' très doux et fluide.",
          sampleWordMg: 'Vahiny',
          sampleTranslationFr: 'L’hôte / L’étranger bienvenu',
        },
        {
          type: 'concept',
          termMg: 'Tsy misy vahiny eto an-tany fa samy mpandalo',
          phonetic: 'tsi mi-si va-hi-ni e-tou an-ta-ni fa sa-mi mpan-da-lou',
          meaningFr:
            'Nul n’est étranger sur cette terre, nous ne sommes tous que de passage',
          explanation:
            "Philosophie universelle d'humilité : la terre appartient à Dieu et aux ancêtres, tous les humains sont des frères en pèlerinage éphémère.",
        },
        {
          type: 'concept',
          termMg: 'Mamelatra tsihy madio sy manome rano mangatsiaka',
          phonetic:
            'ma-me-la-tra tsi-hi ma-di-ou si ma-nou-me ra-nou man-ga-tsi-a-ka',
          meaningFr:
            'Dérouler une natte propre et offrir de l’eau fraîche de source',
          explanation:
            'Gestes rituels obligatoires marquant le respect et le soin immédiat prodigué au voyageur fatigué avant toute conversation.',
        },
        {
          type: 'concept',
          termMg: 'Ny vary iray lovia, ifampizarana amin’ny fihavanana',
          phonetic:
            'ni va-ri i-rai lou-vi-a, i-fam-pi-za-ra-na a-min-ni fi-ha-va-na-na',
          meaningFr: 'Le plat de riz unique partagé dans la fraternité',
          explanation:
            "Même si le foyer est pauvre, on divise la ration du soir pour nourrir l'invité : la générosité surpasse l'abondance matérielle.",
        },
        {
          type: 'example',
          textMg:
            'Mandrosoa tompoko, mamelara tsihy ary sotroy ity rano madio ity : ny trano kely fa ny fo madio feno fitiavana.',
          textFr:
            'Entrez chez nous, prenez place sur la natte et buvez cette eau fraîche : notre demeure est humble mais nos cœurs vous sont grand ouverts.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les voyageurs européens qui traversèrent Madagascar au XIXe siècle (comme Alfred Grandidier) témoignèrent avec émotion qu'ils avaient pu traverser l'île d'un océan à l'autre sans emporter d'argent, logés et nourris gracieusement dans chaque village au nom du Fihavanana.",
          textMg:
            "Gaga ireo mpikaroka vahiny tamin'ny taonjato faha-19 fa afaka nandeha eran'i Madagasikara tsy nandoa vola satria nampiantranoan'ny vahoaka maimaimpoana tamin'ny fandraisam-bahiny.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que proclame la maxime humaniste malgache « Tsy misy vahiny eto an-tany fa samy mpandalo » ?',
          questionMg:
            'Inona no hevitry ny ohabolana hoe « Tsy misy vahiny eto an-tany fa samy mpandalo » ?',
          choices: [
            'Tous les êtres humains sont frères et hôtes temporaires sur cette terre sacrée',
            'Chacun doit rester enfermé chez soi',
            'La terre n’appartient à personne',
            'Les étrangers doivent payer une taxe pour entrer',
          ],
          correctIndex: 0,
          explanation:
            "Ce proverbe universel abolit les barrières de nationalité ou d'origine : l'humanité entière partage la même condition de passage sur terre.",
        },
        {
          type: 'quiz',
          question:
            'Quels sont les premiers gestes rituels accomplis dès qu’un voyageur franchit le seuil d’une maison traditionnelle ?',
          questionMg:
            'Inona avy ireo fomba voalohany raisina rehefa misy mpandalo miditra ao an-trano ?',
          choices: [
            'Dérouler une natte propre pour l’inviter à s’asseoir et lui offrir de l’eau fraîche pour étancher sa soif',
            'Lui demander son passeport et fouiller son sac',
            'Lui faire payer son droit d’entrée',
            'Lui demander de réparer le toit',
          ],
          correctIndex: 0,
          explanation:
            "La natte propre (*tsihy*) et l'eau fraîche sont les symboles d'apaisement et d'accueil immédiat au sein du foyer.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne l’expression traditionnelle du « Lapa-mivoha » ?',
          questionMg: 'Inona no hevitry ny fomba atao hoe « Lapa-mivoha » ?',
          choices: [
            'La maison ou le village dont la porte reste toujours ouverte pour accueillir et secourir le prochain',
            'Une porte cassée par le vent',
            'Un marché sans surveillance',
            'Une fête réservée aux nobles',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Lapa-mivoha' désigne la politique de la porte ouverte et du cœur généreux qui fait la fierté des foyers malgaches.",
        },
        {
          type: 'quiz',
          question:
            'Comment un foyer malgache réagit-il si la nourriture est modeste lors de l’arrivée imprévue d’un visiteur ?',
          questionMg:
            'Ahoana no ataon’ny fianakaviana malagasy raha vitsy ny sakafo nefa misy vahiny tonga tampoka ?',
          choices: [
            'On partage immédiatement la part de riz disponible pour que chacun mange dignement',
            'On cache la marmite pour manger en secret',
            'On demande à l’invité de repartir',
            'On attend qu’il s’endorme pour manger',
          ],
          correctIndex: 0,
          explanation:
            '« Ny vary kely ifampizarana » : le Fihavanana commande de diviser son repas même frugal plutôt que de laisser un convive avoir faim.',
        },
        {
          type: 'quiz',
          question:
            'Quelle bénédiction l’hôte adresse-t-il traditionnellement au voyageur lorsqu’il reprend sa route au matin ?',
          questionMg:
            'Inona no tso-drano omena ny vahiny rehefa handeha hanohy ny diany maraina ?',
          choices: [
            '« Soa soa mandra-pihaona, ho tahina anie ny dianao » (Bonne route et que tes pas soient bénis)',
            '« Aza miverina intsony »',
            '« Mandoava vola »',
            '« Haingana fa tara ianao »',
          ],
          correctIndex: 0,
          explanation:
            'On accompagne le partant de prières bienveillantes pour que la route lui soit douce et sans danger.',
        },
      ],
    },
    // ─── LEÇON 10 : L'HUMILITÉ DANS LE SUCCÈS (FIETRENA) ───
    {
      slug: 'l-humilite-dans-le-succes-fahaiza-mietry',
      title:
        'L’humilité dans le succès : Ny fahaiza-mietry eo amin’ny fahombiazana',
      titleMg: 'Ny Fahamaotinana sy ny Fahaiza-mietry : Voninahitra marina',
      summary:
        "Comprenez la vertu suprême de la modestie (fietrena) : pourquoi l'arrogance et l'orgueil sont condamnés par la sagesse des ancêtres.",
      summaryMg:
        "Halalino ny hasin'ny fietrena : nahoana ny fieboeboana no fahotana lehibe manimba ny fihavanana sy mitondra faharavana.",
      type: 'VOCABULARY',
      orderIndex: 10,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la morale malgache, le succès matériel ou la gloire ne donne aucun droit d'écraser autrui. Au contraire, plus une personne s'élève, plus elle doit courber la tête avec humilité (fietrena). Les ancêtres ont forgé de magnifiques paraboles pour avertir les orgueilleux : « Aza manao vorom-potsy manidina, ka ny tenan'ny tena ihany no deraina » (Ne faites pas l'aigrette blanche en vol qui s'extasie sur son propre plumage). L'humilité est le bouclier protecteur contre la jalousie et la rupture du lien social.",
          textMg:
            "Ny voninahitra marina amin'ny Malagasy dia ny fahaiza-mietry. Rehefa mahomby dia vao mainka tokony hanetry tena : 'Aza manao vorom-potsy manidina ka ny tenan'ny tena ihany no deraina'. Ny fieboeboana mantsy dia miteraka fialonana sy faharavana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FIE / TRE / NA',
          phonetic: 'fi-e-tre-na',
          frenchEquivalent:
            "Le mot « Fietrena » (humilité / modestie profonde) dérive de 'midina / mietry' (s'abaisser par respect et décence).",
          sampleWordMg: 'Fietrena',
          sampleTranslationFr: 'L’humilité / La retenue modeste',
        },
        {
          type: 'concept',
          termMg: 'Ny vary be koba manondrika ny lohany',
          phonetic: 'ni va-ri be kou-ba ma-noun-dri-ka ni lou-ha-ni',
          meaningFr:
            'L’épi de riz lourd de grains mûrs s’incline humblement vers la terre',
          explanation:
            "Métaphore naturelle splendide : l'épi plein et fertile plie vers le sol par son poids de bienfaits, tandis que l'épi vide et stérile reste dressé avec arrogance.",
        },
        {
          type: 'concept',
          termMg: 'Aza manao vorom-potsy manidina',
          phonetic: 'a-za ma-na-ou vou-roum-pou-tsi ma-ni-di-na',
          meaningFr: 'Ne faites pas l’aigrette blanche qui s’admire en volant',
          explanation:
            "Mise en garde contre l'autocélébration vaniteuse : ce sont les autres qui doivent reconnaître votre valeur, jamais vous-même.",
        },
        {
          type: 'concept',
          termMg: 'Izay manetry tena ho asandratra',
          phonetic: 'i-zai ma-ne-tri te-na hou a-san-dra-tra',
          meaningFr:
            'Celui qui s’abaisse avec humilité sera élevé par la communauté',
          explanation:
            "Règle de vie commune : la société malgache élève spontanément au rang de notable respecté l'homme humble et serviable.",
        },
        {
          type: 'example',
          textMg:
            'Na manana harena na fahefana aza, ny fanajana ny madinika sy ny fitenenana am-pahatsorana no tena mampiseho olom-banona.',
          textFr:
            "Même parvenu à la fortune ou au pouvoir, c'est le respect des humbles et la parole simple qui révèlent un citoyen digne et accompli.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Lorsqu'un artisan ou un orateur malgache réalise un chef-d'œuvre, il ne dit jamais 'Regardez comme je suis doué', mais 'Ce n'est qu'une humble contribution, pardonnez mes imperfections' (Aza omena tsiny amin'ny kilema). Cette humilité cérémonielle préserve l'équilibre moral.",
          textMg:
            "Ny mpanao sokitra sy ny mpikabary malagasy rehefa mahavita asa kanto dia manetry tena foana milaza hoe : 'Tsy fahaizana manokana fa tso-dranon'ny zokiolona'.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'À quoi la sagesse malgache compare-t-elle l’homme véritablement sage et accompli qui reste humble ?',
          questionMg:
            'Amin’inona no ampitahan’ny ohabolana ny olona feno fahendrena mahay manetry tena ?',
          choices: [
            'À l’épi de riz plein de grains mûrs qui s’incline doucement vers la terre',
            'À un lion qui rugit dans la savane',
            'À un tambour qui fait du bruit',
            'À une montagne inaccessible',
          ],
          correctIndex: 0,
          explanation:
            "L'épi de riz bien mûr ploie sous le poids nourricier de ses graines : plus on possède de savoir et de vertu, plus on s'incline avec douceur.",
        },
        {
          type: 'quiz',
          question:
            'Que condamne le proverbe « Aza manao vorom-potsy manidina, ka ny tenan’ny tena ihany no deraina » ?',
          questionMg:
            'Inona no fahalemena melohin’ny ohabolana momba ny vorom-potsy ?',
          choices: [
            'L’autosatisfaction vaniteuse et le fait de chanter ses propres louanges en public',
            'Le fait d’apprendre à piloter un avion',
            'La couleur blanche des vêtements',
            'La protection des oiseaux sauvages',
          ],
          correctIndex: 0,
          explanation:
            "L'aigrette qui s'admire elle-même incarne l'orgueil ridicule de celui qui fait étalage de ses réussites devant les autres.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi l’arrogance (fieboeboana) est-elle particulièrement redoutée dans la société malgache ?',
          questionMg:
            'Nahoana no fady ary atahorana ny fieboeboana amin’ny fiarahamonina malagasy ?',
          choices: [
            'Parce qu’elle brise le Fihavanana, suscite la jalousie et attire le blâme moral (tsiny)',
            'Parce qu’elle coûte cher en argent',
            'Parce qu’elle fait perdre la voix',
            'Parce qu’elle empêche de dormir la nuit',
          ],
          correctIndex: 0,
          explanation:
            "L'arrogance détruit le tissu fraternel en créant des rancœurs et en brisant l'égalité bienveillante entre membres du clan.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie le terme fondamental « Fietrena » dans le vocabulaire moral malgache ?',
          questionMg:
            'Inona ny dikan’ny teny hoe « Fietrena » eo amin’ny fitsipi-pitondran-tena ?',
          choices: [
            'L’abaissement volontaire par modestie, déférence et respect envers son prochain',
            'La fatigue physique après le sport',
            'La colère rentrée',
            'Le voyage sans retour',
          ],
          correctIndex: 0,
          explanation:
            "« Fietrena » est la modestie consentie qui refuse de s'enorgueillir pour honorer la communauté.",
        },
        {
          type: 'quiz',
          question:
            'Comment un orateur ou un artiste accompli conclut-il traditionnellement sa prestation ?',
          questionMg:
            'Ahoana no famaranan’ny mpikabary na ny mpanakanto ny asany am-panajana ?',
          choices: [
            'En excusant humblement ses maladresses et en remerciant la bienveillance du public',
            'En exigeant des applaudissements obligatoires',
            'En déclarant qu’il est le meilleur de l’île',
            'En critiquant les artistes précédents',
          ],
          correctIndex: 0,
          explanation:
            "L'artiste malgache demande toujours pardon pour les éventuelles imperfections (« Azafady indrindra »), signe de haute distinction d'esprit.",
        },
      ],
    },
    // ─── LEÇON 11 : LA TRANSMISSION INTERGÉNÉRATIONNELLE ───
    {
      slug: 'la-transmission-intergenerationnelle-fitaizana',
      title:
        'La transmission intergénérationnelle : Ny Fitaizana sy ny Tso-drano',
      titleMg: 'Ny Fanabeazana iombonana sy ny Tso-dranon’ny Ray aman-dreny',
      summary:
        "Découvrez la conception éducative partagée de la communauté malgache : l'enfant élevé par tout le village et la bénédiction sacrée des aînés.",
      summaryMg:
        "Fantaro ny fanabeazana iombonana amin'ny fokonolona : ny zaza iombonan'ny rehetra ary ny herin'ny tso-drano mampahomby.",
      type: 'CULTURE',
      orderIndex: 11,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Chez les Malgaches, l'éducation d'un enfant n'est pas confinée à la cellule parentale étroite : elle est l'affaire sacrée de toute la communauté. Le dicton traditionnel rappelle : « Ny zaza tsy an'ny ray aman-dreny niteraka fotsiny fa an'ny fokonolona » (L'enfant n'appartient pas seulement à ceux qui l'ont enfanté, mais à tout le village). Tout adulte a le devoir bienveillant de corriger, guider et encourager un jeune, tandis que le respect du 'Tso-drano' (bénédiction des aînés) ouvre les chemins du futur.",
          textMg:
            "Tsy ny ray aman-dreny niteraka ihany no manabe ny zanaka fa ny fiarahamonina iray manontolo. Ny zaza dia harenan'ny fokonolona, ka ny tso-dranon'ny zokiolona no fanalahidy manokatra ny varavaran'ny fahombiazana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FI / TAI / ZA / NA',
          phonetic: 'fi-tai-za-na',
          frenchEquivalent:
            "Le mot « Fitaizana » dérive de 'mitaiza' (élever avec tendresse, nourrir l'âme et le corps).",
          sampleWordMg: 'Fitaizana',
          sampleTranslationFr: 'L’éducation bienveillante / L’élevage de l’âme',
        },
        {
          type: 'concept',
          termMg: 'Ny zaza haren’ny fokonolona',
          phonetic: 'ni za-za ha-ren-ni fou-kou-nou-lou-na',
          meaningFr:
            'L’enfant est le trésor et la responsabilité partagée du village',
          explanation:
            "Principe communautaire : chaque membre du village veille sur la sécurité et la bonne conduite des enfants comme s'ils étaient les siens.",
        },
        {
          type: 'concept',
          termMg: 'Tso-drano zava-mahery',
          phonetic: 'tsou-dra-nou za-va-ma-he-ri',
          meaningFr: 'La bénédiction des aînés est une force toute-puissante',
          explanation:
            "L'eau sacrée soufflée par les parents et grands-parents (tso-drano) protège des embûches et garantit la réussite dans les études et le travail.",
        },
        {
          type: 'concept',
          termMg: 'Tsy misy hendry teraka fa samy nitaizana',
          phonetic: 'tsi mi-si hen-dri te-ra-ka fa sa-mi ni-tai-za-na',
          meaningFr:
            'Nul ne naît sage, chacun le devient par l’éducation reçue',
          explanation:
            "Reconnaissance de la dette morale envers les éducateurs, maîtres et anciens qui ont façonné le caractère et la droiture de l'individu.",
        },
        {
          type: 'example',
          textMg:
            "Mandehana am-piadanana, mahazoa tso-drano ho lava andro iainana sy hahavita be ho an'ny tanindrazana.",
          textFr:
            'Pars en paix, reçois notre pleine bénédiction pour une longue vie féconde et pour accomplir de grandes choses pour notre patrie.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les villages des Hautes Terres et des côtes, si un enfant commet une incivilité dans la rue, n'importe quel passant âgé a le droit et le devoir de le réprimander calmement, et les parents remercieront chaleureusement ce passant pour avoir protégé l'honneur familial.",
          textMg:
            'Raha sendra manao hadalana eny an-dalana ny ankizy fahiny, dia afaka mananatra azy ny olon-dehibe rehetra, ary misaotra ny ray aman-dreniny noho izany fitaizana iombonana izany.',
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que proclame le principe éducatif malgache sur la responsabilité envers l’enfant ?',
          questionMg:
            'Inona no hevitry ny fahendrena malagasy momba ny fitaizana zaza ?',
          choices: [
            'L’enfant est la responsabilité bienveillante de tout le village et de la communauté élargie',
            'Seul le maire du village a le droit de parler aux enfants',
            'L’enfant ne doit jamais écouter personne',
            'L’éducation est interdite avant l’âge de 18 ans',
          ],
          correctIndex: 0,
          explanation:
            "L'enfant appartient moralement à toute la communauté (*fokonolona*) qui l'entoure d'affection et de repères éthiques.",
        },
        {
          type: 'quiz',
          question:
            'Quelle valeur spirituelle accorde-t-on au « Tso-drano » donné par les parents lors d’un départ ou d’un projet ?',
          questionMg:
            'Inona no lanjan’ny « Tso-drano » omen’ny ray aman-dreny eo amin’ny fiainana ?',
          choices: [
            'Une bénédiction sacrée protectrice indispensable qui ouvre la voie de la réussite et du bonheur',
            'Un simple geste d’adieu sans importance',
            'Une obligation légale avec signature de contrat',
            'Un jeu d’enfants amusant',
          ],
          correctIndex: 0,
          explanation:
            "Le Tso-drano est considéré comme le viatique le plus précieux qu'un être humain puisse emporter dans sa vie.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie le proverbe pédagogique « Tsy misy hendry teraka fa samy nitaizana » ?',
          questionMg:
            'Inona no ambaran’ny ohabolana hoe « Tsy misy hendry teraka fa samy nitaizana » ?',
          choices: [
            'La sagesse n’est pas innée mais s’acquiert patiemment grâce à l’éducation et aux conseils d’autrui',
            'Les bébés savent déjà tout',
            'Il est inutile d’apprendre à l’école',
            'Seuls les vieux peuvent apprendre',
          ],
          correctIndex: 0,
          explanation:
            "Nul ne vient au monde parfait : c'est l'écoute et l'apprentissage auprès des aînés qui forgent l'homme intègre.",
        },
        {
          type: 'quiz',
          question:
            'Quel geste traditionnel accompagne souvent l’octroi du Tso-drano par un grand-parent ?',
          questionMg:
            'Inona no fihetsika matetika miaraka amin’ny fanomezana tso-drano ?',
          choices: [
            'Souffler légèrement de l’eau claire ou poser les deux mains sur la tête avec des paroles de paix',
            'Fermer les yeux et partir en courant',
            'Donner un coup de bâton sur l’épaule',
            'Allumer une lampe torche',
          ],
          correctIndex: 0,
          explanation:
            "L'aîné souffle de l'eau claire (*mitsoka rano*) ou impose doucement ses mains en prononçant des vœux de prospérité.",
        },
        {
          type: 'quiz',
          question:
            'Comment un jeune adulte reconnaissant exprime-t-il sa gratitude envers ses éducateurs ?',
          questionMg:
            'Ahoana no anehoan’ny tanora ny fankasitrahana ireo nitaiza azy ?',
          choices: [
            'Par le respect constant, les visites régulières et le soutien moral et matériel tout au long de la vie',
            'En oubliant leur nom une fois parti',
            'En ne leur écrivant jamais',
            'En leur envoyant des lettres de reproches',
          ],
          correctIndex: 0,
          explanation:
            'Le devoir de mémoire et de soin filial honore ceux qui ont consacré leur énergie à former la jeune génération.',
        },
      ],
    },
    // ─── LEÇON 12 : LA PATIENCE & LA RÉSILIENCE (FAHARETANA) ───
    {
      slug: 'la-patience-et-perseverance-faharetana',
      title: 'La patience et la résilience face aux épreuves : Ny Faharetana',
      titleMg:
        'Ny Faharetana sy ny Fikirizana amin’ny andro sarotra : Hery anaty',
      summary:
        'Découvrez la force tranquille de la résilience malgache : maîtriser le temps avec douceur (mora mora) pour surmonter les tempêtes de la vie.',
      summaryMg:
        "Diniho ny herin'ny faharetana sy ny fahatoniana malagasy : fahaizana miatrika ny rivo-doza amim-pahendrena sy fahatokiana.",
      type: 'VOCABULARY',
      orderIndex: 12,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Face aux aléas de la météo, aux cyclones dévastateurs et aux difficultés économiques, le peuple malgache puise sa force dans une vertu cardinale : la patience persévérante (Faharetana). Loin d'être de la passivité ou de la résignation, le fameux 'Mora mora' est une philosophie de maîtrise intérieure du temps : 'Mora mora fa lava andro' (Doucement car les jours sont longs). La sérénité permet de reconstruire patiemment ce que la tempête a brisé.",
          textMg:
            "Manoloana ny rivo-doza sy ny fahasarotan'ny fiainana, ny vahoaka malagasy dia manana hery lehibe antsoina hoe Faharetana. Ny 'mora mora' dia tsy hakamoana velively, fa fahaiza-miaina miatrika ny fotoana : 'Mora mora fa lava andro'.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / HA / RE / TA / NA',
          phonetic: 'fa-ha-re-ta-na',
          frenchEquivalent:
            "Le mot « Faharetana » dérive du verbe 'maharitra' (endurer avec noblesse, durer dans le temps).",
          sampleWordMg: 'Maharitra',
          sampleTranslationFr: 'Endurant / Résilient / Patient',
        },
        {
          type: 'concept',
          termMg: 'Ny faharetana no lova tsara indrindra',
          phonetic: 'ni fa-ha-re-ta-na nou lou-va tsa-ra in-drin-dra',
          meaningFr: 'La patience persévérante est le plus bel héritage moral',
          explanation:
            "Proverbe enseignant que les biens matériels peuvent disparaître, mais que la capacité d'endurance face aux coups durs ne se perd jamais.",
        },
        {
          type: 'concept',
          termMg: 'Mora mora fa lava andro',
          phonetic: 'mou-ra mou-ra fa la-va an-drou',
          meaningFr: 'Agissons avec calme et mesure car la journée est longue',
          explanation:
            "Véritable art de vivre : la précipitation et la panique provoquent les erreurs, tandis que le calme méthodique mène à l'achèvement serein du travail.",
        },
        {
          type: 'concept',
          termMg: 'Ny rano mahery tsy manasa lamba',
          phonetic: 'ni ra-nou ma-he-ri tsi ma-na-sa lam-ba',
          meaningFr:
            'L’eau trop tumultueuse ne permet pas de laver le linge proprement',
          explanation:
            "Métaphore frappante : la colère ou l'agitation désordonnée n'a jamais résolu aucun problème, seule la sérénité nettoie les difficultés.",
        },
        {
          type: 'example',
          textMg:
            "Na sarotra aza ny lalana dia aza kivy : mitondra faharetana sy finoana fa hiposaka indray ny masoandro aorian'ny orana.",
          textFr:
            "Même si le sentier est ardu ne désespère pas : garde la patience et la foi que le soleil brillera de nouveau après l'orage.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Après chaque passage de cyclone tropical, les communautés malgaches se mobilisent immédiatement par le 'Valin-tanana' pour relever ensemble les toits de chaume et replanter les digues de rizières sans lamentation, incarnant une leçon mondiale de résilience collective.",
          textMg:
            "Rehefa avy ny rivo-doza dia mifanome tanana avy hatrany ny fokonolona hanangana indray ny trano nihorona sy ny tanimbary tamin'ny alalan'ny valin-tanana.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la signification profonde de l’expression populaire « Mora mora » dans la philosophie malgache ?',
          questionMg:
            'Inona ny hevitra lalina marina fonosin’ny teny hoe « Mora mora » ?',
          choices: [
            'Une maîtrise calme du temps et du stress pour agir avec mesure, sans précipitation aveugle',
            'L’interdiction de travailler',
            'Dormir toute la journée',
            'Partir en retard exprès',
          ],
          correctIndex: 0,
          explanation:
            '« Mora mora » est la sagesse de la lenteur constructive : garder son sang-froid pour agir avec précision sans gâcher ses forces.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie le proverbe « Ny rano mahery tsy manasa lamba » ?',
          questionMg:
            'Inona no hevitry ny ohabolana hoe « Ny rano mahery tsy manasa lamba » ?',
          choices: [
            'L’agitation violente et la colère ne résolvent rien : seul le calme permet d’apaiser les difficultés',
            'L’eau des rivières est trop froide',
            'Il faut laver le linge sans eau',
            'Les fleuves sont trop profonds',
          ],
          correctIndex: 0,
          explanation:
            "Un torrent furieux emporte le linge au lieu de le laver : la colère brouille le jugement au lieu d'apporter la paix.",
        },
        {
          type: 'quiz',
          question:
            'Que proclame l’adage « Ny faharetana no lova tsara indrindra » ?',
          questionMg:
            'Inona no dikan’ny hoe « Ny faharetana no lova tsara indrindra » ?',
          choices: [
            'La patience persévérante est le trésor moral le plus précieux qu’on puisse posséder face aux épreuves',
            'Seul l’argent liquide est un héritage',
            'Il faut attendre sans jamais agir',
            'La paresse est une qualité',
          ],
          correctIndex: 0,
          explanation:
            'La résilience intérieure permet de surmonter toutes les crises économiques et personnelles avec dignité.',
        },
        {
          type: 'quiz',
          question:
            'Comment les villageois réagissent-ils solidairement après les destructions causées par un cyclone ?',
          questionMg:
            'Ahoana no ataon’ny mpiara-monina rehefa avy nandalo ny rivo-doza nandrava tanàna ?',
          choices: [
            'Ils s’unissent par le Valin-tanana pour reconstruire immédiatement les toitures et rizières dans la fraternité',
            'Chacun déménage sans aider personne',
            'Ils attendent en pleurant sans bouger',
            'Ils s’accusent mutuellement',
          ],
          correctIndex: 0,
          explanation:
            "L'entraide immédiate et le courage partagé effacent rapidement les stigmates des catastrophes naturelles.",
        },
        {
          type: 'quiz',
          question:
            'Que rappelle le proverbe d’espérance « Aorian’ny orana dia miposaka indray ny masoandro » ?',
          questionMg:
            'Inona no fampaherezana entin’ny ohabolana momba ny masoandro aorian’ny orana ?',
          choices: [
            'L’épreuve est toujours passagère, la joie et le renouveau finissent toujours par revenir',
            'La météo ne change jamais',
            'Il faut acheter un parapluie neuf',
            'La nuit dure toute l’année',
          ],
          correctIndex: 0,
          explanation:
            'Cet adage réconforte les cœurs meurtris en rappelant que la lumière et la paix succèdent inéluctablement aux ténèbres.',
        },
      ],
    },
  ],
};
