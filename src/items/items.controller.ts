import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FindItemsQueryDto } from './dto/find-items.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { ImportItemsBatchDto, CheckDuplicatesDto } from './dto/import-items.dto.js';
import { ReportItemDto } from './dto/report-item.dto.js';
import { ItemsService } from './items.service.js';
import { DailyItemsService } from './daily-items.service.js';
import { ItemsInteractionService } from './items-interaction.service.js';
import { AuthGuard, Roles, Session, type UserSession } from '../auth/index.js';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly dailyItemsService: DailyItemsService,
    private readonly itemsInteractionService: ItemsInteractionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  create(@Body() body: CreateItemDto) {
    return this.itemsService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  update(@Param('id') id: string, @Body() body: UpdateItemDto) {
    return this.itemsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Get()
  findAll(@Query() query: FindItemsQueryDto) {
    return this.itemsService.findAll(query);
  }

  @Post('import-csv')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  importCsv(@Body() body: ImportItemsBatchDto) {
    return this.itemsService.importBatch(body);
  }

  @Post('import')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  importBatch(@Body() body: ImportItemsBatchDto) {
    return this.itemsService.importBatch(body);
  }

  @Post('check-duplicates')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async checkDuplicates(@Body() body: CheckDuplicatesDto) {
    const duplicates = await this.itemsService.checkDuplicates(body.texts || []);
    return { duplicates };
  }

  @Get('export-csv')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  async exportCsv(@Query() query: FindItemsQueryDto, @Res() res: Response) {
    const csvData = await this.itemsService.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="proverbes-kanto.csv"',
    );
    return res.send(csvData);
  }

  @Get('daily')
  findDaily() {
    return this.dailyItemsService.findDaily();
  }

  @Get('daily/all')
  findAllDaily() {
    return this.dailyItemsService.findAllDaily();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  like(@Param('id') id: string, @Session() session: UserSession) {
    return this.itemsInteractionService.like(id, session.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  unlike(@Param('id') id: string, @Session() session: UserSession) {
    return this.itemsInteractionService.unlike(id, session.user.id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Session() session: UserSession) {
    return this.itemsInteractionService.favorite(id, session.user.id);
  }

  @Post(':id/unfavorite')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Session() session: UserSession) {
    return this.itemsInteractionService.unfavorite(id, session.user.id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string) {
    return this.itemsInteractionService.incrementView(id);
  }

  @Post(':id/report')
  @UseGuards(AuthGuard)
  report(
    @Param('id') id: string,
    @Body() body: ReportItemDto,
    @Session() session?: UserSession,
  ) {
    return this.itemsInteractionService.report(id, body, session?.user?.id);
  }
}
