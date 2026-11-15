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
    // ─── LEÇON 8 : LA CIRCONCISION TRADITIONNELLE (HASOAVAN-JAZA) ───
    {
      slug: 'la-circoncision-traditionnelle-hasoavan-jaza',
      title:
        'La circoncision traditionnelle : Hasoavan-jaza et passage initiatique',
      titleMg: 'Ny Hasoavan-jaza sy ny Fandidian-jaza : Fomban-drazana masina',
      summary:
        "Découvrez le rite de la circoncision malgache : la quête de l'eau vive (rano mahery) à l'aube, le courage du jeune garçon et la fête familiale.",
      summaryMg:
        "Fantaro ny fomba amam-panao amin'ny fandidian-jaza : ny fakana ny rano mahery maraina vao mangiran-dratsy sy ny fanandratana ny maha-lehilahy.",
      type: 'TRADITION',
      orderIndex: 8,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, la circoncision (Didim-poitra ou Hasoavan-jaza) est un rite de passage obligatoire pour tout garçon avant la puberté. Elle marque l'entrée dans la communauté masculine et l'acquisition de la virilité féconde. Pratiquée en hiver austral (juin à août) pour faciliter la cicatrisation, la cérémonie commence à l'aube par la course rituelle de jeunes hommes vigoureux partis puiser 'l'eau vive' (rano mahery) au pied d'une cascade tumultueuse.",
          textMg:
            "Ny Hasoavan-jaza na Didim-poitra dia dingana lehibe tsy maintsy lalovan'ny zazalahy malagasy mba hidirany amin'ny maha-lehilahy vanona. Tanterahina amin'ny ririnina izany mba ho mora sitrana ny fery, ary alaina amin'ny maraina vao mangiran-dratsy ny 'rano mahery'.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'HAS / OAV / AN / JA / ZA',
          phonetic: 'ha-sou-a-van-dza-za',
          frenchEquivalent:
            "L'expression « Hasoavan-jaza » signifie littéralement 'faire du bien / embellir / consacrer l'enfant'.",
          sampleWordMg: 'Rano mahery',
          sampleTranslationFr: 'L’eau vive sacrée puisée à contre-courant',
        },
        {
          type: 'concept',
          termMg: 'Rano mahery alaina vao mangiran-dratsy',
          phonetic: 'ra-nou ma-he-ri a-lai-na va-ou man-gi-ran-dra-tsi',
          meaningFr:
            'L’eau tumultueuse puisée à l’aube par des jeunes hommes rapides',
          explanation:
            "Eau vive prélevée au pied d'une chute d'eau sans que les porteurs ne regardent en arrière, apportant force et courage magique au jeune garçon.",
        },
        {
          type: 'concept',
          termMg: 'Raha tsy didiana, tsy lehilahy',
          phonetic: 'ra-ha tsi di-di-a-na, tsi le-hi-la-hi',
          meaningFr:
            'Sans l’épreuve de la circoncision, on n’accède pas au statut d’homme',
          explanation:
            'Condition coutumière primordiale : le garçon non circoncis ne pouvait jadis prétendre au mariage ni être enterré dans le tombeau familial des ancêtres.',
        },
        {
          type: 'concept',
          termMg: 'Akondro sy Mofo mamy',
          phonetic: 'a-koun-drou si mou-fou ma-mi',
          meaningFr:
            'La banane rituelle et les friandises offertes par les grands-parents',
          explanation:
            "Aussitôt l'opération accomplie, le grand-père fait avaler au jeune garçon un morceau de banane douce pour apaiser la douleur et symboliser la douceur du foyer.",
        },
        {
          type: 'example',
          textMg:
            "Niaritra tamin'ny herim-po ilay zazalahy ka mendrika ny tso-dranon'ny fianakaviana manontolo : lehilahy matotra hiaro ny ankohonana.",
          textFr:
            "Le jeune garçon a enduré l'épreuve avec bravoure et mérite la bénédiction de toute la famille : un homme accompli qui saura protéger les siens.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pendant que les jeunes rapportent l'eau mahery, toute la famille chante et bat des mains sans interruption pour couvrir les pleurs éventuels de l'enfant et célébrer la victoire de la vie.",
          textMg:
            "Mihira sy mitehaka mafy ny fianakaviana mba hampahery ilay zaza sy haneho ny hafaliana amin'ny nidirany ho lehilahy.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la signification initiatique essentielle de la circoncision (Hasoavan-jaza) à Madagascar ?',
          questionMg:
            'Inona ny hevitra lehibe ara-pomba fonosin’ny Hasoavan-jaza ?',
          choices: [
            'L’accession du jeune garçon au statut d’homme mûr, fécond et membre à part entière du lignage',
            'Une punition pour une mauvaise note à l’école',
            'Un jeu d’hiver sans importance',
            'Une fête réservée aux fillettes',
          ],
          correctIndex: 0,
          explanation:
            "La circoncision consacre le passage à la virilité et ouvre le droit à l'héritage familial et à l'accès au tombeau ancestral.",
        },
        {
          type: 'quiz',
          question:
            'Qu’appelle-t-on le « Rano mahery » utilisé lors du rituel matinal ?',
          questionMg:
            'Inona ny « Rano mahery » ampiasaina amin’ny didim-poitra ?',
          choices: [
            'L’eau vive puisée au lever du jour au pied d’une cascade par des jeunes hommes vigoureux',
            'De l’eau de mer salée',
            'De l’eau bouillante',
            'Du jus de fruits fermenté',
          ],
          correctIndex: 0,
          explanation:
            "Le rano mahery est puisé dans l'eau vive tumultueuse à l'aube pour transmettre sa force invaincue au jeune circoncis.",
        },
        {
          type: 'quiz',
          question:
            'Pendant quelle saison climatique la circoncision est-elle traditionnellement pratiquée à Madagascar ?',
          questionMg:
            'Amin’ny vanim-potoana manao ahoana no tena anatanterahana ny didim-poitra ?',
          choices: [
            'Pendant l’hiver austral (saison sèche et fraîche de juin à août) pour favoriser la cicatrisation',
            'Pendant la saison des fortes pluies et des inondations',
            'Au milieu de l’été chaud',
            'N’importe quel jour au hasard',
          ],
          correctIndex: 0,
          explanation:
            "La fraîcheur de l'hiver malgache prévient les infections et favorise une cicatrisation rapide et saine.",
        },
        {
          type: 'quiz',
          question:
            'Quel fruit doux le grand-père ou l’oncle offre-t-il traditionnellement au garçon après l’opération ?',
          questionMg:
            'Inona ilay voankazo mamy atolotra ilay zazalahy avy nodidiana ?',
          choices: [
            'Une banane mûre (akondro)',
            'Un piment rouge piquant',
            'Un citron très acide',
            'Une noix de coco dure',
          ],
          correctIndex: 0,
          explanation:
            "La banane douce symbolise la douceur, l'apaisement de la douleur et la promesse d'une vie prospère.",
        },
        {
          type: 'quiz',
          question:
            'Que font les membres de la famille réunis autour de la maison durant le déroulement du rituel ?',
          questionMg:
            'Inona no ataon’ny fianakaviana mivory eo an-trano mandritra ny fotoana fandidiana ?',
          choices: [
            'Ils chantent des refrains traditionnels joyeux et battent des mains pour donner du courage à l’enfant',
            'Ils gardent un silence de deuil',
            'Ils partent tous au marché',
            'Ils dorment sous une moustiquaire',
          ],
          correctIndex: 0,
          explanation:
            "Les chants et les battements de mains collectifs créent une atmosphère d'allégresse et d'encouragement inconditionnel.",
        },
      ],
    },
    // ─── LEÇON 9 : LE BERCEAU ET LA PREMIÈRE COUPE (ALA-VOLO) ───
    {
      slug: 'le-berceau-et-la-premiere-coupe-ala-volo',
      title:
        'Le berceau et la première coupe de cheveux du nourrisson : L’Ala-volo',
      titleMg: 'Ny Famonosana sy ny Fanaovam-bolo voalohany : Ny Ala-volo',
      summary:
        "Découvrez le rituel de l'Ala-volo marquant l'intégration du nouveau-né dans la communauté : coupe sacrée des cheveux de naissance et bénédiction au miel.",
      summaryMg:
        "Fantaro ny fomba amam-panao amin'ny Ala-volo : fanapahana ny volon-jaza voalohany sy fangataham-pitahiana amin'ny tantely sy ronono.",
      type: 'TRADITION',
      orderIndex: 9,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À l'âge d'environ trois mois, le nourrisson malgache quitte la période de protection intime du foyer pour être présenté officiellement au monde extérieur. C'est le rite solennel de l'Ala-volo (la coupe des cheveux de naissance). Pour les anciens, les cheveux avec lesquels l'enfant est né appartiennent au monde mystérieux de l'au-delà : les couper marque son enracinement définitif parmi les vivants et la fin de la vulnérabilité néonatale.",
          textMg:
            "Rehefa feno telo volana eo ho eo ny zazakely dia tanterahina ny fomban-drazana Ala-volo. Tapahina ny volony nentin-teraka mba hanokanana azy ho anisan'ny velona, ary anolorana tsodrano sy vatomamy ary tantely ho mariky ny fiainana mamy.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'A / LA / VO / LO',
          phonetic: 'a-la-vou-lou',
          frenchEquivalent:
            "L'expression « Ala-volo » vient de 'Manala' (enlever / couper rituellement) et 'Volo' (cheveux / poils de naissance).",
          sampleWordMg: 'Ala-volo',
          sampleTranslationFr:
            'La première coupe rituelle des cheveux de naissance',
        },
        {
          type: 'concept',
          termMg: 'Olona manan-kaja sy madio fitondran-tena',
          phonetic: 'ou-lou-na ma-nan-ka-dza si ma-di-ou fi-toun-dran-te-na',
          meaningFr:
            'La personne intègre choisie pour couper la première mèche',
          explanation:
            "On confie les ciseaux rituels à une personne modèle de la famille réputée pour sa sagesse, sa longévité et sa prospérité, afin de transmettre ces qualités à l'enfant.",
        },
        {
          type: 'concept',
          termMg: 'Tantely sy Ronono mandry',
          phonetic: 'tan-te-li si rou-nou-nou man-dri',
          meaningFr: 'Le miel pur et le lait caillé doux',
          explanation:
            "Les mèches coupées sont mélangées dans une assiette avec du miel et du lait : les convives en goûtent une cuillère pour souhaiter à l'enfant une existence douce et fertile.",
        },
        {
          type: 'concept',
          termMg: 'Fametrahana anarana (Fanomezana anarana)',
          phonetic: 'fa-me-tra-ha-na a-na-ra-na',
          meaningFr: 'L’attribution du prénom traditionnel de bon augure',
          explanation:
            "Moment où les aînés proclament le prénom malgache choisi selon le jour de naissance (Vintana) pour protéger le destin de l'enfant.",
        },
        {
          type: 'example',
          textMg:
            'Hahazo aina sy fitahiana anie ity zazakely ity : ho mamy toy ny tantely ny androny ary ho feno fiadanana ny tokantranony.',
          textFr:
            'Que ce petit être soit comblé de bénédictions et de vigueur : que ses jours soient doux comme le miel et son foyer rempli de paix.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les mèches de cheveux coupées lors de l'Ala-volo sont précieusement conservées par la mère dans un petit tissu blanc ou enterrées au pied d'un arbre fruitier vigoureux pour sceller l'alliance entre l'enfant et la terre nourricière.",
          textMg:
            'Tehirizina tsara na alevina eo am-pototry ny hazo mamoa ny volon-jaza voalohany mba ho mariky ny fahalonahana sy ny fitomboana tsara.',
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle transition symbolique majeure le rite de l’Ala-volo consacre-t-il pour le nourrisson ?',
          questionMg:
            'Inona ny fiovana lehibe asehon’ny fomban-drazana Ala-volo ho an’ny zazakely ?',
          choices: [
            'La fin de la fragilité néonatale et son intégration pleine et entière parmi les vivants',
            'Son départ définitif du foyer familial',
            'L’obligation de marcher immédiatement',
            'Le choix de son futur métier',
          ],
          correctIndex: 0,
          explanation:
            "Enlever les cheveux de naissance ancre définitivement l'enfant dans le monde des vivants et dans la lignée familiale.",
        },
        {
          type: 'quiz',
          question:
            'À qui confie-t-on traditionnellement le soin de couper la première mèche de cheveux lors de l’Ala-volo ?',
          questionMg:
            'Iza no fidina hanapa-bolo voalohany ilay zaza amin’ny Ala-volo ?',
          choices: [
            'Une personne intègre, sage et prospère de la famille dont on souhaite voir l’enfant hériter les vertus',
            'N’importe quel inconnu dans la rue',
            'Le plus jeune enfant du village',
            'Un marchand étranger',
          ],
          correctIndex: 0,
          explanation:
            'La vertu et la bonne réputation du coupeur sont censées déteindre par contagion bienveillante sur le nourrisson.',
        },
        {
          type: 'quiz',
          question:
            'Quels ingrédients symboliques sont traditionnellement mélangés aux premières mèches coupées ?',
          questionMg:
            'Inona avy ireo zavatra mamy afangaro amin’ny volon-jaza amin’ny vilia ?',
          choices: [
            'Du miel pur et du lait doux (tantely sy ronono)',
            'Du piment fort et du sel marin',
            'De l’encre noire et du vinaigre',
            'Du sable rouge et des pierres',
          ],
          correctIndex: 0,
          explanation:
            "Le miel et le lait incarnent la douceur de vivre, la prospérité matérielle et l'abondance accordée au nouveau-né.",
        },
        {
          type: 'quiz',
          question:
            'Vers quel âge le rite de l’Ala-volo est-il généralement célébré dans les familles ?',
          questionMg: 'Firy volana eo ho eo ny zaza rehefa anaovana Ala-volo ?',
          choices: [
            'Autour de l’âge de trois mois',
            'À l’âge de 15 ans',
            'Dès le premier jour de naissance',
          ],
          correctIndex: 0,
          explanation:
            "À trois mois, le bébé est considéré comme suffisamment fortifié pour être présenté en public et béni par l'ensemble des parents.",
        },
        {
          type: 'quiz',
          question:
            'Que fait traditionnellement la mère des mèches de cheveux coupées après la fête ?',
          questionMg:
            'Aiza no ametrahana ireo volon-jaza voaaratra rehefa vita ny fomba ?',
          choices: [
            'Elles sont précieusement conservées dans une étoffe ou enfouies au pied d’un arbre fruitier symbole de fertilité',
            'Elles sont brûlées dans les ordures',
            'Elles sont jetées dans le feu',
            'Elles sont vendues au marché',
          ],
          correctIndex: 0,
          explanation:
            "Enterrer les mèches au pied d'un arbre fruitier symbolise la croissance harmonieuse et féconde de l'enfant en lien avec la nature.",
        },
      ],
    },
    // ─── LEÇON 10 : LE PACTE DU SERMENT DE SANG (FATI-DRA) ───
    {
      slug: 'le-serment-de-sang-eternel-fati-dra',
      title: 'Le pacte du serment de sang éternel : Le Fati-dra sacré',
      titleMg: 'Ny Fati-dra : Firaisana masina tsy azo ravana mandrakizay',
      summary:
        "Découvrez le Fati-dra, la plus haute alliance fraternelle malgache : un pacte d'âme où deux êtres ou clans scellent une fidélité plus forte que le sang biologique.",
      summaryMg:
        "Fantaro ny Fati-dra, fanekena masina mampiray olona roa ho mpirahalahy mandrakizay amin'ny alalan'ny rà sy ny fanozonana.",
      type: 'TRADITION',
      orderIndex: 10,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la tradition malgache, le 'Fati-dra' (alliance de sang) est le serment suprême de fraternité et d'assistance mutuelle. Deux personnes ou deux communautés jadis rivales décident de devenir inséparables. Au cours d'un rituel impressionnant devant les témoins et les anciens, une goutte de sang prélevée sur la poitrine de chacun est mélangée dans de l'eau de source avec du gingembre, de la poudre de fusil et une pièce d'argent. Boire ce breuvage crée une fraternité sacrée que même la mort ne saurait dénouer.",
          textMg:
            "Ny Fati-dra no fanekena lehibe indrindra mampiray olona roa tsy mpihavana ho lasa mpirahalahy tsy mifandao. Afangaro amin'ny rano sy sakamalaho ny ra alaina amin'ny tratra, ary sotroina eo anatrehan'ny vahoaka miaraka amin'ny fianianana mafy.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / TI / DRA',
          phonetic: 'fa-ti-dra',
          frenchEquivalent:
            "L'expression « Fati-dra » combine 'Faty' (la mort / le sacrifice) et 'Rà' (le sang vital).",
          sampleWordMg: 'Fati-dra',
          sampleTranslationFr:
            'Le pacte sacré du sang / L’alliance fraternelle éternelle',
        },
        {
          type: 'concept',
          termMg: 'Mpirahalahy mianiana',
          phonetic: 'mpi-ra-ha-la-hi mi-a-ni-a-na',
          meaningFr:
            'Frères jurés par serment sacré devant Dieu et les ancêtres',
          explanation:
            'Le lien du Fati-dra est considéré comme supérieur aux liens du sang ordinaires : trahir son frère de sang entraîne une malédiction automatique (tody).',
        },
        {
          type: 'concept',
          termMg: 'Ny vao sy ny sakamalaho',
          phonetic: 'ni va-ou si ni sa-ka-ma-la-hou',
          meaningFr: 'Le gingembre piquant et l’eau pure de source',
          explanation:
            'Éléments rituels purificateurs consommés lors du serment, symbolisant la force vive et la droiture incorruptible de la parole donnée.',
        },
        {
          type: 'concept',
          termMg: 'Firaisankina amin’ny soa sy ny ratsy',
          phonetic: 'fi-rai-san-ki-na a-min-ni sou-a si ni ra-tsi',
          meaningFr: 'Solidarité absolue dans la joie comme dans le malheur',
          explanation:
            'Les deux frères de sang partagent leurs biens, se défendent mutuellement en temps de guerre et prennent en charge les enfants du défunt en cas de décès.',
        },
        {
          type: 'example',
          textMg:
            'Ny Fati-dra dia fatorana masina : tsy misy fitaka, tsy misy fivadihana fa fiarovana sy fifankatiavana mandra-pahafatiko.',
          textFr:
            "Le Fati-dra est une alliance sacrée : ni trahison ni ruse, mais protection fraternelle et dévouement absolu jusqu'à la mort.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Des explorateurs européens et des officiers royaux ont jadis conclu le Fati-dra avec de grands chefs malgaches. Cette fraternité jurée était si absolue que les deux lignages s'interdisaient mutuellement le mariage (ala-fady), devenant membres d'une même famille consanguine rituelle.",
          textMg:
            'Ireo nifanaona Fati-dra dia tsy mahazo mifanambady ny taranany satria efa heverina ho mpiray tampo ara-nofo sy ara-panahy tanteraka.',
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Qu’est-ce que le « Fati-dra » dans la tradition historique et spirituelle de Madagascar ?',
          questionMg: 'Inona ny atao hoe « Fati-dra » amin’ny fomba malagasy ?',
          choices: [
            'Le serment solennel et indissoluble de fraternité par échange rituel d’une goutte de sang',
            'Un impôt payable en bétail',
            'Un duel mortel au couteau',
            'Une fête de danse moderne',
          ],
          correctIndex: 0,
          explanation:
            "Le Fati-dra scelle une fraternité éternelle entre deux êtres ou deux clans qui s'engagent à s'entraider jusqu'au sacrifice suprême.",
        },
        {
          type: 'quiz',
          question:
            'Quels ingrédients symboliques sont mélangés à l’eau et au sang lors de la prestation de serment ?',
          questionMg:
            'Inona avy ireo zava-maniry sy fitaovana afangaro amin’ny rano amin’ny Fati-dra ?',
          choices: [
            'Du gingembre (sakamalaho), de l’eau claire, une pièce d’argent et parfois de la poudre de fusil',
            'Du sucre en poudre et du café',
            'De l’huile de moteur',
            'Du sable blanc uniquement',
          ],
          correctIndex: 0,
          explanation:
            "Le gingembre et l'argent consacrent l'énergie vitale incorruptible et la valeur inestimable de la fidélité jurée.",
        },
        {
          type: 'quiz',
          question:
            'Quelle conséquence coutumière majeure s’applique aux enfants et descendants de deux personnes ayant conclu le Fati-dra ?',
          questionMg:
            'Inona ny fitsipika mihatra amin’ny taranaky ny olona nanao Fati-dra ?',
          choices: [
            'Ils sont considérés comme de véritables frères et sœurs et il leur est formellement fady de se marier entre eux',
            'Ils doivent vivre dans la même maison',
            'Ils perdent tous leurs biens',
            'Ils doivent changer de langue',
          ],
          correctIndex: 0,
          explanation:
            "L'alliance de sang crée une consanguinité rituelle inviolable : les enfants des deux alliés deviennent interdits de mariage comme de vrais frères et sœurs.",
        },
        {
          type: 'quiz',
          question:
            'Que risque, selon la foi ancestrale, celui qui oserait trahir ou tromper son frère de Fati-dra ?',
          questionMg:
            'Inona no hanjo an’izay mamadika ny fanekem-pihavanana amin’ny Fati-dra ?',
          choices: [
            'La malédiction immanente (tody) et la vengeance divine des ancêtres qui anéantissent le traître',
            'Une simple amende de dix ariary',
            'Une félicitation publique',
            'Rien du tout',
          ],
          correctIndex: 0,
          explanation:
            'La trahison du Fati-dra est le crime spirituel suprême, puni par le châtiment inéluctable du Tody selon la croyance des Ntaolo.',
        },
        {
          type: 'quiz',
          question:
            'Dans quelles circonstances historiques le Fati-dra était-il fréquemment conclu entre deux clans ?',
          questionMg:
            'Amin’ny fotoana manao ahoana no tena nanaovana ny Fati-dra fahiny ?',
          choices: [
            'Pour mettre fin à une guerre sanglante et sceller une alliance de paix perpétuelle entre deux peuples',
            'Pour acheter un terrain au marché',
            'Pendant un match de football',
            'Pour fêter le Nouvel An',
          ],
          correctIndex: 0,
          explanation:
            "Le Fati-dra transformait d'anciens ennemis jurés en frères d'armes inséparables, garantissant la paix durable dans les régions troublées.",
        },
      ],
    },
    // ─── LEÇON 11 : ARBRES SACRÉS & PIERRES LEVÉES (VATOLAHY) ───
    {
      slug: 'les-arbres-sacres-et-pierres-levees-vatolahy',
      title:
        'Les arbres sacrés et pierres levées commémoratives : Vatolahy et Hazo masina',
      titleMg: 'Ireo Hazo masina sy ny Vatolahy : Fahatsiarovana mandrakizay',
      summary:
        'Parcourez les paysages sacrés de Madagascar : les baobabs et figuiers royaux (aviavy) ainsi que les mégalithes levés pour immortaliser les héros.',
      summaryMg:
        "Diniho ireo hazo lehibe voahasina (Aviavy, Baobab) sy ireo Vatolahy naorin'ny Ntaolo ho fahatsiarovana ny herim-po sy ny fifanekena.",
      type: 'CULTURE',
      orderIndex: 11,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans les paysages de la Grande Île, certains géants végétaux et monuments de pierre attirent le regard et le respect universel. Ce sont les 'Hazo masina' (baobabs millénaires, grands figuiers royaux Aviavy) et les 'Vatolahy' (pierres mâles dressées vers le ciel). Érigées sans ciment par des centaines d'hommes unis lors d'une fête communautaire, ces stèles mégalithiques commémorent un pacte de paix inviolable, le souvenir d'un guerrier héroïque mort au loin ou la fondation d'un village.",
          textMg:
            "Eto Madagasikara, ireo hazo lehibe toa ny Aviavy sy ny Baobab ary ireo Vatolahy mitsangana avo dia manana hasina lehibe. Natsangan'ny fokonolona tamin'ny herin'ny firaisankina ireo vato lehibe mba hahatsiarovana ny mahery fo sy ny fanekem-pihavanana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VA / TO / LA / HY',
          phonetic: 'va-tou-la-hi',
          frenchEquivalent:
            "Le terme « Vatolahy » associe 'Vato' (pierre / roche) et 'Lahy' (mâle / robuste / guerrier brave).",
          sampleWordMg: 'Vatolahy',
          sampleTranslationFr:
            'La pierre levée dressée / Le mégalithe commémoratif',
        },
        {
          type: 'concept',
          termMg: 'Aviavy masin’ny Mpanjaka',
          phonetic: 'a-vi-a-vi ma-sin-ni mpan-dza-ka',
          meaningFr: 'Le figuier royal sacré planté au cœur de la cité',
          explanation:
            "Symbole de souveraineté et de protection : chaque colline royale (Rova) d'Imerina possédait son grand figuier Aviavy sous l'ombre duquel le roi tenait ses kabary.",
        },
        {
          type: 'concept',
          termMg: 'Vatolahy sy Tsangambato',
          phonetic: 'va-tou-la-hi si tsan-gam-ba-tou',
          meaningFr:
            'Mégalithes commémoratifs érigés à la mémoire des disparus',
          explanation:
            "Stèles érigées en cénotaphe pour les guerriers ou voyageurs morts loin de leur terre natale et dont le corps n'a pu être ramené au tombeau familial.",
        },
        {
          type: 'concept',
          termMg: 'Baobab masina (Reniala)',
          phonetic: 'ba-ou-bab ma-si-na (re-ni-a-la)',
          meaningFr:
            'Le baobab sacré, reine de la forêt et réceptacle d’offrandes',
          explanation:
            'Arbres millénaires majestueux au pied desquels les villageois déposent des morceaux de tissu rouge, des pièces et du miel pour implorer la fertilité.',
        },
        {
          type: 'example',
          textMg:
            "Ny Vatolahy dia fijoroana ho an'ny taranaka : manambara fa teo ny herin'ny Ntaolo ary velona mandrakizay ny tantarany.",
          textFr:
            'Le Vatolahy est un témoignage dressé pour la postérité : il proclame la vaillance des anciens et la permanence immortelle de leur mémoire.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Pour transporter un gigantesque bloc de granit destiné à devenir un Vatolahy, des centaines de villageois chantaient ensemble en tirant sur de solides cordes végétales imbibées de graisse de zébu, transformant ce labeur herculéen en une fête de réjouissance collective.',
          textMg:
            "Amin'ny fitarihana vato lehibe hanaovana Vatolahy, olona an-jatony no miara-mikararoka sy miara-mihira mitarika ny tady noraofina menak'omby.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que désigne traditionnellement le terme malgache « Vatolahy » ?',
          questionMg:
            'Inona no hevitry ny hoe « Vatolahy » amin’ny vakoka malagasy ?',
          choices: [
            'Une haute pierre mégalithique dressée vers le ciel pour commémorer un héros ou un événement historique',
            'Une petite pierre pour faire la cuisine',
            'Un bijou précieux porté au cou',
            'Un outil en fer forgé',
          ],
          correctIndex: 0,
          explanation:
            "Le Vatolahy est la pierre levée masculine commémorative célébrant la vaillance d'un guerrier ou un traité de paix solennel.",
        },
        {
          type: 'quiz',
          question:
            'Quel arbre majestueux était traditionnellement planté dans chaque enceinte royale (Rova) comme symbole de puissance bienveillante ?',
          questionMg:
            'Inona ilay hazo masina nambolen’ny Mpanjaka teo amin’ny kianjan’ny Rova ?',
          choices: [
            'Le grand figuier sauvage appelé « Aviavy »',
            'Le sapin de Noël',
            'Le pommier d’Europe',
            'Le rosier nain',
          ],
          correctIndex: 0,
          explanation:
            "L'Aviavy royal aux feuilles sombres et aux racines profondes symbolisait l'enracinement et la protection royale offerte au peuple.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi érigeait-on souvent un « Tsangambato » (pierre dressée) pour un guerrier mort loin de chez lui ?',
          questionMg:
            'Nahoana no natsangana ny Tsangambato ho an’ny olona maty tany an-toeran-kafa ?',
          choices: [
            'Comme cénotaphe sacré pour fixer sa mémoire et honorer son esprit lorsque son corps n’a pu être rapatrié',
            'Pour délimiter un champ de pommes de terre',
            'Pour construire un pont de rivière',
            'Pour servir de banc public',
          ],
          correctIndex: 0,
          explanation:
            "Le cénotaphe de pierre offrait un sanctuaire au défunt dont la dépouille n'avait pu rejoindre le tombeau des ancêtres familiaux.",
        },
        {
          type: 'quiz',
          question:
            'Quel nom poétique malgache donne-t-on au Baobab majestueux vénéré comme sacré ?',
          questionMg:
            'Inona ny anarana malagasy iantsoana ny Baobab amin’ny maha-hazo masina azy ?',
          choices: [
            '« Reniala » (la mère et la reine de la forêt)',
            '« Hazomanga »',
            '« Bararata »',
            '« Ravinala »',
          ],
          correctIndex: 0,
          explanation:
            "« Reniala » signifie 'la mère de la forêt' : ce géant millénaire est le sanctuaire de l'énergie de la nature du Sud et de l'Ouest malgache.",
        },
        {
          type: 'quiz',
          question:
            'Comment les villageois réussissaient-ils l’exploit technique de déplacer ces monolithes géants de plusieurs tonnes ?',
          questionMg:
            'Ahoana no nahafahan’ny Ntaolo nitarika ireny vato mavesatra ireny fahiny ?',
          choices: [
            'Par la force solidaire de centaines d’hommes tirant ensemble au rythme de chants d’encouragement',
            'À l’aide de grues électriques modernes',
            'Avec des camions à moteur',
            'Par magie sans toucher la pierre',
          ],
          correctIndex: 0,
          explanation:
            'La traction collective des pierres mégalithiques était une prouesse de cohésion sociale et de force musculaire partagée dans la fête.',
        },
      ],
    },
    // ─── LEÇON 12 : LES RITES AGRAIRES (FAFY SY ASARAMANITRA) ───
    {
      slug: 'les-rites-agraires-fafy-sy-asaramanitra',
      title:
        'Les rites agraires : Le Fafy vary et la célébration des prémices Asaramanitra',
      titleMg:
        'Ny Fombafomba amin’ny Fambolem-bary : Ny Fafy sy ny Asaramanitra',
      summary:
        'Découvrez les cérémonies sacrées du cycle du riz : la bénédiction des semences dans la boue de la rizière et la joie de la moisson partagée.',
      summaryMg:
        "Fantaro ny fomba amam-panao manodidina ny vary : ny fafy voalohany amin'ny tanimbary sy ny fetin'ny taom-piotazana Asaramanitra.",
      type: 'CULTURE',
      orderIndex: 12,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, cultiver le riz n'est pas une simple opération agricole : c'est un dialogue rituel continu avec la terre sacrée et la pluie féconde accordée par Zanahary. Avant de répandre les premiers grains de semence (Fafy vary) dans la boue fertile de la rizière, les chefs de famille accomplissent des prières pour écarter les sauterelles et les crues dévastatrices. Lors de la récolte (Vakivary), la dégustation des prémices (Asaramanitra) réunit tout le village dans une fête de louange et de communion.",
          textMg:
            "Zava-masina ny fambolem-bary amin'ny Malagasy. Alalana amin'ny fomba sy vavaka ny fafy voalohany mba ho lavitry ny valala sy ny tondra-drano ny tanimbary. Rehefa miakatra ny voka-bary dia fety lehibe antsoina hoe Asaramanitra no ifampizarana ny vary vao.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / FY',
          phonetic: 'fa-fi',
          frenchEquivalent:
            "Le mot « Fafy » désigne l'acte solennel de semer à la volée les grains de riz prégermés dans l'eau boueuse.",
          sampleWordMg: 'Fafy vary',
          sampleTranslationFr: 'Le semis rituel du riz dans la pépinière',
        },
        {
          type: 'concept',
          termMg: 'Fafy vary sy Fangataham-pitahiana',
          phonetic: 'fa-fi va-ri si fan-ga-ta-ham-pi-ta-hi-a-na',
          meaningFr:
            'Le semis du riz et la prière de fécondité adressée aux ancêtres',
          explanation:
            "L'agriculteur jette la première poignée de semence vers l'Est en invoquant la bénédiction de Dieu pour que chaque grain donne un millier d'épis d'or.",
        },
        {
          type: 'concept',
          termMg: 'Asaramanitra (Vary vao)',
          phonetic: 'a-sa-ra-ma-ni-tra (va-ri va-ou)',
          meaningFr:
            'La fête de la moisson et la dégustation sacrée du riz nouveau',
          explanation:
            "Célébration des premières récoltes : le premier plat de riz nouveau cuisiné est offert aux aînés et aux ancêtres avant que la famille ne s'en délecte.",
        },
        {
          type: 'concept',
          termMg: 'Mifampitsapa taona sy Mirary soa',
          phonetic: 'mi-fam-pi-tsa-pa ta-ou-na si mi-ra-ri sou-a',
          meaningFr:
            'Se congratuler mutuellement pour avoir traversé l’année avec succès',
          explanation:
            "Échange de vœux fraternels lors de l'Asaramanitra pour se féliciter d'avoir vaincu la faim et renouvelé la vie du village.",
        },
        {
          type: 'example',
          textMg:
            'Tratry ny Asaramanitra tompoko ! Ho tratry ny arivo taona, ho lava andro iainana ary ho voky vary sy laoka lalandava.',
          textFr:
            'Bonne fête des moissons à tous ! Que vous viviez de longues années prospères et que le riz et les mets savoureux abondent toujours dans vos foyers.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le terme 'Asaramanitra' désignait originellement la saison parfumée des récoltes où les meules de riz fraîchement coupées embaument l'air des villages. Il est ensuite devenu la salutation suprême du Nouvel An malgache : 'Tratry ny Asaramanitra !'.",
          textMg:
            "Ny hoe Asaramanitra dia ny vanim-potoana manitra miakatra ny vary vao, izay lasa fiarahabana manerana an'i Madagasikara amin'ny fahatongavan'ny Taom-baovao.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que désigne l’acte agraire et spirituel appelé « Fafy vary » à Madagascar ?',
          questionMg:
            'Inona no hevitry ny hoe « Fafy vary » amin’ny fambolena malagasy ?',
          choices: [
            'Le semis solennel des premiers grains de riz dans la pépinière accompagné de prières de fertilité',
            'La vente du riz au marché',
            'La cuisson du riz pour le dîner',
            'La fabrication de farine de riz',
          ],
          correctIndex: 0,
          explanation:
            "Le Fafy vary est le moment sacré où l'agriculteur confie les semences à la terre avec la bénédiction de Zanahary et des ancêtres.",
        },
        {
          type: 'quiz',
          question:
            'Quelle coutume de déférence accomplit-on traditionnellement avec le « Vary vao » (premier riz moissonné) ?',
          questionMg:
            'Inona no fomba atao amin’ny « Vary vao » voaoty voalohany ?',
          choices: [
            'On en offre les toutes premières parts aux aînés et aux parents vénérés avant d’en manger soi-même',
            'On le jette dans le fleuve',
            'On le cache sous la terre',
            'On le brûle dans la cour',
          ],
          correctIndex: 0,
          explanation:
            "Le respect filial impose d'offrir la primeur du riz nouveau aux anciens pour honorer ceux qui ont transmis la vie.",
        },
        {
          type: 'quiz',
          question:
            'Que signifiait originellement le terme de célébration « Asaramanitra » ?',
          questionMg:
            'Inona no dikan’ny teny hoe « Asaramanitra » tany am-boalohany ?',
          choices: [
            'La saison douce et parfumée où le riz mûr dégage son arôme enivrant dans les campagnes',
            'Une fête de guerre sous la pluie',
            'Une tempête en mer',
            'Un impôt royal obligatoire',
          ],
          correctIndex: 0,
          explanation:
            "« Asaramanitra » évoque le parfum de bien-être et d'abondance qui embaume les villages lorsque les rizières sont dorées et moissonnées.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le travail du riz mobilise-t-il l’entraide communautaire par excellence ?',
          questionMg:
            'Nahoana no mitaky firaisankina lehibe ny asa fambolem-bary ?',
          choices: [
            'Parce que le labour, le repiquage et la moisson exigent une main-d’œuvre solidaire que nul ne peut accomplir seul',
            'Parce que les lois l’interdisent aux personnes seules',
            'Parce que le riz ne pousse que si l’on chante à dix',
            'Pour faire plaisir aux voisins uniquement',
          ],
          correctIndex: 0,
          explanation:
            "La rizière irriguée est l'école vivante de la solidarité : sans le Valin-tanana, aucun paysan ne pourrait repiquer ou faucher à temps.",
        },
        {
          type: 'quiz',
          question:
            'Quelle formule de vœux universelle les Malgaches s’échangent-ils avec joie lors de l’Asaramanitra ?',
          questionMg:
            'Inona no teny firarian-tsoa tononina rehefa tonga ny Asaramanitra ?',
          choices: [
            '« Tratry ny Asaramanitra tompoko, ho tratry ny arivo taona ! »',
            '« Veloma mandrakizay »',
            '« Mialà eo »',
            '« Aiza ny fanalahidy ? »',
          ],
          correctIndex: 0,
          explanation:
            "« Tratry ny Asaramanitra » célèbre la traversée victorieuse de l'année et le renouveau de l'abondance partagée.",
        },
      ],
    },
  ],
};
