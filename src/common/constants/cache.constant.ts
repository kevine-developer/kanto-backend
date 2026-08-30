/**
 * Clés et préfixes de cache Redis standardisés pour l'application Kanto.
 */
export const CACHE_KEYS = {
  // Items (Proverbes, expressions, dictons)
  ITEMS_LIST_PATTERN: 'kanto:items:*',
  ITEMS_LIST_PREFIX: 'kanto:items:list:',
  ITEMS_DETAIL_PREFIX: 'kanto:items:detail:',

  // Proverbe du jour
  DAILY_PATTERN: 'kanto:daily:*',
  DAILY_CURRENT: 'kanto:daily:current',
  DAILY_ARCHIVE: 'kanto:daily:archive',

  // Citations
  CITATIONS_LIST_PATTERN: 'kanto:citations:*',
  CITATIONS_LIST_PREFIX: 'kanto:citations:list:',
  CITATIONS_DETAIL_PREFIX: 'kanto:citations:detail:',

  // Contes
  CONTES_LIST_PATTERN: 'kanto:contes:*',
  CONTES_LIST_PREFIX: 'kanto:contes:list:',
  CONTES_DETAIL_PREFIX: 'kanto:contes:detail:',

  // Kabary
  KABARY_LIST_PATTERN: 'kanto:kabary:*',
  KABARY_LIST_PREFIX: 'kanto:kabary:list:',
  KABARY_DETAIL_PREFIX: 'kanto:kabary:detail:',

  // Locks (Modules verrouillés)
  LOCKS_ALL: 'kanto:locks:all',
  LOCKS_PUBLIC: 'kanto:locks:public',
  LOCKS_DETAIL_PREFIX: 'kanto:locks:detail:',

  // Onboarding
  ONBOARDING_PUBLIC: 'kanto:onboarding:public',
  ONBOARDING_ALL: 'kanto:onboarding:all',

  // Notifications
  NOTIFICATIONS_PREFIX: 'kanto:notifications:',
} as const;

export const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 30, // 30 minutes
  LONG: 60 * 60 * 24, // 24 heures
} as const;
