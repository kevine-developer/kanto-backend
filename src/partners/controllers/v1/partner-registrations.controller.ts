import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartnerApiKeyGuard } from '../../guards/partner-api-key.guard.js';
import { PartnerScopesGuard } from '../../guards/partner-scopes.guard.js';
import { RequirePartnerScopes } from '../../decorators/partner-scopes.decorator.js';
import { CurrentPartner } from '../../decorators/current-partner.decorator.js';
import { PartnerEventsService } from '../../services/partner-events.service.js';
import { EventParticipationStatus } from '../../../../generated/prisma/client.js';

@Controller('v1/events')
@UseGuards(PartnerApiKeyGuard, PartnerScopesGuard)
export class PartnerRegistrationsV1Controller {
  constructor(private readonly partnerEventsService: PartnerEventsService) {}

  /**
   * Consulte les inscriptions à un événement (anonymisation conforme RGPD).
   */
  @Get(':id/registrations')
  @RequirePartnerScopes('registrations:read')
  async getEventRegistrations(
    @CurrentPartner('id') partnerId: string,
    @Param('id') eventId: string,
    @Query('status') status?: EventParticipationStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.partnerEventsService.getEventRegistrations(partnerId, eventId, {
      status,
      search,
      page,
      limit,
    });
  }

  /**
   * Consulte les statistiques précises et métriques réelles d'un événement.
   */
  @Get(':id/statistics')
  @RequirePartnerScopes('events:read')
  async getEventStatistics(
    @CurrentPartner('id') partnerId: string,
    @Param('id') eventId: string,
  ) {
    return this.partnerEventsService.getEventStatistics(partnerId, eventId);
  }
}

