import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Session, type UserSession } from '../../auth/index.js';
import { RiddleService } from './riddle.service.js';
import {
  StartRiddleSessionDto,
  AnswerRiddleQuestionDto,
  FinishRiddleSessionDto,
  AbandonRiddleSessionDto,
} from './dto/riddle-session.dto.js';

@Controller('games/riddle')
export class RiddleController {
  constructor(private readonly riddleService: RiddleService) {}

  @Get('groups')
  getAvailableGroups() {
    return this.riddleService.getAvailableGroups();
  }

  @Post('start')
  startSession(
    @Body() dto: StartRiddleSessionDto,
    @Session() session?: UserSession,
  ) {
    const userId = session?.user?.id;
    const targetGroup = dto.groupNumber ?? dto.level;
    const parsedGroup =
      targetGroup !== undefined && targetGroup !== null && targetGroup !== ''
        ? parseInt(String(targetGroup), 10)
        : undefined;
    return this.riddleService.startSession(
      userId,
      parsedGroup,
      dto.questionCount || 10,
    );
  }

  @Post('answer')
  answerQuestion(@Body() dto: AnswerRiddleQuestionDto) {
    return this.riddleService.answerQuestion(
      dto.sessionId,
      dto.questionId,
      dto.userAnswer as any,
    );
  }

  @Post('finish')
  finishSession(@Body() dto: FinishRiddleSessionDto) {
    return this.riddleService.finishSession(
      dto.sessionId,
      dto.durationSeconds || 0,
    );
  }

  @Post('abandon')
  abandonSession(@Body() dto: AbandonRiddleSessionDto) {
    return this.riddleService.abandonSession(dto.sessionId);
  }

  @Get()
  getQuestions(@Query('level') level?: string) {
    return this.riddleService.getQuestions(
      level ? parseInt(level, 10) : undefined,
    );
  }
}
