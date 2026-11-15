import { SeedTrack } from './seed.types.js';

/**
 * Parcours complet : Patrimoine Républicain : Chefs d'État, Monnaies & Sceaux de Madagascar
 * (Lova Repoblikana : Mpitondra, Vola sy Mari-panjakana)
 *
 * Absorbe l'intégralité du patrimoine civique et historique de Kanto :
 * - Présidents de la République de Madagascar (1959 à nos jours)
 * - Histoire des monnaies (de l'Ariary royal et des variraiventy au Franc Malgache puis au retour de l'Ariary)
 * - Musée et symbolisme des billets de banque malgaches (séries 1960 à 2017)
 * - Sceaux d'État et armoiries (de Ranavalona II à la IVe République)
 * - Blasons, devises et symboles des 6 Provinces historiques (Faritany Enina)
 * - Grandes dates fondatrices de la nation malgache (1947, 1958, 1960)
 */
export const heritageRepublicainTrack: SeedTrack = {
  slug: 'patrimoine-presidents-et-symboles-nationaux',
  title: 'Patrimoine Républicain : Chefs d’État, Monnaies & Sceaux',
  titleMg: 'Lova Repoblikana : Mpitondra, Vola sy Mari-panjakana',
  description:
    'Chronologie des Présidents de Madagascar, histoire de l’Ariary et des billets de banque, blasons des 6 provinces et grandes dates de la Nation.',
  descriptionMg:
    'Ireo Filoham-pirenena nifandimby, ny tantaran’ny Ariary sy ny vola taratasy, ny mari-paritany enina ary ny vanin’andro manan-tantara.',
  level: 'INTERMEDIATE',
  icon: 'Award',
  color: '#8B2E2E',
  orderIndex: 13,
  estimatedMinutes: 75,
  lessons: [
    {
      slug: 'presidents-de-madagascar-et-chefs-d-etat',
      title: 'Les Présidents de Madagascar et l’Histoire Républicaine',
      titleMg: 'Ireo Filoham-pirenena sy ny Tantaram-panjakana',
      summary:
        'La chronologie complète des chefs d’État de Madagascar depuis 1959 : Tsiranana, Ramanantsoa, Ratsimandrava, Ratsiraka, Zafy, Ravalomanana, Rajoelina et Rajaonarimampianina.',
      summaryMg:
        'Tantaran’ireo filoha nifandimby nitondra ny Repoblika nanomboka tamin’ny 1959 ka hatramin’izao fotoana izao.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 14,
      sections: [
        {
          type: 'intro',
          textFr:
            'Depuis la naissance de la République en 1958, Madagascar a été guidée par des dirigeants aux trajectoires et visions politiques diverses. Connaître la succession des Présidents et les grandes étapes constitutionnelles permet de comprendre les défis contemporains de la nation.',
          textMg:
            'Nanomboka tamin’ny 1958, nifandimby nitondra an’i Madagasikara ireo Filoham-pirenena nanana ny fomba fijeriny. Zava-dehibe ny fahalalana ny tantaran’izy ireo.',
        },
        {
          type: 'concept',
          textFr:
            'Les pionniers de la République :\n• Philibert Tsiranana (1959-1972) : Premier Président de la République malgache, surnommé le « Père de l’indépendance ». Il a bâti les premières universités et infrastructures de l’État moderne.\n• Général Gabriel Ramanantsoa (1972-1975) : Chef du gouvernement militaire suite aux mouvements de mai 1972, il a engagé la révision des accords de coopération et la création de la monnaie nationale.\n• Colonel Richard Ratsimandrava (février 1975) : Promoteur de la réorganisation de la nation autour du Fokonolona (« Tsy hiady am-patana »), assassiné six jours après son accession au pouvoir.',
          textMg:
            'I Philibert Tsiranana (1959-1972) Rain’ny Fahaleovantena, ny Jeneraly Gabriel Ramanantsoa (1972-1975) mpitari-tolona ara-tafika, ary ny Kolonely Richard Ratsimandrava (1975) maherifon’ny Fokonolona.',
        },
        {
          type: 'concept',
          textFr:
            'La IIe et la IIIe République :\n• Didier Ratsiraka (1975-1993 et 1997-2002) : Fondateur de la République démocratique (Boky Mena, socialisme malgache) puis initiateur de la politique d’humanisme écologique.\n• Professeur Albert Zafy (1993-1996) : Chirurgien de renom, apôtre de la démocratie pluraliste et promoteur du Fampihavanana (réconciliation nationale).\n• Marc Ravalomanana (2002-2009) : Entrepreneur et maire d’Antananarivo devenu président, initiateur du Madagascar Action Plan (MAP) et de la modernisation des routes.',
          textMg:
            'Didier Ratsiraka (Repoblika II sy III), ny Profesora Albert Zafy (apôstolin’ny demokrasia sy fampihavanana), ary Marc Ravalomanana (bata-tetika MAP sy lalam-pirenena).',
        },
        {
          type: 'concept',
          textFr:
            'La IVe République (depuis 2010) :\n• Andry Rajoelina (2009-2014 et 2019-Présent) : Leader de la transition de 2009, fondateur constitutionnel de la IVe République et président élu en 2018 et 2023, promoteur des grands projets d’infrastructures et de l’émergence.\n• Hery Rajaonarimampianina (2014-2018) : Premier président élu de la IVe République, expert-comptable ayant axé son mandat sur le retour à l’ordre constitutionnel et les conférences des bailleurs.',
          textMg:
            'Ny Repoblika faha-IV : Andry Rajoelina nitarika ny tetezamita sy lany tamin’ny 2018 sy 2023, ary Hery Rajaonarimampianina filoha voalohany lany tamin’ny 2013.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le Colonel Richard Ratsimandrava a prononcé une phrase historique restée gravée dans la mémoire nationale : « Tsy hiady am-patana isika » (Nous ne nous battrons pas au coin de notre foyer), appelant à l’unité pour éviter la guerre civile fraternelle.',
          textMg:
            'Ny teny manan-tantara nataon’ny Kolonely Richard Ratsimandrava hoe « Tsy hiady am-patana isika » dia mitoetra ho antso ho an’ny fihavanana mandrakizay.',
        },
        {
          type: 'quiz',
          question:
            'Qui fut le premier Président de la République de Madagascar lors du recouvrement de l’indépendance en 1960 ?',
          questionMg:
            'Iza no Filoham-pirenena malagasy voalohany tamin’ny nahazoana ny fahaleovantena tamin’ny 1960 ?',
          choices: [
            'Philibert Tsiranana',
            'Gabriel Ramanantsoa',
            'Didier Ratsiraka',
            'Albert Zafy',
          ],
          correctIndex: 0,
          explanation:
            'Philibert Tsiranana fut élu premier Président de la République de Madagascar en 1959 et proclama solennellement l’indépendance le 26 juin 1960.',
        },
        {
          type: 'quiz',
          question:
            'Quel dirigeant et médecin renommé fut surnommé « l’apôtre de la démocratie » lors de la IIIe République ?',
          questionMg:
            'Iza ilay mpitondra sady mpitsabo malaza nantsoina hoe « apôstolin’ny demokrasia » tamin’ny Repoblika faha-III ?',
          choices: [
            'Le Professeur Albert Zafy',
            'Le Général Gabriel Ramanantsoa',
            'Norbert Ratsirahonana',
            'Jacques Rabemananjara',
          ],
          correctIndex: 0,
          explanation:
            'Le Professeur Albert Zafy, élu président en 1993, a incarné la transition démocratique et la promotion active de la réconciliation nationale (Fampihavanana).',
        },
        {
          type: 'quiz',
          question:
            'Quel chef d’État malgache a placé le Fokonolona au cœur de sa vision de développement populaire en 1975 ?',
          questionMg:
            'Iza ilay lehibem-panjakana nametraka ny Fokonolona ho fototry ny fampandrosoana tamin’ny 1975 ?',
          choices: [
            'Le Colonel Richard Ratsimandrava',
            'Philibert Tsiranana',
            'Marc Ravalomanana',
            'Andry Rajoelina',
          ],
          correctIndex: 0,
          explanation:
            'Le Colonel Richard Ratsimandrava voulait transférer le pouvoir réel et la gestion économique directement aux Fokonolona à la base.',
        },
        {
          type: 'quiz',
          question:
            'Quel président malgache a fondé la IIe République et dirigé Madagascar de 1975 à 1993 puis de 1997 à 2002 ?',
          questionMg:
            'Iza ilay filoha nanorina ny Repoblika faha-II ary nitondra tamin’ny 1975-1993 sy 1997-2002 ?',
          choices: [
            'Didier Ratsiraka',
            'Gabriel Ramanantsoa',
            'Albert Zafy',
            'Hery Rajaonarimampianina',
          ],
          correctIndex: 0,
          explanation:
            'Didier Ratsiraka (surnommé Deba) a marqué l’histoire contemporaine malgache à la tête de la IIe République démocratique et socialiste.',
        },
        {
          type: 'quiz',
          question:
            'Quel plan de développement national quinquennal a été lancé sous la présidence de Marc Ravalomanana ?',
          questionMg:
            'Inona ilay fandaharan’asa lehibe fampandrosoana natsangan’i Marc Ravalomanana ?',
          choices: [
            'Le Madagascar Action Plan (MAP)',
            'Le Boky Mena',
            'Le Plan Marshall Malagasy',
            'Le Projet Fihavanana 2000',
          ],
          correctIndex: 0,
          explanation:
            'Le Madagascar Action Plan (MAP), lancé en 2006, visait la modernisation rapide des infrastructures, de l’éducation et de l’agriculture.',
        },
      ],
    },
    {
      slug: 'histoire-monnaies-malgaches-ariary-fmg',
      title: 'Histoire des Monnaies Malgaches : De l’Ariary royal au FMG',
      titleMg: 'Ny Tantaran’ny Vola Malagasy : Ariary sy Franc Malagasy',
      summary:
        'Origine historique de l’Ariary traditionnel, coupures d’argent sous la monarchie, création du Franc Malgache (FMG) et retour solennel à l’Ariary en 2003.',
      summaryMg:
        'Tantaran’ny Ariary nentim-paharazana, ny variraiventy, ny Franc Malagasy ary ny fiverenana amin’ny Ariary tamin’ny 2003.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'La monnaie d’un pays reflète son autonomie et son identité économique. Madagascar possède une histoire monétaire singulière : bien avant la colonisation, l’Ariary constituait déjà l’unité monétaire de référence des royaumes malgaches.',
          textMg:
            'Ny vola dia taratry ny fiandrianana ara-toekarena. Efa talohan’ny fanjanahan-tany no nampiasaina tamin’ny fomba nentim-paharazana ny Ariary.',
        },
        {
          type: 'concept',
          textFr:
            'L’Ariary traditionnel et les piastres d’argent :\n• L’Ariary désignait à l’origine la grosse pièce d’argent (piastre espagnole ou thaler de Marie-Thérèse) circulant dans l’océan Indien ;\n• Pour obtenir de la petite monnaie, les Malgaches découpaient les pièces d’argent avec des cisailles et les pesaient avec une balance spéciale (Lanja) et des poids en graines (Variraiventy, Loso, Sikajy) ;\n• 1 Ariary valait 8 Sikajy ou 720 Variraiventy.',
          textMg:
            'Ny Ariary tany am-boalohany dia volafotsy lehibe. Notetehina tamin’ny hety vy izany mba hahazoana vola madinika nilanja variraiventy, sikajy ary loso.',
        },
        {
          type: 'concept',
          textFr:
            'La période du Franc Malgache (FMG) :\n• En 1960, l’Institut d’Émission Malgache puis la Banque Centrale de Madagascar (créée en 1973) ont émis le Franc Malgache (FMG) ;\n• Particularité unique au monde : les billets portaient une double valeur faciale ! Le montant principal en Francs et sa contrevaleur en Ariary (avec le rapport fixe : 1 Ariary = 5 FMG) pour respecter les habitudes de compte de la population.',
          textMg:
            'Tamin’ny 1960 ka hatramin’ny 2003, nampiasaina ny Franc Malagasy (FMG) miaraka amin’ny sandany amin’ny Ariary (1 Ariary = 5 FMG).',
        },
        {
          type: 'concept',
          textFr:
            'Le retour officiel exclusif à l’Ariary en 2003 :\n• Sous l’impulsion de la loi monétaire de 2003, Madagascar a restauré l’Ariary comme unique unité monétaire légale de la République ;\n• Cette décision souveraine a réaffirmé l’authenticité culturelle de la Grande Île et simplifié les transactions commerciales.',
          textMg:
            'Tamin’ny taona 2003 no naverina tamin’ny fomba ofisialy ho vola tokana manan-kery ny Ariary, nanehoana ny fahaleovantena feno.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Aujourd’hui encore, dans de nombreux marchés traditionnels malgaches, les commerçants et clients continuent d’énoncer les prix en Francs (FMG), nécessitant de diviser par 5 pour obtenir le prix réel en Ariary !',
          textMg:
            'Amin’ny tsena maro, mbola misy mampiasa ny teny hoe « drala » na FMG amin’ny fitenenana, ka zaraina dimy vao mahazo ny tena vidiny amin’ny Ariary.',
        },
        {
          type: 'quiz',
          question:
            'Quelle équivalence fixe liait l’Ariary et le Franc Malgache (FMG) ?',
          questionMg:
            'Firy FMG ny sandan’ny 1 Ariary tamin’ny vanim-potoana nampiasana ny Franc Malagasy ?',
          choices: [
            '1 Ariary = 5 FMG',
            '1 Ariary = 10 FMG',
            '1 Ariary = 100 FMG',
            '1 Ariary = 2 FMG',
          ],
          correctIndex: 0,
          explanation:
            'Le rapport historique et officiel était de 1 Ariary pour 5 Francs Malgaches (FMG). Ainsi, un billet de 10 000 FMG valait 2 000 Ariary.',
        },
        {
          type: 'quiz',
          question:
            'En quelle année l’Ariary est-il redevenu la seule unité monétaire officielle de la République de Madagascar ?',
          questionMg:
            'Tamin’ny taona firy no niverina ho vola ofisialy tokana eto Madagasikara ny Ariary ?',
          choices: ['En 2003', 'En 1960', 'En 1975', 'En 2017'],
          correctIndex: 0,
          explanation:
            'La réforme monétaire adoptée en 2003 a rétabli l’Ariary comme monnaie légale exclusive, remplaçant définitivement le Franc Malgache.',
        },
        {
          type: 'quiz',
          question:
            'Comment les marchands malgaches mesuraient-ils les petits morceaux d’argent découpés sous la royauté ?',
          questionMg:
            'Ahoana no nandanjana ny volafotsy voatetika tamin’ny andron’ny mpanjaka ?',
          choices: [
            'Avec des balances spéciales (Lanja) et des poids étalons végétaux (Variraiventy, grains de riz)',
            'Au volume d’eau déplacé',
            'À la longueur en centimètres',
            'Au toucher sans balance',
          ],
          correctIndex: 0,
          explanation:
            'On utilisait des trébuchets (Lanja) et le variraiventy (poids équivalent à un grain de riz mûr décortiqué) pour peser très précisément l’argent.',
        },
        {
          type: 'quiz',
          question:
            'Quelle institution nationale détient le privilège exclusif d’émettre les pièces et billets de banque à Madagascar ?',
          questionMg:
            'Inona ilay andrim-panjakana manana fahefana tokana hanamboatra sy hamoaka ny vola eto Madagasikara ?',
          choices: [
            'La Banque Centrale de Madagascar (Banky Foiben’i Madagasikara - BFM)',
            'Le Ministère des Finances uniquement',
            'La Bourse des valeurs',
            'La Trésorerie générale municipale',
          ],
          correctIndex: 0,
          explanation:
            'La Banque Centrale de Madagascar (BFM), créée en 1973, est la banque des banques et l’autorité d’émission monétaire nationale.',
        },
        {
          type: 'quiz',
          question:
            'Si un commerçant au marché vous annonce un prix de « 50 000 francs », combien devez-vous payer en Ariary ?',
          questionMg:
            'Raha milaza ny mpivarotra hoe « dimy alina drala » (50 000 FMG), ohatrinona izany amin’ny Ariary ?',
          choices: [
            '10 000 Ariary (50 000 divisé par 5)',
            '50 000 Ariary',
            '250 000 Ariary',
            '5 000 Ariary',
          ],
          correctIndex: 0,
          explanation:
            '50 000 FMG divisé par 5 donne exactement 10 000 Ariary, soit la coupure bleue classique.',
        },
      ],
    },
    {
      slug: 'billets-de-banque-symboles-et-patrimoine',
      title:
        'L’Art des Billets de Banque : Énergie, Faune et Richesses Malgaches',
      titleMg: 'Ny Haingon’ny Vola Taratasy sy ny Harenam-pirenena',
      summary:
        'Décryptage des chefs-d’œuvre graphiques des billets malgaches : l’usine Ambatovy (20 000 Ar), le Port de Toamasina (10 000 Ar), l’Allée des Baobabs (5 000 Ar) et les lémuriens.',
      summaryMg:
        'Famakafakana ireo sary mampiseho ny fandrosoana sy ny zavaboary eo amin’ny vola taratasy malagasy.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Les billets de banque malgaches sont de véritables ambassadeurs culturels et économiques. Émis par la Banky Foiben’i Madagasikara, ils célèbrent la biodiversité, les infrastructures modernes, les filières d’exportation et les arts traditionnels.',
          textMg:
            'Ireo vola taratasy malagasy dia maneho ny harenan’ny firenena : zava-boahary miavaka, fotodrafitrasa maoderina, ary kolontsaina nentin-drazana.',
        },
        {
          type: 'concept',
          textFr:
            'La série 2017 « Madagascar & ses Richesses » :\n• Le billet de 20 000 Ariary (bleu profond) : plus grosse coupure du pays. Il représente au recto l’usine moderne de nickel-cobalt Sherritt Ambatovy et des pylônes haute tension, et au verso les gousses de vanille de la SAVA, le girofle et le poivre noir ;\n• Le billet de 10 000 Ariary (bleu clair) : met en valeur le Port autonome de Toamasina (porte maritime de l’économie) et l’instrument de musique national, la Valiha traditionnelle en bambou ;\n• Le billet de 5 000 Ariary (marron terre) : illustre l’Allée majestueuse des Baobabs de Morondava et la forêt dense tropicale.',
          textMg:
            'Ny andiany 2017 : 20 000 Ar (Ambatovy sy lavanila), 10 000 Ar (Seranan-tsambon’i Toamasina sy valiha), 5 000 Ar (Alalamban’ny Baobab sy ala voajanahary).',
        },
        {
          type: 'concept',
          textFr:
            'Les petites et moyennes coupures de la série :\n• Le billet de 2 000 Ariary (vert feuillage) : dédié à la biodiversité fragile, avec des lémuriens emblématiques et des orchidées comètes ;\n• Le billet de 1 000 Ariary (orangé) : honore l’artisanat du bois sculpté Zafimaniry (classé au patrimoine mondial de l’UNESCO) ;\n• Le billet de 500 et 100 Ariary : célèbrent l’agriculture vivrière et les paysages ruraux de la Grande Île.',
          textMg:
            'Ny 2 000 Ar dia maneho ny gidro sy orkide, ny 1 000 Ar dia manome voninahitra ny asa tànana Zafimaniry, ary ny 500 Ar ny fambolena.',
        },
        {
          type: 'concept',
          textFr:
            'Les dispositifs de haute sécurité fiduciaire :\n• Le filigrane transparent visible en contre-jour (représentant la tête de zébu ou une fleur de vanille) ;\n• Le fil de sécurité fenêtré à changement de couleur optique ;\n• Les signes en relief tactiles permettant aux personnes malvoyantes d’identifier chaque valeur au toucher.',
          textMg:
            'Fiarovana amin’ny vola sandoka : sary miara-manify (filigrane), kofehy miova loko, ary marika misongadina ho an’ny jamba sy manana fahasembanana.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le billet de 20 000 Ariary introduit en 2017 a été créé pour accompagner la croissance des transactions commerciales, tout en rendant un hommage appuyé à la filière vanille, dont Madagascar est le premier producteur mondial.',
          textMg:
            'Ny famoahana ny vola 20 000 Ariary tamin’ny 2017 dia nanamora ny varotra ary nanome lanja ny lavanila izay maha-laharana voalohany an’i Madagasikara.',
        },
        {
          type: 'quiz',
          question:
            'Quelle grande infrastructure industrielle moderne est représentée au recto du billet de 20 000 Ariary ?',
          questionMg:
            'Inona ilay orinasa indostrialy lehibe hita eo anoloan’ny vola taratasy 20 000 Ariary ?',
          choices: [
            'L’usine d’extraction de nickel-cobalt Sherritt Ambatovy',
            'La raffinerie de sucre de Brickaville',
            'Une centrale nucléaire',
            'Un barrage hydroélectrique du sud',
          ],
          correctIndex: 0,
          explanation:
            'Le billet de 20 000 Ariary met en avant le projet minier et industriel d’Ambatovy, symbolisant la transformation industrielle du pays.',
        },
        {
          type: 'quiz',
          question:
            'Quel instrument de musique emblématique de Madagascar orne le billet de 10 000 Ariary ?',
          questionMg:
            'Inona ilay zava-maneno malagasy malaza hita eo amin’ny vola taratasy 10 000 Ariary ?',
          choices: [
            'La Valiha en bambou',
            'Le Kabosy',
            'Le Marovany',
            'La guitare moderne',
          ],
          correctIndex: 0,
          explanation:
            'La Valiha traditionnelle, instrument à cordes en bambou considéré comme l’instrument national malgache, figure sur le billet de 10 000 Ariary.',
        },
        {
          type: 'quiz',
          question:
            'Quel monument naturel mondialement célèbre de la région Menabe est représenté sur le billet de 5 000 Ariary ?',
          questionMg:
            'Inona ilay toerana voajanahary malaza maneran-tany any Menabe hita eo amin’ny vola 5 000 Ariary ?',
          choices: [
            'L’Allée des Baobabs de Morondava',
            'Le cratère du lac Tritriva',
            'Les grottes d’Ankarana',
            'La cascade de la Lily',
          ],
          correctIndex: 0,
          explanation:
            'L’Allée des Baobabs (Morondava), paysage spectaculaire de baobabs Grandidier centenaires, illustre le billet de 5 000 Ariary.',
        },
        {
          type: 'quiz',
          question:
            'Quel art traditionnel malgache, classé au patrimoine immatériel de l’UNESCO, figure sur le billet de 1 000 Ariary ?',
          questionMg:
            'Inona ilay haikanto nentim-paharazana voasoratra ao amin’ny UNESCO hita amin’ny vola 1 000 Ariary ?',
          choices: [
            'Le travail du bois sculpté des Zafimaniry',
            'Le tissage de la soie sauvage Landy',
            'La vannerie de rotin',
            'La ferronnerie d’art',
          ],
          correctIndex: 0,
          explanation:
            'Le savoir-faire des sculpteurs sur bois Zafimaniry de la région d’Ambositra est immortalisé sur le billet de 1 000 Ariary.',
        },
        {
          type: 'quiz',
          question:
            'Comment les personnes malvoyantes peuvent-elles reconnaître la valeur d’un billet malgache au toucher ?',
          questionMg:
            'Ahoana no hahafantaran’ny olona manana olana amin’ny fahitana ny sandan’ny vola taratasy ?',
          choices: [
            'Grâce à des motifs géométriques en relief imprimés en taille-douce sur les bords',
            'Par l’odeur du papier',
            'Par le son du papier froissé',
            'Les billets ont tous la même forme sans distinction',
          ],
          correctIndex: 0,
          explanation:
            'Chaque coupure comporte des lignes ou points tactiles en relief sur les marges pour permettre l’accessibilité aux personnes malvoyantes.',
        },
      ],
    },
    {
      slug: 'sceaux-et-emblemes-d-etat-a-travers-l-histoire',
      title:
        'Sceaux et Armoiries d’État : De Ranavalona II à la IVe République',
      titleMg: 'Tombo-kase sy Mari-panjakana teo amin’ny Tantara',
      summary:
        'L’évolution des emblèmes et devises de l’État : le sceau royal de 1868, les emblèmes de la Ire République (1959), du socialisme (1975) et le sceau actuel.',
      summaryMg:
        'Ny fivoaran’ny tombo-kase ofisialy nanomboka tamin’ny andron-dRanavalona II ka hatramin’ny Repoblika faha-IV.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Le sceau officiel est la marque juridique suprême qui authentifie les actes de l’État. À Madagascar, chaque période historique a forgé son propre emblème pour affirmer son identité politique, sa devise et ses aspirations spirituelles et sociales.',
          textMg:
            'Ny tombo-kasem-panjakana no mari-panamarinana lehibe indrindra ny didim-pitondrana. Nivoatra nanaraka ny vanim-potoana sy ny foto-kevitra nanjaka izany.',
        },
        {
          type: 'concept',
          textFr:
            'Le Sceau Royal de Ranavalona II (1868-1883) :\n• L’écu écartelé comportait un zébu noir, un arbre du voyageur, un bouclier avec des sagaies de défense et des épis de riz ;\n• Il était surmonté de la couronne royale de Ranavalona Ire et soutenu par un soldat merina en grande tenue et un marchand ;\n• La devise historique gravée à sa base était : « Tsy adidiko izaho irery, fa adidiko izaho sy ianao » (Ce n’est pas mon devoir à moi seule, mais le nôtre à vous et à moi).',
          textMg:
            'Ny tombo-kase tamin’ny 1868 : ahitana omby, ravinala, lefona, ary vary, miaraka amin’ny teny hoe « Tsy adidiko izaho irery, fa adidiko izaho sy ianao ».',
        },
        {
          type: 'concept',
          textFr:
            'Les emblèmes de la Ire et IIe République :\n• La Ire République (1959-1976) : adopte un sceau circulaire portant la devise « Fahafahana - Tanindrazana - Fandrosoana » (Liberté - Patrie - Progrès) avec la tête de zébu et l’arbre du voyageur ;\n• La IIe République démocratique (1975-1992) : adopte un emblème d’inspiration socialiste portant la roue dentée industrielle, le fusil et la bêche (angady), la plume, le soleil levant et la devise « Tanindrazana - Tolom-piavotana - Fahafahana » (Patrie - Révolution - Liberté).',
          textMg:
            'Repoblika I (Fahafahana - Tanindrazana - Fandrosoana), Repoblika II (Tanindrazana - Tolom-piavotana - Fahafahana miaraka amin’ny angady sy basy).',
        },
        {
          type: 'concept',
          textFr:
            'Le Sceau actuel de la IVe République (depuis 2011) :\n• Au centre : une tête de zébu bossu rouge stylisée sur un disque d’or ;\n• En arrière-plan : l’Arbre du Voyageur (Ravinala) déployant ses palmes protectrices ;\n• Entouré d’épis de riz nourriciers et de la devise solennelle : « FITIAVANA - TANINDRAZANA - FANDROSOANA » ;\n• Au pourtour : la mention solennelle « REPOBLIKAN’I MADAGASIKARA ». Ce sceau est conservé sous la garde du Garde des Sceaux, Ministre de la Justice.',
          textMg:
            'Ny tombo-kase ankehitriny : lohan’omby, ravinala, salohim-bary, ary ny teny filamatra « Fitiavana - Tanindrazana - Fandrosoana ».',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le Garde des Sceaux est le titre protocolaire traditionnel porté par le Ministre de la Justice de Madagascar : c’est lui qui détient la matrice métallique originelle servant à sceller les lois fondamentales et traités.',
          textMg:
            'Ny Minisitry ny Fitsarana no mitondra ny anaram-boninahitra hoe « Mpitahiry ny Tombo-kasem-panjakana » miaro ny fitaovana fanisiana tombo-kase ny lalàna.',
        },
        {
          type: 'quiz',
          question:
            'Quelle célèbre devise civique était gravée au bas du Sceau royal sous le règne de Ranavalona II en 1868 ?',
          questionMg:
            'Inona ilay teny filamatra manan-tantara teo amin’ny tombo-kasem-panjakana tamin’ny 1868 ?',
          choices: [
            '« Tsy adidiko izaho irery, fa adidiko izaho sy ianao »',
            '« Izay mitambatra vato »',
            '« Ny fihavanana no lehibe indrindra »',
            '« Tanindrazana sy Fandrosoana »',
          ],
          correctIndex: 0,
          explanation:
            'Cette devise mémorable (« Ce n’est pas mon devoir à moi seul, mais le nôtre à vous et à moi ») affirmait la responsabilité collective de tous les sujets et citoyens.',
        },
        {
          type: 'quiz',
          question:
            'Quel symbole du travail agraire traditionnel figurait au cœur de l’emblème de la IIe République socialiste (1975) ?',
          questionMg:
            'Inona ilay fitaovana fambolena malagasy nentim-paharazana hita teo amin’ny mariky ny Repoblika faha-II ?',
          choices: [
            'La bêche traditionnelle malgache (Angady)',
            'La charrue moderne',
            'La herse en fer',
            'Le tracteur motorisé',
          ],
          correctIndex: 0,
          explanation:
            'L’angady (la bêche traditionnelle malgache) figurait croisée avec le fusil pour symboliser le travail de la terre et la défense de la révolution.',
        },
        {
          type: 'quiz',
          question:
            'Quelle plante nourricière sacrée entoure la tête de zébu sur le Sceau officiel de la IVe République ?',
          questionMg:
            'Inona ilay zava-maniry fihinanana manodidina ny lohan’omby ao amin’ny tombo-kasem-panjakana ankehitriny ?',
          choices: [
            'Des épis de riz (Salohim-bary)',
            'Des tiges de canne à sucre',
            'Des feuilles de caféier',
            'Des branches de vanille',
          ],
          correctIndex: 0,
          explanation:
            'Les épis de riz (salohim-bary) représentent la fertilité nourricière et l’aliment de base unificateur de tous les Malgaches.',
        },
        {
          type: 'quiz',
          question:
            'Quel ministre du gouvernement détient officiellement le titre de « Garde des Sceaux » à Madagascar ?',
          questionMg:
            'Iza amin’ireo minisitra no mitondra ny anaram-boninahitra hoe « Mpitahiry ny Tombo-kase » ?',
          choices: [
            'Le Ministre de la Justice',
            'Le Ministre de l’Intérieur',
            'Le Ministre de la Défense',
            'Le Ministre des Affaires Étrangères',
          ],
          correctIndex: 0,
          explanation:
            'Le Ministre de la Justice est le Garde des Sceaux (Mpitahiry ny Tombo-kasem-panjakana), gardien de l’authenticité des actes solennels de la République.',
        },
        {
          type: 'quiz',
          question:
            'Que symbolise le palmier Ravinala (Arbre du Voyageur) présent sur les sceaux républicains successifs ?',
          questionMg:
            'Inona no hevitry ny Ravinala hita matetika ao anatin’ny tombo-kasem-panjakana malagasy ?',
          choices: [
            'L’hospitalité, la protection de l’eau douce bienfaisante et l’identité insulaire unique',
            'L’industrie du meuble en bois',
            'Le développement des aéroports',
            'La production de papier journal',
          ],
          correctIndex: 0,
          explanation:
            'Le Ravinala est le symbole de l’accueil malgache : il stocke de l’eau potable dans la base de ses feuilles pour désaltérer le voyageur dans le besoin.',
        },
      ],
    },
    {
      slug: 'blasons-et-symboles-des-6-provinces',
      title: 'Blasons, Devises et Identités des 6 Provinces Historiques',
      titleMg: 'Mari-paritany sy Soatoavin’ny Faritany Enina',
      summary:
        'L’héraldique et l’âme des six provinces historiques (Faritany) : Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina et Toliara.',
      summaryMg:
        'Ny marika, ny teny filamatra ary ny mampiavaka ireo Faritany enina manan-tantara.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Bien que Madagascar soit aujourd’hui administrée en 23 Régions, les 6 Provinces historiques (Faritany Enina) conservent une place affective et culturelle majeure dans le cœur des Malgaches. Leurs blasons traditionnels illustrent la diversité féconde de nos terroirs.',
          textMg:
            'Na mizara 23 Faritra aza i Madagasikara ankehitriny, ireo Faritany 6 manan-tantara dia manana toerana manokana ao am-pon’ny Malagasy noho ny harenany.',
        },
        {
          type: 'concept',
          textFr:
            'Les Provinces des Hautes Terres :\n• Antananarivo (Iarivo) : Blason orné de la tête de zébu royale et des 7 collines sacrées. Cœur historique de l’Imerina, berceau de l’unification sous Andrianampoinimerina ;\n• Fianarantsoa : Province de la bonne éducation et de la riziculture étagée Betsileo. Blason arborant le pont en arche, les collines et les plantations de vigne et de thé.',
          textMg:
            'Antananarivo (Lohan’omby sy vohitra masina) ary Fianarantsoa (Faritanin’ny fahaizana amam-pahalalana sy ny tanimbary mirindra).',
        },
        {
          type: 'concept',
          textFr:
            'Les Provinces du Nord et de l’Est :\n• Antsiranana (Diego-Suarez) : Blason marqué par le Pain de Sucre (Nosy Lonjo), la baie maritime exceptionnelle et les richesses halieutiques ;\n• Toamasina (Tamatave) : Premier port maritime marchand de Madagascar, blason orné d’un navire de commerce, de branches de girofle et de canne à sucre.',
          textMg:
            'Antsiranana (Helodrano sy Nosy Lonjo) ary Toamasina (Vavahady ara-barotra, jirofo ary fary).',
        },
        {
          type: 'concept',
          textFr:
            'Les Provinces de l’Ouest et du Sud :\n• Mahajanga (Majunga) : Cité des Fleurs et porte sur le canal de Mozambique. Blason orné du grand baobab centenaire du bord de mer et du boutre traditionnel à voile triangulaire ;\n• Toliara (Tuléar) : Province du grand Sud ensoleillé, blason illuminé par un soleil rayonnant éclatant, les forêts d’épineux (Alluaudia) et la barrière de corail du grand récif.',
          textMg:
            'Mahajanga (Baobab sy lakam-by botry) ary Toliara (Masoandro mibaliaka, ala mikitroka tsilo ary vatohara).',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Les 6 provinces ont inspiré la structure des 6 étoiles autrefois présentes sur certains emblèmes nationaux, symbolisant l’indivisibilité de la République malgré l’immensité de son territoire insulaire.',
          textMg:
            'Ireo kintana enina tamin’ny mari-pirenena sasany teo aloha dia naneho ny firaisankinan’ireo Faritany enina manoloana ny firenena iray tsy mivaky.',
        },
        {
          type: 'quiz',
          question:
            'Quel arbre centenaire majestueux situé en bord de mer est le symbole emblématique de la ville et province de Mahajanga ?',
          questionMg:
            'Inona ilay hazo vaventy manan-tantara eo amoron-dranomasina marika mampiavaka an’i Mahajanga ?',
          choices: [
            'Le grand Baobab du bord de mer',
            'Le grand Jacaranda mauve',
            'Le Palmier à huile',
            'Le Chêne centenaire',
          ],
          correctIndex: 0,
          explanation:
            'Le célèbre baobab géant de Mahajanga (Za Baobab), carrefour populaire au bord de mer, est l’emblème vivant de la ville des Fleurs.',
        },
        {
          type: 'quiz',
          question:
            'Quel îlot conique rocheux situé dans la baie d’Antsiranana caractérise le blason du Nord malgache ?',
          questionMg:
            'Inona ilay nosy kely miendrika vongan-tsira ao amin’ny helodranon’Antsiranana ?',
          choices: [
            'Le Pain de Sucre (Nosy Lonjo)',
            'Nosy Be',
            'Sainte-Marie',
            'Nosy Komba',
          ],
          correctIndex: 0,
          explanation:
            'Nosy Lonjo, le pic rocheux en forme de pain de sucre dressé au milieu de la baie de Diego-Suarez, est un site sacré et le symbole d’Antsiranana.',
        },
        {
          type: 'quiz',
          question:
            'Quelle province historique est traditionnellement surnommée le berceau de l’éducation et de la riziculture en terrasses Betsileo ?',
          questionMg:
            'Iza amin’ireo faritany no fantatra amin’ny fahaizana amam-pahalalana sy ny tanimbary mifanao ambaratonga betsileo ?',
          choices: [
            'La Province de Fianarantsoa',
            'La Province de Mahajanga',
            'La Province de Toliara',
            'La Province de Toamasina',
          ],
          correctIndex: 0,
          explanation:
            'Fianarantsoa (dont le nom signifie « Là où l’on apprend le bien ») est réputée pour ses collèges historiques et ses paysages de rizières en terrasses.',
        },
        {
          type: 'quiz',
          question:
            'Quel équipement économique majeur fait de la province de Toamasina le poumon marchand de Madagascar ?',
          questionMg:
            'Inona ilay fotodrafitrasa lehibe mahatonga an’i Toamasina ho foiben’ny varotra iraisam-pirenena ?',
          choices: [
            'Le Grand Port maritime autonome de Toamasina',
            'La plus grande mine de fer',
            'Le plus grand aéroport de fret',
            'Le tunnel ferroviaire d’Ankatso',
          ],
          correctIndex: 0,
          explanation:
            'Le Port de Toamasina traite la grande majorité des échanges maritimes d’import-export de la Grande Île.',
        },
        {
          type: 'quiz',
          question:
            'Quel élément climatique domine le blason et le paysage de la province côtière de Toliara (Tuléar) ?',
          questionMg:
            'Inona ilay singa voajanahary mibahan-toerana eo amin’ny toetran’i Toliara ?',
          choices: [
            'Le soleil éclatant et généreux toute l’année (Cité du Soleil)',
            'Les chutes de neige en altitude',
            'Les pluies torrentielles permanentes',
            'Le brouillard d’automne',
          ],
          correctIndex: 0,
          explanation:
            'Toliara est surnommée la « Cité du Soleil » en raison de son ensoleillement exceptionnel et de son climat subaride chaleureux.',
        },
      ],
    },
    {
      slug: 'grandes-dates-fondatrices-et-memoire-nationale',
      title: 'Les Grandes Dates Fondatrices et la Mémoire Patriotique',
      titleMg: 'Vanin’andro Manan-tantara sy Fahatsiarovana ny Mahery Fo',
      summary:
        'Le sens des grandes dates commémoratives nationales : le 26 juin 1960 (Indépendance), le 14 octobre 1958 (République) et le 29 mars 1947 (Martyrs de la liberté).',
      summaryMg:
        'Ny lanjan’ireo daty manan-danja : 26 jona 1960, 14 oktobra 1958 ary ny 29 martsa 1947 nahafatesan’ireo mahery fo.',
      type: 'CULTURE',
      orderIndex: 6,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Les dates commémoratives ne sont pas de simples jours fériés : elles représentent les jalons sacrificiels et héroïques qui ont forgé la liberté, la dignité et la souveraineté de Madagascar. Se souvenir de nos martyrs et fondateurs est un devoir civique perpétuel.',
          textMg:
            'Ireo daty manan-tantara dia tsy andro fialan-tsasatra fotsiny : mariky ny tolona sy fandavan-tena ho an’ny fahafahan’i Madagasikara izy ireo.',
        },
        {
          type: 'concept',
          textFr:
            'Le 26 Juin 1960 — La Fête Nationale de l’Indépendance :\n• Après 64 ans de colonisation imposée en 1896, Madagascar recouvre sa souveraineté internationale ;\n• La proclamation solennelle a lieu au stade de Mahamasina à Antananarivo, devant une foule immense en liesse ;\n• Chaque 26 juin, les citoyens malgaches hissent le drapeau national, allument les lampions traditionnels (Arendrina) et partagent la fierté d’appartenir à une nation libre.',
          textMg:
            'Ny 26 jona 1960 : famerenana ny fiandrianam-pirenena teny Mahamasina. Fetim-pirenena ankalazaina amin’ny arendrina sy fanehoana ny saina.',
        },
        {
          type: 'concept',
          textFr:
            'Le 29 Mars 1947 — La Journée des Martyrs de la Liberté :\n• Soulèvement patriotique majeur contre l’ordre colonial, déclenché simultanément à Moramanga, Manakara et sur la côte Est ;\n• La répression coloniale féroce a causé des dizaines de milliers de victimes parmi le peuple malgache ;\n• Le 29 mars est un jour de recueillement national solennel en hommage aux résistants (MDRM, partisans) tombés pour la patrie.',
          textMg:
            'Ny 29 martsa 1947 : tolom-panafahana tamin’ny fanjanahan-tany nahafatesana mahery fo an’aliny. Andro fisaonana sy fanomezam-boninahitra azy ireo.',
        },
        {
          type: 'concept',
          textFr:
            'Le 14 Octobre 1958 — La Proclamation de la République :\n• À l’issue du vote positif au référendum de septembre 1958, les députés de l’Assemblée provinciale proclament la naissance de la République de Madagascar à Mahamasina ;\n• C’est ce jour précis qu’ont été adoptés le drapeau tricolore et l’hymne national.',
          textMg:
            'Ny 14 oktobra 1958 : nambara tamin’ny fomba ofisialy ny fijoroan’ny Repoblikan’i Madagasikara ary nolaniana ny saina sy hiram-pirenena.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'La tradition enfantine des lampions « Arendrina » allumés chaque veille du 26 juin remonte à des rites ancestraux du feu et du renouveau (Asaramanitra) réinvestis avec ferveur pour célébrer la lumière de la liberté retrouvée.',
          textMg:
            'Ny arendrina taratasy mirehitra jiro entin’ny ankizy ny alin’ny 25 jona dia fomba nentin-drazana maneho ny fahazavan’ny fahafahana.',
        },
        {
          type: 'quiz',
          question:
            'Que célèbre le peuple malgache chaque année lors de la Fête Nationale du 26 Juin ?',
          questionMg:
            'Inona no ankalazain’ny vahoaka malagasy isan-taona amin’ny Fetim-pirenena 26 Jona ?',
          choices: [
            'Le recouvrement de l’Indépendance nationale en 1960',
            'La fête des mères',
            'La découverte de l’île par les navigateurs portugais',
            'L’inauguration du canal des Pangalanes',
          ],
          correctIndex: 0,
          explanation:
            'Le 26 juin commémore la signature solennelle et la proclamation du retour à l’indépendance de Madagascar le 26 juin 1960.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le 29 Mars est-il un jour de commémoration solennelle dans toute la République de Madagascar ?',
          questionMg:
            'Nahoana no andro fahatsiarovana lehibe eto Madagasikara ny 29 Martsa ?',
          choices: [
            'En mémoire des martyrs et patriotes morts pour la liberté lors du soulèvement de 1947',
            'Pour célébrer le nouvel an astrologique',
            'Pour fêter la fin de la saison des pluies',
            'Pour marquer la rentrée parlementaire',
          ],
          correctIndex: 0,
          explanation:
            'Le 29 mars rend un hommage patriotique aux dizaines de milliers de combattants et civils malgaches morts lors de l’insurrection de 1947 pour libérer la patrie.',
        },
        {
          type: 'quiz',
          question:
            'Quel événement républicain historique s’est déroulé le 14 Octobre 1958 à Antananarivo ?',
          questionMg:
            'Inona ilay zava-nitranga manan-tantara tamin’ny 14 Oktobra 1958 teto Antananarivo ?',
          choices: [
            'La proclamation de la République de Madagascar et l’adoption du drapeau tricolore',
            'L’annexion coloniale de l’île',
            'L’élection du premier député européen',
            'Le couronnement de Radama Ier',
          ],
          correctIndex: 0,
          explanation:
            'Le 14 octobre 1958 marque la naissance institutionnelle de la République de Madagascar et l’adoption de ses emblèmes républicains.',
        },
        {
          type: 'quiz',
          question:
            'Où a eu lieu la cérémonie solennelle de proclamation de l’Indépendance le 26 juin 1960 ?',
          questionMg:
            'Taiza no nankalazana tamin’ny fomba manetriketrika ny fiverenan’ny fahaleovantena ny 26 jona 1960 ?',
          choices: [
            'Au Stade de Mahamasina à Antananarivo',
            'Sur la colline d’Ambohimanga',
            'Au port de Toamasina',
            'Au palais d’Ambohitsorohitra',
          ],
          correctIndex: 0,
          explanation:
            'La cérémonie historique de l’indépendance s’est tenue au grand stade de Mahamasina à Antananarivo, lieu emblématique des rassemblements nationaux.',
        },
        {
          type: 'quiz',
          question:
            'Quel symbole lumineux populaire les enfants malgaches promènent-ils la nuit du 25 juin pour célébrer la liberté ?',
          questionMg:
            'Inona ilay kilalao misy hazavana entin’ny ankizy mandehandeha ny alin’ny 25 jona ?',
          choices: [
            'Les lampions artisanaux colorés (Arendrina)',
            'Des torches de feu de bois',
            'Des feux de détresse maritimes',
            'Des bougies éteintes',
          ],
          correctIndex: 0,
          explanation:
            'La ronde des « Arendrina » (lampions de papier coloré éclairés d’une bougie) est la tradition festive lumineuse par excellence de la fête nationale malgache.',
        },
      ],
    },
  ],
};
