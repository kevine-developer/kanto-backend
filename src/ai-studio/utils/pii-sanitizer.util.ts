/**
 * Utilitaires de protection des données personnelles (PII Scrubbing)
 * et de défense contre les injections de prompt (Prompt Injection Guard).
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4}/g;
const SECRET_TOKEN_REGEX =
  /\b(?:AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z]{20,}|re_[0-9A-Za-z_]{16,}|eyJ[0-9A-Za-z_-]+\.[0-9A-Za-z_-]+\.[0-9A-Za-z_-]+)\b/g;

/**
 * Masque toute donnée personnelle (e-mail, téléphone long, secret/JWT)
 * avant transmission à un modèle d'IA externe.
 */
export function sanitizeTextForLlm(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    .replace(SECRET_TOKEN_REGEX, '[SECRET_MASQUÉ]')
    .replace(EMAIL_REGEX, '[EMAIL_MASQUÉ]');

  // Masquer uniquement les séquences numériques de 8+ chiffres ressemblant à un téléphone
  sanitized = sanitized.replace(PHONE_REGEX, (match) => {
    const digitsOnly = match.replace(/\D/g, '');
    return digitsOnly.length >= 8 ? '[TÉLÉPHONE_MASQUÉ]' : match;
  });

  return sanitized.trim();
}

/**
 * Encapsule des données potentiellement non fiables (avis utilisateurs, extraits RAG)
 * dans des balises strictes pour empêcher toute exécution d'instructions injectées.
 */
export function wrapUntrustedContext(sourceLabel: string, payload: string): string {
  const safeLabel = sourceLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safePayload = sanitizeTextForLlm(payload)
    .replace(/<\/?untrusted_data[^>]*>/gi, '[balise_neutralisée]')
    .replace(/<\/?system[^>]*>/gi, '[balise_neutralisée]');

  return `<untrusted_data source="${safeLabel}">\n${safePayload}\n</untrusted_data>`;
}
