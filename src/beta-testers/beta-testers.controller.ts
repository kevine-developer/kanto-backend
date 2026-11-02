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
  UpdatePlatformsDto,
  UnsubscribeBetaDto,
  VerifyBetaTesterDto,
  SubmitFeedbackDto,
  UpdateFeedbackDto,
  CreateBetaGroupDto,
  UpdateBetaGroupDto,
  CreateBetaVersionDto,
  UpdateBetaVersionDto,
  UpdateEmailTemplateDto,
  UpdateAutomationConfigDto,
  BulkActionDto,
  UpdateTesterStatusDto,
  SendPlayInviteDto,
  BulkInviteDto,
} from './dto/beta-tester.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';
import {
  renderBetaLandingPage,
  renderBetaWaitlistScript,
} from './views/beta-landing.view.js';
import {
  renderBugReportPage,
  renderBugReportScript,
} from './views/bug-report.view.js';
import { TesterStatus } from '../../generated/prisma/client.js';

@Controller()
export class BetaTestersController {
  constructor(private readonly betaTestersService: BetaTestersService) {}

  // ─── ROUTES PUBLIQUES & INTERFACE WEB ──────────────────────────────────────

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
   * Script client dédié au signalement de bugs servi sous /bug-report.js.
   */
  @Get(['bug-report.js', 'api/bug-report.js'])
  getBugReportScript(@Res() res: Response): void {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(renderBugReportScript());
  }

  /**
   * Page dédiée au signalement de bugs et retours bêta-testeurs.
   * Conseille l'utilisation du Deeplink vers l'application mobile et propose un formulaire web complet.
   */
  @Get(['feedback', 'bug-report', 'signaler-bug', 'retours'])
  async getBugReportPage(
    @Query('type') type: string | undefined,
    @Query('platform') platform: string | undefined,
    @Query('email') email: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const config =
      typeof this.betaTestersService.getAutomationConfig === 'function'
        ? await this.betaTestersService.getAutomationConfig().catch(() => null)
        : null;
    const supportEmail =
      config?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderBugReportPage({
        initialType: type,
        initialPlatform: platform,
        initialEmail: email,
        supportEmail,
      }),
    );
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
    @Query('email') email?: string,
    @Query('token') token?: string,
  ): Promise<void> {
    if (tab === 'feedback') {
      return res.redirect(
        302,
        '/feedback' + (email ? `?email=${encodeURIComponent(email)}` : ''),
      );
    }

    const [testerCount, config] = await Promise.all([
      this.betaTestersService.getPublicTesterCount(),
      typeof this.betaTestersService.getAutomationConfig === 'function'
        ? this.betaTestersService.getAutomationConfig().catch(() => null)
        : Promise.resolve(null),
    ]);
    const supportEmail =
      config?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(
      renderBetaLandingPage({
        testerCount,
        supportEmail,
        fromDeeplink: from === 'deeplink' || Boolean(target),
        targetPath: target,
        initialTab:
          tab === 'already_registered' ||
          tab === 'download' ||
          tab === 'unsubscribe'
            ? tab
            : 'register',
        initialEmail: email,
        unsubscribeToken: token,
      }),
    );
  }

  /**
   * Inscription publique au programme bêta Kanto (Android et/ou iOS).
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

    const acceptsHtml = req.headers['accept']?.includes('text/html');
    const isJson =
      req.is('json') ||
      req.headers['content-type']?.includes('application/json');

    if (acceptsHtml && !isJson) {
      const [testerCount, config] = await Promise.all([
        this.betaTestersService.getPublicTesterCount(),
        typeof this.betaTestersService.getAutomationConfig === 'function'
          ? this.betaTestersService.getAutomationConfig().catch(() => null)
          : Promise.resolve(null),
      ]);
      const supportEmail =
        config?.supportEmail || process.env.SUPPORT_EMAIL || 'support@kanto.mg';

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(
        renderBetaLandingPage({
          testerCount,
          supportEmail,
          initialRegistered: result.success && !result.alreadyRegistered,
          registeredEmail: dto.email,
          errorMessage: result.success ? undefined : result.message,
          initialTab: result.alreadyRegistered
            ? 'already_registered'
            : 'register',
        }),
      );
      return;
    }

    res.status(HttpStatus.OK).json(result);
  }

  /**
   * Consultation publique du statut de participation via requête POST (AJAX JSON).
   */
  @Post([
    'api/beta-testers/verify-participation',
    'beta-testers/verify-participation',
  ])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyParticipation(@Body() dto: VerifyBetaTesterDto) {
    if (!dto?.email || !dto.email.trim()) {
      return {
        success: false,
        exists: false,
        message:
          'Veuillez renseigner votre adresse e-mail pour consulter votre statut de participation.',
      };
    }
    return this.betaTestersService.verifyParticipation(dto.email.trim());
  }

  /**
   * Consultation publique du statut de participation via requête GET directe (?email=...).
   */
  @Get([
    'api/beta-testers/verify-participation',
    'beta-testers/verify-participation',
  ])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyParticipationByQuery(@Query('email') email?: string) {
    if (!email || !email.trim()) {
      return {
        success: false,
        exists: false,
        message:
          'Veuillez renseigner votre adresse e-mail pour consulter votre statut de participation.',
      };
    }
    return this.betaTestersService.verifyParticipation(email.trim());
  }

  /**
   * Mise à jour des plateformes de test pour un utilisateur déjà inscrit.
   */
  @Post(['api/beta-testers/platforms', 'beta-testers/platforms'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async updatePlatforms(@Body() dto: UpdatePlatformsDto) {
    return this.betaTestersService.updatePlatforms(dto);
  }

  /**
   * Désinscription publique du programme bêta via requête POST.
   */
  @Post(['api/beta-testers/unsubscribe', 'beta-testers/unsubscribe'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async unsubscribe(@Body() dto: UnsubscribeBetaDto) {
    return this.betaTestersService.unsubscribe(dto);
  }

  /**
   * Désinscription publique du programme bêta via lien GET dans un email (?token=... ou ?email=...).
   */
  @Get(['api/beta-testers/unsubscribe', 'beta-testers/unsubscribe'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async unsubscribeByQuery(
    @Query('token') queryToken?: string,
    @Query('email') queryEmail?: string,
    @Query('reason') queryReason?: string,
  ) {
    const finalDto: UnsubscribeBetaDto = {
      token: queryToken,
      email: queryEmail,
      reason: queryReason,
    };
    return this.betaTestersService.unsubscribe(finalDto);
  }

  /**
   * Renvoi public des liens d'accès (Google Play / TestFlight) via requête POST.
   */
  @Post([
    'api/beta-testers/resend-invite-public',
    'beta-testers/resend-invite-public',
  ])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async resendInvitePublic(@Body() dto: VerifyBetaTesterDto) {
    if (!dto?.email || !dto.email.trim()) {
      return {
        success: false,
        message:
          'Veuillez renseigner votre adresse e-mail pour recevoir vos liens d’accès.',
      };
    }
    return this.betaTestersService.resendInvitePublic(dto.email.trim());
  }

  /**
   * Renvoi public des liens d'accès via requête GET (?email=...).
   */
  @Get([
    'api/beta-testers/resend-invite-public',
    'beta-testers/resend-invite-public',
  ])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async resendInvitePublicByQuery(@Query('email') email?: string) {
    if (!email || !email.trim()) {
      return {
        success: false,
        message:
          'Veuillez renseigner votre adresse e-mail pour recevoir vos liens d’accès.',
      };
    }
    return this.betaTestersService.resendInvitePublic(email.trim());
  }

  /**
   * Soumission publique d'un retour ou rapport de bug par un utilisateur.
   */
  @Post(['api/beta-testers/feedback', 'beta-testers/feedback'])
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async submitFeedback(@Body() dto: SubmitFeedbackDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;
    return this.betaTestersService.submitFeedback(dto, ip, userAgent);
  }

  // ─── ENDPOINTS D'ADMINISTRATION (PROTÉGÉS) ───────────────────────────────────

  // --- STATS & EXPORTS ---

  @Get(['api/beta-testers/stats', 'beta-testers/stats'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getStats() {
    return this.betaTestersService.getStats();
  }

  @Get(['api/beta-testers/export', 'beta-testers/export'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  exportEmails(
    @Query('status') status?: TesterStatus,
    @Req() req?: Request,
  ) {
    const ip =
      (req?.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req?.ip;
    const adminUser = (req as any)?.user;
    return this.betaTestersService.exportEmails(status, adminUser, ip);
  }

  @Get(['api/beta-testers/export-csv', 'beta-testers/export-csv'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  exportCsv(
    @Query('platform') platform?: string,
    @Query('status') status?: string,
    @Req() req?: Request,
  ) {
    const ip =
      (req?.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req?.ip;
    const adminUser = (req as any)?.user;
    return this.betaTestersService.exportCsv({ platform, status }, adminUser, ip);
  }

  // --- ACTIONS GROUPÉES ---

  @Post(['api/beta-testers/bulk-action', 'beta-testers/bulk-action'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  bulkAction(@Body() dto: BulkActionDto) {
    return this.betaTestersService.bulkAction(dto);
  }

  @Post(['api/beta-testers/bulk-invite', 'beta-testers/bulk-invite'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  bulkInvite(@Body() dto: BulkInviteDto) {
    // Rétrocompatibilité avec l'ancien composant
    return this.betaTestersService.bulkAction({
      testerIds: dto.testerIds,
      action: 'INVITE_ANDROID',
    });
  }

  // --- GESTION DES GROUPES (COHORTES) ---

  @Get(['api/beta-testers/groups', 'beta-testers/groups'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllGroups() {
    return this.betaTestersService.findAllGroups();
  }

  @Post(['api/beta-testers/groups', 'beta-testers/groups'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  createGroup(@Body() dto: CreateBetaGroupDto) {
    return this.betaTestersService.createGroup(dto);
  }

  @Patch(['api/beta-testers/groups/:id', 'beta-testers/groups/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateGroup(@Param('id') id: string, @Body() dto: UpdateBetaGroupDto) {
    return this.betaTestersService.updateGroup(id, dto);
  }

  @Delete(['api/beta-testers/groups/:id', 'beta-testers/groups/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  deleteGroup(@Param('id') id: string) {
    return this.betaTestersService.deleteGroup(id);
  }

  // --- GESTION DES VERSIONS BÊTA ---

  @Get(['api/beta-testers/versions', 'beta-testers/versions'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllVersions() {
    return this.betaTestersService.findAllVersions();
  }

  @Post(['api/beta-testers/versions', 'beta-testers/versions'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  createVersion(@Body() dto: CreateBetaVersionDto) {
    return this.betaTestersService.createVersion(dto);
  }

  @Patch(['api/beta-testers/versions/:id', 'beta-testers/versions/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateVersion(@Param('id') id: string, @Body() dto: UpdateBetaVersionDto) {
    return this.betaTestersService.updateVersion(id, dto);
  }

  @Delete(['api/beta-testers/versions/:id', 'beta-testers/versions/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  deleteVersion(@Param('id') id: string) {
    return this.betaTestersService.deleteVersion(id);
  }

  @Post([
    'api/beta-testers/versions/:id/notify',
    'beta-testers/versions/:id/notify',
  ])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  notifyVersion(@Param('id') id: string) {
    return this.betaTestersService.notifyVersion(id);
  }

  // --- GESTION DES RETOURS & FEEDBACK ---

  @Get(['api/beta-testers/feedbacks', 'beta-testers/feedbacks'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllFeedbacks(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('platform') platform?: string,
    @Query('priority') priority?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.betaTestersService.findAllFeedbacks({
      category,
      status,
      platform,
      priority,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Patch(['api/beta-testers/feedbacks/:id', 'beta-testers/feedbacks/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateFeedback(@Param('id') id: string, @Body() dto: UpdateFeedbackDto) {
    return this.betaTestersService.updateFeedback(id, dto);
  }

  @Delete(['api/beta-testers/feedbacks/:id', 'beta-testers/feedbacks/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  deleteFeedback(@Param('id') id: string) {
    return this.betaTestersService.deleteFeedback(id);
  }

  // --- GESTION DES MODÈLES D'EMAILS ---

  @Get(['api/beta-testers/templates', 'beta-testers/templates'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllTemplates() {
    return this.betaTestersService.findAllTemplates();
  }

  @Get(['api/beta-testers/templates/:code', 'beta-testers/templates/:code'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getTemplate(@Param('code') code: string) {
    return this.betaTestersService.getTemplate(code);
  }

  @Patch(['api/beta-testers/templates/:code', 'beta-testers/templates/:code'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateTemplate(
    @Param('code') code: string,
    @Body() dto: UpdateEmailTemplateDto,
  ) {
    return this.betaTestersService.updateTemplate(code, dto);
  }

  @Post([
    'api/beta-testers/templates/:code/test',
    'beta-testers/templates/:code/test',
  ])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  sendTestTemplateEmail(
    @Param('code') code: string,
    @Body('email') email: string,
  ) {
    return this.betaTestersService.sendTestTemplateEmail(code, email);
  }

  // --- CONFIGURATION D'AUTOMATISATION ---

  @Get(['api/beta-testers/automation-config', 'beta-testers/automation-config'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAutomationConfig() {
    return this.betaTestersService.getAutomationConfig();
  }

  @Patch([
    'api/beta-testers/automation-config',
    'beta-testers/automation-config',
  ])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateAutomationConfig(@Body() dto: UpdateAutomationConfigDto) {
    return this.betaTestersService.updateAutomationConfig(dto);
  }

  // --- GESTION DES PARTICIPANTS (LISTE, DÉTAIL, STATUT, INVITATION, SUPPRESSION) ---

  @Get(['api/beta-testers', 'beta-testers'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAll(
    @Query('status') status?: string,
    @Query('androidStatus') androidStatus?: string,
    @Query('iosStatus') iosStatus?: string,
    @Query('groupId') groupId?: string,
    @Query('platform') platform?: 'ANDROID' | 'IOS' | 'ALL',
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.betaTestersService.findAll({
      status,
      androidStatus,
      iosStatus,
      groupId,
      platform,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(['api/beta-testers/:id', 'beta-testers/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findOne(@Param('id') id: string, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;
    const adminUser = (req as any).user;
    return this.betaTestersService.findOne(id, adminUser, ip);
  }

  @Get(['api/beta-testers/:id/reveal-email', 'beta-testers/:id/reveal-email'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  revealEmail(@Param('id') id: string, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;
    const adminUser = (req as any).user;
    return this.betaTestersService.revealEmail(id, adminUser, ip);
  }

  @Patch(['api/beta-testers/:id/status', 'beta-testers/:id/status'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTesterStatusDto) {
    return this.betaTestersService.updateStatus(id, {
      status: dto.status as TesterStatus,
      notes: dto.notes,
    });
  }

  @Patch(['api/beta-testers/:id', 'beta-testers/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: any) {
    return this.betaTestersService.update(id, body);
  }

  @Post([
    'api/beta-testers/:id/send-android-invite',
    'beta-testers/:id/send-android-invite',
  ])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  sendAndroidInvite(@Param('id') id: string) {
    return this.betaTestersService.sendAndroidInvite(id);
  }

  @Post([
    'api/beta-testers/:id/send-ios-invite',
    'beta-testers/:id/send-ios-invite',
  ])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  sendIosInvite(@Param('id') id: string) {
    return this.betaTestersService.sendIosInvite(id);
  }

  @Post(['api/beta-testers/:id/send-invite', 'beta-testers/:id/send-invite'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  sendPlayInvite(@Param('id') id: string, @Body() _dto?: SendPlayInviteDto) {
    // Rétrocompatibilité Play Store
    return this.betaTestersService.sendAndroidInvite(id);
  }

  @Delete(['api/beta-testers/:id', 'beta-testers/:id'])
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;
    const adminUser = (req as any).user;
    return this.betaTestersService.remove(id, adminUser, ip);
  }
}
