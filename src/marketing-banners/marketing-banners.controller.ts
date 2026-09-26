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
import { MarketingBannersService } from './marketing-banners.service.js';
import {
  CreateMarketingBannerDto,
  UpdateMarketingBannerDto,
  ReorderMarketingBannersDto,
} from './dto/marketing-banner.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

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
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAllAdmin() {
    return this.marketingBannersService.findAllAdmin();
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
