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
import { FindItemsQueryDto } from './dto/find-items.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
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
  like(@Param('id') id: string) {
    return this.itemsInteractionService.like(id);
  }

  @Post(':id/unlike')
  unlike(@Param('id') id: string) {
    return this.itemsInteractionService.unlike(id);
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
