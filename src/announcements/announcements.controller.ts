import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service.js';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto.js';
import { AuthGuard, Roles } from '../auth/index.js';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Route publique pour l'application mobile
  @Get('active')
  getActive() {
    return this.announcementsService.getActiveAnnouncement();
  }

  // Routes protégées pour l'administration
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
