import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ModerationService } from './moderation.service.js';
import { CreateContentReportDto } from './dto/create-report.dto.js';
import { ResolveReportDto } from './dto/resolve-report.dto.js';
import {
  AuthGuard,
  OptionalAuth,
  Roles,
  Session,
  type UserSession,
} from '../../auth/index.js';
import { ReportReason } from '../../../generated/prisma/client.js';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  /**
   * POST /moderation/reports — Soumettre un signalement (authentifié ou anonyme avec rate limit)
   */
  @Post('reports')
  @OptionalAuth()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  createReport(
    @Body() dto: CreateContentReportDto,
    @Session() session?: UserSession,
  ) {
    const userId = session?.user?.id;
    return this.moderationService.reportContent(dto, userId);
  }

  /**
   * GET /moderation/admin/reports — File des signalements en attente (Admin)
   */
  @Get('admin/reports')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAdminReports(
    @Query('resolved') resolved?: string,
    @Query('reason') reason?: ReportReason,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    const isResolved =
      resolved === 'true' ? true : resolved === 'false' ? false : undefined;

    return this.moderationService.getReports({
      resolved: isResolved,
      reason,
      take: take ? parseInt(take, 10) : 50,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }

  /**
   * GET /moderation/admin/stats — Statistiques globales de modération (Admin)
   */
  @Get('admin/stats')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  getAdminStats() {
    return this.moderationService.getModerationStats();
  }

  /**
   * PATCH /moderation/admin/reports/:id/resolve — Résoudre un signalement (Admin)
   */
  @Patch('admin/reports/:id/resolve')
  @UseGuards(AuthGuard)
  @Roles(['ADMIN', 'admin'])
  resolveReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @Session() session?: UserSession,
  ) {
    const adminUserId = session?.user?.id;
    return this.moderationService.resolveReport(id, dto, adminUserId);
  }
}
