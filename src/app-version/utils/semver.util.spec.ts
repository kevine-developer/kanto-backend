import { compareSemVer, parseSemVer, isGreaterThan, isLessThan } from './semver.util.js';

describe('semver.util', () => {
  describe('parseSemVer', () => {
    it('devrait parser correctement une version standard', () => {
      const parsed = parseSemVer('1.2.3');
      expect(parsed).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: null,
        raw: '1.2.3',
      });
    });

    it('devrait parser avec préfixe "v"', () => {
      const parsed = parseSemVer('v0.0.19');
      expect(parsed).toEqual({
        major: 0,
        minor: 0,
        patch: 19,
        prerelease: null,
        raw: '0.0.19',
      });
    });

    it('devrait parser les versions courtes comme 1.0', () => {
      const parsed = parseSemVer('1.0');
      expect(parsed).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: null,
        raw: '1.0',
      });
    });

    it('devrait parser les versions avec pré-release', () => {
      const parsed = parseSemVer('1.0.0-beta.1');
      expect(parsed?.prerelease).toBe('beta.1');
    });

    it('devrait retourner null pour des chaînes invalides', () => {
      expect(parseSemVer('')).toBeNull();
      expect(parseSemVer('abc')).toBeNull();
      expect(parseSemVer(null as any)).toBeNull();
    });
  });

  describe('compareSemVer', () => {
    it('devrait détecter une version majeure supérieure', () => {
      expect(compareSemVer('1.0.0', '0.9.9')).toBe(1);
      expect(compareSemVer('0.9.9', '1.0.0')).toBe(-1);
    });

    it('devrait détecter une version mineure supérieure', () => {
      expect(compareSemVer('0.1.0', '0.0.19')).toBe(1);
      expect(compareSemVer('0.0.19', '0.1.0')).toBe(-1);
    });

    it('devrait détecter un patch supérieur', () => {
      expect(compareSemVer('0.0.20', '0.0.19')).toBe(1);
      expect(compareSemVer('0.0.19', '0.0.20')).toBe(-1);
    });

    it('devrait retourner 0 pour deux versions identiques', () => {
      expect(compareSemVer('0.0.19', '0.0.19')).toBe(0);
      expect(compareSemVer('v0.0.19', '0.0.19')).toBe(0);
      expect(compareSemVer('1.0.0', '1.0.0')).toBe(0);
    });

    it('devrait considérer une version stable supérieure à une pre-release', () => {
      expect(compareSemVer('1.0.0', '1.0.0-beta.1')).toBe(1);
      expect(compareSemVer('1.0.0-beta.1', '1.0.0')).toBe(-1);
    });
  });

  describe('helpers isGreaterThan / isLessThan', () => {
    it('isGreaterThan devrait retourner vrai si v1 > v2', () => {
      expect(isGreaterThan('0.0.20', '0.0.19')).toBe(true);
      expect(isGreaterThan('0.0.19', '0.0.19')).toBe(false);
      expect(isGreaterThan('0.0.18', '0.0.19')).toBe(false);
    });

    it('isLessThan devrait retourner vrai si v1 < v2', () => {
      expect(isLessThan('0.0.18', '0.0.19')).toBe(true);
      expect(isLessThan('0.0.19', '0.0.19')).toBe(false);
      expect(isLessThan('0.0.20', '0.0.19')).toBe(false);
    });
  });
});

