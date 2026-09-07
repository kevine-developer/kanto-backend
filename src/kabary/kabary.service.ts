import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindKabaryQueryDto } from './dto/find-kabary.dto.js';
import { CreateKabaryDto } from './dto/create-kabary.dto.js';
import { UpdateKabaryDto } from './dto/update-kabary.dto.js';
import { slugify } from '../common/utils/slug.util.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

@Injectable()
export class KabaryService {
  private readonly logger = new Logger(KabaryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string, slug?: string) {
    await this.redis.delByPattern(CACHE_KEYS.KABARY_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.KABARY_DETAIL_PREFIX}${id}`);
    if (slug) await this.redis.del(`${CACHE_KEYS.KABARY_DETAIL_PREFIX}${slug}`);
  }

  async create(data: CreateKabaryDto) {
    let baseSlug = slugify(data.title.substring(0, 50));
    if (!baseSlug) baseSlug = 'kabary';
    let slug = baseSlug;

    const existingSlug = await this.prisma.kabary.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const kabary = await this.prisma.kabary.create({
      data: {
        slug,
        title: data.title,
        titleFr: data.titleFr,
        occasion: data.occasion,
        occasionFr: data.occasionFr || null,
        speakerRoleMg: data.speakerRoleMg || null,
        recipientRoleMg: data.recipientRoleMg || null,
        region: data.region || null,
        concludingProverbMg: data.concludingProverbMg || null,
        status: 'PUBLISHED',
        steps:
          data.steps && data.steps.length > 0
            ? {
                create: data.steps.map((s, idx) => ({
                  stepNumber: s.stepNumber || idx + 1,
                  stepNameMg: s.stepNameMg,
                  stepNameFr: s.stepNameFr,
                  explanationFr: s.explanationFr || null,
                  textMg: s.textMg,
                  textFr: s.textFr,
                })),
              }
            : undefined,
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(kabary.id, kabary.slug);
    this.logger.log(
      `✨ [Kabary] Discours créé : "${kabary.title}" (ID: ${kabary.id})`,
    );
    return kabary;
  }

  async update(id: string, data: UpdateKabaryDto) {
    const existing = await this.prisma.kabary.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Kabary avec l'identifiant "${id}" introuvable`,
      );
    }

    if (data.steps !== undefined) {
      await this.prisma.kabaryStep.deleteMany({
        where: { kabaryId: id },
      });
    }

    const kabary = await this.prisma.kabary.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        titleFr: data.titleFr !== undefined ? data.titleFr : undefined,
        occasion: data.occasion !== undefined ? data.occasion : undefined,
        occasionFr: data.occasionFr !== undefined ? data.occasionFr : undefined,
        speakerRoleMg:
          data.speakerRoleMg !== undefined ? data.speakerRoleMg : undefined,
        recipientRoleMg:
          data.recipientRoleMg !== undefined ? data.recipientRoleMg : undefined,
        region: data.region !== undefined ? data.region : undefined,
        concludingProverbMg:
          data.concludingProverbMg !== undefined
            ? data.concludingProverbMg
            : undefined,
        status: data.status !== undefined ? data.status : undefined,
        steps:
          data.steps && data.steps.length > 0
            ? {
                create: data.steps.map((s, idx) => ({
                  stepNumber: s.stepNumber || idx + 1,
                  stepNameMg: s.stepNameMg,
                  stepNameFr: s.stepNameFr,
                  explanationFr: s.explanationFr || null,
                  textMg: s.textMg,
                  textFr: s.textFr,
                })),
              }
            : undefined,
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(kabary.id, kabary.slug);
    this.logger.log(
      `✏️ [Kabary] Discours mis à jour : "${kabary.title}" (ID: ${kabary.id})`,
    );
    return kabary;
  }

  async remove(id: string) {
    const existing = await this.prisma.kabary.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Kabary avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.prisma.kabary.delete({
      where: { id },
    });

    await this.invalidateCache(id, existing.slug);
    this.logger.log(`🗑️ [Kabary] Discours supprimé (ID: ${id})`);
    return { success: true, id };
  }

  async findAll(query: FindKabaryQueryDto = {}) {
    const { page, limit, skip } = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    const cacheKey = `${CACHE_KEYS.KABARY_LIST_PREFIX}${JSON.stringify(query)}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findAll kabary`);
      return cached;
    }

    const where: Prisma.KabaryWhereInput = {
      status: 'PUBLISHED',
    };

    if (query.occasion) {
      where.occasion = { contains: query.occasion, mode: 'insensitive' };
    }

    if (query.region) {
      where.region = { contains: query.region, mode: 'insensitive' };
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
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { titleFr: { contains: searchTerm, mode: 'insensitive' } },
        { subtitle: { contains: searchTerm, mode: 'insensitive' } },
        { subtitleFr: { contains: searchTerm, mode: 'insensitive' } },
        { occasion: { contains: searchTerm, mode: 'insensitive' } },
        { occasionFr: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [kabaries, total] = await Promise.all([
      this.prisma.kabary.findMany({
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
          steps: {
            orderBy: { stepNumber: 'asc' },
          },
        },
      }),
      this.prisma.kabary.count({ where }),
    ]);

    const result = formatPaginatedResponse(kabaries, total, page, limit);

    await this.redis.set(cacheKey, result, 300); // 5 minutes
    return result;
  }

  async findOne(idOrSlug: string) {
    const cacheKey = `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${idOrSlug}`;
    const cached = await this.redis.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      this.logger.debug(
        `⚡ [Redis] Cache hit pour findOne kabary "${idOrSlug}"`,
      );
      return cached;
    }

    const kabary = await this.prisma.kabary.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!kabary) {
      this.logger.warn(`⚠️ [Kabary] Discours "${idOrSlug}" introuvable`);
      throw new NotFoundException(
        `Discours avec l'identifiant "${idOrSlug}" introuvable`,
      );
    }

    this.logger.log(
      `🗣️ [Kabary] Consultation discours "${kabary.title}" (ID: ${kabary.id})`,
    );

    await this.redis.set(cacheKey, kabary, 600); // 10 minutes
    return kabary;
  }

  async like(idOrSlug: string, userId: string) {
    if (!userId) {
      throw new NotFoundException(`Utilisateur non authentifié`);
    }

    const existing = await this.prisma.kabary.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, likesCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Discours "${idOrSlug}" introuvable`);
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_kabaryId: {
          userId,
          kabaryId: existing.id,
        },
      },
    });

    if (existingLike) {
      return existing;
    }

    const [, kabary] = await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          kabaryId: existing.id,
        },
      }),
      this.prisma.kabary.update({
        where: { id: existing.id },
        data: {
          likesCount: { increment: 1 },
        },
        select: { id: true, slug: true, likesCount: true },
      }),
    ]);

    await this.redis.del([
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.slug}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.KABARY_LIST_PATTERN);

    this.logger.log(
      `❤️ [Kabary] Like ajouté sur discours ID ${existing.id} par ${userId} (total: ${kabary.likesCount})`,
    );
    return kabary;
  }

  async unlike(idOrSlug: string, userId: string) {
    if (!userId) {
      throw new NotFoundException(`Utilisateur non authentifié`);
    }

    const existing = await this.prisma.kabary.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, likesCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Discours "${idOrSlug}" introuvable`);
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_kabaryId: {
          userId,
          kabaryId: existing.id,
        },
      },
    });

    if (!existingLike) {
      return existing;
    }

    const newCount = Math.max(0, existing.likesCount - 1);
    const [, kabary] = await this.prisma.$transaction([
      this.prisma.like.delete({
        where: { id: existingLike.id },
      }),
      this.prisma.kabary.update({
        where: { id: existing.id },
        data: { likesCount: newCount },
        select: { id: true, slug: true, likesCount: true },
      }),
    ]);

    await this.redis.del([
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.slug}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.KABARY_LIST_PATTERN);

    this.logger.log(
      `💔 [Kabary] Unlike sur discours ID ${existing.id} par ${userId} (total: ${kabary.likesCount})`,
    );
    return kabary;
  }

  async favorite(id: string, userId: string) {
    if (!userId) {
      throw new NotFoundException(`Utilisateur non authentifié`);
    }

    const existing = await this.prisma.kabary.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Discours "${id}" introuvable`);
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_kabaryId: {
          userId,
          kabaryId: id,
        },
      },
    });

    if (existingFavorite) {
      return { success: true };
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        kabaryId: id,
      },
    });

    this.logger.log(
      `⭐ [Kabary] Ajout aux favoris du discours ID ${id} par ${userId}`,
    );
    return { success: true };
  }

  async unfavorite(id: string, userId: string) {
    if (!userId) {
      throw new NotFoundException(`Utilisateur non authentifié`);
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_kabaryId: {
          userId,
          kabaryId: id,
        },
      },
    });

    if (existingFavorite) {
      await this.prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      this.logger.log(
        `🗑️ [Kabary] Retrait des favoris du discours ID ${id} par ${userId}`,
      );
    }

    return { success: true };
  }

  async incrementView(idOrSlug: string) {
    const existing = await this.prisma.kabary.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: { id: true, slug: true, viewCount: true },
    });

    if (!existing) {
      throw new NotFoundException(`Discours "${idOrSlug}" introuvable`);
    }

    const redisViews = await this.redis.incr(
      `kanto:views:kabary:${existing.id}`,
    );

    const kabary = await this.prisma.kabary.update({
      where: { id: existing.id },
      data: {
        viewCount: { increment: 1 },
      },
      select: { id: true, slug: true, viewCount: true, likesCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.id}`,
      `${CACHE_KEYS.KABARY_DETAIL_PREFIX}${existing.slug}`,
    ]);

    const finalViews =
      redisViews && redisViews > kabary.viewCount
        ? redisViews
        : kabary.viewCount;

    this.logger.log(
      `👁️ [Kabary] Vue incrémentée sur discours ID ${existing.id} (total: ${finalViews})`,
    );

    return {
      ...kabary,
      viewCount: finalViews,
    };
  }

  async report(id: string, dto: ReportContentDto, userId?: string) {
    const existing = await this.prisma.kabary.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Discours "${id}" introuvable`);
    }

    await this.prisma.contentReport.create({
      data: {
        reason: dto.reason,
        description: dto.description,
        kabaryId: id,
        userId,
      },
    });

    await this.prisma.kabary.update({
      where: { id },
      data: { reportCount: { increment: 1 } },
    });

    this.logger.log(`🚨 [Kabary] Signalement créé pour le discours ID ${id}`);
    return { success: true };
  }
}
