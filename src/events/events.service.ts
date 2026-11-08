import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProgressionService } from '../progression/progression.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service.js';
import { CloudinarySyncService } from '../integrations/cloudinary/cloudinary-sync.service.js';
import {
  AdminCancelParticipationDto,
  CreateEventDto,
  CreateEventRewardDto,
  DistributeRewardsDto,
  EventQueryDto,
  SubmitEventProgressDto,
  UpdateEventDto,
  UpdateEventStatusDto,
  UploadEventCoverDto,
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
    private readonly cloudinaryService: CloudinaryService,
    private readonly cloudinarySyncService: CloudinarySyncService,
  ) {}

  /**
   * Masque l'identité pour respecter la vie privée (RGPD).
   */
  private formatMaskedName(
    name?: string | null,
    username?: string | null,
  ): string {
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

    const now = new Date();
    const andConditions: any[] = [];

    const where: any = {
      status: {
        in: [
          EventStatus.PUBLISHED,
          EventStatus.ACTIVE,
          EventStatus.SCHEDULED,
          EventStatus.COMPLETED,
        ],
      },
    };

    if (query.timeFilter === 'past' || query.timeFilter === 'completed') {
      where.status = {
        in: [
          EventStatus.PUBLISHED,
          EventStatus.ACTIVE,
          EventStatus.COMPLETED,
          EventStatus.CANCELLED,
        ],
      };
      andConditions.push({
        OR: [
          { status: EventStatus.COMPLETED },
          { status: EventStatus.CANCELLED },
          { endDate: { lt: now } },
        ],
      });
    } else if (query.timeFilter === 'upcoming') {
      where.status = {
        in: [
          EventStatus.PUBLISHED,
          EventStatus.ACTIVE,
          EventStatus.SCHEDULED,
          EventStatus.CANCELLED,
        ],
      };
      andConditions.push({ endDate: { gte: now } });
    } else if (query.timeFilter === 'ongoing') {
      where.status = { in: [EventStatus.PUBLISHED, EventStatus.ACTIVE] };
      andConditions.push({ startDate: { lte: now } }, { endDate: { gte: now } });
    }

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
      andConditions.push({
        OR: [
          { titleMg: { contains: term, mode: 'insensitive' } },
          { titleFr: { contains: term, mode: 'insensitive' } },
          { descriptionMg: { contains: term, mode: 'insensitive' } },
          { descriptionFr: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (query.myEvents && userId) {
      where.participations = {
        some: {
          userId,
          status: { not: EventParticipationStatus.CANCELLED },
        },
      };
    }

    const orderBy =
      query.timeFilter === 'past' || query.timeFilter === 'completed'
        ? [{ endDate: 'desc' as const }]
        : [{ isFeatured: 'desc' as const }, { startDate: 'asc' as const }];

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
          _count: {
            select: {
              participations: {
                where: { status: EventParticipationStatus.WAITLIST },
              },
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
                    waitlistPosition: true,
                    completedAt: true,
                  },
                },
              }
            : {}),
        },
        orderBy,
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
        const waitlistCount = (event as any)._count?.participations ?? 0;
        const { participations, _count, ...rest } = event as any;
        return {
          ...rest,
          waitlistCount,
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
    const now = new Date();
    const event = await this.prisma.event.findFirst({
      where: {
        status: {
          in: [EventStatus.PUBLISHED, EventStatus.ACTIVE, EventStatus.SCHEDULED],
        },
        isFeatured: true,
        endDate: { gte: now },
      },
      include: {
        rewards: true,
        _count: {
          select: {
            participations: {
              where: { status: EventParticipationStatus.WAITLIST },
            },
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
                  waitlistPosition: true,
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

    const waitlistCount = (event as any)._count?.participations ?? 0;
    const { participations, _count, ...rest } = event as any;
    return {
      ...rest,
      waitlistCount,
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
        _count: {
          select: {
            participations: {
              where: { status: EventParticipationStatus.WAITLIST },
            },
          },
        },
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
    void this.prisma.event
      .update({
        where: { id: event.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch(() => {});

    const userParticipation =
      userId && (event as any).participations?.length > 0
        ? (event as any).participations[0]
        : null;

    const waitlistCount = (event as any)._count?.participations ?? 0;
    const { participations, _count, ...rest } = event as any;
    return {
      ...rest,
      waitlistCount,
      userParticipation,
    };
  }

  /**
   * Inscrit ou fait participer l'utilisateur à un événement (idempotent et sécurisé).
   */
  async participateInEvent(
    eventId: string,
    userId: string,
    ipAddress?: string,
  ) {
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
        // Tentative de réactivation de l'inscription
        const isFull =
          event.maxParticipants &&
          event.currentParticipantsCount >= event.maxParticipants;

        if (!isFull) {
          const updated = await this.prisma.$transaction(async (tx) => {
            const p = await tx.eventParticipation.update({
              where: { id: existing.id },
              data: {
                status: EventParticipationStatus.REGISTERED,
                cancellationReason: null,
                cancelledByRole: null,
                cancelledById: null,
                cancelledAt: null,
                adminNotes: null,
                waitlistPosition: null,
              },
            });
            await tx.event.update({
              where: { id: eventId },
              data: { currentParticipantsCount: { increment: 1 } },
            });
            return p;
          });
          return {
            success: true,
            isWaitlist: false,
            alreadyRegistered: false,
            participation: updated,
            message: 'Votre inscription a été réactivée avec succès.',
          };
        } else if (event.enableWaitlist) {
          // Si l'événement est complet mais que la liste d'attente est activée
          const waitlistCount = await this.prisma.eventParticipation.count({
            where: { eventId, status: EventParticipationStatus.WAITLIST },
          });

          if (event.waitlistCapacity && waitlistCount >= event.waitlistCapacity) {
            throw new ConflictException(
              'Cet événement et sa liste d’attente sont actuellement complets.',
            );
          }

          const waitlistPosition = waitlistCount + 1;
          const updated = await this.prisma.eventParticipation.update({
            where: { id: existing.id },
            data: {
              status: EventParticipationStatus.WAITLIST,
              waitlistPosition,
              cancellationReason: null,
              cancelledByRole: null,
              cancelledById: null,
              cancelledAt: null,
              adminNotes: null,
            },
          });

          return {
            success: true,
            isWaitlist: true,
            alreadyRegistered: false,
            waitlistPosition,
            participation: updated,
            message: `Vous avez été réinscrit sur la liste d'attente (position #${waitlistPosition}).`,
          };
        } else {
          throw new ConflictException(
            'Cet événement a atteint sa capacité maximale de participants.',
          );
        }
      }

      if (existing.status === EventParticipationStatus.WAITLIST) {
        return {
          success: true,
          isWaitlist: true,
          alreadyRegistered: true,
          waitlistPosition: existing.waitlistPosition,
          participation: existing,
          message: `Vous êtes déjà inscrit sur la liste d’attente (position #${existing.waitlistPosition ?? 1}).`,
        };
      }

      return {
        success: true,
        isWaitlist: false,
        alreadyRegistered: true,
        participation: existing,
        message: 'Vous participez déjà à cet événement.',
      };
    }

    // Contrôle capacité maximale
    const isEventFull =
      event.maxParticipants &&
      event.currentParticipantsCount >= event.maxParticipants;

    if (isEventFull) {
      if (!event.enableWaitlist) {
        throw new ConflictException(
          'Cet événement a atteint sa capacité maximale de participants.',
        );
      }

      // Inscription en liste d'attente atomique avec gestion de concurrence (P2002)
      let waitlistResult;
      try {
        waitlistResult = await this.prisma.$transaction(async (tx) => {
          const waitlistCount = await tx.eventParticipation.count({
            where: { eventId, status: EventParticipationStatus.WAITLIST },
          });

          if (event.waitlistCapacity && waitlistCount >= event.waitlistCapacity) {
            throw new ConflictException(
              'La liste d’attente de cet événement a atteint sa capacité maximale.',
            );
          }

          const waitlistPosition = waitlistCount + 1;
          const p = await tx.eventParticipation.create({
            data: {
              eventId,
              userId,
              status: EventParticipationStatus.WAITLIST,
              waitlistPosition,
              metadata: ipAddress ? { ipAddress } : undefined,
            },
          });

          return { participation: p, waitlistPosition };
        });
      } catch (err: any) {
        if (err?.code === 'P2002') {
          const found = await this.prisma.eventParticipation.findUnique({
            where: { eventId_userId: { eventId, userId } },
          });
          if (found) {
            return {
              success: true,
              isWaitlist: found.status === EventParticipationStatus.WAITLIST,
              alreadyRegistered: true,
              waitlistPosition: found.waitlistPosition,
              participation: found,
              message:
                found.status === EventParticipationStatus.WAITLIST
                  ? `Vous êtes déjà inscrit sur la liste d’attente (position #${found.waitlistPosition ?? 1}).`
                  : 'Vous participez déjà à cet événement.',
            };
          }
        }
        throw err;
      }

      this.logger.log(
        `[Events] Utilisateur ${userId} placé sur la liste d'attente #${waitlistResult.waitlistPosition} pour l'événement ${eventId}`,
      );

      // Notification liste d'attente
      try {
        await this.notificationsService.createNotification({
          userId,
          titleMg: 'Lisitra fiandrasana !',
          titleFr: 'Liste d’attente rejointe !',
          messageMg: `Voasoratra ao amin'ny lisitra fiandrasana (laharana #${waitlistResult.waitlistPosition}) ianao ho an'ny hetsika "${event.titleMg}".`,
          messageFr: `Vous êtes placé(e) sur la liste d'attente (position #${waitlistResult.waitlistPosition}) pour l'événement "${event.titleFr}". Nous vous préviendrons dès qu'une place se libère.`,
          category: 'community',
          badgeText: 'Fiandrasana',
          badgeType: 'info',
          iconName: 'time-outline',
          iconColor: '#C58B38',
          targetRoute: `/(screens)/events/${event.id}`,
          isBroadcast: false,
        });
      } catch (notifErr) {
        this.logger.warn(
          `Erreur notification liste d'attente événement : ${notifErr}`,
        );
      }

      return {
        success: true,
        isWaitlist: true,
        alreadyRegistered: false,
        waitlistPosition: waitlistResult.waitlistPosition,
        participation: waitlistResult.participation,
        message: `Vous avez rejoint la liste d’attente avec succès (position #${waitlistResult.waitlistPosition}).`,
      };
    }

    // Création atomique de la participation confirmée avec gestion de concurrence (P2002)
    let participation;
    try {
      participation = await this.prisma.$transaction(async (tx) => {
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
    } catch (err: any) {
      if (err?.code === 'P2002') {
        const found = await this.prisma.eventParticipation.findUnique({
          where: { eventId_userId: { eventId, userId } },
        });
        if (found) {
          return {
            success: true,
            isWaitlist: found.status === EventParticipationStatus.WAITLIST,
            alreadyRegistered: true,
            waitlistPosition: found.waitlistPosition,
            participation: found,
            message:
              found.status === EventParticipationStatus.WAITLIST
                ? `Vous êtes déjà inscrit sur la liste d’attente (position #${found.waitlistPosition ?? 1}).`
                : 'Vous participez déjà à cet événement.',
          };
        }
      }
      throw err;
    }

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
      this.logger.warn(
        `Erreur notification inscription événement : ${notifErr}`,
      );
    }

    return {
      success: true,
      isWaitlist: false,
      alreadyRegistered: false,
      participation,
      message: 'Inscription enregistrée avec succès !',
    };
  }

  /**
   * Annule une inscription (désistement volontaire de l'utilisateur).
   * Si la place libérée était confirmée, promeut automatiquement le premier participant de la liste d'attente.
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

    if (
      participation.status !== EventParticipationStatus.WAITLIST &&
      new Date() >= new Date(participation.event.startDate)
    ) {
      throw new BadRequestException(
        'Impossible d’annuler une inscription pour un événement déjà commencé.',
      );
    }

    const wasActive =
      participation.status === EventParticipationStatus.REGISTERED ||
      participation.status === EventParticipationStatus.IN_PROGRESS;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Annulation de la participation actuelle
      const cancelled = await tx.eventParticipation.update({
        where: { id: participation.id },
        data: {
          status: EventParticipationStatus.CANCELLED,
          cancelledByRole: 'USER',
          cancelledById: userId,
          cancelledAt: new Date(),
          cancellationReason: 'Désistement volontaire de l’utilisateur',
          waitlistPosition: null,
        },
      });

      let promotedUser: { id: string; userId: string; event: any } | null = null;

      // 2. Si la place était occupée parmi les places confirmées
      if (wasActive) {
        // Vérifier s'il y a un participant en liste d'attente à promouvoir
        const nextInWaitlist = await tx.eventParticipation.findFirst({
          where: {
            eventId,
            status: EventParticipationStatus.WAITLIST,
          },
          orderBy: [
            { waitlistPosition: 'asc' },
            { createdAt: 'asc' },
          ],
        });

        if (nextInWaitlist) {
          // Promotion automatique
          await tx.eventParticipation.update({
            where: { id: nextInWaitlist.id },
            data: {
              status: EventParticipationStatus.REGISTERED,
              waitlistPosition: null,
              promotedFromWaitlistAt: new Date(),
            },
          });

          promotedUser = {
            id: nextInWaitlist.id,
            userId: nextInWaitlist.userId,
            event: participation.event,
          };
          // Le compteur reste inchangé car une place se libère et une autre est attribuée immédiatement
        } else {
          // Aucune liste d'attente : décrémenter le compteur de participants
          await tx.event.update({
            where: { id: eventId },
            data: {
              currentParticipantsCount: {
                decrement: participation.event.currentParticipantsCount > 0 ? 1 : 0,
              },
            },
          });
        }
      }

      return { cancelled, promotedUser };
    });

    // 3. Notification asynchrone au participant promu depuis la liste d'attente
    if (result.promotedUser) {
      try {
        await this.notificationsService.createNotification({
          userId: result.promotedUser.userId,
          titleMg: 'Toerana afaka ! Voamarina ny fisoratanao',
          titleFr: 'Une place s’est libérée ! Inscription confirmée',
          messageMg: `Nisy toerana nanjary afaka ho an'ny hetsika "${participation.event.titleMg}". Voamarina ho mpandray anjara ianao izao !`,
          messageFr: `Une place s'est libérée pour l'événement "${participation.event.titleFr}". Votre participation est désormais officiellement confirmée !`,
          category: 'community',
          badgeText: 'Voamarina',
          badgeType: 'new',
          iconName: 'checkmark-circle-outline',
          iconColor: '#4A6741',
          targetRoute: `/(screens)/events/${participation.event.id}`,
          isBroadcast: false,
        });
      } catch (promotedNotifErr) {
        this.logger.warn(
          `Erreur notification promotion liste d'attente : ${promotedNotifErr}`,
        );
      }
    }

    return {
      success: true,
      message:
        participation.status === EventParticipationStatus.WAITLIST
          ? 'Vous vous êtes retiré(e) de la liste d’attente avec succès.'
          : 'Votre inscription a été annulée avec succès.',
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
            this.logger.warn(
              `Échec attribution récompense directe : ${rewardErr}`,
            );
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
            select: {
              participations: {
                where: { status: EventParticipationStatus.WAITLIST },
              },
              leaderboardEntries: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        waitlistCount: (item as any)._count?.participations ?? 0,
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
   * Crée un nouvel événement avec traçabilité administrative.
   */
  async createEvent(dto: CreateEventDto, adminId: string) {
    // ── Détermination et validation flexible des langues et contenus ──
    const contentConfig = dto.metadata?.contentConfig;
    const requestedLanguages: ('mg' | 'fr')[] =
      Array.isArray(contentConfig?.languages) && contentConfig.languages.length > 0
        ? contentConfig.languages
        : contentConfig?.languageMode === 'mg'
        ? ['mg']
        : contentConfig?.languageMode === 'fr'
        ? ['fr']
        : dto.titleMg && dto.titleFr
        ? ['mg', 'fr']
        : dto.titleMg
        ? ['mg']
        : ['fr'];

    const isMgEnabled = requestedLanguages.includes('mg');
    const isFrEnabled = requestedLanguages.includes('fr');

    if (!isMgEnabled && !isFrEnabled) {
      throw new BadRequestException(
        'Au moins une langue (malgache ou français) doit être sélectionnée.',
      );
    }

    const titleMgClean = dto.titleMg?.trim() || '';
    const titleFrClean = dto.titleFr?.trim() || '';
    const descMgClean = dto.descriptionMg?.trim() || '';
    const descFrClean = dto.descriptionFr?.trim() || '';

    if (isMgEnabled && (!titleMgClean || !descMgClean)) {
      throw new BadRequestException(
        'Le titre et la description en malgache sont obligatoires lorsque la langue malgache est activée.',
      );
    }
    if (isFrEnabled && (!titleFrClean || !descFrClean)) {
      throw new BadRequestException(
        'Le titre et la description en français sont obligatoires lorsque la langue française est activée.',
      );
    }

    // Préservation de la rétrocompatibilité du schéma DB (colonnes NOT NULL) sans casser l\'existant
    const finalTitleMg = titleMgClean || titleFrClean;
    const finalTitleFr = titleFrClean || titleMgClean;
    const finalDescMg = descMgClean || descFrClean;
    const finalDescFr = descFrClean || descMgClean;

    // Sections activées / désactivées
    const sections = contentConfig?.sections || {
      shortDescription: Boolean(dto.shortDescMg || dto.shortDescFr),
      rules: Boolean(dto.rulesMg || dto.rulesFr),
      participationConditions: Boolean(
        dto.participationType ||
          dto.maxParticipants ||
          dto.registrationDeadline ||
          (dto.minTier && dto.minTier !== 'FREE'),
      ),
      practicalInfo: Boolean(dto.location || dto.externalUrl),
      rewards: Boolean(dto.rewards && dto.rewards.length > 0),
      gameModule: Boolean(dto.metadata?.gameModuleId),
    };

    const finalShortDescMg = sections.shortDescription
      ? dto.shortDescMg?.trim() || null
      : null;
    const finalShortDescFr = sections.shortDescription
      ? dto.shortDescFr?.trim() || null
      : null;
    const finalRulesMg = sections.rules ? dto.rulesMg?.trim() || null : null;
    const finalRulesFr = sections.rules ? dto.rulesFr?.trim() || null : null;
    const finalLocation = sections.practicalInfo
      ? dto.location?.trim() || null
      : null;
    const finalExternalUrl = sections.practicalInfo
      ? dto.externalUrl?.trim() || null
      : null;
    const finalParticipationType = sections.participationConditions
      ? dto.participationType || EventParticipationType.OPEN
      : EventParticipationType.OPEN;
    const finalMinTier = sections.participationConditions
      ? dto.minTier || 'FREE'
      : 'FREE';
    const finalMaxParticipants = sections.participationConditions
      ? dto.maxParticipants || null
      : null;
    const finalRegistrationDeadline =
      sections.participationConditions && dto.registrationDeadline
        ? new Date(dto.registrationDeadline)
        : null;

    // Métadonnées enrichies avec configuration des langues et sections
    const finalMetadata = {
      ...(dto.metadata || {}),
      contentConfig: {
        languageMode:
          isMgEnabled && isFrEnabled ? 'both' : isMgEnabled ? 'mg' : 'fr',
        languages: requestedLanguages,
        sections,
      },
      ...(sections.gameModule && dto.metadata?.gameModuleId
        ? { gameModuleId: dto.metadata.gameModuleId }
        : {}),
    };
    if (!sections.gameModule && (finalMetadata as any).gameModuleId) {
      delete (finalMetadata as any).gameModuleId;
    }

    const slugSource = finalTitleFr || finalTitleMg || 'evenement';
    const slug = dto.slug
      ? dto.slug.trim().toLowerCase()
      : this.generateSlug(slugSource);

    const existingSlug = await this.prisma.event.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException(`Le slug "${slug}" est déjà utilisé.`);
    }

    const event = await this.prisma.event.create({
      data: {
        slug,
        titleMg: finalTitleMg,
        titleFr: finalTitleFr,
        descriptionMg: finalDescMg,
        descriptionFr: finalDescFr,
        shortDescMg: finalShortDescMg,
        shortDescFr: finalShortDescFr,
        category: dto.category || EventCategory.CULTURE,
        status: EventStatus.DRAFT,
        participationType: finalParticipationType,
        minTier: finalMinTier,
        imageUrl: dto.imageUrl,
        bannerUrl: dto.bannerUrl,
        location: finalLocation,
        externalUrl: finalExternalUrl,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        registrationDeadline: finalRegistrationDeadline,
        maxParticipants: finalMaxParticipants,
        enableWaitlist: Boolean(dto.enableWaitlist),
        waitlistCapacity: dto.waitlistCapacity || null,
        isPaid: Boolean(dto.isPaid),
        ticketPrice: dto.isPaid && dto.ticketPrice ? dto.ticketPrice : null,
        currency: dto.currency || 'MGA',
        isFeatured: Boolean(dto.isFeatured),
        rulesMg: finalRulesMg,
        rulesFr: finalRulesFr,
        metadata: finalMetadata,
        creatorId: adminId,
        rewards:
          sections.rewards && dto.rewards && dto.rewards.length > 0
            ? {
                create: dto.rewards.map((r) => {
                  const rTitleMg =
                    r.titleMg?.trim() || r.titleFr?.trim() || 'Loka';
                  const rTitleFr =
                    r.titleFr?.trim() || r.titleMg?.trim() || 'Récompense';
                  return {
                    rewardType: r.rewardType,
                    titleMg: rTitleMg,
                    titleFr: rTitleFr,
                    amount: r.amount,
                    badgeId: r.badgeId,
                    lotDescription: r.lotDescription,
                    criteria: r.criteria || 'completion',
                    maxWinners: r.maxWinners,
                  };
                }),
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

    this.logger.log(
      `[Events] Événement créé : ${event.id} (${event.slug}) par admin ${adminId}`,
    );
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

    const contentConfig = dto.metadata?.contentConfig;
    const sections = contentConfig?.sections;

    const nextTitleMg = dto.titleMg !== undefined ? dto.titleMg.trim() : event.titleMg;
    const nextTitleFr = dto.titleFr !== undefined ? dto.titleFr.trim() : event.titleFr;
    const nextDescMg = dto.descriptionMg !== undefined ? dto.descriptionMg.trim() : event.descriptionMg;
    const nextDescFr = dto.descriptionFr !== undefined ? dto.descriptionFr.trim() : event.descriptionFr;

    const finalTitleMg = nextTitleMg || nextTitleFr;
    const finalTitleFr = nextTitleFr || nextTitleMg;
    const finalDescMg = nextDescMg || nextDescFr;
    const finalDescFr = nextDescFr || nextDescMg;

    const updatedMetadata = dto.metadata !== undefined
      ? {
          ...((event.metadata as any) || {}),
          ...dto.metadata,
          ...(contentConfig ? { contentConfig } : {}),
        }
      : event.metadata;

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        titleMg: finalTitleMg,
        titleFr: finalTitleFr,
        descriptionMg: finalDescMg,
        descriptionFr: finalDescFr,
        shortDescMg: sections?.shortDescription === false ? null : (dto.shortDescMg !== undefined ? dto.shortDescMg : event.shortDescMg),
        shortDescFr: sections?.shortDescription === false ? null : (dto.shortDescFr !== undefined ? dto.shortDescFr : event.shortDescFr),
        ...(dto.category && { category: dto.category }),
        ...(dto.participationType && {
          participationType: dto.participationType,
        }),
        ...(dto.minTier && { minTier: dto.minTier }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
        location: sections?.practicalInfo === false ? null : (dto.location !== undefined ? dto.location : event.location),
        externalUrl: sections?.practicalInfo === false ? null : (dto.externalUrl !== undefined ? dto.externalUrl : event.externalUrl),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        registrationDeadline: sections?.participationConditions === false ? null : (
          dto.registrationDeadline !== undefined
            ? (dto.registrationDeadline ? new Date(dto.registrationDeadline) : null)
            : event.registrationDeadline
        ),
        maxParticipants: sections?.participationConditions === false ? null : (
          dto.maxParticipants !== undefined ? dto.maxParticipants : event.maxParticipants
        ),
        ...(dto.enableWaitlist !== undefined && { enableWaitlist: dto.enableWaitlist }),
        ...(dto.waitlistCapacity !== undefined && { waitlistCapacity: dto.waitlistCapacity }),
        ...(dto.isPaid !== undefined && { isPaid: dto.isPaid }),
        ...(dto.ticketPrice !== undefined && { ticketPrice: dto.isPaid ? dto.ticketPrice : null }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        rulesMg: sections?.rules === false ? null : (dto.rulesMg !== undefined ? dto.rulesMg : event.rulesMg),
        rulesFr: sections?.rules === false ? null : (dto.rulesFr !== undefined ? dto.rulesFr : event.rulesFr),
        metadata: updatedMetadata,
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
    if (
      newStatus === EventStatus.CANCELLED &&
      event.participations.length > 0
    ) {
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

    this.logger.log(
      `[Events] Statut événement ${eventId} changé de ${previousStatus} à ${newStatus}`,
    );
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

    const titleMg = dto.titleMg?.trim() || dto.titleFr?.trim() || 'Loka';
    const titleFr = dto.titleFr?.trim() || dto.titleMg?.trim() || 'Récompense';

    const reward = await this.prisma.eventReward.create({
      data: {
        eventId,
        rewardType: dto.rewardType,
        titleMg,
        titleFr,
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
        if (
          rank === 1 &&
          (reward.criteria === 'top_1' || reward.criteria === 'top_3')
        ) {
          isEligible = true;
        } else if (rank <= 3 && reward.criteria === 'top_3') {
          isEligible = true;
        }

        if (isEligible) {
          const claim = await this.awardSingleReward(
            event,
            reward,
            entry.userId,
          );
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
      if (query.status === 'CONFIRMED') {
        where.status = {
          in: [
            EventParticipationStatus.REGISTERED,
            EventParticipationStatus.IN_PROGRESS,
            EventParticipationStatus.COMPLETED,
          ],
        };
      } else if (query.status === 'WAITLIST') {
        where.status = EventParticipationStatus.WAITLIST;
      } else if (query.status === 'CANCELLED') {
        where.status = EventParticipationStatus.CANCELLED;
      } else {
        where.status = query.status as EventParticipationStatus;
      }
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
        orderBy: [
          ...(query.status === 'WAITLIST' ? [{ waitlistPosition: 'asc' as const }] : []),
          { createdAt: 'desc' as const },
        ],
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
        waitlistPosition: p.waitlistPosition,
        cancelledByRole: p.cancelledByRole,
        cancellationReason: p.cancellationReason,
        cancelledAt: p.cancelledAt,
        adminNotes: p.adminNotes,
        promotedFromWaitlistAt: p.promotedFromWaitlistAt,
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

  /**
   * Sauvegarde et valide une photo de présentation d'événement (ratio 16:9 recommandé).
   * Contrôle type MIME, taille maximale (5 Mo), et enregistre sur Cloudinary CDN ou en local fallback.
   */
  async uploadEventCover(
    dto: UploadEventCoverDto,
    adminId: string,
  ): Promise<{ success: boolean; url: string; provider: 'cloudinary' | 'local' }> {
    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(dto.base64Data);

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(mimeType)) {
      throw new BadRequestException(
        'Format d’image non supporté. Veuillez importer un fichier JPEG, PNG ou WebP.',
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
    if (buffer.length > MAX_SIZE) {
      throw new BadRequestException(
        'L’image dépasse la taille maximale autorisée de 5 Mo.',
      );
    }

    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const ext = mimeToExt[mimeType] || 'jpg';
    const subfolder = 'events/covers';

    if (this.cloudinaryService.isConfigured()) {
      try {
        const cloudinaryUrl = await this.cloudinaryService.uploadImageBase64(
          dto.base64Data,
          dto.originalName || `event-cover-${Date.now()}.${ext}`,
          'kanto/events/covers',
        );
        this.logger.log(`[Events] Image de couverture hébergée sur Cloudinary : ${cloudinaryUrl}`);
        this.cloudinarySyncService.syncLocalUploadsToCloudinary().catch(() => {});
        return { success: true, url: cloudinaryUrl, provider: 'cloudinary' };
      } catch (err: unknown) {
        this.logger.error(
          `[Events] Erreur upload Cloudinary, fallback local : ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', subfolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `event-cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const localUrl = `/uploads/${subfolder}/${filename}`;
    this.logger.log(`[Events] Image de couverture enregistrée en local : ${localUrl}`);

    return { success: true, url: localUrl, provider: 'local' };
  }

  /**
   * Annulation administrative d'un participant par un administrateur.
   * Conserve l'historique en base (statut CANCELLED, rôle ADMIN, motif interne et notifié).
   * Si la place libérée était confirmée, promeut automatiquement le premier de la liste d'attente.
   */
  async adminCancelParticipant(
    eventId: string,
    userId: string,
    dto: AdminCancelParticipationDto,
    adminId: string,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Événement introuvable.');

    const participation = await this.prisma.eventParticipation.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
      include: { user: true },
    });
    if (!participation) {
      throw new NotFoundException('Ce participant n’est pas inscrit à cet événement.');
    }

    if (participation.status === EventParticipationStatus.CANCELLED) {
      throw new BadRequestException('Cette inscription est déjà annulée.');
    }

    const wasActive =
      participation.status === EventParticipationStatus.REGISTERED ||
      participation.status === EventParticipationStatus.IN_PROGRESS;

    const result = await this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.eventParticipation.update({
        where: { id: participation.id },
        data: {
          status: EventParticipationStatus.CANCELLED,
          cancelledByRole: 'ADMIN',
          cancelledById: adminId,
          cancelledAt: new Date(),
          cancellationReason: dto.reason,
          adminNotes: dto.internalNotes || null,
          waitlistPosition: null,
        },
      });

      let promotedUser: { id: string; userId: string } | null = null;

      if (wasActive) {
        const nextInWaitlist = await tx.eventParticipation.findFirst({
          where: {
            eventId,
            status: EventParticipationStatus.WAITLIST,
          },
          orderBy: [
            { waitlistPosition: 'asc' },
            { createdAt: 'asc' },
          ],
        });

        if (nextInWaitlist) {
          await tx.eventParticipation.update({
            where: { id: nextInWaitlist.id },
            data: {
              status: EventParticipationStatus.REGISTERED,
              waitlistPosition: null,
              promotedFromWaitlistAt: new Date(),
            },
          });
          promotedUser = {
            id: nextInWaitlist.id,
            userId: nextInWaitlist.userId,
          };
        } else {
          await tx.event.update({
            where: { id: eventId },
            data: {
              currentParticipantsCount: {
                decrement: event.currentParticipantsCount > 0 ? 1 : 0,
              },
            },
          });
        }
      }

      await tx.adminAuditLog.create({
        data: {
          userId: adminId,
          action: 'EVENT_PARTICIPANT_CANCELLED',
          targetType: 'EVENT',
          targetId: eventId,
          targetLabel: event.titleFr,
          details: {
            participantId: userId,
            participantEmail: participation.user.email,
            reason: dto.reason,
            internalNotes: dto.internalNotes,
            previousStatus: participation.status,
            promotedUserId: promotedUser?.userId || null,
          },
        },
      });

      return { cancelled, promotedUser };
    });

    // Envoi de notification au participant annulé (si notifyUser !== false)
    if (dto.notifyUser !== false) {
      try {
        await this.notificationsService.createNotification({
          userId,
          titleMg: 'Fanafoanana fisoratana anarana',
          titleFr: 'Inscription annulée',
          messageMg: `Nofoanan'ny mpitantana ny fisoratanao amin'ny hetsika "${event.titleMg}". Antony : ${dto.reason}`,
          messageFr: `Votre inscription à l'événement "${event.titleFr}" a été annulée par l'administration. Motif : ${dto.reason}`,
          category: 'system',
          badgeText: 'Fampahafantarana',
          badgeType: 'info',
          iconName: 'alert-circle-outline',
          iconColor: '#C0392B',
          isBroadcast: false,
        });
      } catch (notifErr) {
        this.logger.warn(`Erreur notification annulation participant : ${notifErr}`);
      }
    }

    // Envoi de notification au participant promu s'il existe
    if (result.promotedUser) {
      try {
        await this.notificationsService.createNotification({
          userId: result.promotedUser.userId,
          titleMg: 'Toerana afaka ! Voamarina ny fisoratanao',
          titleFr: 'Une place s’est libérée ! Inscription confirmée',
          messageMg: `Nisy toerana nanjary afaka ho an'ny hetsika "${event.titleMg}". Voamarina ho mpandray anjara ianao izao !`,
          messageFr: `Une place s'est libérée pour l'événement "${event.titleFr}". Votre inscription est désormais officiellement confirmée !`,
          category: 'community',
          badgeText: 'Voamarina',
          badgeType: 'new',
          iconName: 'checkmark-circle-outline',
          iconColor: '#4A6741',
          targetRoute: `/(screens)/events/${event.id}`,
          isBroadcast: false,
        });
      } catch (promotedNotifErr) {
        this.logger.warn(`Erreur notification promotion liste d'attente : ${promotedNotifErr}`);
      }
    }

    return {
      success: true,
      message: `L'inscription de ${participation.user.name || participation.user.email || 'l’utilisateur'} a été annulée.${
        result.promotedUser ? ' Un participant de la liste d’attente a été promu automatiquement.' : ''
      }`,
      cancelledParticipation: result.cancelled,
      promotedUserId: result.promotedUser?.userId || null,
    };
  }
}
