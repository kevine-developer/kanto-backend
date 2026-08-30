import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service.js';
import { GeminiTtsService } from './gemini/gemini-tts.service.js';

@Global()
@Module({
  providers: [CloudinaryService, GeminiTtsService],
  exports: [CloudinaryService, GeminiTtsService],
})
export class IntegrationsModule {}
