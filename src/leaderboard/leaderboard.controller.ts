import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service.js';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto.js';
import { Session, type UserSession } from '../auth/index.js';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query() query: LeaderboardQueryDto,
    @Session() session?: UserSession,
  ) {
    const currentUserId = session?.user?.id || query?.userId;
    return this.leaderboardService.getLeaderboard(currentUserId, query);
  }
}
