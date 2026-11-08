import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard, Roles, Session, type UserSession } from '../../auth/index.js';
import { PartnersService } from '../services/partners.service.js';
import { PartnerEventsService } from '../services/partner-events.service.js';
import { PartnerMarketingService } from '../services/partner-marketing.service.js';
import { VerifyPartnerDto } from '../dto/partner.dto.js';
import { ReviewPartnerEventDto } from '../dto/partner-event.dto.js';
import {
  ReviewMarketingRequestDto,
  SendMarketingMessageDto,
} from '../dto/partner-marketing.dto.js';
import {
  PartnerStatus,
  EventModerationStatus,
  MarketingRequestStatus,
} from '../../../generated/prisma/client.js';

function resolveAdminId(session?: UserSession, req?: Request): string {
  return (
    session?.user?.id ||
    (req as any)?.user?.id ||
    (req as any)?.session?.user?.id ||
    'ADMIN'
  );
}

@ApiTags('Admin - Partners Management')
@Controller('admin/partners')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class PartnerAdminController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly eventsService: PartnerEventsService,
    private readonly marketingService: PartnerMarketingService,
  ) {}

  // ─── Partenaires (Organisations) ──────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Lister les organisations partenaires avec filtres' })
  async getPartners(
    @Query('status') status?: PartnerStatus,
    @Query('search') search?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    return this.partnersService.getAdminPartners({
      status,
      search,
      page: pageStr ? parseInt(pageStr, 10) : 1,
      limit: limitStr ? parseInt(limitStr, 10) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter les détails d’une organisation partenaire' })
  async getPartnerDetails(@Param('id') id: string) {
    return this.partnersService.getPartnerByIdOrSlug(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Valider, suspendre ou rejeter une organisation partenaire' })
  async verifyPartner(
    @Param('id') partnerId: string,
    @Body() dto: VerifyPartnerDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const adminUserId = resolveAdminId(session, req);
    return this.partnersService.verifyPartner(
      partnerId,
      dto,
      adminUserId,
    );
  }

  // ─── Modération des événements partenaires ────────────────────────────────

  @Get('events/list')
  @ApiOperation({ summary: 'Lister les événements partenaires pour modération' })
  async getEvents(
    @Query('moderationStatus') moderationStatus?: EventModerationStatus,
    @Query('partnerId') partnerId?: string,
    @Query('search') search?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    return this.eventsService.getAdminPartnerEvents({
      moderationStatus,
      partnerId,
      search,
      page: pageStr ? parseInt(pageStr, 10) : 1,
      limit: limitStr ? parseInt(limitStr, 10) : 20,
    });
  }

  @Post('events/:id/review')
  @ApiOperation({ summary: 'Approuver ou rejeter un événement partenaire' })
  async reviewEvent(
    @Param('id') eventId: string,
    @Body() dto: ReviewPartnerEventDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const adminUserId = resolveAdminId(session, req);
    return this.eventsService.reviewPartnerEvent(eventId, dto, adminUserId);
  }

  // ─── Prestations Marketing ─────────────────────────────────────────────────

  @Get('marketing/requests')
  @ApiOperation({ summary: 'Lister les demandes de prestations marketing' })
  async getMarketingRequests(
    @Query('status') status?: MarketingRequestStatus,
    @Query('partnerId') partnerId?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    return this.marketingService.getAdminMarketingRequests({
      status,
      partnerId,
      page: pageStr ? parseInt(pageStr, 10) : 1,
      limit: limitStr ? parseInt(limitStr, 10) : 20,
    });
  }

  @Get('marketing/requests/:id')
  @ApiOperation({ summary: 'Détail d’une demande de prestation marketing' })
  async getMarketingRequestDetails(@Param('id') id: string) {
    return this.marketingService.getAdminMarketingRequestById(id);
  }

  @Post('marketing/requests/:id/review')
  @ApiOperation({ summary: 'Examiner, chiffrer ou programmer une demande marketing' })
  async reviewMarketingRequest(
    @Param('id') requestId: string,
    @Body() dto: ReviewMarketingRequestDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const adminUserId = resolveAdminId(session, req);
    return this.marketingService.reviewMarketingRequest(
      requestId,
      dto,
      adminUserId,
    );
  }

  @Post('marketing/requests/:id/messages')
  @ApiOperation({ summary: 'Envoyer une réponse administrative dans le fil marketing' })
  async sendMarketingMessage(
    @Param('id') requestId: string,
    @Body() dto: SendMarketingMessageDto,
    @Session() session?: UserSession,
    @Req() req?: Request,
  ) {
    const authorName = (session?.user as any)?.name || 'Équipe Kanto MG';
    return this.marketingService.addMessage(
      requestId,
      null, // admin can post without partnerId restriction
      dto,
      { role: 'ADMIN', name: authorName },
    );
  }
}
