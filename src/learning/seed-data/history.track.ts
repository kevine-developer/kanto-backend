import { SeedTrack } from './seed.types.js';

export const historyTrack: SeedTrack = {
  slug: 'histoire-de-madagascar',
  title: 'Histoire de Madagascar',
  titleMg: "Tantaran'i Madagasikara",
  description:
    'Explorez la grande fresque historique de la Grande Île : les origines austronésiennes et bantoues, les souverains réformateurs, les reines illustres, les luttes patriotiques et les collines sacrées.',
  descriptionMg:
    "Diniho ny tantara miezinezina nampiray an'i Madagasikara : ny fiavian'ny vahoaka, ireo Mpanjaka sy Mpanjakavavy, ny fanoherana tia tanindrazana ary ireo tendrombohitra masina.",
  level: 'INTERMEDIATE',
  icon: 'BookOpen',
  color: '#C0392B',
  orderIndex: 4,
  estimatedMinutes: 40,
  lessons: [
    {
      slug: 'les-origines-et-le-peuplement-de-madagascar',
      title:
        'Les origines et le peuplement : la double racine austronésienne et africaine',
      titleMg: "Ny Fiavian'ny Malagasy : ny Fototra Aotroneziana sy Afrikana",
      summary:
        "Explorez l'épopée des navigateurs austronésiens et des migrants bantous qui ont forgé le peuple malgache.",
      summaryMg:
        "Fantaro ny dia lehibe nifamatoran'ny tantsambo aotroneziana sy ny vahoaka banto nanorina an'i Madagasikara.",
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Madagascar est une terre de rencontre exceptionnelle au cœur de l'océan Indien. Dès le début de notre ère, d'intrépides navigateurs austronésiens ont traversé des milliers de kilomètres sur des pirogues à balancier depuis l'archipel indonésien, rejoignant les populations bantoues d'Afrique de l'Est. Ensemble, ils ont fondu leurs langues, leurs techniques et leurs spiritualités pour donner naissance au peuple malgache.",
          textMg:
            "I Madagasikara dia tany niavaka teo amin'ny Ranomasimbe Indiana. Nisy tantsambo aotroneziana sahy nitaingina lakana niala tany Indonezia, nihaona tamin'ireo vahoaka banto avy any Afrika Atsinanana. Nampifangaro ny teny, ny fomba amam-panao ary ny fahendrena izy ireo ka nanorina ny firenena malagasy iray.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'AO',
          phonetic: 'o',
          frenchEquivalent:
            'Le groupe « AO » se prononce comme un « O » ouvert et clair en malgache standard (ex: Ntaolo, Aotroneziana).',
          sampleWordMg: 'Ntaolo',
          sampleTranslationFr: 'Les Anciens / Les ancêtres premiers',
        },
        {
          type: 'concept',
          termMg: 'Vahoaka Ntaolo',
          phonetic: 'va-houa-ka n-ta-ou-lou',
          meaningFr:
            'Les premiers habitants et ancêtres pionniers de la Grande Île',
          explanation:
            'Désigne avec déférence les premières générations de navigateurs et de pionniers qui ont défriché et nommé la terre malgache.',
        },
        {
          type: 'concept',
          termMg: 'Lakana misy vava',
          phonetic: 'la-ka-na mi-si va-va',
          meaningFr: 'La pirogue à balancier océanique',
          explanation:
            "Chef-d'œuvre de la technologie maritime austronésienne qui a permis de braver les houles de l'océan Indien sur plus de 6 000 kilomètres.",
        },
        {
          type: 'concept',
          termMg: 'Vary sy Tanimbary',
          phonetic: 'va-ri si ta-nim-ba-ri',
          meaningFr: 'Le riz irrigué et la rizière aménagée',
          explanation:
            "Technique agricole magistrale importée d'Asie du Sud-Est, devenue le pilier économique, alimentaire et rituel de la société malgache.",
        },
        {
          type: 'concept',
          termMg: 'Fitaovana vy sy Omby',
          phonetic: 'fi-ta-ou-va-na vi si oum-bi',
          meaningFr: 'La métallurgie du fer et le cheptel de zébus',
          explanation:
            "Apports technologiques et pastoraux fondamentaux issus des migrations bantoues d'Afrique orientale, complétant harmonieusement la culture du riz.",
        },
        {
          type: 'example',
          textMg:
            "Ny fihavian'ny Malagasy dia ahitana ny fahendrena aotroneziana sy ny herin'ny kolontsaina afrikana miray hina.",
          textFr:
            "L'origine du peuple malgache réunit la sagesse austronésienne et la force culturelle africaine dans une unité harmonieuse.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "L'analyse comparative linguistique montre que plus de 90 % du vocabulaire de base malgache (nombres, parties du corps, éléments naturels) dérive de la famille austronésienne (proche du ma'anyan de Bornéo), tandis que le lexique de l'élevage pastoral (omby, aody, kizo) provient directement des langues bantoues.",
          textMg:
            "Ny fikarohana momba ny fiteny dia manaporofo fa ny 90 %-n'ny voambolana fototra malagasy dia avy amin'ny fiteny aotroneziana, raha avy amin'ny fiteny banto kosa ny ankamaroan'ny voambolana momba ny fiompiana omby.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quelles sont les deux grandes vagues migratoires fondatrices du peuple malgache ?',
          questionMg:
            'Inona ireo onjam-pifindran-monina lehibe roa nanorina ny vahoaka malagasy ?',
          choices: [
            "Les navigateurs austronésiens (Asie du Sud-Est) et les populations bantoues (Afrique de l'Est)",
            'Uniquement des explorateurs européens au XIXe siècle',
            'Des tribus nomades de Sibérie boréale',
            'Des marins marchands uniquement venus de Méditerranée',
          ],
          correctIndex: 0,
          explanation:
            "L'archéologie, la linguistique et la génétique confirment la fusion féconde entre les navigateurs austronésiens et les populations bantoues.",
        },
        {
          type: 'quiz',
          question:
            'À quelle grande famille linguistique appartient la langue malgache ?',
          questionMg:
            "Ao amin'ny fianakaviam-piteny inona no misy ny teny malagasy ?",
          choices: [
            'La famille des langues austronésiennes (malayo-polynésiennes)',
            'La famille des langues indo-européennes',
            'La famille des langues sémitiques',
            'La famille des langues sino-tibétaines',
          ],
          correctIndex: 0,
          explanation:
            "Le malgache est une langue austronésienne occidentale, présentant une parenté frappante avec les parlers de l'île de Bornéo en Indonésie.",
        },
        {
          type: 'quiz',
          question:
            'Quelle culture vivrière essentielle a été introduite par les navigateurs austronésiens ?',
          questionMg:
            "Inona ilay fambolena fototra nentin'ireo tantsambo aotroneziana teto Madagasikara ?",
          choices: [
            'La culture du riz irrigué en rizières aménagées (Tanimbary)',
            "La culture du blé d'hiver",
            "La plantation d'oliviers",
            'La culture exclusive du maïs',
          ],
          correctIndex: 0,
          explanation:
            "La riziculture inondée (vary sy tanimbary) constitue le legs agraire majeur des navigateurs austronésiens, au cœur de l'identité malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quel apport pastoral et matériel majeur provient des migrations bantoues africaines ?',
          questionMg:
            "Inona ny harena lehibe teo amin'ny fiompiana sy ny asa vy nentin'ny fifindran-monina banto ?",
          choices: [
            "L'élevage du zébu (omby) et la métallurgie du fer",
            "L'élevage des rennes polaires",
            'La construction de bateaux à vapeur',
            "L'usage exclusif de la pierre taillée",
          ],
          correctIndex: 0,
          explanation:
            "L'élevage du zébu et le travail du fer sont des apports majeurs des populations bantoues d'Afrique de l'Est.",
        },
        {
          type: 'quiz',
          question:
            "Quelle embarcation traditionnelle a permis aux premiers ancêtres de traverser l'océan Indien ?",
          questionMg:
            "Inona ilay fitaovam-pitaterana an-dranomasina nentin'ireo razana nita ny Ranomasimbe Indiana ?",
          choices: [
            'La pirogue à balancier (lakana misy vava)',
            'Une galère romaine en bois de chêne',
            'Un canot pneumatique moderne',
            'Un grand paquebot métallique',
          ],
          correctIndex: 0,
          explanation:
            "La pirogue à balancier (lakana misy vava), d'une stabilité remarquable sur les vagues, a rendu possible la traversée de milliers de kilomètres d'océan.",
        },
      ],
    },
    {
      slug: 'histoire-et-souverains-andrianampoinimerina-radama',
      title:
        "Les repères de l'histoire malgache : Andrianampoinimerina & Radama Ier",
      titleMg: "Tantaran'ny Mpanjaka : Andrianampoinimerina sy Radama I",
      summary:
        "Découvrez les origines du peuple malgache, l'unification du royaume et la naissance de l'écriture officielle.",
      summaryMg:
        "Fantaro ny tantaram-pirenena : ny fampiraisana ny nosy sy ny nahatongavan'ny abidy malagasy.",
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "L'histoire de Madagascar est le fruit d'une formidable épopée humaine : des navigateurs austronésiens venus d'Asie du Sud-Est et des populations bantoues d'Afrique de l'Est ont forgé ensemble un peuple unique, uni par une même langue et une même philosophie.",
          textMg:
            "Ny tantaran'i Madagasikara dia tantara miezinezina : fifangaroana vahoaka avy any Indonezia sy Afrika Atsinanana niteraka firenena iray manana fiteny sy fahendrena iombonana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'R',
          phonetic: 'r',
          frenchEquivalent:
            'Le « R » malgache est toujours roulé du bout de la langue contre le palais antérieur (ex: Radama, Ranomasina).',
          sampleWordMg: 'Radama',
          sampleTranslationFr: 'Radama Ier (Grand Roi réformateur)',
        },
        {
          type: 'concept',
          termMg: 'Andrianampoinimerina',
          phonetic: 'an-dri-an-am-pouin-i-me-ri-na',
          meaningFr: 'Le Roi unificateur visionnaire (fin XVIIIe - 1810)',
          explanation:
            "Souverain qui a jeté les bases institutionnelles du droit foncier, de l'administration et de l'unité territoriale de Madagascar.",
        },
        {
          type: 'concept',
          termMg: 'Ny ranomasina no valamparihiko',
          phonetic: 'ni ra-nou-ma-si-na nou va-lam-pa-ri-hi-kou',
          meaningFr:
            "« La mer est la limite de ma rizière » (Madagascar uni d'une côte à l'autre)",
          explanation:
            "La devise royale célèbre d'Andrianampoinimerina exprimant l'ambition sacrée d'unifier toute la Grande Île dans la paix.",
        },
        {
          type: 'concept',
          termMg: 'Radama Ier (1810-1828)',
          phonetic: 'ra-da-ma vo-a-lou-ha-ni',
          meaningFr: "Le Roi modernisateur et bâtisseur de l'école malgache",
          explanation:
            "Fils d'Andrianampoinimerina, il a officialisé l'alphabet latin malgache en 1823 et ouvert les premières écoles publiques.",
        },
        {
          type: 'concept',
          termMg: 'Sorabe',
          phonetic: 'sou-ra-be',
          meaningFr:
            'Les grands écrits anciens en caractères arabico-malgaches',
          explanation:
            "Textes sacrés et généalogies préservés par les Antemoro sur la côte sud-est depuis le Moyen-Âge, ancêtres de l'écriture malgache.",
        },
        {
          type: 'example',
          textMg:
            "Ny ranomasina no valamparihiko : teny filamatra nentin'Andrianampoinimerina nampiray ny nosy.",
          textFr:
            "« La mer est la limite de ma rizière » : la parole d'honneur d'Andrianampoinimerina pour unifier l'île.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "C'est le 26 mars 1823 que le roi Radama Ier a signé le décret royal fixant définitivement l'alphabet officiel de la langue malgache avec 21 lettres latines. Depuis cette date, le malgache s'écrit de gauche à droite avec une régularité phonétique remarquable.",
          textMg:
            "Tamin'ny 26 Martsa 1823 no nankatoavin'ny mpanjaka Radama I ny abidy malagasy misy litera 21. Nanomboka teo no nampianarana ny teny malagasy an-tsoratra tany an-tsekoly.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quelle célèbre maxime politique a été prononcée par le roi Andrianampoinimerina ?',
          questionMg:
            "Inona ilay teny filamatra fanta-daza nolazain'ny mpanjaka Andrianampoinimerina ?",
          choices: [
            '« Ny ranomasina no valamparihiko » (La mer est la limite de ma rizière)',
            "« Ny vola no zava-dehibe indrindra » (L'argent est le plus important)",
            "« Tsy mila sekoly ny firenena » (Le pays n'a pas besoin d'écoles)",
            "« Aoka ny tsirairay samy hiaina amin'ny tranony »",
          ],
          correctIndex: 0,
          explanation:
            "« Ny ranomasina no valamparihiko » symbolisait sa volonté de réunir toute l'île de Madagascar en une seule communauté unie.",
        },
        {
          type: 'quiz',
          question:
            "Quel souverain a officialisé l'alphabet malgache en caractères latins en 1823 ?",
          questionMg:
            "Iza ilay mpanjaka nankatoa ny abidy malagasy amin'ny litera latina tamin'ny taona 1823 ?",
          choices: [
            'Radama Ier',
            'Andrianampoinimerina',
            'Radama II',
            'Andrianjaka',
          ],
          correctIndex: 0,
          explanation:
            "Radama Ier a adopté l'alphabet latin en 1823 pour généraliser l'instruction et la lecture de la langue malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quelles sont les deux grandes origines fondatrices du peuple malgache ?',
          questionMg:
            "Inona ireo loharano roa lehibe niavian'ny vahoaka malagasy ?",
          choices: [
            "Les navigateurs austronésiens (Asie du Sud-Est) et les peuples bantous (Afrique de l'Est)",
            "Uniquement les colons venus d'Europe au XIXe siècle",
            'Les marins vikings de Scandinavie',
            'Les tribus nomades de Sibérie',
          ],
          correctIndex: 0,
          explanation:
            "La génétique, la linguistique et l'archéologie confirment la fusion harmonieuse austronésienne et bantoue comme creuset malgache.",
        },
        {
          type: 'quiz',
          question:
            'Que désignent les « Sorabe » conservés précieusement dans la région Antemoro ?',
          questionMg:
            "Inona no atao hoe « Sorabe » eo amin'ny tantaram-pirenena ?",
          choices: [
            "Des manuscrits anciens malgaches écrits en caractères arabiques sur papier d'écorce (Antaimoro)",
            'De grandes peintures murales sur les rochers',
            "Des pièces de monnaie en bronze de l'époque romaine",
            'Des lois coloniales modernes',
          ],
          correctIndex: 0,
          explanation:
            "Les « Sorabe » sont les précieux parchemins médiévaux préservant l'astrologie (Vintana), la médecine et l'histoire en langue malgache.",
        },
        {
          type: 'quiz',
          question:
            "Combien de lettres compte l'alphabet officiel de la langue malgache fixé en 1823 ?",
          questionMg:
            "Firy ny isan'ny litera ao amin'ny abidy malagasy ôfisialy ?",
          choices: [
            '21 lettres (sans c, q, u, w, x)',
            '26 lettres comme le français',
            '15 lettres seulement',
            '30 lettres',
          ],
          correctIndex: 0,
          explanation:
            "L'alphabet malgache officiel comporte 21 lettres : les lettres C, Q, U, W, X n'existent pas dans le malgache standard.",
        },
      ],
    },
    {
      slug: 'les-reines-illustres-ranavalona',
      title:
        'Les Reines illustres de Madagascar : souveraineté, diplomatie et résistance',
      titleMg:
        'Ireo Mpanjakavavy Malagasy : Ranavalona I, Rasoherina sy Ranavalona III',
      summary:
        "Découvrez le règne et le courage des souveraines malgaches dans la défense de l'indépendance nationale.",
      summaryMg:
        "Fantaro ny herim-po sy ny fahendren'ireo Mpanjakavavy niaro ny fiandrianam-pirenena.",
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au XIXe siècle, Madagascar s'est illustré par le règne de femmes d'État exceptionnelles. Face aux pressions et convoitises des puissances impérialistes européennes, Ranavalona Ire (1828-1861) a défendu avec une résolution inébranlable la souveraineté territoriale et les traditions ancestrales (*Fomba Ntaolo*). Par la suite, Rasoherina (1863-1868), Ranavalona II (1868-1883) et Ranavalona III (1883-1897), dernière reine déportée en exil, ont incarné la dignité et la pérennité de la nation.",
          textMg:
            "Tamin'ny taonjato faha-19, i Madagasikara dia niavaka tamin'ny fanapahan'ireo Mpanjakavavy mahery fo. Manoloana ny fanirian-daza sy ny fikasana fanjanahan-tany nataon'ireo hery lehibe eoropeana, Ranavalona I (1828-1861) dia niaro tamin'ny heriny rehetra ny fiandrianam-pirenena sy ny fomban-drazana. Taorian'izany, Rasoherina, Ranavalona II ary Ranavalona III dia samy nampiseho fahamendrehana lehibe ho an'ny firenena.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'V',
          phonetic: 'v',
          frenchEquivalent:
            'Le « V » malgache se prononce nettement comme en français (ex: Vohitra, Vahoaka, Ranavalona).',
          sampleWordMg: 'Ranavalona',
          sampleTranslationFr: 'Nom des illustres souveraines malgaches',
        },
        {
          type: 'concept',
          termMg: 'Fiandrianam-pirenena',
          phonetic: 'fi-an-dri-a-nam-pi-re-ne-na',
          meaningFr:
            "La souveraineté nationale / L'indépendance sacrée de la patrie",
          explanation:
            "Principe fondamental défendu avec ferveur par la monarchie malgache, affirmant qu'aucune puissance étrangère ne peut asservir le sol des ancêtres.",
        },
        {
          type: 'concept',
          termMg: 'Ranavalona Ire (1828-1861)',
          phonetic: 'ra-na-va-lou-na vo-a-lou-ha-ni',
          meaningFr:
            "Souveraine intraitable, gardienne des traditions et de l'indépendance",
          explanation:
            "Elle développa l'artisanat national, les forges d'armes de Mantasoa avec Jean Laborde et refusa fermement toute ingérence étrangère.",
        },
        {
          type: 'concept',
          termMg: 'Ranavalona III (1883-1897)',
          phonetic: 'ra-na-va-lou-na fa-ha-te-lou',
          meaningFr:
            'Dernière reine de Madagascar, icône de dignité et de résistance morale',
          explanation:
            "Déportée injustement par les autorités coloniales à La Réunion puis à Alger, elle conserva l'admiration et l'amour inconditionnel de son peuple.",
        },
        {
          type: 'concept',
          termMg: 'Manjakamiadana sy Manampisoa',
          phonetic: 'man-ja-ka-mi-a-da-na si ma-nam-pi-sou-a',
          meaningFr: "Les palais royaux du Rova d'Antananarivo",
          explanation:
            "Résidences royales et sièges du pouvoir d'où les souveraines rendaient la justice et s'adressaient à la nation tout entière.",
        },
        {
          type: 'example',
          textMg:
            'Ranavalona III dia naneho fahamendrehana sy fitiavan-tanindrazana lehibe manoloana ny fisedrana.',
          textFr:
            "Ranavalona III a manifesté une dignité et un patriotisme exemplaires face aux épreuves de l'histoire.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Même en exil forcé à Alger où elle s'éteignit en 1917, la reine Ranavalona III refusa toute compromission et demeura le symbole vivant de l'unité et de la dignité malgache. Ses cendres furent solennellement rapatriées au Rova d'Antananarivo en 1938 sous la ferveur populaire.",
          textMg:
            "Na dia tany an-tsesitany tany Aljeria aza no nodimandry Ranavalona III tamin'ny 1917, dia nitoetra ho mariky ny fahamendrehana malagasy izy. Tamin'ny taona 1938 no naverina teto an-tanindrazana tao amin'ny Rovan'Antananarivo ny taolambalony.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quelle souveraine malgache a défendu vigoureusement la souveraineté nationale de 1828 à 1861 ?',
          questionMg:
            "Iza ilay Mpanjakavavy niaro mafy ny fiandrianam-pirenena tamin'ny taona 1828 ka hatramin'ny 1861 ?",
          choices: [
            'Ranavalona Ire',
            'Marie-Antoinette',
            'La reine Victoria',
            'Cléopâtre',
          ],
          correctIndex: 0,
          explanation:
            "Ranavalona Ire a régné pendant 33 ans en consolidant l'autosuffisance, l'artisanat national et la souveraineté de Madagascar.",
        },
        {
          type: 'quiz',
          question:
            'Qui fut la dernière reine souveraine de Madagascar avant la colonisation en 1897 ?',
          questionMg:
            "Iza no Mpanjakavavy farany nanjaka teto Madagasikara talohan'ny fanjanahan-tany ?",
          choices: [
            'Ranavalona III',
            'Ranavalona Ire',
            'Rasoherina',
            'Ranavalona II',
          ],
          correctIndex: 0,
          explanation:
            "Ranavalona III fut la dernière reine souveraine de Madagascar avant d'être déportée en exil en 1897.",
        },
        {
          type: 'quiz',
          question:
            'Quel mot malgache fondamental désigne « la souveraineté nationale » ?',
          questionMg:
            'Inona ilay teny malagasy manan-danja milaza ny « fiandrianam-pirenena » ?',
          choices: [
            'Fiandrianam-pirenena',
            'Fananana manokana',
            'Fivarotana fananana',
            'Fiaraha-monina tsotra',
          ],
          correctIndex: 0,
          explanation:
            "« Fiandrianam-pirenena » désigne la souveraineté, l'indépendance et la dignité de la nation malgache.",
        },
        {
          type: 'quiz',
          question:
            'Dans quelle ville la reine Ranavalona III a-t-elle vécu ses dernières années en exil ?',
          questionMg:
            "Taiza no nasesitany ary nahafatesan'ny Mpanjakavavy Ranavalona III ?",
          choices: [
            'À Alger (après un passage à La Réunion)',
            'À Londres en Angleterre',
            'À Rome en Italie',
            'Au Caire en Égypte',
          ],
          correctIndex: 0,
          explanation:
            "Déportée d'abord à La Réunion, la reine Ranavalona III a ensuite été exilée à Alger où elle est décédée en 1917.",
        },
        {
          type: 'quiz',
          question:
            "Quel ensemble monumental historique d'Antananarivo abritait la cour des reines malgaches ?",
          questionMg:
            "Inona ilay toerana manan-tantara teo an-drenivohitra nisy ny lapan'ireo Mpanjakavavy ?",
          choices: [
            "Le Rova d'Antananarivo (Anatirova)",
            'Le port de Toamasina',
            "Le marché d'Analakely",
            'La gare de Soarano',
          ],
          correctIndex: 0,
          explanation:
            "Le Rova d'Antananarivo, perché sur la colline d'Analamanga, était le cœur spirituel et politique du royaume des reines.",
        },
      ],
    },
    {
      slug: 'les-resistances-et-la-lutte-de-1947',
      title: "Les résistances patriotiques et l'insurrection héroïque de 1947",
      titleMg:
        'Ny Tolom-Panafahana : Ny Menalamba, ny VVS ary ny 29 Martsa 1947',
      summary:
        "Revivez l'épopée des patriotes malgaches pour la liberté, des Menalamba au soulèvement national du 29 mars 1947.",
      summaryMg:
        "Tsarovy ireo maherifon'ny firenena niady ho an'ny fahafahana : ny Menalamba, ny VVS ary ny tolona 1947.",
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Tout au long de l'ère coloniale, le peuple malgache n'a jamais renoncé à sa dignité ni à son indépendance (*Fahafahana*). Dès 1895, le mouvement patriotique des **Menalamba** (« toges rouges ») a refusé le joug étranger pour défendre la terre des ancêtres. Plus tard, en 1913, les étudiants et intellectuels de la société secrète **V.V.S.** (*Vy Vato Sakelika*) ont réveillé la conscience politique nationale, ouvrant la voie à l'héroïque soulèvement populaire du **29 mars 1947**, symbole immortel de la lutte pour la liberté.",
          textMg:
            "Nandritra ny vanim-potoan'ny fanjanahan-tany, tsy nanaiky ho resy na oviana na oviana ny vahoaka malagasy. Nanomboka tamin'ny 1895, ny hetsiky ny **Menalamba** dia nanohitra ny tafika vahiny mba hiarovana ny Tanindrazana. Tamin'ny 1913, ny fikambanana miafina **V.V.S.** (Vy Vato Sakelika) dia nanaitra ny hambom-po sy ny fahaizan-tsain'ny Malagasy, nitarika nankany amin'ny tolona lehibe tamin'ny **29 Martsa 1947**.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TS',
          phonetic: 'ts',
          frenchEquivalent:
            'Le groupe « TS » se prononce comme dans « tsar » ou « mouche » appuyée (ex: Martsa, Tanindrazana).',
          sampleWordMg: 'Martsa',
          sampleTranslationFr:
            'Mars (le mois du soulèvement patriotique de 1947)',
        },
        {
          type: 'concept',
          termMg: 'Fahafahana',
          phonetic: 'fa-ha-fa-ha-na',
          meaningFr: "La Liberté / L'émancipation / L'Indépendance",
          explanation:
            'Aspiration suprême pour laquelle des dizaines de milliers de patriotes malgaches ont offert leur vie avec abnégation.',
        },
        {
          type: 'concept',
          termMg: 'Menalamba',
          phonetic: 'me-na-lam-ba',
          meaningFr:
            '« Les toges rouges » : résistants de la première heure (1895-1898)',
          explanation:
            "Insurgés vêtus du lamba traditionnel teint à l'argile rouge, qui ont mené la guérilla pour protéger les coutumes et les tombeaux des ancêtres.",
        },
        {
          type: 'concept',
          termMg: 'Vy Vato Sakelika (V.V.S.)',
          phonetic: 'vi va-tou sa-ke-li-ka',
          meaningFr:
            '« Fer, Pierre, Ramification » (Mouvement patriotique fondé en 1913)',
          explanation:
            "Organisation secrète d'étudiants en médecine et de lettrés malgaches plaidant pour l'égalité citoyenne et la souveraineté nationale.",
        },
        {
          type: 'concept',
          termMg: '29 Martsa 1947',
          phonetic: 'roam-bi-ny si-vi mar-tsa',
          meaningFr:
            "L'insurrection nationale pour la liberté / Journée des Martyrs",
          explanation:
            "Soulèvement généralisé contre l'oppression coloniale, durement réprimé mais ayant scellé l'inévitable marche vers l'indépendance de 1960.",
        },
        {
          type: 'example',
          textMg:
            "Ny 29 Martsa dia andro masina ahatsiarovana ireo Maherifo nahafoy ny ainy ho an'ny Tanindrazana.",
          textFr:
            'Le 29 mars est un jour sacré du souvenir pour honorer les Héros ayant sacrifié leur vie pour la Patrie.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le monument commémoratif d'Ankatso et les stèles érigées à Moramanga et Manakara rappellent chaque année le sacrifice de 1947. La devise « Ho an'ny Tanindrazana » (Pour la Patrie) demeure gravée au cœur de la mémoire républicaine malgache.",
          textMg:
            "Ireo tsangambato fahatsiarovana ao Moramanga, Manakara ary Ankatso dia mampahatsiaro mandrakariva ny rà latsaka tamin'ny 1947. Ny teny filamatra hoe « Ho an'ny Tanindrazana » dia mitoetra ao am-pon'ny Malagasy rehetra.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Quel mouvement patriotique de 1895 portait le nom des toges rouges teintes d'argile ?",
          questionMg:
            "Inona ilay hetsika tia tanindrazana tamin'ny 1895 nisalotra lamba miloko mena tany ?",
          choices: [
            'Les Menalamba',
            'Les V.V.S.',
            'Les marins Vezo',
            'Les marchands arabes',
          ],
          correctIndex: 0,
          explanation:
            'Les Menalamba (« toges rouges ») ont combattu avec ferveur pour protéger la terre ancestrale et les coutumes malgaches.',
        },
        {
          type: 'quiz',
          question:
            'Que signifiait le nom du mouvement nationaliste secret « V.V.S. » fondé en 1913 ?',
          questionMg:
            "Inona no hevitry ny fanafohezana hoe « V.V.S. » niorina tamin'ny 1913 ?",
          choices: [
            'Vy Vato Sakelika (Fer, Pierre, Ramification)',
            'Vahoaka Vonona Saika',
            'Vola Vitsy Sambatra',
            'Vato Vao Sombintsombiny',
          ],
          correctIndex: 0,
          explanation:
            "V.V.S. signifie « Vy, Vato, Sakelika », symbolisant la force du fer, la fermeté de la pierre et l'essor des ramifications patriotiques.",
        },
        {
          type: 'quiz',
          question:
            "Quelle date célèbre commémore officiellement l'insurrection nationale pour la liberté à Madagascar ?",
          questionMg:
            'Inona ilay daty manan-tantara ahatsiarovana ny tolom-panafahana teto Madagasikara ?',
          choices: [
            'Le 29 mars (1947)',
            'Le 1er janvier',
            'Le 14 juillet',
            'Le 25 décembre',
          ],
          correctIndex: 0,
          explanation:
            'Le 29 mars 1947 marque le grand soulèvement populaire malgache et la commémoration des martyrs de la liberté.',
        },
        {
          type: 'quiz',
          question:
            "Quel mot malgache fondamental désigne « la Liberté » et l'indépendance du peuple ?",
          questionMg:
            'Inona ilay teny malagasy midika hoe « Fahaleovantena sy Fahafahana » ?',
          choices: ['Fahafahana', 'Fananana', 'Fahantrana', 'Fahatsiarovana'],
          correctIndex: 0,
          explanation:
            "« Fahafahana » signifie la liberté, l'affranchissement et l'indépendance légitime du peuple malgache.",
        },
        {
          type: 'quiz',
          question:
            'En quelle année Madagascar a-t-il finalement proclamé le retour de son Indépendance nationale ?',
          questionMg:
            "Tamin'ny taona firy no niverina tamin'ny fomba ôfisialy ny Fahaleovantenan'i Madagasikara ?",
          choices: ['1960 (le 26 juin)', '1947', '1914', '1989'],
          correctIndex: 0,
          explanation:
            'Madagascar a retrouvé sa pleine indépendance nationale le 26 juin 1960, couronnant des décennies de luttes patriotiques.',
        },
      ],
    },
    {
      slug: 'les-collines-sacrees-et-ambohimanga',
      title: "Les Collines sacrées et la cité royale d'Ambohimanga",
      titleMg: "Ireo Tendrombohitra Roambinifolo sy ny Rovan'Ambohimanga",
      summary:
        "Explorez la spiritualité et l'histoire des douze collines sacrées et du sanctuaire d'Ambohimanga, classé à l'UNESCO.",
      summaryMg:
        "Fantaro ny hasin'ny tendrombohitra roambinifolo sy ny Rovan'Ambohimanga, lova sarobidin'ny firenena.",
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Autour d'Antananarivo s'élèvent les **Douze Collines sacrées** (*Tendrombohitra Roambinifolo*), sanctuaires de la mémoire royale et de la spiritualité malgache. Parmi elles, **Ambohimanga** (« la colline bleue ») est le berceau d'Andrianampoinimerina. Classée au patrimoine mondial de l'Humanité par l'UNESCO, cette cité royale fortifiée conserve ses remparts scellés au blanc d'œuf, ses fossés circulaires (*Hadivory*), ses portes fermées par d'immenses meules de pierre et ses arbres sacrés (*Aviavy* et *Amontana*).",
          textMg:
            "Manodidina an'Antananarivo no misy ireo **Tendrombohitra Roambinifolo Masina**, toeram-pitoeran'ny hasina sy ny tantaran'ireo mpanjaka malagasy. Ny voalohany amin'izy ireo dia **Ambohimanga** (« ny tendrombohitra manga »), toerana niavian'Andrianampoinimerina. Voasokajy ho Lova Iraisam-pirenena UNESCO ity rova ity, ahitana hadivory, vavahady vato boribory goavana ary hazo masina (Aviavy sy Amontana).",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DR',
          phonetic: 'dr',
          frenchEquivalent:
            'Le groupe consonantique « DR » est alvéolaire et dynamique (ex: Tendrombohitra, Andrianampoinimerina).',
          sampleWordMg: 'Tendrombohitra',
          sampleTranslationFr: 'Montagne / Colline sacrée',
        },
        {
          type: 'concept',
          termMg: 'Tendrombohitra Roambinifolo',
          phonetic: 'ten-droum-bou-hi-tsa rouam-bi-ni-fou-lou',
          meaningFr: "Les douze collines sacrées du royaume d'Imerina",
          explanation:
            "Sites perchés fortifiés (Ambohimanga, Antananarivo, Ilafy, Ambohidrabiby, etc.) incarnant l'ordre politique, cosmique et spirituel traditionnel.",
        },
        {
          type: 'concept',
          termMg: "Rovan'Ambohimanga",
          phonetic: 'rou-van am-bou-hi-man-ga',
          meaningFr:
            'La colline bleue royale, sanctuaire classé au patrimoine mondial UNESCO',
          explanation:
            "Cité royale intacte avec la case d'Andrianampoinimerina (Mahandrihono), le pavillon de Ranavalona II et les bassins d'ablutions royales.",
        },
        {
          type: 'concept',
          termMg: 'Aviavy sy Amontana',
          phonetic: 'a-vi-a-vi si a-moun-ta-na',
          meaningFr: 'Ficus royaux sacrés plantés aux portes des enceintes',
          explanation:
            'Arbres vénérés symbolisant la majesté royale, la descendance ininterrompue et la bienveillance des ancêtres protecteurs.',
        },
        {
          type: 'concept',
          termMg: 'Hadivory sy Vavahady vato',
          phonetic: 'ha-di-vou-ri si va-va-ha-di va-tou',
          meaningFr:
            'Fossés circulaires profonds et portes en disques de pierre monolithiques',
          explanation:
            "Ingénieux système défensif entourant les collines sacrées, fermé chaque soir par d'immenses dalles de granit roulées à bras d'hommes.",
        },
        {
          type: 'example',
          textMg:
            'Ambohimanga dia vohitra masina mampahatsiaro ny hasina sy ny fomba nentin-drazana malagasy.',
          textFr:
            "Ambohimanga est une cité sacrée qui témoigne de l'énergie spirituelle (hasina) et des traditions ancestrales malgaches.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pour bâtir les remparts d'enceinte d'Ambohimanga au XVIIIe siècle, la tradition rapporte que seize millions de blancs d'œufs ont été mélangés à la chaux et au sable pour constituer un ciment d'une solidité légendaire, ayant résisté intact aux siècles et aux intempéries.",
          textMg:
            "Tamin'ny nananganana ny mandan'Ambohimanga, ny tantara dia milaza fa tapotsin-atody an-tapitrisany maro no nafangaro tamin'ny sokay mba hahatonga ny manda ho mafy sy tsy mety rava nandritra ny taonjato maro.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Combien de collines sacrées entouraient historiquement le royaume d'Imerina ?",
          questionMg:
            "Firy ny isan'ireo tendrombohitra masina manan-tantara manodidina an'Imerina ?",
          choices: [
            'Douze (Tendrombohitra Roambinifolo)',
            'Sept',
            'Trois seulement',
            'Vingt-quatre',
          ],
          correctIndex: 0,
          explanation:
            'Les douze collines sacrées (Tendrombohitra Roambinifolo) formaient le maillage spirituel, stratégique et dynastique du royaume.',
        },
        {
          type: 'quiz',
          question:
            "Quel site historique et royal malgache est classé au patrimoine mondial de l'Humanité par l'UNESCO ?",
          questionMg:
            'Inona ilay toerana masina malagasy voasokajy ho Lova Iraisam-pirenena UNESCO ?',
          choices: [
            "La colline royale d'Ambohimanga",
            'Le canal des Pangalanes',
            "L'avenue de l'Indépendance",
            "Le marché d'Isotry",
          ],
          correctIndex: 0,
          explanation:
            "La colline royale d'Ambohimanga est classée au patrimoine mondial de l'UNESCO pour sa valeur universelle et son authenticité culturelle.",
        },
        {
          type: 'quiz',
          question:
            'Quels arbres sacrés majestueux étaient traditionnellement plantés pour marquer la présence royale ?',
          questionMg:
            "Inona ireo hazo masina famboly teo amin'ny rova sy ny tanàna nisy mpanjaka ?",
          choices: [
            "L'Aviavy et l'Amontana (ficus royaux)",
            'Le pommier et le poirier',
            'Le sapin de Noël',
            'Le peuplier blanc',
          ],
          correctIndex: 0,
          explanation:
            "L'Aviavy et l'Amontana (ficus majestueux) symbolisent la royauté, la bénédiction des ancêtres et la pérennité de la nation.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le grand fossé circulaire défensif protégeant les cités fortifiées royales ?',
          questionMg:
            'Inona no iantsoana ilay hady boribory lalina manodidina ny vohitra masina ?',
          choices: [
            'Le Hadivory',
            'Le Valam-parihy',
            'Ny Tany mena',
            'Ny Kianja',
          ],
          correctIndex: 0,
          explanation:
            'Le « Hadivory » est le fossé défensif circulaire creusé autour des collines royales pour empêcher les assauts ennemis.',
        },
        {
          type: 'quiz',
          question:
            "Quel grand souverain réformateur a fait d'Ambohimanga son point de départ pour unifier le pays ?",
          questionMg:
            "Iza ilay Mpanjaka lehibe niainga tao Ambohimanga nampiray an'i Madagasikara ?",
          choices: [
            'Andrianampoinimerina',
            'Radama II',
            'Andrianjaka',
            'Ralambo',
          ],
          correctIndex: 0,
          explanation:
            "Andrianampoinimerina régna d'abord à Ambohimanga avant de conquérir Antananarivo et d'œuvrer pour l'unité de toute l'île.",
        },
      ],
    },
  ],
};
