import { ValidationIssue, ValidationReport } from './types.js';

/**
 * Valide un lot de proverbes/expressions/dictons (MalagasyItem)
 */
export function validateMalagasyItemsBatch(items: unknown[]): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu doit être un tableau JSON valide.' }],
    };
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: 'L\'élément doit être un objet JSON.' });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : undefined;

    if (!row.malagasy || typeof row.malagasy !== 'string' || !row.malagasy.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'malagasy', message: 'Champ "malagasy" manquant ou vide.' });
    }

    if (!row.french || typeof row.french !== 'string' || !row.french.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'french', message: 'Champ "french" manquant ou vide.' });
    }

    if (!row.meaning || typeof row.meaning !== 'string' || !row.meaning.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'meaning', message: 'Champ "meaning" manquant ou vide.' });
    }

    const validCategories = ['PROVERBE', 'EXPRESSION', 'DICTON', 'proverbe', 'expression', 'dicton'];
    if (row.category && !validCategories.includes(String(row.category))) {
      issues.push({ itemIndex: index, identifier: id, field: 'category', message: `Catégorie inconnue : "${row.category}".` });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Valide un lot de citations
 */
export function validateCitationsBatch(items: unknown[]): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu des citations doit être un tableau JSON.' }],
    };
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: 'L\'élément citation doit être un objet JSON.' });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : undefined;

    if (!row.citationMg || typeof row.citationMg !== 'string' || !row.citationMg.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'citationMg', message: 'Champ "citationMg" manquant.' });
    }

    if (!row.citationFr || typeof row.citationFr !== 'string' || !row.citationFr.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'citationFr', message: 'Champ "citationFr" manquant.' });
    }

    if (!row.source && !row.sourceName) {
      issues.push({ itemIndex: index, identifier: id, field: 'source', message: 'Auteur/Source manquant(e).' });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Valide un lot de mots rares (RakiTenyWord)
 */
export function validateRakiTenyBatch(items: unknown[]): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu de raki-teny doit être un tableau JSON.' }],
    };
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: 'L\'élément raki-teny doit être un objet JSON.' });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : typeof row.slug === 'string' ? row.slug : undefined;

    if (!row.word || typeof row.word !== 'string' || !row.word.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'word', message: 'Champ "word" manquant.' });
    }

    if (!row.slug || typeof row.slug !== 'string' || !row.slug.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'slug', message: 'Champ "slug" manquant.' });
    }

    if (!row.meaningMg || typeof row.meaningMg !== 'string' || !row.meaningMg.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'meaningMg', message: 'Définition en malgache manquante.' });
    }

    if (!row.meaningFr || typeof row.meaningFr !== 'string' || !row.meaningFr.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'meaningFr', message: 'Définition en français manquante.' });
    }

    if (!row.exampleMg || typeof row.exampleMg !== 'string' || !row.exampleMg.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'exampleMg', message: 'Exemple malgache manquant.' });
    }

    if (!row.exampleFr || typeof row.exampleFr !== 'string' || !row.exampleFr.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'exampleFr', message: 'Traduction d\'exemple manquante.' });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}
