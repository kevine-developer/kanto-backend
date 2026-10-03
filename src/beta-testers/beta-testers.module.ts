import { Module } from '@nestjs/common';
import { BetaTestersController } from './beta-testers.controller.js';
import { BetaTestersService } from './beta-testers.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { IntegrationsModule } from '../integrations/integrations.module.js';

@Module({
  imports: [PrismaModule, IntegrationsModule],
  controllers: [BetaTestersController],
  providers: [BetaTestersService],
  exports: [BetaTestersService],
})
export class BetaTestersModule {}
