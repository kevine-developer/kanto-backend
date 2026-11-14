/**
 * Constantes et règles de configuration du cycle de vie des salons multijoueurs (Kanto MG).
 * Centralise les durées de vie (TTL), limites d'accès, et configurations de sécurité.
 */

export const MULTIPLAYER_CONFIG = {
  /**
   * Durée de vie par défaut d'un salon multijoueur en attente de démarrage (en secondes).
   * Par défaut : 15 minutes (900s). Configurable via la variable d'environnement MULTIPLAYER_LOBBY_TTL_SECONDS.
   */
  get DEFAULT_LOBBY_TTL_SECONDS(): number {
    const envVal = Number(process.env.MULTIPLAYER_LOBBY_TTL_SECONDS);
    return Number.isFinite(envVal) && envVal > 0 ? envVal : 15 * 60;
  },

  /**
   * Durée de vie spécifique pour un salon de défi direct 1v1 en attente (en secondes).
   * Par défaut : 10 minutes (600s). Configurable via DUEL_LOBBY_TTL_SECONDS.
   */
  get DUEL_1V1_LOBBY_TTL_SECONDS(): number {
    const envVal = Number(process.env.DUEL_LOBBY_TTL_SECONDS);
    return Number.isFinite(envVal) && envVal > 0 ? envVal : 10 * 60;
  },

  /**
   * Nombre maximum strict de joueurs dans un salon multijoueur.
   */
  MAX_PLAYERS_MULTIPLAYER: 5,

  /**
   * Nombre maximum de joueurs dans un défi direct 1v1.
   */
  MAX_PLAYERS_DUEL: 2,

  /**
   * Nombre de questions par défaut pour les parties multijoueurs et défis.
   */
  DEFAULT_QUESTIONS_COUNT: 10,

  /**
   * Nombre minimum de vrais joueurs requis pour démarrer la partie.
   */
  MIN_PLAYERS_TO_START: 2,

  /**
   * Durée du décompte synchronisé 3-2-1 avant le premier round (en secondes).
   */
  START_COUNTDOWN_SECONDS: 3,

  /**
   * Période de grâce de déconnexion temporaire (en secondes).
   */
  DISCONNECT_GRACE_PERIOD_SECONDS: 8,

  /**
   * Garde-fou Anti-Brute-Force sur les codes de salon : max tentatives erronées.
   */
  MAX_JOIN_ATTEMPTS: 5,
  JOIN_ATTEMPTS_WINDOW_SECONDS: 60,

  /**
   * Garde-fou Anti-Spam création : nombre max de salons créés par utilisateur par heure.
   */
  MAX_ROOMS_PER_USER_PER_HOUR: 10,
  ROOM_CREATION_WINDOW_SECONDS: 3600,

  /**
   * Verrou distribué Redis pour le scheduler d'expiration automatique.
   */
  EXPIRATION_LOCK_KEY: 'scheduler_lock:multiplayer_expiration',
  EXPIRATION_LOCK_TTL_SECONDS: 30,
} as const;

/**
 * Calcule la durée de vie autorisée (en secondes) pour un salon selon son mode.
 */
export function getLobbyTtlSeconds(is1v1Duel: boolean): number {
  return is1v1Duel
    ? MULTIPLAYER_CONFIG.DUEL_1V1_LOBBY_TTL_SECONDS
    : MULTIPLAYER_CONFIG.DEFAULT_LOBBY_TTL_SECONDS;
}

/**
 * Calcule la date limite d'expiration d'un nouveau salon.
 */
export function calculateLobbyExpiresAt(
  is1v1Duel: boolean,
  from: Date = new Date(),
): Date {
  const ttlSec = getLobbyTtlSeconds(is1v1Duel);
  return new Date(from.getTime() + ttlSec * 1000);
}
