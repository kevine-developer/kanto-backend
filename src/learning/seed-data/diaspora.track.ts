import { SeedTrack } from './seed.types.js';

export const diasporaTrack: SeedTrack = {
  slug: 'diaspora-et-racines-malgaches',
  title: 'Diaspora, Retrouvailles & Liens sacrés',
  titleMg: 'Fodiana an-Tanindrazana & Rohim-pihavanana',
  description:
    'Guide indispensable pour la diaspora et les familles : retour au pays, étiquette du Vodiondry, parenté élargie et reconnexion aux racines.',
  descriptionMg:
    'Torolalana ho an’ny am-pielezana sy ny fianakaviana rehetra : fiverenana an-tanindrazana, fomba amam-panao amin’ny vodiondry sy ny fifandraisana.',
  level: 'BEGINNER',
  icon: 'HeartHandshake',
  color: '#B93826',
  orderIndex: 8,
  estimatedMinutes: 45,
  lessons: [
    // ─── LEÇON 1 : RETOUR AU PAYS & VOYAGE ───
    {
      slug: 'retour-au-pays-et-voyage-fodiana',
      title:
        'Le retour au pays et le voyage à Madagascar (Ny Fodiana & ny Dia)',
      titleMg: 'Ny Fodiana an-Tanindrazana sy ny Dia eto Madagasikara',
      summary:
        'Vocabulaire essentiel du voyageur et de la diaspora : arrivées, transports en taxi-brousse et joie des retrouvailles familiales.',
      summaryMg:
        'Voambolana ilaina amin’ny dia, fiantsonana, taksiborosy ary ny hafaliana amin’ny fihaonana amin’ny havana.',
      type: 'VOCABULARY',
      orderIndex: 1,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Pour tout enfant de la diaspora, le retour à Madagascar (*Fodiana an-Tanindrazana*) est un pèlerinage du cœur. Poser le pied sur la terre rouge (*Tany mena*) réveille un lien indicible. Savoir se déplacer en taxi-brousse, saluer les villageois avec humilité et partager la joie des retrouvailles (*Fifaliana amin'ny fahitana havana*) permet de vivre une immersion authentique et respectueuse.",
          textMg:
            "Ho an'ny Malagasy am-pielezana na ny taranaka any ivelany, ny fiverenana an-tanindrazana dia fitsidihana masina mikasika ny fo. Ny fahatongavana eo amin'ny tany mena dia mampifoha ny rohim-pihavanana. Ny fahaizana miara-dia amin'ny taksiborosy, ny fiarahabana am-panajana eny an-dalana ary ny fifampizarana hafaliana no fototry ny dia mahomby.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'DIA',
          phonetic: 'di-a (voyelles liées)',
          frenchEquivalent:
            "Se prononce 'di-a' très lié. Signifie à la fois la marche, le pas et le grand voyage (ex: Manaova dia soa = Bon voyage / Bonne route).",
          sampleWordMg: 'Dia soa',
          sampleTranslationFr: 'Bon voyage / Paix sur votre route',
        },
        {
          type: 'concept',
          termMg: 'Fodiana an-Tanindrazana',
          phonetic: 'fou-di-a-na an-ta-nin-dra-za-na',
          meaningFr: 'Le retour à la terre des ancêtres',
          explanation:
            'Concept noble désignant le voyage de retour vers ses racines, que ce soit pour des vacances, une fête familiale ou pour se ressourcer.',
        },
        {
          type: 'concept',
          termMg: 'Taksiborosy',
          phonetic: 'tak-si-bou-rou-si',
          meaningFr: 'Le taxi-brousse (minibus interurbain)',
          explanation:
            "Le moyen de transport populaire par excellence qui relie les villes et villages de Madagascar. Lieu privilégié d'échanges, d'entraide et de convivialité.",
        },
        {
          type: 'concept',
          termMg: 'Mafon-tanana / Solombodim-bary',
          phonetic: 'ma-foun-ta-na-na',
          meaningFr: 'Le présent de retrouvailles / Geste du cœur',
          explanation:
            "Modeste cadeau en argent ou en nature apporté aux aînés et aux proches pour marquer la joie de se revoir et honorer le foyer d'accueil.",
        },
        {
          type: 'concept',
          termMg: 'Manaova dia soa / Tongava soa',
          phonetic: 'ma-now-va di-a sou / toun-ga-va sou',
          meaningFr: 'Bon voyage ! / Arrivez sains et saufs !',
          explanation:
            "Bénédictions réciproques prononcées au départ et à l'arrivée pour invoquer la protection divine et des ancêtres le long des routes.",
        },
        {
          type: 'example',
          textMg:
            'Faly be izahay mahita anao tompoko, tonga soa eto an-tanindrazana !',
          textFr:
            'Nous sommes tellement heureux de vous revoir, soyez le bienvenu sur la terre de nos ancêtres !',
        },
        {
          type: 'example',
          textMg:
            'Azafady tompoko, amin’ny firy no miainga ny taksiborosy mankany Antsirabe ?',
          textFr:
            'Excusez-moi s’il vous plaît, à quelle heure part le taxi-brousse pour Antsirabe ?',
        },
        {
          type: 'didYouKnow',
          textFr:
            'À Madagascar, lorsqu’un voyageur rentre chez lui après un long périple, on lui offre traditionnellement un verre d’eau fraîche (*Rano madio*) avant toute chose, pour apaiser la fatigue de la route (*Mamadika fofon’aina*) et purifier le souffle avant de converser.',
          textMg:
            "Rehefa avy lavitra ny mpivahiny, dia rano mangatsiaka no aroso azy voalohany mba hamadika fofon'aina sy hampitony ny havizanana alohan'ny hiresahana raharaha.",
        },
        {
          type: 'quiz',
          question:
            'Que souhaite-t-on chaleureusement à un voyageur qui prend la route à Madagascar ?',
          questionMg:
            'Inona no firariantsoa atolotra ny olona handeha hanao dia lavitra ?',
          choices: [
            'Manaova dia soa tompoko !',
            'Mandehana haingana loatra',
            'Aza miverina intsony',
            'Mijanòna eto',
          ],
          correctIndex: 0,
          explanation:
            '« Manaova dia soa ! » souhaite une route paisible, sûre et bénie sous la bienveillance des ancêtres.',
        },
        {
          type: 'quiz',
          question:
            'Que représente le concept de « Fodiana an-Tanindrazana » pour la diaspora ?',
          questionMg:
            "Inona no hevitra lehibe fonosin'ny hoe « Fodiana an-Tanindrazana » ?",
          choices: [
            'Le pèlerinage de retour vers la terre ancestrale et les racines familiales',
            'Un simple voyage d’affaires sans âme',
            'Une obligation administrative pénible',
            'Un départ définitif sans retour',
          ],
          correctIndex: 0,
          explanation:
            "Le retour sur la 'Tanindrazana' (terre des ancêtres) est une reconnexion vivante avec l'histoire, la famille et l'identité malgache.",
        },
        {
          type: 'quiz',
          question:
            "Quel moyen de transport emblématique relie les provinces et villages de l'île ?",
          questionMg:
            'Inona no fiara fitateram-bahoaka malaza mampitohy ny tanàna rehetra eto Madagasikara ?',
          choices: [
            'Ny Taksiborosy',
            'Le métro souterrain',
            'Le tramway à cheval',
            'La diligence',
          ],
          correctIndex: 0,
          explanation:
            "Le taxi-brousse est l'artère vivante du transport malgache, où s'exprime la solidarité paysanne et citadine.",
        },
        {
          type: 'quiz',
          question:
            "Quel geste d'accueil traditionnel offre-t-on en premier au voyageur fatigué qui arrive ?",
          questionMg:
            'Inona no atolotra voalohany ny vahiny vao avy nanao dia lavitra ?',
          choices: [
            'Un verre d’eau fraîche pour apaiser le souffle (Mamadika fofon’aina)',
            'Un dossier de formulaires à remplir',
            'Une facture immédiate',
            'Rien avant le lendemain',
          ],
          correctIndex: 0,
          explanation:
            "Offrir de l'eau fraîche désaltère le corps et réchauffe le cœur avant toute prise de parole.",
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Mafon-tanana » apporté lors d'une visite à la famille ?",
          questionMg:
            'Inona no atao hoe « Mafon-tanana » rehefa mamangy havana ?',
          choices: [
            'Un présent affectueux pour marquer la joie des retrouvailles et honorer le foyer',
            'Une taxe obligatoire réclamée par la mairie',
            'Une amende pour être venu en retard',
            'Un contrat commercial',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Mafon-tanana' (ce qui tient chaud dans la main) est un geste discret de générosité et d'amour familial.",
        },
      ],
    },

    // ─── LEÇON 2 : FAMILLE ÉLARGIE & PARENTÉ ───
    {
      slug: 'la-famille-elargie-et-liens-de-parente',
      title:
        'La famille élargie et les liens de parenté (Ny Rohim-pihavanana sy ny Havantsika)',
      titleMg: 'Ny Rohim-pihavanana sy ny Fianakaviana Malagasy',
      summary:
        'Maîtrisez les appellations familiales malgaches : aînés, cadets, oncles, tantes et beaux-parents avec le respect coutumier.',
      summaryMg:
        'Fantaro ny anaram-pianakaviana : zoky, zandry, rahalahy, anabavy, rafozana ary ny fanehoana haja.',
      type: 'VOCABULARY',
      orderIndex: 2,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la société malgache, la famille ne s'arrête pas au cercle nucléaire : elle englobe une vaste communauté d'oncles, tantes, cousins et alliés formant le tissu vivant du *Fihavanana*. Les appellations marquent scrupuleusement la génération, l'ordre de naissance et le respect mutuel. Un aîné est un guide protecteur (*Zoky*), un cadet un trésor à accompagner (*Zandry*).",
          textMg:
            "Eo amin'ny fiarahamonina malagasy, ny fianakaviana dia malalaka sy miray hina : ahitana ny ray aman-dreny, ny zoky, ny zandry, ny mpiray tampo, ny rafozana ary ny havan-tiana rehetra. Ny fanajana ny lahimatoa sy ny zokiny ary ny fiahiana ny zandry no antoky ny firaisankina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'ZOKY / ZANDRY',
          phonetic: 'zou-ki / zan-dri',
          frenchEquivalent:
            "Le 'z' est doux et sonore. 'Zoky' désigne l'aîné(e), 'Zandry' le ou la cadet(te). L'accentuation tombe sur la première syllabe.",
          sampleWordMg: 'Zokilahy',
          sampleTranslationFr: 'Frère aîné / Grand frère respecté',
        },
        {
          type: 'concept',
          termMg: 'Zoky sy Zandry',
          phonetic: 'zou-ki si zan-dri',
          meaningFr: 'Aîné(e) et Cadet(te)',
          explanation:
            "L'ordre de naissance est fondamental dans l'étiquette malgache. L'aîné conseille et protège ; le cadet écoute avec respect et soutient.",
        },
        {
          type: 'concept',
          termMg: 'Rahalahy sy Anabavy / Ranadahy sy Rahavavy',
          phonetic: 'ra-ha-la-hi / a-na-ba-vi',
          meaningFr: 'Frères et Sœurs (selon le genre du locuteur)',
          explanation:
            "Règle linguistique unique : un homme appelle son frère 'Rahalahy' et sa sœur 'Anabavy'. Une femme appelle son frère 'Ranadahy' et sa sœur 'Rahavavy'.",
        },
        {
          type: 'concept',
          termMg: 'Ray aman-dreny / Dadatoa sy Nenitoa',
          phonetic: 'rai a-man-dre-ni',
          meaningFr: 'Parents / Oncle paternel/maternel et Tante',
          explanation:
            "Les oncles et tantes sont considérés comme de véritables seconds pères et mères (*Reny kely*, *Ray lahy*), entourés d'un immense respect.",
        },
        {
          type: 'concept',
          termMg: 'Rafozana sy Vinanto',
          phonetic: 'ra-fou-za-na / vi-nan-tou',
          meaningFr: 'Beaux-parents et Gendre / Belle-fille',
          explanation:
            "L'alliance par le mariage crée une parenté sacrée. Le gendre ou la belle-fille (*Vinanto*) doit honneur et assistance à ses beaux-parents (*Rafozana*).",
        },
        {
          type: 'example',
          textMg:
            'Manaja ny zokiny ny zandry, ary mifankatia ny mpiray tampo rehetra.',
          textFr:
            'Les cadets respectent leurs aînés, et tous les frères et sœurs s’aiment d’un amour sincère.',
        },
        {
          type: 'example',
          textMg: 'Tonga mamangy ny dadatoa sy ny nenitoa izahay mianakavy.',
          textFr:
            'Nous venons en famille rendre visite à notre oncle et à notre tante.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "En malgache, on ne dit jamais crûment le prénom d'une personne âgée ou d'un beau-parent. On utilise le préfixe affectueux et respectueux « Dada » ou « Nény », ou encore le statut d’aînesse comme « Zoky » pour marquer la considération et l'amitié sacrée.",
          textMg:
            "Fady eo amin'ny fahalalam-pomba ny miantso ny ray aman-dreny na ny zoky amin'ny fanampin'anarany fotsiny : ampiarahina amin'ny hoe « Dada », « Neny » na « Zoky » izany ho mariky ny haja.",
        },
        {
          type: 'quiz',
          question:
            'Comment un homme appelle-t-il sa propre sœur en langue malgache ?',
          questionMg:
            "Ahoana no iantsoan'ny lehilahy ny anabaviny amin'ny teny malagasy ?",
          choices: ['Anabavy', 'Rahalahy', 'Rahavavy', 'Renibe'],
          correctIndex: 0,
          explanation:
            "Un homme dit 'Anabavy' pour sa sœur. Une femme dira 'Ranadahy' pour son frère.",
        },
        {
          type: 'quiz',
          question:
            'Que désigne le terme « Zoky » dans la hiérarchie familiale malgache ?',
          questionMg:
            "Inona no hevitry ny hoe « Zoky » eo anivon'ny mpiray tampo ?",
          choices: [
            'Le frère aîné ou la sœur aînée',
            'Le plus jeune enfant de la maison',
            'Le voisin d’en face',
            'L’invité de passage',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Zoky' est l'aîné(e), investi d'une responsabilité bienveillante de guide envers ses cadets (*Zandry*).",
        },
        {
          type: 'quiz',
          question:
            "Comment nomme-t-on les beaux-parents dans la parenté d'alliance ?",
          questionMg:
            "Ahoana no fiantsoana ny rain'ny vady na ny renin'ny vady ?",
          choices: ['Ny Rafozana', 'Ny Zandry', 'Ny Zafikely', 'Ny Sakaiza'],
          correctIndex: 0,
          explanation:
            "Les beaux-parents sont appelés 'Rafozana'. Ils sont honorés au même titre que les propres parents du conjoint.",
        },
        {
          type: 'quiz',
          question:
            "Pourquoi évite-t-on d'appeler les aînés par leur simple prénom sans préfixe ?",
          questionMg:
            "Nahoana no tsy tsara ny miantso ny zoky amin'ny anarany fotsiny ?",
          choices: [
            'Parce que le respect des aînés (Haja) exige un titre affectueux comme « Zoky » ou « Dada »',
            'Parce qu’on a oublié son prénom',
            'Parce que les prénoms sont secrets',
            'Parce que la loi l’interdit sous peine de prison',
          ],
          correctIndex: 0,
          explanation:
            "L'étiquette malgache sacralise l'ordre générationnel par l'emploi de titres respectueux marquant l'affection.",
        },
        {
          type: 'quiz',
          question:
            'Quel proverbe célèbre illustre la solidarité indéfectible entre frères et sœurs ?',
          questionMg:
            "Inona no ohabolana malaza maneho ny fifankatiavan'ny mpiray tampo ?",
          choices: [
            'Mpiray tampo toy ny rantsan-tanana : miara-mifarombaka fa tsy mifanary',
            'Aleo very tsena toy izay very fihavanana',
            'Izay mitady no mahita',
            'Ny marina mitombina ho azy',
          ],
          correctIndex: 0,
          explanation:
            'Les frères et sœurs sont comparés aux doigts de la main : solidaires et unis dans toutes les épreuves de la vie.',
        },
      ],
    },

    // ─── LEÇON 3 : LE VODIONDRY & MARIAGE TRADITIONNEL ───
    {
      slug: 'le-vodiondry-fiancailles-traditionnelles',
      title:
        'Le Vodiondry : fiançailles et mariage traditionnel (Ny Vodiondry & Fanambadiana)',
      titleMg: 'Ny Vodiondry sy ny Fanambadiana ara-drazana Malagasy',
      summary:
        'Tout savoir sur la cérémonie du Vodiondry : étapes, discours des Mpikabary, dot symbolique et alliance sacrée des deux familles.',
      summaryMg:
        'Fantaro ny fizotran’ny Vodiondry : ny kabary am-panambadiana, ny fefim-pihavanana ary ny fanomezan-dalana.',
      type: 'TRADITION',
      orderIndex: 3,
      durationMinutes: 9,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le **Vodiondry** est la cérémonie fondamentale du mariage coutumier malgache. Bien plus qu'une union entre deux personnes, c'est l'alliance solennelle de deux lignées familiales. Devant l'assemblée, les orateurs (*Mpikabary*) échangent des discours poétiques codifiés où la famille du jeune homme demande avec une infinie déférence la main de la jeune fille, offrant la dot symbolique (*Vodiondry*) et les marques de respect (*Fefy sy Solombodim-bary*).",
          textMg:
            "Ny **Vodiondry** no fototry ny fanambadiana malagasy. Tsy fikambanan'olon-droa fotsiny izy fa fifamatoran'ny fianakaviana roa tonta. Amin'ny alalan'ny mpikabary mahay sy maotina no hangatahana ny tovovavy, hanolorana ny vodiondry sy ny solombodim-bary ary handraisana ny tso-drano masina.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'VODIONDRY',
          phonetic: 'vou-di-oun-dri',
          frenchEquivalent:
            "Composé de 'Vody' (croupion, partie noble d'honneur) et 'Ondry' (mouton). Se prononce 'vou-di-oun-dri'.",
          sampleWordMg: 'Vodiondry',
          sampleTranslationFr: 'Fiançailles traditionnelles / Dot d’honneur',
        },
        {
          type: 'concept',
          termMg: 'Ny Mpikabary amin’ny Vodiondry',
          phonetic: 'mpi-ka-ba-ri',
          meaningFr: 'Les orateurs traditionnels mandatés par chaque famille',
          explanation:
            "Maîtres de la parole poétique qui dialoguent avec courtoisie, répliquant avec proverbes et sagesse pour unir les familles sans jamais blesser l'amour-propre.",
        },
        {
          type: 'concept',
          termMg: 'Solombodim-bary',
          phonetic: 'sou-loum-bou-dim-ba-ri',
          meaningFr: 'Hommage pour le riz nourricier de la mariée',
          explanation:
            'Somme symbolique offerte à la mère de la jeune fille en reconnaissance de toutes les cuillerées de riz et de tendresse prodiguées depuis son enfance.',
        },
        {
          type: 'concept',
          termMg: 'Tso-drano / Firariantsoa',
          phonetic: 'tsou-dra-nou',
          meaningFr: 'La bénédiction sacrée des aînés',
          explanation:
            "L'acte culminant du Vodiondry : les parents et aînés posent leurs mains et bénissent le nouveau couple pour la fécondité, la paix et la prospérité.",
        },
        {
          type: 'concept',
          termMg: 'Fefy / Fefim-pihavanana',
          phonetic: 'fe-fi',
          meaningFr: 'Les clôtures d’honneur et gages de respect',
          explanation:
            "Petites enveloppes d'honneur remises aux frères, oncles et aînés de la jeune fille pour sceller l'alliance et la protection mutuelle.",
        },
        {
          type: 'example',
          textMg:
            'Tonga am-panajana izahay mangataka ny zanakareo ho vady ho an’ny zanakay.',
          textFr:
            'Nous nous présentons avec respect pour demander votre fille en mariage pour notre fils.',
        },
        {
          type: 'example',
          textMg:
            'Mahazoa tso-drano ianareo roa ka ho maro taranaka sy hahita fiadanana.',
          textFr:
            'Recevez la bénédiction sacrée, puissiez-vous avoir une nombreuse descendance et vivre en paix.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Historiquement, le Vodiondry consistait littéralement en l'arrière-train d'un mouton gras, morceau le plus tendre et honorifique traditionnellement réservé aux parents et aux aînés. Aujourd’hui, il s’agit d’une enveloppe financière symbolique remise solennellement dans une corbeille traditionnelle (*Tsoboka*).",
          textMg:
            "Fony fahagola, ny vodiondry dia tena vodin'ondry matavy tokoa atolotra ny ray aman-dreny. Amin'izao fotoana izao kosa dia vola am-panajana no atolotra am-pifaliana ao anaty tsoboka tsara rary.",
        },
        {
          type: 'quiz',
          question:
            'Que représente fondamentalement la cérémonie du « Vodiondry » à Madagascar ?',
          questionMg: "Inona no hevitra lehibe fonosin'ny lanonana Vodiondry ?",
          choices: [
            'L’alliance sacrée et officielle de deux familles à travers le mariage',
            'Une simple fête d’anniversaire entre amis',
            'Un examen scolaire de fin d’année',
            'Une vente aux enchères d’animaux',
          ],
          correctIndex: 0,
          explanation:
            "Le Vodiondry est l'acte fondateur du mariage malgache qui unit deux lignées sous la bénédiction des ancêtres et des vivants.",
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Solombodim-bary » offert lors du Vodiondry ?",
          questionMg:
            'Inona no atao hoe « Solombodim-bary » atolotra ny renin-jaza ?',
          choices: [
            'Un hommage plein de gratitude envers la mère qui a nourri et élevé sa fille',
            'Un sac de riz pour nourrir les chevaux',
            'Le prix du billet d’avion',
            'Une caution remboursable le lendemain',
          ],
          correctIndex: 0,
          explanation:
            "Le Solombodim-bary honore la mère de la mariée en signe d'éternelle reconnaissance pour ses soins maternels.",
        },
        {
          type: 'quiz',
          question:
            'Quel rôle jouent les « Mpikabary » durant la demande en mariage ?',
          questionMg:
            "Inona no andraikitry ny Mpikabary amin'ny fotoanan'ny Vodiondry ?",
          choices: [
            'Ils dialoguent avec éloquence, respect et poésie pour demander la main et sceller l’accord',
            'Ils chantent uniquement des chansons étrangères',
            'Ils cuisinent le repas de midi',
            'Ils surveillent les portes en silence',
          ],
          correctIndex: 0,
          explanation:
            'Les Mpikabary portent la parole sacrée des familles avec art, humilité et finesse oratoire.',
        },
        {
          type: 'quiz',
          question:
            "Quel est l'acte suprême clôturant le Vodiondry pour protéger le nouveau couple ?",
          questionMg:
            "Inona no fanomezana masina lehibe indrindra atolotry ny ray aman-dreny ho an'ny mpivady ?",
          choices: [
            'Le Tso-drano (la bénédiction sacrée par l’eau et le souffle)',
            'Une clé de voiture de sport',
            'Un contrat d’assurance vie',
            'Un voyage obligatoire à l’étranger',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Tso-drano' paternel et maternel transmet l'énergie divine et la paix intérieure indispensables à la longévité du foyer.",
        },
        {
          type: 'quiz',
          question: "D'où vient l'origine étymologique du mot « Vodiondry » ?",
          questionMg: 'Avy aiza ny teny hoe « Vodiondry » tany am-boalohany ?',
          choices: [
            'Du croupion de mouton, le morceau noble réservé jadis aux aînés pour les honorer',
            'D’un mot d’origine portugaise',
            'D’un instrument de musique en bambou',
            'D’une montagne sacrée de l’Est',
          ],
          correctIndex: 0,
          explanation:
            "Le croupion de mouton ('Vodin'ondry') était le symbole de déférence absolue offert aux parents de l'épouse.",
        },
      ],
    },

    // ─── LEÇON 4 : CADEAUX, BÉNÉDICTIONS & GRATITUDE ───
    {
      slug: 'les-cadeaux-honneurs-et-solombodim-bary',
      title:
        'Bénédictions, cadeaux et marques de gratitude (Ny Tso-drano sy ny Fisaorana)',
      titleMg: 'Ny Tso-drano, ny Hasina sy ny Fisaorana ara-drazana',
      summary:
        'Comprendre le pouvoir du Tso-drano, l’art de remercier les anciens et la portée spirituelle des présents symboliques.',
      summaryMg:
        'Fantaro ny herin’ny tso-drano, ny fomba fisaorana ny zokiolona ary ny lanjan’ny firariantsoa.',
      type: 'CULTURE',
      orderIndex: 4,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la pensée malgache, la bénédiction (*Tso-drano*) est la force invisible la plus puissante pour réussir sa vie, bâtir un foyer et traverser les mers. Tout départ de Madagascar ou tout accomplissement majeur requiert la bénédiction des parents et aînés. À l'inverse, l'ingratitude attire le *Tsiny*. Savoir remercier avec noblesse (*Misaotra am-panajana*) est le sceau d'une éducation accomplie (*Olona manan-tsaina sy manana fihavanana*).",
          textMg:
            "Amin'ny finoana malagasy, ny **Tso-drano** no harena lehibe indrindra entina miatrika ny fiainana sy mandeha lavitra. « Tso-dranon-drainy sy reniny no mahatonga ho olona ». Ny fahaizana maneho fankasitrahana sy manome voninahitra ny ray aman-dreny no miaro amin'ny tsiny sy mitondra fahombiazana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TSO-DRANO',
          phonetic: 'tsou-dra-nou',
          frenchEquivalent:
            "Littéralement 'souffle d'eau'. Se prononce 'tsou-dra-nou', alliant le 'ts' claqué et le 'dr' roulé.",
          sampleWordMg: 'Tso-drano',
          sampleTranslationFr: 'Bénédiction sacrée par l’eau et le souffle',
        },
        {
          type: 'concept',
          termMg: 'Tso-drano mahavita be',
          phonetic: 'tsou-dra-nou ma-ha-vi-ta be',
          meaningFr: 'La bénédiction accomplit de grandes choses',
          explanation:
            'Proverbe et conviction selon laquelle la parole bienveillante des parents aplanit les obstacles et ouvre les chemins les plus ardus.',
        },
        {
          type: 'concept',
          termMg: 'Misaotra tompoko / Mankasitraka',
          phonetic: 'mi-sow-tra / man-ka-si-tra-ka',
          meaningFr: 'Merci / J’exprime ma profonde gratitude',
          explanation:
            "'Mankasitraka' va plus loin que le simple merci : il signifie « que votre cœur soit satisfait et comblé de joie pour votre bienfait ».",
        },
        {
          type: 'concept',
          termMg: 'Hasina sy Fanomezam-boninahitra',
          phonetic: 'ha-si-na',
          meaningFr: 'Énergie sacrée et hommage d’honneur',
          explanation:
            'Rendre hommage à un ancien en lui offrant un cadeau de retour (*Tamberim-bavaka*) préserve le Hasina familial et attire la paix.',
        },
        {
          type: 'concept',
          termMg: 'Ny Hasoavana tsy mba lany',
          phonetic: 'ha-sou-a-va-na',
          meaningFr: 'Le bienfait ne périt jamais',
          explanation:
            'Principe moral : tout geste de générosité envers autrui revient tôt ou tard sous forme de bénédictions sur les enfants et les descendants.',
        },
        {
          type: 'example',
          textMg:
            'Mangataka tso-drano aminao izahay alohan’ny handehanana lavitra.',
          textFr:
            'Nous venons solliciter humblement votre bénédiction avant de partir en voyage au loin.',
        },
        {
          type: 'example',
          textMg:
            'Mankasitraka indrindra tompoko amin’ny fandraisana sy ny fitiavana nasehonareo.',
          textFr:
            'Je vous exprime ma gratitude la plus profonde pour votre accueil et toute votre affection.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pour donner le Tso-drano rituel, les aînés soufflaient jadis une fine bruine d'eau pure (*Rano velona*) puisée à la source sur le front et les mains des jeunes gens, en prononçant des vœux de santé, de longévité et de sagesse.",
          textMg:
            "Fony taloha, ny tso-drano dia natao tamin'ny rano velona tsofin'ny vavan'ny ray aman-dreny moramora amin'ny loha sy ny tanan'ny zanaka, miaraka amin'ny teny firarian-tsoa mafonja.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie littéralement le mot « Tso-drano » (bénédiction) ?',
          questionMg: "Inona no dikan'ny teny hoe « Tso-drano » ara-bakiteny ?",
          choices: [
            'Le souffle sur l’eau pure apportant la vie et la paix',
            'Un coup de poing sur la table',
            'Une tempête en mer',
            'Une promesse d’argent liquide',
          ],
          correctIndex: 0,
          explanation:
            "« Tsofa » (souffler) + « rano » (l'eau) : le souffle bienveillant sur l'eau purificatrice scelle la transmission spirituelle des vœux.",
        },
        {
          type: 'quiz',
          question:
            'Quelle expression malgache exprime une reconnaissance encore plus noble que le simple « Misaotra » ?',
          questionMg:
            'Inona no teny fisaorana lalina maneho fankasitrahana feno fo ?',
          choices: [
            'Mankasitraka tompoko',
            'Tsy maninona',
            'Veloma',
            'Azafady',
          ],
          correctIndex: 0,
          explanation:
            "« Mankasitraka » signifie que l'on bénit le bienfait reçu et qu'on souhaite que le cœur du donateur soit comblé.",
        },
        {
          type: 'quiz',
          question:
            'Pourquoi les membres de la diaspora sollicitent-ils toujours le Tso-drano des parents avant de voyager ?',
          questionMg:
            "Nahoana ny tanora sy ny am-pielezana no mangataka tso-drano foana alohan'ny fiaingana ?",
          choices: [
            'Car la bénédiction parentale est perçue comme un bouclier protecteur et le gage du succès',
            'Pour obtenir un passeport gratuit',
            'Parce que les compagnies aériennes l’exigent',
            'Pour ne pas payer de bagages',
          ],
          correctIndex: 0,
          explanation:
            "Un proverbe dit que « Tso-dranon-drainy sy reniny no mahatonga ho olona » : c'est le gage moral de réussite et de sérénité.",
        },
        {
          type: 'quiz',
          question:
            'Que risque moralement une personne qui méprise les bienfaits de ses aînés et refuse de remercier ?',
          questionMg:
            'Inona no voka-dratsy ara-panahy mety hanjo ny olona tsy mahay mankasitraka ?',
          choices: [
            'Elle attire le Tsiny (le blâme moral) et rompt l’harmonie du Fihavanana',
            'Rien du tout',
            'Elle gagne plus d’argent',
            'Elle est élue chef du village',
          ],
          correctIndex: 0,
          explanation:
            "L'ingratitude blesse l'énergie sacrée de la famille et brise le cercle vertueux de la solidarité ancestrale.",
        },
        {
          type: 'quiz',
          question: "Que rappelle l'adage « Ny hasoavana tsy mba lany » ?",
          questionMg:
            "Inona no fampianarana fonosin'ny hoe « Ny hasoavana tsy mba lany » ?",
          choices: [
            'Le bien que l’on fait à autrui ne se perd jamais et produit des fruits durables',
            'Qu’il faut garder toutes ses affaires pour soi',
            'Que les cadeaux coûtent trop cher',
            'Qu’il faut consommer le plus vite possible',
          ],
          correctIndex: 0,
          explanation:
            'La bienveillance génère des bénédictions récurrentes qui rejaillissent sur toute la lignée familiale.',
        },
      ],
    },

    // ─── LEÇON 5 : RÉAPPRENDRE SA LANGUE AVEC MODESTIE ───
    {
      slug: 'la-parole-humble-quand-on-reapprend-sa-langue',
      title:
        'L’art de la modestie quand on réapprend sa langue (Fialan-tsiny am-pahendrena)',
      titleMg: 'Fialan-tsiny am-pahendrena sy Fianarana ny Tenin-drazana',
      summary:
        'Formules d’humilité, bienveillance des aînés et expressions pour oser parler malgache sans complexe en famille.',
      summaryMg:
        'Fomba fiteny feno fanetren-tena rehefa mianatra teny gasy, fialan-tsiny am-pitiavana ary fandraisana am-pifaliana.',
      type: 'CULTURE',
      orderIndex: 5,
      durationMinutes: 8,
      sections: [
        {
          type: 'intro',
          textFr:
            "Nombreux sont les enfants et petits-enfants de la diaspora qui hésitent à s'exprimer en malgache par pudeur ou peur de commettre une faute d'accent. Pourtant, dans la culture malgache, voir un descendant chercher à renouer avec la langue de ses ancêtres suscite une immense joie et une fierté émue chez les aînés. Savoir formuler une excuse humble (*Fialan-tsiny*) désamorce toute appréhension et ouvre instantanément les cœurs.",
          textMg:
            "Maro ireo taranaka am-pielezana no menatra miteny malagasy noho ny tahotra sao diso fanononana. Nefa eo amin'ny Malagasy, ny fahitana zanaka miezaka mianatra ny tenin-drazany dia miteraka hafaliana lehibe sy fiderana. Ny fananana fanetren-tena sy fahaizana miala tsiny am-pitiavana no manokatra ny varavarana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'FIALAN-TSINY',
          phonetic: 'fi-a-lan-tsi-ni',
          frenchEquivalent:
            "Composé de 'Fiala' (s'écarter, conjurer) et 'Tsiny' (le blâme). Prononcé 'fi-a-lan-tsi-ni'.",
          sampleWordMg: 'Aza omena tsiny',
          sampleTranslationFr:
            'Ne m’en veuillez pas / Pardonnez mes hésitations',
        },
        {
          type: 'concept',
          termMg: 'Mbola mianatra teny gasy aho',
          phonetic: 'mbou-la mi-a-na-tra te-ni ga-si a-hou',
          meaningFr: 'J’apprends encore la langue malgache',
          explanation:
            "Phrase d'or qui attire immédiatement la sympathie, la bienveillance et l'encouragement de tout interlocuteur malgache.",
        },
        {
          type: 'concept',
          termMg: 'Aza omena tsiny tompoko',
          phonetic: 'a-za ou-me-na tsi-ni toum-pou-kou',
          meaningFr: 'Ne m’en tenez pas rigueur / Pardonnez mon accent',
          explanation:
            'Formule de politesse traditionnelle pour excuser une éventuelle imperfection de langage ou une maladresse.',
        },
        {
          type: 'concept',
          termMg: 'Mahafaly ny fiezahanao',
          phonetic: 'ma-ha-fa-li ni fi-e-za-ha-now',
          meaningFr:
            'Votre effort fait chaud au cœur / C’est un bonheur de vous entendre',
          explanation:
            'Réponse chaleureuse des anciens et des proches pour encourager la jeunesse de la diaspora à poursuivre sa pratique.',
        },
        {
          type: 'concept',
          termMg: 'Ahoana no fiteny an’izao amin’ny teny gasy ?',
          phonetic: 'a-how-na nou fi-te-ni',
          meaningFr: 'Comment dit-on cela en malgache ?',
          explanation:
            'La question clé pour enrichir son vocabulaire au quotidien en demandant conseil aux aînés avec respect.',
        },
        {
          type: 'example',
          textMg:
            'Miala tsiny tompoko fa mbola mianatra miteny gasy aho, saingy te hianatra tsara.',
          textFr:
            'Pardonnez-moi mes imperfections car j’apprends encore le malgache, mais j’ai grand désir de bien l’apprendre.',
        },
        {
          type: 'example',
          textMg:
            'Tsara be izany anaka ! Aza menatra fa ny fiezahana no tsara indrindra.',
          textFr:
            'C’est admirable mon enfant ! N’aie aucune honte, car l’effort sincère est ce qu’il y a de plus beau.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le proverbe malgache dit : « Ny teny toy ny fary : raha tsakolina, mamy ; raha atelina, mahavoky » (La parole est comme la canne à sucre : savourée, elle est douce ; avalée, elle nourrit l'âme). Pratiquer quelques mots de malgache en famille renforce instantanément le lien affectif intergénérationnel.",
          textMg:
            'Ohabolana malaza ny hoe : « Ny teny toy ny fary, mamy rehefa tsakolina ». Na dia vitsy aza ny teny hainao, ny fiezahanao miteny gasy dia mamelona ny fitiavana ao an-tokantrano.',
        },
        {
          type: 'quiz',
          question:
            "Que dire avec modestie pour annoncer avec bienveillance que l'on est en train d'apprendre la langue ?",
          questionMg:
            'Inona no teny feno fanetren-tena milaza fa mbola mianatra teny gasy ianao ?',
          choices: [
            'Miala tsiny tompoko fa mbola mianatra teny gasy aho',
            'Tsy tiako ny teny gasy',
            'Izaho no mahay indrindra eto',
            'Tsy misy olona mahay miteny',
          ],
          correctIndex: 0,
          explanation:
            "Cette phrase simple et sincère désarme toute appréhension et suscite l'admiration bienveillante des interlocuteurs.",
        },
        {
          type: 'quiz',
          question:
            "Quelle phrase permet de demander le nom d'un mot inconnu en malgache ?",
          questionMg:
            "Ahoana no hanontanianao ny anaran-javatra tsy fantatrao amin'ny teny gasy ?",
          choices: [
            'Ahoana no fiteny an’izao amin’ny teny gasy tompoko ?',
            'Aza miresaka amiko',
            'Inona no anton’ny fiainana ?',
            'Aiza ny trano ?',
          ],
          correctIndex: 0,
          explanation:
            "« Ahoana no fiteny an'izao amin'ny teny gasy ? » invite poliment l'autre à partager son savoir linguistique.",
        },
        {
          type: 'quiz',
          question:
            'Comment réagissent traditionnellement les familles et les aînés face aux efforts linguistiques de la diaspora ?',
          questionMg:
            "Ahoana no fandraisan'ny fianakaviana sy ny ray aman-dreny ny ezaka ataon'ny tanora mianatra teny gasy ?",
          choices: [
            'Avec une immense fierté, un profond encouragement et beaucoup d’amour',
            'Avec moquerie et sévérité',
            'Par le refus absolu de répondre',
            'En imposant une amende',
          ],
          correctIndex: 0,
          explanation:
            "Chaque mot prononcé est reçu comme une preuve d'amour envers les racines familiales et l'identité commune.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie la formule de politesse « Aza omena tsiny tompoko » ?',
          questionMg: 'Inona no hevitry ny hoe « Aza omena tsiny tompoko » ?',
          choices: [
            'Pardonnez mes maladresses / Ne m’en veuillez pas pour mes imperfections',
            'Donnez-moi une médaille',
            'Écoutez-moi en silence',
            'Partez d’ici',
          ],
          correctIndex: 0,
          explanation:
            "C'est la formule d'humilité par excellence qui prévient le blâme rituel (*Tsiny*) et instaure la confiance mutuelle.",
        },
        {
          type: 'quiz',
          question:
            'À quoi le proverbe malgache compare-t-il la douceur de la parole partagée en famille ?',
          questionMg:
            "Amin'inona no ampitahana ny hamamian'ny teny malagasy amin'ny ohabolana ?",
          choices: [
            'À la canne à sucre que l’on savoure (Toy ny fary)',
            'Au piment le plus fort',
            'À la pierre dure de la montagne',
            'Au vent d’orage',
          ],
          correctIndex: 0,
          explanation:
            "« Ny teny toy ny fary » : comme la canne à sucre, la parole mesurée, bienveillante et sincère nourrit l'esprit de douceur.",
        },
      ],
    },
  ],
};
