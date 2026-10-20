import {
  Body,
  Controller,
  Get,
  Ip,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReferralService } from './referral.service.js';
import {
  AdminReferralQueryDto,
  ClaimReferralDto,
  UpdateReferralConfigDto,
} from './dto/referral.dto.js';
import {
  AuthGuard,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  // ─── Endpoints Utilisateur ────────────────────────────────────────────────

  /**
   * Récupère le code de parrainage et les statistiques complètes de l'utilisateur connecté.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyReferralStats(@Session() session: UserSession) {
    return this.referralService.getUserReferralStats(session.user.id);
  }

  /**
   * Associe un code de parrainage au compte de l'utilisateur connecté (filleul).
   */
  @Post('claim')
  @UseGuards(AuthGuard)
  async claimReferral(
    @Session() session: UserSession,
    @Body() dto: ClaimReferralDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.referralService.claimReferral(
      session.user.id,
      dto.code,
      ip,
      userAgent,
    );
  }

  /**
   * Enregistre un clic sur un lien de parrainage partagé.
   * Public et non bloquant.
   */
  @Post('track-click/:code')
  async trackClick(@Param('code') code: string) {
    return this.referralService.trackClick(code);
  }

  /**
   * Déclenche la validation du parrainage pour le filleul connecté dès sa première activité.
   */
  @Post('trigger-activation')
  @UseGuards(AuthGuard)
  async triggerActivation(@Session() session: UserSession) {
    return this.referralService.completeReferral(session.user.id);
  }

  // ─── Endpoints Administration ─────────────────────────────────────────────

  /**
   * Vue d'ensemble et métriques globales du parrainage pour l'administration.
   */
  @Get('admin/overview')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminOverview() {
    return this.referralService.getAdminOverview();
  }

  /**
   * Liste détaillée et paginée des parrainages pour l'administration.
   */
  @Get('admin/list')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminList(@Query() query: AdminReferralQueryDto) {
    return this.referralService.getAdminReferralsList(query);
  }

  /**
   * Récupère la configuration actuelle du parrainage.
   */
  @Get('admin/config')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminConfig() {
    return this.referralService.getOrCreateConfig();
  }

  /**
   * Met à jour les paramètres du programme de parrainage.
   */
  @Patch('admin/config')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async updateAdminConfig(
    @Session() session: UserSession,
    @Body() dto: UpdateReferralConfigDto,
  ) {
    return this.referralService.updateAdminConfig(dto, session.user.id);
  }
}
