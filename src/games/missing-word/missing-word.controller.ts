import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MissingWordService } from './missing-word.service.js';

@Controller('games/missing-word')
export class MissingWordController {
  constructor(private readonly missingWordService: MissingWordService) {}

  @Get('levels')
  getLevels() {
    return this.missingWordService.getPublicLevels();
  }

  @Get('levels/:levelNumber')
  getLevelQuestions(@Param('levelNumber', ParseIntPipe) levelNumber: number) {
    return this.missingWordService.getLevelQuestions(levelNumber);
  }
}
