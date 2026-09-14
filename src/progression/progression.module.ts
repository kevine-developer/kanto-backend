import { Module } from '@nestjs/common';
import { ProgressionService } from './progression.service.js';
import { ProgressionController } from './progression.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [PrismaModule, BadgesModule],
  controllers: [ProgressionController],
  providers: [ProgressionService],
  exports: [ProgressionService],
})
export class ProgressionModule {}
