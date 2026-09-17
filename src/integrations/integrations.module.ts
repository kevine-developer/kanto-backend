import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
import { GeminiTtsService } from './gemini/gemini-tts.service.js';
import { ResendService } from './resend/resend.service.js';

@Global()
@Module({
  providers: [CloudinaryService, GeminiTtsService, ResendService],
  exports: [CloudinaryService, GeminiTtsService, ResendService],
})
export class IntegrationsModule {}

