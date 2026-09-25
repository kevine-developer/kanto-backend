import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateMarketingBannerDto,
  UpdateMarketingBannerDto,
  ReorderMarketingBannersDto,
} from './dto/marketing-banner.dto.js';
import { DEFAULT_MARKETING_BANNERS } from './constants/default-marketing-banners.constant.js';

@Injectable()
export class MarketingBannersService implements OnModuleInit {
  private readonly logger = new Logger(MarketingBannersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultsIfEmpty();
  }

  /**
   * Initialise les bannières marketing par défaut si la table est vide
   */
  async seedDefaultsIfEmpty() {
    try {
      const count = await this.prisma.marketingBanner.count();
      if (count === 0) {
        this.logger.log(
          '🌱 Initialisation automatique des bannières marketing par défaut...',
        );
        for (const banner of DEFAULT_MARKETING_BANNERS) {
          await this.prisma.marketingBanner.create({
            data: {
              id: banner.id,
              badgeFr: banner.badgeFr,
              badgeMg: banner.badgeMg,
              titleFr: banner.titleFr,
              titleMg: banner.titleMg,
              descriptionFr: banner.descriptionFr,
              descriptionMg: banner.descriptionMg,
              ctaFr: banner.ctaFr,
              ctaMg: banner.ctaMg,
              imageUrl: banner.imageUrl,
              deepLink: banner.deepLink,
              accentColor: banner.accentColor,
              orderIndex: banner.orderIndex,
              isActive: true,
            },
          });
        }
        this.logger.log(
          '✅ Bannières marketing par défaut initialisées avec succès.',
        );
      }
    } catch (err: unknown) {
      this.logger.warn(
        `[MarketingBanners] Initialisation différée : ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  /**
   * Liste des bannières actives pour l'application mobile
   */
  async findAllActive() {
    return await this.prisma.marketingBanner.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Liste de toutes les bannières pour l'administration Kanto
   */
  async findAllAdmin() {
    return await this.prisma.marketingBanner.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Récupère une bannière par son identifiant
   */
  async findOne(id: string) {
    const banner = await this.prisma.marketingBanner.findUnique({
      where: { id },
    });
    if (!banner) {
      throw new NotFoundException(`Bannière marketing #${id} introuvable`);
    }
    return banner;
  }

  /**
   * Création d'une nouvelle bannière
   */
  async create(dto: CreateMarketingBannerDto) {
    let orderIndex = dto.orderIndex;
    if (orderIndex === undefined) {
      const highest = await this.prisma.marketingBanner.findFirst({
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      orderIndex = (highest?.orderIndex ?? -1) + 1;
    }

    return await this.prisma.marketingBanner.create({
      data: {
        badgeFr: dto.badgeFr,
        badgeMg: dto.badgeMg,
        titleFr: dto.titleFr,
        titleMg: dto.titleMg,
        descriptionFr: dto.descriptionFr,
        descriptionMg: dto.descriptionMg,
        ctaFr: dto.ctaFr || 'Découvrir',
        ctaMg: dto.ctaMg || 'Hizaha',
        imageUrl: dto.imageUrl,
        deepLink: dto.deepLink,
        accentColor: dto.accentColor || '#F59E0B',
        orderIndex,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Mise à jour d'une bannière
   */
  async update(id: string, dto: UpdateMarketingBannerDto) {
    await this.findOne(id);
    return await this.prisma.marketingBanner.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Bascule l'état actif/inactif
   */
  async toggleActive(id: string) {
    const banner = await this.findOne(id);
    return await this.prisma.marketingBanner.update({
      where: { id },
      data: { isActive: !banner.isActive },
    });
  }

  /**
   * Réordonne les bannières
   */
  async reorder(dto: ReorderMarketingBannersDto) {
    const updates = dto.items.map((item) =>
      this.prisma.marketingBanner.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true, count: updates.length };
  }

  /**
   * Suppression d'une bannière
   */
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.marketingBanner.delete({ where: { id } });
    return { success: true, message: `Bannière #${id} supprimée avec succès` };
  }
}
