import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RakiTenyService } from './raki-teny.service.js';
import { CreateRakiTenyDto } from './dto/create-raki-teny.dto.js';
import { UpdateRakiTenyDto } from './dto/update-raki-teny.dto.js';
import { QueryRakiTenyDto } from './dto/query-raki-teny.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('raki-teny')
export class RakiTenyController {
  constructor(private readonly rakiTenyService: RakiTenyService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateRakiTenyDto) {
    return this.rakiTenyService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateRakiTenyDto) {
    return this.rakiTenyService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.rakiTenyService.remove(id);
  }

  @Get('daily')
  getDailyWord() {
    return this.rakiTenyService.getDailyWord();
  }

  @Get()
  findAll(@Query() query: QueryRakiTenyDto) {
    return this.rakiTenyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rakiTenyService.findOne(id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.rakiTenyService.incrementView(id);
  }

  @Post(':id/like')
  incrementLike(@Param('id') id: string) {
    return this.rakiTenyService.incrementLike(id);
  }
}
