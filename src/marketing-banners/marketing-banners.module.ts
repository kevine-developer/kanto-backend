import { Module } from '@nestjs/common';
import { MarketingBannersController } from './marketing-banners.controller.js';
import { MarketingBannersService } from './marketing-banners.service.js';
import { MarketingBannerGeneratorService } from './marketing-banner-generator.service.js';
import { GeminiContentService } from '../integrations/gemini/gemini-content.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingBannersController],
  providers: [
    MarketingBannersService,
    MarketingBannerGeneratorService,
    GeminiContentService,
  ],
  exports: [MarketingBannersService],
})
export class MarketingBannersModule {}
