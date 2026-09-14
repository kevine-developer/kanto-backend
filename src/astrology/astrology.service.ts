import { Injectable } from '@nestjs/common';

export interface LocalizedText {
  mg: string;
  fr: string;
}

export interface DailyAstrologyPrediction {
  date: string;
  signId: string;
  signName: string;
  westernZodiac: string;
  element: 'afo' | 'tany' | 'rivotra' | 'rano';
  elementLabel: LocalizedText;
  cardinalZoro: LocalizedText;
  summary: LocalizedText;
  love: LocalizedText; // Fitiavana & Fihavanana
  work: LocalizedText; // Asa & Fivelomana
  energy: LocalizedText; // Hery & Aina
  advice: LocalizedText; // Torohevitry ny andro
  luckyColor: LocalizedText;
  luckyNumber: number;
  compatibleSign: {
    id: string;
    name: string;
    westernZodiac: string;
  };
}

interface SignDefinition {
  id: string;
  name: string;
  westernZodiac: string;
  element: 'afo' | 'tany' | 'rivotra' | 'rano';
  elementMg: string;
  elementFr: string;
  cardinalMg: string;
  cardinalFr: string;
  baseCompatible: string;
}

const SIGNS_DEFINITIONS: SignDefinition[] = [
  {
    id: 'alahamady',
    name: 'Alahamady',
    westernZodiac: 'Bélier',
    element: 'afo',
    elementMg: 'Afo (Feu)',
    elementFr: 'Feu',
    cardinalMg: 'Zoro Alahamady (Avaratra-Atsinanana)',
    cardinalFr: 'Nord-Est (Coin sacré)',
    baseCompatible: 'alakaosy',
  },
  {
    id: 'adaoro',
    name: 'Adaoro',
    westernZodiac: 'Taureau',
    element: 'tany',
    elementMg: 'Tany (Terre)',
    elementFr: 'Terre',
    cardinalMg: 'Atsinanana (Est)',
    cardinalFr: 'Est',
    baseCompatible: 'adijady',
  },
  {
    id: 'adizaoza',
    name: 'Adizaoza',
    westernZodiac: 'Gémeaux',
    element: 'rivotra',
    elementMg: 'Rivotra (Air)',
    elementFr: 'Air',
    cardinalMg: 'Atsinanana-Atsimo-Atsinanana',
    cardinalFr: 'Est-Sud-Est',
    baseCompatible: 'adalo',
  },
  {
    id: 'asorotany',
    name: 'Asorotany',
    westernZodiac: 'Cancer',
    element: 'rano',
    elementMg: 'Rano (Eau)',
    elementFr: 'Eau',
    cardinalMg: 'Zoro Asorotany (Atsimo-Atsinanana)',
    cardinalFr: 'Sud-Est',
    baseCompatible: 'alakarabo',
  },
  {
    id: 'alahasaty',
    name: 'Alahasaty',
    westernZodiac: 'Lion',
    element: 'afo',
    elementMg: 'Afo (Feu)',
    elementFr: 'Feu',
    cardinalMg: 'Atsimo (Sud)',
    cardinalFr: 'Sud',
    baseCompatible: 'alahamady',
  },
  {
    id: 'asombola',
    name: 'Asombola',
    westernZodiac: 'Vierge',
    element: 'tany',
    elementMg: 'Tany (Terre)',
    elementFr: 'Terre',
    cardinalMg: 'Atsimo-Andrefana',
    cardinalFr: 'Sud-Ouest',
    baseCompatible: 'adaoro',
  },
  {
    id: 'adimizana',
    name: 'Adimizana',
    westernZodiac: 'Balance',
    element: 'rivotra',
    elementMg: 'Rivotra (Air)',
    elementFr: 'Air',
    cardinalMg: 'Andrefana-Atsimo-Andrefana',
    cardinalFr: 'Ouest-Sud-Ouest',
    baseCompatible: 'adizaoza',
  },
  {
    id: 'alakarabo',
    name: 'Alakarabo',
    westernZodiac: 'Scorpion',
    element: 'rano',
    elementMg: 'Rano (Eau)',
    elementFr: 'Eau',
    cardinalMg: 'Andrefana (Ouest)',
    cardinalFr: 'Ouest',
    baseCompatible: 'alohotsy',
  },
  {
    id: 'alakaosy',
    name: 'Alakaosy',
    westernZodiac: 'Sagittaire',
    element: 'afo',
    elementMg: 'Afo (Feu)',
    elementFr: 'Feu',
    cardinalMg: 'Andrefana-Avaratra-Andrefana',
    cardinalFr: 'Ouest-Nord-Ouest',
    baseCompatible: 'alahasaty',
  },
  {
    id: 'adijady',
    name: 'Adijady',
    westernZodiac: 'Capricorne',
    element: 'tany',
    elementMg: 'Tany (Terre)',
    elementFr: 'Terre',
    cardinalMg: 'Zoro Adijady (Avaratra-Andrefana)',
    cardinalFr: 'Nord-Ouest',
    baseCompatible: 'asombola',
  },
  {
    id: 'adalo',
    name: 'Adalo',
    westernZodiac: 'Verseau',
    element: 'rivotra',
    elementMg: 'Rivotra (Air)',
    elementFr: 'Air',
    cardinalMg: 'Avaratra (Nord)',
    cardinalFr: 'Nord',
    baseCompatible: 'adimizana',
  },
  {
    id: 'alohotsy',
    name: 'Alohotsy',
    westernZodiac: 'Poissons',
    element: 'rano',
    elementMg: 'Rano (Eau)',
    elementFr: 'Eau',
    cardinalMg: 'Avaratra-Avaratra-Atsinanana',
    cardinalFr: 'Nord-Nord-Est',
    baseCompatible: 'asorotany',
  },
];

// Bibliothèque riche de prédictions par élément et humeur astrale
const LOVE_PREDICTIONS: Record<string, LocalizedText[]> = {
  afo: [
    {
      mg: "Mitondra hafanam-po lehibe ny androany. Misy fifanakalozana mivantana sy marina hanamafy ny fifamatoran'ny fo.",
      fr: "Votre enthousiasme naturel illumine vos échanges. Une franchise bienveillante renforce vos liens d'affection.",
    },
    {
      mg: "Aoka hazava ny teny ; ny fahitsiana am-panajana no manadio ny ahiahy rehetra eo amin'ny fifandraisana.",
      fr: "Privilégiez la clarté et l'écoute sincère ; votre magnétisme dissipe tout malentendu relationnel.",
    },
    {
      mg: "Fotoana tsara hanehoana fankasitrahana amin'ny olon-tiana sy ny havana akaiky. Ny fihavanana no harena.",
      fr: "Une journée propice pour témoigner votre tendresse et célébrer l'harmonie avec vos proches.",
    },
  ],
  tany: [
    {
      mg: "Milamina sy mahatoky ny tontolon'ny fo. Ny fihetsika kely mivaingana no tena manome toky sy fiadanana.",
      fr: 'Stabilité et douceur dominent votre vie affective. Les gestes simples et concrets apportent une grande sérénité.',
    },
    {
      mg: "Ny faharetana sy ny fihavanana madio no fototra iorenan'ny fitiavana maharitra ho an'ny anio.",
      fr: 'La fidélité et la complicité partagée créent un cocon réconfortant autour de vous.',
    },
    {
      mg: 'Tandremo ny fifaharohana ; ankafizo amim-pifaliana ny fotoana iarahana tsy misy fanahiana.',
      fr: 'Laissez place à la spontanéité ; savourez la présence de ceux que vous aimez sans retenue.',
    },
  ],
  rivotra: [
    {
      mg: 'Mavitrika ny fifampiresahana. Misy resaka mahafinaritra mamelona hevi-baovao sy mampifandray fo.',
      fr: 'Communication fluide et complicité intellectuelle. Un dialogue inspirant ouvre de jolies perspectives de cœur.',
    },
    {
      mg: "Misokatra ho an'ny olom-baovao na fihavanana nohavaozina ny andro. Miparitaka ny hatsaram-panahinao.",
      fr: "Votre légèreté d'esprit charme et rassemble. Excellente période pour renouer des contacts précieux.",
    },
    {
      mg: "Mihainoa alohan'ny hamaliana ; ny teny malefaka no maharesy ny fo sarotiny indrindra.",
      fr: 'Écoutez les silences avec sensibilité ; la douceur de vos paroles apaise les esprits hésitants.',
    },
  ],
  rano: [
    {
      mg: "Lalina ny fihetseham-po. Mahatsapa mialoha ny hevitry ny manodidina ianao, ampiasao amin'ny fampiononana.",
      fr: "Votre intuition est particulièrement vive. Vous comprenez d'instinct les besoins émotionnels de vos proches.",
    },
    {
      mg: "Ny fitoniana anaty no herinao lehibe. Avelao handeha ny alahelo taloha, hisokatra ny varavaran'ny fifaliana.",
      fr: 'La paix intérieure est votre plus bel atout. Laissez le passé derrière vous pour accueillir le renouveau.',
    },
    {
      mg: 'Fifamatorana marina sy fiaraha-miory no mampatanjaka ny tokantrano sy ny finamanana anio.',
      fr: 'Un moment de tendresse sincère consolide vos attaches familiales et sentimentales.',
    },
  ],
};

const WORK_PREDICTIONS: Record<string, LocalizedText[]> = {
  afo: [
    {
      mg: 'Tetikasa vaovao no mety handray vahana. Sahia mandray andraikitra am-pahendrena, hisy vokatra tsara.',
      fr: "L'audace constructive paie aujourd'hui. Vos initiatives professionnelles rencontrent un écho très positif.",
    },
    {
      mg: "Mifantoha amin'ny tanjona lehibe ; aza laniana amin'ny disadisa madinika ny herin'ny sainao.",
      fr: "Gardez le cap sur l'essentiel ; votre efficacité décuple lorsque vous canalisez votre énergie avec méthode.",
    },
  ],
  tany: [
    {
      mg: 'Asa mitohy sy mirindra. Izay nisasarana omaly no manomboka mamokatra sy mampitombo ny tahiry.',
      fr: 'Journée propice à la consolidation et aux résultats concrets. Vos efforts méticuleux portent leurs fruits.',
    },
    {
      mg: "Fahaiza-mandamina sy fahitsiana amin'ny fifampiraharahana no antoky ny fahombiazana anio.",
      fr: "Rigueur et pragmatisme : les négociations et la gestion financière se déroulent sous d'excellents auspices.",
    },
  ],
  rivotra: [
    {
      mg: "Mipoitra ny vahaolana vaovao tsy nampoizina. Mahita lalan-kely amin'ny olana saro-bahana ny sainao.",
      fr: 'Créativité et souplesse mentale au zénith. Vous trouvez des solutions inédites à des défis complexes.',
    },
    {
      mg: 'Fiara-miasa sy fifampizarana traikefa no hahazoana tombony haingana. Ny hevitry ny maro no manan-kaja.',
      fr: "Le travail d'équipe et le partage d'idées maximisent votre impact. Sachez fédérer vos collaborateurs.",
    },
  ],
  rano: [
    {
      mg: "Tsy maika fa matotra. Ny fahitana lalina sy ny fahitsian'ny fanapahan-kevitra no miaro amin'ny fandrika.",
      fr: 'Fiez-vous à votre discernement naturel. Votre perspicacité vous évite des choix précipités.',
    },
    {
      mg: 'Zavakanto, famoronana na fanampiana ny hafa no sehatra tena hahavokatra be ho anao anio.',
      fr: 'Les projets artistiques, humains ou nécessitant de la patience sont particulièrement favorisés.',
    },
  ],
};

const ENERGY_PREDICTIONS: Record<string, LocalizedText[]> = {
  afo: [
    {
      mg: 'Herin-tsaina miredareda sy tanjaka ara-batana. Manokàna fotoana hisotroana rano sy hialana sasatra kely.',
      fr: 'Belle vitalité et dynamisme entraînant. Pensez à bien vous hydrater pour maintenir votre équilibre.',
    },
  ],
  tany: [
    {
      mg: "Fahatanjahana marin-toerana. Ny fifandraisana amin'ny natiora na ny fitsangantsanganana no mamelombelona.",
      fr: 'Force tranquille et bonne endurance. Une marche en plein air régénère profondément votre esprit.',
    },
  ],
  rivotra: [
    {
      mg: 'Saina mavitrika sy mailaka. Aoka hazava ny tontolo iainana mba tsy hahatonga havizanana ara-tsaina.',
      fr: 'Esprit alerte et curieux. Accordez-vous de courtes pauses de déconnexion pour préserver votre calme.',
    },
  ],
  rano: [
    {
      mg: 'Ilaina ny torimaso tsara sy ny toerana milamina. Ny rano sy ny mozika malefaka no manome hery vaovao.',
      fr: 'Besoin de quiétude et de ressourcement. Un rythme apaisé vous procure une formidable lucidité.',
    },
  ],
};

const ADVICE_PREDICTIONS: LocalizedText[] = [
  {
    mg: 'Izay mahay mandefitra no lava andro iainana ; aoka ny fahendrena no hitantana ny dianao.',
    fr: 'Celui qui cultive la patience construit un avenir solide ; laissez la sérénité guider vos pas.',
  },
  {
    mg: "Ny fihavanana toy ny katsaka, sady mamelona no manafana. Arovy ny firindran'ny manodidina.",
    fr: "La fraternité et la bienveillance sont le plus doux des refuges. Chérissez l'harmonie avec chacun.",
  },
  {
    mg: 'Izay mitandrina ny teny nomena no mahazo fitokisana marina. Aoka ho vato fehizoro ny fahamarinanao.',
    fr: "La parole tenue est un rempart inébranlable. Faites de l'intégrité votre boussole quotidienne.",
  },
  {
    mg: 'Aza matahotra ny lalana vaovao raha madio ny fikasana ; ny kintana no manazava ny manana fo madio.',
    fr: "Avancez avec confiance si votre intention est pure ; l'univers éclaire ceux qui cheminent avec le cœur.",
  },
  {
    mg: 'Ny hazo tokana tsy mba ala ; ny fiaraha-mientana no mahatonga ny ezaka ho lehibe sy maharitra.',
    fr: 'Un arbre seul ne fait pas la forêt : le soutien mutuel multiplie la portée de chaque accomplissement.',
  },
];

const COLORS_POOL: LocalizedText[] = [
  { mg: 'Maitso tanimbary (Vert olive)', fr: 'Vert olive Tanimbary' },
  { mg: 'Volamena malefaka (Or doux)', fr: 'Or chaleureux' },
  { mg: 'Manga madio (Bleu azur)', fr: 'Bleu azur limpide' },
  { mg: 'Fotsy mangatsakatsaka (Blanc perlé)', fr: 'Blanc pur' },
  { mg: 'Mena biriky (Ocre rouge)', fr: 'Terre d’ocre' },
  { mg: 'Mavo masoandro (Jaune solaire)', fr: 'Jaune solaire' },
];

@Injectable()
export class AstrologyService {
  /**
   * Récupère la prédiction quotidienne pour un signe donné ou pour tous les signes
   */
  getDaily(
    signId?: string,
    dateStr?: string,
  ): DailyAstrologyPrediction | DailyAstrologyPrediction[] {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    if (signId) {
      const normalizedSign = signId.toLowerCase().trim();
      const signDef =
        SIGNS_DEFINITIONS.find((s) => s.id === normalizedSign) ||
        SIGNS_DEFINITIONS[0];
      return this.buildPredictionForSign(signDef, targetDate);
    }

    return SIGNS_DEFINITIONS.map((signDef) =>
      this.buildPredictionForSign(signDef, targetDate),
    );
  }

  private buildPredictionForSign(
    sign: SignDefinition,
    dateStr: string,
  ): DailyAstrologyPrediction {
    // Calcul d'un hash déterministe par date + signe
    const seed = `${dateStr}-${sign.id}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const lovePool = LOVE_PREDICTIONS[sign.element] || LOVE_PREDICTIONS.afo;
    const workPool = WORK_PREDICTIONS[sign.element] || WORK_PREDICTIONS.afo;
    const energyPool =
      ENERGY_PREDICTIONS[sign.element] || ENERGY_PREDICTIONS.afo;

    const love = lovePool[absHash % lovePool.length];
    const work = workPool[(absHash >> 2) % workPool.length];
    const energy = energyPool[(absHash >> 4) % energyPool.length];
    const advice =
      ADVICE_PREDICTIONS[(absHash >> 3) % ADVICE_PREDICTIONS.length];
    const luckyColor = COLORS_POOL[(absHash >> 5) % COLORS_POOL.length];
    const luckyNumber = (absHash % 9) + 1; // 1 à 9

    const compatibleSignDef =
      SIGNS_DEFINITIONS.find((s) => s.id === sign.baseCompatible) ||
      SIGNS_DEFINITIONS[0];

    return {
      date: dateStr,
      signId: sign.id,
      signName: sign.name,
      westernZodiac: sign.westernZodiac,
      element: sign.element,
      elementLabel: {
        mg: sign.elementMg,
        fr: sign.elementFr,
      },
      cardinalZoro: {
        mg: sign.cardinalMg,
        fr: sign.cardinalFr,
      },
      summary: {
        mg: `Vintana tsara ho an'ny ${sign.name} anio. Misy fahatsarana eo amin'ny fifandraisana sy ny asa.`,
        fr: `Journée harmonieuse pour ${sign.name} (${sign.westernZodiac}). Favorable aux projets et aux liens du cœur.`,
      },
      love,
      work,
      energy,
      advice,
      luckyColor,
      luckyNumber,
      compatibleSign: {
        id: compatibleSignDef.id,
        name: compatibleSignDef.name,
        westernZodiac: compatibleSignDef.westernZodiac,
      },
    };
  }
}
