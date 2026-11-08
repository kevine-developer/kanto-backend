import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreatePartnerEventDto,
  UpdatePartnerEventDto,
  ReviewPartnerEventDto,
} from '../dto/partner-event.dto.js';
import {
  EventStatus,
  EventModerationStatus,
  EventParticipationStatus,
} from '../../../generated/prisma/client.js';

@Injectable()
export class PartnerEventsService {
  private readonly logger = new Logger(PartnerEventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Crée un événement rattaché au partenaire.
   */
  async createEvent(partnerId: string, dto: CreatePartnerEventDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    const titleFr = dto.titleFr.trim();
    const titleMg = dto.titleMg?.trim() || titleFr;
    const descFr = dto.descriptionFr.trim();
    const descMg = dto.descriptionMg?.trim() || descFr;

    const baseSlug = this.slugify(titleFr);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await this.prisma.event.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const moderationStatus = dto.submitForReview
      ? EventModerationStatus.PENDING_REVIEW
      : EventModerationStatus.DRAFT;

    // Statut : reste en DRAFT tant que non approuvé par la modération Kanto
    const initialStatus = EventStatus.DRAFT;

    const event = await this.prisma.event.create({
      data: {
        partnerId,
        slug: finalSlug,
        titleFr,
        titleMg,
        descriptionFr: descFr,
        descriptionMg: descMg,
        shortDescFr: dto.shortDescFr?.trim() || null,
        shortDescMg: dto.shortDescMg?.trim() || null,
        category: dto.category || 'CULTURE',
        status: initialStatus,
        moderationStatus,
        participationType: dto.participationType || 'OPEN',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        registrationDeadline: dto.registrationDeadline
          ? new Date(dto.registrationDeadline)
          : null,
        location: dto.location?.trim() || null,
        externalUrl: dto.externalUrl?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        bannerUrl: dto.bannerUrl?.trim() || null,
        maxParticipants: dto.maxParticipants || null,
        enableWaitlist: Boolean(dto.enableWaitlist),
        waitlistCapacity: dto.waitlistCapacity || null,
        isPaid: Boolean(dto.isPaid),
        ticketPrice: dto.ticketPrice || null,
        currency: dto.currency || 'MGA',
        rulesFr: dto.rulesFr?.trim() || null,
        rulesMg: dto.rulesMg?.trim() || null,
        metadata: (dto.metadata as any) || undefined,
      },
    });

    this.logger.log(
      `[Partner Events] Événement créé par partenaire ${partner.name} (${partnerId}) : ${event.titleFr} (${event.slug}) - Modération: ${moderationStatus}`,
    );

    return event;
  }

  /**
   * Récupère la liste des événements appartenant à un partenaire.
   */
  async getPartnerEvents(
    partnerId: string,
    query: {
      status?: EventStatus;
      moderationStatus?: EventModerationStatus;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = { partnerId };
    if (query.status) where.status = query.status;
    if (query.moderationStatus) where.moderationStatus = query.moderationStatus;
    if (query.search?.trim()) {
      where.OR = [
        { titleFr: { contains: query.search.trim(), mode: 'insensitive' } },
        { titleMg: { contains: query.search.trim(), mode: 'insensitive' } },
        { slug: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        include: {
          _count: {
            select: {
              participations: true,
              marketingRequests: true,
            },
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
   * Récupère un événement du partenaire par son ID ou slug (avec contrôle d'isolation stricte).
   */
  async getPartnerEventById(partnerId: string, eventIdOrSlug: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        partnerId,
        OR: [{ id: eventIdOrSlug }, { slug: eventIdOrSlug }],
      },
      include: {
        rewards: true,
        marketingRequests: {
          include: {
            placements: { include: { placement: true } },
          },
        },
        _count: {
          select: {
            participations: {
              where: { status: { not: EventParticipationStatus.CANCELLED } },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(
        'Événement introuvable ou vous n’avez pas les droits pour y accéder.',
      );
    }

    return event;
  }

  /**
   * Met à jour un événement du partenaire (contrôle d'isolation stricte).
   */
  async updateEvent(
    partnerId: string,
    eventId: string,
    dto: UpdatePartnerEventDto,
  ) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, partnerId },
    });

    if (!event) {
      throw new NotFoundException(
        'Événement introuvable ou vous n’avez pas les droits pour le modifier.',
      );
    }

    const isSubmitting = dto.submitForReview === true;

    // Détermination du statut de modération
    let nextModerationStatus = event.moderationStatus;
    if (isSubmitting) {
      nextModerationStatus = EventModerationStatus.PENDING_REVIEW;
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(dto.titleFr && { titleFr: dto.titleFr.trim() }),
        ...(dto.titleMg && { titleMg: dto.titleMg.trim() }),
        ...(dto.descriptionFr && { descriptionFr: dto.descriptionFr.trim() }),
        ...(dto.descriptionMg && { descriptionMg: dto.descriptionMg.trim() }),
        ...(dto.shortDescFr !== undefined && { shortDescFr: dto.shortDescFr?.trim() || null }),
        ...(dto.shortDescMg !== undefined && { shortDescMg: dto.shortDescMg?.trim() || null }),
        ...(dto.category && { category: dto.category }),
        ...(dto.participationType && { participationType: dto.participationType }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.registrationDeadline !== undefined && {
          registrationDeadline: dto.registrationDeadline ? new Date(dto.registrationDeadline) : null,
        }),
        ...(dto.location !== undefined && { location: dto.location?.trim() || null }),
        ...(dto.externalUrl !== undefined && { externalUrl: dto.externalUrl?.trim() || null }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl?.trim() || null }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl?.trim() || null }),
        ...(dto.maxParticipants !== undefined && { maxParticipants: dto.maxParticipants || null }),
        ...(dto.enableWaitlist !== undefined && { enableWaitlist: dto.enableWaitlist }),
        ...(dto.waitlistCapacity !== undefined && { waitlistCapacity: dto.waitlistCapacity || null }),
        ...(dto.isPaid !== undefined && { isPaid: dto.isPaid }),
        ...(dto.ticketPrice !== undefined && { ticketPrice: dto.ticketPrice || null }),
        ...(dto.currency !== undefined && { currency: dto.currency || 'MGA' }),
        ...(dto.rulesFr !== undefined && { rulesFr: dto.rulesFr?.trim() || null }),
        ...(dto.rulesMg !== undefined && { rulesMg: dto.rulesMg?.trim() || null }),
        ...(dto.cancelledReason !== undefined && { cancelledReason: dto.cancelledReason?.trim() || null }),
        ...(dto.status && { status: dto.status }),
        moderationStatus: nextModerationStatus,
      },
    });

    return updated;
  }

  /**
   * Annule ou supprime un événement partenaire.
   */
  async deleteOrCancelEvent(
    partnerId: string,
    eventId: string,
    reason?: string,
  ) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, partnerId },
      include: {
        _count: { select: { participations: true } },
      },
    });

    if (!event) {
      throw new NotFoundException(
        'Événement introuvable ou vous n’avez pas les droits.',
      );
    }

    // S'il n'y a aucun inscrit et qu'il est en brouillon, on peut supprimer physiquement
    if (
      event.status === EventStatus.DRAFT &&
      event._count.participations === 0
    ) {
      await this.prisma.event.delete({ where: { id: eventId } });
      return { success: true, action: 'DELETED', message: 'Événement supprimé avec succès.' };
    }

    // Sinon, on applique une annulation propre avec motif
    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventStatus.CANCELLED,
        cancelledReason: reason?.trim() || 'Annulé par l’organisateur partenaire',
      },
    });

    return {
      success: true,
      action: 'CANCELLED',
      event: updated,
      message: 'Événement marqué comme annulé.',
    };
  }

  /**
   * Récupère la liste des participants à un événement du partenaire avec respect de la confidentialité (RGPD).
   */
  async getEventRegistrations(
    partnerId: string,
    eventId: string,
    query: {
      status?: EventParticipationStatus;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, partnerId },
    });

    if (!event) {
      throw new NotFoundException(
        'Événement introuvable ou vous n’avez pas les droits pour consulter ses inscriptions.',
      );
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 30));
    const skip = (page - 1) * limit;

    const where: any = { eventId };
    if (query.status) where.status = query.status;

    if (query.search?.trim()) {
      where.user = {
        OR: [
          { name: { contains: query.search.trim(), mode: 'insensitive' } },
          { username: { contains: query.search.trim(), mode: 'insensitive' } },
        ],
      };
    }

    const [total, participations] = await Promise.all([
      this.prisma.eventParticipation.count({ where }),
      this.prisma.eventParticipation.findMany({
        where,
        select: {
          id: true,
          status: true,
          score: true,
          waitlistPosition: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              tier: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Anonymisation sécurisée conforme à la confidentialité : l'email personnel n'est pas exposé
    const formatted = participations.map((p) => ({
      registrationId: p.id,
      status: p.status,
      score: p.score,
      waitlistPosition: p.waitlistPosition,
      registeredAt: p.createdAt,
      participant: {
        id: p.user.id,
        displayName: p.user.name,
        username: p.user.username,
        avatarUrl: p.user.image,
        membershipTier: p.user.tier,
      },
    }));

    return {
      event: {
        id: event.id,
        titleFr: event.titleFr,
        titleMg: event.titleMg,
        currentParticipantsCount: event.currentParticipantsCount,
        maxParticipants: event.maxParticipants,
      },
      registrations: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Statistiques précises et vérifiées d'un événement partenaire.
   */
  async getEventStatistics(partnerId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, partnerId },
      include: {
        _count: {
          select: {
            participations: {
              where: { status: EventParticipationStatus.REGISTERED },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    const [waitlistCount, completedCount, cancelledCount] = await Promise.all([
      this.prisma.eventParticipation.count({
        where: { eventId, status: EventParticipationStatus.WAITLIST },
      }),
      this.prisma.eventParticipation.count({
        where: { eventId, status: EventParticipationStatus.COMPLETED },
      }),
      this.prisma.eventParticipation.count({
        where: { eventId, status: EventParticipationStatus.CANCELLED },
      }),
    ]);

    const confirmedCount = event._count.participations;
    const maxCapacity = event.maxParticipants;
    const fillRate = maxCapacity && maxCapacity > 0
      ? Math.min(100, Math.round((confirmedCount / maxCapacity) * 100))
      : null;

    return {
      eventId: event.id,
      slug: event.slug,
      titleFr: event.titleFr,
      titleMg: event.titleMg,
      viewsCount: event.viewsCount,
      sharesCount: event.sharesCount,
      confirmedParticipants: confirmedCount,
      waitlistParticipants: waitlistCount,
      completedParticipants: completedCount,
      cancelledParticipants: cancelledCount,
      maxCapacity,
      fillRatePercent: fillRate,
      status: event.status,
      moderationStatus: event.moderationStatus,
    };
  }

  // ─── Administration Kanto (Modération) ──────────────────────────────────────

  /**
   * Liste les événements partenaires pour la modération Kanto.
   */
  async getAdminPartnerEvents(query: {
    moderationStatus?: EventModerationStatus;
    partnerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = { partnerId: { not: null } };
    if (query.moderationStatus) where.moderationStatus = query.moderationStatus;
    if (query.partnerId) where.partnerId = query.partnerId;
    if (query.search?.trim()) {
      where.OR = [
        { titleFr: { contains: query.search.trim(), mode: 'insensitive' } },
        { titleMg: { contains: query.search.trim(), mode: 'insensitive' } },
        { slug: { contains: query.search.trim(), mode: 'insensitive' } },
        { partner: { name: { contains: query.search.trim(), mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        include: {
          partner: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              status: true,
              logoUrl: true,
            },
          },
          _count: {
            select: {
              participations: true,
            },
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
   * Décision de modération sur un événement externe par l'administrateur Kanto.
   */
  async reviewPartnerEvent(
    eventId: string,
    dto: ReviewPartnerEventDto,
    adminId: string,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { partner: true },
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable.');
    }

    const isApproved = dto.decision === EventModerationStatus.APPROVED;

    // Si approuvé, le statut de l'événement passe à PUBLISHED (ou ACTIVE s'il a déjà débuté)
    const nextStatus = isApproved ? EventStatus.PUBLISHED : EventStatus.DRAFT;

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        moderationStatus: dto.decision,
        moderatedAt: new Date(),
        moderatedById: adminId,
        moderationRejectionReason: !isApproved ? dto.rejectionReason?.trim() || 'Non conforme à la charte culturelle Kanto MG' : null,
        status: nextStatus,
      },
    });

    // Journalisation d'audit admin
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'PARTNER_EVENT_MODERATED',
        targetType: 'EVENT',
        targetId: eventId,
        targetLabel: event.titleFr,
        details: {
          decision: dto.decision,
          partnerId: event.partnerId,
          partnerName: event.partner?.name,
          rejectionReason: dto.rejectionReason,
        },
      },
    });

    this.logger.log(
      `[Partner Events Admin] Événement ${event.titleFr} (${eventId}) modéré : ${dto.decision} par admin ${adminId}`,
    );

    return updated;
  }
}

