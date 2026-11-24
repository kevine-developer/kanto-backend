import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ValidateTicketDto } from '../dto/ticket.dto.js';
import { TicketStatus } from '../../../generated/prisma/client.js';

export type ValidationResultType =
  | 'GRANTED'
  | 'DENIED_INVALID'
  | 'DENIED_USED'
  | 'DENIED_CANCELLED'
  | 'DENIED_REVOKED'
  | 'DENIED_EXPIRED'
  | 'DENIED_WRONG_EVENT';

@Injectable()
export class TicketValidationService {
  private readonly logger = new Logger(TicketValidationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validation atomique d'un billet à l'entrée par un agent ou administrateur.
   * Utilise une transaction PostgreSQL pour interdire rigoureusement les doubles scans simultanés.
   * Vérifie que l'agent est spécifiquement assigné à cet événement (ou dispose du rôle ADMIN).
   */
  async validateTicket(
    dto: ValidateTicketDto,
    agentId: string,
    agentName?: string,
    agentRole?: string,
    agentEmail?: string,
  ) {
    const { secureToken, deviceInfo, location, eventId } = dto;

    let token = secureToken ? secureToken.trim() : '';
    // Extraction si une URL complète a été scannée (ex: https://.../tickets/inspect/<token>)
    if (token.includes('/')) {
      const parts = token.split('/');
      token = parts[parts.length - 1] || token;
    }

    if (!token) {
      throw new BadRequestException('Token ou numéro de billet manquant.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Recherche par secureToken puis fallback par ticketNumber
      let ticket = await tx.eventTicket.findUnique({
        where: { secureToken: token },
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
              metadata: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      if (!ticket) {
        ticket = await tx.eventTicket.findUnique({
          where: { ticketNumber: token.toUpperCase() },
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
                metadata: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        });
      }

      // Cas 1 : Billet inexistant ou token falsifié
      if (!ticket) {
        this.logger.warn(
          `[TicketValidation] Tentative de scan avec token invalide par l'agent ${agentId}`,
        );
        return {
          allowed: false,
          result: 'DENIED_INVALID' as ValidationResultType,
          message: 'QR Code ou billet introuvable. Accès refusé.',
          ticket: null,
          participant: null,
        };
      }

      // Cas 1b : Contrôle de permission spécifique à CET événement
      const isAdmin = agentRole === 'ADMIN' || agentRole === 'admin';
      const eventMetadata = (ticket.event.metadata as any) || {};
      const checkInAgents: Array<{ userId?: string; email?: string }> = Array.isArray(
        eventMetadata.checkInAgents,
      )
        ? eventMetadata.checkInAgents
        : [];

      const isAuthorizedAgentForThisEvent =
        isAdmin ||
        checkInAgents.some(
          (a) =>
            (a.userId && a.userId === agentId) ||
            (agentEmail && a.email && a.email.toLowerCase() === agentEmail.toLowerCase()),
        );

      if (!isAuthorizedAgentForThisEvent) {
        this.logger.warn(
          `[TicketValidation] 🛑 Accès refusé : l'agent ${agentId} (${agentName || agentEmail}) n'est pas assigné pour l'événement ${ticket.eventId} ("${ticket.event.titleFr}")`,
        );
        return {
          allowed: false,
          result: 'DENIED_INVALID' as ValidationResultType,
          message: `Vous n'avez pas l'autorisation de scanner les billets pour cet événement précis ("${ticket.event.titleFr}").`,
          ticket: null,
          participant: null,
        };
      }

      // Cas 2 : Contrôle d'appartenance à l'événement du point de contrôle
      if (eventId && ticket.eventId !== eventId) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: ticket.eventId,
            scannedById: agentId,
            scannedByName: agentName || 'Agent de contrôle',
            result: 'DENIED_WRONG_EVENT',
            deviceInfo,
            location,
          },
        });

        return {
          allowed: false,
          result: 'DENIED_WRONG_EVENT' as ValidationResultType,
          message: `Ce billet n'est pas valable pour cet événement (prévu pour "${ticket.event.titleFr}").`,
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
          },
          participant: ticket.user,
        };
      }

      // Cas 3 : Billet révoqué (fraude ou sanction)
      if (ticket.status === TicketStatus.REVOKED) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: ticket.eventId,
            scannedById: agentId,
            scannedByName: agentName || 'Agent de contrôle',
            result: 'DENIED_REVOKED',
            deviceInfo,
            location,
          },
        });

        return {
          allowed: false,
          result: 'DENIED_REVOKED' as ValidationResultType,
          message: `Ce billet a été révoqué par la modération (${ticket.revokeReason || 'Motif de sécurité'}).`,
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
          },
          participant: ticket.user,
        };
      }

      // Cas 4 : Billet annulé (désistement du participant)
      if (ticket.status === TicketStatus.CANCELLED) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: ticket.eventId,
            scannedById: agentId,
            scannedByName: agentName || 'Agent de contrôle',
            result: 'DENIED_CANCELLED',
            deviceInfo,
            location,
          },
        });

        return {
          allowed: false,
          result: 'DENIED_CANCELLED' as ValidationResultType,
          message: 'Ce billet a été annulé suite à un désistement. Accès refusé.',
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
          },
          participant: ticket.user,
        };
      }

      const now = new Date();

      // Cas 5 : Billet expiré (date de fin de l'événement dépassée de plus de 12 heures)
      const expirationGraceTime = new Date(ticket.validUntil.getTime() + 12 * 60 * 60 * 1000);
      if (ticket.status === TicketStatus.EXPIRED || now > expirationGraceTime) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: ticket.eventId,
            scannedById: agentId,
            scannedByName: agentName || 'Agent de contrôle',
            result: 'DENIED_EXPIRED',
            deviceInfo,
            location,
          },
        });

        return {
          allowed: false,
          result: 'DENIED_EXPIRED' as ValidationResultType,
          message: 'Cet événement est terminé. Ce billet est expiré.',
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: TicketStatus.EXPIRED,
          },
          participant: ticket.user,
        };
      }

      // Cas 6 : Billet déjà consommé (limite d'entrées atteinte)
      if (ticket.status === TicketStatus.USED || ticket.usedCount >= ticket.maxEntries) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: ticket.eventId,
            scannedById: agentId,
            scannedByName: agentName || 'Agent de contrôle',
            result: 'DENIED_USED',
            deviceInfo,
            location,
          },
        });

        return {
          allowed: false,
          result: 'DENIED_USED' as ValidationResultType,
          message: 'Billet déjà utilisé. Entrée non autorisée.',
          firstUsedAt: ticket.usedAt,
          usedCount: ticket.usedCount,
          maxEntries: ticket.maxEntries,
          ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
          },
          participant: ticket.user,
        };
      }

      // Cas 7 : VALIDATION RÉUSSIE (ACCÈS ACCORDÉ)
      const newUsedCount = ticket.usedCount + 1;
      const isNowFullyUsed = newUsedCount >= ticket.maxEntries;

      const updatedTicket = await tx.eventTicket.update({
        where: { id: ticket.id },
        data: {
          usedCount: newUsedCount,
          usedAt: ticket.usedAt || now,
          status: isNowFullyUsed ? TicketStatus.USED : TicketStatus.VALID,
        },
      });

      // Journalisation d'audit de la validation
      await tx.ticketValidation.create({
        data: {
          ticketId: ticket.id,
          eventId: ticket.eventId,
          scannedById: agentId,
          scannedByName: agentName || 'Agent de contrôle',
          result: 'GRANTED',
          deviceInfo,
          location,
          scannedAt: now,
        },
      });

      this.logger.log(
        `[TicketValidation] Entrée validée pour le billet #${ticket.ticketNumber} (${ticket.user.name}) par l'agent ${agentId}`,
      );

      const remainingEntries = Math.max(0, ticket.maxEntries - newUsedCount);

      return {
        allowed: true,
        result: 'GRANTED' as ValidationResultType,
        message: 'Billet valide. Accès autorisé !',
        scanTimestamp: now.toISOString(),
        usedCount: newUsedCount,
        maxEntries: ticket.maxEntries,
        remainingEntries,
        ticket: {
          id: updatedTicket.id,
          ticketNumber: updatedTicket.ticketNumber,
          status: updatedTicket.status,
          entryMode: updatedTicket.entryMode,
        },
        participant: {
          id: ticket.user.id,
          name: ticket.user.name,
          username: ticket.user.username,
          avatarUrl: ticket.user.image,
        },
        event: {
          id: ticket.event.id,
          titleMg: ticket.event.titleMg,
          titleFr: ticket.event.titleFr,
          location: ticket.event.location,
          startDate: ticket.event.startDate,
        },
      };
    });
  }

  /**
   * Inspection sans validation (aperçu avant scan) pour vérifier l'état du billet sans consommer l'entrée.
   * Vérifie que l'agent est assigné à cet événement précis (ou ADMIN).
   */
  async inspectTicket(
    secureToken: string,
    agentId?: string,
    agentRole?: string,
    agentEmail?: string,
  ) {
    let token = secureToken ? secureToken.trim() : '';
    if (token.includes('/')) {
      const parts = token.split('/');
      token = parts[parts.length - 1] || token;
    }

    if (!token) {
      throw new BadRequestException('Token de validation manquant.');
    }

    let ticket = await this.prisma.eventTicket.findUnique({
      where: { secureToken: token },
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
            metadata: true,
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
      ticket = await this.prisma.eventTicket.findUnique({
        where: { ticketNumber: token.toUpperCase() },
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
              metadata: true,
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
    }

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    // Vérification de permission si l'agent est renseigné
    if (agentId) {
      const isAdmin = agentRole === 'ADMIN' || agentRole === 'admin';
      const eventMetadata = (ticket.event.metadata as any) || {};
      const checkInAgents: Array<{ userId?: string; email?: string }> = Array.isArray(
        eventMetadata.checkInAgents,
      )
        ? eventMetadata.checkInAgents
        : [];

      const isAuthorizedAgentForThisEvent =
        isAdmin ||
        checkInAgents.some(
          (a) =>
            (a.userId && a.userId === agentId) ||
            (agentEmail && a.email && a.email.toLowerCase() === agentEmail.toLowerCase()),
        );

      if (!isAuthorizedAgentForThisEvent) {
        throw new BadRequestException(
          `Vous n'êtes pas assigné comme agent de contrôle pour l'événement "${ticket.event.titleFr}".`,
        );
      }
    }

    return {
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      entryMode: ticket.entryMode,
      validFrom: ticket.validFrom,
      validUntil: ticket.validUntil,
      usedCount: ticket.usedCount,
      maxEntries: ticket.maxEntries,
      usedAt: ticket.usedAt,
      event: ticket.event,
      participant: ticket.user,
    };
  }
}
