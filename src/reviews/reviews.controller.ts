import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AllowAnonymous,
  AuthGuard,
  OptionalAuth,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import {
  AdminReviewsQueryDto,
  PublicReviewsQueryDto,
} from './dto/review-query.dto.js';
import { ModerateReviewDto } from './dto/moderate-review.dto.js';
import { UpdatePublicationConsentDto } from './dto/update-publication-consent.dto.js';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Création d'un avis (authentifié ou invité)
   */
  @Post()
  @OptionalAuth()
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Body() dto: CreateReviewDto,
    @Session() session?: UserSession,
  ) {
    const userId = session?.user?.id;
    return this.reviewsService.createReview(dto, userId);
  }

  /**
   * Liste publique des avis validés et autorisés
   * Endpoint public sans authentification
   */
  @Get('public')
  @AllowAnonymous()
  async getPublicReviews(@Query() query: PublicReviewsQueryDto) {
    return this.reviewsService.getPublicReviews(query);
  }

  /**
   * Statistiques publiques (note moyenne, répartition des 5 notes, total)
   * Endpoint public sans authentification
   */
  @Get('public/stats')
  @AllowAnonymous()
  async getPublicStats() {
    return this.reviewsService.getPublicStats();
  }

  /**
   * Récupère la liste des avis soumis par l'utilisateur connecté
   */
  @Get('my')
  @UseGuards(AuthGuard)
  async getMyReviews(@Session() session: UserSession) {
    return this.reviewsService.getMyReviews(session.user.id);
  }

  /**
   * Retrait de l'autorisation de publication (l'avis disparaît immédiatement du site public)
   */
  @Delete(':id/withdraw-publication')
  @UseGuards(AuthGuard)
  async withdrawPublication(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.reviewsService.withdrawPublication(id, session.user.id);
  }

  /**
   * Mise à jour du consentement de publication par l'auteur
   */
  @Patch(':id/publication-consent')
  @UseGuards(AuthGuard)
  async updatePublicationConsent(
    @Param('id') id: string,
    @Body() dto: UpdatePublicationConsentDto,
    @Session() session: UserSession,
  ) {
    return this.reviewsService.updatePublicationConsent(
      id,
      dto.isPublicationAuthorized,
      dto.publicDisplayNameType,
      session.user.id,
    );
  }
}

@Controller('api/admin/reviews')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Liste complète de tous les avis pour l'administration (avec filtres statut, note, recherche)
   */
  @Get()
  async getAdminReviews(@Query() query: AdminReviewsQueryDto) {
    return this.reviewsService.getAdminReviews(query);
  }

  /**
   * Modération d'un avis par l'administrateur
   * La note et le texte ne peuvent JAMAIS être modifiés.
   */
  @Patch(':id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Body() dto: ModerateReviewDto,
    @Session() session?: UserSession,
  ) {
    const adminEmail = session?.user?.email || 'admin@kanto.mg';
    return this.reviewsService.moderateReview(id, dto, adminEmail);
  }
}
