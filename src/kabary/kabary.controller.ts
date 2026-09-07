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
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

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
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.kabaryService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.kabaryService.unlike(id, session!.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.kabaryService.favorite(id, session!.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.kabaryService.unfavorite(id, session!.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.kabaryService.incrementView(id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportContentDto,
    @Session() session?: UserSession,
  ) {
    return this.kabaryService.report(id, body, session?.user?.id);
  }
}
