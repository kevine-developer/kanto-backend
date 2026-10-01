import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import {
  DEFAULT_PRIVACY_HTML,
  DEFAULT_TERMS_HTML,
} from './admin-legal.defaults.js';

export class UpdateLegalDocumentDto {
  title?: string;
  version?: string;
  effectiveDate?: string;
  contentHtml?: string;
  summary?: string;
}

@Controller('admin/legal')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminLegalController {
  private readonly logger = new Logger(AdminLegalController.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initialise les documents légaux par défaut s'ils n'existent pas encore en BDD.
   */
  private async ensureDefaultDocuments(): Promise<void> {
    const existingTerms = await this.prisma.legalDocument.findUnique({
      where: { slug: 'terms' },
    });
    if (!existingTerms) {
      await this.prisma.legalDocument.create({
        data: {
          slug: 'terms',
          title: "Conditions Générales d'Utilisation",
          version: '1.0',
          effectiveDate: 'Septembre 2025',
          contentHtml: DEFAULT_TERMS_HTML,
          summary: 'Version initiale applicable au lancement de Kanto.',
          requiresConsent: true,
          updatedBy: 'system',
        },
      });
      this.logger.log(
        '[AdminLegal] Document par défaut "terms" initialisé en BDD.',
      );
    }

    const existingPrivacy = await this.prisma.legalDocument.findUnique({
      where: { slug: 'privacy' },
    });
    if (!existingPrivacy) {
      await this.prisma.legalDocument.create({
        data: {
          slug: 'privacy',
          title: 'Politique de confidentialité',
          version: '1.0',
          effectiveDate: 'Septembre 2025',
          contentHtml: DEFAULT_PRIVACY_HTML,
          summary: 'Politique de protection des données initiales de Kanto.',
          requiresConsent: true,
          updatedBy: 'system',
        },
      });
      this.logger.log(
        '[AdminLegal] Document par défaut "privacy" initialisé en BDD.',
      );
    }
  }

  /**
   * Récupère la liste des documents légaux avec les statistiques d'acceptation par les utilisateurs.
   */
  @Get()
  async getLegalDocuments() {
    await this.ensureDefaultDocuments();

    const [documents, totalUsers] = await Promise.all([
      this.prisma.legalDocument.findMany({
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    // Calcul des statistiques d'acceptation des CGU
    const termsDoc = documents.find((d) => d.slug === 'terms');
    let acceptedCurrentVersion = 0;
    let acceptedOlderVersion = 0;
    let unacceptedOrUnknown = 0;

    if (termsDoc && totalUsers > 0) {
      const activeVersion = termsDoc.version;
      const [currentCount, totalAccepted] = await Promise.all([
        this.prisma.user.count({
          where: { termsVersion: activeVersion },
        }),
        this.prisma.user.count({
          where: { termsAcceptedAt: { not: null } },
        }),
      ]);

      acceptedCurrentVersion = currentCount;
      acceptedOlderVersion = Math.max(0, totalAccepted - currentCount);
      unacceptedOrUnknown = Math.max(0, totalUsers - totalAccepted);
    }

    const acceptanceRate =
      totalUsers > 0
        ? Math.round((acceptedCurrentVersion / totalUsers) * 100)
        : 100;

    return {
      documents,
      stats: {
        totalUsers,
        activeVersion: termsDoc?.version || '1.0',
        acceptedCurrentVersion,
        acceptedOlderVersion,
        unacceptedOrUnknown,
        acceptanceRate,
      },
    };
  }

  /**
   * Récupère un document légal spécifique.
   */
  @Get(':slug')
  async getLegalDocument(@Param('slug') slug: string) {
    await this.ensureDefaultDocuments();

    const doc = await this.prisma.legalDocument.findUnique({
      where: { slug },
    });

    if (!doc) {
      throw new NotFoundException(`Document légal "${slug}" introuvable.`);
    }

    return doc;
  }

  /**
   * Met à jour le contenu et les métadonnées d'un document légal.
   */
  @Put(':slug')
  async updateLegalDocument(
    @Param('slug') slug: string,
    @Body() dto: UpdateLegalDocumentDto,
    @Req() req: any,
  ) {
    await this.ensureDefaultDocuments();

    const existing = await this.prisma.legalDocument.findUnique({
      where: { slug },
    });

    if (!existing) {
      throw new NotFoundException(`Document légal "${slug}" introuvable.`);
    }

    const adminEmail = req?.user?.email || req?.session?.user?.email || 'admin';

    const updated = await this.prisma.legalDocument.update({
      where: { slug },
      data: {
        title: dto.title ?? existing.title,
        version: dto.version ? dto.version.trim() : existing.version,
        effectiveDate: dto.effectiveDate ?? existing.effectiveDate,
        contentHtml: dto.contentHtml ?? existing.contentHtml,
        summary: dto.summary ?? existing.summary,
        updatedBy: adminEmail,
      },
    });

    this.logger.log(
      `[AdminLegal] Document "${slug}" mis à jour vers la version ${updated.version} par ${adminEmail}.`,
    );

    return {
      success: true,
      message: `Document "${slug}" mis à jour avec succès.`,
      document: updated,
    };
  }

  /**
   * Réinitialise le document au texte officiel par défaut.
   */
  @Post(':slug/reset')
  async resetToDefault(@Param('slug') slug: string, @Req() req: any) {
    let defaultHtml = '';
    let defaultTitle = '';

    if (slug === 'terms') {
      defaultHtml = DEFAULT_TERMS_HTML;
      defaultTitle = "Conditions Générales d'Utilisation";
    } else if (slug === 'privacy') {
      defaultHtml = DEFAULT_PRIVACY_HTML;
      defaultTitle = 'Politique de confidentialité';
    } else {
      throw new NotFoundException(`Pas de contenu par défaut pour "${slug}".`);
    }

    const adminEmail = req?.user?.email || req?.session?.user?.email || 'admin';

    const updated = await this.prisma.legalDocument.upsert({
      where: { slug },
      create: {
        slug,
        title: defaultTitle,
        version: '1.0',
        effectiveDate: 'Septembre 2025',
        contentHtml: defaultHtml,
        summary: 'Réinitialisation au texte officiel Kanto.',
        requiresConsent: true,
        updatedBy: adminEmail,
      },
      update: {
        title: defaultTitle,
        contentHtml: defaultHtml,
        summary: 'Réinitialisation au texte officiel Kanto.',
        updatedBy: adminEmail,
      },
    });

    return {
      success: true,
      message: `Document "${slug}" réinitialisé au contenu par défaut.`,
      document: updated,
    };
  }
}
