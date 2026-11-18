import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketingBannersService } from './marketing-banners.service.js';
import { MarketingBannerGeneratorService } from './marketing-banner-generator.service.js';
import {
  CreateMarketingBannerDto,
  UpdateMarketingBannerDto,
  ReorderMarketingBannersDto,
  UpdateMarketingBannerAiStatusDto,
  GenerateMarketingBannerDto,
} from './dto/marketing-banner.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('marketing-banners')
export class MarketingBannersController {
  constructor(
    private readonly marketingBannersService: MarketingBannersService,
    private readonly bannerGeneratorService: MarketingBannerGeneratorService,
  ) {}

  /**
   * Route publique pour l'application mobile (bannières actives ordonnées, filtrables par emplacement et catégorie)
   */
  @Get()
  findActive(
    @Query('location') location?: string,
    @Query('category') category?: string,
  ) {
    return this.marketingBannersService.findAllActive({ location, category });
  }

  /**
   * Route complète pour le tableau de bord d'administration
   */
  @Get('admin')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllAdmin() {
    return this.marketingBannersService.findAllAdmin();
  }

  /**
   * Consulter l'état d'activation de la génération IA de bannières (admin uniquement)
   */
  @Get('ai-status')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAiStatus() {
    return this.marketingBannersService.getAiGenerationStatus();
  }

  /**
   * Activer ou désactiver la génération automatique IA de bannières (admin uniquement)
   */
  @Patch('ai-status')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  updateAiStatus(@Body() dto: UpdateMarketingBannerAiStatusDto) {
    return this.marketingBannersService.updateAiGenerationStatus(dto.enabled);
  }

  /**
   * Réordonnancement des bannières (avant :id)
   */
  @Patch('reorder')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  reorder(@Body() dto: ReorderMarketingBannersDto) {
    return this.marketingBannersService.reorder(dto);
  }

  /**
   * Déclencher manuellement la génération d'une bannière via Gemini AI (admin uniquement)
   */
  @Post('generate')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  generate(@Body() dto?: GenerateMarketingBannerDto) {
    return this.bannerGeneratorService.generateAndSaveBanner({
      force: dto?.force ?? true,
    });
  }

  /**
   * Récupérer une bannière par son identifiant
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketingBannersService.findOne(id);
  }

  /**
   * Créer une nouvelle bannière
   */
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() dto: CreateMarketingBannerDto) {
    return this.marketingBannersService.create(dto);
  }

  /**
   * Basculer l'état actif/inactif
   */
  @Patch(':id/toggle')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  toggleActive(@Param('id') id: string) {
    return this.marketingBannersService.toggleActive(id);
  }

  /**
   * Mettre à jour une bannière existante
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() dto: UpdateMarketingBannerDto) {
    return this.marketingBannersService.update(id, dto);
  }

  /**
   * Supprimer une bannière
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.marketingBannersService.remove(id);
  }
}
