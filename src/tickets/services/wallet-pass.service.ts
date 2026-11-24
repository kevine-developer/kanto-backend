import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface GoogleWalletPassPayload {
  iss: string;
  aud: string;
  typ: string;
  iat: number;
  origins: string[];
  payload: {
    eventTicketObjects: Array<{
      id: string;
      classId: string;
      state: string;
      barcode: {
        type: string;
        value: string;
        alternateText: string;
      };
      ticketHolderName: string;
      ticketNumber: string;
      eventName: {
        defaultValue: {
          language: string;
          value: string;
        };
      };
      dateTime: {
        start: string;
        end?: string;
      };
      venue: {
        name: {
          defaultValue: {
            language: string;
            value: string;
          };
        };
      };
      hexBackgroundColor: string;
    }>;
  };
}

export interface ApplePassKitPayload {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  foregroundColor: string;
  backgroundColor: string;
  labelColor: string;
  barcode: {
    message: string;
    format: string;
    messageEncoding: string;
    altText: string;
  };
  eventTicket: {
    primaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    secondaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    auxiliaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
  };
}

@Injectable()
export class WalletPassService {
  private readonly logger = new Logger(WalletPassService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Génère la structure de données standardisée pour Google Wallet Event Ticket.
   * Compatible avec l'API Google Pay & Wallet Passes.
   */
  async generateGoogleWalletPayload(
    ticketId: string,
    userId: string,
  ): Promise<GoogleWalletPassPayload> {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    if (ticket.userId !== userId) {
      throw new BadRequestException('Accès non autorisé à ce billet.');
    }

    const issuerId =
      process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000022345678';
    const classId = `${issuerId}.kanto_event_${ticket.eventId.replace(/-/g, '_')}`;
    const objectId = `${issuerId}.kanto_ticket_${ticket.id.replace(/-/g, '_')}`;

    // Mise à jour de l'identifiant Google Wallet en base
    await this.prisma.eventTicket.update({
      where: { id: ticket.id },
      data: { googleWalletObjectId: objectId },
    });

    const now = Math.floor(Date.now() / 1000);

    return {
      iss:
        process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL ||
        'service-account@kanto-mg.iam.gserviceaccount.com',
      aud: 'google',
      typ: 'savetowallet',
      iat: now,
      origins: ['https://app-kanto.gastsar.fr', 'https://auth-kanto.gastsar.fr'],
      payload: {
        eventTicketObjects: [
          {
            id: objectId,
            classId,
            state: ticket.status === 'VALID' ? 'ACTIVE' : 'COMPLETED',
            barcode: {
              type: 'QR_CODE',
              value: ticket.secureToken,
              alternateText: ticket.ticketNumber,
            },
            ticketHolderName: ticket.user.name,
            ticketNumber: ticket.ticketNumber,
            eventName: {
              defaultValue: {
                language: 'fr-FR',
                value: ticket.event.titleFr,
              },
            },
            dateTime: {
              start: ticket.event.startDate.toISOString(),
              end: ticket.event.endDate.toISOString(),
            },
            venue: {
              name: {
                defaultValue: {
                  language: 'fr-FR',
                  value: ticket.event.location || 'Madagascar',
                },
              },
            },
            hexBackgroundColor: '#4A6741', // Vert Tanimbary identitaire de Kanto
          },
        ],
      },
    };
  }

  /**
   * Génère la structure de données pass.json pour Apple Wallet (PassKit).
   */
  async generateApplePassKitPayload(
    ticketId: string,
    userId: string,
  ): Promise<ApplePassKitPayload> {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Billet introuvable.');
    }

    if (ticket.userId !== userId) {
      throw new BadRequestException('Accès non autorisé à ce billet.');
    }

    const passTypeIdentifier =
      process.env.APPLE_PASS_TYPE_ID || 'pass.mg.kanto.tickets';
    const teamIdentifier = process.env.APPLE_TEAM_ID || 'KANTO12345';

    // Mise à jour de l'identifiant Apple Wallet en base
    await this.prisma.eventTicket.update({
      where: { id: ticket.id },
      data: { appleWalletSerialNumber: ticket.ticketNumber },
    });

    return {
      formatVersion: 1,
      passTypeIdentifier,
      serialNumber: ticket.ticketNumber,
      teamIdentifier,
      organizationName: 'Kanto MG',
      description: ticket.event.titleFr,
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(74, 103, 65)', // Vert Tanimbary
      labelColor: 'rgb(224, 162, 74)', // Ocre doré
      barcode: {
        message: ticket.secureToken,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText: ticket.ticketNumber,
      },
      eventTicket: {
        primaryFields: [
          {
            key: 'event',
            label: 'HETSIKA / ÉVÉNEMENT',
            value: ticket.event.titleFr,
          },
        ],
        secondaryFields: [
          {
            key: 'holder',
            label: 'MPANDRAY ANJARA / PARTICIPANT',
            value: ticket.user.name,
          },
          {
            key: 'ticketNumber',
            label: 'LAHARANA / TICKET N°',
            value: ticket.ticketNumber,
          },
        ],
        auxiliaryFields: [
          {
            key: 'date',
            label: 'DATY / DATE',
            value: ticket.event.startDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          },
          {
            key: 'location',
            label: 'TOERANA / LIEU',
            value: ticket.event.location || 'Madagascar',
          },
        ],
      },
    };
  }
}
