import { SeedTrack } from './seed.types.js';

export const folkloreAnganoTrack: SeedTrack = {
  slug: 'contes-legendes-et-mythes-angano',
  title: 'Contes, Légendes et Mythes Fondateurs (Angano sy Arira)',
  titleMg: 'Angano sy Arira : Lovantsofina sy Fedrà Ntaolo',
  description:
    'Plongez dans l’univers enchanté de la tradition orale malgache : l’épopée d’Ibonia, Trimobe sy Ifara, la fée Ranoro et les géants bâtisseurs.',
  descriptionMg:
    'Midira amin’ny tontolo mahagagan’ny angano malagasy : Ibonia mahery fo, Trimobe sy Ifara, Ranoro andriamani-bavy ary ireo arira fahiny.',
  level: 'BEGINNER',
  icon: 'BookOpen',
  color: '#D97706',
  orderIndex: 10,
  estimatedMinutes: 40,
  lessons: [
    // ─── LEÇON 1 : L'ART DE CONTER ───
    {
      slug: 'l-art-de-conter-angano-angano-arira-arira',
      title:
        '« Angano, angano, arira, arira ! » : les lois sacrées du conteur du soir',
      titleMg:
        'Ny Fombafomba amin’ny Fitantaran-ketsika : « Angano, angano ! »',
      summary:
        'Découvrez les rituels du conte malgache : le fady de raconter le jour, la formule rituelle de véracité et le rôle éducatif des aînés au coin du feu.',
      summaryMg:
        'Fantaro ny fomban’ny angano : ny fady mitantara antoandro, ny teny fiandohana sy famaranana ary ny fitaizana amin’ny alina.',
      type: 'LITERATURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, le conte (angano) n'est pas un simple divertissement innocent : c'est l'école du soir de la société traditionnelle. Dès la nuit tombée, autour du foyer (fatapera), les grands-parents réunissent les enfants. La tradition interdit formellement de raconter des contes en plein jour : la croyance populaire avertissait les imprudents en disant : « Izay mitantara angano antoandro manjary boka na marary ray aman-dreny » (Celui qui conte le jour attirera le malheur sur ses parents).",
          textMg:
            "Zava-dehibe amin'ny fanabeazana malagasy ny angano. Tsy azo tantaraina amin'ny antoandro ny angano satria fady, fa amin'ny alina rehefa vita ny asa am-pandeferana no iantsoana hoe : 'Angano, angano, arira, arira !' mba hampitana fahendrena amin'ny ankizy.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'A / NGA / NO',
          phonetic: 'an-ga-nou',
          frenchEquivalent:
            "Le mot « Angano » se prononce avec un 'NGA' vélaire doux et un 'O' fermé sonore.",
          sampleWordMg: 'Angano',
          sampleTranslationFr: 'Le conte traditionnel / La légende populaire',
        },
        {
          type: 'concept',
          termMg: '« Angano, angano, arira, arira ! »',
          phonetic: 'an-ga-nou, an-ga-nou, a-ri-ra, a-ri-ra',
          meaningFr: '« Conte, ô conte ! Récit fabuleux des temps anciens ! »',
          explanation:
            "Formule d'ouverture solennelle prononcée par le conteur. L'assemblée répond en chœur : « Izahay miteny, Ianareo mihaino ! » ou « Tantarao ! ».",
        },
        {
          type: 'concept',
          termMg: '« Tsy izaho no mpandainga fa ny Ntaolo... »',
          phonetic: 'tsi i-za-hou nou mpan-dain-ga fa ni n-ta-ou-lou',
          meaningFr:
            '« Je ne suis point un menteur, ce sont les Anciens qui l’ont transmis »',
          explanation:
            "Formule de clôture rituelle d'humilité par laquelle le conteur se dégage de toute invention personnelle pour honorer la chaîne de la mémoire ancestrale.",
        },
        {
          type: 'concept',
          termMg: 'Fatapera sy Alina mangina',
          phonetic: 'fa-ta-pe-ra si a-li-na man-gi-na',
          meaningFr: 'Le foyer de cuisson chaud et le calme de la nuit étoilée',
          explanation:
            "Cadre intime où la parole imagée du conteur prend vie dans l'obscurité, éveillant l'écoute et l'imagination des jeunes enfants.",
        },
        {
          type: 'example',
          textMg:
            "Angano, angano, arira, arira ! Izaho tsy mpandainga fa ny Ntaolo fahiny no nampita ity fahendrena ity amin'ny taranaka.",
          textFr:
            'Conte, ô conte des temps anciens ! Je ne suis point un menteur, car ce sont nos Anciens qui ont confié cette sagesse à la postérité.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "L'interdiction de conter le jour avait une utilité sociale pragmatique très claire : empêcher les enfants et les jeunes bergers de se dissiper pendant les heures de travail aux champs et de garde des troupeaux !",
          textMg:
            "Ny antony marina nandraran'ny Ntaolo ny angano antoandro dia mba tsy ho variana ny ankizy ka hanadino ny asa fambolena sy ny fiandrasana omby.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la célèbre formule rituelle d’ouverture prononcée par le conteur au début de chaque angano ?',
          questionMg:
            'Inona ny teny fanombohana fanaon’ny mpitantara angano malagasy ?',
          choices: [
            '« Angano, angano, arira, arira ! »',
            '« Il était une fois »',
            '« Mandrosoa homana »',
            '« Veloma finaritra »',
          ],
          correctIndex: 0,
          explanation:
            "« Angano, angano, arira, arira ! » est l'incantation traditionnelle qui ouvre la porte du monde des légendes.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi était-il rigoureusement fady (interdit) de raconter des contes en plein jour selon la coutume ?',
          questionMg: 'Nahoana no fady ny mitantara angano amin’ny antoandro ?',
          choices: [
            'Pour éviter que les enfants et bergers ne se déconcentrent de leurs travaux indispensables aux champs',
            'Parce que le soleil rend les contes faux',
            'Parce que les animaux ont peur',
            'Parce que la loi coloniale l’imposait',
          ],
          correctIndex: 0,
          explanation:
            "Le tabou protégeait le temps de travail agricole et pastoral diurne, réservant la veillée du soir à l'apprentissage moral.",
        },
        {
          type: 'quiz',
          question:
            'Par quelle formule d’humilité le conteur malgache clôture-t-il traditionnellement son récit ?',
          questionMg:
            'Inona ny teny famaranana fanaon’ny mpitantara mba tsy hilazana azy ho mpandainga ?',
          choices: [
            '« Tsy izaho no mpandainga fa ny Ntaolo no niteny izany »',
            '« Tout est inventé de ma poche »',
            '« Payez-moi maintenant »',
            '« Fin de l’histoire »',
          ],
          correctIndex: 0,
          explanation:
            "Le conteur rappelle avec modestie qu'il n'est que le transmetteur fidèle de la mémoire des ancêtres premiers (*Ntaolo*).",
        },
        {
          type: 'quiz',
          question:
            'Quel rôle éducatif central les contes (angano) jouaient-ils dans la société villageoise traditionnelle ?',
          questionMg:
            'Inona ny anjara toerana lehibe indrindra nentin’ny angano teo amin’ny fanabeazana ny zaza ?',
          choices: [
            'Enseigner la morale, la justice cosmique (tody), le respect d’autrui et la prudence face aux dangers',
            'Apprendre à faire la guerre contre les voisins',
            'Faire peur pour empêcher les enfants de manger',
            'Remplacer les juges du tribunal',
          ],
          correctIndex: 0,
          explanation:
            "Les angano servaient d'école éthique vivante : le bien y était toujours récompensé et la cruauté ou l'égoïsme punis.",
        },
        {
          type: 'quiz',
          question:
            'Autour de quel élément du foyer familial les contes étaient-ils traditionnellement déclamés le soir ?',
          questionMg:
            'Teo amin’inona no nivorian’ny fianakaviana nihaino angano amin’ny alina ?',
          choices: [
            'Autour du foyer chaud de la cuisine (fatapera) ou sur la natte du salon',
            'Au sommet du toit de la maison',
            'Au milieu de la rizière inondée',
            'Dans l’enclos des zébus',
          ],
          correctIndex: 0,
          explanation:
            "La douce chaleur du foyer et la pénombre de la veillée créaient l'intimité propice à l'écoute des récits merveilleux.",
        },
      ],
    },
    // ─── LEÇON 2 : L'ÉPOPÉE D'IBONIA ───
    {
      slug: 'l-epopee-heroique-d-ibonia',
      title: 'L’Épopée héroïque d’Ibonia : le grand mythe initiatique malgache',
      titleMg: 'Ny Tantaràn’Ibonia : Ilay Mahery fo sy Mpiaro ny Rariny',
      summary:
        'Parcourez le chef-d’œuvre de la mythologie malgache : la naissance miraculeuse d’Ibonia, ses métamorphoses et sa quête pour délivrer sa fiancée Iampelasoa.',
      summaryMg:
        'Diniho ny tantara lehibe indrindra amin’ny fedrà malagasy : ny nahaterahan’Ibonia, ny diany nanam-pahasahiana ary ny fandreseny ny ratsy.',
      type: 'LITERATURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Considérée par les universitaires et ethnologues comme l'Iliade ou la Chanson de Roland de Madagascar, l'épopée d'Iboniamasiboniamanoro (Ibonia) est un monument de la littérature orale mondiale. Né après dix années de gestation miraculeuse, Ibonia refuse les armes ordinaires et choisit la sagesse oratoire et la métamorphose pour affronter l'invincible géant Raivohidambo et délivrer sa fiancée Iampelasoa.",
          textMg:
            "Ny tantaran'Ibonia no vakoka lehibe indrindra amin'ny haisoratra am-bava malagasy. Teraka tamin'ny fomba mahagaga Ibonia, lehilahy hendry sy mahery fo niady tamin'i Raivohidambo mba hanafaka an'Iampelasoa fofombadiny tamin'ny alalan'ny fahendrena sy ny hery.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'I / BO / NIA',
          phonetic: 'i-bou-ni-a',
          frenchEquivalent:
            "Le nom « Ibonia » signifie littéralement 'celui au regard pur et limpide / celui dont la présence illumine'.",
          sampleWordMg: 'Ibonia',
          sampleTranslationFr: 'Ibonia (le héros solaire initiatique malgache)',
        },
        {
          type: 'concept',
          termMg: 'Iboniamasiboniamanoro',
          phonetic: 'i-bou-ni-a-ma-si-bou-ni-a-ma-nou-rou',
          meaningFr: 'Le nom complet sacré du héros mythologique invaincu',
          explanation:
            "Héros qui choisit lui-même son destin dès le ventre de sa mère et refuse de naître tant que le monde n'est pas purifié de l'injustice.",
        },
        {
          type: 'concept',
          termMg: 'Iampelasoa (Ny Ampela Soa)',
          phonetic: 'i-am-pe-la-sou-a',
          meaningFr:
            'La fiancée idéale, symbole de grâce, de vertu et de fidélité',
          explanation:
            "Héroïne céleste dont la capture par le monstre tyrannique déclenche la quête initiatique d'Ibonia à travers monts et fleuves.",
        },
        {
          type: 'concept',
          termMg: 'Fandresena amin’ny Fahendrena sy Kabary',
          phonetic: 'fan-dre-se-na a-min-ni fa-hen-dre-na',
          meaningFr:
            'La victoire par l’intelligence oratoire plutôt que par la force brute',
          explanation:
            'Spécificité sublime du mythe malgache : Ibonia triomphe de ses ennemis en perçant leurs secrets par la ruse de la parole mesurée.',
        },
        {
          type: 'example',
          textMg:
            "Ibonia dia tsy nirehareha tamin'ny herin'ny sabatra fa nampiasa ny saina sy ny rariny mba handresena ny maizina.",
          textFr:
            "Ibonia ne tirait point orgueil de la force de son épée, mais usait d'intelligence et de justice pour terrasser les ténèbres.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le texte intégral de l'épopée d'Ibonia a été recueilli pour la première fois par écrit dans les années 1870 par des missionnaires et pasteurs malgaches, s'étendant sur des milliers de vers poétiques rythmés d'une beauté saisissante.",
          textMg:
            "Tamin'ny taona 1870 no noraisina an-tsoratra voalohany ny tononkalo miezinezina amin'ny tantaran'Ibonia ahitana andininy an-jatony maro mirindra kanto.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'À quelle grande œuvre littéraire mondiale l’épopée malgache d’Ibonia est-elle souvent comparée par les historiens ?',
          questionMg:
            'Amin’inona amin’ireo boky malaza eran-tany no ampitahana matetika ny tantaran’Ibonia ?',
          choices: [
            'À l’Iliade d’Homère ou à l’Épopée de Gilgamesh pour sa grandeur héroïque mythique',
            'À un roman policier moderne',
            'À une pièce comique de théâtre de boulevard',
            'À un manuel d’économie contemporain',
          ],
          correctIndex: 0,
          explanation:
            "Ibonia est la grande épopée fondatrice de Madagascar, narrant le parcours initiatique d'un demi-dieu pour rétablir l'ordre cosmique.",
        },
        {
          type: 'quiz',
          question: 'Qui est Iampelasoa dans l’épopée d’Ibonia ?',
          questionMg: 'Iza moa Iampelasoa ao anatin’ny tantaran’Ibonia ?',
          choices: [
            'La fiancée prédestinée d’Ibonia qu’il part délivrer des mains du tyran Raivohidambo',
            'La grand-mère magicienne du village',
            'La reine d’une île lointaine en guerre',
            'La sœur aînée d’Ibonia',
          ],
          correctIndex: 0,
          explanation:
            "Iampelasoa est l'incarnation de la beauté et de la fidélité, dont le mariage avec Ibonia restaure la paix universelle.",
        },
        {
          type: 'quiz',
          question:
            'Comment Ibonia choisit-il principalement de vaincre ses adversaires lors de ses épreuves initiatiques ?',
          questionMg:
            'Ahoana no tena fomba nampiasain’Ibonia nandresena ireo sakana sy fahavalony ?',
          choices: [
            'Par l’intelligence, la métamorphose physique et la maîtrise oratoire du verbe juste',
            'En utilisant des canons et de la dynamite',
            'En fuyant sans jamais affronter personne',
            'En achetant ses ennemis avec de l’or',
          ],
          correctIndex: 0,
          explanation:
            "Ibonia illustre l'idéal malgache : la suprématie de l'esprit, de la ruse vertueuse et de la parole de sagesse sur la force brute.",
        },
        {
          type: 'quiz',
          question:
            'Quelle particularité extraordinaire accompagne la naissance d’Ibonia dans le récit ?',
          questionMg:
            'Inona ny zava-mahatsikaiky niavaka tamin’ny nahaterahan’Ibonia ?',
          choices: [
            'Il parle déjà depuis le sein de sa mère et choisit lui-même le moment et les conditions de sa venue au monde',
            'Il naît avec une barbe blanche',
            'Il naît au fond de la mer dans une coquille',
            'Il tombe du ciel sous la forme d’une étoile filante',
          ],
          correctIndex: 0,
          explanation:
            "Dès le ventre de sa mère Ranoasoa, Ibonia s'exprime et impose sa volonté royale, affirmant sa nature souveraine primordiale.",
        },
        {
          type: 'quiz',
          question:
            'Quel grand message moral l’épopée d’Ibonia transmet-elle à la société malgache ?',
          questionMg:
            'Inona ny lesona lehibe ampianarin’ny tantaran’Ibonia amin’ny fiarahamonina ?',
          choices: [
            'La fidélité au serment, la persévérance inébranlable et le triomphe de la justice sur la tyrannie',
            'Qu’il faut toujours rester seul sans amis',
            'Que la richesse matérielle est plus forte que l’honneur',
            'Que le combat physique est la seule solution',
          ],
          correctIndex: 0,
          explanation:
            "Ibonia personnifie l'intégrité héroïque : nulle épreuve ne peut abattre celui dont le cœur est pur et dévoué à la justice.",
        },
      ],
    },
    // ─── LEÇON 3 : TRIMOBE SY IFARA ───
    {
      slug: 'trimobe-sy-ifara-l-ogre-et-la-jeune-fille',
      title:
        'Trimobe sy Ifara : la pureté de la jeune fille face à l’ogre glouton',
      titleMg:
        'Trimobe sy Ifara : Ny Fandresen’ny Fahatsorana sy ny Hatsaram-panahy',
      summary:
        'Découvrez le conte le plus populaire de Madagascar : la trahison des sœurs jalouses, l’ogre Trimobe et l’oiseau messager Fody secourable.',
      summaryMg:
        'Iray amin’ireo angano malaza indrindra : ny fialonan’ireo zoky vavy, ny fitaky Trimobe ary ny famonjena nentin’ilay vorona kely.',
      type: 'LITERATURE',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Parmi tous les contes racontés aux enfants malgaches, 'Trimobe sy Ifara' est le plus universellement aimé. Abandonnée dans la forêt par ses sœurs aînées jalouses de sa beauté, la jeune et douce Ifara est capturée par le redoutable monstre Trimobe (un ogre gigantesque et vorace). Prisonnière dans sa case en attendant d'être dévorée, Ifara réussit à s'évader grâce à son ingéniosité et à l'aide précieuse d'un petit oiseau fody au cœur compatissant.",
          textMg:
            "Iray amin'ny angano tena ankafizin'ny ankizy malagasy ny tantaran'Ifara sy Trimobe. Nafoy tany an'ala noho ny fialonan-jokiny i Ifara ka azon'i Trimobe biby goavam-be mpihina-n'olona. Noho ny fahaizany sy ny fanampian'ny vorona kely fody anefa dia afaka soa aman-tsara izy.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TRI / MO / BE',
          phonetic: 'tri-mou-be',
          frenchEquivalent:
            "Le nom « Trimobe » assemble 'Trimo' (l'ogre mythique) et 'Be' (gigantesque, démesuré, vorace).",
          sampleWordMg: 'Trimobe',
          sampleTranslationFr: 'Trimobe (l’ogre légendaire vorace des contes)',
        },
        {
          type: 'concept',
          termMg: 'Ifara (Ny Faralahy / Faravavy)',
          phonetic: 'i-fa-ra',
          meaningFr: 'La cadette bien-aimée, symbole d’innocence et de pureté',
          explanation:
            'Dans les contes malgaches, le dernier-né (Ifara) incarne souvent la vertu, la sincérité et le triomphe de la simplicité sur la ruse.',
        },
        {
          type: 'concept',
          termMg: 'Vorona Fody mpanampy',
          phonetic: 'vou-rou-na fou-di',
          meaningFr: 'Le petit cardinal rouge (foudi) messager de secours',
          explanation:
            "L'animal auxiliaire providentiel qui récompense la gentillesse d'Ifara en lui révélant le secret pour s'échapper du piège de l'ogre.",
        },
        {
          type: 'concept',
          termMg: 'Fandresena ny fialonana sy ny fitiavan-tena',
          phonetic: 'fan-dre-se-na ni fi-a-lou-na-na',
          meaningFr:
            'La condamnation de la jalousie fraternelle par la justice immanente',
          explanation:
            "Morale profonde du conte : les sœurs jalouses finissent confondues par la honte, tandis qu'Ifara trouve le bonheur et l'élévation royale.",
        },
        {
          type: 'example',
          textMg:
            "Ny hatsaram-panahin'Ifara tamin'ny zava-boahary no namonjy ny ainy : izay mamafy soa dia mijinja fitahiana.",
          textFr:
            "La bonté de cœur d'Ifara envers la nature lui sauva la vie : quiconque sème la bonté récolte la bénédiction céleste.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les versions anciennes du conte, Ifara lance derrière elle des objets magiques qui se transforment : un balai d'épines qui devient une forêt infranchissable, et une gourde d'eau qui devient un immense lac engloutissant Trimobe !",
          textMg:
            "Rehefa nandositra i Ifara dia nitoraka kifafa lasa ala mikitroka sy rano lasa farihy lehibe nanalentika an'i Trimobe tsy hahafahany manenjika intsony.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Pour quelle mauvaise raison les sœurs aînées d’Ifara décident-elles de l’abandonner seule dans la forêt sauvage ?',
          questionMg:
            'Inona no antony ratsy nandaozan’ireo zokin’Ifara azy irery tany an’ala ?',
          choices: [
            'Parce qu’elles étaient jalouses de sa beauté, de sa bonté et de l’amour que ses parents lui portaient',
            'Parce qu’Ifara avait volé leur argent',
            'Parce que le village était trop petit',
            'Parce qu’Ifara voulait devenir reine de force',
          ],
          correctIndex: 0,
          explanation:
            'La jalousie destructrice des aînées est le moteur dramatique du conte, sévèrement condamnée par la morale malgache.',
        },
        {
          type: 'quiz',
          question:
            'Quel monstre redoutable de la mythologie malgache capture Ifara dans sa chaumière ?',
          questionMg:
            'Iza ilay biby lehibe masiaka nambabo an’Ifara tao an-tranony ?',
          choices: [
            'L’ogre Trimobe',
            'Un crocodile marin',
            'Un lémurien géant',
            'Un dragon ailé',
          ],
          correctIndex: 0,
          explanation:
            "Trimobe est l'archétype de l'ogre insatiable et brutal dans le folklore malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quel petit animal secourable récompense la gentillesse d’Ifara en l’aidant à s’échapper ?',
          questionMg:
            'Inona ilay biby kely tsara fanahy nanampy an’Ifara handositra an’i Trimobe ?',
          choices: [
            'Le petit oiseau rouge Fody (cardinal malgache)',
            'Un caméléon vert',
            'Une chauve-souris aveugle',
            'Un poisson du fleuve',
          ],
          correctIndex: 0,
          explanation:
            "L'oiseau Fody apporte à Ifara les conseils précieux pour déjouer la surveillance de l'ogre.",
        },
        {
          type: 'quiz',
          question:
            'En quoi se transforme la gourde d’eau magique qu’Ifara jette derrière elle pour stopper la course de Trimobe ?',
          questionMg:
            'Nanjary inona ilay rano natsipin’Ifara tany aoriany mba hanakanana an’i Trimobe ?',
          choices: [
            'En un vaste lac profond et tumultueux dans lequel Trimobe se noie',
            'En une montagne de diamants',
            'En un mur de briques rouges',
            'En un nuage de fumée noire',
          ],
          correctIndex: 0,
          explanation:
            "L'eau se métamorphose en une étendue lacustre infranchissable, motif merveilleux universel du conte initiatique.",
        },
        {
          type: 'quiz',
          question:
            'Quelle grande leçon morale les enfants malgaches retiennent-ils du triomphe final d’Ifara ?',
          questionMg:
            'Inona ny fahendrena lehibe fonosin’ny fiafaran’ny tantaran’Ifara ?',
          choices: [
            'La bonté d’âme et l’humilité finissent toujours par triompher de la cruauté et de la jalousie',
            'Qu’il faut toujours obéir aux personnes méchantes',
            'Que la beauté physique est la seule chose importante',
            'Qu’il ne faut jamais faire confiance à aucun animal',
          ],
          correctIndex: 0,
          explanation:
            'Le conte enseigne que la sincérité du cœur et la bienveillance attirent la protection des forces bienfaisantes du destin.',
        },
      ],
    },
    // ─── LEÇON 4 : RANORO, LA FÉE DU LAC D'ITASY ───
    {
      slug: 'ranoro-la-fee-ondine-du-lac-d-itasy',
      title: 'Ranoro, la femme ondine du lac d’Itasy : le pacte de l’eau brisé',
      titleMg: 'Ranoro Andrianani-bavy : Ilay Zazavavindrano tao Itasy',
      summary:
        'Pénétrez dans la légende poétique d’Andriambavirano Ranoro : l’ondine d’Ampefy, son union terrestre avec Andriambahoaka et les fady du lac.',
      summaryMg:
        'Fantaro ny fedrà kanton’i Ranoro tao amin’ny farihin’Itasy : fanambadiana tamin’ny olombelona, ny fady vaky ary ny fitsaohana azy ho masina.',
      type: 'LITERATURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au cœur des paysages volcaniques de l'Itasy, près des chutes de la Lily et d'Ampefy, flotte la légende immortelle de Ranoro. Créature aquatique féerique (Zazavavindrano ou ondine), Ranoro accepta d'épouser le souverain terrestre Andriambahoaka à une seule condition sacrée : qu'il ne prononce jamais devant elle le mot 'sira' (sel) ni ne lui reproche son origine aquatique. L'oubli de ce serment provoqua sa disparition dans les eaux profondes du lac, où elle devint une divinité protectrice vénérée.",
          textMg:
            "Any amin'ny farihin'Itasy sy Ampefy, malaza tokoa ny tantaran-dRanoro, zazavavindrano tsara tarehy nanambady an'Andriambahoaka. Fepetra tokana no nomeny : tsy mahazo manonona ny teny hoe 'sira' eo anatrehany. Rehefa nandika izany ilay vadiny dia nilentika tao anaty farihy i Ranoro ka lasa andriamani-bavy hajaina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RA / NO / RO',
          phonetic: 'ra-nou-rou',
          frenchEquivalent:
            "Le nom « Ranoro » dérive de 'Rano' (l'eau pure et source de vie) et 'Tso-drano' (la bénédiction bienfaisante).",
          sampleWordMg: 'Ranoro',
          sampleTranslationFr:
            'Ranoro (la déesse ondine protectrice des eaux d’Itasy)',
        },
        {
          type: 'concept',
          termMg: 'Zazavavindrano (Andriambavirano)',
          phonetic: 'za-za-va-vin-dra-nou',
          meaningFr:
            'La fée des eaux / L’ondine céleste d’une beauté surnaturelle',
          explanation:
            "Être mystique bienveillant vivant au fond des lacs et des cours d'eau sacrés, dispensatrice de fécondité et de pluies abondantes.",
        },
        {
          type: 'concept',
          termMg: 'Ny Fady sira sy ny Fanekena masina',
          phonetic: 'ni fa-di si-ra si ni fa-ne-ke-na ma-si-na',
          meaningFr: 'Le tabou du sel et la sacralité de la parole d’alliance',
          explanation:
            "Le sel, produit minéral asséchant la pureté de l'eau douce, était l'interdit majeur scellant le mariage entre le monde visible et invisible.",
        },
        {
          type: 'concept',
          termMg: 'Doany Ranoro eny Ampefy',
          phonetic: 'dou-a-ni ra-nou-rou e-ni am-pe-fi',
          meaningFr: 'Le sanctuaire rocheux vénéré au bord du lac d’Itasy',
          explanation:
            "Lieu de pèlerinage où des milliers de personnes viennent chaque année demander des bénédictions de santé et d'enfants en offrant du miel et des pièces.",
        },
        {
          type: 'example',
          textMg:
            'Ny tantaran-dRanoro dia mampahatsiahy antsika fa ny teny nomena dia fanekena masina tsy azo dikaina na oviana na oviana.',
          textFr:
            "La légende de Ranoro nous rappelle solennellement que la parole donnée est un serment sacré qu'on ne peut violer sans conséquence.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Aujourd'hui encore, autour du sanctuaire de Ranoro au lac d'Itasy, les pèlerins et les habitants respectent scrupuleusement le fady : il est formellement interdit d'apporter du porc ou du sel marin près de son rocher sacré.",
          textMg:
            "Mandraka ankehitriny, fady indrindra ny mitondra henakisoa na sira manodidina ny doany misy ny vato masin-dRanoro ao amin'ny farihin'Itasy.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle était l’unique condition imposée par l’ondine Ranoro à son époux terrestre Andriambahoaka pour rester auprès de lui ?',
          questionMg:
            'Inona ilay fepetra tokana napetrak’i Ranoro tamin’ny vadiny Andriambahoaka ?',
          choices: [
            'Ne jamais prononcer le mot « sel » (sira) ni lui reprocher son origine aquatique',
            'Lui construire un château en or',
            'Ne jamais parler à ses parents',
            'Chasser tous les poissons du lac',
          ],
          correctIndex: 0,
          explanation:
            "Le sel représentait l'interdit absolu liant l'ondine céleste au monde des hommes mortels.",
        },
        {
          type: 'quiz',
          question:
            'Dans quelle région géographique et volcanique de Madagascar la légende de Ranoro est-elle ancrée ?',
          questionMg:
            'Aiza no toerana malaza misy ny farihin’Itasy nisehoan’ny tantaran-dRanoro ?',
          choices: [
            'Dans la région d’Itasy, autour d’Ampefy et des chutes de la Lily',
            'Dans le désert d’Androy',
            'Sur les plages de Nosy Be',
          ],
          correctIndex: 0,
          explanation:
            "Le lac d'Itasy, d'origine volcanique, est le cœur géographique et spirituel de la légende de Ranoro.",
        },
        {
          type: 'quiz',
          question:
            'Que fit Ranoro lorsque son époux, dans un accès de colère malheureux, enfreignit son serment et prononça le mot interdit ?',
          questionMg:
            'Inona no nataon-dRanoro rehefa nandika ny fifanekena ilay vadiny ?',
          choices: [
            'Elle s’enveloppa dans son lamba et plongea pour toujours dans les profondeurs du lac d’Itasy',
            'Elle déclencha une guerre contre le village',
            'Elle se transforma en oiseau noir',
            'Elle alla vivre dans un village voisin',
          ],
          correctIndex: 0,
          explanation:
            'Fidèle aux lois des esprits aquatiques, Ranoro regagna son élément originel dès la rupture de la promesse.',
        },
        {
          type: 'quiz',
          question:
            'Quels bienfaits spirituels les pèlerins viennent-ils implorer aujourd’hui sur le sanctuaire (Doany) de Ranoro ?',
          questionMg:
            'Inona no fitahiana angatahin’ny olona tonga mivavaka ao amin’ny doany Ranoro ?',
          choices: [
            'La bénédiction de la fécondité (avoir des enfants), la santé et la paix dans le foyer',
            'Le gain à la loterie moderne',
            'Le pouvoir de voler dans les airs',
            'La destruction de ses voisins',
          ],
          correctIndex: 0,
          explanation:
            'Ranoro est vénérée comme une mère compatissante qui bénit particulièrement les femmes stériles et apporte la pluie.',
        },
        {
          type: 'quiz',
          question:
            'Que symbolise le mythe de Ranoro dans la philosophie malgache des relations humaines ?',
          questionMg:
            'Inona ny hevitra lalina mampieritreritra ampianarin’ny tantaran-dRanoro ?',
          choices: [
            'Le respect absolu des engagements pris dans le mariage et la fragilité de la confiance mutuelle',
            'Qu’il ne faut jamais se marier',
            'Que les poissons sont dangereux',
            'Que l’eau salée est meilleure que l’eau douce',
          ],
          correctIndex: 0,
          explanation:
            "La légende illustre qu'une seule parole blessante ou imprudente suffit à briser l'alliance la plus pure et à faire disparaître le bonheur.",
        },
      ],
    },
    // ─── LEÇON 5 : DARAFIFY LE GÉANT ───
    {
      slug: 'darafify-le-geant-batisseur-et-les-arira',
      title: 'Darafify le géant bâtisseur et les récits mythologiques côtiers',
      titleMg:
        'Darafify Ilay Goavam-be : Arira sy Fanorenana tany amorontsiraka',
      summary:
        'Explorez les mythes de géants de Madagascar : l’épopée de Darafify, les pierres colossales qu’il déplaçait d’une seule main et l’origine des reliefs côtiers.',
      summaryMg:
        'Diniho ny tantaran’i Darafify ilay lehilahy goavana nahavita nanorina sy namindra vato lehibe tany amin’ny morontsiraka atsinanana.',
      type: 'LITERATURE',
      orderIndex: 5,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la tradition orale des côtes orientales et septentrionales de Madagascar, les 'Arira' désignent des récits mythologiques grandioses peuplés d'êtres aux proportions gigantesques. Le plus célèbre d'entre eux est Darafify, un colosse bienfaiteur d'une force prodigieuse. La légende raconte qu'il enjambait les rivières d'un seul pas, déplaçait des collines rocheuses pour creuser des canaux et sculptait le littoral de l'océan Indien de ses propres mains.",
          textMg:
            "Ny 'Arira' dia tantara fedrà miresaka olona manana hery mahagaga tamin'ny vanim-potoana fahagola. I Darafify no malaza indrindra amin'izany : lehilahy goavana nahavita nitsambikina renirano tamin'ny dingana tokana ary namorona ireo zohy sy harambato any avaratra.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DA / RA / FI / FY',
          phonetic: 'da-ra-fi-fi',
          frenchEquivalent:
            "Le nom « Darafify » s'articule vivement avec deux 'F' doux et légers.",
          sampleWordMg: 'Arira',
          sampleTranslationFr:
            'Le mythe fabuleux / Le récit de géants d’autrefois',
        },
        {
          type: 'concept',
          termMg: 'Darafify ilay goavam-be mpanorina',
          phonetic: 'da-ra-fi-fi i-lai gou-a-vam-be',
          meaningFr: 'Darafify le titan bâtisseur et protecteur',
          explanation:
            "Héros mythologique à qui les populations côtières attribuent l'érection des mégalithes inexpliqués et le tracé des anciennes voies fluviales.",
        },
        {
          type: 'concept',
          termMg: 'Arira sy Fedrà fahagola',
          phonetic: 'a-ri-ra si fe-dra fa-ha-gou-la',
          meaningFr:
            'Les grands mythes cosmogoniques et récits fabuleux des origines',
          explanation:
            "Genre littéraire oral distinct de l'angano ordinaire, traitant du temps où les géants et les premiers hommes transformaient la terre.",
        },
        {
          type: 'concept',
          termMg: 'Diam-be tamin’ny harambato',
          phonetic: 'di-am-be ta-min-ni ha-ram-ba-tou',
          meaningFr: 'Les empreintes géantes gravées dans la roche granitique',
          explanation:
            "Cavités naturelles creusées par l'érosion sur les falaises côtières que la légende populaire interprète comme les pas colossaux de Darafify.",
        },
        {
          type: 'example',
          textMg:
            "Ireo arira tranainy momba an'i Darafify dia mampiseho ny fomba nandraisan'ny Ntaolo ny haben'ny natiora sy ny herin'ny tany.",
          textFr:
            "Les mythes anciens sur Darafify révèlent comment nos ancêtres concevaient avec poésie l'immensité de la nature et les forces géologiques.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans la baie d'Antongil et près de Vohémar, plusieurs rochers mégalithiques portent encore le nom de 'Vaton'i Darafify' (les pierres de Darafify), rappelant aux pêcheurs la mémoire vivante de ces bâtisseurs mythiques.",
          textMg:
            "Any amin'ny Helodranon'Antongil sy Vohémar, mbola misy vato goavana antsoina hoe Vaton'i Darafify izay inoan'ny olona fa nentin'ilay goavam-be teo.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Qui était Darafify dans les récits mythologiques (Arira) des régions côtières de Madagascar ?',
          questionMg:
            'Iza moa i Darafify teo amin’ny arira sy lovantsofina amorontsiraka ?',
          choices: [
            'Un géant bienfaiteur légendaire d’une force herculéenne réputé pour avoir façonné les paysages',
            'Un roi historique du XIXe siècle',
            'Un soldat français de l’époque coloniale',
            'Un marchand d’esclaves redouté',
          ],
          correctIndex: 0,
          explanation:
            'Darafify est le géant mythique le plus célèbre du folklore côtier, incarnation de la force créatrice de la nature.',
        },
        {
          type: 'quiz',
          question:
            'Que désigne spécifiquement le terme littéraire malgache « Arira » par rapport à l’angano ordinaire ?',
          questionMg:
            'Inona no mampiavaka ny « Arira » amin’ny angano tsotra ?',
          choices: [
            'Un mythe grandiose aux proportions gigantesques relatant l’ère des géants et la création du monde',
            'Une chanson de berceuse pour endormir les bébés',
            'Une recette de cuisine',
            'Une lettre administrative officielle',
          ],
          correctIndex: 0,
          explanation:
            "L'Arira relève de la mythologie héroïque et cosmologique, mettant en scène des titans et des prodiges telluriques.",
        },
        {
          type: 'quiz',
          question:
            'Quelle prouesse colossale la légende populaire prête-t-elle à Darafify pour traverser les grands fleuves de l’Est ?',
          questionMg:
            'Inona ny fahaizana mahagaga lazain’ny tantara fa nananan’i Darafify rehefa mamakivaky renirano ?',
          choices: [
            'Il les franchissait d’une seule enjambée grâce à sa taille démesurée',
            'Il buvait toute l’eau du fleuve d’un seul coup',
            'Il construisait des bateaux à moteur',
            'Il volait comme un aigle',
          ],
          correctIndex: 0,
          explanation:
            "La légende raconte que Darafify était si immense qu'un seul pas lui suffisait pour passer d'une rive à l'autre.",
        },
        {
          type: 'quiz',
          question:
            'Comment les habitants de la côte Nord-Est expliquent-ils la présence de gigantesques cuvettes dans la roche dure ?',
          questionMg:
            'Ahoana no anazavan’ny mponina any Avaratra-Atsinanana ireny lavaka lehibe amin’ny vato ireny ?',
          choices: [
            'Comme l’empreinte des pas de géant laissée par Darafify lors de sa marche vers la mer',
            'Comme l’impact de météorites extraterrestres',
            'Comme des trous creusés par des canons modernes',
            'Comme l’œuvre de termites géantes',
          ],
          correctIndex: 0,
          explanation:
            "Ces formes d'érosion géologique côtière sont poétiquement interprétées comme les pas fossilisés du colosse Darafify.",
        },
        {
          type: 'quiz',
          question:
            'Quel est l’intérêt culturel majeur de préserver ces récits d’Arira dans le patrimoine malgache ?',
          questionMg:
            'Nahoana no zava-dehibe ny fitahirizana ireny arira tranainy ireny amin’ny kolontsaina malagasy ?',
          choices: [
            'Parce qu’ils témoignent de la richesse de l’imaginaire poétique et de la manière dont les ancêtres expliquait la géographie',
            'Pour prouver scientifiquement que les géants existaient',
            'Pour interdire la pêche en mer',
            'Pour remplacer les cours d’histoire moderne',
          ],
          correctIndex: 0,
          explanation:
            'Les Arira constituent une mémoire poétique inestimable, expliquant avec ferveur la beauté et le mystère des paysages de Madagascar.',
        },
      ],
    },
  ],
};
