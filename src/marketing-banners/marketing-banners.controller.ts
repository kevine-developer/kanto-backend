import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MarketingBannersService } from './marketing-banners.service.js';
import {
  CreateMarketingBannerDto,
  UpdateMarketingBannerDto,
  ReorderMarketingBannersDto,
} from './dto/marketing-banner.dto.js';

@Controller('marketing-banners')
export class MarketingBannersController {
  constructor(
    private readonly marketingBannersService: MarketingBannersService,
  ) {}

  /**
   * Route publique pour l'application mobile (bannières actives ordonnées)
   */
  @Get()
  findActive() {
    return this.marketingBannersService.findAllActive();
  }

  /**
   * Route complète pour le tableau de bord d'administration
   */
  @Get('admin')
  findAllAdmin() {
    return this.marketingBannersService.findAllAdmin();
  }

  /**
   * Réordonnancement des bannières (avant :id)
   */
  @Patch('reorder')
  reorder(@Body() dto: ReorderMarketingBannersDto) {
    return this.marketingBannersService.reorder(dto);
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
  create(@Body() dto: CreateMarketingBannerDto) {
    return this.marketingBannersService.create(dto);
  }

  /**
   * Basculer l'état actif/inactif
   */
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.marketingBannersService.toggleActive(id);
  }

  /**
   * Mettre à jour une bannière existante
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMarketingBannerDto) {
    return this.marketingBannersService.update(id, dto);
  }

  /**
   * Supprimer une bannière
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketingBannersService.remove(id);
  }
}
