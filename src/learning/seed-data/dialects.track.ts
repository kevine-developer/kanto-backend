import { SeedTrack } from './seed.types.js';

export const dialectsTrack: SeedTrack = {
  slug: 'dialectes-et-parlers-regionaux',
  title: 'Dialectes & Parlers régionaux',
  titleMg: 'Ny Fitenim-paritra Malagasy',
  description:
    "Voyagez au cœur des richesses linguistiques des provinces malgaches : les parlers côtiers, l'éloquence du Rasavôlana, les formules du Grand Sud et le vocabulaire maritime Vezo.",
  descriptionMg:
    "Tsidiho ny haren'ny tenim-paritra manerana ny Nosy : ny teny morontsiraka, ny kanton'ny Rasavôlana sy Tôkatôka, ny any Atsimo ary ny voambolan'ny mpanjono.",
  level: 'INTERMEDIATE',
  icon: 'Compass',
  color: '#1E88E5',
  orderIndex: 5,
  estimatedMinutes: 70,
  lessons: [
    {
      slug: 'les-dialectes-regionaux-sakalava-betsimisaraka-antandroy',
      title:
        'Les dialectes régionaux : voyage linguistique à travers Madagascar',
      titleMg: 'Ireo Fitenim-paritra : Sakalava, Betsimisaraka, Antandroy',
      summary:
        'Découvrez la richesse des parlers régionaux côtiers et leurs formules de salutation chaleureuses.',
      summaryMg:
        'Ianaro ireo teny sy fiarahabana mampiavaka ireo faritra samihafa eto Madagasikara.',
      type: 'VOCABULARY',
      orderIndex: 1,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Bien que le malgache standard officiel soit compris sur toute l'île, chaque région possède son dialecte vivant (*fitenim-paritra*) riche en sonorités, formules d'accueil et expressions pittoresques.",
          textMg:
            'Na dia iray aza ny fiteny malagasy ôfisialy, ny faritra tsirairay dia manana ny fitenim-paritra mampiavaka azy, feno hafanana sy fahendrena mampanan-karena ny kolontsaina.',
        },
        {
          type: 'phonetic',
          letterOrSound: 'GN',
          phonetic: 'gn',
          frenchEquivalent:
            'Son nasal mouillé caractéristique des dialectes côtiers (Sakalava, Antakarana), sonnant comme « gn » dans « vigne » (ex: Volagna).',
          sampleWordMg: 'Volagna',
          sampleTranslationFr: 'La parole / La lune (en dialecte côtier)',
        },
        {
          type: 'concept',
          termMg: 'Akory aby / Akory anareo',
          phonetic: 'a-kou-ri a-bi / a-kou-ri a-na-re-ou',
          meaningFr: 'Bonjour à tous / Comment allez-vous tous ?',
          explanation:
            'Formule de salutation universellement répandue sur les côtes ouest, nord et est (Sakalava, Tsimihety, Betsimisaraka).',
        },
        {
          type: 'concept',
          termMg: 'Mbarakaly e !',
          phonetic: 'mba-ra-ka-li e',
          meaningFr: 'Bienvenue chaleureuse / Vœu de bénédiction et de joie',
          explanation:
            "Salutation festive et bienveillante d'accueil, très prisée dans les régions côtières du nord et de l'ouest.",
        },
        {
          type: 'concept',
          termMg: 'Tsaiky',
          phonetic: 'tsye-ki',
          meaningFr:
            'Enfant / Les enfants (équivalent de « zaza » sur les Hautes Terres)',
          explanation:
            'Mot très affectueux utilisé dans les dialectes côtiers pour désigner les enfants et les jeunes.',
        },
        {
          type: 'concept',
          termMg: 'Aia / Karaha',
          phonetic: 'eye-a / ka-ra-ha',
          meaningFr: 'Où (au lieu de « aiza ») / Comme (au lieu de « toy ny »)',
          explanation:
            'Variations lexicales quotidiennes qui donnent toute leur couleur et leur musicalité aux échanges régionaux.',
        },
        {
          type: 'example',
          textMg: 'Akory aby nareo tsaiky ? — Tsara be tompoko, mbarakaly e !',
          textFr:
            'Bonjour à tous les enfants, comment allez-vous ? — Très bien, soyez les bienvenus parmi nous !',
        },
        {
          type: 'didYouKnow',
          textFr:
            "À Madagascar, la lettre « N » suivie d'un « G » dans certains dialectes s'écrit souvent « Ñ » ou « GN » (ex: « volana » devient « volagna » ou « volaña »). Ces parlers témoignent de l'histoire vivante des migrations et des échanges maritimes.",
          textMg:
            "Ny fanononana morontsiraka dia mampiasa matetika ny « gn » na « ñ » solon'ny « n » tsotra. Manaporofo ny firindrana sy ny fahasamihafan'ny tontolo malagasy izany.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Que signifie la salutation côtière populaire « Akory aby » ?',
          questionMg:
            'Inona no hevitry ny fiarahabana amoron-tsiraka hoe « Akory aby » ?',
          choices: [
            'Bonjour à tous / Comment allez-vous tous ?',
            'Au revoir et à la semaine prochaine',
            'Bon appétit pour le dîner',
            'Attention au danger',
          ],
          correctIndex: 0,
          explanation:
            '« Akory aby » est la formule emblématique de salutation collective dans les dialectes côtiers (Sakalava, Tsimihety, etc.).',
        },
        {
          type: 'quiz',
          question:
            "Comment désigne-t-on couramment « un enfant » dans les dialectes du Nord et de l'Ouest ?",
          questionMg:
            "Ahoana no iantsoana ny « zaza » amin'ny fitenim-paritra any avaratra sy andrefana ?",
          choices: ['Tsaiky', 'Zoky', 'Ray', 'Havana'],
          correctIndex: 0,
          explanation:
            '« Tsaiky » est le terme côtier équivalent à « zaza » (enfant).',
        },
        {
          type: 'quiz',
          question:
            'Que traduit la chaleureuse exclamation côtière « Mbarakaly e ! » ?',
          questionMg:
            "Inona no hevitra fonosin'ny fomba fiteny hoe « Mbarakaly e ! » ?",
          choices: [
            "Une formule d'accueil joyeuse, de bienvenue et de vœux de bénédiction",
            'Une plainte pour le mauvais temps',
            "Une dispute lors d'un match de football",
            "Une demande d'argent au marché",
          ],
          correctIndex: 0,
          explanation:
            "« Mbarakaly » est un souhait festif de prospérité, d'accueil et de bénédiction mutuelle.",
        },
        {
          type: 'quiz',
          question:
            'Quel mot remplace souvent « Aiza » (Où) dans plusieurs parlers régionaux côtiers ?',
          questionMg:
            "Inona no teny ampiasain'ny fitenim-paritra sasany solon'ny teny hoe « Aiza » ?",
          choices: ['Aia', 'Iza', 'Oviana', 'Ahoana'],
          correctIndex: 0,
          explanation:
            'Dans les dialectes côtiers, « aiza » (où) se dit fréquemment « aia » (ex: Aia ny lalana ?).',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la richesse principale de la diversité des dialectes à Madagascar ?',
          questionMg:
            "Inona no maha-harena lehibe ny fahasamihafan'ny fitenim-paritra eto Madagasikara ?",
          choices: [
            'Elle enrichit le patrimoine culturel et linguistique tout en conservant une racine commune unie',
            'Elle empêche définitivement les Malgaches de se comprendre',
            'Elle oblige à utiliser une langue étrangère',
            "Elle n'a aucune valeur historique",
          ],
          correctIndex: 0,
          explanation:
            "Les dialectes partagent une grammaire et un tronc linguistique communs tout en apportant une inestimable richesse d'images et de poésie.",
        },
      ],
    },
    {
      slug: 'eloquence-cotiere-rasavolagna-et-tokatoka',
      title: "L'art poétique côtier : le Rasavôlana et le Tôkatôka",
      titleMg: 'Ny Haikanto am-Bava : Rasavôlana sy Tôkatôka Betsimisaraka',
      summary:
        "Découvrez les trésors oratoires de la côte orientale : la solennité du Rasavôlana et l'énergie poétique scandée du Tôkatôka.",
      summaryMg:
        "Fantaro ny kanton'ny kabary atsinanana : ny Rasavôlana feno fahendrena sy ny Tôkatôka mirindra sy mavitrika.",
      type: 'LITERATURE',
      orderIndex: 2,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Sur la côte Est de Madagascar, notamment chez les Betsimisaraka, Bezanozano et Sihanaka, la parole rythmée possède deux expressions magistrales : le **Rasavôlana** (art oratoire solennel de deuil et d'annonces communautaires) et le **Tôkatôka** (poésie scandée rythmée lors des grandes fêtes).",
          textMg:
            "Any amin'ny faritra atsinanana, indrindra eo amin'ny Betsimisaraka, ny teny mirindra dia miseho amin'ny alalan'ny **Rasavôlana** (lahateny am-pahamendrehana amin'ny fahoriana sy fiaraha-monina) ary ny **Tôkatôka** (antsa sy tononkalo mavitrika mandritra ny lanonam-pifaliana).",
        },
        {
          type: 'phonetic',
          letterOrSound: 'Ô',
          phonetic: 'ou',
          frenchEquivalent:
            'Le « Ô » accent circonflexe insiste sur la sonorité longue et profonde (ex: Rasavôlana, Tôkatôka).',
          sampleWordMg: 'Tôkatôka',
          sampleTranslationFr: 'Poème rythmé scandé festif',
        },
        {
          type: 'concept',
          termMg: 'Rasavôlana (Rasavolagna)',
          phonetic: 'ra-sa-vou-la-na (ra-sa-vou-lang-a)',
          meaningFr: 'Art oratoire traditionnel solennel de la côte orientale',
          explanation:
            'Forme très raffinée de discours public utilisée lors des veillées funèbres, annonces villageoises et cérémonies pour resserrer le fihavanana.',
        },
        {
          type: 'concept',
          termMg: 'Tôkatôka',
          phonetic: 'tou-ka-tou-ka',
          meaningFr: 'Poésie scandée et chantée lors des fêtes réjouissantes',
          explanation:
            "Vient du mot « tôka » (qui signifie hasina, bénédiction sacrée). Déclamation directe, expressive et dynamique qui galvanise l'assemblée.",
        },
        {
          type: 'concept',
          termMg: 'Mitôka',
          phonetic: 'mi-tou-ka',
          meaningFr: 'Sanctifier, invoquer la bénédiction sacrée et bénir',
          explanation:
            "Verbe d'action spirituelle qui confère au déclamateur de Tôkatôka le rôle d'appeler la grâce et la joie sur le groupe.",
        },
        {
          type: 'example',
          textMg:
            "Nitsangana ny raiamandreny nanao Rasavôlana nampionona ny fianakaviana tamin'ny teny mamy.",
          textFr:
            "L'ancien s'est levé pour prononcer le Rasavôlana, consolant la famille endeuillée avec des paroles empreintes de douceur et de sagesse.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Tandis que le Hainteny des Hautes Terres utilise un langage voilé et secret avec d'infinis sous-entendus métaphoriques, le Tôkatôka betsimisaraka se distingue par une parole franche, limpide, joyeuse et rythmée, conçue pour être partagée et ressentie immédiatement par tous les auditeurs.",
          textMg:
            "Raha miolakolaka sy manana hevitra miafina ny hainteny, ny tôkatôka kosa dia mivantana, mamelombelona ary miombom-peo amin'ny mpanatrika rehetra mba hifampizara ny hasina sy ny hafaliana.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Rasavôlana » (ou « Rasavolagna ») dans la culture de l'Est malgache ?",
          questionMg:
            "Inona moa ny atao hoe « Rasavôlana » na « Rasavolagna » any amin'ny faritra atsinanana ?",
          choices: [
            "Une forme d'art oratoire solennel et éloquent utilisé lors des deuils et des réunions communautaires",
            'Un instrument de musique à cordes en bambou',
            'Un repas de fête préparé avec du manioc',
            'Un costume de danse pour les enfants',
          ],
          correctIndex: 0,
          explanation:
            "Le Rasavôlana est l'art de la prise de parole solennelle et compatissante propre aux régions de l'Est (Betsimisaraka, Bezanozano).",
        },
        {
          type: 'quiz',
          question: "D'où provient étymologiquement le mot « Tôkatôka » ?",
          questionMg: "Avy amin'ny inona ny fototeny hoe « Tôkatôka » ?",
          choices: [
            'Du mot « tôka » qui signifie « hasina » (sacré, bénédiction sacrée)',
            'Du bruit des sabots de zébu',
            "D'un mot emprunté à une langue européenne",
            "Du nom d'un oiseau migrateur",
          ],
          correctIndex: 0,
          explanation:
            '« Tôkatôka » dérive de « tôka » (hasina) et du verbe « mitôka » qui signifie sanctifier ou appeler la bénédiction divine.',
        },
        {
          type: 'quiz',
          question:
            "Dans quel type d'événement le « Tôkatôka » est-il principalement scandé et déclamé ?",
          questionMg:
            "Amin'ny fotoana manao ahoana no tena anatanterahana ny Tôkatôka ?",
          choices: [
            'Lors des fêtes joyeuses, réjouissances collectives et célébrations communautaires',
            'Pendant les examens scolaires silencieux',
            "Uniquement au tribunal lors d'un procès",
            'Pendant la pêche nocturne en mer',
          ],
          correctIndex: 0,
          explanation:
            "Le Tôkatôka est un poème rythmé et déclamé pour réjouir l'assemblée lors des célébrations festives.",
        },
        {
          type: 'quiz',
          question:
            'Quelle différence majeure distingue le Tôkatôka du Hainteny traditionnel ?',
          questionMg:
            "Inona no fahasamihafana lehibe misy eo amin'ny Tôkatôka sy ny Hainteny ?",
          choices: [
            'Le Tôkatôka est direct, clair et rythmé, tandis que le Hainteny privilégie les allusions cachées et voilées',
            "Le Tôkatôka ne se dit qu'en chuchotant",
            "Le Hainteny n'utilise aucun mot malgache",
            "Il n'y a aucune différence entre les deux",
          ],
          correctIndex: 0,
          explanation:
            "Le Tôkatôka s'exprime avec clarté, ferveur et franchise populaire, à l'inverse des devinettes énigmatiques du Hainteny.",
        },
        {
          type: 'quiz',
          question:
            'Quel rôle social capital jouent le Rasavôlana et le Tôkatôka pour la société malgache ?',
          questionMg:
            "Inona no voka-tsoa iombonana entin'ny Rasavôlana sy ny Tôkatôka eo amin'ny fiaraha-monina ?",
          choices: [
            'Conserver la mémoire orale, réconforter les affligés et renforcer le lien sacré du Fihavanana',
            'Créer des tensions politiques entre les clans',
            'Remplacer les lois écrites de la République',
            'Interdire aux jeunes de prendre la parole',
          ],
          correctIndex: 0,
          explanation:
            'Ces arts oratoires transmettent les valeurs éthiques, apaisent les douleurs familiales et scellent la solidarité communautaire.',
        },
      ],
    },
    {
      slug: 'les-parlers-du-grand-sud-antandroy-mahafaly',
      title: 'Les parlers du Grand Sud : Antandroy, Mahafaly et Bara',
      titleMg: "Ny Fitenin'ny Faritra Atsimo : Antandroy, Mahafaly ary Bara",
      summary:
        'Plongez dans les sonorités vigoureuses du Sud malgache, les salutations pastorales et la poésie des troupeaux.',
      summaryMg:
        "Fantaro ny fiteny sy ny fomba fitenin'ny mponina any Atsimo, eo amin'ny tontolon'ny omby sy ny roy.",
      type: 'VOCABULARY',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Les régions arides et grandioses du Sud de Madagascar possèdent des parlers d'une force et d'une musicalité remarquables. Chez les **Antandroy** (« les gens des épineux »), les **Mahafaly** (« ceux qui rendent tabou / heureux ») et les **Bara** (grands éleveurs pasteurs), la parole se caractérise par des consonnes appuyées, la présence du son « tch / ts » et un lexique d'une extraordinaire précision lié au monde du zébu et de la terre ancestrale.",
          textMg:
            "Ny faritra atsimo midadasika eto Madagasikara dia manana fitenim-paritra mafonja sy mirindra tsara. Ny **Antandroy**, ny **Mahafaly** ary ny **Bara** dia mampiasa teny feno hafanana, manindry mafy ny renifeo (indrindra ny feo « tch / ts »), ary manana voambolana maro be mikasika ny tontolon'ny omby sy ny fiainana an-tany mena.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TY',
          phonetic: 'ti',
          frenchEquivalent:
            "En dialecte du Sud, « Ty » sert d'article ou démonstratif courant à la place de « Ity » ou « Ny » (ex: Akore ty tantara ?).",
          sampleWordMg: 'Akore ty tantara ?',
          sampleTranslationFr:
            'Quelles sont les nouvelles ? (Salutation emblématique du Sud)',
        },
        {
          type: 'concept',
          termMg: 'Akore ty tantara ?',
          phonetic: 'a-kou-re ti tan-ta-ra',
          meaningFr: 'Comment vont les nouvelles ? / Bonjour à vous',
          explanation:
            'Formule de salutation universelle et chaleureuse dans tout le Sud malgache (Antandroy, Mahafaly, Bara).',
        },
        {
          type: 'concept',
          termMg: 'Soa soa, tsy manin-draho',
          phonetic: 'sou-a sou-a, tsi ma-nin-dra-hou',
          meaningFr: 'Tout va très bien, je me porte à merveille',
          explanation:
            "Réponse rituelle polie et bienveillante marquant la paix et la tranquillité de l'esprit.",
        },
        {
          type: 'concept',
          termMg: 'Vala / Fahitra',
          phonetic: 'va-la / fa-hi-tsa',
          meaningFr: "L'enclos à zébus familial et communautaire",
          explanation:
            'Cœur battant du village dans le Sud, symbole de prospérité, de bénédiction ancestrale et de sécurité des troupeaux.',
        },
        {
          type: 'concept',
          termMg: 'Roy',
          phonetic: 'rouy',
          meaningFr: 'Les arbustes épineux de la forêt australe',
          explanation:
            "Végétation typique du bush du Sud ayant donné son nom au peuple Antandroy (« ceux de la forêt d'épineux »).",
        },
        {
          type: 'example',
          textMg:
            'Akore ty tantara lahy ? — Soa soa rahavana, tomombana ty omby am-bala !',
          textFr:
            "Quelles sont les nouvelles, mon ami ? — Excellentes nouvelles, mon frère, les zébus sont sains et saufs dans l'enclos !",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les langues pastorales du Grand Sud malgache, il existe plus de 80 termes distincts pour désigner la robe d'un zébu, la courbure exacte de ses cornes et sa démarche, preuve de l'importance vitale du zébu dans la culture et la poésie populaire.",
          textMg:
            "Amin'ny fitenin'ny mpiompy any Atsimo, misy teny mihoatra ny 80 samy hafa enti-milaza ny lokon'ny omby, ny bikany, ary ny fiolakolaky ny tandrony, manaporofo ny lanjan'ny omby eo amin'ny fiainana.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quelle est la célèbre salutation traditionnelle emblématique du Grand Sud malgache ?',
          questionMg:
            'Inona ilay fiarahabana nentim-paharazana fanta-daza indrindra any Atsimo ?',
          choices: [
            '« Akore ty tantara ? » (Quelles sont les nouvelles ?)',
            '« Veloma finaritra »',
            '« Misaotra betsaka »',
            '« Azafady tompoko »',
          ],
          correctIndex: 0,
          explanation:
            '« Akore ty tantara ? » est la formule de salutation rituelle incontournable chez les Antandroy, Mahafaly et Bara.',
        },
        {
          type: 'quiz',
          question:
            'Comment répond-on couramment et poliment à la salutation « Akore ty tantara ? » ?',
          questionMg:
            'Ahoana no famaliana am-panajana ny fiarahabana hoe « Akore ty tantara ? » ?',
          choices: [
            '« Soa soa » (Très bien / Tout va bien)',
            '« Tsy misy hena »',
            '« Lasa nody aho »',
            '« Vaky ny vilany »',
          ],
          correctIndex: 0,
          explanation:
            'On répond traditionnellement « Soa soa » ou « Soa soa, tsy manin-draho » pour signifier que la paix règne.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie littéralement le nom du peuple du Sud « Antandroy » ?',
          questionMg: "Inona no dikan'ny anaran'ny foko hoe « Antandroy » ?",
          choices: [
            "Ceux de la forêt d'épineux (Roy)",
            "Ceux des grandes rizières d'eau",
            'Les habitants des montagnes enneigées',
            'Les marins des îles lointaines',
          ],
          correctIndex: 0,
          explanation:
            '« An-tandro-roy » signifie littéralement « ceux du pays des épineux » (roy), faisant référence au bush xérophile du Sud.',
        },
        {
          type: 'quiz',
          question:
            "Quel mot désigne l'enclos sacré protégeant les troupeaux de zébus dans les villages du Sud ?",
          questionMg:
            "Inona ny teny iantsoana ny valan'omby fiarovana ny biby fiompy any Atsimo ?",
          choices: [
            'Le Vala (ou Fahitra)',
            'Ny Tranokely',
            'Ny Lapa',
            'Ny Tsena',
          ],
          correctIndex: 0,
          explanation:
            "Le « Vala » (ou « Fahitra ») est l'enclos traditionnel à bétail en rondins de bois, symbole de vie et de sécurité.",
        },
        {
          type: 'quiz',
          question:
            'Quel animal prestigieux est au centre du vocabulaire et de la vie pastorale du Grand Sud ?',
          questionMg:
            "Inona ilay biby manan-kaja mibaiko ny voambolana sy ny fiainan'ny olona any Atsimo ?",
          choices: [
            'Le zébu (Omby)',
            'Le dromadaire',
            'Le cheval de trait',
            'Le lama des Andes',
          ],
          correctIndex: 0,
          explanation:
            'Le zébu (omby) est la richesse suprême, le lien avec les ancêtres et le cœur linguistique de la culture du Sud.',
        },
      ],
    },
    {
      slug: 'le-vocabulaire-maritime-vezo-et-pecheurs',
      title:
        "Le vocabulaire maritime : l'épopée des Vezo et des gens de la mer",
      titleMg: "Ny Voambolan'ny Ranomasina sy ny Fiteny Vezo",
      summary:
        'Explorez le lexique maritime des nomades marins Vezo, les vents et la navigation en pirogue à balancier.',
      summaryMg:
        "Fantaro ireo tenin'ny ranomasina fampiasan'ny foko Vezo sy ireo mpanjono amoron-tsiraka.",
      type: 'VOCABULARY',
      orderIndex: 4,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Sur le littoral sud-ouest de Madagascar s'étend le royaume marin des **Vezo**, maîtres incontestés de la navigation côtière dans le canal de Mozambique. Vivant en symbiose avec l'océan, les Vezo ont développé un lexique maritime raffiné, nommant avec précision chaque brise de vent, chaque recoin de récif coralien, chaque élément de leur pirogue à balancier (*Lakana*) et les trésors de la pêche artisanale.",
          textMg:
            "Any amin'ny morontsiraka atsimo andrefana no misy ny foko **Vezo**, tantsambo mahay mikaroka sy miaina an-dranomasina. Noho ny fifandraisany lalina amin'ny ranomasina, ny Vezo dia manana voambolana manokana manan-karena momba ny rivotra, ny onja, ny lakana misy vava ary ny harena an-dranomasina rehetra.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RIA',
          phonetic: 'ri-a',
          frenchEquivalent:
            'Sonorité fluide et coulante évoquant le mouvement des vagues (ex: Riaka).',
          sampleWordMg: 'Riaka',
          sampleTranslationFr:
            "La mer / L'océan (en vocabulaire maritime et côtier)",
        },
        {
          type: 'concept',
          termMg: 'Vezo',
          phonetic: 've-zou',
          meaningFr:
            '« Ceux qui rament et défient la mer » / Peuple marin du littoral',
          explanation:
            "Plus qu'une ethnie, être Vezo définit une philosophie de vie fondée sur la liberté marine, la pêche et le savoir des marées.",
        },
        {
          type: 'concept',
          termMg: 'Lakam-biha (Lakana Vezo)',
          phonetic: 'la-kam-bi-ha',
          meaningFr: 'La pirogue à balancier monoxyle traditionnelle',
          explanation:
            "Embarcation taillée dans un tronc d'arbre léger (farafatsy), équipée d'un balancier stabilisateur et d'une voile carrée.",
        },
        {
          type: 'concept',
          termMg: 'Varatraza sy Tsioka',
          phonetic: 'va-ra-tsa-za si tsi-ou-ka',
          meaningFr: "L'alizé marin vigoureux et la brise marine",
          explanation:
            "Vents quotidiens que le marin Vezo sait décrypter dès l'aube pour hisser la voile et regagner la terre ferme avant la nuit.",
        },
        {
          type: 'concept',
          termMg: 'Riaka',
          phonetic: 'ri-a-ka',
          meaningFr: "La mer / L'étendue océanique nourricière",
          explanation:
            "Terme vénéré et poétique désignant l'océan, espace de vie sacré soumis aux interdits maritimes (fady).",
        },
        {
          type: 'example',
          textMg:
            "Nandeha natsapa riaka maraina ny Vezo tamin'ny lakam-bihany.",
          textFr:
            'Les pêcheurs Vezo sont partis sonder la mer au petit matin à bord de leur pirogue à balancier.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pour les Vezo, la mer n'appartient à personne : elle est un don partagé de Zanahary. Les pêcheurs observent scrupuleusement des jours de repos marin (Fady riaka) pour permettre aux poissons de se reproduire, témoignant d'une conscience écologique ancestrale remarquable.",
          textMg:
            "Ho an'ny Vezo, ny ranomasina dia an'Andriamanitra ary ifampizarana. Manaja ny andro fady tsy anjonoana izy ireo mba hitsinjovana ny taranaky ny hazandrano, fomba fiarovana ny tontolo iainana efa nisy hatry ny ela.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question: 'Qui sont les « Vezo » dans la culture malgache ?',
          questionMg: "Iza moa ny foko Vezo eo amin'ny kolontsaina malagasy ?",
          choices: [
            'Les marins, navigateurs et pêcheurs nomades du littoral sud-ouest',
            'Des forgerons des hautes montagnes',
            "Des cultivateurs de thé de l'est",
            'Des éleveurs de rennes des plateaux',
          ],
          correctIndex: 0,
          explanation:
            'Les Vezo sont les réputés navigateurs et pêcheurs traditionnels du canal de Mozambique (Tuléar, Morombe, etc.).',
        },
        {
          type: 'quiz',
          question:
            "Comment appelle-t-on l'embarcation traditionnelle à balancier emblématique des pêcheurs Vezo ?",
          questionMg:
            "Ahoana no iantsoana ny lakan'ny Vezo misy vava enti-manjono ?",
          choices: [
            'Le Lakam-biha (Lakana Vezo)',
            'Le Sambofiara',
            'Le Kalesa',
            'Le Trano hazo',
          ],
          correctIndex: 0,
          explanation:
            "Le « Lakam-biha » est la pirogue à balancier traditionnelle sculptée et équipée d'une voile carrée.",
        },
        {
          type: 'quiz',
          question:
            'Quel mot poétique et traditionnel désigne la mer dans le vocabulaire côtier Vezo ?',
          questionMg:
            "Inona ilay teny mampiavaka ny ranomasina amin'ny fitenin'ny mpanjono amoron-tsiraka ?",
          choices: ['Riaka', 'Hady', 'Tanety', 'Lalana'],
          correctIndex: 0,
          explanation:
            '« Riaka » est le mot traditionnel employé sur les côtes pour désigner la mer et les flots marins.',
        },
        {
          type: 'quiz',
          question:
            "Comment appelle-t-on l'alizé marin puissant et régulier qui souffle sur les côtes ?",
          questionMg:
            'Inona no iantsoana ilay rivotra mahery mitsoka avy an-dranomasina ?',
          choices: [
            'Le Varatraza',
            'Le Rano mafana',
            'Ny Zavona',
            'Ny Orana mikija',
          ],
          correctIndex: 0,
          explanation:
            'Le « Varatraza » est le vent alizé régulier et soutenu qui gonfle les voiles des pêcheurs côtiers.',
        },
        {
          type: 'quiz',
          question:
            'Quelle pratique traditionnelle écologique est respectée par les pêcheurs Vezo ?',
          questionMg:
            "Inona ilay fomba nentin-drazana miaro ny tontolo iainana hajain'ny mpanjono Vezo ?",
          choices: [
            "Le respect des jours d'interdiction de pêche (Fady riaka) pour préserver le repos de la mer",
            'La pêche avec des filets industriels destructeurs',
            "L'assèchement complet des lagons",
            'La destruction systématique des coraux',
          ],
          correctIndex: 0,
          explanation:
            'Les interdits traditionnels (fady riaka) permettent aux espèces marines de se reproduire et protègent la ressource halieutique.',
        },
      ],
    },
    {
      slug: 'variations-de-vocabulaire-et-unite-linguistique',
      title: 'Variations régionales et unité profonde de la langue malgache',
      titleMg: "Fahasamihafan'ny Voambolana sy Firaisan'ny Teny Malagasy",
      summary:
        "Comprenez comment la diversité des parlers régionaux s'enracine dans une même structure grammaticale et unie.",
      summaryMg:
        "Diniho ny fahasamihafan'ny teny isam-paritra sy ny fototra iray mampiray ny fiteny malagasy rehetra.",
      type: 'GRAMMAR',
      orderIndex: 5,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Bien que Madagascar compte dix-huit grands groupes régionaux possédant chacun son accent et ses expressions pittoresques, **tous les dialectes malgaches partagent rigoureusement la même architecture grammaticale**. L'ordre canonique Verbe - Objet - Sujet (VOS), le système verbal d'infixation (*-in-*, *-um-*), et le tronc commun de racines austronésiennes permettent à tous les enfants de l'île de se comprendre et de célébrer leur unité fraternelle (*Fihavanana*).",
          textMg:
            "Na dia manana foko valo ambin'ny folo manana ny fitenim-paritra sy ny kanton'ny feony aza i Madagasikara, **ny teny malagasy rehetra dia miray amin'ny rafitra ara-pitsipika tokana**. Ny filaharan'ny teny Matoanteny - Fameno - Lazaina (VOS), ny fanovonana sy ny fampidirana tovona sy tsofoka, ary ny fototeny iombonana dia manaporofo fa iray ihany ny teny malagasy manerana ny Nosy.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VOS',
          phonetic: 'v-o-s',
          frenchEquivalent:
            "Ordre habituel des phrases malgaches : Verbe + Complément d'objet + Sujet (ex: Mihinana vary aho).",
          sampleWordMg: 'Mihinana vary aho',
          sampleTranslationFr:
            'Je mange du riz (littéralement : Mange du riz moi)',
        },
        {
          type: 'concept',
          termMg: 'Matoanteny - Fameno - Lazaina (VOS)',
          phonetic: 'ma-tou-an-te-ni fa-me-nou la-zeye-na',
          meaningFr: "L'ordre syntaxique universel de la langue malgache",
          explanation:
            'Contrairement au français qui place le Sujet en tête (SVO), le malgache débute traditionnellement par le verbe dans tous ses dialectes.',
        },
        {
          type: 'concept',
          termMg: 'Mihinana / Komana / Homana / Mihinagne',
          phonetic: 'mi-hi-na-na / kou-ma-na / hou-ma-na / mi-hi-nang-e',
          meaningFr: 'Variations régionales du verbe « Manger »',
          explanation:
            'Démontre que les variantes lexicales partagent la même racine ou expriment une simple évolution phonétique locale parfaitement intelligible.',
        },
        {
          type: 'concept',
          termMg: 'Zaza / Tsaiky / Ajaja',
          phonetic: 'za-za / tsye-ki / a-ja-ja',
          meaningFr: "Variations affectueuses pour désigner « l'enfant »",
          explanation:
            "Sur les Hautes Terres on dit « zaza », dans le Nord et l'Ouest « tsaiky », à l'Est « ajaja » : trois manières douces d'honorer la jeunesse.",
        },
        {
          type: 'concept',
          termMg: 'Ny Teny Malagasy dia Iray',
          phonetic: 'ni te-ni ma-la-ga-si di-a i-rye',
          meaningFr: 'La langue malgache est une et indivisible',
          explanation:
            'Principe linguistique et culturel soulignant que les dialectes ne divisent pas, mais enrichissent le patrimoine commun de la nation.',
        },
        {
          type: 'example',
          textMg:
            "Na samihafa aza ny tenim-paritra, ny fanahin'ny fiteny kosa dia iray ihany mampiray ny Malagasy rehetra.",
          textFr:
            "Bien que les dialectes régionaux varient, l'âme de la langue est une et unit tous les Malgaches dans le Fihavanana.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Alors que moins de 5 % des langues du monde utilisent l'ordre de phrase Verbe - Objet - Sujet (VOS), tous les dialectes malgaches, de Diégo-Suarez à Fort-Dauphin, partagent cette structure syntaxique originale. C'est l'une des preuves scientifiques les plus éclatantes de l'unité fondamentale de la nation malgache.",
          textMg:
            "Tsy misy afa-tsy 5 % amin'ny fiteny maneran-tany no mampiasa ny filaharana Matoanteny - Fameno - Lazaina (VOS). Ny fitenim-paritra malagasy rehetra hatrany Avaratra ka hatrany Atsimo anefa dia mampiasa an'io firafitra io avokoa, manamarina ny firaisan-kinan'ny teny malagasy.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Quel est l'ordre syntaxique naturel d'une phrase verbale en malgache, partagé par tous les dialectes ?",
          questionMg:
            "Inona ny filaharan'ny teny mahazatra amin'ny fehezanteny malagasy ?",
          choices: [
            "Verbe - Complément d'objet - Sujet (VOS)",
            "Sujet - Verbe - Complément d'objet (SVO)",
            "Complément d'objet - Sujet - Verbe (OSV)",
            "Sujet - Complément d'objet - Verbe (SOV)",
          ],
          correctIndex: 0,
          explanation:
            'Le malgache structure ses phrases avec le verbe en tête (VOS), par exemple : « Mahandro vary i Soa » (Cuisine du riz Soa).',
        },
        {
          type: 'quiz',
          question:
            'Quels termes côtiers correspondent au verbe standard « Mihinana » (Manger) ?',
          questionMg:
            "Inona ireo tenim-paritra mitovy hevitra amin'ny hoe « Mihinana » ?",
          choices: [
            'Komana, Homana na Mihinagne',
            'Matory na Mandry',
            'Mandeha na Mamindra',
            'Milalao na Mikorana',
          ],
          correctIndex: 0,
          explanation:
            'Selon les régions, « manger » se dit couramment « komana », « homana » ou « mihinagne », toutes issues de racines proches.',
        },
        {
          type: 'quiz',
          question:
            "Quel mot des dialectes du Nord et de l'Ouest équivaut au terme « Zaza » (Enfant) ?",
          questionMg:
            "Inona ny tenim-paritra any Avaratra sy Andrefana mitovy hevitra amin'ny teny hoe « Zaza » ?",
          choices: ['Tsaiky', 'Raiamandreny', 'Zoky', 'Mpanjaka'],
          correctIndex: 0,
          explanation:
            '« Tsaiky » est le mot très populaire et affectueux des côtes nord et ouest pour désigner un enfant.',
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce qui prouve l'unité profonde de la langue malgache par-delà les dialectes ?",
          questionMg:
            "Inona no manaporofo ny firaisana lalina misy eo amin'ny fitenim-paritra malagasy rehetra ?",
          choices: [
            'Une grammaire identique, une syntaxe VOS commune et un même fonds de racines',
            "L'obligation d'utiliser des mots étrangers",
            "L'absence de communication entre les provinces",
            "Le fait qu'il n'y ait aucun mot similaire",
          ],
          correctIndex: 0,
          explanation:
            "La structure grammaticale (VOS), les infixes et les racines partagées démontrent l'unité indissoluble de la langue malgache.",
        },
        {
          type: 'quiz',
          question:
            'Quelle valeur culturelle suprême est renforcée par cette unité linguistique à Madagascar ?',
          questionMg:
            "Inona ilay soatoavina lehibe malagasy hamafisin'izany firaisan'ny teny izany ?",
          choices: [
            'Le Fihavanana (solidarité, fraternité et concorde nationale)',
            "La division et l'isolement des clans",
            "L'oubli des traditions des ancêtres",
            'La rivalité permanente entre les régions',
          ],
          correctIndex: 0,
          explanation:
            "L'unité de la langue malgache est le pilier vivant du Fihavanana, liant fraternellement tous les habitants de la Grande Île.",
        },
      ],
    },

    // ─── LEÇON 6 : LE NORD FLAMBOYANT (ANTAKARANA & TSIMIHETY) ───
    {
      slug: 'le-nord-flamboyant-parlers-antakarana-et-tsimihety',
      title:
        'Le Nord flamboyant : parlers Antakarana et Tsimihety (Ny Avaratra & ny Fiteny any)',
      titleMg: 'Ny Fiteny Antakarana sy Tsimihety any Avaratra',
      summary:
        'Explorez l’énergie des parlers du Nord : salutations vives (Karakory, Akory kabary), le vocabulaire royal de l’Ankarana et la fierté insoumise des Tsimihety.',
      summaryMg:
        'Fantaro ny haren’ny teny avaratra : Karakory, Akory kabary, ny fomba amam-panao any Ankarana sy ny fari-tanin’ny Sofia.',
      type: 'CULTURE',
      orderIndex: 6,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le Nord de Madagascar réunit deux identités fortes : les **Antakarana** (« ceux des falaises et des rochers », royaume des Tsingy et des grottes sacrées d'Ankarana) et les **Tsimihety** (« ceux qui ne coupent pas leurs cheveux », symbole d'indépendance historique face à la soumission féodale). Leurs parlers sont caractérisés par une musicalité vive, rythmée, où les voyelles s'élèvent et où les salutations respirent la franchise et la chaleur.",
          textMg:
            "Ny Faritra Avaratra eto Madagasikara dia ahitana kolontsaina roa lehibe sy mafonja : ny **Antakarana** (ireo mponina amin'ny vatolampy sy ny zohy masin'Ankarana) sy ny **Tsimihety** (mariky ny fahafahana sy ny fandavana fanandevozana). Ny fiteniny dia mampiavaka azy amin'ny fomba fiteny mafonja, mivantana ary feno hafanana sy fanajana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'Ñ / NG',
          phonetic: 'ñ (nasale palatale chantante)',
          frenchEquivalent:
            "Dans le Nord, la nasalisation est très mélodieuse, semblable au 'ñ' espagnol ou au 'gn' doux français (ex: Zagnahary = Dieu créateur, Karakory = comment ça va).",
          sampleWordMg: 'Zagnahary',
          sampleTranslationFr: 'Dieu Créateur suprême en parler du Nord',
        },
        {
          type: 'concept',
          termMg: 'Karakory / Akory kabary ?',
          phonetic: 'ka-ra-kou-ri / a-kou-ri ka-ba-ri',
          meaningFr: 'Comment allez-vous ? / Quelles sont les nouvelles ?',
          explanation:
            'La formule de salutation reine de tout le Nord de Madagascar. On y répond traditionnellement avec vivacité : *Tsara be tompoko !* (Très bien !) ou *Tsisy kabary !* (Rien à signaler, tout est paisible).',
        },
        {
          type: 'concept',
          termMg: 'Ampanjaka',
          phonetic: 'am-pan-dza-ka',
          meaningFr: 'Le roi ou souverain coutumier du Nord',
          explanation:
            "Chez les Antakarana et les Sakalava, l'Ampanjaka est le garant spirituel de la paix, des traditions sacrées (*Fomba*) et de la mémoire royale.",
        },
        {
          type: 'concept',
          termMg: 'Jiaby / Aby',
          phonetic: 'dzi-a-bi / a-bi',
          meaningFr: 'Tous / Tout le monde / L’ensemble',
          explanation:
            "Terme omniprésent dans le Nord pour exprimer l'inclusion totale et l'égalité fraternelle : *Tsika jiaby* (Nous tous ensemble).",
        },
        {
          type: 'concept',
          termMg: 'Tsimihety',
          phonetic: 'tsi-mi-he-ti',
          meaningFr: 'Ceux qui ne coupent pas leurs cheveux (les insoumis)',
          explanation:
            "Nom historique héroïque du peuple de la région Sofia qui refusa de se couper les cheveux lors du deuil imposé par les rois d'antan, proclamant son amour sacré de la liberté.",
        },
        {
          type: 'example',
          textMg: 'Karakory anareo jiaby ? Tsara be tompoko, tsisy kabary !',
          textFr:
            'Comment allez-vous tous ? Très bien s’il vous plaît, tout est paisible !',
        },
        {
          type: 'example',
          textMg:
            'Misaotra an’i Zagnahary fa nilamina tsara ny dia nankany Antsiranana.',
          textFr:
            'Grâce soit rendue à Dieu car le voyage vers Antsiranana s’est déroulé dans une parfaite sérénité.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans le dialecte Antakarana, le mot « Tany » (la terre) est souvent prononcé « Tagny » ou « Tandraza ». La célèbre baie de Diégo-Suarez abrite le Pain de Sucre marin sacré appelé « Nosy Lonjo », où les rites coutumiers d’action de grâce sont encore accomplis sous la bénédiction de l'Ampanjaka.",
          textMg:
            "Ao amin'ny fiteny Antakarana, ny tany dia antsoina hoe « Tagny ». Ny Nosy Lonjo ao amin'ny Helodranon'Antsiranana dia toerana masina fanaovana joro sy fisaorana ny Razana eo ambany fitarihan'ny Ampanjaka.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la salutation la plus courante et emblématique dans tout le Nord de Madagascar ?',
          questionMg:
            "Inona no fiarahabana malaza sy fampiasa indrindra any amin'ny Faritra Avaratra ?",
          choices: [
            'Karakory / Akory kabary ?',
            'Bonjour mon cher ami',
            'Veloma tompoko',
            'Azafady tompoko',
          ],
          correctIndex: 0,
          explanation:
            '« Karakory » (ou « Akory kabary ») est la salutation proverbiale chaleureuse du Nord, appelant la réplique joyeuse « Tsara be ! ».',
        },
        {
          type: 'quiz',
          question:
            'Que signifie littéralement le nom du peuple « Tsimihety » dans la région de la Sofia ?',
          questionMg:
            "Inona no hevitra ara-tantara fonosin'ny anarana hoe « Tsimihety » ?",
          choices: [
            'Ceux qui ne coupent pas leurs cheveux, symbole d’indépendance et de liberté',
            'Ceux qui cultivent la vanille',
            'Les marins de haute mer',
            'Les bâtisseurs de ponts de pierre',
          ],
          correctIndex: 0,
          explanation:
            'Les Tsimihety refusèrent de couper leurs cheveux en signe de deuil forcé, affirmant ainsi leur liberté politique inaliénable.',
        },
        {
          type: 'quiz',
          question:
            'Comment désigne-t-on le roi coutumier chez les Antakarana du Nord ?',
          questionMg:
            'Ahoana no iantsoana ny mpanjaka nentin-drazana any Ankarana ?',
          choices: [
            'Ny Ampanjaka',
            'Le Président',
            'Ny Mpikabary',
            'Ny Katibo',
          ],
          correctIndex: 0,
          explanation:
            "L'Ampanjaka est l'autorité coutumière royale respectée qui préside aux rituels et veille sur la communauté.",
        },
        {
          type: 'quiz',
          question:
            'Quel mot du Nord utilise-t-on pour dire « tous ensemble / tout le monde » ?',
          questionMg:
            'Inona no teny avaratra midika hoe « tous / tout le monde » ?',
          choices: ['Jiaby / Aby', 'Kely', 'Iray', 'Tsy misy'],
          correctIndex: 0,
          explanation:
            "« Jiaby » (ou « aby ») signifie 'tous' : « Tsika jiaby » = Nous tous ensemble dans la concorde.",
        },
        {
          type: 'quiz',
          question:
            "Quelle est la réponse traditionnelle quand quelqu'un vous demande « Akory kabary ? » dans le Nord ?",
          questionMg:
            'Inona no avaly rehefa misy manontany hoe « Akory kabary ? » ?',
          choices: [
            'Tsisy kabary ! / Tsara be !',
            'Tsy fantatro',
            'Miala tsiny',
            'Mandehana mody',
          ],
          correctIndex: 0,
          explanation:
            "« Tsisy kabary » (Il n'y a pas de problème / Tout va bien) exprime que la paix et la tranquillité règnent.",
        },
      ],
    },

    // ─── LEÇON 7 : LA CÔTE EST (BETSIMISARAKA & SORABE ANTEMORO) ───
    {
      slug: 'la-cote-est-betsimisaraka-et-sorabe-antemoro',
      title:
        'La côte Est : trésors Betsimisaraka et le Sorabe Antemoro (Ny Atsinanana sy ny Sorabe)',
      titleMg: 'Ny Teny Betsimisaraka sy ny Sorabe Antemoro',
      summary:
        'Découvrez la poésie marine et forestière des Betsimisaraka et la tradition des manuscrits sacrés du Sorabe chez les Antemoro.',
      summaryMg:
        'Ianaro ny teny Betsimisaraka, ny fiarahabana amin’ny akory ary ny Sorabe soratana amin’ny taratasy dinitra.',
      type: 'CULTURE',
      orderIndex: 7,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "La côte orientale de Madagascar, baignée par les alizés de l'océan Indien et bordée de forêts denses et de girofliers, abrite le grand peuple **Betsimisaraka** (« les nombreux inséparables », fédérés jadis par Ratsimilaho) et plus au Sud, le peuple **Antemoro** à Manakara et Vohipeno. C'est chez les Antemoro qu'est née l'unique écriture traditionnelle malgache : le **Sorabe** (littéralement « la grande écriture »), rédigée en caractères arabo-malgaches sur du papier végétal séculaire (*Taratasy Antemoro* fabriqué à partir de l'Avoha).",
          textMg:
            "Ny morontsiraka atsinanana dia fonenan'ny **Betsimisaraka** (« ireo maro tsy mifanary ») sy ny **Antemoro** any Vohipeno sy Manakara. Any no nivoahan'ny soratra tranainy indrindra malagasy : ny **Sorabe**, voasoratra amin'ny tarehin-tsoratra arabo-malagasy eo amin'ny Taratasy Antemoro vita amin'ny hazo Avoha. Ny fiteny any dia manankarena voambolana mikasika ny ala, ny ranomasina sy ny fahendrena.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'AKORY',
          phonetic: 'a-kou-ri (ouverture ample)',
          frenchEquivalent:
            "Salutation universelle de la côte Est. Le 'O' est bien rond 'ou', le 'y' final est bref (ex: Akory aby = Bonjour à tous).",
          sampleWordMg: 'Akory',
          sampleTranslationFr: 'Salutation fraternelle de la côte Est',
        },
        {
          type: 'concept',
          termMg: 'Akory / Mba tsara va ?',
          phonetic: 'a-kou-ri / mba tsa-ra va',
          meaningFr: 'Bonjour, comment allez-vous ? Est-ce que tout va bien ?',
          explanation:
            "La salutation la plus douce et fraternelle sur la côte Est de Madagascar. Elle témoigne de l'attention bienveillante portée à son interlocuteur.",
        },
        {
          type: 'concept',
          termMg: 'Sorabe',
          phonetic: 'sou-ra-be',
          meaningFr: 'La grande écriture / Manuscrits arabo-malgaches',
          explanation:
            "Textes manuscrits vénérables préservés par les scribes royaux Antemoro (*Katibo*), consignant l'histoire, la pharmacopée traditionnelle et l'astrologie.",
        },
        {
          type: 'concept',
          termMg: 'Taratasy Antemoro',
          phonetic: 'ta-ra-ta-si an-te-mou-rou',
          meaningFr: 'Le papier artisanal végétal Antemoro',
          explanation:
            "Papier fait main d'une résistance exceptionnelle fabriqué à partir des fibres bouillies du mûrier sauvage (*Avoha*), orné de fleurs sauvages séchées.",
        },
        {
          type: 'concept',
          termMg: 'Katibo',
          phonetic: 'ka-ti-bou',
          meaningFr: 'Le scribe et gardien des textes sacrés',
          explanation:
            "Érudit traditionnel de la lignée noble des Antemoro formé pendant des décennies à la calligraphie, à l'art divinatoire et aux lois coutumières.",
        },
        {
          type: 'example',
          textMg:
            'Akory nareo namana, mba tsara va ny fambolena lavanila sy jirofo tamin’ity taona ity ?',
          textFr:
            'Bonjour chers amis, la récolte de vanille et de girofle a-t-elle été bonne cette année ?',
        },
        {
          type: 'example',
          textMg:
            'Ireo Katibo no miambina sy mamaky ny Sorabe nentin-drazana any Vohipeno.',
          textFr:
            'Ce sont les Katibo qui gardent et lisent les vénérables manuscrits du Sorabe à Vohipeno.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le nom « Betsimisaraka » a été proclamé solennellement au XVIIIe siècle lors de l'alliance des chefs de clans de l'Est pour signifier : « Même nombreux, nous ne serons plus jamais divisés ni séparés ». C'est l'un des plus beaux hommages historiques à l'idéal du Fihavanana.",
          textMg:
            "Ny anarana hoe « Betsimisaraka » dia fanekem-pihavanana lehibe nataon'ireo foko tany Atsinanana tamin'ny taonjato faha-18 : « Na maro aza izahay dia tsy hisaraka intsony mandrakizay ».",
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Sorabe » dans l'histoire de la culture malgache ?",
          questionMg:
            "Inona no atao hoe « Sorabe » eo amin'ny tantara sy ny kolontsaina malagasy ?",
          choices: [
            'Les manuscrits sacrés rédigés en caractères arabo-malgaches chez les Antemoro',
            'Un type de grand chapeau en paille',
            'Une danse moderne',
            'Un instrument à cordes de fer',
          ],
          correctIndex: 0,
          explanation:
            "Le Sorabe est la première forme d'écriture historique de Madagascar, conservée précieusement dans le Sud-Est par les Katibo.",
        },
        {
          type: 'quiz',
          question:
            'Quelle plante locale est utilisée pour confectionner le célèbre Papier Antemoro ?',
          questionMg:
            "Inona ilay hazo fanao taratasy malaza any amin'ny faritra Antemoro ?",
          choices: [
            'L’Avoha (mûrier sauvage à fibres denses)',
            'Le bambou géant',
            'Le pin d’Europe',
            'Le baobab géant',
          ],
          correctIndex: 0,
          explanation:
            "L'écorce de l'Avoha est bouillie, pilée et étalée sur des toiles de coton pour créer le prestigieux papier Antemoro.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on les érudits traditionnels qui écrivent et lisent le Sorabe ?',
          questionMg:
            "Ahoana no anaran'ireo mpitahiry sy mpamaky ny Sorabe nentin-drazana ?",
          choices: ['Ny Katibo', 'Ny Mpamboly', 'Ny Mpihira', 'Ny Mpantsaka'],
          correctIndex: 0,
          explanation:
            "Les 'Katibo' sont les maîtres scribes et sages dépositaires de l'écriture arabo-malgache à Vohipeno.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie le nom du peuple « Betsimisaraka » sur la côte Est ?',
          questionMg: "Inona no dikan'ny teny hoe « Betsimisaraka » ?",
          choices: [
            'Les nombreux qui ne se séparent jamais',
            'Ceux qui vivent sur les bateaux',
            'Les habitants des montagnes',
            'Les chercheurs d’or',
          ],
          correctIndex: 0,
          explanation:
            "« Be » (nombreux) + « tsy » (ne... pas) + « misaraka » (se séparer) : un serment perpétuel d'unité fraternelle.",
        },
        {
          type: 'quiz',
          question:
            'Quelle salutation fraternelle utilise-t-on couramment sur la côte Est ?',
          questionMg:
            "Inona no teny fiarahabana feno hatsaram-panahy amin'ny teny Betsimisaraka ?",
          choices: [
            'Akory / Mba tsara va ?',
            'Adieu',
            'Aza manelingelina',
            'Tsy tiako ianao',
          ],
          correctIndex: 0,
          explanation:
            '« Akory / Mba tsara va ? » est la salutation chaleureuse par excellence le long de tout le littoral oriental.',
        },
      ],
    },

    // ─── LEÇON 8 : LE PAYS PASTORAL BARA (IHOROMBE) ───
    {
      slug: 'le-pays-pastoral-bara-et-plateau-ihorombe',
      title:
        'Le pays pastoral Bara : l’épopée du zébu et de l’Ihorombe (Ny Fiteny sy ny Omby any Ihorombe)',
      titleMg: 'Ny Fiteny sy ny Kolontsaina Bara any Ihorombe',
      summary:
        'Plongez dans les savanes du Sud : vocabulaire pastoral, art de désigner les robes de zébus, bravoure du Ringa et poésie de l’Ihorombe.',
      summaryMg:
        'Fantaro ny fomba fiainan’ny Bara, ny anaran’ny volom-bita amin’ny omby, ny haiady Ringa ary ny teny any Ihorombe.',
      type: 'TRADITION',
      orderIndex: 8,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Sur les immenses plateaux herbeux de l'Ihorombe et aux portes des massifs de l'Isalo vit le peuple **Bara**. Éleveurs de zébus par excellence, les Bara possèdent un parler puissant, sobre et direct, façonné par les grands espaces et le pastoralisme. Chez les Bara, le zébu (*Aombe*) n'est pas un bétail ordinaire : c'est un compagnon de destin, l'incarnation de la fierté et le pont sacré entre les ancêtres et les vivants.",
          textMg:
            "Eo amin'ny lembalemba midadasik'i Ihorombe sy ny manodidina an'Isalo no monina ny foko **Bara**. Mpiandry omby hatramin'ny ela izy ireo ka ny fiteniny dia mafonja, fohy ary mikasika ny fiainana an-kalamanjana. Ny omby (*Aombe*) eo amin'ny Bara dia harena amam-boninahitra, mariky ny herim-po ary fatorana masina amin'ny Razana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'AOMBE',
          phonetic: 'a-oum-be (diphtongue pastorale)',
          frenchEquivalent:
            "En parler Bara et dans le Sud, 'Omby' (zébu) se prononce avec un 'A' d'ouverture très sonore : 'Aombe'.",
          sampleWordMg: 'Aombe',
          sampleTranslationFr: 'Le zébu en dialecte Bara et pastoral',
        },
        {
          type: 'concept',
          termMg: 'Volom-bita / Volon-tsoratra',
          phonetic: 'vou-loum-bi-ta',
          meaningFr: 'La robe et les marques du zébu',
          explanation:
            'Le lexique Bara possède des dizaines de mots pour décrire précisément la robe de chaque zébu : *Mazavaloha* (tête blanche), *Borimanga* (robe gris-bleu), *Vangovango* (robe tachetée).',
        },
        {
          type: 'concept',
          termMg: 'Ringa Bara',
          phonetic: 'rin-ga',
          meaningFr: 'La lutte martiale traditionnelle à mains nues',
          explanation:
            "Art martial d'honneur et de courage pratiqué sur la terre rouge lors des grandes fêtes et foires pour éprouver la valeur et l'endurance des jeunes hommes.",
        },
        {
          type: 'concept',
          termMg: 'Sombiky',
          phonetic: 'soum-bi-ki',
          meaningFr: 'Les entailles géométriques d’oreille du zébu',
          explanation:
            "Chaque famille noble et pastorale possède sa marque d'oreille spécifique (*Sombiky*), enregistrée dans la mémoire de toute la communauté.",
        },
        {
          type: 'concept',
          termMg: 'Toka-barika',
          phonetic: 'tou-ka-ba-ri-ka',
          meaningFr: 'La déclamation oratoire héroïque pastorale',
          explanation:
            "Chant et cri poétique où le guerrier pastoral proclame la vaillance de ses aïeux, la force de son lignage et l'amour de sa terre.",
        },
        {
          type: 'example',
          textMg:
            'Aombe matavy an-jatony no mandalo eny amin’ny lembalemban’i Ihorombe.',
          textFr:
            'Des centaines de zébus gras traversent majestueusement le plateau d’Ihorombe.',
        },
        {
          type: 'example',
          textMg:
            'Mijoro am-pahasahiana ny tovolahy amin’ny kianjan’ny Ringa ho fiarovana ny voninahitry ny fokony.',
          textFr:
            'Le jeune homme se dresse avec fierté dans l’arène du Ringa pour honorer son clan.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Un éleveur Bara peut reconnaître chacun des zébus de son troupeau (parfois plus de cinq cents têtes !) simplement en observant la courbure de ses cornes (*Tandroka*) et la nuance exacte de sa robe au lever du soleil.',
          textMg:
            "Ny mpiandry omby Bara dia mahay manavaka ny ombiny tsirairay amin'ny tandroka sy ny volom-bita na dia an-jatony aza no miara-miraoka ahitra.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le zébu dans le parler Bara et du Sud de Madagascar ?',
          questionMg:
            "Ahoana no fanononana ny teny hoe « zébu » amin'ny fiteny Bara any Atsimo ?",
          choices: ['Aombe', 'Soavaly', 'Kisoa', 'Vorona'],
          correctIndex: 0,
          explanation:
            "En dialecte Bara, le zébu se nomme 'Aombe', avec la diphtongue caractéristique marquant la noblesse pastorale.",
        },
        {
          type: 'quiz',
          question: "Qu'est-ce que le « Ringa » chez les Bara ?",
          questionMg:
            "Inona no atao hoe « Ringa » eo amin'ny kolontsaina Bara ?",
          choices: [
            'Un art martial traditionnel de lutte à mains nues célébrant la vaillance',
            'Une recette de cuisine avec du lait de zébu',
            'Une pirogue de rivière',
            'Un instrument à cordes de bambou',
          ],
          correctIndex: 0,
          explanation:
            "Le Ringa est la lutte traditionnelle où les jeunes hommes rivalisent de bravoure, d'équilibre et de force physique.",
        },
        {
          type: 'quiz',
          question:
            'Quel plateau herbeux immense est le cœur géographique du pays pastoral Bara ?',
          questionMg:
            "Inona ilay lembalemba midadasika fonenan'ny mpiandry omby Bara ?",
          choices: [
            'L’Ihorombe',
            'L’Ankarana',
            'La presqu’île Masoala',
            'L’île Sainte-Marie',
          ],
          correctIndex: 0,
          explanation:
            "Le vaste plateau de l'Ihorombe est la terre d'élection des troupeaux et des grands espaces pastoraux Bara.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne le terme « Volom-bita » dans le vocabulaire des éleveurs ?',
          questionMg:
            "Inona no hevitry ny hoe « Volom-bita » eo amin'ny fiompiana omby ?",
          choices: [
            'Les différentes robes, teintes et motifs de pelage des zébus',
            'Le prix de la viande au kilo',
            'La longueur de la corde',
            'L’âge du berger',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Volom-bita' est l'extraordinaire palette de termes désignant chaque nuance et tache de la robe du zébu.",
        },
        {
          type: 'quiz',
          question:
            'Comment les éleveurs identifient-ils traditionnellement la propriété de chaque bête ?',
          questionMg:
            "Ahoana no anavahan'ny mpiandry omby ny fananan'ny fianakaviana tsirairay ?",
          choices: [
            'Par le Sombiky (entailles géométriques rituelles aux oreilles du zébu)',
            'Avec un collier électronique en plastique',
            'En peignant le zébu en vert fluo',
            'Au hasard de la chance',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Sombiky' est la marque géométrique propre à chaque lignée gravée aux oreilles du zébu dès son jeune âge.",
        },
      ],
    },

    // ─── LEÇON 9 : HAUTES TERRES DU SUD & LACS (BETSILEO & SIHANAKA) ───
    {
      slug: 'les-parlers-betsileo-et-sihanaka',
      title:
        'Rizières et grands lacs : les parlers Betsileo et Sihanaka (Ny Fiteny Betsileo sy Sihanaka)',
      titleMg: 'Ny Fiteny Betsileo sy Sihanaka : Rary sy Riha',
      summary:
        'Découvrez l’éloquence du chant poétique Betsileo (Riha), les rizières en gradins et les traditions lacustres du pays Sihanaka autour de l’Alaotra.',
      summaryMg:
        'Ianaro ny kanton’ny kabary Betsileo, ny tononkira Riha, ny zozoro ary ny fiainan’ny mpanjono ao Alaotra.',
      type: 'CULTURE',
      orderIndex: 9,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Deux régions façonnées par l'eau et le travail de la terre : au Sud des Hautes Terres, le peuple **Betsileo** (« Les Invincibles ») a sculpté les montagnes en rizières en terrasses spectaculaires et cultivé l'art oratoire du chant déclamé (*Riha* et *Isa*). Au Nord-Est, le peuple **Antsihanaka** (« ceux des marais ») vit au bord du lac Alaotra, le plus grand lac d'eau douce de l'île. Leurs parlers célèbrent la solidarité paysanne et l'ingéniosité artisanale.",
          textMg:
            "Faritra roa lehibe no mifamatotra amin'ny rano sy ny fambolem-bary : ny **Betsileo** (ireo mpamboly kinga nanorina tanimbary an-toerana manerana ny havoana) sy ny **Sihanaka** (monina manodidina ny farihin'Alaotra, sompitry ny vary eto Madagasikara). Ny fiteniny dia mampiseho ny kanton'ny Riha sy Isa, ny haikanton'ny rary ary ny fihavanana an-tsaha.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'RIHA',
          phonetic: 'ri-ha (intonation montante et poétique)',
          frenchEquivalent:
            "Désigne la joute poétique déclamée en chœur chez les Betsileo. Le 'R' est roulé, le 'h' doucement expiré.",
          sampleWordMg: 'Riha',
          sampleTranslationFr: 'Joute oratoire chantée traditionnelle Betsileo',
        },
        {
          type: 'concept',
          termMg: 'Riha sy Isa',
          phonetic: 'ri-ha si i-sa',
          meaningFr: 'Chants polyphoniques rythmés et joutes oratoires',
          explanation:
            'Chants traditionnels Betsileo déclamés dans les rizières et lors des fêtes pour galvaniser les travailleurs de la terre et honorer les mariages.',
        },
        {
          type: 'concept',
          termMg: 'Tanimbary an-toerana',
          phonetic: 'ta-nim-ba-ri an-tou-e-ra-na',
          meaningFr: 'Rizières en terrasses étagées',
          explanation:
            "Prouesse d'ingénierie paysanne Betsileo classée au patrimoine mondial, utilisant la gravité pour irriguer chaque palier sans gaspillage d'eau.",
        },
        {
          type: 'concept',
          termMg: 'Zozoro',
          phonetic: 'zou-zou-rou',
          meaningFr: 'Le grand roseau des marais de l’Alaotra',
          explanation:
            'Plante emblématique du lac Alaotra utilisée pour tresser les nattes, confectionner les toits étanches et fabriquer les nasses des pêcheurs Sihanaka.',
        },
        {
          type: 'concept',
          termMg: 'Fihavanana an-tsaha',
          phonetic: 'fi-ha-va-na-na an-tsa-ha',
          meaningFr: 'La solidarité fraternelle des travaux agricoles',
          explanation:
            "Principe fondamental : quand vient le temps du repiquage ou de la moisson, tout le village s'entraide mutuellement sans échange d'argent.",
        },
        {
          type: 'example',
          textMg:
            'Manako eny an-dohasaha ny feon’ny Riha rehefa miara-miasa an-tsaha ny Betsileo.',
          textFr:
            'La voix du chant Riha résonne dans la vallée lorsque les Betsileo travaillent ensemble dans les rizières.',
        },
        {
          type: 'example',
          textMg:
            'Manankarena trondro sy vary ny tany Sihanaka manodidina ny farihin’Alaotra.',
          textFr:
            'La région Sihanaka autour du lac Alaotra regorge de poissons savoureux et de riz doré.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le lac Alaotra en pays Sihanaka est le plus grand réservoir de riz de Madagascar, souvent surnommé « Le grenier à riz de la Grande Île ». Il abrite une faune unique au monde, dont le petit lémurien des roseaux (*Hapalemur alaotrensis* ou Bandro), qui ne vit nulle part ailleurs sur Terre.',
          textMg:
            "Ny farihin'Alaotra no farihy lehibe indrindra eto Madagasikara ary antsoina hoe « Sompitr'i Madagasikara ». Any no hany toerana ahitana ny Bandro, karazam-gidro tsy misy afa-tsy ao anaty zozoro.",
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Riha » dans la tradition culturelle du peuple Betsileo ?",
          questionMg:
            "Inona no atao hoe « Riha » amin'ny kolontsaina Betsileo ?",
          choices: [
            'Une déclamation poétique chantée en chœur lors des fêtes et des travaux des champs',
            'Un type de pirogue en bois de pin',
            'Un outil en fer pour couper la viande',
            'Une boisson alcoolisée',
          ],
          correctIndex: 0,
          explanation:
            'Le Riha est la joute oratoire poétique et polyphonique traditionnelle qui fait la renommée des orateurs Betsileo.',
        },
        {
          type: 'quiz',
          question:
            "Pour quel chef-d'œuvre paysan d'ingénierie agricole les Betsileo sont-ils mondialement célèbres ?",
          questionMg:
            'Inona no haikanto ara-pambolena mampalaza ny Betsileo maneran-tany ?',
          choices: [
            'Les rizières en terrasses sculptées à flanc de montagne (Tanimbary an-toerana)',
            'La culture des oliviers en serre',
            'La pêche au harpon sur la glace',
            'La cueillette exclusive de pommes',
          ],
          correctIndex: 0,
          explanation:
            'Les Betsileo ont sculpté des collines entières en paliers irrigués par gravité avec une maîtrise hydraulique ancestrale unique.',
        },
        {
          type: 'quiz',
          question:
            "Quel lac d'eau douce majeur est le cœur du territoire des Antsihanaka ?",
          questionMg:
            "Inona ilay farihy lehibe indrindra fonenan'ny foko Sihanaka ?",
          choices: [
            'Le lac Alaotra',
            'Le lac Léman',
            'Le lac Victoria',
            'Le lac Titicaca',
          ],
          correctIndex: 0,
          explanation:
            "Le lac Alaotra est le plus grand lac d'eau douce de Madagascar et le grenier à riz de toute l'île.",
        },
        {
          type: 'quiz',
          question:
            'Quel lémurien rare et endémique ne vit nulle part ailleurs que dans les roseaux du lac Alaotra ?',
          questionMg:
            "Inona ilay gidro kely tsy fahita afa-tsy ao anaty zozoron'ny farihin'Alaotra ?",
          choices: [
            'Le Bandro (Hapalemur alaotrensis)',
            'Le Panda géant',
            'Le Koala',
            'Le Kangourou',
          ],
          correctIndex: 0,
          explanation:
            "Le Bandro est le lémurien aquatique emblématique qui vit exclusivement dans les fourrés de roseaux Zozoro de l'Alaotra.",
        },
        {
          type: 'quiz',
          question:
            "Quelle plante lacustre géante est essentielle à l'artisanat et aux toits en pays Sihanaka ?",
          questionMg:
            "Inona ilay zavamaniry maniry ao anaty heniheny ampiasain'ny Sihanaka amin'ny rary sy trano ?",
          choices: [
            'Le Zozoro (le grand roseau des marais)',
            'Le blé d’hiver',
            'Le cèdre du Liban',
            'Le palmier dattier',
          ],
          correctIndex: 0,
          explanation:
            'Le Zozoro est le roseau traditionnel séché utilisé pour confectionner les nattes, cloisons et toitures lacustres.',
        },
      ],
    },
  ],
};
