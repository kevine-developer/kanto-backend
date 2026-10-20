import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { BadgesService } from '../badges/badges.service.js';
import {
  CreateEventDto,
  CreateEventRewardDto,
  DistributeRewardsDto,
  EventQueryDto,
  SubmitEventProgressDto,
  UpdateEventDto,
  UpdateEventStatusDto,
} from './dto/events.dto.js';
import {
  EventCategory,
  EventParticipationStatus,
  EventParticipationType,
  EventRewardType,
  EventStatus,
} from '../../generated/prisma/client.js';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly progressionService: ProgressionService,
    private readonly notificationsService: NotificationsService,
    private readonly badgesService: BadgesService,
  ) {}

  /**
   * Masque l'identité pour respecter la vie privée (RGPD).
   */
  private formatMaskedName(name?: string | null, username?: string | null): string {
    if (username && username.trim()) {
      const u = username.trim().replace(/^@/, '');
      if (u.length <= 3) return `@${u}`;
      return `@${u.slice(0, 3)}***`;
    }
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      const firstName = parts[0];
      const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
      return `${firstName} ${lastInitial}.`;
    }
    return 'Membre Kanto';
  }

  /**
   * Génère un slug URL convivial et unique à partir du titre.
   */
  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
    const suffix = Date.now().toString(36).slice(-4);
    return `${base || 'evenement'}-${suffix}`;
  }

  // ─── ENDPOINTS PUBLICS ET UTILISATEUR ─────────────────────────────────────────

  /**
   * Récupère la liste des événements publics visibles (PUBLISHED, ACTIVE, COMPLETED).
   */
  async getPublicEvents(query: EventQueryDto, userId?: string) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const where: any = {
      status: {
        in: [EventStatus.PUBLISHED, EventStatus.ACTIVE, EventStatus.COMPLETED],
      },
    };

    if (query.category) {
      where.category = query.category as EventCategory;
    }

    if (query.status) {
      where.status = query.status as EventStatus;
    }

    if (query.featured) {
      where.isFeatured = true;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { titleMg: { contains: term, mode: 'insensitive' } },
        { titleFr: { contains: term, mode: 'insensitive' } },
        { descriptionMg: { contains: term, mode: 'insensitive' } },
        { descriptionFr: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (query.myEvents && userId) {
      where.participations = {
        some: {
          userId,
          status: { not: EventParticipationStatus.CANCELLED },
        },
      };
    }

    const [total, events] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        include: {
          rewards: {
            select: {
              id: true,
              rewardType: true,
              titleMg: true,
              titleFr: true,
              amount: true,
              badgeId: true,
              criteria: true,
            },
          },
          ...(userId
            ? {
                participations: {
                  where: { userId },
                  select: {
                    id: true,
                    status: true,
                    score: true,
                    progressPercent: true,
                    completedAt: true,
                  },
                },
              }
            : {}),
        },
        orderBy: [
          { isFeatured: 'desc' },
          { startDate: 'asc' },
        ],
        skip,
        take: limit,
      }),
    ]);

    return {
      items: events.map((event) => {
        const userParticipation =
          userId && (event as any).participations?.length > 0
            ? (event as any).participations[0]
            : null;
        const { participations, ...rest } = event as any;
        return {
          ...rest,
          userParticipation,
        };
      }),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère l'événement vedette actif ou à venir pour la page d'accueil.
   */
  async getFeaturedEvent(userId?: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        status: { in: [EventStatus.PUBLISHED, EventStatus.ACTIVE] },
        isFeatured: true,
      },
      include: {
        rewards: true,
        ...(userId
          ? {
              participations: {
                where: { userId },
                select: {
                  id: true,
                  status: true,
                  score: true,
                  progressPercent: true,
                },
              },
            }
          : {}),
      },
      orderBy: { startDate: 'asc' },
    });

    if (!event) return null;

    const userParticipation =
      userId && (event as any).participations?.length > 0
        ? (event as any).participations[0]
        : null;

    const { participations, ...rest } = event as any;
    return {
      ...rest,
      userParticipation,
    };
  }

  /**
   * Récupère la fiche détaillée d'un événement par son ID ou son slug.
   */
  async getEventBySlugOrId(idOrSlug: string, userId?: string) {
    const isId = idOrSlug.startsWith('c') && idOrSlug.length > 20;

    const event = await this.prisma.event.findFirst({
      where: isId ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        rewards: true,
        ...(userId
          ? {
              participations: {
                where: { userId },
                include: {
                  rewardClaims: true,
                },
              },
            }
          : {}),
      },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    // Incrément non-bloquant des vues
    void this.prisma.event.update({
      where: { id: event.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    const userParticipation =
      userId && (event as any).participations?.length > 0
        ? (event as any).participations[0]
        : null;

    const { participations, ...rest } = event as any;
    return {
      ...rest,
      userParticipation,
    };
  }

  /**
   * Inscrit ou fait participer l'utilisateur à un événement (idempotent et sécurisé).
   */
  async participateInEvent(eventId: string, userId: string, ipAddress?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    if (
      event.status !== EventStatus.PUBLISHED &&
      event.status !== EventStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Cet événement n’est pas ouvert aux inscriptions ou participations.',
      );
    }

    // Contrôle date limite d'inscription
    if (
      event.registrationDeadline &&
      new Date() > new Date(event.registrationDeadline)
    ) {
      throw new BadRequestException(
        'La date limite d’inscription pour cet événement est dépassée.',
      );
    }

    // Contrôle éligibilité Tier (VIP / Premium)
    if (event.minTier && event.minTier !== 'FREE') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { tier: true },
      });
      if (
        user?.tier !== event.minTier &&
        user?.tier !== 'PREMIUM' &&
        user?.tier !== 'VIP'
      ) {
        throw new ForbiddenException(
          `Cet événement est réservé aux membres statut ${event.minTier}.`,
        );
      }
    }

    // Vérifier participation existante (Idempotence)
    const existing = await this.prisma.eventParticipation.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (existing) {
      if (existing.status === EventParticipationStatus.CANCELLED) {
        // Réactivation de l'inscription
        const updated = await this.prisma.eventParticipation.update({
          where: { id: existing.id },
          data: { status: EventParticipationStatus.REGISTERED },
        });
        await this.prisma.event.update({
          where: { id: eventId },
          data: { currentParticipantsCount: { increment: 1 } },
        });
        return {
          success: true,
          participation: updated,
          message: 'Votre inscription a été réactivée avec succès.',
        };
      }

      return {
        success: true,
        participation: existing,
        message: 'Vous participez déjà à cet événement.',
      };
    }

    // Contrôle capacité maximale
    if (
      event.maxParticipants &&
      event.currentParticipantsCount >= event.maxParticipants
    ) {
      throw new ConflictException(
        'Cet événement a atteint sa capacité maximale de participants.',
      );
    }

    // Création atomique de la participation
    const participation = await this.prisma.$transaction(async (tx) => {
      const p = await tx.eventParticipation.create({
        data: {
          eventId,
          userId,
          status: EventParticipationStatus.REGISTERED,
          metadata: ipAddress ? { ipAddress } : undefined,
        },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { currentParticipantsCount: { increment: 1 } },
      });

      return p;
    });

    this.logger.log(
      `[Events] Utilisateur ${userId} inscrit à l'événement ${eventId} (${event.slug})`,
    );

    // Envoi de confirmation par notification in-app
    try {
      await this.notificationsService.createNotification({
        userId,
        titleMg: 'Fisoratana anarana voamarina !',
        titleFr: 'Inscription confirmée !',
        messageMg: `Voasoratra anarana amin'ny hetsika "${event.titleMg}" ianao. Mahereza !`,
        messageFr: `Vous êtes bien inscrit à l'événement "${event.titleFr}". Bonne chance !`,
        category: 'community',
        badgeText: 'Hetsika',
        badgeType: 'new',
        iconName: 'calendar-outline',
        iconColor: '#4A6741',
        targetRoute: `/(screens)/events/${event.id}`,
        isBroadcast: false,
      });
    } catch (notifErr) {
      this.logger.warn(`Erreur notification inscription événement : ${notifErr}`);
    }

    return {
      success: true,
      participation,
      message: 'Inscription enregistrée avec succès !',
    };
  }

  /**
   * Annule une inscription avant le début de l'événement.
   */
  async cancelParticipation(eventId: string, userId: string) {
    const participation = await this.prisma.eventParticipation.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
      include: { event: true },
    });

    if (!participation) {
      throw new NotFoundException('Aucune inscription trouvée.');
    }

    if (new Date() >= new Date(participation.event.startDate)) {
      throw new BadRequestException(
        'Impossible d’annuler une inscription pour un événement déjà commencé.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.eventParticipation.update({
        where: { id: participation.id },
        data: { status: EventParticipationStatus.CANCELLED },
      });

      await tx.event.update({
        where: { id: eventId },
        data: {
          currentParticipantsCount: {
            decrement: participation.event.currentParticipantsCount > 0 ? 1 : 0,
          },
        },
      });
    });

    return {
      success: true,
      message: 'Inscription annulée avec succès.',
    };
  }

  /**
   * Soumet une progression ou un score (validé et idempotent).
   */
  async submitProgress(
    eventId: string,
    userId: string,
    dto: SubmitEventProgressDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { rewards: true },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    if (event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException(
        'Cet événement n’est pas actuellement en cours.',
      );
    }

    if (new Date() > new Date(event.endDate)) {
      throw new BadRequestException('Cet événement est désormais terminé.');
    }

    let participation = await this.prisma.eventParticipation.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    // Si événement à accès ouvert, création implicite de la participation
    if (!participation) {
      if (event.participationType === EventParticipationType.OPEN) {
        participation = await this.prisma.eventParticipation.create({
          data: {
            eventId,
            userId,
            status: EventParticipationStatus.IN_PROGRESS,
          },
        });
        await this.prisma.event.update({
          where: { id: eventId },
          data: { currentParticipantsCount: { increment: 1 } },
        });
      } else {
        throw new ForbiddenException(
          'Une inscription préalable est requise pour soumettre des résultats.',
        );
      }
    }

    const newScore = Math.max(participation.score, dto.score || 0);
    const newProgress = Math.max(
      participation.progressPercent,
      dto.progressPercent || 0,
    );
    const isCompleted = newProgress >= 100;

    const updated = await this.prisma.eventParticipation.update({
      where: { id: participation.id },
      data: {
        score: newScore,
        progressPercent: newProgress,
        status: isCompleted
          ? EventParticipationStatus.COMPLETED
          : EventParticipationStatus.IN_PROGRESS,
        completedAt: isCompleted ? new Date() : participation.completedAt,
        attemptsCount: { increment: 1 },
        metadata: dto.metadata || participation.metadata || undefined,
      },
    });

    // Si l'événement est compétitif, mise à jour du classement
    if (dto.score !== undefined && dto.score > 0) {
      await this.prisma.eventLeaderboardEntry.upsert({
        where: {
          eventId_userId: { eventId, userId },
        },
        create: {
          eventId,
          userId,
          score: newScore,
          rank: 0, // Recalculé lors de la requête de classement
          completedAt: new Date(),
        },
        update: {
          score: newScore,
          completedAt: new Date(),
        },
      });
    }

    // Distribution immédiate des récompenses automatiques d'achèvement ("completion")
    const awardedRewards: string[] = [];
    if (isCompleted) {
      for (const reward of event.rewards) {
        if (reward.criteria === 'completion') {
          try {
            const claim = await this.awardSingleReward(
              event,
              reward,
              userId,
              participation.id,
            );
            if (claim) {
              awardedRewards.push(reward.titleFr);
            }
          } catch (rewardErr) {
            this.logger.warn(`Échec attribution récompense directe : ${rewardErr}`);
          }
        }
      }
    }

    return {
      success: true,
      participation: updated,
      awardedRewards,
      message: isCompleted
        ? 'Félicitations ! Vous avez complété ce défi avec succès.'
        : 'Progression enregistrée.',
    };
  }

  /**
   * Attribue une récompense spécifique à un utilisateur de manière atomique et idempotente.
   */
  private async awardSingleReward(
    event: any,
    reward: any,
    userId: string,
    participationId?: string,
  ) {
    // 1. Contrôle anti-doublon strict en base
    const existingClaim = await this.prisma.eventRewardClaim.findUnique({
      where: {
        rewardId_userId: { rewardId: reward.id, userId },
      },
    });

    if (existingClaim) {
      return null; // Déjà récompensé
    }

    // 2. Contrôle plafond de gagnants
    if (reward.maxWinners && reward.claimsCount >= reward.maxWinners) {
      return null;
    }

    return this.prisma.$transaction(async (tx) => {
      // Enregistrement du claim
      const claim = await tx.eventRewardClaim.create({
        data: {
          eventId: event.id,
          rewardId: reward.id,
          userId,
          participationId,
          isFulfilled: reward.rewardType !== EventRewardType.PHYSICAL_LOT,
        },
      });

      await tx.eventReward.update({
        where: { id: reward.id },
        data: { claimsCount: { increment: 1 } },
      });

      // Attribution selon le type
      if (reward.rewardType === EventRewardType.XP && reward.amount > 0) {
        await this.progressionService.awardXp(
          userId,
          reward.amount,
          'event_reward',
          `Récompense événement : ${event.titleFr}`,
        );
      } else if (
        reward.rewardType === EventRewardType.COINS &&
        reward.amount > 0
      ) {
        await tx.userProgress.upsert({
          where: { userId },
          create: {
            userId,
            coins: Math.round(reward.amount),
            totalXp: 0,
          },
          update: {
            coins: { increment: Math.round(reward.amount) },
          },
        });
      } else if (
        reward.rewardType === EventRewardType.BADGE &&
        reward.badgeId
      ) {
        await tx.userBadge.upsert({
          where: {
            userId_badgeId: { userId, badgeId: reward.badgeId },
          },
          create: {
            userId,
            badgeId: reward.badgeId,
            progress: 100,
          },
          update: { progress: 100 },
        });
      }

      // Notification de gain
      try {
        await this.notificationsService.createNotification({
          userId,
          titleMg: 'Nahazo loka ianao !',
          titleFr: 'Récompense débloquée !',
          messageMg: `Nahazo ny loka "${reward.titleMg}" ianao tamin'ny hetsika "${event.titleMg}".`,
          messageFr: `Vous avez remporté la récompense "${reward.titleFr}" lors de l'événement "${event.titleFr}".`,
          category: 'reward',
          badgeText: reward.amount ? `+${reward.amount}` : 'Loka',
          badgeType: 'reward',
          iconName: 'gift-outline',
          iconColor: '#C58B38',
          targetRoute: `/(screens)/events/${event.id}`,
          isBroadcast: false,
        });
      } catch {}

      return claim;
    });
  }

  /**
   * Récupère le classement public d'un événement compétitif.
   */
  async getEventLeaderboard(eventId: string, limit = 50) {
    const entries = await this.prisma.eventLeaderboardEntry.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: [
        { score: 'desc' },
        { timeTakenSeconds: 'asc' },
        { completedAt: 'asc' },
      ],
      take: Math.min(100, limit),
    });

    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: this.formatMaskedName(entry.user?.name, entry.user?.username),
      userAvatar: entry.user?.image || null,
      score: entry.score,
      completedAt: entry.completedAt,
    }));
  }

  /**
   * Incrémente le compteur de partages d'un événement (anonyme et idempotent).
   */
  async trackShare(eventId: string) {
    try {
      const updated = await this.prisma.event.update({
        where: { id: eventId },
        data: { sharesCount: { increment: 1 } },
        select: { sharesCount: true },
      });
      return { success: true, sharesCount: updated.sharesCount };
    } catch {
      return { success: false, sharesCount: 0 };
    }
  }

  // ─── ENDPOINTS ADMINISTRATION ────────────────────────────────────────────────

  /**
   * Liste complète des événements pour l'administration (avec brouillons, archivés).
   */
  async getAdminEvents(query: EventQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status as EventStatus;
    if (query.category) where.category = query.category as EventCategory;
    if (query.search) {
      where.OR = [
        { titleFr: { contains: query.search, mode: 'insensitive' } },
        { titleMg: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        include: {
          rewards: true,
          _count: {
            select: { participations: true, leaderboardEntries: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée un nouvel événement avec traçabilité administrative.
   */
  async createEvent(dto: CreateEventDto, adminId: string) {
    const slug = dto.slug ? dto.slug.trim().toLowerCase() : this.generateSlug(dto.titleFr);

    const existingSlug = await this.prisma.event.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException(`Le slug "${slug}" est déjà utilisé.`);
    }

    const event = await this.prisma.event.create({
      data: {
        slug,
        titleMg: dto.titleMg,
        titleFr: dto.titleFr,
        descriptionMg: dto.descriptionMg,
        descriptionFr: dto.descriptionFr,
        shortDescMg: dto.shortDescMg,
        shortDescFr: dto.shortDescFr,
        category: dto.category || EventCategory.CULTURE,
        status: EventStatus.DRAFT,
        participationType: dto.participationType || EventParticipationType.OPEN,
        minTier: dto.minTier || 'FREE',
        imageUrl: dto.imageUrl,
        bannerUrl: dto.bannerUrl,
        location: dto.location,
        externalUrl: dto.externalUrl,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        registrationDeadline: dto.registrationDeadline
          ? new Date(dto.registrationDeadline)
          : null,
        maxParticipants: dto.maxParticipants,
        isFeatured: Boolean(dto.isFeatured),
        rulesMg: dto.rulesMg,
        rulesFr: dto.rulesFr,
        metadata: dto.metadata,
        creatorId: adminId,
        rewards: dto.rewards && dto.rewards.length > 0
          ? {
              create: dto.rewards.map((r) => ({
                rewardType: r.rewardType,
                titleMg: r.titleMg,
                titleFr: r.titleFr,
                amount: r.amount,
                badgeId: r.badgeId,
                lotDescription: r.lotDescription,
                criteria: r.criteria || 'completion',
                maxWinners: r.maxWinners,
              })),
            }
          : undefined,
      },
      include: { rewards: true },
    });

    // Journalisation d'audit admin
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_CREATED',
        targetType: 'EVENT',
        targetId: event.id,
        targetLabel: event.titleFr,
        details: { slug: event.slug, category: event.category },
      },
    });

    this.logger.log(`[Events] Événement créé : ${event.id} (${event.slug}) par admin ${adminId}`);
    return event;
  }

  /**
   * Met à jour un événement existant.
   */
  async updateEvent(eventId: string, dto: UpdateEventDto, adminId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(dto.titleMg && { titleMg: dto.titleMg }),
        ...(dto.titleFr && { titleFr: dto.titleFr }),
        ...(dto.descriptionMg && { descriptionMg: dto.descriptionMg }),
        ...(dto.descriptionFr && { descriptionFr: dto.descriptionFr }),
        ...(dto.shortDescMg !== undefined && { shortDescMg: dto.shortDescMg }),
        ...(dto.shortDescFr !== undefined && { shortDescFr: dto.shortDescFr }),
        ...(dto.category && { category: dto.category }),
        ...(dto.participationType && { participationType: dto.participationType }),
        ...(dto.minTier && { minTier: dto.minTier }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.externalUrl !== undefined && { externalUrl: dto.externalUrl }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.registrationDeadline !== undefined && {
          registrationDeadline: dto.registrationDeadline
            ? new Date(dto.registrationDeadline)
            : null,
        }),
        ...(dto.maxParticipants !== undefined && {
          maxParticipants: dto.maxParticipants,
        }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.rulesMg !== undefined && { rulesMg: dto.rulesMg }),
        ...(dto.rulesFr !== undefined && { rulesFr: dto.rulesFr }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
      },
      include: { rewards: true },
    });

    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_UPDATED',
        targetType: 'EVENT',
        targetId: eventId,
        targetLabel: updated.titleFr,
      },
    });

    return updated;
  }

  /**
   * Met à jour le statut du cycle de vie de l'événement.
   */
  async updateEventStatus(
    eventId: string,
    dto: UpdateEventStatusDto,
    adminId: string,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { participations: { select: { userId: true } } },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    const previousStatus = event.status;
    const newStatus = dto.status;

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: newStatus,
        ...(dto.cancelledReason && { cancelledReason: dto.cancelledReason }),
      },
    });

    // En cas d'annulation, notification préventive aux inscrits
    if (newStatus === EventStatus.CANCELLED && event.participations.length > 0) {
      for (const p of event.participations) {
        try {
          await this.notificationsService.createNotification({
            userId: p.userId,
            titleMg: 'Hetsika nofoanana',
            titleFr: 'Événement annulé',
            messageMg: `Nofoanana ny hetsika "${event.titleMg}". ${dto.cancelledReason ? `Antony: ${dto.cancelledReason}` : ''}`,
            messageFr: `L'événement "${event.titleFr}" a été annulé. ${dto.cancelledReason ? `Motif : ${dto.cancelledReason}` : ''}`,
            category: 'system',
            badgeText: 'Fampahafantarana',
            badgeType: 'info',
            isBroadcast: false,
          });
        } catch {}
      }
    }

    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_STATUS_CHANGED',
        targetType: 'EVENT',
        targetId: eventId,
        targetLabel: event.titleFr,
        details: { previousStatus, newStatus, reason: dto.cancelledReason },
      },
    });

    this.logger.log(`[Events] Statut événement ${eventId} changé de ${previousStatus} à ${newStatus}`);
    return updated;
  }

  /**
   * Ajoute une récompense à un événement.
   */
  async addReward(eventId: string, dto: CreateEventRewardDto, adminId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Événement introuvable.');

    const reward = await this.prisma.eventReward.create({
      data: {
        eventId,
        rewardType: dto.rewardType,
        titleMg: dto.titleMg,
        titleFr: dto.titleFr,
        amount: dto.amount,
        badgeId: dto.badgeId,
        lotDescription: dto.lotDescription,
        criteria: dto.criteria || 'completion',
        maxWinners: dto.maxWinners,
      },
    });

    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_REWARD_ADDED',
        targetType: 'EVENT',
        targetId: eventId,
        details: { rewardId: reward.id, title: reward.titleFr },
      },
    });

    return reward;
  }

  /**
   * Distribution contrôlée des récompenses compétitives (ex: Top 1, Top 3) par l'administrateur.
   */
  async distributeRewards(
    eventId: string,
    dto: DistributeRewardsDto,
    adminId: string,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { rewards: true },
    });

    if (!event) throw new NotFoundException('Événement introuvable.');

    const leaderboard = await this.prisma.eventLeaderboardEntry.findMany({
      where: { eventId },
      orderBy: [
        { score: 'desc' },
        { timeTakenSeconds: 'asc' },
        { completedAt: 'asc' },
      ],
      take: dto.topN || 10,
    });

    let distributedCount = 0;

    for (let i = 0; i < leaderboard.length; i++) {
      const entry = leaderboard[i];
      const rank = i + 1;

      // Chercher les récompenses correspondant au rang
      for (const reward of event.rewards) {
        let isEligible = false;
        if (rank === 1 && (reward.criteria === 'top_1' || reward.criteria === 'top_3')) {
          isEligible = true;
        } else if (rank <= 3 && reward.criteria === 'top_3') {
          isEligible = true;
        }

        if (isEligible) {
          const claim = await this.awardSingleReward(event, reward, entry.userId);
          if (claim) distributedCount++;
        }
      }
    }

    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_REWARDS_DISTRIBUTED',
        targetType: 'EVENT',
        targetId: eventId,
        details: { distributedCount },
      },
    });

    return {
      success: true,
      distributedCount,
      message: `${distributedCount} récompense(s) distribuée(s) avec succès.`,
    };
  }

  /**
   * Statistiques complètes pour l'administration.
   */
  async getEventStats(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        rewards: {
          select: {
            id: true,
            titleFr: true,
            rewardType: true,
            claimsCount: true,
          },
        },
        _count: {
          select: {
            participations: true,
            leaderboardEntries: true,
          },
        },
      },
    });

    if (!event) throw new NotFoundException('Événement introuvable.');

    const completedCount = await this.prisma.eventParticipation.count({
      where: {
        eventId,
        status: EventParticipationStatus.COMPLETED,
      },
    });

    const completionRate =
      event.currentParticipantsCount > 0
        ? Math.round((completedCount / event.currentParticipantsCount) * 100)
        : 0;

    return {
      event: {
        id: event.id,
        slug: event.slug,
        titleFr: event.titleFr,
        status: event.status,
      },
      metrics: {
        viewsCount: event.viewsCount,
        sharesCount: event.sharesCount,
        registeredCount: event.currentParticipantsCount,
        completedCount,
        completionRate,
      },
      rewards: event.rewards,
    };
  }

  /**
   * Tableau de bord global : métriques 100% réelles calculées depuis PostgreSQL.
   */
  async getAdminOverviewStats() {
    const [
      totalEvents,
      draftCount,
      scheduledCount,
      activeCount,
      completedCount,
      cancelledCount,
      suspendedCount,
      totalRegistrations,
      completedParticipations,
      totalRewardsDistributed,
      recentParticipations,
    ] = await Promise.all([
      this.prisma.event.count(),
      this.prisma.event.count({ where: { status: EventStatus.DRAFT } }),
      this.prisma.event.count({ where: { status: EventStatus.SCHEDULED } }),
      this.prisma.event.count({
        where: {
          status: { in: [EventStatus.ACTIVE, EventStatus.PUBLISHED] },
        },
      }),
      this.prisma.event.count({ where: { status: EventStatus.COMPLETED } }),
      this.prisma.event.count({ where: { status: EventStatus.CANCELLED } }),
      this.prisma.event.count({ where: { status: EventStatus.SUSPENDED } }),
      this.prisma.eventParticipation.count(),
      this.prisma.eventParticipation.count({
        where: { status: EventParticipationStatus.COMPLETED },
      }),
      this.prisma.eventRewardClaim.count(),
      this.prisma.eventParticipation.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              username: true,
            },
          },
          event: {
            select: {
              id: true,
              titleFr: true,
              category: true,
              status: true,
            },
          },
        },
      }),
    ]);

    return {
      metrics: {
        totalEvents,
        draftCount,
        scheduledCount,
        activeCount,
        completedCount,
        cancelledCount,
        suspendedCount,
        totalRegistrations,
        completedParticipations,
        totalRewardsDistributed,
      },
      recentActivity: recentParticipations.map((p: any) => ({
        id: p.id,
        eventId: p.eventId,
        eventTitle: p.event?.titleFr || 'Événement',
        eventCategory: p.event?.category,
        userId: p.userId,
        userName: p.user?.name || p.user?.username || 'Membre Kanto',
        userEmail: p.user?.email || null,
        userAvatar: p.user?.image || null,
        status: p.status,
        score: p.score,
        registeredAt: p.createdAt,
        completedAt: p.completedAt,
      })),
    };
  }

  /**
   * Récupère la liste paginée et filtrée des participants réels d'un événement (admin).
   */
  async getAdminEventParticipants(
    eventId: string,
    query: { page?: number; limit?: number; status?: string; search?: string },
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { eventId };

    if (query.status && query.status !== 'ALL') {
      where.status = query.status as EventParticipationStatus;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.user = {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
          { username: { contains: term, mode: 'insensitive' } },
        ],
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.eventParticipation.count({ where }),
      this.prisma.eventParticipation.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: items.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        userName: p.user?.name || p.user?.username || 'Membre Kanto',
        userEmail: p.user?.email,
        userAvatar: p.user?.image,
        status: p.status,
        score: p.score,
        progressPercent: p.progressPercent,
        registeredAt: p.createdAt,
        completedAt: p.completedAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Supprime un événement en brouillon ou archive un événement existant.
   */
  async deleteEvent(eventId: string, adminId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { participations: true } },
      },
    });

    if (!event) throw new NotFoundException('Événement introuvable.');

    // Si des participants sont déjà inscrits, basculer vers ARCHIVED pour préserver l'historique
    if (event._count.participations > 0) {
      const archived = await this.prisma.event.update({
        where: { id: eventId },
        data: { status: EventStatus.ARCHIVED },
      });

      await this.prisma.adminAuditLog.create({
        data: {
          userId: adminId,
          action: 'EVENT_ARCHIVED',
          targetType: 'EVENT',
          targetId: eventId,
          targetLabel: event.titleFr,
          details: {
            reason: 'Archivé car contient des participations historiques',
            participationsCount: event._count.participations,
          },
        },
      });

      return {
        success: true,
        action: 'ARCHIVED',
        message: `L'événement contenait des participations (${event._count.participations}). Il a été archivé pour préserver les données des utilisateurs.`,
        event: archived,
      };
    }

    // Sinon, suppression physique sécurisée
    await this.prisma.event.delete({
      where: { id: eventId },
    });

    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'EVENT_DELETED',
        targetType: 'EVENT',
        targetId: eventId,
        targetLabel: event.titleFr,
      },
    });

    return {
      success: true,
      action: 'DELETED',
      message: `L'événement "${event.titleFr}" a été définitivement supprimé.`,
    };
  }
}
