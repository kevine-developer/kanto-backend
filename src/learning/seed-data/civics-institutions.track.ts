import { SeedTrack } from './seed.types.js';

/**
 * Parcours complet : Citoyenneté, Institutions & Valeurs Républicaines
 * (Fanabeazana Olom-pirenena sy Andrim-panjakana)
 *
 * Intègre et valorise l'intégralité des 77 ressources civiques de Kanto :
 * - Symboles nationaux (Drapeau du 14 octobre 1958, Hymne national, Devise, Sceaux)
 * - Institutions démocratiques (Présidence, Gouvernement, Assemblée, Sénat, Justice, HCC)
 * - Décentralisation et administration de proximité (Régions, Communes, Fokontany)
 * - Droits fondamentaux et droits de l'enfant (libertés publiques, état civil, éducation)
 * - Devoirs civiques et contribution fiscale (impôts, intégrité, lutte contre la corruption)
 * - Vote, démocratie et processus électoral (CENI, carte électorale, isoloir)
 * - Vivre-ensemble (Fihavanana républicain, Valin-tanana, écologie civique, lutte contre les feux de brousse)
 */
export const civicsInstitutionsTrack: SeedTrack = {
  slug: 'citoyennete-institutions-et-democratie',
  title: 'Citoyenneté, Institutions & Valeurs Républicaines',
  titleMg: 'Fanabeazana Olom-pirenena sy Andrim-panjakana',
  description:
    'Comprendre les symboles républicains, le fonctionnement des institutions malgaches, vos droits et devoirs constitutionnels, et les valeurs du Fihavanana dans la cité.',
  descriptionMg:
    'Fahalalana ny mari-pirenena, ny fiasan’ny andrim-panjakana, ny zo sy adidin’ny olom-pirenena ary ny soatoavina iombonana.',
  level: 'BEGINNER',
  icon: 'Landmark',
  color: '#C58B38',
  orderIndex: 12,
  estimatedMinutes: 120,
  lessons: [
    {
      slug: 'symboles-nationaux-et-identite-republicaine',
      title: 'Les Symboles de la Nation et l’Identité Républicaine',
      titleMg: 'Marika sy Sainan’i Madagasikara',
      summary:
        'Origine et signification profonde du drapeau tricolore, de l’hymne national Ry Tanindrazanay Malala, de la devise et des sceaux officiels de la République.',
      summaryMg:
        'Tantaran’ny sainam-pirenena, ny hiram-pirenena, ny teny filamatra ary ny tombo-kase ofisialy.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Les symboles nationaux incarnent la souveraineté, l’histoire et l’unité de tout le peuple malgache. Issus de la proclamation de la République le 14 octobre 1958, ils transcendent les divergences régionales et politiques pour rassembler chaque citoyen sous une même bannière de fierté et de concorde.',
          textMg:
            'Ny mari-pirenena dia maneho ny fiandrianana, ny tantara ary ny firaisankinan’ny vahoaka malagasy rehetra. Natsangana tamin’ny fanehoana ny Repoblika ny 14 oktobra 1958 izy ireo mba ho marika iombonana sy fireharehana.',
        },
        {
          type: 'concept',
          textFr:
            'Le drapeau tricolore malgache (Blanc, Rouge, Vert) a été officiellement adopté le 14 octobre 1958. Sa composition chromatique porte une puissante symbolique :\n• Le Blanc (Fotsy) représente la pureté morale, l’honnêteté et le riz, aliment nourricier sacré.\n• Le Rouge (Mena) rappelle la souveraineté historique, l’argile des maisons traditionnelles et le lamba des souverains mérinas.\n• Le Vert (Maitso) incarne l’espérance, l’agriculture florissante et les populations de la côte et des forêts.',
          textMg:
            'Ny sainam-pirenena fotsy, mena, maitso dia nolaniana tamin’ny 14 oktobra 1958 : ny fotsy dia fahadiovana sy ny vary, ny mena dia fiandrianana sy ny tany mena, ny maitso dia fanantenana sy ny morontsiraka lonaka.',
        },
        {
          type: 'concept',
          textFr:
            'L’hymne national « Ry Tanindrazanay Malala » (Ô notre Patrie bien-aimée) a été composé par Norbert Raharisoa sur des paroles écrites par le pasteur Rahajason. Véritable prière patriotique, il invoque la bénédiction du Créateur (Zanahary) sur la terre des ancêtres et appelle les citoyens à l’amour mutuel (Mifankatiava) et à la concorde fraternelle.',
          textMg:
            'Ny hiram-pirenena « Ry Tanindrazanay Malala » dia noforonin’i Norbert Raharisoa ny feony ary ny Pastora Rahajason ny tonony. Vavaka ho an’ny tanindrazana sy antso ho amin’ny fifankatiavana izy.',
        },
        {
          type: 'concept',
          textFr:
            'La devise nationale actuelle de la IVe République est : « Fitiavana - Tanindrazana - Fandrosoana » (Amour - Patrie - Progrès). Elle figure au centre du Sceau de l’État aux côtés de la tête de zébu stylisée, des rameaux de palmier et de l’Arbre du Voyageur (Ravinala).',
          textMg:
            'Ny teny filamatry ny Repoblika faha-IV dia « Fitiavana - Tanindrazana - Fandrosoana ». Hita ao anatin’ny tombo-kasem-panjakana miaraka amin’ny lohan’omby sy ny ravinala izy.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Lors de l’exécution de l’hymne national ou de la levée des couleurs, la tradition républicaine et le respect civique commandent de se tenir debout, immobile, le regard tourné vers le drapeau, en signe d’honneur solennel à la patrie.',
          textMg:
            'Rehefa hiraina ny hiram-pirenena na ampidinina/akarina ny saina, ny fomba amam-panao repoblikana dia mitaky fijoroana mahitsy amim-panajana manatrika ny saina.',
        },
        {
          type: 'quiz',
          question:
            'À quelle date le drapeau tricolore malgache actuel a-t-il été officiellement adopté ?',
          questionMg:
            'Firy ny daty nolaniana tamin’ny fomba ofisialy ny sainam-pirenena malagasy ankehitriny ?',
          choices: [
            'Le 14 octobre 1958 (lors de la proclamation de la République)',
            'Le 26 juin 1960',
            'Le 29 mars 1947',
            'Le 1er janvier 1975',
          ],
          correctIndex: 0,
          explanation:
            'Le drapeau tricolore a été adopté le 14 octobre 1958, jour de la proclamation de la République de Madagascar, avant même la proclamation de l’indépendance en 1960.',
        },
        {
          type: 'quiz',
          question:
            'Qui sont les auteurs respectifs des paroles et de la musique de l’hymne « Ry Tanindrazanay Malala » ?',
          questionMg:
            'Iza avy ireo nanoratra ny tonony sy namorona ny feon’ny hiram-pirenena « Ry Tanindrazanay Malala » ?',
          choices: [
            'Paroles du pasteur Rahajason et musique de Norbert Raharisoa',
            'Paroles de Jean-Joseph Rabearivelo et musique de Ratany',
            'Paroles de Philibert Tsiranana et musique de Dama',
            'Paroles de Jacques Rabemananjara et musique de Justin Rajoro',
          ],
          correctIndex: 0,
          explanation:
            'Les paroles de l’hymne national ont été composées par le pasteur Rahajason et la musique a été harmonisée par Norbert Raharisoa en 1958.',
        },
        {
          type: 'quiz',
          question:
            'Que symbolise la couleur blanche (Fotsy) sur le drapeau national de Madagascar ?',
          questionMg:
            'Inona no hevitry ny loko fotsy eo amin’ny sainam-pirenena malagasy ?',
          choices: [
            'La pureté morale, l’honnêteté et le riz, aliment nourricier sacré',
            'Les montagnes rocheuses de l’Ankaratra',
            'L’écume de l’océan Indien',
            'La neutralité diplomatique internationale',
          ],
          correctIndex: 0,
          explanation:
            'Le blanc incarne la pureté morale, l’honnêteté (fahitsiana) et la céréale nourricière sacrée de tous les Malgaches : le riz (vary).',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la devise officielle actuelle de la République de Madagascar (IVe République) ?',
          questionMg:
            'Inona ny teny filamatra ofisialin’ny Repoblikan’i Madagasikara ankehitriny ?',
          choices: [
            'Fitiavana - Tanindrazana - Fandrosoana (Amour - Patrie - Progrès)',
            'Tanindrazana - Tolom-piavotana - Fahafahana',
            'Tanindrazana - Fahafahana - Fandrosoana',
            'Fihavanana - Fahamarinana - Fampandrosoana',
          ],
          correctIndex: 0,
          explanation:
            'La devise de la IVe République adoptée par la Constitution de 2010 est « Fitiavana - Tanindrazana - Fandrosoana » (Amour - Patrie - Progrès).',
        },
        {
          type: 'quiz',
          question:
            'Quel arbre emblématique malgache figure en arrière-plan du Sceau de l’État ?',
          questionMg:
            'Inona ilay hazo malagasy malaza hita ao anatin’ny tombo-kasem-panjakana ?',
          choices: [
            'L’Arbre du Voyageur (Ravinala / Ravenala madagascariensis)',
            'Le Baobab Grandidier',
            'Le Jacaranda bleu',
            'Le Palissandre de Madagascar',
          ],
          correctIndex: 0,
          explanation:
            'Le Sceau officiel de la République comporte l’Arbre du Voyageur (Ravinala) stylisé en éventail derrière la tête de zébu.',
        },
      ],
    },
    {
      slug: 'constitution-et-fondements-de-la-republique',
      title: 'La Constitution et les Fondements de l’État Malgache',
      titleMg: 'Lalàm-panorenana sy ny Repoblika',
      summary:
        'La loi fondamentale régissant Madagascar : souveraineté du peuple, séparation des pouvoirs, laïcité de l’État et égalité de tous devant la loi.',
      summaryMg:
        'Ny lalàna fara-tampony : fiandrianam-bahoaka, fizarazarana ny fahefana, fanjakana tsy mirona amin’ny fivavahana.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'La Constitution est la loi suprême de la République de Madagascar. Aucune loi ordinaire, aucun décret ni aucune décision administrative ne peut la contredire. Elle fixe les règles du vivre-ensemble, garantit les droits inaliénables de la personne humaine et organise les institutions démocratiques.',
          textMg:
            'Ny Lalàm-panorenana no lalàna fara-tampony eto amin’ny firenena. Izy no mametraka ny fitsipika mifehy ny fiarahamonina sy miaro ny zon’ny olombelona tsirairay.',
        },
        {
          type: 'concept',
          textFr:
            'Selon la Constitution, la souveraineté nationale appartient au peuple malgache, qui l’exerce directement par la voie du référendum ou indirectement par l’intermédiaire de ses représentants élus (députés, président, maires). Nul individu ni aucune faction ne peut s’en attribuer l’exercice exclusif.',
          textMg:
            'Ny fiandrianam-pirenena dia an’ny vahoaka malagasy, izay mampihatra izany amin’ny alalan’ny fitsapan-kevi-bahoaka na amin’ny solontena lany.',
        },
        {
          type: 'concept',
          textFr:
            'L’État malgache repose sur le principe démocratique fondamental de la séparation des pouvoirs :\n1. Le pouvoir exécutif (Président et Gouvernement) qui conduit la politique générale et applique les lois ;\n2. Le pouvoir législatif (Assemblée Nationale et Sénat) qui délibère et vote les lois républicaines ;\n3. Le pouvoir judiciaire (cours et tribunaux) qui applique le droit en toute indépendance.',
          textMg:
            'Miorina amin’ny fizarazarana fahefana telo ny fanjakana : ny Mpanatanteraka (Mampihatra), ny Mpanao lalàna (Mandany lalàna), ary ny Mpitsara (Manoa ny rariny).',
        },
        {
          type: 'concept',
          textFr:
            'La Constitution affirme la laïcité de l’État malgache. Cette laïcité garantit la stricte neutralité de l’administration publique à l’égard de toutes les religions et croyances, tout en assurant à chaque citoyen la liberté absolue de conscience et de culte.',
          textMg:
            'Ny Fanjakana dia tsy mirona amin’ny fivavahana manokana (laïcité). Manaja ny finoana rehetra izy ary miantoka ny fahafahan’ny tsirairay mivavaka na tsia.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Madagascar a connu quatre Républiques depuis 1958 : la Ire République (1958-1972), la IIe République démocratique (1975-1992), la IIIe République (1992-2010) et la IVe République (promulguée le 11 décembre 2010 suite au référendum constitutionnel).',
          textMg:
            'Efa nandalo Repoblika efatra i Madagasikara : Repoblika I (1958-1972), Repoblika II (1975-1992), Repoblika III (1992-2010) ary Repoblika IV nanomboka tamin’ny 2010.',
        },
        {
          type: 'quiz',
          question:
            'À qui appartient légalement la souveraineté nationale selon la Constitution de Madagascar ?',
          questionMg:
            'Araka ny Lalàm-panorenana, an’iza ny fiandrianam-pirenena eto Madagasikara ?',
          choices: [
            'Au peuple malgache tout entier',
            'Exclusivement au Président de la République',
            'Aux chefs traditionnels et notables',
            'À l’Assemblée Nationale seule',
          ],
          correctIndex: 0,
          explanation:
            'La Constitution dispose formellement que la souveraineté nationale appartient au peuple malgache, source unique de toute légitimité démocratique.',
        },
        {
          type: 'quiz',
          question:
            'Quels sont les trois pouvoirs constitutionnels distincts qui garantissent la démocratie malgache ?',
          questionMg:
            'Inona ireo fahefana telo miavaka miantoka ny rafitra repoblikana ?',
          choices: [
            'Le pouvoir exécutif, le pouvoir législatif et le pouvoir judiciaire',
            'L’armée, la police et la gendarmerie',
            'Les ministres, les gouverneurs et les maires',
            'Le Sénat, le Fokontany et la presse',
          ],
          correctIndex: 0,
          explanation:
            'La démocratie repose sur la séparation tripartite des pouvoirs : l’exécutif (dirige), le législatif (vote les lois) et le judiciaire (juge en toute indépendance).',
        },
        {
          type: 'quiz',
          question:
            'Que signifie le principe républicain de laïcité de l’État à Madagascar ?',
          questionMg:
            'Inona no dikan’ny hoe fanjakana laîka (laïcité) eto Madagasikara ?',
          choices: [
            'L’État est neutre envers toutes les religions et garantit la liberté de culte de chacun',
            'L’interdiction de toute pratique religieuse dans le pays',
            'L’obligation d’adopter une religion officielle d’État',
            'Le financement exclusif d’une seule confession par les impôts',
          ],
          correctIndex: 0,
          explanation:
            'La laïcité implique la neutralité républicaine des services publics et assure à chaque citoyen le libre choix de sa foi et de ses convictions.',
        },
        {
          type: 'quiz',
          question:
            'En quelle année a été promulguée la Constitution instaurant la IVe République de Madagascar ?',
          questionMg:
            'Tamin’ny taona firy no nolaniana ny Lalàm-panorenana mifehy ny Repoblika faha-IV ?',
          choices: [
            'En 2010 (promulguée le 11 décembre 2010)',
            'En 1960',
            'En 1975',
            'En 1992',
          ],
          correctIndex: 0,
          explanation:
            'La Constitution de la IVe République a été adoptée par référendum en novembre 2010 et promulguée solennellement le 11 décembre 2010.',
        },
        {
          type: 'quiz',
          question:
            'Que se passe-t-il si une loi votée par le Parlement contredit la Constitution ?',
          questionMg:
            'Inona no mitranga raha misy lalàna lany mifanohitra amin’ny Lalàm-panorenana ?',
          choices: [
            'Elle est déclarée non conforme par la HCC et ne peut pas entrer en vigueur',
            'Elle remplace automatiquement la Constitution',
            'Elle est appliquée uniquement dans les zones rurales',
            'Le maire décide seul de son application',
          ],
          correctIndex: 0,
          explanation:
            'La Haute Cour Constitutionnelle (HCC) censure toute disposition contraire à la Constitution, garantissant ainsi la suprématie de la loi fondamentale.',
        },
      ],
    },
    {
      slug: 'pouvoir-executif-president-et-gouvernement',
      title: 'Le Pouvoir Exécutif : Président et Gouvernement',
      titleMg: 'Ny Fahefana Mpanatanteraka',
      summary:
        'Le rôle constitutionnel du Président de la République (Chef de l’État), du Premier Ministre (Chef du Gouvernement) et des ministères sectoriels.',
      summaryMg:
        'Ny andraikitry ny Filoham-pirenena, ny Praiminisitra ary ireo Minisitra mpiara-miasa aminy.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Le pouvoir exécutif est le moteur de l’action publique. Il conçoit les politiques nationales de développement, veille à la sécurité du territoire, gère les relations diplomatiques et assure l’exécution quotidienne des lois votées par les représentants du peuple.',
          textMg:
            'Ny fahefana mpanatanteraka no mitondra ny fampandrosoana, miantoka ny filaminana ary mampihatra ny lalàna lany eo anivon’ny firenena.',
        },
        {
          type: 'concept',
          textFr:
            'Le Président de la République est le Chef de l’État. Élu au suffrage universel direct pour un mandat de cinq ans renouvelable une seule fois :\n• Il est le garant suprême de la Constitution, de l’intégrité territoriale et de l’unité nationale ;\n• Il est le Chef Suprême des Forces Armées malgaches ;\n• Il accrédite les ambassadeurs et ratifie les traités internationaux ;\n• Il dispose du droit de grâce.',
          textMg:
            'Ny Filoham-pirenena no lehiben’ny Fanjakana, lany amin’ny fifidianana andraisan’ny rehetra anjara mandritra ny 5 taona. Izy no mpiantoka ny fiandrianana sy lehiben’ny Foloalindahy.',
        },
        {
          type: 'concept',
          textFr:
            'Le Premier Ministre est le Chef du Gouvernement. Nommé par le Président de la République sur proposition du parti ou groupe de partis majoritaire à l’Assemblée Nationale :\n• Il dirige l’action du Gouvernement et coordonne les ministères ;\n• Il est responsable devant le Parlement de la mise en œuvre de la Politique Générale de l’État (PGE) ;\n• Il exerce le pouvoir réglementaire en signant les décrets d’application.',
          textMg:
            'Ny Praiminisitra no lehiben’ny Governemanta, atolotry ny maro an’isa ao amin’ny Antenimierampirenena. Izy no mitarika ny asan’ireo minisitra sy mandrindra ny fampiharana ny lalàna.',
        },
        {
          type: 'concept',
          textFr:
            'Les ministères constituent les bras opérationnels de l’État : le Ministère de l’Éducation Nationale garantit la scolarisation de la jeunesse, le Ministère de la Santé Publique organise les hôpitaux et centres CSB, et le Ministère de l’Intérieur et de la Décentralisation assure l’administration du territoire.',
          textMg:
            'Ireo Minisitra isan-tsokajiny (Fanabeazana, Fahasalamana, Atitany) no mpanatanteraka mivantana ny fandaharan’asa ho an’ny vahoaka manerana ny Nosy.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le premier Président de la République de Madagascar fut Philibert Tsiranana, élu en 1959 par un collège électoral, puis réélu au suffrage direct. Il était surnommé « le père de l’indépendance » malgache.',
          textMg:
            'I Philibert Tsiranana no Filoham-pirenena voalohany tamin’ny 1959. Nomena ny solon’anarana hoe « Rain’ny Fahaleovantena » izy.',
        },
        {
          type: 'quiz',
          question:
            'Pour quelle durée le Président de la République de Madagascar est-il élu au suffrage universel direct ?',
          questionMg:
            'Hafiriana ny faharetan’ny fe-potoam-piasan’ny Filoham-pirenena lany amin’ny fifidianana ?',
          choices: [
            '5 ans (renouvelable une seule fois consécutivement)',
            '7 ans renouvelable indéfiniment',
            '4 ans non renouvelable',
            '3 ans renouvelable deux fois',
          ],
          correctIndex: 0,
          explanation:
            'La Constitution malgache fixe le mandat présidentiel à 5 ans, renouvelable une seule fois de manière consécutive.',
        },
        {
          type: 'quiz',
          question:
            'Comment est nommé le Premier Ministre, Chef du Gouvernement, à Madagascar ?',
          questionMg:
            'Ahoana no fomba fanendrena ny Praiminisitra Lehiben’ny Governemanta ?',
          choices: [
            'Nommé par le Président sur proposition du parti ou groupe majoritaire à l’Assemblée Nationale',
            'Élu directement par le vote des citoyens lors d’une élection séparée',
            'Désigné au tirage au sort parmi les sénateurs',
            'Nommé par le doyen d’âge de la Cour Suprême',
          ],
          correctIndex: 0,
          explanation:
            'Le Président nomme le Premier Ministre sur présentation de la majorité parlementaire siégeant à l’Assemblée Nationale.',
        },
        {
          type: 'quiz',
          question:
            'Quelle fonction républicaine fait du Président de la République le responsable suprême de la défense nationale ?',
          questionMg:
            'Inona ny anjara toeran’ny Filoham-pirenena eo amin’ny fiarovana ny tanindrazana ?',
          choices: [
            'Chef Suprême des Forces Armées (Foloalindahy)',
            'Général de brigade honoraire',
            'Ministre délégué aux frontières',
            'Préfet de police national',
          ],
          correctIndex: 0,
          explanation:
            'Le Président de la République est le Chef Suprême des Forces Armées malgaches (Tafika Malagasy / Foloalindahy).',
        },
        {
          type: 'quiz',
          question:
            'Devant quelle institution le Premier Ministre doit-il présenter son programme et la Politique Générale de l’État (PGE) ?',
          questionMg:
            'Eo anatrehan’ny andrim-panjakana iza no tsy maintsy anoloran’ny Praiminisitra ny fandaharan’asany (PGE) ?',
          choices: [
            'L’Assemblée Nationale (Parlement)',
            'La Mairie d’Antananarivo',
            'Le Conseil des églises FFKM',
            'L’Académie Malgache',
          ],
          correctIndex: 0,
          explanation:
            'Le Premier Ministre engage la responsabilité de son gouvernement en présentant la Politique Générale de l’État devant les députés à l’Assemblée Nationale.',
        },
        {
          type: 'quiz',
          question:
            'Qui signe les décrets d’application nécessaires pour faire appliquer concrètement une loi sur le terrain ?',
          questionMg:
            'Iza no manao sonia ny didim-panjakana (décrets) mampihatra ny lalàna ?',
          choices: [
            'Le Premier Ministre et les ministres responsables',
            'Le Président de l’Assemblée Nationale uniquement',
            'Le chef de district local',
            'Les huissiers de justice',
          ],
          correctIndex: 0,
          explanation:
            'Le Premier Ministre détient le pouvoir réglementaire et signe les décrets d’application, contresignés par les ministres sectoriels concernés.',
        },
      ],
    },
    {
      slug: 'pouvoir-legislatif-assemblee-et-senat',
      title: 'Le Pouvoir Législatif : Assemblée Nationale et Sénat',
      titleMg: 'Ny Antenimiera sy ny Solombavambahoaka',
      summary:
        'Le fonctionnement du Parlement bicaméral malgache : fabrication des lois républicaines, contrôle de l’exécutif et représentation des citoyens et des territoires.',
      summaryMg:
        'Ny fiasan’ny Parlemanta ahitana ny Antenimierampirenena sy ny Antenimierandoholona.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Le Parlement malgache est bicaméral : il est composé de deux chambres complémentaires, l’Assemblée Nationale (chambre basse siégeant à Tsimbazaza) et le Sénat (chambre haute siégeant à Anosikely). Ensemble, ils représentent la nation, votent les lois et veillent à l’équilibre démocratique.',
          textMg:
            'Ny Parlemanta malagasy dia misy Antenimiera roa : ny Antenimierampirenena eny Tsimbazaza sy ny Antenimierandoholona eny Anosikely, miara-miasa amin’ny fandinihana sy fandaniana lalàna.',
        },
        {
          type: 'concept',
          textFr:
            'L’Assemblée Nationale est composée de Députés (Solombavambahoaka) élus au suffrage universel direct pour un mandat de 5 ans :\n• Les députés représentent la souveraineté directe du peuple malgache ;\n• Ils examinent les projets de loi émanant du Gouvernement et déposent des propositions de loi ;\n• Ils votent chaque année la Loi de Finances (le budget national de l’État) ;\n• Ils contrôlent le Gouvernement par des questions orales et peuvent voter une motion de censure.',
          textMg:
            'Ny Solombavambahoaka dia lany mivantana amin’ny alalan’ny vahoaka. Mandinika sy mandany ny lalàna izy ireo ary manara-maso ny fandaniana ny volam-panjakana.',
        },
        {
          type: 'concept',
          textFr:
            'Le Sénat (Antenimierandoholona) représente les Collectivités Territoriales Décentralisées (Régions et Communes). Ses membres, les Sénateurs, sont pour partie élus par les grands électeurs (maires et conseillers municipaux) et pour partie désignés par le Président de la République en raison de leurs compétences économiques, sociales et culturelles.',
          textMg:
            'Ny Antenimierandoholona kosa dia misolo tena ny vondrom-bahoaka itsinjaram-pahefana (Kaominina sy Faritra) ary mitondra fomba fijery voalanjalanja amin’ny lalàna.',
        },
        {
          type: 'concept',
          textFr:
            'Le cheminement d’une loi (navette parlementaire) : le texte est d’abord examiné en commission spécialisée, débattu publiquement en séance plénière à l’Assemblée, transmis au Sénat, puis, après adoption finale, soumis au contrôle de conformité constitutionnelle de la HCC avant d’être promulgué par le Président et publié au Journal Officiel (JORM).',
          textMg:
            'Lalana lalovan’ny lalàna : dinihina ao anaty vaomiera, iadian-kevitra ampahibemaso, lany, jerena ao amin’ny HCC, ary avoakan’ny Filoha amin’ny Gazetim-panjakana.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le palais de Tsimbazaza qui abrite l’Assemblée Nationale possède une riche valeur historique : il a accueilli les débats républicains majeurs de Madagascar depuis l’indépendance de 1960.',
          textMg:
            'Ny lapam-panjakana eny Tsimbazaza no foiben’ny fivorian’ny solombavambahoaka nanomboka tamin’ny nahazoana ny fahaleovantena.',
        },
        {
          type: 'quiz',
          question:
            'Où siège l’Assemblée Nationale de la République de Madagascar ?',
          questionMg:
            'Aiza no misy ny foiben-toeran’ny Antenimierampirenena eto Madagasikara ?',
          choices: [
            'Au Palais de Tsimbazaza à Antananarivo',
            'Au Palais d’Anosikely',
            'Au Palais d’Iavoloha',
            'À la Haute Cour d’Ambohidahy',
          ],
          correctIndex: 0,
          explanation:
            'L’Assemblée Nationale siège traditionnellement au Palais de Tsimbazaza, tandis que le Sénat siège au Palais d’Anosikely.',
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on en malgache les députés élus siégeant à l’Assemblée Nationale ?',
          questionMg:
            'Ahoana no fiantsoana amin’ny teny malagasy ireo mpikambana ao amin’ny Antenimierampirenena ?',
          choices: [
            'Solombavambahoaka',
            'Loholona',
            'Mpanolotsaina monisipaly',
            'Mpitsara fototra',
          ],
          correctIndex: 0,
          explanation:
            'Les députés sont appelés « Solombavambahoaka » (les voix/représentants du peuple), tandis que les sénateurs sont appelés « Loholona » (les aînés/sages).',
        },
        {
          type: 'quiz',
          question:
            'Qui le Sénat (Antenimierandoholona) représente-t-il spécifiquement au sein du Parlement ?',
          questionMg:
            'Iza no soloin’ny Antenimierandoholona tena manokana eo amin’ny rafitry ny fanjakana ?',
          choices: [
            'Les Collectivités Territoriales Décentralisées (Communes et Régions)',
            'Les entreprises étrangères uniquement',
            'Les ambassades et consulats',
            'Les syndicats d’étudiants seuls',
          ],
          correctIndex: 0,
          explanation:
            'Le Sénat assure la représentation des Collectivités Territoriales Décentralisées (les Communes et les Régions de Madagascar).',
        },
        {
          type: 'quiz',
          question:
            'Quelle loi essentielle fixe chaque année les recettes et les dépenses de l’ensemble de l’État malgache ?',
          questionMg:
            'Inona ilay lalàna lehibe lany isan-taona mamaritra ny fidiram-bola sy fandaniana rehetra ho an’ny fanjakana ?',
          choices: [
            'La Loi de Finances (Lalàna mifehy ny Tetibolam-panjakana)',
            'Le Code civil',
            'Le Code de la route',
            'Le décret de décentralisation',
          ],
          correctIndex: 0,
          explanation:
            'La Loi de Finances annuelle détermine le budget global de l’État : investissements dans les hôpitaux, écoles, routes et salaires des agents publics.',
        },
        {
          type: 'quiz',
          question:
            'Dans quel document officiel une loi doit-elle être publiée pour devenir applicable à tous les citoyens ?',
          questionMg:
            'Ao amin’ny tahirin-kevitra ofisialy inona no tsy maintsy amoahana ny lalàna mba ho manan-kery ho an’ny rehetra ?',
          choices: [
            'Le Journal Officiel de la République de Madagascar (JORM)',
            'Dans les journaux d’annonces privées',
            'Sur les réseaux sociaux uniquement',
            'Au tableau de la mairie uniquement',
          ],
          correctIndex: 0,
          explanation:
            'La promulgation par le Président et la publication au Journal Officiel (Gazetim-panjakan’ny Repoblikan’i Madagasikara) rendent la loi exécutoire sur tout le territoire.',
        },
      ],
    },
    {
      slug: 'justice-hcc-et-etat-de-droit',
      title: 'La Justice, la HCC et l’État de Droit',
      titleMg: 'Ny Fitsarana sy ny Fanjakana Tan-dalàna',
      summary:
        'L’indépendance de la Justice, le rôle de la Haute Cour Constitutionnelle, les magistrats, avocats, huissiers et la garantie d’un procès équitable.',
      summaryMg:
        'Ny fahaleovantenan’ny fitsarana, ny HCC eny Ambohidahy, ary ny fiarovana ny zon’ny olona tsaraina.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'L’État de droit (Fanjakana tan-dalàna) signifie que personne, du plus simple citoyen au plus haut dirigeant, n’est au-dessus des lois. La Justice protège les faibles, règle les différends en toute neutralité et réprime les infractions pour maintenir la paix sociale.',
          textMg:
            'Ny fanjakana tan-dalàna dia midika fa mitovy avokoa ny olom-pirenena rehetra eo anatrehan’ny lalàna, ary ny fitsarana no mandamina ny fifanolanana.',
        },
        {
          type: 'concept',
          textFr:
            'La Haute Cour Constitutionnelle (HCC), qui siège à Ambohidahy (Antananarivo) :\n• Contrôle la conformité des lois avec la Constitution avant leur promulgation ;\n• Statue sur le contentieux des élections présidentielles et législatives et proclame les résultats officiels définitifs ;\n• Régule le fonctionnement équilibré des institutions de la République.',
          textMg:
            'Ny Fitsarana Avo momba ny Lalàm-panorenana (HCC) eny Ambohidahy no miantoka ny fanajana ny Lalàm-panorenana sy manambara ny voka-pifidianana ofisialy.',
        },
        {
          type: 'concept',
          textFr:
            'L’organisation judiciaire malgache comprend :\n1. Les Tribunaux de Première Instance (TPI) présents dans les grandes villes pour juger les affaires civiles et pénales ;\n2. Les Cours d’Appel qui réexaminent les jugements contestés ;\n3. La Cour Suprême (Cour de Cassation, Conseil d’État, Cour des Comptes) qui unifie l’interprétation du droit.',
          textMg:
            'Ahitana ny Fitsarana Ambaratonga Voalohany (TPI), ny Fitsarana Fandravana (Cour d’Appel) ary ny Fitsarana Tampony (Cour Suprême).',
        },
        {
          type: 'concept',
          textFr:
            'Les acteurs de la Justice et les garanties citoyennes :\n• Le Juge (Mpitsara) tranche en toute impartialité selon la loi ;\n• Le Ministère Public / Procureur (Mpampanoa lalàna) défend l’intérêt général de la société ;\n• L’Avocat assiste et défend le justiciable ;\n• L’Huissier de justice (Mpanatanteraka didy) notifie les actes et exécute les décisions judiciaires ;\n• Tout citoyen bénéficie de la présomption d’innocence et du droit à un procès public et équitable.',
          textMg:
            'Manana zo ho henoina sy harovana amin’ny alalan’ny mpisolovava ny olona tsirairay. Heverina ho tsy manan-tsiny izy mandra-paha-voaporofo ny helony.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'La colline d’Ambohidahy à Antananarivo est historiquement surnommée la « colline de la sagesse constitutionnelle », car la HCC y garantit depuis des décennies la continuité démocratique de l’État malgache.',
          textMg:
            'Ny havoanan’Ambohidahy dia fantatry ny Malagasy rehetra ho toeran’ny fahendrena mpiaro ny Lalàm-panorenana.',
        },
        {
          type: 'quiz',
          question:
            'Quelle institution suprême est chargée de proclamer les résultats officiels de l’élection présidentielle à Madagascar ?',
          questionMg:
            'Inona ny andrim-panjakana manambara amin’ny fomba ofisialy ny voka-pifidianana Filoham-pirenena ?',
          choices: [
            'La Haute Cour Constitutionnelle (HCC)',
            'Le Ministère de la Communication',
            'La Mairie de la capitale',
            'La Fédération des magistrats retraités',
          ],
          correctIndex: 0,
          explanation:
            'La Haute Cour Constitutionnelle (HCC) est l’unique juridiction habilitée à statuer sur les recours électoraux et à proclamer les résultats définitifs de l’élection présidentielle.',
        },
        {
          type: 'quiz',
          question:
            'Que garantit le principe fondamental de la « présomption d’innocence » pour un citoyen accusé d’une infraction ?',
          questionMg:
            'Inona no hevitry ny hoe « heverina ho tsy manan-tsiny » (présomption d’innocence) ?',
          choices: [
            'Une personne est considérée innocente tant que sa culpabilité n’a pas été légalement prouvée par un tribunal',
            'L’accusé n’a jamais le droit d’avoir un avocat',
            'Le juge doit toujours condamner avant d’enquêter',
            'La culpabilité est automatique dès la garde à vue',
          ],
          correctIndex: 0,
          explanation:
            'La présomption d’innocence est un droit fondamental garanti par la Constitution : toute personne est innocente jusqu’à preuve légale du contraire.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle du Ministère Public incarné par le Procureur de la République ?',
          questionMg:
            'Inona ny andraikitry ny Mpampanoa Lalàna (Procureur de la République) ?',
          choices: [
            'Défendre l’intérêt de la société et veiller à l’application des lois pénales',
            'Défendre uniquement les accusés',
            'Rédiger les contrats de vente de terrain',
            'Fixer le taux des impôts communaux',
          ],
          correctIndex: 0,
          explanation:
            'Le procureur de la République représente la société civile dans son ensemble : il engage les poursuites pénales pour protéger l’ordre public.',
        },
        {
          type: 'quiz',
          question:
            'Quel officier ministériel assermenté est chargé de délivrer les convocations et de faire exécuter les jugements rendus ?',
          questionMg:
            'Iza ilay manampahefana mpanoa didy manatitra ny fiantsoana sy mampihatra ny didim-pitsarana ?',
          choices: [
            'L’Huissier de Justice',
            'Le Médecin légiste',
            'Le Secrétaire de mairie',
            'Le Commissaire aux comptes',
          ],
          correctIndex: 0,
          explanation:
            'L’Huissier de justice est l’auxiliaire de justice assermenté chargé de signifier les actes et de veiller à l’exécution concrète des décisions de justice.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi l’indépendance de la Justice est-elle un pilier fondamental de la République ?',
          questionMg:
            'Nahoana no zava-dehibe ny fahaleovantenan’ny mpitsara eo amin’ny tany repoblikana ?',
          choices: [
            'Pour juger sans pression politique ni favoritisme, en appliquant strictement la loi',
            'Pour permettre aux juges d’ignorer la Constitution',
            'Pour remplacer le Parlement dans le vote des lois',
            'Pour supprimer le rôle des avocats',
          ],
          correctIndex: 0,
          explanation:
            'L’indépendance du magistrat garantit que les jugements sont rendus avec équité, sans influence extérieure, assurant la confiance du public en l’État de droit.',
        },
      ],
    },
    {
      slug: 'decentralisation-et-fokontany',
      title:
        'La Décentralisation, les Collectivités et le Rôle Clé du Fokontany',
      titleMg: 'Ny Fitsinjaram-pahefana sy ny Fokontany',
      summary:
        'L’organisation administrative locale à Madagascar : Régions, Communes et le Fokontany, cellule fondamentale de la vie citoyenne et de la solidarité de quartier.',
      summaryMg:
        'Ny fandaminana ara-pitantanana : Faritra, Kaominina ary ny Fokontany ifaharan’ny fiaraha-monina.',
      type: 'CULTURE',
      orderIndex: 6,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'La décentralisation rapproche le pouvoir décisionnel des citoyens. À Madagascar, le territoire est organisé en Collectivités Territoriales Décentralisées (CTD) dotées de la personnalité juridique et de l’autonomie financière : les Régions (Faritra) et les Communes (Kaominina), appuyées à la base par le Fokontany.',
          textMg:
            'Ny fitsinjaram-pahefana dia mampanakaiky ny fitondrana amin’ny vahoaka. Mizara ho Faritra sy Kaominina ary Fokontany ny fandaminana eto Madagasikara.',
        },
        {
          type: 'concept',
          textFr:
            'Les 23 Régions de Madagascar sont dirigées par un Gouverneur de Région, représentant de l’État et chef de l’exécutif régional. La Région planifie le développement économique, l’aménagement du territoire, les infrastructures régionales et la coordination entre les différents districts.',
          textMg:
            'Ny Faritra 23 dia tarihin’ny Governemanta Faritra (Gouverneur). Miandraikitra ny fampandrosoana ara-toekarena sy ny fotodrafitrasa lehibe izy.',
        },
        {
          type: 'concept',
          textFr:
            'La Commune (Kaominina) est la collectivité de proximité par excellence, dirigée par un Maire (Ben’ny Tanàna) et administrée avec un Conseil Municipal ou Communal élu :\n• Elle gère l’état civil officiel (actes de naissance, mariages, décès) ;\n• Elle organise la voirie locale, la collecte des ordures et les marchés publics ;\n• Elle dispose de sa propre Police Municipale pour veiller à la tranquillité publique.',
          textMg:
            'Ny Kaominina tarihin’ny Ben’ny Tanàna no miandraikitra mivantana ny sora-piankohonana (fahaterahana, mariazy), ny fahadiovana ary ny tsena.',
        },
        {
          type: 'concept',
          textFr:
            'Le Fokontany est la cellule de base traditionnelle et administrative de la société malgache :\n• Dirigé par le Chef de Fokontany assisté d’un comité de quartier ou de village ;\n• Il délivre le carnet de fokontany, enregistre les nouveaux résidents et délivre les certificats de résidence ;\n• Il constitue le premier espace de conciliation pacifique des litiges entre voisins et le relais de la solidarité locale.',
          textMg:
            'Ny Fokontany no firafitra ifotony : manome ny karinem-pokontany, taratasy fanamarinam-ponenana, ary mandamina ny fiaraha-monina eny an-toerana.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le mot « Fokontany » vient de « Foko » (la tribu, la grande famille) et « Tany » (la terre). Il illustre que la communauté locale malgache est d’abord conçue comme une parenté élargie partageant un même terroir.',
          textMg:
            'Ny teny hoe « Fokontany » dia avy amin’ny « Foko » sy « Tany », mampahatsiahy fa toy ny fianakaviana mpiombona tany ny mpiray monina.',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la cellule administrative de base la plus proche du quotidien des citoyens à Madagascar ?',
          questionMg:
            'Inona ny rafitra ara-pitantanana ifotony indrindra manakaiky ny vahoaka isan’andro ?',
          choices: ['Le Fokontany', 'La Région', 'Le Ministère', 'Le Sénat'],
          correctIndex: 0,
          explanation:
            'Le Fokontany est le premier échelon administratif et communautaire où se déroulent les démarches de proximité (carnet de fokontany, certificats).',
        },
        {
          type: 'quiz',
          question:
            'Qui dirige l’exécutif d’une Commune (Kaominina) à Madagascar ?',
          questionMg:
            'Iza no mitarika ny fahefana mpanatanteraka eo anivon’ny Kaominina ?',
          choices: [
            'Le Maire (Ben’ny Tanàna)',
            'Le Gouverneur de région',
            'Le Procureur de la République',
            'Le Commissaire central',
          ],
          correctIndex: 0,
          explanation:
            'Le Maire (Ben’ny Tanàna), élu au suffrage universel direct, est le chef de l’exécutif communal assisté de ses adjoints.',
        },
        {
          type: 'quiz',
          question:
            'Quel document familial indispensable est délivré et mis à jour par le bureau du Fokontany ?',
          questionMg:
            'Inona ilay tahirin-kevitra ara-pianakaviana ilaina omen’ny biraon’ny Fokontany ?',
          choices: [
            'Le carnet de fokontany (fanamarinana ny fianakaviana monina ao)',
            'Le passeport biométrique',
            'Le permis de conduire international',
            'Le diplôme du baccalauréat',
          ],
          correctIndex: 0,
          explanation:
            'Le carnet de fokontany atteste de la composition du ménage et de la résidence effective au sein du quartier ou du village.',
        },
        {
          type: 'quiz',
          question:
            'Combien de Régions administratives (Faritra) composent actuellement le territoire de Madagascar ?',
          questionMg:
            'Firy ny isan’ny Faritra mandrafitra an’i Madagasikara ankehitriny ?',
          choices: ['23 Régions', '6 Régions', '12 Régions', '50 Régions'],
          correctIndex: 0,
          explanation:
            'Madagascar compte 23 Régions décentralisées, issues de l’évolution du découpage territorial qui a succédé aux 6 anciennes provinces.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle principal de la Police Municipale dans une commune urbaine malgache ?',
          questionMg:
            'Inona ny andraikitry ny Polisy Monisipaly eo anivon’ny kaominina an-drenivohitra ?',
          choices: [
            'Veiller à la salubrité, à l’ordre sur les marchés et au respect des arrêtés municipaux',
            'Gérer les frontières maritimes et aéroportuaires',
            'Juger les litiges au tribunal',
            'Voter le budget de l’État',
          ],
          correctIndex: 0,
          explanation:
            'La Police municipale applique les arrêtés du Maire : salubrité publique, circulation locale, respect des étals sur les marchés et tranquillité de la cité.',
        },
      ],
    },
    {
      slug: 'droits-fondamentaux-et-droits-de-l-enfant',
      title: 'Les Droits Fondamentaux du Citoyen et de l’Enfant',
      titleMg: 'Ny Zo Fototra sy ny Zon’ny Ankizy',
      summary:
        'Libertés individuelles, égalité devant la loi, droit à la santé, à l’éducation et déclaration obligatoire des nouveau-nés à l’état civil malgache.',
      summaryMg:
        'Zo maha-olona, fitoviana eo anatrehan’ny lalàna, fanabeazana ary sora-piankohonana ho an’ny zaza teraka.',
      type: 'CULTURE',
      orderIndex: 7,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Chaque personne humaine naît libre et égale en dignité et en droits. À Madagascar, la Constitution et les conventions internationales ratifiées garantissent un ensemble de libertés inaliénables qui protègent la dignité des personnes et l’épanouissement des enfants.',
          textMg:
            'Ny olombelona rehetra dia teraka manana zo sy voninahitra mitovy. Arovan’ny Lalàm-panorenana ny zon’ny olom-pirenena sy ny fahasambaran’ny ankizy.',
        },
        {
          type: 'concept',
          textFr:
            'Les droits civils et les libertés publiques garantis par la Constitution :\n• La liberté d’expression et d’opinion, sans incitation à la haine ;\n• La liberté de croyance et de culte ;\n• La liberté d’association et de manifestation pacifique ;\n• La liberté de circulation à travers tout le territoire national ;\n• L’inviolabilité du domicile et le respect de la vie privée et de la correspondance.',
          textMg:
            'Ny fahafahana miteny, mivavaka, mivondrona, mifindrafindra toerana ary ny fanajana ny fiainana manokan’ny tsirairay dia zo voaaro.',
        },
        {
          type: 'concept',
          textFr:
            'Les droits économiques et sociaux :\n• Le droit à l’éducation : l’enseignement primaire est gratuit et obligatoire pour tous les enfants malgaches ;\n• Le droit à la santé : accès aux soins de santé de base sans discrimination ;\n• Le droit au travail équitable et à un salaire digne ;\n• Le droit à la propriété individuelle et collective.',
          textMg:
            'Zo ara-tsosialy : fanabeazana maimaimpoana sy tsy maintsy atao ho an’ny ankizy, fahasalamana ho an’ny rehetra, asa mendrika ary fananan-tany.',
        },
        {
          type: 'concept',
          textFr:
            'Les droits spécifiques de l’enfant malgache :\n• Le droit fondamental d’avoir un nom et une nationalité dès sa naissance : la déclaration à l’état civil à la mairie est obligatoire dans les délais légaux (Kopiam-pahaterahana) ;\n• La protection absolue contre toute forme d’exploitation, de violence physique et de travail précoce dangereux ;\n• Le droit de grandir dans un cadre familial bienveillant et d’avoir du temps pour jouer et s’épanouir.',
          textMg:
            'Zon’ny ankizy : fananana anarana sy zom-pirenena (sora-piankohonana), fiarovana amin’ny herisetra sy ny fampiasana zaza tsy ampy taona.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Un enfant sans acte de naissance (« zaza tsy misy kopia ») rencontre d’immenses difficultés pour passer ses examens scolaires (CEPE, BEPC), obtenir une carte d’identité nationale ou trouver un emploi régulier. Les campagnes gratuites de jugement supplétif permettent de régulariser cette situation.',
          textMg:
            'Ny zaza tsy manana kopia dia sahirana amin’ny fianarana sy ny fanadinana. Adidin’ny ray aman-dreny ny manao ny sora-piankohonana ara-potoana.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi la déclaration de naissance à la mairie (sora-piankohonana) est-elle une démarche citoyenne vitale pour un enfant ?',
          questionMg:
            'Nahoana no dingana lehibe ho an’ny ankizy ny fanaovana ny sora-piankohonana (kopia) eny amin’ny kaominina ?',
          choices: [
            'Elle lui confère une existence juridique, un nom, une nationalité et l’accès aux examens scolaires et aux soins',
            'Elle sert uniquement à payer des taxes communales',
            'Elle est facultative jusqu’à l’âge de 30 ans',
            'Elle remplace le carnet de vaccination',
          ],
          correctIndex: 0,
          explanation:
            'L’acte de naissance (Kopia) est le fondement de la citoyenneté : sans lui, l’enfant ne peut ni s’inscrire officiellement aux examens, ni obtenir de papiers d’identité.',
        },
        {
          type: 'quiz',
          question:
            'Que prévoit la législation malgache concernant l’enseignement primaire pour les enfants ?',
          questionMg:
            'Inona no voalazan’ny lalàna malagasy momba ny fampianarana ambaratonga voalohany ho an’ny ankizy ?',
          choices: [
            'L’enseignement primaire est obligatoire et gratuit dans les écoles publiques',
            'L’école est interdite aux enfants des zones rurales',
            'L’école est payante et réservée aux aînés de famille',
            'L’école n’est autorisée qu’à partir de 16 ans',
          ],
          correctIndex: 0,
          explanation:
            'La Constitution et la loi sur l’éducation affirment que l’enseignement primaire est un droit fondamental, obligatoire et gratuit dans les établissements publics.',
        },
        {
          type: 'quiz',
          question:
            'Quelle liberté publique permet aux citoyens d’exprimer pacifiquement leurs idées et leurs opinions ?',
          questionMg:
            'Inona ilay fahafahana fototra mamela ny olom-pirenena haneho an-kalalahana ny heviny ?',
          choices: [
            'La liberté d’expression et d’opinion',
            'La liberté d’échapper à l’impôt',
            'Le droit de diffamer son voisin sans preuve',
            'L’interdiction de débattre',
          ],
          correctIndex: 0,
          explanation:
            'La liberté d’expression permet à chacun de partager ses idées et opinions, dans le respect de la loi et de la dignité d’autrui.',
        },
        {
          type: 'quiz',
          question:
            'Que garantit le principe constitutionnel de non-discrimination à Madagascar ?',
          questionMg:
            'Inona no hevitry ny tsy fanavakavahana eo anatrehan’ny lalàna ?',
          choices: [
            'Tous les citoyens ont les mêmes droits sans distinction d’origine ethnique, de religion, de genre ou de condition sociale',
            'Les personnes riches ont deux fois plus de voix aux élections',
            'Seuls les habitants des grandes villes ont droit à la justice',
            'Les femmes n’ont pas le droit de posséder de biens',
          ],
          correctIndex: 0,
          explanation:
            'L’égalité devant la loi garantit qu’aucun Malgache ne peut être discriminé en raison de son ethnie, de son sexe, de sa religion ou de son statut économique.',
        },
        {
          type: 'quiz',
          question:
            'Que protège le droit à l’inviolabilité du domicile d’un citoyen ?',
          questionMg:
            'Inona no arovana amin’ny alalan’ny zo amin’ny tsy fidirana an-keriny ao an-tokantrano ?',
          choices: [
            'Nul ne peut pénétrer ou perquisitionner dans un domicile privé sans mandat légal d’un juge',
            'L’interdiction d’inviter des proches chez soi',
            'L’exonération des factures d’électricité',
            'Le droit de refuser les visites médicales des enfants',
          ],
          correctIndex: 0,
          explanation:
            'Le domicile privé est inviolable : les forces de l’ordre ne peuvent y pénétrer pour enquête que dans les conditions et horaires strictement prévus par la loi.',
        },
      ],
    },
    {
      slug: 'devoirs-civiques-impots-et-integrite',
      title: 'Les Devoirs Civiques, la Contribution Fiscale et l’Intégrité',
      titleMg: 'Ny Adidin’ny Olom-pirenena sy ny Fahamarinana',
      summary:
        'Payer l’impôt au service du bien commun, préserver les infrastructures publiques, lutter contre la corruption (BIANCO) et cultiver le civisme au quotidien.',
      summaryMg:
        'Fandoavan-ketra hampandrosoana ny firenena, fiarovana ny fananam-bahoaka, ary ady amin’ny kolikoly.',
      type: 'CULTURE',
      orderIndex: 8,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Il n’y a point de droits réels sans devoirs correspondants. Être citoyen ne consiste pas seulement à jouir de protections, mais à participer activement à la construction de la nation par l’obéissance aux lois communes, la contribution financière et l’honnêteté personnelle.',
          textMg:
            'Tsy misy zo raha tsy misy adidy. Ny maha-olom-pirenena vanona dia mitaky fandraisana anjara mavitrika amin’ny fampandrosoana sy fanajana ny lalàna.',
        },
        {
          type: 'concept',
          textFr:
            'L’impôt est un devoir républicain fondamental. Chaque citoyen contribue selon ses facultés contributives aux charges publiques de la nation :\n• Il finance les salaires des enseignants, des médecins et des forces de sécurité ;\n• Il permet de construire et entretenir les routes, les ponts, les écoles publiques et les hôpitaux ;\n• Refuser de payer l’impôt ou frauder prive directement la collectivité des moyens de soigner et d’éduquer.',
          textMg:
            'Ny fandoavan-ketra dia adidy fototra : mamatsy vola ny fanamboarana lalam-pirenena, sekoly, hopitaly ary ny karaman’ny mpampianatra sy mpitsabo.',
        },
        {
          type: 'concept',
          textFr:
            'La protection du bien commun et des biens publics (Fiarovana ny fananam-bahoaka) :\n• Ne pas dégrader les infrastructures publiques (bornes fontaines, lampadaires solaires, bancs, écoles) ;\n• Respecter le Code de la route pour préserver des vies humaines ;\n• Porter assistance à toute personne en danger selon les possibilités légales.',
          textMg:
            'Adidy ny miaro ny fananam-bahoaka : tsy manimba paompin-drano, jiro eny an-dalana, na sekoly. Manaja ny lalàn’ny fifamoivoizana mba hanavotana aina.',
        },
        {
          type: 'concept',
          textFr:
            'L’intégrité civique et le rejet de la corruption (Ady amin’ny kolikoly) :\n• La corruption gangrène le développement, appauvrit les plus vulnérables et détruit la confiance en la République ;\n• Le Bureau Indépendant Anti-Corruption (BIANCO) et le Pôle Anti-Corruption (PAC) répriment les abus ;\n• Refuser de donner ou de recevoir un pot-de-vin est un acte de patriotisme et d’honneur personnel.',
          textMg:
            'Ny kolikoly dia fahavalon’ny fampandrosoana. Ny BIANCO sy ny PAC no miady amin’izany. Fanehoana fitiavan-tanindrazana ny fandavana ny kolikoly.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le proverbe malgache « Aleo very tsikalakalam-bola toy izay very tsikalakalam-pihavanana » et « Ny marina mitombina toy ny vatolampy » rappellent que l’honnêteté et la droiture morale ont toujours été placées au sommet des valeurs ancestrales.',
          textMg:
            'Ny ohabolana manao hoe « Ny marina mitombina toy ny vatolampy » dia mampianatra antsika ny lanjan’ny fahitsiana sy ny fahamendrehana.',
        },
        {
          type: 'quiz',
          question:
            'À quoi servent en priorité les impôts et taxes payés par les citoyens malgaches ?',
          questionMg:
            'Inona no tena ampiasana ny hetra sy haba alohan’ny olom-pirenena ?',
          choices: [
            'À financer les services publics (hôpitaux, écoles, routes, sécurité) au bénéfice de tous',
            'À enrichir personnellement les agents de l’administration',
            'À financer uniquement des voyages de loisirs',
            'À acheter des cadeaux aux entreprises privées',
          ],
          correctIndex: 0,
          explanation:
            'L’impôt est la contribution commune qui permet à l’État de bâtir des infrastructures et d’offrir des services de santé, d’éducation et de sécurité.',
        },
        {
          type: 'quiz',
          question:
            'Quel organisme public spécialisé est chargé de prévenir et de réprimer la corruption à Madagascar ?',
          questionMg:
            'Inona ilay sampandraharaha manokana miady amin’ny kolikoly eto Madagasikara ?',
          choices: [
            'Le BIANCO (Bureau Indépendant Anti-Corruption)',
            'Le syndicat des transporteurs',
            'La Chambre de commerce',
            'Le Comité olympique malgache',
          ],
          correctIndex: 0,
          explanation:
            'Le BIANCO (Bureau Indépendant Anti-Corruption) est l’institution nationale indépendante dédiée à la sensibilisation, la prévention et l’investigation contre la corruption.',
        },
        {
          type: 'quiz',
          question:
            'Que risque la société lorsque des infrastructures publiques (bornes-fontaines, écoles) sont vandalisées ?',
          questionMg:
            'Inona no voka-dratsy ateraky ny fanimbana ny fananam-bahoaka ?',
          choices: [
            'Toute la communauté perd l’accès à des services vitaux et l’argent public doit réparer au lieu de construire',
            'Rien de grave car l’État a des ressources infinies',
            'Cela permet d’accélérer les projets de développement',
            'La commune reçoit plus de subventions',
          ],
          correctIndex: 0,
          explanation:
            'La dégradation du bien commun pénalise tous les habitants, en particulier les plus démunis, et détourne les budgets d’autres urgences.',
        },
        {
          type: 'quiz',
          question:
            'Quel comportement citoyen est attendu sur la route face au Code de la route ?',
          questionMg:
            'Inona no fihetsika mendrika takiana amin’ny olom-pirenena eny amin’ny arabe ?',
          choices: [
            'Respecter les limitations de vitesse, les passages piétons et ne jamais conduire en état d’ébriété',
            'Rouler sur les trottoirs pour éviter les embouteillages',
            'Ignorer les feux tricolores la nuit',
            'Klaxonner devant les hôpitaux et les écoles',
          ],
          correctIndex: 0,
          explanation:
            'Le respect scrupuleux du Code de la route est un devoir civique qui préserve des vies et garantit la sécurité de tous les usagers.',
        },
        {
          type: 'quiz',
          question:
            'Que doit faire un citoyen témoin d’une personne en danger immédiat (noyade, accident) ?',
          questionMg:
            'Inona no adidin’ny olom-pirenena mahita olona tra-doza tampoka ?',
          choices: [
            'Lui porter secours ou alerter d’urgence les services de secours adaptés',
            'Prendre des photos pour les réseaux sociaux sans aider',
            'Fuir les lieux en silence',
            'Attendre le lendemain pour prévenir',
          ],
          correctIndex: 0,
          explanation:
            'L’assistance à personne en danger est à la fois une obligation morale et légale : chacun doit agir ou donner l’alerte sans se mettre soi-même en péril.',
        },
      ],
    },
    {
      slug: 'vote-elections-et-democratie-participative',
      title: 'Le Vote, les Élections et la Démocratie Participative',
      titleMg: 'Ny Fifidianana sy ny Fandraisana Anjara',
      summary:
        'L’acte électoral démocratique : conditions d’éligibilité, secret de l’isoloir, rôle de la CENI et engagement citoyen pour l’intérêt général.',
      summaryMg:
        'Ny fifidianana : fepetra hidirana anaty lisi-pifidianana, ny CENI, ary ny fandraisana anjara amin’ny raharaham-pirenena.',
      type: 'CULTURE',
      orderIndex: 9,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'Le vote est l’expression la plus directe de la souveraineté populaire. En déposant son bulletin dans l’urne, chaque citoyen participe à égalité au choix de ses dirigeants et à l’orientation de l’avenir de Madagascar.',
          textMg:
            'Ny fifidianana no fanehoana mivantana ny fahefam-bahoaka. Amin’ny alalan’ny vato no isafidianana ireo hitondra sy hanompo ny firenena.',
        },
        {
          type: 'concept',
          textFr:
            'Les conditions pour être électeur à Madagascar :\n• Posséder la nationalité malgache ;\n• Avoir atteint l’âge de la majorité légale (18 ans révolus au jour du scrutin) ;\n• Jouir de ses droits civils et politiques (ne pas avoir été condamné à une peine d’inéligibilité) ;\n• Être régulièrement inscrit sur la Liste Électorale tenue au niveau du Fokontany et de la Commune.',
          textMg:
            'Fepetra hifidianana : mizaka ny zom-pirenena malagasy, feno 18 taona, tsy voaheloka amin’ny zony, ary voasoratra anaty lisi-pifidianana.',
        },
        {
          type: 'concept',
          textFr:
            'Le déroulement régulier du scrutin démocratique :\n• L’isoloir garantit le secret absolu du vote : personne ne peut obliger un électeur à révéler son choix ni le sanctionner pour son opinion ;\n• L’urne transparente assure la sincérité du dépouillement public devant les délégués des candidats et les observateurs ;\n• L’encre indélébile apposée sur le doigt empêche le double vote frauduleux.',
          textMg:
            'Miantoka ny fahamarinan’ny latsa-bato ny efitra mangina (isoloir), ny vata mangarahara, ary ny ranomainty tsy afaka avy hatrany amin’ny rantsan-tanana.',
        },
        {
          type: 'concept',
          textFr:
            'La CENI (Commission Électorale Nationale Indépendante) est l’organe public permanent chargé de réviser la liste électorale annuelle, d’organiser matériellement les scrutins et de publier les résultats provisoires avant transmission à la HCC ou aux tribunaux administratifs.',
          textMg:
            'Ny CENI no rafitra mahaleotena mikarakara ny fifidianana, manavao ny lisi-pifidianana ary mamoaka ny vokatra vonjimaika.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'La démocratie ne s’arrête pas au jour du vote : participer aux réunions du Fokontany, interpeller poliment ses élus et s’engager dans des associations communautaires constituent des formes vitales de démocratie participative.',
          textMg:
            'Tsy mifarana amin’ny latsa-bato ny demokrasia : ny fanatrehana fivorian’ny Fokontany sy ny fikambanana samihafa dia endrika fandraisana anjara lehibe.',
        },
        {
          type: 'quiz',
          question:
            'À partir de quel âge un citoyen malgache a-t-il le droit de voter aux élections s’il est inscrit sur la liste électorale ?',
          questionMg:
            'Feno firy taona ny olom-pirenena malagasy no manan-jo handatsa-bato rehefa voasoratra anarana ?',
          choices: ['18 ans révolus', '16 ans', '21 ans', '25 ans'],
          correctIndex: 0,
          explanation:
            'La majorité électorale est fixée à 18 ans révolus par la Constitution et le Code électoral malgache.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le passage dans l’isoloir est-il strictement obligatoire dans un bureau de vote ?',
          questionMg:
            'Nahoana no tsy maintsy miditra ao amin’ny efitra mangina (isoloir) ny mpifidy ?',
          choices: [
            'Pour garantir le secret total du vote et protéger l’électeur contre toute pression ou intimidation',
            'Pour permettre de compter l’argent des candidats',
            'Pour vérifier la température corporelle',
            'Pour signer le carnet de fokontany',
          ],
          correctIndex: 0,
          explanation:
            'Le passage dans l’isoloir assure la liberté totale et le secret du vote, empêchant toute influence ou surveillance externe.',
        },
        {
          type: 'quiz',
          question:
            'Quelle commission indépendante organise techniquement les opérations électorales à Madagascar ?',
          questionMg:
            'Inona ilay vaomiera mahaleotena mikarakara ny fifidianana eto Madagasikara ?',
          choices: [
            'La CENI (Commission Électorale Nationale Indépendante)',
            'Le Conseil municipal de la capitale',
            'La Banque Centrale de Madagascar',
            'La Ligue des droits de l’homme',
          ],
          correctIndex: 0,
          explanation:
            'La CENI est l’institution chargée de la préparation logistique des élections et de la centralisation des résultats provisoires.',
        },
        {
          type: 'quiz',
          question:
            'À quelle fréquence la liste électorale nationale fait-elle l’objet d’une révision annuelle pour intégrer les nouveaux majeurs ?',
          questionMg:
            'Impiry isan-taona no anaovana ny fanavaozana ny lisi-pifidianana ?',
          choices: [
            'Chaque année lors de la période légale de révision annuelle de la liste électorale',
            'Une fois tous les 20 ans',
            'Uniquement la veille du vote',
            'Jamais, la liste est permanente et figée',
          ],
          correctIndex: 0,
          explanation:
            'La révision de la liste électorale a lieu annuellement pour enregistrer les jeunes qui atteignent 18 ans et radier les personnes décédées.',
        },
        {
          type: 'quiz',
          question:
            'Que permet l’encre indélébile appliquée sur le doigt de chaque votant après le dépôt du bulletin ?',
          questionMg:
            'Inona no anton’ny fanaovana ranomainty amin’ny rantsan-tanana aorian’ny latsa-bato ?',
          choices: [
            'Empêcher formellement une même personne de voter plusieurs fois dans différents bureaux',
            'Servir de signature pour les impôts',
            'Décorer le doigt en souvenir du scrutin',
            'Marquer les personnes qui n’ont pas voté',
          ],
          correctIndex: 0,
          explanation:
            'L’encre indélébile est une mesure de sécurité électorale empêchant toute tentative de fraude par vote multiple.',
        },
      ],
    },
    {
      slug: 'vivre-ensemble-fihavanana-et-ecologie-civique',
      title: 'Vivre-ensemble (Fihavanana), Solidarité et Écologie Civique',
      titleMg: 'Fihavanana, Fiaraha-monina sy Tontolo Iainana',
      summary:
        'L’art de vivre ensemble entre les 18 ethnies, la solidarité communautaire (Valin-tanana), le respect des aînés et le devoir sacré de protéger l’environnement malgache.',
      summaryMg:
        'Fihavanana sy fifanajana eo amin’ny foko 18, valin-tanana, fanajana ny ray aman-dreny ary fiarovana ny tontolo iainana.',
      type: 'TRADITION',
      orderIndex: 10,
      durationMinutes: 12,
      sections: [
        {
          type: 'intro',
          textFr:
            'La citoyenneté malgache puise sa force dans une alliance féconde entre la République moderne et la sagesse ancestrale. Le Fihavanana, l’entraide communautaire et la protection de notre nature unique constituent les piliers de notre cohésion nationale.',
          textMg:
            'Ny maha-olom-pirenena malagasy dia fitambaran’ny rafitra repoblikana sy ny fahendrena nentin-drazana : Fihavanana, fifanampiana ary fiarovana ny tanindrazana.',
        },
        {
          type: 'concept',
          textFr:
            'Le Fihavanana républicain et la concorde des 18 ethnies :\n• Madagascar est une mosaïque culturelle unie par une même langue nationale et un destin partagé ;\n• Le Fihavanana enseigne que la discorde brise la force de la communauté (« Izay mitambatra vato, izay misaraka fasika ») ;\n• La tolérance religieuse et la convivialité interrégionale sont des trésors précieux à cultiver chaque jour.',
          textMg:
            'Ny Fihavanana no mamehy ny foko 18 : ny firaisankina no hery (« Izay mitambatra vato, izay misaraka fasika ») ary ny fifampiresahana am-pilaminana no vahaolana.',
        },
        {
          type: 'concept',
          textFr:
            'Les pratiques séculaires de solidarité communautaire :\n• Le Valin-tanana : l’entraide mutuelle pour les travaux agricoles ou la construction des habitations ;\n• L’Asa tana-maro : les corvées d’intérêt collectif pour réparer un pont villageois ou curer un canal d’irrigation ;\n• Le respect et le soutien dû aux aînés (Ray aman-dreny) et aux personnes les plus vulnérables.',
          textMg:
            'Ny Valin-tanana sy ny Asa tana-maro dia fomba nentim-paharazana amin’ny fiaraha-miasa sy fanampiana ny zokiolona sy ny sahirana.',
        },
        {
          type: 'concept',
          textFr:
            'Le civisme écologique : un devoir constitutionnel envers les générations futures :\n• Madagascar abrite une biodiversité unique au monde avec plus de 80 % d’espèces endémiques ;\n• La lutte intransigeante contre les feux de brousse destructeurs (Doro tanety) qui dévastent les sols et la faune ;\n• L’engagement pour le reboisement citoyen (Fambolen-kazo) et la préservation de la propreté de nos villes et cours d’eau.',
          textMg:
            'Adidy ny miaro ny tontolo iainana : miady amin’ny doro tanety, mamboly hazo, ary manaja ny fahadiovan’ny tanàna sy ny rano.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Le discernement critique face aux rumeurs (« tsaho ») et aux fausses nouvelles en ligne est aujourd’hui un devoir civique majeur pour préserver la paix civile et le Fihavanana de toute manipulation déstabilisatrice.',
          textMg:
            'Ny fahaizana manavaka ny marina amin’ny tsaho sy lainga amin’ny aterineto dia adidy maoderina lehibe hiarovana ny filaminana.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie le célèbre proverbe malgache « Izay mitambatra vato, izay misaraka fasika » sur le plan civique ?',
          questionMg:
            'Inona no hevitry ny ohabolana « Izay mitambatra vato, izay misaraka fasika » eo amin’ny fiainam-pirenena ?',
          choices: [
            'L’union fait la force solide comme la pierre, tandis que la division disperse comme le sable',
            'Il faut construire des maisons uniquement en pierre',
            'Le sable est plus précieux que la roche pour l’agriculture',
            'Chaque ethnie doit vivre séparément des autres',
          ],
          correctIndex: 0,
          explanation:
            'Ce proverbe fondamental enseigne que l’unité fraternelle rend le peuple inébranlable, alors que la division affaiblit tout le monde.',
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on la pratique traditionnelle d’entraide collective et solidaire lors des travaux des champs ?',
          questionMg:
            'Ahoana no iantsoana ny fiaraha-mientana sy fifanampiana nentim-paharazana amin’ny fambolena ?',
          choices: [
            'Le Valin-tanana (ou Asa tana-maro)',
            'Le Dina fotsy',
            'Le Tromba',
            'Le Vintana',
          ],
          correctIndex: 0,
          explanation:
            'Le Valin-tanana (« retour de main ») et l’Asa tana-maro constituent les formes traditionnelles d’entraide collective et bénévole au sein de la communauté.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi la lutte contre les feux de brousse (« doro tanety ») est-elle considérée comme une priorité civique absolue ?',
          questionMg:
            'Nahoana no laharam-pahamehana amin’ny adidy maha-olom-pirenena ny fiadiana amin’ny doro tanety ?',
          choices: [
            'Parce qu’ils détruisent les forêts, érodent les sols, assèchent les sources d’eau et déciment la faune unique',
            'Parce qu’ils réchauffent trop l’air en hiver',
            'Parce qu’ils empêchent les avions d’atterrir la nuit',
            'Parce qu’ils diminuent le prix du charbon de bois',
          ],
          correctIndex: 0,
          explanation:
            'Le doro tanety ravage la fertilité des terres, anéantit la forêt primaire et compromet l’approvisionnement en eau potable de toute la population.',
        },
        {
          type: 'quiz',
          question:
            'Quel geste écologique citoyen permet de renouveler la couverture forestière de la Grande Île ?',
          questionMg:
            'Inona ny hetsika ara-tontolo iainana andraisan’ny rehetra anjara hamerenana ny ala ?',
          choices: [
            'Le reboisement citoyen volontaire (Fambolen-kazo)',
            'Le défrichage par le feu',
            'L’abattage des arbres centenaires',
            'L’utilisation intensive de plastique jetable',
          ],
          correctIndex: 0,
          explanation:
            'La campagne annuelle de reboisement (Fambolen-kazo) est un engagement civique essentiel pour restaurer le patrimoine vert de Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'Face aux rumeurs (« tsaho ») et fausses informations sur les réseaux sociaux, quelle attitude civique doit adopter le citoyen ?',
          questionMg:
            'Manoloana ny tsaho sy vaovao tsy marina, inona no fihetsika mendrika tokony hataon’ny olom-pirenena ?',
          choices: [
            'Vérifier les sources officielles, faire preuve d’esprit critique et ne pas relayer de fausses nouvelles déstabilisatrices',
            'Partager immédiatement sans lire le contenu',
            'Accuser immédiatement son voisin sans preuve',
            'Créer de fausses alertes pour paniquer la population',
          ],
          correctIndex: 0,
          explanation:
            'Le civisme moderne exige de vérifier l’information avant de la propager pour protéger la concorde civile et le Fihavanana de manipulations toxiques.',
        },
      ],
    },
  ],
};

export const CIVICS_TRACK = civicsInstitutionsTrack;
