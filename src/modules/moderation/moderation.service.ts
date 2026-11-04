import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { CreateContentReportDto } from './dto/create-report.dto.js';
import { ResolveReportDto } from './dto/resolve-report.dto.js';
import { ContentModerationService } from './content-moderation.service.js';
import { ResendService } from '../../integrations/resend/resend.service.js';
import { ReportReason, ReportStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly textModeration: ContentModerationService,
    @Optional()
    private readonly resendService?: ResendService,
  ) {}

  /**
   * Création centralisée d'un signalement de contenu ou d'utilisateur
   */
  async reportContent(dto: CreateContentReportDto, reporterUserId?: string) {
    const hasTarget = Boolean(
      dto.reportedUserId ||
      dto.quizSetId ||
      dto.questionId ||
      dto.contributionId ||
      dto.commentId ||
      dto.itemId ||
      dto.citationId ||
      dto.conteId ||
      dto.kabaryId ||
      dto.poesieId ||
      dto.recitationId,
    );

    if (!hasTarget) {
      throw new BadRequestException(
        'Vous devez spécifier au moins une cible pour le signalement (utilisateur, quizSet, question, etc.).',
      );
    }

    if (dto.reportedUserId) {
      if (reporterUserId && reporterUserId === dto.reportedUserId) {
        throw new BadRequestException(
          'Vous ne pouvez pas signaler votre propre compte.',
        );
      }
      const reportedUser = await this.prisma.user.findUnique({
        where: { id: dto.reportedUserId },
        select: { id: true, name: true },
      });
      if (!reportedUser) {
        throw new NotFoundException('Utilisateur signalé introuvable.');
      }
    }

    // Normalisation de la description
    let description = dto.description?.trim() || null;
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
        status: ReportStatus.PENDING,
        resolved: false,
        userId: reporterUserId || null,
        reportedUserId: dto.reportedUserId || null,
        quizSetId: dto.quizSetId || null,
        questionId: dto.questionId || null,
        contributionId: dto.contributionId || null,
        commentId: dto.commentId || null,
        itemId: dto.itemId || null,
        citationId: dto.citationId || null,
        conteId: dto.conteId || null,
        kabaryId: dto.kabaryId || null,
        poesieId: dto.poesieId || null,
        recitationId: dto.recitationId || null,
      },
    });

    this.logger.warn(
      `🚩 [Moderation] Nouveau signalement #${report.id} enregistré (Motif: ${dto.reason}, Cible: ${dto.reportedUserId ? `User:${dto.reportedUserId}` : dto.quizSetId ? `Deck:${dto.quizSetId}` : 'Contenu'}, Auteur: ${reporterUserId || 'Anonyme'})`,
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
    status?: ReportStatus;
    reason?: ReportReason;
    reportedUserId?: string;
    take?: number;
    skip?: number;
  }) {
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    } else if (filters?.resolved !== undefined) {
      whereClause.resolved = filters.resolved;
    } else {
      whereClause.resolved = false; // Par défaut : signalements non résolus
    }

    if (filters?.reason) {
      whereClause.reason = filters.reason;
    }

    if (filters?.reportedUserId) {
      whereClause.reportedUserId = filters.reportedUserId;
    }

    const [reports, total] = await Promise.all([
      this.prisma.contentReport.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          reportedUser: {
            select: { id: true, name: true, email: true, image: true, status: true },
          },
          quizSet: { select: { id: true, title: true, isPublic: true } },
          question: { select: { id: true, questionMg: true, questionFr: true } },
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
   * Décision de modération : résout, rejette et applique des actions (suspension, ban, retrait de contenu)
   */
  async resolveReport(
    reportId: string,
    dto?: ResolveReportDto,
    adminUserId?: string,
  ) {
    const existing = await this.prisma.contentReport.findUnique({
      where: { id: reportId },
      include: {
        reportedUser: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Signalement #${reportId} introuvable.`);
    }

    const resolvedStatus = dto?.status || (dto?.resolved === false ? ReportStatus.REJECTED : ReportStatus.RESOLVED);
    const isResolved = resolvedStatus === ReportStatus.RESOLVED;
    const moderatorNotes = dto?.moderatorNotes || dto?.adminNote || null;
    const actionTaken = dto?.actionTaken || (isResolved ? 'RESOLVED' : 'DISMISSED');

    const updated = await this.prisma.contentReport.update({
      where: { id: reportId },
      data: {
        resolved: isResolved,
        status: resolvedStatus,
        moderatorNotes,
        actionTaken,
        resolvedAt: new Date(),
        resolvedById: adminUserId || null,
      },
    });

    // Application effective des sanctions administratives
    if (existing.reportedUserId && existing.reportedUser) {
      const targetUserId = existing.reportedUserId;

      if (actionTaken === 'SUSPENSION') {
        const suspensionDays = dto?.suspensionDays || 7;
        const suspendedUntil = new Date(Date.now() + suspensionDays * 24 * 60 * 60 * 1000);

        await this.prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: targetUserId },
            data: {
              status: 'SUSPENDED',
              suspendedUntil,
              banExpires: suspendedUntil,
              banReason: moderatorNotes || `Compte suspendu pour ${suspensionDays} jours suite à modération.`,
            },
          });
          // Révocation immédiate des sessions actives
          await tx.session.deleteMany({ where: { userId: targetUserId } });
        });

        if (this.resendService && existing.reportedUser.email) {
          this.resendService
            .sendUserBannedEmail({
              to: existing.reportedUser.email,
              userName: existing.reportedUser.name,
              reason: moderatorNotes || `Suspension temporaire pour ${suspensionDays} jours`,
              banExpires: suspendedUntil,
            })
            .catch((err) =>
              this.logger.warn(`Échec envoi email suspension pour ${existing.reportedUser?.email}:`, err),
            );
        }
      } else if (actionTaken === 'BAN') {
        await this.prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: targetUserId },
            data: {
              status: 'BANNED',
              banned: true,
              banExpires: null,
              banReason: moderatorNotes || 'Bannissement définitif suite à des signalements répétés.',
            },
          });
          // Révocation immédiate des sessions
          await tx.session.deleteMany({ where: { userId: targetUserId } });
        });

        if (this.resendService && existing.reportedUser.email) {
          this.resendService
            .sendUserBannedEmail({
              to: existing.reportedUser.email,
              userName: existing.reportedUser.name,
              reason: moderatorNotes || 'Bannissement définitif du compte',
            })
            .catch((err) =>
              this.logger.warn(`Échec envoi email ban pour ${existing.reportedUser?.email}:`, err),
            );
        }
      }
    }

    // Retrait de contenu (ex: deck UGC inapproprié)
    if (actionTaken === 'CONTENT_REMOVED' && existing.quizSetId) {
      await this.prisma.userQuizSet.update({
        where: { id: existing.quizSetId },
        data: {
          isPublic: false,
          visibility: 'LINK_ONLY',
        },
      });
    }

    this.logger.log(
      `✅ [Moderation] Signalement #${reportId} traité avec statut ${resolvedStatus} (Action: ${actionTaken}) par admin ${adminUserId || 'Système'}`,
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
    const [pendingCount, underReviewCount, resolvedCount, totalCount] = await Promise.all([
      this.prisma.contentReport.count({ where: { status: ReportStatus.PENDING } }),
      this.prisma.contentReport.count({ where: { status: ReportStatus.UNDER_REVIEW } }),
      this.prisma.contentReport.count({ where: { status: ReportStatus.RESOLVED } }),
      this.prisma.contentReport.count(),
    ]);

    return {
      pendingReports: pendingCount,
      underReviewReports: underReviewCount,
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
