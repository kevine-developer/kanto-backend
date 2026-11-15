import { SeedTrack } from './seed.types.js';

export const fundamentalsTrack: SeedTrack = {
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
  estimatedMinutes: 90,
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
          question: 'Comment se prononce la lettre « O » en langue malgache ?',
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
          questionMg: 'Inona no hevitry ny fiarahabana hoe « Manao ahoana » ?',
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
          question: 'Quel moment de la journée correspond au terme « Alina » ?',
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
      title:
        'La structure de la phrase et les pronoms (Ny Firafitry ny Fehezanteny)',
      titleMg: 'Ny Firafitry ny Fehezanteny sy ny Mpisolo Tena',
      summary:
        "Découvrez l'ordre unique Verbe-Objet-Sujet et les pronoms personnels malgaches.",
      summaryMg:
        'Fantaro ny fomba fandrafetana fehezanteny (Matoanteny-Fameno-Lazaina) sy ireo mpisolo tena.',
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
          explanation: 'S’adresse à plusieurs personnes réunies.',
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
          textFr:
            'Nous apprenons tous ensemble le malgache aujourd’hui (inclusif).',
        },
        {
          type: 'example',
          textMg: 'Mandeha miasa izy ireo maraina.',
          textFr: 'Ils partent travailler le matin.',
        },
        {
          type: 'didYouKnow',
          textFr:
            'La distinction entre « Isika » (inclusif) et « Izahay » (exclusif) évite tout malentendu dans les prises de décision communautaires malgaches. Elle garantit que personne ne se sente indûment engagé ou involontairement exclu.',
          textMg:
            "Ny fahasamihafan'ny « Isika » (mpandahateny sy mpihaino miaraka) sy « Izahay » (mpandahateny tsy manisy ny mpihaino) dia mampiseho ny fahaiza-miaina sy ny fanajana ny hafa eo amin'ny fiarahamonina malagasy.",
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            "Quel est l'ordre habituel des mots dans une phrase simple en malgache ?",
          questionMg:
            "Ahoana ny lamin'ny teny ao amin'ny fehezanteny tsotra amin'ny teny malagasy ?",
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
          question:
            'Quelle est la différence fondamentale entre « Isika » et « Izahay » ?',
          questionMg:
            'Inona no tena mampiavaka ny « Isika » sy ny « Izahay » ?',
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
          question:
            'Quel pronom personnel correspond à « Il » ou « Elle » au singulier ?',
          questionMg:
            'Inona no mpisolo tena milaza ny lahy na vavy tokana (3e personne) ?',
          choices: ['Izy', 'Aho', 'Ianao', 'Ianareo'],
          correctIndex: 0,
          explanation:
            "En malgache, il n'y a pas de genre grammatical : « Izy » signifie indifféremment « il » ou « elle ».",
        },
        {
          type: 'quiz',
          question:
            "Comment se prononce la lettre « Y » à la fin d'un mot malgache (ex: Vary, Faly) ?",
          questionMg:
            "Ahoana no fanononana ny litera « Y » amin'ny faran'ny teny malagasy ?",
          choices: [
            'Comme un « i » court et doux',
            'Comme un « u » français',
            'Comme un « o » ouvert',
            'Elle n’est jamais prononcée',
          ],
          correctIndex: 0,
          explanation:
            'Le « Y » final malgache équivaut au son « i », articulé avec brièveté et douceur.',
        },
        {
          type: 'quiz',
          question:
            'Dans la phrase « Mianatra teny gasy aho », quel mot représente le sujet ?',
          questionMg:
            "Ao amin'ny fehezanteny « Mianatra teny gasy aho », iza no lazaina ?",
          choices: [
            'Aho (Je/Moi)',
            'Mianatra (Apprendre)',
            'Teny (Langue)',
            'Gasy (Malgache)',
          ],
          correctIndex: 0,
          explanation:
            "« Aho » (je) est le sujet (lazaina) placé en fin de phrase, après l'action (mianatra) et le complément (teny gasy).",
        },
      ],
    },
    {
      slug: 'poser-des-questions-et-s-orienter',
      title:
        "Poser des questions et s'orienter dans l'espace (Fanontaniana sy Toerana)",
      titleMg: 'Fametrahana Fanontaniana sy Fanamarihan-toerana',
      summary:
        'Apprenez à interroger votre interlocuteur et à vous repérer selon les points cardinaux sacrés.',
      summaryMg:
        'Ianaro ny fomba fanontanian-javatra sy ny fanondroana toerana araka ny vazan-tany.',
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
          textFr:
            'Pardon monsieur/madame, où se trouve le chemin qui mène au marché ?',
        },
        {
          type: 'example',
          textMg:
            'Inona ny vaovao any aminareo ? — Tsara ny vaovao, misaotra tompoko.',
          textFr:
            'Quelles sont les nouvelles chez vous ? — Les nouvelles sont bonnes, merci beaucoup.',
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
          question:
            'Quel mot malgache signifie « Où ? » pour demander un lieu ?',
          questionMg: 'Inona no teny fanontaniana manontany toerana ?',
          choices: ['Aiza ?', 'Inona ?', 'Iza ?', 'Rahoviana ?'],
          correctIndex: 0,
          explanation:
            '« Aiza ? » est le mot interrogatif pour demander « Où ? » (ex: Aiza ny lalana ? = Où est le chemin ?).',
        },
        {
          type: 'quiz',
          question:
            "Quel mot signifie « Quoi ? » ou « Qu'est-ce que ? » (ex: Inona ny vaovao ?)",
          questionMg:
            "Inona no teny manontany ny anton-javatra hoe « Quoi / Qu'est-ce que » ?",
          choices: ['Inona ?', 'Iza ?', 'Aiza ?', 'Ahoana ?'],
          correctIndex: 0,
          explanation: "« Inona ? » signifie « quoi » ou « qu'est-ce que ».",
        },
        {
          type: 'quiz',
          question:
            "Dans l'orientation traditionnelle malgache, quel point cardinal désigne « Avaratra » ?",
          questionMg:
            "Amin'ny vazan-tany, inona no tondroin'ny teny hoe « Avaratra » ?",
          choices: ['Le Nord', 'Le Sud', 'L’Est', 'L’Ouest'],
          correctIndex: 0,
          explanation:
            '« Avaratra » désigne le Nord, place sacrée et noble des aînés.',
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
          question:
            'Comment demande-t-on poliment « Qui êtes-vous ? » en malgache ?',
          questionMg:
            'Ahoana no fomba fanontaniana am-panajana hoe « Qui êtes-vous ? » ?',
          choices: [
            'Iza ianao tompoko ?',
            'Aiza ianao tompoko ?',
            'Inona ianao tompoko ?',
            'Rahoviana ianao tompoko ?',
          ],
          correctIndex: 0,
          explanation:
            '« Iza ianao tompoko ? » utilise « Iza » (qui) et « tompoko » pour une formule respectueuse.',
        },
      ],
    },
    {
      slug: 'les-verbes-du-quotidien-et-les-trois-temps',
      title:
        'Les verbes indispensables et les 3 temps (Matoanteny sy ny Fotoana)',
      titleMg: 'Ireo Matoanteny Fampiasa sy ny Fotoana Telo',
      summary:
        'Comprenez le mécanisme simple des temps (Passé, Présent, Futur) grâce aux préfixes N-, M-, H-.',
      summaryMg:
        "Fantaro ny zava-miafina amin'ny fanovana fotoana (Lasa, Ankehitriny, Ho avy) amin'ny litera N, M, H.",
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
            '• M = Présent (Ankehitriny)\n• N = Passé (Lasa)\n• H = Futur (Ho avy).\nExemple : Mandeha (part) → Nandeha (est parti) → Handeha (partira).',
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
          textFr:
            'Nous avons mangé un riz délicieux hier soir (passé avec le préfixe N-).',
        },
        {
          type: 'didYouKnow',
          textFr:
            'Puisque le verbe ne change pas avec la personne, la phrase « Miteny gasy izy » signifie « Il/Elle parle malgache » et « Miteny gasy isika » signifie « Nous parlons malgache ». Seul le pronom final indique qui agit !',
          textMg:
            "Tsy misy fahasamihafana amin'ny matoanteny ny olona tokana sy ny maro : « Miteny izy » sy « Miteny izahay » dia mitovy tanteraka ny matoanteny hoe « miteny ».",
        },
        // ─── 5 Micro-Quiz ───
        {
          type: 'quiz',
          question:
            'Quelle consonne préfixée indique généralement le temps Passé (Lasa) en malgache ?',
          questionMg:
            'Inona no litera fiandohana manondro ny fotoana Lasa matetika ?',
          choices: [
            'La lettre N (ex: Nandeha)',
            'La lettre M (ex: Mandeha)',
            'La lettre H (ex: Handeha)',
            'La lettre V',
          ],
          correctIndex: 0,
          explanation:
            'La lettre « N » marque le temps passé : Mandeha (présent) devient Nandeha (passé).',
        },
        {
          type: 'quiz',
          question:
            'Quelle consonne préfixée annonce une action au Futur (Ho avy) ?',
          questionMg: 'Inona no litera fiandohana manondro ny fotoana Ho avy ?',
          choices: [
            'La lettre H (ex: Handeha)',
            'La lettre N (ex: Nandeha)',
            'La lettre M (ex: Mandeha)',
            'La lettre T',
          ],
          correctIndex: 0,
          explanation:
            'La lettre « H » est la marque universelle du futur : Mihinana → Hihinana (mangera).',
        },
        {
          type: 'quiz',
          question: 'Que signifie la phrase « Miteny gasy aho » ?',
          questionMg: "Inona no dikan'ny fehezanteny hoe « Miteny gasy aho » ?",
          choices: [
            'Je parle malgache',
            'J’écoute de la musique',
            'Je mange du riz',
            'Je pars en voyage',
          ],
          correctIndex: 0,
          explanation:
            '« Miteny » = parler, « gasy » = malgache, « aho » = je/moi.',
        },
        {
          type: 'quiz',
          question:
            'Comment dit-on « Nous avons mangé » au passé avec le verbe « Mihinana » ?',
          questionMg:
            "Ahoana ny filazana ny hoe « Nihinana » amin'ny fotoana lasa ?",
          choices: [
            'Nihinana izahay',
            'Hihinana izahay',
            'Mihinana izahay',
            'Mihinanana izahay',
          ],
          correctIndex: 0,
          explanation: 'Au passé, le verbe prend le préfixe « N- » : Nihinana.',
        },
        {
          type: 'quiz',
          question:
            'Quel verbe signifie « Marcher » ou « Partir » en malgache ?',
          questionMg:
            'Inona no matoanteny midika hoe mandeha an-tongotra na miainga ?',
          choices: ['Mandeha', 'Misotro', 'Matory', 'Mahita'],
          correctIndex: 0,
          explanation: '« Mandeha » signifie marcher, aller ou partir.',
        },
      ],
    },
    {
      slug: 'exprimer-ses-emotions-accord-et-besoins',
      title:
        'Émotions, accord et expressions du quotidien (Fihetseham-po sy Filàna)',
      titleMg: 'Fihetseham-po, Fifanarahana ary Filàna Andavanandro',
      summary:
        'Exprimez vos ressentis, votre accord bienveillant et vos besoins avec délicatesse.',
      summaryMg:
        'Mianara maneho ny fihetseham-po, ny fanekena ary ny filàna andavanandro amim-panajana.',
      type: 'VOCABULARY',
      orderIndex: 9,
      durationMinutes: 5,
      sections: [
        {
          type: 'intro',
          textFr:
            "La courtoisie malgache accorde une importance primordiale à l'expression bienveillante des émotions. Savoir dire « oui », relativiser un souci avec « Tsy maninona » et encourager autrui avec « Mazotoa ! » fortifie le lien fraternel.",
          textMg:
            'Ny fahalalam-pomba malagasy dia manome lanja lehibe ny fanehoana hatsaram-panahy. Ny fahaizana mampahery sy milaza hoe « Tsy maninona » dia manamafy ny fihavanana.',
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
          question:
            "Que répond-on pour rassurer quelqu'un en disant « Ce n'est rien / Pas de souci » ?",
          questionMg:
            "Inona no teny fiteny mba hampitony hoe « Pas de souci / Ce n'est rien » ?",
          choices: [
            'Tsy maninona',
            'Misaotra betsaka',
            'Azafady tompoko',
            'Veloma finaritra',
          ],
          correctIndex: 0,
          explanation:
            "« Tsy maninona » est la formule d'apaisement par excellence (« ça ne fait rien »).",
        },
        {
          type: 'quiz',
          question: "Que signifie l'encouragement bienveillant « Mazotoa ! » ?",
          questionMg: 'Inona no hevitry ny fampaherezana hoe « Mazotoa ! » ?',
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
          question:
            "Comment exprime-t-on le sentiment d'être « heureux » ou « joyeux » en malgache ?",
          questionMg: 'Inona no teny ilazana ny fahatsapana fifaliana ?',
          choices: ['Faly', 'Malahelo', 'Noana', 'Vizana'],
          correctIndex: 0,
          explanation:
            '« Faly » signifie joyeux, content ou heureux (ex: Faly aho = Je suis heureux).',
        },
        {
          type: 'quiz',
          question: "Comment dit-on « J'ai soif » en langue malgache ?",
          questionMg: 'Ahoana no filazana ny hoe mila rano hosotroina ?',
          choices: ['Mangetaheta aho', 'Noana aho', 'Faly aho', 'Matory aho'],
          correctIndex: 0,
          explanation:
            "« Mangetaheta » signifie avoir soif (ex: Mangetaheta rano aho = J'ai soif d'eau).",
        },
        {
          type: 'quiz',
          question:
            "Sur quelle syllabe porte généralement l'accent tonique d'un mot malgache ?",
          questionMg:
            "Aiza ho aiza matetika no misy ny tsindrim-peo amin'ny teny malagasy ?",
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
      title:
        'La nourriture, les saveurs et le repas malgache (Ny Sakafo sy ny Hanina)',
      titleMg: 'Ny Sakafo, ny Tsiro ary ny Fihinanana Malagasy',
      summary:
        "Découvrez le vocabulaire culinaire, les saveurs traditionnelles et l'étiquette de la table.",
      summaryMg:
        'Ianaro ny voambolan’ny sakafo, ny tsiro samihafa ary ny fomba amam-panao eo am-pisakafoana.',
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
          textMg:
            'Mazotoa homana daholo tompoko ! — Misaotra tompoko, mazotoa koa ianao.',
          textFr:
            'Bon appétit à tous ! — Merci beaucoup, bon appétit à vous également.',
        },
        {
          type: 'example',
          textMg: 'Mamy be ity voankazo ity, ary matsiro ny laoka.',
          textFr:
            'Ce fruit est très sucré, et le plat d’accompagnement est délicieux.',
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
          question:
            'Quel proverbe illustre la place suprême du riz dans la vie des Malgaches ?',
          questionMg:
            "Inona no ohabolana mampiseho ny lanjan'ny vary amin'ny fiainan'ny Malagasy ?",
          choices: [
            '« Ny vary no aina » (Le riz est la vie)',
            '« Ny vola no aina »',
            '« Ny trano no aina »',
            '« Ny lalana no aina »',
          ],
          correctIndex: 0,
          explanation:
            '« Ny vary no aina » (Le riz est la vie) exprime le caractère sacré et vital de cette céréale à Madagascar.',
        },
        {
          type: 'quiz',
          question:
            'Comment appelle-t-on le plat ou la viande qui accompagne le riz ?',
          questionMg:
            "Inona no anaran'ny hena na anana ampiarahina amin'ny vary ?",
          choices: ['Ny Laoka', 'Ny Ampango', 'Ny Rano', 'Ny Sakafo'],
          correctIndex: 0,
          explanation:
            'Le « Laoka » désigne tout mets (viande, poisson, brèdes, haricots) accompagnant le riz blanc ou rouge.',
        },
        {
          type: 'quiz',
          question: 'Comment souhaite-t-on « Bon appétit ! » en malgache ?',
          questionMg:
            "Ahoana no firariana fahazotoana homana amin'ny teny malagasy ?",
          choices: [
            'Mazotoa homana !',
            'Mandra-pihaona !',
            'Azafady tompoko !',
            'Tonga soa !',
          ],
          correctIndex: 0,
          explanation:
            "« Mazotoa homana ! » signifie littéralement « Soyez plein d'entrain pour manger ».",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la boisson traditionnelle préparée à base de croûte de riz bouillie ?',
          questionMg:
            "Inona no zava-pisotro nentin-drazana avy amin'ny ampangon-bary nandrahoina ?",
          choices: ["Ranon'ampango", 'Ranom-boankazo', 'Ranom-boanio', 'Kafe'],
          correctIndex: 0,
          explanation:
            "Le « Ranon'ampango » (ou ranovola) est l'eau bouillie versée sur le riz doré au fond de la marmite.",
        },
        {
          type: 'quiz',
          question:
            'Que répond poliment un invité rassasié à la fin du repas ?',
          questionMg:
            'Inona no teny fanehoana fankasitrahana rehefa voky tsara ?',
          choices: [
            'Voky tsara, misaotra tompoko',
            'Mbola noana aho',
            'Tsy maninona',
            'Veloma tompoko',
          ],
          correctIndex: 0,
          explanation:
            "« Voky tsara, misaotra tompoko » affirme que l'on est copieusement et délicieusement rassasié avec reconnaissance.",
        },
      ],
    },
    // ─── LEÇON 11 : LA MAISON & HOSPITALITÉ ───
    {
      slug: 'la-maison-espace-et-fandraisam-bahiny',
      title:
        "La maison, l'espace domestique et l'art d'accueillir (Ny Trano & Fandraisam-bahiny)",
      titleMg: 'Ny Trano sy ny Fandraisam-bahiny Malagasy',
      summary:
        "Découvrez le vocabulaire de la maison, l'orientation sacrée de l'habitat et les formules d'hospitalité chaleureuse.",
      summaryMg:
        "Fantaro ny voambolan'ny trano, ny zoro firarazana ary ny fomba fandraisam-bahiny am-pitiavana.",
      type: 'VOCABULARY',
      orderIndex: 11,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Chez les Malgaches, la maison (*Trano*) n'est pas seulement un abri physique : c'est un microcosme cosmique orienté selon les points cardinaux. Le coin Nord-Est (*Zoro Firarazana*) est le sanctuaire des ancêtres et de la prière. L'accueil d'un visiteur (*Fandraisam-bahiny*) est sacré : un proverbe rappelle que « Ny vahiny toy ny rano indray mandeha » (l'invité est comme l'eau qui ne passe qu'une fois), invitant à lui réserver le meilleur accueil.",
          textMg:
            "Eo amin'ny fiainana malagasy, ny trano dia tsy fialofana fotsiny fa toerana masina mifamatotra amin'ny tontolo iainana. Ny Zoro Firarazana (Avaratra-Atsinanana) no toeram-bavaka sy fanajana ny Razana. Masina ny fandraisam-bahiny : « Ny vahiny toy ny rano indray mandeha », koa mendrika fandraisana am-pitiavana sy am-panajana lalandava.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TR / DR',
          phonetic: 'tr / dr (affriquées rétroflexes)',
          frenchEquivalent:
            "Se prononcent comme un 't' ou 'd' suivi d'un 'r' roulé très claqué, la langue appuyée contre le palais (ex: Trano = maison, Draindraik'izay = parfois).",
          sampleWordMg: 'Trano',
          sampleTranslationFr: 'Maison / Habitat familial',
        },
        {
          type: 'concept',
          termMg: 'Tsihy',
          phonetic: 'tsi-hi',
          meaningFr: 'La natte végétale tressée',
          explanation:
            "Élément central de la convivialité malgache. Posée au sol, elle sert d'espace pour s'asseoir, discuter, partager le repas et dormir en toute simplicité.",
        },
        {
          type: 'concept',
          termMg: 'Mandehana miditra / Midira tompoko',
          phonetic: 'man-de-ha-na mi-di-tra',
          meaningFr: 'Entrez donc / Soyez le bienvenu chez nous',
          explanation:
            "Formule d'hospitalité chaleureuse adressée à toute personne se présentant au seuil de la maison.",
        },
        {
          type: 'concept',
          termMg: 'Zoro Firarazana',
          phonetic: 'zou-rou fi-ra-ra-za-na',
          meaningFr: 'Le coin Nord-Est / Angle des ancêtres',
          explanation:
            "L'angle sacré de la maison traditionnelle malgache où l'on dépose les offrandes, où l'on bénit les enfants et où l'on invoque Zanahary et les aïeux.",
        },
        {
          type: 'concept',
          termMg: 'Fatapera sy Vilany',
          phonetic: 'fa-ta-pe-ra si vi-la-ni',
          meaningFr: 'Le réchaud à braises et la marmite',
          explanation:
            'Ustensiles indispensables de la cuisine quotidienne au charbon de bois pour faire cuire le riz et les plats mijotés (*Laoka*).',
        },
        {
          type: 'example',
          textMg:
            "Mandrosoa tompoko, mipetraha eto amin'ny tsihy fa hety hisotro rano mafana isika.",
          textFr:
            'Entrez donc Monsieur/Madame, asseyez-vous ici sur la natte, nous allons partager une boisson chaude.',
        },
        {
          type: 'example',
          textMg:
            "Azafady tompoko, aiza no ametrahana ny kiraro alohan'ny hidirana ao an-trano ?",
          textFr:
            'Excusez-moi, où dépose-t-on les chaussures avant de pénétrer dans la maison ?',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Dans l'architecture traditionnelle des Hautes Terres et de l'Imerina, la porte et les fenêtres s'ouvraient toujours vers l'Ouest afin de se protéger des vents froids venant de l'Est et pour capter la lumière chaleureuse du soleil couchant (*Masoandro mody*).",
          textMg:
            "Amin'ny trano gasy nentin-drazana, ny varavarana sy ny varavarankely dia mitodika miankandrefana foana mba hiarovana amin'ny rivotra mangatsiaka avy any atsinanana sy handraisana ny tara-pahazavana amin'ny hariva.",
        },
        {
          type: 'quiz',
          question:
            'Quel angle de la maison traditionnelle malgache est dédié aux ancêtres et à la prière ?',
          questionMg:
            'Inona no zoro masina ao an-trano fanaovana vavaka sy fanajana ny Razana ?',
          choices: [
            'Le coin Nord-Est (Zoro Firarazana)',
            'Le coin Sud-Ouest',
            'Le centre du toit',
            'Le seuil de la porte',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Zoro Firarazana' (Nord-Est) est l'orientation la plus sacrée de la cosmologie malgache, où s'accomplissent les bénédictions et prières rituelles.",
        },
        {
          type: 'quiz',
          question:
            'Que symbolise la natte tressée (« Tsihy ») dans le foyer malgache ?',
          questionMg:
            "Inona no hevitra fonosin'ny « Tsihy » eo amin'ny tokantrano malagasy ?",
          choices: [
            'La fraternité, le partage et la simplicité conviviale',
            'Une simple décoration murale',
            'Une barrière pour repousser les visiteurs',
            'Un objet réservé uniquement aux rois',
          ],
          correctIndex: 0,
          explanation:
            "S'asseoir ensemble sur le 'tsihy' efface les distances sociales et scelle la convivialité, l'égalité et l'écoute mutuelle.",
        },
        {
          type: 'quiz',
          question:
            "Quelle phrase prononce-t-on pour inviter chaleureusement quelqu'un à entrer chez soi ?",
          questionMg:
            'Inona no teny enti-mandray vahiny am-pitiavana mba hiditra ao an-trano ?',
          choices: [
            'Mandrosoa tompoko / Midira ao an-trano',
            'Mandehana mody',
            'Azafady fa mikatona ny trano',
            'Mijanona eny ivelany',
          ],
          correctIndex: 0,
          explanation:
            '« Mandrosoa tompoko » (Avancez donc) ou « Midira ao an-trano » exprime un accueil généreux et bienveillant.',
        },
        {
          type: 'quiz',
          question:
            'Comment se prononce le digraphe « TR » en langue malgache (ex: Trano) ?',
          questionMg:
            "Ahoana no fanononana ny litera « TR » amin'ny teny malagasy ?",
          choices: [
            "Comme un 't' suivi d'un 'r' claqué et roulé contre le palais",
            "Comme un 'ch' doux français",
            "Comme un simple 't' muet",
            "Comme un 'z' sifflant",
          ],
          correctIndex: 0,
          explanation:
            "Le son 'TR' malgache est une consonne affriquée alvéolaire où le 't' et le 'r' roulé fusionnent énergiquement.",
        },
        {
          type: 'quiz',
          question:
            "Pourquoi les ouvertures de la maison traditionnelle malgache étaient-elles orientées vers l'Ouest ?",
          questionMg:
            "Nahoana no niankandrefana ny varavaran'ny trano gasy nentin-drazana ?",
          choices: [
            "Pour se protéger du vent froid d'Est et profiter de la chaleur du soleil couchant",
            'Parce que le bois ne poussait que vers l’Ouest',
            'Pour cacher la maison aux voisins',
            'Pour éviter la lumière du jour',
          ],
          correctIndex: 0,
          explanation:
            "Cette orientation bioclimatique ancestrale protégeait du vent d'alizé de l'Est et emmagasinait la douce chaleur vespérale.",
        },
      ],
    },

    // ─── LEÇON 12 : LE CORPS HUMAIN & SANTÉ ───
    {
      slug: 'le-corps-humain-sante-et-bien-etre',
      title:
        "Le corps humain, la santé et le bien-être (Ny Vatan'olombelona sy ny Fahasalamana)",
      titleMg: "Ny Vatan'olombelona sy ny Fahasalamana",
      summary:
        'Apprenez à nommer les parties du corps, à exprimer vos sensations physiques et à demander ou donner des nouvelles de santé.',
      summaryMg:
        "Ianaro ny anaran'ny rantsam-batana, ny fitenenana rehefa marary ary ny fifampiarahana fahasalamana.",
      type: 'VOCABULARY',
      orderIndex: 12,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "En langue malgache, les parties du corps sont intimement associées aux métaphores de l'âme et des émotions. Le cœur (*Fo*) est le siège des sentiments profonds, le ventre (*Kibo*) celui de la sincérité (*Madio kibo* = avoir le cœur pur, sans rancune). Savoir exprimer sa santé ou s'enquérir avec délicatesse de celle d'autrui est un devoir élémentaire de politesse.",
          textMg:
            "Amin'ny teny malagasy, ny anaran'ny taova sy ny rantsam-batana dia misy hevitra lalina mifandray amin'ny fanahy sy ny fihetseham-po. Ny Fo no toeran'ny fitiavana, ny Kibo no fitaratry ny fahatsoram-po (« Madio kibo »). Ny fiheverana ny fahasalaman'ny hafa dia adidy lehibe amin'ny fifanajana andavanandro.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'Voyelles finales atones',
          phonetic: 'a / y (assourdies)',
          frenchEquivalent:
            "En fin de mot, les voyelles malgaches 'a' et 'y' ne sont pas accentuées : elles s'assourdissent et se chuchotent presque (ex: Loha se prononce 'lou-h(a)', Tanana se prononce 'ta-na-n(a)').",
          sampleWordMg: 'Tanana',
          sampleTranslationFr: 'Main / Bras',
        },
        {
          type: 'concept',
          termMg: 'Loha sy Maso',
          phonetic: 'lou-ha si ma-sou',
          meaningFr: 'La tête et les yeux',
          explanation:
            "Parties supérieures du corps. 'Maso' (l'œil) entre dans la composition du mot 'Masoandro' (le soleil, littéralement « l'œil du jour »).",
        },
        {
          type: 'concept',
          termMg: 'Tanana sy Tongotra',
          phonetic: 'ta-na-na si toun-gou-tra',
          meaningFr: 'La main et le pied / la jambe',
          explanation:
            "Membres du travail, de la marche et de l'entraide communautaire. 'Tanana' symbolise le geste solidaire (*Valin-tanana*).",
        },
        {
          type: 'concept',
          termMg: 'Marary / Salama',
          phonetic: 'ma-ra-ri / sa-la-ma',
          meaningFr:
            'Être malade, souffrant / Être en bonne santé, bien portant',
          explanation:
            "Les deux états fondamentaux du corps. Pour exprimer une douleur : 'Marary ny...' (ex: *Marary loha aho* = J'ai mal à la tête).",
        },
        {
          type: 'concept',
          termMg: 'Tambavy',
          phonetic: 'tam-ba-vi',
          meaningFr: 'Infusion traditionnelle bienfaisante',
          explanation:
            'Décoction de plantes et feuilles médicinales préparée pour revigorer le corps, apaiser la fièvre et purifier l’organisme.',
        },
        {
          type: 'example',
          textMg:
            'Mba manao ahoana ny fahasalamana tompoko ? Salama tsara fa misaotra indrindra.',
          textFr:
            'Comment va votre santé s’il vous plaît ? Elle est excellente, merci infiniment.',
        },
        {
          type: 'example',
          textMg:
            'Marary kibo kely ny ankizy ka mila tambavy mafana sy fitsaharana.',
          textFr:
            'L’enfant a un peu mal au ventre, il a besoin d’une infusion chaude et de repos.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Le mot malgache « Tsara tarehy » (beau, jolie) est composé de « Tsara » (bon, beau) et « Tarehy » (le visage, les traits). De même, pour dire que quelqu'un est généreux, on dit qu'il a la « main ouverte » (*Malalaka tanana*).",
          textMg:
            "Ny hoe « Tsara tarehy » dia avy amin'ny « Tsara » sy « Tarehy ». Rehefa olona tsara fanahy sy mpanome kosa dia lazaina hoe « Malalaka tanana ».",
        },
        {
          type: 'quiz',
          question: 'Comment dit-on « J’ai mal à la tête » en malgache ?',
          questionMg:
            "Ahoana no filazana hoe « Marary loha aho » amin'ny teny malagasy ?",
          choices: [
            'Marary loha aho',
            'Marary tongotra aho',
            'Salama tsara aho',
            'Noana aho',
          ],
          correctIndex: 0,
          explanation:
            '« Marary » (souffrant) + « loha » (tête) + « aho » (je/moi) : « Marary loha aho » exprime le mal de tête.',
        },
        {
          type: 'quiz',
          question:
            "Quel mot malgache désigne l'œil et entre dans la composition du mot « Masoandro » (le soleil) ?",
          questionMg:
            'Inona no teny malagasy midika hoe « œil » ka manome ny teny hoe « Masoandro » ?',
          choices: ['Maso', 'Loha', 'Sofina', 'Vava'],
          correctIndex: 0,
          explanation:
            "« Maso » signifie 'œil'. Le soleil est poétiquement appelé 'Masoandro', c'est-à-dire l'œil du jour.",
        },
        {
          type: 'quiz',
          question:
            "Qu'est-ce que le « Tambavy » dans la culture traditionnelle malgache ?",
          questionMg:
            "Inona no atao hoe « Tambavy » amin'ny fitsaboana nentin-drazana malagasy ?",
          choices: [
            'Une tisane ou décoction de plantes médicinales bienfaisantes',
            'Une danse de fête',
            'Un vêtement d’hiver',
            'Un plat de viande séchée',
          ],
          correctIndex: 0,
          explanation:
            'Le Tambavy est une tisane médicinale traditionnelle à base de feuilles, racines et écorces aromatiques préparée pour soigner le corps.',
        },
        {
          type: 'quiz',
          question:
            'Que signifie métaphoriquement l’expression malgache « Madio kibo » ?',
          questionMg:
            "Inona no hevitra fonosin'ny ohabolana na fitenenana hoe « Madio kibo » ?",
          choices: [
            'Avoir le cœur pur, sans rancune ni duplicité',
            'Avoir très faim',
            'Avoir mal au ventre',
            'Avoir fini de manger',
          ],
          correctIndex: 0,
          explanation:
            "« Madio kibo » (avoir le ventre propre) signifie au sens figuré n'abriter aucune animosité ni méchanceté envers autrui.",
        },
        {
          type: 'quiz',
          question:
            "Comment se prononcent généralement les voyelles finales 'a' et 'y' en malgache ?",
          questionMg:
            "Ahoana no fanononana ny zanatsoratra 'a' sy 'y' any amin'ny faran'ny teny malagasy ?",
          choices: [
            "Elles sont atones et s'assourdissent presque en chuchotement",
            'Elles sont fortement accentuées et traînantes',
            "Elles se transforment toujours en 'O'",
            "Elles se prononcent comme un 'R' roulé",
          ],
          correctIndex: 0,
          explanation:
            "En malgache, l'accent tonique tombe sur l'avant-dernière syllabe (pénultième) ; la voyelle finale est donc très douce et à peine articulée.",
        },
      ],
    },

    // ─── LEÇON 13 : NATURE, SAISONS & MÉTÉO ───
    {
      slug: 'la-nature-les-saisons-et-le-climat',
      title:
        'La nature, les saisons et la météo (Ny Zavaboary sy ny Toetrandro)',
      titleMg: 'Ny Zavaboary, ny Toetrandro sy ny Fizaran-taona',
      summary:
        "Explorez le vocabulaire des éléments naturels, les saisons de l'île Rouge et les expressions pour décrire le temps.",
      summaryMg:
        'Fantaro ny voambolan’ny zavaboary, ny toetrandro ary ny fizaran-taona eto Madagasikara.',
      type: 'CULTURE',
      orderIndex: 13,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Madagascar vit au rythme de la nature et de ses contrastes climatiques. Les deux grandes saisons sont le **Fahavaratra** (saison chaude et pluvieuse, propice au riz) et le **Ririnina** (l'hiver austral, sec et frais sur les Hautes Terres). Entre elles s'intercalent le **Fararano** (temps des moissons et de l'abondance) et l'**Asotry**. L'harmonie entre l'homme et les éléments naturels (*Zavaboary*) est au cœur de la spiritualité insulaire.",
          textMg:
            "Madagasikara dia miaina mifanaraka amin'ny fiovan'ny toetrandro sy ny vanim-potoana. Misy ny **Fahavaratra** (mafana sy be orana, maniry ny vary) sy ny **Ririnina** (mangatsiaka sy maina). Eo anelanelany ny **Fararano** fotoam-piotazana sy fahavokarana. Ny fifandraisana mirindra amin'ny Zavaboary no fototry ny fahendren-drazana.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'V',
          phonetic: 'v (labio-dentale douce)',
          frenchEquivalent:
            "Se prononce comme le 'v' français de 'vent' ou 'vie', mais avec une vibration très douce des lèvres (ex: Vava = bouche, Vary = riz, Vintana = destin).",
          sampleWordMg: 'Vary',
          sampleTranslationFr: 'Riz (aliment sacré)',
        },
        {
          type: 'concept',
          termMg: 'Fahavaratra sy Ririnina',
          phonetic: 'fa-ha-va-ra-tra / ri-ri-ni-na',
          meaningFr: "L'été pluvieux et l'hiver austral frais",
          explanation:
            'Les deux saisons maîtresses qui gouvernent le calendrier agricole, les fêtes coutumières et les activités quotidiennes.',
        },
        {
          type: 'concept',
          termMg: 'Fararano',
          phonetic: 'fa-ra-ra-nou',
          meaningFr: "La saison d'automne et des récoltes (mars à mai)",
          explanation:
            "Littéralement « la fin des pluies ». Saison bénie de réjouissances, où les greniers sont pleins et où s'organisent mariages et fêtes traditionnelles.",
        },
        {
          type: 'concept',
          termMg: 'Masoandro sy Orana',
          phonetic: 'ma-sou-an-drou / ou-ra-na',
          meaningFr: 'Le soleil et la pluie',
          explanation:
            "Les deux forces célestes indispensables à la vie : l'eau qui nourrit la terre et la lumière qui fait mûrir les épis.",
        },
        {
          type: 'concept',
          termMg: 'Mangatsiaka / Mafana',
          phonetic: 'man-ga-tsi-ka / ma-fa-na',
          meaningFr: 'Il fait froid / Il fait chaud',
          explanation:
            "Expressions usuelles de la météo : 'Mangatsiaka ny andro' (il fait froid), 'Mafana ny andro' (il fait chaud).",
        },
        {
          type: 'example',
          textMg: 'Avy ny orana ka mangatsiaka ny andro anio tompoko.',
          textFr:
            'La pluie arrive et il fait froid aujourd’hui Monsieur/Madame.',
        },
        {
          type: 'example',
          textMg:
            "Mamirapiratra ny masoandro amin'ny fararano ka faly ny mpamboly.",
          textFr:
            'Le soleil resplendit en cette saison des récoltes et les cultivateurs se réjouissent.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Un proverbe célèbre dit : « Tsy misy mamy toy ny fararano » (Rien n'est plus doux que la saison des récoltes). C'est à ce moment de l'année que le riz nouveau (*Vary vao*) est goûté en famille dans une communion de gratitude envers la terre.",
          textMg:
            "Heverina ho fotoana mamy indrindra ny Fararano : « Tsy misy mamy toy ny fararano », satria eo no hanina ny vary vao sy ifampizarana ny vokatra be tamin'ny asa mafy.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la saison des pluies et de la chaleur à Madagascar ?',
          questionMg:
            'Inona no vanim-potoana mafana sy be orana eto Madagasikara ?',
          choices: [
            'Ny Fahavaratra',
            'Ny Ririnina',
            'Ny Lohataona',
            'Ny Asotry',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Fahavaratra' (de novembre à avril) est la saison chaude et pluvieuse qui permet le développement luxuriant de la végétation et des rizières.",
        },
        {
          type: 'quiz',
          question:
            'Que signifie littéralement le mot « Fararano » (la saison des moissons) ?',
          questionMg:
            "Inona no hevitra ara-pitenenana fonosin'ny teny hoe « Fararano » ?",
          choices: [
            'La fin des eaux / La fin des pluies',
            'Le grand fleuve',
            'Le début de l’hiver',
            'La terre sèche',
          ],
          correctIndex: 0,
          explanation:
            "« Fara » (fin, terme) + « rano » (eau) : c'est la période où les pluies cessent pour laisser place aux moissons dorées.",
        },
        {
          type: 'quiz',
          question:
            'Comment dit-on « Il fait froid aujourd’hui » en malgache ?',
          questionMg: 'Ahoana no filazana hoe « Mangatsiaka ny andro anio » ?',
          choices: [
            'Mangatsiaka ny andro anio',
            'Mafana be ny andro',
            'Misy orana be',
            'Maizina ny andro',
          ],
          correctIndex: 0,
          explanation:
            "« Mangatsiaka » (froid) + « ny andro » (le temps / le jour) + « anio » (aujourd'hui) exprime la sensation de fraîcheur.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la saison fraîche de l’hiver austral à Madagascar ?',
          questionMg:
            "Inona no anaran'ny vanim-potoana mangatsiaka indrindra (hiver austral) ?",
          choices: [
            'Ny Ririnina',
            'Ny Fahavaratra',
            'Ny Fararano',
            'Ny Asombola',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Ririnina' (de juin à août) correspond à l'hiver austral, caractérisé par des températures fraîches sur les plateaux centraux.",
        },
        {
          type: 'quiz',
          question:
            'Que célèbre-t-on traditionnellement à la saison du Fararano ?',
          questionMg:
            'Inona no fotoam-pifaliana ankalazaina mandritra ny Fararano ?',
          choices: [
            "La récolte du riz, l'abondance et les cérémonies familiales joyeuses",
            'La plantation des premiers grains de maïs',
            'Le jeûne obligatoire de toute la communauté',
            'Le départ en exil des troupeaux',
          ],
          correctIndex: 0,
          explanation:
            "Le Fararano est le temps de la plénitude : les greniers à riz sont remplis, les familles se réunissent et partagent le 'Vary vao'.",
        },
      ],
    },

    // ─── LEÇON 14 : COULEURS, FORMES & DESCRIPTIONS ───
    {
      slug: 'les-couleurs-les-formes-et-descriptions',
      title:
        'Couleurs, formes et description des choses (Ny Loko sy ny Toetra)',
      titleMg: 'Ny Loko, ny Endrika ary ny Toetran-javatra',
      summary:
        "Maîtrisez les nuances des couleurs, les formes géométriques et la place fondamentale de l'adjectif qualificatif.",
      summaryMg:
        'Ianaro ny loko rehetra, ny endrika ary ny fomba filazana ny toetran’ny zava-misy.',
      type: 'GRAMMAR',
      orderIndex: 14,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "En langue malgache, les couleurs possèdent une symbolique profonde. Le rouge (*Mena*) est la couleur royale, de la terre nourricière et du courage. Le bleu (*Manga*) évoque le ciel pur et l'excellence humaine. Règle d'or grammaticale : l'adjectif qualificatif se place **toujours après** le nom qu'il qualifie (ex: *Trano lehibe* = une grande maison, *Lamba fotsy* = un lamba blanc).",
          textMg:
            "Ny loko eo amin'ny teny malagasy dia manana hevitra lehibe. Ny Mena dia lokon'andriana sy tanindrazana. Ny Manga dia maneho ny hatsarana sy ny fahamboniana. Fitsipika tsotra nefa lehibe : ny mpamari-toetra dia apetraka **aorian'ny anarana** foana (oh: *Trano lehibe*, *Lamba fotsy*).",
        },
        {
          type: 'phonetic',
          letterOrSound: 'TS',
          phonetic: 'ts (affriquée alvéolaire)',
          frenchEquivalent:
            "Se prononce comme 'ts' dans 'tsar' ou 'tsunami', très net et franc (ex: Tsara = bon/bien, Maitso = vert, Tsihy = natte).",
          sampleWordMg: 'Maitso',
          sampleTranslationFr: 'Vert (couleur de la vie et des rizières)',
        },
        {
          type: 'concept',
          termMg: 'Mena sy Fotsy sy Mainty',
          phonetic: 'me-na / fou-tsi / main-ti',
          meaningFr: 'Rouge, Blanc et Noir',
          explanation:
            'Les trois couleurs fondamentales de la tradition. Le blanc symbolise la pureté et la bénédiction (*Hasina*), le rouge la souveraineté, le noir la terre et la profondeur.',
        },
        {
          type: 'concept',
          termMg: 'Maitso sy Manga sy Mavo',
          phonetic: 'mai-tsou / man-ga / ma-vou',
          meaningFr: 'Vert, Bleu et Jaune',
          explanation:
            'Le vert des rizières fertiles, le bleu du ciel azur et le jaune doré des récoltes de riz mûr.',
        },
        {
          type: 'concept',
          termMg: 'Lehibe sy Kely',
          phonetic: 'le-hi-be / ke-li',
          meaningFr: 'Grand et Petit',
          explanation:
            'Adjectifs de dimension les plus utilisés. Exemples : *Omby lehibe* (un grand zébu), *Zaza kely* (un petit enfant).',
        },
        {
          type: 'concept',
          termMg: 'Vaovao sy Antitra / Madio sy Maloto',
          phonetic: 'vow-vow / an-ti-tra | ma-diou / ma-lou-tou',
          meaningFr: 'Nouveau et Vieux / Propre et Sale',
          explanation:
            "Couples d'adjectifs descriptifs essentiels pour qualifier l'état des objets, des vêtements et des lieux.",
        },
        {
          type: 'example',
          textMg: 'Manana lamba landy fotsy madio sy tsara tarehy ny renibe.',
          textFr:
            'La grand-mère possède un lamba de soie blanche, propre et d’une grande beauté.',
        },
        {
          type: 'example',
          textMg:
            "Misy omby mena lehibe telo miandry eny amin'ny kijana maitso.",
          textFr:
            'Il y a trois grands zébus rouges qui paissent dans le pré verdoyant.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "En malgache, le mot « Manga » désigne la couleur bleue, mais il signifie aussi au figuré « remarquable, d'élite, prestigieux ». Une personne éminente de la communauté est appelée un « Olona manga » (un esprit brillant, une fierté nationale).",
          textMg:
            "Ny teny hoe « Manga » dia sady milaza loko manga no midika hoe « sangany, tsara indrindra ». Ny olo-malaza nahavita be ho an'ny firenena dia antsoina hoe « Olona manga ».",
        },
        {
          type: 'quiz',
          question:
            "Où se place l'adjectif qualificatif par rapport au nom en langue malgache ?",
          questionMg:
            "Aiza no toerana misy ny mpamari-toetra raha oharina amin'ny anarana ?",
          choices: [
            'Toujours après le nom (ex: Trano lehibe)',
            'Toujours avant le nom',
            'Au tout début de la phrase uniquement',
            'À la fin du paragraphe',
          ],
          correctIndex: 0,
          explanation:
            "En malgache, le déterminé précède le déterminant : on dit 'Trano' (maison) + 'lehibe' (grande), jamais l'inverse.",
        },
        {
          type: 'quiz',
          question:
            'Que symbolise la couleur rouge (« Mena ») dans la tradition malgache ?',
          questionMg:
            "Inona no hevitra lehibe fonosin'ny loko « Mena » amin'ny kolontsaina malagasy ?",
          choices: [
            'La souveraineté royale, la terre nourricière et le courage',
            'La peur et la défaite',
            'Le silence absolu',
            'La nuit et le sommeil',
          ],
          correctIndex: 0,
          explanation:
            "Le rouge est la couleur des souverains d'autrefois, de la latérite sacrée de l'île et des ornements d'honneur.",
        },
        {
          type: 'quiz',
          question:
            'Comment traduit-on « Un petit zébu blanc » en respectant l’ordre des mots malgaches ?',
          questionMg:
            "Ahoana no filazana marina hoe « un petit zébu blanc » amin'ny teny malagasy ?",
          choices: [
            'Omby fotsy kely',
            'Kely fotsy omby',
            'Fotsy omby kely',
            'Omby kely lehibe',
          ],
          correctIndex: 0,
          explanation:
            "On place le nom en tête : 'Omby' (zébu) suivi des adjectifs 'fotsy' (blanc) et 'kely' (petit).",
        },
        {
          type: 'quiz',
          question:
            'Que signifie l’expression honorifique « Olona manga » en malgache ?',
          questionMg:
            "Inona no hevitry ny fiantsoana hoe « Olona manga » eo amin'ny fiarahamonina ?",
          choices: [
            'Une personnalité remarquable, éminente et exemplaire',
            'Une personne habillée tout en bleu',
            'Un marchand de fruits',
            'Un voyageur étranger',
          ],
          correctIndex: 0,
          explanation:
            "Au-delà de la couleur, 'Manga' désigne l'excellence. Un 'Olona manga' est une figure émérite honorée par le peuple.",
        },
        {
          type: 'quiz',
          question: 'Comment dit-on « Vert » en malgache ?',
          questionMg: 'Inona no teny malagasy midika hoe « Vert » ?',
          choices: ['Maitso', 'Mavo', 'Mainty', 'Mena'],
          correctIndex: 0,
          explanation:
            '« Maitso » est la couleur verte, emblème de la nature florissante et des jeunes pousses de riz.',
        },
      ],
    },

    // ─── LEÇON 15 : VÊTEMENTS & LE LAMBA TRADITIONNEL ───
    {
      slug: 'les-vetements-et-le-lamba-traditionnel',
      title:
        'Vêtements traditionnels et l’élégance du Lamba (Ny Fitafiana sy ny Lamba)',
      titleMg: 'Ny Fitafiana nentin-drazana sy ny Lamba Malagasy',
      summary:
        'Plongez dans l’art vestimentaire malgache : le port du Lamba, les étoffes de soie et les tenues de fête.',
      summaryMg:
        'Fantaro ny haikanto amin’ny fitafiana malagasy, ny lanjan’ny lamba ary ny fanajana eo amin’ny fiarahamonina.',
      type: 'CULTURE',
      orderIndex: 15,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Le **Lamba** est bien plus qu'un vêtement : c'est l'âme visible du peuple malgache, un insigne de dignité, de pudeur et d'honneur (*Fahamendrehana*). Porté avec distinction drapé sur les épaules, il accompagne chaque étape de la vie humaine. On distingue la prestigieuse soie sauvage (*Lamba landy*), le coton blanc solennel (*Lamba arindrano*) et le *Lambahoany* chatoyant des régions côtières, qui arbore toujours un proverbe philosophique imprimé en son centre.",
          textMg:
            "Ny **Lamba** dia taratry ny fahamendrehana sy ny hasin'ny Malagasy. Tsy fitafy tsotra izy fa mariky ny fanajana sy ny fihavanana. Misy ny **Lamba landy** vita amin'ny landy natoraly sarobidy, ny **Lamba arindrano** fotsy manetriketrika, ary ny **Lambahoany** marevaka misy ohabolana eny amin'ny morontsiraka.",
        },
        {
          type: 'phonetic',
          letterOrSound: 'Y final',
          phonetic: 'i (bref et doux)',
          frenchEquivalent:
            "La lettre 'y' n'apparaît qu'à la toute fin des mots malgaches et se prononce comme un 'i' très court et discret (ex: Landy = soie, Malagasy = malgache, Fady = tabou).",
          sampleWordMg: 'Landy',
          sampleTranslationFr: 'Soie naturelle tissée à la main',
        },
        {
          type: 'concept',
          termMg: 'Lamba landy',
          phonetic: 'lam-ba lan-di',
          meaningFr: 'Le lamba de soie sauvage',
          explanation:
            'Tissu noble tissé à la main à partir des cocons du ver à soie sauvage (*Landibe*). Porté lors des mariages, des discours officiels (*Kabary*) et des cérémonies sacrées.',
        },
        {
          type: 'concept',
          termMg: 'Lambahoany',
          phonetic: 'lam-ba-hou-a-ni',
          meaningFr: 'Le pagne de coton imprimé côtier',
          explanation:
            'Étoffe souple et colorée très prisée sur les côtes de Madagascar, portant toujours un proverbe (*Ohabolana*) au centre qui inspire et conseille la communauté.',
        },
        {
          type: 'concept',
          termMg: 'Satroka bory / Satroka bakoly',
          phonetic: 'sa-trou-ka bou-ri / sa-trou-ka ba-kou-li',
          meaningFr: 'Le chapeau traditionnel en paille tressée',
          explanation:
            'Chapeau élégant tressé en fibres végétales (sisal, raphia ou paille de riz), accessoire masculin et féminin par excellence lors des rassemblements.',
        },
        {
          type: 'concept',
          termMg: 'Mitafy / Miakanjo',
          phonetic: 'mi-ta-fi / mi-a-kan-dzou',
          meaningFr: 'Porter le lamba / S’habiller',
          explanation:
            "On utilise 'Mitafy' spécifiquement pour l'acte de se draper dans un lamba, et 'Miakanjo' pour mettre des habits.",
        },
        {
          type: 'example',
          textMg:
            'Mitafy lamba landy madio ny mpikabary rehefa manomboka ny teny fanajana.',
          textFr:
            'L’orateur traditionnel est drapé d’un noble lamba de soie lorsqu’il entame les paroles de respect.',
        },
        {
          type: 'example',
          textMg:
            'Tena milamina sy tsara tarehy ity lambahoany misy ohabolana ity.',
          textFr:
            'Ce lambahoany orné d’un proverbe est particulièrement harmonieux et magnifique.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Un proverbe célèbre dit : « Ny lamba lany fanjaitra, ny fihavanana tsy mba lany » (Le tissu finit par s'user sous les aiguilles, mais le lien de fraternité ne s'use jamais). Offrir un lamba à un aîné ou à un invité d'honneur est le présent le plus noble qui soit.",
          textMg:
            'Misy ohabolana malaza manao hoe : « Ny lamba lany fanjaitra, ny fihavanana tsy mba lany ». Ny fanolorana lamba dia mariky ny fanomezam-boninahitra ambony indrindra.',
        },
        {
          type: 'quiz',
          question:
            'Que représente le « Lamba » dans la culture et la vie quotidienne malgache ?',
          questionMg:
            "Inona no hevitra amam-panahy fonosin'ny « Lamba » eo amin'ny fiainana malagasy ?",
          choices: [
            "Un symbole suprême de dignité, d'honneur et de lien social",
            'Un simple morceau de tissu pour s’essuyer les mains',
            'Un uniforme scolaire moderne',
            'Un drap de lit uniquement',
          ],
          correctIndex: 0,
          explanation:
            'Le Lamba est la parure identitaire de Madagascar, porté avec respect pour marquer la dignité de la personne.',
        },
        {
          type: 'quiz',
          question:
            'Quelle matière précieuse est utilisée pour tisser le « Lamba landy » ?',
          questionMg:
            'Inona no akora voajanahary sarobidy anenomana ny « Lamba landy » ?',
          choices: [
            'La soie sauvage issue des cocons traditionnels (Landibe)',
            'La laine de mouton d’Écosse',
            'Le plastique recyclé',
            'Le cuir de zébu séché',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Lamba landy' est tissé artisanalement à partir des cocons de soie sauvage de Madagascar, réputée pour sa robustesse et sa texture noble.",
        },
        {
          type: 'quiz',
          question:
            'Quelle est la particularité du « Lambahoany » porté sur les régions côtières ?',
          questionMg:
            "Inona no mampiavaka ny « Lambahoany » fampiasa eny amin'ny morontsiraka ?",
          choices: [
            'Il comporte un proverbe (*Ohabolana*) philosophique imprimé en son centre',
            'Il est entièrement noir sans motif',
            'Il est fait de métal tressé',
            'Il ne se porte que la nuit',
          ],
          correctIndex: 0,
          explanation:
            "Chaque Lambahoany présente un proverbe central en malgache portant une leçon de sagesse, un mot d'amour ou une parole de paix.",
        },
        {
          type: 'quiz',
          question:
            'Quel couvre-chef traditionnel en fibres végétales complète avec élégance la tenue malgache ?',
          questionMg:
            "Inona no satroka nentin-drazana vita amin'ny rary zava-maniry mampiseho fahamendrehana ?",
          choices: [
            'Ny Satroka bory / Satroka bakoly',
            'Le béret basque',
            'Le casque de chantier',
            'La casquette de baseball',
          ],
          correctIndex: 0,
          explanation:
            "Le 'Satroka bory' ou 'Satroka bakoly' en paille finement tressée est le chapeau emblématique des réunions et fêtes malgaches.",
        },
        {
          type: 'quiz',
          question:
            'Que rappelle le proverbe « Ny lamba lany fanjaitra, ny fihavanana tsy mba lany » ?',
          questionMg:
            "Inona no fampianarana lehibe ao anatin'ny ohabolana hoe « Ny lamba lany fanjaitra, ny fihavanana tsy mba lany » ?",
          choices: [
            'Les biens matériels périssent, mais la fraternité et l’amour demeurent éternels',
            'Qu’il faut changer de tailleur rapidement',
            'Que les aiguilles coûtent trop cher au marché',
            'Qu’il ne faut jamais réparer un vêtement',
          ],
          correctIndex: 0,
          explanation:
            "Ce proverbe sublime enseigne que les vêtements s'usent avec le temps, tandis que les liens du cœur et la solidarité ne s'éteignent jamais.",
        },
      ],
    },

    // ─── LEÇON 16 : NÉGATION, REFUS POLI & MISES EN GARDE ───
    {
      slug: 'la-negation-le-refus-poli-et-interdictions',
      title:
        'La négation, le refus poli et les interdictions (Ny Mandà sy ny Mandrara am-panajana)',
      titleMg: 'Ny Mandà am-panajana, ny Tsy sy ny Aza',
      summary:
        'Apprenez à formuler la négation avec nuance, à refuser poliment sans offenser et à exprimer une mise en garde bienveillante.',
      summaryMg:
        'Ianaro ny fampiasana ny « Tsy », ny « Aza », ny fandavana am-pahendrena ary ny fahalalam-pomba.',
      type: 'GRAMMAR',
      orderIndex: 16,
      durationMinutes: 7,
      sections: [
        {
          type: 'intro',
          textFr:
            "Dans la culture malgache où l'harmonie des relations (*Fihavanana*) est souveraine, opposer un « non » direct et tranchant est considéré comme maladroit. On privilégie toujours des tournures empreintes de tact et de déférence. Sur le plan grammatical, deux mots clés gouvernent la négation : **Tsy** (pour nier un fait ou une action : *ne... pas*) et **Aza** (pour exprimer un impératif négatif, une défense ou une recommandation bienveillante : *ne... pas !*).",
          textMg:
            "Eo amin'ny fifampitondrana malagasy, ny fandavana mivantana sy henjana dia manafintohina. Ny fahaiza-mandà am-pahalalam-pomba no mampaharitra ny fihavanana. Ao amin'ny fitsipiky ny teny, misy teny roa lehibe : ny **Tsy** (fandavana tsotra) sy ny **Aza** (fandrarana am-pitiavana na fampitandremana).",
        },
        {
          type: 'phonetic',
          letterOrSound: 'GN / Ñ',
          phonetic: 'gn (nasale palatale)',
          frenchEquivalent:
            "Dans plusieurs dialectes côtiers et dans des expressions courantes, se prononce comme 'gn' dans 'montagne' ou 'vigne' (ex: Managnana = avoir, possession).",
          sampleWordMg: 'Manangana',
          sampleTranslationFr: 'Élever / Fonder une famille',
        },
        {
          type: 'concept',
          termMg: 'Tsy (Négation déclarative)',
          phonetic: 'tsi',
          meaningFr: 'Ne... pas (négation du verbe et de la phrase)',
          explanation:
            "Se place directement devant le verbe ou l'adjectif. Exemples : *Tsy fantatro* (Je ne sais pas), *Tsy manana aho* (Je n'ai pas), *Tsy mety* (Ce n'est pas possible / convenable).",
        },
        {
          type: 'concept',
          termMg: 'Aza (Impératif de défense / Recommandation)',
          phonetic: 'a-za',
          meaningFr: 'Ne... pas ! (défense bienveillante)',
          explanation:
            "Utilisé pour demander de ne pas faire une action. Exemples célèbres : *Aza manahy* (Ne vous inquiétez pas), *Aza matahotra* (N'ayez pas peur), *Aza omena tsiny* (Ne m'en veuillez point).",
        },
        {
          type: 'concept',
          termMg: 'Tsy misy',
          phonetic: 'tsi mi-si',
          meaningFr: "Il n'y en a pas / Il n'y a rien / C'est épuisé",
          explanation:
            "Négation d'existence indispensable dans les échanges au marché et dans la conversation quotidienne.",
        },
        {
          type: 'concept',
          termMg: 'Tsy maninona',
          phonetic: 'tsi ma-ni-nou-na',
          meaningFr: 'Ce n’est rien / Pas de problème / Ne vous en faites pas',
          explanation:
            "Expression de réassurance absolue et d'apaisement lorsque quelqu'un s'excuse auprès de vous.",
        },
        {
          type: 'example',
          textMg:
            'Azafady tompoko fa tsy afaka mandeha aho anio satria misy raharaha.',
          textFr:
            'Excusez-moi humblement mais je ne peux pas venir aujourd’hui car j’ai une obligation.',
        },
        {
          type: 'example',
          textMg: 'Aza manahy tompoko, tsy maninona mihitsy izany.',
          textFr:
            'Ne vous inquiétez pas Monsieur/Madame, cela ne fait absolument rien / aucun problème.',
        },
        {
          type: 'didYouKnow',
          textFr:
            "Pour refuser une invitation sans froisser son hôte, le Malgache commence toujours par remercier chaleureusement avant d'énoncer son empêchement : « Misaotra indrindra tompoko, saingy... » (Merci infiniment, seulement...). C'est ce qu'on appelle l'art de « mandà am-pahendrena » (refuser avec sagesse).",
          textMg:
            "Mba tsy handratrana ny fon'ny mpiara-belona, ny fandavana dia ialohavan'ny fisaorana sy fialan-tsiny hatrany : « Misaotra tompoko, saingy misy antony tsy azo ialana... ». Izany no fahalalam-pomba malagasy.",
        },
        {
          type: 'quiz',
          question:
            'Quel mot utilise-t-on pour nier une action ou un fait (« ne... pas ») en malgache ?',
          questionMg:
            "Inona no teny fampiasa amin'ny fandavana tsotra ny matoanteny hoe « ne... pas » ?",
          choices: ['Tsy', 'Eny', 'Aza', 'Ary'],
          correctIndex: 0,
          explanation:
            '« Tsy » est la particule de négation universelle qui précède le verbe (ex: *Tsy fantatro* = Je ne sais pas).',
        },
        {
          type: 'quiz',
          question:
            'Quel mot utilise-t-on pour formuler un impératif négatif bienveillant (« Ne vous inquiétez pas ! ») ?',
          questionMg:
            "Inona no teny fandrarana am-pitiavana ampiasaina amin'ny hoe « Aza manahy ! » ?",
          choices: ['Aza', 'Tsy', 'Aiza', 'Inona'],
          correctIndex: 0,
          explanation:
            "« Aza » s'emploie avec un verbe pour exprimer une défense ou un conseil prévenant : *Aza manahy* = Ne vous inquiétez pas.",
        },
        {
          type: 'quiz',
          question:
            'Que répondez-vous avec douceur à quelqu’un qui s’excuse en disant « Azafady » ?',
          questionMg:
            'Inona no teny fiteny enti-mampitony olona miala tsiny hoe « Azafady » ?',
          choices: [
            'Tsy maninona tompoko (Ce n’est rien / Pas de souci)',
            'Tsy te hahita anao intsony aho',
            'Mialà eto',
            'Mandoava vola',
          ],
          correctIndex: 0,
          explanation:
            "« Tsy maninona tompoko » apaise instantanément l'interlocuteur en lui assurant qu'il n'y a aucun tort.",
        },
        {
          type: 'quiz',
          question:
            "Comment dit-on « Il n'y en a pas » au marché lorsqu'un article est épuisé ?",
          questionMg:
            "Ahoana no filazana hoe « Il n'y en a pas / C'est épuisé » eny an-tsena ?",
          choices: [
            'Tsy misy',
            'Misy be dia be',
            'Tonga soa',
            'Mazotoa homana',
          ],
          correctIndex: 0,
          explanation:
            "« Tsy misy » (littéralement « il n'existe pas ») indique la rupture de stock ou l'absence d'un bien.",
        },
        {
          type: 'quiz',
          question:
            'Comment refuse-t-on poliment une proposition dans la pure étiquette malgache ?',
          questionMg:
            'Ahoana no fomba fahalalam-pomba fandavana fanasana mba tsy hanimba fihavanana ?',
          choices: [
            "En remerciant chaleureusement d'abord, puis en formulant son empêchement avec modestie",
            'En criant un grand « NON » sec et catégorique',
            'En tournant le dos sans répondre',
            'En se fâchant immédiatement',
          ],
          correctIndex: 0,
          explanation:
            "L'étiquette du Fihavanana enseigne de valoriser l'attention de l'invitant par la gratitude avant d'excuser humblement son absence.",
        },
      ],
    },
  ],
};
