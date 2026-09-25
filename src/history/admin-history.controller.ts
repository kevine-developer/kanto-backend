import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { Throttle } from '@nestjs/throttler';
import {
  UploadHistoryImageDto,
  CreateCivicLessonDto,
  UpdateCivicLessonDto,
  CreatePresidentDto,
  UpdatePresidentDto,
  CreateBanknoteDto,
  UpdateBanknoteDto,
  CreateProvinceBlasonDto,
  UpdateProvinceBlasonDto,
  CreateNatureEmblemDto,
  UpdateNatureEmblemDto,
  CreateHistoryDateDto,
  UpdateHistoryDateDto,
  CreateNationalEmblemDto,
  UpdateNationalEmblemDto,
} from './dto/history.dto.js';

@Controller('admin/history')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminHistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('seed')
  async seedDefaults(@Body() body?: { force?: boolean }) {
    await this.historyService.seedDefaultsIfEmpty(body?.force ?? false);
    return {
      success: true,
      message: 'Données Histoire & Patrimoine synchronisées avec succès.',
    };
  }

  // ==========================================
  // TÉLÉVERSEMENT DE PHOTO
  // ==========================================
  @Post('upload-image')
  @Throttle({ upload: { limit: 15, ttl: 60000 } })
  uploadPhoto(@Body() body: UploadHistoryImageDto) {
    return this.historyService.saveUploadedImage(
      body.imageBase64,
      body.fileName,
      body.subfolder || 'history',
    );
  }

  // ==========================================
  // 1. THÈMES & LEÇONS
  // ==========================================
  @Get('lessons')
  getLessons() {
    return this.historyService.getLessons(true);
  }

  @Post('lessons')
  createLesson(@Body() body: CreateCivicLessonDto) {
    return this.historyService.createLesson(body);
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id') id: string, @Body() body: UpdateCivicLessonDto) {
    return this.historyService.updateLesson(id, body);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: string) {
    return this.historyService.deleteLesson(id);
  }

  // ==========================================
  // 2. PRÉSIDENTS
  // ==========================================
  @Get('presidents')
  getPresidents() {
    return this.historyService.getPresidents(true);
  }

  @Post('presidents')
  createPresident(@Body() body: CreatePresidentDto) {
    return this.historyService.createPresident(body);
  }

  @Patch('presidents/:id')
  updatePresident(@Param('id') id: string, @Body() body: UpdatePresidentDto) {
    return this.historyService.updatePresident(id, body);
  }

  @Delete('presidents/:id')
  deletePresident(@Param('id') id: string) {
    return this.historyService.deletePresident(id);
  }

  // ==========================================
  // 3. BILLETS
  // ==========================================
  @Get('banknotes')
  getBanknotes() {
    return this.historyService.getBanknotes(true);
  }

  @Post('banknotes')
  createBanknote(@Body() body: CreateBanknoteDto) {
    return this.historyService.createBanknote(body);
  }

  @Patch('banknotes/:id')
  updateBanknote(@Param('id') id: string, @Body() body: UpdateBanknoteDto) {
    return this.historyService.updateBanknote(id, body);
  }

  @Delete('banknotes/:id')
  deleteBanknote(@Param('id') id: string) {
    return this.historyService.deleteBanknote(id);
  }

  // ==========================================
  // 4. BLASONS PROVINCES
  // ==========================================
  @Get('provinces')
  getProvinces() {
    return this.historyService.getProvinces(true);
  }

  @Post('provinces')
  createProvince(@Body() body: CreateProvinceBlasonDto) {
    return this.historyService.createProvince(body);
  }

  @Patch('provinces/:id')
  updateProvince(
    @Param('id') id: string,
    @Body() body: UpdateProvinceBlasonDto,
  ) {
    return this.historyService.updateProvince(id, body);
  }

  @Delete('provinces/:id')
  deleteProvince(@Param('id') id: string) {
    return this.historyService.deleteProvince(id);
  }

  // ==========================================
  // 5. NATURE & BIODIVERSITÉ
  // ==========================================
  @Get('nature')
  getNatureEmblems() {
    return this.historyService.getNatureEmblems(true);
  }

  @Post('nature')
  createNatureEmblem(@Body() body: CreateNatureEmblemDto) {
    return this.historyService.createNatureEmblem(body);
  }

  @Patch('nature/:id')
  updateNatureEmblem(
    @Param('id') id: string,
    @Body() body: UpdateNatureEmblemDto,
  ) {
    return this.historyService.updateNatureEmblem(id, body);
  }

  @Delete('nature/:id')
  deleteNatureEmblem(@Param('id') id: string) {
    return this.historyService.deleteNatureEmblem(id);
  }

  // ==========================================
  // 6. DATES HISTORIQUES
  // ==========================================
  @Get('dates')
  getHistoryDates() {
    return this.historyService.getHistoryDates(true);
  }

  @Post('dates')
  createHistoryDate(@Body() body: CreateHistoryDateDto) {
    return this.historyService.createHistoryDate(body);
  }

  @Patch('dates/:id')
  updateHistoryDate(
    @Param('id') id: string,
    @Body() body: UpdateHistoryDateDto,
  ) {
    return this.historyService.updateHistoryDate(id, body);
  }

  @Delete('dates/:id')
  deleteHistoryDate(@Param('id') id: string) {
    return this.historyService.deleteHistoryDate(id);
  }

  // ==========================================
  // 7. EMBLÈMES & SCEAUX D'ÉTAT
  // ==========================================
  @Get('national-emblems')
  getNationalEmblems() {
    return this.historyService.getNationalEmblems(true);
  }

  @Post('national-emblems')
  createNationalEmblem(@Body() body: CreateNationalEmblemDto) {
    return this.historyService.createNationalEmblem(body);
  }

  @Patch('national-emblems/:id')
  updateNationalEmblem(
    @Param('id') id: string,
    @Body() body: UpdateNationalEmblemDto,
  ) {
    return this.historyService.updateNationalEmblem(id, body);
  }

  @Delete('national-emblems/:id')
  deleteNationalEmblem(@Param('id') id: string) {
    return this.historyService.deleteNationalEmblem(id);
  }
}
