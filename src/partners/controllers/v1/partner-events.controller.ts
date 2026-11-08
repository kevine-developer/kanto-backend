import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartnerApiKeyGuard } from '../../guards/partner-api-key.guard.js';
import { PartnerScopesGuard } from '../../guards/partner-scopes.guard.js';
import { RequirePartnerScopes } from '../../decorators/partner-scopes.decorator.js';
import { CurrentPartner } from '../../decorators/current-partner.decorator.js';
import { PartnerEventsService } from '../../services/partner-events.service.js';
import {
  CreatePartnerEventDto,
  UpdatePartnerEventDto,
} from '../../dto/partner-event.dto.js';
import {
  EventStatus,
  EventModerationStatus,
} from '../../../../generated/prisma/client.js';

@Controller('v1/events')
@UseGuards(PartnerApiKeyGuard, PartnerScopesGuard)
export class PartnerEventsV1Controller {
  constructor(private readonly partnerEventsService: PartnerEventsService) {}

  /**
   * Récupère la liste paginée des événements appartenant au partenaire.
   */
  @Get()
  @RequirePartnerScopes('events:read')
  async getEvents(
    @CurrentPartner('id') partnerId: string,
    @Query('status') status?: EventStatus,
    @Query('moderationStatus') moderationStatus?: EventModerationStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.partnerEventsService.getPartnerEvents(partnerId, {
      status,
      moderationStatus,
      search,
      page,
      limit,
    });
  }

  /**
   * Récupère la fiche détaillée d'un événement du partenaire (par ID ou slug).
   */
  @Get(':idOrSlug')
  @RequirePartnerScopes('events:read')
  async getEventById(
    @CurrentPartner('id') partnerId: string,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    return this.partnerEventsService.getPartnerEventById(partnerId, idOrSlug);
  }

  /**
   * Crée un nouvel événement associé au partenaire.
   */
  @Post()
  @RequirePartnerScopes('events:write')
  @HttpCode(HttpStatus.CREATED)
  async createEvent(
    @CurrentPartner('id') partnerId: string,
    @Body() dto: CreatePartnerEventDto,
  ) {
    return this.partnerEventsService.createEvent(partnerId, dto);
  }

  /**
   * Met à jour un événement existant du partenaire.
   */
  @Patch(':id')
  @RequirePartnerScopes('events:write')
  async updateEvent(
    @CurrentPartner('id') partnerId: string,
    @Param('id') eventId: string,
    @Body() dto: UpdatePartnerEventDto,
  ) {
    return this.partnerEventsService.updateEvent(partnerId, eventId, dto);
  }

  /**
   * Annule ou supprime un événement du partenaire.
   */
  @Delete(':id')
  @RequirePartnerScopes('events:delete')
  async deleteOrCancelEvent(
    @CurrentPartner('id') partnerId: string,
    @Param('id') eventId: string,
    @Body('reason') reason?: string,
  ) {
    return this.partnerEventsService.deleteOrCancelEvent(
      partnerId,
      eventId,
      reason,
    );
  }
}
