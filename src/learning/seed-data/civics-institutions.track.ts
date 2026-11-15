import { SeedTrack } from './seed.types.js';

export const civicsInstitutionsTrack: SeedTrack = {
  slug: 'citoyennete-institutions-et-democratie',
  title: 'Citoyenneté, Institutions & Démocratie à Madagascar',
  titleMg:
    'Fahaiza-miaina amin’ny Tanindrazana : Lalàmpanorenana sy Andrim-panjakana',
  description:
    'Comprenez l’organisation de l’État républicain : la Constitution, le Parlement, le rôle du Fokontany, les droits civiques et le Dina moderne homologué.',
  descriptionMg:
    'Fantaro ny rafitry ny Fanjakana repoblikanina : ny Lalàmpanorenana, ny Antenimiera, ny Fokontany, ny zon’ny olom-pirenena ary ny Dina voazaha ara-dalàna.',
  level: 'INTERMEDIATE',
  icon: 'Landmark',
  color: '#475569',
  orderIndex: 12,
  estimatedMinutes: 40,
  lessons: [
    // ─── LEÇON 1 : LA CONSTITUTION ET LA RÉPUBLIQUE ───
    {
      slug: 'la-constitution-et-les-pouvoirs-republicains',
      title:
        'La Constitution et les pouvoirs républicains : exécutif, législatif et judiciaire',
      titleMg:
        'Ny Lalàmpanorenana sy ireo Fahefana telo : Mpanatanteraka, Mpanao lalàna, Mpitsara',
      summary:
        'Découvrez la loi fondamentale de Madagascar : la séparation républicaine des pouvoirs, le rôle du Président, du Premier ministre et la primauté du droit.',
      summaryMg:
        'Diniho ny lalàna fototra mifehy an’i Madagasikara : ny fisaraham-pahefana telo, ny asan’ny Filohan’ny Repoblika sy ny Praiminisitra.',
      type: 'CULTURE',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            'Madagascar est une République démocratique dont la norme juridique suprême est la Constitution (Lalàmpanorenana). Elle garantit les droits fondamentaux de chaque citoyen et consacre la séparation des trois pouvoirs : le pouvoir exécutif (Président de la République et Premier ministre), le pouvoir législatif (Assemblée Nationale et Sénat) et le pouvoir judiciaire indépendant chargé de faire respecter la justice sans ingérence politique.',
          textMg:
            "I Madagasikara dia Repoblika tantanan'ny Lalàmpanorenana izay lalàna fara tampony miantoka ny zon'ny olom-pirenena tsirairay. Manavaka tsara ireo fahefana telo izy : ny Fahefana Mpanatanteraka (Filoha sy Governemanta), ny Fahefana Mpanao Lalàna (Antenimiera roa) ary ny Fahefana Mpitsara tsy miandany.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'LA / LAM / PA / NO / RE / NA / NA',
          phonetic: 'la-lam-pa-nou-re-na-na',
          frenchEquivalent:
            "Le mot « Lalàmpanorenana » associe 'Lalàna' (la loi obligatoire) et 'Fanorenana' (la fondation / l'édification de l'État).",
          sampleWordMg: 'Lalàmpanorenana',
          sampleTranslationFr:
            'La Constitution (la loi fondamentale de l’État)',
        },
        {
          type: 'concept',
          termMg: 'Fahefana Mpanatanteraka (Filoham-pirenena)',
          phonetic: 'fa-he-fa-na mpa-na-tan-te-ra-ka',
          meaningFr:
            'Le pouvoir exécutif dirigé par le chef de l’État élu au suffrage universel',
          explanation:
            "Le Président de la République est le garant de l'indépendance nationale et de l'intégrité du territoire, élu directement par le peuple pour un mandat de cinq ans.",
        },
        {
          type: 'concept',
          termMg: 'Fahefana Mpitsara mahaleo tena',
          phonetic: 'fa-he-fa-na mpi-tsa-ra ma-ha-le-ou te-na',
          meaningFr:
            'L’autorité judiciaire indépendante gardienne des libertés',
          explanation:
            "Les cours et tribunaux rendent la justice au nom du Peuple malgache dans le strict respect de la loi et de l'égalité de tous les citoyens.",
        },
        {
          type: 'concept',
          termMg: 'Haute Cour Constitutionnelle (HCC / Fitsarana Avo)',
          phonetic: 'fit-sa-ra-na a-vou mom-ba ni la-lam-pa-nou-re-na-na',
          meaningFr:
            'La plus haute juridiction constitutionnelle et électorale du pays',
          explanation:
            'Siégeant à Ambohidahy, elle contrôle la conformité des lois à la Constitution et proclame les résultats officiels définitifs des élections présidentielles.',
        },
        {
          type: 'example',
          textMg:
            "Tsy misy olona ambonin'ny lalàna ao anatin'ny Repoblika : ny Lalàmpanorenana no arofanina miaro ny madinika sy mampitovy ny rehetra.",
          textFr:
            "Nul n'est au-dessus de la loi dans une République : la Constitution est le bouclier protecteur qui défend les humbles et garantit l'égalité de tous.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "La première Constitution de la République malgache a été adoptée le 29 avril 1959 par l'Assemblée Constituante réunie à Antananarivo, un an avant la proclamation officielle du retour de l'Indépendance du 26 juin 1960.",
          textMg:
            "Tamin'ny 29 Aprily 1959 no lany ny Lalàmpanorenana voalohany tamin'ny Repoblika Malagasy voalohany teo ambany fitarihan'i Philibert Tsiranana.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la norme juridique suprême qui régit l’organisation de l’État et les droits des citoyens à Madagascar ?',
          questionMg:
            'Inona ny lalàna fara tampony mifehy ny fandaminana ny Fanjakana sy ny zon’ny olom-pirenena eto Madagasikara ?',
          choices: [
            'La Constitution (Lalàmpanorenana)',
            'Le code de la route',
            'Un contrat commercial privé',
            'Un arrêté de quartier',
          ],
          correctIndex: 0,
          explanation:
            'La Constitution est la loi fondamentale au sommet de la hiérarchie des normes à laquelle toutes les autres lois doivent impérativement se conformer.',
        },
        {
          type: 'quiz',
          question:
            'Combien de pouvoirs républicains indépendants composent traditionnellement l’État démocratique malgache ?',
          questionMg:
            'Firy ireo fahefana lehibe misaraka tsara mandrafitra ny Fanjakana repoblikanina ?',
          choices: [
            'Trois pouvoirs : l’Exécutif, le Législatif et le Judiciaire',
            'Un seul pouvoir absolu',
            'Dix pouvoirs rivaux',
            'Aucun pouvoir officiel',
          ],
          correctIndex: 0,
          explanation:
            'La séparation des pouvoirs exécutif, législatif et judiciaire est le principe universel qui prévient la tyrannie et protège la démocratie.',
        },
        {
          type: 'quiz',
          question:
            'Quelle institution judiciaire suprême siège à Ambohidahy pour veiller à la constitutionnalité des lois et valider les élections ?',
          questionMg:
            'Inona ilay fitsarana fara tampony eny Ambohidahy manara-maso ny fifidianana sy ny fanajana ny lalàmpanorenana ?',
          choices: [
            'La Haute Cour Constitutionnelle (HCC)',
            'Le tribunal de première instance de quartier',
            'La cour des comptes',
            'Le conseil municipal',
          ],
          correctIndex: 0,
          explanation:
            'La Haute Cour Constitutionnelle (HCC) est la clé de voûte institutionnelle garantissant la régularité républicaine à Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la durée du mandat du Président de la République malgache élu au suffrage universel direct ?',
          questionMg:
            'Firy taona ny fe-potoana iasan’ny Filohan’ny Repoblika voafidim-bahoaka ara-dalàna ?',
          choices: [
            '5 ans (renouvelable une seule fois consécutivement)',
            '20 ans à vie',
            '1 an seulement',
            '10 ans sans élection',
          ],
          correctIndex: 0,
          explanation:
            "La Constitution fixe le mandat présidentiel à 5 années renouvelable une seule fois, garantissant l'alternance démocratique.",
        },
        {
          type: 'quiz',
          question:
            'Qui dirige l’action du Gouvernement au quotidien et applique les lois votées par le Parlement ?',
          questionMg:
            'Iza no mitarika ny asan’ny Governemanta amin’ny fampiharana ny lalàna eto amin’ny firenena ?',
          choices: [
            'Le Premier ministre, chef du gouvernement nommé par le Président',
            'Le gouverneur de la banque centrale',
            'Le maire de la commune urbaine',
            'Le président de l’université',
          ],
          correctIndex: 0,
          explanation:
            "Le Premier ministre conduit la politique générale de l'État et coordonne les ministères pour exécuter les lois républicaines.",
        },
      ],
    },
    // ─── LEÇON 2 : LE PARLEMENT ───
    {
      slug: 'le-parlement-assemblee-nationale-et-senat',
      title: 'Le Parlement bicaméral : l’Assemblée Nationale et le Sénat',
      titleMg:
        'Ny Antenimiera roa Tonta : Antenimierampirenena sy Antenimierandoholona',
      summary:
        'Découvrez le pouvoir législatif : les députés élus à Tsimbazaza, les sénateurs au palais d’Anosikely, l’écriture de la loi et le contrôle du gouvernement.',
      summaryMg:
        'Fantaro ny fomba fanaovan-dalàna : ireo solombavambahoaka eny Tsimbazaza, ireo loholona eny Anosikely ary ny fanaraha-maso ny fahefana mpanatanteraka.',
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, le pouvoir législatif est bicaméral, c'est-à-dire composé de deux chambres distinctes qui délibèrent pour voter les lois et contrôler le gouvernement. L'Assemblée Nationale, siégeant au palais historique de Tsimbazaza, réunit les Députés (Solombavambahoaka) élus directement par les citoyens dans chaque district. Le Sénat, siégeant au palais d'Anosikely, réunit les Sénateurs (Loholona) qui représentent les collectivités territoriales décentralisées et la société civile.",
          textMg:
            "Mizara roa ny Antenimiera eto Madagasikara : ny Antenimierampirenena eny Tsimbazaza ivorian'ireo Solombavambahoaka voafidy mivantana isam-paritra, sy ny Antenimierandoholona eny Anosikely ahitana ireo Loholona misolo tena ny vondrom-bahoaka itsinjaram-pahefana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'SO / LOM / BA / VAM / BA / HOA / KA',
          phonetic: 'sou-loum-ba-vam-ba-houa-ka',
          frenchEquivalent:
            "Le mot « Solombavambahoaka » (député) signifie littéralement 'celui qui prête sa bouche pour porter la voix du peuple'.",
          sampleWordMg: 'Solombavambahoaka',
          sampleTranslationFr:
            'Le Député (le représentant de la voix du peuple)',
        },
        {
          type: 'concept',
          termMg: 'Antenimierampirenena (Palais de Tsimbazaza)',
          phonetic: 'an-te-ni-mi-e-ram-pi-re-ne-na',
          meaningFr:
            'La chambre basse du Parlement représentant le peuple de tous les districts',
          explanation:
            'Elle examine et vote en premier ressort les projets de loi (déposés par le gouvernement) et propositions de loi (déposées par les députés).',
        },
        {
          type: 'concept',
          termMg: 'Antenimierandoholona (Sénat d’Anosikely)',
          phonetic: 'an-te-ni-mi-e-ran-dou-hou-lou-na',
          meaningFr:
            'La chambre haute représentant les régions et collectivités locales',
          explanation:
            "Composée de personnalités expérimentées ('loholona' = les anciens et notables respectés), elle apporte un regard modérateur et expert sur les lois.",
        },
        {
          type: 'concept',
          termMg: 'Fandinihana sy Lany lany ho lalàna',
          phonetic: 'fan-di-ni-ha-na si la-ni ho la-la-na',
          meaningFr:
            'La navette parlementaire et l’adoption solennelle des textes de loi',
          explanation:
            "Le va-et-vient d'un texte entre les deux chambres jusqu'à l'obtention d'un texte d'accord commun, promulgué ensuite par le chef de l'État.",
        },
        {
          type: 'example',
          textMg:
            "Ny asan'ny Solombavambahoaka dia ny mitondra ny hetahetan'ny vahoaka any amin'ny faritra misy azy ho lasa lalàna mampandroso ny firenena.",
          textFr:
            'La mission du Député est de porter les aspirations réelles des habitants de son district pour en faire des lois qui développent la nation.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "L'Assemblée Nationale possède le pouvoir de voter une 'motion de censure' à l'encontre du Gouvernement si elle estime que celui-ci ne remplit pas ses engagements envers la nation, pouvant ainsi contraindre le Premier ministre à démissionner !",
          textMg:
            "Manana fahefana lehibe hanongana ny Governemanta amin'ny alalan'ny latsa-bato 'fitsipaham-pitokisana' ny Antenimierampirenena raha misy tsy fahatomombanana lehibe.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que signifie littéralement en malgache le terme officiel « Solombavambahoaka » désignant un député ?',
          questionMg:
            'Inona no hevitra marina fonosin’ny teny hoe « Solombavambahoaka » ?',
          choices: [
            '« Celui qui prête sa bouche pour exprimer la voix et la volonté du peuple »',
            'Le chef de la police',
            'Le percepteur d’impôts du district',
            'Le ministre des finances',
          ],
          correctIndex: 0,
          explanation:
            "« Solo-vava-bahoaka » rappelle la mission sacrée du député : être la bouche qui défend les droits des citoyens à l'Assemblée.",
        },
        {
          type: 'quiz',
          question:
            'Dans quel quartier célèbre d’Antananarivo siège l’Assemblée Nationale malgache ?',
          questionMg:
            'Eny amin’ny faritra aiza eto Antananarivo no misy ny lapan’ny Antenimierampirenena ?',
          choices: [
            'Au palais historique de Tsimbazaza',
            'Sur la colline d’Ambohimanga',
            'Sur la plage d’Anakao',
            'À l’aéroport d’Ivato',
          ],
          correctIndex: 0,
          explanation:
            'Le palais de Tsimbazaza est le siège historique des délibérations parlementaires des représentants de la nation.',
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle principal du Sénat (Antenimierandoholona) dans le système bicaméral malgache ?',
          questionMg:
            'Inona no anjara asan’ny Antenimierandoholona eny Anosikely ?',
          choices: [
            'Représenter les collectivités décentralisées (régions, communes) et apporter un regard modérateur d’anciens sur les lois',
            'Commander l’armée en temps de guerre',
            'Gérer les écoles primaires de la capitale',
            'Remplacer le Président à chaque voyage',
          ],
          correctIndex: 0,
          explanation:
            'Le Sénat garantit la prise en compte des équilibres territoriaux des provinces et régions dans la législation nationale.',
        },
        {
          type: 'quiz',
          question:
            'Quelle est la différence fondamentale entre un « Projet de loi » et une « Proposition de loi » ?',
          questionMg:
            'Inona ny maha-samy hafa ny « Volavolan-dalàna » sy ny « Tolo-dalàna » ?',
          choices: [
            'Le projet de loi émane du Gouvernement, tandis que la proposition de loi est rédigée à l’initiative des parlementaires',
            'Le projet est payant et la proposition est gratuite',
            'Le projet est pour les enfants et la proposition pour les adultes',
            'Il n’y a aucune différence',
          ],
          correctIndex: 0,
          explanation:
            "Un 'projet de loi' provient de l'exécutif (ministères), tandis qu'une 'proposition de loi' naît de l'initiative d'un député ou sénateur.",
        },
        {
          type: 'quiz',
          question:
            'Quelle étape juridique indispensable transforme un texte voté par le Parlement en loi officiellement applicable à tous ?',
          questionMg:
            'Inona ny dingana farany tsy maintsy lalovan’ny lalàna vao mihatra amin’ny olom-pirenena rehetra ?',
          choices: [
            'La promulgation par le Président de la République et sa publication au Journal Officiel de Madagascar',
            'La diffusion sur les réseaux sociaux uniquement',
            'L’affichage sur les murs de la mairie pendant deux heures',
            'La lecture à la radio sans signature',
          ],
          correctIndex: 0,
          explanation:
            'La promulgation présidentielle confère la force exécutoire à la loi adoptée et la rend opposable à tous les citoyens.',
        },
      ],
    },
    // ─── LEÇON 3 : LE FOKONTANY ET LA COMMUNE ───
    {
      slug: 'le-fokontany-et-la-commune-democratie-de-proximite',
      title:
        'Le Fokontany et la Commune : la démocratie de proximité au quotidien',
      titleMg:
        'Ny Fokontany sy ny Kaominina : Ivon-toeran’ny Fifanampiana sy ny Fitantanana',
      summary:
        'Explorez la cellule de base de la société malgache : le chef de Fokontany, le carnet de ménage, l’état civil en mairie et la décentralisation.',
      summaryMg:
        'Fantaro ny fototry ny fiarahamonina : ny asan’ny Filohan’ny Fokontany, ny bokin’ankohonana, ny kopia mari-pahaterahana ary ny andraikitry ny Kaominina.',
      type: 'CULTURE',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Héritier moderne du Fokonolona séculaire, le 'Fokontany' est la cellule administrative et communautaire de base de la vie malgache. Que ce soit dans un village reculé ou dans un quartier urbain d'Antananarivo, le Fokontany assure le recensement des habitants via le 'Carnet de ménage' (Bokin'ankohonana), veille à la concorde entre voisins et délivre les certificats de résidence indispensables aux démarches civiles auprès de la Commune.",
          textMg:
            "Ny Fokontany no rantsana fototra ifandraisan'ny vahoaka amin'ny Fanjakana. Avy amin'ny soatoavin'ny Fokonolona nentin-drazana izy, mitantana ny bokin'ankohonana, miaro ny fandriampahalemana eo an-tanàna ary miara-miasa amin'ny Kaominina amin'ny fampandrosoana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FO / KON / TA / NY',
          phonetic: 'fou-koun-ta-ni',
          frenchEquivalent:
            "Le mot « Fokontany » associe 'Foko' (le clan / le groupe solidaire) et 'Tany' (le terroir territorial délimité).",
          sampleWordMg: 'Fokontany',
          sampleTranslationFr: 'Le Fokontany (le quartier ou village de base)',
        },
        {
          type: 'concept',
          termMg: 'Filohan’ny Fokontany (Chef de quartier)',
          phonetic: 'fi-lou-han-ni fou-koun-ta-ni',
          meaningFr:
            'Le responsable de quartier garant de l’ordre et du recensement',
          explanation:
            "Intermédiaire de terrain incontournable entre les habitants et l'administration : il écoute les doléances, règle les petits litiges et certifie les domiciles.",
        },
        {
          type: 'concept',
          termMg: 'Bokin’ankohonana (Carnet de ménage)',
          phonetic: 'bou-kin an-kou-hou-na-na',
          meaningFr:
            'Le livret officiel d’enregistrement de la famille et du foyer',
          explanation:
            'Document obligatoire consignant tous les membres vivant sous le même toit : naissances, décès, arrivées et départs de visiteurs de longue durée.',
        },
        {
          type: 'concept',
          termMg: 'Kopia mari-pahaterahana (Acte d’état civil)',
          phonetic: 'kou-pi-a ma-ri pa-ha-te-ra-ha-na',
          meaningFr:
            'L’acte de naissance officiel délivré à la mairie de la Commune',
          explanation:
            "Document juridique fondamental garantissant à chaque enfant son identité, sa nationalité malgache et l'accès à la scolarisation et au vote.",
        },
        {
          type: 'example',
          textMg:
            "Ny fampandrosoana marina dia miainga any amin'ny Fokontany : rehefa miray hina ny mpiara-monina dia mandroso ny tanàna sy ny firenena.",
          textFr:
            "Le véritable développement prend racine dans le Fokontany : lorsque les voisins s'entraident dans la paix, c'est toute la commune et la nation qui progressent.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Madagascar compte plus de 18 000 Fokontany répartis dans 1 695 Communes, formant un maillage territorial exceptionnel où aucun citoyen n'est isolé de sa communauté d'appartenance.",
          textMg:
            "Ahitana Fokontany mihoatra ny 18 000 any amin'ireo Kaominina 1 695 manerana an'i Madagasikara, manome rafitra akaiky ny vahoaka indrindra.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la plus petite unité administrative et territoriale de proximité à Madagascar ?',
          questionMg:
            'Inona ny rafitra ara-panjakana kely indrindra sy akaiky ny vahoaka indrindra eto Madagasikara ?',
          choices: ['Le Fokontany', 'La Région', 'Le Ministère', 'Le District'],
          correctIndex: 0,
          explanation:
            'Le Fokontany (quartier ou village) est la cellule de base du maillage administratif et citoyen de Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'À quoi sert obligatoirement le « Bokin’ankohonana » (Carnet de ménage) conservé dans chaque foyer malgache ?',
          questionMg:
            'Inona ny asan’ny Bokin’ankohonana ananan’ny isan-tokantrano ao amin’ny Fokontany ?',
          choices: [
            'Enregistrer officiellement tous les membres résidant dans la maison pour le recensement et la sécurité locale',
            'Acheter du pain au rabais',
            'Payer des amendes routières',
            'Dessiner des portraits de famille',
          ],
          correctIndex: 0,
          explanation:
            'Le carnet de ménage atteste de la composition du foyer auprès du chef de Fokontany pour toute démarche administrative.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi la déclaration de naissance et l’obtention de la « Kopia » (acte d’état civil) en mairie sont-elles vitales pour chaque enfant ?',
          questionMg:
            'Nahoana no tena zava-dehibe ho an’ny ankizy ny fananana kopia mari-pahaterahana ?',
          choices: [
            'Pour prouver son identité légale, sa citoyenneté malgache, pouvoir s’inscrire à l’école et passer les examens officiels',
            'Pour pouvoir voyager en avion gratuitement',
            'Pour avoir le droit de regarder la télévision',
            'Uniquement pour faire plaisir aux grands-parents',
          ],
          correctIndex: 0,
          explanation:
            "Sans acte d'état civil, un enfant devient un 'fantôme juridique', privé d'accès aux examens scolaires officiels et aux droits civiques.",
        },
        {
          type: 'quiz',
          question:
            'Qui dirige la Commune (Kaominina), vote son budget local et administre les services publics municipaux ?',
          questionMg:
            'Iza no mitantana ny Kaominina amin’ny fampandrosoana ny tanàna ?',
          choices: [
            'Le Maire élu (Ben’ny Tanàna) et les Conseillers municipaux',
            'Le commandant de gendarmerie',
            'Le chef de gare ferroviaire',
            'Le directeur de l’hôpital uniquement',
          ],
          correctIndex: 0,
          explanation:
            "Le Maire (*Ben'ny Tanàna*) élu démocratiquement par les habitants gère l'état civil, la voirie et le développement de la commune.",
        },
        {
          type: 'quiz',
          question:
            'Quel est le rôle traditionnel et civique du chef de Fokontany lors d’un différend ou d’une dispute entre voisins ?',
          questionMg:
            'Inona no andraikitry ny Filohan’ny Fokontany rehefa misy ady kely eo amin’ny mpiara-monina ?',
          choices: [
            'Tenter une médiation pacifique et réconcilier les parties dans l’esprit du Fihavanana avant tout recours en justice',
            'Mettre immédiatement tout le monde en prison sans écouter personne',
            'Exiger de l’argent pour lui-même',
            'Quitter le quartier sans répondre',
          ],
          correctIndex: 0,
          explanation:
            "Le chef de Fokontany agit en médiateur bienveillant (*fampihavanana*), désamorçant les tensions avant l'escalade judiciaire.",
        },
      ],
    },
    // ─── LEÇON 4 : LE DINA MODERNE HOMOLOGUÉ ───
    {
      slug: 'le-dina-moderne-convention-communautaire-homologuee',
      title:
        'Le Dina moderne homologué : articulation entre justice républicaine et coutume',
      titleMg:
        'Ny Dina voazaha ara-dalàna : Fifanarahan’ny Fiarahamonina sy ny Lalàna',
      summary:
        'Comprenez le fonctionnement du Dina moderne : le pacte de sécurité villageois validé par le tribunal pour lutter contre le vol de bœufs et protéger les forêts.',
      summaryMg:
        'Fantaro ny fiasan’ny Dina : fanekena ifanaovan’ny fokonolona nankatoavin’ny fitsarana hiarovana ny fandriampahalemana sy ny ala.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans le système juridique malgache contemporain, le 'Dina' occupe une place tout à fait singulière au confluent de la tradition ancestrale et du droit républicain moderne. Autrefois simple serment coutumier villageois, la loi malgache moderne (loi 2001-004) a institutionnalisé le Dina : pour être légal et exécutoire sans dériver vers la justice populaire, le Dina doit être rédigé démocratiquement par le Fokonolona puis obligatoirement homologué par le Tribunal de Première Instance.",
          textMg:
            "Eo amin'ny lalàna malagasy, ny Dina dia tetezana mampitohy ny fomba nentin-drazana sy ny fitsarana maotina. Mba hisorohana ny fitsaram-bahoaka, ny lalàna tamin'ny taona 2001 dia nametraka fa tsy maintsy ankatoavin'ny Fitsarana (homologation) ny Dina vao azo ampiharina amin'ny fandriampahalemana sy ny fiarovana ny tanàna.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DI / NA',
          phonetic: 'di-na',
          frenchEquivalent:
            "Le mot « Dina » désigne le pacte de convention collective solidaire librement consenti par les membres d'une communauté.",
          sampleWordMg: 'Dina',
          sampleTranslationFr:
            'Le pacte conventionnel / La charte communautaire',
        },
        {
          type: 'concept',
          termMg: 'Dina voazaha ara-dalàna (Homologation)',
          phonetic: 'di-na vou-a-za-ha a-ra-da-la-na',
          meaningFr:
            'L’homologation judiciaire obligatoire par un juge républicain',
          explanation:
            "Le magistrat vérifie que les sanctions prévues par le Dina ne violent pas les droits de l'homme (interdiction formelle des sévices corporels et des bannissements arbitraires).",
        },
        {
          type: 'concept',
          termMg: 'Fandriampahalemana any ambanivohitra (Ady amin’ny dahalo)',
          phonetic: 'fan-dri-am-pa-ha-le-ma-na',
          meaningFr:
            'La sécurité rurale et la surveillance contre les vols de bétail',
          explanation:
            "Dans les zones isolées où les forces de l'ordre sont éloignées, le Dina organise les rondes villageoises nocturnes et l'alerte collective solidaire.",
        },
        {
          type: 'concept',
          termMg: 'Fady ny fitsaram-bahoaka',
          phonetic: 'fa-di ni fit-sa-ram-ba-houa-ka',
          meaningFr:
            'L’interdiction absolue du lynchage et de la justice populaire',
          explanation:
            'Règle civique fondamentale : tout voleur ou suspect arrêté par le Fokonolona en vertu du Dina doit être immédiatement remis aux autorités régulières (Gendarmerie ou Police).',
        },
        {
          type: 'example',
          textMg:
            "Ny Dina ara-dalàna dia miaro ny fokonolona sy ny fananan'ny olona, tsy manitsakitsaka ny zon'olombelona fa mampianatra fanajana.",
          textFr:
            'Le Dina homologué protège la communauté et les biens des villageois, sans bafouer les droits humains, en enseignant le respect de la règle commune.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les Dina environnementaux (Dina fiarovana ny tontolo iainana) sont aujourd'hui l'arme la plus efficace à Madagascar pour stopper les feux de brousse illégaux : tout contrevenant surpris à allumer un feu dans la forêt sacrée est condamné par le village à replanter 100 jeunes arbres et à fournir un zébu pour le repas communautaire !",
          textMg:
            "Ny Dina miaro ny ala dia mahomby tokoa : izay mandoro ala dia voasazy hamboly hazo zato sy hanome omby ho an'ny fokonolona hanarenana ny fahasimbana.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle condition juridique obligatoire transforme un pacte villageois (Dina) en texte légalement applicable selon la loi malgache ?',
          questionMg:
            'Inona ny fepetra tsy maintsy fenoina vao manan-kery ara-dalàna ny Dina nifanarahan’ny fokonolona ?',
          choices: [
            'Son homologation officielle par le Tribunal de Première Instance après vérification de sa conformité aux lois républicaines',
            'La signature d’un commerçant du marché',
            'La diffusion sur une page Facebook',
            'Un simple accord verbal entre deux personnes',
          ],
          correctIndex: 0,
          explanation:
            "L'homologation judiciaire par un juge est indispensable pour conférer une valeur légale au Dina et écarter les peines illégales.",
        },
        {
          type: 'quiz',
          question:
            'Que prohibe formellement la loi républicaine malgache dans l’application d’un Dina villageois ?',
          questionMg:
            'Inona no raran’ny lalàna tanteraka tsy azo ampidirina ao anaty Dina na oviana na oviana ?',
          choices: [
            'Les sévices corporels, la torture, la mort et les actes de justice populaire (fitsaram-bahoaka)',
            'Les amendes financières raisonnables',
            'L’obligation de replanter des arbres détruits',
            'Les travaux d’intérêt général pour le village',
          ],
          correctIndex: 0,
          explanation:
            'Le Dina ne peut en aucun cas infliger des châtiments corporels : toute violence physique relève de la qualification pénale de crime.',
        },
        {
          type: 'quiz',
          question:
            'Dans quel domaine de la vie rurale le Dina s’avère-t-il particulièrement efficace pour suppléer l’éloignement des forces de l’ordre ?',
          questionMg:
            'Amin’inona amin’ireto sehatra ireto no tena mampahomby ny Dina any ambanivohitra ?',
          choices: [
            'La surveillance communautaire contre le vol de zébus et la lutte contre les feux de brousse',
            'La vente de billets de loterie',
            'La réparation des ordinateurs',
            'L’organisation de matchs de rugby internationaux',
          ],
          correctIndex: 0,
          explanation:
            'Le Dina responsabilise les habitants pour patrouiller solidairement la nuit et protéger le cheptel et les massifs forestiers.',
        },
        {
          type: 'quiz',
          question:
            'Que doit faire impérativement le Fokonolona dès qu’un auteur présumé de vol est appréhendé dans le cadre du Dina ?',
          questionMg:
            'Inona no tsy maintsy ataon’ny fokonolona raha vao misambotra olona nanao heloka tamin’ny Dina izy ireo ?',
          choices: [
            'Le remettre sain et sauf sans délai entre les mains de la Gendarmerie ou de la Police nationale',
            'Le juger soi-même et le frapper en public',
            'Le cacher dans une grotte sans nourriture',
            'Lui faire payer une rançon sans procès',
          ],
          correctIndex: 0,
          explanation:
            "La remise immédiate aux autorités légales est la règle d'or pour prévenir les dérives du lynchage populaire.",
        },
        {
          type: 'quiz',
          question:
            'Quel est le grand avantage du Dina environnemental pour la préservation des forêts sacrées de Madagascar ?',
          questionMg:
            'Inona ny tombontsoa lehibe entin’ny Dina eo amin’ny fiarovana ny tontolo iainana ?',
          choices: [
            'Les villageois appliquent eux-mêmes des sanctions locales immédiates (comme replanter des arbres) contre les pollueurs et incendiaires',
            'Il permet d’importer des produits chimiques de l’étranger',
            'Il autorise la coupe de tous les arbres rares',
            'Il supprime le travail des gardes forestiers',
          ],
          correctIndex: 0,
          explanation:
            "L'adhésion collective au Dina transforme chaque habitant en gardien volontaire de la forêt, rendant la protection écologique participative.",
        },
      ],
    },
    // ─── LEÇON 5 : LES DROITS ET DEVOIRS DU CITOYEN ───
    {
      slug: 'droits-et-devoirs-du-citoyen-malgache',
      title:
        'Droits et devoirs du citoyen malgache : vote, solidarité et fierté civique',
      titleMg:
        'Zo sy Adidin’ny Olom-pirenena Malagasy : Fananganana ny Firenena',
      summary:
        'Maîtrisez les piliers de la citoyenneté active : le devoir électoral sacré du vote, la contribution fiscale, la protection des biens publics et l’engagement pour la patrie.',
      summaryMg:
        'Mahereza amin’ny fahaiza-mitondra tena : ny fandraisana anjara amin’ny fifidianana, ny fandoavan-ketra, ny fiarovana ny fananam-bahoaka ary ny fitiavan-tanindrazana.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Être citoyen de la République de Madagascar ne se résume pas à posséder une carte nationale d'identité : c'est un équilibre noble entre des droits fondamentaux inaliénables (liberté d'expression, égalité devant la loi, droit d'aller et venir, droit à l'éducation) et des devoirs civiques impérieux. Parmi ces devoirs figurent le vote électoral démocratique, le paiement honnête de l'impôt, la protection jalouse du bien commun (fananam-bahoaka) et la défense de la patrie face aux périls.",
          textMg:
            "Ny maha-olom-pirenena malagasy dia fifandanjan'ny zo fototra (fahafahana maneho hevitra, fahafahana mandehandeha, fianarana) sy ny adidy lehibe amin'ny tanindrazana (fandrotsaham-bato amin'ny fifidianana, fandoavan-ketra, fiarovana ny fananam-bahoaka ary ny firaisankina).",
        },
        {
          type: 'phonetic',
          letterOrSound: 'O / LOM / PI / RE / NE / NA',
          phonetic: 'ou-loum-pi-re-ne-na',
          frenchEquivalent:
            "Le mot « Olom-pirenena » (citoyen) assemble 'Olona' (l'être humain accompli) et 'Firenena' (la nation souveraine).",
          sampleWordMg: 'Olom-pirenena',
          sampleTranslationFr: 'Le citoyen / Le membre conscient de la nation',
        },
        {
          type: 'concept',
          termMg: 'Zon’ny olom-pirenena (Zo fototra)',
          phonetic: 'zoun-ni ou-loum-pi-re-ne-na',
          meaningFr: 'Les libertés publiques et droits civiques fondamentaux',
          explanation:
            'Garantis par la Constitution : droit à la vie, liberté de conscience et de religion, égalité absolue entre hommes et femmes.',
        },
        {
          type: 'concept',
          termMg: 'Adidy amin’ny fifidianana (Latsa-bato)',
          phonetic: 'a-di-di a-min-ni fi-fi-di-a-na-na',
          meaningFr:
            'Le devoir électoral sacré d’expression citoyenne dans l’urne',
          explanation:
            "Voter en toute conscience et sans céder à la corruption pour choisir les dirigeants légitimes de la commune et de l'État.",
        },
        {
          type: 'concept',
          termMg: 'Fiarovana ny fananam-bahoaka',
          phonetic: 'fi-a-rou-va-na ni fa-na-nam-ba-houa-ka',
          meaningFr: 'Le respect scrupuleux et la sauvegarde du bien public',
          explanation:
            'Ne jamais dégrader les écoles, routes, hôpitaux ou bornes fontaines publiques, qui appartiennent à la communauté entière.',
        },
        {
          type: 'example',
          textMg:
            "Ny olom-banona dia tsy manontany fotsiny izay azon'ny firenena omena azy, fa manontany tena izay azony atolotra ho fampandrosoana an'i Madagasikara.",
          textFr:
            "Le citoyen accompli ne demande pas seulement ce que la patrie peut faire pour lui, mais ce qu'il peut apporter lui-même pour l'élévation de Madagascar.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "À Madagascar, la devise républicaine inscrite sur le sceau de l'État a évolué au fil des Républiques, mais a toujours conservé en son cœur l'amour inébranlable de la terre des ancêtres : « Tanindrazana - Fahafahana - Fandrosoana » (Patrie - Liberté - Progrès) !",
          textMg:
            "Ny teny filamatry ny Repoblika Malagasy : 'Tanindrazana - Fahafahana - Fandrosoana' no mampiray ny vahoaka amin'ny fitiavana ny tanindrazana.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel est le moyen démocratique suprême par lequel un citoyen malgache participe au choix des dirigeants de son pays ?',
          questionMg:
            'Inona ny fitaovana lehibe indrindra andraisan’ny olom-pirenena anjara amin’ny fisafidianana ny mpitondra azy ?',
          choices: [
            'Le vote régulier et secret lors des élections libres (Latsa-bato)',
            'Le tirage au sort par le hasard',
            'L’achat de votes avec de l’argent',
            'La désignation par la force physique',
          ],
          correctIndex: 0,
          explanation:
            "Le vote démocratique au suffrage universel direct est l'acte civique fondateur de la souveraineté populaire.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le paiement honnête de l’impôt et des taxes locales est-il un devoir civique primordial pour chaque citoyen ?',
          questionMg:
            'Nahoana no adidy lehibe ho an’ny rehetra ny fandoavan-ketra ara-drariny ?',
          choices: [
            'Pour financer les hôpitaux publics, les écoles gratuites, les routes et l’éclairage de nos villes et villages',
            'Pour enrichir personnellement les fonctionnaires de police',
            'Parce que c’est une punition imposée par l’étranger',
            'Pour empêcher les gens d’épargner de l’argent',
          ],
          correctIndex: 0,
          explanation:
            "L'impôt républicain finance les services publics indispensables à l'éducation des enfants et à la santé de toute la nation.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne le concept civique de « Fananam-bahoaka » qu’il est formellement interdit de saccager ?',
          questionMg:
            'Inona no hevitry ny hoe « Fananam-bahoaka » izay tsy azo simbaina velively ?',
          choices: [
            'Les infrastructures et biens publics (écoles, hôpitaux, lampadaires, bancs, bus) financés par l’argent commun',
            'La propriété privée d’une seule famille riche',
            'Les forêts sauvages inhabitées',
            'Les marchandises vendues dans les épiceries',
          ],
          correctIndex: 0,
          explanation:
            "Le bien public appartient solidairement à tous les Malgaches : le dégrader revient à s'appauvrir soi-même.",
        },
        {
          type: 'quiz',
          question:
            'À partir de quel âge un jeune citoyen malgache obtient-il le droit civique de voter et de posséder sa carte d’électeur ?',
          questionMg:
            'Firy taona no mahazo zo handatsa-bato amin’ny fifidianana ny tanora malagasy ?',
          choices: [
            '18 ans révolus (majorité civile et électorale)',
            '10 ans',
            '25 ans',
            '50 ans',
          ],
          correctIndex: 0,
          explanation:
            'La majorité électorale est fixée à 18 ans à Madagascar, ouvrant le plein exercice des droits civiques.',
        },
        {
          type: 'quiz',
          question:
            'Quelle devise officielle résume les idéaux fondateurs de la République de Madagascar ?',
          questionMg:
            'Inona ny teny filamatra ofisialin’ny Repoblikan’i Madagasikara ?',
          choices: [
            '« Tanindrazana - Fahafahana - Fandrosoana » (Patrie - Liberté - Progrès)',
            '« Travail - Famille - Patrie »',
            '« Liberté - Égalité - Fraternité »',
            '« L’union fait la force »',
          ],
          correctIndex: 0,
          explanation:
            "« Tanindrazana - Fahafahana - Fandrosoana » proclame l'attachement à la patrie ancestrale, la liberté conquise et la marche vers le développement partagé.",
        },
      ],
    },
  ],
};
