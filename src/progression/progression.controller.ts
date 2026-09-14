import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProgressionService } from './progression.service.js';
import { SyncProgressionDto } from './dto/sync-progression.dto.js';
import { ReplaceProgressionDto } from './dto/replace-progression.dto.js';
import { AdjustXpDto } from './dto/adjust-xp.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Roles,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('progress')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  /**
   * Statistiques globales de progression pour l'administration.
   */
  @Get('admin/stats')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async getAdminStats() {
    return this.progressionService.getAdminStats();
  }

  /**
   * Ajustement manuel de l'XP d'un joueur par un administrateur.
   */
  @Patch('admin/users/:userId/adjust-xp')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async adjustUserXp(
    @Param('userId') userId: string,
    @Body() dto: AdjustXpDto,
  ) {
    return this.progressionService.adjustUserXp(
      userId,
      dto.xpDelta,
      dto.reason,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @OptionalAuth()
  async getMyProgression(@Session() session?: UserSession) {
    if (!session?.user?.id) {
      return { progress: null, games: [] };
    }
    return this.progressionService.getProgression(session.user.id);
  }

  /**
   * Remplace intégralement la progression serveur par les données locales du client.
   * Utilisé lors de la résolution d'un conflit de synchronisation (choix "garder local").
   */
  @Post('replace')
  @UseGuards(AuthGuard)
  async replaceProgression(
    @Body() dto: ReplaceProgressionDto,
    @Session() session: UserSession,
  ) {
    const result = await this.progressionService.replaceProgression(
      session.user.id,
      dto,
    );
    return { success: true, ...result };
  }

  /**
   * Enregistre la connexion du jour de l'utilisateur.
   * Calcule le streak (jours consécutifs) et attribue le bonus XP correspondant.
   * Idempotent : plusieurs appels le même jour ne comptent qu'une fois.
   */
  @Post('daily-login')
  @UseGuards(AuthGuard)
  async recordDailyLogin(@Session() session: UserSession) {
    const result = await this.progressionService.recordDailyLogin(
      session.user.id,
    );
    return { success: true, ...result };
  }

  @Post('sync')
  @UseGuards(AuthGuard)
  async syncProgression(
    @Body() dto: SyncProgressionDto,
    @Session() session: UserSession,
  ) {
    return this.progressionService.syncProgression(session.user.id, dto);
  }
}
