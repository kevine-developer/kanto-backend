import { SeedTrack } from './seed.types.js';

export const hiddenTreasuresTrack: SeedTrack = {
  slug: 'tresors-caches-de-madagascar',
  title: 'Trésors cachés de Madagascar',
  titleMg: 'Harena Miafina Malagasy',
  description:
    "Explorez les arts vivants et patrimoines méconnus de la Grande Île : la stratégie du Fanorona, les arts martiaux du Moraingy et du Ringa, les rituels du Sambatra, les instruments traditionnels (Valiha, Marovany), la soie sauvage Landibe et l'art sculptural des Aloalo.",
  descriptionMg:
    "Fantaro ireo harena sy haikanto miavaka eto Madagasikara : ny tetikadin'ny Fanorona, ny haiady Moraingy sy Ringa, ny fetin'ny Sambatra, ireo zava-maneno nentim-paharazana, ny tenona Landibe ary ny sokitr'ireo Aloalo.",
  level: 'ADVANCED',
  icon: 'Trophy',
  color: '#C58B38',
  orderIndex: 6,
  estimatedMinutes: 85,
  lessons: [
    {
      slug: 'le-fanorona-strategie-royale-et-rituel-du-vela',
      title: 'Le Fanorona : Stratégie royale, cosmologie et rituel du Vela',
      titleMg: "Ny Fanorona : Tetikadin'ny Mpanjaka sy ny Lalàn'ny Vela",
      summary:
        "Découvrez les secrets géopolitiques du grand jeu d'échecs malgache, l'histoire d'Andriantompokoindrindra et l'origine de l'expression populaire « Tsy afa-bela ».",
      summaryMg:
        "Ianaro ny zava-miafin'ny Fanoron-tsivy, ny tantaran'Andriantompokoindrindra tamin-dRalambo ary ny niandohan'ny fitenenana hoe « Tsy afa-bela ».",
      type: 'TRADITION',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Bien plus qu'un simple passe-temps, le Fanorona (notamment le Fanoron-tsivy à 45 intersections) est un modèle cosmologique et stratégique au cœur de l'histoire royale malgache. Il simulait les mouvements d'armées et décidait des destins politiques.",
          textMg:
            "Tsy lalao fotsiny ny Fanorona (indrindra ny Fanoron-tsivy misy fihaonana 45), fa fandinihana ny tontolo sy tetikady teo amin'ny tantaran'ny fanjakana. Nampiasaina handaminana ady sy hanapahan-kevitra ara-panjakana izany.",
        },
        {
          type: 'concept',
          termMg: 'Fanoron-tsivy',
          phonetic: 'fa-nou-roun-tsi-vi',
          meaningFr:
            'Le grand jeu de Fanorona à 9 colonnes et 5 rangées (22 pions par joueur)',
          explanation:
            "Plateau quadrillé où chaque joueur dispose de 22 pions et s'affronte sur 45 intersections reliées par des lignes d'énergie.",
        },
        {
          type: 'concept',
          termMg: 'Laka / Foibe',
          phonetic: 'la-ka / fwi-be',
          meaningFr: "L'intersection centrale laissée vide au début du jeu",
          explanation:
            "Le point d'équilibre cosmique par lequel commence obligatoirement le premier déplacement de la partie.",
        },
        {
          type: 'concept',
          termMg: 'Fisikina sy Fisintona',
          phonetic: 'fi-si-ki-na si fi-sin-tou-na',
          meaningFr:
            'Prise par percussion (en avançant) et prise par aspiration (en reculant)',
          explanation:
            "Mécanique de capture unique au monde : on prend en marchant vers l'adversaire ou en s'éloignant de lui dans le même alignement.",
        },
        {
          type: 'concept',
          termMg: 'Vela',
          phonetic: 've-la',
          meaningFr: "Manche sacrée de rachat d'honneur accordée au perdant",
          explanation:
            "Partie de revanche où le vainqueur subit un handicap total (il ne peut rien capturer tant qu'il ne lui reste plus que 5 pions sur le plateau).",
        },
        {
          type: 'concept',
          termMg: 'Tsy afa-bela',
          phonetic: 'tsi a-fa-be-la',
          meaningFr:
            'Incapable de se libérer de sa défaite / Avoir une dette morale persistante',
          explanation:
            "Expression malgache courante issue directement du jeu : se dit de celui qui n'a pas réussi à effacer l'affront de sa défaite lors de la partie de Vela.",
        },
        {
          type: 'example',
          textMg:
            "Resy tamin'ny lalao voalohany izy, kanefa mbola tsy afa-bela tamin'ny lalao faharoa.",
          textFr:
            "Il a perdu la première manche, et n'a même pas réussi à se racheter (tsy afa-bela) lors de la manche de revanche.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Au XVIIe siècle, le roi Ralambo feignit d'agoniser pour tester ses fils. L'aîné, Andriantompokoindrindra à Ambohimalaza, était si captivé par une partie de Fanorona qu'il refusa d'interrompre son jeu avant la fin. Son frère cadet Andrianjaka accourut en premier et hérita du trône pour fonder Antananarivo !",
          textMg:
            "Tamin'ny taonjato faha-17, mody narary mafy ny mpanjaka Ralambo hizaha toetra ny zanany. Andriantompokoindrindra teo Ambohimalaza kosa variana tamin'ny Fanorona ka tsy nety niala raha tsy vita ny lalao. Andrianjaka zandriny no tonga voalohany ka nahazo ny fanjakana nanorina an'Antananarivo !",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Combien d'intersections comporte le plateau traditionnel du grand Fanoron-tsivy ?",
          questionMg:
            "Firy ny isan'ny fihaonan-dalana (teboka) eo amin'ny solaitran'ny Fanoron-tsivy ?",
          choices: [
            '45 intersections (9 colonnes sur 5 rangées)',
            '64 cases carrées comme aux échecs',
            '32 points uniquement en cercle',
            '100 cases comme au jeu de dames',
          ],
          correctIndex: 0,
          explanation:
            'Le Fanoron-tsivy est composé de 9 colonnes et 5 lignes horizontales, créant exactement 45 intersections de jeu.',
        },
        {
          type: 'quiz',
          question:
            "Qu'appelle-t-on le « Vela » dans la tradition du Fanorona ?",
          questionMg:
            "Inona no atao hoe « Vela » eo amin'ny fitsipi-dalao Fanorona ?",
          choices: [
            "Une manche de rattrapage d'honneur avec handicap sévère imposé au vainqueur",
            'Le moment où on jette le plateau de jeu',
            'Le nom donné au pion central',
            'Une interdiction définitive de rejouer',
          ],
          correctIndex: 0,
          explanation:
            "Le Vela permet au perdant de laver son honneur : le gagnant ne peut capturer aucun pion avant d'avoir lui-même été réduit à 5 pions.",
        },
        {
          type: 'quiz',
          question:
            "D'où provient la célèbre expression quotidienne malgache « Tsy afa-bela » ?",
          questionMg:
            "Avy aiza ny fiavian'ny fitenenana mahazatra hoe « Tsy afa-bela » ?",
          choices: [
            "De l'échec répété d'un joueur lors de la manche de rachat du Vela au Fanorona",
            "D'une dispute au marché aux zébus",
            "D'un proverbe sur la navigation en pirogue",
            "D'une ancienne monnaie en argent",
          ],
          correctIndex: 0,
          explanation:
            "Être 'tsy afa-bela' signifie originellement ne pas avoir réussi à remporter la manche de Vela pour effacer sa défaite précédente.",
        },
        {
          type: 'quiz',
          question:
            'Quels sont les deux modes originaux de capture des pions au Fanorona ?',
          questionMg:
            "Inona avy ireo fomba roa fakana ny vatonin'ny mpifanandrina amin'ny Fanorona ?",
          choices: [
            'Par percussion (Fisikina / en avançant) et par aspiration (Fisintona / en reculant)',
            'En sautant par-dessus comme aux dames',
            'En encerclant comme au jeu de Go',
            'En tirant au dé aléatoirement',
          ],
          correctIndex: 0,
          explanation:
            "Au Fanorona, on capture en marchant au contact frontal d'une ligne ennemie (fisikina) ou en se retirant en arrière (fisintona).",
        },
        {
          type: 'quiz',
          question:
            'Quel prince royal légendaire perdit la succession directe du trône pour avoir voulu terminer sa partie de Fanorona ?',
          questionMg:
            "Iza ilay andriandahy malaza taraiky teo amin'ny lalao Fanorona ka nahatonga ny zandriny handova ny fanjakana ?",
          choices: [
            "Andriantompokoindrindra (seigneur d'Ambohimalaza)",
            'Radama Ier',
            'Andrianampoinimerina',
            'Ralambo',
          ],
          correctIndex: 0,
          explanation:
            "Andriantompokoindrindra d'Ambohimalaza préféra finir sa partie de Fanorona, laissant son frère cadet Andrianjaka accéder au trône.",
        },
      ],
    },
    {
      slug: 'le-moraingy-et-ringa-art-martial-et-honneur',
      title:
        "Le Moraingy & le Ringa : L'éthique guerrière côtière et le respect du vaincu",
      titleMg:
        'Ny Moraingy sy ny Ringa : Haiady Nentim-paharazana sy Fihavanana',
      summary:
        "Plongez dans l'univers de la boxe traditionnelle côtière malgache, ses règles de chevalerie intransigeantes et la fraternité scellée après le combat.",
      summaryMg:
        "Fantaro ny haiady nentin-drazana amin'ny morontsiraka, ny lalàna tsy azo dikaina ary ny fihavanana mitsiry aorian'ny ady.",
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Pratiqué depuis des siècles sur les côtes de Madagascar (Sakalava, Antakarana, Betsimisaraka) et dans le Sud (le Ringa chez les Bara), le Moraingy est un art martial spectaculaire à mains nues qui canalise l'ardeur des jeunes dans un cadre d'honneur strict.",
          textMg:
            "Fanao hatramin'ny ela tany amin'ny morontsiraka (Sakalava, Antakarana, Betsimisaraka) sy tany Atsimo (ny Ringa an'ny Bara), ny Moraingy dia haiady mampientanentana mampiseho herin-tsandry nefa fehezin'ny fitsipi-panajana hentitra.",
        },
        {
          type: 'concept',
          termMg: 'Fagnorolahy',
          phonetic: 'fa-gnou-rou-la-hi',
          meaningFr: "Combattant d'honneur du Moraingy (homme)",
          explanation:
            "Athlète valeureux qui monte dans l'arène pour défendre le prestige et la fierté de son village ou de sa lignée.",
        },
        {
          type: 'concept',
          termMg: 'Salaka',
          phonetic: 'sa-la-ka',
          meaningFr: 'Le pagne traditionnel noué à la taille',
          explanation:
            "L'unique tenue d'étoffe portée par le combattant, symbole de sobriété, d'agilité et de respect de la coutume.",
        },
        {
          type: 'concept',
          termMg: 'Fady mamely ny efa lavo',
          phonetic: 'fa-di ma-me-li ni e-fa la-vou',
          meaningFr: 'Interdiction sacrée de frapper un adversaire à terre',
          explanation:
            "Règle d'or absolue du Moraingy : dès qu'un genou ou le corps touche le sol, tout assaut s'interrompt immédiatement sous peine d'infamie.",
        },
        {
          type: 'concept',
          termMg: 'Fihavanana an-kianja',
          phonetic: 'fi-ha-va-na-na an-kian-dza',
          meaningFr:
            'La réconciliation fraternelle immédiate à la fin du combat',
          explanation:
            "Quelle que soit l'issue ou la dureté des échanges, les combattants se serrent dans les bras et s'inclinent l'un devant l'autre.",
        },
        {
          type: 'example',
          textMg:
            'Niaraka nihomehy sy nifandray tanana ireo fagnorolahy rehefa vita ny ady moraingy.',
          textFr:
            'Les combattants ont ri ensemble et se sont serré la main avec respect dès la fin du combat de moraingy.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le Moraingy ne commence jamais sans musique ! Des batteries de tambours et des accords endiablés de Salegy électrisent l'atmosphère. Avant de se frapper, les combattants exécutent une danse de parade rituelle appelée « Mirehaka » pour tester le regard et le calme de leur rival.",
          textMg:
            "Tsy misy Moraingy raha tsy misy mozika ! Ny amponga sy ny gadona Salegy no mamelona ny kianja. Alohan'ny hifandonana, mandihy ny « Mirehaka » ny fagnorolahy hizahana toetra ny fahasahiana sy ny fahatonian'ny mpifanandrina.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Quelle est la règle d'honneur absolue et inviolable lors d'un combat de Moraingy ?",
          questionMg:
            'Inona no fady lehibe indrindra tsy azo dikaina mandritra ny ady Moraingy ?',
          choices: [
            'Il est formellement interdit de frapper un combattant qui est tombé au sol',
            'Il est interdit de regarder son adversaire dans les yeux',
            'Le combat doit obligatoirement durer plus de deux heures',
            'Les combattants doivent porter un casque métallique',
          ],
          correctIndex: 0,
          explanation:
            "Dès qu'un combattant est à terre, l'arbitre et le public imposent l'arrêt immédiat : frapper un homme à terre est un déshonneur suprême.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on traditionnellement les combattants masculins de Moraingy dans le Nord ?',
          questionMg:
            "Ahoana no fiantsoana ireo tovolahy mandray anjara amin'ny Moraingy any Avaratra ?",
          choices: ['Fagnorolahy', 'Mpikabary', 'Mpanandro', 'Ombiasy'],
          correctIndex: 0,
          explanation:
            "Les combattants s'appellent les 'Fagnorolahy' (et 'Fagnorovavy' pour les combattantes féminines).",
        },
        {
          type: 'quiz',
          question:
            'Quel genre musical populaire et énergique rythme traditionnellement les assauts de Moraingy ?',
          questionMg:
            'Inona no gadon-kira mampientanentana manetsika sy mandrindra ny ady Moraingy ?',
          choices: [
            'Le Salegy et les percussions traditionnelles',
            'La valse classique',
            'Le jazz doux et calme',
            'Le chant grégorien liturgique',
          ],
          correctIndex: 0,
          explanation:
            "Le Salegy côtier et les battements de tambours galvanisent les combattants et synchronisent l'intensité des rounds.",
        },
        {
          type: 'quiz',
          question:
            "Quel est l'équivalent du Moraingy pratiqué traditionnellement chez le peuple Bara du Sud ?",
          questionMg:
            "Inona no haiady nentim-paharazana mitovy amin'ny Moraingy fanaon'ny Bara any Atsimo ?",
          choices: ['Le Ringa', 'Le Fanorona', 'Le Kabary', 'Le Tsianjery'],
          correctIndex: 0,
          explanation:
            "Le 'Ringa' est la lutte traditionnelle d'agilité et de corps-à-corps emblématique du peuple Bara.",
        },
        {
          type: 'quiz',
          question:
            "Quelle attitude adoptent les combattants dès la fin officielle de l'affrontement ?",
          questionMg:
            'Ahoana no fihetsiky ny mpifanandrina raha vao tapitra ny fe-potoana iadiana ?',
          choices: [
            "Ils s'étreignent fraternellement et se saluent dans l'esprit du Fihavanana",
            'Le vainqueur poursuit le vaincu dans tout le village',
            'Ils refusent de se regarder pendant plusieurs années',
            'Ils doivent verser une rançon financière obligatoire',
          ],
          correctIndex: 0,
          explanation:
            "L'esprit de Fihavanana triomphe toujours : accolade immédiate, salutations réciproques et zéro animosité.",
        },
      ],
    },
    {
      slug: 'le-sambatra-fete-septennale-antambahoaka',
      title: 'Le Sambatra de Mananjary : La grande initiation septennale',
      titleMg: 'Ny Sambatra any Mananjary : Fety Lehibe Isaky ny Fito Taona',
      summary:
        "Plongez au cœur du rassemblement septennal des Antambahoaka : un mois de communion, rites des Tranobe et passage vers la plénitude de l'homme.",
      summaryMg:
        "Diniho ny fankalazana miavaka ataon'ny Antambahoaka isaky ny fito taona : firaisankina, fomban'ny Tranobe ary fanandratana ny maha lehilahy.",
      type: 'TRADITION',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Tous les 7 ans, la ville de Mananjary (sur la côte Sud-Est de Madagascar) devient le théâtre du Sambatra, l'un des rituels collectifs les plus saisissants de l'île. Durant un mois entier, le peuple Antambahoaka célèbre la circoncision de toute une génération de garçons.",
          textMg:
            "Isaky ny fito taona, ny tanànan'i Mananjary (morontsiraka Atsimo-Atsinanana) dia ivon'ny lanonana Sambatra miavaka indrindra eto Madagasikara. Mandritra ny iray volana maninjitra, ny vahoaka Antambahoaka dia miray hina mankalaza ny hasin'ireo zaza lahy.",
        },
        {
          type: 'concept',
          termMg: 'Sambatra',
          phonetic: 'sam-ba-tra',
          meaningFr: 'Bienheureux / Félicité suprême',
          explanation:
            "Nom donné à la fête qui confère aux jeunes garçons la plénitude de leur dignité et leur statut d'hommes accomplis au sein du clan.",
        },
        {
          type: 'concept',
          termMg: 'Tranobe',
          phonetic: 'tra-nou-be',
          meaningFr: 'La grande maison sacrée du clan royal',
          explanation:
            'Résidence des dignitaires coutumiers et temple des bénédictions ancestrales autour duquel gravitent les cortèges.',
        },
        {
          type: 'concept',
          termMg: 'Fito taona',
          phonetic: 'fi-tou tow-na',
          meaningFr: 'Le cycle sacré de sept ans',
          explanation:
            "Période rituelle incompressible : aucun garçon Antambahoaka n'est initié hors de cette fenêtre septennale collective.",
        },
        {
          type: 'concept',
          termMg: 'Vinany',
          phonetic: 'vi-na-ni',
          meaningFr: "L'embouchure sacrée du fleuve",
          explanation:
            "Lieu de convergence solennel où l'eau douce du fleuve Mananjary rejoint l'océan Indien, théâtre du bain rituel purificateur.",
        },
        {
          type: 'example',
          textMg:
            "Nirohotra nankany amin'ny Tranobe ny vahoaka Antambahoaka niaraka tamin'ireo zaza hotsofin-drano.",
          textFr:
            'Le peuple Antambahoaka a afflué vers le Tranobe avec les jeunes garçons appelés à recevoir la bénédiction sacrée.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Durant le Sambatra, les jeunes initiés portent des tuniques rouge vif brodées et de hauts bonnets coniques rouges rappelant la noblesse des origines. Les mères et tantes entonnent des chants polyphoniques ininterrompus et exécutent des rondes solennelles autour du Tranobe pour protéger les enfants.',
          textMg:
            "Mandritra ny Sambatra, miakanjo lamba mena midorehitra misy peta-kofehy sy satroka maranitra mena manambara ny firazanana ambony ireo ankizilahy. Mihira sy mandihy manodidina ny Tranobe andro aman'alina ireo renibe sy reny hiarovana ny zaza.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Tous les combien d'années est célébré le grand rituel du Sambatra chez les Antambahoaka de Mananjary ?",
          questionMg:
            'Isaky ny firy taona no anatanterahana ny fankalazana lehibe Sambatra any Mananjary ?',
          choices: [
            'Tous les 7 ans (Isaky ny fito taona)',
            'Tous les ans au mois de janvier',
            'Tous les 50 ans seulement',
            "Tous les 2 ans au solstice d'été",
          ],
          correctIndex: 0,
          explanation:
            'Le Sambatra obéit à un cycle septennal strict : il a lieu exactement tous les 7 ans et rassemble des milliers de familles.',
        },
        {
          type: 'quiz',
          question:
            'Quelle grande maison coutumière constitue le cœur spirituel des cérémonies du Sambatra ?',
          questionMg:
            "Inona ilay trano fomban-drazana masina ivon'ny fombafomba rehetra mandritra ny Sambatra ?",
          choices: [
            'Le Tranobe (la grande maison clanique)',
            'La mairie de la commune',
            'Le phare du port de mer',
            'Le marché couvert des pêcheurs',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Tranobe' est le centre névralgique où siègent les rois coutumiers (Mpanjaka) et où se font les prières.",
        },
        {
          type: 'quiz',
          question: 'Que signifie littéralement le mot malgache « Sambatra » ?',
          questionMg:
            "Inona no dikan'ny teny malagasy hoe « Sambatra » amin'ny fiteny andavanandro ?",
          choices: [
            'Bienheureux, comblé de joie et de félicité',
            'Rapide comme la foudre',
            'Secret et caché sous la terre',
            'Combattant invaincu',
          ],
          correctIndex: 0,
          explanation:
            "Le mot 'Sambatra' signifie heureux ou comblé de bénédictions, marquant la joie de toute la communauté.",
        },
        {
          type: 'quiz',
          question:
            'Où se rendent en procession les cortèges pour le bain rituel purificateur des initiés ?',
          questionMg:
            "Mankany amin'ny toerana manao ahoana ny filaharana be mba handroana ireo zaza amin'ny rano masina ?",
          choices: [
            "Au Vinany (l'embouchure où le fleuve rencontre l'océan)",
            'Dans une piscine municipale en ville',
            'Au sommet de la plus haute montagne',
            'Dans une grotte sans lumière',
          ],
          correctIndex: 0,
          explanation:
            "Le cortège gagne le 'Vinany' (l'embouchure) où la force de l'océan et la pureté de l'eau douce s'unissent pour bénir les enfants.",
        },
        {
          type: 'quiz',
          question:
            'Quelle couleur emblématique domine les vêtements traditionnels et bonnets coniques des jeunes initiés du Sambatra ?',
          questionMg:
            "Inona no loko mampiavaka ny akanjo sy ny satroka maranitra fitondran'ireo zaza am-pifaliana ?",
          choices: [
            'Le rouge vif (loko mena)',
            'Le noir sombre',
            'Le vert fluo',
            'Le violet violette',
          ],
          correctIndex: 0,
          explanation:
            "Les initiés portent le rouge royal (mena), couleur ancestrale de l'autorité, du feu vital et de la bravoure.",
        },
      ],
    },
    {
      slug: 'les-instruments-de-musique-valiha-et-marovany',
      title:
        "Les instruments traditionnels : l'âme de la Valiha et du Marovany",
      titleMg: 'Ireo Zava-maneno Nentin-drazana : ny Valiha sy ny Marovany',
      summary:
        'Découvrez les instruments emblématiques malgaches : la cithare tubulaire en bambou Valiha, le Marovany côtier et la flûte Sodina.',
      summaryMg:
        "Fantaro ireo zava-maneno mampiavaka an'i Madagasikara : ny Valiha volotsangana, ny Marovany sy ny Sodina kanto.",
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "La musique traditionnelle malgache est un pont mystique entre le cœur des vivants et le monde des ancêtres. Parmi sa prestigieuse lutherie, la **Valiha** (cithare tubulaire en bambou d'origine austronésienne) s'impose comme l'emblème musical national. Sur les côtes, le **Marovany** (cithare sur caisse en bois) résonne lors des cérémonies de Tromba, tandis que la **Sodina** (flûte en bambou pastoral) et le **Lokanga** (violon à trois cordes des pasteurs Bara) font vibrer les vallées et les grands plateaux.",
          textMg:
            "Ny mozika nentim-paharazana malagasy dia tetezana mampifandray ny velona sy ny Razana. Ny **Valiha** (zava-maneno vita amin'ny volotsangana) no zava-maneno sarobidy indrindra manerana ny Nosy. Any amin'ny morontsiraka, ny **Marovany** no manaitra ny Tromba amin'ny feony lalina, raha ny **Sodina** sy ny **Lokanga** kosa no manome aina ny tontolo ambanivohitra sy ny fiandrasana omby.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VALIHA',
          phonetic: 'va-li-ha',
          frenchEquivalent:
            'Se prononce doucement avec le « H » expiré léger (ex: Valiha, Marovany, Sodina).',
          sampleWordMg: 'Valiha',
          sampleTranslationFr:
            'Cithare tubulaire en bambou (instrument national)',
        },
        {
          type: 'concept',
          termMg: 'Valiha',
          phonetic: 'va-li-ha',
          meaningFr: "L'instrument emblématique de Madagascar en bambou sacré",
          explanation:
            'Cithare tubulaire taillée dans une variété spécifique de bambou (Volotsangana), équipée de cordes tendues sur de petits chevalets en bois mobiles.',
        },
        {
          type: 'concept',
          termMg: 'Marovany',
          phonetic: 'ma-rou-va-ni',
          meaningFr:
            '« La boîte aux multiples voix » (cithare sur caisse côtière)',
          explanation:
            'Instrument rectangulaire en bois muni de cordes sur deux faces opposées, incontournable pour invoquer les esprits royaux lors des cérémonies de possession Tromba.',
        },
        {
          type: 'concept',
          termMg: 'Sodina',
          phonetic: 'sou-di-na',
          meaningFr: 'La flûte droite traditionnelle en bambou ou roseau',
          explanation:
            'Flûte pastorale à six trous, immortalisée à travers le monde par le virtuose Rakoto Frah et essentielle dans le Hira Gasy.',
        },
        {
          type: 'concept',
          termMg: 'Lokanga Bara',
          phonetic: 'lou-kan-ga ba-ra',
          meaningFr: 'Le violon rustique à trois cordes des pasteurs du Sud',
          explanation:
            "Instrument à archet sculpté dans du bois dur et garni d'une table d'harmonie en peau de zébu, accompagnant les récits poétiques des gardiens de troupeaux.",
        },
        {
          type: 'example',
          textMg:
            "Nanakoako eran'ny vohitra ny feo mangan'ny valiha nampandry saina ny mpiara-monina.",
          textFr:
            'Le son cristallin et mélodieux de la valiha a résonné à travers le village, apaisant les cœurs de la communauté.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "À l'origine, les cordes de la Valiha étaient découpées directement dans l'écorce fibreuse du bambou lui-même, soulevées par des éclats de bois servant de chevalets. Au XXe siècle, les luthiers malgaches ont révolutionné la sonorité de l'instrument en utilisant des brins effilés de câbles de frein de bicyclette !",
          textMg:
            "Tany am-boalohany, ny kofehin'ny Valiha dia ny hodi-bolotsangana ihany no nofisahana sy natsangana tamin'ny hazo kely. Taty aoriana vao nampiasa tariby vy manify ny mpanao valiha ka vao mainka nanjary manga sy maneno lavitra ny feony.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Quel instrument à cordes en bambou tubulaire est l'emblème musical national de Madagascar ?",
          questionMg:
            "Inona ilay zava-maneno vita amin'ny volotsangana heverina ho marika lehibe malagasy ?",
          choices: [
            'La Valiha',
            'Le piano à queue',
            'La guitare électrique',
            "L'accordéon moderne",
          ],
          correctIndex: 0,
          explanation:
            "La Valiha est l'instrument traditionnel national par excellence, symbole de pureté et d'harmonie sonore.",
        },
        {
          type: 'quiz',
          question:
            'Quel instrument en caisse de résonance en bois est indispensable aux rituels de Tromba sur les côtes ?',
          questionMg:
            "Inona ilay zava-maneno efajoro hazo fampiasa matetika amin'ny fombafomba Tromba morontsiraka ?",
          choices: [
            'Le Marovany',
            'Le violoncelle classique',
            'La trompette en cuivre',
            'La batterie moderne',
          ],
          correctIndex: 0,
          explanation:
            'Le Marovany, avec ses cordes montées sur deux faces, produit une onde sonore vibrante qui induit la transe spirituelle du Tromba.',
        },
        {
          type: 'quiz',
          question:
            'Quel maître flûtiste malgache légendaire a fait connaître la Sodina dans le monde entier ?',
          questionMg:
            'Iza ilay mpitsoka sodina kalaza eran-tany nampisandratra ny kolontsaina malagasy ?',
          choices: [
            'Rakoto Frah',
            'Jean Laborde',
            'Andrianampoinimerina',
            'Radama Ier',
          ],
          correctIndex: 0,
          explanation:
            "Rakoto Frah (1923-2001) est le maître mondialement célébré de la Sodina, dont l'effigie orna même les billets de banque malgaches.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le violon rustique à trois cordes caractéristique des pasteurs Bara du Grand Sud ?',
          questionMg:
            "Inona no iantsoana ilay zava-maneno misy tadiny telo fitendrin'ny mpiompy Bara any Atsimo ?",
          choices: ['Le Lokanga', 'Ny Valiha', 'Ny Sodina', 'Ny Kabosy'],
          correctIndex: 0,
          explanation:
            'Le Lokanga (ou Lokanga Bara) est un violon traditionnel à manche courbe et table en peau de zébu rythmant les récits du Sud.',
        },
        {
          type: 'quiz',
          question:
            'Quelle fonction sacrée la musique traditionnelle remplit-elle auprès des ancêtres et de la communauté ?',
          questionMg:
            "Inona ny anjara asa masina sahanin'ny mozika nentim-paharazana eo amin'ny fiaraha-monina ?",
          choices: [
            'Établir la communion avec les ancêtres, apaiser les esprits et resserrer le Fihavanana',
            'Remplacer les lois du tribunal civil',
            "Interdire aux jeunes d'exprimer leurs émotions",
            'Obliger les villageois à garder le silence',
          ],
          correctIndex: 0,
          explanation:
            'La musique malgache est un vecteur de bénédiction (hasina), de mémoire communautaire et de médiation avec les Razana.',
        },
      ],
    },
    {
      slug: 'l-art-du-tissage-du-lamba-arindrano-et-soie-sauvage-landibe',
      title:
        "L'art textile sacré : le Lamba Arindrano et la soie sauvage Landibe",
      titleMg: 'Ny Tenona sy ny Landibe : Lamba Arindrano sy Akotofahana',
      summary:
        'Explorez les secrets du tissage traditionnel : la récolte de la soie sauvage Landibe, le prestigieux Lamba Arindrano et les teintures végétales.',
      summaryMg:
        "Fantaro ny kanton'ny tenona malagasy : ny fambolena sy fiotazana ny Landibe, ny Lamba Arindrano ary ny Akotofahana.",
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la culture malgache, le tissu est bien plus qu'un vêtement : c'est une parure de dignité pour les vivants et le suaire d'éternité pour les ancêtres. L'art du tissage manuel (**Tenona**) atteint des sommets de perfection avec le **Landibe** (la soie sauvage endémique issue des chenilles des forêts de Tapia). Des étoffes légendaires comme le **Lamba Arindrano** (aux rayures sobres royales) et le **Lamba Akotofahana** (aux motifs géométriques en relief) témoignent du raffinement d'un savoir-faire séculaire transmis de mère en fille.",
          textMg:
            "Eo amin'ny fomba amam-panao malagasy, ny lamba dia fitafiana mendrika ho an'ny velona ary fono masina ho an'ny Razana mandrakizay. Ny **Tenona** malagasy dia manana laza lehibe amin'ny alalan'ny **Landibe** (landy avy amin'ny ala tapia). Ny **Lamba Arindrano** manana tsipika milamina sy ny **Lamba Akotofahana** misy soratra marevaka no porofon'ny fahaiza-manao nentim-paharazana nampitaina tamin'ny taranaka fara mandimby.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'LANDIBE',
          phonetic: 'lan-di-be',
          frenchEquivalent:
            'Prononcez distinctement « Lan-di-bé » (soie sauvage noble des hautes terres).',
          sampleWordMg: 'Landibe',
          sampleTranslationFr: 'Soie sauvage endémique de Madagascar',
        },
        {
          type: 'concept',
          termMg: 'Landibe (Borocera madagascariensis)',
          phonetic: 'lan-di-be',
          meaningFr: 'Le ver à soie sauvage des forêts de tapia',
          explanation:
            "Chenille endémique qui tisse de solides cocons dorés dans les forêts de tapia (notamment dans l'Itasy et l'Amoron'i Mania), matière première de la soie ancestrale.",
        },
        {
          type: 'concept',
          termMg: 'Lamba Arindrano',
          phonetic: 'lam-ba a-rin-dra-nou',
          meaningFr: "L'étoffe noble aux rayures géométriques noires et écrues",
          explanation:
            'Lamba de haute dignité traditionnellement porté par les souverains, les aînés et les juges coutumiers lors des grands discours officiels.',
        },
        {
          type: 'concept',
          termMg: 'Lamba Akotofahana',
          phonetic: 'lam-ba a-kou-tou-fa-ha-na',
          meaningFr:
            "L'étoffe de prestige aux motifs brodés et jacquards en relief",
          explanation:
            "Chef-d'œuvre de patience et de créativité, réservé jadis aux membres de la royauté pour les noces et les cérémonies d'apparat.",
        },
        {
          type: 'concept',
          termMg: 'Tapia (Uapaca bojeri)',
          phonetic: 'ta-pi-a',
          meaningFr:
            "L'arbre protecteur des forêts de l'Imerina et du Betsileo",
          explanation:
            "Arbre résistant aux feux dont les feuilles nourrissent les chenilles de soie sauvage et dont l'écorce fournit des pigments de teinture naturelle.",
        },
        {
          type: 'example',
          textMg:
            'Nisikina Lamba Arindrano ny raiamandreny raha nitsangana nanao kabary fampihavanana.',
          textFr:
            "Le patriarche s'est drapé dans son somptueux Lamba Arindrano avant de se lever pour prononcer le discours de réconciliation.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les teintures du lamba traditionnel étaient exclusivement végétales et minérales : le jaune éclatant provenait du curcuma (*Tamotamo*), le brun profond de l'argile ferrugineuse des rizières (*Tany mena*), et les nuances d'ocre de décoctions d'écorces d'arbres endémiques bouillies pendant plusieurs jours.",
          textMg:
            'Tsy nisy loko simika ny tenona malagasy fahiny : ny tamotamo no nanome ny loko mavo manganofy, ny fotaka an-tanimbary no nahazoana ny volontany matroka, ary ny hodi-kazo nandrahoina no niteraka ireo loko volom-parasy sy mena mangamanga.',
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "D'où provient traditionnellement la soie sauvage noble « Landibe » à Madagascar ?",
          questionMg:
            'Avy aiza ny landy nentim-paharazana antsoina hoe « Landibe » eto Madagasikara ?',
          choices: [
            'Des cocons de chenilles sauvages vivant dans les forêts de tapia',
            "De fibres synthétiques d'usines modernes",
            "De la laine de moutons importés d'Europe",
            'De feuilles de bananier séchées',
          ],
          correctIndex: 0,
          explanation:
            'Le Landibe provient de chenilles endémiques (Borocera madagascariensis) qui se développent sur les arbres Tapia des Hautes Terres.',
        },
        {
          type: 'quiz',
          question:
            "Quel lamba d'apparat prestigieux se caractérise par des bandes et rayures sobres et soignées ?",
          questionMg:
            "Inona ilay lamba malaza manana tsipika milamina fanaon'ny raiamandreny sy ny manan-kaja ?",
          choices: [
            'Le Lamba Arindrano',
            'Un simple tablier de cuisine',
            'Une serviette de bain',
            'Un tissu de rideau imprimé',
          ],
          correctIndex: 0,
          explanation:
            "Le Lamba Arindrano est l'étoffe de noblesse et de dignité par excellence, arborée lors des grands Kabary solennels.",
        },
        {
          type: 'quiz',
          question:
            'Quel lamba réputé pour sa complexité comporte des motifs géométriques et floraux en relief ?',
          questionMg:
            "Inona ilay lamba be haingon-tsoratra sy sarobidy indrindra amin'ny tenona malagasy ?",
          choices: [
            'Le Lamba Akotofahana',
            'Le lamba tantsaha tsotra',
            'Ny salaka',
            'Ny lamba lany fotsy',
          ],
          correctIndex: 0,
          explanation:
            'Le Lamba Akotofahana est le joyau textile malgache, orné de motifs en relief tissés avec une minutie exceptionnelle.',
        },
        {
          type: 'quiz',
          question:
            'Quel arbre endémique résistant au feu héberge et nourrit les vers à soie Landibe ?',
          questionMg:
            'Inona ilay hazo fihinam-boa maniry an-tanety mamelona ny bibin-dandy Landibe ?',
          choices: ['Le Tapia', 'Le Baobab', 'Le Cocotier', "L'Eucalyptus"],
          correctIndex: 0,
          explanation:
            'Le Tapia (Uapaca bojeri) forme des forêts claires endémiques essentielles à la survie du ver à soie sauvage Landibe.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le tissu en soie de Landibe est-il au centre de la cérémonie du Famadihana ?',
          questionMg:
            'Nahoana ny lamba landy no zava-dehibe indrindra mandritra ny famadihana ?',
          choices: [
            "Parce qu'il enveloppe les dépouilles des ancêtres pour honorer leur mémoire éternelle dans le tombeau",
            "Parce qu'il sert de drapeau pour indiquer le chemin",
            "Parce qu'il protège de la pluie pendant la fête",
            "Parce qu'il doit être brûlé à la fin du rituel",
          ],
          correctIndex: 0,
          explanation:
            "Envelopper les ossements des Razana dans un lamba de soie Landibe neuf est le devoir d'amour et de piété filiale suprême.",
        },
      ],
    },
    {
      slug: 'l-art-sculptural-des-aloalo-et-totems-funeraires',
      title:
        "L'art sculptural des Aloalo : totems et mémoire éternelle du Grand Sud",
      titleMg: "Ny Haikanto amin'ny Aloalo sy ny Valavato Mahafaly",
      summary:
        'Découvrez le génie sculptural des Mahafaly et Antandroy : les totems de bois sculpté Aloalo et les tombeaux Valavato.',
      summaryMg:
        "Fantaro ny kanton'ny sokitra Aloalo any amin'ny faritra Mahafaly sy Antandroy : tsangambato miresaka amin'ny lanitra.",
      type: 'CULTURE',
      orderIndex: 6,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au cœur des paysages arides du Sud-Ouest malgache, sur les territoires des peuples **Mahafaly** et **Antandroy**, s'élève l'une des formes d'art funéraire les plus impressionnantes au monde : les **Aloalo**. Ces monumentaux poteaux de bois sculpté en ajours géométriques, plantés sur les tombeaux en pierres sèches (**Valavato**), constituent de véritables livres ouverts relatant la destinée du défunt et établissant une liaison mystique entre la terre des mortels et le domaine céleste des ancêtres immortels.",
          textMg:
            "Any amin'ny faritra Atsimo Andrefana, eo amin'ny tanin'ny **Mahafaly** sy ny **Antandroy**, dia ahitana haikanto sokitra hazo manaitra indrindra : ny **Aloalo**. Ireo tsangambato hazo voasokitra am-pahaizana avo lenta ireo, natsangana teo ambonin'ny fasana vato (**Valavato**), dia mampahatsiaro ny fiainan'ilay lasa ary manandratra ny fanahiny ho eny amin'ny tontolon'ny Razana mandrakizay.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'ALOALO',
          phonetic: 'a-lou-a-lou',
          frenchEquivalent:
            'Vient du verbe « Mialo » (faire écran, protéger, faire le lien entre deux mondes).',
          sampleWordMg: 'Aloalo',
          sampleTranslationFr: 'Poteau funéraire sculpté en bois ajouré du Sud',
        },
        {
          type: 'concept',
          termMg: 'Aloalo',
          phonetic: 'a-lou-a-lou',
          meaningFr: 'Poteau totémique funéraire en bois sculpté',
          explanation:
            "Sculpture verticale de 1,5 à 2 mètres comportant des motifs géométriques abstraits successifs surmontés d'une scène narrative figurative.",
        },
        {
          type: 'concept',
          termMg: 'Valavato (Fasana Mahafaly)',
          phonetic: 'va-la-va-tou',
          meaningFr: 'Le tombeau monumental carré en pierres sèches taillées',
          explanation:
            'Édifice funéraire imposant sur lequel sont disposés les crânes de zébus sacrificiels (*Tinoka*) et les poteaux Aloalo honorant le défunt.',
        },
        {
          type: 'concept',
          termMg: 'Hazomalany sy Mendorave',
          phonetic: 'ha-zou-ma-la-ni si men-dou-ra-ve',
          meaningFr: 'Bois nobles et imputrescibles utilisés pour la sculpture',
          explanation:
            "Essences d'arbres sacrées de la forêt sèche du Sud, capables de résister des siècles au soleil ardent, au vent et aux termites.",
        },
        {
          type: 'concept',
          termMg: 'Mialo',
          phonetic: 'mi-a-lou',
          meaningFr:
            "Intercéder, servir d'intermédiaire spirituel et de protection",
          explanation:
            'Sens étymologique du mot Aloalo : le poteau fait office de messager permanent entre le monde terrestre et le monde invisible.',
        },
        {
          type: 'example',
          textMg:
            "Ny Aloalo tsara sokitra teo ambonin'ny valavato dia mampiseho ny voninahitr'ilay raiamandreny nodimandry.",
          textFr:
            "L'Aloalo finement sculpté surmontant le tombeau en pierre témoigne de la grandeur et du prestige de l'ancien disparu.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le sommet de l'Aloalo comporte toujours une figurine figurative emblématique : autrefois un zébu royal ou un cavalier armé d'une lance ; de nos jours, les sculpteurs mahafaly y intègrent avec humour et réalisme un avion, une moto ou un taxi-brousse, symbolisant le dernier voyage triomphal du défunt vers l'au-delà !",
          textMg:
            "Ny tendron'ny Aloalo dia ahitana sarin'omby na lehilahy mitaingina soavaly hatramin'izay. Amin'izao fotoana izao, ny mpanao sokitra dia manasokitra fiarakodia na fiaramanidina mihitsy aza, maneho ny dia farany mankany amin'ny Razana amin'ny fomba manara-penitra.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Qu'est-ce qu'un « Aloalo » dans l'art et les traditions du Grand Sud malgache ?",
          questionMg:
            "Inona moa ny atao hoe « Aloalo » amin'ny kolontsaina any Atsimo ?",
          choices: [
            'Un poteau funéraire sculpté en bois ajouré surmontant les tombeaux',
            'Un instrument de percussion en bronze',
            'Un type de pirogue de mer',
            'Une coiffure de fête pour les jeunes filles',
          ],
          correctIndex: 0,
          explanation:
            "L'Aloalo est le poteau funéraire totémique en bois sculpté, signature artistique majeure des Mahafaly et Antandroy.",
        },
        {
          type: 'quiz',
          question:
            'Quels peuples de Madagascar sont historiquement renommés pour la sculpture des Aloalo ?',
          questionMg:
            "Iza ireo foko malaza indrindra amin'ny fanaovana ny sokitra Aloalo ?",
          choices: [
            'Les Mahafaly et les Antandroy',
            'Les Merina et les Betsileo uniquement',
            'Les Bezanozano',
            'Les Antakarana',
          ],
          correctIndex: 0,
          explanation:
            "Les sculpteurs Mahafaly et Antandroy ont élevé l'art de l'Aloalo au rang de chef-d'œuvre du patrimoine mondial.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on les grands tombeaux monumentaux en pierres sèches sur lesquels sont érigés les Aloalo ?',
          questionMg:
            'Ahoana no iantsoana ireo fasana vato lehibe any Atsimo ametrahana ny Aloalo ?',
          choices: ['Le Valavato', 'Ny Tranovola', 'Ny Rova', 'Ny Kianja'],
          correctIndex: 0,
          explanation:
            'Le « Valavato » est le grand tombeau rectangulaire en dalles de pierre taillées, fierté et sanctuaire des familles du Sud.',
        },
        {
          type: 'quiz',
          question:
            "Quel type d'essences de bois est rigoureusement sélectionné pour sculpter les Aloalo ?",
          questionMg:
            'Karazan-kazo manao ahoana no fidina hanaovana ny Aloalo ?',
          choices: [
            'Des bois nobles, denses et imputrescibles résistant aux siècles (comme le Hazomalany)',
            'Du bois de balsa très fragile',
            'Des branches de sapin fraîches',
            'Du carton recyclé',
          ],
          correctIndex: 0,
          explanation:
            'Des bois exceptionnellement denses et imputrescibles (Hazomalany, Mendorave) sont requis pour défier les intempéries du désert.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle spirituel et symbolique profond du poteau Aloalo ?',
          questionMg:
            "Inona no hevitra ara-panahy lalina fonosin'ny Aloalo eo ambonin'ny fasana ?",
          choices: [
            'Faire le lien mystique (Mialo) entre la terre des vivants et le royaume céleste des ancêtres',
            "Servir d'épouvantail pour chasser les oiseaux migrateurs",
            'Indiquer la direction des vents marins',
            'Servir de balance pour peser les récoltes',
          ],
          correctIndex: 0,
          explanation:
            "L'Aloalo intercède (mialo) et relie le monde temporel des vivants à l'éternité bienheureuse des ancêtres Razana.",
        },
      ],
    },
    // ─── LEÇON 7 : LE PAPIER ANTEMORO & LES MANUSCRITS SORABE ───
    {
      slug: 'le-papier-antemoro-et-les-sorabe',
      title: 'Le Papier Antemoro et les manuscrits sacrés Sorabe',
      titleMg: 'Ny Taratasy Antemoro sy ireo Sorabe Masina',
      summary:
        "Découvrez l'art séculaire de la confection du papier végétal à partir de l'écorce d'Avoha et les mystérieux manuscrits arabo-malgaches Sorabe.",
      summaryMg:
        "Fantaro ny fahaizana nentin-drazana manamboatra taratasy avy amin'ny hazo Avoha sy ireo soratra tranainy Sorabe.",
      type: 'LITERATURE',
      orderIndex: 7,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Sur la côte sud-est de Madagascar, dans la région du Matitana, le peuple Antemoro perpétue depuis le XIVe siècle l'art fascinant de la fabrication du papier végétal. Obtenu à partir de l'écorce bouillie du mûrier sauvage (Avoha), ce papier résistant incrusté de fleurs fraîches servait de support aux 'Sorabe' (les grandes écritures), textes sacrés consignant l'astrologie, la pharmacopée et l'histoire des souverains.",
          textMg:
            "Any amin'ny faritra Atsimo Atsinanana, ny foko Antemoro dia efa hatramin'ny taonjato faha-14 no mahay manamboatra ny Taratasy Antemoro avy amin'ny hodi-kazo Avoha. Tamin'io taratasy mateza io no nanoratana ny Sorabe mirakitra ny tantara, ny fanandroana ary ny fanafody nentin-drazana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VO / HA',
          phonetic: 'a-vou-ha',
          frenchEquivalent:
            "Le nom de l'arbre « Avoha » s'articule doucement avec un 'H' légèrement aspiré et doux.",
          sampleWordMg: 'Avoha',
          sampleTranslationFr: 'Mûrier sauvage à papier (ficus / bosqueia)',
        },
        {
          type: 'concept',
          termMg: 'Taratasy Antemoro',
          phonetic: 'ta-ra-ta-si an-te-mou-rou',
          meaningFr: 'Le papier artisanal d’écorce d’Avoha incrusté de pétales',
          explanation:
            'Fabriqué artisanalement par martelage de fibres végétales cuites, séché au soleil sur des toiles de coton tendues, et parsemé de fleurs naturelles décoratives.',
        },
        {
          type: 'concept',
          termMg: 'Sorabe (Soratra Be)',
          phonetic: 'sou-ra-be',
          meaningFr: 'Les grandes écritures arabo-malgaches ancestrales',
          explanation:
            "Système d'écriture manuscrit transcrivant la langue malgache à l'aide de l'alphabet arabe adapté, conservé jalousement par les scribes érudits (Katibo).",
        },
        {
          type: 'concept',
          termMg: 'Katibo sy Anakara',
          phonetic: 'ka-ti-bou si a-na-ka-ra',
          meaningFr:
            'Les maîtres scribes et la lignée sacerdotale gardienne du savoir',
          explanation:
            "Érudits initiés à la lecture, à la copie et à l'interprétation astrologique des manuscrits Sorabe, conseillers spirituels des grands rois malgaches.",
        },
        {
          type: 'example',
          textMg:
            "Ny Sorabe sy ny Taratasy Antemoro dia vavolombelona manaporofo fa efa nanana soratra sy haisoratra mirakitra ny fahendrena ny Malagasy talohan'ny fanjanahantany.",
          textFr:
            'Les Sorabe et le Papier Antemoro sont la preuve vivante que Madagascar possédait une écriture et une littérature savante bien avant la colonisation.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le roi Andrianampoinimerina fit appel aux savants Katibo Antemoro à la cour d'Ambohimanga pour instruire son fils Radama Ier à la lecture et à l'écriture, reconnaissant leur haute valeur intellectuelle.",
          textMg:
            'Niantso ombiasy sy Katibo Antemoro tany Ambohimanga Andrianampoinimerina mba hampianatra an-dRadama Zanany hamaky teny sy hanoratra ny Sorabe.',
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'À partir de quelle plante sauvage fabrique-t-on traditionnellement le Papier Antemoro ?',
          questionMg:
            'Avy amin’ny hoditr’inona no anamboarana ny Taratasy Antemoro ?',
          choices: [
            'L’écorce du mûrier sauvage appelé « Avoha »',
            'Les feuilles de bananier séchées',
            'La tige du bambou écrasée',
            'Le bois de santal',
          ],
          correctIndex: 0,
          explanation:
            "C'est l'écorce interne de l'Avoha bouillie et battue avec patience qui produit la pâte soyeuse du véritable Papier Antemoro.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne le terme historique « Sorabe » dans la culture malgache ?',
          questionMg:
            'Inona ny atao hoe « Sorabe » eo amin’ny tantara sy ny kolontsaina malagasy ?',
          choices: [
            'Les manuscrits historiques et sacrés rédigés en langue malgache avec des caractères arabo-malgaches',
            'Une fête de moisson du riz',
            'Un instrument de musique à cordes',
            'Un duel entre deux guerriers',
          ],
          correctIndex: 0,
          explanation:
            "Les Sorabe ('grandes écritures') sont les premiers textes écrits de Madagascar, transcrivant la langue malgache en caractères arabes adaptés.",
        },
        {
          type: 'quiz',
          question:
            'Qui étaient les « Katibo » au sein de la société Antemoro ?',
          questionMg:
            'Iza ireo atao hoe « Katibo » teo amin’ny fiarahamonina Antemoro ?',
          choices: [
            'Les scribes érudits et devins gardiens des manuscrits et de l’astrologie',
            'Les forgerons royaux',
            'Les capitaines des pirogues de pêche',
            'Les chanteurs du village',
          ],
          correctIndex: 0,
          explanation:
            "Les Katibo étaient les lettrés initiés, seuls dépositaires de l'écriture des Sorabe et des secrets médicinaux ancestraux.",
        },
        {
          type: 'quiz',
          question:
            'Quel grand souverain malgache fit venir les savants Katibo pour instruire son héritier à Ambohimanga ?',
          questionMg:
            'Iza ilay Mpanjaka nampaka Katibo Antemoro hampianatra ny zanany tao Ambohimanga ?',
          choices: [
            'Andrianampoinimerina (pour éduquer Radama Ier)',
            'Andrianjaka',
            'Radama II',
            'Ralambo',
          ],
          correctIndex: 0,
          explanation:
            "Andrianampoinimerina confia aux Katibo Antemoro l'éducation intellectuelle de son fils Radama Ier, futur modernisateur du royaume.",
        },
        {
          type: 'quiz',
          question:
            'Comment orne-t-on traditionnellement chaque feuille de Papier Antemoro lors de son séchage au soleil ?',
          questionMg:
            'Ahoana no handravahana ny Taratasy Antemoro eo am-panamainana azy amin’ny masoandro ?',
          choices: [
            'En y incrustant délicatement des pétales de fleurs et feuilles fraîches naturelles',
            'En y peignant des portraits à l’huile',
            'En y versant du sable coloré',
            'En y gravant au fer chaud',
          ],
          correctIndex: 0,
          explanation:
            'Des pétales de bougainvilliers, de pervenches ou de fougères sont délicatement disposés à la main sur la pâte humide avant son séchage naturel au soleil.',
        },
      ],
    },
    // ─── LEÇON 8 : L'ART DU BOIS ZAFIMANIRY (UNESCO) ───
    {
      slug: 'l-art-du-bois-zafimaniry-unesco',
      title:
        "L'art du bois Zafimaniry : architecture sacrée et géométrie sculptée",
      titleMg:
        "Ny Fahaizan'ny Zafimaniry amin'ny Hazo : rafitra masina sy sokitra",
      summary:
        "Explorez le savoir-faire sculptural unique du peuple Zafimaniry, inscrit au patrimoine mondial de l'UNESCO pour ses maisons en bois assemblées sans clou.",
      summaryMg:
        "Diniho ny fahaiza-manao miavaka an'ny Zafimaniry amin'ny hazo, voasoratra ao amin'ny UNESCO noho ireo trano voasokitra tsy misy fantsika vy.",
      type: 'CULTURE',
      orderIndex: 8,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Nichés dans les brumes des montagnes forestières du Sud-Betsileo, les Zafimaniry sont les maîtres incontestés du travail du bois à Madagascar. Leurs maisons traditionnelles, volets, coffres et mortiers sont taillés et sculptés dans des bois précieux (hintsy, tambitshy) et assemblés par des tenons et mortaises sans aucun clou métallique. Cet artisanat d'une géométrie spirituelle fascinante est proclamé chef-d'œuvre du patrimoine oral et immatériel de l'humanité par l'UNESCO.",
          textMg:
            "Monina any amin'ny ala tendrombohitry ny faritra Betsileo ny foko Zafimaniry, tompon-daka amin'ny fikarakarana hazo. Ny tranony, ny varavarany ary ny fitaovany rehetra dia voasokitra amin'ny hazo sarobidy ary mifampiditra amin'ny alalan'ny tsimatimanota tsy mampiasa fantsika vy na iray aza.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'ZAFY / MA',
          phonetic: 'za-fi-ma-ni-ri',
          frenchEquivalent:
            "Le nom « Zafimaniry » signifie 'les petits-enfants de ceux qui désirent la forêt / les disciples de la nature'.",
          sampleWordMg: 'Sokitra',
          sampleTranslationFr: 'Sculpture sur bois / Gravure d’art',
        },
        {
          type: 'concept',
          termMg: 'Trano Zafimaniry tsy misy fantsika',
          phonetic: 'tra-nou za-fi-ma-ni-ri tsi mi-si fan-tsi-ka',
          meaningFr:
            'La maison traditionnelle assemblée à tenons et mortaises sans clou',
          explanation:
            "Chef-d'œuvre d'ingénierie vernaculaire : chaque poutre et planche s'emboîte avec une précision millimétrique, permettant à la maison de résister aux siècles et d'être démontée puis remontée ailleurs.",
        },
        {
          type: 'concept',
          termMg: 'Tanakondro sy Sakoririka',
          phonetic: 'ta-na-koun-drou si sa-kou-ri-ri-ka',
          meaningFr: 'Motifs géométriques sculptés en rosaces et spirales',
          explanation:
            "Symboles sacrés gravés sur les portes et volets représentant la toile d'araignée de la vie, la fidélité conjugale et la protection contre les mauvais esprits.",
        },
        {
          type: 'concept',
          termMg: 'Hazo sarobidy (Hintsy, Varongy, Nanto)',
          phonetic: 'ha-zou sa-rou-bi-di',
          meaningFr:
            'Les essences de bois précieux de la forêt primaire humide',
          explanation:
            "Les artisans Zafimaniry ne coupent les arbres qu'avec respect et prière aux esprits de la forêt, choisissant des essences imputrescibles capables de traverser les générations.",
        },
        {
          type: 'example',
          textMg:
            "Ny sokitra Zafimaniry dia firesahana amin'ny natiora sy fanehoana ny faharetan'ny fanahy malagasy amin'ny alalan'ny hazo masina.",
          textFr:
            "La sculpture Zafimaniry est un dialogue avec la nature et l'expression de la persévérance de l'esprit malgache à travers le bois sacré.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "En 2003, l'UNESCO a inscrit le savoir-faire du travail du bois des Zafimaniry sur la liste représentative du patrimoine culturel immatériel de l'humanité, saluant une harmonie écologique et esthétique absolue.",
          textMg:
            "Tamin'ny taona 2003, nambaran'ny UNESCO ho Vakoka ara-tsaina tsy azo tsapain-tanana ho an'ny Olombelona ny fahaizan'ny Zafimaniry amin'ny hazo.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la particularité architecturale unique des maisons traditionnelles Zafimaniry ?',
          questionMg:
            'Inona ny mampiavaka ny trano nentim-paharazana Zafimaniry amin’ny fanorenana ?',
          choices: [
            'Elles sont entièrement assemblées en bois sculpté sans aucun clou métallique',
            'Elles sont construites sous terre',
            'Elles sont fabriquées en briques de verre',
            'Elles flottent sur les lacs de montagne',
          ],
          correctIndex: 0,
          explanation:
            "L'architecture Zafimaniry s'emboîte uniquement par des tenons, mortaises et chevilles de bois, sans l'usage du moindre clou métallique.",
        },
        {
          type: 'quiz',
          question:
            'Quelle institution internationale a reconnu le savoir-faire du bois des Zafimaniry comme chef-d’œuvre mondial ?',
          questionMg:
            'Inona ilay fikambanana iraisam-pirenena nanandratra ny asan-tanana Zafimaniry ho vakoka iraisam-pirenena ?',
          choices: ['L’UNESCO', 'La FIFA', 'L’OMS', 'L’UNICEF'],
          correctIndex: 0,
          explanation:
            "L'UNESCO a inscrit l'art du travail du bois Zafimaniry au patrimoine culturel immatériel de l'humanité en 2003.",
        },
        {
          type: 'quiz',
          question:
            'Dans quelle région géographique de Madagascar se trouve le berceau du peuple Zafimaniry ?',
          questionMg:
            'Aiza no toerana fiavian’ny foko Zafimaniry eto Madagasikara ?',
          choices: [
            'Dans les montagnes forestières humides du Sud-Betsileo (vers Ambositra)',
            'Dans le désert d’Amboasary',
            'Sur l’île Sainte-Marie',
            'Dans la plaine du Menabe',
          ],
          correctIndex: 0,
          explanation:
            "Les villages Zafimaniry sont situés dans les hautes montagnes forestières brumeuses à l'est d'Ambositra.",
        },
        {
          type: 'quiz',
          question:
            'Que représentent les motifs géométriques sculptés (Tanakondro) sur les fenêtres et volets ?',
          questionMg:
            'Inona no hevitry ny sokitra sy kisarisary amin’ny varavaran’ny trano Zafimaniry ?',
          choices: [
            'Des symboles sacrés de protection, de fertilité et de lien indéfectible avec la vie',
            'Des panneaux de signalisation routière',
            'Des prix de vente des maisons',
            'Des armes de guerre uniquement',
          ],
          correctIndex: 0,
          explanation:
            "Chaque rosace et motif géométrique porte un sens spirituel fort : protection du foyer, prospérité familiale et hommage à l'harmonie cosmique.",
        },
        {
          type: 'quiz',
          question:
            'Quelle attitude rituelle les artisans Zafimaniry adoptent-ils avant d’abattre un grand arbre en forêt ?',
          questionMg:
            'Inona no fomba ataon’ny mpikapa hazo Zafimaniry alohan’ny hikapana hazo lehibe any an’ala ?',
          choices: [
            'Ils adressent une prière de respect et d’excuse aux esprits protecteurs de la forêt',
            'Ils mettent le feu à la colline voisine',
            'Ils coupent sans prévenir',
            'Ils appellent la police',
          ],
          correctIndex: 0,
          explanation:
            "Par respect écologique et spirituel, l'artisan demande humblement la permission aux esprits de la forêt (ala) avant de prélever le bois nécessaire à la communauté.",
        },
      ],
    },
    // ─── LEÇON 9 : LES VAZIMBA & KALANORO : LES ESPRITS PREMIERS ───
    {
      slug: 'les-vazimba-et-kalanoro-esprits-premiers',
      title:
        'Les Vazimba et Kalanoro : esprits premiers et gardiens sacrés de la nature',
      titleMg:
        'Ny Vazimba sy Kalanoro : ireo tompon-tany voalohany sy mpiambina ny ala',
      summary:
        'Pénétrez dans les mystères mythologiques de Madagascar : la légende des Vazimba premiers habitants et des Kalanoro esprits de la forêt.',
      summaryMg:
        "Midira amin'ny fedrà sy tantara malagasy : ny tantaran'ny Vazimba tompon-tany voalohany sy ny Kalanoro mpiaro ny natiora.",
      type: 'CULTURE',
      orderIndex: 9,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans l'imaginaire et la tradition orale malgache, les Vazimba désignent les habitants primordiaux de la Grande Île, qui vivaient en osmose avec les forêts et les cours d'eau bien avant l'établissement des grandes dynasties. Considérés comme les ancêtres premiers de la terre (Tompon-tany), leurs sépultures rocheuses et marais sacrés sont entourés d'un respect religieux absolu.",
          textMg:
            "Araka ny lovantsofina, ny Vazimba no olona voalohany nonina teto Madagasikara, nifanaraka tamin'ny natiora talohan'ireo fanjakana lehibe. Hajaina fatratra amin'ny maha-tompon-tany azy ireo fasany an-kady sy ireo doany masina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VA / ZI / MBA',
          phonetic: 'va-zim-ba',
          frenchEquivalent:
            "Le mot « Vazimba » se prononce avec un 'Z' adouci et un 'MBA' lié.",
          sampleWordMg: 'Tompon-tany',
          sampleTranslationFr: 'Les premiers maîtres légitimes de la terre',
        },
        {
          type: 'concept',
          termMg: 'Vazimba (Taranaka voalohany)',
          phonetic: 'va-zim-ba',
          meaningFr: 'Les habitants pionniers mythiques des forêts et collines',
          explanation:
            "Pionniers chasseurs-cueilleurs et agriculteurs archaïques, souvent décrits dans les contes comme de petite taille mais dépositaires d'une force spirituelle immense.",
        },
        {
          type: 'concept',
          termMg: 'Doany sy Fasana Vazimba',
          phonetic: 'dou-a-ni si fa-sa-na va-zim-ba',
          meaningFr:
            'Sanctuaires à ciel ouvert et sépultures sacrées des Vazimba',
          explanation:
            "Lieux sacrés entourés d'interdits rigoureux (fady tongolo, fady kisoa) où l'on vient demander bénédiction, santé ou fécondité en offrant du miel ou du rhum.",
        },
        {
          type: 'concept',
          termMg: 'Kalanoro',
          phonetic: 'ka-la-nou-rou',
          meaningFr: 'Créatures mystiques féeriques des forêts profondes',
          explanation:
            'Êtres légendaires humanoïdes de petite taille aux pieds inversés, dotés de pouvoirs de guérison extraordinaires et gardiens invisibles de la faune sylvestre.',
        },
        {
          type: 'example',
          textMg:
            "Rehefa mandalo amin'ny tany misy doany Vazimba dia tsy maintsy manao 'Azafady' sy manaja ny fady mba hitandrovana ny hasina sy ny fiadanana.",
          textFr:
            "Quand on traverse un site abritant un sanctuaire Vazimba, il faut obligatoirement prononcer 'Azafady' et respecter les tabous pour préserver la paix et l'énergie sacrée.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Même les grands rois d'Antananarivo, comme Andrianampoinimerina, prétendaient descendre par leur lignée maternelle des reines Vazimba (telles que Rafohy et Rangita) pour asseoir la légitimité sacrée de leur pouvoir sur la terre.",
          textMg:
            "Ireo Mpanjaka malagasy lehibe toa an-dRafohy sy Rangita dia nifandray tamin'ny tarana-drazana Vazimba mba hanaporofoana ny fahefana ara-drariny amin'ny tany.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Qui sont les « Vazimba » dans la mémoire ancestrale de Madagascar ?',
          questionMg:
            'Iza ireo atao hoe « Vazimba » amin’ny lovantsofina malagasy ?',
          choices: [
            'Les premiers habitants et pionniers légitimes de la terre malgache',
            'Des pirates européens du XVIIIe siècle',
            'Des commerçants arabes des îles Comores',
            'Des soldats de l’armée royale moderne',
          ],
          correctIndex: 0,
          explanation:
            "Les Vazimba sont vénérés comme les ancêtres primordiaux (Tompon-tany) ayant habité la Grande Île avant l'arrivée des souverains historiques.",
        },
        {
          type: 'quiz',
          question:
            'Quels interdits stricts (fady) sont traditionnellement associés aux sanctuaires des Vazimba ?',
          questionMg:
            'Inona ireo fady matetika tandremana manodidina ny doany Vazimba ?',
          choices: [
            'L’interdiction d’y apporter du porc, de l’ail ou de manquer de respect verbal',
            'L’interdiction de marcher les yeux ouverts',
            'L’obligation de courir en criant',
            'L’obligation de chanter en anglais',
          ],
          correctIndex: 0,
          explanation:
            "Le porc (*kisoa*) et l'ail (*tongolo*) sont formellement prohibés sur les sites sacrés des Vazimba pour respecter la pureté ancestrale du lieu.",
        },
        {
          type: 'quiz',
          question:
            'Comment les contes traditionnels décrivent-ils les créatures mystiques appelées « Kalanoro » ?',
          questionMg:
            'Ahoana ny filazan’ny angano ny endriky ny zavatra antsoina hoe « Kalanoro » ?',
          choices: [
            'De petits êtres des forêts aux pieds tournés vers l’arrière, gardiens de remèdes secrets',
            'Des géants volants à deux têtes',
            'Des poissons chantants dans la mer',
            'Des oiseaux géants mangeurs de pierre',
          ],
          correctIndex: 0,
          explanation:
            "Les Kalanoro sont décrits comme de petits êtres sylvestres aux pieds inversés, doués d'une télépathie mystérieuse et d'un savoir médicinal puissant.",
        },
        {
          type: 'quiz',
          question:
            'Quelles illustres reines d’Imerina portaient la mémoire et le sang de la lignée Vazimba ?',
          questionMg:
            'Iza ireo Mpanjakavavy malaza teto Imerina nitondra ny lalan-dra Vazimba ?',
          choices: [
            'Rafohy et Rangita',
            'Ranavalona III et Marie Curie',
            'Cléopâtre et Néfertiti',
            'Bao et Soa',
          ],
          correctIndex: 0,
          explanation:
            "Rafohy et Rangita sont les reines fondatrices légendaires dont descend la lignée royale d'Alasora et d'Ambohimanga.",
        },
        {
          type: 'quiz',
          question:
            'Quelle formule de politesse doit-on prononcer à voix haute lorsqu’on s’aventure près d’un rocher sacré Vazimba ?',
          questionMg:
            'Inona no teny fanajana tononina rehefa mandalo amin’ny vato masina misy doany ?',
          choices: [
            '« Azafady tompoko, mandalo fotsiny izahay » (Pardonnez-nous, nous ne faisons que passer)',
            '« Mandrosoa »',
            '« Aiza ny vola ? »',
            '« Hano ny vary »',
          ],
          correctIndex: 0,
          explanation:
            "Demander pardon (« Azafady tompoko ») témoigne de l'humilité du voyageur devant les maîtres invisibles du lieu.",
        },
      ],
    },
    // ─── LEÇON 10 : LE SAVIKA BETSILEO : COMBAT AVEC LE ZÉBU ───
    {
      slug: 'le-savika-betsileo-rodeo-traditionnel',
      title: 'Le Savika Betsileo : l’art du corps-à-corps sacré avec le zébu',
      titleMg: 'Ny Savika Betsileo : tolona masina ifanandrinana amin’ny omby',
      summary:
        'Découvrez le Savika, tauromachie pacifique et épreuve initiatique du peuple Betsileo où le jeune homme dompte le zébu à mains nues sans jamais le blesser.',
      summaryMg:
        "Fantaro ny Savika, lalao nentim-paharazana betsileo ifanolorana tanana amin'ny omby masiaka tsy misy fitaovam-piadiana.",
      type: 'CULTURE',
      orderIndex: 10,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans le pays Betsileo, au sud des Hautes Terres, le 'Savika' (ou tolon'omby) est bien plus qu'un spectacle athlétique : c'est un rite initiatique d'honneur et de courage. Sans épée ni cape, le jeune 'Mpisavika' entre dans l'arène à mains nues pour s'agripper à la bosse et aux cornes d'un puissant zébu en furie. Contrairement à la corrida occidentale, le zébu n'est jamais mis à mort : le combat célèbre la vigueur de l'homme et la force de l'animal sacré.",
          textMg:
            "Any amin'ny tany Betsileo, ny Savika dia tolona feno fahasahiana anehoan'ny zatovo ny heriny amin'ny alalan'ny fihazonana ny vositry ny omby masiaka amin'ny tanana fotsiny. Tsy vonoina na ampijalina ny omby fa hajaina amin'ny heriny.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'SA / VI / KA',
          phonetic: 'sa-vi-ka',
          frenchEquivalent:
            "Le mot « Savika » vient du verbe 'misavika' qui signifie enlacer, ceinturer ou agripper avec vigueur.",
          sampleWordMg: 'Mpisavika',
          sampleTranslationFr: 'Le combattant traditionnel du Savika',
        },
        {
          type: 'concept',
          termMg: 'Savika (Tolon’omby)',
          phonetic: 'sa-vi-ka',
          meaningFr: 'Le corps-à-corps pacifique avec le zébu à mains nues',
          explanation:
            "Art populaire d'adresse où l'athlète doit rester agrippé le plus longtemps possible à la bosse du zébu sans toucher le sol malgré les secousses violentes.",
        },
        {
          type: 'concept',
          termMg: 'Vositsoky sy Tandroka',
          phonetic: 'vou-si-tsou-ki si tan-drou-ka',
          meaningFr: 'La bosse graisseuse et les cornes menaçantes du zébu',
          explanation:
            "Prises stratégiques du combattant : agripper la bosse demande une puissance dorsale et des bras d'acier, tout en esquivant les coups de cornes.",
        },
        {
          type: 'concept',
          termMg: 'Fandresena tsy misy rà',
          phonetic: 'fan-dre-se-na tsi mi-si ra',
          meaningFr: 'La victoire chevaleresque sans effusion de sang',
          explanation:
            "Règle d'or éthique du Savika : l'homme ne cherche pas à blesser l'animal mais à prouver sa témérité et son équilibre face à la force brute de la nature.",
        },
        {
          type: 'example',
          textMg:
            "Ny Savika dia fampisehoana herim-po sy fahaiza-miaritra ho an'ny tovolahy Betsileo manomana ny tenany ho lehilahy matotra eo anivon'ny fiarahamonina.",
          textFr:
            "Le Savika est une démonstration de courage et d'endurance pour le jeune Betsileo qui se prépare à devenir un homme mûr au sein de la communauté.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le Savika a lieu principalement lors des fêtes traditionnelles, après la moisson du riz et pendant les cérémonies du retournement des morts (Famadihana) à Fianarantsoa et Ambositra.',
          textMg:
            "Miseho indrindra mandritra ny famadihana sy ny fetin'ny taom-piotazana vary any Fianarantsoa sy Ambositra ny lalao Savika.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'En quoi le Savika malgache se distingue-t-il radicalement de la corrida espagnole ?',
          questionMg:
            'Inona no mampiavaka tanteraka ny Savika amin’ny corrida vahiny ?',
          choices: [
            'Le zébu n’est jamais blessé ni tué : c’est un corps-à-corps pacifique à mains nues',
            'Le combat se déroule dans l’eau',
            'On utilise des épées en or',
            'Seules les femmes combattent',
          ],
          correctIndex: 0,
          explanation:
            "Le Savika respecte la vie du zébu : l'homme prouve sa bravoure à mains nues sans arme, et le zébu regagne paisiblement son enclos après l'épreuve.",
        },
        {
          type: 'quiz',
          question:
            'Quelle région et quel peuple de Madagascar sont les gardiens historiques du Savika ?',
          questionMg:
            'Faritra aiza sy foko iza no tompon-toerana amin’ny lalao Savika ?',
          choices: [
            'Le pays Betsileo (autour d’Ambositra et Fianarantsoa)',
            'La côte d’Antsiranana',
            'La presqu’île de Masoala',
            'Le pays Mahafaly',
          ],
          correctIndex: 0,
          explanation:
            "Le Savika est l'art martial tauromachique emblématique du peuple Betsileo des Hautes Terres méridionales.",
        },
        {
          type: 'quiz',
          question:
            'Quelle partie de l’anatomie du zébu le combattant (Mpisavika) cherche-t-il à ceinturer en priorité ?',
          questionMg:
            'Inona no tazonin’ny Mpisavika mafy indrindra amin’ny tenan’ny omby ?',
          choices: [
            'La bosse graisseuse (vositra) avec les deux bras',
            'La queue de l’animal',
            'Une patte arrière',
            'Les oreilles',
          ],
          correctIndex: 0,
          explanation:
            "Agripper solidement la bosse musculaire et graisseuse du zébu permet de faire corps avec l'animal et d'éviter les ruades.",
        },
        {
          type: 'quiz',
          question:
            'Que symbolise la réussite d’un jeune homme lors d’un tournoi de Savika dans son village ?',
          questionMg:
            'Inona no hevitry ny fahombiazana amin’ny Savika ho an’ny zatovo eo an-tanàna ?',
          choices: [
            'Le passage à l’âge adulte, le courage éprouvé et l’estime de toute la communauté',
            'Le droit de quitter le village pour toujours',
            'Une exemption de payer les impôts',
            'Le gain d’une voiture moderne',
          ],
          correctIndex: 0,
          explanation:
            "Dompter la fougue du zébu consacre le statut d'homme courageux capable de protéger sa famille et ses rizières.",
        },
        {
          type: 'quiz',
          question:
            'À quelles grandes occasions festives le Savika est-il traditionnellement organisé ?',
          questionMg:
            'Amin’ny fotoana manao ahoana no tena anatanterahana ny Savika ?',
          choices: [
            'Lors des fêtes de réjouissance après la moisson et pendant les cérémonies du Famadihana',
            'Pendant la saison des cyclones uniquement',
            'Au milieu de la nuit dans le noir',
            'Lors des examens scolaires officiels',
          ],
          correctIndex: 0,
          explanation:
            'Le Savika illumine les grandes fêtes communautaires, les retours de moisson et les veillées de réjouissance du Famadihana.',
        },
      ],
    },
    // ─── LEÇON 11 : LA GÉOLOGIE SACRÉE : SAPHIR & GROTTES DE L'ANKARANA ───
    {
      slug: 'la-geologie-sacree-saphir-et-tsingy',
      title:
        "La géologie sacrée : pierres précieuses, saphirs et sanctuaires de l'Ankarana",
      titleMg:
        "Ny Harena an-kibon'ny tany sy ny Tsingin'Ankarana : vatosoa sy zohy masina",
      summary:
        "Parcourez les trésors du sous-sol malgache : la féerie des saphirs d'Ilakaka et le labyrinthe calcaire sacré des Tsingy de l'Ankarana.",
      summaryMg:
        "Diniho ny harena miafina ao ambanin'ny tany malagasy : ny vatosoa safira sy ny zohy masina ao amin'ny Tsingin'Ankarana.",
      type: 'CULTURE',
      orderIndex: 11,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Madagascar est un véritable coffre-fort géologique mondial. L'île recèle dans ses entrailles des gisements exceptionnels de saphirs, rubis, béryls et tourmalines. Au Nord, le massif d'Ankarana déploie une merveilleuse forteresse naturelle de cathédrales calcaires acérées (Tsingy). Ces grottes et failles sacrées ont servi d'abris inexpugnables aux rois Antakarana lors des invasions historiques.",
          textMg:
            "I Madagasikara dia tany feno harena an-kibon'ny tany tsy hita pesipesenina : safira, robisy ary vatosoa maro loko. Any Avaratra, ny Tsingin'Ankarana kosa dia zohy sy harambato masina niarovan'ireo Mpanjaka Antakarana ny vahoakany.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TSI / NGY',
          phonetic: 'tsin-gi',
          frenchEquivalent:
            'Le mot « Tsingy » est une onomatopée évoquant le tintement cristallin de la roche calcaire quand on la frappe ou le fait de marcher sur la pointe des pieds (mitsingitsingy).',
          sampleWordMg: 'Tsingy',
          sampleTranslationFr: 'Aiguille calcaire acérée / Lapiaz karstique',
        },
        {
          type: 'concept',
          termMg: 'Vatosoa sy Safira (Ilakaka sy Sakaraha)',
          phonetic: 'va-tou-sou-a si sa-fi-ra',
          meaningFr:
            'Les gemmes précieuses et la terre aux saphirs multicolores',
          explanation:
            'Madagascar produit les saphirs les plus purs du monde, découverts à ciel ouvert dans les sables sédimentaires du Sud-Ouest malgache.',
        },
        {
          type: 'concept',
          termMg: 'Zohy Masin’ny Tsingin’Ankarana',
          phonetic: 'zou-hi ma-sin-ni tsin-gin an-ka-ra-na',
          meaningFr:
            'Les grottes nécropoles et sanctuaires souterrains des rois Antakarana',
          explanation:
            'Dédale de cavernes millénaires où reposent les sépultures royales des ancêtres Antakarana, vénérées et protégées par des lois coutumières strictes.',
        },
        {
          type: 'concept',
          termMg: 'Tsy azo simbaina ny tany masina',
          phonetic: 'tsi a-zou sim-bai-na ni ta-ni ma-si-na',
          meaningFr: 'Interdiction de profaner ou détruire la terre sacrée',
          explanation:
            "La sagesse locale rappelle que l'extraction minière ne doit jamais ravager les sanctuaires naturels sous peine de provoquer la colère des esprits gardiens.",
        },
        {
          type: 'example',
          textMg:
            "Ny haren'i Madagasikara dia tsy ny vola ihany fa ny fahatsaran'ny tany sy ny fahaizan'ny vahoaka miaro ny vakoka masina.",
          textFr:
            "La véritable richesse de Madagascar ne réside pas seulement dans l'argent, mais dans la majesté de la terre et la capacité du peuple à protéger ses sanctuaires sacrés.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les Tsingy d'Ankarana abritent le plus grand réseau de rivières souterraines d'Afrique, où vivent des espèces endémiques uniques au monde comme les poissons aveugles et les chauves-souris roussettes géantes.",
          textMg:
            "Ahitana renirano ambanin'ny tany lehibe indrindra aty Afrika ao anatin'ny Tsingin'Ankarana, misy trondro tsy mahita maso miaina ao anatin'ny haizina.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que signifie étymologiquement le terme malgache « Tsingy » désignant ces spectaculaires formations rocheuses ?',
          questionMg:
            'Inona no hevitry ny teny hoe « Tsingy » milaza ireny harambato maranitra ireny ?',
          choices: [
            'Le fait de marcher sur la pointe des pieds car la roche est coupante comme une lame',
            'Une montagne de sable doux',
            'Un fleuve de boue',
            'Un arbre géant de la forêt',
          ],
          correctIndex: 0,
          explanation:
            "« Mitsingitsingy » signifie marcher sur la pointe des pieds : les aiguilles calcaires sont tellement acérées qu'on ne peut y poser le pied à plat sans se blesser.",
        },
        {
          type: 'quiz',
          question:
            'Quel rôle historique crucial les grottes de l’Ankarana ont-elles joué pour le royaume Antakarana ?',
          questionMg:
            'Inona ny anjara toeran’ny zohy ao Ankarana teo amin’ny tantaran’ny foko Antakarana ?',
          choices: [
            'Elles ont servi de refuge royal imprenable et de nécropole sacrée lors des guerres du XIXe siècle',
            'Elles servaient d’écurie pour les chevaux',
            'Elles servaient d’école d’anglais',
            'Elles étaient un port maritime de pêche',
          ],
          correctIndex: 0,
          explanation:
            "Sous le règne du roi Tsimiaro, les grottes d'Ankarana protégèrent tout le peuple Antakarana des assauts extérieurs grâce à leur dédale secret infranchissable.",
        },
        {
          type: 'quiz',
          question:
            'Quelle célèbre ville du Sud-Ouest malgache est mondialement réputée pour ses gisements de saphirs alluvionnaires ?',
          questionMg:
            'Inona ilay tanàna any Atsimo Andrefana malaza eran-tany amin’ny fitrandrahana safira ?',
          choices: ['Ilakaka', 'Moramanga', 'Maintirano', 'Vangaindrano'],
          correctIndex: 0,
          explanation:
            "Découvert à la fin des années 1990, le gisement d'Ilakaka a fait de Madagascar l'un des premiers exportateurs mondiaux de saphirs fins de toutes les couleurs.",
        },
        {
          type: 'quiz',
          question:
            'Quel est le statut spirituel des grottes nécropoles situées dans le parc de l’Ankarana ?',
          questionMg:
            'Inona ny fepetra ara-pomba manodidina ireo zohy fandevenana any Ankarana ?',
          choices: [
            'Ce sont des sanctuaires sacrés (Doany) soumis à des interdits coutumiers rigoureux',
            'Des discothèques publiques',
            'Des terrains de football',
            'Des carrières de ciment ouvertes',
          ],
          correctIndex: 0,
          explanation:
            'Les grottes abritant les reliques des souverains Antakarana sont des sanctuaires inviolables où les visiteurs doivent respecter les rituels et les tabous locaux.',
        },
        {
          type: 'quiz',
          question:
            'Quelle faune exceptionnelle s’est adaptée à la vie caverneuse dans l’obscurité des Tsingy d’Ankarana ?',
          questionMg:
            'Biby tsy manam-paharoa manao ahoana no mivelona ao anatin’ny haizin’ny zohin’Ankarana ?',
          choices: [
            'Des poissons cavernicoles aveugles et des chauves-souris endémiques',
            'Des ours polaires blancs',
            'Des tigres d’Asie',
            'Des kangourous sauteurs',
          ],
          correctIndex: 0,
          explanation:
            "L'évolution dans les rivières souterraines de l'Ankarana a donné naissance à des poissons dépigmentés et aveugles parfaitement adaptés aux ténèbres.",
        },
      ],
    },
  ],
};
