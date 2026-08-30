import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service.js';
import {
  CreateSlideDto,
  ReorderSlidesDto,
  UpdateSlideDto,
  UploadOnboardingImageDto,
} from './dto/onboarding.dto.js';

@Controller()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Endpoint public pour l'application mobile.
   * Retourne les diapositives actives triées dans l'ordre.
   */
  @Get('onboarding')
  getPublicSlides() {
    return this.onboardingService.getPublicSlides();
  }

  /**
   * Endpoint d'administration : Récupère tous les slides.
   */
  @Get('admin/onboarding')
  getAllSlidesAdmin() {
    return this.onboardingService.getAllSlidesAdmin();
  }

  /**
   * Endpoint d'administration : Crée un nouveau slide.
   */
  @Post('admin/onboarding')
  createSlide(@Body() body: CreateSlideDto) {
    return this.onboardingService.createSlide(body);
  }

  /**
   * Endpoint d'administration : Met à jour un slide (titres, photo, couleur, etc.).
   */
  @Patch('admin/onboarding/:id')
  updateSlide(@Param('id') id: string, @Body() body: UpdateSlideDto) {
    return this.onboardingService.updateSlide(id, body);
  }

  /**
   * Endpoint d'administration : Réorganise l'ordre de tous les slides.
   */
  @Put('admin/onboarding/reorder')
  reorderSlides(@Body() body: ReorderSlidesDto) {
    return this.onboardingService.reorderSlides(body.slideIds);
  }

  /**
   * Endpoint d'administration : Téléverse une photo pour un slide (Cloudinary / Local).
   */
  @Post('admin/onboarding/upload-image')
  uploadSlideImage(@Body() body: UploadOnboardingImageDto) {
    return this.onboardingService.saveUploadedImage(
      body.imageBase64,
      body.fileName,
    );
  }

  /**
   * Endpoint d'administration : Supprime définitivement un slide.
   */
  @Delete('admin/onboarding/:id')
  deleteSlide(@Param('id') id: string) {
    return this.onboardingService.deleteSlide(id);
  }
}
