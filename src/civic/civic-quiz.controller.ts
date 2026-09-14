import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Session, type UserSession } from '../auth/index.js';
import { CivicQuizService } from './civic-quiz.service.js';
import {
  FindCivicQuizQueryDto,
  RandomQuizQueryDto,
} from './dto/find-civic-quiz.dto.js';
import { CreateCivicQuizDto } from './dto/create-civic-quiz.dto.js';
import { UpdateCivicQuizDto } from './dto/update-civic-quiz.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('civic-quiz')
export class CivicQuizController {
  constructor(private readonly civicQuizService: CivicQuizService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateCivicQuizDto) {
    return this.civicQuizService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateCivicQuizDto) {
    return this.civicQuizService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.civicQuizService.remove(id);
  }

  @Get('random')
  getRandomQuestions(@Query() query: RandomQuizQueryDto) {
    return this.civicQuizService.getRandomQuestions(query);
  }

  @Get()
  findAll(@Query() query: FindCivicQuizQueryDto) {
    return this.civicQuizService.findAll(query);
  }

  @Post('session/start')
  startSession(@Body() dto: any, @Session() session?: UserSession) {
    const userId = session?.user?.id;
    return this.civicQuizService.startSession(
      userId,
      dto.category,
      dto.difficulty,
      dto.questionCount || 10,
    );
  }

  @Post('session/answer')
  answerSessionQuestion(@Body() dto: any) {
    return this.civicQuizService.answerSessionQuestion(
      dto.sessionId,
      dto.questionId,
      dto.userAnswerIndex,
    );
  }

  @Post('session/finish')
  finishSession(@Body() dto: any) {
    return this.civicQuizService.finishSession(
      dto.sessionId,
      dto.durationSeconds || 0,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.civicQuizService.findOne(id);
  }

  @Post(':id/answer')
  recordAnswer(@Param('id') id: string, @Body('isCorrect') isCorrect: boolean) {
    return this.civicQuizService.recordAnswer(id, isCorrect);
  }
}
