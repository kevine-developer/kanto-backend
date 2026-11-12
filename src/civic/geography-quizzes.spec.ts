import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGeographyQuizBatch } from '../../prisma/seeds/validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataDir = path.resolve(__dirname, '../../prisma/seed-data');

describe('Corpus de référence : Géographie et trésors naturels de Madagascar', () => {
  const quizPath = path.join(seedDataDir, 'madagascar-geography-nature-quizzes.json');
  const sourcesPath = path.join(seedDataDir, 'sources-references.json');

  let quizData: any;
  let sourcesData: any;

  beforeAll(() => {
    expect(fs.existsSync(quizPath)).toBe(true);
    expect(fs.existsSync(sourcesPath)).toBe(true);

    quizData = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
    sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
  });

  test('Point 1 : Exactement 50 questions dans le corpus', () => {
    expect(Array.isArray(quizData.questions)).toBe(true);
    expect(quizData.questions.length).toBe(50);
  });

  test('Point 2 : Exactement 5 niveaux de 10 questions', () => {
    expect(Array.isArray(quizData.levels)).toBe(true);
    expect(quizData.levels.length).toBe(5);

    for (let lvl = 1; lvl <= 5; lvl++) {
      const qsInLvl = quizData.questions.filter((q: any) => q.levelNumber === lvl);
      expect(qsInLvl.length).toBe(10);
    }
  });

  test('Point 3 & 4 : Chaque question possède 4 choix distincts et une seule bonne réponse', () => {
    for (const q of quizData.questions) {
      expect(['A', 'B', 'C', 'D']).toContain(q.correctOption);
      const choices = [q.options.A, q.options.B, q.options.C, q.options.D];
      expect(choices.every((c: any) => typeof c === 'string' && c.trim().length > 0)).toBe(true);
      const unique = new Set(choices.map((c: string) => c.trim().toLowerCase()));
      expect(unique.size).toBe(4);
    }
  });

  test('Point 5 & 6 : Traçabilité documentaire complète via les 36 sources vérifiées', () => {
    expect(Array.isArray(sourcesData.sources)).toBe(true);
    expect(sourcesData.sources.length).toBe(36);

    const sourceIds = new Set(sourcesData.sources.map((s: any) => s.id));
    for (const q of quizData.questions) {
      expect(sourceIds.has(q.sourceId)).toBe(true);
    }
  });

  test('Point 7 : Identifiants et énoncés strictement uniques', () => {
    const ids = new Set<string>();
    const prompts = new Set<string>();

    for (const q of quizData.questions) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);

      const norm = q.question.trim().toLowerCase();
      expect(prompts.has(norm)).toBe(false);
      prompts.add(norm);
    }
  });

  test('Point 8 : Répartition exacte des difficultés (15 Faciles, 25 Intermédiaires, 10 Difficiles)', () => {
    const counts: Record<string, number> = { EASY: 0, INTERMEDIATE: 0, DIFFICULT: 0 };
    for (const q of quizData.questions) {
      counts[q.difficulty]++;
    }

    expect(counts.EASY).toBe(15);
    expect(counts.INTERMEDIATE).toBe(25);
    expect(counts.DIFFICULT).toBe(10);
  });

  test('Point 9 : Distribution équilibrée des positions de réponses correctes', () => {
    const answers: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const q of quizData.questions) {
      answers[q.correctOption]++;
    }

    // Chaque position A, B, C, D doit être présente au moins 8 fois
    expect(answers.A).toBeGreaterThanOrEqual(8);
    expect(answers.B).toBeGreaterThanOrEqual(8);
    expect(answers.C).toBeGreaterThanOrEqual(8);
    expect(answers.D).toBeGreaterThanOrEqual(8);
  });

  test('Point 10 : Explications pédagogiques et indices présents pour chaque question', () => {
    for (const q of quizData.questions) {
      expect(q.explanations?.correct?.length).toBeGreaterThanOrEqual(20);
      expect(q.explanations?.wrong).toBeDefined();
      expect(q.hint?.length).toBeGreaterThanOrEqual(10);
    }
  });

  test('Point 11 & 12 : Validation automatisée via le validateur Kanto', () => {
    const report = validateGeographyQuizBatch(quizData);
    expect(report.isValid).toBe(true);
    expect(report.issues.length).toBe(0);
  });
});
