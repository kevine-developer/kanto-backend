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
  CreateLevelDto,
  UpdateLevelDto,
  CreateSentenceDto,
  UpdateSentenceDto,
} from './dto/word-puzzle.dto.js';
import { WordPuzzleService } from './word-puzzle.service.js';
import { AuthGuard, Roles } from '../../auth/index.js';

@Controller('admin/word-puzzle')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminWordPuzzleController {
  constructor(private readonly wordPuzzleService: WordPuzzleService) {}

  // ── STATISTIQUES DU JEU ──

  @Get('stats')
  getStats() {
    return this.wordPuzzleService.getStatsAdmin();
  }

  // ── GESTION DES NIVEAUX ──

  @Get('levels')
  getAllLevels() {
    return this.wordPuzzleService.getAllLevelsAdmin();
  }

  @Get('levels/:id')
  getLevel(@Param('id') id: string) {
    return this.wordPuzzleService.getLevelAdmin(id);
  }

  @Post('levels')
  createLevel(@Body() dto: CreateLevelDto) {
    return this.wordPuzzleService.createLevel(dto);
  }

  @Patch('levels/:id')
  updateLevel(@Param('id') id: string, @Body() dto: UpdateLevelDto) {
    return this.wordPuzzleService.updateLevel(id, dto);
  }

  @Delete('levels/:id')
  deleteLevel(@Param('id') id: string) {
    return this.wordPuzzleService.deleteLevel(id);
  }

  @Post('levels/:levelId/reorder')
  reorderSentences(
    @Param('levelId') levelId: string,
    @Body() body: { sentenceIds: string[] },
  ) {
    return this.wordPuzzleService.reorderSentences(levelId, body.sentenceIds);
  }

  // ── GESTION DES PHRASES (10 PHRASES PAR NIVEAU) ──

  @Post('sentences')
  createSentence(@Body() dto: CreateSentenceDto) {
    return this.wordPuzzleService.createSentence(dto);
  }

  @Patch('sentences/:id')
  updateSentence(@Param('id') id: string, @Body() dto: UpdateSentenceDto) {
    return this.wordPuzzleService.updateSentence(id, dto);
  }

  @Delete('sentences/:id')
  deleteSentence(@Param('id') id: string) {
    return this.wordPuzzleService.deleteSentence(id);
  }

  @Post('sentences/:id/move')
  moveSentence(
    @Param('id') id: string,
    @Body() body: { direction: 'up' | 'down' },
  ) {
    return this.wordPuzzleService.moveSentence(id, body.direction);
  }

  @Post('seed')
  seed() {
    return this.wordPuzzleService.seedInitialLevels();
  }
}
