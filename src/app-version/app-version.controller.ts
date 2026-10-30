import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppVersionService } from './app-version.service.js';
import {
  CheckAppVersionQueryDto,
  CreateAppVersionDto,
  UpdateAppVersionDto,
} from './dto/app-version.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('app-version')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  /**
   * Route publique : Vérifie si une nouvelle version est disponible pour le client.
   * Ex: GET /app-version/check?platform=android&currentVersion=0.0.19
   */
  @Get('check')
  async checkVersion(@Query() query: CheckAppVersionQueryDto) {
    return this.appVersionService.checkVersion(
      query.platform,
      query.currentVersion,
    );
  }

  /**
   * Route publique : Retourne la dernière version enregistrée pour une plateforme.
   * Ex: GET /app-version/latest?platform=android
   */
  @Get('latest')
  async getLatest(@Query('platform') platform: 'android' | 'ios' | 'all') {
    return this.appVersionService.getLatest(platform || 'android');
  }

  /**
   * Routes d'administration sécurisées (rôle ADMIN requis)
   */
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async findAll() {
    return this.appVersionService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async findOne(@Param('id') id: string) {
    return this.appVersionService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async create(@Body() dto: CreateAppVersionDto) {
    return this.appVersionService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async update(@Param('id') id: string, @Body() dto: UpdateAppVersionDto) {
    return this.appVersionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async remove(@Param('id') id: string) {
    return this.appVersionService.remove(id);
  }
}

