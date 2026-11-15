import { SeedTrack } from './seed.types.js';

export const philosophyTrack: SeedTrack = {
  slug: 'sagesses-atypiques-et-philosophie',
  title: 'Sagesses atypiques & Philosophie profonde',
  titleMg: 'Fahendrena Lalina sy Haifisainana Malagasy',
  description:
    "Plongez dans les profondeurs de la pensée et de la métaphysique malgaches : la cosmologie céleste du Trano Gasy, la thérapie holistique du Bilo, la justice cosmique du Tody, l'algèbre sacrée du Sikidy, l'astrologie du Vintana et l'énergie vitale du Hasina.",
  descriptionMg:
    "Diniho ny halalin'ny haifisainana sy ny finoana malagasy : ny firafitry ny Trano Gasy, ny fombafomba fanasitranana Bilo, ny famaizan'ny Tody, ny fahendren'ny Sikidy, ny fanandroana Vintana ary ny herin'ny Hasina.",
  level: 'ADVANCED',
  icon: 'Flame',
  color: '#0D9488',
  orderIndex: 7,
  estimatedMinutes: 85,
  lessons: [
    {
      slug: 'astronomie-et-cosmologie-du-trano-gasy',
      title:
        "Cosmologie du Trano Gasy : Les 12 Vintana et l'architecture sacrée",
      titleMg:
        "Ny Haifisainan'ny Trano Gasy : Ny Vintana sy ny Zoron-tany Masina",
      summary:
        'Comprenez pourquoi chaque porte, coin et pilier de la maison traditionnelle malgache est aligné sur le zodiaque et la bénédiction des ancêtres.',
      summaryMg:
        "Ianaro ny antony ametrahana ny varavarana, ny fandriana ary ny andry manaraka ny vintana 12 sy ny hasin'ny Razana.",
      type: 'TRADITION',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "La maison traditionnelle malgache (Trano Gasy) n'est pas une simple habitation matérielle : c'est un temple cosmologique vivant. Chaque orientation spatiale correspond à l'un des 12 Vintana (destins du zodiaque arabo-malgache) et régule la vie du lignage.",
          textMg:
            "Ny Trano Gasy nentin-drazana dia tsy fialofana fotsiny fa sarintanin'ny lanitra sy ny tontolo masina. Ny zorony sy ny rindriny rehetra dia milatsaka amin'ny iray amin'ireo Vintana 12 ary mandamina ny hasin'ny ankohonana.",
        },
        {
          type: 'concept',
          termMg: 'Zoron-tany',
          phonetic: 'zou-roun-ta-ni',
          meaningFr: 'Les quatre coins cardinaux de la terre et de la maison',
          explanation:
            'Les quatre angles sacrés qui ancrent la maison dans les forces cosmiques et terrestres.',
        },
        {
          type: 'concept',
          termMg: 'Zoro Alahamady (Avaratra-Atsinanana)',
          phonetic: 'zou-rou a-la-ha-ma-di',
          meaningFr: 'Le coin Nord-Est : angle le plus sacré et noble',
          explanation:
            "Le coin des ancêtres (Razana) et de la royauté. C'est là que sont déposés les objets sacrés et que s'oriente la tête du lit d'honneur.",
        },
        {
          type: 'concept',
          termMg: 'Andry iankinana',
          phonetic: 'an-dri ian-ki-na-na',
          meaningFr: 'Le poteau maître central de la maison',
          explanation:
            "Pilier en bois noble qui soutient le faîte du toit, métaphore du père protecteur ou de l'aîné garant de l'unité familiale.",
        },
        {
          type: 'concept',
          termMg: 'Varavarana Andrefana',
          phonetic: 'va-ra-va-ra-na an-dre-fa-na',
          meaningFr: "La porte principale s'ouvrant vers l'Ouest",
          explanation:
            "Permet de se protéger des vents violents d'Est (l'Alizé) et d'évacuer symboliquement les impuretés et malheurs au soleil couchant.",
        },
        {
          type: 'example',
          textMg:
            "Eo amin'ny zoro Alahamady no apetrak'ireo ray aman-dreny ny tsodrano sy ny fanatitra masina.",
          textFr:
            "C'est dans le coin Alahamady (Nord-Est) que les aînés déposent les bénédictions et les offrandes sacrées.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans la coutume malgache, il est strictement tabou (fady) de dormir les pieds pointés vers le Nord ou le coin Alahamady ! Pointer ses pieds vers la direction sacrée des ancêtres est perçu comme un outrage ('manao tongotra an-doha'). C'est pourquoi le lit des parents a toujours la tête orientée au Nord.",
          textMg:
            "Fady tanteraka amin'ny fomba malagasy ny matory manondro tongotra mianavaratra na mankany amin'ny zoro Alahamady ! Fanevatevana ny Razana izany (« manao tongotra an-doha »). Noho izany, ny lohan'ny fandrian'ny lehibe dia mitodika mianavaratra hatrany.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quel angle de la maison traditionnelle malgache est considéré comme le plus sacré et dédié aux ancêtres ?',
          questionMg:
            "Inona no zoron-trano heverina ho masina sy mendrika indrindra natokana ho an'ny Razana ?",
          choices: [
            'Le coin Nord-Est (Zoro Alahamady)',
            'Le coin Sud-Ouest (Zoro Alimizana)',
            'Le coin Sud-Est (Zoro Asorotany)',
            'Le centre de la cuisine uniquement',
          ],
          correctIndex: 0,
          explanation:
            'Le coin Nord-Est (Alahamady) est la direction royale et ancestrale par excellence dans la cosmologie malgache.',
        },
        {
          type: 'quiz',
          question:
            "Vers quel point cardinal s'ouvre traditionnellement la porte principale du Trano Gasy ?",
          questionMg:
            "Mankany amin'ny lafiny tany aiza no mivoha ny varavarambe idiran'ny Trano Gasy ?",
          choices: [
            "Vers l'Ouest (Andrefana)",
            "Vers l'Est directement face au vent",
            'Vers le Sud exclusivement',
            'Vers le sous-sol secret',
          ],
          correctIndex: 0,
          explanation:
            "La porte est tournée vers l'Ouest pour parer les vents dominants d'Est (alizés) et laisser sortir le mal avec le couchant.",
        },
        {
          type: 'quiz',
          question:
            'Que représente le poteau central « Andry iankinana » sur le plan spirituel et familial ?',
          questionMg:
            "Inona no hevitra ara-panahy sy ara-pianakaviana fonosin'ny « Andry iankinana » ?",
          choices: [
            'Le soutien vital, le chef de famille et la colonne vertébrale morale du foyer',
            'Un simple piquet pour attacher les cordes de linge',
            'Un espace de stockage de grains de café',
            'Un instrument pour mesurer la pluie',
          ],
          correctIndex: 0,
          explanation:
            "L'Andry iankinana est le pilier d'appui du foyer, métaphore du parent sur lequel repose toute la sécurité du clan.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi est-il tabou (fady) de dormir avec les pieds dirigés vers le Nord dans la chambre ?',
          questionMg:
            'Nahoana no fady ny matory manondro tongotra mianavaratra ao an-trano ?',
          choices: [
            'Parce que pointer ses pieds vers la direction sacrée des ancêtres est un manque de respect (tongotra an-doha)',
            "Parce que la lune risque d'éblouir les yeux",
            'Parce que cela attire les insectes du jardin',
            'Parce que les portes ne ferment pas correctement',
          ],
          correctIndex: 0,
          explanation:
            'Le Nord et le coin Alahamady incarnent le respect sacré des ancêtres : y pointer ses pieds est un affront rituel.',
        },
        {
          type: 'quiz',
          question:
            "Quel spécialiste traditionnel est consulté pour déterminer l'orientation et l'heure faste de construction de la maison ?",
          questionMg:
            'Iza ilay olonkendry fomban-drazana anontaniana ny andro tsara sy ny fandrindrana ny trano ?',
          choices: [
            "Le Mpanandro (l'astrologue traditionnel dépositaire du Vintana)",
            'Le forgeron du marché voisin',
            'Le joueur de flûte Sodina',
            'Le pêcheur de crabes',
          ],
          correctIndex: 0,
          explanation:
            'Le Mpanandro calcule les phases astrologiques et les forces du Vintana pour garantir paix et prospérité au foyer.',
        },
      ],
    },
    {
      slug: 'le-fitampoha-et-le-rite-therapeutique-du-bilo',
      title:
        "Le Fitampoha et le Bilo : Rituels d'eau sacrée et guérison collective",
      titleMg:
        "Ny Fitampoha sy ny Bilo : Rano Masina sy Fanasitranana Iraisan'ny Maro",
      summary:
        'Explorez le bain royal des reliques du Menabe sur la Tsiribihina et la thérapie sociale du Bilo où le malade est honoré comme un prince.',
      summaryMg:
        "Diniho ny fandroana ny Dadin'ny mpanjaka any Menabe sy ny fombafomba Bilo anasitranana ny manjo am-pitiavana.",
      type: 'CULTURE',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "À Madagascar, la santé et la royauté sont indissociables de la communion avec l'eau et les esprits. Deux rites majeurs illustrent cette force : le Fitampoha (bain des reliques royales chez les Sakalava) et le Bilo (rite de guérison psycho-spirituelle collective).",
          textMg:
            "Eo amin'ny tontolo malagasy, ny fahasalamana sy ny fanjakana dia mifamatotra amin'ny rano masina sy ny fanahin'ny Razana. Ohatra velona amin'izany ny Fitampoha any Menabe sy ny fomban'ny Bilo feno fihavanana.",
        },
        {
          type: 'concept',
          termMg: 'Fitampoha',
          phonetic: 'fi-tam-pou-ha',
          meaningFr:
            'Le grand bain rituel des reliques sacrées des rois Maroseragna',
          explanation:
            'Célébration quinquennale majeure sur le fleuve Tsiribihina où les reliques sont immergées pour purifier et régénérer le royaume.',
        },
        {
          type: 'concept',
          termMg: 'Dady',
          phonetic: 'da-di',
          meaningFr: 'Les reliques sacrées des souverains défunts',
          explanation:
            'Dents, ongles ou vertèbres enveloppés de soie et conservés dans la case sacrée Zomba, supports tangibles du Hasina royal.',
        },
        {
          type: 'concept',
          termMg: 'Bilo',
          phonetic: 'bi-lou',
          meaningFr:
            "Rituel communautaire de guérison et d'apaisement de l'âme",
          explanation:
            "Cérémonie où un malade en détresse est pris en charge par tout son village, paré de bijoux d'argent et choyé au son des chants.",
        },
        {
          type: 'concept',
          termMg: 'Mpisandrina',
          phonetic: 'mpi-san-dri-na',
          meaningFr:
            'Les gardiennes et prêtresses sacrées des reliques royales',
          explanation:
            'Femmes de haut lignage seules autorisées à manipuler et oindre les reliques lors des cérémonies sacrées.',
        },
        {
          type: 'example',
          textMg:
            "Nankalaza ny Fitampoha teo amoron'ny renirano Tsiribihina ny vahoaka Sakalava tamin'ny hafaliana lehibe.",
          textFr:
            'Le peuple Sakalava a célébré le Fitampoha sur les rives du fleuve Tsiribihina dans une allégresse immense.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pendant le rite du Bilo, le malade n'est jamais isolé ni culpabilisé : il 'devient le Bilo'. On l'habille de soieries, on lui prépare les meilleurs mets et tout le village danse jour et nuit autour de lui. Pour les anciens, la guérison provient de cette restauration spectaculaire de l'amour et de l'estime collective.",
          textMg:
            "Mandritra ny fomban'ny Bilo, tsy ailikilika velively ilay marary : 'lasa Bilo' izy. Tafi बौद्धiana lamba soa, omena sakafo tsara ary mandihy andro aman'alina ny mpiray tanàna. Ny fanehoana fitiavana sy firaisankina no tena fanafody manasitrana ny fony.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Sur quel grand fleuve de l'Ouest malgache se déroule traditionnellement le rituel du Fitampoha ?",
          questionMg:
            "Eo amin'ny renirano lehibe aiza any Andrefana no anatanterahana ny fombafomban'ny Fitampoha ?",
          choices: [
            'Le fleuve Tsiribihina (dans la région du Menabe)',
            'Le fleuve Betsiboka à Mahajanga',
            'Le fleuve Ikopa à Antananarivo',
            "Le fleuve Mangoro à l'Est",
          ],
          correctIndex: 0,
          explanation:
            'Le Fitampoha rassemble des milliers de pèlerins sur les rives et bancs de sable de la Tsiribihina (à Belo-sur-Tsiribihina).',
        },
        {
          type: 'quiz',
          question:
            'Que sont exactement les « Dady » immergés rituellement pendant le Fitampoha ?',
          questionMg:
            'Inona marina moa ireo antsoina hoe « Dady » alona an-drano mandritra ny Fitampoha ?',
          choices: [
            'Les reliques sacrées (ossements, dents) des anciens souverains de la dynastie Maroseragna',
            "Des statues en bois sculpté venues d'Europe",
            'Des pierres précieuses trouvées dans les mines',
            'Des livres de prières coloniaux',
          ],
          correctIndex: 0,
          explanation:
            'Les Dady sont les précieuses reliques corporelles des rois fondateurs, dépositaires du Hasina royal.',
        },
        {
          type: 'quiz',
          question:
            'Dans le rite traditionnel du « Bilo », quel statut exceptionnel accorde-t-on à la personne malade ?',
          questionMg:
            "Eo amin'ny fomba fitsaboana « Bilo », inona no toerana manokana omena an'ilay olona marary ?",
          choices: [
            "Elle est parée comme une reine/princesse et choyée au centre de l'attention de tout le village",
            'Elle est chassée et isolée dans la forêt profonde',
            'Elle est contrainte de jeûner dans le silence total',
            'Elle doit payer une lourde amende au chef de canton',
          ],
          correctIndex: 0,
          explanation:
            "La personne 'devient le Bilo' : elle est couronnée, honorée et guérie par la solidarité chaleureuse de la communauté.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on la case royale sacrée où sont conservées les reliques royales Sakalava ?',
          questionMg:
            "Ahoana no anaran'ilay trano masina ametrahana sy anjakana ireo Dadin'ny mpanjaka Sakalava ?",
          choices: [
            'Le Zomba (ou Doany masina)',
            'Le Tranovato',
            'Le Kianja',
            'Le Rova',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Zomba' est l'édifice royal sacré abritant les reliques et surveillé en permanence par les gardiens coutumiers.",
        },
        {
          type: 'quiz',
          question:
            "Quel rôle primordial joue la musique polyphonique et le tambour lors d'un rituel de Bilo ?",
          questionMg:
            "Inona no andraikitra lehibe sahanin'ny hira sy ny amponga amin'ny lanonana Bilo ?",
          choices: [
            "Faciliter la transe libératrice, rétablir la paix de l'esprit et reconnecter le malade aux siens",
            'Endormir tous les assistants pour la nuit',
            'Faire fuir le bétail vers les collines',
            'Remplacer le traitement chirurgical des hôpitaux',
          ],
          correctIndex: 0,
          explanation:
            "Les chants et tambours créent un bain sonore d'amour et de résonance spirituelle qui libère les tensions intérieures.",
        },
      ],
    },
    {
      slug: 'la-loi-cosmique-du-tsiny-et-du-tody',
      title:
        'Le Tsiny et le Tody : La loi métaphysique de la justice immanente',
      titleMg: 'Ny Tsiny sy ny Tody : Lalàna Masina Mandidy ny Aina',
      summary:
        'Comprenez pourquoi le Malgache craint le Tsiny invisible plus que tout et remet la justice au tribunal infaillible du Tody.',
      summaryMg:
        "Fantaro ny antony atahorana ny Tsiny mihoatra ny olombelona sy ny finoana tsy mihozongozona amin'ny famaizan'ny Tody.",
      type: 'LITERATURE',
      orderIndex: 3,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au sommet de la philosophie morale malgache règnent deux concepts jumeaux : le Tsiny (la faute diffuse et le blâme cosmique) et le Tody (le retour de bâton inéluctable ou la rétribution en miroir). Ils constituent l'armature éthique de toute la société traditionnelle.",
          textMg:
            "Eo an-tampon'ny fomba fisainana malagasy no misy ny Tsiny (tsiny tsy hita maso manakodia ny lehibe) sy ny Tody (ny valin'ny natao mandondòna tsy miery). Ireo no fototry ny fitondran-tena sy ny fandriampahalemana teo amin'ny Ntaolo.",
        },
        {
          type: 'concept',
          termMg: 'Tsiny',
          phonetic: 'tsi-ni',
          meaningFr: 'Le blâme cosmique / La faute morale immanente',
          explanation:
            "Force spirituelle invisible qui frappe quiconque déroge aux convenances, transgresse la parole ou blesse un semblable ('Ny tsiny toy ny rivotra : tsy hita fa mahatsiravina').",
        },
        {
          type: 'concept',
          termMg: 'Tody',
          phonetic: 'tou-di',
          meaningFr: "La rétribution cosmique / L'effet miroir immanent",
          explanation:
            "Loi infaillible selon laquelle tout acte mauvais ou injuste finit inexorablement par retomber sur son auteur ('Ny tody tsy miery fa mandondòna').",
        },
        {
          type: 'concept',
          termMg: 'Fialan-tsiny',
          phonetic: 'fia-lan-tsi-ni',
          meaningFr: "La demande solennelle d'exonération du blâme",
          explanation:
            "Rituel verbal obligatoire au début de chaque discours ou kabary pour écarter le Tsiny avant d'émettre la moindre idée.",
        },
        {
          type: 'concept',
          termMg: 'Valy faty tsy fomban-drazana',
          phonetic: 'va-li fa-ti tsi foum-ban-dra-za-na',
          meaningFr:
            "La vengeance personnelle n'appartient pas à la coutume des ancêtres",
          explanation:
            'Principe fondamental : la vengeance violente est inutile et bannie, car le Tody céleste se chargera de rétablir la justice avec exactitude.',
        },
        {
          type: 'example',
          textMg:
            "Aza manao ratsy amin'ny mpiara-belona, fa ny tody tsy miery fa mandondòna amin'ny varavarana.",
          textFr:
            'Ne faites pas de tort à votre prochain, car le tody (la rétribution) ne se cache pas : il vient frapper à la porte.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le proverbe malgache affirme : « Ny tsiny toy ny tsorakazo malefaka : manakodia ny lehibe, mampianjera ny madinika » (Le tsiny est comme une tige souple : il fait trébucher les grands et culbute les petits). Même un roi puissant ne peut échapper au Tsiny s'il viole le serment fait à son peuple.",
          textMg:
            "Hoy ny ohabolana malagasy : « Ny tsiny toy ny tsorakazo malefaka : manakodia ny lehibe, mampianjera ny madinika ». Na ny mpanjaka mahery indrindra aza tsy mahatohitra ny Tsiny raha manitsakitsaka ny velirano nifanaovana tamin'ny vahoaka.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Que compare le proverbe traditionnel lorsqu'il décrit la nature invisible et redoutable du « Tsiny » ?",
          questionMg:
            "Amin'inona no ampitahana ny Tsiny amin'ny ohabolana milaza hoe « tsy hita fa mahatsiravina » ?",
          choices: [
            'Au vent (Ny tsiny toy ny rivotra : tsy hita fa mahatsiravina)',
            "À une pierre lourde au fond de l'eau",
            "Au chant d'un oiseau migrateur",
            "À la flamme d'une bougie éteinte",
          ],
          correctIndex: 0,
          explanation:
            "Le Tsiny est invisible comme le vent ('toy ny rivotra'), mais ses effets sur le destin sont dévastateurs.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie le grand adage proverbial « Ny tody tsy miery fa mandondòna » ?',
          questionMg:
            'Inona no hevitry ny ohabolana fanta-daza hoe « Ny tody tsy miery fa mandondòna » ?',
          choices: [
            'La rétribution du mal commis ne se cache jamais et finit toujours par frapper à la porte de son auteur',
            'Il faut toujours fermer sa porte à clé la nuit',
            'Le voyageur fatigué a le droit de frapper à toute porte pour dormir',
            'Les ancêtres ne reviennent jamais visiter les vivants',
          ],
          correctIndex: 0,
          explanation:
            "Le Tody est la loi de cause à effet : nul n'échappe aux conséquences de ses mauvaises actions.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les orateurs malgaches commencent-ils TOUJOURS leur discours par le « Fialan-tsiny » ?',
          questionMg:
            "Nahoana ny mpikabary no manomboka foana amin'ny « Fialan-tsiny » alohan'ny hilazana ny votoatin-dresaka ?",
          choices: [
            "Pour désamorcer le blâme sacré, faire preuve d'humilité et ne pas heurter les anciens ni les ancêtres",
            "Parce qu'ils ne connaissent pas leur texte par cœur",
            'Pour faire passer le temps plus vite',
            'Parce que la loi coloniale les y obligeait',
          ],
          correctIndex: 0,
          explanation:
            'Le Fialan-tsiny est une précaution rituelle indispensable pour parler avec respect sans attirer la foudre du Tsiny.',
        },
        {
          type: 'quiz',
          question:
            'Quelle position morale la philosophie ancestrale malgache adopte-t-elle face à la vengeance personnelle ?',
          questionMg:
            'Inona no fampianarana nentin-drazana malagasy momba ny valifaty manokana ?',
          choices: [
            'La vengeance est bannie car le Tody immanent rétablit la justice de manière infaillible sans salir ses mains',
            'Il est ordonné de se venger sur le champ par les armes',
            'Seuls les enfants ont le droit de se venger',
            'La vengeance doit être célébrée en public avec fierté',
          ],
          correctIndex: 0,
          explanation:
            "Le dicton 'Valy faty tsy fomban-drazana' rappelle que la vengeance envenime le destin : le Tody naturel s'en charge.",
        },
        {
          type: 'quiz',
          question:
            'Quelle arme de paix et de protection les parents transmettent-ils pour immuniser leurs descendants contre le Tsiny ?',
          questionMg:
            "Inona no fiadiana masina feno fitiavana omen'ny ray aman-dreny hiarovana ny taranaka amin'ny Tsiny ?",
          choices: [
            "Le Tsodrano (la bénédiction sacrée par le souffle et l'eau)",
            'Un sabre forgé en acier trempé',
            "Un coffre rempli de pièces d'or",
            'Un talisman de guerre secret',
          ],
          correctIndex: 0,
          explanation:
            'Le Tsodrano des aînés transmet la bienveillance, la baraka et crée une barrière inviolable contre le Tsiny.',
        },
      ],
    },
    {
      slug: 'la-divination-du-sikidy-geometrie-sacree-des-graines',
      title:
        'La divination du Sikidy : géométrie sacrée des graines et algèbre du destin',
      titleMg: "Ny Fahendren'ny Sikidy : Haifisainana sy ny Voan-kily",
      summary:
        "Explorez la logique philosophique du Sikidy : l'algèbre des 16 figures sacrées, le rôle de l'Ombiasy et le rituel d'apaisement du Faditra.",
      summaryMg:
        "Fantaro ny fahendrena fonosin'ny Sikidy : ny fahaizan'ny Ombiasy, ireo renitsikidy 16 ary ny fandaminana ny fiainana.",
      type: 'TRADITION',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Loin d'une simple superstition fortuite, le **Sikidy** constitue un système métaphysique et géomantique d'une complexité mathématique remarquable. Manipulé par l'**Ombiasy** (savant devin-guérisseur et philosophe communautaire), le Sikidy utilise seize graines polies de tamarinier (*Voan-kily*) disposées sur une natte pure pour générer seize figures binaires (*Renin-tsikidy* et *Zanan-tsikidy*). Son but n'est pas de prédire aveuglément l'avenir, mais de diagnostiquer les ruptures d'harmonie cosmique et de prescrire le remède spirituel (*Faditra* ou *Sorona*) pour rétablir la paix de l'être.",
          textMg:
            "Tsy filokana na finoanoam-poana ny **Sikidy**, fa haifisainana sy rafitra ara-kajy tena lalina. Ny **Ombiasy** (olon-kendry mpitsabo sy mpanoro hevitra) dia mampiasa voan-kily 16 latsahina eo ambony tsihy madio mba hamoahana ireo sarin-tsikidy 16 (Renin-tsikidy sy Zanan-tsikidy). Ny tanjony dia tsy ny haminany fotsiny, fa ny hikaroka ny anton'ny olana sy hanolotra **Faditra** na vahaolana mampody ny fiadanana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'SIKIDY',
          phonetic: 'si-ki-di',
          frenchEquivalent:
            "Dérive du mot sémitique d'origine « Sihr » ou géomancie astrale médiévale (ex: Sikidy, Ombiasy).",
          sampleWordMg: 'Sikidy',
          sampleTranslationFr: 'Géomancie sacrée traditionnelle malgache',
        },
        {
          type: 'concept',
          termMg: 'Sikidy',
          phonetic: 'si-ki-di',
          meaningFr:
            "L'art divinatoire géomantique traditionnel par les graines",
          explanation:
            "Système séculaire combinant les principes pairs (deux graines) et impairs (une graine) pour former une matrice d'orientation spirituelle et morale.",
        },
        {
          type: 'concept',
          termMg: 'Ombiasy',
          phonetic: 'oum-bi-a-si',
          meaningFr:
            'Le sage, médecin traditionnel, astrologue et maître de sagesse',
          explanation:
            "Détenteur respecté des savoirs thérapeutiques (plantes médicinales), astrologiques et coutumiers, garant de l'équilibre du village.",
        },
        {
          type: 'concept',
          termMg: 'Voan-kily',
          phonetic: 'vouan-ki-li',
          meaningFr: 'Graines dures de tamarinier utilisées pour la divination',
          explanation:
            'Graines lisses et inaltérables choisies pour leur pureté symbolique et leur régularité géométrique lors du tirage sur la natte.',
        },
        {
          type: 'concept',
          termMg: 'Faditra',
          phonetic: 'fa-di-tsa',
          meaningFr:
            "Le rite d'exorcisme symbolique et de rejet du mauvais sort",
          explanation:
            "Action réparatrice (don d'une herbe, d'une pierre, d'une cendre ou d'une pièce) prescrite par le Sikidy pour chasser l'infortune et purifier l'aura.",
        },
        {
          type: 'example',
          textMg:
            'Nandinika ny voan-kily teo ambony tsihy ny Ombiasy ka nahita ny fomba hampodiana ny hasina.',
          textFr:
            "L'Ombiasy a scruté la disposition des graines sur la natte et a discerné le rituel nécessaire pour restaurer la force sacrée (hasina).",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Les anthropologues et mathématiciens contemporains étudient le Sikidy comme l'un des ancêtres des algorithmes binaires : les seize figures canoniques (Tareky, Asorotany, Alahasady, Alakaosy...) correspondent exactement aux combinaisons binaires (0 et 1) utilisées dans l'informatique moderne !",
          textMg:
            "Ireo mpahay matematika ma современina dia talanjona amin'ny firafitry ny Sikidy : ireo sary 16 (Tareky, Alahasady, Asorotany...) dia mampiasa ny fitsipiky ny isa roa (binaire : 1 sy 2), mitovy tanteraka amin'ny fototry ny kajimirindra informatika ankehitriny !",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Quelles graines végétales lisses et nobles sont traditionnellement utilisées pour consulter le Sikidy ?',
          questionMg:
            "Inona ireo voan-javamaniry ampiasain'ny Ombiasy rehefa mandatsaka Sikidy ?",
          choices: [
            'Les graines de tamarinier (Voan-kily)',
            'Des grains de maïs grillés',
            'Des pépins de pomme',
            'Des grains de café moulu',
          ],
          correctIndex: 0,
          explanation:
            'Les graines de tamarinier (Voan-kily), polies et durables, constituent le support rituel traditionnel par excellence du Sikidy.',
        },
        {
          type: 'quiz',
          question:
            'Quel titre traditionnel désigne le maître guérisseur, devin et conseiller communautaire malgache ?',
          questionMg:
            "Iza no anarana iantsoana ilay olon-kendry mpitsabo sy mpanolotsaina eo amin'ny fiaraha-monina ?",
          choices: [
            "L'Ombiasy",
            'Le Mpiandry omby',
            'Le Mpivarotra',
            'Le Mpamboly',
          ],
          correctIndex: 0,
          explanation:
            "L'Ombiasy est le sage traditionnel détenteur de la connaissance des plantes, des astres et de la métaphysique du Sikidy.",
        },
        {
          type: 'quiz',
          question:
            'Quel support traditionnel et pur est impérativement étalé au sol pour disposer le Sikidy ?',
          questionMg:
            "Inona ilay fitaovana madio velarina amin'ny tany ametrahana ny Sikidy ?",
          choices: [
            'Une natte neuve en jonc tressé (Tsihy madio)',
            'Une feuille de papier journal',
            'Une plaque de tôle ondulée',
            'Une bâche plastique usagée',
          ],
          correctIndex: 0,
          explanation:
            'Le Sikidy ne peut être interrogé que sur une natte végétale pure et propre (tsihy madio), symbole de clarté spirituelle.',
        },
        {
          type: 'quiz',
          question:
            "Quel principe mathématique rigoureux structure l'ensemble des figures du Sikidy ?",
          questionMg:
            'Inona ilay fitsipika ara-kajy mifehy ny fandrafetana ireo sarin-tsikidy ?',
          choices: [
            'Un système binaire logique de points pairs et impairs',
            'Une division par dix décimale',
            'Un hasard total sans aucune règle',
            'Une formule de trigonométrie sphérique',
          ],
          correctIndex: 0,
          explanation:
            'Le Sikidy repose sur une combinatoire binaire stricte (une ou deux graines) générant 16 figures géomantiques immuables.',
        },
        {
          type: 'quiz',
          question:
            "Quel est l'objectif premier d'une consultation de Sikidy selon la philosophie ancestrale ?",
          questionMg:
            "Inona ny tena tanjona lehibe amin'ny fandatsahana Sikidy eo amin'ny fiainana ?",
          choices: [
            "Diagnostiquer les ruptures d'harmonie et prescrire l'apaisement spirituel réparateur (Faditra)",
            "Deviner les numéros d'un jeu de hasard moderne",
            'Provoquer des querelles entre voisins de village',
            'Remplacer les consultations chez le médecin moderne',
          ],
          correctIndex: 0,
          explanation:
            "Le Sikidy cherche à rétablir l'équilibre de l'âme et du destin en identifiant les blocages pour les neutraliser par le Faditra.",
        },
      ],
    },
    {
      slug: 'l-astrologie-ancestrale-du-vintana-et-les-destins',
      title:
        'Le Vintana et la roue du zodiaque : destins lunaires et harmonie cosmique',
      titleMg: 'Ny Fanandroana sy ny Vintana : Ireo Renim-bintana Roambinifolo',
      summary:
        "Comprenez la roue des 12 Vintana : l'orientation cardinale de l'espace, la résonance cosmique et le dépassement du destin fatal.",
      summaryMg:
        "Ianaro ny tontolon'ny Vintana : ireo renim-bintana 12, ny zoro firarazana ary ny fampihavanana ny olona amin'ny lahatra.",
      type: 'TRADITION',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la conception du monde malgache, l'homme ne vit pas isolé dans le temps et l'espace : il est intimement tissé avec le cosmos à travers le système du **Vintana** (astrologie lunaire ancestrale). Composée de douze signes majeurs (**Renim-bintana**) hérités de traditions arabo-malgaches et adaptés au climat insulaire, la roue du Vintana gouverne les jours fastes, les moments propices aux semailles ou aux voyages, et détermine les traits fondamentaux de chaque être humain. La philosophie malgache enseigne qu'aucun destin n'est une prison fatale : par la sagesse et le sacrifice (*Faditra*), chaque déséquilibre peut être harmonisé.",
          textMg:
            "Eo amin'ny fomba fisainana malagasy, ny olombelona dia mifamatotra tanteraka amin'ny kintana sy ny tsinam-bolana amin'ny alalan'ny **Vintana**. Misy **Renim-bintana roambinifolo** mifehy ny andro tsara sy ratsy, ny fotoana fambolena na fanaovana lanonana, ary ny toetran'ny olona tsirairay. Ny fahendrena malagasy anefa dia manambara fa ny lahatra dia tsy fanamelohana : amin'ny alalan'ny fahendrena sy ny **Faditra**, ny vintana mahery dia azo havadika ho fiadanana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VINTANA',
          phonetic: 'vin-ta-na',
          frenchEquivalent:
            "Le mot « Vintana » englobe à la fois le signe astrologique, le destin, la chance et l'harmonie temporelle.",
          sampleWordMg: 'Vintana',
          sampleTranslationFr: 'Destin astrologique lunaire / Heure propice',
        },
        {
          type: 'concept',
          termMg: 'Renim-bintana Roambinifolo',
          phonetic: 're-nim-vin-ta-na rouam-bi-ni-fou-lou',
          meaningFr: 'Les douze signes mères du zodiaque lunaire malgache',
          explanation:
            'Alahamady, Adaoro, Adizaoza, Asorotany, Alahasaty, Asombola, Adimizana, Alakarabo, Alakaosy, Adijady, Adalo, Alohotsy.',
        },
        {
          type: 'concept',
          termMg: 'Alahamady (Nord-Est)',
          phonetic: 'a-la-ha-ma-di',
          meaningFr: 'Le destin royal souverain, noble et premier',
          explanation:
            "Gouverne le coin sacré Nord-Est de la maison malgache (*Zoro Firarazana*), symbole d'autorité bienveillante et de sainteté.",
        },
        {
          type: 'concept',
          termMg: 'Alakaosy (Sud-Ouest)',
          phonetic: 'a-la-ka-ou-si',
          meaningFr: 'Le signe du feu vigoureux et indomptable',
          explanation:
            'Destin redoutable par sa puissance explosive ; autrefois adouci dès la naissance par un bain rituel pour transformer sa fougue en leadership protecteur.',
        },
        {
          type: 'concept',
          termMg: 'Zoro Firarazana',
          phonetic: 'zou-rou fi-ra-ra-za-na',
          meaningFr: 'Le coin sacré Nord-Est de la maison dédié aux ancêtres',
          explanation:
            "Emplacement architectural le plus sacré du foyer où l'on dépose les offrandes, les nattes de prières et les bénédictions familiales.",
        },
        {
          type: 'example',
          textMg:
            'Nanontany mpanandro ny fianakaviana mba hahalala ny andro tsara hanorenana ny trano vaovao.',
          textFr:
            "La famille a consulté l'astrologue traditionnel (Mpanandro) pour connaître le jour faste idéal pour poser les fondations de la nouvelle demeure.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le grand roi Ralambo, fondateur de nombreuses institutions royales d'Imerina au XVIe siècle, est né sous le signe d'Alahamady. C'est sous ce même signe faste qu'il a institué la fête sacrée du Nouvel An malgache (Fandroana), consacrant ainsi le mois d'Alahamady comme le renouveau de toute la Grande Île.",
          textMg:
            "Ny mpanjaka Ralambo tamin'ny taonjato faha-16 dia teraka tamin'ny andro Alahamady. Tamin'io vintana ambony io indrindra no nametrahany ny fankalazana ny Fandroana na Taom-baovao malagasy, ho fanandratana ny hasin'ny firenena rehetra.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            'Combien de signes ou destins majeurs (Renim-bintana) composent le zodiaque traditionnel malgache ?',
          questionMg:
            "Firy ny isan'ireo Renim-bintana lehibe ao amin'ny fanandroana malagasy ?",
          choices: [
            'Douze (Renim-bintana roambinifolo)',
            'Sept seulement',
            'Vingt-quatre',
            'Quatre comme les saisons',
          ],
          correctIndex: 0,
          explanation:
            'Le zodiaque lunaire malgache compte douze Renim-bintana régissant les mois, les jours et les directions cardinales.',
        },
        {
          type: 'quiz',
          question:
            "Quel signe astrologique royal d'excellence régit le coin sacré Nord-Est de la maison malgache ?",
          questionMg:
            "Inona ilay vintan'ny mpanjaka mamaritra ny zoro avaratra atsinanana amin'ny trano gasy ?",
          choices: ["L'Alahamady", "L'Asorotany", "L'Alakaosy", "L'Adimizana"],
          correctIndex: 0,
          explanation:
            "L'Alahamady est le premier signe cardinal, associé au coin Nord-Est (Zoro Firarazana) et à la souveraineté.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le maître astrologue coutumier chargé de déterminer les jours fastes (Andro tsara) ?',
          questionMg:
            'Ahoana no iantsoana ilay manampahaizana manokana momba ny kintana sy ny andro tsara ?',
          choices: [
            'Le Mpanandro',
            'Le Mpihira gasy',
            'Le Mpandihy',
            'Le Mpanao taozavatra',
          ],
          correctIndex: 0,
          explanation:
            "Le Mpanandro est l'astrologue coutumier qui scrute la marche des lunes et le Vintana pour orienter les grands actes de la vie.",
        },
        {
          type: 'quiz',
          question:
            'Comment la sagesse malgache conçoit-elle le destin individuel face au Vintana ?',
          questionMg:
            "Ahoana ny fomba fijerin'ny fahendrena malagasy ny anjara sy ny vintana ?",
          choices: [
            "Le destin n'est pas une fatalité : la sagesse et les rites d'apaisement (Faditra) permettent de l'harmoniser",
            "L'homme est condamné sans aucun espoir de changement",
            "Le destin n'a aucune importance dans la culture",
            'Seule la richesse matérielle change le destin',
          ],
          correctIndex: 0,
          explanation:
            "La philosophie malgache affirme que l'homme agit sur son Vintana avec sagesse, prière et rites réparateurs.",
        },
        {
          type: 'quiz',
          question:
            'Quel espace cardinal du Trano Gasy accueille les prières solennelles et les bénédictions des anciens ?',
          questionMg:
            'Inona ilay zoro masina indrindra ao an-trano gasy fanaovana ny tso-drano sy ny vavaka ?',
          choices: [
            'Le coin Nord-Est (Zoro Firarazana)',
            'Le seuil de la porte Sud',
            "L'arrière du foyer de cendre",
            'Le toit de paille extérieur',
          ],
          correctIndex: 0,
          explanation:
            "Le coin Nord-Est (Zoro Firarazana) est le sanctuaire domestique où s'invoquent la bénédiction de Dieu et la paix des ancêtres.",
        },
      ],
    },
    {
      slug: 'le-hasina-energie-sacree-et-force-vitale-universelle',
      title:
        'Le Hasina : force vitale sacrée, efficience spirituelle et dignité',
      titleMg: 'Ny Hasina : Hery Masina, Fahamasinana ary Aina Iombonana',
      summary:
        "Plongez dans le concept philosophique suprême du Hasina : l'énergie vitale qui sanctifie la nature, les aînés, la royauté et le Fihavanana.",
      summaryMg:
        "Diniho ny hevitra lehibe indrindra amin'ny fisainana malagasy : ny Hasina, ny fahamasinana ary ny fifanajana eo amin'ny fiaraha-monina.",
      type: 'TRADITION',
      orderIndex: 6,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au cœur le plus intime de la métaphysique malgache réside un concept universel : le **Hasina**. Le Hasina n'est pas une simple formule magique, mais une énergie vitale sacrée, une efficience immanente conférée par Zanahary et les ancêtres à tout ce qui participe de l'harmonie du monde. Les grands arbres de la forêt, la terre nourricière, les aînés bienveillants (*Raiamandreny*) et les souverains intègres possèdent du Hasina. Reconnaître et honorer cette force chez son semblable à travers le respect (*Haja*) et le don solennel (*Manome hasina*) est le fondement spirituel qui cimente le **Fihavanana**.",
          textMg:
            "Ao amin'ny fototry ny fisainana malagasy rehetra no misy ny foto-kevitra hoe **Hasina**. Ny Hasina dia hery masina avy amin'Andriamanitra sy ny Razana izay mamelona ny zavaboary, ny tany, ny raiamandreny ary ny mpitondra marina. Ny fanajana ny Hasina ananan'ny tsirairay amin'ny alalan'ny **Haja** sy ny **Fanomezana Hasina** no fototra iorenan'ny firaisankina sy ny **Fihavanana** marina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'HASINA',
          phonetic: 'ha-si-na',
          frenchEquivalent:
            'Le mot Hasina a donné le verbe « Manamasina » (sanctifier, bénir, consacrer avec dignité).',
          sampleWordMg: 'Hasina',
          sampleTranslationFr:
            'Énergie sacrée / Force vitale spirituelle / Sainteté',
        },
        {
          type: 'concept',
          termMg: 'Hasina',
          phonetic: 'ha-si-na',
          meaningFr:
            "L'énergie sacrée universelle, vertu spirituelle et force vitale",
          explanation:
            "Fluide sacré qui donne à une plante médicinale son pouvoir de guérir, à la parole de l'aîné son autorité morale et à la rizière sa fertilité.",
        },
        {
          type: 'concept',
          termMg: 'Manome hasina',
          phonetic: 'ma-nou-me ha-si-na',
          meaningFr:
            "« Donner du Hasina » / Honorer la dignité sacrée d'autrui",
          explanation:
            "Geste éthique et rituel par lequel on reconnaît la grandeur morale d'une personne ou d'une institution en lui offrant respect et présent symbolique.",
        },
        {
          type: 'concept',
          termMg: 'Fahamasinana',
          phonetic: 'fa-ha-ma-si-na-na',
          meaningFr:
            'La sainteté, la pureté sacrée et la souveraineté spirituelle',
          explanation:
            "État d'élévation morale et spirituelle préservé par le respect scrupuleux des lois de justice et des interdits sacrés (*Fady*).",
        },
        {
          type: 'concept',
          termMg: 'Tsimatahotra (Vola fotsy)',
          phonetic: 'tsi-ma-ta-hou-tsa (vou-la fou-tsi)',
          meaningFr:
            "La pièce d'argent pur non tronquée offerte en hommage au souverain",
          explanation:
            'Symbole métallique de pureté absolue remis traditionnellement par les sujets au roi pour sceller leur fidélité et honorer son Hasina.',
        },
        {
          type: 'example',
          textMg:
            'Ny fanajana ny raiamandreny sy ny tany dia fanomezana hasina ny aina nomen-Janahary.',
          textFr:
            "Respecter les aînés et honorer la terre nourricière constitue un hommage rendu à l'énergie sacrée (hasina) offerte par le Créateur.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Si un chef ou un roi devenait cruel, tyrannique ou injuste envers son peuple, la philosophie traditionnelle malgache considérait qu'il avait perdu son Hasina (*Afaka hasina*). Dès lors, le peuple reprenait sa liberté et n'était plus tenu à l'obéissance, car nul ne peut gouverner sans la vertu morale et sacrée du Hasina.",
          textMg:
            "Raha mivadika ho mpanao jadona na tsy mandala ny rariny ny mpitondra na mpanjaka, ny fahendrena malagasy dia manambara fa « latsaka ny hasiny » na « afaka hasina » izy. Tsy voatery mankato azy intsony ny vahoaka amin'izay fotoana izay, satria ny rariny sy ny hitsiny ihany no fototry ny hasina.",
        },
        // ─── 5 Micro-Quiz de validation ───
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Hasina » dans la vision métaphysique traditionnelle malgache ?",
          questionMg:
            "Inona marina moa ny atao hoe « Hasina » eo amin'ny fisainana sy kolontsaina malagasy ?",
          choices: [
            "L'énergie vitale sacrée, la vertu spirituelle et l'efficience conférées par Zanahary et les ancêtres",
            'Une simple pièce de monnaie moderne pour acheter des vivres',
            'Une punition corporelle infligée aux prisonniers',
            "Un contrat commercial d'importation de marchandises",
          ],
          correctIndex: 0,
          explanation:
            'Le Hasina est la force sacrée immanente qui donne vie, dignité, puissance morale et fertilité au monde malgache.',
        },
        {
          type: 'quiz',
          question:
            "Que signifie moralement l'expression coutumière respectueuse « Manome hasina » ?",
          questionMg:
            "Inona no hevitra ara-panahy sy ara-pitondran-tena fonosin'ny hoe « Manome hasina » ?",
          choices: [
            "Reconnaître et honorer avec vénération la dignité et la valeur sacrée d'une personne ou d'une autorité",
            "Prêter de l'argent avec un taux d'intérêt élevé",
            "Obliger quelqu'un à se taire en public",
            'Se vanter de ses propres mérites personnels',
          ],
          correctIndex: 0,
          explanation:
            "« Manome hasina » est l'acte noble de reconnaître la sainteté et la valeur inestimable de l'autre dans le respect mutuel.",
        },
        {
          type: 'quiz',
          question:
            "Quel objet traditionnel pur servait d'offrande de Hasina aux rois et grands dignitaires ?",
          questionMg:
            'Inona ilay fitaovana madio nentim-paharazana natolotra ho mariky ny fanomezana Hasina ?',
          choices: [
            "Une pièce d'argent pur non coupée (Tsimatahotra / Vola fotsy)",
            'Un morceau de fer rouillé',
            'Une pierre ordinaire ramassée au sol',
            'Une poignée de sel de cuisine',
          ],
          correctIndex: 0,
          explanation:
            "La pièce d'argent pur non coupée (Tsimatahotra) incarnait l'hommage limpide et inaltérable rendu au souverain.",
        },
        {
          type: 'quiz',
          question:
            "Que se passait-il traditionnellement lorsqu'un souverain devenait injuste et tyrannique ?",
          questionMg:
            'Inona no mitranga araka ny finoana nentin-drazana raha lasa masiaka sy tsy marina ny mpitondra ?',
          choices: [
            'Il perdait son Hasina (Afaka hasina) et perdait ainsi toute légitimité spirituelle à commander',
            'Son pouvoir augmentait pour toujours',
            'Le peuple était obligé de le vénérer davantage',
            'Tous les arbres de la région mouraient sur le champ',
          ],
          correctIndex: 0,
          explanation:
            'La tyrannie brise le pacte sacré : sans justice (*Rariny sy Hitsiny*), le souverain est déchu de son Hasina.',
        },
        {
          type: 'quiz',
          question:
            'Quel lien vital unit le respect du Hasina et la valeur suprême du Fihavanana ?',
          questionMg:
            "Inona no fifamatorana lalina misy eo amin'ny fanajana ny Hasina sy ny Fihavanana ?",
          choices: [
            'Honorer le Hasina de chacun fonde le respect mutuel (Haja) qui rend le Fihavanana vivant et indestructible',
            "Ils sont en conflit permanent et s'opposent l'un à l'autre",
            'Le Hasina ne concerne que les rois et le Fihavanana que les enfants',
            "Il n'existe aucun rapport entre les deux concepts",
          ],
          correctIndex: 0,
          explanation:
            "Le Fihavanana est la manifestation fraternelle du Hasina : respecter l'énergie sacrée d'autrui scelle la paix sociale.",
        },
      ],
    },
    // ─── LEÇON 7 : LE TROMBA & LA COMMUNION TRANSCENDANTE ───
    {
      slug: 'le-tromba-et-la-possession-rituelle',
      title:
        'Le Tromba : médiumnité sacrée et dialogue avec les esprits royaux',
      titleMg: 'Ny Tromba : fifandraisana masina amin’ny fanahin’ireo Mpanjaka',
      summary:
        'Comprenez la transe rituelle du Tromba dans la spiritualité côtière : la descente des esprits royaux pour guider la communauté et guérir les maux.',
      summaryMg:
        "Fantaro ny fombafomba amin'ny Tromba : fidinan'ny fanahin'ny Mpanjaka hanoro hevitra sy hanasitrana ny vahoaka.",
      type: 'TRADITION',
      orderIndex: 7,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans les sociétés côtières malgaches (notamment Sakalava, Tsimihety et Antakarana), le Tromba est une pratique spirituelle majeure de médiumnité sacrée. Lors de cérémonies solennelles au son de l'accordéon et des battements de mains rythmés, l'esprit d'un roi ou d'une reine défunte prend possession d'un médium choisi (Saha). Le souverain s'exprime alors avec l'autorité d'antan pour trancher les litiges, prescrire des remèdes et bénir les vivants.",
          textMg:
            "Amin'ny foko maro amorontsiraka, ny Tromba dia fomba masina fidinan'ny fanahin'ireo Mpanjaka nanjaka fahiny amin'ny alalan'ny olona voafidy (Saha). Mitondra teny fananarana, fanasitranana ary tso-drano ho an'ny fiarahamonina ny fanahy tonga.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TROM / BA',
          phonetic: 'troum-ba',
          frenchEquivalent:
            "Le mot « Tromba » se prononce avec un 'R' roulé sonore et un 'O' fermé.",
          sampleWordMg: 'Saha',
          sampleTranslationFr: 'Le médium récepteur de l’esprit royal',
        },
        {
          type: 'concept',
          termMg: 'Tromba sy Fanahy Masina',
          phonetic: 'troum-ba si fa-na-hi ma-si-na',
          meaningFr: 'La manifestation des esprits ancestraux royaux',
          explanation:
            "L'esprit royal ne vient pas pour hanter mais pour veiller sur le bien-être de ses descendants et maintenir l'ordre moral et coutumier de la région.",
        },
        {
          type: 'concept',
          termMg: 'Sobahy sy Lamba mena',
          phonetic: 'sou-ba-hi si lam-ba me-na',
          meaningFr: 'Costume d’apparat et étoffe rouge du souverain réincarné',
          explanation:
            'Dès que la possession a lieu, les assistants revêtent le médium du costume traditionnel du monarque défunt (sobahy, chapeau, canne royale) selon son époque historique.',
        },
        {
          type: 'concept',
          termMg: 'Fanasitranana sy Fampihavanana',
          phonetic: 'fa-na-si-tra-na-na si fam-pi-ha-va-na-na',
          meaningFr: 'Guérison holistique et réconciliation communautaire',
          explanation:
            'Le Tromba est consulté comme un tribunal bienveillant et un dispensaire traditionnel où les conflits de famille et les maladies inexplicables trouvent résolution.',
        },
        {
          type: 'example',
          textMg:
            "Ny Tromba dia fanehoana fa ny fifamatorana eo amin'ny velona sy ny razana dia tsy tapaka na oviana na oviana eo amin'ny fiainana malagasy.",
          textFr:
            'Le Tromba démontre que le cordon ombilical entre les vivants et les ancêtres ne se rompt jamais dans la conception malgache du monde.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Chaque esprit royal du Tromba parle le dialecte ancien de son époque et respecte les goûts de son vivant (tabac à priser, boissons spécifiques). Les historiens et linguistes étudient le Tromba comme une archive orale vivante de la langue malgache d'il y a trois siècles.",
          textMg:
            "Mitentina amin'ny fiteny tranainy nisy tamin'ny androny ny fanahin'ny Mpanjaka tonga amin'ny Tromba, ka lasa tahirin-tsoratra velona mampita ny tantara marina.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quel est le rôle spirituel et social principal de la cérémonie du Tromba à Madagascar ?',
          questionMg:
            'Inona ny anjara toeran’ny Tromba eo amin’ny fiarahamonina sy ny fomba nentin-drazana ?',
          choices: [
            'Permettre aux esprits des rois défunts de conseiller, guérir et bénir la communauté vivante',
            'Effrayer les enfants du village',
            'Organiser une vente aux enchères de bétail',
            'Apprendre des langues étrangères modernes',
          ],
          correctIndex: 0,
          explanation:
            "Le Tromba est une communion où les anciens rois guident leurs descendants avec sagesse, prodiguent des soins et rétablissent l'harmonie morale.",
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on la personne choisie pour servir d’intermédiaire récepteur à l’esprit royal ?',
          questionMg:
            'Ahoana no iantsoana ilay olona ipetrahan’ny fanahin’ny Mpanjaka amin’ny Tromba ?',
          choices: [
            'Le Saha (ou médium traditionnel)',
            'Le Mpikabary',
            'Le Dokotera',
            'Le Mpiandry omby',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Saha' est la personne consacrée qui prête son corps et sa voix à l'esprit royal le temps de la cérémonie rituelle.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les linguistes considèrent-ils les séances de Tromba comme des archives vivantes ?',
          questionMg:
            'Nahoana no heverin’ny mpikaroka ho tahiry velona amin’ny teny malagasy ny Tromba ?',
          choices: [
            'Parce que le médium en transe emploie un vocabulaire royal ancien et des dialectes d’il y a plusieurs siècles',
            'Parce qu’on y lit des journaux récents',
            'Parce qu’on y écrit sur des ordinateurs',
            'Parce que les esprits parlent latin',
          ],
          correctIndex: 0,
          explanation:
            "L'esprit s'exprime dans la langue vernaculaire précise de son règne (XVIIIe ou XIXe siècle), préservant des tournures grammaticales disparues ailleurs.",
        },
        {
          type: 'quiz',
          question:
            'Dans quelles grandes régions de Madagascar le culte du Tromba est-il le plus vivace et honoré ?',
          questionMg:
            'Faritra aiza eto Madagasikara no tena ahitana sy anajana fatratra ny Tromba ?',
          choices: [
            'Sur les côtes Ouest et Nord (Sakalava, Antakarana, Tsimihety)',
            'Exclusivement dans le désert du Sud',
            'Uniquement dans les îles lointaines',
            'Dans les bureaux administratifs de la capitale',
          ],
          correctIndex: 0,
          explanation:
            'Le Tromba est profondément enraciné dans les provinces côtières occidentales et septentrionales de la Grande Île.',
        },
        {
          type: 'quiz',
          question:
            'Comment les assistants reconnaissent-ils l’identité de l’esprit qui vient de se manifester ?',
          questionMg:
            'Ahoana no hahafantarana ilay Mpanjaka tonga ao amin’ny fivoriana ?',
          choices: [
            'Par son nom royal prononcé, sa démarche, ses interdits (fady) et ses demandes vestimentaires spécifiques',
            'En regardant sa carte d’identité',
            'Par un tirage au sort',
            'En lui demandant son mot de passe',
          ],
          correctIndex: 0,
          explanation:
            "Chaque monarque possède un protocole strict : ses chants d'appel favoris, ses couleurs d'étoffes, sa façon de marcher et ses fady rigoureux.",
        },
      ],
    },
    // ─── LEÇON 8 : LE FADY : ÉTHIQUE & ÉCOLOGIE ANCESTRALE ───
    {
      slug: 'le-fady-ethique-et-ecologie-ancestrale',
      title:
        'Le Fady : éthique sacrée, protection de la vie et écologie ancestrale',
      titleMg:
        'Ny Fady : fitsipika masina, fiarovana ny aina ary tontolo iainana',
      summary:
        "Dépassez la vision superficielle du tabou : comprenez le Fady comme un code d'honneur civique et un système écologique préservant la nature malgache.",
      summaryMg:
        "Halalino ny dikan'ny Fady : fitsipi-pitondran-tena mampirindra ny fiarahamonina sy miaro ny biby sy ny ala sarobidy.",
      type: 'TRADITION',
      orderIndex: 8,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Trop souvent traduit hâtivement par 'interdit' ou 'tabou', le Fady est en réalité le socle éthique et environnemental de Madagascar. Bien avant l'invention des parcs nationaux modernes, les anciens ont institué des Fady pour sanctuariser les forêts d'altitude (Ala Masina), protéger les sources d'eau potable et interdire la chasse des lémuriens sacrés comme l'Indri (Babakoto). Respecter le Fady, c'est préserver l'équilibre invisible entre l'homme et son écosystème.",
          textMg:
            "Tsy fady manakantsakana fotsiny ny Fady malagasy, fa fahendrena miaro ny tontolo iainana sy ny firindran'ny fiarahamonina. Nisy fady tsy mahazo mandoto loharano, tsy mahazo mikapa ala masina, ary tsy mahazo mamono ny Babakoto satria heverina ho havana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FA / DY',
          phonetic: 'fa-di',
          frenchEquivalent:
            "Le mot « Fady » se prononce avec un 'D' ferme et un 'Y' doux équivalent à 'I'.",
          sampleWordMg: 'Masina',
          sampleTranslationFr: 'Sacré / Intouchable / Porteur d’énergie vitale',
        },
        {
          type: 'concept',
          termMg: 'Ala Masina sy Fady mikapa hazo',
          phonetic: 'a-la ma-si-na si fa-di mi-ka-pa ha-zou',
          meaningFr:
            'La forêt sacrée et la sanctuarisation écologique par le fady',
          explanation:
            "Forêts primaires entourant les sépultures royales et les bassins versants : y couper du bois ou y allumer du feu était puni d'exclusion sociale par le Dina.",
        },
        {
          type: 'concept',
          termMg: 'Fady mamono Babakoto (Indri indri)',
          phonetic: 'fa-di ma-mou-nou ba-ba-kou-tou',
          meaningFr:
            'L’interdiction sacrée de tuer ou chasser le grand lémurien Indri',
          explanation:
            "Selon la légende, le Babakoto est le frère originel de l'homme ayant choisi la canopée : le chasser est considéré comme un crime fratricide apportant malédiction.",
        },
        {
          type: 'concept',
          termMg: 'Fady loharano sy fahadiovana',
          phonetic: 'fa-di lou-ha-ra-nou si fa-ha-di-ou-va-na',
          meaningFr: 'La protection hygiénique et sacrée des sources d’eau',
          explanation:
            'Interdiction formelle de laver du linge souillé ou de déposer des ordures près des sources alimentant les villages en eau de boisson.',
        },
        {
          type: 'example',
          textMg:
            'Ny fady nentin-drazana no nampaharitra ny zava-boahary teto Madagasikara nandritra ny taonjato maro : fanajana ny tany sy ny aina.',
          textFr:
            'Les interdits ancestraux ont préservé la biodiversité unique de Madagascar durant des siècles : une leçon vivante de respect de la terre et de la vie.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Les biologistes modernes reconnaissent que les plus belles parcelles de forêts primaires préservées à Madagascar coïncident exactement avec les zones autrefois protégées par des Fady coutumiers institués par les ancêtres.',
          textMg:
            "Ireo faritra ala mbola tsara indrindra eto Madagasikara ankehitriny dia ireo toerana nisy fady nentin-drazana niarovan'ny Ntaolo azy.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la fonction écologique essentielle du concept de « Fady » dans la tradition malgache ?',
          questionMg:
            'Inona ny soa lehibe nentin’ny Fady teo amin’ny fiarovana ny tontolo iainana malagasy ?',
          choices: [
            'Protéger durablement les forêts primaires, les sources d’eau et les espèces animales menacées',
            'Empêcher les gens d’aller à l’école',
            'Interdire toute forme de commerce',
            'Rendre la vie quotidienne triste et difficile',
          ],
          correctIndex: 0,
          explanation:
            'Le Fady agissait comme une charte écologique ancestrale protégeant la biodiversité et les ressources vitales bien avant les lois écologiques modernes.',
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le lémurien « Babakoto » (Indri indri) fait-il l’objet d’un fady absolu de chasse ?',
          questionMg:
            'Nahoana no fady vonoina na hazaina ny lémurien « Babakoto » ?',
          choices: [
            'Car une légende sacrée le considère comme le frère aîné de l’homme dans la forêt',
            'Parce que sa viande est trop dure',
            'Parce qu’il vole dans le ciel',
            'Parce qu’il vit sous l’eau',
          ],
          correctIndex: 0,
          explanation:
            "« Babakoto » signifie le 'père de Koto' : la mythologie enseigne une parenté directe entre l'humain et ce lémurien majestueux.",
        },
        {
          type: 'quiz',
          question:
            'Que désignent les « Ala Masina » sanctuarisées par les anciens à Madagascar ?',
          questionMg:
            'Inona no hevitry ny hoe « Ala Masina » tany amin’ny Ntaolo ?',
          choices: [
            'Des forêts sacrées protégées où toute coupe de bois et tout feu sont rigoureusement prohibés',
            'Des champs de maïs artificiels',
            'Des jardins de fleurs en ville',
            'Des forêts réservées à la vente de charbon',
          ],
          correctIndex: 0,
          explanation:
            'Les Ala Masina étaient des sanctuaires forestiers inviolables protégeant les sources, les tombeaux et la faune sylvestre.',
        },
        {
          type: 'quiz',
          question:
            'Quel geste traditionnel doit-on accomplir si l’on a enfreint involontairement un fady ?',
          questionMg: 'Inona no fomba atao raha sendra nandika fady tsy nahy ?',
          choices: [
            'Le rituel de purification de l’Ala-fady pour réparer la faute et apaiser le blâme',
            'Payer une amende à la banque centrale',
            'Partir en voyage à l’étranger immédiatement',
            'Changer de prénom à la mairie',
          ],
          correctIndex: 0,
          explanation:
            "L'« Ala-fady » est la cérémonie de rédemption et de purification menée avec les anciens pour lever la souillure morale et restaurer l'harmonie.",
        },
        {
          type: 'quiz',
          question:
            'Comment les anciens protégeaient-ils les sources d’eau potable des villages ?',
          questionMg:
            'Ahoana no niarovan’ny Ntaolo ny loharano fisotro madio tamin’ny fady ?',
          choices: [
            'En déclarant fady tout dépôt d’ordures et tout lavage de linges souillés à proximité de la source',
            'En mettant des cadenas en métal sur l’eau',
            'En faisant bouillir toute la rivière',
            'En vidant la source chaque semaine',
          ],
          correctIndex: 0,
          explanation:
            "Les règles d'hygiène étaient sacralisées par le fady pour garantir une eau pure à toute la communauté villageoise.",
        },
      ],
    },
    // ─── LEÇON 9 : LA NOTION DE L'AINA : LE SOUFFLE VITAL ───
    {
      slug: 'la-notion-de-l-aina-souffle-vital',
      title:
        'La notion de l’Aina : souffle sacré, respect de la vie et dignité humaine',
      titleMg: 'Ny Hasin’ny Aina : fofonaina masina sy fanajana ny maha-olona',
      summary:
        "Explorez le concept philosophique de l'Aina : pourquoi la vie est considérée comme un bien inaliénable et sacré reliant l'univers à chaque être.",
      summaryMg:
        "Diniho ny hevitra lalina fonosin'ny Aina : fanomezana masina tsy azo amidy vola mampitovy lanja ny olombelona rehetra.",
      type: 'CULTURE',
      orderIndex: 9,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Au sommet de la philosophie malgache trône le concept de l'Aina (la vie, le souffle vital). Pour les anciens, l'Aina n'appartient pas à l'homme : c'est une étincelle sacrée confiée temporairement par le Créateur (Andriananahary). C'est pourquoi un proverbe solennel affirme : « Ny aina tsy mba hanin-kotrana ka hoe lany androany dia vidina rahampitso » (La vie n'est pas un légume du marché qu'on rachète le lendemain). Respecter l'Aina, c'est fonder toute la morale du Fihavanana.",
          textMg:
            "Ny Aina no harena lehibe indrindra amin'ny fahendrena malagasy. Tsy fananan'ny olombelona manokana ny aina fa fanomezana avy amin'Andriamanitra Andriananahary. 'Ny aina tsy mba hanin-kotrana' ka tokony hajaina sy tandremana lalandava.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'AI / NA',
          phonetic: 'ai-na',
          frenchEquivalent:
            "Le mot « Aina » s'articule comme 'Aille-na' : souffle clair, doux et porteur d'énergie.",
          sampleWordMg: 'Velona',
          sampleTranslationFr: 'Vivant / Prospère / Rayonnant d’énergie vitale',
        },
        {
          type: 'concept',
          termMg: 'Ny aina tsy mba hanin-kotrana',
          phonetic: 'ni ai-na tsi mba ha-nin-kou-tra-na',
          meaningFr:
            'La vie n’est pas un légume qu’on rachète au marché le lendemain',
          explanation:
            "Proverbe fondamental rappelant l'unicité et le caractère irremplaçable de toute vie humaine : nul ne peut réparer la mort par de l'argent.",
        },
        {
          type: 'concept',
          termMg: 'Mamelon-kavana',
          phonetic: 'ma-me-loun-ka-va-na',
          meaningFr:
            'Nourrir et préserver la vie de ses proches et de son prochain',
          explanation:
            "Vertu suprême de solidarité : soutenir activement ceux qui faiblissent pour que leur souffle vital (aina) ne s'éteigne pas.",
        },
        {
          type: 'concept',
          termMg: 'Fofonaina avy amin’ny Nahary',
          phonetic: 'fou-fou-nai-na a-vi a-min-ni na-ha-ri',
          meaningFr: 'Le souffle d’existence accordé par le Créateur souverain',
          explanation:
            'Principe cosmologique : tous les êtres vivants partagent le même souffle universel, ce qui exige respect et compassion envers la Création.',
        },
        {
          type: 'example',
          textMg:
            "Ny fihavanana marina dia miorina amin'ny fanajana ny ain'ny hafa : rehefa voaaro ny aina vao afaka manorina fandrosoana.",
          textFr:
            "Le véritable Fihavanana est fondé sur le respect absolu de la vie d'autrui : c'est en protégeant l'Aina que l'on bâtit une communauté prospère.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans les salutations traditionnelles malgaches, lorsqu'on demande des nouvelles d'un nouveau-né ou d'un malade, la première question posée est : « Misy aina tsara ve ? » (Y a-t-il un souffle vital vigoureux ?), témoignant de la primauté de l'énergie vitale sur tout bien matériel.",
          textMg:
            "Rehefa mamangy marary na zazakely ny Ntaolo dia manontany voalohany hoe : 'Tonga soa ve ny aina ?', satria ny aina no ambony indrindra amin'ny zavatra rehetra.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Que signifie le proverbe malgache universel « Ny aina tsy mba hanin-kotrana » ?',
          questionMg:
            'Inona no hevitry ny ohabolana hoe « Ny aina tsy mba hanin-kotrana » ?',
          choices: [
            'La vie est unique, sacrée et irremplaçable, elle ne s’achète pas avec de l’argent',
            'La nourriture du marché est trop chère',
            'Il faut manger des légumes tous les matins',
            'La vie dure éternellement sans effort',
          ],
          correctIndex: 0,
          explanation:
            'Ce proverbe proclame la dignité inaliénable de la vie humaine : rien sur terre ne peut remplacer une vie perdue.',
        },
        {
          type: 'quiz',
          question:
            'Selon la cosmogonie malgache, à qui appartient originellement le souffle de vie (Aina) ?',
          questionMg:
            'Araka ny fahendrena malagasy, avy amin’iza ny fofonaina iainantsika ?',
          choices: [
            'Du Créateur souverain (Zanahary / Andriananahary) qui l’a confié à l’homme',
            'Du roi de la région uniquement',
            'Des marchands de la ville',
            'De la poussière du chemin',
          ],
          correctIndex: 0,
          explanation:
            "L'Aina est le don céleste primordial accordé par Zanahary, liant l'homme à la transcendance.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne l’expression bienveillante « Mamelon-kavana » dans l’éthique de tous les jours ?',
          questionMg:
            'Inona ny atao hoe « Mamelon-kavana » eo amin’ny fiainana andavanandro ?',
          choices: [
            'Nourrir, secourir et soutenir solidairement ses proches dans le besoin pour protéger leur vie',
            'Acheter des terres pour soi seul',
            'Voyager sans prévenir sa famille',
            'Écrire des lettres sans réponse',
          ],
          correctIndex: 0,
          explanation:
            "Mamelon-kavana incarne la charité active : faire vivre ses proches pour faire triompher l'Aina sur la détresse.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi le respect de l’Aina est-il considéré comme le fondement direct du Fihavanana ?',
          questionMg: 'Nahoana no fototry ny Fihavanana ny fanajana ny Aina ?',
          choices: [
            'Parce que sans respect mutuel de la vie et de la dignité d’autrui, aucune fraternité ne peut exister',
            'Parce que le mot Aina rime avec Fihavanana',
            'Parce que les lois politiques l’exigent',
            'Uniquement pour éviter les querelles de voisinage',
          ],
          correctIndex: 0,
          explanation:
            'Le Fihavanana repose sur la reconnaissance que chaque être humain partage le même souffle vital précieux que soi-même.',
        },
        {
          type: 'quiz',
          question:
            'Que répond-on traditionnellement à quelqu’un qui s’inquiète de la santé d’un proche malade en disant « Velona soa aman-tsara » ?',
          questionMg: 'Inona no hevitry ny hoe « Velona soa aman-tsara » ?',
          choices: [
            'Il est bien vivant, en sécurité et son énergie vitale s’est rétablie avec succès',
            'Il est parti très loin sans donner de nouvelles',
            'Il a perdu tous ses biens matériels',
            'Il dort sans vouloir manger',
          ],
          correctIndex: 0,
          explanation:
            '« Velona soa aman-tsara » célèbre le triomphe de la vie et le soulagement apporté à toute la famille.',
        },
      ],
    },
    // ─── LEÇON 10 : LE TANGENA & L'ORDALIE HISTORIQUE ───
    {
      slug: 'le-tangena-et-l-ordalie-sacree',
      title:
        'Le Tangena et l’ordalie sacrée : justice divine et vérité dans l’histoire',
      titleMg: 'Ny Tangena sy ny Fitsaran’Andriamanitra tamin’ny Tantara',
      summary:
        "Analysez l'histoire et la métaphysique du Tangena : l'épreuve par le poison comme croyance en l'infaillibilité de la justice divine face au crime.",
      summaryMg:
        "Diniho ny tantara sy ny hevitra tamin'ny fitsarana tamin'ny Tangena : finoana ny fitsaran'Andriamanitra manadio ny marina.",
      type: 'CULTURE',
      orderIndex: 10,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans le système judiciaire traditionnel malgache jusqu'au milieu du XIXe siècle, le Tangena (arbuste Cerbera venenifera produisant une graine toxique) occupait une place redoutable. Utilisé comme épreuve d'ordalie (jugement de Dieu), le breuvage de Tangena était administré à l'accusé de crime grave ou de sorcellerie malfaisante (mpamosavy). La croyance populaire postulait que la vérité divine était souveraine : l'innocent vomirait le poison et survivrait, tandis que le coupable périrait.",
          textMg:
            "Fahiny, nampiasaina tamin'ny fitsarana teto Madagasikara ny voan-kazo Tangena. Rehefa nisy heloka lehibe na fiahiahiana fanaovana ody ratsy, dia nisotro Tangena ilay voampanga : ninoana fa ny marina dia mandoa ilay poizina ka velona, fa ny meloka kosa maty.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TAN / GE / NA',
          phonetic: 'tan-ge-na',
          frenchEquivalent:
            "Le 'G' de « Tangena » est occlusif dur comme dans 'gâteau' (tan-gué-na).",
          sampleWordMg: 'Fitsaran-dratsy',
          sampleTranslationFr: 'Le jugement solennel de la vérité',
        },
        {
          type: 'concept',
          termMg: 'Tangena (Cerbera venenifera)',
          phonetic: 'tan-ge-na',
          meaningFr: 'Arbuste côtier toxique utilisé pour l’ordalie royale',
          explanation:
            'Plante vénéneuse dont la graine râpée dans du jus de banane ou de riz servait de test biologique de culpabilité mystique.',
        },
        {
          type: 'concept',
          termMg: 'Mpandona sy Hoditr’akoholahy',
          phonetic: 'mpan-dou-na si hou-di-tra-kou-hou-la-hi',
          meaningFr: 'Le rituel des trois morceaux de peau de poulet avalés',
          explanation:
            "L'accusé avalait trois morceaux de peau de coq avant de boire le breuvage : son innocence était proclamée s'il régurgitait intacts les trois morceaux.",
        },
        {
          type: 'concept',
          termMg: 'Fanafoanana ny Tangena (Radama II tamin’ny 1861)',
          phonetic: 'fa-na-fou-a-na-na ni tan-ge-na',
          meaningFr: 'L’abolition définitive de l’ordalie par le roi Radama II',
          explanation:
            "Tournant humaniste de l'histoire malgache : dès son accession au trône en 1861, Radama II abolit définitivement le poison du Tangena, instaurant la justice par les tribunaux civils.",
        },
        {
          type: 'example',
          textMg:
            "Ny tantaran'ny Tangena dia maneho ny fitadiavana fatratra ny marina sy ny fahatahorana an'Andriamanitra, na dia fomba mahery vaika aza no nampiasaina.",
          textFr:
            "L'histoire du Tangena témoigne de la quête ardente de vérité et de justice divine dans la pensée malgache, bien que ce fût une méthode implacable abolie au XIXe siècle.",
        },
        {
          type: 'didYouKnow',
          textFr:
            'Sous le règne de Ranavalona Ire, le Tangena fut abondamment utilisé pour démasquer les conspirateurs et traîtres au royaume, avant que Radama II ne proclame son interdiction totale au nom de la modernité et du respect de la vie.',
          textMg:
            "Tamin'ny andron'ny Mpanjakavavy Ranavalona I no nampiasaina be ny Tangena, ary Radama II no nandrava azy tanteraka tamin'ny taona 1861 mba hanajana ny aina.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Qu’était le « Tangena » dans le système juridique traditionnel de Madagascar ?',
          questionMg:
            'Inona ny Tangena teo amin’ny fitsarana teto Madagasikara fahiny ?',
          choices: [
            'Une ordalie (jugement de Dieu par le poison) pour déterminer la culpabilité ou l’innocence d’un accusé',
            'Un impôt sur le bétail',
            'Un traité commercial avec l’étranger',
            'Un chant de louange à la reine',
          ],
          correctIndex: 0,
          explanation:
            "Le Tangena était l'épreuve ordalique suprême où l'on croyait que les puissances divines feraient vomir l'innocent et puniraient le coupable.",
        },
        {
          type: 'quiz',
          question:
            'Quel test rituel précis accompagnait l’administration du breuvage de Tangena ?',
          questionMg:
            'Inona ilay fomba niaraka tamin’ny fisotroana Tangena hanaporofoana ny fahamarinana ?',
          choices: [
            'L’accusé devait avaler puis régurgiter intacts trois morceaux de peau de coq',
            'Il devait courir 10 kilomètres sans s’arrêter',
            'Il devait nager au milieu des crocodiles',
            'Il devait réciter un livre par cœur',
          ],
          correctIndex: 0,
          explanation:
            "Vomir les trois morceaux de peau de poulet intacts constituait la preuve physique et irréfutable de l'innocence aux yeux des juges.",
        },
        {
          type: 'quiz',
          question:
            'Quel roi réformateur a aboli définitivement le poison du Tangena dès son couronnement en 1861 ?',
          questionMg:
            'Iza ilay Mpanjaka nandrava tanteraka ny fitsarana tamin’ny Tangena tamin’ny taona 1861 ?',
          choices: [
            'Radama II',
            'Andrianampoinimerina',
            'Radama Ier',
            'Andrianjaka',
          ],
          correctIndex: 0,
          explanation:
            "Radama II abolit immédiatement le Tangena à la mort de Ranavalona Ire, marquant l'entrée de la justice malgache dans l'ère moderne sans ordalie corporelle.",
        },
        {
          type: 'quiz',
          question:
            'De quelle partie de la plante provenait le principe actif toxique du Tangena ?',
          questionMg:
            'Avy amin’inona amin’ilay hazo Tangena no hakana ilay poizina ?',
          choices: [
            'De la graine râpée du fruit toxique',
            'Des fleurs parfumées',
            'De la racine sèche',
            'De la résine du tronc',
          ],
          correctIndex: 0,
          explanation:
            "C'est la graine contenue dans le noyau du fruit du Cerbera venenifera qui contient les hétérosides cardiotoxiques puissants.",
        },
        {
          type: 'quiz',
          question:
            'Quelle croyance spirituelle sous-tendait le recours à cette justice ordalique ?',
          questionMg:
            'Inona ny finoana fototra nampiasana ny fitsarana tamin’ny Tangena ?',
          choices: [
            'La conviction absolue que le Créateur et les ancêtres ne permettraient jamais qu’un innocent périsse injustement',
            'Le plaisir de punir tout le monde',
            'Une invention venue des marchands arabes',
            'Une fête de réjouissance villageoise',
          ],
          correctIndex: 0,
          explanation:
            "La société croyait en la souveraineté omnisciente d'Andriamanitra et des ancêtres capables de discerner le fond des cœurs.",
        },
      ],
    },
    // ─── LEÇON 11 : ANDRIAMANITRA ANDRIANANAHARY : LA THÉOLOGIE ORIGINELLE ───
    {
      slug: 'andriamanitra-andriananahary-theologie-originelle',
      title:
        'Andriamanitra Andriananahary : la théologie monothéiste originelle malgache',
      titleMg: 'Andriamanitra Andriananahary : finoana tokana nentin-drazana',
      summary:
        "Découvrez la conception théologique ancestrale de Dieu chez les Malgaches : Zanahary le Créateur suprême, bien avant l'arrivée des religions étrangères.",
      summaryMg:
        "Diniho ny finoan'ny Ntaolo an'Andriamanitra Andriananahary Mpamorona ny lanitra sy ny tany talohan'ny fahatongavan'ny fivavahana hafa.",
      type: 'CULTURE',
      orderIndex: 11,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Contrairement à une idée reçue, la religion traditionnelle malgache n'était ni polythéiste ni idolâtre : elle professait une foi pure en un Dieu unique, souverain et transcendant, nommé 'Andriamanitra' (le Seigneur suave et parfumé) et 'Andriananahary' (le Seigneur Créateur de toute chose). Ce Dieu n'avait aucune représentation sculptée, ni idole, ni temple : on s'adressait à lui en levant les mains vers le ciel lors des prières solennelles (joro), en prenant à témoin la pureté de la création.",
          textMg:
            "Tsy fivavahana tamin'ny sampy ny fivavahan'ny Ntaolo fa finoana Andriamanitra Tokana Mpamorona : Andriananahary nanao ny lanitra sy ny tany. Tsy nisy sary sokitra na trano vato niankohofana fa nanandratra tanana teny an-kalamanjana rehefa nivavaka tamin'ny joro.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'AN / DRIAN / A / NA / HA / RY',
          phonetic: 'an-dri-a-na-na-ha-ri',
          frenchEquivalent:
            "Le nom « Andriananahary » dérive de 'Andriana' (noble souverain) et 'Nahary' (celui qui a conçu et créé).",
          sampleWordMg: 'Andriananahary',
          sampleTranslationFr: 'Le Seigneur Créateur céleste suprême',
        },
        {
          type: 'concept',
          termMg: 'Andriamanitra (Andriana manitra)',
          phonetic: 'an-dri-a-ma-ni-tra',
          meaningFr: 'Le Souverain céleste embaumé de parfum suave',
          explanation:
            'Nom le plus répandu de Dieu en malgache, évoquant la perfection morale, la douceur, la pureté et la majesté invisible.',
        },
        {
          type: 'concept',
          termMg: 'Zanahary (Nahary)',
          phonetic: 'za-na-ha-ri',
          meaningFr: 'Le Créateur primordial de l’Univers',
          explanation:
            "Attribut divin marquant l'acte créateur qui a façonné le ciel (lanitra), la terre (tany) et accordé le souffle de vie (aina) aux créatures.",
        },
        {
          type: 'concept',
          termMg: 'Ny Joro sy ny Fitsofan-drano',
          phonetic: 'ni dzu-rou si ni fi-tsou-fan-dra-nou',
          meaningFr:
            'La prière propitiatoire en plein air et la bénédiction divine',
          explanation:
            "Rituel où l'officiant se tourne vers l'Est (Atsinanana), tenant une corne de zébu avec de l'eau claire et des épis de riz pour implorer la grâce de Zanahary sur la lignée.",
        },
        {
          type: 'example',
          textMg:
            "Andriamanitra tsy andrin'ny sarotra, fa Izy no tompon'ny zavatra rehetra : manome tso-drano ho an'izay madio fo sy marina.",
          textFr:
            "Dieu n'attend pas les crises pour agir, Il est le maître absolu de toutes choses : Il bénit ceux qui gardent le cœur pur et la droiture morale.",
        },
        {
          type: 'didYouKnow',
          textFr:
            "Lorsque les missionnaires britanniques traduisirent la Bible en langue malgache en 1835, ils choisirent unanimement de conserver le nom ancestral 'Andriamanitra' pour désigner Dieu, reconnaissant la noblesse et l'exactitude de la théologie malgache originelle.",
          textMg:
            "Rehefa nandika ny Baiboly tamin'ny teny malagasy ireo misionera tamin'ny 1835, dia ny teny hoe 'Andriamanitra' nampiasain'ny Ntaolo ihany no nampiasainy satria efa nino Andriamanitra Tokana ny Malagasy.",
        },
        // ─── 5 Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle est la nature originelle de la foi religieuse des Ntaolo malgaches ?',
          questionMg:
            'Ahoana ny endrika marina nisy tamin’ny finoan’ny Ntaolo an’Andriamanitra ?',
          choices: [
            'Une foi monothéiste en un Créateur suprême unique (Andriananahary), sans statues ni idoles sculptées',
            'Le culte de dizaines de dieux rivaux',
            'Une absence totale de croyance spirituelle',
            'L’adoration du soleil uniquement',
          ],
          correctIndex: 0,
          explanation:
            'La théologie malgache primitive était un monothéisme pur : un Dieu souverain unique créateur du ciel et de la terre sans représentation matérielle.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie étymologiquement le terme malgache « Andriananahary » ?',
          questionMg:
            'Inona no hevitra marina fonosin’ny anarana hoe « Andriananahary » ?',
          choices: [
            'Le Seigneur Souverain qui a tout créé (« Andriana » + « Nahary »)',
            'Le roi de la montagne rouge',
            'Le maître de la mer',
            'Le guerrier victorieux',
          ],
          correctIndex: 0,
          explanation:
            "« Andriananahary » associe la royauté suprême (*Andriana*) à l'acte de création originelle de l'univers (*Nahary*).",
        },
        {
          type: 'quiz',
          question:
            'Comment les anciens s’adressaient-ils solennellement à Dieu lors des prières du Joro ?',
          questionMg:
            'Ahoana ny fomba fitodika amin’Andriamanitra rehefa manao Joro an-kalamanjana ?',
          choices: [
            'En levant les deux mains ouvertes vers le ciel en direction de l’Est (Atsinanana)',
            'En se cachant sous une couverture noire',
            'En se tournant vers l’Ouest dans le noir',
            'En tapant sur des casseroles',
          ],
          correctIndex: 0,
          explanation:
            "L'officiant levait les mains vers les cieux face au soleil levant (l'Est, source de vie et de lumière) pour invoquer le Créateur bienfaisant.",
        },
        {
          type: 'quiz',
          question:
            'Quel fait historique marquant atteste de la reconnaissance de ce monothéisme lors de la traduction de la Bible en 1835 ?',
          questionMg:
            'Inona no porofo ara-tantara tamin’ny 1835 nanaporofo fa efa nisy ny teny hoe Andriamanitra ?',
          choices: [
            'Les traducteurs ont adopté le terme ancestral « Andriamanitra » pour désigner Dieu dans la première Bible en malgache',
            'Ils ont inventé un mot anglais',
            'Ils ont interdit la langue malgache',
            'Ils ont refusé d’écrire le livre',
          ],
          correctIndex: 0,
          explanation:
            "La Bible malgache de 1835 a consacré le nom d'Andriamanitra, prouvant que la notion d'un Dieu suprême et bon était déjà ancrée dans la conscience populaire.",
        },
        {
          type: 'quiz',
          question:
            'Que dit le proverbe malgache sur la justice et la présence constante d’Andriamanitra ?',
          questionMg:
            'Inona no lazain’ny ohabolana momba ny fahitana ataon’Andriamanitra ny olona ?',
          choices: [
            '« Aza ny lohasaha mangina no jerena, fa Andriamanitra ao an-tampon’ny loha »',
            '« Izay kely tsy mba lehibe »',
            '« Ny omby maro tsy mifanary »',
            '« Ny vary masaka tsy manana elatra »',
          ],
          correctIndex: 0,
          explanation:
            '« Ne croyez pas être seuls dans la vallée déserte, car Dieu est au-dessus de vos têtes » : proverbe immortel rappelant que la conscience morale est sous le regard divin.',
        },
      ],
    },
  ],
};
