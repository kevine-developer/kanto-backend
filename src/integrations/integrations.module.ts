import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
import { CloudinarySyncService } from './cloudinary/cloudinary-sync.service.js';
import { GeminiTtsService } from './gemini/gemini-tts.service.js';
import { ResendService } from './resend/resend.service.js';

@Global()
@Module({
  providers: [
    CloudinaryService,
    CloudinarySyncService,
    GeminiTtsService,
    ResendService,
  ],
  exports: [
    CloudinaryService,
    CloudinarySyncService,
    GeminiTtsService,
    ResendService,
  ],
})
export class IntegrationsModule {}
