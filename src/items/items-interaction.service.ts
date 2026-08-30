import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';
import { ReportItemDto } from './dto/report-item.dto.js';

@Injectable()
export class ItemsInteractionService {
  private readonly logger = new Logger(ItemsInteractionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Ajoute un like sur un item.
   */
  async like(id: string) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
      select: { id: true, likesCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Items] Impossible de liker : élément "${id}" introuvable`,
      );
      throw new NotFoundException(`Élément "${id}" introuvable`);
    }

    const item = await this.prisma.malagasyItem.update({
      where: { id },
      data: {
        likesCount: { increment: 1 },
      },
      select: { id: true, likesCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${id}`,
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${item.id}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.ITEMS_LIST_PATTERN);

    this.logger.log(
      `❤️ [Items] Like ajouté sur ID ${id} (total: ${item.likesCount})`,
    );
    return item;
  }

  /**
   * Retire un like sur un item.
   */
  async unlike(id: string) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
      select: { id: true, likesCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Items] Impossible de retirer le like : élément "${id}" introuvable`,
      );
      throw new NotFoundException(`Élément "${id}" introuvable`);
    }

    const newCount = Math.max(0, existing.likesCount - 1);
    const item = await this.prisma.malagasyItem.update({
      where: { id },
      data: { likesCount: newCount },
      select: { id: true, likesCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${id}`,
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${item.id}`,
    ]);
    await this.redis.delByPattern(CACHE_KEYS.ITEMS_LIST_PATTERN);

    this.logger.log(
      `💔 [Items] Unlike sur ID ${id} (total: ${item.likesCount})`,
    );
    return item;
  }

  /**
   * Incrémente le compteur de vues d'un item (avec synchronisation atomique Redis).
   */
  async incrementView(id: string) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
      select: { id: true, slug: true, viewCount: true },
    });

    if (!existing) {
      this.logger.warn(
        `⚠️ [Items] Impossible d'incrémenter la vue : élément "${id}" introuvable`,
      );
      throw new NotFoundException(`Élément "${id}" introuvable`);
    }

    const redisViews = await this.redis.incr(`kanto:views:item:${id}`);

    const item = await this.prisma.malagasyItem.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
      select: { id: true, slug: true, viewCount: true },
    });

    await this.redis.del([
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${id}`,
      `${CACHE_KEYS.ITEMS_DETAIL_PREFIX}${existing.slug}`,
    ]);

    const finalViews =
      redisViews && redisViews > item.viewCount ? redisViews : item.viewCount;

    this.logger.log(
      `👁️ [Items] Vue incrémentée sur ID ${id} (total: ${finalViews})`,
    );

    return {
      id: item.id,
      viewCount: finalViews,
    };
  }

  /**
   * Enregistre un signalement pour un item.
   */
  async report(id: string, dto: ReportItemDto, userId?: string) {
    const existing = await this.prisma.malagasyItem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Élément "${id}" introuvable`);
    }

    await this.prisma.malagasyItem.update({
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

    const reason = (dto.reason && reportReasonMap[dto.reason]) || 'OTHER';

    const report = await this.prisma.contentReport.create({
      data: {
        itemId: id,
        userId: userId || null,
        reason,
        description: dto.description || null,
      },
    });

    this.logger.log(
      `🚩 [Items] Signalement reçu pour ID ${id} par utilisateur ${userId || 'anonyme'} (Raison: ${reason})`,
    );
    return { success: true, reportId: report.id };
  }
}
