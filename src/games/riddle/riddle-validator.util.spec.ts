import { describe, it, expect } from '@jest/globals';
import {
  normalizeRiddleText,
  stripMalagasyArticle,
  extractParenthesizedVariants,
  isAnswerMatching,
} from './riddle-validator.util.js';

describe('RiddleValidatorUtil', () => {
  describe('normalizeRiddleText', () => {
    it('gère les espaces superflus et la casse', () => {
      expect(normalizeRiddleText('   Fanjaitra   ')).toBe('fanjaitra');
      expect(normalizeRiddleText('VILANY   BE')).toBe('vilany be');
    });

    it('standardise les apostrophes typographiques malgaches', () => {
      expect(normalizeRiddleText("an'ala")).toBe("an'ala");
      expect(normalizeRiddleText("an’ala")).toBe("an'ala");
      expect(normalizeRiddleText("an‘ala")).toBe("an'ala");
    });

    it('supprime la ponctuation finale de saisie', () => {
      expect(normalizeRiddleText('Voatavo.')).toBe('voatavo');
      expect(normalizeRiddleText('Voatavo! ')).toBe('voatavo');
      expect(normalizeRiddleText('Voatavo?')).toBe('voatavo');
    });

    it('gère les valeurs nulles ou vides', () => {
      expect(normalizeRiddleText('')).toBe('');
      expect(normalizeRiddleText(null)).toBe('');
      expect(normalizeRiddleText(undefined)).toBe('');
    });
  });

  describe('stripMalagasyArticle', () => {
    it('retire les articles malgaches définis', () => {
      expect(stripMalagasyArticle('ny vilany')).toBe('vilany');
      expect(stripMalagasyArticle('ilay fanjaitra')).toBe('fanjaitra');
      expect(stripMalagasyArticle('ity atody')).toBe('atody');
    });

    it('ne modifie pas les mots débutant par des lettres similaires sans espace', () => {
      expect(stripMalagasyArticle('nyan')).toBe('nyan');
      expect(stripMalagasyArticle('vilany')).toBe('vilany');
    });
  });

  describe('extractParenthesizedVariants', () => {
    it('extrait les variantes avec et sans parenthèses', () => {
      const variants = extractParenthesizedVariants('varika (babakoto)');
      expect(variants).toContain('varika (babakoto)');
      expect(variants).toContain('varika');
      expect(variants).toContain('babakoto');
      expect(variants).toContain('varika babakoto');
    });
  });

  describe('isAnswerMatching', () => {
    it('valide une correspondance exacte', () => {
      expect(isAnswerMatching('Fanjaitra', 'Fanjaitra')).toBe(true);
    });

    it('valide sans tenir compte de la casse', () => {
      expect(isAnswerMatching('fanjaitra', 'Fanjaitra')).toBe(true);
      expect(isAnswerMatching('FANJAITRA', 'Fanjaitra')).toBe(true);
    });

    it('valide avec article malgache même si non présent dans la référence', () => {
      expect(isAnswerMatching('ny vilany', 'Vilany')).toBe(true);
      expect(isAnswerMatching('ilay vilany', 'Vilany')).toBe(true);
      expect(isAnswerMatching('vilany', 'Ny vilany')).toBe(true);
    });

    it('valide les apostrophes courbes et typographiques', () => {
      expect(isAnswerMatching("zava-man'aina", "zava-man’aina")).toBe(true);
    });

    it('valide les variantes entre parenthèses', () => {
      expect(isAnswerMatching('Varika', 'Varika (Babakoto)')).toBe(true);
      expect(isAnswerMatching('Babakoto', 'Varika (Babakoto)')).toBe(true);
      expect(isAnswerMatching('ny babakoto', 'Varika (Babakoto)')).toBe(true);
    });

    it('valide les réponses alternatives (acceptedAnswers)', () => {
      expect(isAnswerMatching('akondro', 'Hazo fihinam-boa', ['akondro', 'voankazo'])).toBe(true);
    });

    it('rejette les réponses incorrectes ou vides', () => {
      expect(isAnswerMatching('omby', 'Fanjaitra')).toBe(false);
      expect(isAnswerMatching('', 'Fanjaitra')).toBe(false);
      expect(isAnswerMatching(null, 'Fanjaitra')).toBe(false);
    });
  });
});
