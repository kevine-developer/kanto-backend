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
import { KabaryService } from './kabary.service.js';
import { FindKabaryQueryDto } from './dto/find-kabary.dto.js';
import { CreateKabaryDto } from './dto/create-kabary.dto.js';
import { UpdateKabaryDto } from './dto/update-kabary.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('kabary')
export class KabaryController {
  constructor(private readonly kabaryService: KabaryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateKabaryDto) {
    return this.kabaryService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateKabaryDto) {
    return this.kabaryService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.kabaryService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindKabaryQueryDto) {
    return this.kabaryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kabaryService.findOne(id);
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.kabaryService.like(id);
  }

  @Post(':id/unlike')
  unlike(@Param('id') id: string) {
    return this.kabaryService.unlike(id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.kabaryService.incrementView(id);
  }
}
