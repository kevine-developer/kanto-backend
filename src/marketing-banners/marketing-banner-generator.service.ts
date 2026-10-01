import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { GeminiContentService } from '../integrations/gemini/gemini-content.service.js';

/**
 * Service responsable de la génération automatique de bannières marketing
 * toutes les 48 heures via Gemini AI.
 *
 * Comportement :
 * - Toutes les 48h, un nouveau thème aléatoire est sélectionné.
 * - Gemini génère un contenu bilingue (FR + MG) structuré en JSON.
 * - La bannière est créée en base avec isActive=false par défaut.
 * - L'administrateur peut ensuite l'activer manuellement depuis le panneau admin.
 *
 * Note : La bannière est créée en mode inactif pour laisser l'admin
 * valider le contenu avant de l'exposer aux utilisateurs.
 */
@Injectable()
export class MarketingBannerGeneratorService {
  private readonly logger = new Logger(MarketingBannerGeneratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiContent: GeminiContentService,
  ) {}

  /**
   * Cron déclenché tous les 2 jours à 8h00 UTC.
   * Expression cron : "0 8 [tous les 2 jours] * *"
   */
  @Cron('0 8 */2 * *', { name: 'generate-marketing-banner', timeZone: 'UTC' })
  async handleCron(): Promise<void> {
    await this.generateAndSaveBanner();
  }

  /**
   * Génère et sauvegarde une nouvelle bannière marketing via Gemini.
   * Méthode publique pour permettre un déclenchement manuel via l'API admin.
   */
  async generateAndSaveBanner(): Promise<{
    success: boolean;
    bannerId?: string;
    message: string;
  }> {
    if (!this.geminiContent.isConfigured()) {
      this.logger.warn(
        '⚠️ [BannerGenerator] Génération ignorée — GEMINI_API_KEY non configurée.',
      );
      return { success: false, message: 'GEMINI_API_KEY non configurée' };
    }

    const theme = this.geminiContent.pickRandomTheme();
    this.logger.log(
      `🤖 [BannerGenerator] Démarrage génération automatique — thème: "${theme}"`,
    );

    try {
      const content = await this.geminiContent.generateBannerContent(theme);

      // Calcul du prochain orderIndex (en fin de liste)
      const highest = await this.prisma.marketingBanner.findFirst({
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      const orderIndex = (highest?.orderIndex ?? -1) + 1;

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
          // Placeholder image — l'admin peut la remplacer via le panneau admin
          imageUrl:
            'https://res.cloudinary.com/kanto/image/upload/v1/banners/placeholder.jpg',
          deepLink: content.deepLink,
          accentColor: content.accentColor,
          orderIndex,
          // Inactif par défaut : l'admin doit valider avant publication
          isActive: false,
          actionType: 'DEEP_LINK',
        },
      });

      this.logger.log(
        `✅ [BannerGenerator] Bannière générée avec succès — ID: ${banner.id} (en attente de validation admin)`,
      );

      return {
        success: true,
        bannerId: banner.id,
        message: `Bannière "${content.titleFr}" créée avec succès (thème: ${theme})`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `❌ [BannerGenerator] Échec de la génération automatique : ${message}`,
      );
      return { success: false, message };
    }
  }
}
