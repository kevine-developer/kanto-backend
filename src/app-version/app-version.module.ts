import { Module } from '@nestjs/common';
import { AppVersionController } from './app-version.controller.js';
import { AppVersionService } from './app-version.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AppVersionController],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}

