import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  GeminiContentService,
  GeneratedBannerContent,
  type BannerLanguageMode,
} from '../integrations/gemini/gemini-content.service.js';
import {
  FEATURE_MARKETING_BANNER_AI,
  FEATURE_MARKETING_BANNER_AI_LANG,
} from './marketing-banners.service.js';

/**
 * Service responsable de la génération automatique de bannières marketing
 * toutes les 48 heures via Gemini AI avec repli culturel résilient.
 *
 * Comportement :
 * - Toutes les 48h, un nouveau thème aléatoire est sélectionné parmi les 10 thèmes culturels.
 * - Gemini génère un contenu bilingue (FR + MG) structuré en JSON.
 * - En cas d'indisponibilité de Gemini (panne réseau, fetch failed, quota),
 *   un catalogue de repli culturel authentique prend automatiquement le relais (règle 27).
 * - La bannière est créée en base avec isActive=false par défaut.
 * - L'administrateur peut ensuite l'activer ou la personnaliser depuis le panneau admin.
 */
@Injectable()
export class MarketingBannerGeneratorService {
  private readonly logger = new Logger(MarketingBannerGeneratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiContent: GeminiContentService,
  ) {}

  /**
   * Vérifie si la génération IA est autorisée (par défaut false / désactivée).
   */
  async isAiGenerationEnabled(): Promise<boolean> {
    try {
      const lock = await this.prisma.moduleLock.findUnique({
        where: { key: FEATURE_MARKETING_BANNER_AI },
      });
      if (!lock) return false;
      return !lock.isLocked && lock.isVisible;
    } catch (err: unknown) {
      this.logger.warn(
        `⚠️ [BannerGenerator] Erreur vérification activation IA : ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }

  /**
   * Cron déclenché tous les 2 jours à 8h00 UTC.
   */
  @Cron('0 8 */2 * *', { name: 'generate-marketing-banner', timeZone: 'UTC' })
  async handleCron(): Promise<void> {
    const isEnabled = await this.isAiGenerationEnabled();
    if (!isEnabled) {
      this.logger.log(
        '⏸️ [BannerGenerator] Génération automatique par IA désactivée dans l’administration. Exécution du cron ignorée.',
      );
      return;
    }
    await this.generateAndSaveBanner({ force: false });
  }

  private async resolveSavedLanguageMode(): Promise<BannerLanguageMode> {
    try {
      const langLock = await this.prisma.moduleLock.findUnique({
        where: { key: FEATURE_MARKETING_BANNER_AI_LANG },
      });
      const candidate = langLock?.lockReason as BannerLanguageMode | undefined;
      if (
        candidate === 'MG_ONLY' ||
        candidate === 'BILINGUAL' ||
        candidate === 'FR_ONLY'
      ) {
        return candidate;
      }
      return 'BILINGUAL';
    } catch {
      return 'BILINGUAL';
    }
  }

  /**
   * Génère et sauvegarde une nouvelle bannière marketing.
   * Utilise Gemini AI en priorité, puis bascule sur le catalogue culturel
   * de repli en cas d'erreur réseau ou d'indisponibilité du service IA.
   *
   * @param options.force Si true (déclenchement manuel admin), ignore le statut de désactivation du cron automatique.
   * @param options.languageMode Mode de langue ('MG_ONLY' | 'BILINGUAL' | 'FR_ONLY')
   * @param options.theme Thème personnalisé optionnel saisi par l'administrateur
   */
  async generateAndSaveBanner(
    options: {
      force?: boolean;
      languageMode?: BannerLanguageMode;
      theme?: string;
    } = {},
  ): Promise<{
    success: boolean;
    bannerId?: string;
    message: string;
  }> {
    const force = options.force ?? false;
    if (!force) {
      const isEnabled = await this.isAiGenerationEnabled();
      if (!isEnabled) {
        this.logger.log(
          '⏸️ [BannerGenerator] Génération automatique IA désactivée (utiliser force: true pour déclenchement manuel).',
        );
        return {
          success: false,
          message:
            'La génération automatique de bannières par IA est actuellement désactivée.',
        };
      }
    }

    const languageMode =
      options.languageMode || (await this.resolveSavedLanguageMode());
    const customTheme = options.theme?.trim();
    const theme = customTheme || this.geminiContent.pickRandomTheme();
    this.logger.log(
      `🤖 [BannerGenerator] Démarrage génération bannière marketing — thème: "${theme}" (${languageMode})`,
    );

    // 1. Si la clé Gemini n'est pas configurée, bascule directe sur le fallback
    if (!this.geminiContent.isConfigured()) {
      this.logger.warn(
        `⚠️ [BannerGenerator] GEMINI_API_KEY non configurée — utilisation du catalogue culturel de secours pour "${theme}".`,
      );
      const fallbackContent = this.geminiContent.getFallbackBannerContent(
        theme,
        languageMode,
      );
      return await this.saveBanner(fallbackContent, theme, true, languageMode);
    }

    // 2. Tentative avec Gemini AI
    try {
      const content = await this.geminiContent.generateBannerContent(
        theme,
        languageMode,
      );
      return await this.saveBanner(content, theme, false, languageMode);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const cause = (err as any)?.cause?.message || (err as any)?.cause;
      const fullMsg = cause ? `${message} (cause: ${cause})` : message;

      this.logger.warn(
        `⚠️ [BannerGenerator] Échec génération IA Gemini (${fullMsg}) sur le thème "${theme}". Bascule résiliente sur le catalogue culturel de secours.`,
      );

      // 3. Repli résilient sur le catalogue culturel de secours
      const fallbackContent = this.geminiContent.getFallbackBannerContent(
        theme,
        languageMode,
      );
      return await this.saveBanner(fallbackContent, theme, true, languageMode);
    }
  }

  // ─── Enregistrement en base de données ──────────────────────────────────────

  private async saveBanner(
    content: GeneratedBannerContent,
    theme: string,
    isFallback: boolean,
    languageMode: BannerLanguageMode = 'BILINGUAL',
  ): Promise<{
    success: boolean;
    bannerId: string;
    message: string;
  }> {
    // Calcul du prochain orderIndex (en fin de liste)
    const highest = await this.prisma.marketingBanner.findFirst({
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    const orderIndex = (highest?.orderIndex ?? -1) + 1;

    // Image d'illustration adaptée au thème si fournie, sinon image par défaut
    const imageUrl =
      content.imageUrl ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80';

    const banner = await this.prisma.marketingBanner.create({
      data: {
        badgeFr: content.badgeFr,
        badgeMg: content.badgeMg,
        titleFr: content.titleFr,
        titleMg: content.titleMg,
        descriptionFr: content.descriptionFr,
        descriptionMg: content.descriptionMg,
        ctaFr: content.ctaFr,
        ctaMg: content.ctaMg,
        imageUrl,
        deepLink: content.deepLink,
        accentColor: content.accentColor,
        orderIndex,
        // Inactif par défaut : l'admin valide avant publication
        isActive: false,
        actionType: 'DEEP_LINK',
      },
    });

    const source = isFallback ? 'catalogue culturel de repli' : 'Gemini AI';
    const langLabel =
      languageMode === 'MG_ONLY'
        ? 'Malgache uniquement'
        : languageMode === 'FR_ONLY'
          ? 'Français uniquement'
          : 'Malgache & Français';
    this.logger.log(
      `✅ [BannerGenerator] Bannière générée avec succès via ${source} (${langLabel}) — ID: ${banner.id} (en attente de validation admin)`,
    );

    return {
      success: true,
      bannerId: banner.id,
      message: `Bannière "${content.titleFr}" créée avec succès (${source}, ${langLabel}, thème: ${theme})`,
    };
  }
}
