import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartnerApiKeyGuard } from '../../guards/partner-api-key.guard.js';
import { PartnerScopesGuard } from '../../guards/partner-scopes.guard.js';
import { RequirePartnerScopes } from '../../decorators/partner-scopes.decorator.js';
import { CurrentPartner } from '../../decorators/current-partner.decorator.js';
import { PartnerMarketingService } from '../../services/partner-marketing.service.js';
import {
  CreateMarketingRequestDto,
  SendMarketingMessageDto,
} from '../../dto/partner-marketing.dto.js';

@Controller('v1/marketing')
@UseGuards(PartnerApiKeyGuard, PartnerScopesGuard)
export class PartnerMarketingV1Controller {
  constructor(
    private readonly partnerMarketingService: PartnerMarketingService,
  ) {}

  /**
   * Consulte le catalogue des emplacements marketing disponibles sur Kanto MG.
   */
  @Get('placements')
  @RequirePartnerScopes('marketing:read')
  async getPlacementsCatalog() {
    return this.partnerMarketingService.getPlacementsCatalog();
  }

  /**
   * Récupère la liste des demandes de prestations marketing du partenaire.
   */
  @Get('requests')
  @RequirePartnerScopes('marketing:read')
  async getMarketingRequests(@CurrentPartner('id') partnerId: string) {
    return this.partnerMarketingService.getPartnerMarketingRequests(partnerId);
  }

  /**
   * Consulte les détails d'une demande marketing.
   */
  @Get('requests/:id')
  @RequirePartnerScopes('marketing:read')
  async getMarketingRequestById(
    @CurrentPartner('id') partnerId: string,
    @Param('id') requestId: string,
  ) {
    return this.partnerMarketingService.getPartnerMarketingRequestById(
      partnerId,
      requestId,
    );
  }

  /**
   * Dépose une nouvelle demande de prestation marketing pour un événement.
   */
  @Post('requests')
  @RequirePartnerScopes('marketing:write')
  @HttpCode(HttpStatus.CREATED)
  async createMarketingRequest(
    @CurrentPartner('id') partnerId: string,
    @Body() dto: CreateMarketingRequestDto,
  ) {
    return this.partnerMarketingService.createMarketingRequest(partnerId, dto);
  }

  /**
   * Envoie un message dans le fil de discussion de la demande marketing.
   */
  @Post('requests/:id/messages')
  @RequirePartnerScopes('marketing:write')
  async sendMarketingMessage(
    @CurrentPartner() partner: any,
    @Param('id') requestId: string,
    @Body() dto: SendMarketingMessageDto,
  ) {
    return this.partnerMarketingService.addMessage(requestId, partner.id, dto, {
      role: 'PARTNER',
      name: partner.name,
    });
  }
}
