import { SeedTrack } from './seed.types.js';

export const geographyTrack: SeedTrack = {
  slug: 'geographie-de-madagascar-et-territoires',
  title: 'Géographie de Madagascar & les 23 Régions',
  titleMg: 'Jeografia sy ny Faritra 23 eto Madagasikara',
  description:
    'Explorez les contrastes géographiques de la Grande Île : le sommet du Tsaratanana, le canal des Pangalanes, les fleuves majestueux et la carte des 23 régions.',
  descriptionMg:
    'Fantaro ny bikany sy ny faritra 23 eto Madagasikara : Maromokotro tendrombohitra avo indrindra, ny lakandranon’ny Pangalana ary ireo renirano lehibe.',
  level: 'BEGINNER',
  icon: 'Compass',
  color: '#0284C7',
  orderIndex: 11,
  estimatedMinutes: 40,
  lessons: [
    // ─── LEÇON 1 : LE RELIEF DE LA GRANDE ÎLE ───
    {
      slug: 'le-relief-de-la-grande-ile-et-tsaratanana',
      title:
        'Le relief de la Grande Île : des falaises de l’Est au mont Maromokotro',
      titleMg: 'Ny Vohon’ny Tany sy ny Tendrombohitra Maromokotro (2 876 m)',
      summary:
        'Comprenez la morphologie asymétrique de Madagascar : la falaise orientale boisée, le socle central granitique et les plaines sédimentaires de l’Ouest.',
      summaryMg:
        'Diniho ny fahasamihafan’ny vohon’ny tany : ny harana an-kady atsinanana, ny afovoan-tany be tendrombohitra ary ny tany lemaka andrefana.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "S'étirant sur près de 1 600 kilomètres de long et 580 kilomètres de large, Madagascar est la cinquième plus grande île du monde avec 587 000 km². Son relief présente une asymétrie frappante : à l'Est, une haute falaise abrupte (la falaise de l'Angavo) plonge rapidement dans l'océan Indien ; au centre s'élèvent les Hautes Terres granitiques culminant au mont Maromokotro (2 876 m dans le massif du Tsaratanana) ; à l'Ouest enfin, de vastes plaines descendent en pente douce vers le canal de Mozambique.",
          textMg:
            "Manana velarana 587 000 km² i Madagasikara, nosy faha-dimy lehibe indrindra eran-tany. Ny vohon-tany dia ahitana fitongilanana lehibe : ny hantsana mikitroka any Atsinanana, ny Afovoan-tany be havoana misy ny tampon'i Maromokotro (2 876 m), ary ireo lemaka midadasika miakatra miadana any Andrefana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'MA / RO / MO / KO / TRO',
          phonetic: 'ma-rou-mou-kou-trou',
          frenchEquivalent:
            "Le nom « Maromokotro » signifie littéralement 'qui a beaucoup d'épines ou d'aspérités rocheuses' (le toit de Madagascar).",
          sampleWordMg: 'Maromokotro',
          sampleTranslationFr:
            'Le mont Maromokotro (2 876 m, point culminant de l’île)',
        },
        {
          type: 'concept',
          termMg: 'Ny Vohon’ny tany (Jeografia ara-batana)',
          phonetic: 'ni vou-houn-ni ta-ni',
          meaningFr: 'Le relief physique et la géomorphologie terrestre',
          explanation:
            "L'île est divisée en trois bandes méridiennes : la côte orientale étroite, les hauts plateaux centraux et les bassins sédimentaires occidentaux.",
        },
        {
          type: 'concept',
          termMg: 'Massif du Tsaratanana sy Ankaratra',
          phonetic: 'tsa-ra-ta-na-na si an-ka-ra-tra',
          meaningFr: 'Les grands massifs volcaniques et montagneux de l’île',
          explanation:
            "Le Tsaratanana au Nord (point culminant) et l'Ankaratra au centre (Tsiafajavona, 2 642 m), anciens géants volcaniques aujourd'hui éteints.",
        },
        {
          type: 'concept',
          termMg: 'Tany mena (Lavaka)',
          phonetic: 'ta-ni me-na (la-va-ka)',
          meaningFr:
            'La terre latéritique rouge et les ravins d’érosion spectaculaires',
          explanation:
            "La latérite rouge donne à Madagascar son surnom d'« Île Rouge » : sous l'action des pluies tropicales, des cratères d'érosion appelés *lavaka* entaillent les collines.",
        },
        {
          type: 'example',
          textMg:
            "Ny tendrombohitra Maromokotro any Tsaratanana no tafo avo indrindra eto Madagasikara, ahitana orampanala manify indraindray amin'ny ririnina.",
          textFr:
            "Le mont Maromokotro dans le Tsaratanana est le toit culminant de Madagascar, où l'on observe parfois de légères gelées en plein hiver austral.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'La superficie de Madagascar (587 041 km²) est plus vaste que celle de la France métropolitaine, de la Belgique et des Pays-Bas réunis !',
          textMg:
            "Ny velaran-tanin'i Madagasikara dia lehibe lavitra noho ny tanin'i Frantsa, Belzika ary Pays-Bas atambatra !",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel est le point culminant de Madagascar et dans quel massif montagneux se situe-t-il ?',
          questionMg:
            'Inona ny tendrombohitra avo indrindra eto Madagasikara ary aiza no misy azy ?',
          choices: [
            'Le mont Maromokotro (2 876 mètres) dans le massif du Tsaratanana au Nord',
            'Le pic Boby dans l’Andringitra',
            'Le Tsiafajavona dans l’Ankaratra',
            'La montagne d’Ambre à Diego',
          ],
          correctIndex: 0,
          explanation:
            "Le Maromokotro culmine à 2 876 mètres d'altitude dans le massif du Tsaratanana, dans la région DIANA au Nord de l'île.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi Madagascar est-elle universellement surnommée l’« Île Rouge » ?',
          questionMg: 'Nahoana no antsoina hoe « Nosy Mena » i Madagasikara ?',
          choices: [
            'À cause de la couleur ocre-rougeâtre caractéristique de sa terre latéritique riche en fer',
            'Parce que tous les arbres ont des feuilles rouges',
            'En souvenir d’un drapeau historique tout rouge',
            'Parce que le sable des plages est rouge vif',
          ],
          correctIndex: 0,
          explanation:
            'La latérite ferrugineuse dénudée donne aux collines et aux fleuves limoneux cette teinte rouge sang emblématique.',
        },
        {
          type: 'quiz',
          question:
            'Quel rang mondial Madagascar occupe-t-elle par sa superficie parmi toutes les îles de la planète ?',
          questionMg:
            'Laharana faha-firy eran-tany i Madagasikara amin’ny haben’ny velaran-tany amin’ireo nosy rehetra ?',
          choices: [
            'La 5e plus grande île du monde (après le Groenland, la Nouvelle-Guinée, Bornéo et la Terre de Baffin)',
            'La 1ère plus grande île',
            'La 20e île',
            'La 100e île',
          ],
          correctIndex: 0,
          explanation:
            "Madagascar est la 5e plus vaste île de la Terre (et la première d'Afrique) avec près de 587 000 km².",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on en malgache ces gigantesques entailles d’érosion en forme d’amphithéâtre qui sculptent les collines des Hautes Terres ?',
          questionMg:
            'Ahoana no iantsoana ireny lavaka goavana vokatry ny fikaohan’ny orana ny vohitra ireny ?',
          choices: ['Les « Lavaka »', 'Les Baobabs', 'Les Doany', 'Les Tsingy'],
          correctIndex: 0,
          explanation:
            "Le mot géomorphologique international 'Lavaka' désigne ces cirques d'érosion régressive caractéristiques de la latérite malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la longueur approximative de Madagascar du Cap d’Ambre (Nord) au Cap Sainte-Marie (Sud) ?',
          questionMg:
            'Firy kilometatra eo ho eo ny halavan’i Madagasikara manomboka any Bobaomby ka hatrany Tanjona Vohimena ?',
          choices: [
            'Environ 1 600 kilomètres',
            'Seulement 300 kilomètres',
            'Exactement 5 000 kilomètres',
            'Environ 500 kilomètres',
          ],
          correctIndex: 0,
          explanation:
            "Madagascar s'étire sur près de 1 600 km du nord au sud, soit l'équivalent de la distance entre Paris et Alger !",
        },
      ],
    },
    // ─── LEÇON 2 : LA MOSAÏQUE DES CLIMATS ───
    {
      slug: 'la-mosaique-des-climats-alize-et-mousson',
      title:
        'La mosaïque des climats : Alizés humides, mousson du Talio et sécheresse du Sud',
      titleMg:
        'Ireo Toetrandro maro loko : Alizay, Talio ary ny Hain-tany any Atsimo',
      summary:
        'Explorez les contrastes climatiques spectaculaires : de la pluie tropicale quasi quotidienne de l’Est au climat semi-aride subdésertique du Grand Sud.',
      summaryMg:
        'Diniho ny fahasamihafan’ny toetrandro : ny orana mikija any Atsinanana, ny hafanana any Andrefana ary ny toetrandro maina any Atsimo.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Bien que située entièrement dans la zone intertropicale, Madagascar possède une diversité de climats digne d'un continent. Les alizés venus du sud-est butent contre la falaise orientale et déversent jusqu'à 3 500 mm d'eau par an, nourrissant la forêt tropicale humide. En traversant les hauts plateaux, l'air s'assèche : l'Ouest connaît une longue saison sèche ensoleillée, tandis que l'extrême Sud semi-aride ne reçoit que 300 mm de pluie par an, abritant le bush d'épineux (didiéracées).",
          textMg:
            "Mizara toetrandro maro i Madagasikara : ny rivotra Alizay mitondra orana be any Atsinanana (3 500 mm isan-taona), ny Afovoan-tany mangatsiaka amin'ny ririnina, ny Andrefana mafana sy maina, ary ny Atsimo tena tsy ampy orana ahitana zavamaniry misy tsilo.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'A / LI / ZAY',
          phonetic: 'a-li-zai',
          frenchEquivalent:
            "L'« Alizay » désigne le vent régulier d'Est qui apporte les pluies bienfaitrices sur la côte orientale.",
          sampleWordMg: 'Alizay',
          sampleTranslationFr: 'Le vent alizé du Sud-Est',
        },
        {
          type: 'concept',
          termMg: 'Rivotra Alizay sy Talio',
          phonetic: 'ri-vou-tra a-li-zai si ta-li-ou',
          meaningFr:
            'L’Alizé oriental permanent et la mousson humide du Nord-Ouest (Talio)',
          explanation:
            "Les deux grands moteurs atmosphériques de l'île : le Talio apporte la pluie d'été au Nord-Ouest tandis que l'Alizé arrose l'Est toute l'année.",
        },
        {
          type: 'concept',
          termMg: 'Faritra Maina any Atsimo (Bush épineux)',
          phonetic: 'fa-ri-tra mai-na a-ni at-si-mou',
          meaningFr: 'La zone subaride méridionale et sa végétation xérophile',
          explanation:
            "Écosystème unique au monde d'arbres pieuvres (Didierea madagascariensis) et d'aloès géants adaptés pour survivre des mois sans une seule goutte de pluie.",
        },
        {
          type: 'concept',
          termMg: 'Toetrandro amin’ny Afovoan-tany (Antsirabe)',
          phonetic: 'toe-tran-drou a-min-ni a-fou-vouan-ta-ni',
          meaningFr: 'Le climat tempéré d’altitude des hauts plateaux',
          explanation:
            "À plus de 1 400 mètres d'altitude, les nuits d'hiver (juin-août) peuvent descendre près de 0°C à Antsirabe, avec d'épaisses gelées blanches matinales.",
        },
        {
          type: 'example',
          textMg:
            'Rehefa manorana mikija any Toamasina sy Mananjary dia mety ho maina tanteraka sy mamirapiratra ny masoandro any Morondava sy Toliara.',
          textFr:
            "Pendant qu'il pleut à verse à Tamatave et Mananjary sur la côte Est, le soleil brille dans un ciel immaculé à Morondava et Tuléar à l'Ouest.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "La ville d'Antsirabe est surnommée la 'Vichy malgache' non seulement pour ses sources thermales, mais aussi pour son climat frais où les habitants portent des bonnets de laine et des manteaux chauds pendant l'hiver austral !",
          textMg:
            "Any Antsirabe amin'ny volana Jolay, mahatratra 0 degre ny hatsiaka maraina ka manao satroka ba sy akanjo mafana ny olona.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle région de Madagascar reçoit les précipitations annuelles les plus massives (jusqu’à 3 500 mm de pluie par an) ?',
          questionMg:
            'Faritra aiza eto Madagasikara no mahazo orana betsaka indrindra mandritra ny taona ?',
          choices: [
            'La côte orientale (Est) sous l’influence directe des alizés humides de l’océan Indien',
            'Le plateau de l’Horombe dans le Sud',
            'La ville de Tuléar',
            'Le désert d’Amboasary',
          ],
          correctIndex: 0,
          explanation:
            "La façade orientale bloquant les masses d'air humides venant de l'océan Indien est la zone la plus arrosée de l'île.",
        },
        {
          type: 'quiz',
          question:
            'Quelle famille de plantes épineuses uniques au monde (arbres pieuvres) domine le paysage aride du Sud malgache ?',
          questionMg:
            'Inona ilay fianakavian-javamaniry misy tsilo tsy misy afa-tsy any amin’ny faritra Atsimon’i Madagasikara ?',
          choices: [
            'Les Didiéréacées (Didiereaceae)',
            'Les pommiers nains',
            'Les sapins du Nord',
            'Les nénuphars géants',
          ],
          correctIndex: 0,
          explanation:
            'Les Didiéracées sont une famille végétale endémique stricte du bush épineux subaride du Sud de Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'Pendant quelle période de l’année s’étend l’hiver austral (saison sèche et fraîche) à Madagascar ?',
          questionMg:
            'Amin’ny volana inona avy ny vanim-potoana ririnina mangatsiaka eto Madagasikara ?',
          choices: [
            'De mai/juin à août/septembre',
            'De décembre à février',
            'Toute l’année sans interruption',
            'Uniquement pendant deux jours en mars',
          ],
          correctIndex: 0,
          explanation:
            "Située dans l'hémisphère sud, Madagascar vit son hiver austral pendant les mois de juin, juillet et août.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on la mousson humide du Nord-Ouest qui apporte les pluies estivales sur la région de Mahajanga et Nosy Be ?',
          questionMg:
            'Ahoana no iantsoana ilay rivotra mafana mitondra orana avy any Avaratra-Andrefana amin’ny fahavaratra ?',
          choices: [
            'Le vent Talio (mousson du Nord-Ouest)',
            'L’Alizé sec',
            'Le Mistral',
            'Le Sirocco',
          ],
          correctIndex: 0,
          explanation:
            "Le Talio est la mousson océanique qui déverse les pluies de l'été austral sur le quart nord-ouest de Madagascar.",
        },
        {
          type: 'quiz',
          question:
            'Quelle ville des Hautes Terres est réputée pour enregistrer les températures les plus fraîches de l’île en hiver ?',
          questionMg:
            'Inona ilay tanàna malaza ho mangatsiaka indrindra amin’ny ririnina eto Madagasikara ?',
          choices: [
            'Antsirabe (la ville d’eau)',
            'Mahajanga',
            'Morondava',
            'Diego-Suarez',
          ],
          correctIndex: 0,
          explanation:
            "Située à plus de 1 500 m d'altitude dans une cuvette volcanique, Antsirabe connaît des températures nocturnes frôlant parfois 0°C.",
        },
      ],
    },
    // ─── LEÇON 3 : LES FLEUVES & PANGALANES ───
    {
      slug: 'les-fleuves-majeurs-et-le-canal-des-pangalanes',
      title:
        'Les fleuves majeurs et la lagune des Pangalanes : artères aquatiques de l’île',
      titleMg:
        'Ireo Renirano lehibe sy ny Lakandranon’ny Pangalana : Lalan-drano sarobidy',
      summary:
        'Parcourez le réseau hydrographique de Madagascar : la majestueuse Betsiboka rouge, la descente de la Tsiribihina et les 600 km du canal des Pangalanes.',
      summaryMg:
        'Tsidiho ireo lalan-drano lehibe : Betsiboka mena mikoriana any Mahajanga, Tsiribihina any Menabe ary ny lakandranon’ny Pangalana 600 km.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "L'hydrographie de Madagascar est le miroir de son relief. Vers l'Est tumultueux, des fleuves courts et impétueux dévalent les falaises pour se jeter dans le canal des Pangalanes, une voie navigable artificielle et lagunaire de plus de 600 kilomètres longeant l'océan Indien. Vers l'Ouest, de longs fleuves puissants et paresseux (Betsiboka, Tsiribihina, Mangoky, Onilahy) charrient des tonnes de sédiments latéritiques jusqu'au canal de Mozambique, formant de splendides deltas de mangroves.",
          textMg:
            "Miankina amin'ny vohon-tany ny reniranon'i Madagasikara. Any Atsinanana, fohy sy mahery ny rano mikoriana mankany amin'ny Lakandranon'ny Pangalana mirefy 600 km. Any Andrefana kosa, lava sy midadasika ireo renirano lehibe toa an'i Betsiboka, Tsiribihina ary Mangoky mitondra tany mena mankany an-dranomasina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'PA / NGA / LA / NES',
          phonetic: 'pan-ga-la-na',
          frenchEquivalent:
            "Le nom « Pangalanes » vient du malgache 'Ampangalana' : le lieu où l'on décharge les pirogues pour traverser les cordons de terre d'un lac à l'autre.",
          sampleWordMg: 'Pangalana',
          sampleTranslationFr:
            'Le canal des Pangalanes / Le point de transbordement des pirogues',
        },
        {
          type: 'concept',
          termMg: 'Renirano Betsiboka',
          phonetic: 're-ni-ra-nou bet-si-bou-ka',
          meaningFr: 'Le fleuve Betsiboka et son immense estuaire rouge sang',
          explanation:
            "Le plus long fleuve navigable de l'Ouest, célèbre depuis l'espace pour son estuaire flamboyant débouchant dans la baie de Bombetoka à Mahajanga.",
        },
        {
          type: 'concept',
          termMg: 'Fidinana an’i Tsiribihina am-bahoho',
          phonetic: 'fi-di-na-na an-tsi-ri-bi-hi-na',
          meaningFr:
            'La descente touristique et commerciale du fleuve Tsiribihina en chaland',
          explanation:
            'Voie fluviale mythique traversant les gorges calcaires du Bemaraha pour relier Miandrivazo aux côtes du Menabe.',
        },
        {
          type: 'concept',
          termMg: 'Lakandranon’ny Pangalana (645 km)',
          phonetic: 'la-kan-dra-noun-ni pan-ga-la-na',
          meaningFr:
            'Le canal fluvial côtier continu de Foulpointe à Farafangana',
          explanation:
            "Construit sous Gallieni au début du XXe siècle en reliant entre eux les chapelets de lagunes naturelles pour échapper aux vagues dangereuses de l'océan Indien.",
        },
        {
          type: 'example',
          textMg:
            "Ny lakandranon'ny Pangalana dia lalan-drano mamelona ny mponina amorontsiraka : lakana mitondra akondro sy kafe ary trondro isan'andro.",
          textFr:
            "Le canal des Pangalanes est l'artère nourricière des riverains de l'Est : les pirogues y transportent bananes, café et poissons au quotidien en toute sécurité.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les astronautes à bord de la Station Spatiale Internationale (ISS) reconnaissent Madagascar au premier coup d'œil grâce à l'estuaire de la Betsiboka qui colore l'océan en rouge orangé sur des dizaines de kilomètres, donnant l'impression que 'l'île saigne dans la mer'.",
          textMg:
            "Avy eny amin'ny habakabaka, ny reniranon'i Betsiboka mandoko ny ranomasina ho mena no ahafantarana avy hatrany ny sarin'i Madagasikara.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la longueur totale approximative du Canal des Pangalanes aménagé le long de la côte Est ?',
          questionMg:
            'Mahatratra firy kilometatra eo ho eo ny halavan’ny Lakandranon’ny Pangalana any Atsinanana ?',
          choices: [
            'Environ 645 kilomètres (l’une des plus longues voies navigables calmes du monde)',
            'Seulement 10 kilomètres',
            'Exactement 2 000 kilomètres',
            'Moins de 50 kilomètres',
          ],
          correctIndex: 0,
          explanation:
            "Le canal des Pangalanes s'étend sur près de 650 km entre Tamatave et Farafangana, reliant des chapelets de lacs d'eau douce.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le canal des Pangalanes a-t-il été creusé au début du XXe siècle parallèlement à l’océan ?',
          questionMg:
            'Nahoana no namboarina ny Lakandranon’ny Pangalana tamin’ny fiandohan’ny taonjato faha-20 ?',
          choices: [
            'Pour permettre aux pirogues de naviguer en sécurité à l’abri des rouleaux dangereux et des requins de l’océan Indien',
            'Pour faire des courses de bateaux à moteur de vitesse',
            'Pour vider l’eau des lacs',
            'Pour empêcher les gens de voyager',
          ],
          correctIndex: 0,
          explanation:
            "L'océan Indien étant très houleux et infesté de requins sur la côte Est, le canal intérieur offrait une navigation calme et protégée.",
        },
        {
          type: 'quiz',
          question:
            'Quel grand fleuve de l’Ouest malgache se jette dans la baie de Bombetoka près de Mahajanga avec une couleur rouge spectaculaire ?',
          questionMg:
            'Inona ilay renirano lehibe any Andrefana mivarina ao amin’ny helodranon’i Bombetoka any Mahajanga ?',
          choices: [
            'Le fleuve Betsiboka',
            'La Seine',
            'Le Nil',
            'Le fleuve Congo',
          ],
          correctIndex: 0,
          explanation:
            "La Betsiboka est le fleuve le plus célèbre pour son imposant delta teinté d'ocre rouge issu de l'érosion des plateaux centraux.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie étymologiquement le mot malgache « Ampangalana » qui a donné le nom « Pangalanes » ?',
          questionMg:
            'Inona no hevitry ny teny malagasy hoe « Ampangalana » niavian’ny anarana hoe Pangalana ?',
          choices: [
            'L’endroit de portage où l’on déchargeait la pirogue pour franchir la terre séparant deux lacs',
            'L’endroit où l’on pêche le crabe',
            'La maison des tortues',
            'La forêt de bambous',
          ],
          correctIndex: 0,
          explanation:
            "Avant le creusement du canal continu, les piroguiers devaient hisser et décharger ('mangalana') leurs embarcations pour passer d'un lac à l'autre.",
        },
        {
          type: 'quiz',
          question:
            'Quel fleuve réputé pour ses paysages grandioses descend-on traditionnellement en chaland touristique de Miandrivazo jusqu’à Belo-sur-Tsiribihina ?',
          questionMg:
            'Inona ilay renirano malaza idinana an-tsambo kely miainga any Miandrivazo mankany Menabe ?',
          choices: [
            'Le fleuve Tsiribihina',
            'L’Ikopa dans la capitale',
            'Le fleuve Maningory',
            'La rivière Lily',
          ],
          correctIndex: 0,
          explanation:
            "La descente de la Tsiribihina est l'un des voyages fluviaux les plus mythiques de Madagascar, serpentant au milieu des falaises et des baobabs.",
        },
      ],
    },
    // ─── LEÇON 4 : LES 23 RÉGIONS ADMINISTRATIVES ───
    {
      slug: 'les-23-regions-de-madagascar-et-chefs-lieux',
      title: 'Les 23 Régions administratives et leurs capitales économiques',
      titleMg:
        'Ireo Faritra 23 eto Madagasikara sy ny Renivohiny : Fizaran-tany',
      summary:
        'Maîtrisez la carte administrative de Madagascar : des 6 provinces historiques aux 23 régions décentralisées actuelles, leurs ressources et leurs villes phares.',
      summaryMg:
        'Lasa mahay ny sarintany ofisialy : nanomboka tamin’ny faritany 6 ka hatramin’ny faritra 23 ankehitriny, ny harenany ary ireo renivohi-paritra.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Pour rapprocher l'administration des citoyens et stimuler le développement local, Madagascar est passée de ses 6 provinces historiques (Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina, Toliara) à un découpage décentralisé en 23 Régions (Faritra). Chaque région possède sa personnalité géographique propre, sa capitale administrative et ses richesses économiques spécifiques : la Sava et sa vanille, Analamanga cœur politique, le Vakinankaratra grenier agricole ou l'Atsimo-Andrefana pôle minier et touristique.",
          textMg:
            "Mba hanatranterana ny fitsinjaram-pahefana, nizara ho Faritra 23 i Madagasikara ho solon'ireo Faritany 6 taloha. Manana ny mampiavaka azy ny faritra tsirairay : ny Sava malaza amin'ny lavanila, Analamanga renivohitra ara-politika, Vakinankaratra sompitry ny fambolena ary Atsimo-Andrefana manankarena.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / RI / TRA',
          phonetic: 'fa-ri-tra',
          frenchEquivalent:
            'Le mot « Faritra » désigne la région administrative décentralisée en malgache.',
          sampleWordMg: 'Faritra',
          sampleTranslationFr: 'La région administrative / Le territoire',
        },
        {
          type: 'concept',
          termMg: 'Faritra SAVA (Sambava, Antalaha, Vohémar, Andapa)',
          phonetic: 'fa-ri-tra sa-va',
          meaningFr: 'La région du Nord-Est capitale mondiale de la vanille',
          explanation:
            "Son nom est un acronyme formé des quatre grandes villes côtières et fertiles spécialisées dans la culture et l'exportation de la vanille bourbon.",
        },
        {
          type: 'concept',
          termMg: 'Faritra Analamanga sy Vakinankaratra',
          phonetic: 'a-na-la-man-ga si va-ki-nan-ka-ra-tra',
          meaningFr: 'Les deux régions motrices des Hautes Terres centrales',
          explanation:
            'Analamanga abrite la capitale Antananarivo, tandis que le Vakinankaratra (Antsirabe) concentre les industries agroalimentaires et les vergers fruitiers.',
        },
        {
          type: 'concept',
          termMg: 'Faritra Atsinanana sy Boeny',
          phonetic: 'at-si-na-na-na si boue-ni',
          meaningFr:
            'Les grands débouchés maritimes portuaires de l’Est et de l’Ouest',
          explanation:
            'Atsinanana avec le grand port de Toamasina (Tamatave, 1er port du pays) et le Boeny avec la métropole maritime cosmopolite de Mahajanga.',
        },
        {
          type: 'example',
          textMg:
            "Ny fahalalana ireo Faritra 23 dia manampy antsika hahatakatra ny harenan'ny tanindrazana sy ny fahasamihafan'ny fiainana isam-paritra.",
          textFr:
            'La maîtrise des 23 Régions nous permet de saisir toute la richesse de notre patrie et la féconde diversité humaine de nos terroirs.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "La 23e région créée à Madagascar est la région 'Vatovavy', née de la scission de l'ancienne région Vatovavy-Fitovinany en 2021, avec Mananjary pour chef-lieu, tandis que Manakara est devenue la capitale de la région Fitovinany.",
          textMg:
            "Tamin'ny taona 2021 no teraka tamin'ny fomba ofisialy ny Faritra faha-23 'Vatovavy' manana an'i Mananjary ho renivohitra.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Combien de Régions administratives décentralisées (Faritra) composent actuellement le territoire de Madagascar ?',
          questionMg:
            'Firy ny isan’ny Faritra mandrafitra an’i Madagasikara amin’izao fotoana izao ?',
          choices: [
            '23 Régions (depuis la création de la région Vatovavy en 2021)',
            '6 Régions',
            '50 Régions',
            '100 Régions',
          ],
          correctIndex: 0,
          explanation:
            'Madagascar compte 23 régions administratives issues de la scission et de la modernisation de ses 6 provinces historiques.',
        },
        {
          type: 'quiz',
          question:
            'De quelles quatre villes majeures de la vanille la région « SAVA » tire-t-elle son nom acronyme ?',
          questionMg:
            'Avy amin’ny anaran’ireo tanàna efatra inona no niavian’ny anarana hoe Faritra SAVA ?',
          choices: [
            'Sambava, Antalaha, Vohémar et Andapa',
            'Sainte-Marie, Ambanja, Vohemar et Ankazobe',
            'Soavinandriana, Antananarivo, Vatomandry et Ambositra',
            'Sakatia, Ambatondrazaka, Vangaindrano et Ankify',
          ],
          correctIndex: 0,
          explanation:
            'S.A.V.A. est le sigle formé par les initiales de Sambava, Antalaha, Vohémar et Andapa, le triangle mondial de la vanille.',
        },
        {
          type: 'quiz',
          question:
            'Quelle grande ville côtière de la région Atsinanana abrite le premier port de commerce maritime international de Madagascar ?',
          questionMg:
            'Inona ilay tanàna lehibe misy ny seranan-tsambo voalohany mampitohy an’i Madagasikara amin’izao tontolo izao ?',
          choices: [
            'Toamasina (Tamatave)',
            'Toliara (Tuléar)',
            'Morondava',
            'Taolagnaro (Fort-Dauphin)',
          ],
          correctIndex: 0,
          explanation:
            "Toamasina traite plus de 80 % du trafic maritime de marchandises conteneurisées et d'hydrocarbures de l'île.",
        },
        {
          type: 'quiz',
          question:
            'Quelle région du centre de Madagascar, ayant Antsirabe pour capitale, est réputée comme le « grenier agricole et laitier » du pays ?',
          questionMg:
            'Inona ilay faritra manana an’Antsirabe ho renivohitra malaza amin’ny fambolena legioma sy ny ronono ?',
          choices: [
            'La région Vakinankaratra',
            'La région Menabe',
            'La région Androy',
            'La région Melaky',
          ],
          correctIndex: 0,
          explanation:
            "Le Vakinankaratra bénéficie de sols volcaniques fertiles et d'un climat frais propice aux cultures maraîchères, aux pommes et aux vaches laitières.",
        },
        {
          type: 'quiz',
          question:
            'Quelle ville historique de la côte Sud-Est est devenue le chef-lieu de la 23e région Vatovavy ?',
          questionMg:
            'Inona ny renivohitry ny Faritra faha-23 Vatovavy noforonina tamin’ny 2021 ?',
          choices: ['Mananjary', 'Fianarantsoa', 'Farafangana', 'Moramanga'],
          correctIndex: 0,
          explanation:
            'Mananjary est la capitale de la région Vatovavy, célèbre pour son fleuve, son port canal et la fête septennale du Sambatra.',
        },
      ],
    },
    // ─── LEÇON 5 : LES ÎLES SATELLITES DE MADAGASCAR ───
    {
      slug: 'les-iles-satellites-nosy-be-et-sainte-marie',
      title:
        'Les îles satellites : Nosy Be, Sainte-Marie et les archipels côtiers',
      titleMg: 'Ireo Nosy kely manodidina : Nosy Be, Nosy Boraha ary Radama',
      summary:
        'Parcourez les joyaux insulaires qui bordent Madagascar : Nosy Be l’île aux parfums, Sainte-Marie sanctuaire des baleines à bosse et les archipels coralliens.',
      summaryMg:
        'Tsidiho ireo nosy kely kanto manodidina : Nosy Be manitra ylang-ylang, Nosy Boraha fonenan’ny trozona ary ireo nosy kely Radama sy Mitsio.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Bordée par plus de 5 000 kilomètres de côtes, Madagascar est entourée d'un chapelet d'îles et d'archipels aux charmes contrastés. Au Nord-Ouest, dans le canal de Mozambique, s'épanouit Nosy Be ('la grande île'), surnommée 'l'île aux parfums' pour ses plantations embaumées d'ylang-ylang et de caféiers. À l'Est, dans les eaux turquoise de l'océan Indien, s'étire la paisible île Sainte-Marie (Nosy Boraha), sanctuaire mondial de reproduction des baleines à bosse venant de l'Antarctique.",
          textMg:
            "Manana morontsiraka mihoatra ny 5 000 km i Madagasikara ary ahitana nosy kely kanto maro manodidina azy. Any Avaratra-Andrefana i Nosy Be manitra ylang-ylang sy feno mpizaha tany ; any Atsinanana kosa i Nosy Boraha toerana masina iterahan'ireo trozona lehibe avy any amin'ny Ranomandry Atsimo.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'NO / SY / BE',
          phonetic: 'nou-si be',
          frenchEquivalent:
            "Le mot « Nosy » signifie 'île' en malgache, et « Be » signifie 'grand'.",
          sampleWordMg: 'Nosy',
          sampleTranslationFr: 'L’île',
        },
        {
          type: 'concept',
          termMg: 'Nosy Be (Nosy Manitra)',
          phonetic: 'nou-si be (nou-si ma-ni-tra)',
          meaningFr: 'Nosy Be, l’île aux parfums d’ylang-ylang et de vanille',
          explanation:
            'Première destination écotouristique et balnéaire du pays, célèbre pour ses cratères volcaniques sacrés (Mont Passot) et ses plages de corail.',
        },
        {
          type: 'concept',
          termMg: 'Nosy Boraha (Sainte-Marie)',
          phonetic: 'nou-si bou-ra-ha',
          meaningFr: 'L’île Sainte-Marie, havre d’histoire et de nature marine',
          explanation:
            "Île longue et étroite de 60 km, ancien repaire légendaire des pirates de l'océan Indien, célèbre pour son cimetière marin et ses lagons turquoise.",
        },
        {
          type: 'concept',
          termMg: 'Trozona (Baleines à bosse / Megaptera novaeangliae)',
          phonetic: 'trou-zou-na',
          meaningFr: 'Les baleines à bosse migratrices des mers froides',
          explanation:
            'Chaque hiver austral (juillet à septembre), des centaines de baleines viennent parader et mettre bas dans les eaux chaudes et abritées du détroit de Sainte-Marie.',
        },
        {
          type: 'example',
          textMg:
            "Ny fiavian'ireo trozona mitsambikina any Nosy Boraha isan-taona dia fampisehoana voajanahary mahatalanjona ankalazaina amin'ny fetin'ny trozona.",
          textFr:
            "Le ballet aérien des baleines à bosse sautant hors de l'eau à Sainte-Marie est un spectacle naturel féerique célébré chaque année par un festival.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "La fleur jaune d'Ylang-ylang distillée à Nosy Be produit une huile essentielle si fine et raffinée qu'elle constitue la note de cœur indispensable des plus célèbres parfums de luxe parisiens (notamment le mythique N°5 de Chanel) !",
          textMg:
            "Ny menaka manitra ylang-ylang avy ao Nosy Be no akora lafo vidy indrindra ampiasain'ireo mpanao ranomanitra lehibe indrindra eran-tany toa an'i Chanel.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Pourquoi l’île de Nosy Be au nord-ouest de Madagascar est-elle universellement surnommée « l’île aux parfums » ?',
          questionMg: 'Nahoana no antsoina hoe « Nosy Manitra » i Nosy Be ?',
          choices: [
            'En raison de ses vastes plantations embaumées de fleurs d’Ylang-ylang, de vanille et de caféiers',
            'Parce qu’on y fabrique du savon de Marseille',
            'Parce que le sable sent la rose',
            'Parce que les habitants mettent beaucoup de déodorant',
          ],
          correctIndex: 0,
          explanation:
            "Les alambics de distillation d'Ylang-ylang répandent dans tout l'air de Nosy Be une fragrance suave et exotique inimitable.",
        },
        {
          type: 'quiz',
          question:
            'Quel spectacle naturel marin grandiose attire les voyageurs du monde entier sur l’île Sainte-Marie (Nosy Boraha) entre juillet et septembre ?',
          questionMg:
            'Inona ilay fampisehoana voajanahary mahafinaritra hita any Nosy Boraha amin’ny volana Jolay ka hatramin’ny Septambra ?',
          choices: [
            'Le ballet majestueux et les sauts des baleines à bosse venant mettre bas dans le canal abrité',
            'La ponte des manchots empereurs',
            'Une course de requins blancs',
            'L’arrivée d’icebergs polaires',
          ],
          correctIndex: 0,
          explanation:
            "Les baleines à bosse parcourent plus de 6 000 km depuis l'Antarctique pour trouver dans les eaux calmes de Sainte-Marie la chaleur nécessaire à leurs baleineaux.",
        },
        {
          type: 'quiz',
          question:
            'Quel archipel paradisiaque situé au nord de Nosy Be est mondialement célèbre pour ses fonds marins coralliens et ses orgues basaltiques ?',
          questionMg:
            'Inona ilay vondron-nosy kely any avaratr’i Nosy Be malaza amin’ny haran-dranomasina sy ny vato bazalta ?',
          choices: [
            'L’archipel des Mitsio',
            'Les îles Canaries',
            'Les îles Galápagos',
            'L’archipel du Cap-Vert',
          ],
          correctIndex: 0,
          explanation:
            'Les îles Mitsio (dont la grande Mitsio et Tsarabanjina) sont réputées pour leurs eaux cristallines et leurs falaises volcaniques en orgues de basalte.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le point culminant de l’île de Nosy Be offrant un panorama circulaire à 360° sur les lacs de cratère sacrés ?',
          questionMg:
            'Inona ny tendrombohitra avo indrindra ao Nosy Be ahitana farihy masina maro ?',
          choices: [
            'Le Mont Passot (329 mètres d’altitude)',
            'Le Mont Blanc',
            'Le Kilimandjaro',
            'L’Everest',
          ],
          correctIndex: 0,
          explanation:
            'Le Mont Passot offre le coucher de soleil le plus admiré de Nosy Be, surplombant huit lacs de cratères volcaniques sacrés peuplés de crocodiles.',
        },
        {
          type: 'quiz',
          question:
            'Quel célèbre vestige historique unique au monde peut-on visiter sur un îlot au sud de la baie de Sainte-Marie ?',
          questionMg:
            'Inona ilay toerana manan-tantara miavaka azo tsidihina ao Nosy Boraha ?',
          choices: [
            'L’authentique cimetière des pirates marins avec ses tombes gravées du crâne et des tibias croisés',
            'Un château fort médiéval en pierre de taille',
            'Une pyramide égyptienne antique',
            'Une piste d’atterrissage de fusées spatiales',
          ],
          correctIndex: 0,
          explanation:
            "Le cimetière des pirates de l'île Forbans à Sainte-Marie abrite les sépultures réelles de flibustiers et corsaires du XVIIIe siècle.",
        },
      ],
    },
  ],
};
