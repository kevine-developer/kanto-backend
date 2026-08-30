import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class DailyItemsService {
  private readonly logger = new Logger(DailyItemsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Récupère le proverbe/contenu du jour calculé de façon déterministe selon la date.
   */
  async findDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const cacheKey = `kanto:daily:single:${todayStr}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findDaily (${todayStr})`);
      return cached;
    }

    let dateHash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      dateHash = (dateHash << 5) - dateHash + todayStr.charCodeAt(i);
      dateHash |= 0;
    }
    const absSeed = Math.abs(dateHash);
    const categoryMode = absSeed % 4;

    if (categoryMode === 3) {
      // Citation du jour
      const count = await this.prisma.citation.count({
        where: { status: 'PUBLISHED' },
      });

      if (count > 0) {
        const skip = absSeed % count;
        const citation = await this.prisma.citation.findFirst({
          where: { status: 'PUBLISHED' },
          skip,
          include: {
            author: true,
            themes: {
              include: {
                theme: true,
              },
            },
          },
        });

        if (citation) {
          this.logger.log(
            `💬 [Daily] Citation du jour: "${citation.citationMg || citation.citationFr}" (${citation.sourceName})`,
          );

          const result = {
            id: `daily-citation-${todayStr}`,
            date: today,
            editorial: 'Tenin’olon-kendry anio ho anao.',
            contentType: 'CITATION',
            category: 'CITATION',
            categoryLabelMg: "Tenin'olon-kendry anio",
            categoryLabelFr: 'Citation du jour',
            malagasy: citation.citationMg || citation.citationFr,
            french: citation.citationFr,
            meaning: citation.contexte || '',
            source: citation.sourceName || citation.author?.name || 'Tantara',
            itemId: citation.id,
            item: {
              id: citation.id,
              malagasy: citation.citationMg || citation.citationFr,
              french: citation.citationFr,
              meaning: citation.contexte || '',
              category: 'CITATION',
              origins: [],
              dialectVariants: [],
              themes: (citation.themes || [])
                .map((t) => t.theme?.nameFr || t.theme?.nameMg || '')
                .filter(Boolean),
              viewCount: citation.viewCount,
              likesCount: citation.likesCount,
            },
            citation,
          };

          await this.redis.set(cacheKey, result, 86400); // 24h
          return result;
        }
      }
    }

    // Proverbe, Expression ou Dicton du jour
    let targetCategory: 'PROVERBE' | 'EXPRESSION' | 'DICTON' = 'PROVERBE';
    if (categoryMode === 1) targetCategory = 'EXPRESSION';
    if (categoryMode === 2) targetCategory = 'DICTON';

    let count = await this.prisma.malagasyItem.count({
      where: { category: targetCategory, status: 'PUBLISHED' },
    });

    if (count === 0) {
      targetCategory = 'PROVERBE';
      count = await this.prisma.malagasyItem.count({
        where: { category: 'PROVERBE', status: 'PUBLISHED' },
      });
    }

    const skip = count > 0 ? absSeed % count : 0;
    const item = await this.prisma.malagasyItem.findFirst({
      where: { category: targetCategory, status: 'PUBLISHED' },
      skip,
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        dialectVariants: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Aucun contenu culturel disponible');
    }

    const categoryLabels = {
      PROVERBE: { mg: 'Ohabolana anio', fr: 'Proverbe du jour' },
      EXPRESSION: { mg: 'Oha-pitenenana anio', fr: 'Expression du jour' },
      DICTON: { mg: 'Fomba fiteny anio', fr: 'Dicton du jour' },
    };

    const label = categoryLabels[item.category] || categoryLabels.PROVERBE;

    this.logger.log(
      `☀️ [Daily] ${label.fr}: "${item.malagasy}" (${item.category})`,
    );

    const result = {
      id: `daily-${item.category.toLowerCase()}-${todayStr}`,
      date: today,
      editorial: `${label.fr} pour votre inspiration quotidienne.`,
      contentType: 'ITEM',
      category: item.category,
      categoryLabelMg: label.mg,
      categoryLabelFr: label.fr,
      malagasy: item.malagasy,
      french: item.french,
      meaning: item.meaning,
      itemId: item.id,
      item,
    };

    await this.redis.set(cacheKey, result, 86400); // 24h
    return result;
  }

  /**
   * Récupère l'ensemble des contenus culturels du jour (Proverbe, Expression, Dicton, Citation).
   */
  async findAllDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const cacheKey = `kanto:daily:all:${todayStr}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findAllDaily (${todayStr})`);
      return cached;
    }

    let dateHash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      dateHash = (dateHash << 5) - dateHash + todayStr.charCodeAt(i);
      dateHash |= 0;
    }
    const absSeed = Math.abs(dateHash);

    const results: Array<{
      id: string;
      date: Date;
      contentType: 'ITEM' | 'CITATION';
      category: 'PROVERBE' | 'EXPRESSION' | 'DICTON' | 'CITATION';
      categoryLabelMg: string;
      categoryLabelFr: string;
      malagasy: string;
      french: string;
      meaning?: string;
      source?: string;
      itemId: string;
      item: any;
      citation?: any;
    }> = [];

    // 1. Proverbe du jour
    const proverbCount = await this.prisma.malagasyItem.count({
      where: { category: 'PROVERBE', status: 'PUBLISHED' },
    });
    if (proverbCount > 0) {
      const proverb = await this.prisma.malagasyItem.findFirst({
        where: { category: 'PROVERBE', status: 'PUBLISHED' },
        skip: absSeed % proverbCount,
        include: {
          themes: { include: { theme: true } },
          dialectVariants: true,
        },
      });
      if (proverb) {
        results.push({
          id: `daily-proverbe-${todayStr}`,
          date: today,
          contentType: 'ITEM',
          category: 'PROVERBE',
          categoryLabelMg: 'Ohabolana anio',
          categoryLabelFr: 'Proverbe du jour',
          malagasy: proverb.malagasy,
          french: proverb.french,
          meaning: proverb.meaning,
          itemId: proverb.id,
          item: proverb,
        });
      }
    }

    // 2. Expression du jour
    const exprCount = await this.prisma.malagasyItem.count({
      where: { category: 'EXPRESSION', status: 'PUBLISHED' },
    });
    if (exprCount > 0) {
      const expr = await this.prisma.malagasyItem.findFirst({
        where: { category: 'EXPRESSION', status: 'PUBLISHED' },
        skip: (absSeed + 1) % exprCount,
        include: {
          themes: { include: { theme: true } },
          dialectVariants: true,
        },
      });
      if (expr) {
        results.push({
          id: `daily-expression-${todayStr}`,
          date: today,
          contentType: 'ITEM',
          category: 'EXPRESSION',
          categoryLabelMg: 'Oha-pitenenana anio',
          categoryLabelFr: 'Expression du jour',
          malagasy: expr.malagasy,
          french: expr.french,
          meaning: expr.meaning,
          itemId: expr.id,
          item: expr,
        });
      }
    }

    // 3. Dicton du jour
    const dictonCount = await this.prisma.malagasyItem.count({
      where: { category: 'DICTON', status: 'PUBLISHED' },
    });
    if (dictonCount > 0) {
      const dicton = await this.prisma.malagasyItem.findFirst({
        where: { category: 'DICTON', status: 'PUBLISHED' },
        skip: (absSeed + 2) % dictonCount,
        include: {
          themes: { include: { theme: true } },
          dialectVariants: true,
        },
      });
      if (dicton) {
        results.push({
          id: `daily-dicton-${todayStr}`,
          date: today,
          contentType: 'ITEM',
          category: 'DICTON',
          categoryLabelMg: 'Fomba fiteny anio',
          categoryLabelFr: 'Dicton du jour',
          malagasy: dicton.malagasy,
          french: dicton.french,
          meaning: dicton.meaning,
          itemId: dicton.id,
          item: dicton,
        });
      }
    }

    // 4. Citation du jour
    const citationCount = await this.prisma.citation.count({
      where: { status: 'PUBLISHED' },
    });
    if (citationCount > 0) {
      const citation = await this.prisma.citation.findFirst({
        where: { status: 'PUBLISHED' },
        skip: (absSeed + 3) % citationCount,
        include: {
          author: true,
          themes: { include: { theme: true } },
        },
      });
      if (citation) {
        results.push({
          id: `daily-citation-${todayStr}`,
          date: today,
          contentType: 'CITATION',
          category: 'CITATION',
          categoryLabelMg: "Tenin'olon-kendry anio",
          categoryLabelFr: 'Citation du jour',
          malagasy: citation.citationMg || citation.citationFr,
          french: citation.citationFr,
          meaning: citation.contexte || '',
          source: citation.sourceName || citation.author?.name || 'Tantara',
          itemId: citation.id,
          item: {
            id: citation.id,
            malagasy: citation.citationMg || citation.citationFr,
            french: citation.citationFr,
            meaning: citation.contexte || '',
            category: 'CITATION',
            origins: [],
            dialectVariants: [],
            themes: (citation.themes || [])
              .map((t) => t.theme?.nameFr || t.theme?.nameMg || '')
              .filter(Boolean),
            viewCount: citation.viewCount,
            likesCount: citation.likesCount,
          },
          citation,
        });
      }
    }

    this.logger.log(`☀️ [Daily] ${results.length} contenus du jour générés`);

    await this.redis.set(cacheKey, results, 86400); // 24h
    return results;
  }
}
