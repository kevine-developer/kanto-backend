import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  ContributionStatus,
  ReportReason,
} from '../../generated/prisma/client.js';
import { CreateContributionDto } from './dto/create-contribution.dto.js';
import { CreateKabaryContributionDto } from './dto/create-kabary-contribution.dto.js';
import { CreateProverbeContributionDto } from './dto/create-proverbe-contribution.dto.js';
import { CreateCitationContributionDto } from './dto/create-citation-contribution.dto.js';
import { CreateConteContributionDto } from './dto/create-conte-contribution.dto.js';
import { UpdateContributionDto } from './dto/update-contribution.dto.js';
import { CreateContributionCommentDto } from './dto/create-contribution-comment.dto.js';
import { DisputeContributionDto } from './dto/dispute-contribution.dto.js';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto.js';
import { CheckDuplicateDto } from './dto/check-duplicate.dto.js';
import { DuplicateDetectionService } from './duplicate-detection.service.js';
import { ContentModerationService } from './moderation/content-moderation.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { EventNotificationService } from '../notifications/event-notification.service.js';
import { RedisService } from '../redis/redis.service.js';
import { ResendService } from '../integrations/resend/resend.service.js';
import {
  REALTIME_CHANNELS,
  LeaderboardRealtimePayload,
} from '../realtime/realtime.constants.js';

const REDIS_CHANNEL_COMMENTS = REALTIME_CHANNELS.COMMENTS;

// ─────────────────────────────────────────────────────────────────────────────
// Sélecteurs réutilisables (Sécurité & Confidentialité)
// ─────────────────────────────────────────────────────────────────────────────
export const CONTRIBUTION_PUBLIC_SELECT = {
  id: true,
  category: true,
  textMg: true,
  textFr: true,
  meaning: true,
  status: true,
  score: true,
  viewCount: true,
  region: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: { select: { id: true, name: true, image: true } },
  _count: { select: { comments: true } },
  duplicateScore: true,
  duplicateOfId: true,
  duplicateTypeOf: true,
  duplicateTargetTitle: true,
  isDuplicateConfirmed: true,
  markedForDeletionAt: true,
  isAnonymous: true,
} as const;

export const CONTRIBUTION_BASE_SELECT = {
  ...CONTRIBUTION_PUBLIC_SELECT,
  disputeMessage: true,
  disputeStatus: true,
  disputedAt: true,
  moderationFlagged: true,
  moderationCategories: true,
  moderationReason: true,
  moderationDetails: true,
  moderatedAt: true,
  adminFeedback: true,
  adminReviewedBy: true,
  adminReviewedAt: true,
  lastNotificationSentAt: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────────────────────
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class ContributionsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ContributionsService.name);
  private purgeInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly eventNotificationService: EventNotificationService,
    private readonly redisService: RedisService,
    private readonly duplicateDetectionService: DuplicateDetectionService,
    private readonly contentModerationService: ContentModerationService,
    @Optional() private readonly resendService?: ResendService,
  ) {}

  onModuleInit() {
    // Vérification initiale après 15 secondes
    const initialTimer = setTimeout(() => {
      this.purgeExpiredDuplicates().catch((err) => {
        this.logger.error('Erreur purge initiale des doublons :', err);
      });
    }, 15000);
    initialTimer.unref();

    // Vérification automatique toutes les 30 minutes
    this.purgeInterval = setInterval(
      () => {
        this.purgeExpiredDuplicates().catch((err) => {
          this.logger.error('Erreur purge périodique des doublons :', err);
        });
      },
      30 * 60 * 1000,
    );
    this.purgeInterval.unref();
  }

  onModuleDestroy() {
    if (this.purgeInterval) {
      clearInterval(this.purgeInterval);
      this.purgeInterval = null;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Génération de slug unique pour une table donnée
  // ───────────────────────────────────────────────────────────────────────────
  private async ensureUniqueSlug(
    baseSlug: string,
    checkFn: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    let slug = baseSlug;
    const exists = await checkFn(slug);
    if (exists) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }
    return slug;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Traçabilité & Audit des décisions de modération
  // ───────────────────────────────────────────────────────────────────────────
  private async logAudit(params: {
    contributionId: string;
    userId?: string;
    userRole?: string;
    action: string;
    fromStatus?: ContributionStatus;
    toStatus?: ContributionStatus;
    reason?: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      await this.prisma.contributionAuditLog.create({
        data: {
          contributionId: params.contributionId,
          userId: params.userId,
          userRole: params.userRole,
          action: params.action,
          fromStatus: params.fromStatus,
          toStatus: params.toStatus,
          reason: params.reason,
          metadata: params.metadata ? (params.metadata as any) : undefined,
        },
      });
    } catch (err) {
      this.logger.warn(
        `Impossible d'enregistrer l'audit log pour ${params.contributionId}: ${err}`,
      );
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Alerte e-mail aux administrateurs pour vérification renforcée
  // ───────────────────────────────────────────────────────────────────────────
  private async notifyAdminsModerationAlert(params: {
    contributionId: string;
    contributionTitle: string;
    contributorId: string;
    contributorName: string;
    riskCategories: string[];
    submissionDate: Date;
    lastNotificationSentAt?: Date | null;
  }) {
    if (!this.resendService || !this.resendService.isConfigured()) {
      return;
    }

    // Garde-fou anti-spam : ne pas envoyer plus d'un e-mail par 10 minutes pour la même contribution
    if (params.lastNotificationSentAt) {
      const elapsedMinutes =
        (Date.now() - new Date(params.lastNotificationSentAt).getTime()) /
        (1000 * 60);
      if (elapsedMinutes < 10) {
        return;
      }
    }

    try {
      // Déterminer la liste des destinataires administrateurs
      const adminUsers = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true },
      });

      const recipientEmails = new Set<string>();
      for (const u of adminUsers) {
        if (u.email) recipientEmails.add(u.email);
      }

      if (process.env.ADMIN_NOTIFICATION_EMAIL) {
        recipientEmails.add(process.env.ADMIN_NOTIFICATION_EMAIL.trim());
      }
      if (process.env.DEFAULT_ADMIN_EMAIL) {
        recipientEmails.add(process.env.DEFAULT_ADMIN_EMAIL.trim());
      }

      if (recipientEmails.size === 0) {
        this.logger.warn(
          'Aucun e-mail administrateur trouvé pour l alerte de modération.',
        );
        return;
      }

      const adminFrontendUrl =
        process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001';
      const adminReviewUrl = `${adminFrontendUrl}/contributions?id=${params.contributionId}`;

      await this.resendService.sendModerationAlertAdminEmail({
        to: Array.from(recipientEmails),
        contributionId: params.contributionId,
        contributionTitle: params.contributionTitle,
        contributorName: params.contributorName,
        contributorId: params.contributorId,
        riskCategories: params.riskCategories,
        submissionDate: params.submissionDate.toLocaleString('fr-FR'),
        adminReviewUrl,
      });

      // Mettre à jour l'horodatage d'envoi pour éviter les doublons
      await this.prisma.contribution.update({
        where: { id: params.contributionId },
        data: { lastNotificationSentAt: new Date() },
      });
    } catch (err) {
      // Sécurité : l'échec d'envoi d'email ne doit jamais interrompre la soumission
      this.logger.error(`Échec envoi alerte e-mail modération : ${err}`);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Modération automatique & passage en PENDING_REVIEW
  // ───────────────────────────────────────────────────────────────────────────
  private async processSubmissionModeration(params: {
    contributionId: string;
    fields: Record<string, unknown>;
    userId: string;
    previousStatus?: ContributionStatus;
    titlePreview: string;
  }) {
    // 1. Analyse automatique par ContentModerationService
    const modResult = this.contentModerationService.moderateContent(
      params.fields,
    );

    // 2. Mise à jour de la contribution en base
    const updated = await this.prisma.contribution.update({
      where: { id: params.contributionId },
      data: {
        status: 'PENDING_REVIEW',
        moderationFlagged: modResult.isFlagged,
        moderationCategories: modResult.categories,
        moderationReason: modResult.isFlagged ? modResult.summary : null,
        moderationDetails: modResult as any,
        moderatedAt: new Date(),
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    // 3. Traçabilité d'audit
    await this.logAudit({
      contributionId: params.contributionId,
      userId: params.userId,
      userRole: 'USER',
      action: modResult.isFlagged ? 'MODERATION_FLAGGED' : 'SUBMITTED',
      fromStatus: params.previousStatus || 'DRAFT',
      toStatus: 'PENDING_REVIEW',
      reason: modResult.isFlagged ? modResult.summary : undefined,
      metadata: {
        score: modResult.score,
        categories: modResult.categories,
        matchesCount: modResult.matches.length,
      },
    });

    // 4. Si suspect : Alerte e-mail sécurisée aux administrateurs
    if (modResult.isFlagged) {
      void this.notifyAdminsModerationAlert({
        contributionId: params.contributionId,
        contributionTitle: params.titlePreview,
        contributorId: params.userId,
        contributorName: updated.user?.name || 'Contributeur',
        riskCategories: modResult.categories,
        submissionDate: updated.createdAt,
        lastNotificationSentAt: updated.lastNotificationSentAt,
      });
    }

    // 5. Notification centralisée et accusé de réception par e-mail
    void this.eventNotificationService
      .dispatchNotificationEvent({
        type: 'CONTRIBUTION_SUBMITTED',
        recipientUserId: params.userId,
        contributionId: params.contributionId,
        contributionTitle: params.titlePreview,
        category: updated.category,
      })
      .catch((err) => {
        this.logger.warn(
          `Échec dispatch CONTRIBUTION_SUBMITTED à ${params.userId}: ${err}`,
        );
      });
    // 5. Notification in-app neutre à l'utilisateur
    void this.notificationsService
      .createNotification({
        userId: params.userId,
        titleMg: 'Fandraisana anjara : Voaray ny tolotrao',
        titleFr: 'Contribution : Proposition bien reçue',
        messageMg: `Voaray soa aman-tsara ny fandraisana anjaranao (« ${params.titlePreview} ») ary andalam-pandinihana ataon'ny ekipa. Hampahafantarina anao ny tohin'izany.`,
        messageFr: `Votre contribution (« ${params.titlePreview} ») a bien été enregistrée et est en attente de validation par notre équipe. Vous serez informé(e) de la suite donnée à votre proposition.`,
        category: 'community',
        badgeText: 'Fandraisana anjara',
        badgeType: 'info',
        iconName: 'document-text-outline',
        iconColor: '#3B82F6',
        isBroadcast: false,
        targetRoute: '/(tabs)/profil',
      })
      .catch((err) => {
        this.logger.warn(
          `Échec envoi notification confirmation soumission à ${params.userId}: ${err}`,
        );
      });

    return {
      contribution: updated,
      moderation: {
        isFlagged: modResult.isFlagged,
        categories: modResult.categories,
      },
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CRÉATION GÉNÉRIQUE (rétro-compatibilité)
  // ───────────────────────────────────────────────────────────────────────────
  async create(userId: string, dto: CreateContributionDto) {
    const dupCheck = await this.duplicateDetectionService.detectDuplicate(
      dto.textMg,
      dto.category,
    );

    const isDraft = dto.isDraft === true;
    const initialStatus: ContributionStatus = isDraft
      ? 'DRAFT'
      : 'PENDING_REVIEW';

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: dto.category,
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
        status: initialStatus,
        duplicateScore: dupCheck.score,
        duplicateOfId: dupCheck.targetId,
        duplicateTypeOf: dupCheck.targetType,
        duplicateTargetTitle: dupCheck.targetTitle,
        isAnonymous: Boolean(dto.isAnonymous),
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft) {
      await this.logAudit({
        contributionId: contribution.id,
        userId,
        userRole: 'USER',
        action: 'CREATED_DRAFT',
        toStatus: 'DRAFT',
      });
      return {
        success: true,
        isDraft: true,
        contribution,
        duplicateWarning: dupCheck.isDuplicate
          ? dupCheck.explanation
          : undefined,
      };
    }

    const modRes = await this.processSubmissionModeration({
      contributionId: contribution.id,
      fields: {
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
      },
      userId,
      previousStatus: 'DRAFT',
      titlePreview: dto.textFr || dto.textMg.slice(0, 45),
    });

    return {
      success: true,
      contribution: modRes.contribution,
      moderation: modRes.moderation,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck.explanation : undefined,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/kabary
  // ───────────────────────────────────────────────────────────────────────────
  async createKabaryContribution(
    userId: string,
    dto: CreateKabaryContributionDto,
  ) {
    const payload = JSON.stringify(dto);
    const dupCheck = await this.duplicateDetectionService.detectDuplicate(
      dto.title,
      'KABARY',
    );

    const isDraft = (dto as any).isDraft === true;
    const initialStatus: ContributionStatus = isDraft
      ? 'DRAFT'
      : 'PENDING_REVIEW';

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'KABARY',
        textMg: payload, // Sérialisé : contient title, steps[], occasion, etc.
        textFr: dto.titleFr ?? dto.title,
        meaning: dto.occasion,
        region: dto.region,
        status: initialStatus,
        duplicateScore: dupCheck.score,
        duplicateOfId: dupCheck.targetId,
        duplicateTypeOf: dupCheck.targetType,
        duplicateTargetTitle: dupCheck.targetTitle,
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft) {
      await this.logAudit({
        contributionId: contribution.id,
        userId,
        userRole: 'USER',
        action: 'CREATED_DRAFT',
        toStatus: 'DRAFT',
      });
      return {
        success: true,
        isDraft: true,
        contribution,
        duplicateWarning: dupCheck.isDuplicate
          ? dupCheck.explanation
          : undefined,
      };
    }

    const modRes = await this.processSubmissionModeration({
      contributionId: contribution.id,
      fields: {
        title: dto.title,
        titleFr: dto.titleFr,
        occasion: dto.occasion,
        occasionFr: dto.occasionFr,
        steps: dto.steps,
        concludingProverbMg: dto.concludingProverbMg,
      },
      userId,
      previousStatus: 'DRAFT',
      titlePreview: dto.titleFr || dto.title,
    });

    return {
      success: true,
      contribution: modRes.contribution,
      moderation: modRes.moderation,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck.explanation : undefined,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/proverbe
  // ───────────────────────────────────────────────────────────────────────────
  async createProverbeContribution(
    userId: string,
    dto: CreateProverbeContributionDto,
  ) {
    const dupCheck = await this.duplicateDetectionService.detectDuplicate(
      dto.textMg,
      dto.category,
    );

    const isDraft = (dto as any).isDraft === true;
    const initialStatus: ContributionStatus = isDraft
      ? 'DRAFT'
      : 'PENDING_REVIEW';

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: dto.category,
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
        status: initialStatus,
        duplicateScore: dupCheck.score,
        duplicateOfId: dupCheck.targetId,
        duplicateTypeOf: dupCheck.targetType,
        duplicateTargetTitle: dupCheck.targetTitle,
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft) {
      await this.logAudit({
        contributionId: contribution.id,
        userId,
        userRole: 'USER',
        action: 'CREATED_DRAFT',
        toStatus: 'DRAFT',
      });
      return {
        success: true,
        isDraft: true,
        contribution,
        duplicateWarning: dupCheck.isDuplicate
          ? dupCheck.explanation
          : undefined,
      };
    }

    const modRes = await this.processSubmissionModeration({
      contributionId: contribution.id,
      fields: {
        textMg: dto.textMg,
        textFr: dto.textFr,
        meaning: dto.meaning,
        region: dto.region,
      },
      userId,
      previousStatus: 'DRAFT',
      titlePreview: dto.textFr || dto.textMg.slice(0, 45),
    });

    return {
      success: true,
      contribution: modRes.contribution,
      moderation: modRes.moderation,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck.explanation : undefined,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/citation
  // ───────────────────────────────────────────────────────────────────────────
  async createCitationContribution(
    userId: string,
    dto: CreateCitationContributionDto,
  ) {
    const dupCheck = await this.duplicateDetectionService.detectDuplicate(
      dto.citationMg,
      'CITATION',
    );

    const isDraft = (dto as any).isDraft === true;
    const initialStatus: ContributionStatus = isDraft
      ? 'DRAFT'
      : 'PENDING_REVIEW';

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'CITATION',
        textMg: dto.citationMg,
        textFr: dto.citationFr,
        meaning: dto.contexte ?? '',
        region: dto.sourceName,
        status: initialStatus,
        duplicateScore: dupCheck.score,
        duplicateOfId: dupCheck.targetId,
        duplicateTypeOf: dupCheck.targetType,
        duplicateTargetTitle: dupCheck.targetTitle,
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft) {
      await this.logAudit({
        contributionId: contribution.id,
        userId,
        userRole: 'USER',
        action: 'CREATED_DRAFT',
        toStatus: 'DRAFT',
      });
      return {
        success: true,
        isDraft: true,
        contribution,
        duplicateWarning: dupCheck.isDuplicate
          ? dupCheck.explanation
          : undefined,
      };
    }

    const modRes = await this.processSubmissionModeration({
      contributionId: contribution.id,
      fields: {
        citationMg: dto.citationMg,
        citationFr: dto.citationFr,
        contexte: dto.contexte,
        sourceName: dto.sourceName,
      },
      userId,
      previousStatus: 'DRAFT',
      titlePreview: dto.citationFr || dto.citationMg.slice(0, 45),
    });

    return {
      success: true,
      contribution: modRes.contribution,
      moderation: modRes.moderation,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck.explanation : undefined,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/conte
  // ───────────────────────────────────────────────────────────────────────────
  async createConteContribution(
    userId: string,
    dto: CreateConteContributionDto,
  ) {
    const payload = JSON.stringify(dto);
    const isDraft = (dto as any).isDraft === true;
    const initialStatus: ContributionStatus = isDraft
      ? 'DRAFT'
      : 'PENDING_REVIEW';

    const contribution = await this.prisma.contribution.create({
      data: {
        userId,
        category: 'CONTE',
        textMg: payload, // Sérialisé : title, paragraphs[], moralMg, etc.
        textFr: dto.titleFr,
        meaning: dto.moralMg ?? '',
        region: dto.source,
        status: initialStatus,
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft) {
      await this.logAudit({
        contributionId: contribution.id,
        userId,
        userRole: 'USER',
        action: 'CREATED_DRAFT',
        toStatus: 'DRAFT',
      });
      return { success: true, isDraft: true, contribution };
    }

    const modRes = await this.processSubmissionModeration({
      contributionId: contribution.id,
      fields: {
        title: dto.title,
        titleFr: dto.titleFr,
        moralMg: dto.moralMg,
        moralFr: dto.moralFr,
        paragraphs: dto.paragraphs,
      },
      userId,
      previousStatus: 'DRAFT',
      titlePreview: dto.titleFr || dto.title,
    });

    return {
      success: true,
      contribution: modRes.contribution,
      moderation: modRes.moderation,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/submit — Soumettre un brouillon pour validation
  // ───────────────────────────────────────────────────────────────────────────
  async submitForReview(id: string, userId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    if (contribution.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez soumettre que vos propres contributions.',
      );
    }

    if (
      contribution.status !== 'DRAFT' &&
      contribution.status !== 'CHANGES_REQUESTED'
    ) {
      throw new BadRequestException(
        `Cette contribution ne peut pas être soumise car son statut actuel est ${contribution.status}.`,
      );
    }

    const fieldsMap: Record<string, unknown> = {
      textMg: contribution.textMg,
      textFr: contribution.textFr,
      meaning: contribution.meaning,
      region: contribution.region,
    };

    const titlePreview =
      contribution.textFr || contribution.textMg.slice(0, 45);

    const result = await this.processSubmissionModeration({
      contributionId: id,
      fields: fieldsMap,
      userId,
      previousStatus: contribution.status,
      titlePreview,
    });

    return {
      success: true,
      contribution: result.contribution,
      moderation: result.moderation,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/community — Propositions communautaires en cours de revue / vote
  // ───────────────────────────────────────────────────────────────────────────
  async findCommunity(
    category?: string,
    userId?: string,
    limit: number = 50,
    statusFilter?: string,
  ) {
    const safeLimit = Math.min(Math.max(1, Number(limit) || 50), 100);

    // Les contributions validées (APPROVED) sont automatiquement transférées
    // au catalogue officiel et sortent de la liste des propositions communautaires.
    const statusCondition =
      statusFilter && statusFilter !== 'ALL'
        ? (statusFilter as any)
        : { in: ['PENDING_REVIEW', 'CHANGES_REQUESTED'] };

    const items = await this.prisma.contribution.findMany({
      where: {
        status: statusCondition,
        ...(category && category !== 'all' ? { category: category as any } : {}),
      },
      take: safeLimit,
      select: {
        ...CONTRIBUTION_PUBLIC_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        ...(userId
          ? { votes: { where: { userId }, select: { value: true } } }
          : {}),
      },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
    });

    return items.map((item) => {
      const { votes, ...rest } = item as Record<string, unknown>;

      const userVote =
        (votes as Array<{ value: number }> | undefined)?.[0]?.value ?? 0;
      const isAnonymous = Boolean((rest as any).isAnonymous);
      const isAuthor = Boolean(userId && (rest as any).userId === userId);
      const user = isAnonymous && !isAuthor ? null : (rest as any).user;
      return { ...rest, userVote, user, isAnonymous };
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/:id
  // ───────────────────────────────────────────────────────────────────────────
  async findOne(
    id: string,
    userId?: string,
    role?: string,
  ): Promise<Record<string, any>> {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        ...(userId
          ? { votes: { where: { userId }, select: { value: true } } }
          : {}),
      },
    });

    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const isAdmin = typeof role === 'string' && role.toUpperCase() === 'ADMIN';
    const isAuthor = Boolean(userId && contribution.userId === userId);

    // 🔒 Sécurité stricte : Si non approuvée, accessible uniquement à l'auteur ou à un admin
    if (contribution.status !== 'APPROVED' && !isAuthor && !isAdmin) {
      this.logger.warn(
        `[findOne] Accès refusé pour la contribution ${id} (statut: ${contribution.status}, demandeur: ${userId ?? 'anonyme'}, auteur: ${contribution.userId})`,
      );
      throw new NotFoundException('Contribution introuvable');
    }

    // Incrémenter les vues de façon asynchrone non-bloquante
    void this.prisma.contribution
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    const { votes, ...rest } = contribution as Record<string, unknown>;

    // Filtrer les détails internes de modération si l'utilisateur n'est pas administrateur
    if (!isAdmin) {
      delete rest.moderationDetails;
      delete rest.moderationReason;
      delete rest.adminReviewedBy;
      delete rest.lastNotificationSentAt;
      // Ne laisser adminFeedback que pour l'auteur de la contribution
      if (!isAuthor) {
        delete rest.adminFeedback;
      }
    }

    const isAnonymous = Boolean((rest as any).isAnonymous);
    if (isAnonymous && !isAuthor && !isAdmin) {
      (rest as any).user = null;
    }

    const userVote =
      (votes as Array<{ value: number }> | undefined)?.[0]?.value ?? 0;
    return { ...rest, userVote };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/view
  // ───────────────────────────────────────────────────────────────────────────
  async incrementView(id: string) {
    const existing = await this.prisma.contribution.findUnique({
      where: { id },
      select: { id: true, viewCount: true },
    });

    if (!existing) {
      throw new NotFoundException('Contribution introuvable');
    }

    try {
      await this.redisService.incr(`kanto:views:contribution:${id}`);
    } catch (err) {
      this.logger.debug(
        `[Redis] Incr view contribution optionnel ignoré: ${err}`,
      );
    }

    const updated = await this.prisma.contribution.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    return {
      success: true,
      id: updated.id,
      viewCount: updated.viewCount,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/me
  // ───────────────────────────────────────────────────────────────────────────
  async findMyContributions(userId: string) {
    return this.prisma.contribution.findMany({
      where: { userId },
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/vote
  // ───────────────────────────────────────────────────────────────────────────
  async voteContribution(
    userId: string,
    contributionId: string,
    value: number,
  ) {
    if (![1, -1, 0].includes(value)) {
      throw new BadRequestException(
        'Vote invalide : la valeur doit être 1, -1 ou 0',
      );
    }

    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    // ⛔ Seules les contributions approuvées et publiées peuvent recevoir des votes
    if (contribution.status !== 'APPROVED') {
      throw new BadRequestException(
        'Seules les contributions approuvées et publiées peuvent recevoir des votes',
      );
    }

    // ⛔ Interdire l'auto-vote
    if (contribution.userId === userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas voter pour votre propre contribution',
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const existingVote = await prisma.contributionVote.findUnique({
        where: { userId_contributionId: { userId, contributionId } },
      });

      let scoreDelta = 0;

      if (value === 0) {
        // Annuler le vote existant
        if (existingVote) {
          scoreDelta = -existingVote.value;
          await prisma.contributionVote.delete({
            where: { id: existingVote.id },
          });
        }
      } else if (existingVote) {
        // Modifier le vote existant
        scoreDelta = value - existingVote.value;
        await prisma.contributionVote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      } else {
        // Nouveau vote
        scoreDelta = value;
        await prisma.contributionVote.create({
          data: { userId, contributionId, value },
        });
      }

      let finalScore = contribution.score;
      if (scoreDelta !== 0) {
        const updated = await prisma.contribution.update({
          where: { id: contributionId },
          data: { score: { increment: scoreDelta } },
          select: { id: true, score: true },
        });
        finalScore = updated.score;
      }

      return {
        id: contributionId,
        score: finalScore,
        userVote: value,
      };
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/report
  // ───────────────────────────────────────────────────────────────────────────
  async reportContribution(
    userId: string,
    contributionId: string,
    reason: string,
    description?: string,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, textMg: true, userId: true, status: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    if (contribution.userId === userId) {
      throw new BadRequestException(
        'Vous ne pouvez pas signaler votre propre contribution',
      );
    }

    // Garde-fou anti-spam : vérifier s'il existe déjà un signalement non résolu
    const existingReport = await this.prisma.contentReport.findFirst({
      where: {
        userId,
        contributionId,
        resolved: false,
      },
    });
    if (existingReport) {
      throw new ConflictException(
        'Vous avez déjà transmis un signalement en attente de traitement pour cette contribution.',
      );
    }

    // Valider le motif selon l'énumération ReportReason
    const validReason = Object.values(ReportReason).includes(
      reason as ReportReason,
    )
      ? (reason as ReportReason)
      : ReportReason.OTHER;

    const reportDesc = description?.trim()
      ? `[CONTRIBUTION:${contributionId}] ${validReason} — ${description.trim()}`
      : `[CONTRIBUTION:${contributionId}] ${validReason}`;

    const report = await this.prisma.contentReport.create({
      data: {
        userId,
        contributionId,
        reason: validReason,
        description: reportDesc,
      },
    });

    this.logger.warn(
      `🚩 [Contributions] Signalement reçu pour contribution ${contributionId} par utilisateur ${userId} (Motif: ${validReason})`,
    );

    return {
      success: true,
      message: 'Signalement transmis avec succès aux modérateurs',
      reportId: report.id,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POST /contributions/:id/comments/:commentId/report
  // ───────────────────────────────────────────────────────────────────────────
  async reportComment(
    userId: string,
    contributionId: string,
    commentId: string,
    reason: string,
    description?: string,
  ) {
    const comment = await this.prisma.contributionComment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, contributionId: true },
    });
    if (!comment || comment.contributionId !== contributionId) {
      throw new NotFoundException(
        'Commentaire introuvable pour cette contribution',
      );
    }

    if (comment.userId === userId) {
      throw new BadRequestException(
        'Vous ne pouvez pas signaler votre propre commentaire',
      );
    }

    // Garde-fou anti-spam : vérifier s'il existe déjà un signalement non résolu
    const existingReport = await this.prisma.contentReport.findFirst({
      where: {
        userId,
        commentId,
        resolved: false,
      },
    });
    if (existingReport) {
      throw new ConflictException(
        'Vous avez déjà transmis un signalement en attente de traitement pour ce commentaire.',
      );
    }

    // Valider le motif selon l'énumération ReportReason
    const validReason = Object.values(ReportReason).includes(
      reason as ReportReason,
    )
      ? (reason as ReportReason)
      : ReportReason.OTHER;

    const reportDesc = description?.trim()
      ? `[COMMENT:${commentId}] ${validReason} — ${description.trim()}`
      : `[COMMENT:${commentId}] ${validReason}`;

    const report = await this.prisma.contentReport.create({
      data: {
        userId,
        contributionId,
        commentId,
        reason: validReason,
        description: reportDesc,
      },
    });

    this.logger.warn(
      `🚩 [Commentaires] Signalement reçu pour commentaire ${commentId} par utilisateur ${userId} (Motif: ${validReason})`,
    );

    return {
      success: true,
      message:
        'Signalement du commentaire transmis avec succès aux modérateurs',
      reportId: report.id,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/pending (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async findPending(filters?: {
    status?: string;
    category?: string;
    flagged?: boolean | string;
    search?: string;
  }) {
    const isFlaggedFilter =
      filters?.flagged === true || filters?.flagged === 'true';

    const whereClause: any = {};

    if (filters?.status && filters.status !== 'ALL') {
      whereClause.status = filters.status;
    } else {
      whereClause.OR = [
        { status: 'PENDING_REVIEW' },
        { status: 'CHANGES_REQUESTED' },
        { moderationFlagged: true },
        { isDuplicateConfirmed: true },
        { disputeStatus: 'PENDING' },
        { duplicateScore: { gte: 0.65 } },
      ];
    }

    if (isFlaggedFilter) {
      whereClause.moderationFlagged = true;
    }

    if (filters?.category && filters.category !== 'ALL') {
      whereClause.category = filters.category;
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim();
      whereClause.AND = [
        {
          OR: [
            { textMg: { contains: q, mode: 'insensitive' } },
            { textFr: { contains: q, mode: 'insensitive' } },
            { meaning: { contains: q, mode: 'insensitive' } },
            { user: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    return this.prisma.contribution.findMany({
      where: whereClause,
      select: {
        ...CONTRIBUTION_BASE_SELECT,
        textMg: true,
        textFr: true,
        meaning: true,
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/admin/stats (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async getAdminStats() {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      pendingCount,
      approvedCount,
      rejectedCount,
      flaggedCount,
      changesRequestedCount,
      publishedThisWeek,
      reportsCount,
    ] = await Promise.all([
      this.prisma.contribution.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.contribution.count({ where: { status: 'APPROVED' } }),
      this.prisma.contribution.count({ where: { status: 'REJECTED' } }),
      this.prisma.contribution.count({
        where: { moderationFlagged: true, status: 'PENDING_REVIEW' },
      }),
      this.prisma.contribution.count({
        where: { status: 'CHANGES_REQUESTED' },
      }),
      this.prisma.contribution.count({
        where: {
          status: 'APPROVED',
          updatedAt: { gte: startOfWeek },
        },
      }),
      this.prisma.contentReport
        .count({
          where: {
            OR: [
              { contributionId: { not: null } },
              { commentId: { not: null } },
              { description: { startsWith: '[CONTRIBUTION:' } },
              { description: { startsWith: '[COMMENT:' } },
            ],
            resolved: false,
          },
        })
        .catch((err: unknown) => {
          this.logger.warn(
            `[AdminStats] Impossible de compter les signalements (fallback à 0): ${String(err)}`,
          );
          return 0;
        }),
    ]);

    return {
      pendingCount,
      publishedCount: approvedCount,
      approvedCount,
      rejectedCount,
      flaggedCount,
      changesRequestedCount,
      archivedCount: rejectedCount,
      publishedThisWeek,
      weeklyTarget: 10,
      reportsCount,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/admin/reports (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async getAdminReports() {
    try {
      return await this.prisma.contentReport.findMany({
        where: {
          OR: [
            { contributionId: { not: null } },
            { commentId: { not: null } },
            { description: { startsWith: '[CONTRIBUTION:' } },
            { description: { startsWith: '[COMMENT:' } },
          ],
          resolved: false,
        },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          contribution: {
            select: {
              id: true,
              category: true,
              textMg: true,
              textFr: true,
              status: true,
              user: { select: { id: true, name: true } },
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    } catch (err: unknown) {
      this.logger.error(
        `[AdminReports] Erreur lors de la récupération des signalements: ${String(err)}`,
      );
      return [];
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PATCH /contributions/admin/reports/:id/resolve (Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async resolveReport(reportId: string) {
    return this.prisma.contentReport.update({
      where: { id: reportId },
      data: { resolved: true },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PATCH /contributions/:id/validate (Admin) — Validation & Transfert officiel
  // ───────────────────────────────────────────────────────────────────────────
  async validate(
    id: string,
    approve: boolean,
    adminUserId?: string,
    reason?: string,
    requestChanges?: boolean,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    // Sécurité éditoriale : interdiction stricte de l'auto-validation par l'administrateur
    if (approve && adminUserId && contribution.userId === adminUserId) {
      throw new ForbiddenException(
        'Un administrateur ne peut pas auto-valider sa propre contribution. La revue par un pair est requise.',
      );
    }

    // ── Idempotence stricte : Si déjà validée et transférée, ne pas dupliquer
    if (approve && contribution.status === 'APPROVED' && contribution.officialItemId) {
      this.logger.log(
        `[validate] Contribution ${id} déjà approuvée et intégrée au contenu officiel ${contribution.officialItemId}`,
      );
      return {
        success: true,
        status: 'APPROVED',
        contribution,
        alreadyProcessed: true,
      };
    }

    // ── Cas 1 : Demande de modifications au contributeur ─────────────────────
    if (!approve && requestChanges) {
      const feedback =
        reason ||
        'Des ajustements sont souhaités par l équipe avant de pouvoir valider votre proposition.';

      const updated = await this.prisma.contribution.update({
        where: { id },
        data: {
          status: 'CHANGES_REQUESTED',
          adminFeedback: feedback,
          adminReviewedBy: adminUserId || null,
          adminReviewedAt: new Date(),
        },
        select: {
          ...CONTRIBUTION_BASE_SELECT,
          textMg: true,
          textFr: true,
          meaning: true,
        },
      });

      await this.logAudit({
        contributionId: id,
        userId: adminUserId,
        userRole: 'ADMIN',
        action: 'CHANGES_REQUESTED',
        fromStatus: contribution.status,
        toStatus: 'CHANGES_REQUESTED',
        reason: feedback,
      });

      // Notification centralisée et e-mail à l'auteur
      if (contribution.userId) {
        const preview = contribution.textMg.slice(0, 45);
        void this.eventNotificationService
          .dispatchNotificationEvent({
            type: 'CONTRIBUTION_CHANGES_REQUESTED',
            recipientUserId: contribution.userId,
            contributionId: id,
            contributionTitle: preview,
            category: contribution.category,
            feedbackReason: feedback,
          })
          .catch((err) => {
            this.logger.warn(
              `Échec dispatch CONTRIBUTION_CHANGES_REQUESTED : ${err}`,
            );
          });
      }

      return {
        success: true,
        status: 'CHANGES_REQUESTED',
        contribution: updated,
      };
    }

    // ── Cas 2 : Rejet de la contribution ─────────────────────────────────────
    if (!approve) {
      const rejectionReason =
        reason ||
        'Cette proposition n a pas pu être retenue pour le moment dans le catalogue.';

      const updated = await this.prisma.contribution.update({
        where: { id },
        data: {
          status: 'REJECTED',
          adminFeedback: rejectionReason,
          adminReviewedBy: adminUserId || null,
          adminReviewedAt: new Date(),
        },
        select: {
          ...CONTRIBUTION_BASE_SELECT,
          textMg: true,
          textFr: true,
          meaning: true,
        },
      });

      await this.logAudit({
        contributionId: id,
        userId: adminUserId,
        userRole: 'ADMIN',
        action: 'REJECTED',
        fromStatus: contribution.status,
        toStatus: 'REJECTED',
        reason: rejectionReason,
      });

      // Notification bienveillante et e-mail au contributeur via EventNotificationService
      if (contribution.userId) {
        const preview = contribution.textMg.slice(0, 45);
        void this.eventNotificationService
          .dispatchNotificationEvent({
            type: 'CONTRIBUTION_REJECTED',
            recipientUserId: contribution.userId,
            contributionId: id,
            contributionTitle: preview,
            category: contribution.category,
            feedbackReason: rejectionReason,
          })
          .catch((err) => {
            this.logger.warn(`Échec dispatch CONTRIBUTION_REJECTED : ${err}`);
          });
      }

      return { success: true, status: 'REJECTED', contribution: updated };
    }

    // ── Cas 3 : Approbation + intégration transactionnelle au catalogue officiel ──
    let contributorUser: {
      name: string;
      image: string | null;
      email: string | null;
    } | null = null;
    try {
      contributorUser = await this.prisma.user.findUnique({
        where: { id: contribution.userId },
        select: { name: true, image: true, email: true },
      });
    } catch (userErr) {
      this.logger.warn(
        `Impossible de récupérer les infos de l utilisateur ${contribution.userId}: ${userErr}`,
      );
    }

    const contributorDisplayName =
      contributorUser?.name || 'Contributeur Kanto MG';

    const transactionResult = await this.prisma.$transaction(async (prisma) => {
      const baseSlug =
        generateSlug(contribution.textMg.slice(0, 80)) ||
        `contrib-${contribution.id.slice(-6)}`;

      let officialItemId: string | null = null;
      let officialItemType: string | null = null;
      let officialItemSlug: string | null = null;

      const cat = contribution.category;

      if (
        cat === 'PROVERBE' ||
        cat === 'EXPRESSION' ||
        cat === 'DICTON' ||
        (cat as string) === 'MOT_RARE'
      ) {
        // Vérification de sécurité anti-doublon au sein de la transaction
        const existingItem = await prisma.malagasyItem.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingItem) {
          officialItemId = existingItem.id;
          officialItemType = 'MalagasyItem';
          officialItemSlug = existingItem.slug;
        } else {
          const slug = await this.ensureUniqueSlug(baseSlug, async (s) => {
            const r = await prisma.malagasyItem.findUnique({
              where: { slug: s },
            });
            return !!r;
          });

          const officialCategory =
            cat === 'PROVERBE'
              ? 'PROVERBE'
              : cat === 'DICTON'
              ? 'DICTON'
              : 'EXPRESSION';

          const created = await prisma.malagasyItem.create({
            data: {
              slug,
              malagasy: contribution.textMg,
              french: contribution.textFr,
              meaning: contribution.meaning,
              category: officialCategory as any,
              status: 'PUBLISHED',
              origins: contribution.region ? [contribution.region] : [],
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });
          officialItemId = created.id;
          officialItemType = 'MalagasyItem';
          officialItemSlug = created.slug;
        }
      } else if (cat === 'CITATION') {
        const existingCitation = await prisma.citation.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingCitation) {
          officialItemId = existingCitation.id;
          officialItemType = 'Citation';
          officialItemSlug = existingCitation.id;
        } else {
          const created = await prisma.citation.create({
            data: {
              citationMg: contribution.textMg,
              citationFr: contribution.textFr,
              sourceName: contribution.region ?? 'Communauté Kanto MG',
              contexte: contribution.meaning,
              status: 'PUBLISHED',
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });
          officialItemId = created.id;
          officialItemType = 'Citation';
          officialItemSlug = created.id;
        }
      } else if (cat === 'CONTE') {
        const existingConte = await prisma.conte.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingConte) {
          officialItemId = existingConte.id;
          officialItemType = 'Conte';
          officialItemSlug = existingConte.slug;
        } else {
          let parsedConte: CreateConteContributionDto | null = null;
          try {
            parsedConte = JSON.parse(
              contribution.textMg,
            ) as CreateConteContributionDto;
          } catch {
            // textMg n'est pas un JSON valide — champs bruts
          }

          const rawTitle =
            parsedConte?.title ??
            contribution.textMg.split('\n')[0].slice(0, 80);
          const slug = await this.ensureUniqueSlug(
            generateSlug(rawTitle || baseSlug),
            async (s) => {
              const r = await prisma.conte.findUnique({ where: { slug: s } });
              return !!r;
            },
          );

          const conte = await prisma.conte.create({
            data: {
              slug,
              title: parsedConte?.title ?? rawTitle,
              titleFr:
                parsedConte?.titleFr ??
                (contribution.textFr
                  ? contribution.textFr.split('\n')[0].slice(0, 80)
                  : 'Conte traditionnel'),
              moralMg: parsedConte?.moralMg ?? contribution.meaning,
              moralFr: parsedConte?.moralFr,
              source:
                parsedConte?.source ??
                contribution.region ??
                'Communauté Kanto MG',
              status: 'PUBLISHED',
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });

          if (parsedConte?.paragraphs?.length) {
            await prisma.conteParagraph.createMany({
              data: parsedConte.paragraphs.map((p) => ({
                conteId: conte.id,
                paragraphNumber: p.paragraphNumber,
                textMg: p.textMg,
                textFr: p.textFr,
              })),
            });
          }

          officialItemId = conte.id;
          officialItemType = 'Conte';
          officialItemSlug = conte.slug;
        }
      } else if (cat === 'KABARY') {
        const existingKabary = await prisma.kabary.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingKabary) {
          officialItemId = existingKabary.id;
          officialItemType = 'Kabary';
          officialItemSlug = existingKabary.slug;
        } else {
          let parsedKabary: CreateKabaryContributionDto | null = null;
          try {
            parsedKabary = JSON.parse(
              contribution.textMg,
            ) as CreateKabaryContributionDto;
          } catch {
            // textMg n'est pas un JSON valide — champs bruts
          }

          const rawTitle =
            parsedKabary?.title ??
            contribution.textMg.split('\n')[0].slice(0, 80);
          const slug = await this.ensureUniqueSlug(
            generateSlug(rawTitle || baseSlug),
            async (s) => {
              const r = await prisma.kabary.findUnique({ where: { slug: s } });
              return !!r;
            },
          );

          const kabary = await prisma.kabary.create({
            data: {
              slug,
              title: parsedKabary?.title ?? rawTitle,
              titleFr:
                parsedKabary?.titleFr ??
                (contribution.textFr
                  ? contribution.textFr.split('\n')[0].slice(0, 80)
                  : 'Discours rituel'),
              occasion:
                parsedKabary?.occasion ??
                contribution.meaning ??
                'Kabary iombonana',
              occasionFr: parsedKabary?.occasionFr,
              speakerRoleMg: parsedKabary?.speakerRoleMg,
              speakerRoleFr: parsedKabary?.speakerRoleFr,
              recipientRoleMg: parsedKabary?.recipientRoleMg,
              recipientRoleFr: parsedKabary?.recipientRoleFr,
              region: parsedKabary?.region ?? contribution.region,
              concludingProverbMg: parsedKabary?.concludingProverbMg,
              status: 'PUBLISHED',
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });

          if (parsedKabary?.steps?.length) {
            await prisma.kabaryStep.createMany({
              data: parsedKabary.steps.map((s) => ({
                kabaryId: kabary.id,
                stepNumber: s.stepNumber,
                stepNameMg: s.stepNameMg,
                stepNameFr: s.stepNameFr,
                textMg: s.textMg,
                textFr: s.textFr,
                explanationFr: s.explanationFr,
              })),
            });
          }

          officialItemId = kabary.id;
          officialItemType = 'Kabary';
          officialItemSlug = kabary.slug;
        }
      } else if (cat === 'POESIE' || (cat as string) === 'TONONKALO') {
        const existingPoesie = await prisma.poesie.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingPoesie) {
          officialItemId = existingPoesie.id;
          officialItemType = 'Poesie';
          officialItemSlug = existingPoesie.slug;
        } else {
          const titleMg =
            contribution.textMg.split('\n')[0].slice(0, 80) || 'Tononkalo';
          const titleFr = contribution.textFr
            ? contribution.textFr.split('\n')[0].slice(0, 80)
            : 'Poésie';
          const slug = await this.ensureUniqueSlug(
            generateSlug(titleMg || baseSlug),
            async (s) => {
              const r = await prisma.poesie.findUnique({ where: { slug: s } });
              return !!r;
            },
          );

          const poesie = await prisma.poesie.create({
            data: {
              slug,
              title: titleMg,
              titleFr: titleFr,
              author: contributorDisplayName,
              category: 'tononkalo',
              explanationMg: contribution.meaning,
              explanationFr: contribution.meaning,
              status: 'PUBLISHED',
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });

          const versesMg = contribution.textMg
            .split('\n')
            .filter((l) => l.trim().length > 0);
          const versesFr = contribution.textFr
            ? contribution.textFr.split('\n').filter((l) => l.trim().length > 0)
            : [];

          await prisma.poesieStanza.create({
            data: {
              poesieId: poesie.id,
              stanzaNumber: 1,
              versesMg,
              versesFr,
            },
          });

          officialItemId = poesie.id;
          officialItemType = 'Poesie';
          officialItemSlug = poesie.slug;
        }
      } else if (cat === 'RECITATION' || (cat as string) === 'TSIANJERY') {
        const existingRecitation = await prisma.recitation.findFirst({
          where: { contributionId: contribution.id },
        });

        if (existingRecitation) {
          officialItemId = existingRecitation.id;
          officialItemType = 'Recitation';
          officialItemSlug = existingRecitation.slug;
        } else {
          const titleMg =
            contribution.textMg.split('\n')[0].slice(0, 80) || 'Tsianjery';
          const titleFr = contribution.textFr
            ? contribution.textFr.split('\n')[0].slice(0, 80)
            : 'Récitation';
          const slug = await this.ensureUniqueSlug(
            generateSlug(titleMg || baseSlug),
            async (s) => {
              const r = await prisma.recitation.findUnique({
                where: { slug: s },
              });
              return !!r;
            },
          );

          const recitation = await prisma.recitation.create({
            data: {
              slug,
              title: titleMg,
              titleFr: titleFr,
              author: contributorDisplayName,
              description: contribution.meaning,
              contentLines: contribution.textMg
                .split('\n')
                .filter((l) => l.trim().length > 0),
              references: contribution.region
                ? [contribution.region]
                : ['Lovantsofina'],
              status: 'PUBLISHED',
              contributorId: contribution.userId,
              contributorName: contributorDisplayName,
              contributionId: contribution.id,
              isCommunityContribution: true,
            },
          });

          officialItemId = recitation.id;
          officialItemType = 'Recitation';
          officialItemSlug = recitation.slug;
        }
      }

      // Mise à jour de la contribution en APPROVED avec références officielles
      const validated = await prisma.contribution.update({
        where: { id },
        data: {
          status: 'APPROVED',
          officialItemId,
          officialItemType,
          officialItemSlug,
          publishedAt: new Date(),
          adminReviewedBy: adminUserId || null,
          adminReviewedAt: new Date(),
        },
        select: {
          ...CONTRIBUTION_BASE_SELECT,
          textMg: true,
          textFr: true,
          meaning: true,
        },
      });

      // +50 XP au contributeur
      const updatedProgress = await prisma.userProgress.upsert({
        where: { userId: validated.userId },
        update: { totalXp: { increment: 50 } },
        create: { userId: validated.userId, totalXp: 50 },
      });

      return {
        validated,
        updatedProgress,
        officialItemId,
        officialItemType,
        officialItemSlug,
      };
    });

    // Enregistrement de l'audit log d'approbation
    await this.logAudit({
      contributionId: id,
      userId: adminUserId,
      userRole: 'ADMIN',
      action: 'APPROVED',
      fromStatus: contribution.status,
      toStatus: 'APPROVED',
      reason:
        reason ||
        `Contribution validée et intégrée au catalogue officiel (${transactionResult.officialItemType || 'Contenu'})`,
    });

    // Invalidation immédiate des caches Redis du catalogue officiel
    try {
      await Promise.allSettled([
        this.redisService.delByPattern('items:*'),
        this.redisService.delByPattern('citations:*'),
        this.redisService.delByPattern('contes:*'),
        this.redisService.delByPattern('kabaries:*'),
        this.redisService.delByPattern('poesies:*'),
        this.redisService.delByPattern('recitations:*'),
        this.redisService.delByPattern('categories:*'),
        this.redisService.delByPattern('search:*'),
      ]);
      this.logger.log(
        `[validate] Caches Redis du catalogue officiel invalidés avec succès suite à la publication de la contribution ${id}`,
      );
    } catch (cacheErr) {
      this.logger.warn(`Échec invalidation cache Redis après validation : ${cacheErr}`);
    }

    // 1. Notification temps réel du classement
    try {
      const payload: LeaderboardRealtimePayload = {
        userId: transactionResult.validated.userId,
        totalXp: Number(transactionResult.updatedProgress.totalXp),
        level: transactionResult.updatedProgress.level || 1,
        streakDays: transactionResult.updatedProgress.streakDays || 0,
        name: contributorDisplayName,
        image: contributorUser?.image || null,
        xpDelta: 50,
        source: 'contribution_approved',
        timestamp: Date.now(),
      };
      await this.redisService.publish(REALTIME_CHANNELS.LEADERBOARD, payload);
    } catch (err) {
      this.logger.warn(
        `⚠️ Impossible de publier la mise à jour leaderboard pour le contributeur ${transactionResult.validated.userId}: ${err}`,
      );
    }

    // 2. Notification in-app, push et e-mail de félicitations
    const textPreview = transactionResult.validated.textMg.slice(0, 45);
    void this.eventNotificationService
      .dispatchNotificationEvent({
        type: 'CONTRIBUTION_APPROVED',
        recipientUserId: transactionResult.validated.userId,
        contributionId: transactionResult.validated.id,
        contributionTitle: textPreview,
        category: transactionResult.validated.category,
        xpReward: 50,
      })
      .catch((notifErr) => {
        this.logger.warn(
          `⚠️ [Contributions] Échec dispatch CONTRIBUTION_APPROVED pour ${transactionResult.validated.userId} : ${notifErr}`,
        );
      });

    return {
      success: true,
      status: 'APPROVED',
      contribution: transactionResult.validated,
      officialItemId: transactionResult.officialItemId,
      officialItemType: transactionResult.officialItemType,
      officialItemSlug: transactionResult.officialItemSlug,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PATCH /contributions/:id (Auteur ou Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async update(
    id: string,
    userId: string,
    role: string,
    dto: UpdateContributionDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isAuthor = contribution.userId === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres contributions',
      );
    }

    if (
      !isAdmin &&
      (contribution.status === 'APPROVED' || contribution.status === 'ARCHIVED')
    ) {
      throw new BadRequestException(
        'Une contribution approuvée ou archivée ne peut pas être modifiée.',
      );
    }

    // 🔒 Les contributions soumises pour vérification ne peuvent plus être modifiées (aucun délai de dépassement)
    if (!isAdmin && contribution.status === 'PENDING_REVIEW') {
      throw new BadRequestException({
        statusCode: 400,
        error: 'CONTRIBUTION_PENDING_REVIEW_LOCKED',
        message:
          'Une contribution soumise pour vérification ne peut plus être modifiée.',
      });
    }

    const isDraft = contribution.status === 'DRAFT';
    const isChangesRequested = contribution.status === 'CHANGES_REQUESTED';
    const isPending = contribution.status === 'PENDING_REVIEW';

    const newTextMg =
      dto.textMg !== undefined ? dto.textMg : contribution.textMg;
    const newTextFr =
      dto.textFr !== undefined ? dto.textFr : contribution.textFr;
    const newMeaning =
      dto.meaning !== undefined ? dto.meaning : contribution.meaning;
    const newCategory = dto.category || contribution.category;
    const newRegion =
      dto.region !== undefined ? dto.region : contribution.region;

    const textChanged =
      (dto.textMg !== undefined && dto.textMg !== contribution.textMg) ||
      (dto.textFr !== undefined && dto.textFr !== contribution.textFr) ||
      (dto.meaning !== undefined && dto.meaning !== contribution.meaning);

    const updatedDraft = await this.prisma.contribution.update({
      where: { id },
      data: {
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.textMg !== undefined ? { textMg: dto.textMg } : {}),
        ...(dto.textFr !== undefined ? { textFr: dto.textFr } : {}),
        ...(dto.meaning !== undefined ? { meaning: dto.meaning } : {}),
        ...(dto.region !== undefined ? { region: dto.region } : {}),
        ...(dto.isAnonymous !== undefined
          ? { isAnonymous: Boolean(dto.isAnonymous) }
          : {}),
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    if (isDraft && dto.submit) {
      const res = await this.processSubmissionModeration({
        contributionId: id,
        fields: {
          category: newCategory,
          textMg: newTextMg,
          textFr: newTextFr,
          meaning: newMeaning,
          region: newRegion,
        },
        userId: contribution.userId,
        previousStatus: 'DRAFT',
        titlePreview: (newTextMg || '').slice(0, 45),
      });
      return { success: true, contribution: res.contribution };
    }

    if (isChangesRequested || (isPending && textChanged)) {
      const res = await this.processSubmissionModeration({
        contributionId: id,
        fields: {
          category: newCategory,
          textMg: newTextMg,
          textFr: newTextFr,
          meaning: newMeaning,
          region: newRegion,
        },
        userId: contribution.userId,
        previousStatus: contribution.status,
        titlePreview: (newTextMg || '').slice(0, 45),
      });
      return { success: true, contribution: res.contribution };
    }

    await this.logAudit({
      contributionId: id,
      userId,
      userRole: isAdmin ? 'ADMIN' : 'USER',
      action: 'UPDATED',
      fromStatus: contribution.status,
      toStatus: contribution.status,
    });

    return { success: true, contribution: updatedDraft };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DELETE /contributions/:id (Auteur dans les 24h ou Admin)
  // ───────────────────────────────────────────────────────────────────────────
  async remove(id: string, userId: string, role: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isAuthor = contribution.userId === userId;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres contributions',
      );
    }

    // 🔒 Les contributions soumises pour vérification ne peuvent plus être supprimées (aucun délai de dépassement)
    if (!isAdmin && contribution.status === 'PENDING_REVIEW') {
      throw new BadRequestException({
        statusCode: 400,
        error: 'CONTRIBUTION_PENDING_REVIEW_LOCKED',
        message:
          'Une contribution soumise pour vérification ne peut plus être supprimée.',
      });
    }

    if (
      !isAdmin &&
      (contribution.status === 'APPROVED' || contribution.status === 'ARCHIVED')
    ) {
      throw new BadRequestException(
        'Une contribution approuvée ou archivée ne peut pas être supprimée par son auteur.',
      );
    }

    await this.logAudit({
      contributionId: id,
      userId,
      userRole: isAdmin ? 'ADMIN' : 'USER',
      action: contribution.status === 'DRAFT' ? 'DELETED' : 'ARCHIVED',
      fromStatus: contribution.status,
      toStatus: 'ARCHIVED',
    });

    if (contribution.status === 'DRAFT') {
      await this.prisma.contribution.delete({
        where: { id },
      });
      return { success: true, message: 'Brouillon supprimé définitivement' };
    }

    // Pour les contributions soumises ou approuvées : archivage logique préservant l'intégrité
    await this.prisma.contribution.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { success: true, message: 'Contribution archivée avec succès' };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /contributions/:id/audit-logs (Admin & Modérateurs)
  // ───────────────────────────────────────────────────────────────────────────
  async getAuditLogs(contributionId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    return this.prisma.contributionAuditLog.findMany({
      where: { contributionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // COMMENTAIRES COMMUNAUTAIRES (Utilisateurs et Propriétaire)
  // ───────────────────────────────────────────────────────────────────────────

  /** GET /contributions/:id/comments — Liste des commentaires */
  async getComments(contributionId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, userId: true, status: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const comments = await this.prisma.contributionComment.findMany({
      where: { contributionId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return comments.map((c) => ({
      ...c,
      isOwner: c.userId === contribution.userId,
    }));
  }

  /** POST /contributions/:id/comments — Ajouter un commentaire ou une réponse */
  async addComment(
    userId: string,
    contributionId: string,
    dto: CreateContributionCommentDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: {
        id: true,
        userId: true,
        status: true,
        isDuplicateConfirmed: true,
        markedForDeletionAt: true,
      },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    // ⛔ Contribution archivée
    if (contribution.status === 'ARCHIVED') {
      throw new BadRequestException(
        'Cette contribution est archivée et ne peut plus recevoir de commentaires.',
      );
    }

    // ⛔ Règle stricte : Interdiction formelle de commenter si la contribution est marquée comme doublon
    if (
      contribution.isDuplicateConfirmed ||
      (contribution.markedForDeletionAt &&
        contribution.markedForDeletionAt > new Date())
    ) {
      throw new BadRequestException(
        'Les commentaires sont désactivés pour cette contribution signalée comme doublon.',
      );
    }

    const trimmedContent = dto.content.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Le commentaire ne peut pas être vide.');
    }

    // 🛡️ Modération automatique du contenu du commentaire
    const modResult = this.contentModerationService.moderateContent({
      content: trimmedContent,
    });
    if (modResult.isFlagged) {
      this.logger.warn(
        `🚩 [Commentaires] Contenu bloqué pour utilisateur ${userId}: ${modResult.summary}`,
      );
      throw new BadRequestException(
        'Votre commentaire contient des propos non conformes à notre charte de respect communautaire.',
      );
    }

    // 🌿 Gestion de la réponse hiérarchique (1 niveau d'imbrication max sur mobile)
    let effectiveParentId: string | null = null;
    let parentCommentAuthorId: string | null = null;
    if (dto.parentId) {
      const parentComment = await this.prisma.contributionComment.findUnique({
        where: { id: dto.parentId },
        select: {
          id: true,
          contributionId: true,
          parentId: true,
          userId: true,
        },
      });
      if (!parentComment || parentComment.contributionId !== contributionId) {
        throw new BadRequestException(
          'Le commentaire parent spécifié est introuvable sur cette contribution.',
        );
      }
      parentCommentAuthorId = parentComment.userId;
      // Si le parent est déjà une réponse, rattacher au parent racine pour éviter les arbres profonds
      effectiveParentId = parentComment.parentId || parentComment.id;
    }

    const comment = await this.prisma.contributionComment.create({
      data: {
        userId,
        contributionId,
        parentId: effectiveParentId,
        content: trimmedContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Notifier l'auteur de la contribution s'il ne s'agit pas de son propre commentaire
    if (contribution.userId && contribution.userId !== userId) {
      const commenterName = comment.user?.name || 'Mpikambana iray';
      try {
        await this.notificationsService.createNotification({
          titleMg: "Hevitra vaovao tamin'ny fandraisana anjara 💬",
          titleFr: 'Nouveau commentaire sur votre contribution 💬',
          messageMg: `Nandray anjara tamin'ny dinika i ${commenterName} ary namela hevitra tamin'ny fandraisana anjaranao.`,
          messageFr: `${commenterName} a partagé un commentaire et enrichi l'échange autour de votre contribution.`,
          category: 'community',
          badgeText: 'Hevitra',
          badgeType: 'info',
          iconName: 'chatbubble-ellipses-outline',
          iconColor: '#2563EB',
          isBroadcast: false,
          userId: contribution.userId,
          targetRoute: '/(tabs)/communaute',
        });
      } catch (notifErr) {
        this.logger.error(
          'Erreur envoi notification commentaire à l’auteur :',
          notifErr,
        );
      }
    }

    // Notifier également l'auteur du commentaire parent s'il s'agit d'une réponse
    if (
      parentCommentAuthorId &&
      parentCommentAuthorId !== userId &&
      parentCommentAuthorId !== contribution.userId
    ) {
      const replierName = comment.user?.name || 'Mpikambana iray';
      try {
        await this.notificationsService.createNotification({
          titleMg: 'Valin-kafatra tamin’ny hevitrao 💬',
          titleFr: 'Réponse à votre commentaire 💬',
          messageMg: `Namaly ny hevitrao teo amin'ny fandraisana anjara i ${replierName}.`,
          messageFr: `${replierName} a répondu à votre commentaire sur la contribution.`,
          category: 'community',
          badgeText: 'Hevitra',
          badgeType: 'info',
          iconName: 'chatbubble-ellipses-outline',
          iconColor: '#2563EB',
          isBroadcast: false,
          userId: parentCommentAuthorId,
          targetRoute: '/(tabs)/communaute',
        });
      } catch (replyNotifErr) {
        this.logger.warn(
          `Erreur notification réponse commentaire : ${replyNotifErr}`,
        );
      }
    }

    const formattedComment = {
      ...comment,
      isOwner: comment.userId === contribution.userId,
    };

    // Diffusion temps réel via Redis Pub/Sub
    void this.redisService.publish(REDIS_CHANNEL_COMMENTS, {
      action: 'create',
      contributionId,
      comment: formattedComment,
    });

    return {
      success: true,
      comment: formattedComment,
    };
  }

  /** PATCH /contributions/:id/comments/:commentId — Modifier un commentaire (dans les 2 min ou admin) */
  async updateComment(
    userId: string,
    role: string,
    contributionId: string,
    commentId: string,
    dto: CreateContributionCommentDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      select: { id: true, userId: true },
    });
    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const comment = await this.prisma.contributionComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire introuvable');

    if (comment.contributionId !== contributionId) {
      throw new BadRequestException(
        'Ce commentaire n’appartient pas à cette contribution',
      );
    }

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isCommentAuthor = comment.userId === userId;

    if (!isCommentAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres commentaires',
      );
    }

    if (!isAdmin) {
      const diffMinutes =
        (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60);
      if (diffMinutes > 2) {
        throw new BadRequestException(
          'Vous ne pouvez modifier un commentaire que dans les 2 minutes suivant sa publication',
        );
      }
    }

    const trimmedContent = dto.content.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Le commentaire ne peut pas être vide.');
    }

    // 🛡️ Modération automatique du contenu modifié
    const modResult = this.contentModerationService.moderateContent({
      content: trimmedContent,
    });
    if (modResult.isFlagged) {
      this.logger.warn(
        `🚩 [Commentaires] Modification bloquée pour contenu suspect par ${userId}: ${modResult.summary}`,
      );
      throw new BadRequestException(
        'Votre modification contient des propos non conformes à notre charte de respect communautaire.',
      );
    }

    const updated = await this.prisma.contributionComment.update({
      where: { id: commentId },
      data: {
        content: trimmedContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    const formattedComment = {
      ...updated,
      isOwner: updated.userId === contribution.userId,
    };

    // Diffusion temps réel via Redis Pub/Sub
    void this.redisService.publish(REDIS_CHANNEL_COMMENTS, {
      action: 'update',
      contributionId,
      comment: formattedComment,
    });

    return {
      success: true,
      comment: formattedComment,
    };
  }

  /** DELETE /contributions/:id/comments/:commentId — Supprimer un commentaire (dans les 5 min ou admin) */
  async removeComment(
    userId: string,
    role: string,
    contributionId: string,
    commentId: string,
  ) {
    const comment = await this.prisma.contributionComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Commentaire introuvable');

    if (comment.contributionId !== contributionId) {
      throw new BadRequestException(
        'Ce commentaire n’appartient pas à cette contribution',
      );
    }

    const isAdmin = role === 'ADMIN' || role === 'admin';
    const isCommentAuthor = comment.userId === userId;

    if (!isCommentAuthor && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres commentaires',
      );
    }

    if (!isAdmin) {
      const diffMinutes =
        (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60);
      if (diffMinutes > 5) {
        throw new BadRequestException(
          'Vous ne pouvez supprimer un commentaire que dans les 5 minutes suivant sa publication',
        );
      }
    }

    await this.prisma.contributionComment.delete({
      where: { id: commentId },
    });

    // Diffusion temps réel via Redis Pub/Sub
    void this.redisService.publish(REDIS_CHANNEL_COMMENTS, {
      action: 'delete',
      contributionId,
      commentId,
    });

    return { success: true, message: 'Commentaire supprimé avec succès' };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GESTION DES DOUBLONS, CONTESTATIONS & SUPPRESSION AUTOMATIQUE (24H)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Vérification prédictive de doublons en temps réel (pour l'UX mobile avant soumission)
   */
  async previewCheckDuplicate(dto: CheckDuplicateDto) {
    const result = await this.duplicateDetectionService.detectDuplicate(
      dto.textMg,
      dto.category,
      dto.excludeContributionId,
      0.65, // Seuil de prévention UX
    );

    return {
      hasPotentialDuplicate: result.isDuplicate,
      similarityScore: result.score,
      targetId: result.targetId,
      targetType: result.targetType,
      targetTitle: result.targetTitle,
      explanation: result.explanation,
    };
  }

  /**
   * Confirmation d'un doublon par un modérateur/admin :
   * - Enclenche le compte à rebours de 24h
   * - Envoie une notification explicative au contributeur
   */
  async confirmDuplicate(adminId: string, contributionId: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
      include: { user: { select: { id: true, name: true } } },
    });

    if (!contribution) throw new NotFoundException('Contribution introuvable');

    const deletionTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 heures

    const updated = await this.prisma.contribution.update({
      where: { id: contributionId },
      data: {
        isDuplicateConfirmed: true,
        markedForDeletionAt: deletionTime,
        status: 'DRAFT', // Retirée de la visibilité publique
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    // Envoi de la notification d'avertissement et droit de recours
    const textPreview = contribution.textMg.slice(0, 45);
    try {
      await this.notificationsService.createNotification({
        titleMg: 'Fandraisana anjara : Voamarika ho dika mitovy',
        titleFr: 'Contribution : Signalée comme doublon',
        messageMg: `Voamarika ho dika mitovy ny fandraisana anjaranao (« ${textPreview}... ») ary ho voafafa afaka 24 ora. Raha heverinao fa diso izany dia azonao atao ny manome hevitra na manao fitarainana.`,
        messageFr: `Votre contribution (« ${textPreview}... ») a été identifiée comme doublon et sera supprimée dans 24h. Vous pouvez déposer une réclamation depuis votre profil si vous contestez cette décision.`,
        category: 'community',
        badgeText: 'Dika mitovy',
        badgeType: 'info',
        iconName: 'warning-outline',
        iconColor: '#EA580C',
        isBroadcast: false,
        userId: contribution.userId,
        targetRoute: '/(tabs)/profil',
      });
    } catch (notifErr) {
      this.logger.error(
        'Erreur notification doublon au contributeur :',
        notifErr,
      );
    }

    return {
      success: true,
      message: 'Doublon confirmé. Suppression programmée dans 24h.',
      contribution: updated,
    };
  }

  /**
   * Dépôt d'une réclamation / avis par le contributeur :
   * - Suspend immédiatement le compte à rebours de suppression (markedForDeletionAt = null)
   * - Passe le statut de litige à 'PENDING'
   */
  async submitDispute(
    userId: string,
    contributionId: string,
    dto: DisputeContributionDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
    });

    if (!contribution) throw new NotFoundException('Contribution introuvable');

    if (contribution.userId !== userId) {
      throw new ForbiddenException(
        'Seul l’auteur peut déposer une réclamation pour cette contribution',
      );
    }

    if (!contribution.isDuplicateConfirmed) {
      throw new BadRequestException(
        'Cette contribution n’est pas marquée comme doublon',
      );
    }

    // Gel du compte à rebours de 24h et enregistrement de l'avis
    const updated = await this.prisma.contribution.update({
      where: { id: contributionId },
      data: {
        disputeMessage: dto.message.trim(),
        disputeStatus: 'PENDING',
        disputedAt: new Date(),
        markedForDeletionAt: null, // Compte à rebours suspendu !
      },
      select: CONTRIBUTION_BASE_SELECT,
    });

    return {
      success: true,
      message:
        'Votre réclamation a été transmise à l’équipe de modération. La suppression automatique est suspendue.',
      contribution: updated,
    };
  }

  /**
   * Arbitrage de l'administrateur sur la réclamation :
   * - Si acceptée : la contribution est réhabilitée (isDuplicateConfirmed: false, disputeStatus: 'ACCEPTED')
   * - Si rejetée : la réclamation est refusée et un compte à rebours final de 24h est relancé
   */
  async resolveDispute(
    adminId: string,
    contributionId: string,
    dto: ResolveDisputeDto,
  ) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id: contributionId },
    });

    if (!contribution) throw new NotFoundException('Contribution introuvable');

    if (contribution.disputeStatus !== 'PENDING') {
      throw new BadRequestException(
        'Aucune réclamation en attente pour cette contribution',
      );
    }

    if (dto.approve) {
      // Réclamation acceptée : réhabilitation de la contribution
      const updated = await this.prisma.contribution.update({
        where: { id: contributionId },
        data: {
          isDuplicateConfirmed: false,
          disputeStatus: 'ACCEPTED',
          markedForDeletionAt: null,
          status: 'APPROVED',
        },
        select: CONTRIBUTION_BASE_SELECT,
      });

      try {
        await this.notificationsService.createNotification({
          titleMg: 'Fitarainana nekena : Naverina navoaka ! ✅',
          titleFr: 'Réclamation acceptée : Contribution rétablie ! ✅',
          messageMg: `Nekena ny fanazavanao momba ny fandraisana anjara (« ${contribution.textMg.slice(0, 45)}... »). Naverina navoaka ho hitan'ny rehetra izany. Misaotra anao !`,
          messageFr: `Votre réclamation a été validée avec succès pour (« ${contribution.textMg.slice(0, 45)}... »). Votre contribution est de nouveau visible par la communauté !`,
          category: 'community',
          badgeText: 'Nekena',
          badgeType: 'reward',
          iconName: 'checkmark-circle-outline',
          iconColor: '#10B981',
          isBroadcast: false,
          userId: contribution.userId,
          targetRoute: '/(tabs)/profil',
        });
      } catch (e) {
        this.logger.error('Erreur notification réclamation acceptée:', e);
      }

      return {
        success: true,
        message: 'Réclamation acceptée. La contribution a été rétablie.',
        contribution: updated,
      };
    } else {
      // Réclamation rejetée : relance du compte à rebours final de 24h
      const finalDeletionTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const updated = await this.prisma.contribution.update({
        where: { id: contributionId },
        data: {
          disputeStatus: 'REJECTED',
          markedForDeletionAt: finalDeletionTime,
        },
        select: CONTRIBUTION_BASE_SELECT,
      });

      try {
        await this.notificationsService.createNotification({
          titleMg: 'Fitarainana nolavina',
          titleFr: 'Réclamation refusée',
          messageMg: `Tsy nekena ny fitarainana nataonao. Hovoafafa afaka 24 ora ny fandraisana anjaranao (« ${contribution.textMg.slice(0, 45)}... »). ${dto.note ? `Fanazavana : ${dto.note}` : ''}`,
          messageFr: `Votre réclamation a été refusée. La contribution (« ${contribution.textMg.slice(0, 45)}... ») sera définitivement supprimée dans 24h. ${dto.note ? `Motif : ${dto.note}` : ''}`,
          category: 'community',
          badgeText: 'Nolavina',
          badgeType: 'info',
          iconName: 'close-circle-outline',
          iconColor: '#EF4444',
          isBroadcast: false,
          userId: contribution.userId,
          targetRoute: '/(tabs)/profil',
        });
      } catch (e) {
        this.logger.error('Erreur notification réclamation rejetée:', e);
      }

      return {
        success: true,
        message: 'Réclamation rejetée. Suppression définitive dans 24h.',
        contribution: updated,
      };
    }
  }

  /**
   * Purge automatique des contributions dont le délai de 24h est expiré
   * et sans réclamation en attente
   */
  async purgeExpiredDuplicates(): Promise<{ purgedCount: number }> {
    const now = new Date();

    const expired = await this.prisma.contribution.findMany({
      where: {
        isDuplicateConfirmed: true,
        markedForDeletionAt: { lte: now, not: null },
        disputeStatus: { not: 'PENDING' }, // Ne jamais supprimer si une contestation est en cours d'examen !
      },
      select: { id: true },
    });

    if (expired.length === 0) {
      return { purgedCount: 0 };
    }

    const ids = expired.map((e) => e.id);
    await this.prisma.contribution.deleteMany({
      where: { id: { in: ids } },
    });

    this.logger.log(
      `🧹 ${ids.length} contribution(s) doublon(s) expirée(s) supprimée(s) automatiquement.`,
    );
    return { purgedCount: ids.length };
  }
}
