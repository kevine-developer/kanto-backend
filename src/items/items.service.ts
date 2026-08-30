import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindItemsQueryDto } from './dto/find-items.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
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

    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      where.OR = [
        { malagasy: { contains: searchTerm, mode: 'insensitive' } },
        { french: { contains: searchTerm, mode: 'insensitive' } },
        { meaning: { contains: searchTerm, mode: 'insensitive' } },
      ];
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
}
