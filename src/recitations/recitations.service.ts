import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindRecitationsQueryDto } from './dto/find-recitations.dto.js';
import { CreateRecitationDto } from './dto/create-recitation.dto.js';
import { UpdateRecitationDto } from './dto/update-recitation.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class RecitationsService {
  private readonly logger = new Logger(RecitationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.RECITATIONS_LIST_PATTERN);
    if (id)
      await this.redis.del(`${CACHE_KEYS.RECITATIONS_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreateRecitationDto) {
    const baseSlug = slugify(data.title);
    const count = await this.prisma.recitation.count();
    const slug = `${baseSlug}-${count + 1}`;

    const recitation = await this.prisma.recitation.create({
      data: {
        slug,
        title: data.title,
        titleFr: data.titleFr,
        author: data.author || null,
        description: data.description || null,
        durationMinutes: data.durationMinutes || null,
        contentLines: data.contentLines,
        references: data.references || [],
        tags: data.tags || [],
        isFeatured: data.isFeatured ?? false,
        status: 'PUBLISHED',
      },
    });

    await this.invalidateCache(recitation.id);
    this.logger.log(`✨ [Recitations] Récitation créée (ID: ${recitation.id})`);
    return recitation;
  }

  async update(id: string, data: UpdateRecitationDto) {
    const existing = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Récitation avec l'identifiant "${id}" introuvable`,
      );
    }

    const recitation = await this.prisma.recitation.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        titleFr: data.titleFr !== undefined ? data.titleFr : undefined,
        author: data.author !== undefined ? data.author : undefined,
        description:
          data.description !== undefined ? data.description : undefined,
        durationMinutes:
          data.durationMinutes !== undefined ? data.durationMinutes : undefined,
        contentLines:
          data.contentLines !== undefined ? data.contentLines : undefined,
        references: data.references !== undefined ? data.references : undefined,
        tags: data.tags !== undefined ? data.tags : undefined,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : undefined,
        isPremium: data.isPremium !== undefined ? data.isPremium : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });

    await this.invalidateCache(recitation.id);
    this.logger.log(
      `✏️ [Recitations] Récitation mise à jour (ID: ${recitation.id})`,
    );
    return recitation;
  }

  async remove(id: string) {
    const existing = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Récitation avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.prisma.recitation.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [Recitations] Récitation supprimée (ID: ${id})`);
    return { success: true, message: 'Récitation supprimée avec succès' };
  }

  async findAll(query: FindRecitationsQueryDto) {
    const { page = 1, limit = 20, search, author, tag } = query;
    const {
      skip,
      limit: takeLimit,
      page: currentPage,
    } = calculatePagination({ page, limit });

    const cacheKey = `${CACHE_KEYS.RECITATIONS_LIST_PREFIX}${currentPage}:${takeLimit}:${search || ''}:${author || ''}:${tag || ''}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.RecitationWhereInput = {
      status: 'PUBLISHED',
      ...(author ? { author: { contains: author, mode: 'insensitive' } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { titleFr: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.recitation.count({ where }),
      this.prisma.recitation.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    const result = formatPaginatedResponse(
      items,
      total,
      currentPage,
      takeLimit,
    );
    await this.redis.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.RECITATIONS_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const recitation = await this.prisma.recitation.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!recitation) {
      throw new NotFoundException(
        `Récitation avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.redis.set(cacheKey, recitation, 600); // 10 min TTL
    return recitation;
  }

  async like(id: string, userId: string) {
    const recitation = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!recitation)
      throw new NotFoundException(`Récitation "${id}" introuvable`);

    const existing = await this.prisma.like.findUnique({
      where: { userId_recitationId: { userId, recitationId: id } },
    });

    if (existing) {
      return { liked: true, likesCount: recitation.likesCount };
    }

    await this.prisma.$transaction([
      this.prisma.like.create({ data: { userId, recitationId: id } }),
      this.prisma.recitation.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    await this.invalidateCache(id);
    return { liked: true, likesCount: recitation.likesCount + 1 };
  }

  async unlike(id: string, userId: string) {
    const recitation = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!recitation)
      throw new NotFoundException(`Récitation "${id}" introuvable`);

    const existing = await this.prisma.like.findUnique({
      where: { userId_recitationId: { userId, recitationId: id } },
    });

    if (!existing) {
      return { liked: false, likesCount: recitation.likesCount };
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: { userId_recitationId: { userId, recitationId: id } },
      }),
      this.prisma.recitation.update({
        where: { id },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    await this.invalidateCache(id);
    return { liked: false, likesCount: Math.max(0, recitation.likesCount - 1) };
  }

  async favorite(id: string, userId: string) {
    const recitation = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!recitation)
      throw new NotFoundException(`Récitation "${id}" introuvable`);

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_recitationId: { userId, recitationId: id } },
    });

    if (existing) return { favorited: true };

    await this.prisma.favorite.create({
      data: { userId, recitationId: id },
    });

    return { favorited: true };
  }

  async unfavorite(id: string, userId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_recitationId: { userId, recitationId: id } },
    });

    if (!existing) return { favorited: false };

    await this.prisma.favorite.delete({
      where: { userId_recitationId: { userId, recitationId: id } },
    });

    return { favorited: false };
  }

  async incrementView(id: string) {
    await this.prisma.recitation
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => null);

    return { success: true };
  }

  async report(id: string, data: ReportContentDto, userId?: string) {
    const recitation = await this.prisma.recitation.findUnique({
      where: { id },
    });
    if (!recitation)
      throw new NotFoundException(`Récitation "${id}" introuvable`);

    await this.prisma.$transaction([
      this.prisma.contentReport.create({
        data: {
          recitationId: id,
          reason: data.reason,
          description: data.description || null,
          userId: userId || null,
        },
      }),
      this.prisma.recitation.update({
        where: { id },
        data: { reportCount: { increment: 1 } },
      }),
    ]);

    this.logger.warn(
      `⚠️ [Recitations] Signalement pour la récitation ${id} (${data.reason})`,
    );
    return { success: true, message: 'Signalement enregistré avec succès' };
  }
}
