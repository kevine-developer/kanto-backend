import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';

export interface CreateAuditLogParams {
  userId: string;
  userName?: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel?: string;
  reason?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

@Injectable()
export class AdminAuditService {
  private readonly logger = new Logger(AdminAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enregistre une action administrative dans le journal d'audit immuable.
   */
  async logAction(params: CreateAuditLogParams) {
    try {
      const log = await this.prisma.adminAuditLog.create({
        data: {
          userId: params.userId,
          userName: params.userName || null,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId,
          targetLabel: params.targetLabel || null,
          reason: params.reason || null,
          details: (params.details as any) || null,
          ipAddress: params.ipAddress || null,
        },
      });

      this.logger.log(
        `🛡️ [AuditLog] ${params.action} sur ${params.targetType}:${params.targetId} par ${params.userName || params.userId}`,
      );

      return log;
    } catch (err) {
      this.logger.error('Échec enregistrement du journal d’audit:', err);
      return null;
    }
  }

  /**
   * Récupère les entrées du journal d'audit avec pagination et filtres.
   */
  async listLogs(params: {
    page?: string;
    limit?: string;
    action?: string;
    targetType?: string;
    userId?: string;
  }) {
    const { page, limit, skip } = calculatePagination({
      page: params.page,
      limit: params.limit,
    });

    const where: any = {};
    if (params.action) {
      where.action = params.action;
    }
    if (params.targetType) {
      where.targetType = params.targetType;
    }
    if (params.userId) {
      where.userId = params.userId;
    }

    const [total, logs] = await Promise.all([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return formatPaginatedResponse(logs, total, page, limit);
  }
}
