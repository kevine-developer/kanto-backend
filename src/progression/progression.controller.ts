import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProgressionService } from './progression.service.js';
import { SyncProgressionDto } from './dto/sync-progression.dto.js';
import { Session, type UserSession } from '../auth/index.js';

@Controller('progress')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get('me')
  async getMyProgression(@Session() session?: UserSession) {
    if (!session?.user?.id) {
      return { progress: null, games: [] }; // Ou jeter une erreur 401 si strict
    }
    return this.progressionService.getProgression(session.user.id);
  }

  @Post('sync')
  async syncProgression(
    @Body() dto: SyncProgressionDto,
    @Session() session?: UserSession,
  ) {
    if (!session?.user?.id) {
      // Si l'utilisateur n'est pas connecté, on pourrait dire que la synchro a échoué.
      // Mais dans le cas offline-first, l'app garde ses données locales en attendant.
      return { success: false, message: 'Non authentifié' };
    }
    return this.progressionService.syncProgression(session.user.id, dto);
  }
}
