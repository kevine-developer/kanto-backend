import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { DailyChallengeService } from './daily-challenge.service.js';
import { SubmitDailyAnswerDto } from './dto/daily-challenge.dto.js';
import { Session, type UserSession } from '../../auth/index.js';

@Controller('games/daily-challenge')
export class DailyChallengeController {
  constructor(
    private readonly dailyChallengeService: DailyChallengeService,
  ) {}

  @Get()
  getDailyChallenge(@Query('date') date?: string) {
    return this.dailyChallengeService.getDailyChallenge(date);
  }

  @Post('answer')
  submitAnswer(
    @Body() dto: SubmitDailyAnswerDto,
    @Session() session?: UserSession,
  ) {
    const userId = session?.user?.id;
    return this.dailyChallengeService.submitAnswer(userId, dto);
  }
}

