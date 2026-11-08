import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import fs from 'node:fs';
import path from 'node:path';
import { PartnerApiKeyGuard } from '../../guards/partner-api-key.guard.js';
import { PartnerScopesGuard } from '../../guards/partner-scopes.guard.js';
import { RequirePartnerScopes } from '../../decorators/partner-scopes.decorator.js';
import { CurrentPartner } from '../../decorators/current-partner.decorator.js';
import { CloudinaryService } from '../../../integrations/cloudinary/cloudinary.service.js';

export class UploadPartnerMediaDto {
  @IsString()
  @IsNotEmpty()
  base64Data!: string; // Data URI "data:image/png;base64,..." ou base64 pur
}

@Controller('v1/media')
@UseGuards(PartnerApiKeyGuard, PartnerScopesGuard)
export class PartnerMediaV1Controller {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Téléversement sécurisé d'une affiche ou illustration d'événement (format JPEG, PNG, WebP - max 5 Mo).
   */
  @Post('upload')
  @RequirePartnerScopes('media:upload')
  @HttpCode(HttpStatus.OK)
  async uploadMedia(
    @CurrentPartner('id') partnerId: string,
    @Body() dto: UploadPartnerMediaDto,
  ) {
    const { buffer, mimeType } =
      this.cloudinaryService.validateAndDecodeBase64Image(dto.base64Data);

    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(mimeType)) {
      throw new BadRequestException(
        'Format d’image non supporté. Formats acceptés : JPEG, PNG, WebP.',
      );
    }

    if (buffer.length > 5 * 1024 * 1024) {
      throw new BadRequestException(
        'L’image est trop volumineuse. La taille maximale autorisée est de 5 Mo.',
      );
    }

    const filename = `partner_${partnerId}_event_${Date.now()}`;
    let finalUrl: string;
    let provider: string;

    if (this.cloudinaryService.isConfigured()) {
      finalUrl = await this.cloudinaryService.uploadImageBuffer(
        buffer,
        filename,
        'kanto/partner-events',
      );
      provider = 'cloudinary';
    } else {
      // Stockage local de secours
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'partners');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const ext =
        mimeType === 'image/png'
          ? 'png'
          : mimeType === 'image/webp'
            ? 'webp'
            : 'jpg';
      const localFilePath = path.join(uploadDir, `${filename}.${ext}`);
      fs.writeFileSync(localFilePath, buffer);
      finalUrl = `/uploads/partners/${filename}.${ext}`;
      provider = 'local';
    }

    return {
      success: true,
      url: finalUrl,
      provider,
      mimeType,
      sizeBytes: buffer.length,
    };
  }
}
