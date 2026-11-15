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
  estimatedMinutes: 50,
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
  ],
};
