import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { BetaTestersService } from './beta-testers.service.js';
import {
  RegisterBetaTesterDto,
  UpdateTesterStatusDto,
  SendPlayInviteDto,
  BulkInviteDto,
  VerifyBetaTesterDto,
} from './dto/beta-tester.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';
import {
  renderBetaLandingPage,
  renderBetaWaitlistScript,
} from './views/beta-landing.view.js';
import { TesterStatus } from '../../generated/prisma/client.js';

@Controller()
export class BetaTestersController {
  constructor(private readonly betaTestersService: BetaTestersService) {}

  /**
   * Script client servi sur l'origine 'self' pour respecter la directive CSP strict.
   */
  @Get(['beta-waitlist.js', 'api/beta-waitlist.js'])
  getWaitlistScript(@Res() res: Response): void {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(renderBetaWaitlistScript());
  }

  /**
   * Page de présentation et d'inscription accessible directement via /beta, /rejoindre-beta, /testers ou /download.
   */
  @Get(['beta', 'rejoindre-beta', 'testers', 'download'])
  async getBetaLandingPage(
    @Query('from') from: string | undefined,
    @Query('target') target: string | undefined,
    @Query('tab') tab: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const testerCount = await this.betaTestersService.getPublicTesterCount();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderBetaLandingPage({
        testerCount,
        fromDeeplink: from === 'deeplink' || Boolean(target),
        targetPath: target,
        initialTab: tab === 'already_registered' || tab === 'download' ? tab : 'register',
      }),
    );
  }

  /**
   * Endpoint public d'inscription au programme de test bêta Kanto (Google Play).
   * Prend en charge les requêtes AJAX JSON et les soumissions natives de formulaire HTML.
   */
  @Post(['api/beta-testers/register', 'beta-testers/register'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(
    @Body() dto: RegisterBetaTesterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    const result = await this.betaTestersService.register(dto, ip, userAgent);

    // Si la requête provient d'un formulaire HTML traditionnel (fallback sans JS)
    const acceptsHtml = req.headers['accept']?.includes('text/html');
    const isJson =
      req.is('json') ||
      req.headers['content-type']?.includes('application/json');

    if (acceptsHtml && !isJson) {
      const testerCount = await this.betaTestersService.getPublicTesterCount();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(
        renderBetaLandingPage({
          testerCount,
          initialRegistered: result.success,
          registeredEmail: dto.email,
          errorMessage: result.success ? undefined : result.message,
        }),
      );
      return;
    }

    res.status(HttpStatus.OK).json(result);
  }

  /**
   * Endpoint public de vérification et confirmation de participation pour un testeur déjà inscrit.
   */
  @Post(['api/beta-testers/verify-participation', 'beta-testers/verify-participation'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyParticipation(@Body() dto: VerifyBetaTesterDto) {
    return this.betaTestersService.verifyParticipation(dto.email);
  }

  /**
   * Endpoint public pour renvoyer le lien d'accès Play Store à un testeur confirmé.
   */
  @Post(['api/beta-testers/resend-invite-public', 'beta-testers/resend-invite-public'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async resendInvitePublic(@Body() dto: VerifyBetaTesterDto) {
    return this.betaTestersService.resendInvitePublic(dto.email);
  }

  // ─── ENDPOINTS ADMINISTRATEUR (PROTÉGÉS) ───────────────────────────────────

  /**
   * Récupère la liste des testeurs avec filtres et pagination.
   */
  @Get(['api/beta-testers', 'beta-testers'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAll(
    @Query('status') status?: TesterStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.betaTestersService.findAll({
      status,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  /**
   * Statistiques globales sur les testeurs bêta.
   */
  @Get(['api/beta-testers/stats', 'beta-testers/stats'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getStats() {
    return this.betaTestersService.getStats();
  }

  /**
   * Exporte la liste des adresses email pour copie directe dans la Google Play Console.
   */
  @Get(['api/beta-testers/export', 'beta-testers/export'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  exportEmails(@Query('status') status?: TesterStatus) {
    return this.betaTestersService.exportEmails(status);
  }

  /**
   * Met à jour le statut d'un testeur (PENDING, APPROVED, INVITED, REJECTED).
   */
  @Patch(['api/beta-testers/:id/status', 'beta-testers/:id/status'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTesterStatusDto) {
    return this.betaTestersService.updateStatus(id, dto);
  }

  /**
   * Envoie l'email officiel avec le lien Google Play Closed Testing à un testeur spécifique.
   */
  @Post(['api/beta-testers/:id/send-invite', 'beta-testers/:id/send-invite'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  sendPlayInvite(@Param('id') id: string, @Body() dto?: SendPlayInviteDto) {
    return this.betaTestersService.sendPlayInvite(id, dto);
  }

  /**
   * Envoi groupé d'invitations Google Play aux testeurs approuvés ou sélectionnés.
   */
  @Post(['api/beta-testers/bulk-invite', 'beta-testers/bulk-invite'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  bulkInvite(@Body() dto: BulkInviteDto) {
    return this.betaTestersService.bulkInvite(dto);
  }

  /**
   * Supprime un testeur.
   */
  @Delete(['api/beta-testers/:id', 'beta-testers/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.betaTestersService.remove(id);
  }
}
