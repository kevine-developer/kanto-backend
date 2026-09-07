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
import { ContesService } from './contes.service.js';
import { ContesAudioService } from './contes-audio.service.js';
import { FindContesQueryDto } from './dto/find-contes.dto.js';
import { CreateConteDto } from './dto/create-conte.dto.js';
import { UpdateConteDto } from './dto/update-conte.dto.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';
import { ReportContentDto } from '../common/dto/report-content.dto.js';

@Controller('contes')
export class ContesController {
  constructor(
    private readonly contesService: ContesService,
    private readonly contesAudioService: ContesAudioService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateConteDto) {
    return this.contesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateConteDto) {
    return this.contesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.contesService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindContesQueryDto) {
    return this.contesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contesService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session?: UserSession) {
    return this.contesService.like(id, session!.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session?: UserSession) {
    return this.contesService.unlike(id, session!.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.contesService.favorite(id, session!.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session?: UserSession) {
    return this.contesService.unfavorite(id, session!.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.contesService.incrementView(id);
  }

  @Post(':id/generate-audio')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  generateAudio(
    @Param('id') id: string,
    @Body() body: { language?: 'mg' | 'fr'; voiceId?: string; force?: boolean },
  ) {
    return this.contesAudioService.generateAudio(
      id,
      body.language,
      body.voiceId,
      body.force,
    );
  }

  @Post(':id/generate-audio-both')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  generateAudioBoth(
    @Param('id') id: string,
    @Body() body: { voiceId?: string; force?: boolean },
  ) {
    return this.contesAudioService.generateAudioBothLanguages(
      id,
      body.voiceId,
      body.force,
    );
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportContentDto,
    @Session() session?: UserSession,
  ) {
    return this.contesService.report(id, body, session?.user?.id);
  }
}
