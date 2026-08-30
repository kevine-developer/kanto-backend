export interface SeedQuestion {
  template: string[];
  correctWord: string;
  choices: string[];
  french: string;
  explanation: string;
}

export interface SeedLevel {
  levelNumber: number;
  titleMg: string;
  titleFr: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  questions: SeedQuestion[];
}

export const INITIAL_MISSING_WORD_LEVELS: SeedLevel[] = [
  {
    levelNumber: 1,
    titleMg: 'Mora',
    titleFr: 'Débutant',
    description: 'Ny fototry ny fahendrena sy ny zava-boahary.',
    difficulty: 'EASY',
    questions: [
      {
        template: ['Ny', '', 'no', 'manazava', 'ny', 'maizina.'],
        correctWord: 'masoandro',
        choices: ['masoandro', 'rivotra', 'kintana', 'orana'],
        french: "Le soleil est ce qui illumine l'obscurité.",
        explanation:
          "Ny masoandro no loharanon'ny hazavana sy ny aina eto an-tany.",
      },
      {
        template: ['Ny', 'vary', 'sy', 'ny', '', 'tsy', 'mifanary.'],
        correctWord: 'rano',
        choices: ['rano', 'vato', 'hazo', 'tsena'],
        french: "Le riz et l'eau sont inséparables.",
        explanation:
          'Ohabolana milaza ny fihavanana mafy orina toy ny vary sy ny rano.',
      },
      {
        template: [
          'Izay',
          'mitambatra',
          '',
          'ary',
          'izay',
          'misaraka',
          'fasika.',
        ],
        correctWord: 'vato',
        choices: ['vato', 'hazo', 'tany', 'rano'],
        french: 'Unis nous sommes du roc, divisés nous sommes du sable.',
        explanation: "Ny herin'ny firaisankina no fototry ny fahombiazana.",
      },
      {
        template: ['Aza', 'manary', '', 'am-parihy.'],
        correctWord: 'lamba',
        choices: ['lamba', 'vola', 'trano', 'vary'],
        french: 'Ne jette pas tes vêtements dans le lac.',
        explanation: 'Tsy tokony hanimba na hanary ny fitaovam-piainana.',
      },
      {
        template: ['Ny', '', 'maro', 'tsy', "vakin'amboa."],
        correctWord: 'omby',
        choices: ['omby', 'akoho', 'kisoa', 'ondry'],
        french:
          "Un troupeau nombreux de zébus n'est pas attaqué par les chiens.",
        explanation: 'Fiaraha-mientana sy firaisankina manoloana ny loza.',
      },
      {
        template: ['Izay', 'mamafy', 'no', ''],
        correctWord: 'mijinja',
        choices: ['mijinja', 'matory', 'mitomany', 'mandositra'],
        french: 'Celui qui sème est celui qui récolte.',
        explanation: 'Ny asa sy ny fiezahana no mitondra vokatra tsara.',
      },
      {
        template: ['Aleo', "halan'olona", 'toy', 'izay', "halan'", ''],
        correctWord: 'Andriamanitra',
        choices: ['Andriamanitra', 'vahoaka', 'mpiray', 'namana'],
        french: "Mieux vaut déplaire aux hommes qu'à Dieu.",
        explanation: "Fifikirana amin'ny fahamarinana sy ny etika ambony.",
      },
      {
        template: ['Ny', '', 'marina', 'toy', 'ny', 'tsolotra.'],
        correctWord: 'teny',
        choices: ['teny', 'hazo', 'vato', 'tany'],
        french: 'La parole vraie est comme une ligne droite.',
        explanation:
          "Ny fahitsiana amin'ny fitenenana sy ny fanaovana ny marina.",
      },
      {
        template: ['Ny', 'adala', 'no', 'tsy', ''],
        correctWord: 'miova',
        choices: ['miova', 'misakafo', 'mandady', 'matory'],
        french: "Seul l'insensé ne change jamais d'avis.",
        explanation:
          'Ny fahaizana mandinika sy mivoatra no mariky ny fahendrena.',
      },
      {
        template: ['Ny', 'maraina', 'mampiseho', 'ny', ''],
        correctWord: 'andro',
        choices: ['andro', 'orana', 'alina', 'rivotra'],
        french: 'Le matin annonce la tournure de la journée.',
        explanation: "Ny fiandohana tsara no manome toky ho an'ny fiafarana.",
      },
    ],
  },
  {
    levelNumber: 2,
    titleMg: 'Antonony',
    titleFr: 'Intermédiaire',
    description: 'Firaisankina, fiezahana ary fiainana andavanandro.',
    difficulty: 'MEDIUM',
    questions: [
      {
        template: ['Ny', '', 'iray', 'tsy', 'mahavita', 'afon-dasy.'],
        correctWord: 'tanana',
        choices: ['tanana', 'tongotra', 'vola', 'trano'],
        french:
          "Une seule main ne peut allumer un feu de camp (L'union fait la force).",
        explanation: 'Mila fiaraha-mientana ny asa goavana.',
      },
      {
        template: ['Ny', 'teny', '', 'mampandry', 'fe.'],
        correctWord: 'mamy',
        choices: ['mamy', 'mahery', 'marikivy', 'hafa'],
        french: 'Les paroles douces apaisent les cœurs et les esprits.',
        explanation: "Ny fahalemem-panahy amin'ny fitenenana dia mamaha olana.",
      },
      {
        template: [
          'Aza',
          'manao',
          "zanak'",
          'ka',
          'ny',
          'tsara',
          'ihany',
          'no',
          'tadiavina.',
        ],
        correctWord: 'ikalahafa',
        choices: ['ikalahafa', 'mpivarotra', 'mpamboly', 'mpitondra'],
        french:
          'Ne fais pas de favoritisme en ne cherchant que le meilleur pour soi.',
        explanation: 'Fitovian-jo sy fizarana ny soa sy ny ratsy.',
      },
      {
        template: ['Ny', 'asa', 'vita', 'no', ''],
        correctWord: 'hisaorana',
        choices: ['hisaorana', 'hitomaniana', 'hahantitra', 'hoharatsiana'],
        french: "C'est pour le travail bien accompli que l'on remercie.",
        explanation: 'Ny asa vita tsara no mendrika fankasitrahana.',
      },
      {
        template: ['Ny', '', 'tsara', 'tahiry', 'tsy', 'lany.'],
        correctWord: 'fahaizana',
        choices: ['fahaizana', 'harena', 'katsaka', 'volamena'],
        french: "Le savoir bien conservé ne s'épuise jamais.",
        explanation: 'Ny fahalalana no harena sarobidy indrindra.',
      },
      {
        template: [
          'Toy',
          'ny',
          'rantsan-tànana',
          'ka',
          'samy',
          'manana',
          'ny',
          '',
          'tandrifiny.',
        ],
        correctWord: 'anjara',
        choices: ['anjara', 'haavony', 'fofony', 'lokony'],
        french: 'Comme les doigts de la main, chacun a son rôle et sa place.',
        explanation:
          'Samy manana ny talentany sy ny anjara asany ny tsirairay.',
      },
      {
        template: ['Ny', 'marina', 'tsy', 'mba', ''],
        correctWord: 'maty',
        choices: ['maty', 'velo', 'resy', 'tonga'],
        french: 'La vérité ne meurt jamais.',
        explanation: 'Mitoetra mandrakizay ny fahamarinana.',
      },
      {
        template: ['Loha-lalana', 'ka', 'tsy', 'mivadika', '', ''],
        correctWord: 'lalana',
        choices: ['lalana', 'orana', 'hazo', 'tsena'],
        french: 'En tête de file, on ne dévie pas de son chemin.',
        explanation:
          'Ny mpitondra dia tokony hitazona ny fitsipika sy ny fitondran-tena mendrika.',
      },
      {
        template: ['Aza', 'midera', 'andro', 'tsy', 'mbola', ''],
        correctWord: 'hariva',
        choices: ['hariva', 'maraina', 'alina', 'maizina'],
        french: 'Ne loue pas la journée avant que le soir ne soit venu.',
        explanation: "Mila mitandrina sy miandry ny fiafaran'ny zava-drehetra.",
      },
      {
        template: ['Izay', 'mahay', 'fihavanana', 'mahavita', ''],
        correctWord: 'zava-dehibe',
        choices: ['zava-dehibe', 'fatiantoka', 'fahavoazana', 'ady'],
        french: "Celui qui cultive l'harmonie réalise de grandes choses.",
        explanation:
          'Ny fihavanana no fototry ny fandrosoana sy ny fahombiazana.',
      },
    ],
  },
  {
    levelNumber: 3,
    titleMg: 'Sarotra',
    titleFr: 'Avancé',
    description: 'Ny soatoavina sy ny fihavanana malagasy.',
    difficulty: 'HARD',
    questions: [
      {
        template: [
          'Aleo',
          'very',
          'tsikalakalam-bola',
          'toy',
          'izay',
          'very',
          '',
        ],
        correctWord: 'fihavanana',
        choices: ['fihavanana', 'harena', 'trano', 'akanjo'],
        french:
          "Mieux vaut perdre de l'argent que de briser l'harmonie des liens fraternels.",
        explanation:
          "Ny fihavanana no soa sarobidy indrindra eo amin'ny fiarahamonina malagasy.",
      },
      {
        template: ['Izay', 'maharitra', 'no', 'tratry', 'ny', ''],
        correctWord: 'tsara',
        choices: ['tsara', 'ratsy', 'marina', 'vola'],
        french: 'Celui qui sait persévérer atteint les bonnes choses.',
        explanation:
          'Fampianarana momba ny faharetana sy ny fikirizana manoloana ny fitsapana.',
      },
      {
        template: ['Ny', '', 'no', 'lalan-kizorana.'],
        correctWord: 'fahendrena',
        choices: ['fahendrena', 'hambom-po', 'hakelezana', 'kamo'],
        french: 'La sagesse est le véritable chemin à suivre.',
        explanation:
          "Ny fahendrena no mitarika ho amin'ny fiainana mandry fehizay.",
      },
      {
        template: ['Aza', 'atao', 'toy', 'ny', 'tsipantsipaky', 'ny', ''],
        correctWord: 'mandry',
        choices: ['mandry', 'matory', 'mihazakazaka', 'mihira'],
        french:
          "Ne t'agite pas sans raison comme celui qui sursaute dans son sommeil.",
        explanation: "Fitoniana sy fahalalana onony amin'ny fihetsika rehetra.",
      },
      {
        template: [
          'Ny',
          'harena',
          'mora',
          'lany',
          'fa',
          'ny',
          '',
          'maharitra.',
        ],
        correctWord: 'fanahy',
        choices: ['fanahy', 'vola', 'lamba', 'hazo'],
        french:
          "La richesse matérielle s'épuise vite, mais la noblesse d'âme est éternelle.",
        explanation:
          "Ny hatsaran'ny toetra sy ny fanahy no ambony noho ny harena ara-bola.",
      },
      {
        template: [
          'Ny',
          'Marina',
          'toy',
          'ny',
          'tsipi-tsipika',
          'ka',
          'tsy',
          'misy',
          '',
        ],
        correctWord: 'fiviliana',
        choices: ['fiviliana', 'fahotana', 'haizina', 'sakana'],
        french: 'La vérité est comme une ligne droite qui ne dévie jamais.',
        explanation:
          "Fijoroana amin'ny fahamarinana tsy misy fihatsarambelatsihy.",
      },
      {
        template: ['Aza', 'ny', 'tany', 'mora', 'hadihady', 'no', ''],
        correctWord: 'hady',
        choices: ['hady', 'totofana', 'volena', 'diovina'],
        french:
          "N'abuse pas de la terre facile à creuser (Ne profite pas de la faiblesse d'autrui).",
        explanation:
          "Fanajana ny malemy sy tsy fanararaotana ny fahatsoran'ny hafa.",
      },
      {
        template: ['Ny', 'teny', 'mivoaka', 'toy', 'ny', '', 'raraka.'],
        correctWord: 'rano',
        choices: ['rano', 'vato', 'fasika', 'lavenona'],
        french:
          "La parole prononcée est comme de l'eau versée (impossible à rattraper).",
        explanation:
          "Fahamalinana amin'ny fampiasana ny teny sy ny fanehoan-kevitra.",
      },
      {
        template: [
          'Manao',
          'soa',
          'am-parafara',
          'ka',
          'ny',
          '',
          'no',
          'andrasana.',
        ],
        correctWord: 'valiny',
        choices: ['valiny', 'vola', 'fisaorana', 'haja'],
        french: 'Faire le bien sans attendre immédiatement en retour.',
        explanation:
          'Fahatsoram-po sy fiantrana tsy mitady tombontsoa manokana.',
      },
      {
        template: [
          'Ny',
          'tongotra',
          'no',
          'mivilana',
          'fa',
          'ny',
          '',
          'tsy',
          'manary.',
        ],
        correctWord: 'havana',
        choices: ['havana', 'namana', 'vola', 'trano'],
        french:
          'Les pieds peuvent trébucher, mais la famille et les proches ne vous abandonnent pas.',
        explanation:
          "Faharetan'ny fitiavana sy ny fihavanana manoloana ny fahalemen'ny olona.",
      },
    ],
  },
  {
    levelNumber: 4,
    titleMg: 'Tena Sarotra',
    titleFr: 'Expert',
    description: 'Ohabolana tranainy sy sarin-teny lalina.',
    difficulty: 'EXPERT',
    questions: [
      {
        template: [
          'Aza',
          'manao',
          'tana-manga',
          'ka',
          'ny',
          '',
          'no',
          'asandratra.',
        ],
        correctWord: 'loha',
        choices: ['loha', 'tongotra', 'tanana', 'elatra'],
        french: 'Ne fais pas le caméléon fier en dressant la tête avec vanité.',
        explanation:
          'Fampianarana momba ny fanetren-tena sy ny fandavana ny fieboeboana.',
      },
      {
        template: ['Ny', 'hazo', 'tokana', 'tsy', 'mba', ''],
        correctWord: 'ala',
        choices: ['ala', 'trano', 'fary', 'tanàna'],
        french: 'Un arbre seul ne constitue point une forêt.',
        explanation:
          "Tsy afaka miaina mitokana ny olona fa mila ny firaisankinan'ny fiarahamonina.",
      },
      {
        template: ['Ny', 'soavaly', 'tsy', 'mifaninana', "amin'", ''],
        correctWord: 'sokatra',
        choices: ['sokatra', 'vorona', 'omby', 'alika'],
        french: 'Le cheval ne fait pas la course avec la tortue.',
        explanation:
          'Fahaizana mandrefy ny tena sy tsy fanaovana fampitahana tsy mitombina.',
      },
      {
        template: [
          'Aza',
          'miana-kendry',
          'toy',
          'ny',
          'tsintsina',
          'ka',
          'mitondra',
          '',
          'am-bava.',
        ],
        correctWord: 'mololo',
        choices: ['mololo', 'rano', 'vato', 'fasika'],
        french:
          "Ne fais pas l'avisé comme le petit moineau qui porte un fétu trop grand pour lui.",
        explanation: "Fahalalana onony amin'ny fahaiza-manao sy ny traikefa.",
      },
      {
        template: ['Ny', 'rano', 'tondraka', 'tsy', 'mahasimba', 'ny', ''],
        correctWord: 'loharano',
        choices: ['loharano', 'tetezana', 'tany', 'hazo'],
        french: "La crue de l'eau ne détruit pas la source originelle.",
        explanation:
          'Ny fisehon-javatra mandalo dia tsy manova ny fototra sy ny fiaviana.',
      },
      {
        template: [
          'Ny',
          'teny',
          'tahaka',
          'ny',
          'tsipìka',
          'ka',
          'mody',
          "amin'ny",
          '',
        ],
        correctWord: 'tompony',
        choices: ['tompony', 'lanitra', 'tanàna', 'vahoaka'],
        french:
          'La parole est comme une flèche, elle retombe toujours sur son auteur.',
        explanation:
          "Andraikitra feno amin'ny teny lazaina sy ny fiantraikany.",
      },
      {
        template: [
          'Manao',
          'kitoza',
          'lany',
          'tapa-bolana',
          'ka',
          'manary',
          '',
        ],
        correctWord: 'tsiro',
        choices: ['tsiro', 'loko', 'harena', 'rano'],
        french:
          'Gaspiller ses provisions en peu de temps et en perdre toute la saveur.',
        explanation:
          "Fitandremana amin'ny fitantanana ny fananana sy ny fitsitsiana.",
      },
      {
        template: [
          'Ny',
          'omby',
          'mitrena',
          'ao',
          'an-tsaha',
          'tsy',
          'mampatahotra',
          'ny',
          '',
        ],
        correctWord: 'mpiandry',
        choices: ['mpiandry', 'lalana', 'vorona', 'hazo'],
        french:
          "Le mugissement du zébu dans le pâturage n'effraie pas le berger aguerri.",
        explanation:
          'Fahatokisan-tena sy tsy fahatahorana ny fandrahonana ivelany.',
      },
      {
        template: [
          'Aza',
          'atao',
          'toy',
          'ny',
          'valala',
          'manatody',
          'ka',
          'mamela',
          '',
          'ho',
          "an'ny",
          'hafa.',
        ],
        correctWord: 'hasasarana',
        choices: ['hasasarana', 'harena', 'vola', 'trano'],
        french:
          'Ne fais pas comme la sauterelle qui pond et laisse son fardeau aux autres.',
        explanation:
          "Fandraisana andraikitra feno amin'ny taranaka sy ny asa atao.",
      },
      {
        template: [
          'Ny',
          'fahendrena',
          'toy',
          'ny',
          '',
          'ka',
          'tsy',
          'maintsy',
          'volena.',
        ],
        correctWord: 'hazo',
        choices: ['hazo', 'vato', 'rano', 'rivotra'],
        french:
          'La sagesse est comme un arbre : il faut la planter et la cultiver.',
        explanation: 'Fampivelarana ny fahaizana sy ny fitaizana ny saina.',
      },
    ],
  },
  {
    levelNumber: 5,
    titleMg: 'Mpahaikanto',
    titleFr: 'Maître',
    description: 'Fahendrena lalina sy haikanto malagasy.',
    difficulty: 'EXPERT',
    questions: [
      {
        template: ['Ny', 'eritreritra', 'tsy', 'mba', '', 'fa', 'manidina.'],
        correctWord: 'voafatotra',
        choices: ['voafatotra', 'maty', 'resy', 'tonga'],
        french:
          "La pensée ne peut être enchaînée, elle s'envole en toute liberté.",
        explanation: "Fahafahan'ny saina sy ny fahendrena lalina malagasy.",
      },
      {
        template: [
          'Aza',
          'ny',
          'lamba',
          'fotsy',
          'no',
          'jerena',
          'fa',
          'ny',
          '',
          'madio.',
        ],
        correctWord: 'fanahy',
        choices: ['fanahy', 'tarehy', 'harena', 'vola'],
        french:
          "Ne regarde pas la blancheur du vêtement (l'apparence), mais la pureté de l'âme.",
        explanation:
          "Ny hatsaran'ny toetra no ambony indrindra noho ny bika ivelany.",
      },
      {
        template: [
          'Ny',
          'fahamarinana',
          'toy',
          'ny',
          'solika',
          'ka',
          'mitsingevana',
          "ambonin'ny",
          '',
        ],
        correctWord: 'rano',
        choices: ['rano', 'vato', 'tany', 'fasika'],
        french:
          "La vérité est comme l'huile, elle finit toujours par surnager à la surface de l'eau.",
        explanation:
          'Tsy misy zava-miafina tsy haseho, mandresy foana ny marina.',
      },
      {
        template: ['Ny', 'teny', 'fanorenana', 'fa', 'ny', 'asa', 'no', ''],
        correctWord: 'famehezana',
        choices: ['famehezana', 'faharavana', 'fatiantoka', 'fahadisoana'],
        french:
          "La parole pose les fondations, mais c'est l'action qui scelle l'édifice.",
        explanation:
          "Ny fifamenoan'ny kabary sy ny fanatanterahana amin'ny asa mivaingana.",
      },
      {
        template: [
          'Ny',
          'fanajana',
          'ny',
          'ray',
          'aman-dreny',
          'mitondra',
          '',
          'lava.',
        ],
        correctWord: 'andro',
        choices: ['andro', 'haizina', 'harena', 'alina'],
        french:
          'Le respect des parents et des aînés procure une longue vie féconde.',
        explanation:
          "Fahendrena malagasy momba ny hasin'ny ray aman-dreny sy ny tsodrano.",
      },
      {
        template: ['Ny', 'hasina', 'tsy', 'mividy', 'fa', ''],
        correctWord: 'hadihady',
        choices: ['hadihady', 'amidiana', 'variana', 'simbaina'],
        french:
          "La noblesse d'âme et la dignité ne s'achètent pas, elles s'acquièrent avec droiture.",
        explanation: 'Ny fahamendrehana dia vokatry ny fitondran-tena marina.',
      },
      {
        template: ['Aza', 'miteny', 'an-kolaka', 'ka', 'mamadika', 'ny', ''],
        correctWord: 'heviny',
        choices: ['heviny', 'lokony', 'feony', 'fofony'],
        french:
          'Ne parle point par faux détours pour déformer le sens véritable.',
        explanation:
          "Fahatsorana sy fahaitsiana amin'ny kabary sy ny fiarahamonina.",
      },
      {
        template: [
          'Ny',
          'vahoaka',
          'toy',
          'ny',
          'ondry',
          'ka',
          'mila',
          '',
          'mahay.',
        ],
        correctWord: 'mpitarika',
        choices: ['mpitarika', 'mpihira', 'mpandady', 'mpivarotra'],
        french:
          "Le peuple est comme un troupeau, il a besoin d'un guide éclairé et juste.",
        explanation:
          "Ny andraikitra masina ananan'ny mpitondra amin'ny fitarihana ny vahoaka.",
      },
      {
        template: ['Ny', 'kanto', 'dia', 'fitaratry', 'ny', ''],
        correctWord: 'kolontsaina',
        choices: ['kolontsaina', 'hambom-po', 'fahantrana', 'hakelezana'],
        french:
          "L'art et la beauté sont le miroir fidèle de la culture vivante.",
        explanation:
          "Ny fanehoana ny maha-izy azy ny Malagasy amin'ny alalan'ny kanto sy ny teny.",
      },
      {
        template: ['Ny', 'fahendrena', 'lalina', 'no', 'mampandry', 'ny', ''],
        correctWord: 'tany',
        choices: ['tany', 'rano', 'lanitra', 'orana'],
        french:
          "C'est la profonde sagesse qui pacifie et apaise la nation tout entière.",
        explanation:
          'Ny fihavanana sy ny fahendrena no antoky ny fandriampahalemana.',
      },
    ],
  },
];
