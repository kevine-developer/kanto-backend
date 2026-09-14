import { Module } from '@nestjs/common';
import { VintanaService } from './vintana.service.js';
import { VintanaController } from './vintana.controller.js';

@Module({
  providers: [VintanaService],
  controllers: [VintanaController],
})
export class VintanaModule {}
