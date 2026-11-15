import { SeedTrack } from './seed.types.js';

export const biodiversityTrack: SeedTrack = {
  slug: 'biodiversite-et-faune-endemique',
  title: 'La Biodiversité Unique de Madagascar',
  titleMg: 'Ny Zava-boahary sy ireo Biby tsy manam-paharoa',
  description:
    'Explorez le sanctuaire mondial de la biodiversité : lémuriens, caméléons pygmées, prédateurs fosa et parcs nationaux d’exception.',
  descriptionMg:
    'Diniho ny harena voajanahary mampalaza an’i Madagasikara : gidro, tanalahy, fosa ary ireo valan-javaboahary voaaro.',
  level: 'BEGINNER',
  icon: 'TreePine',
  color: '#2E7D32',
  orderIndex: 9,
  estimatedMinutes: 40,
  lessons: [
    // ─── LEÇON 1 : L'ARCHE DE NOÉ DU GONDWANA ───
    {
      slug: 'l-arche-de-noe-isolee-du-gondwana',
      title: 'L’Arche de Noé isolée du Gondwana : pourquoi 85 % d’endémisme ?',
      titleMg: 'Ny Toerana niavaka nisy an’i Madagasikara : ny Tany nihidy',
      summary:
        'Comprenez la séparation géologique de Madagascar il y a 88 millions d’années et l’évolution en vase clos d’espèces uniques au monde.',
      summaryMg:
        'Fantaro ny nisarahan’i Madagasikara tamin’i Gondwana sy ny antony mahatonga ny 85 %-n’ny biby sy zavamaniry ho eto ihany no misy azy.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Séparée de l'Afrique il y a 160 millions d'années puis de l'Inde il y a 88 millions d'années, l'île de Madagascar a évolué comme un continent miniature totalement isolé au milieu de l'océan Indien. Cette dérive géologique exceptionnelle a permis à des lignées animales et végétales archaïques de survivre et de se diversifier à l'abri des grands prédateurs continentaux, créant un taux d'endémisme record mondial supérieur à 85 %.",
          textMg:
            "Nisaraka tamin'i Afrika sy India efa am-polo tapitrisa taona lasa i Madagasikara ka nivoatra samirery teo afovoan'ny ranomasina. Noho izany fitokana-monina izany, niroborobo sy nitombo tamin'ny fomba mahagaga ireo karazam-biby sy zavamaniry ka lasa harena tsy manam-paharoa eran-tany.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'EN / DE / MI / KA',
          phonetic: 'en-de-mi-ka',
          frenchEquivalent:
            "Le mot « Endemika » désigne les espèces vivantes exclusives à Madagascar que l'on ne trouve nulle part ailleurs sur la Terre.",
          sampleWordMg: 'Endemika',
          sampleTranslationFr: 'Endémique / Exclusif à l’île',
        },
        {
          type: 'concept',
          termMg: 'Nosy nitoka-monina (Tany manirery)',
          phonetic: 'nou-si ni-tou-ka mou-ni-na',
          meaningFr: 'L’isolement insulaire géographique protecteur',
          explanation:
            "L'océan Indien a agi comme une barrière protectrice infranchissable, protégeant la faune insulaire contre l'arrivée des félins géants et grands singes africains.",
        },
        {
          type: 'concept',
          termMg: 'Hotspot mondial de biodiversité',
          phonetic: 'hotspot moun-di-al',
          meaningFr: 'Zone prioritaire planétaire pour la conservation',
          explanation:
            'Madagascar figure parmi les 36 points chauds de biodiversité les plus précieux et les plus vulnérables de la planète Terre.',
        },
        {
          type: 'concept',
          termMg: 'Zavamananaina tsy hita any an-kafa',
          phonetic: 'za-va-ma-na-nai-na tsi hi-ta a-ni an-ka-fa',
          meaningFr:
            'Des êtres vivants introuvables sur le reste de la planète',
          explanation:
            "Plus de 90 % des plantes, 100 % des lémuriens et 95 % des reptiles de Madagascar n'existent nulle part ailleurs à l'état naturel.",
        },
        {
          type: 'example',
          textMg:
            "I Madagasikara dia toerana masina ho an'ny siansa : raha lany tamingana ny biby eto dia lany tamingana eo amin'izao tontolo izao koa.",
          textFr:
            'Madagascar est un sanctuaire irremplaçable pour la science : si une espèce disparaît ici, elle disparaît à jamais de la Terre entière.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Madagascar compte plus d'espèces de baobabs à elle seule (6 espèces endémiques) que l'ensemble du continent africain tout entier (qui n'en compte qu'une seule espèce) !",
          textMg:
            "Manana karazana baobab miisa enina tsy misy afa-tsy eto Madagasikara, raha karazana tokana monja no misy any amin'ny kaontinanta afrikana manontolo.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Pourquoi Madagascar possède-t-elle un taux d’endémisme biologique aussi exceptionnel (plus de 85 %) ?',
          questionMg:
            'Nahoana no manana karazam-biby tsy misy afa-tsy eto aminy mihoatra ny 85 % i Madagasikara ?',
          choices: [
            'En raison de son isolement insulaire total depuis sa séparation d’avec l’Inde il y a 88 millions d’années',
            'Parce que le climat est toujours froid',
            'Parce que les animaux ont été apportés récemment par bateau',
            'Parce que l’île est très petite',
          ],
          correctIndex: 0,
          explanation:
            "L'isolement géologique prolongé a permis aux espèces animales et végétales d'évoluer en vase clos sans la concurrence des mammifères continentaux.",
        },
        {
          type: 'quiz',
          question:
            'Combien d’espèces de baobabs endémiques exclusives trouve-t-on à Madagascar ?',
          questionMg:
            'Firy ny karazana baobab tsy misy afa-tsy eto Madagasikara ?',
          choices: [
            '6 espèces endémiques (sur les 8 espèces existant sur toute la planète)',
            'Une seule espèce',
            'Aucune espèce',
            'Plus de cinquante espèces',
          ],
          correctIndex: 0,
          explanation:
            'Sur les 8 espèces de baobabs au monde, 6 sont strictement endémiques de Madagascar, 1 pousse en Afrique et 1 en Australie.',
        },
        {
          type: 'quiz',
          question:
            'Quelle grande masse continentale préhistorique regroupait jadis Madagascar, l’Afrique, l’Inde et l’Amérique du Sud ?',
          questionMg:
            'Inona ilay kôntinanta lehibe tany am-boalohany nisy an’i Madagasikara sy Afrika ?',
          choices: [
            'Le supercontinent du Gondwana',
            'L’Atlantide',
            'L’Eurasie',
            'La Pangée du Nord (Laurasia)',
          ],
          correctIndex: 0,
          explanation:
            "La fragmentation du supercontinent Gondwana à l'ère mésozoïque est à l'origine de l'isolement singulier de la plaque malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quel pourcentage approximatif des espèces de reptiles de Madagascar est endémique de l’île ?',
          questionMg:
            'Manodidina ny firy isan-jato amin’ny biby mandady eto Madagasikara no tsy hita any an-kafa ?',
          choices: [
            'Environ 95 % des reptiles',
            'Moins de 10 %',
            'Exactement 50 %',
            'Seulement 25 %',
          ],
          correctIndex: 0,
          explanation:
            'Presque la totalité des serpents, caméléons et geckos de Madagascar sont rigoureusement introuvables hors de la Grande Île.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les scientifiques qualifient-ils Madagascar de « continent miniature » ?',
          questionMg:
            'Nahoana no antsoin’ny mpahay siansa hoe « kôntinanta kely » i Madagasikara ?',
          choices: [
            'Parce qu’elle concentre sur une île une diversité de climats, de reliefs et d’écosystèmes digne d’un continent entier',
            'Parce qu’elle est peuplée par des milliards d’habitants',
            'Parce qu’elle a la même forme que l’Afrique',
            'Parce qu’elle touche l’Asie',
          ],
          correctIndex: 0,
          explanation:
            "Des forêts pluviales humides de l'Est aux déserts épineux du Sud et aux calcaires des Tsingy, Madagascar rassemble une mosaïque écologique planétaire.",
        },
      ],
    },
    // ─── LEÇON 2 : LES LÉMURIENS DE MADAGASCAR ───
    {
      slug: 'les-lemuriens-tresors-vivants-de-madagascar',
      title:
        'Les Lémuriens de Madagascar : du minuscule Microcèbe à l’Indri chanteur',
      titleMg:
        'Ireo Gidro sy Varika : Vakoka velona mampalaza an’i Madagasikara',
      summary:
        'Découvrez l’incroyable diversité des lémuriens : plus de 100 espèces uniques, leurs chants matinaux dans la canopée et leur rôle écologique majeur.',
      summaryMg:
        'Fantaro ireo karazana gidro mihoatra ny zato : ny indri mivolana maraina, ny sifaka mandihy ary ny anjara asany amin’ny fiarovana ny ala.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Emblèmes vivants de Madagascar, les lémuriens sont des primates prosimiens qui n'existent nulle part ailleurs sur Terre à l'état sauvage. Plus de 100 espèces et sous-espèces cohabitent dans les forêts malgaches, allant du minuscule Microcèbe de Madame Berthe (le plus petit primate du monde pesant 30 grammes) au grand Indri indri (Babakoto) dont le chant lyrique résonne à plusieurs kilomètres dans la brume matinale d'Andasibe.",
          textMg:
            "Ny gidro sy ny varika dia biby mampinono tsy misy afa-tsy eto Madagasikara. Mihoatra ny zato ny karazany : manomboka amin'ny Tsitsihy na Tsidy kely indrindra eran-tany ka hatramin'ny Babakoto lehibe manana feo manakoako eny an-tampon-kazo.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'BA / BA / KO / TO',
          phonetic: 'ba-ba-kou-tou',
          frenchEquivalent:
            "Le nom « Babakoto » désigne avec respect le plus grand des lémuriens vivants, l'Indri indri sans queue.",
          sampleWordMg: 'Babakoto',
          sampleTranslationFr:
            'Le grand lémurien Indri (l’ancêtre du jeune Koto)',
        },
        {
          type: 'concept',
          termMg: 'Varika sy Gidro',
          phonetic: 'va-ri-ka si gi-drou',
          meaningFr:
            'Termes malgaches génériques désignant les différentes familles de lémuriens',
          explanation:
            'Selon les régions, on distingue le Varika (lémur couronné ou diurne) et le Gidro (lémur brun ou Maki aux yeux perçants).',
        },
        {
          type: 'concept',
          termMg: 'Sifaka (Propithecus)',
          phonetic: 'si-fa-ka',
          meaningFr: 'Le lémurien danseur qui bondit latéralement au sol',
          explanation:
            "Célèbre pour sa démarche bondissante gracieuse sur ses pattes arrière lorsqu'il traverse les clairières, et son cri d'alarme rythmé : « Si-fak ! ».",
        },
        {
          type: 'concept',
          termMg: 'Aye-aye (Daubentonia madagascariensis)',
          phonetic: 'ai-ai',
          meaningFr:
            'Le mystérieux lémurien nocturne au doigt allongé extracteur de larves',
          explanation:
            'Créature fascinante aux oreilles de chauve-souris et au majeur filiforme spécialisé pour sonder le bois mort à la recherche de larves nutritives.',
        },
        {
          type: 'example',
          textMg:
            "Ny feon'ny Babakoto manakoako vao maraina ao Andasibe dia fahatsiarovana masina fa mpiara-belona amin'ny olombelona ny gidro.",
          textFr:
            "Le chant mélodieux de l'Indri résonnant à l'aube à Andasibe est un rappel sacré de la fraternité qui lie l'homme à la forêt.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les lémuriens sont surnommés les 'jardiniers de la forêt malgache' : en digérant les fruits et en disséminant les graines intactes à des kilomètres, ils assurent la régénération de plus de 70 % des essences d'arbres de la forêt primaire.",
          textMg:
            "Ny gidro no tena 'mpamboly ny ala' : rehefa mihinana voankazo izy ireo dia manaparitaka ny masomboly amin'ny dikiny ka mampaniry hazo vaovao.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel est le plus grand lémurien actuellement vivant à Madagascar, célèbre pour l’absence de queue et ses chants matinaux ?',
          questionMg:
            'Inona ny gidro lehibe indrindra mbola velona eto Madagasikara tsy manana rambo ary mivolana mafy maraina ?',
          choices: [
            'L’Indri indri (Babakoto)',
            'Le Microcèbe pygmée',
            'Le Maki catta à queue annelée',
            'Le Fosa sylvestre',
          ],
          correctIndex: 0,
          explanation:
            "L'Indri indri est le plus grand lémurien vivant, atteignant près d'un mètre de haut, réputé pour son chant territorial majestueux.",
        },
        {
          type: 'quiz',
          question:
            'Quel lémurien est mondialement célèbre pour sa manière unique de danser en sautillant de côté sur ses deux pattes arrière ?',
          questionMg:
            'Iza ilay gidro malaza amin’ny fomba fihetsiny mitsambikimbikina mandihy amin’ny tongony roa aoriana ?',
          choices: [
            'Le Sifaka (Propithecus)',
            'L’Aye-aye',
            'Le Lémur souris',
            'L’Hapalémur doré',
          ],
          correctIndex: 0,
          explanation:
            "Le Sifaka se déplace au sol par de spectaculaires bonds latéraux élégants, les bras écartés pour garder l'équilibre.",
        },
        {
          type: 'quiz',
          question:
            'Quelle particularité anatomique remarquable possède le lémurien nocturne « Aye-aye » ?',
          questionMg:
            'Inona ny mampiavaka ny ratsam-batan’ilay biby antsoina hoe « Aye-aye » ?',
          choices: [
            'Un majeur extrêmement long et fin qui lui sert à tapoter le bois et extraire les larves cachées',
            'Des ailes de plumes d’oiseau',
            'Trois yeux lumineux',
            'Une corne sur le nez',
          ],
          correctIndex: 0,
          explanation:
            "L'Aye-aye utilise son troisième doigt squelettique ultra-sensible pour sonder le tronc des arbres par écholocation et déloger les insectes.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les écologues considèrent-ils les lémuriens comme indispensables à la survie des forêts malgaches ?',
          questionMg:
            'Nahoana no antsoina hoe mpamboly ala ny gidro eo amin’ny tontolo iainana ?',
          choices: [
            'Parce qu’ils disséminent les graines des grands arbres dans leurs déjections sur de vastes distances',
            'Parce qu’ils creusent des canaux d’irrigation',
            'Parce qu’ils chassent les moustiques la nuit',
            'Parce qu’ils coupent les mauvaises herbes',
          ],
          correctIndex: 0,
          explanation:
            "Sans les lémuriens frugivores, de nombreuses espèces d'arbres géants de Madagascar ne pourraient plus disperser leurs graines et s'éteindraient.",
        },
        {
          type: 'quiz',
          question:
            'Quel petit primate malgache détient le record mondial du plus petit primate de la planète ?',
          questionMg:
            'Inona ilay gidro kely indrindra eran-tany tsy milanja afa-tsy 30 grama monja ?',
          choices: [
            'Le Microcèbe de Madame Berthe (Tsitsihy)',
            'Le Lémur couronné',
            'Le Varecia panaché',
            'Le Maki catta',
          ],
          correctIndex: 0,
          explanation:
            'Avec ses 30 grammes et ses yeux immenses adaptés à la nuit, le Microcèbe pygmée est le plus petit primate connu sur Terre.',
        },
      ],
    },
    // ─── LEÇON 3 : CAMÉLÉONS & REPTILES ───
    {
      slug: 'cameleons-et-reptiles-maitres-du-mimetisme',
      title: 'Caméléons et reptiles extraordinaires : champions du camouflage',
      titleMg:
        'Ireo Tanalahy sy Biby mandady : Tompon-daka amin’ny fampitovian-tarehy',
      summary:
        'Explorez l’univers des reptiles malgaches : les deux tiers des caméléons de la planète, le minuscule Brookesia et les geckos feuilles-mortes Uroplatus.',
      summaryMg:
        'Diniho ny tontolon’ny tanalahy eto Madagasikara : ny roa ampahatelon’ny tanalahy eran-tany, ny tarondro ary ny biby manova loko.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Madagascar abrite à elle seule près des deux tiers de toutes les espèces de caméléons connues sur la planète. Du géant Caméléon de Parson (pouvant atteindre 70 cm) au minuscule Brookesia nana qui tient sur la tête d'une allumette, ces reptiles fascinent par leurs yeux indépendants à vision 360°, leur langue télescopique foudroyante et leur aptitude à changer de couleur pour communiquer leurs émotions.",
          textMg:
            "Eto Madagasikara no ahitana ny roa ampahatelon'ny karazana tanalahy rehetra eran-tany. Manomboka amin'ny tanalahy lehibe indrindra ka hatramin'ny Brookesia bitika indrindra, mahagaga ny fahaizany mihodina maso, ny lelany lava tifi-davitra ary ny fiovan'ny lokony.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TA / NA / LA / HY',
          phonetic: 'ta-na-la-hi',
          frenchEquivalent:
            'Le mot « Tanalahy » désigne le caméléon en malgache, symbole de prudence, de vision périphérique et de circonspection.',
          sampleWordMg: 'Tanalahy',
          sampleTranslationFr: 'Le caméléon',
        },
        {
          type: 'concept',
          termMg: 'Brookesia (Tanalahy fohy rambo)',
          phonetic: 'brou-ke-si-a',
          meaningFr: 'Le caméléon pygmée terrestre des feuilles mortes',
          explanation:
            'Minuscules caméléons bruns vivant sur la litière forestière, incapables de changer de couleur vive mais parfaitement mimétiques des débris végétaux.',
        },
        {
          type: 'concept',
          termMg: 'Uroplatus (Maintso vato sy Taha-kazo)',
          phonetic: 'ou-rou-pla-tus',
          meaningFr: 'Le gecko à queue plate en feuille morte',
          explanation:
            "Reptile nocturne doté d'un camouflage absolu : son corps aplati épouse l'écorce des arbres avec des dentelures imitant les lichens et la mousse.",
        },
        {
          type: 'concept',
          termMg: 'Maso mandinika ny lasa sy ny hoavy',
          phonetic: 'ma-sou man-di-ni-ka ni la-sa si ni hou-a-vi',
          meaningFr: 'Un œil regardant vers le passé, l’autre vers l’avenir',
          explanation:
            'Proverbe malgache inspiré du caméléon : « Manaova toy ny tanalahy : ny maso anankiray mijery ny lasa, ny anankiray mijery ny hoavy ».',
        },
        {
          type: 'example',
          textMg:
            "Ny fahendren'ny tanalahy dia ny fahaiza-miandry sy ny fandinihana : tsy mandroso an-jambany fa mandrefy ny tany iainana.",
          textFr:
            "La sagesse du caméléon réside dans la patience et l'observation : il ne s'avance jamais à l'aveugle mais tâte prudemment le sol.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Contrairement à une idée reçue, le caméléon ne change pas de couleur pour copier son arrière-plan, mais pour exprimer son état émotionnel (peur, colère, parade amoureuse) et réguler sa température corporelle !',
          textMg:
            "Tsy mba manova loko hanahafana ny ravinkazo akory ny tanalahy, fa ny fihetseham-pony (tahotra, hatezerana, fitiavana) sy ny hafanan'ny andro no mampiova ny lokony.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle proportion des espèces de caméléons de la planète vit exclusivement à Madagascar ?',
          questionMg:
            'Ampahafirin’ny karazana tanalahy rehetra eran-tany no misy eto Madagasikara ?',
          choices: [
            'Environ les deux tiers (près de 65 % des espèces mondiales)',
            'Moins de 5 %',
            'Seulement deux espèces',
            'La moitié exactement',
          ],
          correctIndex: 0,
          explanation:
            'Madagascar est le véritable paradis des caméléons, abritant près des 2/3 des espèces répertoriées dans le monde.',
        },
        {
          type: 'quiz',
          question:
            'Pour quelle raison biologique principale les caméléons changent-ils de couleur ?',
          questionMg: 'Inona ny antony voalohany mampiova loko ny tanalahy ?',
          choices: [
            'Pour exprimer leurs émotions (stress, parade sexuelle) et réguler leur température',
            'Pour faire rire les autres animaux',
            'Uniquement pour copier la couleur exacte du mur',
            'Parce qu’ils ont faim',
          ],
          correctIndex: 0,
          explanation:
            'Les nanocristaux de leur peau réagissent aux influx nerveux liés aux émotions et aux variations de température et de lumière.',
        },
        {
          type: 'quiz',
          question:
            'Quelle leçon de vie le proverbe malgache tire-t-il des yeux mobiles indépendants du caméléon ?',
          questionMg:
            'Inona no fahendrena ampianarin’ny ohabolana momba ny mason’ny tanalahy ?',
          choices: [
            'Garder un œil sur les leçons du passé tout en observant l’avenir avec prudence',
            'Fermer les deux yeux pour dormir',
            'Regarder uniquement ce qui brille',
            'Ne jamais regarder personne',
          ],
          correctIndex: 0,
          explanation:
            '« Manaova toy ny tanalahy : ny maso anankiray mijery ny lasa, ny anankiray mijery ny hoavy » enseigne la prudence lucide.',
        },
        {
          type: 'quiz',
          question:
            'Quel reptile nocturne malgache pousse l’art du camouflage jusqu’à ressembler à s’y méprendre à de l’écorce couverte de mousse ?',
          questionMg:
            'Inona ilay biby mandady amin’ny alina mitovy tanteraka amin’ny hodi-kazo misy volon-kazo ?',
          choices: [
            'Le gecko Uroplatus (à queue plate)',
            'Le crocodile du Nil',
            'La tortue étoilée',
            'Le boa de Madagascar',
          ],
          correctIndex: 0,
          explanation:
            "L'Uroplatus possède des replis de peau dentelés qui éliminent toute ombre portée sur l'écorce de l'arbre, le rendant invisible.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la vitesse foudroyante de projection de la langue gluante d’un caméléon pour capturer une proie ?',
          questionMg:
            'Manao ahoana ny fahaizan’ny lelan’ny tanalahy misambotra remby ?',
          choices: [
            'Elle est propulsée en un centième de seconde à une distance pouvant dépasser la longueur de son corps',
            'Elle met plusieurs minutes à sortir',
            'Elle ne peut attraper que des animaux morts',
            'Elle ne dépasse pas un millimètre',
          ],
          correctIndex: 0,
          explanation:
            'La langue du caméléon est un muscle télescopique puissant jaillissant à plus de 20 km/h pour harponner les insectes au vol.',
        },
      ],
    },
    // ─── LEÇON 4 : LE FOSA & LES PRÉDATEURS ───
    {
      slug: 'le-fosa-et-les-predateurs-endemiques',
      title:
        'Le Fosa (Cryptoprocta ferox) et les prédateurs méconnus de la forêt',
      titleMg: 'Ny Fosa sy ireo Mpihaza an’ala : Mpanjakan’ny biby malagasy',
      summary:
        'Découvrez le plus grand carnivore prédateur de Madagascar : le Fosa agile grimpeur d’arbres, les mangoustes endémiques et les rapaces sylvestres.',
      summaryMg:
        'Fantaro ny Fosa mpihaza lehibe indrindra any an’ala : ny fahaizany mianika hazo, ny fihazany gidro ary ny fiarovana ny voaary.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au sommet de la chaîne alimentaire des forêts de Madagascar règne le Fosa (Cryptoprocta ferox). Souvent confondu avec un petit puma ou une civette, ce mammifère carnivore agile appartient à une famille endémique unique (les Eupleridae). Capable de descendre des troncs d'arbres verticaux la tête la première grâce à ses chevilles articulées réversibles, le Fosa est le principal régulateur naturel des populations de lémuriens.",
          textMg:
            "Ny Fosa no mpihaza masiaka sy lehibe indrindra any an'alan'i Madagasikara. Mahay mianika sy midina hazo mitsangana amin'ny lohany izy noho ny kitrokeliny afaka mihodina, ary izy no mpihaza voalohany mifehy ny isan'ny gidro any an'ala.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FO / SA',
          phonetic: 'fou-sa',
          frenchEquivalent:
            "Le mot « Fosa » se prononce avec un 'O' fermé et doux comme 'Fou-sa'.",
          sampleWordMg: 'Fosa',
          sampleTranslationFr:
            'Le Fosa (grand carnivore féliniforme de Madagascar)',
        },
        {
          type: 'concept',
          termMg: 'Mpanjakan’ny ala malagasy',
          phonetic: 'mpan-dza-kan-ni a-la ma-la-ga-si',
          meaningFr: 'Le roi souverain de la forêt malgache',
          explanation:
            "En l'absence de lions, de léopards ou de loups à Madagascar, le Fosa occupe la niche écologique du grand super-prédateur terrestre.",
        },
        {
          type: 'concept',
          termMg: 'Kitrokely afaka mihodina',
          phonetic: 'ki-trou-ke-li a-fa-ka mi-hou-di-na',
          meaningFr: 'Chevilles flexibles pivotantes à 180 degrés',
          explanation:
            "Adaptation morphologique spectaculaire permettant au Fosa de grimper et courir sur les branches avec la même agilité qu'un écureuil.",
        },
        {
          type: 'concept',
          termMg: 'Voromahery sy Vorondolo',
          phonetic: 'vou-rou-ma-he-ri si vou-roun-dou-lou',
          meaningFr: 'Les grands rapaces et chouettes des forêts profondes',
          explanation:
            "L'aigle pêcheur de Madagascar (*Ankoay*), l'un des rapaces les plus rares du monde, et les chouettes effraies gardiennes nocturnes de la savane.",
        },
        {
          type: 'example',
          textMg:
            "Ny Fosa dia ilaina amin'ny fahasalaman'ny ala satria manala ireo biby marary ka miaro ny tontolo iainana tsy hidiran'ny areti-mifindra.",
          textFr:
            "Le Fosa est indispensable à la santé de la forêt car il élimine les bêtes affaiblies ou malades, préservant ainsi l'équilibre global de la faune.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les contes traditionnels malgaches, le Fosa est souvent dépeint comme un animal rusé et craint des éleveurs de volailles, mais la sagesse populaire reconnaît son rôle d'équilibreur de la nature qui empêche la prolifération excessive des rongeurs.",
          textMg:
            "Na dia atahoran'ny mpiompy akoho aza ny Fosa, dia manana anjara asa lehibe izy miaro ny ala amin'ny fihanaky ny voalavo sy ny aretina.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel est le plus grand prédateur carnivore terrestre indigène de Madagascar ?',
          questionMg:
            'Inona ny biby mpihaza lehibe indrindra tompon-tany eto Madagasikara ?',
          choices: [
            'Le Fosa (Cryptoprocta ferox)',
            'Le lion d’Afrique',
            'Le loup gris',
            'Le tigre du Bengale',
          ],
          correctIndex: 0,
          explanation:
            "Le Fosa est le plus grand mammifère carnivore sauvage de l'île, mesurant jusqu'à 1,50 mètre de long queue comprise.",
        },
        {
          type: 'quiz',
          question:
            'Quelle capacité physique exceptionnelle permet au Fosa de chasser les lémuriens directement dans la cime des arbres ?',
          questionMg:
            'Inona ny fahaizana mahagaga ananan’ny Fosa mihaza eny an-tampon-kazo ?',
          choices: [
            'Ses chevilles réversibles et ses griffes rétractiles lui permettant de descendre les troncs la tête en bas',
            'Il possède des ailes pour voler',
            'Il utilise des lianes comme cordes',
            'Il hypnotise ses proies par la voix',
          ],
          correctIndex: 0,
          explanation:
            'Ses pattes arrières articulées et sa longue queue équilibratrice lui confèrent une agilité arboricole stupéfiante.',
        },
        {
          type: 'quiz',
          question:
            'À quelle famille zoologique exclusive à Madagascar le Fosa appartient-il ?',
          questionMg: 'Ao anatin’ny fianakaviam-biby inona no misy ny Fosa ?',
          choices: [
            'Les Eupléridés (Eupleridae, carnivores endémiques de Madagascar)',
            'Les canidés (chiens sauvages)',
            'Les ursidés (ours)',
            'Les marsupiaux',
          ],
          correctIndex: 0,
          explanation:
            "Tous les carnivores indigènes de Madagascar descendent d'un ancêtre commun unique arrivé il y a environ 20 millions d'années.",
        },
        {
          type: 'quiz',
          question:
            'Quel rapace pêcheur endémique de Madagascar, au plumage brun et à tête blanche, est l’un des plus menacés au monde ?',
          questionMg:
            'Inona ilay voromahery mpihaza trondro tena tandindomin-doza eto Madagasikara ?',
          choices: [
            'L’Aigle pêcheur de Madagascar (Ankoay)',
            'Le pigeon voyageur',
            'La mouette rieuse',
            'Le corbeau noir',
          ],
          correctIndex: 0,
          explanation:
            "L'Ankoay (Haliaeetus vociferoides) vit le long des côtes rocheuses et des grands lacs de l'Ouest malgache, comptant moins de 300 couples.",
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle écologique vital d’un super-prédateur comme le Fosa dans une forêt primaire ?',
          questionMg:
            'Inona ny soa lehibe entin’ny Fosa ho an’ny tontolo iainana an’ala ?',
          choices: [
            'Réguler les populations d’herbivores et éliminer les animaux malades pour éviter les épidémies',
            'Détruire les arbres fruitiers',
            'Empêcher les rivières de couler',
            'Chasser les oiseaux migrateurs uniquement',
          ],
          correctIndex: 0,
          explanation:
            "En tant que prédateur apex, le Fosa maintient l'équilibre et la vigueur génétique de toutes les espèces de son écosystème.",
        },
      ],
    },
    // ─── LEÇON 5 : LES PARCS NATIONAUX & CORRIDORS ÉCOLOGIQUES ───
    {
      slug: 'les-parcs-nationaux-et-corridors-ecologiques',
      title:
        'Les Parcs Nationaux : Ranomafana, Isalo, Masoala et la préservation',
      titleMg: 'Ireo Valan-javaboahary sy ny Fiarovana ny Ala : Lovam-pirenena',
      summary:
        'Parcourez les sanctuaires protégés de Madagascar : la forêt primaire de Ranomafana, le canyon jurassique de l’Isalo et la jungle côtière de Masoala.',
      summaryMg:
        'Tsidiho ireo valan-javaboahary voaaro : Ranomafana, Isalo, Masoala ary ny ady amin’ny doro ala sy ny fanimbana ny tontolo iainana.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Pour préserver ses joyaux vivants uniques au monde, Madagascar a créé un réseau de parcs nationaux et de réserves intégrales gérés par Madagascar National Parks. Du parc pluvial de Ranomafana réputé pour ses grenouilles multicolores et ses bambous géants, aux cathédrales de grès ruiniformes du massif de l'Isalo et à la canopée vierge plongeant dans la mer de Masoala, ces sanctuaires sont le dernier rempart contre la déforestation.",
          textMg:
            "Mba hiarovana ny harena voajanahary, nametraka valan-javaboahary maro i Madagasikara : Ranomafana any an'ala atsinanana, Isalo any amin'ny harambato atsimo, ary Masoala any avaratra atsinanana. Ireo no fiarovana lehibe iadiana amin'ny doro ala sy ny fanimbana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RA / NO / MA / FA / NA',
          phonetic: 'ra-nou-ma-fa-na',
          frenchEquivalent:
            "Le nom « Ranomafana » signifie littéralement 'l'eau chaude' en raison des sources thermales naturelles sulfureuses de la région.",
          sampleWordMg: 'Ranomafana',
          sampleTranslationFr: 'L’eau chaude / La station thermale de la forêt',
        },
        {
          type: 'concept',
          termMg: 'Valan-javaboahary voaaro',
          phonetic: 'va-lan-dza-va-bou-a-ha-ri vou-a-rou',
          meaningFr: 'Parc national et aire protégée de biodiversité',
          explanation:
            "Zones sanctuarisées par la loi où l'agriculture sur brûlis, la chasse et l'exploitation forestière commerciale sont formellement prohibées.",
        },
        {
          type: 'concept',
          termMg: 'Isalo : Harambato jirasika',
          phonetic: 'i-sa-lou',
          meaningFr: 'Le massif ruiniforme jurassique de l’Isalo',
          explanation:
            "Plateau sculpté par l'érosion éolienne et fluviale datant du Jurassique, abritant des oasis de palmiers satrana et des piscines naturelles d'eau pure.",
        },
        {
          type: 'concept',
          termMg: 'Kôridôra ekôlôjika (Lalan-kazo)',
          phonetic: 'kou-ri-dou-ra e-kou-lou-dzi-ka',
          meaningFr:
            'Corridor écologique forestier continu reliant deux réserves',
          explanation:
            "Bande forestière protégée permettant aux lémuriens et animaux migrateurs de circuler d'un massif à un autre sans être bloqués par les clairières humaines.",
        },
        {
          type: 'example',
          textMg:
            "Ny fiarovana ny valan-javaboahary dia tsy adidin'ny mpiambina ihany fa andraikitry ny olom-pirenena rehetra ho an'ny taranaka fara mandimby.",
          textFr:
            "La protection des parcs nationaux n'est pas seulement la tâche des écogardes, mais la responsabilité de chaque citoyen pour les générations futures.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le parc national de Ranomafana a été créé en 1991 à la suite de la découverte scientifique sensationnelle de l'Hapalémur doré (Hapalemur aureus), un lémurien capable d'ingérer chaque jour des pousses de bambou contenant douze fois la dose mortelle de cyanure pour tout autre mammifère !",
          textMg:
            "Tamin'ny fahitana ilay varika volamena mahagaga mihinana volotsangana misy poizina sihanira no nanorenana ny valan-javaboahary Ranomafana tamin'ny 1991.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel parc national du Sud malgache est célèbre pour ses spectaculaires canyons de grès sculptés et ses piscines naturelles ?',
          questionMg:
            'Inona ilay valan-javaboahary any Atsimo malaza amin’ny harambato vato fasika sy ny dobo voajanahary ?',
          choices: [
            'Le Parc National de l’Isalo',
            'Le Parc d’Ambohimanga',
            'Le Parc de Tsimbazaza',
            'La Baie de Diego',
          ],
          correctIndex: 0,
          explanation:
            "L'Isalo est surnommé le Colorado malgache pour ses canyons grandioses creusés dans le grès jurassique.",
        },
        {
          type: 'quiz',
          question:
            'Quelle découverte scientifique exceptionnelle a conduit à la création du Parc National de Ranomafana en 1991 ?',
          questionMg:
            'Inona ny zava-baovao hitan’ny mpikaroka nahatonga ny fananganana ny valan-javaboahary Ranomafana tamin’ny 1991 ?',
          choices: [
            'La découverte de l’Hapalémur doré (Hapalemur aureus) résistant au cyanure',
            'La découverte d’un gisement de pétrole',
            'La découverte d’une soucoupe volante',
            'La découverte d’une mine de charbon',
          ],
          correctIndex: 0,
          explanation:
            'La découverte de cet hapalémur rare consommant du bambou toxique a mobilisé la communauté internationale pour sanctuariser la forêt de Ranomafana.',
        },
        {
          type: 'quiz',
          question:
            'Où se trouve le Parc National de Masoala, la plus vaste aire protégée de forêt pluviale de Madagascar plongeant dans la mer ?',
          questionMg:
            'Aiza no misy ny saikinosy Masoala misy ny ala mando lehibe indrindra eto Madagasikara ?',
          choices: [
            'Sur la presqu’île du Nord-Est, bordée par la baie d’Antongil',
            'Dans le désert d’Amboasary',
            'Près de la ville de Tuléar',
            'Au centre de la ville d’Antsirabe',
          ],
          correctIndex: 0,
          explanation:
            'Masoala protège la plus grande forêt tropicale humide de plaine de Madagascar, où la forêt primaire rencontre directement les récifs marins.',
        },
        {
          type: 'quiz',
          question:
            'À quoi sert un « corridor écologique » entre deux parcs nationaux ?',
          questionMg:
            'Inona ny tombontsoa lehibe entin’ny kôridôra ekôlôjika mampitohy ala roa ?',
          choices: [
            'Permettre aux espèces animales de migrer et se reproduire librement sans isolement génétique',
            'Construire une autoroute à six voies',
            'Installer des usines chimiques',
            'Couper du bois plus facilement',
          ],
          correctIndex: 0,
          explanation:
            "Le corridor évite la fragmentation des habitats qui condamne les populations animales isolées à la consanguinité et à l'extinction.",
        },
        {
          type: 'quiz',
          question:
            'Quel est le principal organisme public malgache chargé de la gestion et de la conservation des parcs nationaux ?',
          questionMg:
            'Inona ilay rafitra ofisialy miandraikitra ny fitantanana ny valan-javaboahary eto Madagasikara ?',
          choices: [
            'Madagascar National Parks (MNP)',
            'Air Madagascar',
            'La Jirama',
            'La Poste malgache',
          ],
          correctIndex: 0,
          explanation:
            "Madagascar National Parks (anciennement ANGAP) gère l'ensemble du réseau des parcs nationaux et réserves de la Grande Île.",
        },
      ],
    },
  ],
};
