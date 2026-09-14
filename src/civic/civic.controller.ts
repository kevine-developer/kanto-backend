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
import { CivicService } from './civic.service.js';
import { FindCivicQueryDto } from './dto/find-civic.dto.js';
import { CreateCivicDto } from './dto/create-civic.dto.js';
import { UpdateCivicDto } from './dto/update-civic.dto.js';
import { AuthGuard, Roles, Session } from '../auth/index.js';
import type { UserSession } from '../auth/index.js';

@Controller('civic')
export class CivicController {
  constructor(private readonly civicService: CivicService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateCivicDto) {
    return this.civicService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateCivicDto) {
    return this.civicService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.civicService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindCivicQueryDto) {
    return this.civicService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.civicService.findOne(id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.civicService.incrementView(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.civicService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.civicService.unlike(id, session!.user.id);
  }
}
