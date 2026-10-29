import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ [Seed Prod] Variable DATABASE_URL manquante dans .env');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── 1. Données des Proverbes, Dictons & Expressions ──────────────────────────

const ITEMS_DATA = [
  // Proverbes
  {
    id: "proverbID-101",
    malagasy: "Ny hazo no vanon-ko lakana, ny tany naniriany no tsara.",
    french: "Si l'arbre est devenu une bonne pirogue, c'est que la terre où il a poussé était fertile.",
    meaning: "La réussite, la droiture et la valeur morale d'une personne s'expliquent avant tout par la qualité de l'éducation reçue au sein de sa famille et de son milieu d'origine.",
    example: "Nahavita fianarana ambony sady mahalala fomba ianao : ny hazo no vanon-ko lakana, ny tany naniriany no tsara.",
    themes: ["Éducation", "Famille", "Origines", "Sagesse"],
    category: "PROVERBE" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "ni hazou nou vanoun-kou lakana, ni tani naniriani nou tsara",
    dialectVariants: [
      { dialectName: "Betsileo", text: "Ny hazo no miavaka, fa ny tany no mitomboana." }
    ],
  },
  {
    id: "proverbID-102",
    malagasy: "Ny fihavanana tahaka ny landy : maty ifonosana, velona itafiana, ary ny madilana arahim-panondro.",
    french: "Le fihavanana est comme la soie : morts, on s'en enveloppe ; vivants, on s'en revêt ; et lorsque le fil s'amincit, on le consolide du bout de l'index.",
    meaning: "Le lien social et familial (fihavanana) accompagne les Malgaches durant toute leur vie jusque dans le linceul mortuaire. Lorsqu'une relation se fragilise, il faut la réparer avec délicatesse et patience plutôt que de la rompre.",
    example: "Aoka hifamela heloka isika mirahalahy fa ny fihavanana tahaka ny landy ka ny madilana arahim-panondro.",
    themes: ["Fihavanana", "Réconciliation", "Solidarité", "Tradition"],
    category: "PROVERBE" as const,
    difficulty: "MEDIUM" as const,
    origins: ["Hautes Terres"],
    phonetic: "ni fihavanana tahaka ni landi : mati ifounousana, velouna itafiana, ari ni madilana arahim-panoundrou",
    dialectVariants: [],
  },
  {
    id: "proverbID-103",
    malagasy: "Mitoto vary diavolana, ka maka fanahy ny akoho.",
    french: "Piler le riz au clair de lune, c'est induire les poules en tentation.",
    meaning: "Il est imprudent d'exposer autrui à une tentation évidente par négligence, puis de lui reprocher d'y avoir cédé. Ce proverbe invite à la prévoyance et à la responsabilité personnelle.",
    example: "Aza apetraka eo ambony latabatra tsy mihidy ny vola, sao mitoto vary diavolana ka maka fanahy ny akoho.",
    themes: ["Prudence", "Responsabilité", "Sagesse"],
    category: "PROVERBE" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "mitoutou vari diavoulana, ka maka fanahi ni akouhou",
    dialectVariants: [],
  },
  {
    id: "proverbID-104",
    malagasy: "Ny marina mitavozavoza tsy mahaleo ny lainga tsara lahatra.",
    french: "Une vérité maladroitement exprimée ne fait pas le poids face à un mensonge bien agencé.",
    meaning: "Avoir raison sur le fond ne suffit pas toujours dans la vie sociale : la clarté de l'argumentation et la maîtrise de la parole sont indispensables pour défendre le vrai.",
    example: "Omano tsara ny porofo hanananao rehefa hiteny, fa ny marina mitavozavoza tsy mahaleo ny lainga tsara lahatra.",
    themes: ["Vérité", "Éloquence", "Justice"],
    category: "PROVERBE" as const,
    difficulty: "MEDIUM" as const,
    origins: ["Général"],
    phonetic: "ni marina mitavouzavouza tsi mahaleou ni lainga tsara lahatra",
    dialectVariants: [],
  },
  // Dictons populaires
  {
    id: "dictonID-101",
    malagasy: "Ny fanahy no maha olona.",
    french: "C'est l'esprit et la qualité morale qui font l'être humain.",
    meaning: "Dicton fondamental de l'éthique malgache : la dignité d'une personne ne se mesure ni à sa richesse matérielle ni à son rang social, mais à sa droiture morale, à sa bienveillance et à son respect d'autrui (fanahy).",
    example: "Na manam-pahaizana sy manan-karena aza ny olona iray, tsarovy mandrakariva fa ny fanahy no maha olona.",
    themes: ["Éthique", "Humanité", "Respect", "Philosophie"],
    category: "DICTON" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "ni fanahi nou maha oulouna",
    dialectVariants: [],
  },
  {
    id: "dictonID-102",
    malagasy: "Ny hevitry ny maro mahataka-davitra.",
    french: "La réflexion du grand nombre porte loin.",
    meaning: "La concertation collective et l'écoute mutuelle permettent de trouver des solutions plus sages et plus durables qu'une décision prise isolément.",
    example: "Andao hikaon-doha alohan'ny hanapahana hevitra, satria ny hevitry ny maro mahataka-davitra.",
    themes: ["Concertation", "Sagesse", "Communauté"],
    category: "DICTON" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "ni hevitri ni marou mahataka-davitra",
    dialectVariants: [],
  },
  {
    id: "dictonID-103",
    malagasy: "Ny vato menatra ny vato, ny hazo menatra ny hazo.",
    french: "La pierre a égard à la pierre, le bois a égard au bois.",
    meaning: "Formule traditionnelle d'exhortation morale rappelant que tout être humain doit éprouver de la retenue, de la pudeur morale (henatra) et du respect envers ses semblables.",
    example: "Mifampitsimbina sy mifanaja hatrany eo amin'ny fiarahamonina, fa ny vato menatra ny vato ary ny hazo menatra ny hazo.",
    themes: ["Respect", "Pudeur", "Vie sociale"],
    category: "DICTON" as const,
    difficulty: "MEDIUM" as const,
    origins: ["Général"],
    phonetic: "ni vatou menatra ni vatou, ni hazou menatra ni hazou",
    dialectVariants: [],
  },
  {
    id: "dictonID-104",
    malagasy: "Izay entim-belona no enti-maty.",
    french: "Ce que l'on porte de son vivant est ce que l'on emporte dans la mort.",
    meaning: "Les habitudes, le caractère profond et la réputation qu'une personne a cultivés tout au long de son existence lui restent attachés jusqu'à la fin de sa vie.",
    example: "Tsy niova mihitsy ny hatsaram-pony hatramin'ny fahanterany, satria izay entim-belona no enti-maty.",
    themes: ["Caractère", "Destin", "Morale"],
    category: "DICTON" as const,
    difficulty: "MEDIUM" as const,
    origins: ["Général"],
    phonetic: "izay entim-belouna nou enti-mati",
    dialectVariants: [],
  },
  // Expressions imagées
  {
    id: "expressionID-101",
    malagasy: "Nitoto nahafotsy, nahandro nahamasaka.",
    french: "Avoir pilé le riz jusqu'à le blanchir, l'avoir cuit jusqu'à pleine cuisson.",
    meaning: "Expression idiomatique désignant le fait d'avoir accompli une tâche, un devoir ou une responsabilité avec dévouement depuis le début jusqu'à son achèvement complet.",
    example: "Misaotra ny ray aman-dreny sy ny mpikarakara rehetra izay nitoto nahafotsy sy nahandro nahamasaka tamin'izao lanonana izao.",
    themes: ["Travail", "Persévérance", "Gratitude"],
    category: "EXPRESSION" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "nitoutou nahafoutsi, nahandrou nahamasaka",
    dialectVariants: [],
  },
  {
    id: "expressionID-102",
    malagasy: "Mandry an-driran'antsy.",
    french: "Dormir sur le tranchant d'un couteau.",
    meaning: "Vivre dans une inquiétude constante, dans l'insécurité ou l'angoisse permanente d'un danger imminent, sans pouvoir trouver le repos de l'esprit.",
    example: "Mandry an-driran'antsy ny mponina amin'iny faritra iny rehefa miakatra be ny rano amin'ny fotoam-pahavaratra.",
    themes: ["Inquiétude", "Danger", "Vie quotidienne"],
    category: "EXPRESSION" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "mandri an-driran antsi",
    dialectVariants: [],
  },
  {
    id: "expressionID-103",
    malagasy: "Nofon-kena mitam-pihavanana.",
    french: "Morceau de viande qui scelle et entretient la fraternité.",
    meaning: "Désigne originellement la part de viande de zébu partagée lors des cérémonies pour manifester l'unité communautaire ; par extension, tout geste d'attention offert pour raffermir les liens.",
    example: "Indro ny fanomezana kely atolotra anareo ho toy ny nofon-kena mitam-pihavanana.",
    themes: ["Fihavanana", "Partage", "Tradition"],
    category: "EXPRESSION" as const,
    difficulty: "MEDIUM" as const,
    origins: ["Général"],
    phonetic: "noufoun-kena mitam-pihavanana",
    dialectVariants: [],
  },
  {
    id: "expressionID-104",
    malagasy: "Mahitsy ohatra ny tsinaim-balala.",
    french: "Droit comme l'intestin d'une sauterelle.",
    meaning: "Qualifie une personne d'une franchise absolue, directe et sans détour, ou un propos dépourvu de toute dissimulation.",
    example: "Tsy mba mahay miolakolaka izany i Dadabe fa mahitsy ohatra ny tsinaim-balala ny teniny.",
    themes: ["Franchise", "Caractère", "Vérité"],
    category: "EXPRESSION" as const,
    difficulty: "EASY" as const,
    origins: ["Général"],
    phonetic: "mahitsi ouhatra ni tsinaim-balala",
    dialectVariants: [],
  },
];

// ─── 2. Données des Citations ──────────────────────────────────────────────────

const CITATIONS_DATA = [
  {
    id: "citationID-101",
    citationMg: "Andrianiko ny teniko, ny an'ny hafa koa feheziko.",
    citationFr: "Je tiens ma langue en souveraine estime, et je maîtrise aussi celles des autres.",
    source: "Henri Rahaingoson (Di...)",
    contexte: "Devise formulée en 1993 lors de l'instauration des journées de la langue malgache et adoptée comme devise de promotion du malgache par l'Académie Malgache.",
    themes: ["Langue", "Identité", "Ouverture", "Patrimoine"],
  },
  {
    id: "citationID-102",
    citationMg: "Ny ranomasina no valamparihiko.",
    citationFr: "La mer est la limite de ma rizière.",
    source: "Andrianampoinimerina",
    contexte: "Déclaration politique historique du souverain (règne env. 1787-1810) exprimant la volonté d'unifier l'ensemble de l'île de Madagascar.",
    themes: ["Histoire", "Unité", "Souveraineté", "Territoire"],
  },
  {
    id: "citationID-103",
    citationMg: "Ny teny sy ny sain'ny firenena iray dia mifaningotra aina hatrany.",
    citationFr: "La langue et l'esprit d'une nation ont leurs vies intimement entrelacées.",
    source: "Randja Zanamihoatra",
    contexte: "Extrait de l'ouvrage Vainafo tononkira (p. 9).",
    themes: ["Langue", "Nation", "Pensée", "Culture"],
  },
  {
    id: "citationID-104",
    citationMg: "Rah' misy mitady ny tena hafaliana / Tsy azon'ny ratsy akory ravana, / Dia tokana monja no azo valiana : / Ny Fanantenana !",
    citationFr: "S'il est quelqu'un qui cherche la vraie joie / Que le mal ne saurait jamais détruire, / Il n'est qu'une seule réponse possible : / L'Espérance !",
    source: "Régis Rajemisa-Raolison",
    contexte: "Strophe poétique célébrant la résilience et l'espérance.",
    themes: ["Espérance", "Joie", "Poésie", "Sagesse"],
  },
  {
    id: "citationID-105",
    citationMg: "Fa fitiavako ianao, fifaliako, fahasambarako… Vahatr'aina, tanjon-tokana, eny tokana ifaharako…",
    citationFr: "Car tu es mon amour, ma joie, mon bonheur… Racine de vie, but unique, oui le seul sur lequel je m'appuie…",
    source: "Dox (Jean Verdi Salomon Razakandraina)",
    contexte: "Premiers vers du poème Antsam-pitiavana, publié dans Izy Mirahavavy (1940) et le recueil Folihala.",
    themes: ["Amour", "Poésie", "Littérature"],
  },
  {
    id: "citationID-106",
    citationMg: "Raha maratra izany vava, miainga hisafo eo ny tanana ; raha maratra koa ny tanana, io mitsoka eo ny vava.",
    citationFr: "Si la bouche vient à être blessée, la main s'élève pour la caresser ; et si la main est blessée à son tour, voici la bouche qui souffle sur elle.",
    source: "Rado (Georges Andriamanantena)",
    contexte: "Vers illustrant la complémentarité et l'entraide fraternelle au sein d'une même communauté.",
    themes: ["Solidarité", "Entraide", "Fraternité", "Poésie"],
  },
];

// ─── 3. Données des Mots Rares (Raki-teny Miafina) ─────────────────────────────

const RAKI_TENY_DATA = [
  {
    id: "somambisamby",
    slug: "somambisamby",
    word: "Somambisamby",
    phonetic: "sou-mam-bi-sam-bi",
    category: "nature_temps",
    wordClassMg: "Anarana sy mpamari-toetra",
    wordClassFr: "Nom et adjectif",
    rarity: "POETIC" as const,
    rarityLabelMg: "Voambolana tononkalo",
    rarityLabelFr: "Poétique & Évocateur",
    meaningMg: "Ny takariva efa manopy maizina ; hazavana malefaka tsy tena mazava fa somary maizimaizina eo anelanelan'ny andro sy ny alina.",
    meaningFr: "Le crépuscule, l'heure entre chien et loup ; une lueur douce et tamisée où le jour décline vers l'obscurité.",
    exampleMg: "Nody tany an-tanàna izy ireo rehefa injay nisoko ny somambisamby.",
    exampleFr: "Ils rentrèrent au village lorsque le crépuscule se glissa doucement.",
    contextUsage: "Très prisé dans la poésie lyrique et la chanson traditionnelle des Hautes Terres pour évoquer l'heure mélancolique du soir.",
    etymology: "Avy amin'ny fitambaran'ny 'somambo' (manjavozavo) sy ny fiverenan-teny maneho halefahana.",
  },
  {
    id: "tsiahy",
    slug: "tsiahy",
    word: "Tsiahy",
    phonetic: "tsi-a-hi",
    category: "emotions",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "POETIC" as const,
    rarityLabelMg: "Voambolana tononkalo",
    rarityLabelFr: "Poétique",
    meaningMg: "Fahatsiarovana lalina mipololotra avy ao am-po momba ny lasa, ny olona tiana na ny toerana nandalovana, matetika mifangaro embona.",
    meaningFr: "Souvenir intime, réminiscence chargée d'émotion et de nostalgie à l'égard d'un être cher ou d'un temps révolu.",
    exampleMg: "Tsiahy sisa no mitoetra ao am-po rehefa lasa ireny fotoana mamy ireny.",
    exampleFr: "Seul le souvenir demeure dans le cœur lorsque ces doux moments s'en sont allés.",
    contextUsage: "Employé principalement dans le registre littéraire, poétique et commémoratif.",
    etymology: "Fakan-teny 'ahy' / 'tsiahy' mifandray amin'ny fikarakarana sy fitehirizana ao an-tsaina.",
  },
  {
    id: "embona",
    slug: "embona",
    word: "Embona",
    phonetic: "èm-bou-na",
    category: "emotions",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "LITERAL" as const,
    rarityLabelMg: "Fiteny voakaly",
    rarityLabelFr: "Littéraire",
    meaningMg: "Fahatsiarovana amim-pitiavana sy alahelo malefaka olona na tanàna lavitra ny tena ; fanimaniana mamelovelo ao am-po.",
    meaningFr: "Nostalgie tendre et mélancolique, langueur de l'âme causée par l'éloignement d'un être aimé ou de la terre natale.",
    exampleMg: "Anisan'ny fihetseham-po mamelovelo ao am-po ny embona ny tanindrazana.",
    exampleFr: "La nostalgie de la terre des ancêtres fait partie des émotions qui envahissent doucement le cœur.",
    contextUsage: "Mot clé de la sensibilité malgache, fréquent dans les chants d'exil et poésies d'amour.",
    etymology: "Mifandray amin'ny 'embo' (fofona manitra mamerovero mampahatsiaro ny lasa).",
  },
  {
    id: "angola",
    slug: "angola",
    word: "Angola",
    phonetic: "an-gou-la",
    category: "art_musique",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "POETIC" as const,
    rarityLabelMg: "Voambolana tononkalo",
    rarityLabelFr: "Poétique",
    meaningMg: "Filanton-kira na fomba fihirana asiana haingom-peo miolana malefaka manohina ny fo ; fiangotingotiana amim-pitiavana.",
    meaningFr: "Inflexion mélodique pleine de charme et de tendresse dans le chant ; grâce affectueuse ou caresse de la voix.",
    exampleMg: "Manohina ny fon'ny mpihaino ny angola malefaka amin'ny kalon'ny fahiny.",
    exampleFr: "Les douces inflexions mélodiques des chants d'autrefois touchent le cœur des auditeurs.",
    contextUsage: "S'emploie dans le domaine musical (Kalon'ny Fahiny) pour l'ornementation vocale expressive.",
    etymology: "Fakan-teny 'gola' maneho fiolankolana malefaka sy haingon-kanto.",
  },
  {
    id: "kalo",
    slug: "kalo",
    word: "Kalo",
    phonetic: "ka-lou",
    category: "art_musique",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "POETIC" as const,
    rarityLabelMg: "Voambolana tononkalo",
    rarityLabelFr: "Poétique",
    meaningMg: "Hira madinika malefaka fanao raha malahelohelo, manimanina na mahatsiaro ny ela sy mitantara ny lasa.",
    meaningFr: "Complainte mélodieuse, chant intime et nostalgique que l'on fredonne en se remémorant le passé.",
    exampleMg: "Mikalo hira madinika eo an-davarangana izy rehefa takariva ny andro.",
    exampleFr: "Il fredonne une douce complainte sur la véranda lorsque tombe le soir.",
    contextUsage: "Registre poétique et musical traditionnel ; a donné le redoublement 'kalokalo'.",
    etymology: "Fakan-teny malagasy madio maneho hira mitempo ao anatin'ny fahanginana.",
  },
  {
    id: "vakomanitra",
    slug: "vakomanitra",
    word: "Vakomanitra",
    phonetic: "va-kou-ma-ni-tra",
    category: "art_musique",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "LITERAL" as const,
    rarityLabelMg: "Fiteny voakaly",
    rarityLabelFr: "Littéraire",
    meaningMg: "Teny ilazana ny harena ara-kolontsaina sy ny zava-kanto nentim-paharazana toy ny hira, ny dihy ary ny fomba amam-panao nolovaina tamin'ny razana.",
    meaningFr: "Trésor culturel parfumé d'authenticité ; désigne les arts traditionnels légués par les ancêtres.",
    exampleMg: "Adidin'ny taranaka ny mitahiry sy manandratra avo ny vakomanitra malagasy.",
    exampleFr: "Il est du devoir des générations de préserver et de valoriser le patrimoine artistique traditionnel malgache.",
    contextUsage: "Registre soutenu et académique, célébrant les arts vivants malgaches.",
    etymology: "Composé de 'vakoka' (patrimoine précieux) et de 'manitra' (noble, parfumé).",
  },
  {
    id: "antara",
    slug: "antara",
    word: "Antara",
    phonetic: "an-ta-ra",
    category: "nature_temps",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "ARCHAIC" as const,
    rarityLabelMg: "Teny tranainy",
    rarityLabelFr: "Archaïque",
    meaningMg: "Dobo lalina dia lalina sady mangatsiaka izaitsizy ; hantsana na rano lalina tsy hita fanambaniny.",
    meaningFr: "Gouffre d'eau très profond et glacé ; abîme aquatique insondable.",
    exampleMg: "Matahotra ny hidina eo amoron'io antara mangatsiaka io ny mpiandry omby.",
    exampleFr: "Les bouviers craignent de descendre au bord de ce gouffre d'eau glacée.",
    contextUsage: "Mot qualifié de 'teny tranainy' dans le Rakibolana Malagasy, subsiste dans la toponymie.",
    etymology: "Fakan-teny aotstroneziana mifandray amin'ny halalin'ny rano.",
  },
  {
    id: "tomandeboka",
    slug: "tomandeboka",
    word: "Tomandeboka",
    phonetic: "tou-man-dè-bou-ka",
    category: "sagesse_philosophie",
    wordClassMg: "Mpamari-toetra",
    wordClassFr: "Adjectif",
    rarity: "ARCHAIC" as const,
    rarityLabelMg: "Teny tranainy",
    rarityLabelFr: "Archaïque",
    meaningMg: "Miezinezina, manana endrika lehibe sy mendri-kaja mampitolagaga.",
    meaningFr: "Majestueux, imposant, d'une grandeur solennelle.",
    exampleMg: "Nijoro tomandeboka teo an-tampon-kavoana ny rovan'ny mpanjaka fahiny.",
    exampleFr: "L'enceinte royale d'autrefois se dressait, majestueuse, au sommet de la colline.",
    contextUsage: "Terme ancien formé avec l'infixe archaïque '-om-', employé dans les récits historiques.",
    etymology: "Avy amin'ny 'tandeboka' nampidirana ny tao-tsikera -om- manambara fisehoana miezinezina.",
  },
  {
    id: "vadintany",
    slug: "vadintany",
    word: "Vadintany",
    phonetic: "va-din-ta-ni",
    category: "sagesse_philosophie",
    wordClassMg: "Anarana",
    wordClassFr: "Nom",
    rarity: "ARCHAIC" as const,
    rarityLabelMg: "Teny tranainy",
    rarityLabelFr: "Archaïque",
    meaningMg: "Olona nomen'ny mpanjaka fahefana fahiny hitana ny tany sy ny fanjakana, hampita ny didin'ny mpanjaka amin'ny vahoaka ary hitondra ny tenin'ny vahoaka any an-drova.",
    meaningFr: "Officier royal et émissaire chargé autrefois de veiller sur une circonscription et de proclamer les édits royaux.",
    exampleMg: "Nampiantso ny fokonolona teo an-kianja ny vadintany mba hilaza ny didin'ny mpanjaka.",
    exampleFr: "L'émissaire royal rassembla la communauté sur la place publique pour proclamer l'édit du souverain.",
    contextUsage: "Terme historique et institutionnel de l'ancien Royaume d'Imerina (institué sous Andrianampoinimerina).",
    etymology: "Composé de 'vady' (gardien, partenaire) et de 'tany' (terre, territoire).",
  },
  {
    id: "valahara",
    slug: "valahara",
    word: "Valahara",
    phonetic: "va-la-ha-ra",
    category: "sagesse_philosophie",
    wordClassMg: "Anarana sy mpamari-toetra",
    wordClassFr: "Nom et adjectif",
    rarity: "PROVERBIAL" as const,
    rarityLabelMg: "Fampiasa am-pitenenana",
    rarityLabelFr: "Proverbial",
    meaningMg: "Mitandro ny haja aman-daza sy ny voninahiny, mahatsiaro menatra manoloana ny ratsy (fampiasa indrindra amin'ny endrika mandà hoe : tsy valahara).",
    meaningFr: "Qui a le sens de l'honneur et de la retenue morale (employé surtout au négatif « tsy valahara » : sans scrupule ni vergogne).",
    exampleMg: "Olona tsy valahara iny ka tsy mba menatra ny manao ratsy eo imason'ny mpiara-monina.",
    exampleFr: "Cet individu est sans vergogne et ne rougit pas de mal agir devant la communauté.",
    contextUsage: "Terme d'éthique traditionnelle lié au sens de la pudeur morale (henatra).",
    etymology: "Fomba fiteny nentim-paharazana mifandray amin'ny vala (fefy miaro ny haja).",
  },
];

// ─── Fonction Principale du Seed de Production ───────────────────────────────

async function seedProduction() {
  console.log('🌱 [SEED PROD] Démarrage de l\'intégration sécurisée en production...');

  // 1. Gestion des Proverbes, Dictons & Expressions
  console.log('\n📖 [1/3] Traitement des Proverbes, Dictons & Expressions...');
  let itemsCreated = 0;
  let itemsUpdated = 0;

  for (const item of ITEMS_DATA) {
    const cleanMalagasy = item.malagasy.trim();
    const normalizedKey = cleanMalagasy.toLowerCase();

    // Recherche d'un élément existant par son texte malgache pour éviter tout doublon
    const existing = await prisma.malagasyItem.findFirst({
      where: {
        malagasy: {
          equals: cleanMalagasy,
          mode: 'insensitive',
        },
      },
      include: {
        themes: true,
        dialectVariants: true,
      },
    });

    if (existing) {
      // Mise à jour douce sans écraser d'historique utilisateur
      await prisma.malagasyItem.update({
        where: { id: existing.id },
        data: {
          french: item.french,
          meaning: item.meaning,
          example: item.example,
          phonetic: item.phonetic,
          origins: item.origins,
          difficulty: item.difficulty,
        },
      });
      itemsUpdated++;
      console.log(`  ↻ [Mis à jour] ${item.category} : "${cleanMalagasy.substring(0, 45)}..."`);
    } else {
      // Création d'une nouvelle entrée
      const baseSlug = slugify(cleanMalagasy.substring(0, 50)) || 'item';
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.malagasyItem.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const created = await prisma.malagasyItem.create({
        data: {
          id: item.id,
          slug,
          malagasy: cleanMalagasy,
          french: item.french,
          meaning: item.meaning,
          example: item.example,
          phonetic: item.phonetic,
          category: item.category,
          difficulty: item.difficulty,
          origins: item.origins,
          status: 'PUBLISHED',
        },
      });

      // Liaison des variantes dialectales
      for (const variant of item.dialectVariants) {
        await prisma.dialectVariant.create({
          data: {
            dialectName: variant.dialectName,
            text: variant.text,
            itemId: created.id,
          },
        });
      }

      // Liaison des thèmes
      for (const themeName of item.themes) {
        const themeSlug = slugify(themeName);
        let theme = await prisma.theme.findUnique({ where: { slug: themeSlug } });
        if (!theme) {
          theme = await prisma.theme.create({
            data: {
              nameFr: themeName,
              nameMg: themeName,
              slug: themeSlug,
            },
          });
        }
        await prisma.malagasyItemTheme.upsert({
          where: {
            itemId_themeId: {
              itemId: created.id,
              themeId: theme.id,
            },
          },
          update: {},
          create: {
            itemId: created.id,
            themeId: theme.id,
          },
        });
      }

      itemsCreated++;
      console.log(`  + [Créé] ${item.category} : "${cleanMalagasy.substring(0, 45)}..."`);
    }
  }

  // 2. Gestion des Citations
  console.log('\n📜 [2/3] Traitement des Citations d\'Auteurs...');
  let citationsCreated = 0;
  let citationsUpdated = 0;

  for (const c of CITATIONS_DATA) {
    const cleanCitationMg = c.citationMg.trim();

    const existingCitation = await prisma.citation.findFirst({
      where: {
        citationMg: {
          equals: cleanCitationMg,
          mode: 'insensitive',
        },
      },
    });

    if (existingCitation) {
      await prisma.citation.update({
        where: { id: existingCitation.id },
        data: {
          citationFr: c.citationFr,
          sourceName: c.source,
          contexte: c.contexte,
        },
      });
      citationsUpdated++;
      console.log(`  ↻ [Mis à jour] Citation : "${c.source}"`);
    } else {
      // Trouver ou créer l'auteur
      let author = await prisma.author.findUnique({ where: { name: c.source } });
      if (!author) {
        author = await prisma.author.create({
          data: {
            name: c.source,
          },
        });
      }

      const createdCitation = await prisma.citation.create({
        data: {
          id: c.id,
          citationMg: cleanCitationMg,
          citationFr: c.citationFr,
          sourceName: c.source,
          contexte: c.contexte,
          authorId: author.id,
          status: 'PUBLISHED',
        },
      });

      // Thèmes
      for (const themeName of c.themes) {
        const themeSlug = slugify(themeName);
        let theme = await prisma.theme.findUnique({ where: { slug: themeSlug } });
        if (!theme) {
          theme = await prisma.theme.create({
            data: {
              nameFr: themeName,
              nameMg: themeName,
              slug: themeSlug,
            },
          });
        }
        await prisma.citationTheme.upsert({
          where: {
            citationId_themeId: {
              citationId: createdCitation.id,
              themeId: theme.id,
            },
          },
          update: {},
          create: {
            citationId: createdCitation.id,
            themeId: theme.id,
          },
        });
      }

      citationsCreated++;
      console.log(`  + [Créé] Citation : "${c.source}"`);
    }
  }

  // 3. Gestion des Mots Rares (Raki-teny Miafina)
  console.log('\n💎 [3/3] Traitement des Mots Rares (Raki-teny)...');
  let wordsCreated = 0;
  let wordsUpdated = 0;

  for (const wordItem of RAKI_TENY_DATA) {
    const existingWord = await prisma.rakiTenyWord.findUnique({
      where: { slug: wordItem.slug },
    });

    await prisma.rakiTenyWord.upsert({
      where: { slug: wordItem.slug },
      update: {
        word: wordItem.word,
        phonetic: wordItem.phonetic,
        category: wordItem.category,
        wordClassMg: wordItem.wordClassMg,
        wordClassFr: wordItem.wordClassFr,
        rarity: wordItem.rarity,
        rarityLabelMg: wordItem.rarityLabelMg,
        rarityLabelFr: wordItem.rarityLabelFr,
        meaningMg: wordItem.meaningMg,
        meaningFr: wordItem.meaningFr,
        exampleMg: wordItem.exampleMg,
        exampleFr: wordItem.exampleFr,
        contextUsage: wordItem.contextUsage,
        etymology: wordItem.etymology,
      },
      create: {
        id: wordItem.id,
        slug: wordItem.slug,
        word: wordItem.word,
        phonetic: wordItem.phonetic,
        category: wordItem.category,
        wordClassMg: wordItem.wordClassMg,
        wordClassFr: wordItem.wordClassFr,
        rarity: wordItem.rarity,
        rarityLabelMg: wordItem.rarityLabelMg,
        rarityLabelFr: wordItem.rarityLabelFr,
        meaningMg: wordItem.meaningMg,
        meaningFr: wordItem.meaningFr,
        exampleMg: wordItem.exampleMg,
        exampleFr: wordItem.exampleFr,
        contextUsage: wordItem.contextUsage,
        etymology: wordItem.etymology,
        status: 'PUBLISHED',
      },
    });

    if (existingWord) {
      wordsUpdated++;
      console.log(`  ↻ [Mis à jour] Mot rare : "${wordItem.word}"`);
    } else {
      wordsCreated++;
      console.log(`  + [Créé] Mot rare : "${wordItem.word}"`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🎉 [RÉSUMÉ DU SEED PROD]');
  console.log(`  • Proverbes & Dictons : ${itemsCreated} créé(s), ${itemsUpdated} mis à jour (0 doublon)`);
  console.log(`  • Citations           : ${citationsCreated} créée(s), ${citationsUpdated} mise(s) à jour (0 doublon)`);
  console.log(`  • Mots rares          : ${wordsCreated} créé(s), ${wordsUpdated} mis à jour (0 doublon)`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

seedProduction()
  .catch((e) => {
    console.error('❌ Erreur critique lors du seed production :', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch {}
    process.exit(process.exitCode || 0);
  });

