import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service.js';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Session,
  type UserSession,
} from '../auth/index.js';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  @OptionalAuth()
  async getLeaderboard(
    @Query() query: LeaderboardQueryDto,
    @Session() session?: UserSession,
  ) {
    // Sécurité stricte : currentUserId provient EXCLUSIVEMENT de la session authentifiée.
    // query.userId ne peut pas être utilisé pour s'auto-authentifier.
    const currentUserId = session?.user?.id;
    return this.leaderboardService.getLeaderboard(currentUserId, query);
  }
}
