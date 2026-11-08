import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  RegisterPartnerDto,
  UpdatePartnerProfileDto,
  VerifyPartnerDto,
} from '../dto/partner.dto.js';
import { PartnerStatus, UserRole } from '../../../generated/prisma/client.js';

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

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
   * Enregistrement d'un nouveau partenaire organisateur.
   */
  async registerPartner(dto: RegisterPartnerDto, userId?: string) {
    const baseSlug = this.slugify(dto.name);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await this.prisma.partner.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const partner = await this.prisma.partner.create({
      data: {
        name: dto.name.trim(),
        slug: finalSlug,
        type: dto.type,
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        description: dto.description?.trim() || null,
        websiteUrl: dto.websiteUrl?.trim() || null,
        address: dto.address?.trim() || null,
        socialLinks: dto.socialLinks || undefined,
        status: PartnerStatus.PENDING_VERIFICATION,
        userId: userId || null,
      },
    });

    this.logger.log(
      `[Partners] Nouveau partenaire inscrit : ${partner.name} (${partner.slug}) - Statut: PENDING_VERIFICATION`,
    );

    return partner;
  }

  /**
   * Récupère le profil d'un partenaire par son ID ou slug.
   */
  async getPartnerByIdOrSlug(idOrSlug: string) {
    const partner = await this.prisma.partner.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: {
          select: {
            events: true,
            apiKeys: true,
            marketingRequests: true,
          },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    return partner;
  }

  /**
   * Récupère le compte partenaire associé à un utilisateur connecté.
   */
  async getPartnerByUserId(userId: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { userId },
      include: {
        _count: {
          select: {
            events: true,
            apiKeys: true,
            marketingRequests: true,
          },
        },
      },
    });

    return partner;
  }

  /**
   * Met à jour le profil d'un partenaire.
   */
  async updatePartnerProfile(partnerId: string, dto: UpdatePartnerProfileDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    return this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.type && { type: dto.type }),
        ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl || null }),
        ...(dto.coverUrl !== undefined && { coverUrl: dto.coverUrl || null }),
        ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl || null }),
        ...(dto.email && { email: dto.email.trim().toLowerCase() }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
        ...(dto.address !== undefined && { address: dto.address?.trim() || null }),
        ...(dto.socialLinks !== undefined && { socialLinks: dto.socialLinks }),
      },
    });
  }

  /**
   * Statistiques globales du tableau de bord pour un partenaire.
   */
  async getPartnerDashboardStats(partnerId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      select: { id: true, name: true, status: true },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    const [eventsStats, activeKeysCount, marketingRequestsCount] =
      await Promise.all([
        this.prisma.event.aggregate({
          where: { partnerId },
          _sum: {
            currentParticipantsCount: true,
            viewsCount: true,
            sharesCount: true,
          },
          _count: {
            id: true,
          },
        }),
        this.prisma.partnerApiKey.count({
          where: { partnerId, revokedAt: null },
        }),
        this.prisma.marketingRequest.count({
          where: { partnerId },
        }),
      ]);

    const activeEventsCount = await this.prisma.event.count({
      where: {
        partnerId,
        status: 'ACTIVE',
        moderationStatus: 'APPROVED',
      },
    });

    const pendingReviewEventsCount = await this.prisma.event.count({
      where: {
        partnerId,
        moderationStatus: 'PENDING_REVIEW',
      },
    });

    return {
      partnerId: partner.id,
      partnerName: partner.name,
      partnerStatus: partner.status,
      totalEvents: eventsStats._count.id,
      activeEvents: activeEventsCount,
      pendingReviewEvents: pendingReviewEventsCount,
      totalParticipants: eventsStats._sum.currentParticipantsCount || 0,
      totalViews: eventsStats._sum.viewsCount || 0,
      totalShares: eventsStats._sum.sharesCount || 0,
      activeApiKeys: activeKeysCount,
      marketingRequestsCount,
    };
  }

  // ─── Administration Kanto ───────────────────────────────────────────────────

  /**
   * Liste les partenaires pour l'administration avec filtres et pagination.
   */
  async getAdminPartners(query: {
    status?: PartnerStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search?.trim()) {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { email: { contains: query.search.trim(), mode: 'insensitive' } },
        { slug: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.partner.count({ where }),
      this.prisma.partner.findMany({
        where,
        include: {
          _count: {
            select: {
              events: true,
              apiKeys: true,
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
   * Modère un partenaire (validation, suspension ou rejet avec motif).
   */
  async verifyPartner(partnerId: string, dto: VerifyPartnerDto, adminId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partenaire introuvable.');
    }

    const updated = await this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        status: dto.status,
        verifiedAt: dto.status === PartnerStatus.VERIFIED ? new Date() : null,
        verifiedById: dto.status === PartnerStatus.VERIFIED ? adminId : null,
        rejectionReason:
          dto.status === PartnerStatus.REJECTED
            ? dto.rejectionReason?.trim() || 'Dossier incomplet ou non conforme'
            : null,
      },
    });

    // Journalisation d'audit admin
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'PARTNER_STATUS_MODERATED',
        targetType: 'PARTNER',
        targetId: partnerId,
        targetLabel: partner.name,
        details: { status: dto.status, rejectionReason: dto.rejectionReason },
      },
    });

    this.logger.log(
      `[Partners Admin] Statut partenaire ${partner.name} (${partnerId}) mis à jour : ${dto.status} par admin ${adminId}`,
    );

    return updated;
  }
}

