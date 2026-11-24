import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  TicketEntryMode,
  TicketStatus,
} from '../../../generated/prisma/client.js';

export interface GenerateTicketParams {
  eventId: string;
  participationId: string;
  userId: string;
  validFrom: Date;
  validUntil: Date;
  entryMode?: TicketEntryMode;
  maxEntries?: number;
}

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Génère un numéro de billet lisible et unique, ex: "KT-FET-9X4B2A".
   */
  private generateReadableTicketNumber(slugOrTitle: string): string {
    const cleanPrefix = slugOrTitle
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 3) || 'EVT';
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `KT-${cleanPrefix}-${randomHex}`;
  }

  /**
   * Génère un token cryptographique sécurisé (64 caractères hexadécimaux).
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Génère automatiquement un billet individuel unique lors d'une inscription confirmée.
   * Cette méthode est strictement idempotente : si un billet existe déjà pour cette participation, il est retourné.
   */
  async generateTicketForParticipation(params: GenerateTicketParams) {
    const {
      eventId,
      participationId,
      userId,
      validFrom,
      validUntil,
      entryMode = TicketEntryMode.SINGLE,
      maxEntries = 1,
    } = params;

    // Idempotence : vérifier si un billet existe déjà
    const existing = await this.prisma.eventTicket.findUnique({
      where: { participationId },
      include: {
        event: {
          select: {
            id: true,
            titleMg: true,
            titleFr: true,
            slug: true,
            location: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (existing) {
      return this.formatTicketResponse(existing);
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { slug: true, titleFr: true },
    });

    const ticketNumber = this.generateReadableTicketNumber(
      event?.slug || event?.titleFr || 'EVT',
    );
    const secureToken = this.generateSecureToken();

    const ticket = await this.prisma.eventTicket.create({
      data: {
        ticketNumber,
        secureToken,
        eventId,
        participationId,
        userId,
        status: TicketStatus.VALID,
        entryMode,
        validFrom,
        validUntil,
        maxEntries: entryMode === TicketEntryMode.SINGLE ? 1 : Math.max(1, maxEntries),
        qrMode: 'STATIC',
      },
      include: {
        event: {
          select: {
            id: true,
            titleMg: true,
            titleFr: true,
            slug: true,
            location: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    this.logger.log(
      `[Tickets] Billet individuel créé #${ticket.ticketNumber} pour utilisateur ${userId} (événement ${eventId})`,
    );

    return this.formatTicketResponse(ticket);
  }

  /**
   * Récupère la liste de tous les billets de l'utilisateur connecté.
   */
  async getMyTickets(userId: string) {
    const tickets = await this.prisma.eventTicket.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            titleMg: true,
            titleFr: true,
            slug: true,
            location: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
            status: true,
          },
        },
      },
      orderBy: { validFrom: 'desc' },
    });

    return tickets.map((t) => this.formatTicketResponse(t));
  }

  /**
   * Récupère un billet spécifique par son identifiant.
   * Seul le propriétaire ou un administrateur peut y accéder.
   */
  async getTicketById(ticketId: string, userId: string, isAdmin = false) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          select: {
            id: true,
            titleMg: true,
            titleFr: true,
            slug: true,
            location: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    if (!isAdmin && ticket.userId !== userId) {
      throw new ForbiddenException('Vous n’avez pas accès à ce billet.');
    }

    return this.formatTicketResponse(ticket);
  }

  /**
   * Récupère le billet actif de l'utilisateur pour un événement donné.
   */
  async getTicketByEventId(eventId: string, userId: string) {
    const ticket = await this.prisma.eventTicket.findFirst({
      where: {
        eventId,
        userId,
      },
      include: {
        event: {
          select: {
            id: true,
            titleMg: true,
            titleFr: true,
            slug: true,
            location: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!ticket) {
      return null;
    }

    return this.formatTicketResponse(ticket);
  }

  /**
   * Annule le billet associé à une participation donnée (désistement ou annulation admin).
   */
  async cancelTicketForParticipation(
    participationId: string,
    cancelledById?: string,
    reason?: string,
  ) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { participationId },
    });

    if (!ticket) {
      return null;
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      return ticket;
    }

    const updated = await this.prisma.eventTicket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledById,
        cancellationReason: reason || 'Désistement ou annulation',
      },
    });

    this.logger.log(
      `[Tickets] Billet #${ticket.ticketNumber} annulé pour participation ${participationId}`,
    );

    return updated;
  }

  /**
   * Formate la réponse JSON standardisée d'un billet.
   */
  formatTicketResponse(ticket: any) {
    const remainingEntries = Math.max(
      0,
      (ticket.maxEntries || 1) - (ticket.usedCount || 0),
    );

    // Payload sécurisé du QR Code (schéma universel kanto://)
    const qrCodePayload = `kanto://ticket/validate/${ticket.secureToken}`;

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      entryMode: ticket.entryMode,
      validFrom: ticket.validFrom,
      validUntil: ticket.validUntil,
      usedAt: ticket.usedAt,
      usedCount: ticket.usedCount,
      maxEntries: ticket.maxEntries,
      remainingEntries,
      qrMode: ticket.qrMode,
      qrCodePayload,
      cancelledAt: ticket.cancelledAt,
      cancellationReason: ticket.cancellationReason,
      revokedAt: ticket.revokedAt,
      revokeReason: ticket.revokeReason,
      createdAt: ticket.createdAt,
      googleWalletObjectId: ticket.googleWalletObjectId,
      appleWalletSerialNumber: ticket.appleWalletSerialNumber,
      event: ticket.event,
      participant: ticket.user
        ? {
            id: ticket.user.id,
            name: ticket.user.name,
            username: ticket.user.username,
          }
        : undefined,
    };
  }
}
