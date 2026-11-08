import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateMarketingRequestDto,
  SendMarketingMessageDto,
  ReviewMarketingRequestDto,
} from '../dto/partner-marketing.dto.js';
import { DEFAULT_MARKETING_PLACEMENTS } from '../constants/default-placements.constant.js';
import { MarketingRequestStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class PartnerMarketingService implements OnModuleInit {
  private readonly logger = new Logger(PartnerMarketingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultPlacementsIfEmpty();
  }

  /**
   * Initialise de manière idempotente le catalogue des placements marketing s'il est vide.
   */
  async seedDefaultPlacementsIfEmpty() {
    try {
      const count = await this.prisma.marketingPlacement.count();
      if (count === 0) {
        this.logger.log(
          '🌱 [Marketing] Initialisation automatique du catalogue des placements partenaires...',
        );
        for (const p of DEFAULT_MARKETING_PLACEMENTS) {
          await this.prisma.marketingPlacement.upsert({
            where: { code: p.code },
            update: {},
            create: {
              code: p.code,
              nameFr: p.nameFr,
              nameMg: p.nameMg,
              descriptionFr: p.descriptionFr,
              descriptionMg: p.descriptionMg,
              specifications: p.specifications as any,
              basePrice: p.basePrice,
              currency: p.currency,
              allowedDurationsDays: p.allowedDurationsDays,
              orderIndex: p.orderIndex,
              isActive: true,
            },
          });
        }
        this.logger.log(
          '✅ [Marketing] Catalogue des placements Kanto MG initialisé avec succès.',
        );
      }
    } catch (err: unknown) {
      this.logger.warn(
        `[Marketing] Erreur lors de l’initialisation des placements : ${(err as Error).message}`,
      );
    }
  }

  /**
   * Récupère le catalogue des emplacements marketing disponibles pour les organisateurs.
   */
  async getPlacementsCatalog() {
    return this.prisma.marketingPlacement.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Crée une demande de prestation marketing pour un événement du partenaire.
   */
  async createMarketingRequest(
    partnerId: string,
    dto: CreateMarketingRequestDto,
  ) {
    // Vérifier que l'événement appartient bien au partenaire
    const event = await this.prisma.event.findFirst({
      where: { id: dto.eventId, partnerId },
    });

    if (!event) {
      throw new NotFoundException(
        'Événement introuvable ou vous n’avez pas les droits pour cet événement.',
      );
    }

    if (new Date(dto.requestedEndDate) <= new Date(dto.requestedStartDate)) {
      throw new BadRequestException(
        'La date de fin demandée doit être postérieure à la date de début.',
      );
    }

    // Récupérer les placements demandés
    const placements = await this.prisma.marketingPlacement.findMany({
      where: {
        code: { in: dto.placementCodes },
        isActive: true,
      },
    });

    if (placements.length === 0) {
      throw new BadRequestException(
        'Veuillez sélectionner au moins un emplacement marketing valide.',
      );
    }

    const initialMessage = {
      senderRole: 'PARTNER',
      senderName: event.titleFr,
      text:
        dto.campaignGoals ||
        'Demande de visibilité et campagne promotionnelle soumise.',
      sentAt: new Date().toISOString(),
    };

    const request = await this.prisma.marketingRequest.create({
      data: {
        partnerId,
        eventId: dto.eventId,
        status: MarketingRequestStatus.SUBMITTED,
        requestedStartDate: new Date(dto.requestedStartDate),
        requestedEndDate: new Date(dto.requestedEndDate),
        campaignGoals: dto.campaignGoals?.trim() || null,
        targetAudience: dto.targetAudience?.trim() || null,
        proposedBudget: dto.proposedBudget || null,
        creatives: dto.creatives || undefined,
        messages: [initialMessage],
        placements: {
          create: placements.map((p) => ({
            placementId: p.id,
          })),
        },
      },
      include: {
        placements: { include: { placement: true } },
        event: {
          select: { id: true, titleFr: true, titleMg: true, slug: true },
        },
      },
    });

    this.logger.log(
      `[Marketing] Nouvelle demande de prestation créée par partenaire ${partnerId} pour l'événement ${event.id}`,
    );

    return request;
  }

  /**
   * Récupère la liste des demandes marketing d'un partenaire.
   */
  async getPartnerMarketingRequests(partnerId: string) {
    return this.prisma.marketingRequest.findMany({
      where: { partnerId },
      include: {
        event: {
          select: {
            id: true,
            titleFr: true,
            titleMg: true,
            slug: true,
            startDate: true,
            endDate: true,
          },
        },
        placements: {
          include: {
            placement: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère les détails d'une demande marketing (isolation stricte par partenaire).
   */
  async getPartnerMarketingRequestById(partnerId: string, requestId: string) {
    const request = await this.prisma.marketingRequest.findFirst({
      where: { id: requestId, partnerId },
      include: {
        event: true,
        placements: {
          include: {
            placement: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Demande marketing introuvable.');
    }

    return request;
  }

  /**
   * Récupère les détails d'une demande marketing pour l'administration Kanto.
   */
  async getAdminMarketingRequestById(requestId: string) {
    const request = await this.prisma.marketingRequest.findUnique({
      where: { id: requestId },
      include: {
        partner: true,
        event: true,
        placements: {
          include: {
            placement: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Demande marketing introuvable.');
    }

    return request;
  }

  /**
   * Ajoute un message dans le fil de discussion de la demande.
   */
  async addMessage(
    requestId: string,
    partnerId: string | null,
    dto: SendMarketingMessageDto,
    author: { role: 'PARTNER' | 'ADMIN'; name: string },
  ) {
    const where: any = { id: requestId };
    if (partnerId) where.partnerId = partnerId;

    const request = await this.prisma.marketingRequest.findFirst({ where });
    if (!request) {
      throw new NotFoundException('Demande marketing introuvable.');
    }

    const currentMessages: any[] = Array.isArray(request.messages)
      ? (request.messages as any[])
      : [];

    const newMessage = {
      senderRole: author.role,
      senderName: author.name,
      text: dto.message.trim(),
      sentAt: new Date().toISOString(),
    };

    const updated = await this.prisma.marketingRequest.update({
      where: { id: requestId },
      data: {
        messages: [...currentMessages, newMessage],
      },
    });

    return {
      success: true,
      message: newMessage,
      totalMessages: (updated.messages as any[]).length,
    };
  }

  /**
   * Enregistre un incrément d'impression ou de clic sur une campagne marketing (métriques réelles).
   */
  async recordMetrics(
    requestId: string,
    type: 'IMPRESSION' | 'CLICK' | 'CONVERSION',
  ) {
    const data: any = {};
    if (type === 'IMPRESSION') data.impressionsCount = { increment: 1 };
    if (type === 'CLICK') data.clicksCount = { increment: 1 };
    if (type === 'CONVERSION') data.conversionsCount = { increment: 1 };

    try {
      await this.prisma.marketingRequest.update({
        where: { id: requestId },
        data,
      });
    } catch {
      // Ignorer silencieusement si la campagne n'existe plus
    }
  }

  // ─── Administration Kanto ───────────────────────────────────────────────────

  /**
   * Récupère toutes les demandes marketing pour l'équipe Kanto avec filtres.
   */
  async getAdminMarketingRequests(query: {
    status?: MarketingRequestStatus;
    partnerId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.partnerId) where.partnerId = query.partnerId;

    const [total, items] = await Promise.all([
      this.prisma.marketingRequest.count({ where }),
      this.prisma.marketingRequest.findMany({
        where,
        include: {
          partner: {
            select: {
              id: true,
              name: true,
              slug: true,
              email: true,
              type: true,
            },
          },
          event: {
            select: { id: true, titleFr: true, titleMg: true, slug: true },
          },
          placements: {
            include: { placement: true },
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
   * Traitement d'une demande marketing par l'administrateur Kanto.
   */
  async reviewMarketingRequest(
    requestId: string,
    dto: ReviewMarketingRequestDto,
    adminId: string,
  ) {
    const request = await this.prisma.marketingRequest.findUnique({
      where: { id: requestId },
      include: { partner: true, event: true },
    });

    if (!request) {
      throw new NotFoundException('Demande marketing introuvable.');
    }

    const updated = await this.prisma.marketingRequest.update({
      where: { id: requestId },
      data: {
        status: dto.status,
        actualStartDate: dto.actualStartDate
          ? new Date(dto.actualStartDate)
          : request.actualStartDate,
        actualEndDate: dto.actualEndDate
          ? new Date(dto.actualEndDate)
          : request.actualEndDate,
        adminFeedback: dto.adminFeedback?.trim() || request.adminFeedback,
      },
    });

    // Journalisation d'audit admin
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'MARKETING_REQUEST_MODERATED',
        targetType: 'MARKETING_REQUEST',
        targetId: requestId,
        targetLabel: `${request.partner.name} - ${request.event.titleFr}`,
        details: { status: dto.status, adminFeedback: dto.adminFeedback },
      },
    });

    return updated;
  }
}
