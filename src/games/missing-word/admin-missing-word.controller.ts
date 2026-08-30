import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateMissingWordLevelDto,
  CreateMissingWordQuestionDto,
  ReorderQuestionsDto,
  UpdateMissingWordLevelDto,
  UpdateMissingWordQuestionDto,
} from './dto/missing-word.dto.js';
import { MissingWordService } from './missing-word.service.js';
import { AuthGuard, Roles } from '../../auth/index.js';

@Controller('admin/missing-word')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminMissingWordController {
  constructor(private readonly missingWordService: MissingWordService) {}

  // ── STATISTIQUES ──

  @Get('stats')
  getStats() {
    return this.missingWordService.getStatsAdmin();
  }

  // ── GESTION DES NIVEAUX ──

  @Get('levels')
  getAllLevels() {
    return this.missingWordService.getAllLevelsAdmin();
  }

  @Get('levels/:id')
  getLevel(@Param('id') id: string) {
    return this.missingWordService.getLevelAdmin(id);
  }

  @Post('levels')
  createLevel(@Body() dto: CreateMissingWordLevelDto) {
    return this.missingWordService.createLevel(dto);
  }

  @Patch('levels/:id')
  updateLevel(@Param('id') id: string, @Body() dto: UpdateMissingWordLevelDto) {
    return this.missingWordService.updateLevel(id, dto);
  }

  @Delete('levels/:id')
  deleteLevel(@Param('id') id: string) {
    return this.missingWordService.deleteLevel(id);
  }

  @Post('levels/:levelId/reorder')
  reorderQuestions(
    @Param('levelId') levelId: string,
    @Body() body: ReorderQuestionsDto,
  ) {
    return this.missingWordService.reorderQuestions(levelId, body.questionIds);
  }

  // ── GESTION DES QUESTIONS ──

  @Post('questions')
  createQuestion(@Body() dto: CreateMissingWordQuestionDto) {
    return this.missingWordService.createQuestion(dto);
  }

  @Patch('questions/:id')
  updateQuestion(
    @Param('id') id: string,
    @Body() dto: UpdateMissingWordQuestionDto,
  ) {
    return this.missingWordService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.missingWordService.deleteQuestion(id);
  }

  @Post('questions/:id/move')
  moveQuestion(
    @Param('id') id: string,
    @Body() body: { direction: 'up' | 'down' },
  ) {
    return this.missingWordService.moveQuestion(id, body.direction);
  }

  @Post('seed')
  seed() {
    return this.missingWordService.seedInitialLevels();
  }
}
