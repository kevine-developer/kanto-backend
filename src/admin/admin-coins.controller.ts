import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { AuthGuard, Roles } from '../auth/index.js';
import {
  CoinsEconomyConfig,
  DEFAULT_COINS_ECONOMY_CONFIG,
  REDIS_COINS_CONFIG_KEY,
} from '../progression/progression.constants.js';

class UpdateCoinsConfigDto {
  enabled?: boolean;
  levelUpCoinsMultiplier?: number;
  streakBonus7?: number;
  streakBonus14?: number;
  streakBonus30?: number;
  xpPerCoinRatio?: number;
}

class AdjustUserCoinsDto {
  userId!: string;
  amount!: number;
  reason!: string;
}

@Controller('admin/coins')
@UseGuards(AuthGuard)
@Roles(['ADMIN', 'admin'])
export class AdminCoinsController {
  private readonly logger = new Logger(AdminCoinsController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Vue d'ensemble économique des Vola (pièces de monnaie Kanto) pour l'administration.
   */
  @Get('economy')
  async getCoinsEconomyOverview() {
    // 1. Configuration actuelle
    let currentConfig: CoinsEconomyConfig = DEFAULT_COINS_ECONOMY_CONFIG;
    try {
      const cached = await this.redisService.get<CoinsEconomyConfig>(
        REDIS_COINS_CONFIG_KEY,
      );
      if (cached && typeof cached === 'object') {
        currentConfig = { ...DEFAULT_COINS_ECONOMY_CONFIG, ...cached };
      }
    } catch (err) {
      this.logger.warn(`Erreur lors de la lecture du cache Redis : ${err}`);
    }

    // 2. Statistiques en base de données
    const [aggregate, usersCountWithCoins, topHolders] = await Promise.all([
      this.prisma.userProgress.aggregate({
        _sum: { coins: true },
        _avg: { coins: true },
        _max: { coins: true },
      }),
      this.prisma.userProgress.count({
        where: { coins: { gt: 0 } },
      }),
      this.prisma.userProgress.findMany({
        where: { coins: { gt: 0 } },
        orderBy: { coins: 'desc' },
        take: 10,
        select: {
          userId: true,
          coins: true,
          level: true,
          totalXp: true,
          streakDays: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      config: currentConfig,
      stats: {
        totalCoinsInCirculation: aggregate._sum.coins || 0,
        averageCoinsPerActiveUser: Math.round(aggregate._avg.coins || 0),
        maxCoinsHeldBySingleUser: aggregate._max.coins || 0,
        usersCountWithCoins,
      },
      topHolders: topHolders.map((entry) => ({
        userId: entry.userId,
        userName: entry.user?.name || 'Anonyme',
        userEmail: entry.user?.email || null,
        userImage: entry.user?.image || null,
        level: entry.level,
        totalXp: entry.totalXp,
        streakDays: entry.streakDays,
        coins: entry.coins,
      })),
    };
  }

  /**
   * Met à jour les règles économiques d'attribution des pièces en temps réel.
   */
  @Patch('config')
  async updateCoinsConfig(@Body() body: UpdateCoinsConfigDto) {
    let currentConfig: CoinsEconomyConfig = DEFAULT_COINS_ECONOMY_CONFIG;
    try {
      const cached = await this.redisService.get<CoinsEconomyConfig>(
        REDIS_COINS_CONFIG_KEY,
      );
      if (cached && typeof cached === 'object') {
        currentConfig = { ...DEFAULT_COINS_ECONOMY_CONFIG, ...cached };
      }
    } catch {
      // Ignorer
    }

    const updatedConfig: CoinsEconomyConfig = {
      enabled:
        typeof body.enabled === 'boolean'
          ? body.enabled
          : currentConfig.enabled,
      levelUpCoinsMultiplier:
        typeof body.levelUpCoinsMultiplier === 'number' &&
        body.levelUpCoinsMultiplier >= 0
          ? body.levelUpCoinsMultiplier
          : currentConfig.levelUpCoinsMultiplier,
      streakBonus7:
        typeof body.streakBonus7 === 'number' && body.streakBonus7 >= 0
          ? body.streakBonus7
          : currentConfig.streakBonus7,
      streakBonus14:
        typeof body.streakBonus14 === 'number' && body.streakBonus14 >= 0
          ? body.streakBonus14
          : currentConfig.streakBonus14,
      streakBonus30:
        typeof body.streakBonus30 === 'number' && body.streakBonus30 >= 0
          ? body.streakBonus30
          : currentConfig.streakBonus30,
      xpPerCoinRatio:
        typeof body.xpPerCoinRatio === 'number' && body.xpPerCoinRatio >= 100
          ? body.xpPerCoinRatio
          : currentConfig.xpPerCoinRatio,
    };

    await this.redisService.set(REDIS_COINS_CONFIG_KEY, updatedConfig);
    this.logger.log(
      `⚙️ [Admin] Configuration économique des pièces mise à jour : ${JSON.stringify(updatedConfig)}`,
    );

    return {
      success: true,
      message: 'Configuration économique des Vola mise à jour avec succès.',
      config: updatedConfig,
    };
  }

  /**
   * Ajustement manuel de pièces pour un compte joueur (crédit ou débit contrôlé).
   */
  @Post('adjust-user')
  async adjustUserCoins(@Body() body: AdjustUserCoinsDto) {
    const { userId, amount, reason } = body;

    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('userId requis');
    }
    if (
      typeof amount !== 'number' ||
      amount === 0 ||
      !Number.isInteger(amount)
    ) {
      throw new BadRequestException(
        'Le montant doit être un entier non nul (positif pour crédit, négatif pour débit).',
      );
    }
    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      throw new BadRequestException(
        'Un motif explicite est requis (au moins 3 caractères).',
      );
    }

    const existingProgress = await this.prisma.userProgress.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!existingProgress) {
      throw new NotFoundException(
        'Fiche de progression utilisateur introuvable.',
      );
    }

    const currentCoins = existingProgress.coins || 0;
    const newCoins = Math.max(0, currentCoins + amount);

    const updated = await this.prisma.userProgress.update({
      where: { userId },
      data: { coins: newCoins },
    });

    this.logger.warn(
      `⚖️ [Admin Coins Audit] Solde modifié pour ${existingProgress.user?.name || userId} (${existingProgress.user?.email}) : ` +
        `${currentCoins} -> ${newCoins} (${amount > 0 ? '+' : ''}${amount} Vola). Motif : ${reason}`,
    );

    return {
      success: true,
      message: `Solde de pièces ajusté avec succès : ${newCoins} Vola.`,
      userId,
      previousCoins: currentCoins,
      newCoins: updated.coins,
      difference: amount,
      reason,
    };
  }
}
