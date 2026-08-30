import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { WordPuzzleService } from './word-puzzle.service.js';
import { WordPuzzleController } from './word-puzzle.controller.js';
import { AdminWordPuzzleController } from './admin-word-puzzle.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [WordPuzzleController, AdminWordPuzzleController],
  providers: [WordPuzzleService],
  exports: [WordPuzzleService],
})
export class WordPuzzleModule {}
