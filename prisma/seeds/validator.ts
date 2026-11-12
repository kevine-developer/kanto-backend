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
export function validateRiddlesBatch(data: unknown): ValidationReport {
  const issues: ValidationIssue[] = [];

  const items = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as any).riddles)
      ? (data as any).riddles
      : null;

  if (!items) {
    return {
      isValid: false,
      issues: [{ itemIndex: -1, message: 'Le contenu des devinettes doit être un tableau JSON ou un objet avec la clé "riddles".' }],
    };
  }

  items.forEach((item: unknown, index: number) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: "L'élément devinette doit être un objet JSON." });
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

/**
 * Validation spécifique des 12 points de contrôle du jeu de données :
 * « Géographie et trésors naturels de Madagascar » (50 questions, 5 niveaux de 10)
 */
export function validateGeographyQuizBatch(payload: unknown): ValidationReport {
  const issues: ValidationIssue[] = [];

  const rawObj = payload as Record<string, unknown> | unknown[];
  const questions: unknown[] = Array.isArray(rawObj)
    ? rawObj
    : Array.isArray((rawObj as any)?.questions)
      ? (rawObj as any).questions
      : [];

  if (questions.length !== 50) {
    issues.push({
      itemIndex: -1,
      message: `Contrôle 1 échoué : Attendu exactement 50 questions, reçu ${questions.length}.`,
    });
  }

  const questionsPerLevel: Record<number, number> = {};
  const diffCounts: Record<string, number> = { EASY: 0, INTERMEDIATE: 0, DIFFICULT: 0 };
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();

  questions.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      issues.push({ itemIndex: index, message: 'La question doit être un objet JSON valide.' });
      return;
    }

    const q = item as Record<string, any>;
    const id = q.id || `index_${index}`;

    // Contrôle unicité ID
    if (seenIds.has(id)) {
      issues.push({ itemIndex: index, identifier: id, field: 'id', message: `ID en doublon détecté : ${id}` });
    }
    seenIds.add(id);

    // Contrôle question/prompt
    const prompt = q.question || q.prompt;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      issues.push({ itemIndex: index, identifier: id, field: 'question', message: 'Énoncé de la question manquant.' });
    } else {
      const normPrompt = prompt.trim().toLowerCase();
      if (seenPrompts.has(normPrompt)) {
        issues.push({ itemIndex: index, identifier: id, field: 'question', message: `Question en doublon textuel : ${prompt}` });
      }
      seenPrompts.add(normPrompt);
    }

    // Contrôle niveau
    const lvl = typeof q.levelNumber === 'number' ? q.levelNumber : 0;
    if (lvl < 1 || lvl > 5) {
      issues.push({ itemIndex: index, identifier: id, field: 'levelNumber', message: `Niveau invalide : ${lvl} (doit être compris entre 1 et 5)` });
    } else {
      questionsPerLevel[lvl] = (questionsPerLevel[lvl] || 0) + 1;
    }

    // Contrôle difficulté
    const diff = (q.difficulty || '').toUpperCase();
    if (diff === 'EASY' || diff === 'INTERMEDIATE' || diff === 'DIFFICULT') {
      diffCounts[diff]++;
    } else {
      issues.push({ itemIndex: index, identifier: id, field: 'difficulty', message: `Difficulté non reconnue : ${diff}` });
    }

    // Contrôle options et réponse correcte
    const opts = q.options ? [q.options.A, q.options.B, q.options.C, q.options.D] : q.choices;
    if (!Array.isArray(opts) || opts.length !== 4) {
      issues.push({ itemIndex: index, identifier: id, field: 'options', message: 'La question doit comporter exactement 4 options A, B, C, D.' });
    } else {
      const uniqueOpts = new Set(opts.map((o: any) => String(o).trim().toLowerCase()));
      if (uniqueOpts.size !== 4) {
        issues.push({ itemIndex: index, identifier: id, field: 'options', message: 'Les 4 choix de réponse doivent être strictement distincts.' });
      }
    }

    const correct = q.correctOption;
    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      issues.push({ itemIndex: index, identifier: id, field: 'correctOption', message: `Option correcte invalide : ${correct} (attendu A, B, C ou D)` });
    }

    // Contrôle source
    if (!q.sourceId || typeof q.sourceId !== 'string' || !q.sourceId.startsWith('SRC-')) {
      issues.push({ itemIndex: index, identifier: id, field: 'sourceId', message: 'Identifiant de source vérifiable (ex: SRC-01) manquant.' });
    }

    // Contrôle explications
    if (!q.explanations || !q.explanations.correct || q.explanations.correct.trim().length < 20) {
      issues.push({ itemIndex: index, identifier: id, field: 'explanations', message: 'Explication pédagogique de la bonne réponse manquante ou insuffisante.' });
    }
  });

  // Contrôle répartition par niveau (10 questions par niveau)
  for (let l = 1; l <= 5; l++) {
    if (questionsPerLevel[l] !== 10) {
      issues.push({
        itemIndex: -1,
        message: `Contrôle 2 échoué : Le niveau ${l} contient ${questionsPerLevel[l] || 0} questions (attendu 10).`,
      });
    }
  }

  // Contrôle répartition globale difficultés (15 EASY, 25 INTERMEDIATE, 10 DIFFICULT)
  if (diffCounts.EASY !== 15 || diffCounts.INTERMEDIATE !== 25 || diffCounts.DIFFICULT !== 10) {
    issues.push({
      itemIndex: -1,
      message: `Contrôle 8 échoué : Répartition des difficultés non conforme (EASY: ${diffCounts.EASY}/15, INTERMEDIATE: ${diffCounts.INTERMEDIATE}/25, DIFFICULT: ${diffCounts.DIFFICULT}/10).`,
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
