import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindCitationsQueryDto } from './dto/find-citations.dto.js';
import { CreateCitationDto } from './dto/create-citation.dto.js';
import { UpdateCitationDto } from './dto/update-citation.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

@Injectable()
export class CitationsService {
  private readonly logger = new Logger(CitationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.CITATIONS_LIST_PATTERN);
    await this.redis.delByPattern(CACHE_KEYS.DAILY_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.CITATIONS_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreateCitationDto) {
    let authorId: string | null = null;
    if (data.authorName && data.authorName.trim()) {
      const authorName = data.authorName.trim();
      let author = await this.prisma.author.findUnique({
        where: { name: authorName },
      });
      if (!author) {
        author = await this.prisma.author.create({
          data: { name: authorName },
        });
      }
      authorId = author.id;
    }

    const citation = await this.prisma.citation.create({
      data: {
        citationMg: data.citationMg,
        citationFr: data.citationFr,
        sourceName: data.sourceName,
        contexte: data.contexte || null,
        authorId,
        status: 'PUBLISHED',
      },
      include: {
        author: true,
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(citation.id);
    this.logger.log(`✨ [Citations] Citation créée (ID: ${citation.id})`);
    return citation;
  }

  async update(id: string, data: UpdateCitationDto) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Citation avec l'identifiant "${id}" introuvable`,
      );
    }

    let authorId: string | undefined = undefined;
    if (data.authorName !== undefined) {
      if (data.authorName.trim()) {
        const authorName = data.authorName.trim();
        let author = await this.prisma.author.findUnique({
          where: { name: authorName },
        });
        if (!author) {
          author = await this.prisma.author.create({
            data: { name: authorName },
          });
        }
        authorId = author.id;
      }
    }

    const citation = await this.prisma.citation.update({
      where: { id },
      data: {
        citationMg: data.citationMg !== undefined ? data.citationMg : undefined,
        citationFr: data.citationFr !== undefined ? data.citationFr : undefined,
        sourceName: data.sourceName !== undefined ? data.sourceName : undefined,
        contexte: data.contexte !== undefined ? data.contexte : undefined,
        authorId: authorId !== undefined ? authorId : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
      include: {
        author: true,
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    await this.invalidateCache(citation.id);
    this.logger.log(`✏️ [Citations] Citation mise à jour (ID: ${citation.id})`);
    return citation;
  }

  async remove(id: string) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `Citation avec l'identifiant "${id}" introuvable`,
      );
    }

    await this.prisma.citation.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [Citations] Citation supprimée (ID: ${id})`);
    return { success: true, id };
  }

  async findAll(query: FindCitationsQueryDto = {}) {
    const { page, limit, skip } = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    const cacheKey = `${CACHE_KEYS.CITATIONS_LIST_PREFIX}${JSON.stringify(query)}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findAll citations`);
      return cached;
    }

    const where: Prisma.CitationWhereInput = {
      status: 'PUBLISHED',
    };

    if (query.authorId) {
      where.authorId = query.authorId;
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
        { citationMg: { contains: searchTerm, mode: 'insensitive' } },
        { citationFr: { contains: searchTerm, mode: 'insensitive' } },
        { sourceName: { contains: searchTerm, mode: 'insensitive' } },
        { contexte: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [citations, total] = await Promise.all([
      this.prisma.citation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          themes: {
            include: {
              theme: true,
            },
          },
        },
      }),
      this.prisma.citation.count({ where }),
    ]);

    const result = formatPaginatedResponse(citations, total, page, limit);

    await this.redis.set(cacheKey, result, 300); // 5 minutes
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.CITATIONS_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) {
      this.logger.debug(`⚡ [Redis] Cache hit pour findOne citation "${id}"`);
      return cached;
    }

    const citation = await this.prisma.citation.findUnique({
      where: { id },
      include: {
        author: true,
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    if (!citation) {
      this.logger.warn(`⚠️ [Citations] Citation "${id}" non trouvée`);
      throw new NotFoundException(
        `Citation avec l'identifiant "${id}" non trouvée`,
      );
    }

    this.logger.log(
      `💬 [Citations] Consultation citation de ${citation.sourceName} (ID: ${citation.id})`,
    );

    await this.redis.set(cacheKey, citation, 600); // 10 minutes
    return citation;
  }

  async like(id: string) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
      select: { id: true, likesCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Citations] Impossible de liker : citation "${id}" non trouvée`,
      );
      throw new NotFoundException(`Citation "${id}" non trouvée`);
    }

    const citation = await this.prisma.citation.update({
      where: { id },
      data: {
        likesCount: { increment: 1 },
      },
      select: { id: true, likesCount: true },
    });

    await this.redis.del(`${CACHE_KEYS.CITATIONS_DETAIL_PREFIX}${id}`);
    await this.redis.delByPattern(CACHE_KEYS.CITATIONS_LIST_PATTERN);

    this.logger.log(
      `❤️ [Citations] Like ajouté sur ID ${id} (total: ${citation.likesCount})`,
    );
    return citation;
  }

  async unlike(id: string) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
      select: { id: true, likesCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Citations] Impossible de retirer le like : citation "${id}" non trouvée`,
      );
      throw new NotFoundException(`Citation "${id}" non trouvée`);
    }

    const newCount = Math.max(0, existing.likesCount - 1);
    const citation = await this.prisma.citation.update({
      where: { id },
      data: { likesCount: newCount },
      select: { id: true, likesCount: true },
    });

    await this.redis.del(`${CACHE_KEYS.CITATIONS_DETAIL_PREFIX}${id}`);
    await this.redis.delByPattern(CACHE_KEYS.CITATIONS_LIST_PATTERN);

    this.logger.log(
      `💔 [Citations] Unlike sur ID ${id} (total: ${citation.likesCount})`,
    );
    return citation;
  }

  async incrementView(id: string) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
      select: { id: true, viewCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Citations] Impossible d'incrémenter la vue : citation "${id}" non trouvée`,
      );
      throw new NotFoundException(`Citation "${id}" non trouvée`);
    }

    const redisViews = await this.redis.incr(`kanto:views:citation:${id}`);

    const citation = await this.prisma.citation.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
      select: { id: true, viewCount: true },
    });

    await this.redis.del(`${CACHE_KEYS.CITATIONS_DETAIL_PREFIX}${id}`);

    const finalViews =
      redisViews && redisViews > citation.viewCount
        ? redisViews
        : citation.viewCount;

    this.logger.log(
      `👁️ [Citations] Vue incrémentée sur ID ${id} (total: ${finalViews})`,
    );

    return {
      ...citation,
      viewCount: finalViews,
    };
  }

  async report(
    id: string,
    data: { reason?: string; description?: string },
    userId?: string,
  ) {
    const existing = await this.prisma.citation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Citation "${id}" non trouvée`);
    }

    await this.prisma.citation.update({
      where: { id },
      data: {
        reportCount: { increment: 1 },
      },
    });

    const reportReasonMap: Record<
      string,
      | 'TRANSLATION_ERROR'
      | 'TYPO'
      | 'INCORRECT_MEANING'
      | 'INAPPROPRIATE'
      | 'OTHER'
    > = {
      translation: 'TRANSLATION_ERROR',
      spelling: 'TYPO',
      meaning: 'INCORRECT_MEANING',
      inappropriate: 'INAPPROPRIATE',
      other: 'OTHER',
    };

    const reason = (data.reason && reportReasonMap[data.reason]) || 'OTHER';

    const report = await this.prisma.contentReport.create({
      data: {
        citationId: id,
        userId: userId || null,
        reason,
        description: data.description || null,
      },
    });

    this.logger.log(
      `🚩 [Citations] Signalement reçu pour ID ${id} par utilisateur ${userId || 'anonyme'} (Raison: ${reason})`,
    );
    return { success: true, reportId: report.id };
  }
}
