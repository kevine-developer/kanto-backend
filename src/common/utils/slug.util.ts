/**
 * Transforme une chaîne de texte en slug URL sécurisé et normalisé.
 * Supprime les diacritiques, accents, caractères spéciaux et espaces consécutifs.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
