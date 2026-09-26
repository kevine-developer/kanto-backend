import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { WelcomeSlidesService } from './welcome-slides.service.js';
import {
  CreateWelcomeSlideDto,
  UpdateWelcomeSlideDto,
  ReorderWelcomeSlidesDto,
  UploadWelcomeSlideImageDto,
} from './dto/welcome-slide.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('welcome-slides')
export class WelcomeSlidesController {
  constructor(private readonly welcomeSlidesService: WelcomeSlidesService) {}

  /**
   * Route publique pour l'application mobile (slides actives uniquement)
   */
  @Get()
  findActive() {
    return this.welcomeSlidesService.findAllActive();
  }

  /**
   * Route complète pour l'espace d'administration
   */
  @Get('admin')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllAdmin() {
    return this.welcomeSlidesService.findAllAdmin();
  }

  /**
   * Téléversement d'image de slide d'accueil vers Cloudinary
   */
  @Post('upload-image')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  @Throttle({ upload: { limit: 15, ttl: 60000 } })
  uploadPhoto(@Body() body: UploadWelcomeSlideImageDto) {
    return this.welcomeSlidesService.saveUploadedImage(
      body.imageBase64,
      body.fileName,
      body.subfolder || 'welcome',
    );
  }

  /**
   * Réordonnancement des slides (doit être avant :id)
   */
  @Patch('reorder')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  reorder(@Body() dto: ReorderWelcomeSlidesDto) {
    return this.welcomeSlidesService.reorder(dto);
  }

  /**
   * Récupérer une slide par son id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.welcomeSlidesService.findOne(id);
  }

  /**
   * Créer une nouvelle slide
   */
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() dto: CreateWelcomeSlideDto) {
    return this.welcomeSlidesService.create(dto);
  }

  /**
   * Mettre à jour une slide existante
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() dto: UpdateWelcomeSlideDto) {
    return this.welcomeSlidesService.update(id, dto);
  }

  /**
   * Supprimer une slide
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.welcomeSlidesService.remove(id);
  }
}
