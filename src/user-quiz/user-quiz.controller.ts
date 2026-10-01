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
import { AuthGuard, OptionalAuth, Session, type UserSession } from '../auth/index.js';
import { UserQuizService } from './user-quiz.service.js';
import {
  CreateUserQuestionDto,
  CreateUserQuizSetDto,
  ReportDeckDto,
  UploadDeckImageDto,
} from './dto/user-quiz.dto.js';

@Controller('user-quiz')
export class UserQuizController {
  constructor(private readonly userQuizService: UserQuizService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createQuizSet(
    @Body() dto: CreateUserQuizSetDto,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.createQuizSet(session.user.id, dto);
  }

  @Post('upload-image')
  @UseGuards(AuthGuard)
  async uploadImage(
    @Body() body: UploadDeckImageDto,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.uploadDeckImage(
      session.user.id,
      body.imageBase64,
      body.fileName,
    );
  }

  @Get('my-sets')
  @UseGuards(AuthGuard)
  async getMyQuizSets(@Session() session: UserSession) {
    return this.userQuizService.getMyQuizSets(session.user.id);
  }

  @Get('explore')
  @OptionalAuth()
  async getPublicQuizSets(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'recent' | 'popular',
    @Query('category') category?: string,
    @Session() session?: UserSession,
  ) {
    return this.userQuizService.getPublicQuizSets(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
      search,
      sort,
      category,
      session?.user?.id,
    );
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  async reportDeck(
    @Param('id') id: string,
    @Body() body: ReportDeckDto,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.reportDeck(session.user.id, id, body);
  }

  @Post(':id/record-play')
  @OptionalAuth()
  async recordPlay(
    @Param('id') id: string,
    @Body() body?: { correctCount?: number; totalQuestions?: number },
    @Session() session?: UserSession,
  ) {
    return this.userQuizService.recordPlay(id, session?.user?.id, body);
  }

  @Get(':id')
  async getQuizSetById(@Param('id') id: string) {
    return this.userQuizService.getQuizSetById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateQuizSet(
    @Param('id') id: string,
    @Body() dto: Partial<CreateUserQuizSetDto>,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.updateQuizSet(session.user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteQuizSet(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.deleteQuizSet(session.user.id, id);
  }

  @Post(':id/questions')
  @UseGuards(AuthGuard)
  async addQuestion(
    @Param('id') setId: string,
    @Body() dto: CreateUserQuestionDto,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.addQuestion(session.user.id, setId, dto);
  }

  @Delete('questions/:questionId')
  @UseGuards(AuthGuard)
  async deleteQuestion(
    @Param('questionId') questionId: string,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.deleteQuestion(session.user.id, questionId);
  }
}
