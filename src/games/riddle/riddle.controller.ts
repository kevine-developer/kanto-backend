import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Session, type UserSession } from '../../auth/index.js';
import { RiddleService } from './riddle.service.js';

@Controller('games/riddle')
export class RiddleController {
  constructor(private readonly riddleService: RiddleService) {}

  @Post('start')
  startSession(@Body() dto: any, @Session() session?: UserSession) {
    const userId = session?.user?.id;
    return this.riddleService.startSession(
      userId,
      dto.level,
      dto.questionCount || 5,
    );
  }

  @Post('answer')
  answerQuestion(@Body() dto: any) {
    return this.riddleService.answerQuestion(
      dto.sessionId,
      dto.questionId,
      dto.userAnswer,
    );
  }

  @Post('finish')
  finishSession(@Body() dto: any) {
    return this.riddleService.finishSession(
      dto.sessionId,
      dto.durationSeconds || 0,
    );
  }

  @Get()
  getQuestions(@Query('level') level?: string) {
    return this.riddleService.getQuestions(
      level ? parseInt(level, 10) : undefined,
    );
  }
}
