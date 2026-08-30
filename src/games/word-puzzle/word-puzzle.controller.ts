import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WordPuzzleService } from './word-puzzle.service.js';

@Controller('games/word-puzzle')
export class WordPuzzleController {
  constructor(private readonly wordPuzzleService: WordPuzzleService) {}

  /**
   * Liste des niveaux disponibles avec le nombre de phrases et seuil 50%.
   */
  @Get('levels')
  getLevels() {
    return this.wordPuzzleService.getPublicLevels();
  }

  /**
   * Récupère les 10 phrases du niveau demandé pour démarrer la session de jeu.
   */
  @Get('levels/:levelNumber')
  getLevelSentences(@Param('levelNumber', ParseIntPipe) levelNumber: number) {
    return this.wordPuzzleService.getLevelSentences(levelNumber);
  }

  /**
   * Endpoint de bootstrap / seed (initialise les niveaux s'ils sont vides).
   */
  @Post('seed')
  seedInitial() {
    return this.wordPuzzleService.seedInitialLevels();
  }
}
