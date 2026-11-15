import { SeedTrack } from './seed.types.js';

export const medicinalPlantsTrack: SeedTrack = {
  slug: 'pharmacopee-et-plantes-medicinales',
  title: 'Pharmacopée & Plantes Médicinales (Fanafody Gasy)',
  titleMg: 'Ny Harenan’ny Zava-maniry Fanefitra sy Fanafody Gasy',
  description:
    'Découvrez les secrets de la pharmacopée malgache : la Pervenche anticancéreuse, le Ravintsara antiviral, le Katrafay et les recherches de l’IMRA.',
  descriptionMg:
    'Fantaro ny herin’ny raokandro sy ny fanafody nentin-drazana : vonenina miady amin’ny homamiadana, ravintsara, katrafay ary ny asan’ny IMRA.',
  level: 'INTERMEDIATE',
  icon: 'Flower2',
  color: '#059669',
  orderIndex: 13,
  estimatedMinutes: 40,
  lessons: [
    // ─── LEÇON 1 : MADAGASCAR LABORATOIRE VÉGÉTAL DU MONDE ───
    {
      slug: 'madagascar-laboratoire-vegetal-du-monde',
      title:
        'Madagascar, laboratoire végétal du monde : la tradition du Fanafody gasy',
      titleMg:
        'Madagasikara sy ny Raokandro : Harena ara-pahasalamana nentin-drazana',
      summary:
        'Explorez les fondements de la médecine traditionnelle malgache : la science des tisanes (raokandro), les herboristes traditionnels et la biodiversité curative.',
      summaryMg:
        'Diniho ny fototry ny fahasalamana nentin-drazana : ny fahaizana mitsabo amin’ny raokandro, ny fampiasana ravina sy hodi-kazo ary ny fahendren’ny ombiasy.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Avec plus de 12 000 espèces végétales dont près de 90 % sont strictement endémiques, Madagascar est considérée par l'Organisation Mondiale de la Santé (OMS) comme l'une des plus riches réserves de plantes médicinales de l'humanité. Depuis des siècles, les tradipraticiens malgaches (mpitsabo nentin-drazana) ont identifié empiriquement les vertus thérapeutiques de milliers de feuilles, écorces et racines pour soigner les fièvres, fortifier le corps et apaiser l'esprit.",
          textMg:
            'Manana karazan-javamaniry mihoatra ny 12 000 i Madagasikara ka ny 90 % dia eto ihany no misy azy. Nandritra ny taonjato maro, ny mpitsabo nentin-drazana dia nahay nampiasa ny raokandro, ny ravinkazo ary ny hodi-kazo hitsaboana ny aretina isan-karazany sy hamerenana ny hery anaty.',
        },
        {
          type: 'phonetic',
          letterOrSound: 'RAO / KAN / DRO',
          phonetic: 'raou-kan-drou',
          frenchEquivalent:
            "Le mot « Raokandro » désigne l'ensemble des plantes médicinales sauvages cueillies pour la confection des remèdes traditionnels.",
          sampleWordMg: 'Raokandro',
          sampleTranslationFr: 'La plante médicinale / La tisane bienfaisante',
        },
        {
          type: 'concept',
          termMg: 'Fanafody Gasy (Fitsaboana nentin-drazana)',
          phonetic: 'fa-na-fou-di ga-si',
          meaningFr:
            'La médecine traditionnelle malgache à base de plantes naturelles',
          explanation:
            "Ensemble des savoirs empiriques transmis oralement de génération en génération pour soigner les maux du corps et de l'âme.",
        },
        {
          type: 'concept',
          termMg: 'Mpanao raokandro sy Ombiasy mpanasitrana',
          phonetic: 'mpa-na-ou raou-kan-drou',
          meaningFr:
            'L’herboriste guérisseur dépositaire des secrets de la forêt',
          explanation:
            "Praticien respecté qui cueille les plantes à des heures précises de la journée et connaît les dosages d'infusion et de décoction.",
        },
        {
          type: 'concept',
          termMg: 'Ravina, Hodi-kazo sy Faka',
          phonetic: 'ra-vi-na, hou-di-ka-zou si fa-ka',
          meaningFr: 'Feuilles, écorces du tronc et racines souterraines',
          explanation:
            "Les trois parties de l'arbre où se concentrent les principes actifs thérapeutiques selon la nature de la maladie à traiter.",
        },
        {
          type: 'example',
          textMg:
            'Ny fampifangaroana ny raokandro nentin-drazana sy ny fikarohana siantifika maotina no antoky ny fahasalamana sy ny fampandrosoana eto Madagasikara.',
          textFr:
            "L'alliance féconde entre la pharmacopée traditionnelle ancestrale et la recherche scientifique moderne est la clé de la santé publique et du rayonnement de Madagascar.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Plus de 80 % de la population rurale malgache a recours en premier lieu aux plantes médicinales locales pour se soigner avant de se rendre dans un centre de santé, soulignant l'importance vitale de préserver ce patrimoine floristique.",
          textMg:
            "Mihoatra ny 80 %-n'ny vahoaka any ambanivohitra no mampiasa voalohany ny fanafody gasy rehefa marary alohan'ny hanatonana hopitaly.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Combien d’espèces végétales recense-t-on environ à Madagascar, dont près de 90 % sont strictement endémiques ?',
          questionMg:
            'Tombanana ho firy ny karazan-javamaniry misy eto Madagasikara ?',
          choices: [
            'Plus de 12 000 espèces végétales répertoriées',
            'Moins de 100 espèces',
            'Exactement 500 espèces',
            'Seulement 20 espèces',
          ],
          correctIndex: 0,
          explanation:
            "Madagascar compte une flore colossale de plus de 12 000 espèces répertoriées, dont l'immense majorité n'existe nulle part ailleurs.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne le terme traditionnel malgache « Raokandro » ?',
          questionMg:
            'Inona no hevitry ny teny hoe « Raokandro » eo amin’ny fitsaboana malagasy ?',
          choices: [
            'Les plantes médicinales et tisanes curatives cueillies dans la nature',
            'Un plat de viande séchée',
            'Un chapeau de fête',
            'Une danse folklorique de nuit',
          ],
          correctIndex: 0,
          explanation:
            'Le raokandro est la plante médicinale par excellence, préparée en infusion, décoction ou cataplasme.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les tradipraticiens respectent-ils des heures précises (généralement à l’aube) pour cueillir les plantes médicinales ?',
          questionMg:
            'Nahoana no misy fotoana manokana maraina vao mangiran-dratsy angalana ny raokandro any an’ala ?',
          choices: [
            'Parce que la sève et la concentration en principes actifs et huiles essentielles y sont à leur apogée avant la chaleur du soleil',
            'Pour éviter de croiser les voisins',
            'Parce qu’il fait trop chaud l’après-midi pour marcher',
            'Parce que les plantes dorment la nuit',
          ],
          correctIndex: 0,
          explanation:
            "La fraîcheur de l'aube préserve les molécules aromatiques volatiles et la concentration chimique optimale des feuilles.",
        },
        {
          type: 'quiz',
          question:
            'Quelle partie de l’arbre utilise-t-on traditionnellement pour préparer des remèdes fortifiants de longue conservation ?',
          questionMg:
            'Inona amin’ny vatan-kazo no matetika alaina hatao fanafody maharitra tsara ?',
          choices: [
            'L’écorce interne (hodi-kazo) séchée à l’ombre',
            'Les feuilles flétries tombées au sol',
            'La poussière du tronc',
            'L’ombre de l’arbre',
          ],
          correctIndex: 0,
          explanation:
            "L'écorce (*hodi-kazo*) concentre les tanins et alcaloïdes protecteurs et se conserve durant des mois sans pourrir.",
        },
        {
          type: 'quiz',
          question:
            'Quelle institution internationale reconnaît Madagascar comme un réservoir mondial majeur de santé par les plantes ?',
          questionMg:
            'Inona ilay fikambanana iraisam-pirenena manaiky an’i Madagasikara ho harena lehibe amin’ny raokandro ?',
          choices: [
            'L’Organisation Mondiale de la Santé (OMS)',
            'Le Comité International Olympique (CIO)',
            'L’Union Postale Universelle',
            'L’Organisation Mondiale du Commerce uniquement',
          ],
          correctIndex: 0,
          explanation:
            "L'OMS promeut l'intégration de la médecine traditionnelle malgache scientifiquement validée dans les systèmes de soins primaires.",
        },
      ],
    },
    // ─── LEÇON 2 : LA PERVENCHE DE MADAGASCAR ───
    {
      slug: 'la-pervenche-de-madagascar-victoire-contre-le-cancer',
      title:
        'La Pervenche de Madagascar (Catharanthus roseus) : victoire mondiale contre la leucémie',
      titleMg:
        'Ny Vonenina (Pervenche de Madagascar) : Zava-maniry naharesy ny homamiadana',
      summary:
        'Découvrez l’histoire fascinante de la petite pervenche rose de Madagascar qui a révolutionné l’oncologie moderne en sauvant des milliers d’enfants atteints de leucémie.',
      summaryMg:
        'Fantaro ny tantaran’ny vonenina kely malagasy nanova ny fitsaboana homamiadana eran-tany : ny vinkristina sy vinblastina mamonjy aina.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Petite plante herbacée aux fleurs roses ou blanches très commune le long des chemins et des plages de Madagascar, la Pervenche de Madagascar (Catharanthus roseus, autrefois appelée Vinca rosea ou 'Vonenina' en malgache) est à l'origine de l'une des plus grandes révolutions de la médecine du XXe siècle. Les scientifiques y ont découvert deux alcaloïdes majeurs : la vinblastine et la vincristine, des antimitotiques puissants qui ont fait passer le taux de guérison de la leucémie infantile de 10 % à plus de 90 % !",
          textMg:
            "Zava-maniry tsotra maniry eny amoron-dalana misy voninkazo fotsy na mavokely ny Vonenina. Kanefa tao anatin'ity voninkazo malagasy ity no nahitan'ny mpahay siansa fanafody roa lehibe (vinblastine sy vincristine) nahafahana nanasitrana ny homamiadan'ny rà (leucémie) amin'ny ankizy hatramin'ny 90 %.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VO / NE / NI / NA',
          phonetic: 'vou-ne-ni-na',
          frenchEquivalent:
            'Le mot « Vonenina » désigne la pervenche endémique aux vertus cicatrisantes et antitumorales exceptionnelles.',
          sampleWordMg: 'Vonenina',
          sampleTranslationFr:
            'La Pervenche de Madagascar (Catharanthus roseus)',
        },
        {
          type: 'concept',
          termMg: 'Vinblastine sy Vincristine',
          phonetic: 'vin-blas-ti-na si vin-kris-ti-na',
          meaningFr:
            'Alcaloïdes antitumoraux majeurs extraits des feuilles de pervenche',
          explanation:
            "Médicaments de chimiothérapie essentiels inscrits sur la liste des médicaments indispensables de l'Organisation Mondiale de la Santé.",
        },
        {
          type: 'concept',
          termMg: 'Ady amin’ny homamiadan’ny rà (Leucémie infantile)',
          phonetic: 'ou-ma-mi-a-da-na',
          meaningFr:
            'La lutte victorieuse contre la prolifération des cellules cancéreuses',
          explanation:
            "Ces molécules bloquent la division des cellules cancéreuses, sauvant chaque année des dizaines de milliers de vies d'enfants à travers le monde.",
        },
        {
          type: 'concept',
          termMg: 'Harenan’ny tany tsy nisy tambiny (Biopiratage historique)',
          phonetic: 'ha-re-nan-ni ta-ni',
          meaningFr: 'L’enjeu de la juste rémunération des savoirs ancestraux',
          explanation:
            "Cas d'école mondial : découverte à Madagascar sans contrepartie financière pour l'île à l'époque, qui a conduit au Protocole de Nagoya sur le partage des avantages génétiques.",
        },
        {
          type: 'example',
          textMg:
            "Ity voninkazo vonenina kely maniry eny an-tokontaninay ity no namonjy ain'ankizy an'aliny maro eran'izao tontolo izao.",
          textFr:
            "Cette humble petite fleur de pervenche qui pousse dans nos jardins a sauvé la vie de dizaines de milliers d'enfants à travers la planète entière.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Avant sa découverte par les laboratoires pharmaceutiques occidentaux dans les années 1950, les anciens malgaches utilisaient déjà traditionnellement la décoction de Vonenina pour réguler le diabète et désinfecter les plaies cutanées tenaces !',
          textMg:
            "Efa nampiasain'ny Ntaolo malagasy nitsaboana diabeta sy fery maditra ny vonenina talohan'ny nahalalan'ny mpikaroka vahiny azy tamin'ny taona 1950.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Pour quelle découverte médicale majeure la Pervenche de Madagascar (Catharanthus roseus / Vonenina) est-elle mondialement renommée ?',
          questionMg:
            'Inona ny zava-bita ara-pitsaboana lehibe nampalaza ny Vonenina maneran-tany ?',
          choices: [
            'L’extraction de molécules anticancéreuses majeures (vincristine et vinblastine) traitant avec succès la leucémie',
            'L’invention du dentifrice moderne',
            'Un remède contre la calvitie',
            'Un somnifère pour chevaux',
          ],
          correctIndex: 0,
          explanation:
            'La vincristine et la vinblastine extraites de la pervenche malgache ont révolutionné la chimiothérapie moderne des cancers du sang.',
        },
        {
          type: 'quiz',
          question:
            'De quel pourcentage à quel pourcentage spectaculaire le taux de rémission de la leucémie infantile est-il passé grâce aux alcaloïdes de la pervenche malgache ?',
          questionMg:
            'Nampiakatra ny taham-pahasitranan’ny leucémie amin’ny ankizy ho firy isan-jato ny fanafody avy amin’ny Vonenina ?',
          choices: [
            'De moins de 10 % à plus de 90 % de rémission',
            'De 5 % à 6 % seulement',
            'De 100 % à 0 %',
            'Il n’y a eu aucun changement',
          ],
          correctIndex: 0,
          explanation:
            "Ce bond thérapeutique miraculeux de 10 % à plus de 90 % est l'une des victoires les plus éclatantes de la médecine moderne.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on en malgache cette petite plante aux fleurs roses ou blanches résistante aux sols sablonneux ?',
          questionMg:
            'Inona ny anarana malagasy iantsoana ny Pervenche de Madagascar ?',
          choices: ['Vonenina', 'Ravintsara', 'Katrafay', 'Aviavy'],
          correctIndex: 0,
          explanation:
            '« Vonenina » est le nom vernaculaire malgache de cette fleur prodigieuse commune dans les jardins et savanes côtières.',
        },
        {
          type: 'quiz',
          question:
            'Pour quel usage traditionnel les anciens malgaches employaient-ils déjà la pervenche avant les études de laboratoire ?',
          questionMg:
            'Tamin’inona no efa nampiasain’ny Ntaolo malagasy ny vonenina fahiny ?',
          choices: [
            'Comme remède traditionnel hypoglycémiant contre le diabète et antiseptique pour les plaies',
            'Comme colorant pour peindre les maisons',
            'Comme parfum pour les chevaux',
            'Comme monnaie d’échange au marché',
          ],
          correctIndex: 0,
          explanation:
            "Les guérisseurs malgaches l'administraient en infusion pour faire baisser le taux de sucre dans le sang et purifier les infections.",
        },
        {
          type: 'quiz',
          question:
            'Quel grand traité international environnemental a été inspiré par l’exploitation sans partage de la pervenche de Madagascar pour exiger le partage juste des bénéfices ?',
          questionMg:
            'Inona ilay fifanarahana iraisam-pirenena miaro ny firenena tompon’ny zavamaniry amin’ny fandroban-karena ?',
          choices: [
            'Le Protocole de Nagoya sur l’accès aux ressources génétiques et le partage équitable des avantages',
            'Le traité de Versailles',
            'Les accords de Bretton Woods',
            'Le protocole de Kyoto uniquement',
          ],
          correctIndex: 0,
          explanation:
            "Le protocole de Nagoya oblige désormais les laboratoires du monde entier à partager équitablement les retombées financières avec les pays d'origine des plantes.",
        },
      ],
    },
    // ─── LEÇON 3 : LE RAVINTSARA ET LE MANDRAVASAROTRA ───
    {
      slug: 'le-ravintsara-et-le-mandravasarotra-boucliers-antiviraux',
      title:
        'Le Ravintsara et le Mandravasarotra (Saro) : boucliers antiviraux d’exception',
      titleMg:
        'Ny Ravintsara sy ny Mandravasarotra : Ampingan’ny fahasalamana sy ny taovam-pisefoana',
      summary:
        'Explorez les deux huiles essentielles reines de Madagascar : le Ravintsara aux vertus respiratoires royales et le Mandravasarotra vainqueur des maux.',
      summaryMg:
        'Fantaro ireo menaka manitra roa mpanjakavavin’ny fahasalamana : ny Ravintsara mpanadio havokavoka sy ny Mandravasarotra (Saro) manala ny sarotra rehetra.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans le monde de l'aromathérapie et des médecines naturelles, Madagascar possède deux trésors antiviraux sans équivalent : le Ravintsara (Cinnamomum camphora chémotype 1,8-cinéole) et le Mandravasarotra (Cinnamosma fragrans, connu sous le nom commercial de Saro). Ces grands arbres aromatiques produisent des huiles essentielles majeures qui renforcent l'immunité, dégagent les voies respiratoires et combattent les virus saisonniers sans toxicité.",
          textMg:
            "Eto Madagasikara no ahitana ireo hazo roa malaza indrindra manadio taovam-pisefoana sy miaro amin'ny tsimokaretina : ny Ravintsara maniry any amin'ny Afovoan-tany mando sy ny Mandravasarotra (Saro) any amin'ny ala maina any Andrefana. Izy roa ireo no mpanjakavavin'ny menaka manitra maneran-tany.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RA / VIN / TSA / RA',
          phonetic: 'ra-vin-tsa-ra',
          frenchEquivalent:
            "Le nom « Ravintsara » est formé de 'Ravina' (la feuille) et 'Tsara' (bonne, excellente, bienfaisante).",
          sampleWordMg: 'Ravintsara',
          sampleTranslationFr:
            'La bonne feuille / L’arbre aux feuilles bienfaisantes',
        },
        {
          type: 'concept',
          termMg: 'Ravintsara (Ravina tsara)',
          phonetic: 'ra-vin-tsa-ra',
          meaningFr:
            'L’arbre médicinal aux feuilles bienfaisantes par excellence',
          explanation:
            "Bien qu'originaire d'Asie, le camphrier a développé à Madagascar un profil biochimique unique au monde sans camphre toxique, gorgé d'eucalyptol doux pour les poumons.",
        },
        {
          type: 'concept',
          termMg: 'Mandravasarotra (Saro / Cinnamosma fragrans)',
          phonetic: 'man-dra-va-sa-rou-tra',
          meaningFr:
            '« Celui qui anéantit toutes les difficultés et toutes les maladies »',
          explanation:
            'Arbre sauvage endémique du Nord-Ouest de Madagascar dont le nom proclame le pouvoir souverain de guérir les fièvres rebelles et de dissiper les maux.',
        },
        {
          type: 'concept',
          termMg: 'Fofon-drano mafana sy Fanaovana gony',
          phonetic: 'fou-foun-dra-nou ma-fa-na',
          meaningFr:
            'L’inhalation de vapeurs chaudes de feuilles fraîches froissées',
          explanation:
            "Méthode traditionnelle malgache : respirer la vapeur d'eau bouillante chargée de feuilles de Ravintsara sous une serviette pour dégager instantanément les bronches.",
        },
        {
          type: 'example',
          textMg:
            "Rehefa sendra sery sy kohaka amin'ny ririnina dia ny fofon-dranon'ny ravintsara no fanafody natoraly haingam-piasa indrindra.",
          textFr:
            "Lorsqu'on attrape un rhume ou une toux en plein hiver, l'inhalation de feuilles fraîches de ravintsara est le remède naturel le plus efficace et rapide.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le Ravintsara malgache ne doit jamais être confondu avec le Ravensare aromatique (Ravensara aromatica) : ce sont deux arbres botaniquement distincts, bien que tous deux originaires de Madagascar !',
          textMg:
            "Tsy mitovy ny Ravintsara sy ny Ravensara : samy hafa ny fianakavian-kazo niavian'izy roa ireo ary tsy mitovy ny fampiasana azy ara-pahasalamana.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que signifie littéralement en langue malgache le nom de l’arbre médicinal « Ravintsara » ?',
          questionMg:
            'Inona no hevitra ara-bakiteny fonosin’ny teny hoe « Ravintsara » ?',
          choices: [
            '« La bonne feuille » (Ravina + Tsara)',
            'La feuille rouge',
            'L’arbre magique du roi',
            'La fleur qui sent bon',
          ],
          correctIndex: 0,
          explanation:
            '« Ravin-tsara » célèbre la feuille réputée souveraine et bienfaisante pour soigner la famille.',
        },
        {
          type: 'quiz',
          question:
            'Quelle particularité chimique unique le Ravintsara a-t-il développée sur les Hautes Terres de Madagascar par rapport aux camphriers d’Asie ?',
          questionMg:
            'Inona ny mampiavaka ny Ravintsara maniry eto Madagasikara amin’ny hazo mitovy aminy any Azia ?',
          choices: [
            'Il a perdu sa teneur en camphre toxique pour se charger en eucalyptol (1,8-cinéole) doux et antiviral',
            'Il produit des fruits sucrés comestibles',
            'Ses feuilles sont devenues bleues',
            'Il ne sent plus rien du tout',
          ],
          correctIndex: 0,
          explanation:
            'Le sol et le climat malgache ont modifié son métabolisme, créant une huile essentielle antivirale pure dénuée de toxicité camphrée.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie le nom vernaculaire puissant de la plante endémique « Mandravasarotra » (Saro) ?',
          questionMg:
            'Inona no hevitry ny anaran’ilay zavamaniry malaza hoe « Mandravasarotra » ?',
          choices: [
            '« Celui qui anéantit toutes les difficultés et dissipe les maladies »',
            'Une plante très difficile à trouver',
            'Un arbre qui pousse dans les pierres',
            'Une liane qui pique la peau',
          ],
          correctIndex: 0,
          explanation:
            '« Mandrava sarotra » traduit la foi dans sa force absolue pour vaincre les infections rebelles et protéger le corps.',
        },
        {
          type: 'quiz',
          question:
            'Quel mode d’utilisation traditionnel simple est couramment employé dans les foyers malgaches pour dégager les voies respiratoires avec le Ravintsara ?',
          questionMg:
            'Ahoana no fampiasan’ny fianakaviana malagasy ny ravintsara rehefa tsentsina ny orona ?',
          choices: [
            'L’inhalation de la vapeur chaude d’une casserole de feuilles fraîches bouillies la tête sous un tissu',
            'Manger les feuilles crues en salade avec du vinaigre',
            'Faire brûler tout l’arbre dans le jardin',
            'En mettre sous son oreiller sans le cuire',
          ],
          correctIndex: 0,
          explanation:
            "L'inhalation humide des vapeurs aromatiques de Ravintsara dégage immédiatement les sinus et les poumons encombrés.",
        },
        {
          type: 'quiz',
          question:
            'Dans quelle région climatique de Madagascar pousse principalement à l’état sauvage l’arbre Mandravasarotra (Saro) ?',
          questionMg:
            'Faritra aiza eto Madagasikara no tena anirian’ny hazo Mandravasarotra any an’ala ?',
          choices: [
            'Dans les forêts sèches et denses du Nord-Ouest et de l’Ouest malgache',
            'Au fond des lacs d’eau douce',
            'Sur les sommets enneigés du Tsaratanana',
            'Dans les rizières inondées de l’Alaotra',
          ],
          correctIndex: 0,
          explanation:
            'Le Saro pousse naturellement dans les forêts denses sèches caducifoliées des régions Boeny et Sofia au Nord-Ouest.',
        },
      ],
    },
    // ─── LEÇON 4 : LE KATRAFAY & LES TONIQUES FORESTIERS ───
    {
      slug: 'le-katrafay-tonique-ancestral-et-fortifiant',
      title:
        'Le Katrafay (Cedrelopsis grevei) : tonique ancestral et trésor anti-douleur',
      titleMg: 'Ny Katrafay : Hodi-kazo mampody aina sy manala havizanana',
      summary:
        'Découvrez l’écorce fortifiante la plus vénérée de Madagascar : le Katrafay, secret d’énergie des grands marcheurs et des jeunes mères.',
      summaryMg:
        'Fantaro ny hasin’ny Katrafay : hodi-kazo manala fanaintainana, mankahery ny reny vao niteraka ary mampitony ny vanin-taolana.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Arbre endémique majestueux des forêts sèches du Sud et de l'Ouest malgache, le Katrafay (Cedrelopsis grevei) est l'un des piliers incontournables de la pharmacopée traditionnelle. C'est son écorce épaisse, rugueuse et aromatique qui renferme ses vertus légendaires. Utilisé en décoction amère ou en bain de vapeur tonifiant, le Katrafay soulage les rhumatismes, dissipe les courbatures musculaires et accélère le rétablissement des femmes après l'accouchement.",
          textMg:
            "Hazo sarobidy any amin'ny ala maina any Atsimo sy Andrefana ny Katrafay. Ny hodi-kazo no tena ampiasaina : ampangotrahina sotroina na anaovana rano mafana fandroana manala havizanana, mampody aina ny vehivavy vao teraka ary manasitrana ny vanin-taolana mikiky.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'KA / TRA / FAY',
          phonetic: 'ka-tra-fai',
          frenchEquivalent:
            "Le nom « Katrafay » s'articule avec un 'TR' explosif alvéolaire et un 'AY' ouvert sonore.",
          sampleWordMg: 'Katrafay',
          sampleTranslationFr:
            'Le Katrafay (arbre médicinal fortifiant et anti-inflammatoire)',
        },
        {
          type: 'concept',
          termMg: 'Hodi-kazo manala havizanana sy fanaintainana',
          phonetic: 'hou-di-ka-zou ma-na-la ha-vi-za-na-na',
          meaningFr: 'Écorce amère fortifiante anti-douleur et anti-fatigue',
          explanation:
            "Riche en sesquiterpènes et molécules anti-inflammatoires puissantes, l'infusion de Katrafay combat les douleurs articulaires sans effet secondaire gastrique.",
        },
        {
          type: 'concept',
          termMg: 'Fandroana rano mafana ho an’ny vehivavy niteraka',
          phonetic: 'fan-drou-a-na ra-nou ma-fa-na',
          meaningFr: 'Le bain fortifiant chaud post-partum des jeunes mères',
          explanation:
            'Coutume séculaire : faire bouillir des écorces de Katrafay dans une grande marmite pour faire prendre un bain bienfaisant à la nouvelle mère afin de refermer ses tissus et lui redonner vitalité.',
        },
        {
          type: 'concept',
          termMg: 'Ravintsara sy Katrafay : fifamenoana',
          phonetic: 'ra-vin-tsa-ra si ka-tra-fai',
          meaningFr:
            'La synergie bienfaisante entre feuilles de Ravintsara et écorce de Katrafay',
          explanation:
            "L'un nettoie la sphère respiratoire haute, tandis que l'autre régénère la force musculaire et apaise les articulations.",
        },
        {
          type: 'example',
          textMg:
            'Nisotro dite Katrafay ilay raikalahy rehefa avy niasa tany mafy tontolo andro, ka afaka avy hatrany ny lamosina nandoza.',
          textFr:
            "Le père de famille a bu une décoction de Katrafay après avoir labouré durement toute la journée, et son mal de dos s'est immédiatement dissipé.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les bergers et tireurs de pousse-pousse malgaches boivent traditionnellement une tasse de thé de Katrafay chaque matin : ils affirment que cette boisson tonique donne des jambes d'acier capables d'avaler les kilomètres sans faiblir !",
          textMg:
            'Misotro dite mafana misy Katrafay isa-maraina ireo mpitarika posiposy sy mpiasa mafy mba hahazakany ny dia lavitra sy ny asa mafy tsy vizana.',
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle partie de l’arbre Katrafay (Cedrelopsis grevei) est traditionnellement récoltée et bouillie pour ses puissantes vertus thérapeutiques ?',
          questionMg:
            'Inona amin’ny hazo Katrafay no tena alaina hatao fanafody manala fanaintainana ?',
          choices: [
            'L’écorce épaisse et aromatique du tronc',
            'Les pétales de fleurs uniquement',
            'La poussière des feuilles sèches',
            'Les épines de branches',
          ],
          correctIndex: 0,
          explanation:
            "C'est l'écorce rugueuse du Katrafay qui concentre les molécules anti-inflammatoires et toniques légendaires.",
        },
        {
          type: 'quiz',
          question:
            'Pour quelle grande occasion traditionnelle de santé familiale utilise-t-on le grand bain d’écorce de Katrafay bouillie ?',
          questionMg:
            'Amin’ny fotoana manao ahoana no tena anaovana fandroana rano mafana misy Katrafay amin’ny fomba malagasy ?',
          choices: [
            'Pour fortifier et remettre en forme la mère après l’accouchement',
            'Pour fêter le baccalauréat des enfants',
            'Pendant le repas de mariage',
            'Uniquement lors des fêtes de Noël',
          ],
          correctIndex: 0,
          explanation:
            'Le bain chaud au Katrafay est le soin réparateur incontournable apporté aux accouchées pour restaurer leur énergie vitale.',
        },
        {
          type: 'quiz',
          question:
            'Dans quel écosystème naturel de Madagascar l’arbre Katrafay pousse-t-il spontanément à l’état sauvage ?',
          questionMg:
            'Any amin’ny tontolo iainana manao ahoana no anirian’ny hazo Katrafay ?',
          choices: [
            'Dans les forêts denses sèches et savanes arborées du Sud et de l’Ouest malgache',
            'Au milieu des glaciers de montagne',
            'Dans les eaux salées sous la mer',
            'Dans les marécages de la capitale uniquement',
          ],
          correctIndex: 0,
          explanation:
            'Le Katrafay est un arbre adapté aux sols arides et calcaires des provinces côtières occidentales et méridionales.',
        },
        {
          type: 'quiz',
          question:
            'Quelle saveur caractéristique ressent-on immédiatement lorsqu’on goûte une infusion ou décoction de Katrafay ?',
          questionMg:
            'Manao ahoana ny tsiron’ny dite Katrafay rehefa sotroina ?',
          choices: [
            'Une saveur amère et chaude typique des toniques végétaux astringents',
            'Un goût très sucré de fraise',
            'Un goût de chocolat au lait',
            'Aucun goût du tout comme de l’eau pure',
          ],
          correctIndex: 0,
          explanation:
            "L'amertume prononcée du Katrafay atteste de sa richesse en principes actifs taniques et amers stimulants pour le foie et les muscles.",
        },
        {
          type: 'quiz',
          question:
            'Quelle précaution essentielle de cueillette durable les forestiers doivent-ils respecter pour ne pas tuer l’arbre Katrafay ?',
          questionMg:
            'Inona ny fitsipika tsy maintsy hajaina rehefa manendaka hodi-kazo Katrafay mba tsy hahafaty ny hazo ?',
          choices: [
            'Ne prélever que des bandes verticales partielles d’écorce sans jamais faire un anneau complet autour du tronc',
            'Couper l’arbre à la racine avec une tronçonneuse',
            'Mettre le feu au pied de l’arbre',
            'Arracher toutes les branches',
          ],
          correctIndex: 0,
          explanation:
            "L'écorçage en anneau complet coupe la circulation de la sève et tue l'arbre : une cueillette responsable ne prélève qu'une bande étroite laissant l'arbre cicatriser.",
        },
      ],
    },
    // ─── LEÇON 5 : L'IMRA & LA RECHERCHE SCIENTIFIQUE ───
    {
      slug: 'l-imra-et-le-pr-ratsimamanga-science-et-tradition',
      title:
        'L’IMRA et le Pr Ratsimamanga : science moderne et valorisation du savoir ancestral',
      titleMg:
        'Ny IMRA sy ny Pr Rakoto Ratsimamanga : Fampifandraisana ny Siantsa sy ny Nentin-drazana',
      summary:
        'Découvrez l’Institut Malgache de Recherches Appliquées fondé à Avarabohitra : le combat d’une vie du Pr Ratsimamanga pour valoriser les plantes sans piller les savoirs locaux.',
      summaryMg:
        'Fantaro ny tantaran’ny IMRA natsangan’ny Pr Albert Rakoto Ratsimamanga : fikarohana fanafody avy amin’ny zava-maniry malagasy sy fiarovana ny tanindrazana.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Fondé en 1957 à Avarabohitra (Antananarivo) par le grand savant malgache Albert Rakoto Ratsimamanga et son épouse Suzanne Arloing, l'Institut Malgache de Recherches Appliquées (IMRA - Fondation Ratsimamanga) est un centre de recherche d'excellence pionnier dans le tiers-monde. Son credo visionnaire : appliquer la méthode scientifique moderne (chimie, pharmacologie, essais cliniques) aux remèdes des guérisseurs traditionnels afin de créer des médicaments efficaces, sûrs et accessibles à la population locale.",
          textMg:
            "Niorina tamin'ny taona 1957 tetsy Avarabohitra teo ambany fitarihan'ny Pr Albert Rakoto Ratsimamanga sy Suzanne vadiny ny IMRA. Tanjony lehibe ny mampiasa ny siansa maotina mba hanamarinana ny fahaizan'ny Ntaolo amin'ny raokandro sy hanamboarana fanafody takatry ny vahoaka madinika.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RA / TSI / MA / MA / NGA',
          phonetic: 'ra-tsi-ma-man-ga',
          frenchEquivalent:
            "Le nom du Professeur « Ratsimamanga » est l'un des patronymes scientifiques les plus respectés d'Afrique et de l'Académie des Sciences.",
          sampleWordMg: 'Fikarohana',
          sampleTranslationFr: 'La recherche scientifique appliquée',
        },
        {
          type: 'concept',
          termMg: 'IMRA (Fondation Albert et Suzanne Ratsimamanga)',
          phonetic: 'im-ra',
          meaningFr:
            'L’Institut Malgache de Recherches Appliquées pionnier d’Avarabohitra',
          explanation:
            'Centre internationalement reconnu abritant laboratoires de phytochimie, jardin botanique conservatoire et unités de production de médicaments traditionnels améliorés (MTA).',
        },
        {
          type: 'concept',
          termMg: 'Madecassol (Centella asiatica / Talapetraka)',
          phonetic: 'ma-de-kas-sol',
          meaningFr:
            'Médicament cicatrisant mondial issu de l’herbe malgache Talapetraka',
          explanation:
            'Découvert et breveté par le Pr Ratsimamanga : extrait purifié de Centella asiatica utilisé mondialement en dermatologie pour régénérer la peau brûlée et effacer les cicatrices.',
        },
        {
          type: 'concept',
          termMg: 'Fiarovana amin’ny Biopiratage',
          phonetic: 'fi-a-rou-va-na a-min-ni bi-ou-pi-ra-ta-dze',
          meaningFr:
            'La protection éthique des savoirs autochtones contre le pillage étranger',
          explanation:
            'Combat juridique pour que les brevets pharmaceutiques profitent directement aux paysans malgaches et aux chercheurs locaux qui détiennent la connaissance des plantes.',
        },
        {
          type: 'example',
          textMg:
            "Ny asan'ny Pr Ratsimamanga dia mampianatra antsika fa tsy ambany velively ny fahalalana malagasy rehefa tohanana amin'ny fikarohana sy ny fitiavan-tanindrazana.",
          textFr:
            "L'œuvre du Pr Ratsimamanga nous enseigne avec fierté que les savoirs malgaches ne sont nullement inférieurs lorsqu'ils sont portés par la rigueur scientifique et l'amour de la patrie.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le médicament cicatrisant 'Madécassol', vendu dans les pharmacies du monde entier depuis plus de soixante ans, tire directement son nom de 'Madagascar' en hommage à la plante Talapetraka cueillie sur les hauts plateaux de l'île !",
          textMg:
            "Ny fanafody fanta-daza 'Madécassol' ampiasaina eran-tany dia avy amin'ny anaran'i Madagasikara sy ny ahitra Talapetraka nofidian'ny Pr Ratsimamanga.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Qui fut le grand savant médecin malgache qui fonda l’Institut Malgache de Recherches Appliquées (IMRA) en 1957 ?',
          questionMg:
            'Iza ilay mpahay siansa sy dokotera malaza nanorina ny IMRA tamin’ny taona 1957 ?',
          choices: [
            'Le Professeur Albert Rakoto Ratsimamanga',
            'Philibert Tsiranana',
            'Jean Laborde',
            'Radama Ier',
          ],
          correctIndex: 0,
          explanation:
            'Le Pr Albert Rakoto Ratsimamanga consacra sa vie de chercheur émérite à prouver scientifiquement la valeur des plantes de Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'Quel célèbre médicament cicatrisant mondial dermatologique a été développé et breveté à partir de la plante malgache « Talapetraka » (Centella asiatica) ?',
          questionMg:
            'Inona ilay fanafody fanasitranana fery malaza eran-tany noforonina avy amin’ny ahitra Talapetraka ?',
          choices: [
            'Le Madécassol',
            'L’Aspirine',
            'La Pénicilline',
            'Le Paracétamol',
          ],
          correctIndex: 0,
          explanation:
            "Le Madécassol (dérivé de Madagascar) est l'un des plus grands succès thérapeutiques mondiaux issus de la flore malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quel était l’objectif éthique et social fondamental de la création de l’IMRA à Avarabohitra ?',
          questionMg:
            'Inona ny tanjona lehibe nitsanganan’ny IMRA teo amin’ny fiarahamonina malagasy ?',
          choices: [
            'Créer des médicaments efficaces, scientifiquement prouvés et à prix abordable pour soigner la population malgache',
            'Vendre des voitures de course',
            'Construire des hôtels de luxe pour touristes',
            'Interdire aux gens d’aller à l’hôpital',
          ],
          correctIndex: 0,
          explanation:
            "Le Pr Ratsimamanga voulait doter Madagascar de sa propre industrie pharmaceutique souveraine valorisant ses plantes sans dépendre de l'étranger.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le pillage illégal des plantes et des savoirs traditionnels d’un pays par des laboratoires sans accord équitable ?',
          questionMg:
            'Inona no iantsoana ny fangalarana ny fahalalana sy ny zavamanirin’ny firenena iray tsy misy tambiny ?',
          choices: [
            'Le biopiratage (biopiracy)',
            'Le commerce équitable',
            'Le tourisme vert',
            'La coopération solidaire',
          ],
          correctIndex: 0,
          explanation:
            'Le biopiratage consiste à breveter indûment des molécules issues de connaissances ancestrales autochtones sans partager les bénéfices.',
        },
        {
          type: 'quiz',
          question:
            'Quelle démarche novatrice caractérise la méthode de recherche de l’IMRA ?',
          questionMg:
            'Inona ny fomba fiasa miavaka nampiasain’ny IMRA tamin’ny fikarohana ?',
          choices: [
            'Travailler en confiance main dans la main avec les guérisseurs traditionnels tout en validant leurs remèdes en laboratoire moderne',
            'Ignorer totalement les savoirs des anciens',
            'Importer toutes les plantes de l’étranger',
            'Faire des recherches sans jamais tester les plantes',
          ],
          correctIndex: 0,
          explanation:
            "L'IMRA a bâti un pont respectueux entre l'empirisme des guérisseurs malgaches et les standards de la pharmacologie internationale.",
        },
      ],
    },
  ],
};
