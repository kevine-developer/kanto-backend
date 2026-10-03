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
} from './dto/beta-tester.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { renderBetaLandingPage } from './views/beta-landing.view.js';
import { TesterStatus } from '../../generated/prisma/client.js';

@Controller()
export class BetaTestersController {
  constructor(private readonly betaTestersService: BetaTestersService) {}

  /**
   * Page de présentation et d'inscription accessible directement via /beta, /rejoindre-beta ou /testers.
   */
  @Get(['beta', 'rejoindre-beta', 'testers'])
  getBetaLandingPage(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderBetaLandingPage());
  }

  /**
   * Endpoint public d'inscription au programme de test bêta Kanto (Google Play).
   */
  @Post(['api/beta-testers/register', 'beta-testers/register'])
  @HttpCode(HttpStatus.OK)
  register(@Body() dto: RegisterBetaTesterDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] as string;

    return this.betaTestersService.register(dto, ip, userAgent);
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
