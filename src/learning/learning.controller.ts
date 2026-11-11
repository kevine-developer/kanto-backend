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
import { LearningService } from './learning.service.js';
import {
  FindTracksQueryDto,
  CompleteLessonDto,
  ReviewActionDto,
} from './dto/learning.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  /**
   * Tableau de bord pédagogique général.
   * Accessible publiquement ou personnalisé pour l'utilisateur connecté.
   */
  @Get('dashboard')
  @OptionalAuth()
  getDashboard(@Session() session?: UserSession) {
    return this.learningService.getDashboard(session?.user?.id);
  }

  /**
   * Liste des parcours d'apprentissage disponibles avec filtrage par niveau.
   */
  @Get('tracks')
  @OptionalAuth()
  getTracks(
    @Query() query: FindTracksQueryDto,
    @Session() session?: UserSession,
  ) {
    return this.learningService.getTracks(query.level, session?.user?.id);
  }

  /**
   * Détails d'un parcours avec ses leçons ordonnées et statuts de déverrouillage.
   */
  @Get('tracks/:slug')
  @OptionalAuth()
  getTrack(@Param('slug') slug: string, @Session() session?: UserSession) {
    return this.learningService.getTrackBySlug(slug, session?.user?.id);
  }

  /**
   * Consultation d'une leçon pédagogique complète (notions, phonétique, micro-quiz).
   */
  @Get('lessons/:slug')
  @OptionalAuth()
  getLesson(@Param('slug') slug: string, @Session() session?: UserSession) {
    return this.learningService.getLessonBySlug(slug, session?.user?.id);
  }

  /**
   * Validation d'une leçon terminée.
   * Idempotent : met à jour la progression du parcours et alimente les révisions.
   */
  @Post('lessons/:slug/complete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  completeLesson(
    @Param('slug') slug: string,
    @Body() dto: CompleteLessonDto,
    @Session() session: UserSession,
  ) {
    return this.learningService.completeLesson(slug, session.user.id, dto);
  }

  /**
   * Liste des notions en attente de révision espacée (spaced repetition).
   */
  @Get('reviews')
  @UseGuards(AuthGuard)
  getReviews(@Session() session: UserSession) {
    return this.learningService.getReviews(session.user.id);
  }

  /**
   * Traitement d'une action de révision (auto-évaluation : AGAIN, HARD, GOOD, EASY).
   */
  @Post('reviews/:id/action')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  submitReviewAction(
    @Param('id') reviewId: string,
    @Body() dto: ReviewActionDto,
    @Session() session: UserSession,
  ) {
    return this.learningService.submitReviewAction(
      reviewId,
      session.user.id,
      dto,
    );
  }

  /**
   * Statistiques et historique d'apprentissage personnel de l'utilisateur.
   */
  @Get('progress/me')
  @UseGuards(AuthGuard)
  getMyProgress(@Session() session: UserSession) {
    return this.learningService.getMyProgress(session.user.id);
  }
}
