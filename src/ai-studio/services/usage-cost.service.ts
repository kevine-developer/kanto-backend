import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  AI_PROVIDER_ADAPTER,
  type AiProviderAdapter,
} from '../providers/ai-provider.interface.js';
import { Inject } from '@nestjs/common';

export interface UsageRecordInput {
  adminUserId: string;
  conversationId?: string;
  provider: string;
  model: string;
  operation: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  status: 'SUCCESS' | 'ERROR' | 'ABORTED' | 'RATE_LIMITED';
  errorCode?: string;
}

@Injectable()
export class UsageAndCostService {
  private readonly logger = new Logger(UsageAndCostService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER_ADAPTER)
    private readonly aiProvider: AiProviderAdapter,
  ) {}

  getDailyLimitPerAdmin(): number {
    const parsed = Number(process.env.AI_DAILY_REQUEST_LIMIT_PER_ADMIN);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 120;
  }

  getMonthlyBudgetUsd(): number {
    const parsed = Number(process.env.AI_MONTHLY_BUDGET_USD);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
  }

  /**
   * Vérifie les garde-fous de quota journalier par administrateur et de budget mensuel global.
   */
  async assertWithinQuota(adminUserId: string): Promise<{
    dailyUsed: number;
    dailyLimit: number;
    monthlyCostUsd: number;
    monthlyBudgetUsd: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [dailyUsed, monthlyAggregate] = await Promise.all([
      this.prisma.aiUsageLog.count({
        where: {
          adminUserId,
          status: 'SUCCESS',
          createdAt: { gte: startOfDay },
        },
      }),
      this.prisma.aiUsageLog.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { estimatedCostUsd: true },
      }),
    ]);

    const dailyLimit = this.getDailyLimitPerAdmin();
    const monthlyBudgetUsd = this.getMonthlyBudgetUsd();
    const monthlyCostUsd = Number(
      (monthlyAggregate._sum.estimatedCostUsd ?? 0).toFixed(4),
    );

    if (dailyUsed >= dailyLimit) {
      throw new Error(
        `Quota journalier Kanto AI atteint (${dailyUsed}/${dailyLimit} requêtes aujourd'hui).`,
      );
    }

    if (monthlyCostUsd >= monthlyBudgetUsd) {
      throw new Error(
        `Plafond budgétaire mensuel Kanto AI atteint (${monthlyCostUsd.toFixed(2)} $ / ${monthlyBudgetUsd.toFixed(2)} $).`,
      );
    }

    return {
      dailyUsed,
      dailyLimit,
      monthlyCostUsd,
      monthlyBudgetUsd,
    };
  }

  async recordUsage(input: UsageRecordInput) {
    try {
      return await this.prisma.aiUsageLog.create({
        data: {
          adminUserId: input.adminUserId,
          conversationId: input.conversationId ?? null,
          provider: input.provider,
          model: input.model,
          operation: input.operation,
          inputTokens: Math.max(0, input.inputTokens),
          outputTokens: Math.max(0, input.outputTokens),
          estimatedCostUsd: Math.max(0, input.estimatedCostUsd),
          latencyMs: Math.max(0, input.latencyMs),
          status: input.status,
          errorCode: input.errorCode ?? null,
        },
      });
    } catch (err) {
      this.logger.warn(
        `Impossible d'enregistrer le log d'usage Kanto AI: ${err instanceof Error ? err.message : String(err)}`,
      );
      return null;
    }
  }

  async getUsageSummary(adminUserId: string, days = 30) {
    const safeDays = Math.min(Math.max(days, 1), 90);
    const now = new Date();
    const since = new Date(now.getTime() - safeDays * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [totals, todayCount, byModel, recentLogs] = await Promise.all([
      this.prisma.aiUsageLog.aggregate({
        where: { createdAt: { gte: since } },
        _count: { id: true },
        _sum: {
          inputTokens: true,
          outputTokens: true,
          estimatedCostUsd: true,
        },
      }),
      this.prisma.aiUsageLog.count({
        where: {
          adminUserId,
          status: 'SUCCESS',
          createdAt: { gte: startOfDay },
        },
      }),
      this.prisma.aiUsageLog.groupBy({
        by: ['provider', 'model'],
        where: { createdAt: { gte: since } },
        _count: { id: true },
        _sum: {
          inputTokens: true,
          outputTokens: true,
          estimatedCostUsd: true,
        },
      }),
      this.prisma.aiUsageLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: {
          id: true,
          provider: true,
          model: true,
          operation: true,
          inputTokens: true,
          outputTokens: true,
          estimatedCostUsd: true,
          latencyMs: true,
          status: true,
          errorCode: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      periodDays: safeDays,
      provider: this.aiProvider.providerName,
      defaultModel: this.aiProvider.defaultModel,
      isConfigured: this.aiProvider.isConfigured(),
      supportedModels: this.aiProvider.listSupportedModels(),
      quota: {
        dailyUsed: todayCount,
        dailyLimit: this.getDailyLimitPerAdmin(),
        monthlyBudgetUsd: this.getMonthlyBudgetUsd(),
      },
      totals: {
        requests: totals._count.id,
        inputTokens: totals._sum.inputTokens ?? 0,
        outputTokens: totals._sum.outputTokens ?? 0,
        estimatedCostUsd: Number(
          (totals._sum.estimatedCostUsd ?? 0).toFixed(6),
        ),
      },
      byModel: byModel.map((row) => ({
        provider: row.provider,
        model: row.model,
        requests: row._count.id,
        inputTokens: row._sum.inputTokens ?? 0,
        outputTokens: row._sum.outputTokens ?? 0,
        estimatedCostUsd: Number(
          (row._sum.estimatedCostUsd ?? 0).toFixed(6),
        ),
      })),
      recentLogs,
    };
  }
}
