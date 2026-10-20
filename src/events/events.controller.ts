import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import {
  CreateEventDto,
  CreateEventRewardDto,
  DistributeRewardsDto,
  EventQueryDto,
  SubmitEventProgressDto,
  UpdateEventDto,
  UpdateEventStatusDto,
} from './dto/events.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ─── Endpoints Utilisateur et Public ────────────────────────────────────────

  /**
   * Liste paginée des événements publics avec filtres (catégorie, statut, recherche, featured, mes événements).
   */
  @Get()
  async getEvents(
    @Query() query: EventQueryDto,
    @Session() session?: UserSession,
  ) {
    return this.eventsService.getPublicEvents(query, session?.user?.id);
  }

  /**
   * Événement vedette pour la page d'accueil.
   */
  @Get('featured')
  async getFeaturedEvent(@Session() session?: UserSession) {
    return this.eventsService.getFeaturedEvent(session?.user?.id);
  }

  /**
   * Métriques et tableau de bord des événements (admin).
   */
  @Get('admin/overview')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminOverview() {
    return this.eventsService.getAdminOverviewStats();
  }

  /**
   * Liste complète de gestion pour les administrateurs.
   */
  @Get('admin/all')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminEvents(@Query() query: EventQueryDto) {
    return this.eventsService.getAdminEvents(query);
  }

  /**
   * Liste des participants réels d'un événement (admin).
   */
  @Get('admin/:id/participants')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminEventParticipants(
    @Param('id') eventId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.getAdminEventParticipants(eventId, {
      page,
      limit,
      status,
      search,
    });
  }

  /**
   * Supprime ou archive un événement (admin).
   */
  @Delete('admin/:id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async deleteEvent(
    @Param('id') eventId: string,
    @Session() session: UserSession,
  ) {
    return this.eventsService.deleteEvent(eventId, session.user.id);
  }

  /**
   * Crée un nouvel événement (admin).
   */
  @Post('admin/create')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async createEvent(
    @Body() dto: CreateEventDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.createEvent(dto, session.user.id);
  }

  /**
   * Modifie un événement existant (admin).
   */
  @Patch('admin/:id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async updateEvent(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.updateEvent(eventId, dto, session.user.id);
  }

  /**
   * Change le statut de cycle de vie d'un événement (admin).
   */
  @Patch('admin/:id/status')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async updateEventStatus(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventStatusDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.updateEventStatus(eventId, dto, session.user.id);
  }

  /**
   * Ajoute une récompense à un événement (admin).
   */
  @Post('admin/:id/rewards')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async addReward(
    @Param('id') eventId: string,
    @Body() dto: CreateEventRewardDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.addReward(eventId, dto, session.user.id);
  }

  /**
   * Distribution administrative des récompenses du classement (admin).
   */
  @Post('admin/:id/distribute-rewards')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async distributeRewards(
    @Param('id') eventId: string,
    @Body() dto: DistributeRewardsDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.distributeRewards(eventId, dto, session.user.id);
  }

  /**
   * Statistiques et métriques d'engagement d'un événement (admin).
   */
  @Get('admin/:id/stats')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getEventStats(@Param('id') eventId: string) {
    return this.eventsService.getEventStats(eventId);
  }

  /**
   * Détails complets d'un événement (par ID ou slug).
   */
  @Get(':idOrSlug')
  async getEvent(
    @Param('idOrSlug') idOrSlug: string,
    @Session() session?: UserSession,
  ) {
    return this.eventsService.getEventBySlugOrId(idOrSlug, session?.user?.id);
  }

  /**
   * Inscription / Participation à un événement.
   */
  @Post(':id/participate')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async participate(
    @Param('id') eventId: string,
    @Session() session: UserSession,
    @Ip() ip: string,
  ) {
    return this.eventsService.participateInEvent(eventId, session.user.id, ip);
  }

  /**
   * Annulation de son inscription avant le début de l'événement.
   */
  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id') eventId: string,
    @Session() session: UserSession,
  ) {
    return this.eventsService.cancelParticipation(eventId, session.user.id);
  }

  /**
   * Soumission de progression / score pour un événement en cours.
   */
  @Post(':id/submit-progress')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitProgress(
    @Param('id') eventId: string,
    @Body() dto: SubmitEventProgressDto,
    @Session() session: UserSession,
  ) {
    return this.eventsService.submitProgress(eventId, session.user.id, dto);
  }

  /**
   * Classement public pour un événement compétitif.
   */
  @Get(':id/leaderboard')
  async getLeaderboard(
    @Param('id') eventId: string,
    @Query('limit') limit?: number,
  ) {
    return this.eventsService.getEventLeaderboard(eventId, limit);
  }

  /**
   * Enregistre un partage d'événement (anonyme et public).
   */
  @Post(':id/track-share')
  @HttpCode(HttpStatus.OK)
  async trackShare(@Param('id') eventId: string) {
    return this.eventsService.trackShare(eventId);
  }
}
