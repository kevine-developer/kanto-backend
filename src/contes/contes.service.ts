import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindContesQueryDto } from './dto/find-contes.dto.js';
import { CreateConteDto } from './dto/create-conte.dto.js';
import { UpdateConteDto } from './dto/update-conte.dto.js';
import { slugify } from '../common/utils/slug.util.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

@Injectable()
export class ContesService {
  private readonly logger = new Logger(ContesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string, slug?: string) {
    await this.redis.delByPattern(CACHE_KEYS.CONTES_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.CONTES_DETAIL_PREFIX}${id}`);
    if (slug) await this.redis.del(`${CACHE_KEYS.CONTES_DETAIL_PREFIX}${slug}`);
  }

  async create(data: CreateConteDto) {
    let baseSlug = slugify(data.title.substring(0, 50));
    if (!baseSlug) baseSlug = 'conte';
    let slug = baseSlug;

    const existingSlug = await this.prisma.conte.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const conte = await this.prisma.conte.create({
      data: {
        slug,
        title: data.title,
        titleFr: data.titleFr,
        subtitle: data.subtitle || null,
        subtitleFr: data.subtitleFr || null,
        author: data.author || 'Angano Malagasy',
        moralMg: data.moralMg || null,
        moralFr: data.moralFr || null,
        illustration: data.illustration || null,
        status: 'PUBLISHED',
        paragraphs:
          data.paragraphs && data.paragraphs.length > 0
            ? {
                create: data.paragraphs.map((p, idx) => ({
                  paragraphNumber: p.paragraphNumber || idx + 1,
                  textMg: p.textMg,
                  textFr: p.textFr,
                })),
              }
            : undefined,
      },
      include: {
        paragraphs: {
          orderBy: { paragraphNumber: 'asc' },
        },
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(conte.id, conte.slug);
    this.logger.log(
      `✨ [Contes] Conte créé : "${conte.title}" (ID: ${conte.id})`,
    );
    return conte;
  }

  async update(id: string, data: UpdateConteDto) {
    const existing = await this.prisma.conte.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Conte avec l'identifiant "${id}" introuvable`,
      );
    }

    if (data.paragraphs !== undefined) {
      await this.prisma.conteParagraph.deleteMany({
        where: { conteId: id },
      });
    }

    const conte = await this.prisma.conte.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        titleFr: data.titleFr !== undefined ? data.titleFr : undefined,
        subtitle: data.subtitle !== undefined ? data.subtitle : undefined,
        subtitleFr: data.subtitleFr !== undefined ? data.subtitleFr : undefined,
        author: data.author !== undefined ? data.author : undefined,
        moralMg: data.moralMg !== undefined ? data.moralMg : undefined,
        moralFr: data.moralFr !== undefined ? data.moralFr : undefined,
        illustration:
          data.illustration !== undefined ? data.illustration : undefined,
        status: data.status !== undefined ? data.status : undefined,
        paragraphs:
          data.paragraphs && data.paragraphs.length > 0
            ? {
                create: data.paragraphs.map((p, idx) => ({
                  paragraphNumber: p.paragraphNumber || idx + 1,
                  textMg: p.textMg,
                  textFr: p.textFr,
                })),
              }
            : undefined,
      },
      include: {
        paragraphs: {
          orderBy: { paragraphNumber: 'asc' },
        },
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(conte.id, conte.slug);
    this.logger.log(
      `✏️ [Contes] Conte mis à jour : "${conte.title}" (ID: ${conte.id})`,
    );
    return conte;
  }

  async remove(id: string) {
    const existing = await this.prisma.conte.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Conte avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.prisma.conte.delete({
      where: { id },
    });

    await this.invalidateCache(id, existing.slug);
    this.logger.log(`🗑️ [Contes] Conte supprimé (ID: ${id})`);
    return { success: true, id };
  }

  async findAll(query: FindContesQueryDto = {}) {
    const { page, limit, skip } = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    const cacheKey = `${CACHE_KEYS.CONTES_LIST_PREFIX}${JSON.stringify(query)}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findAll contes`);
      return cached;
    }

    const where: Prisma.ConteWhereInput = {
      status: 'PUBLISHED',
    };

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
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { titleFr: { contains: searchTerm, mode: 'insensitive' } },
        { subtitle: { contains: searchTerm, mode: 'insensitive' } },
        { subtitleFr: { contains: searchTerm, mode: 'insensitive' } },
        { moralMg: { contains: searchTerm, mode: 'insensitive' } },
        { moralFr: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [contes, total] = await Promise.all([
      this.prisma.conte.findMany({
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
          paragraphs: {
            orderBy: { paragraphNumber: 'asc' },
          },
        },
      }),
      this.prisma.conte.count({ where }),
    ]);

    const result = formatPaginatedResponse(contes, total, page, limit);

    await this.redis.set(cacheKey, result, 300); // 5 minutes
    return result;
  }

  async findOne(idOrSlug: string) {
    const cacheKey = `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${idOrSlug}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) {
      this.logger.debug(
        `⚡ [Redis] Cache hit pour findOne conte "${idOrSlug}"`,
      );
      return cached;
    }

    const conte = await this.prisma.conte.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        paragraphs: {
          orderBy: { paragraphNumber: 'asc' },
        },
      },
    });

    if (!conte) {
      this.logger.warn(`⚠️ [Contes] Conte "${idOrSlug}" introuvable`);
      throw new NotFoundException(
        `Conte avec l'identifiant "${idOrSlug}" introuvable`,
      );
    }

    let variants: any[] = [];
    if (conte.variantIds && conte.variantIds.length > 0) {
      variants = await this.prisma.conte.findMany({
        where: {
          id: { in: conte.variantIds },
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          slug: true,
          title: true,
          titleFr: true,
          subtitle: true,
          subtitleFr: true,
          illustration: true,
        },
      });
    }

    const result = {
      ...conte,
      variants,
    };

    await this.redis.set(cacheKey, result, 600); // 10 minutes
    return result;
  }

  async like(idOrSlug: string) {
    const existing = await this.prisma.conte.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, likesCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Conte "${idOrSlug}" introuvable`);
    }

    const conte = await this.prisma.conte.update({
      where: { id: existing.id },
      data: {
        likesCount: { increment: 1 },
      },
      select: { id: true, slug: true, likesCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.slug}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.CONTES_LIST_PATTERN);

    this.logger.log(
      `❤️ [Contes] Like ajouté sur conte ID ${existing.id} (total: ${conte.likesCount})`,
    );
    return conte;
  }

  async unlike(idOrSlug: string) {
    const existing = await this.prisma.conte.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, likesCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Conte "${idOrSlug}" introuvable`);
    }

    const newCount = Math.max(0, existing.likesCount - 1);
    const conte = await this.prisma.conte.update({
      where: { id: existing.id },
      data: { likesCount: newCount },
      select: { id: true, slug: true, likesCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.slug}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.CONTES_LIST_PATTERN);

    this.logger.log(
      `💔 [Contes] Unlike sur conte ID ${existing.id} (total: ${conte.likesCount})`,
    );
    return conte;
  }

  async incrementView(idOrSlug: string) {
    const existing = await this.prisma.conte.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, viewCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Conte "${idOrSlug}" introuvable`);
    }

    const redisViews = await this.redis.incr(
      `kanto:views:conte:${existing.id}`,
    );

    const conte = await this.prisma.conte.update({
      where: { id: existing.id },
      data: {
        viewCount: { increment: 1 },
      },
      select: { id: true, slug: true, viewCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.CONTES_DETAIL_PREFIX}${existing.slug}`,
    ]);

    const finalViews =
      redisViews && redisViews > conte.viewCount ? redisViews : conte.viewCount;

    this.logger.log(
      `👁️ [Contes] Vue incrémentée sur conte ID ${existing.id} (total: ${finalViews})`,
    );

    return {
      ...conte,
      viewCount: finalViews,
    };
  }
}
