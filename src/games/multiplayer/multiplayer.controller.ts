import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, type UserSession } from '../../auth/index.js';
import {
  CreateMultiplayerGameDto,
  JoinMultiplayerGameDto,
  SubmitMultiplayerAnswerDto,
} from './dto/multiplayer.dto.js';
import { MultiplayerService } from './multiplayer.service.js';

@Controller(['games/multiplayer', 'games/duel'])
export class MultiplayerController {
  constructor(private readonly multiplayerService: MultiplayerService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createGame(
    @Body() dto: CreateMultiplayerGameDto,
    @Session() session: UserSession,
  ) {
    return this.multiplayerService.createGame(session.user.id, dto);
  }

  @Post('join')
  @UseGuards(AuthGuard)
  async joinGame(
    @Body() dto: JoinMultiplayerGameDto,
    @Session() session: UserSession,
  ) {
    return this.multiplayerService.joinGame(session.user.id, dto);
  }

  @Get(':code')
  async getGameState(@Param('code') code: string) {
    return this.multiplayerService.getGameState(code);
  }

  @Post('answer')
  @UseGuards(AuthGuard)
  async submitAnswer(
    @Body() dto: SubmitMultiplayerAnswerDto,
    @Session() session: UserSession,
  ) {
    return this.multiplayerService.submitAnswer(session.user.id, dto);
  }

  @Post(':code/theme')
  @UseGuards(AuthGuard)
  async changeTheme(
    @Param('code') code: string,
    @Body('theme') theme: string,
    @Session() session: UserSession,
  ) {
    return this.multiplayerService.changeTheme(code, session.user.id, theme);
  }

  @Post(':code/delegate-theme')
  @UseGuards(AuthGuard)
  async delegateThemeChoice(
    @Param('code') code: string,
    @Body('targetUserId') targetUserId: string | undefined,
    @Session() session: UserSession,
  ) {
    return this.multiplayerService.delegateThemeChoice(
      code,
      session.user.id,
      targetUserId,
    );
  }
}
