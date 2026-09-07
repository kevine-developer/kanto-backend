import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindCivicQueryDto } from './dto/find-civic.dto.js';
import { CreateCivicDto } from './dto/create-civic.dto.js';
import { UpdateCivicDto } from './dto/update-civic.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

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
export class CivicService {
  private readonly logger = new Logger(CivicService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.CIVIC_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.CIVIC_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreateCivicDto) {
    const baseSlug = slugify(data.titleFr || data.titleMg);
    const count = await this.prisma.civicContent.count();
    const slug = `${data.subCategory.toLowerCase()}-${baseSlug}-${count + 1}`;

    const civic = await this.prisma.civicContent.create({
      data: {
        slug,
        subCategory: data.subCategory,
        titleFr: data.titleFr,
        titleMg: data.titleMg,
        summaryFr: data.summaryFr || null,
        summaryMg: data.summaryMg || null,
        contentFr: data.contentFr,
        contentMg: data.contentMg,
        themes: data.themes || [],
        sources: data.sources || [],
        status: 'PUBLISHED',
        structureRoles: data.structureRoles
          ? {
              create: data.structureRoles.map((r, idx) => ({
                orderIndex: idx + 1,
                titleFr: r.titleFr,
                titleMg: r.titleMg,
                roleFr: r.roleFr,
                roleMg: r.roleMg,
              })),
            }
          : undefined,
      },
      include: {
        structureRoles: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    await this.invalidateCache(civic.id);
    this.logger.log(`✨ [Civic] Contenu civique créé (ID: ${civic.id})`);
    return civic;
  }

  async update(id: string, data: UpdateCivicDto) {
    const existing = await this.prisma.civicContent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Contenu civique avec l'identifiant "${id}" introuvable`);
    }

    if (data.structureRoles) {
      await this.prisma.civicStructureRole.deleteMany({
        where: { civicContentId: id },
      });
      await this.prisma.civicStructureRole.createMany({
        data: data.structureRoles.map((r, idx) => ({
          civicContentId: id,
          orderIndex: idx + 1,
          titleFr: r.titleFr,
          titleMg: r.titleMg,
          roleFr: r.roleFr,
          roleMg: r.roleMg,
        })),
      });
    }

    const civic = await this.prisma.civicContent.update({
      where: { id },
      data: {
        subCategory: data.subCategory !== undefined ? data.subCategory : undefined,
        titleFr: data.titleFr !== undefined ? data.titleFr : undefined,
        titleMg: data.titleMg !== undefined ? data.titleMg : undefined,
        summaryFr: data.summaryFr !== undefined ? data.summaryFr : undefined,
        summaryMg: data.summaryMg !== undefined ? data.summaryMg : undefined,
        contentFr: data.contentFr !== undefined ? data.contentFr : undefined,
        contentMg: data.contentMg !== undefined ? data.contentMg : undefined,
        themes: data.themes !== undefined ? data.themes : undefined,
        sources: data.sources !== undefined ? data.sources : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
      include: {
        structureRoles: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    await this.invalidateCache(civic.id);
    this.logger.log(`✏️ [Civic] Contenu civique mis à jour (ID: ${civic.id})`);
    return civic;
  }

  async remove(id: string) {
    const existing = await this.prisma.civicContent.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Contenu civique avec l'identifiant "${id}" introuvable`);
    }

    await this.prisma.civicContent.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [Civic] Contenu civique supprimé (ID: ${id})`);
    return { success: true, message: 'Contenu civique supprimé avec succès' };
  }

  async findAll(query: FindCivicQueryDto) {
    const { page = 1, limit = 20, subCategory, search, theme } = query;
    const { skip, limit: takeLimit, page: currentPage } = calculatePagination({ page, limit });

    const cacheKey = `${CACHE_KEYS.CIVIC_LIST_PREFIX}${currentPage}:${takeLimit}:${subCategory || ''}:${search || ''}:${theme || ''}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.CivicContentWhereInput = {
      status: 'PUBLISHED',
      ...(subCategory ? { subCategory } : {}),
      ...(theme ? { themes: { has: theme } } : {}),
      ...(search
        ? {
            OR: [
              { titleFr: { contains: search, mode: 'insensitive' } },
              { titleMg: { contains: search, mode: 'insensitive' } },
              { summaryFr: { contains: search, mode: 'insensitive' } },
              { summaryMg: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.civicContent.count({ where }),
      this.prisma.civicContent.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: { createdAt: 'asc' },
        include: {
          structureRoles: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      }),
    ]);

    const result = formatPaginatedResponse(items, total, currentPage, takeLimit);
    await this.redis.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.CIVIC_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const civic = await this.prisma.civicContent.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        structureRoles: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!civic) {
      throw new NotFoundException(`Contenu civique avec l'identifiant "${id}" introuvable`);
    }

    await this.redis.set(cacheKey, civic, 600); // 10 min TTL
    return civic;
  }

  async incrementView(id: string) {
    await this.prisma.civicContent.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => null);

    return { success: true };
  }
}
