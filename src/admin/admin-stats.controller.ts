import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import { AdminAuditService } from './admin-audit.service.js';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminStatsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AdminAuditService,
  ) {}

  /**
   * GET /admin/stats/dashboard — Métriques agrégées du conservatoire et pilotage CRM
   */
  @Get('stats/dashboard')
  async getDashboardMetrics(@Query('period') period?: string) {
    const now = new Date();
    let startDate: Date | undefined;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = startDate ? { gte: startDate } : undefined;

    // Requêtes parallèles hautement optimisées
    const [
      totalUsers,
      newUsersInPeriod,
      bannedUsers,
      adminsCount,
      moderatorsCount,
      contributorsCount,
      premiumUsers,
      totalContes,
      contesWithAudioMg,
      contesWithAudioFr,
      totalItems,
      totalCitations,
      totalKabary,
      totalPoesies,
      pendingContributions,
      disputedContributions,
      pendingReports,
      flaggedContributions,
      ugcQuizSets,
      lockedModulesCount,
      activeAnnouncementsCount,
      dbCheck,
    ] = await Promise.all([
      this.prisma.user.count(),
      dateFilter
        ? this.prisma.user.count({ where: { createdAt: dateFilter } })
        : Promise.resolve(0),
      this.prisma.user.count({ where: { banned: true } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({ where: { role: 'MODERATOR' } }),
      this.prisma.user.count({ where: { role: 'CONTRIBUTOR' } }),
      this.prisma.user.count({ where: { tier: 'PREMIUM' } }),
      this.prisma.conte.count(),
      this.prisma.conte.count({ where: { audioUrlMg: { not: null } } }),
      this.prisma.conte.count({ where: { audioUrlFr: { not: null } } }),
      this.prisma.malagasyItem.count(),
      this.prisma.citation.count(),
      this.prisma.kabary.count(),
      this.prisma.poesie.count(),
      this.prisma.contribution.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.contribution.count({ where: { disputeStatus: 'PENDING' } }),
      this.prisma.contentReport.count({ where: { resolved: false } }),
      this.prisma.contribution.count({
        where: { moderationFlagged: true, status: 'PENDING_REVIEW' },
      }),
      this.prisma.userQuizSet.count(),
      this.prisma.moduleLock.count({ where: { isLocked: true } }),
      this.prisma.systemAnnouncement.count({ where: { isActive: true } }),
      this.prisma.$queryRaw`SELECT 1 as ping`
        .then(() => true)
        .catch(() => false),
    ]);

    return {
      period: period || 'all',
      users: {
        total: totalUsers,
        newInPeriod: dateFilter ? newUsersInPeriod : totalUsers,
        banned: bannedUsers,
        premium: premiumUsers,
        roles: {
          admin: adminsCount,
          moderator: moderatorsCount,
          contributor: contributorsCount,
          user: totalUsers - adminsCount - moderatorsCount - contributorsCount,
        },
      },
      content: {
        contes: {
          total: totalContes,
          withAudioMg: contesWithAudioMg,
          withAudioFr: contesWithAudioFr,
          audioCoverageMg:
            totalContes > 0
              ? Math.round((contesWithAudioMg / totalContes) * 100)
              : 0,
          audioCoverageFr:
            totalContes > 0
              ? Math.round((contesWithAudioFr / totalContes) * 100)
              : 0,
        },
        items: totalItems,
        citations: totalCitations,
        kabary: totalKabary,
        poesies: totalPoesies,
      },
      moderation: {
        pendingContributions,
        disputedContributions,
        pendingReports,
        flaggedContributions,
        totalUrgent:
          pendingContributions + pendingReports + disputedContributions,
      },
      activity: {
        ugcQuizSets,
      },
      system: {
        databaseHealthy: Boolean(dbCheck),
        lockedModules: lockedModulesCount,
        activeAnnouncements: activeAnnouncementsCount,
      },
    };
  }

  /**
   * GET /admin/audit-logs — Journal de traçabilité des opérations d'administration
   */
  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
    @Query('targetType') targetType?: string,
    @Query('userId') userId?: string,
  ) {
    return this.auditService.listLogs({
      page,
      limit,
      action,
      targetType,
      userId,
    });
  }
}
