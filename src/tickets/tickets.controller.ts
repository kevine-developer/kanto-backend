import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './services/tickets.service.js';
import { TicketValidationService } from './services/ticket-validation.service.js';
import { WalletPassService } from './services/wallet-pass.service.js';
import { ValidateTicketDto } from './dto/ticket.dto.js';
import {
  AuthGuard,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly ticketValidationService: TicketValidationService,
    private readonly walletPassService: WalletPassService,
  ) {}

  /**
   * Récupère tous les billets de l'utilisateur connecté.
   */
  @Get('my')
  @UseGuards(AuthGuard)
  async getMyTickets(@Session() session: UserSession) {
    return this.ticketsService.getMyTickets(session.user.id);
  }

  /**
   * Récupère le billet de l'utilisateur pour un événement spécifique.
   */
  @Get('event/:eventId')
  @UseGuards(AuthGuard)
  async getTicketByEvent(
    @Param('eventId') eventId: string,
    @Session() session: UserSession,
  ) {
    return this.ticketsService.getTicketByEventId(eventId, session.user.id);
  }

  /**
   * Récupère les détails complets d'un billet par son ID.
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  async getTicket(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    const isAdminOrStaff =
      session.user.role === 'ADMIN' ||
      (session.user.role as any) === 'admin' ||
      session.user.role === 'MODERATOR' ||
      (session.user.role as any) === 'moderator';
    return this.ticketsService.getTicketById(id, session.user.id, isAdminOrStaff);
  }

  /**
   * Valide un billet scanné à l'entrée (contrôle d'accès atomique).
   * Accessible aux administrateurs généraux et aux agents assignés à cet événement précis.
   */
  @Post('validate')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateTicket(
    @Body() dto: ValidateTicketDto,
    @Session() session: UserSession,
  ) {
    const roleStr = Array.isArray(session.user.role)
      ? session.user.role[0]
      : (session.user.role as string | undefined);

    return this.ticketValidationService.validateTicket(
      dto,
      session.user.id,
      session.user.name,
      roleStr,
      session.user.email,
    );
  }

  /**
   * Inspection d'un billet sans consommer l'accès (aperçu préalable).
   * Accessible aux administrateurs généraux et aux agents assignés à cet événement précis.
   */
  @Get('inspect/:token')
  @UseGuards(AuthGuard)
  async inspectTicket(
    @Param('token') token: string,
    @Session() session: UserSession,
  ) {
    const roleStr = Array.isArray(session.user.role)
      ? session.user.role[0]
      : (session.user.role as string | undefined);

    return this.ticketValidationService.inspectTicket(
      token,
      session.user.id,
      roleStr,
      session.user.email,
    );
  }

  /**
   * Génération du payload Google Wallet pour ajouter le billet à Google Pay / Wallet.
   */
  @Get(':id/google-wallet')
  @UseGuards(AuthGuard)
  async getGoogleWalletPass(
    @Param('id') ticketId: string,
    @Session() session: UserSession,
  ) {
    return this.walletPassService.generateGoogleWalletPayload(
      ticketId,
      session.user.id,
    );
  }

  /**
   * Génération du payload Apple Wallet (PassKit) pour ajouter le billet à Apple Cartes.
   */
  @Get(':id/apple-wallet')
  @UseGuards(AuthGuard)
  async getAppleWalletPass(
    @Param('id') ticketId: string,
    @Session() session: UserSession,
  ) {
    return this.walletPassService.generateApplePassKitPayload(
      ticketId,
      session.user.id,
    );
  }
}
