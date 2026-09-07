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
import { RecitationsService } from './recitations.service.js';
import { FindRecitationsQueryDto } from './dto/find-recitations.dto.js';
import { CreateRecitationDto } from './dto/create-recitation.dto.js';
import { UpdateRecitationDto } from './dto/update-recitation.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

@Controller('recitations')
export class RecitationsController {
  constructor(private readonly recitationsService: RecitationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateRecitationDto) {
    return this.recitationsService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateRecitationDto) {
    return this.recitationsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.recitationsService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindRecitationsQueryDto) {
    return this.recitationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recitationsService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.recitationsService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.recitationsService.unlike(id, session!.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.recitationsService.favorite(id, session!.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.recitationsService.unfavorite(id, session!.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.recitationsService.incrementView(id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportContentDto,
    @Session() session?: UserSession,
  ) {
    return this.recitationsService.report(id, body, session?.user?.id);
  }
}
