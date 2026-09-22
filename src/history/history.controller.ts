import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service.js';
import { ReportHistoryDto } from './dto/history.dto.js';
import { Session, type UserSession } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // 1. Thèmes & Leçons
  @Get('lessons')
  getLessons() {
    return this.historyService.getLessons(false);
  }

  @Get('lessons/:id')
  getLessonById(@Param('id') id: string) {
    return this.historyService.getLessonById(id);
  }

  // 2. Présidents
  @Get('presidents')
  getPresidents() {
    return this.historyService.getPresidents(false);
  }

  @Get('presidents/:id')
  getPresidentById(@Param('id') id: string) {
    return this.historyService.getPresidentById(id);
  }

  // 3. Billets
  @Get('banknotes')
  getBanknotes() {
    return this.historyService.getBanknotes(false);
  }

  @Get('banknotes/:id')
  getBanknoteById(@Param('id') id: string) {
    return this.historyService.getBanknoteById(id);
  }

  // 4. Blasons Provinces
  @Get('provinces')
  getProvinces() {
    return this.historyService.getProvinces(false);
  }

  @Get('provinces/:id')
  getProvinceById(@Param('id') id: string) {
    return this.historyService.getProvinceById(id);
  }

  // 5. Nature & Emblèmes
  @Get('nature')
  getNatureEmblems() {
    return this.historyService.getNatureEmblems(false);
  }

  @Get('nature/:id')
  getNatureEmblemById(@Param('id') id: string) {
    return this.historyService.getNatureEmblemById(id);
  }

  // 6. Dates Historiques
  @Get('dates')
  getHistoryDates() {
    return this.historyService.getHistoryDates(false);
  }

  @Get('dates/:id')
  getHistoryDateById(@Param('id') id: string) {
    return this.historyService.getHistoryDateById(id);
  }

  // 7. Emblèmes & Sceaux d'État
  @Get('national-emblems')
  getNationalEmblems() {
    return this.historyService.getNationalEmblems(false);
  }

  @Get('national-emblems/:id')
  getNationalEmblemById(@Param('id') id: string) {
    return this.historyService.getNationalEmblemById(id);
  }

  // 8. Engagement & Vues
  @Post(':entity/:id/view')
  recordView(@Param('entity') entity: string, @Param('id') id: string) {
    return this.historyService.recordView(entity, id);
  }

  // 9. Signalement d'une erreur ou amélioration
  @Post('report')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  reportHistory(
    @Body() body: ReportHistoryDto,
    @Session() session?: UserSession,
  ) {
    return this.historyService.reportHistory(body, session?.user?.id);
  }
}
