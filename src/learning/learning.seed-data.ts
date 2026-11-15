export interface SeedSection {
  type: 'intro' | 'concept' | 'example' | 'didYouKnow' | 'quiz' | 'phonetic';
  textFr?: string;
  textMg?: string;
  termMg?: string;
  phonetic?: string;
  meaningFr?: string;
  explanation?: string;
  letterOrSound?: string;
  frenchEquivalent?: string;
  sampleWordMg?: string;
  sampleTranslationFr?: string;
  question?: string;
  questionMg?: string;
  choices?: string[];
  correctIndex?: number;
}

export interface SeedLesson {
  slug: string;
  title: string;
  titleMg: string;
  summary: string;
  summaryMg: string;
  type: 'VOCABULARY' | 'GRAMMAR' | 'CULTURE' | 'TRADITION' | 'LITERATURE';
  orderIndex: number;
  durationMinutes: number;
  sections: SeedSection[];
}

export interface SeedTrack {
  slug: string;
  title: string;
  titleMg: string;
  description: string;
  descriptionMg: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  color: string;
  orderIndex: number;
  estimatedMinutes: number;
  lessons: SeedLesson[];
}

export const SEED_LEARNING_TRACKS: SeedTrack[] = [
  {
    slug: 'fondamentaux-langue-malgache',
    title: 'Fondamentaux de la langue malgache',
    titleMg: 'Fianarana Teny Gasy Fototra',
    description:
      'Apprenez les salutations rituelles, formules de politesse et expressions indispensables du quotidien.',
    descriptionMg:
      "Ianaro ireo fiarahabana, fomba fiteny amin'ny fanajana ary ny teny fampiasa andavanandro.",
    level: 'BEGINNER',
    icon: 'GraduationCap',
    color: '#4A6741',
    orderIndex: 1,
    estimatedMinutes: 50,
    lessons: [
      {
        slug: 'salutations-et-politesse-aza-fady',
        title: 'Salutations et politesse sacrée (Manao ahoana & Azafady)',
        titleMg: 'Fiarahabana sy Fanajana (Manao ahoana & Azafady)',
        summary:
          "Découvrez comment saluer et s'adresser avec respect selon l'étiquette malgache ancestrale.",
        summaryMg:
          'Fantaro ny fomba fiarahabana sy ny fanehoana haja am-pitiavana araka ny fomban-drazana.',
        type: 'VOCABULARY',
        orderIndex: 1,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, saluer quelqu'un n'est pas un simple automatisme, c'est un échange mutuel de vœux de santé, de paix et de protection (Hasina sy Fiadanana).",
            textMg:
              "Eo amin'ny kolontsaina malagasy, ny fiarahabana dia tsy teny mandalo fotsiny fa fifampizarana firariana soa, fahasalamana sy fiadanana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'O',
            phonetic: 'ou',
            frenchEquivalent:
              'Se prononce toujours « ou » comme dans « genou », jamais « o » ouvert.',
            sampleWordMg: 'Soa',
            sampleTranslationFr: 'Bien, bon, paisible',
          },
          {
            type: 'phonetic',
            letterOrSound: 'AO',
            phonetic: 'ow',
            frenchEquivalent:
              'Diphtongue prononcée comme « a-ou » très lié, semblable au « ow » anglais dans « cow ».',
            sampleWordMg: 'Ahoana',
            sampleTranslationFr: 'Comment',
          },
          {
            type: 'phonetic',
            letterOrSound: 'J',
            phonetic: 'dz',
            frenchEquivalent:
              'Se prononce « dz » comme les lettres « ds » dans « pizza » ou « ts » sonore.',
            sampleWordMg: 'Azafady',
            sampleTranslationFr: "S'il vous plaît",
          },
          {
            type: 'concept',
            termMg: 'Manao ahoana',
            phonetic: 'ma-now a-how-na',
            meaningFr: 'Comment allez-vous ? / Bonjour',
            explanation:
              'La formule universelle pour prendre des nouvelles et saluer toute personne avec respect.',
          },
          {
            type: 'concept',
            termMg: 'Salama',
            phonetic: 'sa-la-ma',
            meaningFr:
              'Bonjour / Portez-vous bien (littéralement : En bonne santé)',
            explanation:
              'Salutation chaleureuse utilisée à tout moment de la journée, dérivée du souhait de plénitude corporelle et spirituelle.',
          },
          {
            type: 'concept',
            termMg: 'Azafady',
            phonetic: 'a-za-fa-di',
            meaningFr: "S'il vous plaît / Pardon / Excusez-moi",
            explanation:
              "Expression fondamentale d'humilité. Elle permet de demander la parole ou de solliciter l'aide d'autrui sans offenser.",
          },
          {
            type: 'example',
            textMg:
              'Manao ahoana tompoko, azafady aiza ny lalana mankany an-tsena ?',
            textFr:
              'Bonjour Madame/Monsieur, excusez-moi, où se trouve le chemin qui mène au marché ?',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le mot « Azafady » provient étymologiquement de « Aza fady », qui signifie mot à mot « Que cela ne soit pas un tabou / Que je ne transgresse rien ». C'est une précaution sacrée pour préserver l'harmonie des relations.",
            textMg:
              "Ny teny hoe « Azafady » dia niainga tamin'ny hoe « aza fady », izany hoe « aza mba manota fady aho ». Fanehoana fahamaotinana sy fitandremana ny fihavanana izany.",
          },
          // ─── 3 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Que signifie littéralement l'expression de politesse « Azafady » ?",
            questionMg:
              "Inona no dikan'ny teny hoe « Azafady » tany am-boalohany ?",
            choices: [
              "Que cela ne soit pas tabou / Qu'il n'y ait point de faute",
              'Donnez-moi la réponse immédiatement',
              'Bonjour et bonne journée',
              'Au revoir et à demain',
            ],
            correctIndex: 0,
            explanation:
              '« Aza » (ne... pas) + « fady » (tabou/interdit) : on conjure tout malaise rituel avant de formuler sa demande.',
          },
          {
            type: 'quiz',
            question:
              'Comment se prononce la lettre « O » en langue malgache ?',
            questionMg:
              "Ahoana no fanononana ny litera « O » amin'ny teny malagasy ?",
            choices: [
              'Toujours comme « OU » (ex: Soa = Soua)',
              'Comme un « O » ouvert français (ex: comme dans pomme)',
              'Elle ne se prononce pas',
              'Comme un « ON » nasal',
            ],
            correctIndex: 0,
            explanation:
              "En malgache, la lettre 'O' se prononce invariablement 'OU'. Pour écrire le son 'O' ouvert, on utilise 'AO'.",
          },
          {
            type: 'quiz',
            question:
              "Quelle salutation souhaite littéralement « d'être en bonne santé et en paix » ?",
            questionMg:
              "Inona no fiarahabana mirary fahasalamana sy fiadanana ho an'ny hafa ?",
            choices: ['Salama', 'Azafady', 'Veloma', 'Tsia'],
            correctIndex: 0,
            explanation:
              "« Salama » provient de la racine exprimant la santé, l'intégrité et la paix intérieure.",
          },
          {
            type: 'quiz',
            question: 'Comment se prononce la diphtongue « AO » en malgache ?',
            questionMg:
              "Ahoana no fanononana ny litera mitambatra « AO » amin'ny teny malagasy ?",
            choices: [
              'Comme « ow » très lié (ex: Ahoana = Ahowana)',
              'Comme un « A » long sans diphtongue',
              'Comme un « O » ouvert français',
              'Comme un « EU » fermé',
            ],
            correctIndex: 0,
            explanation:
              "La combinaison 'AO' forme une diphtongue liée qui sonne comme 'a-ou' ou 'ow' dans 'cow'.",
          },
          {
            type: 'quiz',
            question: 'Que signifie la formule de politesse « Manao ahoana » ?',
            questionMg:
              'Inona no hevitry ny fiarahabana hoe « Manao ahoana » ?',
            choices: [
              'Comment allez-vous ? / Bonjour',
              'Au revoir et bon retour',
              'Merci beaucoup pour votre aide',
              'Pardonnez-moi pour mon retard',
            ],
            correctIndex: 0,
            explanation:
              "« Manao ahoana » est la formule classique et courtoise pour s'enquérir de l'état d'autrui et saluer respectueusement.",
          },
        ],
      },
      {
        slug: 'gratitude-et-remerciements-misaotra',
        title: "L'art de remercier et d'accueillir (Misaotra & Tonga soa)",
        titleMg: 'Fisaorana sy Fandraisana (Misaotra & Tonga soa)',
        summary:
          "Maîtrisez les manières nobles de remercier chaleureusement et d'accueillir un invité.",
        summaryMg:
          "Ianaro ny fomba fisaorana avy amin'ny fo sy ny fandraisam-bahiny mendrika ny fihavanana.",
        type: 'VOCABULARY',
        orderIndex: 2,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "L'hospitalité malgache est réputée pour sa générosité. Savoir remercier sincèrement fait partie intégrante du savoir-vivre.",
            textMg:
              "Malaza amin'ny fandraisam-bahiny sy ny fo madio ny Malagasy. Zava-dehibe ny fahaizana maneho fankasitrahana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'TR',
            phonetic: 'tsr',
            frenchEquivalent:
              'Son composé entre le « T » et le « R » roulé, sonnant légèrement comme « tsr » dynamique.',
            sampleWordMg: 'Misaotra',
            sampleTranslationFr: 'Merci',
          },
          {
            type: 'concept',
            termMg: 'Misaotra betsaka',
            phonetic: 'mi-sow-tsa be-tsa-ka',
            meaningFr: 'Merci beaucoup',
            explanation:
              "Permet d'exprimer une vive reconnaissance après un service ou une bienveillance.",
          },
          {
            type: 'concept',
            termMg: 'Tonga soa',
            phonetic: 'toung-ga sou',
            meaningFr: 'Bienvenue (littéralement : Arrivé en bonne santé/paix)',
            explanation:
              "La formule d'accueil traditionnelle adressée à quiconque franchit le seuil de la maison.",
          },
          {
            type: 'concept',
            termMg: 'Tsy maninona',
            phonetic: 'tsi ma-ni-noun',
            meaningFr: "De rien / Ce n'est rien / Il n'y a pas de problème",
            explanation:
              "Réponse bienveillante à un remerciement ou à une excuse, rassurant immédiatement l'interlocuteur.",
          },
          {
            type: 'example',
            textMg:
              'Tonga soa eto an-tanàna ianareo ! — Misaotra betsaka tompoko !',
            textFr:
              'Soyez les bienvenus au village ! — Merci infiniment à vous !',
          },
          // ─── 3 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              'Comment répond-on chaleureusement à un « Misaotra » (Merci) ?',
            questionMg:
              'Ahoana no avaly am-pahamendrehana rehefa misy misaotra anao ?',
            choices: [
              "Tsy maninona tompoko (De rien / Il n'y a pas de quoi)",
              'Veloma (Au revoir)',
              'Manao ahoana (Bonjour)',
              'Azafady (Excusez-moi)',
            ],
            correctIndex: 0,
            explanation:
              "« Tsy maninona » signifie « ce n'est rien » ou « il n'y a aucun mal », c'est l'équivalent de « de rien ».",
          },
          {
            type: 'quiz',
            question:
              "Que signifie la formule d'accueil chaleureuse « Tonga soa » ?",
            questionMg:
              'Inona no hevitry ny teny fiarahabana manao hoe « Tonga soa » ?',
            choices: [
              'Soyez les bienvenus (Bien arrivés)',
              'Bonne nuit et faites de beaux rêves',
              'Bon voyage pour le retour',
              'À table pour le repas',
            ],
            correctIndex: 0,
            explanation:
              "« Tonga » (arrivé) + « soa » (bien/paisiblement). C'est le souhait de bienvenue réservé aux invités.",
          },
          {
            type: 'quiz',
            question:
              'Quel terme renforce le remerciement pour signifier « Merci beaucoup » ?',
            questionMg:
              "Inona no teny ampiana aorian'ny « Misaotra » mba hilazana fankasitrahana lehibe ?",
            choices: [
              'Betsaka (Misaotra betsaka)',
              'Kely (Misaotra kely)',
              'Azafady',
              'Tsara',
            ],
            correctIndex: 0,
            explanation:
              '« Betsaka » signifie « beaucoup/grandement ». « Misaotra betsaka » traduit une gratitude appuyée.',
          },
          {
            type: 'quiz',
            question:
              'Comment se prononce le groupe consonantique « TR » en malgache (ex: Misaotra) ?',
            questionMg:
              "Ahoana no fanononana ny renifeo mitambatra « TR » amin'ny teny malagasy ?",
            choices: [
              "Un son dynamique proche de « tsr » avec un 'r' roulé",
              'Exactement comme le « tr » français',
              'Comme un simple « T » sans vibration',
              'Comme un son muet non prononcé',
            ],
            correctIndex: 0,
            explanation:
              "En malgache, le 'TR' s'articule avec vivacité, combinant une occlusion dentale et une vibration roulée ('tsr').",
          },
          {
            type: 'quiz',
            question:
              "Quelle formule bienveillante signifie « De rien / Il n'y a pas de problème » ?",
            questionMg:
              'Inona no teny ilazana am-pitiavana fa « tsy misy olana » izany rehefa misy misaotra ?',
            choices: ['Tsy maninona', 'Azafady', 'Manao ahoana', 'Veloma'],
            correctIndex: 0,
            explanation:
              "« Tsy maninona » rassure autrui en confirmant qu'il n'y a aucune gêne ni préjudice.",
          },
        ],
      },
      {
        slug: 'respect-des-aines-et-famille',
        title: 'Le respect des aînés et de la famille (Haja & Ray aman-dreny)',
        titleMg:
          'Fanajana ny Zokiolona sy ny Fianakaviana (Haja & Ray aman-dreny)',
        summary:
          "Comprendre les titres de parenté et l'importance primordiale du respect envers les aînés.",
        summaryMg:
          "Fahatakarana ny firafitry ny fianakaviana sy ny lanjan'ny haja omena ny zokiolona.",
        type: 'CULTURE',
        orderIndex: 3,
        durationMinutes: 6,
        sections: [
          {
            type: 'intro',
            textFr:
              'Dans la tradition malgache, les aînés et les parents sont considérés comme des guides porteurs de bénédiction (*tsodrano*).',
            textMg:
              "Amin'ny fomban-drazana, ny zoky sy ny ray aman-dreny dia loharanon'ny tsodrano sy mpitarika eo amin'ny fiainana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'DR',
            phonetic: 'dzr',
            frenchEquivalent:
              'Son prononcé avec la langue légèrement reculée sur le palais, ressemblant à « dzr » doux.',
            sampleWordMg: 'Ray aman-dreny',
            sampleTranslationFr: 'Les parents',
          },
          {
            type: 'concept',
            termMg: 'Ray aman-dreny',
            phonetic: 'rye a-man-dren-i',
            meaningFr: 'Les parents (littéralement : Père et mère)',
            explanation:
              "Désigne les géniteurs mais s'étend aussi par respect aux personnes d'âge mûr de la communauté.",
          },
          {
            type: 'concept',
            termMg: 'Zoky / Zandry',
            phonetic: 'zou-ki / zan-dri',
            meaningFr: 'Aîné(e) / Cadet(te)',
            explanation:
              "Distingue les générations et les degrés de fraternité. L'aîné veille sur le cadet, et le cadet lui doit respect et déférence.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Demander le *tsodrano* (bénédiction prononcée par les parents en soufflant de l'eau sur le front ou les mains) est un acte hautement solennel avant tout voyage, examen ou entreprise majeure.",
            textMg:
              "Ny fangatahana tsodrano amin'ny ray aman-dreny dia fanoloran-tena masina mialoha ny dia lavitra na asa lehibe.",
          },
          // ─── 3 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question: 'Dans une fratrie malgache, qui est le « Zoky » ?',
            questionMg: "Ao amin'ny fianakaviana, iza no atao hoe « Zoky » ?",
            choices: [
              "L'aîné(e)",
              'Le cadet / plus jeune',
              'Le cousin éloigné',
              'Le grand-parent',
            ],
            correctIndex: 0,
            explanation:
              "« Zoky » désigne l'aîné(e), tandis que « Zandry » désigne le plus jeune ou cadet.",
          },
          {
            type: 'quiz',
            question:
              "Que désigne au sens noble et élargi l'expression « Ray aman-dreny » ?",
            questionMg:
              "Iza avy no tafiditra amin'ny teny fanajana hoe « Ray aman-dreny » ?",
            choices: [
              'Les parents géniteurs et les aînés respectés de la communauté',
              'Uniquement les enfants en bas âge',
              'Les voisins du même âge',
              'Les étrangers de passage',
            ],
            correctIndex: 0,
            explanation:
              "L'expression s'étend au-delà des parents biologiques à tous les aînés investis d'une autorité morale et protectrice.",
          },
          {
            type: 'quiz',
            question:
              'Quel est le rituel traditionnel sacré par lequel les parents transmettent leur bénédiction ?',
            questionMg:
              "Inona no fomba nentin-drazana anehoan'ny ray aman-dreny firariana soa sy fahasoavana ho an'ny zanaka ?",
            choices: ['Ny Tsodrano', 'Ny Kabary', 'Ny Fady', 'Ny Valin-tanana'],
            correctIndex: 0,
            explanation:
              'Le « Tsodrano » est la bénédiction sacrée prodiguée par les parents pour porter chance et protection.',
          },
          {
            type: 'quiz',
            question:
              'Quel terme désigne le ou la cadette dans la famille malgache ?',
            questionMg:
              "Inona no fiantsoana ny zandrilahy na zandrivavy eo amin'ny fianakaviana ?",
            choices: ['Zandry', 'Zoky', 'Razana', 'Havana'],
            correctIndex: 0,
            explanation:
              "« Zandry » désigne le frère ou la sœur plus jeune, en complémentarité avec l'aîné (« Zoky »).",
          },
          {
            type: 'quiz',
            question:
              'Pourquoi la bénédiction des parents (« Tsodrano ») est-elle si précieuse ?',
            questionMg:
              "Nahoana no heverina ho manan-danja lehibe ny « Tsodrano » avy amin'ny ray aman-dreny ?",
            choices: [
              "Elle apporte protection spirituelle, paix et prospérité pour l'avenir",
              "C'est une simple formalité administrative",
              'Elle remplace les études et le travail',
              'Elle sert uniquement lors des séparations',
            ],
            correctIndex: 0,
            explanation:
              'Dans la vision malgache, les paroles bienveillantes des parents et des aînés ouvrent les chemins favorables et protègent du mauvais sort.',
          },
        ],
      },
      {
        slug: 'compter-et-faire-le-marche-tsena',
        title: 'Compter et faire ses courses au marché (Isa & Miantsena)',
        titleMg: 'Ny Isa sy ny Miantsena eny an-Tsena',
        summary:
          'Apprenez à compter de 1 à 10 en malgache et à demander le prix avec courtoisie au marché traditionnel.',
        summaryMg:
          "Ianaro ny fanisana 1 ka hatramin'ny 10 sy ny fomba fiantsenana am-pahaiza-miaina eny an-tsena.",
        type: 'VOCABULARY',
        orderIndex: 4,
        durationMinutes: 6,
        sections: [
          {
            type: 'intro',
            textFr:
              "Le marché traditionnel malgache (*tsena*) est bien plus qu'un lieu de commerce : c'est un carrefour social animé où la politesse et le respect du lien humain facilitent chaque échange.",
            textMg:
              'Ny tsena malagasy dia toerana ifaneraserana sy ifanampiana. Zava-dehibe ny fahaiza-manaja sy ny fifampiresahana am-pitiavana rehefa miantsena.',
          },
          {
            type: 'phonetic',
            letterOrSound: 'F',
            phonetic: 'f',
            frenchEquivalent:
              'Se prononce doucement comme un « F » français, très clair au début des nombres (Fito, Folo).',
            sampleWordMg: 'Folo',
            sampleTranslationFr: 'Dix (10)',
          },
          {
            type: 'phonetic',
            letterOrSound: 'Y',
            phonetic: 'i',
            frenchEquivalent:
              'En fin de mot, le « Y » se prononce comme un « i » bref et discret (ex: Dimy, Sivy).',
            sampleWordMg: 'Dimy',
            sampleTranslationFr: 'Cinq (5)',
          },
          {
            type: 'concept',
            termMg: 'Iray, Roa, Telo, Efatra, Dimy',
            phonetic: 'i-rye, rou, te-lou, e-fa-tsa, di-mi',
            meaningFr: 'Un, Deux, Trois, Quatre, Cinq (1, 2, 3, 4, 5)',
            explanation:
              'Les cinq premiers chiffres indispensables pour dénombrer tout objet du quotidien.',
          },
          {
            type: 'concept',
            termMg: 'Enina, Fito, Valo, Sivy, Folo',
            phonetic: 'e-ni-na, fi-tou, va-lou, si-vi, fou-lou',
            meaningFr: 'Six, Sept, Huit, Neuf, Dix (6, 7, 8, 9, 10)',
            explanation:
              "La suite fondamentale pour compter jusqu'à dix en langue malgache.",
          },
          {
            type: 'concept',
            termMg: 'Ohatrinona ity ?',
            phonetic: 'ow-tsi-nou-na i-ti',
            meaningFr: 'Combien coûte ceci ?',
            explanation:
              "La question universelle et polie pour s'enquérir du prix d'une marchandise au marché.",
          },
          {
            type: 'concept',
            termMg: 'Tsena / Miantsena',
            phonetic: 'tse-na / mi-an-tse-na',
            meaningFr: 'Le marché / Faire ses courses au marché',
            explanation:
              "Désigne l'espace commerçant traditionnel et l'activité de s'approvisionner.",
          },
          {
            type: 'concept',
            termMg: 'Mora / Lafo',
            phonetic: 'mou-ra / la-fou',
            meaningFr: 'Bon marché / Cher',
            explanation:
              "Permet d'apprécier la valeur d'un produit lors de la transaction.",
          },
          {
            type: 'example',
            textMg:
              'Azafady tompoko, ohatrinona ity mananasy ity ? — Arivo ariary tompoko, tena mora !',
            textFr:
              "Pardonnez-moi Madame/Monsieur, combien coûte cet ananas ? — Mille ariary, c'est très bon marché !",
          },
          {
            type: 'didYouKnow',
            textFr:
              "À Madagascar, la monnaie nationale officielle est l'Ariary. Lors des échanges au marché, marchander se fait toujours avec le sourire et des formules de respect telles que « Tompoko ».",
            textMg:
              "Ny Ariary no sandam-bola malagasy. Eo amin'ny tsena, ny fiadiana varotra dia atao am-panajana sy am-pitsikiana hatrany.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              'Comment demande-t-on poliment le prix au marché : « Combien coûte ceci ? »',
            questionMg:
              "Ahoana no anontaniana am-pahaiza-miaina ny vidin'ny zavatra iray : « Ohatrinona ity ? »",
            choices: [
              'Ohatrinona ity tompoko ?',
              'Aiza ny lalana tompoko ?',
              'Manao ahoana tompoko ?',
              'Veloma tompoko ?',
            ],
            correctIndex: 0,
            explanation:
              "« Ohatrinona ity ? » est la formule exacte pour s'enquérir du montant d'un produit.",
          },
          {
            type: 'quiz',
            question: 'Comment dit-on le chiffre « 5 » en langue malgache ?',
            questionMg:
              "Ahoana no filazana ny tarehimarika « 5 » amin'ny teny malagasy ?",
            choices: ['Dimy', 'Telo', 'Folo', 'Efatra'],
            correctIndex: 0,
            explanation: '1 = Iray, 2 = Roa, 3 = Telo, 4 = Efatra, 5 = Dimy.',
          },
          {
            type: 'quiz',
            question:
              'Que signifie le terme « Tsena » dans la vie quotidienne malgache ?',
            questionMg:
              "Inona no hevitry ny teny hoe « Tsena » eo amin'ny fiainana andavanandro ?",
            choices: [
              'Le marché (lieu de vente et de rencontre)',
              'La maison familiale',
              "L'école du village",
              'Le fleuve sacré',
            ],
            correctIndex: 0,
            explanation:
              '« Tsena » désigne le marché traditionnel, et « miantsena » signifie faire ses courses.',
          },
          {
            type: 'quiz',
            question: 'Quel chiffre correspond au terme malgache « Folo » ?',
            questionMg:
              "Inona ny isa mifanitsy amin'ny teny malagasy hoe « Folo » ?",
            choices: ['10', '7', '8', '4'],
            correctIndex: 0,
            explanation: '« Folo » signifie « dix (10) » en malgache.',
          },
          {
            type: 'quiz',
            question:
              "Quel mot malgache signifie qu'un produit est « bon marché » ?",
            questionMg:
              'Inona no teny malagasy milaza fa « mora vidy » ny entana iray ?',
            choices: ['Mora', 'Lafo', 'Betsaka', 'Kely'],
            correctIndex: 0,
            explanation:
              '« Mora » signifie bon marché ou facile, tandis que « lafo » signifie cher.',
          },
        ],
      },
      {
        slug: 'le-temps-et-les-moments-du-jour',
        title: 'Le temps et les moments de la journée (Ny Fotoana sy ny Andro)',
        titleMg: "Ny Fotoana sy ny Fizaran'ny Andro",
        summary:
          'Maîtrisez les moments de la journée pour saluer et vous repérer dans le temps.',
        summaryMg:
          "Ianaro ny fizaran'ny andro mba hahaizana miarahaba araka ny fotoana sy miomana am-pahamendrehana.",
        type: 'VOCABULARY',
        orderIndex: 5,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "Chez les Malgaches, le temps est intimement lié à la nature et au soleil. Adapter sa salutation au moment du jour témoigne d'une attention délicate envers autrui.",
            textMg:
              "Ny fotoana amin'ny Ntaolo dia nifamatotra tamin'ny masoandro sy ny zavaboary. Fanehoana fahamendrehana ny fiarahabana mifanaraka amin'ny fizaran'ny andro.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'H',
            phonetic: 'h',
            frenchEquivalent:
              'Le « H » malgache est toujours légèrement aspiré avec douceur (ex: Hariva), jamais muet comme en français.',
            sampleWordMg: 'Hariva',
            sampleTranslationFr: "Le soir / La fin d'après-midi",
          },
          {
            type: 'concept',
            termMg: 'Maraina',
            phonetic: 'ma-rye-na',
            meaningFr: "Le matin / L'aube",
            explanation:
              'Désigne les premières heures du jour, propices au travail des champs et aux salutations fraîches.',
          },
          {
            type: 'concept',
            termMg: 'Atoandro',
            phonetic: 'a-tou-an-drou',
            meaningFr: 'Le milieu de journée / Midi',
            explanation:
              "L'heure du zénith et du repas de riz chaud partagé en famille.",
          },
          {
            type: 'concept',
            termMg: 'Hariva',
            phonetic: 'ha-ri-va',
            meaningFr: "Le soir / La fin d'après-midi",
            explanation:
              'Le moment où le soleil décline et où le bétail regagne le village.',
          },
          {
            type: 'concept',
            termMg: 'Alina',
            phonetic: 'a-li-na',
            meaningFr: 'La nuit',
            explanation:
              'Le temps du repos sacré et des contes murmurés auprès des aînés.',
          },
          {
            type: 'concept',
            termMg: 'Mandra-pihaona',
            phonetic: 'man-dra-pi-how-na',
            meaningFr:
              "Au revoir / À bientôt (jusqu'à notre prochaine rencontre)",
            explanation:
              "Formule élégante d'au revoir formulant le souhait certain de se revoir en paix.",
          },
          {
            type: 'example',
            textMg:
              "Tsara maraina tompoko ! — Tsara maraina, mandra-pihaona amin'ny hariva !",
            textFr:
              'Bonjour / Bon matin à vous ! — Bon matin, au revoir et à ce soir !',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Autrefois, pour désigner les heures, les Malgaches se référaient à la position de l'ombre dans la maison traditionnelle en bois : « Mitataovovonana » correspondait exactement à midi quand le soleil était au sommet du toit.",
            textMg:
              "Fahiny, ny Ntaolo dia nijery ny aloka ao an-trano hilazana ny ora : ny hoe « Mitataovovonana » dia midika fa eo ambonin'ny tampon-trano indrindra ny masoandro (mitatao vovonana).",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question: 'Quel mot malgache désigne « le matin » ?',
            questionMg: 'Inona no teny malagasy manondro ny « maraina » ?',
            choices: ['Maraina', 'Alina', 'Hariva', 'Atoandro'],
            correctIndex: 0,
            explanation:
              '« Maraina » correspond au matin, tandis que « hariva » est le soir.',
          },
          {
            type: 'quiz',
            question:
              "Que signifie la formule d'au revoir courtoise « Mandra-pihaona » ?",
            questionMg:
              'Inona no hevitry ny teny fanaovam-beloma hoe « Mandra-pihaona » ?',
            choices: [
              'Au revoir / À la prochaine rencontre',
              'Bon appétit pour le repas',
              'Dormez bien cette nuit',
              'Bienvenue chez nous',
            ],
            correctIndex: 0,
            explanation:
              "« Mandra-pihaona » signifie littéralement « jusqu'à ce que nous nous rencontrions de nouveau ».",
          },
          {
            type: 'quiz',
            question:
              'Comment se prononce la lettre « H » en langue malgache (ex: Hariva) ?',
            questionMg:
              "Ahoana no fanononana ny litera « H » amin'ny teny malagasy ?",
            choices: [
              'Légèrement aspirée avec souffle',
              'Elle est totalement muette comme en français',
              'Comme un « R » roulé',
              'Comme un sifflement',
            ],
            correctIndex: 0,
            explanation:
              "En malgache, le 'H' n'est jamais muet : il s'articule comme une légère aspiration douce.",
          },
          {
            type: 'quiz',
            question:
              'Quel moment de la journée correspond au terme « Alina » ?',
            questionMg:
              "Inona no fotoana amin'ny andro mifanitsy amin'ny teny hoe « Alina » ?",
            choices: [
              'La nuit',
              'Le midi ensoleillé',
              "L'aube naissante",
              "Le goûter de l'après-midi",
            ],
            correctIndex: 0,
            explanation:
              "« Alina » désigne la nuit, le temps de l'obscurité et du repos.",
          },
          {
            type: 'quiz',
            question:
              "Que signifie traditionnellement l'expression d'heure « Mitataovovonana » ?",
            questionMg:
              'Inona no hevitry ny fomba fiteny nentin-drazana hoe « Mitataovovonana » ?',
            choices: [
              'Midi (le soleil est au zénith au-dessus du toit)',
              'Le coucher du soleil',
              "Le chant du premier coq à l'aube",
              'Le milieu de la nuit noire',
            ],
            correctIndex: 0,
            explanation:
              '« Mitataovovonana » signifie que le soleil surplombe exactement le faîte (vovonana) de la maison traditionnelle, soit midi pile.',
          },
        ],
      },
      {
        slug: 'la-structure-de-la-phrase-et-pronoms',
        title: 'La structure de la phrase et les pronoms (Ny Firafitry ny Fehezanteny)',
        titleMg: 'Ny Firafitry ny Fehezanteny sy ny Mpisolo Tena',
        summary: "Découvrez l'ordre unique Verbe-Objet-Sujet et les pronoms personnels malgaches.",
        summaryMg: 'Fantaro ny fomba fandrafetana fehezanteny (Matoanteny-Fameno-Lazaina) sy ireo mpisolo tena.',
        type: 'GRAMMAR',
        orderIndex: 6,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "La langue malgache possède une architecture de phrase très originale : contrairement au français qui utilise l'ordre Sujet-Verbe-Objet (SVO), le malgache standard place naturellement le Verbe en premier, suivi du complément, puis du Sujet (VOS) : « Mihinana vary aho » (Mange du riz je = Je mange du riz).",
            textMg:
              "Ny firafitry ny fehezanteny tsotra amin'ny teny malagasy dia manomboka amin'ny Matoanteny, arahin'ny Fameno, ary mifarana amin'ny Lazaina (VOS) : ohatra « Mihinana vary aho ».",
          },
          {
            type: 'phonetic',
            letterOrSound: 'Y',
            phonetic: 'i',
            frenchEquivalent:
              'En fin de mot, le « Y » se prononce comme un « i » très bref et léger, presque murmuré (ex: Vary, Faly).',
            sampleWordMg: 'Vary',
            sampleTranslationFr: 'Le riz',
          },
          {
            type: 'concept',
            termMg: 'Aho / Izaho',
            phonetic: 'a-hou / i-za-hou',
            meaningFr: 'Je / Moi',
            explanation:
              "« Aho » s'utilise après le verbe (en fin de phrase), tandis que « Izaho » s'emploie en tête pour insister sur la personne.",
          },
          {
            type: 'concept',
            termMg: 'Ianao',
            phonetic: 'i-a-now',
            meaningFr: 'Tu / Toi (au singulier)',
            explanation:
              'Pronom personnel singulier pour s’adresser à un proche, un ami ou un pair.',
          },
          {
            type: 'concept',
            termMg: 'Izy',
            phonetic: 'i-zi',
            meaningFr: 'Il / Elle (3e personne du singulier)',
            explanation:
              'La langue malgache ne fait aucune distinction de genre grammatical : « Izy » s’applique aussi bien au masculin qu’au féminin.',
          },
          {
            type: 'concept',
            termMg: 'Isika',
            phonetic: 'i-si-ka',
            meaningFr: 'Nous (inclusif : toi, moi et nous tous)',
            explanation:
              'Pronom de solidarité totale qui englobe obligatoirement la personne à qui l’on parle (le cœur du Fihavanana).',
          },
          {
            type: 'concept',
            termMg: 'Izahay',
            phonetic: 'i-za-hye',
            meaningFr: 'Nous (exclusif : nous, mais sans toi)',
            explanation:
              'Désigne notre groupe en excluant poliment l’interlocuteur (ex: notre famille, notre village).',
          },
          {
            type: 'concept',
            termMg: 'Ianareo',
            phonetic: 'i-a-na-re-ou',
            meaningFr: 'Vous (pluriel)',
            explanation:
              'S’adresse à plusieurs personnes réunies.',
          },
          {
            type: 'concept',
            termMg: 'Izy ireo',
            phonetic: 'i-zi i-re-ou',
            meaningFr: 'Ils / Elles (pluriel)',
            explanation:
              'Pluriel neutre désignant un groupe de personnes tierces.',
          },
          {
            type: 'example',
            textMg: 'Mianatra teny gasy isika anio.',
            textFr: 'Nous apprenons tous ensemble le malgache aujourd’hui (inclusif).',
          },
          {
            type: 'example',
            textMg: 'Mandeha miasa izy ireo maraina.',
            textFr: 'Ils partent travailler le matin.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "La distinction entre « Isika » (inclusif) et « Izahay » (exclusif) évite tout malentendu dans les prises de décision communautaires malgaches. Elle garantit que personne ne se sente indûment engagé ou involontairement exclu.",
            textMg:
              "Ny fahasamihafan'ny « Isika » (mpandahateny sy mpihaino miaraka) sy « Izahay » (mpandahateny tsy manisy ny mpihaino) dia mampiseho ny fahaiza-miaina sy ny fanajana ny hafa eo amin'ny fiarahamonina malagasy.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Quel est l'ordre habituel des mots dans une phrase simple en malgache ?",
            questionMg: "Ahoana ny lamin'ny teny ao amin'ny fehezanteny tsotra amin'ny teny malagasy ?",
            choices: [
              'Verbe - Complément - Sujet (VOS)',
              'Sujet - Verbe - Complément (SVO)',
              'Complément - Sujet - Verbe (OSV)',
              'Sujet - Complément - Verbe (SOV)',
            ],
            correctIndex: 0,
            explanation:
              "En malgache standard, la phrase simple s'organise naturellement sous la structure Verbe - Complément/Objet - Sujet (ex: « Mihinana vary aho »).",
          },
          {
            type: 'quiz',
            question: "Quelle est la différence fondamentale entre « Isika » et « Izahay » ?",
            questionMg: "Inona no tena mampiavaka ny « Isika » sy ny « Izahay » ?",
            choices: [
              '« Isika » inclut l’interlocuteur, « Izahay » l’exclut poliment',
              '« Isika » est réservé aux aînés, « Izahay » aux enfants',
              '« Isika » est du singulier, « Izahay » est du pluriel',
              '« Isika » est du passé, « Izahay » est du futur',
            ],
            correctIndex: 0,
            explanation:
              "« Isika » est un nous inclusif (nous tous, toi compris), tandis que « Izahay » est exclusif (nous, à l'exclusion de la personne à qui l'on s'adresse).",
          },
          {
            type: 'quiz',
            question: "Quel pronom personnel correspond à « Il » ou « Elle » au singulier ?",
            questionMg: "Inona no mpisolo tena milaza ny lahy na vavy tokana (3e personne) ?",
            choices: ['Izy', 'Aho', 'Ianao', 'Ianareo'],
            correctIndex: 0,
            explanation:
              "En malgache, il n'y a pas de genre grammatical : « Izy » signifie indifféremment « il » ou « elle ».",
          },
          {
            type: 'quiz',
            question: "Comment se prononce la lettre « Y » à la fin d'un mot malgache (ex: Vary, Faly) ?",
            questionMg: "Ahoana no fanononana ny litera « Y » amin'ny faran'ny teny malagasy ?",
            choices: [
              'Comme un « i » court et doux',
              'Comme un « u » français',
              'Comme un « o » ouvert',
              'Elle n’est jamais prononcée',
            ],
            correctIndex: 0,
            explanation:
              "Le « Y » final malgache équivaut au son « i », articulé avec brièveté et douceur.",
          },
          {
            type: 'quiz',
            question: "Dans la phrase « Mianatra teny gasy aho », quel mot représente le sujet ?",
            questionMg: "Ao amin'ny fehezanteny « Mianatra teny gasy aho », iza no lazaina ?",
            choices: ['Aho (Je/Moi)', 'Mianatra (Apprendre)', 'Teny (Langue)', 'Gasy (Malgache)'],
            correctIndex: 0,
            explanation:
              "« Aho » (je) est le sujet (lazaina) placé en fin de phrase, après l'action (mianatra) et le complément (teny gasy).",
          },
        ],
      },
      {
        slug: 'poser-des-questions-et-s-orienter',
        title: "Poser des questions et s'orienter dans l'espace (Fanontaniana sy Toerana)",
        titleMg: 'Fametrahana Fanontaniana sy Fanamarihan-toerana',
        summary: "Apprenez à interroger votre interlocuteur et à vous repérer selon les points cardinaux sacrés.",
        summaryMg: "Ianaro ny fomba fanontanian-javatra sy ny fanondroana toerana araka ny vazan-tany.",
        type: 'VOCABULARY',
        orderIndex: 7,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "Savoir poser des questions simples ouvre les portes de l'échange chaleureux avec les Malgaches. De plus, l'orientation traditionnelle dans la Grande Île repose sur les quatre points cardinaux (vazan-tany), omniprésents dans la vie quotidienne.",
            textMg:
              "Ny fahaizana mametraka fanontaniana tsotra dia manamora ny fifampiresahana am-pitiavana. Eo an-daniny, ny Malagasy dia mampiasa matetika ireo vazan-tany efatra amin'ny fiainana andavanandro.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'TR',
            phonetic: 'tsh-r',
            frenchEquivalent:
              'La combinaison « TR » (ex: Avaratra) s’articule comme une consonne affriquée dynamique, proche du son « tch-r » énergique.',
            sampleWordMg: 'Avaratra',
            sampleTranslationFr: 'Le Nord',
          },
          {
            type: 'concept',
            termMg: 'Inona ?',
            phonetic: 'i-nou-na',
            meaningFr: 'Quoi ? / Qu’est-ce que ?',
            explanation:
              'Mot interrogatif pour identifier un objet, une idée ou un événement (ex: Inona ny vaovao ? = Quelles sont les nouvelles ?).',
          },
          {
            type: 'concept',
            termMg: 'Iza ?',
            phonetic: 'i-za',
            meaningFr: 'Qui ?',
            explanation:
              'Sert à demander l’identité d’une personne (ex: Iza ianao ? = Qui es-tu ? / Iza izany ? = Qui est-ce ?).',
          },
          {
            type: 'concept',
            termMg: 'Aiza ?',
            phonetic: 'eye-za',
            meaningFr: 'Où ?',
            explanation:
              'Permet de demander un lieu ou une localisation (ex: Aiza ny trano ? = Où est la maison ?).',
          },
          {
            type: 'concept',
            termMg: 'Avaratra sy Atsimo',
            phonetic: 'a-va-ra-tra si a-tsi-mou',
            meaningFr: 'Nord et Sud',
            explanation:
              'L’axe Nord-Sud est primordial : le Nord (Avaratra) est traditionnellement la place d’honneur des anciens dans la maison.',
          },
          {
            type: 'concept',
            termMg: 'Atsinanana sy Andrefana',
            phonetic: 'a-tsi-na-na-na si an-dre-fa-na',
            meaningFr: 'Est et Ouest',
            explanation:
              'L’Est (Atsinanana) symbolise la vie et le lever du soleil ; l’Ouest (Andrefana) accueille traditionnellement la porte de la maison.',
          },
          {
            type: 'concept',
            termMg: 'Eto / Any',
            phonetic: 'e-tou / a-ni',
            meaningFr: 'Ici / Là-bas',
            explanation:
              '« Eto » indique la proximité immédiate de qui parle, tandis que « Any » renvoie à un lieu plus lointain.',
          },
          {
            type: 'example',
            textMg: 'Azafady tompoko, aiza ny lalana mankany an-tsena ?',
            textFr: 'Pardon monsieur/madame, où se trouve le chemin qui mène au marché ?',
          },
          {
            type: 'example',
            textMg: 'Inona ny vaovao any aminareo ? — Tsara ny vaovao, misaotra tompoko.',
            textFr: 'Quelles sont les nouvelles chez vous ? — Les nouvelles sont bonnes, merci beaucoup.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Dans l'habitat traditionnel malgache, le lit des parents se trouve toujours au Nord-Est (Alahamady), le coin le plus sacré de la demeure. La porte d'entrée s'ouvre toujours vers l'Ouest (Andrefana) pour capter la lumière du soleil couchant.",
            textMg:
              "Ao amin'ny trano nentin-drazana malagasy, ny zoron-trano Avaratra-Atsinanana (Alahamady) no masina indrindra, toerana misy ny farafaran'ny ray aman-dreny. Ny varavarana kosa dia mitodika miankandrefana foana.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Quel mot malgache signifie « Où ? » pour demander un lieu ?",
            questionMg: "Inona no teny fanontaniana manontany toerana ?",
            choices: ['Aiza ?', 'Inona ?', 'Iza ?', 'Rahoviana ?'],
            correctIndex: 0,
            explanation:
              "« Aiza ? » est le mot interrogatif pour demander « Où ? » (ex: Aiza ny lalana ? = Où est le chemin ?).",
          },
          {
            type: 'quiz',
            question: "Quel mot signifie « Quoi ? » ou « Qu'est-ce que ? » (ex: Inona ny vaovao ?)",
            questionMg: "Inona no teny manontany ny anton-javatra hoe « Quoi / Qu'est-ce que » ?",
            choices: ['Inona ?', 'Iza ?', 'Aiza ?', 'Ahoana ?'],
            correctIndex: 0,
            explanation:
              "« Inona ? » signifie « quoi » ou « qu'est-ce que ».",
          },
          {
            type: 'quiz',
            question: "Dans l'orientation traditionnelle malgache, quel point cardinal désigne « Avaratra » ?",
            questionMg: "Amin'ny vazan-tany, inona no tondroin'ny teny hoe « Avaratra » ?",
            choices: ['Le Nord', 'Le Sud', 'L’Est', 'L’Ouest'],
            correctIndex: 0,
            explanation:
              "« Avaratra » désigne le Nord, place sacrée et noble des aînés.",
          },
          {
            type: 'quiz',
            question: "Quel terme correspond à « L'Est » (le lever du soleil) ?",
            questionMg: "Inona no vazan-tany ipoiran'ny masoandro ?",
            choices: ['Atsinanana', 'Andrefana', 'Atsimo', 'Avaratra'],
            correctIndex: 0,
            explanation:
              "« Atsinanana » désigne l'Est, direction du soleil levant et de la vitalité.",
          },
          {
            type: 'quiz',
            question: "Comment demande-t-on poliment « Qui êtes-vous ? » en malgache ?",
            questionMg: "Ahoana no fomba fanontaniana am-panajana hoe « Qui êtes-vous ? » ?",
            choices: [
              'Iza ianao tompoko ?',
              'Aiza ianao tompoko ?',
              'Inona ianao tompoko ?',
              'Rahoviana ianao tompoko ?',
            ],
            correctIndex: 0,
            explanation:
              "« Iza ianao tompoko ? » utilise « Iza » (qui) et « tompoko » pour une formule respectueuse.",
          },
        ],
      },
      {
        slug: 'les-verbes-du-quotidien-et-les-trois-temps',
        title: 'Les verbes indispensables et les 3 temps (Matoanteny sy ny Fotoana)',
        titleMg: 'Ireo Matoanteny Fampiasa sy ny Fotoana Telo',
        summary: 'Comprenez le mécanisme simple des temps (Passé, Présent, Futur) grâce aux préfixes N-, M-, H-.',
        summaryMg: "Fantaro ny zava-miafina amin'ny fanovana fotoana (Lasa, Ankehitriny, Ho avy) amin'ny litera N, M, H.",
        type: 'GRAMMAR',
        orderIndex: 8,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "En malgache, la conjugaison est d'une remarquable simplicité : les verbes ne changent pas selon la personne (je, tu, il, nous restent identiques). Pour passer du présent au passé ou au futur, il suffit de changer la consonne initiale du verbe !",
            textMg:
              "Tena tsotra ny manova fotoana amin'ny matoanteny malagasy : tsy miova araka ny mpisolo tena ny teny. Matetika dia ny litera voalohany fotsiny no miova mba hilazana ny lasa, ankehitriny na ho avy.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'NG',
            phonetic: 'ng',
            frenchEquivalent:
              'Le digraphe « NG » se prononce comme une consonne nasale continue, semblable au son « ng » de l’anglais « sing » (ex: Manga, Mangatsiaka).',
            sampleWordMg: 'Manga',
            sampleTranslationFr: 'Bleu / La mangue / Éminent',
          },
          {
            type: 'concept',
            termMg: 'M- / N- / H-',
            phonetic: 'm / n / h',
            meaningFr: 'La clé magique des 3 temps',
            explanation:
              "• M = Présent (Ankehitriny)\n• N = Passé (Lasa)\n• H = Futur (Ho avy).\nExemple : Mandeha (part) → Nandeha (est parti) → Handeha (partira).",
          },
          {
            type: 'concept',
            termMg: 'Mandeha',
            phonetic: 'man-de-ha',
            meaningFr: 'Marcher / Aller / Partir',
            explanation:
              'Verbe de mouvement essentiel : Nandeha (passé), Mandeha (présent), Handeha (futur).',
          },
          {
            type: 'concept',
            termMg: 'Mihinana',
            phonetic: 'mi-hi-na-na',
            meaningFr: 'Manger',
            explanation:
              'Verbe fondamental de la nourriture : Nihinana (a mangé), Mihinana (mange), Hihinana (mangera).',
          },
          {
            type: 'concept',
            termMg: 'Misotro',
            phonetic: 'mi-sou-trou',
            meaningFr: 'Boire',
            explanation:
              'Consommer une boisson : Misotro rano (boire de l’eau), Misotro dite (boire du thé).',
          },
          {
            type: 'concept',
            termMg: 'Miteny',
            phonetic: 'mi-te-ni',
            meaningFr: 'Parler / Dire',
            explanation:
              'S’exprimer par la parole : Miteny gasy aho (Je parle malgache).',
          },
          {
            type: 'concept',
            termMg: 'Mahita',
            phonetic: 'ma-hi-ta',
            meaningFr: 'Voir / Trouver / Découvrir',
            explanation:
              'Percevoir avec les yeux ou trouver une solution : Nahita (a vu/trouvé), Mahita (voit), Hahita (verra).',
          },
          {
            type: 'example',
            textMg: 'Handeha any Toamasina aho rahampitso.',
            textFr: 'J’irai à Toamasina demain (futur avec le préfixe H-).',
          },
          {
            type: 'example',
            textMg: 'Nihinana vary matsiro izahay omaly hariva.',
            textFr: 'Nous avons mangé un riz délicieux hier soir (passé avec le préfixe N-).',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Puisque le verbe ne change pas avec la personne, la phrase « Miteny gasy izy » signifie « Il/Elle parle malgache » et « Miteny gasy isika » signifie « Nous parlons malgache ». Seul le pronom final indique qui agit !",
            textMg:
              "Tsy misy fahasamihafana amin'ny matoanteny ny olona tokana sy ny maro : « Miteny izy » sy « Miteny izahay » dia mitovy tanteraka ny matoanteny hoe « miteny ».",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Quelle consonne préfixée indique généralement le temps Passé (Lasa) en malgache ?",
            questionMg: "Inona no litera fiandohana manondro ny fotoana Lasa matetika ?",
            choices: ['La lettre N (ex: Nandeha)', 'La lettre M (ex: Mandeha)', 'La lettre H (ex: Handeha)', 'La lettre V'],
            correctIndex: 0,
            explanation:
              "La lettre « N » marque le temps passé : Mandeha (présent) devient Nandeha (passé).",
          },
          {
            type: 'quiz',
            question: "Quelle consonne préfixée annonce une action au Futur (Ho avy) ?",
            questionMg: "Inona no litera fiandohana manondro ny fotoana Ho avy ?",
            choices: ['La lettre H (ex: Handeha)', 'La lettre N (ex: Nandeha)', 'La lettre M (ex: Mandeha)', 'La lettre T'],
            correctIndex: 0,
            explanation:
              "La lettre « H » est la marque universelle du futur : Mihinana → Hihinana (mangera).",
          },
          {
            type: 'quiz',
            question: "Que signifie la phrase « Miteny gasy aho » ?",
            questionMg: "Inona no dikan'ny fehezanteny hoe « Miteny gasy aho » ?",
            choices: [
              'Je parle malgache',
              'J’écoute de la musique',
              'Je mange du riz',
              'Je pars en voyage',
            ],
            correctIndex: 0,
            explanation:
              "« Miteny » = parler, « gasy » = malgache, « aho » = je/moi.",
          },
          {
            type: 'quiz',
            question: "Comment dit-on « Nous avons mangé » au passé avec le verbe « Mihinana » ?",
            questionMg: "Ahoana ny filazana ny hoe « Nihinana » amin'ny fotoana lasa ?",
            choices: ['Nihinana izahay', 'Hihinana izahay', 'Mihinana izahay', 'Mihinanana izahay'],
            correctIndex: 0,
            explanation:
              "Au passé, le verbe prend le préfixe « N- » : Nihinana.",
          },
          {
            type: 'quiz',
            question: "Quel verbe signifie « Marcher » ou « Partir » en malgache ?",
            questionMg: "Inona no matoanteny midika hoe mandeha an-tongotra na miainga ?",
            choices: ['Mandeha', 'Misotro', 'Matory', 'Mahita'],
            correctIndex: 0,
            explanation:
              "« Mandeha » signifie marcher, aller ou partir.",
          },
        ],
      },
      {
        slug: 'exprimer-ses-emotions-accord-et-besoins',
        title: 'Émotions, accord et expressions du quotidien (Fihetseham-po sy Filàna)',
        titleMg: 'Fihetseham-po, Fifanarahana ary Filàna Andavanandro',
        summary: 'Exprimez vos ressentis, votre accord bienveillant et vos besoins avec délicatesse.',
        summaryMg: 'Mianara maneho ny fihetseham-po, ny fanekena ary ny filàna andavanandro amim-panajana.',
        type: 'VOCABULARY',
        orderIndex: 9,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "La courtoisie malgache accorde une importance primordiale à l'expression bienveillante des émotions. Savoir dire « oui », relativiser un souci avec « Tsy maninona » et encourager autrui avec « Mazotoa ! » fortifie le lien fraternel.",
            textMg:
              "Ny fahalalam-pomba malagasy dia manome lanja lehibe ny fanehoana hatsaram-panahy. Ny fahaizana mampahery sy milaza hoe « Tsy maninona » dia manamafy ny fihavanana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'Accent tonique',
            phonetic: 'avant-dernière syllabe',
            frenchEquivalent:
              'En malgache, la voix s’appuie naturellement sur l’avant-dernière syllabe du mot (ex: Fa-LY, Noa-NA, Ma-zo-TOA).',
            sampleWordMg: 'Faly',
            sampleTranslationFr: 'Heureux / Joyeux',
          },
          {
            type: 'concept',
            termMg: 'Eny / Tsia',
            phonetic: 'e-ni / tsi-a',
            meaningFr: 'Oui / Non',
            explanation:
              'Les réponses de base. « Eny tompoko » (Oui monsieur/madame) est la forme soignée.',
          },
          {
            type: 'concept',
            termMg: 'Tsy maninona',
            phonetic: 'tsi ma-ni-nou-na',
            meaningFr: 'Ce n’est rien / Pas de souci / Ne vous inquiétez pas',
            explanation:
              'L’expression universelle d’apaisement à Madagascar, qui efface la gêne et restaure le calme.',
          },
          {
            type: 'concept',
            termMg: 'Mazotoa !',
            phonetic: 'ma-zou-tow',
            meaningFr: 'Bon courage ! / Travaillez avec ardeur et cœur !',
            explanation:
              'Bénédiction adressée à toute personne au travail, aux études ou accomplissant une tâche.',
          },
          {
            type: 'concept',
            termMg: 'Faly',
            phonetic: 'fa-li',
            meaningFr: 'Heureux / Joyeux / Content',
            explanation:
              'Ressentir de la joie intérieure : « Faly aho » (Je suis content / heureux).',
          },
          {
            type: 'concept',
            termMg: 'Malahelo',
            phonetic: 'ma-la-he-lou',
            meaningFr: 'Triste / Avoir de la peine / Compatir',
            explanation:
              'Exprime la tristesse personnelle ou la compassion chaleureuse envers quelqu’un qui souffre.',
          },
          {
            type: 'concept',
            termMg: 'Noana sy Mangetaheta',
            phonetic: 'nou-a-na si man-ge-ta-he-ta',
            meaningFr: 'Avoir faim et Avoir soif',
            explanation:
              'Expressions des besoins corporels élémentaires : « Noana aho » (J’ai faim), « Mangetaheta aho » (J’ai soif).',
          },
          {
            type: 'example',
            textMg: 'Faly be mihaona aminao aho tompoko !',
            textFr: 'Je suis extrêmement heureux de vous rencontrer !',
          },
          {
            type: 'example',
            textMg: 'Aza malahelo fa tsy maninona akory izany.',
            textFr: 'Ne soyez pas triste, ce n’est vraiment rien de grave.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le mot « Mazotoa » vient de « Zoto » (le zèle, l'ardeur, l'enthousiasme). Dire « Mazotoa ! » à un artisan ou à un paysan est une marque suprême de reconnaissance de la dignité de son labeur.",
            textMg:
              "Ny teny hoe « Mazotoa » dia avy amin'ny hoe « zoto ». Fanomezana hery sy fankasitrahana ny hasasaran'ny olona miasa izany.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Que répond-on pour rassurer quelqu'un en disant « Ce n'est rien / Pas de souci » ?",
            questionMg: "Inona no teny fiteny mba hampitony hoe « Pas de souci / Ce n'est rien » ?",
            choices: ['Tsy maninona', 'Misaotra betsaka', 'Azafady tompoko', 'Veloma finaritra'],
            correctIndex: 0,
            explanation:
              "« Tsy maninona » est la formule d'apaisement par excellence (« ça ne fait rien »).",
          },
          {
            type: 'quiz',
            question: "Que signifie l'encouragement bienveillant « Mazotoa ! » ?",
            questionMg: "Inona no hevitry ny fampaherezana hoe « Mazotoa ! » ?",
            choices: [
              'Bon courage / Soyez plein de zèle !',
              'Bonne nuit et doux rêves',
              'Au revoir et à demain',
              'Donnez-moi à boire',
            ],
            correctIndex: 0,
            explanation:
              "« Mazotoa ! » souhaite l'ardeur et l'énergie à qui entreprend un travail ou une tâche.",
          },
          {
            type: 'quiz',
            question: "Comment exprime-t-on le sentiment d'être « heureux » ou « joyeux » en malgache ?",
            questionMg: "Inona no teny ilazana ny fahatsapana fifaliana ?",
            choices: ['Faly', 'Malahelo', 'Noana', 'Vizana'],
            correctIndex: 0,
            explanation:
              "« Faly » signifie joyeux, content ou heureux (ex: Faly aho = Je suis heureux).",
          },
          {
            type: 'quiz',
            question: "Comment dit-on « J'ai soif » en langue malgache ?",
            questionMg: "Ahoana no filazana ny hoe mila rano hosotroina ?",
            choices: ['Mangetaheta aho', 'Noana aho', 'Faly aho', 'Matory aho'],
            correctIndex: 0,
            explanation:
              "« Mangetaheta » signifie avoir soif (ex: Mangetaheta rano aho = J'ai soif d'eau).",
          },
          {
            type: 'quiz',
            question: "Sur quelle syllabe porte généralement l'accent tonique d'un mot malgache ?",
            questionMg: "Aiza ho aiza matetika no misy ny tsindrim-peo amin'ny teny malagasy ?",
            choices: [
              'Sur l’avant-dernière syllabe',
              'Sur la toute première syllabe',
              'Toujours sur la dernière lettre',
              'Il n’y a aucun accent',
            ],
            correctIndex: 0,
            explanation:
              "En malgache, l'accentuation naturelle frappe l'avant-dernière syllabe du mot.",
          },
        ],
      },
      {
        slug: 'la-nourriture-les-saveurs-et-le-repas',
        title: 'La nourriture, les saveurs et le repas malgache (Ny Sakafo sy ny Hanina)',
        titleMg: 'Ny Sakafo, ny Tsiro ary ny Fihinanana Malagasy',
        summary: "Découvrez le vocabulaire culinaire, les saveurs traditionnelles et l'étiquette de la table.",
        summaryMg: 'Ianaro ny voambolan’ny sakafo, ny tsiro samihafa ary ny fomba amam-panao eo am-pisakafoana.',
        type: 'CULTURE',
        orderIndex: 10,
        durationMinutes: 5,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, manger dépasse le simple besoin biologique : c'est un moment de communion solennel et joyeux. Le riz (Vary) en est l'âme incontestée, sanctifié par le célèbre adage : « Ny vary no aina » (Le riz est la vie).",
            textMg:
              "Eo amin'ny kolontsaina malagasy, ny fihinanana dia fotoana iombonana masina sy mahafinaritra. Ny vary no fototry ny sakafo, araka ny ohabolana hoe « Ny vary no aina ».",
          },
          {
            type: 'phonetic',
            letterOrSound: 'AI',
            phonetic: 'aille',
            frenchEquivalent:
              'La diphtongue « AI » se prononce comme dans « ail » ou « paille » en français (ex: Aina, Maintso, Kely aina).',
            sampleWordMg: 'Aina',
            sampleTranslationFr: 'La vie / L’âme vitale',
          },
          {
            type: 'concept',
            termMg: 'Vary',
            phonetic: 'va-ri',
            meaningFr: 'Le riz (aliment sacré)',
            explanation:
              'Présent à chaque repas (matin, midi, soir). Il existe le Vary gasy (riz rouge parfumé) et le Vary fotsy (riz blanc).',
          },
          {
            type: 'concept',
            termMg: 'Laoka',
            phonetic: 'low-ka',
            meaningFr: 'L’accompagnement du riz',
            explanation:
              'Tout mets servant d’escorte au riz : viande de zébu, volaille, poisson ou brèdes (anana).',
          },
          {
            type: 'concept',
            termMg: "Ranon'ampango",
            phonetic: 'ra-noun am-pan-gou',
            meaningFr: 'Eau de riz dorée / Boisson traditionnelle',
            explanation:
              'Infusion désaltérante et digestive obtenue en versant de l’eau bouillante sur la croûte dorée de riz au fond de la marmite.',
          },
          {
            type: 'concept',
            termMg: 'Mamy sy Masira',
            phonetic: 'ma-mi si ma-si-ra',
            meaningFr: 'Sucré / Doux et Salé',
            explanation:
              'Les deux saveurs majeures. « Mamy » évoque aussi la douceur du cœur et de la parole.',
          },
          {
            type: 'concept',
            termMg: 'Masiaka (Sakay)',
            phonetic: 'ma-si-a-ka (sa-kye)',
            meaningFr: 'Pimenté / Épicé / Fort',
            explanation:
              'Désigne le goût piquant du piment malgache (Sakay pilopilo), servi à part sur la table.',
          },
          {
            type: 'concept',
            termMg: 'Mazotoa homana !',
            phonetic: 'ma-zou-tow hou-ma-na',
            meaningFr: 'Bon appétit ! (Mangez de bon cœur !)',
            explanation:
              'La formule d’invitation conviviale prononcée avant de porter la première cuillère à la bouche.',
          },
          {
            type: 'concept',
            termMg: 'Voky tsara',
            phonetic: 'vou-ki tsa-ra',
            meaningFr: 'Bien rassasié / Comblé avec reconnaissance',
            explanation:
              'Réponse polie à la fin du repas pour remercier qui a cuisiné et offert la nourriture.',
          },
          {
            type: 'example',
            textMg: 'Mazotoa homana daholo tompoko ! — Misaotra tompoko, mazotoa koa ianao.',
            textFr: 'Bon appétit à tous ! — Merci beaucoup, bon appétit à vous également.',
          },
          {
            type: 'example',
            textMg: 'Mamy be ity voankazo ity, ary matsiro ny laoka.',
            textFr: 'Ce fruit est très sucré, et le plat d’accompagnement est délicieux.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Selon l'étiquette ancestrale malgache, personne ne commence à manger avant que l'aîné de la table n'ait levé sa cuillère. C'est l'application du « Zo maha-zoky » (le respect dû au rang d'aîné), garant de l'ordre familial.",
            textMg:
              "Araka ny fomban-drazana, tsy misy mikitika sotro alohan'ny zokiolona eo amin'ny latabatra. Izany no fanajana ny « Zo maha-zoky » mampandry feizay ny ankohonana.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Quel proverbe illustre la place suprême du riz dans la vie des Malgaches ?",
            questionMg: "Inona no ohabolana mampiseho ny lanjan'ny vary amin'ny fiainan'ny Malagasy ?",
            choices: [
              '« Ny vary no aina » (Le riz est la vie)',
              '« Ny vola no aina »',
              '« Ny trano no aina »',
              '« Ny lalana no aina »',
            ],
            correctIndex: 0,
            explanation:
              "« Ny vary no aina » (Le riz est la vie) exprime le caractère sacré et vital de cette céréale à Madagascar.",
          },
          {
            type: 'quiz',
            question: "Comment appelle-t-on le plat ou la viande qui accompagne le riz ?",
            questionMg: "Inona no anaran'ny hena na anana ampiarahina amin'ny vary ?",
            choices: ['Ny Laoka', 'Ny Ampango', 'Ny Rano', 'Ny Sakafo'],
            correctIndex: 0,
            explanation:
              "Le « Laoka » désigne tout mets (viande, poisson, brèdes, haricots) accompagnant le riz blanc ou rouge.",
          },
          {
            type: 'quiz',
            question: "Comment souhaite-t-on « Bon appétit ! » en malgache ?",
            questionMg: "Ahoana no firariana fahazotoana homana amin'ny teny malagasy ?",
            choices: ['Mazotoa homana !', 'Mandra-pihaona !', 'Azafady tompoko !', 'Tonga soa !'],
            correctIndex: 0,
            explanation:
              "« Mazotoa homana ! » signifie littéralement « Soyez plein d'entrain pour manger ».",
          },
          {
            type: 'quiz',
            question: "Quelle est la boisson traditionnelle préparée à base de croûte de riz bouillie ?",
            questionMg: "Inona no zava-pisotro nentin-drazana avy amin'ny ampangon-bary nandrahoina ?",
            choices: ["Ranon'ampango", 'Ranom-boankazo', 'Ranom-boanio', 'Kafe'],
            correctIndex: 0,
            explanation:
              "Le « Ranon'ampango » (ou ranovola) est l'eau bouillie versée sur le riz doré au fond de la marmite.",
          },
          {
            type: 'quiz',
            question: "Que répond poliment un invité rassasié à la fin du repas ?",
            questionMg: "Inona no teny fanehoana fankasitrahana rehefa voky tsara ?",
            choices: ['Voky tsara, misaotra tompoko', 'Mbola noana aho', 'Tsy maninona', 'Veloma tompoko'],
            correctIndex: 0,
            explanation:
              "« Voky tsara, misaotra tompoko » affirme que l'on est copieusement et délicieusement rassasié avec reconnaissance.",
          },
        ],
      },
    ],
  },
  {
    slug: 'fahendrena-sy-fihavanana',
    title: 'Sagesse ancestrale & Fihavanana',
    titleMg: 'Fahendrena & Fihavanana Malagasy',
    description:
      'Pénétrez au cœur de la philosophie malgache : proverbes clés expliqués et valeurs de solidarité.',
    descriptionMg:
      "Midira lalina amin'ny fahendrena nentin-drazana sy ny lanjan'ny fihavanana miray hina.",
    level: 'INTERMEDIATE',
    icon: 'Compass',
    color: '#C58B38',
    orderIndex: 2,
    estimatedMinutes: 45,
    lessons: [
      {
        slug: 'le-concept-fondamental-du-fihavanana',
        title: 'Le Fihavanana : lien sacré de fraternité',
        titleMg: 'Ny Fihavanana : fatorana masina mampiray',
        summary:
          'Explorez la notion de Fihavanana, pilier absolu de la cohésion sociale et de la paix à Madagascar.',
        summaryMg:
          "Famakafakana ny hevitra fototry ny Fihavanana, fototra iorenan'ny firaisankina sy ny fihavanana.",
        type: 'CULTURE',
        orderIndex: 1,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "Le Fihavanana dépasse la simple fraternité de sang : c'est l'art de reconnaître chaque être humain comme un frère et de cultiver la solidarité inconditionnelle.",
            textMg:
              "Ny Fihavanana dia mihoatra lavitra noho ny fifamatorana ara-dra : fahaizana miaina miaraka sy fifanampiana amin'ny fotoan-tsarotra.",
          },
          {
            type: 'concept',
            termMg: 'Fihavanana',
            phonetic: 'fi-ha-va-na-na',
            meaningFr:
              "Fraternité, lien d'harmonie sociale, solidarité vivante",
            explanation:
              'Concept cardinal de la culture malgache liant les individus dans une responsabilité mutuelle.',
          },
          {
            type: 'concept',
            termMg: 'Valin-tanana',
            phonetic: 'va-lin ta-na-na',
            meaningFr:
              'Entraide mutuelle réciproque (littéralement : retour de main)',
            explanation:
              "Système solidaire d'aide aux champs ou à la construction : aujourd'hui je t'aide, demain tu m'aideras.",
          },
          {
            type: 'example',
            textMg: 'Aleo very tsikalakalam-bola toy izay very fihavanana.',
            textFr:
              "Mieux vaut perdre de l'argent que de briser le lien de fraternité (Fihavanana).",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Chez les Malgaches, rompre le Fihavanana est considéré comme l'une des fautes morales les plus graves. Dans les villages, les conflits se règlent traditionnellement sous l'arbre à palabres devant les anciens.",
            textMg:
              "Ny fanapahana fihavanana dia fady sy fahotana lehibe eo amin'ny fiarahamonina malagasy.",
          },
          // ─── 3 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              'Que préconise le proverbe célèbre : « Aleo very tsikalakalam-bola toy izay... » ?',
            questionMg:
              "Ahoana no tohin'ny ohabolana : « Aleo very tsikalakalam-bola toy izay... » ?",
            choices: [
              'Very fihavanana (Perdre le lien de fraternité)',
              'Very fananana (Perdre des biens matériels)',
              'Tsy misakafo (Ne pas manger)',
              'Tsy matory (Ne pas dormir)',
            ],
            correctIndex: 0,
            explanation:
              'Le proverbe sacralise le lien humain par-dessus toute richesse matérielle ou financière.',
          },
          {
            type: 'quiz',
            question:
              "Qu'est-ce que le « Valin-tanana » dans la vie communautaire ?",
            questionMg:
              "Inona no dikan'ny hoe « Valin-tanana » eo amin'ny fiainam-bahoaka ?",
            choices: [
              "L'entraide agricole et solidaire réciproque entre voisins",
              'Un impôt versé au chef du village',
              "Un jeu d'adresse traditionnel",
              'Un rituel de guérison nocturne',
            ],
            correctIndex: 0,
            explanation:
              'Le « Valin-tanana » (retour de main) désigne le système solidaire où la communauté aide à tour de rôle chaque famille pour les travaux lourds.',
          },
          {
            type: 'quiz',
            question:
              'Quelle est la traduction la plus juste du concept de « Fihavanana » ?',
            questionMg:
              'Inona no famaritana mahitsy indrindra ny « Fihavanana » ?',
            choices: [
              'La fraternité solidaire et la cohésion harmonieuse du groupe',
              'Une simple transaction commerciale',
              "Une règle juridique imposée par l'État",
              'Une querelle de voisinage',
            ],
            correctIndex: 0,
            explanation:
              "Le Fihavanana est une valeur cardinale qui fait de l'harmonie sociale et de la solidarité un devoir sacré.",
          },
          {
            type: 'quiz',
            question:
              'Quel acte est considéré comme une faute morale majeure dans la société malgache ?',
            questionMg:
              "Inona no heverina ho fandikana lalàna ara-moraly lehibe indrindra eo amin'ny fiarahamonina ?",
            choices: [
              'Rompre délibérément le lien de fraternité (manapaka fihavanana)',
              'Refuser poliment un cadeau inutile',
              'Partir travailler dans une autre commune',
              'Acheter des terres agricoles supplémentaires',
            ],
            correctIndex: 0,
            explanation:
              'Le Fihavanana garantissant la paix communautaire, sa rupture délibérée est réprouvée et considérée comme fady.',
          },
          {
            type: 'quiz',
            question:
              'Sur quel principe repose la pratique communautaire du « Valin-tanana » ?',
            questionMg:
              "Inona no fototra iorenan'ny fomba nentin-drazana hoe « Valin-tanana » ?",
            choices: [
              "La réciprocité solidaire et l'entraide mutuelle bénévole",
              "Le versement d'un impôt obligatoire au chef du village",
              "Un contrat de prêt bancaire à taux d'intérêt",
              "L'embauche d'ouvriers salariés rémunérés à la journée",
            ],
            correctIndex: 0,
            explanation:
              "Le Valin-tanana (retour de main) repose sur l'aide mutuelle sans transaction monétaire pour les travaux communautaires.",
          },
        ],
      },
      {
        slug: 'les-proverbes-de-la-parole-et-du-lien',
        title: 'Les proverbes sacrés : parole et fraternité (Ohabolana)',
        titleMg: 'Ny Ohabolana momba ny Teny sy ny Fihavanana',
        summary:
          "Découvrez la force des métaphores malgaches qui guident la sagesse quotidienne et protègent l'amitié.",
        summaryMg:
          "Fantaro ny herin'ny ohabolana nentin-drazana manoro lalana ny fiainana sy miaro ny firaisankina.",
        type: 'LITERATURE',
        orderIndex: 2,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, « les proverbes sont la lampe qui éclaire l'esprit » (*Ny ohabolana no fanilo manazava ny saina*). Un discours sans proverbe est comme un plat sans sel.",
            textMg:
              "Ny ohabolana dia lova soa nentin-drazana. Ny teny tsy misy ohabolana dia toy ny sakafo tsy misy sira, tsy manana hanitra eo amin'ny fiarahamonina.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'ND',
            phonetic: 'nd',
            frenchEquivalent:
              'Son doux et lié entre la dentale « N » et la sonore « D » (ex: Landy = soie).',
            sampleWordMg: 'Landy',
            sampleTranslationFr: 'La soie précieuse',
          },
          {
            type: 'concept',
            termMg: 'Ohabolana',
            phonetic: 'ow-ha-bou-la-na',
            meaningFr: 'Proverbe, sentence de sagesse, parole proverbiale',
            explanation:
              'Condensé de la mémoire ancestrale servant à conseiller, apaiser et préserver le respect sans heurter.',
          },
          {
            type: 'concept',
            termMg: 'Fihavanan-dandy',
            phonetic: 'fi-ha-va-nan-dan-di',
            meaningFr:
              "Une fraternité comparable à la soie (qui s'entretient et se répare)",
            explanation:
              "Par opposition à l'amitié de pierre qui casse, le lien de soie peut toujours être raccordé avec soin.",
          },
          {
            type: 'concept',
            termMg: 'Ny teny toy ny atody',
            phonetic: 'ni te-ni toui ni a-tou-di',
            meaningFr:
              'La parole est comme un œuf (une fois tombée, on ne peut la rattraper)',
            explanation:
              'Mise en garde fondamentale sur la prudence verbale : une parole blessante brise la confiance pour toujours.',
          },
          {
            type: 'example',
            textMg:
              'Aza atao fihavanam-bato, fa ataovy fihavanan-dandy ka raha madilana azo tohizana.',
            textFr:
              "Ne faites pas une amitié de pierre (qui casse net), faites une amitié de fil de soie : si elle s'amincit, on peut la renouer.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Dans la diplomatie villageoise malgache, les anciens n'utilisent jamais d'invectives directes en cas de litige : ils citent un ohabolana imagé. Cela permet à la personne fautive de comprendre son erreur sans jamais perdre la face.",
            textMg:
              "Eo anatrehan'ny ady na olana, ny Ntaolo dia mampiasa ohabolana fa tsy masiaka am-bava. Izany dia fomba fananarana am-pahamendrehana mba tsy hahamenatra ny hafa.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Que préconise le proverbe sur l'amitié de soie (« fihavanan-dandy ») ?",
            questionMg:
              'Inona no hevitry ny ohabolana mikasika ny « fihavanan-dandy » ?',
            choices: [
              'Le lien doit être souple et réparable avec soin, comme un fil de soie',
              "L'amitié doit être dure et tranchante comme la pierre",
              'Il ne faut faire confiance à personne dans le village',
              "L'amitié doit être achetée avec de l'argent",
            ],
            correctIndex: 0,
            explanation:
              "La soie symbolise la valeur et la possibilité de renouer le fil quand il s'amenuise, contrairement à la pierre qui se brise.",
          },
          {
            type: 'quiz',
            question:
              'Pourquoi compare-t-on la parole à un œuf (« Ny teny toy ny atody ») ?',
            questionMg:
              "Nahoana no ampitahaina amin'ny atody ny teny (« Ny teny toy ny atody ») ?",
            choices: [
              "Parce qu'une parole prononcée ne peut plus être rattrapée une fois sortie",
              'Parce que la parole a une forme ovale',
              "Parce qu'il faut manger des œufs avant de parler",
              'Parce que les paroles sont fragiles au soleil',
            ],
            correctIndex: 0,
            explanation:
              'Si un œuf tombe au sol, il éclate et nul ne peut le ramasser. Il en va de même pour une parole imprudente ou blessante.',
          },
          {
            type: 'quiz',
            question:
              'À quoi compare-t-on traditionnellement un discours malgache sans proverbes ?',
            questionMg:
              "Ampitahaina amin'ny inona ny kabary na kabary tsy misy ohabolana ?",
            choices: [
              'À un repas fade sans sel (« sakafo tsy misy sira »)',
              'À un arbre sans feuilles',
              'À une maison sans porte',
              'À un ciel sans étoiles',
            ],
            correctIndex: 0,
            explanation:
              "Les proverbes apportent le sel, la saveur et l'autorité morale indispensable à l'art oratoire.",
          },
          {
            type: 'quiz',
            question:
              'Quel terme malgache désigne les proverbes et maximes de sagesse ?',
            questionMg:
              'Inona no teny malagasy manondro ireo oha-pitenenana sy lova ara-panahy ?',
            choices: ['Ohabolana', 'Hainteny', 'Tsodrano', 'Vakodrazana'],
            correctIndex: 0,
            explanation:
              '« Ohabolana » est le mot précis pour désigner les proverbes malgaches ancestraux.',
          },
          {
            type: 'quiz',
            question:
              "Quel rôle joue le proverbe lors de la résolution d'un conflit villageois ?",
            questionMg:
              "Inona no anjara toeran'ny ohabolana rehefa mamaha olana eo amin'ny fiaraha-monina ?",
            choices: [
              'Délivrer un conseil juste sans humilier ni faire perdre la face',
              'Imposer une amende financière immédiate',
              'Interdire toute négociation entre les familles',
              'Obliger un exil hors du village',
            ],
            correctIndex: 0,
            explanation:
              "Le proverbe éclaire la faute avec métaphore et tact, permettant la réconciliation sans blesser l'amour-propre.",
          },
        ],
      },
      {
        slug: 'la-culture-du-riz-et-repas-sacres',
        title: 'Le riz et les repas sacrés : « Ny vary no aina »',
        titleMg: 'Ny Vary no Aina sy ny Fihavanana eo am-Pihinanana',
        summary:
          "Comprenez la place sacrée du riz dans l'âme malgache, symbole de vie, d'accueil et de cohésion.",
        summaryMg:
          "Ianaro ny lanjan'ny vary amin'ny maha aina azy sy ny fitsipika mifehy ny sakafo iombonana.",
        type: 'TRADITION',
        orderIndex: 3,
        durationMinutes: 6,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, « le riz est la vie » (*Ny vary no aina*). Sans riz, un repas n'est pas considéré comme achevé. Partager le repas scelle la communion fraternelle.",
            textMg:
              'Ny vary no fototry ny fiainana malagasy. Raha tsy misy vary ny sakafo dia mbola tsy nihinana ny olona. Mariky ny fihavanana sy ny firaisan-kina ny fizarana vary.',
          },
          {
            type: 'phonetic',
            letterOrSound: 'NG',
            phonetic: 'ng',
            frenchEquivalent:
              'Son nasal guttural semblable au « ng » de « parking » ou « gong » (ex: Ranonampango).',
            sampleWordMg: 'Ranonampango',
            sampleTranslationFr: 'Eau de riz doré traditionnel',
          },
          {
            type: 'concept',
            termMg: 'Vary',
            phonetic: 'va-ri',
            meaningFr: 'Le riz (aliment fondamental et sacré)',
            explanation:
              'Au-delà de la nourriture, le riz est le don de Zanahary, emblème de fertilité et de subsistance.',
          },
          {
            type: 'concept',
            termMg: 'Laoka',
            phonetic: 'low-ka',
            meaningFr: 'Accompagnement du riz (viande, brèdes, poisson)',
            explanation:
              'Tout aliment accompagnant le plat de riz est désigné sous le terme de laoka.',
          },
          {
            type: 'concept',
            termMg: 'Ranonampango (Ranovola)',
            phonetic: 'ra-noun-am-pang-ou (ra-nou-vou-la)',
            meaningFr:
              'Eau de riz bouillie sur la croûte dorée au fond de la marmite',
            explanation:
              'Boisson nationale chaude, digestive et saine, servie avec générosité à la fin de chaque repas.',
          },
          {
            type: 'concept',
            termMg: 'Vary be menaka',
            phonetic: 'va-ri be me-na-ka',
            meaningFr:
              'Le grand repas de fête (riz à la viande grasse de zébu)',
            explanation:
              "Repas rituel partagé lors des circoncisions, mariages et famadihana, symbole de fête et d'abondance.",
          },
          {
            type: 'example',
            textMg:
              'Mandehana mihinana vary tompoko ! — Misaotra tompoko, mazotoa homana !',
            textFr:
              'Venez partager le repas de riz ! — Merci beaucoup à vous, bon appétit !',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Madagascar compte parmi les pays où la consommation de riz par habitant est la plus élevée au monde (plus de 120 kg/an). Lors d'un repas familial traditionnel, l'étiquette veut que les plus jeunes attendent que le « Zoky » (l'aîné) donne le premier coup de cuillère.",
            textMg:
              "Mitana ny laharana voalohany amin'ny fihinanana vary eran-tany ny Malagasy. Fomba fanajana ny miandry ny zoky hikasika voalohany ny sakafo mialoha ny hihinanana.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              'Que signifie la célèbre maxime malgache « Ny vary no aina » ?',
            questionMg:
              'Inona no hevitry ny ohabolana fanta-daza hoe « Ny vary no aina » ?',
            choices: [
              "Le riz est la vie / l'âme de l'existence",
              'Le riz coûte très cher cette saison',
              'Le riz doit être planté la nuit',
              "Le riz ne sert qu'aux personnes âgées",
            ],
            correctIndex: 0,
            explanation:
              "« Aina » signifie vie, souffle, âme. Le riz est considéré comme l'énergie vitale indispensable du Malgache.",
          },
          {
            type: 'quiz',
            question:
              'Comment appelle-t-on tout accompagnement servi avec le plat de riz ?',
            questionMg:
              "Ahoana no iantsoana ny sakafo rehetra mpiara-dia amin'ny vary (hena, anana, trondro) ?",
            choices: ['Laoka', 'Ranovola', 'Tsena', 'Mofo'],
            correctIndex: 0,
            explanation:
              'Tout mets qui accompagne le riz (viande, brèdes, haricots) est universellement nommé « laoka ».',
          },
          {
            type: 'quiz',
            question: "Qu'est-ce que le « Ranonampango » (ou « Ranovola ») ?",
            questionMg:
              'Inona moa ny atao hoe « Ranonampango » na « Ranovola » ?',
            choices: [
              "L'infusion d'eau bouillante sur le riz doré au fond de la cocotte",
              'Un jus de fruits exotiques glacé',
              'Une huile de friture pour la viande',
              'Une soupe de légumes salée',
            ],
            correctIndex: 0,
            explanation:
              "C'est la boisson chaude emblématique obtenue en faisant bouillir de l'eau sur le fond de riz roussi (ampango).",
          },
          {
            type: 'quiz',
            question:
              "Quelle politesse élémentaire s'impose lors du repas familial traditionnel malgache ?",
            questionMg:
              "Inona no fomba amam-panao hajaina eo am-pihinanana miaraka amin'ny fianakaviana ?",
            choices: [
              'Attendre que les aînés (Zoky) commencent à manger avant de se servir',
              'Manger le plus vite possible avant les autres',
              "Quitter la table dès qu'on a fini son assiette sans rien dire",
              "Ne jamais boire d'eau pendant le repas",
            ],
            correctIndex: 0,
            explanation:
              'Le respect de la préséance des aînés (Haja) est une règle sacrée : les cadets attendent le premier geste du Zoky.',
          },
          {
            type: 'quiz',
            question:
              "Que désigne l'expression rituelle « Vary be menaka » lors des grandes fêtes ?",
            questionMg:
              'Inona no atao hoe « Vary be menaka » mandritra ireo lanonana nentin-drazana ?',
            choices: [
              'Le grand repas festif de riz à la viande grasse de zébu offert aux invités',
              'Un riz mal cuit qui a brûlé',
              'Un riz vendu au marché sous la pluie',
              'Un dessert sucré au lait',
            ],
            correctIndex: 0,
            explanation:
              "Le « Vary be menaka » est le repas d'abondance et de fête par excellence partagé lors des grands événements familiaux.",
          },
        ],
      },
      {
        slug: 'le-haja-et-le-dina-pacte-communautaire',
        title: 'Le Haja et le Dina : respect mutuel et pacte solidaire (Ny Haja sy ny Dina)',
        titleMg: 'Ny Haja sy ny Dina : Fanajana sy Fifanekem-piarahamonina',
        summary:
          "Découvrez comment le Haja (déférence sacrée) et le Dina (convention communautaire) cimentent la paix villageoise.",
        summaryMg:
          "Fantaro ny lanjan'ny Haja mifehy ny fiainana sy ny Dina mampandry fahalemana ny Fokonolona.",
        type: 'CULTURE',
        orderIndex: 4,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "Dans la pensée traditionnelle malgache, le respect (Haja) n'est pas une simple marque d'obéissance, c'est la reconnaissance sacrée de la valeur d'autrui. Associé au Dina, pacte communautaire juré ensemble, il assure l'harmonie et l'ordre sans nécessiter de police extérieure.",
            textMg:
              "Ao amin'ny fahendrena malagasy, ny Haja dia tsy fanandevozan-tena fa fanomezana lanja ny maha-olona sy ny soatoavina. Rehefa mifamatotra amin'ny Dina izany dia milamina sy milamina ny fiarahamonina.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'J',
            phonetic: 'dz',
            frenchEquivalent:
              'Le « J » malgache se prononce toujours comme une consonne affriquée « dz » (semblable au « ds » dans « kids » ou « zz » dans « pizza »), jamais comme le « j » français doux (ex: Haja = ha-dza).',
            sampleWordMg: 'Haja',
            sampleTranslationFr: 'Le respect / La dignité / L’honneur',
          },
          {
            type: 'concept',
            termMg: 'Haja',
            phonetic: 'ha-dza',
            meaningFr: 'Respect, déférence, dignité d’autrui',
            explanation:
              'Vertu cardinale qui impose de traiter chacun avec considération, des plus jeunes aux ancêtres.',
          },
          {
            type: 'concept',
            termMg: 'Dina',
            phonetic: 'di-na',
            meaningFr: 'Convention collective, pacte communautaire juré',
            explanation:
              'Règlement traditionnel établi et accepté par le Fokonolona pour protéger le village, les récoltes et la paix.',
          },
          {
            type: 'concept',
            termMg: 'Fokonolona',
            phonetic: 'fou-kou-nou-lou-na',
            meaningFr: 'Assemblée des villageois, communauté solidaire de base',
            explanation:
              'Cellule fondamentale de la démocratie participative malgache où chaque voix compte dans le consensus.',
          },
          {
            type: 'concept',
            termMg: 'Fanajana',
            phonetic: 'fa-na-dza-na',
            meaningFr: 'L’action de respecter, politesse en acte',
            explanation:
              'Pratique concrète du respect au quotidien : saluer humblement, écouter sans couper la parole, laisser passer l’aîné.',
          },
          {
            type: 'concept',
            termMg: 'Firaisankina',
            phonetic: 'fi-rye-san-ki-na',
            meaningFr: 'Union solidaire, cohésion indéfectible',
            explanation:
              'La force née de l’assemblage de volontés unies, comme le rappelle le proverbe : « Ny firaisankina no hery ».',
          },
          {
            type: 'example',
            textMg: 'Manaja ny Dina ny Fokonolona ka mandry feizay ny tanàna.',
            textFr: 'La communauté villageoise respecte le Dina, ainsi la paix et la quiétude règnent sur le village.',
          },
          {
            type: 'example',
            textMg: 'Ny haja omena ny hafa no haja iverenana aminao.',
            textFr: 'Le respect que vous offrez aux autres est celui qui vous reviendra en retour.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le Dina malgache est si profondément ancré dans l'histoire qu'il a été reconnu par la législation moderne à Madagascar. Aujourd'hui encore, un Dina validé par le tribunal a force exécutoire dans les campagnes pour la surveillance du bétail et des forêts sacrées.",
            textMg:
              "Ny Dina dia manana hery lehibe eo amin'ny lalàna malagasy ankehitriny. Eken'ny fitsarana ny Dina ifanaovan'ny mponina any ambanivohitra mba hiarovana ny omby sy ny ala.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Que désigne le concept de « Dina » dans la société traditionnelle malgache ?",
            questionMg: "Inona no hevitry ny « Dina » eo amin'ny fiarahamonina malagasy ?",
            choices: [
              'Un pacte social ou une convention communautaire adoptée ensemble',
              'Un instrument de musique traditionnel à cordes',
              'Un type de riz rouge réservé aux rois',
              'Une fête de naissance',
            ],
            correctIndex: 0,
            explanation:
              "Le « Dina » est un accord ou pacte traditionnel juré par les membres d'une communauté pour régir la sécurité et l'harmonie.",
          },
          {
            type: 'quiz',
            question: "Comment se prononce la lettre « J » en langue malgache (ex: Haja) ?",
            questionMg: "Ahoana no fanononana ny litera « J » amin'ny teny malagasy ?",
            choices: [
              'Comme le son « dz » (ex: ha-dza)',
              'Comme le « j » doux français de « jardin »',
              'Comme un « ch » soufflé',
              'Comme un « g » dur de « gare »',
            ],
            correctIndex: 0,
            explanation:
              "En malgache, le « J » correspond systématiquement au son affriqué « dz ».",
          },
          {
            type: 'quiz',
            question: "Quelle institution traditionnelle représente l'assemblée des villageois délibérant ensemble ?",
            questionMg: "Inona no rafitra nentin-drazana ivorian'ny vahoaka rehetra handray fanapahan-kevitra ?",
            choices: ['Ny Fokonolona', 'Ny Kabary', 'Ny Lova', 'Ny Tsena'],
            correctIndex: 0,
            explanation:
              "Le « Fokonolona » est l'assemblée villageoise communautaire, base de la démocratie directe malgache.",
          },
          {
            type: 'quiz',
            question: "Quel célèbre proverbe illustre la force de l'union fraternelle ?",
            questionMg: "Inona no ohabolana mampiseho fa herin'ny vahoaka ny firaisana ?",
            choices: [
              '« Ny firaisankina no hery » (L’union fait la force)',
              '« Ny vola no hery »',
              '« Ny feo no hery »',
              '« Ny hazo no hery »',
            ],
            correctIndex: 0,
            explanation:
              "« Ny firaisankina no hery » est l'adage fondamental proclamant que la solidarité collective dépasse toutes les forces individuelles.",
          },
          {
            type: 'quiz',
            question: "Que signifie le terme fondamental « Haja » ?",
            questionMg: "Inona no dikan'ny teny fototra hoe « Haja » ?",
            choices: [
              'Le respect, la dignité et la déférence',
              'La richesse financière',
              'La force physique au combat',
              'La ruse politique',
            ],
            correctIndex: 0,
            explanation:
              "« Haja » est le respect et la déférence sacrée accordée à chaque être humain et aux traditions.",
          },
        ],
      },
      {
        slug: 'le-tsiny-et-le-tody-boussole-morale',
        title: 'Le Tsiny et le Tody : blâme cosmique et justice immanente (Ny Tsiny sy ny Tody)',
        titleMg: 'Ny Tsiny sy ny Tody : Lalàm-panahy sy Fitsaran-tena',
        summary:
          "Comprenez la crainte du Tsiny (le blâme moral) et la certitude du Tody (la loi cosmique du retour des actes).",
        summaryMg:
          "Iantohan'ny tahotra ny Tsiny sy ny fahalalana ny Tody ny fahitsiana sy ny fahamendrehana Malagasy.",
        type: 'CULTURE',
        orderIndex: 5,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "Dans la philosophie malgache, deux forces invisibles mais omniprésentes régulent la conscience : le « Tsiny » (le reproche ou blâme moral invisible qu'on s'attire par une maladresse) et le « Tody » (la loi inéluctable du retour, où chaque acte semé finit par revenir à son auteur).",
            textMg:
              "Ao amin'ny fisainan'ny Ntaolo, ny « Tsiny » sy ny « Tody » no mitantana ny fiasan'ny feon'ny fieritreretana : tahotra sao mahazo tsiny, sy fahalalana fa izay afafy ihany no jinjaina.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'TS',
            phonetic: 'ts',
            frenchEquivalent:
              'Le digraphe « TS » (ex: Tsiny) se prononce d’un seul bloc énergique et sifflant comme dans « tsar » ou « tsunami ».',
            sampleWordMg: 'Tsiny',
            sampleTranslationFr: 'Le blâme / Le reproche moral / La faute d’étiquette',
          },
          {
            type: 'concept',
            termMg: 'Tsiny',
            phonetic: 'tsi-ni',
            meaningFr: 'Blâme cosmique, reproche moral intérieur',
            explanation:
              'Force invisible engendrée par un faux pas social, une arrogance ou un manque de tact envers autrui.',
          },
          {
            type: 'concept',
            termMg: 'Tody',
            phonetic: 'tou-di',
            meaningFr: 'La loi du retour des actes, justice immanente',
            explanation:
              'Principe universel : le bien comme le mal posé finit inévitablement par atteindre son auteur ou sa lignée.',
          },
          {
            type: 'concept',
            termMg: 'Miala tsiny',
            phonetic: 'mi-a-la tsi-ni',
            meaningFr: 'Demander pardon, écarter préventivement le blâme',
            explanation:
              'L’art oratoire suprême de débuter chaque prise de parole en reconnaissant humblement son imperfection devant l’auditoire.',
          },
          {
            type: 'concept',
            termMg: 'Fahamarinana',
            phonetic: 'fa-ha-ma-ri-na-na',
            meaningFr: 'La droiture, la justice, la vérité authentique',
            explanation:
              'Agir avec pureté d’intention pour être à l’abri du Tsiny et attirer le Tody favorable.',
          },
          {
            type: 'example',
            textMg: 'Miala tsiny tompoko raha misy ny teny tafahoatra na tsy voalaza am-pahendrena.',
            textFr: 'Je m’excuse humblement s’il y a eu un mot de trop ou une parole maladroite dans mon propos.',
          },
          {
            type: 'example',
            textMg: 'Aza manao ratsy olona fandrao tratry ny tody.',
            textFr: 'Ne faites pas de tort à autrui de peur que la loi du retour ne vous frappe.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le philosophe malgache Richard Andriamanjato a défini le Tsiny comme « l'ombre portée de nos actes imparfaits ». Dans tout discours de Kabary, un long prologue appelé « Fanalana tsiny » est obligatoirement dédié à supplier les anciens et l'assemblée d'effacer d'avance toute maladresse oratoire.",
            textMg:
              "Ao amin'ny Kabary malagasy, tsy maintsy misy ny « Fanalana tsiny » : fombafomba kanto sy lalina angatahan'ny mpikabary famelan-keloka mialoha sao misy diso teny.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Que représente le concept de « Tody » dans la philosophie malgache ?",
            questionMg: "Inona no hevitry ny hoe « Tody » eo amin'ny finoana nentin-drazana ?",
            choices: [
              'La loi du retour inéluctable : chaque acte commis revient vers son auteur',
              'Un plat traditionnel de poisson séché',
              'Le chapeau de paille porté par les hommes',
              'La saison des pluies dans l’Est',
            ],
            correctIndex: 0,
            explanation:
              "Le « Tody » est la conviction absolue que nos actions bonnes ou mauvaises reviennent immanquablement vers nous (l'équivalent malgache de la justice immanente).",
          },
          {
            type: 'quiz',
            question: "Que signifie littéralement l'expression de politesse « Miala tsiny » ?",
            questionMg: "Inona no dikan'ny teny hoe « Miala tsiny » ara-bakiteny ?",
            choices: [
              'Écarter / ôter le blâme (s’excuser avec déférence)',
              'Partir en voyage loin du village',
              'Changer d’avis sur un sujet',
              'Donner une récompense financière',
            ],
            correctIndex: 0,
            explanation:
              "« Miala tsiny » signifie textuellement « faire partir le blâme », c'est la formule consacrée pour s'excuser et préserver l'harmonie.",
          },
          {
            type: 'quiz',
            question: "Quel proverbe célèbre résume la nature invisible et subtile du Tsiny ?",
            questionMg: "Inona no ohabolana mampitaha ny tsiny amin'ny zavaboary ?",
            choices: [
              '« Ny tsiny toy ny rivotra, tsy hita fa mahamay » (Le blâme est comme le vent, invisible mais brûlant)',
              '« Ny tsiny toy ny vato »',
              '« Ny tsiny toy ny volamena »',
              '« Ny tsiny toy ny hazo avo »',
            ],
            correctIndex: 0,
            explanation:
              "« Ny tsiny toy ny rivotra, tsy hita fa mahamay » illustre que même invisible à l'œil, le blâme moral blesse profondément le cœur et l'âme.",
          },
          {
            type: 'quiz',
            question: "Dans le discours traditionnel du Kabary, comment appelle-t-on le passage où l'orateur s'excuse préventivement ?",
            questionMg: "Inona no anaran'ilay dingana fialan-tsiny mialoha ataon'ny mpikabary ?",
            choices: [
              'Ny Fanalana tsiny',
              'Ny Fisaorana',
              'Ny Tsodrano',
              'Ny Veloma',
            ],
            correctIndex: 0,
            explanation:
              "Le « Fanalana tsiny » est l'étape rituelle d'humilité où l'orateur désamorce toute rancœur ou maladresse verbale.",
          },
          {
            type: 'quiz',
            question: "Pourquoi les anciens disent-ils « Ny tody tsy miady fa ny atao no miverina » ?",
            questionMg: "Nahoana no lazaina fa « Ny tody tsy miady fa ny atao no miverina » ?",
            choices: [
              'Parce que la justice du destin n’a pas besoin d’arme : ce sont nos propres actes qui nous reviennent',
              'Parce qu’il faut toujours se battre en duel',
              'Parce que le temps efface tout sans trace',
              'Parce que les ennemis finissent par fuir',
            ],
            correctIndex: 0,
            explanation:
              "Ce proverbe souligne que le Tody n'a nul besoin de violence : la conséquence naturelle de nos actes se charge elle-même du dénouement.",
          },
        ],
      },
      {
        slug: 'le-valin-tanana-et-le-fampihavanana',
        title: 'Le Valin-tanana et le Fampihavanana : entraide paysanne et réconciliation (Ny Valin-tanana)',
        titleMg: 'Ny Valin-tanana sy ny Fampihavanana : Fifanampiana sy Fihavanana Vaovao',
        summary:
          "Explorez la puissance de l'entraide gratuite sans argent et les rituels de paix pour éteindre les conflits.",
        summaryMg:
          "Diniho ny herin'ny fifanampiana maimaim-poana eo an-tanimbary sy ny fahendrena mamadika ny fifandrafiana ho fihavanana.",
        type: 'TRADITION',
        orderIndex: 6,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, la survie des rizières et la solidité des villages reposent sur le « Valin-tanana » (littéralement « le retour de main ») : un réseau d'entraide solidaire où l'on travaille gratuitement pour son voisin en sachant qu'il viendra travailler pour nous demain. Et lorsque survient une discorde, le « Fampihavanana » rétablit la paix sans rancune.",
            textMg:
              "Ny fambolena sy ny fiarahamonina malagasy dia mifototra amin'ny « Valin-tanana » : asa iombonana tsy andoavam-bola. Ary rehefa misy disadisa dia ny « Fampihavanana » tarihin'ny Raiamandreny no mamerina ny firindrana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'DR',
            phonetic: 'dzr',
            frenchEquivalent:
              'Le digraphe « DR » (ex: Fampihavanana, Andriana, Draka) se prononce avec une légère friction sonore « dz-r » vigoureuse.',
            sampleWordMg: 'Andriana',
            sampleTranslationFr: 'Noble / Souverain / Respectable',
          },
          {
            type: 'concept',
            termMg: 'Valin-tanana',
            phonetic: 'va-lin ta-na-na',
            meaningFr: 'Entraide réciproque par le travail solidaire',
            explanation:
              'Pratique séculaire où l’argent est absent : on échange du temps et des bras pour les labours, le repiquage ou la moisson.',
          },
          {
            type: 'concept',
            termMg: 'Fampihavanana',
            phonetic: 'fam-pi-ha-va-na-na',
            meaningFr: 'Réconciliation, rétablissement de la concorde',
            explanation:
              'Processus de médiation mené par les Raiamandreny pour guérir les blessures relationnelles et réconcilier les parties.',
          },
          {
            type: 'concept',
            termMg: 'Raiamandreny',
            phonetic: 'rye-man-dre-ni',
            meaningFr: 'Parents, aînés, sages respectés de la communauté',
            explanation:
              'Autorités morales et spirituelles dont la parole bienveillante apaise les conflits et éclaire les décisions.',
          },
          {
            type: 'concept',
            termMg: 'Asa vadi-drano',
            phonetic: 'a-sa va-di-dra-nou',
            meaningFr: 'Travaux de repiquage collectif dans les rizières',
            explanation:
              'La grande fête du travail paysan où femmes et hommes se rassemblent en chants pour ensemencer les rizières du village.',
          },
          {
            type: 'example',
            textMg: 'Nanao valin-tanana tamin’ny vadi-bainga izahay omaly ka vita haingana ny asa.',
            textFr: 'Nous avons fait du Valin-tanana pour retourner la terre hier, ainsi le travail a été achevé promptement.',
          },
          {
            type: 'example',
            textMg: 'Nampihavana ny mpirahalahy niady ny Raiamandreny teo an-tanàna.',
            textFr: 'Les aînés du village ont réconcilié avec sagesse les deux frères en conflit.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Dans la tradition du Fampihavanana, la réconciliation ne s'achève jamais par la désignation d'un perdant humilié. Au contraire, les deux parties partagent un repas symbolique (souvent un poulet ou du zébu avec du riz) et prononcent le pardon mutuel pour que le Fihavanana renaisse plus fort.",
            textMg:
              "Rehefa vita ny Fampihavanana malagasy, tsy misy resy na mpandresy manambany : miara-mihinana sy mifamela heloka ny roa tonta mba tsy hisy lolompo tavela ao am-po.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Que signifie littéralement la formule solidaire « Valin-tanana » ?",
            questionMg: "Inona no dikan'ny teny hoe « Valin-tanana » ara-bakiteny ?",
            choices: [
              'Le retour de la main (l’échange de travail solidaire sans argent)',
              'Une poignée de main rapide',
              'Un bracelet traditionnel en argent',
              'Un coup de poing de défi',
            ],
            correctIndex: 0,
            explanation:
              "« Valin-tanana » signifie littéralement « retour de main » : l'assistance mutuelle bénévole entre voisins pour les travaux pénibles.",
          },
          {
            type: 'quiz',
            question: "Quel rôle jouent les « Raiamandreny » lors d'une dispute dans le village ?",
            questionMg: "Inona no andraikitry ny Raiamandreny rehefa misy fifanolanana eo an-tanàna ?",
            choices: [
              'Médiateurs sages qui réconcilient les parties par le Fampihavanana',
              'Gardiens de prison qui enferment les coupables',
              'Collecteurs d’impôts qui prennent l’argent des familles',
              'Spectateurs qui ne s’expriment jamais',
            ],
            correctIndex: 0,
            explanation:
              "Les Raiamandreny (sages et aînés) interviennent avec déférence pour écouter, conseiller et réconcilier durablement les esprits.",
          },
          {
            type: 'quiz',
            question: "Comment se termine traditionnellement un rituel de Fampihavanana réussi ?",
            questionMg: "Ahoana no famaranana ny fampihavanana vita soa aman-tsara ?",
            choices: [
              'Par un repas fraternel partagé et le pardon mutuel scellé',
              'Par l’expulsion de l’une des familles hors du village',
              'Par un duel public d’arts martiaux',
              'Par le paiement d’une lourde amende en or',
            ],
            correctIndex: 0,
            explanation:
              "La vraie réconciliation malgache se scelle autour d'un repas de fête partagé, effaçant toute trace de rancune.",
          },
          {
            type: 'quiz',
            question: "Que désigne l'expression « Asa vadi-drano » chez les paysans malgaches ?",
            questionMg: "Inona no atao hoe « Asa vadi-drano » eo amin'ny tantsaha ?",
            choices: [
              'Le travail collectif solidaire de repiquage du riz dans l’eau des rizières',
              'La pêche nocturne en pirogue',
              'La traversée d’un fleuve en crue',
              'La lessive collective au bord de la rivière',
            ],
            correctIndex: 0,
            explanation:
              "L'« Asa vadi-drano » désigne les grands travaux agricoles collectifs d'inondation et de repiquage du riz où tout le village s'entraide.",
          },
          {
            type: 'quiz',
            question: "Pourquoi le Valin-tanana est-il considéré comme supérieur au salariat dans les rizières traditionnelles ?",
            questionMg: "Nahoana no sarobidy lavitra noho ny karama ny Valin-tanana amin'ny fambolena ?",
            choices: [
              'Parce qu’il resserre le lien humain et l’amitié fraternelle au lieu de diviser par l’argent',
              'Parce que cela ne coûte absolument rien en riz',
              'Parce qu’on peut obliger les voisins par la force',
              'Parce que le gouvernement l’interdit',
            ],
            correctIndex: 0,
            explanation:
              "Le Valin-tanana repose sur le cœur, l'honneur et l'amitié, fortifiant le tissu social au-delà des considérations financières.",
          },
        ],
      },
      {
        slug: 'le-ziva-alliance-et-plaisanterie-sacree',
        title: 'Le Ziva : l\'alliance sacrée et le devoir d\'humour pacificateur (Ny Ziva sy ny Fihavanana)',
        titleMg: 'Ny Ziva : Fifamatorana Masina sy Firahalahiana Mandrakizay',
        summary:
          "Plongez dans l'un des rituels les plus originaux de Madagascar : le Ziva, alliance d'immunité et de fraternité indéfectible.",
        summaryMg:
          "Fantaro ny fomban'ny Ziva, fanekena masina mandrara ny ady sy mampiasa ny fihomehezana ho fitaovam-pihavanana.",
        type: 'TRADITION',
        orderIndex: 7,
        durationMinutes: 7,
        sections: [
          {
            type: 'intro',
            textFr:
              "Le « Ziva » (ou « Fatidra » d'alliance) est une institution sociale unique au monde : un pacte séculaire conclu entre deux ethnies, clans ou familles, interdisant formellement et pour toujours toute guerre ou animosité entre leurs descendants. Entre alliés de Ziva, la dispute est taboue, et la dérision joyeuse est un devoir pour désamorcer les tensions.",
            textMg:
              "Ny « Ziva » dia fomba nentin-drazana miavaka tokoa : fifanekena masina teo amin'ny foko na fianakaviana roa, mandrara tanteraka ny fifandrafiana mandrakizay. Afaka mifanaraby am-pitiavana ny mpiziva mba hampihomehy sy handravona ny olana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'Z',
            phonetic: 'z',
            frenchEquivalent:
              'Le « Z » malgache est doux et voisé, vibrant comme dans « zèbre » ou « horizon » (ex: Ziva, Zanaka, Zoky).',
            sampleWordMg: 'Ziva',
            sampleTranslationFr: 'Allié de parenté à plaisanterie / Pacte fraternel sacré',
          },
          {
            type: 'concept',
            termMg: 'Ziva',
            phonetic: 'zi-va',
            meaningFr: 'Pacte d’alliance sacrée et parenté à plaisanterie',
            explanation:
              'Statut liant deux groupes où toute effusion de sang ou querelle sérieuse est un sacrilège absolu (Fady).',
          },
          {
            type: 'concept',
            termMg: 'Lova tsy mifamono',
            phonetic: 'lou-va tsi mi-fa-mou-nou',
            meaningFr: 'Héritage sacré d’immunité mutuelle',
            explanation:
              'Expression solennelle rappelant qu’entre alliés de sang ou de ziva, le meurtre et la trahison sont impossibles.',
          },
          {
            type: 'concept',
            termMg: 'Fihavanana am-pilalaovana',
            phonetic: 'fi-ha-va-na-na am-pi-la-low-va-na',
            meaningFr: 'Fraternité joviale par le jeu et l’humour',
            explanation:
              'Le droit sacré pour deux alliés de Ziva de se taquiner et de plaisanter ouvertement sans que nul ne puisse s’en offusquer.',
          },
          {
            type: 'concept',
            termMg: 'Fatidra',
            phonetic: 'fa-ti-dra',
            meaningFr: 'Serment du sang, pacte d’adoption fraternelle',
            explanation:
              'Rituel où deux personnes ou clans scellent leur union par une goutte de sang partagée, devenant frères pour l’éternité.',
          },
          {
            type: 'example',
            textMg: 'Mpi-ziva izahay sy ry zareo ka tsy misy fahatezerana mahazo mitoetra eo aminay.',
            textFr: 'Nous sommes liés par le Ziva avec eux, ainsi aucune rancœur ni animosité ne peut subsister entre nous.',
          },
          {
            type: 'example',
            textMg: 'Ny fihomehezan’ny mpi-ziva dia mandevona ny disadisa rehetra.',
            textFr: 'L’humour bienveillant entre alliés de Ziva dissout instantanément tous les malentendus.',
          },
          {
            type: 'didYouKnow',
            textFr:
              "Lors des funérailles traditionnelles, c'est souvent l'allié de Ziva qui a le privilège de monter sur le tombeau pour raconter des anecdotes joyeuses, faire sourire les endeuillés et les aider à traverser la douleur par la chaleur du rire.",
            textMg:
              "Mandritra ny fandevenana, ny mpi-ziva dia afaka mananihany sy mampihomehy ny mpisaona eo am-pasan-drazana mba hanamaivanana ny alahelo sy hampahery ny fianakaviana.",
          },
          // ─── 5 Micro-Quiz ───
          {
            type: 'quiz',
            question: "Quelle est la règle suprême entre deux clans ou personnes liés par le « Ziva » ?",
            questionMg: "Inona no fitsipika masina tsy azo dikaina eo amin'ny mpi-ziva ?",
            choices: [
              'Toute querelle, guerre ou violence est strictement interdite pour l’éternité',
              'Ils doivent obligatoirement habiter dans la même maison',
              'Ils n’ont pas le droit de se parler en public',
              'Ils doivent donner tous leurs biens au roi',
            ],
            correctIndex: 0,
            explanation:
              "Le Ziva est une alliance sacrée de paix absolue : toute haine ou effusion de sang entre alliés est un interdit suprême (Fady).",
          },
          {
            type: 'quiz',
            question: "Quel rôle bienveillant l'humour et la plaisanterie jouent-ils entre alliés de Ziva ?",
            questionMg: "Inona no antony ampiasan'ny mpi-ziva ny sangisangy sy ny fihomehezana ?",
            choices: [
              'Désamorcer les tensions et maintenir la fraternité sans orgueil ni rancœur',
              'Humilier les pauvres devant le village',
              'Se moquer méchamment des ancêtres',
              'Gagner de l’argent lors des foires',
            ],
            correctIndex: 0,
            explanation:
              "L'humour sacré du Ziva permet d'aborder les sujets délicats avec légèreté, neutralisant toute tentation d'orgueil ou de conflit.",
          },
          {
            type: 'quiz',
            question: "Que désigne l'expression « Lova tsy mifamono » ?",
            questionMg: "Inona no hevitry ny hoe « Lova tsy mifamono » ?",
            choices: [
              'L’héritage ancestral sacré qui interdit de s’entretuer entre frères et alliés',
              'Un testament écrit sur une feuille de papier',
              'Un troupeau de zébus légué au premier né',
              'Une maison en bois qu’on ne démolit jamais',
            ],
            correctIndex: 0,
            explanation:
              "« Lova tsy mifamono » est le pacte éternel d'inviolabilité de la vie humaine entre deux groupes unis par la tradition.",
          },
          {
            type: 'quiz',
            question: "Lors des funérailles traditionnelles, quelle mission spéciale revient souvent à l'allié de Ziva ?",
            questionMg: "Inona no ataon'ny mpi-ziva mandritra ny fisaonana sy ny fandevenana ?",
            choices: [
              'Apporter la consolation par le réconfort chaleureux et dédramatiser la douleur par des paroles vivifiantes',
              'Pleurer plus fort que tout le monde pendant sept jours',
              'Creuser la tombe tout seul sans aide',
              'Fermer les portes du village aux étrangers',
            ],
            correctIndex: 0,
            explanation:
              "L'allié de Ziva a le rôle libérateur d'aider la famille en deuil à surmonter l'accablement en insufflant l'espoir et la vie.",
          },
          {
            type: 'quiz',
            question: "Comment appelle-t-on le rituel traditionnel du serment scellé par le sang créant une fraternité éternelle ?",
            questionMg: "Inona no anaran'ny fianianana masina ifamatorana ho mpirahalahy mandrakizay ?",
            choices: ['Ny Fatidra', 'Ny Famadihana', 'Ny Fitampoha', 'Ny Tsaboraha'],
            correctIndex: 0,
            explanation:
              "Le « Fatidra » (serment du sang) est l'alliance suprême d'adoption mutuelle qui transforme deux étrangers en frères de sang inviolables.",
          },
        ],
      },
    ],
  },
  {
    slug: 'traditions-et-rites-ancestraux',
    title: 'Rites & Traditions sacrées',
    titleMg: 'Fomba & Fomban-drazana Masina',
    description:
      'Explorez la dimension spirituelle malgache : respect des Razana, fady et coutumes ancestrales.',
    descriptionMg:
      "Fantaro ny tontolo ara-panahin'ny Ntaolo : ny Razana, ny fady ary ireo fanao nentim-paharazana.",
    level: 'ADVANCED',
    icon: 'Layers',
    color: '#8E44AD',
    orderIndex: 3,
    estimatedMinutes: 55,
    lessons: [
      {
        slug: 'le-culte-des-razana-et-les-fady',
        title: 'Le respect des Razana et la sagesse des Fady',
        titleMg: "Ny fanajana ny Razana sy ny fahendren'ny Fady",
        summary:
          'Comprenez le rôle protecteur des ancêtres (Razana) et la signification profonde des interdits (Fady).',
        summaryMg:
          "Ianaro ny fifandraisan'ny velona sy ny Razana ary ny antony nisian'ny fady eo amin'ny fiarahamonina.",
        type: 'TRADITION',
        orderIndex: 1,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Madagascar, la mort ne marque pas la fin de l'existence, mais le passage vers le statut vénéré d'Ancêtre (*Razana*), veillant sur la descendance.",
            textMg:
              "Eo amin'ny fomba malagasy, ny fahalasanana dia tetezana mankany amin'ny maha-Razana mpiahy ny taranaka.",
          },
          {
            type: 'concept',
            termMg: 'Razana',
            phonetic: 'ra-za-na',
            meaningFr:
              "Les Ancêtres, gardiens invisibles de la terre et de l'ordre moral",
            explanation:
              'Intermédiaires spirituels entre Zanahary (le Créateur) et les vivants.',
          },
          {
            type: 'concept',
            termMg: 'Fady',
            phonetic: 'fa-di',
            meaningFr: 'Interdit sacré, tabou protecteur, règle de précaution',
            explanation:
              "Les fady préservent l'équilibre écologique, social et spirituel du groupe.",
          },
          {
            type: 'didYouKnow',
            textFr:
              'Certains Fady protègent la nature : par exemple, il est souvent fady de pointer du doigt un tombeau ou certains arbres sacrés, ce qui évite leur dégradation.',
            textMg:
              "Maro amin'ireo fady no natao hiarovana ny tontolo iainana sy ny harena voajanahary.",
          },
          // ─── 3 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question: 'Qui sont les « Razana » dans la cosmogonie malgache ?',
            questionMg:
              "Iza ireo atao hoe « Razana » eo amin'ny finoana nentin-drazana ?",
            choices: [
              'Les ancêtres défunts vénérés qui veillent et protègent la descendance',
              'Les ennemis vaincus lors des batailles',
              'Des créatures imaginaires des contes',
              'Les marchands étrangers',
            ],
            correctIndex: 0,
            explanation:
              'Les Razana sont les aïeux passés dans le monde invisible, protecteurs et garants des coutumes de la famille.',
          },
          {
            type: 'quiz',
            question:
              'Quel rôle primordial jouent les « Fady » (interdits rituels) dans la communauté ?',
            questionMg:
              "Inona no antony lehibe nampisy ny « Fady » teo amin'ny Ntaolo ?",
            choices: [
              "Préserver l'équilibre social, moral et protéger la nature",
              'Punir arbitrairement les membres du village',
              'Interdire tout rassemblement festif',
              'Rendre la vie plus compliquée sans explication',
            ],
            correctIndex: 0,
            explanation:
              "Les Fady agissent comme des gardes-fous moraux, sanitaires et environnementaux pour maintenir l'harmonie.",
          },
          {
            type: 'quiz',
            question:
              'Pourquoi est-il traditionnellement fady de pointer du doigt un tombeau (Fasana) ?',
            questionMg:
              "Nahoana no fady ny manondro fasana amin'ny rantsan-tànana ?",
            choices: [
              'Par respect sacré pour le repos des Ancêtres (on utilise le poing replié)',
              "Parce que le doigt pourrait s'allonger",
              'Pour ne pas réveiller les oiseaux',
              "C'est une interdiction moderne sans fondement",
            ],
            correctIndex: 0,
            explanation:
              'Pointer du doigt est perçu comme une agression ou un manque de respect envers les Razana ; on montre avec le poing plié.',
          },
          {
            type: 'quiz',
            question:
              "Quel rôle d'intermédiaires spirituels jouent les Razana dans la cosmogonie malgache ?",
            questionMg:
              "Inona no anjara toeran'ny Razana eo amin'ny fifandraisan'ny velona sy Zanahary ?",
            choices: [
              'Ils intercèdent auprès du Créateur (Zanahary) pour protéger leurs descendants',
              'Ils punissent arbitrairement les villageois sans raison',
              "Ils n'exercent aucune influence sur la vie quotidienne",
              'Ils surveillent exclusivement les frontières maritimes',
            ],
            correctIndex: 0,
            explanation:
              'Les Razana sont considérés comme des intercesseurs bienveillants entre Zanahary et la descendance terrestre.',
          },
          {
            type: 'quiz',
            question:
              "Quel est l'impact écologique direct de nombreux Fady ancestraux ?",
            questionMg:
              "Inona no voka-tsoa entin'ny fady sasany eo amin'ny fiarovana ny tontolo iainana ?",
            choices: [
              "La préservation des forêts sacrées, des sources d'eau et de la faune endémique",
              "L'obligation de défricher massivement la végétation naturelle",
              "L'assèchement artificiel des rivières et des marais",
              "L'interdiction de cultiver le riz dans toute l'île",
            ],
            correctIndex: 0,
            explanation:
              'Plusieurs Fady protègent les forêts sacrées (Ala fady) et interdisent de chasser des animaux totems, agissant comme des réserves naturelles.',
          },
        ],
      },
      {
        slug: 'l-art-du-kabary-discours-rituel',
        title: "L'art oratoire du Kabary : structure et noblesse",
        titleMg: 'Ny Kanto sy ny Fitsipiky ny Kabary Malagasy',
        summary:
          "Pénétrez dans les arcanes de la rhétorique traditionnelle malgache, patrimoine immatériel de l'humanité.",
        summaryMg:
          'Ianaro ny fitsipika sy ny fomba fandrafetana ny kabary nentin-drazana am-pahendrena sy am-pahamendrehana.',
        type: 'LITERATURE',
        orderIndex: 2,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "Le Kabary est l'art de la parole cérémonielle codifiée. Pratiqué lors de chaque temps fort de la vie (mariage, fête, deuil, famadihana), il utilise des proverbes raffinés et témoigne de la haute éloquence malgache.",
            textMg:
              'Ny Kabary dia haikanto am-bava nentin-drazana mampiseho ny fahamendrehana sy ny fahaizana mandahatra teny. Tsy misy lanonana malagasy tanteraka raha tsy misy mpikabary mahay.',
          },
          {
            type: 'phonetic',
            letterOrSound: 'B',
            phonetic: 'b',
            frenchEquivalent:
              'Se prononce fermement avec les lèvres, sonore et net (ex: Kabary).',
            sampleWordMg: 'Kabary',
            sampleTranslationFr: 'Discours rituel oratoire',
          },
          {
            type: 'concept',
            termMg: 'Kabary',
            phonetic: 'ka-ba-ri',
            meaningFr: 'Discours solennel et poétique rituel',
            explanation:
              "Classé au patrimoine mondial immatériel de l'UNESCO, le kabary transmet l'histoire, réconcilie les familles et scelle les alliances.",
          },
          {
            type: 'concept',
            termMg: 'Mpikabary',
            phonetic: 'mpi-ka-ba-ri',
            meaningFr: "L'orateur traditionnel initié",
            explanation:
              'Porte-parole respecté de la famille, détenteur de la mémoire ancestrale et des règles de bienséance.',
          },
          {
            type: 'concept',
            termMg: 'Fialan-tsiny',
            phonetic: 'fi-a-lan-tsi-ni',
            meaningFr: "Demande solennelle d'excuses préalable",
            explanation:
              "L'orateur commence toujours par demander humblement pardon aux aînés et à l'assistance de devoir prendre la parole.",
          },
          {
            type: 'concept',
            termMg: 'Hainteny',
            phonetic: 'hain-te-ni',
            meaningFr: 'Joutes poétiques orales traditionnelles métaphoriques',
            explanation:
              "Poésie populaire dialoguée où les amants et orateurs rivalisent de métaphores subtiles et d'esprit.",
          },
          {
            type: 'example',
            textMg:
              'Mialona tsiny aminareo ray aman-dreny sy ny vahoaka mivory eto aho, fa tsy noho ny fahaizana no itenenana fa adidy aman-draharaha.',
            textFr:
              "Je sollicite humblement vos excuses, chers aînés et peuple ici réuni ; ce n'est point par prétention que je m'exprime, mais pour accomplir un devoir fraternel.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "La demande d'excuse rituelle (*fialan-tsiny*) peut durer plusieurs minutes au début d'un kabary. C'est l'essence même de l'humilité malgache : s'abaisser devant l'assemblée pour élever le message commun.",
            textMg:
              "Ny fialan-tsiny dia tsy fahalemena fa tampon'ny fahendrena sy fanajana ny mpanatrika. Tsy mahazo miditra amin'ny fototry ny hafatra ny mpikabary raha tsy nahazo ny tsodranon'ny vahoaka.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              'Par quelle étape obligatoire et solennelle débute invariablement un Kabary traditionnel ?',
            questionMg:
              "Inona no dingana voalohany tsy maintsy ataon'ny mpikabary mialoha ny handraisany fitenenana ?",
            choices: [
              "Ny Fialan-tsiny (La demande d'excuses humble envers l'assemblée)",
              'La demande immédiate de rétribution financière',
              'Le début direct de la fête sans salutation',
              'La critique sévère des invités',
            ],
            correctIndex: 0,
            explanation:
              "Le « fialan-tsiny » désamorce tout orgueil : l'orateur s'excuse de prendre la parole devant des personnes plus âgées ou plus savantes que lui.",
          },
          {
            type: 'quiz',
            question:
              "Comment nomme-t-on l'orateur traditionnel qui prononce le discours rituel ?",
            questionMg:
              "Ahoana no iantsoana ilay olona manana fahaizana mandahatra ny teny sy miteny amin'ny anaran'ny fianakaviana ?",
            choices: ['Mpikabary', 'Mpanjaka', 'Mpitsabo', 'Mpiandry omby'],
            correctIndex: 0,
            explanation:
              "Le « mpikabary » est l'orateur traditionnel garant des us et coutumes de la prise de parole.",
          },
          {
            type: 'quiz',
            question:
              'Quelle institution internationale a reconnu le Kabary comme patrimoine culturel immatériel ?',
            questionMg:
              "Inona ilay fikambanana iraisam-pirenena nanaiky ny Kabary malagasy ho vakoka tsy azo tsapain-tanana ho an'ny olombelona ?",
            choices: [
              "L'UNESCO",
              "L'UNICEF",
              "L'OMS",
              "L'Union Postale Universelle",
            ],
            correctIndex: 0,
            explanation:
              "Le Kabary malgache a été solennellement inscrit au patrimoine culturel immatériel de l'humanité par l'UNESCO.",
          },
          {
            type: 'quiz',
            question:
              'Que désignent les « Hainteny » dans la tradition littéraire orale malgache ?',
            questionMg:
              "Inona no atao hoe « Hainteny » eo amin'ny haisoratra am-bava malagasy ?",
            choices: [
              'Des joutes poétiques traditionnelles riches en métaphores et énigmes',
              'Des lois écrites sur du papier parchemin',
              'Des récits de chasse aux animaux sauvages',
              'Des chants religieux modernes',
            ],
            correctIndex: 0,
            explanation:
              "Les « Hainteny » (littéralement 'science de la parole') sont de savoureux poèmes traditionnels dialogués.",
          },
          {
            type: 'quiz',
            question:
              "Pourquoi les proverbes (ohabolana) sont-ils indispensables à la réussite d'un Kabary ?",
            questionMg:
              'Nahoana no tena ilaina ny ohabolana mandritra ny kabary ?',
            choices: [
              "Ils confèrent l'autorité ancestrale et éclairent les arguments avec finesse",
              'Pour faire durer le discours le plus longtemps possible',
              "Parce qu'il est interdit d'utiliser des mots normaux",
              "Pour endormir l'assemblée",
            ],
            correctIndex: 0,
            explanation:
              "Les proverbes apportent le sel, l'élégance et la profondeur morale indispensables à l'éloquence de l'orateur.",
          },
        ],
      },
      {
        slug: 'le-famadihana-fete-de-la-vie',
        title: 'Le Famadihana : retournement des morts et fête de la vie',
        titleMg: "Ny Famadihana : Fifamatorana Masina amin'ny Razana",
        summary:
          "Découvrez le sens profond du Famadihana : une grande fête joyeuse de réconciliation familiale et d'hommage aux ancêtres.",
        summaryMg:
          "Fantaro ny hevitra fototry ny Famadihana : fety lehibe iombonan'ny fianakaviana mampifandray ny velona sy ny Razana.",
        type: 'TRADITION',
        orderIndex: 3,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "Le Famadihana (retournement des morts) est l'un des rituels les plus emblématiques des Hautes Terres malgaches. Loin d'être triste, c'est une immense célébration de joie, de danse et d'unité familiale où l'on renouvelle les linceuls de soie des ancêtres.",
            textMg:
              'Ny Famadihana dia fomban-drazana lehibe ankalazana ny fifankatiavana sy ny fanajana ny Razana. Fety feno hafaliana, dihy sy mozika izy io, anehoana fa tsy mitsahatra ny fitiavana na dia efa lasa aza ny havana.',
          },
          {
            type: 'phonetic',
            letterOrSound: 'TS',
            phonetic: 'ts',
            frenchEquivalent:
              'Son composé explosif entre le « T » et le « S » (ex: Tsena, Tsodrano), très énergique.',
            sampleWordMg: 'Tsodrano',
            sampleTranslationFr: 'Bénédiction sacrée',
          },
          {
            type: 'concept',
            termMg: 'Famadihana',
            phonetic: 'fa-ma-di-ha-na',
            meaningFr:
              'Retournement des linceuls / Célébration périodique des ancêtres',
            explanation:
              'Rituel hautement solennel célébré en hiver austral (juin à septembre), rassemblant toute la descendance dispersée.',
          },
          {
            type: 'concept',
            termMg: 'Lamba landy',
            phonetic: 'lam-ba lan-di',
            meaningFr: 'Linceul précieux en soie sauvage pure',
            explanation:
              'Tissu traditionnel noble tissé à la main, destiné à réenvelopper les dépouilles des aïeux pour les protéger du froid.',
          },
          {
            type: 'concept',
            termMg: 'Fasana',
            phonetic: 'fa-sa-na',
            meaningFr:
              'Le tombeau familial ancestral (la vraie demeure éternelle)',
            explanation:
              "Monument de pierre sacré au centre du territoire familial, lieu où toute la lignée se réunira pour l'éternité.",
          },
          {
            type: 'concept',
            termMg: 'Mifamangy',
            phonetic: 'mi-fa-mang-i',
            meaningFr:
              'Se rendre visite mutuellement avec solidarité et compassion',
            explanation:
              'Devoir moral qui pousse chaque parent, même lointain, à venir assister et soutenir la famille lors de la fête.',
          },
          {
            type: 'example',
            textMg:
              "Tonga ny fotoana hamadihana an'ireo razantsika : miraisa hina ny fianakaviana manontolo !",
            textFr:
              "Le moment est venu d'honorer et d'envelopper nos ancêtres : que toute la famille se rassemble dans la paix et la joie !",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Pendant le Famadihana, les membres de la famille portent les corps enveloppés de soie sur leurs épaules et dansent autour du tombeau au rythme d'orchestres de cuivres traditionnels (*mpitsoka mozika*). Il est formellement interdit de pleurer : les larmes troubleraient la joie des retrouvailles avec les défunts !",
            textMg:
              "Fady ny mitomany mandritra ny famadihana. Mozika velona, fihirana sy dihy no entina mifaly miaraka amin'ny havana efa lasa, satria fety mampiray ny velona sy ny Razana izany.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Quelle est l'atmosphère dominante lors d'une cérémonie traditionnelle de Famadihana ?",
            questionMg:
              'Ahoana no rivo-piainana mandritra ny lanonana famadihana ?',
            choices: [
              'Une immense joie familiale avec danses, musiques et partages fraternels',
              'Une tristesse sombre avec interdiction totale de sourire',
              'Un silence absolu et sans aucune parole',
              'Une dispute obligatoire entre les familles',
            ],
            correctIndex: 0,
            explanation:
              'Le Famadihana est une fête de communion chaleureuse : les larmes sont fady car les vivants célèbrent la réunion avec leurs aïeux.',
          },
          {
            type: 'quiz',
            question:
              'Quel tissu noble et sacré est utilisé pour réenvelopper les ancêtres lors du Famadihana ?',
            questionMg:
              "Inona ilay lamba manan-kaja ampiasaina hamonosana ny taolambalon'ny Razana ?",
            choices: [
              'Ny Lamba landy (Soie sauvage naturelle précieuse)',
              'Du tissu synthétique ordinaire',
              'Des feuilles de bananier séchées',
              'Du plastique de protection',
            ],
            correctIndex: 0,
            explanation:
              "Le « lamba landy », tissé à partir de cocons de soie sauvage, est le vêtement d'honneur le plus noble à Madagascar.",
          },
          {
            type: 'quiz',
            question:
              "À quelle période de l'année le Famadihana est-il traditionnellement célébré ?",
            questionMg:
              "Amin'ny vanim-potoana inona amin'ny taona no fanaovana ny famadihana ?",
            choices: [
              "Pendant l'hiver austral (saison sèche et fraîche, entre juin et septembre)",
              'Au milieu de la saison des grandes pluies et des cyclones (janvier-février)',
              "Uniquement le jour de l'an",
              "N'importe quel jour au hasard",
            ],
            correctIndex: 0,
            explanation:
              "On célèbre le Famadihana pendant l'hiver austral (« ririnina » / « asotry »), période sèche propice aux rassemblements de plein air.",
          },
          {
            type: 'quiz',
            question:
              'Pourquoi les familles dansent-elles en portant les ancêtres autour du tombeau (Fasana) ?',
            questionMg:
              'Nahoana ny fianakaviana no mandihy mitondra ny Razana manodidina ny fasana ?',
            choices: [
              'Pour leur témoigner affection, joie filiale et leur faire partager la fête',
              'Pour vérifier si le tombeau est solide',
              'Pour effrayer les passants',
              'Par simple exercice physique',
            ],
            correctIndex: 0,
            explanation:
              "Porter et faire danser les défunts entourés de la famille est un acte d'amour et de piété filiale suprême.",
          },
          {
            type: 'quiz',
            question:
              "Quel est l'impact social fondamental du Famadihana sur la communauté ?",
            questionMg:
              "Inona no voka-tsoa lehibe entin'ny famadihana eo amin'ny fiaraha-monina sy ny fianakaviana ?",
            choices: [
              'Ressouder les liens de parenté, réconcilier les membres éloignés et raffermir le Fihavanana',
              'Diviser définitivement les villages en clans rivaux',
              "Obliger les familles à déménager à l'étranger",
              'Vendre les terres des ancêtres aux enchères',
            ],
            correctIndex: 0,
            explanation:
              "Le Famadihana cimente l'unité : les cousins et parents dispersés aux quatre coins du pays se retrouvent, effacent leurs querelles et s'entraident.",
          },
        ],
      },
      {
        slug: 'le-fitampoha-et-le-bain-des-reliques',
        title: "Le Fitampoha : le bain sacré des reliques royales Sakalava",
        titleMg: "Ny Fitampoha : Fandroan-Dady any amin'ny Menabe",
        summary:
          "Découvrez le plus grand rassemblement rituel du Menabe : l'immersion sacrée des reliques des rois Sakalava dans le fleuve Tsiribihina.",
        summaryMg:
          "Fantaro ny fomban-drazana lehibe any Menabe : ny fandroana ireo Dady masina ao amin'ny reniranon'i Tsiribihina.",
        type: 'TRADITION',
        orderIndex: 4,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "Sur les rives majestueuses du fleuve Tsiribihina, dans la région du Menabe, le **Fitampoha** (« le bain des reliques ») est l'une des cérémonies sacrées les plus grandioses de Madagascar. Tous les cinq ans, le peuple Sakalava se rassemble pour laver rituellement les reliques sacrées (*Dady*) des grands souverains défunts (notamment Radama Ier, Andriamisara et leurs ancêtres), renouvelant l'alliance mystique entre les vivants, la terre et la royauté sacrée.",
            textMg:
              "Any amin'ny moron'ny renirano Tsiribihina ao Menabe, ny **Fitampoha** no fomba masina lehibe indrindra. Isaky ny dimy taona, ny vahoaka Sakalava dia miangona hanasa ireo **Dady** na taolambalon'ireo Mpanjaka lehibe fahiny, mba hanavao ny fanekena sy ny tsodrano ho an'ny vahoaka sy ny tany.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'DADY',
            phonetic: 'da-di',
            frenchEquivalent:
              "Terme sacré prononcé nettement, désignant les reliques royales vénérées conservées dans le sanctuaire du Doany.",
            sampleWordMg: 'Dady',
            sampleTranslationFr: 'Reliques sacrées des souverains royaux Sakalava',
          },
          {
            type: 'concept',
            termMg: 'Dady',
            phonetic: 'da-di',
            meaningFr: "Les reliques corporelles sacrées des anciens rois du Menabe",
            explanation:
              "Objets hautement sacrés (dents, ossements, vertèbres) enveloppés d'étoffes royales et conservés au Doany (sanctuaire royal).",
          },
          {
            type: 'concept',
            termMg: 'Fitampoha',
            phonetic: 'fi-tam-pou-ha',
            meaningFr: "« Le bain des reliques » / La grande ablution royale",
            explanation:
              "Rite de purification et de revivification au cours duquel les reliques sont immergées avec solennité dans l'eau vive du fleuve.",
          },
          {
            type: 'concept',
            termMg: 'Mpibasy sy Mpitoka',
            phonetic: 'mpi-ba-si si mpi-tou-ka',
            meaningFr: "Gardiens de la tradition armés de fusils et déclamateurs d'invocations",
            explanation:
              "Dignitaires traditionnels qui escortent le cortège royal et invoquent la bienveillance des esprits ancestraux.",
          },
          {
            type: 'concept',
            termMg: 'Tromba',
            phonetic: 'troum-ba',
            meaningFr: "Possession spirituelle rituelle par l'esprit d'un roi défunt",
            explanation:
              "État mystique durant lequel l'esprit du souverain s'exprime à travers un médium (*mpiantse*) pour conseiller et guider le peuple.",
          },
          {
            type: 'example',
            textMg:
              "Tonga marobe ny vahoaka teo amoron'i Tsiribihina nahita ny fandroan'ireo Dady masina.",
            textFr:
              "Le peuple s'est réuni en foule sur les rives de la Tsiribihina pour assister au bain sacré des reliques royales.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Pendant toute la durée du Fitampoha (qui dure plus d'une semaine sur un banc de sable sacré de la Tsiribihina), un campement éphémère de plusieurs dizaines de milliers de personnes vit sous des règles strictes d'harmonie, de propreté et de paix absolue : toute dispute ou parole blessante y est rigoureusement taboue (Fady).",
            textMg:
              "Mandritra ny Fitampoha eo amin'ny fasika masina ao Tsiribihina, olona an'aliny maro no miara-monina am-pilaminana tanteraka : fady mafy ny mifamaly na miteny ratsy mandritra ny fankalazana.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Dans quelle grande région et sur quel fleuve emblématique est célébré le Fitampoha ?",
            questionMg:
              "Any amin'ny faritra aiza sy amin'ny renirano inona no anatanterahana ny Fitampoha ?",
            choices: [
              "Dans le Menabe, sur les rives du fleuve Tsiribihina",
              "Dans les Hautes Terres, sur la rivière Ikopa",
              "Sur l'île de Sainte-Marie dans l'océan Indien",
              "Au sommet du mont Maromokotro",
            ],
            correctIndex: 0,
            explanation:
              "Le Fitampoha est célébré par le peuple Sakalava du Menabe sur un banc de sable sacré du fleuve Tsiribihina.",
          },
          {
            type: 'quiz',
            question:
              "Que désignent précisément les « Dady » immergés rituellement lors du Fitampoha ?",
            questionMg:
              "Inona marina moa ireo antsoina hoe « Dady » sasana mandritra ny Fitampoha ?",
            choices: [
              "Les reliques sacrées des anciens souverains royaux du Menabe",
              "Des statuettes en argile cuite",
              "Des parchemins écrits en Sorabe",
              "Des instruments de musique en cuivre",
            ],
            correctIndex: 0,
            explanation:
              "Les Dady sont les reliques corporelles sacrées des rois fondateurs, conservées au sanctuaire du Doany.",
          },
          {
            type: 'quiz',
            question:
              "Quelle est la signification spirituelle majeure de cette immersion rituelle ?",
            questionMg:
              "Inona no hevitra ara-panahy lehibe fonosin'ny fandroana ny Dady ?",
            choices: [
              "Purifier les reliques, renouveler la fertilité de la terre et sceller la bénédiction royale",
              "Célébrer la fin des récoltes de riz uniquement",
              "Préparer une expédition maritime militaire",
              "Désigner le vainqueur d'un tournoi sportif",
            ],
            correctIndex: 0,
            explanation:
              "L'ablution sacrée purifie les reliques, régénère l'énergie de la nature et renouvelle le pacte de protection avec les ancêtres.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on la transe rituelle au cours de laquelle un esprit royal parle à travers un médium ?",
            questionMg:
              "Ahoana no iantsoana ny fisehoan'ny fanahin'ny mpanjaka amin'ny alalan'ny mpiantse ?",
            choices: ['Le Tromba', 'Le Kabary', 'Le Hira Gasy', 'Le Famadihana'],
            correctIndex: 0,
            explanation:
              "Le Tromba est l'institution spirituelle par laquelle l'esprit d'un grand roi défunt s'exprime pour guider sa communauté.",
          },
          {
            type: 'quiz',
            question:
              "Quelle règle de conduite fondamentale s'impose à tous les pèlerins sur le banc de sable sacré ?",
            questionMg:
              "Inona ilay fepetra tsy maintsy hajain'ny rehetra mandritra ny Fitampoha ?",
            choices: [
              "La concorde absolue, la paix et l'interdiction totale de disputes (Fady)",
              "Le port d'armes à feu pour tous les enfants",
              "Le jeûne total sans eau pendant sept jours",
              "L'interdiction de parler à ses voisins",
            ],
            correctIndex: 0,
            explanation:
              "Le site sacré du Fitampoha est un sanctuaire de paix où toute animosité ou querelle est rigoureusement bannie.",
          },
        ],
      },
      {
        slug: 'le-tsaboraha-et-le-sacrifice-du-zebe',
        title: "Le Tsaboraha et le sacrifice du zébu : alliance, prière et partage",
        titleMg: "Ny Tsaboraha sy ny Sorona Omby : Fanolorana sy Fifampizarana",
        summary:
          "Comprenez la dimension sacrée du sacrifice du zébu : prières aux ancêtres (Joro), répartition rituelle et solidarité.",
        summaryMg:
          "Ianaro ny lanjan'ny sorona omby sy ny Tsaboraha : ny joro, ny hasina ary ny fizarana nofon-kena mitam-pihavanana.",
        type: 'TRADITION',
        orderIndex: 5,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "Dans la tradition malgache, l'abattage d'un zébu n'est jamais un acte purement profane : c'est un acte sacrificiel solennel appelé **Sorona** ou **Joro**, particulièrement magnifié lors du **Tsaboraha** (fête rituelle commémorative chez les Betsimisaraka et autres peuples de Madagascar). Le zébu, bien le plus précieux légué par les ancêtres, est offert pour sceller une alliance, remercier Zanahary ou demander la pluie et la santé de la lignée.",
            textMg:
              "Eo amin'ny kolontsaina malagasy, ny famonoana omby dia tsy fihinanana fotsiny fa fanolorana masina antsoina hoe **Sorona** na **Joro**, indrindra amin'ny **Tsaboraha**. Ny omby, izay fananana sarobidy indrindra avy amin'ny razana, dia atolotra ho fisaorana an'Andriamanitra sy ny Razana ary ifampizarana amin'ny mpiara-belona.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'JORO',
            phonetic: 'dzou-rou',
            frenchEquivalent:
              "Le « J » malgache se prononce « DZ » appuyé (ex: Joro, Zanahary).",
            sampleWordMg: 'Joro',
            sampleTranslationFr: 'Invocation rituelle solennelle et prière sacrificielle',
          },
          {
            type: 'concept',
            termMg: 'Tsaboraha',
            phonetic: 'tsa-bou-ra-ha',
            meaningFr: "Grande fête rituelle et cérémonielle familiale et villageoise",
            explanation:
              "Célébration traditionnelle (notamment à l'Est) marquant l'accomplissement d'un vœu, un deuil ou une réunion de famille.",
          },
          {
            type: 'concept',
            termMg: 'Joro',
            phonetic: 'dzou-rou',
            meaningFr: "Prière d'invocation solennelle adressée à Zanahary et aux Razana",
            explanation:
              "Prière prononcée devant le poteau sacrificiel avant l'immolation du zébu pour solliciter la bénédiction et la paix.",
          },
          {
            type: 'concept',
            termMg: 'Hazomanga',
            phonetic: 'ha-zou-man-ga',
            meaningFr: "Le poteau sacrificiel sacré du clan ou de la lignée",
            explanation:
              "Pieu en bois noble érigé au village où le patriarche (mpitoka hazomanga) célèbre les rituels et bénit la descendance.",
          },
          {
            type: 'concept',
            termMg: 'Nofon-kena mitam-pihavanana',
            phonetic: 'nou-foun ke-na mi-tam-pi-ha-va-na-na',
            meaningFr: "La part de viande qui consolide le lien fraternel",
            explanation:
              "Règle séculaire selon laquelle chaque morceau de viande est distribué selon un ordre hiérarchique strict (vodivena pour les aînés), nourrissant tout le village sans exception.",
          },
          {
            type: 'example',
            textMg:
              "Nanao joro teo amin'ny hazomanga ny raiamandreny talohan'ny nanolorana ny omby.",
            textFr:
              "Le patriarche a prononcé la prière sacrée (joro) devant le poteau traditionnel avant d'offrir le zébu.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le partage de la viande sacrificielle obéit à une géométrie sociale d'une précision absolue : la croupe (*vodi-kena*) revient de droit aux anciens et chefs de famille en signe d'allégeance et de respect filial, tandis que le foie et les morceaux tendres sont réservés aux femmes enceintes et aux enfants.",
            textMg:
              "Ny fizarana ny hena amin'ny fomba malagasy dia manaja lamina hentitra : ny vodi-kena dia an'ny raiamandreny sy ny zokiolona ho mariky ny haja, ary ny nofo malefaka kosa dia omena ny zaza sy ny vehivavy bevohoka.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Qu'est-ce que le « Joro » dans la tradition sacrificielle malgache ?",
            questionMg:
              "Inona no atao hoe « Joro » eo amin'ny fomban-drazana malagasy ?",
            choices: [
              "Une prière rituelle d'invocation adressée à Zanahary et aux Ancêtres",
              "Un instrument de percussion en peau de zébu",
              "Une danse guerrière exécutée avant le combat",
              "Une boisson fermentée à base de miel",
            ],
            correctIndex: 0,
            explanation:
              "Le « Joro » est l'acte de prière et d'invocation solennelle qui confère tout son sens spirituel au sacrifice.",
          },
          {
            type: 'quiz',
            question:
              "Quel monument sacré du village sert d'autel pour le sacrifice du zébu et les bénédictions ?",
            questionMg:
              "Inona ilay tsangambato hazo masina eo an-tanàna anaovana ny sorona sy ny tsodrano ?",
            choices: [
              "Le Hazomanga (poteau sacré du clan)",
              "Le Hadivory (fossé circulaire)",
              "Ny Tranovola",
              "Ny Valam-parihy",
            ],
            correctIndex: 0,
            explanation:
              "Le « Hazomanga » est le poteau sacrificiel en bois noble autour duquel se réunit la famille sous la conduite du patriarche.",
          },
          {
            type: 'quiz',
            question:
              "Quelle expression célèbre illustre le partage de la viande qui resserre la solidarité ?",
            questionMg:
              "Inona ilay ohabolana na fomba fiteny milaza ny fizarana hena mampiray ny fianakaviana ?",
            choices: [
              "« Nofon-kena mitam-pihavanana »",
              "« Tsy misy hena tsy misy taolana »",
              "« Vola latsaka an-kady »",
              "« Lasa rano nisasana »",
            ],
            correctIndex: 0,
            explanation:
              "« Nofon-kena mitam-pihavanana » résume l'esprit du partage : la viande offerte nourrit l'harmonie et la fraternité communautaire.",
          },
          {
            type: 'quiz',
            question:
              "Quelle part du zébu sacrificiel est traditionnellement offerte aux aînés et aux parents en signe de respect ?",
            questionMg:
              "Inona ilay anjara hena omena ny raiamandreny ho mariky ny fanajana sy ny haja ?",
            choices: [
              "Le Vodi-kena (la croupe sacrée)",
              "Les sabots du zébu",
              "La corne gauche uniquement",
              "La peau brute",
            ],
            correctIndex: 0,
            explanation:
              "Le « Vodi-kena » (la croupe) est le morceau noble dévolu par coutume aux aînés et détenteurs de l'autorité morale.",
          },
          {
            type: 'quiz',
            question:
              "Quelle fête rituelle commémorative est particulièrement réputée chez les Betsimisaraka ?",
            questionMg:
              "Inona ilay fety nentim-paharazana malaza indrindra any amin'ny faritra Betsimisaraka ?",
            choices: ['Le Tsaboraha', 'Le Fanorona', 'Le Moraingy', 'Le Ringa'],
            correctIndex: 0,
            explanation:
              "Le Tsaboraha est la fête rituelle emblématique de rassemblement et de sacrifices chez les Betsimisaraka.",
          },
        ],
      },
      {
        slug: 'le-sambatra-et-la-circoncision-rituelle',
        title: "Le Sambatra : la grande fête septennale de la circoncision à Mananjary",
        titleMg: "Ny Sambatra : Fankalazana Isaky ny Fito Taona ao Mananjary",
        summary:
          "Explorez la grandiose fête du Sambatra chez les Antambahoaka : rite de passage, dignité masculine et ferveur collective.",
        summaryMg:
          "Fantaro ny fety miezinezina fanaon'ny Antambahoaka : fampidirana ny zazalahy ho lehilahy vanona sy tompon'andraikitra.",
        type: 'TRADITION',
        orderIndex: 6,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "À Mananjary, sur la côte sud-est de Madagascar, les **Antambahoaka** célèbrent tous les sept ans une fête spectaculaire unique au monde : le **Sambatra**. Durant un mois entier de festivités, de processions en costumes rouges et de danses martiales, des centaines de jeunes garçons sont circoncis rituellement au bord de l'embouchure, accédant ainsi au rang d'hommes accomplis (*Lehilahy vanona*), intégrés à la communauté et bénis par leurs ancêtres.",
            textMg:
              "Ao Mananjary, eo amin'ny morontsiraka atsimo atsinanana, ny foko **Antambahoaka** dia mankalaza ny **Sambatra** isaky ny fito taona. Mandritra ny iray volana feno lanonana, fitafiana mena ary filaharana makotrokotroka, ireo zazalahy kely rehetra dia didiana amin'ny fomba nentim-paharazana mba ho tonga lehilahy tompon'andraikitra sy mahazo ny tsodranon'ny razana.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'SAMBATRA',
            phonetic: 'sam-ba-tsa',
            frenchEquivalent:
              "Le mot « Sambatra » signifie étymologiquement « Heureux / Béni » en langue malgache.",
            sampleWordMg: 'Sambatra',
            sampleTranslationFr: 'Fête septennale sacrée / Félicité et bénédiction',
          },
          {
            type: 'concept',
            termMg: 'Sambatra',
            phonetic: 'sam-ba-tsa',
            meaningFr: "La fête septennale sacrée de la circoncision collective",
            explanation:
              "Célébration historique fondée selon la tradition par Raminia, ancêtre fondateur des Antambahoaka venu d'outre-mer.",
          },
          {
            type: 'concept',
            termMg: 'Lehilahy vanona',
            phonetic: 'le-hi-la-hi va-nou-na',
            meaningFr: "L'homme intègre, accompli, responsable et digne",
            explanation:
              "Statut moral et social acquis par le jeune garçon après la circoncision, lui permettant d'entrer dans la lignée des ancêtres.",
          },
          {
            type: 'concept',
            termMg: 'Lamba mena sy Malabary',
            phonetic: 'lam-ba me-na si ma-la-ba-ri',
            meaningFr: "Les tuniques écarlates et coiffes traditionnelles des pèlerins",
            explanation:
              "Tenue de fête flamboyante portée par les pères et les enfants lors de la descente solennelle vers l'embouchure du fleuve.",
          },
          {
            type: 'concept',
            termMg: 'Trano fandraiky',
            phonetic: 'tsa-nou fan-drye-ki',
            meaningFr: "La case royale traditionnelle du village de Mananjary",
            explanation:
              "Lieu sacré où sont conservés les étendards, les tambours rituels et les généalogies des douze clans Antambahoaka.",
          },
          {
            type: 'example',
            textMg:
              "Feno hafaliana ny tanànan'i Mananjary nandritra ny fankalazana ny Sambatra.",
            textFr:
              "La ville de Mananjary a vibré de joie et de ferveur tout au long de la célébration du Sambatra.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Le point d'orgue du Sambatra est la spectaculaire procession militaire symbolique : des milliers d'hommes armés de lances de bois et vêtus de rouge miment une bataille héroïque pour purifier la route menant les enfants jusqu'à la mer sacrée (Vinany).",
            textMg:
              "Ny tena mampitolagaga amin'ny Sambatra dia ny filaharana lehibe an-dranomasina : lehilahy an'arivony mitafy mena sy mitondra lefona hazo no maneho ny herim-pon'ny razana mandra-pahatonga any amin'ny vinany.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "À quelle fréquence périodique est célébrée la grande fête du Sambatra à Mananjary ?",
            questionMg:
              "Isaky ny firy taona no anatanterahana ny fankalazana ny Sambatra ao Mananjary ?",
            choices: [
              "Tous les sept ans (fête septennale)",
              "Chaque année au mois de janvier",
              "Tous les cinquante ans",
              "Tous les deux ans",
            ],
            correctIndex: 0,
            explanation:
              "Le Sambatra est une célébration septennale qui a lieu fidèlement tous les sept ans selon le calendrier coutumier.",
          },
          {
            type: 'quiz',
            question:
              "Quel peuple du sud-est de Madagascar est le gardien historique de la tradition du Sambatra ?",
            questionMg:
              "Iza ilay foko tompon'ny fomban-drazana Sambatra any atsimo atsinanana ?",
            choices: [
              "Le peuple Antambahoaka",
              "Le peuple Merina",
              "Le peuple Bara",
              "Le peuple Mahafaly",
            ],
            correctIndex: 0,
            explanation:
              "Le Sambatra est la tradition la plus sacrée et prestigieuse du peuple Antambahoaka de Mananjary.",
          },
          {
            type: 'quiz',
            question:
              "Quel est le rôle social et spirituel fondamental de cette circoncision rituelle ?",
            questionMg:
              "Inona no tanjona ara-tsosialy sy ara-panahy amin'ity hasoavan-jaza ity ?",
            choices: [
              "Faire accéder les jeunes garçons au rang d'hommes intègres (Lehilahy vanona) bénis par les ancêtres",
              "Préparer les enfants à quitter définitivement leur région",
              "Organiser un concours de danse moderne",
              "Remplacer les études scolaires obligatoires",
            ],
            correctIndex: 0,
            explanation:
              "La circoncision fait du garçon un « lehilahy vanona », membre à part entière de la famille spirituelle et sociale.",
          },
          {
            type: 'quiz',
            question:
              "Quelle couleur vestimentaire spectaculaire domine le cortège lors des processions du Sambatra ?",
            questionMg:
              "Inona ilay loko marevaka iombonan'ireo mpilahatra mandritra ny Sambatra ?",
            choices: [
              "Le rouge écarlate (Lamba mena sy Malabary)",
              "Le vert pomme",
              "Le bleu marine uniquement",
              "Le noir complet de deuil",
            ],
            correctIndex: 0,
            explanation:
              "Les tuniques écarlates (malabary mena) symbolisent la vie, le courage royal et la force spirituelle.",
          },
          {
            type: 'quiz',
            question:
              "Vers quel lieu naturel sacré convergent les pèlerins pour le dénouement de la cérémonie ?",
            questionMg:
              "Mankany amin'ny toerana voajanahary aiza no iombonan'ny filaharana lehibe ?",
            choices: [
              "L'embouchure où le fleuve rencontre la mer (Vinany)",
              "Au fond d'une grotte souterraine",
              "Dans un désert de sel",
              "Au sommet d'un baobab géant",
            ],
            correctIndex: 0,
            explanation:
              "Le cortège se rend solennellement à l'embouchure (Vinany) où les eaux fluviales purificatrices rejoignent l'océan.",
          },
        ],
      },
      {
        slug: 'le-taom-baovao-malagasy-et-l-alahamady',
        title: "Le Taom-baovao Malagasy et l'Alahamady : renouveau, pardon et concorde",
        titleMg: "Ny Taom-baovao Malagasy sy ny Alahamady : Famelan-keloka sy Fihavanana",
        summary:
          "Revivez les rituels du Nouvel An malgache : le feu perpétuel (Afo tsy maty), le bain de purification (Fandroana) et le pardon mutuel.",
        summaryMg:
          "Tsarovy ireo fomba amam-panao amin'ny Taom-baovao : ny Afo tsy maty, ny Fandroana ary ny fihavanana amin'ny vary amin-dronono tondrahana tantely.",
        type: 'TRADITION',
        orderIndex: 7,
        durationMinutes: 8,
        sections: [
          {
            type: 'intro',
            textFr:
              "À l'apparition de la première nouvelle lune du mois d'**Alahamady** (premier signe du zodiaque malgache ancestral), Madagascar célèbre le **Taom-baovao Malagasy** (le Nouvel An traditionnel). Ce temps sacré est avant tout celui du renouveau cosmique et de la réconciliation : on allume le feu perpétuel (**Afo tsy maty**), on procède aux ablutions de purification (**Fandroana**) et l'on partage le repas de concorde (**Vary amin-dronono tondrahana tantely**) en s'accordant un pardon réciproque sincère.",
            textMg:
              "Rehefa tsinana ny tsinam-bolana voalohany amin'ny volana **Alahamady**, dia mankalaza ny **Taom-baovao Malagasy** ny vahoaka. Fotoana masina ho an'ny fanavaozana sy ny fampihavanana izany : arehitra ny **Afo tsy maty**, atao ny **Fandroana** fanadiovana, ary ifampizarana ny **Vary amin-dronono tondrahana tantely** sady mifamela heloka ny rehetra mba hiditra madio ao amin'ny taona vaovao.",
          },
          {
            type: 'phonetic',
            letterOrSound: 'FANDROANA',
            phonetic: 'fan-drou-a-na',
            frenchEquivalent:
              "Dérive du verbe « mandro » (se laver, se purifier dans l'eau sacrée).",
            sampleWordMg: 'Fandroana',
            sampleTranslationFr: 'Bain sacré de purification / Fête royale du Nouvel An',
          },
          {
            type: 'concept',
            termMg: 'Alahamady',
            phonetic: 'a-la-ha-ma-di',
            meaningFr: "Le premier signe astrologique du Vintana malgache / Mois royal",
            explanation:
              "Signe de la royauté, de la noblesse d'âme et du commencement, associé au point cardinal Nord-Est.",
          },
          {
            type: 'concept',
            termMg: 'Afo tsy maty',
            phonetic: 'a-fou tsi ma-ti',
            meaningFr: "« Le feu perpétuel » allumé la veille du Nouvel An",
            explanation:
              "Brasier allumé dans la nuit pour dissiper les ténèbres et symboliser la vitalité continue du peuple et de la descendance.",
          },
          {
            type: 'concept',
            termMg: 'Fandroana',
            phonetic: 'fan-drou-a-na',
            meaningFr: "L'ablution sacrée de purification",
            explanation:
              "Bain rituel au cours duquel le souverain ou le patriarche aspergeait le peuple avec l'eau sacrée en prononçant des vœux de santé (*Tsodrano*).",
          },
          {
            type: 'concept',
            termMg: 'Vary amin-dronono tondrahana tantely',
            phonetic: 'va-ri a-min drou-nou-nou toun-dra-ha-na tan-te-li',
            meaningFr: "Riz au lait nappé de miel sauvage",
            explanation:
              "Mets sacré de concorde partagé par tous, symbolisant la douceur de vivre, la pureté et l'abondance partagée.",
          },
          {
            type: 'example',
            textMg:
              "Tratry ny taona vaovao, samy ho velon-ko taiza ka ho tahin-Janahary sy ny Razana !",
            textFr:
              "Joyeux Nouvel An à tous, que chacun vive dans la paix, la santé et la bénédiction de Dieu et des Ancêtres !",
          },
          {
            type: 'didYouKnow',
            textFr:
              "La règle cardinale du Taom-baovao Malagasy était l'obligation d'effacer toutes les dettes morales et les rancœurs avant le lever du jour : il était formellement interdit d'entrer dans la nouvelle année avec une colère au cœur envers son semblable.",
            textMg:
              "Ny fitsipika volamena tamin'ny Taom-baovao malagasy dia ny famelan-keloka tanteraka : tsy azo atao ny miditra amin'ny taona vaovao raha mbola misy lolom-po na disadisa tsy voavaha eo amin'ny mpiray tanindrazana.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "Sous quel signe astrologique lunaire ancestral est traditionnellement célébré le Taom-baovao Malagasy ?",
            questionMg:
              "Amin'ny volana vintana inona no ankalazana ny Taom-baovao Malagasy ?",
            choices: [
              "Le mois d'Alahamady (signe royal du renouveau)",
              "Le mois d'Adimizana",
              "Le mois d'Alakarabo",
              "Le mois d'Asombola",
            ],
            correctIndex: 0,
            explanation:
              "L'Alahamady est le premier mois du calendrier luni-solaire malgache, dédié à la royauté et au renouveau cosmique.",
          },
          {
            type: 'quiz',
            question:
              "Quel plat rituel hautement symbolique est partagé lors du Nouvel An malgache ?",
            questionMg:
              "Inona ilay hanim-py masina ifampizarana amin'ny Taom-baovao ?",
            choices: [
              "Le Vary amin-dronono tondrahana tantely (riz au lait au miel)",
              "Le Koba ravina froid",
              "Des beignets salés uniquement",
              "Du poisson séché au piment fort",
            ],
            correctIndex: 0,
            explanation:
              "Le riz au lait nappé de miel (vary amin-dronono tondrahana tantely) symbolise la félicité, la pureté et l'abondance.",
          },
          {
            type: 'quiz',
            question:
              "Quelle obligation morale majeure précède le passage à la nouvelle année dans la tradition malgache ?",
            questionMg:
              "Inona ilay adidy ara-pitondran-tena lehibe takina amin'ny rehetra alohan'ny taona vaovao ?",
            choices: [
              "Le pardon réciproque sincère et l'apaisement de toutes les rancœurs",
              "L'achat de vêtements neufs importés",
              "La fermeture complète de toutes les maisons",
              "L'exil temporaire des jeunes hors du village",
            ],
            correctIndex: 0,
            explanation:
              "Le pardon mutuel (famelan-keloka) est au cœur du rite : nul ne peut accueillir le Nouvel An sans être réconcilié.",
          },
          {
            type: 'quiz',
            question:
              "Que symbolise le « Fandroana » (bain sacré) pratiqué lors du Nouvel An ?",
            questionMg:
              "Inona no hevitra fonosin'ny « Fandroana » amin'ny fiandohan'ny taona ?",
            choices: [
              "La purification des souillures de l'année écoulée et la renaissance de la vie",
              "Une simple épreuve de natation sportive",
              "Un concours de beauté villageois",
              "L'apprentissage de la pêche pour les enfants",
            ],
            correctIndex: 0,
            explanation:
              "Le Fandroana est une régénération symbolique : l'eau vive purifie les fautes passées pour entamer un cycle neuf et fertile.",
          },
          {
            type: 'quiz',
            question:
              "Quel symbole nocturne représente la pérennité de la descendance et de la patrie ?",
            questionMg:
              "Inona ilay marika mirehitra amin'ny alina maneho ny fitohizan'ny aina sy ny taranaka ?",
            choices: [
              "L'« Afo tsy maty » (le feu perpétuel)",
              "Un feu d'artifice moderne",
              "Une lanterne chinoise volante",
              "Une bougie parfumée",
            ],
            correctIndex: 0,
            explanation:
              "L'« Afo tsy maty » (feu perpétuel) célèbre la flamme vivante du peuple et de la descendance qui ne doit jamais s'éteindre.",
          },
        ],
      },
    ],
  },
  {
    slug: 'histoire-de-madagascar',
    title: 'Histoire de Madagascar',
    titleMg: "Tantaran'i Madagasikara",
    description:
      "Explorez la grande fresque historique de la Grande Île : les origines austronésiennes et bantoues, les souverains réformateurs, les reines illustres, les luttes patriotiques et les collines sacrées.",
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
          "Les origines et le peuplement : la double racine austronésienne et africaine",
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
              "Le groupe « AO » se prononce comme un « O » ouvert et clair en malgache standard (ex: Ntaolo, Aotroneziana).",
            sampleWordMg: 'Ntaolo',
            sampleTranslationFr: 'Les Anciens / Les ancêtres premiers',
          },
          {
            type: 'concept',
            termMg: 'Vahoaka Ntaolo',
            phonetic: 'va-houa-ka n-ta-ou-lou',
            meaningFr: "Les premiers habitants et ancêtres pionniers de la Grande Île",
            explanation:
              "Désigne avec déférence les premières générations de navigateurs et de pionniers qui ont défriché et nommé la terre malgache.",
          },
          {
            type: 'concept',
            termMg: 'Lakana misy vava',
            phonetic: 'la-ka-na mi-si va-va',
            meaningFr: "La pirogue à balancier océanique",
            explanation:
              "Chef-d'œuvre de la technologie maritime austronésienne qui a permis de braver les houles de l'océan Indien sur plus de 6 000 kilomètres.",
          },
          {
            type: 'concept',
            termMg: 'Vary sy Tanimbary',
            phonetic: 'va-ri si ta-nim-ba-ri',
            meaningFr: "Le riz irrigué et la rizière aménagée",
            explanation:
              "Technique agricole magistrale importée d'Asie du Sud-Est, devenue le pilier économique, alimentaire et rituel de la société malgache.",
          },
          {
            type: 'concept',
            termMg: 'Fitaovana vy sy Omby',
            phonetic: 'fi-ta-ou-va-na vi si oum-bi',
            meaningFr: "La métallurgie du fer et le cheptel de zébus",
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
              "Quelles sont les deux grandes vagues migratoires fondatrices du peuple malgache ?",
            questionMg:
              "Inona ireo onjam-pifindran-monina lehibe roa nanorina ny vahoaka malagasy ?",
            choices: [
              "Les navigateurs austronésiens (Asie du Sud-Est) et les populations bantoues (Afrique de l'Est)",
              "Uniquement des explorateurs européens au XIXe siècle",
              "Des tribus nomades de Sibérie boréale",
              "Des marins marchands uniquement venus de Méditerranée",
            ],
            correctIndex: 0,
            explanation:
              "L'archéologie, la linguistique et la génétique confirment la fusion féconde entre les navigateurs austronésiens et les populations bantoues.",
          },
          {
            type: 'quiz',
            question:
              "À quelle grande famille linguistique appartient la langue malgache ?",
            questionMg:
              "Ao amin'ny fianakaviam-piteny inona no misy ny teny malagasy ?",
            choices: [
              "La famille des langues austronésiennes (malayo-polynésiennes)",
              "La famille des langues indo-européennes",
              "La famille des langues sémitiques",
              "La famille des langues sino-tibétaines",
            ],
            correctIndex: 0,
            explanation:
              "Le malgache est une langue austronésienne occidentale, présentant une parenté frappante avec les parlers de l'île de Bornéo en Indonésie.",
          },
          {
            type: 'quiz',
            question:
              "Quelle culture vivrière essentielle a été introduite par les navigateurs austronésiens ?",
            questionMg:
              "Inona ilay fambolena fototra nentin'ireo tantsambo aotroneziana teto Madagasikara ?",
            choices: [
              "La culture du riz irrigué en rizières aménagées (Tanimbary)",
              "La culture du blé d'hiver",
              "La plantation d'oliviers",
              "La culture exclusive du maïs",
            ],
            correctIndex: 0,
            explanation:
              "La riziculture inondée (vary sy tanimbary) constitue le legs agraire majeur des navigateurs austronésiens, au cœur de l'identité malgache.",
          },
          {
            type: 'quiz',
            question:
              "Quel apport pastoral et matériel majeur provient des migrations bantoues africaines ?",
            questionMg:
              "Inona ny harena lehibe teo amin'ny fiompiana sy ny asa vy nentin'ny fifindran-monina banto ?",
            choices: [
              "L'élevage du zébu (omby) et la métallurgie du fer",
              "L'élevage des rennes polaires",
              "La construction de bateaux à vapeur",
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
              "La pirogue à balancier (lakana misy vava)",
              "Une galère romaine en bois de chêne",
              "Un canot pneumatique moderne",
              "Un grand paquebot métallique",
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
          "Les Reines illustres de Madagascar : souveraineté, diplomatie et résistance",
        titleMg: "Ireo Mpanjakavavy Malagasy : Ranavalona I, Rasoherina sy Ranavalona III",
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
              "Le « V » malgache se prononce nettement comme en français (ex: Vohitra, Vahoaka, Ranavalona).",
            sampleWordMg: 'Ranavalona',
            sampleTranslationFr: "Nom des illustres souveraines malgaches",
          },
          {
            type: 'concept',
            termMg: 'Fiandrianam-pirenena',
            phonetic: 'fi-an-dri-a-nam-pi-re-ne-na',
            meaningFr: "La souveraineté nationale / L'indépendance sacrée de la patrie",
            explanation:
              "Principe fondamental défendu avec ferveur par la monarchie malgache, affirmant qu'aucune puissance étrangère ne peut asservir le sol des ancêtres.",
          },
          {
            type: 'concept',
            termMg: 'Ranavalona Ire (1828-1861)',
            phonetic: 'ra-na-va-lou-na vo-a-lou-ha-ni',
            meaningFr: "Souveraine intraitable, gardienne des traditions et de l'indépendance",
            explanation:
              "Elle développa l'artisanat national, les forges d'armes de Mantasoa avec Jean Laborde et refusa fermement toute ingérence étrangère.",
          },
          {
            type: 'concept',
            termMg: 'Ranavalona III (1883-1897)',
            phonetic: 'ra-na-va-lou-na fa-ha-te-lou',
            meaningFr: "Dernière reine de Madagascar, icône de dignité et de résistance morale",
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
              "Ranavalona III dia naneho fahamendrehana sy fitiavan-tanindrazana lehibe manoloana ny fisedrana.",
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
              "Quelle souveraine malgache a défendu vigoureusement la souveraineté nationale de 1828 à 1861 ?",
            questionMg:
              "Iza ilay Mpanjakavavy niaro mafy ny fiandrianam-pirenena tamin'ny taona 1828 ka hatramin'ny 1861 ?",
            choices: [
              "Ranavalona Ire",
              "Marie-Antoinette",
              "La reine Victoria",
              "Cléopâtre",
            ],
            correctIndex: 0,
            explanation:
              "Ranavalona Ire a régné pendant 33 ans en consolidant l'autosuffisance, l'artisanat national et la souveraineté de Madagascar.",
          },
          {
            type: 'quiz',
            question:
              "Qui fut la dernière reine souveraine de Madagascar avant la colonisation en 1897 ?",
            questionMg:
              "Iza no Mpanjakavavy farany nanjaka teto Madagasikara talohan'ny fanjanahan-tany ?",
            choices: [
              "Ranavalona III",
              "Ranavalona Ire",
              "Rasoherina",
              "Ranavalona II",
            ],
            correctIndex: 0,
            explanation:
              "Ranavalona III fut la dernière reine souveraine de Madagascar avant d'être déportée en exil en 1897.",
          },
          {
            type: 'quiz',
            question:
              "Quel mot malgache fondamental désigne « la souveraineté nationale » ?",
            questionMg:
              "Inona ilay teny malagasy manan-danja milaza ny « fiandrianam-pirenena » ?",
            choices: [
              "Fiandrianam-pirenena",
              "Fananana manokana",
              "Fivarotana fananana",
              "Fiaraha-monina tsotra",
            ],
            correctIndex: 0,
            explanation:
              "« Fiandrianam-pirenena » désigne la souveraineté, l'indépendance et la dignité de la nation malgache.",
          },
          {
            type: 'quiz',
            question:
              "Dans quelle ville la reine Ranavalona III a-t-elle vécu ses dernières années en exil ?",
            questionMg:
              "Taiza no nasesitany ary nahafatesan'ny Mpanjakavavy Ranavalona III ?",
            choices: [
              "À Alger (après un passage à La Réunion)",
              "À Londres en Angleterre",
              "À Rome en Italie",
              "Au Caire en Égypte",
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
              "Le port de Toamasina",
              "Le marché d'Analakely",
              "La gare de Soarano",
            ],
            correctIndex: 0,
            explanation:
              "Le Rova d'Antananarivo, perché sur la colline d'Analamanga, était le cœur spirituel et politique du royaume des reines.",
          },
        ],
      },
      {
        slug: 'les-resistances-et-la-lutte-de-1947',
        title:
          "Les résistances patriotiques et l'insurrection héroïque de 1947",
        titleMg: "Ny Tolom-Panafahana : Ny Menalamba, ny VVS ary ny 29 Martsa 1947",
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
              "Le groupe « TS » se prononce comme dans « tsar » ou « mouche » appuyée (ex: Martsa, Tanindrazana).",
            sampleWordMg: 'Martsa',
            sampleTranslationFr: 'Mars (le mois du soulèvement patriotique de 1947)',
          },
          {
            type: 'concept',
            termMg: 'Fahafahana',
            phonetic: 'fa-ha-fa-ha-na',
            meaningFr: "La Liberté / L'émancipation / L'Indépendance",
            explanation:
              "Aspiration suprême pour laquelle des dizaines de milliers de patriotes malgaches ont offert leur vie avec abnégation.",
          },
          {
            type: 'concept',
            termMg: 'Menalamba',
            phonetic: 'me-na-lam-ba',
            meaningFr: "« Les toges rouges » : résistants de la première heure (1895-1898)",
            explanation:
              "Insurgés vêtus du lamba traditionnel teint à l'argile rouge, qui ont mené la guérilla pour protéger les coutumes et les tombeaux des ancêtres.",
          },
          {
            type: 'concept',
            termMg: 'Vy Vato Sakelika (V.V.S.)',
            phonetic: 'vi va-tou sa-ke-li-ka',
            meaningFr: "« Fer, Pierre, Ramification » (Mouvement patriotique fondé en 1913)",
            explanation:
              "Organisation secrète d'étudiants en médecine et de lettrés malgaches plaidant pour l'égalité citoyenne et la souveraineté nationale.",
          },
          {
            type: 'concept',
            termMg: '29 Martsa 1947',
            phonetic: 'roam-bi-ny si-vi mar-tsa',
            meaningFr: "L'insurrection nationale pour la liberté / Journée des Martyrs",
            explanation:
              "Soulèvement généralisé contre l'oppression coloniale, durement réprimé mais ayant scellé l'inévitable marche vers l'indépendance de 1960.",
          },
          {
            type: 'example',
            textMg:
              "Ny 29 Martsa dia andro masina ahatsiarovana ireo Maherifo nahafoy ny ainy ho an'ny Tanindrazana.",
            textFr:
              "Le 29 mars est un jour sacré du souvenir pour honorer les Héros ayant sacrifié leur vie pour la Patrie.",
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
              "Les Menalamba",
              "Les V.V.S.",
              "Les marins Vezo",
              "Les marchands arabes",
            ],
            correctIndex: 0,
            explanation:
              "Les Menalamba (« toges rouges ») ont combattu avec ferveur pour protéger la terre ancestrale et les coutumes malgaches.",
          },
          {
            type: 'quiz',
            question:
              "Que signifiait le nom du mouvement nationaliste secret « V.V.S. » fondé en 1913 ?",
            questionMg:
              "Inona no hevitry ny fanafohezana hoe « V.V.S. » niorina tamin'ny 1913 ?",
            choices: [
              "Vy Vato Sakelika (Fer, Pierre, Ramification)",
              "Vahoaka Vonona Saika",
              "Vola Vitsy Sambatra",
              "Vato Vao Sombintsombiny",
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
              "Inona ilay daty manan-tantara ahatsiarovana ny tolom-panafahana teto Madagasikara ?",
            choices: [
              "Le 29 mars (1947)",
              "Le 1er janvier",
              "Le 14 juillet",
              "Le 25 décembre",
            ],
            correctIndex: 0,
            explanation:
              "Le 29 mars 1947 marque le grand soulèvement populaire malgache et la commémoration des martyrs de la liberté.",
          },
          {
            type: 'quiz',
            question:
              "Quel mot malgache fondamental désigne « la Liberté » et l'indépendance du peuple ?",
            questionMg:
              "Inona ilay teny malagasy midika hoe « Fahaleovantena sy Fahafahana » ?",
            choices: ["Fahafahana", "Fananana", "Fahantrana", "Fahatsiarovana"],
            correctIndex: 0,
            explanation:
              "« Fahafahana » signifie la liberté, l'affranchissement et l'indépendance légitime du peuple malgache.",
          },
          {
            type: 'quiz',
            question:
              "En quelle année Madagascar a-t-il finalement proclamé le retour de son Indépendance nationale ?",
            questionMg:
              "Tamin'ny taona firy no niverina tamin'ny fomba ôfisialy ny Fahaleovantenan'i Madagasikara ?",
            choices: [
              "1960 (le 26 juin)",
              "1947",
              "1914",
              "1989",
            ],
            correctIndex: 0,
            explanation:
              "Madagascar a retrouvé sa pleine indépendance nationale le 26 juin 1960, couronnant des décennies de luttes patriotiques.",
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
              "Le groupe consonantique « DR » est alvéolaire et dynamique (ex: Tendrombohitra, Andrianampoinimerina).",
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
            meaningFr: "La colline bleue royale, sanctuaire classé au patrimoine mondial UNESCO",
            explanation:
              "Cité royale intacte avec la case d'Andrianampoinimerina (Mahandrihono), le pavillon de Ranavalona II et les bassins d'ablutions royales.",
          },
          {
            type: 'concept',
            termMg: 'Aviavy sy Amontana',
            phonetic: 'a-vi-a-vi si a-moun-ta-na',
            meaningFr: "Ficus royaux sacrés plantés aux portes des enceintes",
            explanation:
              "Arbres vénérés symbolisant la majesté royale, la descendance ininterrompue et la bienveillance des ancêtres protecteurs.",
          },
          {
            type: 'concept',
            termMg: 'Hadivory sy Vavahady vato',
            phonetic: 'ha-di-vou-ri si va-va-ha-di va-tou',
            meaningFr: "Fossés circulaires profonds et portes en disques de pierre monolithiques",
            explanation:
              "Ingénieux système défensif entourant les collines sacrées, fermé chaque soir par d'immenses dalles de granit roulées à bras d'hommes.",
          },
          {
            type: 'example',
            textMg:
              "Ambohimanga dia vohitra masina mampahatsiaro ny hasina sy ny fomba nentin-drazana malagasy.",
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
              "Douze (Tendrombohitra Roambinifolo)",
              "Sept",
              "Trois seulement",
              "Vingt-quatre",
            ],
            correctIndex: 0,
            explanation:
              "Les douze collines sacrées (Tendrombohitra Roambinifolo) formaient le maillage spirituel, stratégique et dynastique du royaume.",
          },
          {
            type: 'quiz',
            question:
              "Quel site historique et royal malgache est classé au patrimoine mondial de l'Humanité par l'UNESCO ?",
            questionMg:
              "Inona ilay toerana masina malagasy voasokajy ho Lova Iraisam-pirenena UNESCO ?",
            choices: [
              "La colline royale d'Ambohimanga",
              "Le canal des Pangalanes",
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
              "Quels arbres sacrés majestueux étaient traditionnellement plantés pour marquer la présence royale ?",
            questionMg:
              "Inona ireo hazo masina famboly teo amin'ny rova sy ny tanàna nisy mpanjaka ?",
            choices: [
              "L'Aviavy et l'Amontana (ficus royaux)",
              "Le pommier et le poirier",
              "Le sapin de Noël",
              "Le peuplier blanc",
            ],
            correctIndex: 0,
            explanation:
              "L'Aviavy et l'Amontana (ficus majestueux) symbolisent la royauté, la bénédiction des ancêtres et la pérennité de la nation.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on le grand fossé circulaire défensif protégeant les cités fortifiées royales ?",
            questionMg:
              "Inona no iantsoana ilay hady boribory lalina manodidina ny vohitra masina ?",
            choices: ["Le Hadivory", "Le Valam-parihy", "Ny Tany mena", "Ny Kianja"],
            correctIndex: 0,
            explanation:
              "Le « Hadivory » est le fossé défensif circulaire creusé autour des collines royales pour empêcher les assauts ennemis.",
          },
          {
            type: 'quiz',
            question:
              "Quel grand souverain réformateur a fait d'Ambohimanga son point de départ pour unifier le pays ?",
            questionMg:
              "Iza ilay Mpanjaka lehibe niainga tao Ambohimanga nampiray an'i Madagasikara ?",
            choices: [
              "Andrianampoinimerina",
              "Radama II",
              "Andrianjaka",
              "Ralambo",
            ],
            correctIndex: 0,
            explanation:
              "Andrianampoinimerina régna d'abord à Ambohimanga avant de conquérir Antananarivo et d'œuvrer pour l'unité de toute l'île.",
          },
        ],
      },
    ],
  },
  {
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
    estimatedMinutes: 40,
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
            meaningFr:
              'Où (au lieu de « aiza ») / Comme (au lieu de « toy ny »)',
            explanation:
              'Variations lexicales quotidiennes qui donnent toute leur couleur et leur musicalité aux échanges régionaux.',
          },
          {
            type: 'example',
            textMg:
              'Akory aby nareo tsaiky ? — Tsara be tompoko, mbarakaly e !',
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
            meaningFr:
              'Art oratoire traditionnel solennel de la côte orientale',
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
          "Plongez dans les sonorités vigoureuses du Sud malgache, les salutations pastorales et la poésie des troupeaux.",
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
            sampleTranslationFr: 'Quelles sont les nouvelles ? (Salutation emblématique du Sud)',
          },
          {
            type: 'concept',
            termMg: 'Akore ty tantara ?',
            phonetic: 'a-kou-re ti tan-ta-ra',
            meaningFr: 'Comment vont les nouvelles ? / Bonjour à vous',
            explanation:
              "Formule de salutation universelle et chaleureuse dans tout le Sud malgache (Antandroy, Mahafaly, Bara).",
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
              "Cœur battant du village dans le Sud, symbole de prospérité, de bénédiction ancestrale et de sécurité des troupeaux.",
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
              "Akore ty tantara lahy ? — Soa soa rahavana, tomombana ty omby am-bala !",
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
              "Inona ilay fiarahabana nentim-paharazana fanta-daza indrindra any Atsimo ?",
            choices: [
              "« Akore ty tantara ? » (Quelles sont les nouvelles ?)",
              "« Veloma finaritra »",
              "« Misaotra betsaka »",
              "« Azafady tompoko »",
            ],
            correctIndex: 0,
            explanation:
              "« Akore ty tantara ? » est la formule de salutation rituelle incontournable chez les Antandroy, Mahafaly et Bara.",
          },
          {
            type: 'quiz',
            question:
              "Comment répond-on couramment et poliment à la salutation « Akore ty tantara ? » ?",
            questionMg:
              "Ahoana no famaliana am-panajana ny fiarahabana hoe « Akore ty tantara ? » ?",
            choices: [
              "« Soa soa » (Très bien / Tout va bien)",
              "« Tsy misy hena »",
              "« Lasa nody aho »",
              "« Vaky ny vilany »",
            ],
            correctIndex: 0,
            explanation:
              "On répond traditionnellement « Soa soa » ou « Soa soa, tsy manin-draho » pour signifier que la paix règne.",
          },
          {
            type: 'quiz',
            question:
              "Que signifie littéralement le nom du peuple du Sud « Antandroy » ?",
            questionMg:
              "Inona no dikan'ny anaran'ny foko hoe « Antandroy » ?",
            choices: [
              "Ceux de la forêt d'épineux (Roy)",
              "Ceux des grandes rizières d'eau",
              "Les habitants des montagnes enneigées",
              "Les marins des îles lointaines",
            ],
            correctIndex: 0,
            explanation:
              "« An-tandro-roy » signifie littéralement « ceux du pays des épineux » (roy), faisant référence au bush xérophile du Sud.",
          },
          {
            type: 'quiz',
            question:
              "Quel mot désigne l'enclos sacré protégeant les troupeaux de zébus dans les villages du Sud ?",
            questionMg:
              "Inona ny teny iantsoana ny valan'omby fiarovana ny biby fiompy any Atsimo ?",
            choices: ["Le Vala (ou Fahitra)", "Ny Tranokely", "Ny Lapa", "Ny Tsena"],
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
              "Le zébu (Omby)",
              "Le dromadaire",
              "Le cheval de trait",
              "Le lama des Andes",
            ],
            correctIndex: 0,
            explanation:
              "Le zébu (omby) est la richesse suprême, le lien avec les ancêtres et le cœur linguistique de la culture du Sud.",
          },
        ],
      },
      {
        slug: 'le-vocabulaire-maritime-vezo-et-pecheurs',
        title: "Le vocabulaire maritime : l'épopée des Vezo et des gens de la mer",
        titleMg: "Ny Voambolan'ny Ranomasina sy ny Fiteny Vezo",
        summary:
          "Explorez le lexique maritime des nomades marins Vezo, les vents et la navigation en pirogue à balancier.",
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
              "Sonorité fluide et coulante évoquant le mouvement des vagues (ex: Riaka).",
            sampleWordMg: 'Riaka',
            sampleTranslationFr: "La mer / L'océan (en vocabulaire maritime et côtier)",
          },
          {
            type: 'concept',
            termMg: 'Vezo',
            phonetic: 've-zou',
            meaningFr: "« Ceux qui rament et défient la mer » / Peuple marin du littoral",
            explanation:
              "Plus qu'une ethnie, être Vezo définit une philosophie de vie fondée sur la liberté marine, la pêche et le savoir des marées.",
          },
          {
            type: 'concept',
            termMg: 'Lakam-biha (Lakana Vezo)',
            phonetic: 'la-kam-bi-ha',
            meaningFr: "La pirogue à balancier monoxyle traditionnelle",
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
              "Les pêcheurs Vezo sont partis sonder la mer au petit matin à bord de leur pirogue à balancier.",
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
            question:
              "Qui sont les « Vezo » dans la culture malgache ?",
            questionMg:
              "Iza moa ny foko Vezo eo amin'ny kolontsaina malagasy ?",
            choices: [
              "Les marins, navigateurs et pêcheurs nomades du littoral sud-ouest",
              "Des forgerons des hautes montagnes",
              "Des cultivateurs de thé de l'est",
              "Des éleveurs de rennes des plateaux",
            ],
            correctIndex: 0,
            explanation:
              "Les Vezo sont les réputés navigateurs et pêcheurs traditionnels du canal de Mozambique (Tuléar, Morombe, etc.).",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on l'embarcation traditionnelle à balancier emblématique des pêcheurs Vezo ?",
            questionMg:
              "Ahoana no iantsoana ny lakan'ny Vezo misy vava enti-manjono ?",
            choices: [
              "Le Lakam-biha (Lakana Vezo)",
              "Le Sambofiara",
              "Le Kalesa",
              "Le Trano hazo",
            ],
            correctIndex: 0,
            explanation:
              "Le « Lakam-biha » est la pirogue à balancier traditionnelle sculptée et équipée d'une voile carrée.",
          },
          {
            type: 'quiz',
            question:
              "Quel mot poétique et traditionnel désigne la mer dans le vocabulaire côtier Vezo ?",
            questionMg:
              "Inona ilay teny mampiavaka ny ranomasina amin'ny fitenin'ny mpanjono amoron-tsiraka ?",
            choices: ["Riaka", "Hady", "Tanety", "Lalana"],
            correctIndex: 0,
            explanation:
              "« Riaka » est le mot traditionnel employé sur les côtes pour désigner la mer et les flots marins.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on l'alizé marin puissant et régulier qui souffle sur les côtes ?",
            questionMg:
              "Inona no iantsoana ilay rivotra mahery mitsoka avy an-dranomasina ?",
            choices: [
              "Le Varatraza",
              "Le Rano mafana",
              "Ny Zavona",
              "Ny Orana mikija",
            ],
            correctIndex: 0,
            explanation:
              "Le « Varatraza » est le vent alizé régulier et soutenu qui gonfle les voiles des pêcheurs côtiers.",
          },
          {
            type: 'quiz',
            question:
              "Quelle pratique traditionnelle écologique est respectée par les pêcheurs Vezo ?",
            questionMg:
              "Inona ilay fomba nentin-drazana miaro ny tontolo iainana hajain'ny mpanjono Vezo ?",
            choices: [
              "Le respect des jours d'interdiction de pêche (Fady riaka) pour préserver le repos de la mer",
              "La pêche avec des filets industriels destructeurs",
              "L'assèchement complet des lagons",
              "La destruction systématique des coraux",
            ],
            correctIndex: 0,
            explanation:
              "Les interdits traditionnels (fady riaka) permettent aux espèces marines de se reproduire et protègent la ressource halieutique.",
          },
        ],
      },
      {
        slug: 'variations-de-vocabulaire-et-unite-linguistique',
        title: "Variations régionales et unité profonde de la langue malgache",
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
            sampleTranslationFr: 'Je mange du riz (littéralement : Mange du riz moi)',
          },
          {
            type: 'concept',
            termMg: 'Matoanteny - Fameno - Lazaina (VOS)',
            phonetic: 'ma-tou-an-te-ni fa-me-nou la-zeye-na',
            meaningFr: "L'ordre syntaxique universel de la langue malgache",
            explanation:
              "Contrairement au français qui place le Sujet en tête (SVO), le malgache débute traditionnellement par le verbe dans tous ses dialectes.",
          },
          {
            type: 'concept',
            termMg: 'Mihinana / Komana / Homana / Mihinagne',
            phonetic: 'mi-hi-na-na / kou-ma-na / hou-ma-na / mi-hi-nang-e',
            meaningFr: "Variations régionales du verbe « Manger »",
            explanation:
              "Démontre que les variantes lexicales partagent la même racine ou expriment une simple évolution phonétique locale parfaitement intelligible.",
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
            meaningFr: "La langue malgache est une et indivisible",
            explanation:
              "Principe linguistique et culturel soulignant que les dialectes ne divisent pas, mais enrichissent le patrimoine commun de la nation.",
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
              "Le malgache structure ses phrases avec le verbe en tête (VOS), par exemple : « Mahandro vary i Soa » (Cuisine du riz Soa).",
          },
          {
            type: 'quiz',
            question:
              "Quels termes côtiers correspondent au verbe standard « Mihinana » (Manger) ?",
            questionMg:
              "Inona ireo tenim-paritra mitovy hevitra amin'ny hoe « Mihinana » ?",
            choices: [
              "Komana, Homana na Mihinagne",
              "Matory na Mandry",
              "Mandeha na Mamindra",
              "Milalao na Mikorana",
            ],
            correctIndex: 0,
            explanation:
              "Selon les régions, « manger » se dit couramment « komana », « homana » ou « mihinagne », toutes issues de racines proches.",
          },
          {
            type: 'quiz',
            question:
              "Quel mot des dialectes du Nord et de l'Ouest équivaut au terme « Zaza » (Enfant) ?",
            questionMg:
              "Inona ny tenim-paritra any Avaratra sy Andrefana mitovy hevitra amin'ny teny hoe « Zaza » ?",
            choices: ["Tsaiky", "Raiamandreny", "Zoky", "Mpanjaka"],
            correctIndex: 0,
            explanation:
              "« Tsaiky » est le mot très populaire et affectueux des côtes nord et ouest pour désigner un enfant.",
          },
          {
            type: 'quiz',
            question:
              "Qu'est-ce qui prouve l'unité profonde de la langue malgache par-delà les dialectes ?",
            questionMg:
              "Inona no manaporofo ny firaisana lalina misy eo amin'ny fitenim-paritra malagasy rehetra ?",
            choices: [
              "Une grammaire identique, une syntaxe VOS commune et un même fonds de racines",
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
              "Quelle valeur culturelle suprême est renforcée par cette unité linguistique à Madagascar ?",
            questionMg:
              "Inona ilay soatoavina lehibe malagasy hamafisin'izany firaisan'ny teny izany ?",
            choices: [
              "Le Fihavanana (solidarité, fraternité et concorde nationale)",
              "La division et l'isolement des clans",
              "L'oubli des traditions des ancêtres",
              "La rivalité permanente entre les régions",
            ],
            correctIndex: 0,
            explanation:
              "L'unité de la langue malgache est le pilier vivant du Fihavanana, liant fraternellement tous les habitants de la Grande Île.",
          },
        ],
      },
    ],
  },
  {
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
    estimatedMinutes: 50,
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
            question:
              'Que signifie littéralement le mot malgache « Sambatra » ?',
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
        title: "Les instruments traditionnels : l'âme de la Valiha et du Marovany",
        titleMg: 'Ireo Zava-maneno Nentin-drazana : ny Valiha sy ny Marovany',
        summary:
          "Découvrez les instruments emblématiques malgaches : la cithare tubulaire en bambou Valiha, le Marovany côtier et la flûte Sodina.",
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
              "Se prononce doucement avec le « H » expiré léger (ex: Valiha, Marovany, Sodina).",
            sampleWordMg: 'Valiha',
            sampleTranslationFr: 'Cithare tubulaire en bambou (instrument national)',
          },
          {
            type: 'concept',
            termMg: 'Valiha',
            phonetic: 'va-li-ha',
            meaningFr: "L'instrument emblématique de Madagascar en bambou sacré",
            explanation:
              "Cithare tubulaire taillée dans une variété spécifique de bambou (Volotsangana), équipée de cordes tendues sur de petits chevalets en bois mobiles.",
          },
          {
            type: 'concept',
            termMg: 'Marovany',
            phonetic: 'ma-rou-va-ni',
            meaningFr: "« La boîte aux multiples voix » (cithare sur caisse côtière)",
            explanation:
              "Instrument rectangulaire en bois muni de cordes sur deux faces opposées, incontournable pour invoquer les esprits royaux lors des cérémonies de possession Tromba.",
          },
          {
            type: 'concept',
            termMg: 'Sodina',
            phonetic: 'sou-di-na',
            meaningFr: "La flûte droite traditionnelle en bambou ou roseau",
            explanation:
              "Flûte pastorale à six trous, immortalisée à travers le monde par le virtuose Rakoto Frah et essentielle dans le Hira Gasy.",
          },
          {
            type: 'concept',
            termMg: 'Lokanga Bara',
            phonetic: 'lou-kan-ga ba-ra',
            meaningFr: "Le violon rustique à trois cordes des pasteurs du Sud",
            explanation:
              "Instrument à archet sculpté dans du bois dur et garni d'une table d'harmonie en peau de zébu, accompagnant les récits poétiques des gardiens de troupeaux.",
          },
          {
            type: 'example',
            textMg:
              "Nanakoako eran'ny vohitra ny feo mangan'ny valiha nampandry saina ny mpiara-monina.",
            textFr:
              "Le son cristallin et mélodieux de la valiha a résonné à travers le village, apaisant les cœurs de la communauté.",
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
              "La Valiha",
              "Le piano à queue",
              "La guitare électrique",
              "L'accordéon moderne",
            ],
            correctIndex: 0,
            explanation:
              "La Valiha est l'instrument traditionnel national par excellence, symbole de pureté et d'harmonie sonore.",
          },
          {
            type: 'quiz',
            question:
              "Quel instrument en caisse de résonance en bois est indispensable aux rituels de Tromba sur les côtes ?",
            questionMg:
              "Inona ilay zava-maneno efajoro hazo fampiasa matetika amin'ny fombafomba Tromba morontsiraka ?",
            choices: [
              "Le Marovany",
              "Le violoncelle classique",
              "La trompette en cuivre",
              "La batterie moderne",
            ],
            correctIndex: 0,
            explanation:
              "Le Marovany, avec ses cordes montées sur deux faces, produit une onde sonore vibrante qui induit la transe spirituelle du Tromba.",
          },
          {
            type: 'quiz',
            question:
              "Quel maître flûtiste malgache légendaire a fait connaître la Sodina dans le monde entier ?",
            questionMg:
              "Iza ilay mpitsoka sodina kalaza eran-tany nampisandratra ny kolontsaina malagasy ?",
            choices: [
              "Rakoto Frah",
              "Jean Laborde",
              "Andrianampoinimerina",
              "Radama Ier",
            ],
            correctIndex: 0,
            explanation:
              "Rakoto Frah (1923-2001) est le maître mondialement célébré de la Sodina, dont l'effigie orna même les billets de banque malgaches.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on le violon rustique à trois cordes caractéristique des pasteurs Bara du Grand Sud ?",
            questionMg:
              "Inona no iantsoana ilay zava-maneno misy tadiny telo fitendrin'ny mpiompy Bara any Atsimo ?",
            choices: ['Le Lokanga', 'Ny Valiha', 'Ny Sodina', 'Ny Kabosy'],
            correctIndex: 0,
            explanation:
              "Le Lokanga (ou Lokanga Bara) est un violon traditionnel à manche courbe et table en peau de zébu rythmant les récits du Sud.",
          },
          {
            type: 'quiz',
            question:
              "Quelle fonction sacrée la musique traditionnelle remplit-elle auprès des ancêtres et de la communauté ?",
            questionMg:
              "Inona ny anjara asa masina sahanin'ny mozika nentim-paharazana eo amin'ny fiaraha-monina ?",
            choices: [
              "Établir la communion avec les ancêtres, apaiser les esprits et resserrer le Fihavanana",
              "Remplacer les lois du tribunal civil",
              "Interdire aux jeunes d'exprimer leurs émotions",
              "Obliger les villageois à garder le silence",
            ],
            correctIndex: 0,
            explanation:
              "La musique malgache est un vecteur de bénédiction (hasina), de mémoire communautaire et de médiation avec les Razana.",
          },
        ],
      },
      {
        slug: 'l-art-du-tissage-du-lamba-arindrano-et-soie-sauvage-landibe',
        title: "L'art textile sacré : le Lamba Arindrano et la soie sauvage Landibe",
        titleMg: 'Ny Tenona sy ny Landibe : Lamba Arindrano sy Akotofahana',
        summary:
          "Explorez les secrets du tissage traditionnel : la récolte de la soie sauvage Landibe, le prestigieux Lamba Arindrano et les teintures végétales.",
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
              "Prononcez distinctement « Lan-di-bé » (soie sauvage noble des hautes terres).",
            sampleWordMg: 'Landibe',
            sampleTranslationFr: 'Soie sauvage endémique de Madagascar',
          },
          {
            type: 'concept',
            termMg: 'Landibe (Borocera madagascariensis)',
            phonetic: 'lan-di-be',
            meaningFr: "Le ver à soie sauvage des forêts de tapia",
            explanation:
              "Chenille endémique qui tisse de solides cocons dorés dans les forêts de tapia (notamment dans l'Itasy et l'Amoron'i Mania), matière première de la soie ancestrale.",
          },
          {
            type: 'concept',
            termMg: 'Lamba Arindrano',
            phonetic: 'lam-ba a-rin-dra-nou',
            meaningFr: "L'étoffe noble aux rayures géométriques noires et écrues",
            explanation:
              "Lamba de haute dignité traditionnellement porté par les souverains, les aînés et les juges coutumiers lors des grands discours officiels.",
          },
          {
            type: 'concept',
            termMg: 'Lamba Akotofahana',
            phonetic: 'lam-ba a-kou-tou-fa-ha-na',
            meaningFr: "L'étoffe de prestige aux motifs brodés et jacquards en relief",
            explanation:
              "Chef-d'œuvre de patience et de créativité, réservé jadis aux membres de la royauté pour les noces et les cérémonies d'apparat.",
          },
          {
            type: 'concept',
            termMg: 'Tapia (Uapaca bojeri)',
            phonetic: 'ta-pi-a',
            meaningFr: "L'arbre protecteur des forêts de l'Imerina et du Betsileo",
            explanation:
              "Arbre résistant aux feux dont les feuilles nourrissent les chenilles de soie sauvage et dont l'écorce fournit des pigments de teinture naturelle.",
          },
          {
            type: 'example',
            textMg:
              "Nisikina Lamba Arindrano ny raiamandreny raha nitsangana nanao kabary fampihavanana.",
            textFr:
              "Le patriarche s'est drapé dans son somptueux Lamba Arindrano avant de se lever pour prononcer le discours de réconciliation.",
          },
          {
            type: 'didYouKnow',
            textFr:
              "Les teintures du lamba traditionnel étaient exclusivement végétales et minérales : le jaune éclatant provenait du curcuma (*Tamotamo*), le brun profond de l'argile ferrugineuse des rizières (*Tany mena*), et les nuances d'ocre de décoctions d'écorces d'arbres endémiques bouillies pendant plusieurs jours.",
            textMg:
              "Tsy nisy loko simika ny tenona malagasy fahiny : ny tamotamo no nanome ny loko mavo manganofy, ny fotaka an-tanimbary no nahazoana ny volontany matroka, ary ny hodi-kazo nandrahoina no niteraka ireo loko volom-parasy sy mena mangamanga.",
          },
          // ─── 5 Micro-Quiz de validation ───
          {
            type: 'quiz',
            question:
              "D'où provient traditionnellement la soie sauvage noble « Landibe » à Madagascar ?",
            questionMg:
              "Avy aiza ny landy nentim-paharazana antsoina hoe « Landibe » eto Madagasikara ?",
            choices: [
              "Des cocons de chenilles sauvages vivant dans les forêts de tapia",
              "De fibres synthétiques d'usines modernes",
              "De la laine de moutons importés d'Europe",
              "De feuilles de bananier séchées",
            ],
            correctIndex: 0,
            explanation:
              "Le Landibe provient de chenilles endémiques (Borocera madagascariensis) qui se développent sur les arbres Tapia des Hautes Terres.",
          },
          {
            type: 'quiz',
            question:
              "Quel lamba d'apparat prestigieux se caractérise par des bandes et rayures sobres et soignées ?",
            questionMg:
              "Inona ilay lamba malaza manana tsipika milamina fanaon'ny raiamandreny sy ny manan-kaja ?",
            choices: [
              "Le Lamba Arindrano",
              "Un simple tablier de cuisine",
              "Une serviette de bain",
              "Un tissu de rideau imprimé",
            ],
            correctIndex: 0,
            explanation:
              "Le Lamba Arindrano est l'étoffe de noblesse et de dignité par excellence, arborée lors des grands Kabary solennels.",
          },
          {
            type: 'quiz',
            question:
              "Quel lamba réputé pour sa complexité comporte des motifs géométriques et floraux en relief ?",
            questionMg:
              "Inona ilay lamba be haingon-tsoratra sy sarobidy indrindra amin'ny tenona malagasy ?",
            choices: [
              "Le Lamba Akotofahana",
              "Le lamba tantsaha tsotra",
              "Ny salaka",
              "Ny lamba lany fotsy",
            ],
            correctIndex: 0,
            explanation:
              "Le Lamba Akotofahana est le joyau textile malgache, orné de motifs en relief tissés avec une minutie exceptionnelle.",
          },
          {
            type: 'quiz',
            question:
              "Quel arbre endémique résistant au feu héberge et nourrit les vers à soie Landibe ?",
            questionMg:
              "Inona ilay hazo fihinam-boa maniry an-tanety mamelona ny bibin-dandy Landibe ?",
            choices: ['Le Tapia', 'Le Baobab', 'Le Cocotier', "L'Eucalyptus"],
            correctIndex: 0,
            explanation:
              "Le Tapia (Uapaca bojeri) forme des forêts claires endémiques essentielles à la survie du ver à soie sauvage Landibe.",
          },
          {
            type: 'quiz',
            question:
              "Pourquoi le tissu en soie de Landibe est-il au centre de la cérémonie du Famadihana ?",
            questionMg:
              "Nahoana ny lamba landy no zava-dehibe indrindra mandritra ny famadihana ?",
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
        title: "L'art sculptural des Aloalo : totems et mémoire éternelle du Grand Sud",
        titleMg: "Ny Haikanto amin'ny Aloalo sy ny Valavato Mahafaly",
        summary:
          "Découvrez le génie sculptural des Mahafaly et Antandroy : les totems de bois sculpté Aloalo et les tombeaux Valavato.",
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
              "Vient du verbe « Mialo » (faire écran, protéger, faire le lien entre deux mondes).",
            sampleWordMg: 'Aloalo',
            sampleTranslationFr: 'Poteau funéraire sculpté en bois ajouré du Sud',
          },
          {
            type: 'concept',
            termMg: 'Aloalo',
            phonetic: 'a-lou-a-lou',
            meaningFr: "Poteau totémique funéraire en bois sculpté",
            explanation:
              "Sculpture verticale de 1,5 à 2 mètres comportant des motifs géométriques abstraits successifs surmontés d'une scène narrative figurative.",
          },
          {
            type: 'concept',
            termMg: 'Valavato (Fasana Mahafaly)',
            phonetic: 'va-la-va-tou',
            meaningFr: "Le tombeau monumental carré en pierres sèches taillées",
            explanation:
              "Édifice funéraire imposant sur lequel sont disposés les crânes de zébus sacrificiels (*Tinoka*) et les poteaux Aloalo honorant le défunt.",
          },
          {
            type: 'concept',
            termMg: 'Hazomalany sy Mendorave',
            phonetic: 'ha-zou-ma-la-ni si men-dou-ra-ve',
            meaningFr: "Bois nobles et imputrescibles utilisés pour la sculpture",
            explanation:
              "Essences d'arbres sacrées de la forêt sèche du Sud, capables de résister des siècles au soleil ardent, au vent et aux termites.",
          },
          {
            type: 'concept',
            termMg: 'Mialo',
            phonetic: 'mi-a-lou',
            meaningFr: "Intercéder, servir d'intermédiaire spirituel et de protection",
            explanation:
              "Sens étymologique du mot Aloalo : le poteau fait office de messager permanent entre le monde terrestre et le monde invisible.",
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
              "Un poteau funéraire sculpté en bois ajouré surmontant les tombeaux",
              "Un instrument de percussion en bronze",
              "Un type de pirogue de mer",
              "Une coiffure de fête pour les jeunes filles",
            ],
            correctIndex: 0,
            explanation:
              "L'Aloalo est le poteau funéraire totémique en bois sculpté, signature artistique majeure des Mahafaly et Antandroy.",
          },
          {
            type: 'quiz',
            question:
              "Quels peuples de Madagascar sont historiquement renommés pour la sculpture des Aloalo ?",
            questionMg:
              "Iza ireo foko malaza indrindra amin'ny fanaovana ny sokitra Aloalo ?",
            choices: [
              "Les Mahafaly et les Antandroy",
              "Les Merina et les Betsileo uniquement",
              "Les Bezanozano",
              "Les Antakarana",
            ],
            correctIndex: 0,
            explanation:
              "Les sculpteurs Mahafaly et Antandroy ont élevé l'art de l'Aloalo au rang de chef-d'œuvre du patrimoine mondial.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on les grands tombeaux monumentaux en pierres sèches sur lesquels sont érigés les Aloalo ?",
            questionMg:
              "Ahoana no iantsoana ireo fasana vato lehibe any Atsimo ametrahana ny Aloalo ?",
            choices: ['Le Valavato', 'Ny Tranovola', 'Ny Rova', 'Ny Kianja'],
            correctIndex: 0,
            explanation:
              "Le « Valavato » est le grand tombeau rectangulaire en dalles de pierre taillées, fierté et sanctuaire des familles du Sud.",
          },
          {
            type: 'quiz',
            question:
              "Quel type d'essences de bois est rigoureusement sélectionné pour sculpter les Aloalo ?",
            questionMg:
              "Karazan-kazo manao ahoana no fidina hanaovana ny Aloalo ?",
            choices: [
              "Des bois nobles, denses et imputrescibles résistant aux siècles (comme le Hazomalany)",
              "Du bois de balsa très fragile",
              "Des branches de sapin fraîches",
              "Du carton recyclé",
            ],
            correctIndex: 0,
            explanation:
              "Des bois exceptionnellement denses et imputrescibles (Hazomalany, Mendorave) sont requis pour défier les intempéries du désert.",
          },
          {
            type: 'quiz',
            question:
              "Quel est le rôle spirituel et symbolique profond du poteau Aloalo ?",
            questionMg:
              "Inona no hevitra ara-panahy lalina fonosin'ny Aloalo eo ambonin'ny fasana ?",
            choices: [
              "Faire le lien mystique (Mialo) entre la terre des vivants et le royaume céleste des ancêtres",
              "Servir d'épouvantail pour chasser les oiseaux migrateurs",
              "Indiquer la direction des vents marins",
              "Servir de balance pour peser les récoltes",
            ],
            correctIndex: 0,
            explanation:
              "L'Aloalo intercède (mialo) et relie le monde temporel des vivants à l'éternité bienheureuse des ancêtres Razana.",
          },
        ],
      },
    ],
  },
  {
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
        title: "La divination du Sikidy : géométrie sacrée des graines et algèbre du destin",
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
            meaningFr: "L'art divinatoire géomantique traditionnel par les graines",
            explanation:
              "Système séculaire combinant les principes pairs (deux graines) et impairs (une graine) pour former une matrice d'orientation spirituelle et morale.",
          },
          {
            type: 'concept',
            termMg: 'Ombiasy',
            phonetic: 'oum-bi-a-si',
            meaningFr: "Le sage, médecin traditionnel, astrologue et maître de sagesse",
            explanation:
              "Détenteur respecté des savoirs thérapeutiques (plantes médicinales), astrologiques et coutumiers, garant de l'équilibre du village.",
          },
          {
            type: 'concept',
            termMg: 'Voan-kily',
            phonetic: 'vouan-ki-li',
            meaningFr: "Graines dures de tamarinier utilisées pour la divination",
            explanation:
              "Graines lisses et inaltérables choisies pour leur pureté symbolique et leur régularité géométrique lors du tirage sur la natte.",
          },
          {
            type: 'concept',
            termMg: 'Faditra',
            phonetic: 'fa-di-tsa',
            meaningFr: "Le rite d'exorcisme symbolique et de rejet du mauvais sort",
            explanation:
              "Action réparatrice (don d'une herbe, d'une pierre, d'une cendre ou d'une pièce) prescrite par le Sikidy pour chasser l'infortune et purifier l'aura.",
          },
          {
            type: 'example',
            textMg:
              "Nandinika ny voan-kily teo ambony tsihy ny Ombiasy ka nahita ny fomba hampodiana ny hasina.",
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
              "Quelles graines végétales lisses et nobles sont traditionnellement utilisées pour consulter le Sikidy ?",
            questionMg:
              "Inona ireo voan-javamaniry ampiasain'ny Ombiasy rehefa mandatsaka Sikidy ?",
            choices: [
              "Les graines de tamarinier (Voan-kily)",
              "Des grains de maïs grillés",
              "Des pépins de pomme",
              "Des grains de café moulu",
            ],
            correctIndex: 0,
            explanation:
              "Les graines de tamarinier (Voan-kily), polies et durables, constituent le support rituel traditionnel par excellence du Sikidy.",
          },
          {
            type: 'quiz',
            question:
              "Quel titre traditionnel désigne le maître guérisseur, devin et conseiller communautaire malgache ?",
            questionMg:
              "Iza no anarana iantsoana ilay olon-kendry mpitsabo sy mpanolotsaina eo amin'ny fiaraha-monina ?",
            choices: ["L'Ombiasy", "Le Mpiandry omby", "Le Mpivarotra", "Le Mpamboly"],
            correctIndex: 0,
            explanation:
              "L'Ombiasy est le sage traditionnel détenteur de la connaissance des plantes, des astres et de la métaphysique du Sikidy.",
          },
          {
            type: 'quiz',
            question:
              "Quel support traditionnel et pur est impérativement étalé au sol pour disposer le Sikidy ?",
            questionMg:
              "Inona ilay fitaovana madio velarina amin'ny tany ametrahana ny Sikidy ?",
            choices: [
              "Une natte neuve en jonc tressé (Tsihy madio)",
              "Une feuille de papier journal",
              "Une plaque de tôle ondulée",
              "Une bâche plastique usagée",
            ],
            correctIndex: 0,
            explanation:
              "Le Sikidy ne peut être interrogé que sur une natte végétale pure et propre (tsihy madio), symbole de clarté spirituelle.",
          },
          {
            type: 'quiz',
            question:
              "Quel principe mathématique rigoureux structure l'ensemble des figures du Sikidy ?",
            questionMg:
              "Inona ilay fitsipika ara-kajy mifehy ny fandrafetana ireo sarin-tsikidy ?",
            choices: [
              "Un système binaire logique de points pairs et impairs",
              "Une division par dix décimale",
              "Un hasard total sans aucune règle",
              "Une formule de trigonométrie sphérique",
            ],
            correctIndex: 0,
            explanation:
              "Le Sikidy repose sur une combinatoire binaire stricte (une ou deux graines) générant 16 figures géomantiques immuables.",
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
              "Provoquer des querelles entre voisins de village",
              "Remplacer les consultations chez le médecin moderne",
            ],
            correctIndex: 0,
            explanation:
              "Le Sikidy cherche à rétablir l'équilibre de l'âme et du destin en identifiant les blocages pour les neutraliser par le Faditra.",
          },
        ],
      },
      {
        slug: 'l-astrologie-ancestrale-du-vintana-et-les-destins',
        title: "Le Vintana et la roue du zodiaque : destins lunaires et harmonie cosmique",
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
            meaningFr: "Les douze signes mères du zodiaque lunaire malgache",
            explanation:
              "Alahamady, Adaoro, Adizaoza, Asorotany, Alahasaty, Asombola, Adimizana, Alakarabo, Alakaosy, Adijady, Adalo, Alohotsy.",
          },
          {
            type: 'concept',
            termMg: 'Alahamady (Nord-Est)',
            phonetic: 'a-la-ha-ma-di',
            meaningFr: "Le destin royal souverain, noble et premier",
            explanation:
              "Gouverne le coin sacré Nord-Est de la maison malgache (*Zoro Firarazana*), symbole d'autorité bienveillante et de sainteté.",
          },
          {
            type: 'concept',
            termMg: 'Alakaosy (Sud-Ouest)',
            phonetic: 'a-la-ka-ou-si',
            meaningFr: "Le signe du feu vigoureux et indomptable",
            explanation:
              "Destin redoutable par sa puissance explosive ; autrefois adouci dès la naissance par un bain rituel pour transformer sa fougue en leadership protecteur.",
          },
          {
            type: 'concept',
            termMg: 'Zoro Firarazana',
            phonetic: 'zou-rou fi-ra-ra-za-na',
            meaningFr: "Le coin sacré Nord-Est de la maison dédié aux ancêtres",
            explanation:
              "Emplacement architectural le plus sacré du foyer où l'on dépose les offrandes, les nattes de prières et les bénédictions familiales.",
          },
          {
            type: 'example',
            textMg:
              "Nanontany mpanandro ny fianakaviana mba hahalala ny andro tsara hanorenana ny trano vaovao.",
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
              "Combien de signes ou destins majeurs (Renim-bintana) composent le zodiaque traditionnel malgache ?",
            questionMg:
              "Firy ny isan'ireo Renim-bintana lehibe ao amin'ny fanandroana malagasy ?",
            choices: [
              "Douze (Renim-bintana roambinifolo)",
              "Sept seulement",
              "Vingt-quatre",
              "Quatre comme les saisons",
            ],
            correctIndex: 0,
            explanation:
              "Le zodiaque lunaire malgache compte douze Renim-bintana régissant les mois, les jours et les directions cardinales.",
          },
          {
            type: 'quiz',
            question:
              "Quel signe astrologique royal d'excellence régit le coin sacré Nord-Est de la maison malgache ?",
            questionMg:
              "Inona ilay vintan'ny mpanjaka mamaritra ny zoro avaratra atsinanana amin'ny trano gasy ?",
            choices: [
              "L'Alahamady",
              "L'Asorotany",
              "L'Alakaosy",
              "L'Adimizana",
            ],
            correctIndex: 0,
            explanation:
              "L'Alahamady est le premier signe cardinal, associé au coin Nord-Est (Zoro Firarazana) et à la souveraineté.",
          },
          {
            type: 'quiz',
            question:
              "Comment appelle-t-on le maître astrologue coutumier chargé de déterminer les jours fastes (Andro tsara) ?",
            questionMg:
              "Ahoana no iantsoana ilay manampahaizana manokana momba ny kintana sy ny andro tsara ?",
            choices: ['Le Mpanandro', 'Le Mpihira gasy', 'Le Mpandihy', 'Le Mpanao taozavatra'],
            correctIndex: 0,
            explanation:
              "Le Mpanandro est l'astrologue coutumier qui scrute la marche des lunes et le Vintana pour orienter les grands actes de la vie.",
          },
          {
            type: 'quiz',
            question:
              "Comment la sagesse malgache conçoit-elle le destin individuel face au Vintana ?",
            questionMg:
              "Ahoana ny fomba fijerin'ny fahendrena malagasy ny anjara sy ny vintana ?",
            choices: [
              "Le destin n'est pas une fatalité : la sagesse et les rites d'apaisement (Faditra) permettent de l'harmoniser",
              "L'homme est condamné sans aucun espoir de changement",
              "Le destin n'a aucune importance dans la culture",
              "Seule la richesse matérielle change le destin",
            ],
            correctIndex: 0,
            explanation:
              "La philosophie malgache affirme que l'homme agit sur son Vintana avec sagesse, prière et rites réparateurs.",
          },
          {
            type: 'quiz',
            question:
              "Quel espace cardinal du Trano Gasy accueille les prières solennelles et les bénédictions des anciens ?",
            questionMg:
              "Inona ilay zoro masina indrindra ao an-trano gasy fanaovana ny tso-drano sy ny vavaka ?",
            choices: [
              "Le coin Nord-Est (Zoro Firarazana)",
              "Le seuil de la porte Sud",
              "L'arrière du foyer de cendre",
              "Le toit de paille extérieur",
            ],
            correctIndex: 0,
            explanation:
              "Le coin Nord-Est (Zoro Firarazana) est le sanctuaire domestique où s'invoquent la bénédiction de Dieu et la paix des ancêtres.",
          },
        ],
      },
      {
        slug: 'le-hasina-energie-sacree-et-force-vitale-universelle',
        title: "Le Hasina : force vitale sacrée, efficience spirituelle et dignité",
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
              "Le mot Hasina a donné le verbe « Manamasina » (sanctifier, bénir, consacrer avec dignité).",
            sampleWordMg: 'Hasina',
            sampleTranslationFr: 'Énergie sacrée / Force vitale spirituelle / Sainteté',
          },
          {
            type: 'concept',
            termMg: 'Hasina',
            phonetic: 'ha-si-na',
            meaningFr: "L'énergie sacrée universelle, vertu spirituelle et force vitale",
            explanation:
              "Fluide sacré qui donne à une plante médicinale son pouvoir de guérir, à la parole de l'aîné son autorité morale et à la rizière sa fertilité.",
          },
          {
            type: 'concept',
            termMg: 'Manome hasina',
            phonetic: 'ma-nou-me ha-si-na',
            meaningFr: "« Donner du Hasina » / Honorer la dignité sacrée d'autrui",
            explanation:
              "Geste éthique et rituel par lequel on reconnaît la grandeur morale d'une personne ou d'une institution en lui offrant respect et présent symbolique.",
          },
          {
            type: 'concept',
            termMg: 'Fahamasinana',
            phonetic: 'fa-ha-ma-si-na-na',
            meaningFr: "La sainteté, la pureté sacrée et la souveraineté spirituelle",
            explanation:
              "État d'élévation morale et spirituelle préservé par le respect scrupuleux des lois de justice et des interdits sacrés (*Fady*).",
          },
          {
            type: 'concept',
            termMg: 'Tsimatahotra (Vola fotsy)',
            phonetic: 'tsi-ma-ta-hou-tsa (vou-la fou-tsi)',
            meaningFr: "La pièce d'argent pur non tronquée offerte en hommage au souverain",
            explanation:
              "Symbole métallique de pureté absolue remis traditionnellement par les sujets au roi pour sceller leur fidélité et honorer son Hasina.",
          },
          {
            type: 'example',
            textMg:
              "Ny fanajana ny raiamandreny sy ny tany dia fanomezana hasina ny aina nomen-Janahary.",
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
              "Une simple pièce de monnaie moderne pour acheter des vivres",
              "Une punition corporelle infligée aux prisonniers",
              "Un contrat commercial d'importation de marchandises",
            ],
            correctIndex: 0,
            explanation:
              "Le Hasina est la force sacrée immanente qui donne vie, dignité, puissance morale et fertilité au monde malgache.",
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
              "Se vanter de ses propres mérites personnels",
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
              "Inona ilay fitaovana madio nentim-paharazana natolotra ho mariky ny fanomezana Hasina ?",
            choices: [
              "Une pièce d'argent pur non coupée (Tsimatahotra / Vola fotsy)",
              "Un morceau de fer rouillé",
              "Une pierre ordinaire ramassée au sol",
              "Une poignée de sel de cuisine",
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
              "Inona no mitranga araka ny finoana nentin-drazana raha lasa masiaka sy tsy marina ny mpitondra ?",
            choices: [
              "Il perdait son Hasina (Afaka hasina) et perdait ainsi toute légitimité spirituelle à commander",
              "Son pouvoir augmentait pour toujours",
              "Le peuple était obligé de le vénérer davantage",
              "Tous les arbres de la région mouraient sur le champ",
            ],
            correctIndex: 0,
            explanation:
              "La tyrannie brise le pacte sacré : sans justice (*Rariny sy Hitsiny*), le souverain est déchu de son Hasina.",
          },
          {
            type: 'quiz',
            question:
              "Quel lien vital unit le respect du Hasina et la valeur suprême du Fihavanana ?",
            questionMg:
              "Inona no fifamatorana lalina misy eo amin'ny fanajana ny Hasina sy ny Fihavanana ?",
            choices: [
              "Honorer le Hasina de chacun fonde le respect mutuel (Haja) qui rend le Fihavanana vivant et indestructible",
              "Ils sont en conflit permanent et s'opposent l'un à l'autre",
              "Le Hasina ne concerne que les rois et le Fihavanana que les enfants",
              "Il n'existe aucun rapport entre les deux concepts",
            ],
            correctIndex: 0,
            explanation:
              "Le Fihavanana est la manifestation fraternelle du Hasina : respecter l'énergie sacrée d'autrui scelle la paix sociale.",
          },
        ],
      },
    ],
  },

];
