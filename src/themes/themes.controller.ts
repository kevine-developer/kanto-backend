import { Controller, Get, Param } from '@nestjs/common';
import { ThemesService } from './themes.service.js';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  findAll() {
    return this.themesService.findAll();
  }

  @Get('filter-options/:category')
  getFilterOptions(@Param('category') category: string) {
    return this.themesService.getFilterOptions(category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.themesService.findOne(slug);
  }
}
