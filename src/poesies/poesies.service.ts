import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindPoesiesQueryDto } from './dto/find-poesies.dto.js';
import { CreatePoesieDto } from './dto/create-poesie.dto.js';
import { UpdatePoesieDto } from './dto/update-poesie.dto.js';
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
export class PoesiesService {
  private readonly logger = new Logger(PoesiesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.POESIES_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.POESIES_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreatePoesieDto) {
    const baseSlug = slugify(data.title);
    const count = await this.prisma.poesie.count();
    const slug = `${baseSlug}-${count + 1}`;

    const poesie = await this.prisma.poesie.create({
      data: {
        slug,
        title: data.title,
        titleFr: data.titleFr,
        author: data.author || null,
        period: data.period || null,
        category: data.category || 'tononkalo',
        explanationMg: data.explanationMg || null,
        explanationFr: data.explanationFr || null,
        isFeatured: data.isFeatured ?? false,
        status: 'PUBLISHED',
        stanzas: {
          create: data.stanzas.map((s, idx) => ({
            stanzaNumber: idx + 1,
            versesMg: s.versesMg,
            versesFr: s.versesFr,
          })),
        },
      },
      include: {
        stanzas: {
          orderBy: { stanzaNumber: 'asc' },
        },
      },
    });

    await this.invalidateCache(poesie.id);
    this.logger.log(`✨ [Poesies] Poésie créée (ID: ${poesie.id})`);
    return poesie;
  }

  async update(id: string, data: UpdatePoesieDto) {
    const existing = await this.prisma.poesie.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Poésie avec l'identifiant "${id}" introuvable`);
    }

    // Si de nouvelles strophes sont envoyées, on remplace
    if (data.stanzas) {
      await this.prisma.poesieStanza.deleteMany({
        where: { poesieId: id },
      });
      await this.prisma.poesieStanza.createMany({
        data: data.stanzas.map((s, idx) => ({
          poesieId: id,
          stanzaNumber: idx + 1,
          versesMg: s.versesMg,
          versesFr: s.versesFr,
        })),
      });
    }

    const poesie = await this.prisma.poesie.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        titleFr: data.titleFr !== undefined ? data.titleFr : undefined,
        author: data.author !== undefined ? data.author : undefined,
        period: data.period !== undefined ? data.period : undefined,
        category: data.category !== undefined ? data.category : undefined,
        explanationMg: data.explanationMg !== undefined ? data.explanationMg : undefined,
        explanationFr: data.explanationFr !== undefined ? data.explanationFr : undefined,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : undefined,
        isPremium: data.isPremium !== undefined ? data.isPremium : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
      include: {
        stanzas: {
          orderBy: { stanzaNumber: 'asc' },
        },
      },
    });

    await this.invalidateCache(poesie.id);
    this.logger.log(`✏️ [Poesies] Poésie mise à jour (ID: ${poesie.id})`);
    return poesie;
  }

  async remove(id: string) {
    const existing = await this.prisma.poesie.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Poésie avec l'identifiant "${id}" introuvable`);
    }

    await this.prisma.poesie.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [Poesies] Poésie supprimée (ID: ${id})`);
    return { success: true, message: 'Poésie supprimée avec succès' };
  }

  async findAll(query: FindPoesiesQueryDto) {
    const { page = 1, limit = 20, search, category, author } = query;
    const { skip, limit: takeLimit, page: currentPage } = calculatePagination({ page, limit });

    const cacheKey = `${CACHE_KEYS.POESIES_LIST_PREFIX}${currentPage}:${takeLimit}:${search || ''}:${category || ''}:${author || ''}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.PoesieWhereInput = {
      status: 'PUBLISHED',
      ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
      ...(author ? { author: { contains: author, mode: 'insensitive' } } : {}),
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
      this.prisma.poesie.count({ where }),
      this.prisma.poesie.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          stanzas: {
            orderBy: { stanzaNumber: 'asc' },
          },
        },
      }),
    ]);

    const result = formatPaginatedResponse(items, total, currentPage, takeLimit);
    await this.redis.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.POESIES_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const poesie = await this.prisma.poesie.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        stanzas: {
          orderBy: { stanzaNumber: 'asc' },
        },
      },
    });

    if (!poesie) {
      throw new NotFoundException(`Poésie avec l'identifiant "${id}" introuvable`);
    }

    await this.redis.set(cacheKey, poesie, 600); // 10 min TTL
    return poesie;
  }

  async like(id: string, userId: string) {
    const poesie = await this.prisma.poesie.findUnique({ where: { id } });
    if (!poesie) throw new NotFoundException(`Poésie "${id}" introuvable`);

    const existing = await this.prisma.like.findUnique({
      where: { userId_poesieId: { userId, poesieId: id } },
    });

    if (existing) {
      return { liked: true, likesCount: poesie.likesCount };
    }

    await this.prisma.$transaction([
      this.prisma.like.create({ data: { userId, poesieId: id } }),
      this.prisma.poesie.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    await this.invalidateCache(id);
    return { liked: true, likesCount: poesie.likesCount + 1 };
  }

  async unlike(id: string, userId: string) {
    const poesie = await this.prisma.poesie.findUnique({ where: { id } });
    if (!poesie) throw new NotFoundException(`Poésie "${id}" introuvable`);

    const existing = await this.prisma.like.findUnique({
      where: { userId_poesieId: { userId, poesieId: id } },
    });

    if (!existing) {
      return { liked: false, likesCount: poesie.likesCount };
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: { userId_poesieId: { userId, poesieId: id } },
      }),
      this.prisma.poesie.update({
        where: { id },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    await this.invalidateCache(id);
    return { liked: false, likesCount: Math.max(0, poesie.likesCount - 1) };
  }

  async favorite(id: string, userId: string) {
    const poesie = await this.prisma.poesie.findUnique({ where: { id } });
    if (!poesie) throw new NotFoundException(`Poésie "${id}" introuvable`);

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_poesieId: { userId, poesieId: id } },
    });

    if (existing) return { favorited: true };

    await this.prisma.favorite.create({
      data: { userId, poesieId: id },
    });

    return { favorited: true };
  }

  async unfavorite(id: string, userId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_poesieId: { userId, poesieId: id } },
    });

    if (!existing) return { favorited: false };

    await this.prisma.favorite.delete({
      where: { userId_poesieId: { userId, poesieId: id } },
    });

    return { favorited: false };
  }

  async incrementView(id: string) {
    await this.prisma.poesie.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => null);

    return { success: true };
  }

  async report(id: string, data: ReportContentDto, userId?: string) {
    const poesie = await this.prisma.poesie.findUnique({ where: { id } });
    if (!poesie) throw new NotFoundException(`Poésie "${id}" introuvable`);

    await this.prisma.$transaction([
      this.prisma.contentReport.create({
        data: {
          poesieId: id,
          reason: data.reason,
          description: data.description || null,
          userId: userId || null,
        },
      }),
      this.prisma.poesie.update({
        where: { id },
        data: { reportCount: { increment: 1 } },
      }),
    ]);

    this.logger.warn(`⚠️ [Poesies] Signalement pour la poésie ${id} (${data.reason})`);
    return { success: true, message: 'Signalement enregistré avec succès' };
  }
}
