import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { CreateContentReportDto } from './dto/create-report.dto.js';
import { ResolveReportDto } from './dto/resolve-report.dto.js';
import { ContentModerationService } from './content-moderation.service.js';
import { ReportReason } from '../../../generated/prisma/client.js';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly textModeration: ContentModerationService,
  ) {}

  /**
   * Création centralisée d'un signalement de contenu (utilisé par tous les modules)
   */
  async reportContent(dto: CreateContentReportDto, reporterUserId?: string) {
    const hasTarget = Boolean(
      dto.itemId ||
      dto.citationId ||
      dto.conteId ||
      dto.kabaryId ||
      dto.poesieId ||
      dto.recitationId ||
      dto.quizSetId ||
      dto.contributionId,
    );

    if (!hasTarget) {
      throw new BadRequestException(
        'Vous devez spécifier au moins une cible pour le signalement (item, citation, conte, kabary, poesie, recitation, quizSet ou contribution).',
      );
    }

    // Normalisation de la description (notamment pour les contributions communautaires)
    let description = dto.description || null;
    if (dto.contributionId) {
      const prefix = `[CONTRIBUTION:${dto.contributionId}]`;
      description = description
        ? `${prefix} ${description}`
        : `${prefix} ${dto.reason}`;
    }

    const report = await this.prisma.contentReport.create({
      data: {
        reason: dto.reason,
        description,
        userId: reporterUserId || null,
        itemId: dto.itemId || null,
        citationId: dto.citationId || null,
        conteId: dto.conteId || null,
        kabaryId: dto.kabaryId || null,
        poesieId: dto.poesieId || null,
        recitationId: dto.recitationId || null,
        quizSetId: dto.quizSetId || null,
      },
    });

    this.logger.warn(
      `🚩 [Moderation] Nouveau signalement #${report.id} enregistré (Motif: ${dto.reason}, Auteur: ${reporterUserId || 'Anonyme'})`,
    );

    return {
      success: true,
      message: 'Signalement transmis avec succès à l’équipe de modération.',
      reportId: report.id,
    };
  }

  /**
   * Récupération de la file des signalements pour les modérateurs
   */
  async getReports(filters?: {
    resolved?: boolean;
    reason?: ReportReason;
    take?: number;
    skip?: number;
  }) {
    const whereClause: any = {};

    if (filters?.resolved !== undefined) {
      whereClause.resolved = filters.resolved;
    } else {
      whereClause.resolved = false; // Par défaut : signalements en attente
    }

    if (filters?.reason) {
      whereClause.reason = filters.reason;
    }

    const [reports, total] = await Promise.all([
      this.prisma.contentReport.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          item: {
            select: { id: true, malagasy: true, french: true, category: true },
          },
          citation: {
            select: {
              id: true,
              citationMg: true,
              citationFr: true,
              sourceName: true,
            },
          },
          conte: { select: { id: true, title: true, titleFr: true } },
          kabary: { select: { id: true, title: true, titleFr: true } },
          poesie: { select: { id: true, title: true, titleFr: true } },
          recitation: { select: { id: true, title: true, titleFr: true } },
          quizSet: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.take || 50,
        skip: filters?.skip || 0,
      }),
      this.prisma.contentReport.count({ where: whereClause }),
    ]);

    return {
      reports,
      total,
      hasMore: (filters?.skip || 0) + reports.length < total,
    };
  }

  /**
   * Décision de modération : résout ou rejette un signalement
   */
  async resolveReport(
    reportId: string,
    dto?: ResolveReportDto,
    adminUserId?: string,
  ) {
    const existing = await this.prisma.contentReport.findUnique({
      where: { id: reportId },
    });

    if (!existing) {
      throw new NotFoundException(`Signalement #${reportId} introuvable.`);
    }

    const updated = await this.prisma.contentReport.update({
      where: { id: reportId },
      data: {
        resolved: dto?.resolved ?? true,
      },
    });

    this.logger.log(
      `✅ [Moderation] Signalement #${reportId} résolu par administrateur ${adminUserId || 'Système'}`,
    );

    return {
      success: true,
      message: 'Signalement mis à jour avec succès.',
      report: updated,
    };
  }

  /**
   * Statistiques consolidées de modération
   */
  async getModerationStats() {
    const [pendingCount, resolvedCount, totalCount] = await Promise.all([
      this.prisma.contentReport.count({ where: { resolved: false } }),
      this.prisma.contentReport.count({ where: { resolved: true } }),
      this.prisma.contentReport.count(),
    ]);

    return {
      pendingReports: pendingCount,
      resolvedReports: resolvedCount,
      totalReports: totalCount,
    };
  }

  /**
   * Analyse automatique du contenu textuel (détection de grossièretés, leetspeak, etc.)
   */
  analyzeContent(fields: Record<string, unknown>) {
    return this.textModeration.moderateContent(fields);
  }
}
