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
import { AdjustXpDto } from './dto/adjust-xp.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

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
  async getMyProgression(@Session() session?: UserSession) {
    if (!session?.user?.id) {
      return { progress: null, games: [] };
    }
    return this.progressionService.getProgression(session.user.id);
  }

  /**
   * Enregistre la connexion du jour de l'utilisateur.
   * Calcule le streak (jours consécutifs) et attribue le bonus XP correspondant.
   * Idempotent : plusieurs appels le même jour ne comptent qu'une fois.
   */
  @Post('daily-login')
  async recordDailyLogin(@Session() session?: UserSession) {
    if (!session?.user?.id) {
      return { success: false, message: 'Non authentifié' };
    }
    const result = await this.progressionService.recordDailyLogin(
      session.user.id,
    );
    return { success: true, ...result };
  }

  @Post('sync')
  async syncProgression(
    @Body() dto: SyncProgressionDto,
    @Session() session?: UserSession,
  ) {
    if (!session?.user?.id) {
      return { success: false, message: 'Non authentifié' };
    }
    return this.progressionService.syncProgression(session.user.id, dto);
  }
}
