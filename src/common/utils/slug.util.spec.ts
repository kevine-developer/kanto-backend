import { slugify } from './slug.util.js';

describe('slugify', () => {
  // ─────────────────────────────────────────────────────────────────────────
  // Cas nominaux
  // ─────────────────────────────────────────────────────────────────────────

  it('should convert simple string to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('mon titre de test')).toBe('mon-titre-de-test');
  });

  it('should convert uppercase to lowercase', () => {
    expect(slugify('ANTANANARIVO')).toBe('antananarivo');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Accents et diacritiques
  // ─────────────────────────────────────────────────────────────────────────

  it('should remove French accents', () => {
    expect(slugify('Île-de-France')).toBe('ile-de-france');
  });

  it('should remove cedilla', () => {
    expect(slugify('garçon')).toBe('garcon');
  });

  it('should remove all common French diacritics', () => {
    expect(slugify('àâäéèêëîïôöùûüÿç')).toBe('aaaeeeeiioouuuyc');
  });

  it('should handle Malagasy-style strings', () => {
    expect(slugify('Vintana sy fandavana')).toBe('vintana-sy-fandavana');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Caractères spéciaux
  // ─────────────────────────────────────────────────────────────────────────

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world');
  });

  it('should remove punctuation', () => {
    expect(slugify('test, avec; des: points.')).toBe('test-avec-des-points');
  });

  it('should remove parentheses and brackets', () => {
    expect(slugify('test (1) [2] {3}')).toBe('test-1-2-3');
  });

  it('should remove quotes', () => {
    expect(slugify("l'exemple")).toBe('lexemple');
  });

  it('should remove ampersand and percent', () => {
    expect(slugify('Tom & Jerry 100%')).toBe('tom-jerry-100');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Espaces multiples et tirets consécutifs
  // ─────────────────────────────────────────────────────────────────────────

  it('should collapse multiple spaces into single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('should collapse consecutive hyphens', () => {
    expect(slugify('test--slug')).toBe('test-slug');
  });

  it('should trim leading and trailing spaces', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Edge cases
  // ─────────────────────────────────────────────────────────────────────────

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle string with only special characters', () => {
    const result = slugify('!@#$%^&*()');
    // Tous les caractères sont supprimés, résultat vide ou tirets collapsés
    expect(result).toBe('');
  });

  it('should handle numeric strings', () => {
    expect(slugify('12345')).toBe('12345');
  });

  it('should handle mixed numbers and text', () => {
    expect(slugify('Version 2.0 Beta')).toBe('version-20-beta');
  });

  it('should handle single character', () => {
    expect(slugify('A')).toBe('a');
  });

  it('should handle very long string without throwing', () => {
    const longString = 'a'.repeat(1000);
    const result = slugify(longString);
    expect(result).toBe('a'.repeat(1000));
    expect(typeof result).toBe('string');
  });

  it('should call toString() on non-string input gracefully', () => {
    // La fonction cast avec .toString()
    expect(() => slugify(123 as any)).not.toThrow();
    expect(slugify(123 as any)).toBe('123');
  });
});
