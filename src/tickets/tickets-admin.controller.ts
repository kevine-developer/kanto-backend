import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsAdminService } from './services/tickets-admin.service.js';
import {
  AdminCancelTicketDto,
  AdminRevokeTicketDto,
  TicketAdminQueryDto,
} from './dto/ticket.dto.js';
import {
  AuthGuard,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('tickets/admin')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class TicketsAdminController {
  constructor(private readonly ticketsAdminService: TicketsAdminService) {}

  /**
   * Liste des billets d'un événement avec recherche et filtres.
   */
  @Get('event/:eventId')
  async getEventTickets(
    @Param('eventId') eventId: string,
    @Query() query: TicketAdminQueryDto,
  ) {
    return this.ticketsAdminService.getEventTickets(eventId, query);
  }

  /**
   * Métriques et statistiques de billetterie pour un événement.
   */
  @Get('event/:eventId/stats')
  async getEventTicketingStats(@Param('eventId') eventId: string) {
    return this.ticketsAdminService.getEventTicketingStats(eventId);
  }

  /**
   * Annule administrativement un billet avec motif.
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelTicket(
    @Param('id') id: string,
    @Body() dto: AdminCancelTicketDto,
    @Session() session: UserSession,
  ) {
    return this.ticketsAdminService.adminCancelTicket(
      id,
      session.user.id,
      dto,
    );
  }

  /**
   * Révoque un billet frauduleux ou sanctionné.
   */
  @Post(':id/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeTicket(
    @Param('id') id: string,
    @Body() dto: AdminRevokeTicketDto,
    @Session() session: UserSession,
  ) {
    return this.ticketsAdminService.adminRevokeTicket(
      id,
      session.user.id,
      dto,
    );
  }

  /**
   * Historique des scans et validations d'un billet.
   */
  @Get(':id/history')
  async getTicketHistory(@Param('id') id: string) {
    return this.ticketsAdminService.getTicketHistory(id);
  }
}
