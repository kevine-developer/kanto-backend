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
import { PoesiesService } from './poesies.service.js';
import { FindPoesiesQueryDto } from './dto/find-poesies.dto.js';
import { CreatePoesieDto } from './dto/create-poesie.dto.js';
import { UpdatePoesieDto } from './dto/update-poesie.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

@Controller('poesies')
export class PoesiesController {
  constructor(private readonly poesiesService: PoesiesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreatePoesieDto) {
    return this.poesiesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdatePoesieDto) {
    return this.poesiesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.poesiesService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindPoesiesQueryDto) {
    return this.poesiesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poesiesService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.poesiesService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.poesiesService.unlike(id, session!.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.poesiesService.favorite(id, session!.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.poesiesService.unfavorite(id, session!.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.poesiesService.incrementView(id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportContentDto,
    @Session() session?: UserSession,
  ) {
    return this.poesiesService.report(id, body, session?.user?.id);
  }
}
