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
import { ContributionsService } from './contributions.service.js';
import { CreateContributionDto } from './dto/create-contribution.dto.js';
import { CreateKabaryContributionDto } from './dto/create-kabary-contribution.dto.js';
import { CreateProverbeContributionDto } from './dto/create-proverbe-contribution.dto.js';
import { CreateCitationContributionDto } from './dto/create-citation-contribution.dto.js';
import { CreateConteContributionDto } from './dto/create-conte-contribution.dto.js';
import { ValidateContributionDto } from './dto/validate-contribution.dto.js';
import { VoteContributionDto } from './dto/vote-contribution.dto.js';
import { ReportContributionDto } from './dto/report-contribution.dto.js';
import { UpdateContributionDto } from './dto/update-contribution.dto.js';
import { CreateContributionCommentDto } from './dto/create-contribution-comment.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';

// Contributions Controller
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  // ──────────────────────────────────────────────────────────────────────────
  // CRÉATION PAR CATÉGORIE (authentifié)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * @deprecated Utiliser les endpoints dédiés par catégorie
   * Conservé pour rétro-compatibilité avec l'ancien formulaire
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateContributionDto, @Session() session: UserSession) {
    return this.contributionsService.create(session.user.id, body);
  }

  /** POST /contributions/kabary — Soumettre un Kabary communautaire */
  @Post('kabary')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createKabary(
    @Body() body: CreateKabaryContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.createKabaryContribution(
      session.user.id,
      body,
    );
  }

  /** POST /contributions/proverbe — Soumettre un Proverbe/Expression/Dicton */
  @Post('proverbe')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createProverbe(
    @Body() body: CreateProverbeContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.createProverbeContribution(
      session.user.id,
      body,
    );
  }

  /** POST /contributions/citation — Soumettre une Citation */
  @Post('citation')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createCitation(
    @Body() body: CreateCitationContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.createCitationContribution(
      session.user.id,
      body,
    );
  }

  /** POST /contributions/conte — Soumettre un Conte */
  @Post('conte')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createConte(
    @Body() body: CreateConteContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.createConteContribution(
      session.user.id,
      body,
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LECTURE
  // ──────────────────────────────────────────────────────────────────────────

  /** GET /contributions/community?category=KABARY&limit=50 */
  @Get('community')
  findCommunity(
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Session() session?: UserSession,
  ) {
    return this.contributionsService.findCommunity(
      category,
      session?.user?.id,
      limit,
    );
  }

  /** GET /contributions/me — Mes propres contributions */
  @Get('me')
  @UseGuards(AuthGuard)
  findMyContributions(@Session() session: UserSession) {
    return this.contributionsService.findMyContributions(session.user.id);
  }

  /** GET /contributions/pending — Admin : contributions en attente */
  @Get('pending')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findPending() {
    return this.contributionsService.findPending();
  }

  /** GET /contributions/admin/stats — Admin : statistiques globales et objectif hebdo */
  @Get('admin/stats')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAdminStats() {
    return this.contributionsService.getAdminStats();
  }

  /** GET /contributions/admin/reports — Admin : liste des signalements */
  @Get('admin/reports')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAdminReports() {
    return this.contributionsService.getAdminReports();
  }

  /** PATCH /contributions/admin/reports/:id/resolve — Admin : résoudre un signalement */
  @Patch('admin/reports/:id/resolve')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  resolveReport(@Param('id') id: string) {
    return this.contributionsService.resolveReport(id);
  }

  /** GET /contributions/:id — Détail d'une contribution */
  @Get(':id')
  findOne(@Param('id') id: string, @Session() session?: UserSession) {
    return this.contributionsService.findOne(id, session?.user?.id);
  }

  /** POST /contributions/:id/view — Incrémenter le nombre de vues d'une contribution */
  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  incrementView(@Param('id') id: string) {
    return this.contributionsService.incrementView(id);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ACTIONS UTILISATEUR
  // ──────────────────────────────────────────────────────────────────────────

  /** POST /contributions/:id/vote — Voter pour une contribution (interdit à l'auteur, rate-limited) */
  @Post(':id/vote')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  vote(
    @Param('id') id: string,
    @Body() body: VoteContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.voteContribution(
      session.user.id,
      id,
      body.value,
    );
  }

  /** POST /contributions/:id/report — Signaler une contribution abusive */
  @Post(':id/report')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  report(
    @Param('id') id: string,
    @Body() body: ReportContributionDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.reportContribution(
      session.user.id,
      id,
      body.reason,
      body.description,
    );
  }

  /** PATCH /contributions/:id — Modifier (auteur dans les 48h ou admin) */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() body: UpdateContributionDto,
    @Session() session: UserSession,
  ) {
    const role = Array.isArray(session.user.role)
      ? (session.user.role[0] ?? 'USER')
      : (session.user.role ?? 'USER');
    return this.contributionsService.update(id, session.user.id, role, body);
  }

  /** DELETE /contributions/:id — Supprimer (auteur dans les 24h ou admin) */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const role = Array.isArray(session.user.role)
      ? (session.user.role[0] ?? 'USER')
      : (session.user.role ?? 'USER');
    return this.contributionsService.remove(id, session.user.id, role);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMMENTAIRES
  // ──────────────────────────────────────────────────────────────────────────

  /** GET /contributions/:id/comments — Récupérer les commentaires */
  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.contributionsService.getComments(id);
  }

  /** POST /contributions/:id/comments — Ajouter un commentaire (user ou owner) */
  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id') id: string,
    @Body() body: CreateContributionCommentDto,
    @Session() session: UserSession,
  ) {
    return this.contributionsService.addComment(session.user.id, id, body);
  }

  /** PATCH /contributions/:id/comments/:commentId — Modifier un commentaire (auteur dans les 2 min ou admin) */
  @Patch(':id/comments/:commentId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() body: CreateContributionCommentDto,
    @Session() session: UserSession,
  ) {
    const role = Array.isArray(session.user.role)
      ? (session.user.role[0] ?? 'USER')
      : (session.user.role ?? 'USER');
    return this.contributionsService.updateComment(
      session.user.id,
      role,
      id,
      commentId,
      body,
    );
  }

  /** DELETE /contributions/:id/comments/:commentId — Supprimer un commentaire (auteur dans les 5 min ou admin) */
  @Delete(':id/comments/:commentId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  removeComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Session() session: UserSession,
  ) {
    const role = Array.isArray(session.user.role)
      ? (session.user.role[0] ?? 'USER')
      : (session.user.role ?? 'USER');
    return this.contributionsService.removeComment(
      session.user.id,
      role,
      id,
      commentId,
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ADMINISTRATION
  // ──────────────────────────────────────────────────────────────────────────

  /** PATCH /contributions/:id/validate — Approuver ou rejeter (admin) */
  @Patch(':id/validate')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  validate(@Param('id') id: string, @Body() body: ValidateContributionDto) {
    return this.contributionsService.validate(id, body.approve);
  }
}
