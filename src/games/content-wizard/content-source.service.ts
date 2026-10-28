import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  ContentSourceType,
  GameQuestionFormat,
  SearchContentSourcesDto,
  GenerateSuggestionsDto,
  BatchGenerateSuggestionsDto,
  PublishUniversalQuestionDto,
} from './dto/content-wizard.dto.js';
import { DifficultyLevel, TrueFalseTheme } from '../../../generated/prisma/client.js';
import { normalizeRiddleText, stripMalagasyArticle } from '../riddle/riddle-validator.util.js';

export interface ContentSourceItem {
  id: string;
  sourceType: ContentSourceType;
  title: string;
  titleMg?: string;
  categoryName: string;
  summary: string;
  imageUrl?: string | null;
  period?: string | null;
  sourceRef?: string | null;
  metadata?: Record<string, any>;
}

export interface QuestionSuggestion {
  format: GameQuestionFormat;
  prompt: string;
  promptMg?: string;
  promptFr?: string;
  choices?: string[];
  answerIndex?: number;
  isTrue?: boolean;
  correctAnswer?: string;
  acceptedAnswers?: string[];
  clue?: string;
  explanation: string;
  explanationMg?: string;
  explanationTrueFr?: string;
  explanationTrueMg?: string;
  explanationFalseFr?: string;
  explanationFalseMg?: string;
  difficulty: DifficultyLevel;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  sourceReference?: string;
  historicalPeriod?: string;
  contentSourceType: ContentSourceType;
  contentSourceId: string;
}

@Injectable()
export class ContentSourceService {
  private readonly logger = new Logger(ContentSourceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recherche et liste les contenus Kanto disponibles pour créer des jeux
   */
  async searchSources(query: SearchContentSourcesDto): Promise<{
    items: ContentSourceItem[];
    total: number;
    types: { type: ContentSourceType; label: string; count: number }[];
  }> {
    const search = query.search?.trim().toLowerCase();
    const typeFilter = query.type;

    const results: ContentSourceItem[] = [];

    // 1. Présidents
    if (!typeFilter || typeFilter === ContentSourceType.PRESIDENT) {
      const presidents = await this.prisma.president.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { orderIndex: 'asc' },
        take: 30,
      });

      presidents.forEach((p) => {
        results.push({
          id: p.id,
          sourceType: ContentSourceType.PRESIDENT,
          title: p.name,
          titleMg: p.titleMg,
          categoryName: 'Personnalités & Dirigeants',
          summary: `${p.republic} (${p.period}). ${p.bioFr.slice(0, 160)}...`,
          imageUrl: p.imageUrl,
          period: p.period,
          sourceRef: `Archives Nationales de Madagascar / Présidence`,
          metadata: {
            republic: p.republic,
            achievements: p.achievementsFr,
            quote: p.quoteFr,
          },
        });
      });
    }

    // 2. Billets de banque
    if (!typeFilter || typeFilter === ContentSourceType.BANKNOTE) {
      const banknotes = await this.prisma.banknote.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { titleFr: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { orderIndex: 'asc' },
        take: 30,
      });

      banknotes.forEach((b) => {
        results.push({
          id: b.id,
          sourceType: ContentSourceType.BANKNOTE,
          title: `${b.valueAriary.toLocaleString()} Ariary — ${b.titleFr}`,
          titleMg: `${b.valueAriary.toLocaleString()} Ariary — ${b.titleMg}`,
          categoryName: 'Monnaie & Billets malgaches',
          summary: `Série ${b.series} (${b.period}). Recto: ${b.obverseDescriptionFr?.slice(0, 80) || ''}. Verso: ${b.reverseDescriptionFr?.slice(0, 80) || ''}`,
          imageUrl: b.imageUrl,
          period: b.period,
          sourceRef: 'Banque Centrale de Madagascar (BFM)',
          metadata: {
            valueAriary: b.valueAriary,
            valueFmg: b.valueFmg,
            series: b.series,
            symbolism: b.symbolismFr,
            imageUrlVerso: b.imageUrlVerso,
          },
        });
      });
    }

    // 3. Provinces & Blasons
    if (!typeFilter || typeFilter === ContentSourceType.PROVINCE) {
      const provinces = await this.prisma.provinceBlason.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { province: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { orderIndex: 'asc' },
      });

      provinces.forEach((pv) => {
        results.push({
          id: pv.id,
          sourceType: ContentSourceType.PROVINCE,
          title: `Province de ${pv.province}`,
          titleMg: `Faritany ${pv.province}`,
          categoryName: 'Géographie & Blasons',
          summary: `Chef-lieu: ${pv.chefLieu}. ${pv.descriptionFr.slice(0, 150)}...`,
          imageUrl: pv.imageUrl,
          sourceRef: 'Histoire territoriale de Madagascar',
          metadata: {
            chefLieu: pv.chefLieu,
            province: pv.province,
            keyFacts: pv.keyFactsFr,
          },
        });
      });
    }

    // 4. Emblèmes naturels
    if (!typeFilter || typeFilter === ContentSourceType.NATURE_EMBLEM) {
      const emblems = await this.prisma.natureEmblem.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { nameFr: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { orderIndex: 'asc' },
        take: 30,
      });

      emblems.forEach((e) => {
        results.push({
          id: e.id,
          sourceType: ContentSourceType.NATURE_EMBLEM,
          title: `${e.nameFr} (${e.nameMg})`,
          titleMg: e.nameMg,
          categoryName: 'Symboles de la Nature & Faune/Flore',
          summary: `${e.scientificName} [${e.type}]. Rôle: ${e.culturalRoleFr.slice(0, 140)}...`,
          imageUrl: e.imageUrl,
          sourceRef: 'Biodiversité et Traditions de Madagascar',
          metadata: {
            scientificName: e.scientificName,
            proverb: e.proverbMg,
            type: e.type,
          },
        });
      });
    }

    // 5. Dates Historiques
    if (!typeFilter || typeFilter === ContentSourceType.HISTORY_DATE) {
      const dates = await this.prisma.historyDate.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { titleFr: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { orderIndex: 'asc' },
        take: 30,
      });

      dates.forEach((d) => {
        results.push({
          id: d.id,
          sourceType: ContentSourceType.HISTORY_DATE,
          title: `${d.exactDate || d.year} — ${d.titleFr}`,
          titleMg: `${d.exactDate || d.year} — ${d.titleMg}`,
          categoryName: 'Histoire de Madagascar',
          summary: `Ère: ${d.era}. ${d.summaryFr.slice(0, 150)}... Impact: ${d.impactFr.slice(0, 100)}`,
          imageUrl: d.imageUrl,
          period: d.year,
          sourceRef: 'Repères historiques nationaux',
          metadata: {
            year: d.year,
            era: d.era,
          },
        });
      });
    }

    // 6. Ohabolana (Proverbes)
    if (!typeFilter || typeFilter === ContentSourceType.MALAGASY_ITEM) {
      const items = await this.prisma.malagasyItem.findMany({
        where: {
          status: 'PUBLISHED',
          ...(search ? { malagasy: { contains: search, mode: 'insensitive' } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      items.forEach((m) => {
        results.push({
          id: m.id,
          sourceType: ContentSourceType.MALAGASY_ITEM,
          title: m.malagasy,
          titleMg: m.malagasy,
          categoryName: 'Ohabolana & Fomba Fiteny',
          summary: `Traduction: « ${m.french} ». Sens: ${m.meaning.slice(0, 120)}...`,
          sourceRef: m.origins?.[0] || 'Tradition orale malgache',
          metadata: {
            category: m.category,
            meaning: m.meaning,
          },
        });
      });
    }

    // Statistiques par type
    const types = [
      { type: ContentSourceType.PRESIDENT, label: 'Présidents & Dirigeants', count: results.filter(r => r.sourceType === ContentSourceType.PRESIDENT).length },
      { type: ContentSourceType.BANKNOTE, label: 'Billets & Monnaies', count: results.filter(r => r.sourceType === ContentSourceType.BANKNOTE).length },
      { type: ContentSourceType.PROVINCE, label: 'Provinces & Blasons', count: results.filter(r => r.sourceType === ContentSourceType.PROVINCE).length },
      { type: ContentSourceType.NATURE_EMBLEM, label: 'Faune, Flore & Emblèmes', count: results.filter(r => r.sourceType === ContentSourceType.NATURE_EMBLEM).length },
      { type: ContentSourceType.HISTORY_DATE, label: 'Repères Historiques', count: results.filter(r => r.sourceType === ContentSourceType.HISTORY_DATE).length },
      { type: ContentSourceType.MALAGASY_ITEM, label: 'Ohabolana & Proverbes', count: results.filter(r => r.sourceType === ContentSourceType.MALAGASY_ITEM).length },
    ];

    return {
      items: results.slice(0, query.limit || 50),
      total: results.length,
      types,
    };
  }

  /**
   * Génère des suggestions de questions calibrées et rigoureuses à partir d'un contenu réel
   */
  async generateSuggestions(dto: GenerateSuggestionsDto): Promise<QuestionSuggestion[]> {
    const { sourceType, sourceId, format, difficulty = DifficultyLevel.EASY } = dto;

    if (!sourceId) {
      throw new BadRequestException("L'identifiant du contenu source (sourceId) est requis pour générer des suggestions");
    }

    switch (sourceType) {
      case ContentSourceType.PRESIDENT:
        return this.suggestForPresident(sourceId, format, difficulty);
      case ContentSourceType.BANKNOTE:
        return this.suggestForBanknote(sourceId, format, difficulty);
      case ContentSourceType.PROVINCE:
        return this.suggestForProvince(sourceId, format, difficulty);
      case ContentSourceType.NATURE_EMBLEM:
        return this.suggestForNatureEmblem(sourceId, format, difficulty);
      case ContentSourceType.HISTORY_DATE:
        return this.suggestForHistoryDate(sourceId, format, difficulty);
      case ContentSourceType.MALAGASY_ITEM:
        return this.suggestForMalagasyItem(sourceId, format, difficulty);
      default:
        throw new BadRequestException(`Type de source non pris en charge: ${sourceType}`);
    }
  }

  /**
   * Suggestions basées sur un Président de Madagascar
   */
  private async suggestForPresident(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const p = await this.prisma.president.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Président introuvable: ${id}`);

    // Récupérer 3 autres présidents pour distracteurs
    const others = await this.prisma.president.findMany({
      where: { id: { not: p.id }, status: 'PUBLISHED' },
      take: 6,
    });
    const distNames = others.map((o) => o.name).slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      // Question sur la République ou mandat
      const choices = [p.name, ...distNames].sort(() => 0.5 - Math.random());
      const answerIndex = choices.indexOf(p.name);

      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `Quel dirigeant a exercé la présidence de Madagascar durant la période (${p.period}) sous la ${p.republic} ?`,
        promptMg: `Iza no filoham-pirenena nitantana an'i Madagasikara tamin'ny vanim-potoana (${p.period}) teo ambany fitondran'ny ${p.republicMg || p.republic} ?`,
        choices,
        answerIndex,
        explanation: `${p.name} a dirigé Madagascar durant la ${p.republic} (${p.period}). ${p.bioFr.slice(0, 200)}`,
        explanationMg: `${p.name} no nitondra ny tany sy ny firenena nandritra ny ${p.republicMg || p.republic} (${p.period}).`,
        difficulty,
        category: 'histoire_royaumes',
        imageUrl: p.imageUrl || undefined,
        imageAlt: `Portrait d'archive de ${p.name}`,
        sourceReference: `Histoire politique de Madagascar — Présidence de la République`,
        historicalPeriod: p.period,
        contentSourceType: ContentSourceType.PRESIDENT,
        contentSourceId: p.id,
      });

      if (p.quoteFr) {
        const quoteChoices = [p.name, ...distNames].sort(() => 0.5 - Math.random());
        suggestions.push({
          format: GameQuestionFormat.SINGLE_CHOICE,
          prompt: `À quelle personnalité historique attribue-t-on la célèbre parole : « ${p.quoteFr} » ?`,
          promptMg: `Iza amin'ireto olo-malaza ireto no nanao ilay teny manan-tantara hoe : « ${p.quoteMg || p.quoteFr} » ?`,
          choices: quoteChoices,
          answerIndex: quoteChoices.indexOf(p.name),
          explanation: `Cette citation historique est attribuée à ${p.name} dans le cadre de son action républicaine.`,
          difficulty: DifficultyLevel.MEDIUM,
          category: 'histoire_royaumes',
          sourceReference: `Discours et archives historiques de ${p.name}`,
          historicalPeriod: p.period,
          contentSourceType: ContentSourceType.PRESIDENT,
          contentSourceId: p.id,
        });
      }
    } else if (format === GameQuestionFormat.TRUE_FALSE) {
      suggestions.push({
        format: GameQuestionFormat.TRUE_FALSE,
        prompt: `L'homme d'État ${p.name} a présidé Madagascar durant la ${p.republic} (${p.period}).`,
        promptMg: `Ny filoha ${p.name} no nitondra an'i Madagasikara nandritra ny ${p.republicMg || p.republic} (${p.period}).`,
        isTrue: true,
        explanation: `Vrai. ${p.name} a été chef de l'État malgache durant la ${p.republic} (${p.period}).`,
        explanationTrueFr: `Exact. ${p.name} a présidé le pays durant cette période (${p.period}).`,
        explanationFalseFr: `Cette affirmation est pourtant exacte : ${p.name} a bel et bien exercé durant la ${p.republic}.`,
        difficulty,
        category: 'histoire_royaumes',
        sourceReference: `Archives officielles de la République de Madagascar`,
        historicalPeriod: p.period,
        contentSourceType: ContentSourceType.PRESIDENT,
        contentSourceId: p.id,
      });
    } else if (format === GameQuestionFormat.IMAGE_IDENTIFICATION) {
      const choices = [p.name, ...distNames].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.IMAGE_IDENTIFICATION,
        prompt: `Identifiez le président de Madagascar représenté sur cette photographie d'archive historique.`,
        promptMg: `Fantaro ilay filohan'i Madagasikara hita eo amin'ity sary tahiry ara-tantara ity.`,
        choices,
        answerIndex: choices.indexOf(p.name),
        explanation: `Il s'agit de ${p.name}, président sous la ${p.republic} (${p.period}).`,
        difficulty,
        category: 'histoire_royaumes',
        imageUrl: p.imageUrl || undefined,
        imageAlt: `Portrait d'archive d'un chef d'État malgache`,
        sourceReference: `Fonds photographique national d'archives`,
        historicalPeriod: p.period,
        contentSourceType: ContentSourceType.PRESIDENT,
        contentSourceId: p.id,
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur un Billet de banque malgache
   */
  private async suggestForBanknote(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const b = await this.prisma.banknote.findUnique({ where: { id } });
    if (!b) throw new NotFoundException(`Billet introuvable: ${id}`);

    const otherBanknotes = await this.prisma.banknote.findMany({
      where: { id: { not: b.id }, status: 'PUBLISHED' },
      take: 6,
    });
    const distValues = otherBanknotes.map((ob) => `${ob.valueAriary.toLocaleString()} Ariary`).slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      // Question sur la conversion Ariary / FMG
      const correctFmg = `${b.valueFmg.toLocaleString()} FMG`;
      const choicesFmg = [
        correctFmg,
        `${(b.valueAriary * 10).toLocaleString()} FMG`,
        `${(b.valueAriary * 2).toLocaleString()} FMG`,
        `${(b.valueAriary * 3).toLocaleString()} FMG`,
      ].sort(() => 0.5 - Math.random());

      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `À quelle valeur en Francs Malagasy (FMG) équivaut le billet de ${b.valueAriary.toLocaleString()} Ariary (1 Ariary = 5 FMG) ?`,
        promptMg: `Ohatrinona ny sandam-bola amin'ny Franc Malagasy (FMG) mifanitsy amin'ny volavita ${b.valueAriary.toLocaleString()} Ariary ?`,
        choices: choicesFmg,
        answerIndex: choicesFmg.indexOf(correctFmg),
        explanation: `À Madagascar, 1 Ariary correspond à 5 Francs Malagasy (FMG). Ainsi, ${b.valueAriary.toLocaleString()} Ariary équivaut exactement à ${b.valueFmg.toLocaleString()} FMG.`,
        difficulty: DifficultyLevel.EASY,
        category: 'citoyennete_fihavanana',
        sourceReference: 'Banque Centrale de Madagascar — Système Monétaire National',
        contentSourceType: ContentSourceType.BANKNOTE,
        contentSourceId: b.id,
      });

      // Question sur le symbolisme culturel ou motif
      if (b.symbolismFr) {
        suggestions.push({
          format: GameQuestionFormat.SINGLE_CHOICE,
          prompt: `Quelle thématique patrimoniale majeure met en valeur le billet de ${b.valueAriary.toLocaleString()} Ariary (${b.seriesLabelFr}) ?`,
          promptMg: `Inona no lohahevitra lehibe misongadina ao amin'ny volavita ${b.valueAriary.toLocaleString()} Ariary ?`,
          choices: [
            b.titleFr,
            'Les transports ferroviaires du XXe siècle',
            'Les instruments traditionnels du Sud',
            'La culture du café et des épices orientales',
          ].sort(() => 0.5 - Math.random()),
          answerIndex: 0,
          explanation: `Le billet de ${b.valueAriary.toLocaleString()} Ariary met à l'honneur : « ${b.titleFr} ». ${b.symbolismFr}`,
          difficulty,
          category: 'arts_musique_saveurs',
          sourceReference: 'Banque Centrale de Madagascar — Séries de billets',
          contentSourceType: ContentSourceType.BANKNOTE,
          contentSourceId: b.id,
        });
      }
    } else if (format === GameQuestionFormat.TRUE_FALSE) {
      suggestions.push({
        format: GameQuestionFormat.TRUE_FALSE,
        prompt: `Le billet de ${b.valueAriary.toLocaleString()} Ariary émis par la Banque Centrale de Madagascar équivaut exactement à ${b.valueFmg.toLocaleString()} Francs Malagasy (FMG).`,
        promptMg: `Ny volavita ${b.valueAriary.toLocaleString()} Ariary navoakan'ny Banky Foiben'i Madagasikara dia mitovy amin'ny ${b.valueFmg.toLocaleString()} FMG.`,
        isTrue: true,
        explanation: `Vrai. La parité historique est de 1 Ariary = 5 FMG, ce qui donne précisément ${(b.valueAriary * 5).toLocaleString()} FMG pour ${b.valueAriary.toLocaleString()} Ariary.`,
        difficulty: DifficultyLevel.EASY,
        category: 'citoyennete_fihavanana',
        sourceReference: 'Banque Centrale de Madagascar',
        contentSourceType: ContentSourceType.BANKNOTE,
        contentSourceId: b.id,
      });
    } else if (format === GameQuestionFormat.IMAGE_IDENTIFICATION) {
      const choices = [`${b.valueAriary.toLocaleString()} Ariary`, ...distValues].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.IMAGE_IDENTIFICATION,
        prompt: `Observez les motifs graphiques et le thème de ce billet de banque malgache : quelle est sa valeur faciale en Ariary ?`,
        promptMg: `Diniho tsara ny sary sy ny endrik'ity volavita malagasy ity : ohatrinona ny sandany amin'ny Ariary ?`,
        choices,
        answerIndex: choices.indexOf(`${b.valueAriary.toLocaleString()} Ariary`),
        explanation: `Ce billet représente « ${b.titleFr} » (${b.seriesLabelFr}) et correspond à une coupure de ${b.valueAriary.toLocaleString()} Ariary.`,
        imageUrl: b.imageUrlVerso || b.imageUrl || undefined,
        imageAlt: `Reproduction graphique d'un billet de banque de Madagascar`,
        difficulty,
        category: 'citoyennete_fihavanana',
        sourceReference: 'Banque Centrale de Madagascar',
        contentSourceType: ContentSourceType.BANKNOTE,
        contentSourceId: b.id,
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur une Province & Blason
   */
  private async suggestForProvince(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const pv = await this.prisma.provinceBlason.findUnique({ where: { id } });
    if (!pv) throw new NotFoundException(`Province introuvable: ${id}`);

    const otherProvinces = await this.prisma.provinceBlason.findMany({
      where: { id: { not: pv.id }, status: 'PUBLISHED' },
    });
    const distChefsLieux = otherProvinces.map((o) => o.chefLieu).slice(0, 3);
    const distProvinceNames = otherProvinces.map((o) => o.province).slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      const choices = [pv.chefLieu, ...distChefsLieux].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `Quel est le chef-lieu historique de la province de ${pv.province} ?`,
        promptMg: `Inona no renivohitra ara-tantaran'ny Faritany ${pv.province} ?`,
        choices,
        answerIndex: choices.indexOf(pv.chefLieu),
        explanation: `Le chef-lieu de la province de ${pv.province} est la ville de ${pv.chefLieu}. ${pv.descriptionFr.slice(0, 160)}`,
        explanationMg: `Ny renivohitry ny Faritanin'i ${pv.province} dia ny tanànan'i ${pv.chefLieu}.`,
        difficulty: DifficultyLevel.EASY,
        category: 'geographie_regions',
        sourceReference: 'Découpage territorial traditionnel de Madagascar',
        contentSourceType: ContentSourceType.PROVINCE,
        contentSourceId: pv.id,
      });
    } else if (format === GameQuestionFormat.IMAGE_IDENTIFICATION) {
      const choices = [pv.province, ...distProvinceNames].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.IMAGE_IDENTIFICATION,
        prompt: `À quelle province de Madagascar appartient ce blason historique et ses symboles territoriaux ?`,
        promptMg: `An'iza amin'ireto faritany ireto ity mari-piandrianana sy marika ara-tantara ity ?`,
        choices,
        answerIndex: choices.indexOf(pv.province),
        explanation: `Ce blason est celui de la province de ${pv.province} (chef-lieu : ${pv.chefLieu}). ${pv.descriptionFr.slice(0, 180)}`,
        imageUrl: pv.imageUrl || undefined,
        imageAlt: `Blason héraldique historique d'une province de Madagascar`,
        difficulty,
        category: 'symboles_identite',
        sourceReference: 'Héraldique et symboles des provinces malgaches',
        contentSourceType: ContentSourceType.PROVINCE,
        contentSourceId: pv.id,
      });
    } else if (format === GameQuestionFormat.TRUE_FALSE) {
      suggestions.push({
        format: GameQuestionFormat.TRUE_FALSE,
        prompt: `La ville de ${pv.chefLieu} est le chef-lieu traditionnel de la province de ${pv.province}.`,
        promptMg: `Ny tanànan'i ${pv.chefLieu} no renivohitry ny Faritany ${pv.province}.`,
        isTrue: true,
        explanation: `Vrai. ${pv.chefLieu} est effectivement le centre administratif historique de la province de ${pv.province}.`,
        difficulty: DifficultyLevel.EASY,
        category: 'geographie_regions',
        sourceReference: 'Géographie administrative de Madagascar',
        contentSourceType: ContentSourceType.PROVINCE,
        contentSourceId: pv.id,
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur un Emblème naturel (Faune / Flore)
   */
  private async suggestForNatureEmblem(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const e = await this.prisma.natureEmblem.findUnique({ where: { id } });
    if (!e) throw new NotFoundException(`Emblème naturel introuvable: ${id}`);

    const others = await this.prisma.natureEmblem.findMany({
      where: { id: { not: e.id }, status: 'PUBLISHED' },
      take: 6,
    });
    const distNames = others.map((o) => o.nameFr).slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      const choices = [e.scientificName, 'Adansonia digitata', 'Lemur variegatus', 'Vanilla planifolia'].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `Quel est le nom scientifique exact de l'espèce emblématique « ${e.nameFr} » (${e.nameMg}) ?`,
        promptMg: `Inona no anarana ara-tsiansa ofisialin'ny « ${e.nameMg} » (${e.nameFr}) ?`,
        choices,
        answerIndex: choices.indexOf(e.scientificName),
        explanation: `Le nom scientifique de ${e.nameFr} (${e.nameMg}) est ${e.scientificName}. ${e.descriptionFr.slice(0, 160)}`,
        difficulty: DifficultyLevel.MEDIUM,
        category: 'geographie_regions',
        sourceReference: 'Inventaire de la Biodiversité de Madagascar',
        contentSourceType: ContentSourceType.NATURE_EMBLEM,
        contentSourceId: e.id,
      });
    } else if (format === GameQuestionFormat.IMAGE_IDENTIFICATION) {
      const choices = [e.nameFr, ...distNames].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.IMAGE_IDENTIFICATION,
        prompt: `Reconnaissez-vous cette espèce emblématique de la faune et de la flore de Madagascar ?`,
        promptMg: `Fantatrao ve ity karazam-biby na zavamaniry mampiavaka an'i Madagasikara ity ?`,
        choices,
        answerIndex: choices.indexOf(e.nameFr),
        explanation: `Il s'agit de ${e.nameFr} (${e.nameMg} - ${e.scientificName}). ${e.culturalRoleFr.slice(0, 180)}`,
        imageUrl: e.imageUrl || undefined,
        imageAlt: `Photographie de ${e.nameFr} dans son milieu naturel`,
        difficulty,
        category: 'geographie_regions',
        sourceReference: 'Parcs Nationaux de Madagascar',
        contentSourceType: ContentSourceType.NATURE_EMBLEM,
        contentSourceId: e.id,
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur une Date Historique
   */
  private async suggestForHistoryDate(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const d = await this.prisma.historyDate.findUnique({ where: { id } });
    if (!d) throw new NotFoundException(`Date historique introuvable: ${id}`);

    const otherDates = await this.prisma.historyDate.findMany({
      where: { id: { not: d.id }, status: 'PUBLISHED' },
      take: 6,
    });
    const distYears = otherDates.map((o) => o.year).slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      const choices = [d.year, ...distYears].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `En quelle année s'est déroulé l'événement historique majeur suivant : « ${d.titleFr} » ?`,
        promptMg: `Tamin'ny taona firy no nisehoan'ity zava-dehibe teo amin'ny tantara ity : « ${d.titleMg} » ?`,
        choices,
        answerIndex: choices.indexOf(d.year),
        explanation: `${d.exactDate || d.year} marque « ${d.titleFr} ». ${d.summaryFr.slice(0, 180)}`,
        difficulty,
        category: 'histoire_royaumes',
        sourceReference: `Histoire Générale de Madagascar (${d.era})`,
        historicalPeriod: d.year,
        contentSourceType: ContentSourceType.HISTORY_DATE,
        contentSourceId: d.id,
      });
    } else if (format === GameQuestionFormat.TRUE_FALSE) {
      suggestions.push({
        format: GameQuestionFormat.TRUE_FALSE,
        prompt: `L'événement marquant « ${d.titleFr} » s'est produit en ${d.year} à Madagascar.`,
        promptMg: `Ny zava-nitranga ara-tantara « ${d.titleMg} » dia niseho tamin'ny taona ${d.year} teto Madagasikara.`,
        isTrue: true,
        explanation: `Vrai. C'est en ${d.exactDate || d.year} que s'est déroulé cet événement fondateur (${d.era}).`,
        difficulty: DifficultyLevel.EASY,
        category: 'histoire_royaumes',
        sourceReference: `Archives nationales d'histoire`,
        historicalPeriod: d.year,
        contentSourceType: ContentSourceType.HISTORY_DATE,
        contentSourceId: d.id,
      });
    }

    return suggestions;
  }

  /**
   * Suggestions basées sur un Ohabolana (Proverbe)
   */
  private async suggestForMalagasyItem(
    id: string,
    format: GameQuestionFormat,
    difficulty: DifficultyLevel,
  ): Promise<QuestionSuggestion[]> {
    const item = await this.prisma.malagasyItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Proverbe introuvable: ${id}`);

    const others = await this.prisma.malagasyItem.findMany({
      where: { id: { not: item.id }, status: 'PUBLISHED' },
      take: 6,
    });
    const distMeanings = others.map((o) => o.meaning.slice(0, 90) + '...').slice(0, 3);

    const suggestions: QuestionSuggestion[] = [];

    if (format === GameQuestionFormat.SINGLE_CHOICE) {
      const correctMeaning = item.meaning.slice(0, 90) + '...';
      const choices = [correctMeaning, ...distMeanings].sort(() => 0.5 - Math.random());
      suggestions.push({
        format: GameQuestionFormat.SINGLE_CHOICE,
        prompt: `Quel est le sens profond véhiculé par le proverbe malgache : « ${item.malagasy} » ?`,
        promptMg: `Inona no hevi-dalina tian'ity ohabolana ity ampitaina : « ${item.malagasy} » ?`,
        choices,
        answerIndex: choices.indexOf(correctMeaning),
        explanation: `« ${item.malagasy} » signifie : « ${item.french} ». Explication culturelle : ${item.meaning}`,
        difficulty,
        category: 'enigmes_sagesse',
        sourceReference: item.origins?.[0] || 'Sagesse des ancêtres (Ntaolo)',
        contentSourceType: ContentSourceType.MALAGASY_ITEM,
        contentSourceId: item.id,
      });
    } else if (format === GameQuestionFormat.RIDDLE) {
      // Transformer le sens ou l'expression en devinette d'esprit
      const canonical = stripMalagasyArticle(normalizeRiddleText(item.french.split(' ')[0] || item.malagasy.split(' ')[0]));
      suggestions.push({
        format: GameQuestionFormat.RIDDLE,
        prompt: `Diniho ity Ohabolana ity : « ${item.malagasy} » — Inona no foto-kevitra lehibe iorenany ?`,
        promptMg: item.malagasy,
        promptFr: item.french,
        correctAnswer: item.category.toLowerCase(),
        acceptedAnswers: [item.category.toLowerCase(), 'fihavanana', 'fahendrena'],
        clue: `Mifandray amin'ny ${item.category}`,
        explanation: `Ny ohabolana hoe « ${item.malagasy} » dia mampianatra antsika : ${item.meaning}`,
        difficulty,
        category: 'enigmes_sagesse',
        sourceReference: 'Ohabolana sy Ntaolo',
        contentSourceType: ContentSourceType.MALAGASY_ITEM,
        contentSourceId: item.id,
      });
    }

    return suggestions;
  }

  /**
   * Création en série / Batch suggestions pour alimenter un niveau complet
   */
  async batchSuggest(dto: BatchGenerateSuggestionsDto): Promise<QuestionSuggestion[]> {
    const { sourceType, formats, count = 10, difficulty = DifficultyLevel.EASY } = dto;

    const sources = await this.searchSources({ type: sourceType, limit: count });
    const allSuggestions: QuestionSuggestion[] = [];

    for (const src of sources.items) {
      const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
      try {
        const suggs = await this.generateSuggestions({
          sourceType,
          sourceId: src.id,
          format: selectedFormat,
          difficulty,
        });
        if (suggs.length > 0) {
          allSuggestions.push(suggs[0]);
        }
      } catch (err) {
        this.logger.warn(`Échec de suggestion pour ${src.id}: ${(err as Error).message}`);
      }

      if (allSuggestions.length >= count) break;
    }

    return allSuggestions;
  }

  /**
   * Publication universelle d'une question après validation humaine
   */
  async publishQuestion(dto: PublishUniversalQuestionDto) {
    this.logger.log(`Publication de question (${dto.format}) pour catégorie: ${dto.category}`);

    // Contrôles qualité stricts
    if (dto.format === GameQuestionFormat.SINGLE_CHOICE || dto.format === GameQuestionFormat.IMAGE_IDENTIFICATION) {
      if (!dto.choices || dto.choices.length < 2) {
        throw new BadRequestException('Un QCM requiert au moins 2 propositions de réponse');
      }
      if (dto.answerIndex === undefined || dto.answerIndex < 0 || dto.answerIndex >= dto.choices.length) {
        throw new BadRequestException('Un index de réponse valide est requis');
      }
      // Vérifier les doublons dans les choix
      const uniqueChoices = new Set(dto.choices.map((c) => c.trim().toLowerCase()));
      if (uniqueChoices.size !== dto.choices.length) {
        throw new BadRequestException('Toutes les propositions de réponse doivent être distinctes (doublon détecté)');
      }

      // Persistance dans CivicQuizQuestion (base QCM et identification d'images)
      const question = await this.prisma.civicQuizQuestion.create({
        data: {
          category: dto.category,
          prompt: dto.prompt,
          choices: dto.choices,
          answerIndex: dto.answerIndex,
          explanation: dto.explanation || 'Explication culturelle Kanto',
          explanationMg: dto.explanationMg,
          difficulty: dto.difficulty || DifficultyLevel.EASY,
          imageUrl: dto.imageUrl,
          imageAlt: dto.imageAlt,
          sourceReference: dto.sourceReference,
          sourceUrl: dto.sourceUrl,
          historicalPeriod: dto.historicalPeriod,
          contentSourceType: dto.contentSourceType,
          contentSourceId: dto.contentSourceId,
          levelNumber: dto.levelNumber || 1,
          status: dto.status || 'PUBLISHED',
        },
      });

      return {
        success: true,
        type: 'QUIZ',
        id: question.id,
        message: 'Question QCM publiée avec succès dans le Conservatoire de Kanto',
      };
    } else if (dto.format === GameQuestionFormat.TRUE_FALSE) {
      if (dto.isTrue === undefined) {
        throw new BadRequestException('La valeur de vérité (Vrai ou Faux) doit être explicitement définie');
      }

      const tf = await this.prisma.trueFalseQuestion.create({
        data: {
          questionMg: dto.promptMg || dto.prompt,
          questionFr: dto.promptFr || dto.prompt,
          isTrue: dto.isTrue,
          explanationMg: dto.explanationMg || dto.explanation || '',
          explanationFr: dto.explanation || '',
          explanationTrueFr: dto.explanationTrueFr,
          explanationTrueMg: dto.explanationTrueMg,
          explanationFalseFr: dto.explanationFalseFr,
          explanationFalseMg: dto.explanationFalseMg,
          theme: TrueFalseTheme.GEN,
          difficulty: dto.difficulty || DifficultyLevel.EASY,
          source: dto.sourceReference,
          image: dto.imageUrl,
          imageAlt: dto.imageAlt,
          sourceReference: dto.sourceReference,
          contentSourceType: dto.contentSourceType,
          contentSourceId: dto.contentSourceId,
          levelNumber: dto.levelNumber || 1,
          historicalPeriod: dto.historicalPeriod,
          status: dto.status || 'PUBLISHED',
        },
      });

      return {
        success: true,
        type: 'TRUE_FALSE',
        id: tf.id,
        message: 'Question Vrai/Faux publiée avec succès',
      };
    } else if (dto.format === GameQuestionFormat.RIDDLE) {
      if (!dto.correctAnswer) {
        throw new BadRequestException('Une devinette requiert une réponse correcte canonique');
      }

      const riddle = await this.prisma.riddleQuestion.create({
        data: {
          riddleMg: dto.promptMg || dto.prompt,
          riddleFr: dto.promptFr || dto.prompt,
          options: dto.choices || [],
          correctAnswer: dto.correctAnswer,
          acceptedAnswers: dto.acceptedAnswers || [],
          explanation: dto.explanation || 'Explication de la devinette',
          clue: dto.clue,
          level: dto.levelNumber || 1,
          difficulty: dto.difficulty || DifficultyLevel.EASY,
          imageUrl: dto.imageUrl,
          imageAlt: dto.imageAlt,
          sourceReference: dto.sourceReference,
          contentSourceType: dto.contentSourceType,
          contentSourceId: dto.contentSourceId,
          status: dto.status || 'PUBLISHED',
        },
      });

      return {
        success: true,
        type: 'RIDDLE',
        id: riddle.id,
        message: 'Devinette (Ankamantatra) publiée avec succès',
      };
    }

    throw new BadRequestException(`Format de question inconnu: ${dto.format}`);
  }
}
