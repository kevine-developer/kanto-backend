import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { UserQuizService } from '../user-quiz/user-quiz.service.js';
import { VerifyDeckDto } from '../user-quiz/dto/user-quiz.dto.js';

@Controller('admin/decks')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminDecksController {
  constructor(private readonly userQuizService: UserQuizService) {}

  @Get()
  async getAdminDecks(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('filter') filter?: 'all' | 'verified' | 'unverified' | 'reported',
  ) {
    return this.userQuizService.getAdminDecks(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
      filter || 'all',
    );
  }

  @Patch(':id/verify')
  async verifyDeck(
    @Param('id') id: string,
    @Body() body: VerifyDeckDto,
    @Session() session: UserSession,
  ) {
    return this.userQuizService.verifyDeck(id, body.verified, session.user.id);
  }
}
