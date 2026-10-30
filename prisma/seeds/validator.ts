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
      issues.push({ itemIndex: index, message: "L'élément doit être un objet JSON." });
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
    if (row.category && !validCategories.includes(String(row.category).toUpperCase())) {
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
      issues.push({ itemIndex: index, message: "L'élément citation doit être un objet JSON." });
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
      issues.push({ itemIndex: index, message: "L'élément raki-teny doit être un objet JSON." });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : typeof row.slug === 'string' ? row.slug : undefined;

    if (!row.word || typeof row.word !== 'string' || !row.word.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'word', message: 'Champ "word" manquant.' });
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
      issues.push({ itemIndex: index, identifier: id, field: 'exampleFr', message: "Traduction d'exemple manquante." });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Valide un lot de questions de Quiz (CivicQuizQuestion)
 */
export function validateQuizBatch(items: unknown[]): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu du quiz doit être un tableau JSON.' }],
    };
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: "L'élément quiz doit être un objet JSON." });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : undefined;

    const prompt = (row.promptFr || row.prompt || row.promptMg) as string | undefined;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'prompt', message: 'Question/prompt manquant.' });
    }

    const choices = (row.optionsFr || row.choices || row.optionsMg) as unknown[];
    if (!Array.isArray(choices) || choices.length < 2) {
      issues.push({ itemIndex: index, identifier: id, field: 'choices', message: 'La question doit comporter au moins 2 choix de réponse.' });
    }

    const answerIndex = typeof row.correctAnswerIndex === 'number' ? row.correctAnswerIndex : typeof row.answerIndex === 'number' ? row.answerIndex : undefined;
    if (answerIndex === undefined || answerIndex < 0 || (Array.isArray(choices) && answerIndex >= choices.length)) {
      issues.push({ itemIndex: index, identifier: id, field: 'answerIndex', message: "L'indice de réponse correcte est invalide." });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Valide un lot de questions Vrai ou Faux (TrueFalseQuestion)
 * Accepte soit un tableau direct, soit un objet contenant une clé questions: []
 */
export function validateTrueFalseBatch(data: unknown): ValidationReport {
  const issues: ValidationIssue[] = [];

  const items = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as any).questions)
      ? (data as any).questions
      : null;

  if (!items) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu Vrai/Faux doit être un tableau JSON ou un objet avec la clé "questions".' }],
    };
  }

  items.forEach((item: unknown, index: number) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: "L'élément Vrai/Faux doit être un objet JSON." });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : typeof row.questionId === 'string' ? row.questionId : undefined;

    const question = (row.promptMg || row.questionMg || row.promptFr || row.questionFr || row.questionText) as string | undefined;
    if (!question || typeof question !== 'string' || !question.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'question', message: 'Affirmation / question manquante.' });
    }

    if (typeof row.isTrue !== 'boolean') {
      issues.push({ itemIndex: index, identifier: id, field: 'isTrue', message: 'Le champ "isTrue" (booléen) est obligatoire.' });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Valide un lot de devinettes (RiddleQuestion)
 */
export function validateRiddlesBatch(items: unknown[]): ValidationReport {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu des devinettes doit être un tableau.' }],
    };
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: "L'élément devinette doit être un objet." });
      return;
    }

    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : undefined;

    if (!row.riddleMg || typeof row.riddleMg !== 'string' || !row.riddleMg.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'riddleMg', message: 'Énoncé malgache (riddleMg) manquant.' });
    }

    if (!row.correctAnswer || typeof row.correctAnswer !== 'string' || !row.correctAnswer.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'correctAnswer', message: 'Bonne réponse (correctAnswer) manquante.' });
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}
