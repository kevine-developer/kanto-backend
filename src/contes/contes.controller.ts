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
import { AuthGuard, Roles } from '../auth/index.js';

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
  like(@Param('id') id: string) {
    return this.contesService.like(id);
  }

  @Post(':id/unlike')
  unlike(@Param('id') id: string) {
    return this.contesService.unlike(id);
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
}
