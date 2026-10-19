import { Module } from '@nestjs/common';
import { RakiTenyController } from './raki-teny.controller.js';
import { RakiTenyService } from './raki-teny.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [RakiTenyController],
  providers: [RakiTenyService],
  exports: [RakiTenyService],
})
export class RakiTenyModule {}
