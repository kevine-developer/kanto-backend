import { SeedTrack } from './seed.types.js';

export const traditionsTrack: SeedTrack = {
  slug: 'traditions-et-rites-ancestraux',
  title: 'Rites & Traditions sacrées',
  titleMg: 'Fomba & Fomban-drazana Masina',
  description:
    'Explorez la dimension spirituelle malgache : respect des Razana, fady et coutumes ancestrales.',
  descriptionMg:
    "Fantaro ny tontolo ara-panahin'ny Ntaolo : ny Razana, ny fady ary ireo fanao nentim-paharazana.",
  level: 'ADVANCED',
  icon: 'Layers',
  color: '#8E44AD',
  orderIndex: 3,
  estimatedMinutes: 55,
  lessons: [
    {
      slug: 'le-culte-des-razana-et-les-fady',
      title: 'Le respect des Razana et la sagesse des Fady',
      titleMg: "Ny fanajana ny Razana sy ny fahendren'ny Fady",
      summary:
        'Comprenez le rôle protecteur des ancêtres (Razana) et la signification profonde des interdits (Fady).',
      summaryMg:
        "Ianaro ny fifandraisan'ny velona sy ny Razana ary ny antony nisian'ny fady eo amin'ny fiarahamonina.",
      type: 'TRADITION',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, la mort ne marque pas la fin de l'existence, mais le passage vers le statut vénéré d'Ancêtre (*Razana*), veillant sur la descendance.",
          textMg:
            "Eo amin'ny fomba malagasy, ny fahalasanana dia tetezana mankany amin'ny maha-Razana mpiahy ny taranaka.",
        },
        {
          type: 'concept',
          termMg: 'Razana',
          phonetic: 'ra-za-na',
          meaningFr:
            "Les Ancêtres, gardiens invisibles de la terre et de l'ordre moral",
          explanation:
            'Intermédiaires spirituels entre Zanahary (le Créateur) et les vivants.',
        },
        {
          type: 'concept',
          termMg: 'Fady',
          phonetic: 'fa-di',
          meaningFr: 'Interdit sacré, tabou protecteur, règle de précaution',
          explanation:
            "Les fady préservent l'équilibre écologique, social et spirituel du groupe.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Certains Fady protègent la nature : par exemple, il est souvent fady de pointer du doigt un tombeau ou certains arbres sacrés, ce qui évite leur dégradation.',
          textMg:
            "Maro amin'ireo fady no natao hiarovana ny tontolo iainana sy ny harena voajanahary.",
        },
        // ─── 3 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question: 'Qui sont les « Razana » dans la cosmogonie malgache ?',
          questionMg:
            "Iza ireo atao hoe « Razana » eo amin'ny finoana nentin-drazana ?",
          choices: [
            'Les ancêtres défunts vénérés qui veillent et protègent la descendance',
            'Les ennemis vaincus lors des batailles',
            'Des créatures imaginaires des contes',
            'Les marchands étrangers',
          ],
          correctIndex: 0,
          explanation:
            'Les Razana sont les aïeux passés dans le monde invisible, protecteurs et garants des coutumes de la famille.',
        },
        {
          type: 'quiz',
          question:
            'Quel rôle primordial jouent les « Fady » (interdits rituels) dans la communauté ?',
          questionMg:
            "Inona no antony lehibe nampisy ny « Fady » teo amin'ny Ntaolo ?",
          choices: [
            "Préserver l'équilibre social, moral et protéger la nature",
            'Punir arbitrairement les membres du village',
            'Interdire tout rassemblement festif',
            'Rendre la vie plus compliquée sans explication',
          ],
          correctIndex: 0,
          explanation:
            "Les Fady agissent comme des gardes-fous moraux, sanitaires et environnementaux pour maintenir l'harmonie.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi est-il traditionnellement fady de pointer du doigt un tombeau (Fasana) ?',
          questionMg:
            "Nahoana no fady ny manondro fasana amin'ny rantsan-tànana ?",
          choices: [
            'Par respect sacré pour le repos des Ancêtres (on utilise le poing replié)',
            "Parce que le doigt pourrait s'allonger",
            'Pour ne pas réveiller les oiseaux',
            "C'est une interdiction moderne sans fondement",
          ],
          correctIndex: 0,
          explanation:
            'Pointer du doigt est perçu comme une agression ou un manque de respect envers les Razana ; on montre avec le poing plié.',
        },
        {
          type: 'quiz',
          question:
            "Quel rôle d'intermédiaires spirituels jouent les Razana dans la cosmogonie malgache ?",
          questionMg:
            "Inona no anjara toeran'ny Razana eo amin'ny fifandraisan'ny velona sy Zanahary ?",
          choices: [
            'Ils intercèdent auprès du Créateur (Zanahary) pour protéger leurs descendants',
            'Ils punissent arbitrairement les villageois sans raison',
            "Ils n'exercent aucune influence sur la vie quotidienne",
            'Ils surveillent exclusivement les frontières maritimes',
          ],
          correctIndex: 0,
          explanation:
            'Les Razana sont considérés comme des intercesseurs bienveillants entre Zanahary et la descendance terrestre.',
        },
        {
          type: 'quiz',
          question:
            "Quel est l'impact écologique direct de nombreux Fady ancestraux ?",
          questionMg:
            "Inona no voka-tsoa entin'ny fady sasany eo amin'ny fiarovana ny tontolo iainana ?",
          choices: [
            "La préservation des forêts sacrées, des sources d'eau et de la faune endémique",
            "L'obligation de défricher massivement la végétation naturelle",
            "L'assèchement artificiel des rivières et des marais",
            "L'interdiction de cultiver le riz dans toute l'île",
          ],
          correctIndex: 0,
          explanation:
            'Plusieurs Fady protègent les forêts sacrées (Ala fady) et interdisent de chasser des animaux totems, agissant comme des réserves naturelles.',
        },
      ],
    },
    {
      slug: 'l-art-du-kabary-discours-rituel',
      title: "L'art oratoire du Kabary : structure et noblesse",
      titleMg: 'Ny Kanto sy ny Fitsipiky ny Kabary Malagasy',
      summary:
        "Pénétrez dans les arcanes de la rhétorique traditionnelle malgache, patrimoine immatériel de l'humanité.",
      summaryMg:
        'Ianaro ny fitsipika sy ny fomba fandrafetana ny kabary nentin-drazana am-pahendrena sy am-pahamendrehana.',
      type: 'LITERATURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le Kabary est l'art de la parole cérémonielle codifiée. Pratiqué lors de chaque temps fort de la vie (mariage, fête, deuil, famadihana), il utilise des proverbes raffinés et témoigne de la haute éloquence malgache.",
          textMg:
            'Ny Kabary dia haikanto am-bava nentin-drazana mampiseho ny fahamendrehana sy ny fahaizana mandahatra teny. Tsy misy lanonana malagasy tanteraka raha tsy misy mpikabary mahay.',
        },
        {
          type: 'phonetic',
          letterOrSound: 'B',
          phonetic: 'b',
          frenchEquivalent:
            'Se prononce fermement avec les lèvres, sonore et net (ex: Kabary).',
          sampleWordMg: 'Kabary',
          sampleTranslationFr: 'Discours rituel oratoire',
        },
        {
          type: 'concept',
          termMg: 'Kabary',
          phonetic: 'ka-ba-ri',
          meaningFr: 'Discours solennel et poétique rituel',
          explanation:
            "Classé au patrimoine mondial immatériel de l'UNESCO, le kabary transmet l'histoire, réconcilie les familles et scelle les alliances.",
        },
        {
          type: 'concept',
          termMg: 'Mpikabary',
          phonetic: 'mpi-ka-ba-ri',
          meaningFr: "L'orateur traditionnel initié",
          explanation:
            'Porte-parole respecté de la famille, détenteur de la mémoire ancestrale et des règles de bienséance.',
        },
        {
          type: 'concept',
          termMg: 'Fialan-tsiny',
          phonetic: 'fi-a-lan-tsi-ni',
          meaningFr: "Demande solennelle d'excuses préalable",
          explanation:
            "L'orateur commence toujours par demander humblement pardon aux aînés et à l'assistance de devoir prendre la parole.",
        },
        {
          type: 'concept',
          termMg: 'Hainteny',
          phonetic: 'hain-te-ni',
          meaningFr: 'Joutes poétiques orales traditionnelles métaphoriques',
          explanation:
            "Poésie populaire dialoguée où les amants et orateurs rivalisent de métaphores subtiles et d'esprit.",
        },
        {
          type: 'example',
          textMg:
            'Mialona tsiny aminareo ray aman-dreny sy ny vahoaka mivory eto aho, fa tsy noho ny fahaizana no itenenana fa adidy aman-draharaha.',
          textFr:
            "Je sollicite humblement vos excuses, chers aînés et peuple ici réuni ; ce n'est point par prétention que je m'exprime, mais pour accomplir un devoir fraternel.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "La demande d'excuse rituelle (*fialan-tsiny*) peut durer plusieurs minutes au début d'un kabary. C'est l'essence même de l'humilité malgache : s'abaisser devant l'assemblée pour élever le message commun.",
          textMg:
            "Ny fialan-tsiny dia tsy fahalemena fa tampon'ny fahendrena sy fanajana ny mpanatrika. Tsy mahazo miditra amin'ny fototry ny hafatra ny mpikabary raha tsy nahazo ny tsodranon'ny vahoaka.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Par quelle étape obligatoire et solennelle débute invariablement un Kabary traditionnel ?',
          questionMg:
            "Inona no dingana voalohany tsy maintsy ataon'ny mpikabary mialoha ny handraisany fitenenana ?",
          choices: [
            "Ny Fialan-tsiny (La demande d'excuses humble envers l'assemblée)",
            'La demande immédiate de rétribution financière',
            'Le début direct de la fête sans salutation',
            'La critique sévère des invités',
          ],
          correctIndex: 0,
          explanation:
            "Le « fialan-tsiny » désamorce tout orgueil : l'orateur s'excuse de prendre la parole devant des personnes plus âgées ou plus savantes que lui.",
        },
        {
          type: 'quiz',
          question:
            "Comment nomme-t-on l'orateur traditionnel qui prononce le discours rituel ?",
          questionMg:
            "Ahoana no iantsoana ilay olona manana fahaizana mandahatra ny teny sy miteny amin'ny anaran'ny fianakaviana ?",
          choices: ['Mpikabary', 'Mpanjaka', 'Mpitsabo', 'Mpiandry omby'],
          correctIndex: 0,
          explanation:
            "Le « mpikabary » est l'orateur traditionnel garant des us et coutumes de la prise de parole.",
        },
        {
          type: 'quiz',
          question:
            'Quelle institution internationale a reconnu le Kabary comme patrimoine culturel immatériel ?',
          questionMg:
            "Inona ilay fikambanana iraisam-pirenena nanaiky ny Kabary malagasy ho vakoka tsy azo tsapain-tanana ho an'ny olombelona ?",
          choices: [
            "L'UNESCO",
            "L'UNICEF",
            "L'OMS",
            "L'Union Postale Universelle",
          ],
          correctIndex: 0,
          explanation:
            "Le Kabary malgache a été solennellement inscrit au patrimoine culturel immatériel de l'humanité par l'UNESCO.",
        },
        {
          type: 'quiz',
          question:
            'Que désignent les « Hainteny » dans la tradition littéraire orale malgache ?',
          questionMg:
            "Inona no atao hoe « Hainteny » eo amin'ny haisoratra am-bava malagasy ?",
          choices: [
            'Des joutes poétiques traditionnelles riches en métaphores et énigmes',
            'Des lois écrites sur du papier parchemin',
            'Des récits de chasse aux animaux sauvages',
            'Des chants religieux modernes',
          ],
          correctIndex: 0,
          explanation:
            "Les « Hainteny » (littéralement 'science de la parole') sont de savoureux poèmes traditionnels dialogués.",
        },
        {
          type: 'quiz',
          question:
            "Pourquoi les proverbes (ohabolana) sont-ils indispensables à la réussite d'un Kabary ?",
          questionMg:
            'Nahoana no tena ilaina ny ohabolana mandritra ny kabary ?',
          choices: [
            "Ils confèrent l'autorité ancestrale et éclairent les arguments avec finesse",
            'Pour faire durer le discours le plus longtemps possible',
            "Parce qu'il est interdit d'utiliser des mots normaux",
            "Pour endormir l'assemblée",
          ],
          correctIndex: 0,
          explanation:
            "Les proverbes apportent le sel, l'élégance et la profondeur morale indispensables à l'éloquence de l'orateur.",
        },
      ],
    },
    {
      slug: 'le-famadihana-fete-de-la-vie',
      title: 'Le Famadihana : retournement des morts et fête de la vie',
      titleMg: "Ny Famadihana : Fifamatorana Masina amin'ny Razana",
      summary:
        "Découvrez le sens profond du Famadihana : une grande fête joyeuse de réconciliation familiale et d'hommage aux ancêtres.",
      summaryMg:
        "Fantaro ny hevitra fototry ny Famadihana : fety lehibe iombonan'ny fianakaviana mampifandray ny velona sy ny Razana.",
      type: 'TRADITION',
      orderIndex: 3,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le Famadihana (retournement des morts) est l'un des rituels les plus emblématiques des Hautes Terres malgaches. Loin d'être triste, c'est une immense célébration de joie, de danse et d'unité familiale où l'on renouvelle les linceuls de soie des ancêtres.",
          textMg:
            'Ny Famadihana dia fomban-drazana lehibe ankalazana ny fifankatiavana sy ny fanajana ny Razana. Fety feno hafaliana, dihy sy mozika izy io, anehoana fa tsy mitsahatra ny fitiavana na dia efa lasa aza ny havana.',
        },
        {
          type: 'phonetic',
          letterOrSound: 'TS',
          phonetic: 'ts',
          frenchEquivalent:
            'Son composé explosif entre le « T » et le « S » (ex: Tsena, Tsodrano), très énergique.',
          sampleWordMg: 'Tsodrano',
          sampleTranslationFr: 'Bénédiction sacrée',
        },
        {
          type: 'concept',
          termMg: 'Famadihana',
          phonetic: 'fa-ma-di-ha-na',
          meaningFr:
            'Retournement des linceuls / Célébration périodique des ancêtres',
          explanation:
            'Rituel hautement solennel célébré en hiver austral (juin à septembre), rassemblant toute la descendance dispersée.',
        },
        {
          type: 'concept',
          termMg: 'Lamba landy',
          phonetic: 'lam-ba lan-di',
          meaningFr: 'Linceul précieux en soie sauvage pure',
          explanation:
            'Tissu traditionnel noble tissé à la main, destiné à réenvelopper les dépouilles des aïeux pour les protéger du froid.',
        },
        {
          type: 'concept',
          termMg: 'Fasana',
          phonetic: 'fa-sa-na',
          meaningFr:
            'Le tombeau familial ancestral (la vraie demeure éternelle)',
          explanation:
            "Monument de pierre sacré au centre du territoire familial, lieu où toute la lignée se réunira pour l'éternité.",
        },
        {
          type: 'concept',
          termMg: 'Mifamangy',
          phonetic: 'mi-fa-mang-i',
          meaningFr:
            'Se rendre visite mutuellement avec solidarité et compassion',
          explanation:
            'Devoir moral qui pousse chaque parent, même lointain, à venir assister et soutenir la famille lors de la fête.',
        },
        {
          type: 'example',
          textMg:
            "Tonga ny fotoana hamadihana an'ireo razantsika : miraisa hina ny fianakaviana manontolo !",
          textFr:
            "Le moment est venu d'honorer et d'envelopper nos ancêtres : que toute la famille se rassemble dans la paix et la joie !",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pendant le Famadihana, les membres de la famille portent les corps enveloppés de soie sur leurs épaules et dansent autour du tombeau au rythme d'orchestres de cuivres traditionnels (*mpitsoka mozika*). Il est formellement interdit de pleurer : les larmes troubleraient la joie des retrouvailles avec les défunts !",
          textMg:
            "Fady ny mitomany mandritra ny famadihana. Mozika velona, fihirana sy dihy no entina mifaly miaraka amin'ny havana efa lasa, satria fety mampiray ny velona sy ny Razana izany.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Quelle est l'atmosphère dominante lors d'une cérémonie traditionnelle de Famadihana ?",
          questionMg:
            'Ahoana no rivo-piainana mandritra ny lanonana famadihana ?',
          choices: [
            'Une immense joie familiale avec danses, musiques et partages fraternels',
            'Une tristesse sombre avec interdiction totale de sourire',
            'Un silence absolu et sans aucune parole',
            'Une dispute obligatoire entre les familles',
          ],
          correctIndex: 0,
          explanation:
            'Le Famadihana est une fête de communion chaleureuse : les larmes sont fady car les vivants célèbrent la réunion avec leurs aïeux.',
        },
        {
          type: 'quiz',
          question:
            'Quel tissu noble et sacré est utilisé pour réenvelopper les ancêtres lors du Famadihana ?',
          questionMg:
            "Inona ilay lamba manan-kaja ampiasaina hamonosana ny taolambalon'ny Razana ?",
          choices: [
            'Ny Lamba landy (Soie sauvage naturelle précieuse)',
            'Du tissu synthétique ordinaire',
            'Des feuilles de bananier séchées',
            'Du plastique de protection',
          ],
          correctIndex: 0,
          explanation:
            "Le « lamba landy », tissé à partir de cocons de soie sauvage, est le vêtement d'honneur le plus noble à Madagascar.",
        },
        {
          type: 'quiz',
          question:
            "À quelle période de l'année le Famadihana est-il traditionnellement célébré ?",
          questionMg:
            "Amin'ny vanim-potoana inona amin'ny taona no fanaovana ny famadihana ?",
          choices: [
            "Pendant l'hiver austral (saison sèche et fraîche, entre juin et septembre)",
            'Au milieu de la saison des grandes pluies et des cyclones (janvier-février)',
            "Uniquement le jour de l'an",
            "N'importe quel jour au hasard",
          ],
          correctIndex: 0,
          explanation:
            "On célèbre le Famadihana pendant l'hiver austral (« ririnina » / « asotry »), période sèche propice aux rassemblements de plein air.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les familles dansent-elles en portant les ancêtres autour du tombeau (Fasana) ?',
          questionMg:
            'Nahoana ny fianakaviana no mandihy mitondra ny Razana manodidina ny fasana ?',
          choices: [
            'Pour leur témoigner affection, joie filiale et leur faire partager la fête',
            'Pour vérifier si le tombeau est solide',
            'Pour effrayer les passants',
            'Par simple exercice physique',
          ],
          correctIndex: 0,
          explanation:
            "Porter et faire danser les défunts entourés de la famille est un acte d'amour et de piété filiale suprême.",
        },
        {
          type: 'quiz',
          question:
            "Quel est l'impact social fondamental du Famadihana sur la communauté ?",
          questionMg:
            "Inona no voka-tsoa lehibe entin'ny famadihana eo amin'ny fiaraha-monina sy ny fianakaviana ?",
          choices: [
            'Ressouder les liens de parenté, réconcilier les membres éloignés et raffermir le Fihavanana',
            'Diviser définitivement les villages en clans rivaux',
            "Obliger les familles à déménager à l'étranger",
            'Vendre les terres des ancêtres aux enchères',
          ],
          correctIndex: 0,
          explanation:
            "Le Famadihana cimente l'unité : les cousins et parents dispersés aux quatre coins du pays se retrouvent, effacent leurs querelles et s'entraident.",
        },
      ],
    },
    {
      slug: 'le-fitampoha-et-le-bain-des-reliques',
      title: 'Le Fitampoha : le bain sacré des reliques royales Sakalava',
      titleMg: "Ny Fitampoha : Fandroan-Dady any amin'ny Menabe",
      summary:
        "Découvrez le plus grand rassemblement rituel du Menabe : l'immersion sacrée des reliques des rois Sakalava dans le fleuve Tsiribihina.",
      summaryMg:
        "Fantaro ny fomban-drazana lehibe any Menabe : ny fandroana ireo Dady masina ao amin'ny reniranon'i Tsiribihina.",
      type: 'TRADITION',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Sur les rives majestueuses du fleuve Tsiribihina, dans la région du Menabe, le **Fitampoha** (« le bain des reliques ») est l'une des cérémonies sacrées les plus grandioses de Madagascar. Tous les cinq ans, le peuple Sakalava se rassemble pour laver rituellement les reliques sacrées (*Dady*) des grands souverains défunts (notamment Radama Ier, Andriamisara et leurs ancêtres), renouvelant l'alliance mystique entre les vivants, la terre et la royauté sacrée.",
          textMg:
            "Any amin'ny moron'ny renirano Tsiribihina ao Menabe, ny **Fitampoha** no fomba masina lehibe indrindra. Isaky ny dimy taona, ny vahoaka Sakalava dia miangona hanasa ireo **Dady** na taolambalon'ireo Mpanjaka lehibe fahiny, mba hanavao ny fanekena sy ny tsodrano ho an'ny vahoaka sy ny tany.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DADY',
          phonetic: 'da-di',
          frenchEquivalent:
            'Terme sacré prononcé nettement, désignant les reliques royales vénérées conservées dans le sanctuaire du Doany.',
          sampleWordMg: 'Dady',
          sampleTranslationFr:
            'Reliques sacrées des souverains royaux Sakalava',
        },
        {
          type: 'concept',
          termMg: 'Dady',
          phonetic: 'da-di',
          meaningFr:
            'Les reliques corporelles sacrées des anciens rois du Menabe',
          explanation:
            "Objets hautement sacrés (dents, ossements, vertèbres) enveloppés d'étoffes royales et conservés au Doany (sanctuaire royal).",
        },
        {
          type: 'concept',
          termMg: 'Fitampoha',
          phonetic: 'fi-tam-pou-ha',
          meaningFr: '« Le bain des reliques » / La grande ablution royale',
          explanation:
            "Rite de purification et de revivification au cours duquel les reliques sont immergées avec solennité dans l'eau vive du fleuve.",
        },
        {
          type: 'concept',
          termMg: 'Mpibasy sy Mpitoka',
          phonetic: 'mpi-ba-si si mpi-tou-ka',
          meaningFr:
            "Gardiens de la tradition armés de fusils et déclamateurs d'invocations",
          explanation:
            'Dignitaires traditionnels qui escortent le cortège royal et invoquent la bienveillance des esprits ancestraux.',
        },
        {
          type: 'concept',
          termMg: 'Tromba',
          phonetic: 'troum-ba',
          meaningFr:
            "Possession spirituelle rituelle par l'esprit d'un roi défunt",
          explanation:
            "État mystique durant lequel l'esprit du souverain s'exprime à travers un médium (*mpiantse*) pour conseiller et guider le peuple.",
        },
        {
          type: 'example',
          textMg:
            "Tonga marobe ny vahoaka teo amoron'i Tsiribihina nahita ny fandroan'ireo Dady masina.",
          textFr:
            "Le peuple s'est réuni en foule sur les rives de la Tsiribihina pour assister au bain sacré des reliques royales.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pendant toute la durée du Fitampoha (qui dure plus d'une semaine sur un banc de sable sacré de la Tsiribihina), un campement éphémère de plusieurs dizaines de milliers de personnes vit sous des règles strictes d'harmonie, de propreté et de paix absolue : toute dispute ou parole blessante y est rigoureusement taboue (Fady).",
          textMg:
            "Mandritra ny Fitampoha eo amin'ny fasika masina ao Tsiribihina, olona an'aliny maro no miara-monina am-pilaminana tanteraka : fady mafy ny mifamaly na miteny ratsy mandritra ny fankalazana.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Dans quelle grande région et sur quel fleuve emblématique est célébré le Fitampoha ?',
          questionMg:
            "Any amin'ny faritra aiza sy amin'ny renirano inona no anatanterahana ny Fitampoha ?",
          choices: [
            'Dans le Menabe, sur les rives du fleuve Tsiribihina',
            'Dans les Hautes Terres, sur la rivière Ikopa',
            "Sur l'île de Sainte-Marie dans l'océan Indien",
            'Au sommet du mont Maromokotro',
          ],
          correctIndex: 0,
          explanation:
            'Le Fitampoha est célébré par le peuple Sakalava du Menabe sur un banc de sable sacré du fleuve Tsiribihina.',
        },
        {
          type: 'quiz',
          question:
            'Que désignent précisément les « Dady » immergés rituellement lors du Fitampoha ?',
          questionMg:
            'Inona marina moa ireo antsoina hoe « Dady » sasana mandritra ny Fitampoha ?',
          choices: [
            'Les reliques sacrées des anciens souverains royaux du Menabe',
            'Des statuettes en argile cuite',
            'Des parchemins écrits en Sorabe',
            'Des instruments de musique en cuivre',
          ],
          correctIndex: 0,
          explanation:
            'Les Dady sont les reliques corporelles sacrées des rois fondateurs, conservées au sanctuaire du Doany.',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la signification spirituelle majeure de cette immersion rituelle ?',
          questionMg:
            "Inona no hevitra ara-panahy lehibe fonosin'ny fandroana ny Dady ?",
          choices: [
            'Purifier les reliques, renouveler la fertilité de la terre et sceller la bénédiction royale',
            'Célébrer la fin des récoltes de riz uniquement',
            'Préparer une expédition maritime militaire',
            "Désigner le vainqueur d'un tournoi sportif",
          ],
          correctIndex: 0,
          explanation:
            "L'ablution sacrée purifie les reliques, régénère l'énergie de la nature et renouvelle le pacte de protection avec les ancêtres.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on la transe rituelle au cours de laquelle un esprit royal parle à travers un médium ?',
          questionMg:
            "Ahoana no iantsoana ny fisehoan'ny fanahin'ny mpanjaka amin'ny alalan'ny mpiantse ?",
          choices: ['Le Tromba', 'Le Kabary', 'Le Hira Gasy', 'Le Famadihana'],
          correctIndex: 0,
          explanation:
            "Le Tromba est l'institution spirituelle par laquelle l'esprit d'un grand roi défunt s'exprime pour guider sa communauté.",
        },
        {
          type: 'quiz',
          question:
            "Quelle règle de conduite fondamentale s'impose à tous les pèlerins sur le banc de sable sacré ?",
          questionMg:
            "Inona ilay fepetra tsy maintsy hajain'ny rehetra mandritra ny Fitampoha ?",
          choices: [
            "La concorde absolue, la paix et l'interdiction totale de disputes (Fady)",
            "Le port d'armes à feu pour tous les enfants",
            'Le jeûne total sans eau pendant sept jours',
            "L'interdiction de parler à ses voisins",
          ],
          correctIndex: 0,
          explanation:
            'Le site sacré du Fitampoha est un sanctuaire de paix où toute animosité ou querelle est rigoureusement bannie.',
        },
      ],
    },
    {
      slug: 'le-tsaboraha-et-le-sacrifice-du-zebe',
      title:
        'Le Tsaboraha et le sacrifice du zébu : alliance, prière et partage',
      titleMg: 'Ny Tsaboraha sy ny Sorona Omby : Fanolorana sy Fifampizarana',
      summary:
        'Comprenez la dimension sacrée du sacrifice du zébu : prières aux ancêtres (Joro), répartition rituelle et solidarité.',
      summaryMg:
        "Ianaro ny lanjan'ny sorona omby sy ny Tsaboraha : ny joro, ny hasina ary ny fizarana nofon-kena mitam-pihavanana.",
      type: 'TRADITION',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la tradition malgache, l'abattage d'un zébu n'est jamais un acte purement profane : c'est un acte sacrificiel solennel appelé **Sorona** ou **Joro**, particulièrement magnifié lors du **Tsaboraha** (fête rituelle commémorative chez les Betsimisaraka et autres peuples de Madagascar). Le zébu, bien le plus précieux légué par les ancêtres, est offert pour sceller une alliance, remercier Zanahary ou demander la pluie et la santé de la lignée.",
          textMg:
            "Eo amin'ny kolontsaina malagasy, ny famonoana omby dia tsy fihinanana fotsiny fa fanolorana masina antsoina hoe **Sorona** na **Joro**, indrindra amin'ny **Tsaboraha**. Ny omby, izay fananana sarobidy indrindra avy amin'ny razana, dia atolotra ho fisaorana an'Andriamanitra sy ny Razana ary ifampizarana amin'ny mpiara-belona.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'JORO',
          phonetic: 'dzou-rou',
          frenchEquivalent:
            'Le « J » malgache se prononce « DZ » appuyé (ex: Joro, Zanahary).',
          sampleWordMg: 'Joro',
          sampleTranslationFr:
            'Invocation rituelle solennelle et prière sacrificielle',
        },
        {
          type: 'concept',
          termMg: 'Tsaboraha',
          phonetic: 'tsa-bou-ra-ha',
          meaningFr:
            'Grande fête rituelle et cérémonielle familiale et villageoise',
          explanation:
            "Célébration traditionnelle (notamment à l'Est) marquant l'accomplissement d'un vœu, un deuil ou une réunion de famille.",
        },
        {
          type: 'concept',
          termMg: 'Joro',
          phonetic: 'dzou-rou',
          meaningFr:
            "Prière d'invocation solennelle adressée à Zanahary et aux Razana",
          explanation:
            "Prière prononcée devant le poteau sacrificiel avant l'immolation du zébu pour solliciter la bénédiction et la paix.",
        },
        {
          type: 'concept',
          termMg: 'Hazomanga',
          phonetic: 'ha-zou-man-ga',
          meaningFr: 'Le poteau sacrificiel sacré du clan ou de la lignée',
          explanation:
            'Pieu en bois noble érigé au village où le patriarche (mpitoka hazomanga) célèbre les rituels et bénit la descendance.',
        },
        {
          type: 'concept',
          termMg: 'Nofon-kena mitam-pihavanana',
          phonetic: 'nou-foun ke-na mi-tam-pi-ha-va-na-na',
          meaningFr: 'La part de viande qui consolide le lien fraternel',
          explanation:
            'Règle séculaire selon laquelle chaque morceau de viande est distribué selon un ordre hiérarchique strict (vodivena pour les aînés), nourrissant tout le village sans exception.',
        },
        {
          type: 'example',
          textMg:
            "Nanao joro teo amin'ny hazomanga ny raiamandreny talohan'ny nanolorana ny omby.",
          textFr:
            "Le patriarche a prononcé la prière sacrée (joro) devant le poteau traditionnel avant d'offrir le zébu.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le partage de la viande sacrificielle obéit à une géométrie sociale d'une précision absolue : la croupe (*vodi-kena*) revient de droit aux anciens et chefs de famille en signe d'allégeance et de respect filial, tandis que le foie et les morceaux tendres sont réservés aux femmes enceintes et aux enfants.",
          textMg:
            "Ny fizarana ny hena amin'ny fomba malagasy dia manaja lamina hentitra : ny vodi-kena dia an'ny raiamandreny sy ny zokiolona ho mariky ny haja, ary ny nofo malefaka kosa dia omena ny zaza sy ny vehivavy bevohoka.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Joro » dans la tradition sacrificielle malgache ?",
          questionMg:
            "Inona no atao hoe « Joro » eo amin'ny fomban-drazana malagasy ?",
          choices: [
            "Une prière rituelle d'invocation adressée à Zanahary et aux Ancêtres",
            'Un instrument de percussion en peau de zébu',
            'Une danse guerrière exécutée avant le combat',
            'Une boisson fermentée à base de miel',
          ],
          correctIndex: 0,
          explanation:
            "Le « Joro » est l'acte de prière et d'invocation solennelle qui confère tout son sens spirituel au sacrifice.",
        },
        {
          type: 'quiz',
          question:
            "Quel monument sacré du village sert d'autel pour le sacrifice du zébu et les bénédictions ?",
          questionMg:
            'Inona ilay tsangambato hazo masina eo an-tanàna anaovana ny sorona sy ny tsodrano ?',
          choices: [
            'Le Hazomanga (poteau sacré du clan)',
            'Le Hadivory (fossé circulaire)',
            'Ny Tranovola',
            'Ny Valam-parihy',
          ],
          correctIndex: 0,
          explanation:
            'Le « Hazomanga » est le poteau sacrificiel en bois noble autour duquel se réunit la famille sous la conduite du patriarche.',
        },
        {
          type: 'quiz',
          question:
            'Quelle expression célèbre illustre le partage de la viande qui resserre la solidarité ?',
          questionMg:
            'Inona ilay ohabolana na fomba fiteny milaza ny fizarana hena mampiray ny fianakaviana ?',
          choices: [
            '« Nofon-kena mitam-pihavanana »',
            '« Tsy misy hena tsy misy taolana »',
            '« Vola latsaka an-kady »',
            '« Lasa rano nisasana »',
          ],
          correctIndex: 0,
          explanation:
            "« Nofon-kena mitam-pihavanana » résume l'esprit du partage : la viande offerte nourrit l'harmonie et la fraternité communautaire.",
        },
        {
          type: 'quiz',
          question:
            'Quelle part du zébu sacrificiel est traditionnellement offerte aux aînés et aux parents en signe de respect ?',
          questionMg:
            'Inona ilay anjara hena omena ny raiamandreny ho mariky ny fanajana sy ny haja ?',
          choices: [
            'Le Vodi-kena (la croupe sacrée)',
            'Les sabots du zébu',
            'La corne gauche uniquement',
            'La peau brute',
          ],
          correctIndex: 0,
          explanation:
            "Le « Vodi-kena » (la croupe) est le morceau noble dévolu par coutume aux aînés et détenteurs de l'autorité morale.",
        },
        {
          type: 'quiz',
          question:
            'Quelle fête rituelle commémorative est particulièrement réputée chez les Betsimisaraka ?',
          questionMg:
            "Inona ilay fety nentim-paharazana malaza indrindra any amin'ny faritra Betsimisaraka ?",
          choices: ['Le Tsaboraha', 'Le Fanorona', 'Le Moraingy', 'Le Ringa'],
          correctIndex: 0,
          explanation:
            'Le Tsaboraha est la fête rituelle emblématique de rassemblement et de sacrifices chez les Betsimisaraka.',
        },
      ],
    },
    {
      slug: 'le-sambatra-et-la-circoncision-rituelle',
      title:
        'Le Sambatra : la grande fête septennale de la circoncision à Mananjary',
      titleMg: 'Ny Sambatra : Fankalazana Isaky ny Fito Taona ao Mananjary',
      summary:
        'Explorez la grandiose fête du Sambatra chez les Antambahoaka : rite de passage, dignité masculine et ferveur collective.',
      summaryMg:
        "Fantaro ny fety miezinezina fanaon'ny Antambahoaka : fampidirana ny zazalahy ho lehilahy vanona sy tompon'andraikitra.",
      type: 'TRADITION',
      orderIndex: 6,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Mananjary, sur la côte sud-est de Madagascar, les **Antambahoaka** célèbrent tous les sept ans une fête spectaculaire unique au monde : le **Sambatra**. Durant un mois entier de festivités, de processions en costumes rouges et de danses martiales, des centaines de jeunes garçons sont circoncis rituellement au bord de l'embouchure, accédant ainsi au rang d'hommes accomplis (*Lehilahy vanona*), intégrés à la communauté et bénis par leurs ancêtres.",
          textMg:
            "Ao Mananjary, eo amin'ny morontsiraka atsimo atsinanana, ny foko **Antambahoaka** dia mankalaza ny **Sambatra** isaky ny fito taona. Mandritra ny iray volana feno lanonana, fitafiana mena ary filaharana makotrokotroka, ireo zazalahy kely rehetra dia didiana amin'ny fomba nentim-paharazana mba ho tonga lehilahy tompon'andraikitra sy mahazo ny tsodranon'ny razana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'SAMBATRA',
          phonetic: 'sam-ba-tsa',
          frenchEquivalent:
            'Le mot « Sambatra » signifie étymologiquement « Heureux / Béni » en langue malgache.',
          sampleWordMg: 'Sambatra',
          sampleTranslationFr:
            'Fête septennale sacrée / Félicité et bénédiction',
        },
        {
          type: 'concept',
          termMg: 'Sambatra',
          phonetic: 'sam-ba-tsa',
          meaningFr: 'La fête septennale sacrée de la circoncision collective',
          explanation:
            "Célébration historique fondée selon la tradition par Raminia, ancêtre fondateur des Antambahoaka venu d'outre-mer.",
        },
        {
          type: 'concept',
          termMg: 'Lehilahy vanona',
          phonetic: 'le-hi-la-hi va-nou-na',
          meaningFr: "L'homme intègre, accompli, responsable et digne",
          explanation:
            "Statut moral et social acquis par le jeune garçon après la circoncision, lui permettant d'entrer dans la lignée des ancêtres.",
        },
        {
          type: 'concept',
          termMg: 'Lamba mena sy Malabary',
          phonetic: 'lam-ba me-na si ma-la-ba-ri',
          meaningFr:
            'Les tuniques écarlates et coiffes traditionnelles des pèlerins',
          explanation:
            "Tenue de fête flamboyante portée par les pères et les enfants lors de la descente solennelle vers l'embouchure du fleuve.",
        },
        {
          type: 'concept',
          termMg: 'Trano fandraiky',
          phonetic: 'tsa-nou fan-drye-ki',
          meaningFr: 'La case royale traditionnelle du village de Mananjary',
          explanation:
            'Lieu sacré où sont conservés les étendards, les tambours rituels et les généalogies des douze clans Antambahoaka.',
        },
        {
          type: 'example',
          textMg:
            "Feno hafaliana ny tanànan'i Mananjary nandritra ny fankalazana ny Sambatra.",
          textFr:
            'La ville de Mananjary a vibré de joie et de ferveur tout au long de la célébration du Sambatra.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le point d'orgue du Sambatra est la spectaculaire procession militaire symbolique : des milliers d'hommes armés de lances de bois et vêtus de rouge miment une bataille héroïque pour purifier la route menant les enfants jusqu'à la mer sacrée (Vinany).",
          textMg:
            "Ny tena mampitolagaga amin'ny Sambatra dia ny filaharana lehibe an-dranomasina : lehilahy an'arivony mitafy mena sy mitondra lefona hazo no maneho ny herim-pon'ny razana mandra-pahatonga any amin'ny vinany.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'À quelle fréquence périodique est célébrée la grande fête du Sambatra à Mananjary ?',
          questionMg:
            'Isaky ny firy taona no anatanterahana ny fankalazana ny Sambatra ao Mananjary ?',
          choices: [
            'Tous les sept ans (fête septennale)',
            'Chaque année au mois de janvier',
            'Tous les cinquante ans',
            'Tous les deux ans',
          ],
          correctIndex: 0,
          explanation:
            'Le Sambatra est une célébration septennale qui a lieu fidèlement tous les sept ans selon le calendrier coutumier.',
        },
        {
          type: 'quiz',
          question:
            'Quel peuple du sud-est de Madagascar est le gardien historique de la tradition du Sambatra ?',
          questionMg:
            "Iza ilay foko tompon'ny fomban-drazana Sambatra any atsimo atsinanana ?",
          choices: [
            'Le peuple Antambahoaka',
            'Le peuple Merina',
            'Le peuple Bara',
            'Le peuple Mahafaly',
          ],
          correctIndex: 0,
          explanation:
            'Le Sambatra est la tradition la plus sacrée et prestigieuse du peuple Antambahoaka de Mananjary.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle social et spirituel fondamental de cette circoncision rituelle ?',
          questionMg:
            "Inona no tanjona ara-tsosialy sy ara-panahy amin'ity hasoavan-jaza ity ?",
          choices: [
            "Faire accéder les jeunes garçons au rang d'hommes intègres (Lehilahy vanona) bénis par les ancêtres",
            'Préparer les enfants à quitter définitivement leur région',
            'Organiser un concours de danse moderne',
            'Remplacer les études scolaires obligatoires',
          ],
          correctIndex: 0,
          explanation:
            'La circoncision fait du garçon un « lehilahy vanona », membre à part entière de la famille spirituelle et sociale.',
        },
        {
          type: 'quiz',
          question:
            'Quelle couleur vestimentaire spectaculaire domine le cortège lors des processions du Sambatra ?',
          questionMg:
            "Inona ilay loko marevaka iombonan'ireo mpilahatra mandritra ny Sambatra ?",
          choices: [
            'Le rouge écarlate (Lamba mena sy Malabary)',
            'Le vert pomme',
            'Le bleu marine uniquement',
            'Le noir complet de deuil',
          ],
          correctIndex: 0,
          explanation:
            'Les tuniques écarlates (malabary mena) symbolisent la vie, le courage royal et la force spirituelle.',
        },
        {
          type: 'quiz',
          question:
            'Vers quel lieu naturel sacré convergent les pèlerins pour le dénouement de la cérémonie ?',
          questionMg:
            "Mankany amin'ny toerana voajanahary aiza no iombonan'ny filaharana lehibe ?",
          choices: [
            "L'embouchure où le fleuve rencontre la mer (Vinany)",
            "Au fond d'une grotte souterraine",
            'Dans un désert de sel',
            "Au sommet d'un baobab géant",
          ],
          correctIndex: 0,
          explanation:
            "Le cortège se rend solennellement à l'embouchure (Vinany) où les eaux fluviales purificatrices rejoignent l'océan.",
        },
      ],
    },
    {
      slug: 'le-taom-baovao-malagasy-et-l-alahamady',
      title:
        "Le Taom-baovao Malagasy et l'Alahamady : renouveau, pardon et concorde",
      titleMg:
        'Ny Taom-baovao Malagasy sy ny Alahamady : Famelan-keloka sy Fihavanana',
      summary:
        'Revivez les rituels du Nouvel An malgache : le feu perpétuel (Afo tsy maty), le bain de purification (Fandroana) et le pardon mutuel.',
      summaryMg:
        "Tsarovy ireo fomba amam-panao amin'ny Taom-baovao : ny Afo tsy maty, ny Fandroana ary ny fihavanana amin'ny vary amin-dronono tondrahana tantely.",
      type: 'TRADITION',
      orderIndex: 7,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À l'apparition de la première nouvelle lune du mois d'**Alahamady** (premier signe du zodiaque malgache ancestral), Madagascar célèbre le **Taom-baovao Malagasy** (le Nouvel An traditionnel). Ce temps sacré est avant tout celui du renouveau cosmique et de la réconciliation : on allume le feu perpétuel (**Afo tsy maty**), on procède aux ablutions de purification (**Fandroana**) et l'on partage le repas de concorde (**Vary amin-dronono tondrahana tantely**) en s'accordant un pardon réciproque sincère.",
          textMg:
            "Rehefa tsinana ny tsinam-bolana voalohany amin'ny volana **Alahamady**, dia mankalaza ny **Taom-baovao Malagasy** ny vahoaka. Fotoana masina ho an'ny fanavaozana sy ny fampihavanana izany : arehitra ny **Afo tsy maty**, atao ny **Fandroana** fanadiovana, ary ifampizarana ny **Vary amin-dronono tondrahana tantely** sady mifamela heloka ny rehetra mba hiditra madio ao amin'ny taona vaovao.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FANDROANA',
          phonetic: 'fan-drou-a-na',
          frenchEquivalent:
            "Dérive du verbe « mandro » (se laver, se purifier dans l'eau sacrée).",
          sampleWordMg: 'Fandroana',
          sampleTranslationFr:
            'Bain sacré de purification / Fête royale du Nouvel An',
        },
        {
          type: 'concept',
          termMg: 'Alahamady',
          phonetic: 'a-la-ha-ma-di',
          meaningFr:
            'Le premier signe astrologique du Vintana malgache / Mois royal',
          explanation:
            "Signe de la royauté, de la noblesse d'âme et du commencement, associé au point cardinal Nord-Est.",
        },
        {
          type: 'concept',
          termMg: 'Afo tsy maty',
          phonetic: 'a-fou tsi ma-ti',
          meaningFr: '« Le feu perpétuel » allumé la veille du Nouvel An',
          explanation:
            'Brasier allumé dans la nuit pour dissiper les ténèbres et symboliser la vitalité continue du peuple et de la descendance.',
        },
        {
          type: 'concept',
          termMg: 'Fandroana',
          phonetic: 'fan-drou-a-na',
          meaningFr: "L'ablution sacrée de purification",
          explanation:
            "Bain rituel au cours duquel le souverain ou le patriarche aspergeait le peuple avec l'eau sacrée en prononçant des vœux de santé (*Tsodrano*).",
        },
        {
          type: 'concept',
          termMg: 'Vary amin-dronono tondrahana tantely',
          phonetic: 'va-ri a-min drou-nou-nou toun-dra-ha-na tan-te-li',
          meaningFr: 'Riz au lait nappé de miel sauvage',
          explanation:
            "Mets sacré de concorde partagé par tous, symbolisant la douceur de vivre, la pureté et l'abondance partagée.",
        },
        {
          type: 'example',
          textMg:
            'Tratry ny taona vaovao, samy ho velon-ko taiza ka ho tahin-Janahary sy ny Razana !',
          textFr:
            'Joyeux Nouvel An à tous, que chacun vive dans la paix, la santé et la bénédiction de Dieu et des Ancêtres !',
        },
        {
          type: 'didYouKnow',
          textFr:
            "La règle cardinale du Taom-baovao Malagasy était l'obligation d'effacer toutes les dettes morales et les rancœurs avant le lever du jour : il était formellement interdit d'entrer dans la nouvelle année avec une colère au cœur envers son semblable.",
          textMg:
            "Ny fitsipika volamena tamin'ny Taom-baovao malagasy dia ny famelan-keloka tanteraka : tsy azo atao ny miditra amin'ny taona vaovao raha mbola misy lolom-po na disadisa tsy voavaha eo amin'ny mpiray tanindrazana.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Sous quel signe astrologique lunaire ancestral est traditionnellement célébré le Taom-baovao Malagasy ?',
          questionMg:
            "Amin'ny volana vintana inona no ankalazana ny Taom-baovao Malagasy ?",
          choices: [
            "Le mois d'Alahamady (signe royal du renouveau)",
            "Le mois d'Adimizana",
            "Le mois d'Alakarabo",
            "Le mois d'Asombola",
          ],
          correctIndex: 0,
          explanation:
            "L'Alahamady est le premier mois du calendrier luni-solaire malgache, dédié à la royauté et au renouveau cosmique.",
        },
        {
          type: 'quiz',
          question:
            'Quel plat rituel hautement symbolique est partagé lors du Nouvel An malgache ?',
          questionMg:
            "Inona ilay hanim-py masina ifampizarana amin'ny Taom-baovao ?",
          choices: [
            'Le Vary amin-dronono tondrahana tantely (riz au lait au miel)',
            'Le Koba ravina froid',
            'Des beignets salés uniquement',
            'Du poisson séché au piment fort',
          ],
          correctIndex: 0,
          explanation:
            "Le riz au lait nappé de miel (vary amin-dronono tondrahana tantely) symbolise la félicité, la pureté et l'abondance.",
        },
        {
          type: 'quiz',
          question:
            'Quelle obligation morale majeure précède le passage à la nouvelle année dans la tradition malgache ?',
          questionMg:
            "Inona ilay adidy ara-pitondran-tena lehibe takina amin'ny rehetra alohan'ny taona vaovao ?",
          choices: [
            "Le pardon réciproque sincère et l'apaisement de toutes les rancœurs",
            "L'achat de vêtements neufs importés",
            'La fermeture complète de toutes les maisons',
            "L'exil temporaire des jeunes hors du village",
          ],
          correctIndex: 0,
          explanation:
            'Le pardon mutuel (famelan-keloka) est au cœur du rite : nul ne peut accueillir le Nouvel An sans être réconcilié.',
        },
        {
          type: 'quiz',
          question:
            'Que symbolise le « Fandroana » (bain sacré) pratiqué lors du Nouvel An ?',
          questionMg:
            "Inona no hevitra fonosin'ny « Fandroana » amin'ny fiandohan'ny taona ?",
          choices: [
            "La purification des souillures de l'année écoulée et la renaissance de la vie",
            'Une simple épreuve de natation sportive',
            'Un concours de beauté villageois',
            "L'apprentissage de la pêche pour les enfants",
          ],
          correctIndex: 0,
          explanation:
            "Le Fandroana est une régénération symbolique : l'eau vive purifie les fautes passées pour entamer un cycle neuf et fertile.",
        },
        {
          type: 'quiz',
          question:
            'Quel symbole nocturne représente la pérennité de la descendance et de la patrie ?',
          questionMg:
            "Inona ilay marika mirehitra amin'ny alina maneho ny fitohizan'ny aina sy ny taranaka ?",
          choices: [
            "L'« Afo tsy maty » (le feu perpétuel)",
            "Un feu d'artifice moderne",
            'Une lanterne chinoise volante',
            'Une bougie parfumée',
          ],
          correctIndex: 0,
          explanation:
            "L'« Afo tsy maty » (feu perpétuel) célèbre la flamme vivante du peuple et de la descendance qui ne doit jamais s'éteindre.",
        },
      ],
    },
  ],
};
