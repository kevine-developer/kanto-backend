import { Module } from '@nestjs/common';
import { DeeplinkController } from './deeplink.controller.js';

@Module({
  controllers: [DeeplinkController],
})
export class DeeplinkModule {}
