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

export const FEATURE_MARKETING_BANNER_AI = 'feature:marketing_banner_ai';

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
   * Liste des bannières actives pour l'application mobile (Accueil ou Catégories)
   */
  async findAllActive(query?: { location?: string; category?: string }) {
    const where: any = { isActive: true };

    if (query?.location) {
      const loc = query.location.toUpperCase();
      if (loc === 'CATEGORY') {
        where.targetLocation = { in: ['CATEGORY', 'ALL'] };
        if (query.category) {
          where.OR = [
            { categoryKey: query.category.toLowerCase() },
            { categoryKey: 'ALL' },
            { categoryKey: 'all' },
            { categoryKey: null },
          ];
        }
      } else if (loc === 'HOME') {
        where.targetLocation = { in: ['HOME', 'ALL'] };
      } else {
        where.targetLocation = loc;
      }
    } else {
      // Par défaut pour l'accueil ou rétrocompatibilité
      where.targetLocation = { in: ['HOME', 'ALL'] };
    }

    return await this.prisma.marketingBanner.findMany({
      where,
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
        actionType: dto.actionType || 'DEEP_LINK',
        modalBodyFr: dto.modalBodyFr,
        modalBodyMg: dto.modalBodyMg,
        modalImageUrl: dto.modalImageUrl,
        modalCtaLabelFr: dto.modalCtaLabelFr,
        modalCtaLabelMg: dto.modalCtaLabelMg,
        modalCtaLink: dto.modalCtaLink,
        targetLocation: dto.targetLocation || 'HOME',
        categoryKey: dto.categoryKey ? dto.categoryKey.toLowerCase() : null,
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

  /**
   * Récupère le statut d'activation de la génération IA des bannières marketing.
   * Par défaut : DÉSACTIVÉ (false) si absent en base (conforme aux exigences métier).
   */
  async getAiGenerationStatus(): Promise<{
    enabled: boolean;
    description: string;
  }> {
    try {
      const lock = await this.prisma.moduleLock.findUnique({
        where: { key: FEATURE_MARKETING_BANNER_AI },
      });

      if (!lock) {
        return {
          enabled: false,
          description: 'Désactivé par défaut (non configuré en base).',
        };
      }

      const enabled = !lock.isLocked && lock.isVisible;
      return {
        enabled,
        description: enabled
          ? 'Génération automatique IA (Gemini) active toutes les 48 heures.'
          : lock.lockReason ||
            'Génération automatique IA désactivée par l’administrateur.',
      };
    } catch (err: unknown) {
      this.logger.warn(
        `[MarketingBanners] Erreur lecture statut IA : ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        enabled: false,
        description: 'Erreur de lecture — désactivé par sécurité.',
      };
    }
  }

  /**
   * Active ou désactive la génération IA des bannières marketing.
   */
  async updateAiGenerationStatus(enabled: boolean): Promise<{
    enabled: boolean;
    description: string;
  }> {
    const lock = await this.prisma.moduleLock.upsert({
      where: { key: FEATURE_MARKETING_BANNER_AI },
      create: {
        key: FEATURE_MARKETING_BANNER_AI,
        type: 'FEATURE',
        nameFr: 'Génération automatique de bannières IA',
        nameMg: 'Famoronana sora-baventy mandeha hoazy amin’ny alalan’ny AI',
        isLocked: !enabled,
        isVisible: enabled,
        lockReason: enabled ? null : 'Désactivé par l’administrateur',
        minTier: 'FREE',
      },
      update: {
        isLocked: !enabled,
        isVisible: enabled,
        lockReason: enabled ? null : 'Désactivé par l’administrateur',
      },
    });

    const isNowEnabled = !lock.isLocked && lock.isVisible;
    this.logger.log(
      `⚙️ [MarketingBanners] Statut génération IA mis à jour : ${isNowEnabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`,
    );

    return {
      enabled: isNowEnabled,
      description: isNowEnabled
        ? 'Génération automatique IA (Gemini) active toutes les 48 heures.'
        : 'Génération automatique IA désactivée par l’administrateur.',
    };
  }
}
