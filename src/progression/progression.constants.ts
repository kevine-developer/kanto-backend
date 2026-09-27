/**
 * Constantes et règles économiques régissant les Vola (pièces de monnaie Kanto).
 * Conçu pour préserver la rareté culturelle et permettre le contrôle administratif.
 */

export interface CoinsEconomyConfig {
  /** Distribution des pièces active ou en pause administrative */
  enabled: boolean;
  /** Multiplicateur appliqué aux gains de montée de niveau */
  levelUpCoinsMultiplier: number;
  /** Bonus de pièces pour 7 jours consécutifs */
  streakBonus7: number;
  /** Bonus de pièces pour 14 jours consécutifs */
  streakBonus14: number;
  /** Bonus de pièces pour 30 jours consécutifs */
  streakBonus30: number;
  /** Taux de conversion XP -> Vola (ex: 1000 XP = 1 Vola) */
  xpPerCoinRatio: number;
}

export const DEFAULT_COINS_ECONOMY_CONFIG: CoinsEconomyConfig = {
  enabled: true,
  levelUpCoinsMultiplier: 1,
  streakBonus7: 1,
  streakBonus14: 2,
  streakBonus30: 5,
  xpPerCoinRatio: 1000,
};

export const REDIS_COINS_CONFIG_KEY = 'system:coins:config';
