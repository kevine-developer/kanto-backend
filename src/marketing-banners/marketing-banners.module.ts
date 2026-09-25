import { Module } from '@nestjs/common';
import { MarketingBannersController } from './marketing-banners.controller.js';
import { MarketingBannersService } from './marketing-banners.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingBannersController],
  providers: [MarketingBannersService],
  exports: [MarketingBannersService],
})
export class MarketingBannersModule {}
