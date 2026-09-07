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
import { CitationsService } from './citations.service.js';
import { FindCitationsQueryDto } from './dto/find-citations.dto.js';
import { CreateCitationDto } from './dto/create-citation.dto.js';
import { UpdateCitationDto } from './dto/update-citation.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

@Controller('citations')
export class CitationsController {
  constructor(private readonly citationsService: CitationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateCitationDto) {
    return this.citationsService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateCitationDto) {
    return this.citationsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.citationsService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindCitationsQueryDto) {
    return this.citationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citationsService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.citationsService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.citationsService.unlike(id, session!.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.citationsService.favorite(id, session!.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.citationsService.unfavorite(id, session!.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.citationsService.incrementView(id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportContentDto,
    @Session() session?: UserSession,
  ) {
    return this.citationsService.report(id, body, session?.user?.id);
  }
}
