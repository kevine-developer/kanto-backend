import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindItemsQueryDto } from './dto/find-items.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { ImportItemsBatchDto, ImportItemsResult } from './dto/import-items.dto.js';
import { slugify } from '../common/utils/slug.util.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string, slug?: string) {
    await this.redis.delByPattern(CACHE_KEYS.ITEMS_LIST_PATTERN);
    await this.redis.delByPattern(CACHE_KEYS.DAILY_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${id}`);
    if (slug) await this.redis.del(`${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${slug}`);
  }

  async create(data: CreateItemDto) {
    let baseSlug = slugify(data.malagasy.substring(0, 50));
    if (!baseSlug) baseSlug = 'item';
    let slug = baseSlug;

    const existingSlug = await this.prisma.malagasyItem.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const item = await this.prisma.malagasyItem.create({
      data: {
        slug,
        malagasy: data.malagasy,
        french: data.french,
        meaning: data.meaning,
        example: data.example || null,
        category: data.category || 'PROVERBE',
        difficulty: data.difficulty || 'EASY',
        isFeatured: data.isFeatured || false,
        status: 'PUBLISHED',
        dialectVariants:
          data.dialectVariants && data.dialectVariants.length > 0
            ? {
                create: data.dialectVariants.map((v) => ({
                  dialectName: v.dialectName,
                  text: v.text,
                  notes: v.notes || null,
                })),
              }
            : undefined,
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        dialectVariants: true,
      },
    });

    await this.invalidateCache(item.id, item.slug);
    this.logger.log(
      `✨ [Items] Élément créé : "${item.malagasy}" (ID: ${item.id})`,
    );
    return item;
  }

  async update(id: string, data: UpdateItemDto) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Élément avec l'identifiant "${id}" introuvable`,
      );
    }

    if (data.dialectVariants !== undefined) {
      await this.prisma.dialectVariant.deleteMany({
        where: { itemId: id },
      });
    }

    const item = await this.prisma.malagasyItem.update({
      where: { id },
      data: {
        malagasy: data.malagasy !== undefined ? data.malagasy : undefined,
        french: data.french !== undefined ? data.french : undefined,
        meaning: data.meaning !== undefined ? data.meaning : undefined,
        example: data.example !== undefined ? data.example : undefined,
        category: data.category !== undefined ? data.category : undefined,
        difficulty: data.difficulty !== undefined ? data.difficulty : undefined,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : undefined,
        status: data.status !== undefined ? data.status : undefined,
        dialectVariants:
          data.dialectVariants && data.dialectVariants.length > 0
            ? {
                create: data.dialectVariants.map((v) => ({
                  dialectName: v.dialectName,
                  text: v.text,
                  notes: v.notes || null,
                })),
              }
            : undefined,
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        dialectVariants: true,
      },
    });

    await this.invalidateCache(item.id, item.slug);
    this.logger.log(
      `✏️ [Items] Élément mis à jour : "${item.malagasy}" (ID: ${item.id})`,
    );
    return item;
  }

  async remove(id: string) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Élément avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.prisma.malagasyItem.delete({
      where: { id },
    });

    await this.invalidateCache(id, existing.slug);
    this.logger.log(`🗑️ [Items] Élément supprimé (ID: ${id})`);
    return { success: true, id };
  }

  async findAll(query: FindItemsQueryDto = {}) {
    const { page, limit, skip } = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    const cacheKey = `${CACHE_KEYS.ITEMS_LIST_PREFIX}${JSON.stringify(query)}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findAll items`);
      return cached;
    }

    const where: Prisma.MalagasyItemWhereInput = {
      status: 'PUBLISHED',
    };

    if (query.category) {
      where.category = query.category;
    }

    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured =
        query.isFeatured === true || String(query.isFeatured) === 'true';
    }

    if (query.themeSlug) {
      where.themes = {
        some: {
          theme: {
            slug: query.themeSlug,
          },
        },
      };
    }

    if (query.excludeIds) {
      const excludedIds = Array.isArray(query.excludeIds)
        ? query.excludeIds
        : typeof query.excludeIds === 'string'
          ? query.excludeIds
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      if (excludedIds.length > 0) {
        where.id = { notIn: excludedIds };
      }
    }

    if (query.search && query.search.trim()) {
      const rawSearch = query.search.trim();
      const straight = rawSearch.replace(/[’‘`]/g, "'");
      const curly = rawSearch.replace(/'/g, '’');
      const terms = Array.from(new Set([rawSearch, straight, curly]));

      where.OR = terms.flatMap((term) => [
        { malagasy: { contains: term, mode: 'insensitive' } },
        { french: { contains: term, mode: 'insensitive' } },
        { meaning: { contains: term, mode: 'insensitive' } },
      ]);
    }

    // Tirage aléatoire global à partir de TOUS les contenus de la catégorie
    if (query.seed) {
      const allMatching = await this.prisma.malagasyItem.findMany({
        where,
        select: { id: true },
      });

      let matchingIds = allMatching.map((r) => r.id);
      // Fallback si tous les éléments ont été exclus (tout est déjà vu)
      if (matchingIds.length === 0 && where.id) {
        delete where.id;
        const fallbackMatching = await this.prisma.malagasyItem.findMany({
          where,
          select: { id: true },
        });
        matchingIds = fallbackMatching.map((r) => r.id);
      }

      const total = matchingIds.length;
      const shuffledIds = this.seededShuffle(matchingIds, query.seed);
      const pageIds = shuffledIds.slice(skip, skip + limit);

      if (pageIds.length === 0) {
        const emptyResult = formatPaginatedResponse([], total, page, limit);
        await this.redis.set(cacheKey, emptyResult, 300);
        return emptyResult;
      }

      const items = await this.prisma.malagasyItem.findMany({
        where: { id: { in: pageIds } },
        include: {
          themes: {
            include: {
              theme: true,
            },
          },
          dialectVariants: true,
        },
      });

      const itemMap = new Map(items.map((i) => [i.id, i]));
      const orderedItems = pageIds.map((id) => itemMap.get(id)).filter(Boolean);

      const result = formatPaginatedResponse(orderedItems, total, page, limit);
      await this.redis.set(cacheKey, result, 300);
      return result;
    }

    const [items, total] = await Promise.all([
      this.prisma.malagasyItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          themes: {
            include: {
              theme: true,
            },
          },
          dialectVariants: true,
        },
      }),
      this.prisma.malagasyItem.count({ where }),
    ]);

    const result = formatPaginatedResponse(items, total, page, limit);

    await this.redis.set(cacheKey, result, 300); // Cache 5 min
    return result;
  }

  private seededShuffle<T>(array: T[], seedStr: string): T[] {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const random = () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(random()) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  async findOne(idOrSlug: string) {
    const cacheKey = `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${idOrSlug}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findOne item "${idOrSlug}"`);
      return cached;
    }

    const item = await this.prisma.malagasyItem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
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
      this.logger.warn(`⚠️ [Items] Élément "${idOrSlug}" introuvable`);
      throw new NotFoundException(
        `Élément avec l'identifiant "${idOrSlug}" introuvable`,
      );
    }

    this.logger.log(
      `📖 [Items] Consultation élément "${item.malagasy}" (ID: ${item.id})`,
    );

    await this.redis.set(cacheKey, item, 600); // 10 min
    return item;
  }

  /**
   * Import par lot de proverbes / expressions / dictons (CSV ou Excel)
   */
  async importBatch(dto: ImportItemsBatchDto): Promise<ImportItemsResult> {
    const rows = dto.items || [];
    const skipDuplicates = dto.skipDuplicates !== false;
    let importedCount = 0;
    let duplicatesSkipped = 0;
    const errors: Array<{ row: number; text: string; reason: string }> = [];

    // Récupérer les proverbes existants pour détection rapide de doublons
    const existingItems = await this.prisma.malagasyItem.findMany({
      select: { malagasy: true, slug: true },
    });
    const existingTexts = new Set(
      existingItems.map((i) => i.malagasy.trim().toLowerCase()),
    );
    const existingSlugs = new Set(existingItems.map((i) => i.slug));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 1;

      // Validation minimale
      if (!row.malagasy || !row.malagasy.trim()) {
        errors.push({
          row: rowIndex,
          text: row.malagasy || '(vide)',
          reason: 'Texte en malgache obligatoire',
        });
        continue;
      }
      if (!row.french || !row.french.trim()) {
        errors.push({
          row: rowIndex,
          text: row.malagasy,
          reason: 'Traduction française obligatoire',
        });
        continue;
      }
      if (!row.meaning || !row.meaning.trim()) {
        errors.push({
          row: rowIndex,
          text: row.malagasy,
          reason: 'Explication / sens obligatoire',
        });
        continue;
      }

      const cleanMalagasy = row.malagasy.trim();
      const normalizedKey = cleanMalagasy.toLowerCase();

      // Détection de doublon
      if (existingTexts.has(normalizedKey)) {
        if (skipDuplicates) {
          duplicatesSkipped++;
          continue;
        } else {
          errors.push({
            row: rowIndex,
            text: cleanMalagasy,
            reason: 'Proverbe déjà existant en base',
          });
          continue;
        }
      }

      // Génération de slug unique
      let baseSlug = slugify(cleanMalagasy.substring(0, 50));
      if (!baseSlug) baseSlug = 'item';
      let slug = baseSlug;
      let counter = 1;
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }

      try {
        await this.prisma.malagasyItem.create({
          data: {
            slug,
            malagasy: cleanMalagasy,
            french: row.french.trim(),
            meaning: row.meaning.trim(),
            example: row.example?.trim() || null,
            category: row.category || 'PROVERBE',
            difficulty: row.difficulty || 'EASY',
            isFeatured: row.isFeatured || false,
            status: 'PUBLISHED',
            dialectVariants:
              row.dialectName && row.dialectText
                ? {
                    create: [
                      {
                        dialectName: row.dialectName.trim(),
                        text: row.dialectText.trim(),
                      },
                    ],
                  }
                : undefined,
          },
        });

        existingTexts.add(normalizedKey);
        existingSlugs.add(slug);
        importedCount++;
      } catch (err: any) {
        errors.push({
          row: rowIndex,
          text: cleanMalagasy,
          reason: err?.message || 'Erreur inconnue lors de l insertion',
        });
      }
    }

    if (importedCount > 0) {
      await this.invalidateCache();
      this.logger.log(
        `📥 [Items Batch] ${importedCount} éléments importés avec succès (${duplicatesSkipped} doublons ignorés, ${errors.length} erreurs).`,
      );
    }

    return {
      totalReceived: rows.length,
      importedCount,
      duplicatesSkipped,
      errorsCount: errors.length,
      errors,
    };
  }

  /**
   * Exporte les proverbes / expressions en format CSV (UTF-8 avec BOM pour Excel)
   */
  async exportCsv(query: FindItemsQueryDto = {}): Promise<string> {
    const where: Prisma.MalagasyItemWhereInput = {
      status: 'PUBLISHED',
    };
    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;

    const items = await this.prisma.malagasyItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
      include: {
        dialectVariants: true,
      },
    });

    const escapeCsv = (val?: string | null): string => {
      if (!val) return '""';
      const clean = val.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const headers = [
      'Malagasy',
      'Traduction Francaise',
      'Signification',
      'Exemple',
      'Categorie',
      'Difficulte',
      'Dialecte',
      'Variante Dialectale',
    ];

    const lines: string[] = [headers.join(',')];

    for (const item of items) {
      const dialect = item.dialectVariants?.[0]?.dialectName || '';
      const dialectText = item.dialectVariants?.[0]?.text || '';
      const row = [
        escapeCsv(item.malagasy),
        escapeCsv(item.french),
        escapeCsv(item.meaning),
        escapeCsv(item.example),
        escapeCsv(item.category),
        escapeCsv(item.difficulty),
        escapeCsv(dialect),
        escapeCsv(dialectText),
      ];
      lines.push(row.join(','));
    }

    // BOM UTF-8 (\uFEFF) pour compatibilité Excel
    return '\uFEFF' + lines.join('\r\n');
  }
}
