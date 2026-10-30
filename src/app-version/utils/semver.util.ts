/**
 * Utilitaire robuste de comparaison sémantique de versions (SemVer 2.0).
 * Gère les versions 'x.y.z', les préfixes 'v', les métadonnées de build et les pré-releases.
 */

export interface ParsedSemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  raw: string;
}

/**
 * Nettoie et extrait les composantes sémantiques d'une chaîne de version.
 */
export function parseSemVer(version: string | null | undefined): ParsedSemVer | null {
  if (!version || typeof version !== 'string') return null;

  const trimmed = version.trim().replace(/^v/i, '');
  // Format attendu : MAJOR.MINOR.PATCH(-PRERELEASE)?(+BUILD)?
  const semverRegex = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
  const match = trimmed.match(semverRegex);

  if (!match) return null;

  return {
    major: parseInt(match[1] || '0', 10),
    minor: parseInt(match[2] || '0', 10),
    patch: parseInt(match[3] || '0', 10),
    prerelease: match[4] || null,
    raw: trimmed,
  };
}

/**
 * Compare deux chaînes de versions sémantiques.
 * Retourne :
 *  1 si v1 > v2
 * -1 si v1 < v2
 *  0 si v1 === v2
 */
export function compareSemVer(v1: string | null | undefined, v2: string | null | undefined): number {
  const p1 = parseSemVer(v1);
  const p2 = parseSemVer(v2);

  if (!p1 && !p2) return 0;
  if (!p1) return -1;
  if (!p2) return 1;

  if (p1.major !== p2.major) {
    return p1.major > p2.major ? 1 : -1;
  }
  if (p1.minor !== p2.minor) {
    return p1.minor > p2.minor ? 1 : -1;
  }
  if (p1.patch !== p2.patch) {
    return p1.patch > p2.patch ? 1 : -1;
  }

  // Si l'un a un prerelease et pas l'autre : la version stable est supérieure
  if (p1.prerelease && !p2.prerelease) return -1;
  if (!p1.prerelease && p2.prerelease) return 1;
  if (p1.prerelease && p2.prerelease) {
    return p1.prerelease.localeCompare(p2.prerelease);
  }

  return 0;
}

export function isGreaterThan(v1: string, v2: string): boolean {
  return compareSemVer(v1, v2) > 0;
}

export function isLessThan(v1: string, v2: string): boolean {
  return compareSemVer(v1, v2) < 0;
}

