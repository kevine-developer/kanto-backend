import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoryType } from '../../generated/prisma/client.js';

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  score: number; // 0.0 à 1.0
  targetId: string | null;
  targetType: 'MALAGASY_ITEM' | 'CONTRIBUTION' | null;
  targetTitle: string | null;
  explanation?: string;
}

@Injectable()
export class DuplicateDetectionService {
  private readonly logger = new Logger(DuplicateDetectionService.name);

  // Mots de liaison fréquents en malgache à filtrer pour la comparaison sémantique
  private readonly MALAGASY_STOP_WORDS = new Set([
    'ny',
    'dia',
    'ka',
    'fa',
    'sy',
    'no',
    'ho',
    'an',
    'ary',
    'raha',
    'toy',
    'toa',
    'koa',
    'aza',
    'moa',
    're',
    've',
    'ity',
    'ireo',
    'izany',
  ]);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Normalise le texte malgache pour une comparaison insensible aux variantes mineures :
   * - Minuscules
   * - Retrait des accents (NFD)
   * - Retrait des apostrophes malgaches (ex: n'ny -> n ny) et ponctuation
   * - Retrait des stop-words fréquents
   */
  public normalizeText(text: string, removeStopWords: boolean = true): string {
    if (!text) return '';

    const clean = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // accents
      .replace(/['’ʼ`]/g, ' ') // apostrophes
      .replace(/[^a-z0-9\s]/g, ' ') // ponctuations
      .replace(/\s+/g, ' ')
      .trim();

    if (removeStopWords) {
      const words = clean
        .split(' ')
        .filter((w) => w.length > 1 && !this.MALAGASY_STOP_WORDS.has(w));
      return words.join(' ');
    }

    return clean;
  }

  /**
   * Calcule le coefficient de Dice-Sørensen sur les bigrammes de caractères
   * Idéal pour identifier les permutations de mots ou légères fautes de frappe.
   */
  public calculateDiceSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeText(str1, false);
    const s2 = this.normalizeText(str2, false);

    if (s1 === s2) return 1.0;
    if (s1.length < 2 || s2.length < 2) return 0.0;

    const getBigrams = (s: string) => {
      const bigrams = new Map<string, number>();
      for (let i = 0; i < s.length - 1; i++) {
        const bigram = s.slice(i, i + 2);
        bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
      }
      return bigrams;
    };

    const b1 = getBigrams(s1);
    const b2 = getBigrams(s2);

    let intersection = 0;
    for (const [bigram, count1] of b1.entries()) {
      if (b2.has(bigram)) {
        intersection += Math.min(count1, b2.get(bigram)!);
      }
    }

    const total = s1.length - 1 + (s2.length - 1);
    return total > 0 ? (2.0 * intersection) / total : 0;
  }

  /**
   * Distance de Levenshtein normalisée (0 à 1)
   */
  public calculateLevenshteinSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeText(str1, false);
    const s2 = this.normalizeText(str2, false);

    const m = s1.length;
    const n = s2.length;
    if (m === 0) return n === 0 ? 1 : 0;
    if (n === 0) return 0;

    const d: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0),
    );
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost,
        );
      }
    }

    const maxLen = Math.max(m, n);
    return (maxLen - d[m][n]) / maxLen;
  }

  /**
   * Score de ressemblance global combiné
   */
  public getCombinedSimilarity(textA: string, textB: string): number {
    const dice = this.calculateDiceSimilarity(textA, textB);
    const levenshtein = this.calculateLevenshteinSimilarity(textA, textB);
    // Le Dice donne d'excellents résultats sur les phrases permutées, Levenshtein sur les fautes de frappe
    return Math.max(dice, levenshtein);
  }

  /**
   * Détecte les doublons potentiels pour une contribution :
   * 1. Dans le catalogue officiel (MalagasyItem / Citations / Contes / Kabary)
   * 2. Dans les contributions existantes de la communauté
   *
   * @param textMg Texte malgache soumis
   * @param category Catégorie du contenu
   * @param excludeContributionId ID à exclure lors d'une mise à jour
   * @param threshold Seuil de déclenchement (par défaut 0.70 = 70%)
   */
  async detectDuplicate(
    textMg: string,
    category?: CategoryType,
    excludeContributionId?: string,
    threshold = 0.7,
  ): Promise<DuplicateDetectionResult> {
    if (!textMg || textMg.trim().length < 8) {
      return {
        isDuplicate: false,
        score: 0,
        targetId: null,
        targetType: null,
        targetTitle: null,
      };
    }

    const cleanInput = this.normalizeText(textMg);
    let bestMatch: DuplicateDetectionResult = {
      isDuplicate: false,
      score: 0,
      targetId: null,
      targetType: null,
      targetTitle: null,
    };

    // 1. Recherche dans le catalogue officiel (MalagasyItem)
    const malagasyItems = await this.prisma.malagasyItem.findMany({
      select: { id: true, malagasy: true, french: true, category: true },
      take: 500,
    });

    for (const item of malagasyItems) {
      const score = this.getCombinedSimilarity(cleanInput, item.malagasy);
      if (score > bestMatch.score) {
        bestMatch = {
          isDuplicate: score >= threshold,
          score: Math.round(score * 100) / 100,
          targetId: item.id,
          targetType: 'MALAGASY_ITEM',
          targetTitle: item.malagasy,
          explanation: `Ressemble à l'élément officiel : « ${item.malagasy} » (${Math.round(score * 100)}%)`,
        };
      }
    }

    // 2. Recherche dans les contributions existantes
    const contributions = await this.prisma.contribution.findMany({
      where: {
        id: excludeContributionId ? { not: excludeContributionId } : undefined,
        isDuplicateConfirmed: false, // Éviter de comparer à un doublon déjà confirmé
      },
      select: { id: true, textMg: true, category: true },
      take: 500,
    });

    for (const c of contributions) {
      // Ignorer si textMg est un JSON sérialisé
      if (c.textMg.startsWith('{')) continue;

      const score = this.getCombinedSimilarity(cleanInput, c.textMg);
      if (score > bestMatch.score) {
        bestMatch = {
          isDuplicate: score >= threshold,
          score: Math.round(score * 100) / 100,
          targetId: c.id,
          targetType: 'CONTRIBUTION',
          targetTitle: c.textMg,
          explanation: `Ressemble à une contribution communautaire existante : « ${c.textMg.slice(0, 60)}... » (${Math.round(score * 100)}%)`,
        };
      }
    }

    return bestMatch;
  }
}
