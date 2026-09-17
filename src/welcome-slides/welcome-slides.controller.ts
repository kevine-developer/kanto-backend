import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WelcomeSlidesService } from './welcome-slides.service.js';
import {
  CreateWelcomeSlideDto,
  UpdateWelcomeSlideDto,
  ReorderWelcomeSlidesDto,
} from './dto/welcome-slide.dto.js';

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
  findAllAdmin() {
    return this.welcomeSlidesService.findAllAdmin();
  }

  /**
   * Réordonnancement des slides (doit être avant :id)
   */
  @Patch('reorder')
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
  create(@Body() dto: CreateWelcomeSlideDto) {
    return this.welcomeSlidesService.create(dto);
  }

  /**
   * Mettre à jour une slide existante
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWelcomeSlideDto) {
    return this.welcomeSlidesService.update(id, dto);
  }

  /**
   * Supprimer une slide
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.welcomeSlidesService.remove(id);
  }
}
