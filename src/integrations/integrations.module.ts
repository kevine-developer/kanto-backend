import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
import { CloudinarySyncService } from './cloudinary/cloudinary-sync.service.js';
import { GeminiTtsService } from './gemini/gemini-tts.service.js';
import { ResendService } from './resend/resend.service.js';
import { ResendWebhookService } from './resend/resend-webhook.service.js';
import { ResendWebhookController } from './resend/resend-webhook.controller.js';

@Global()
@Module({
  controllers: [ResendWebhookController],
  providers: [
    CloudinaryService,
    CloudinarySyncService,
    GeminiTtsService,
    ResendService,
    ResendWebhookService,
  ],
  exports: [
    CloudinaryService,
    CloudinarySyncService,
    GeminiTtsService,
    ResendService,
    ResendWebhookService,
  ],
})
export class IntegrationsModule {}
