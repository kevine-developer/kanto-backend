import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AdminCancelTicketDto,
  AdminRevokeTicketDto,
  TicketAdminQueryDto,
} from '../dto/ticket.dto.js';
import { TicketStatus } from '../../../generated/prisma/client.js';

@Injectable()
export class TicketsAdminService {
  private readonly logger = new Logger(TicketsAdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère la liste paginée et filtrée des billets d'un événement.
   */
  async getEventTickets(eventId: string, query: TicketAdminQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { eventId };

    if (query.status && query.status !== 'ALL') {
      where.status = query.status as TicketStatus;
    }

    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [tickets, total] = await Promise.all([
      this.prisma.eventTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            },
          },
          validations: {
            take: 3,
            orderBy: { scannedAt: 'desc' },
          },
        },
      }),
      this.prisma.eventTicket.count({ where }),
    ]);

    return {
      data: tickets.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        status: t.status,
        entryMode: t.entryMode,
        usedCount: t.usedCount,
        maxEntries: t.maxEntries,
        validFrom: t.validFrom,
        validUntil: t.validUntil,
        usedAt: t.usedAt,
        createdAt: t.createdAt,
        cancelledAt: t.cancelledAt,
        cancellationReason: t.cancellationReason,
        revokedAt: t.revokedAt,
        revokeReason: t.revokeReason,
        participant: t.user,
        recentScans: t.validations,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Statistiques complètes de billetterie pour un événement.
   */
  async getEventTicketingStats(eventId: string) {
    const [
      totalTickets,
      validTickets,
      usedTickets,
      cancelledTickets,
      revokedTickets,
      totalScans,
    ] = await Promise.all([
      this.prisma.eventTicket.count({ where: { eventId } }),
      this.prisma.eventTicket.count({
        where: { eventId, status: TicketStatus.VALID },
      }),
      this.prisma.eventTicket.count({
        where: { eventId, status: TicketStatus.USED },
      }),
      this.prisma.eventTicket.count({
        where: { eventId, status: TicketStatus.CANCELLED },
      }),
      this.prisma.eventTicket.count({
        where: { eventId, status: TicketStatus.REVOKED },
      }),
      this.prisma.ticketValidation.count({
        where: { eventId, result: 'GRANTED' },
      }),
    ]);

    const checkInRate =
      totalTickets > 0 ? Math.round((usedTickets / totalTickets) * 100) : 0;

    return {
      eventId,
      totalTickets,
      validTickets,
      usedTickets,
      cancelledTickets,
      revokedTickets,
      totalScans,
      checkInRate,
    };
  }

  /**
   * Annulation administrative d'un billet individuel avec journal d'audit.
   */
  async adminCancelTicket(
    ticketId: string,
    adminId: string,
    dto: AdminCancelTicketDto,
  ) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: { user: true, event: true },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    const updated = await this.prisma.eventTicket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledById: adminId,
        cancellationReason: dto.reason,
      },
    });

    // Journalisation d'audit
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'TICKET_CANCELLED',
        targetType: 'EVENT_TICKET',
        targetId: ticket.id,
        targetLabel: `${ticket.ticketNumber} (${ticket.user.name})`,
        reason: dto.reason,
        details: {
          eventId: ticket.eventId,
          internalNotes: dto.internalNotes,
        },
      },
    });

    this.logger.log(
      `[TicketsAdmin] Billet #${ticket.ticketNumber} annulé par l'administrateur ${adminId}. Motif: ${dto.reason}`,
    );

    return updated;
  }

  /**
   * Révocation d'un billet suspect ou frauduleux avec journal d'audit.
   */
  async adminRevokeTicket(
    ticketId: string,
    adminId: string,
    dto: AdminRevokeTicketDto,
  ) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: { user: true },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    const updated = await this.prisma.eventTicket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.REVOKED,
        revokedAt: new Date(),
        revokedById: adminId,
        revokeReason: dto.reason,
      },
    });

    // Journalisation d'audit
    await this.prisma.adminAuditLog.create({
      data: {
        userId: adminId,
        action: 'TICKET_REVOKED',
        targetType: 'EVENT_TICKET',
        targetId: ticket.id,
        targetLabel: `${ticket.ticketNumber} (${ticket.user.name})`,
        reason: dto.reason,
      },
    });

    this.logger.warn(
      `[TicketsAdmin] Billet #${ticket.ticketNumber} RÉVOQUÉ par l'administrateur ${adminId}. Motif: ${dto.reason}`,
    );

    return updated;
  }

  /**
   * Récupère l'historique complet des scans d'un billet.
   */
  async getTicketHistory(ticketId: string) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: {
        validations: {
          orderBy: { scannedAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    return {
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      validations: ticket.validations,
    };
  }
}
