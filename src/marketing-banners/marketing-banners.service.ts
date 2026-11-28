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
import type { BannerLanguageMode } from '../integrations/gemini/gemini-content.service.js';

export const FEATURE_MARKETING_BANNER_AI = 'feature:marketing_banner_ai';
export const FEATURE_MARKETING_BANNER_AI_LANG =
  'feature:marketing_banner_ai_language';

const VALID_LANGUAGE_MODES: BannerLanguageMode[] = [
  'MG_ONLY',
  'BILINGUAL',
  'FR_ONLY',
];

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

    const { languageMode, ...rest } = dto;
    const localized = this.applyManualLanguageMode(rest, languageMode);

    return await this.prisma.marketingBanner.create({
      data: {
        badgeFr: localized.badgeFr ?? rest.badgeFr,
        badgeMg: localized.badgeMg ?? rest.badgeMg,
        titleFr: localized.titleFr ?? rest.titleFr,
        titleMg: localized.titleMg ?? rest.titleMg,
        descriptionFr: localized.descriptionFr ?? rest.descriptionFr,
        descriptionMg: localized.descriptionMg ?? rest.descriptionMg,
        ctaFr: localized.ctaFr || 'Découvrir',
        ctaMg: localized.ctaMg || 'Hizaha',
        imageUrl: rest.imageUrl,
        deepLink: rest.deepLink,
        accentColor: rest.accentColor || '#F59E0B',
        orderIndex,
        isActive: rest.isActive ?? true,
        actionType: rest.actionType || 'DEEP_LINK',
        modalBodyFr: localized.modalBodyFr,
        modalBodyMg: localized.modalBodyMg,
        modalImageUrl: rest.modalImageUrl,
        modalCtaLabelFr: localized.modalCtaLabelFr,
        modalCtaLabelMg: localized.modalCtaLabelMg,
        modalCtaLink: rest.modalCtaLink,
        targetLocation: rest.targetLocation || 'HOME',
        categoryKey: rest.categoryKey ? rest.categoryKey.toLowerCase() : null,
      },
    });
  }

  /**
   * Mise à jour d'une bannière
   */
  async update(id: string, dto: UpdateMarketingBannerDto) {
    const existing = await this.findOne(id);
    const { languageMode, ...rest } = dto;
    const localized = this.applyManualLanguageMode(
      rest,
      languageMode,
      existing,
    );

    return await this.prisma.marketingBanner.update({
      where: { id },
      data: localized,
    });
  }

  /**
   * Aligne les champs FR/MG lorsqu'un mode monolingue (MG_ONLY ou FR_ONLY) est choisi
   * pour une création ou une modification manuelle, afin que l'application mobile
   * affiche exclusivement la langue sélectionnée sans modifier le schéma Prisma.
   */
  private applyManualLanguageMode<
    T extends {
      badgeFr?: string;
      badgeMg?: string;
      titleFr?: string;
      titleMg?: string;
      descriptionFr?: string;
      descriptionMg?: string;
      ctaFr?: string;
      ctaMg?: string;
      modalBodyFr?: string;
      modalBodyMg?: string;
      modalCtaLabelFr?: string;
      modalCtaLabelMg?: string;
    },
  >(
    data: T,
    languageMode?: BannerLanguageMode,
    fallback?: {
      badgeFr: string;
      badgeMg: string;
      titleFr: string;
      titleMg: string;
      descriptionFr: string;
      descriptionMg: string;
      ctaFr: string;
      ctaMg: string;
      modalBodyFr?: string | null;
      modalBodyMg?: string | null;
      modalCtaLabelFr?: string | null;
      modalCtaLabelMg?: string | null;
    },
  ): T {
    if (!languageMode || languageMode === 'BILINGUAL') {
      return data;
    }

    if (languageMode === 'MG_ONLY') {
      const badgeMg =
        data.badgeMg ??
        data.badgeFr ??
        fallback?.badgeMg ??
        fallback?.badgeFr ??
        'TOLOTRA MANOKANA';
      const titleMg =
        data.titleMg ?? data.titleFr ?? fallback?.titleMg ?? fallback?.titleFr;
      const descriptionMg =
        data.descriptionMg ??
        data.descriptionFr ??
        fallback?.descriptionMg ??
        fallback?.descriptionFr;
      const ctaMg =
        data.ctaMg ??
        data.ctaFr ??
        fallback?.ctaMg ??
        fallback?.ctaFr ??
        'Hizaha';
      const modalBodyMg =
        data.modalBodyMg !== undefined
          ? data.modalBodyMg
          : data.modalBodyFr !== undefined
            ? data.modalBodyFr
            : (fallback?.modalBodyMg ?? undefined);
      const modalCtaLabelMg =
        data.modalCtaLabelMg !== undefined
          ? data.modalCtaLabelMg
          : data.modalCtaLabelFr !== undefined
            ? data.modalCtaLabelFr
            : (fallback?.modalCtaLabelMg ?? undefined);

      return {
        ...data,
        badgeFr: badgeMg,
        badgeMg,
        titleFr: titleMg,
        titleMg,
        descriptionFr: descriptionMg,
        descriptionMg,
        ctaFr: ctaMg,
        ctaMg,
        ...(modalBodyMg !== undefined
          ? { modalBodyFr: modalBodyMg, modalBodyMg }
          : {}),
        ...(modalCtaLabelMg !== undefined
          ? { modalCtaLabelFr: modalCtaLabelMg, modalCtaLabelMg }
          : {}),
      };
    }

    // FR_ONLY
    const badgeFr =
      data.badgeFr ??
      data.badgeMg ??
      fallback?.badgeFr ??
      fallback?.badgeMg ??
      'OFFRE SPÉCIALE';
    const titleFr =
      data.titleFr ?? data.titleMg ?? fallback?.titleFr ?? fallback?.titleMg;
    const descriptionFr =
      data.descriptionFr ??
      data.descriptionMg ??
      fallback?.descriptionFr ??
      fallback?.descriptionMg;
    const ctaFr =
      data.ctaFr ??
      data.ctaMg ??
      fallback?.ctaFr ??
      fallback?.ctaMg ??
      'Découvrir';
    const modalBodyFr =
      data.modalBodyFr !== undefined
        ? data.modalBodyFr
        : data.modalBodyMg !== undefined
          ? data.modalBodyMg
          : (fallback?.modalBodyFr ?? undefined);
    const modalCtaLabelFr =
      data.modalCtaLabelFr !== undefined
        ? data.modalCtaLabelFr
        : data.modalCtaLabelMg !== undefined
          ? data.modalCtaLabelMg
          : (fallback?.modalCtaLabelFr ?? undefined);

    return {
      ...data,
      badgeFr,
      badgeMg: badgeFr,
      titleFr,
      titleMg: titleFr,
      descriptionFr,
      descriptionMg: descriptionFr,
      ctaFr,
      ctaMg: ctaFr,
      ...(modalBodyFr !== undefined
        ? { modalBodyFr, modalBodyMg: modalBodyFr }
        : {}),
      ...(modalCtaLabelFr !== undefined
        ? { modalCtaLabelFr, modalCtaLabelMg: modalCtaLabelFr }
        : {}),
    };
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

  async getAiLanguageMode(): Promise<BannerLanguageMode> {
    try {
      const langLock = await this.prisma.moduleLock.findUnique({
        where: { key: FEATURE_MARKETING_BANNER_AI_LANG },
      });
      const candidate = langLock?.lockReason as BannerLanguageMode | undefined;
      if (candidate && VALID_LANGUAGE_MODES.includes(candidate)) {
        return candidate;
      }
      return 'BILINGUAL';
    } catch {
      return 'BILINGUAL';
    }
  }

  /**
   * Récupère le statut d'activation et le mode de langue de la génération IA des bannières marketing.
   * Par défaut : DÉSACTIVÉ (false) et BILINGUAL si absent en base (conforme aux exigences métier).
   */
  async getAiGenerationStatus(): Promise<{
    enabled: boolean;
    description: string;
    languageMode: BannerLanguageMode;
  }> {
    const languageMode = await this.getAiLanguageMode();
    try {
      const lock = await this.prisma.moduleLock.findUnique({
        where: { key: FEATURE_MARKETING_BANNER_AI },
      });

      if (!lock) {
        return {
          enabled: false,
          description: 'Désactivé par défaut (non configuré en base).',
          languageMode,
        };
      }

      const enabled = !lock.isLocked && lock.isVisible;
      return {
        enabled,
        description: enabled
          ? 'Génération automatique IA (Gemini) active toutes les 48 heures.'
          : lock.lockReason ||
            'Génération automatique IA désactivée par l’administrateur.',
        languageMode,
      };
    } catch (err: unknown) {
      this.logger.warn(
        `[MarketingBanners] Erreur lecture statut IA : ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        enabled: false,
        description: 'Erreur de lecture — désactivé par sécurité.',
        languageMode,
      };
    }
  }

  /**
   * Active, désactive ou met à jour le mode de langue de la génération IA des bannières marketing.
   */
  async updateAiGenerationStatus(
    enabled?: boolean,
    languageMode?: BannerLanguageMode,
  ): Promise<{
    enabled: boolean;
    description: string;
    languageMode: BannerLanguageMode;
  }> {
    if (languageMode && VALID_LANGUAGE_MODES.includes(languageMode)) {
      await this.prisma.moduleLock.upsert({
        where: { key: FEATURE_MARKETING_BANNER_AI_LANG },
        create: {
          key: FEATURE_MARKETING_BANNER_AI_LANG,
          type: 'FEATURE',
          nameFr: 'Langue des bannières IA',
          nameMg: 'Fitenin’ny sora-baventy AI',
          isLocked: true,
          isVisible: false,
          lockReason: languageMode,
          minTier: 'FREE',
        },
        update: {
          lockReason: languageMode,
        },
      });
      this.logger.log(
        `⚙️ [MarketingBanners] Mode de langue IA mis à jour : ${languageMode}`,
      );
    }

    if (typeof enabled === 'boolean') {
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
    }

    return this.getAiGenerationStatus();
  }
}
