import { jest } from '@jest/globals';
import {
  validateMalagasyItemsBatch,
  validateCitationsBatch,
  validateRakiTenyBatch,
  validateQuizBatch,
  validateTrueFalseBatch,
  validateRiddlesBatch,
} from '../../prisma/seeds/validator.js';
import { seedMalagasyItems } from '../../prisma/seeds/seed-malagasy-items.js';
import { seedCitations } from '../../prisma/seeds/seed-citations.js';
import { seedRakiTeny } from '../../prisma/seeds/seed-raki-teny.js';
import { seedQuiz } from '../../prisma/seeds/seed-quiz.js';
import { seedTrueFalse } from '../../prisma/seeds/seed-true-false.js';
import { seedRiddles } from '../../prisma/seeds/seed-riddles.js';
import { createPrismaMock, type PrismaMock } from '../test-utils/mock-prisma.factory.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const realSeedDataDir = path.resolve(__dirname, '../../prisma/seed-data');

describe('Kanto Seed System — Tests Unitaires & Idempotence', () => {
  let prismaMock: PrismaMock;

  beforeEach(() => {
    prismaMock = createPrismaMock();
    jest.clearAllMocks();
  });

  // ─── 1. Validation de fichiers JSON valides ────────────────────────────────
  describe('1. Validation JSON valide', () => {
    it('doit valider avec succès un lot de proverbes valide', () => {
      const validItems = [
        {
          id: 'p_1',
          malagasy: 'Ny fihavanana tahaka ny landy',
          french: 'Le lien social est comme la soie',
          meaning: 'La fraternité est précieuse et durable',
          category: 'PROVERBE',
        },
      ];
      const result = validateMalagasyItemsBatch(validItems);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('doit valider avec succès un lot de citations valide', () => {
      const validCitations = [
        {
          citationMg: 'Andrianiko ny teniko',
          citationFr: 'Je tiens ma langue en haute estime',
          source: 'Henri Rahaingoson',
        },
      ];
      const result = validateCitationsBatch(validCitations);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('doit valider avec succès les mots rares (raki-teny)', () => {
      const validWords = [
        {
          word: 'Somambisamby',
          meaningMg: 'Fotoana eo anelanelan ny mazava sy ny maizina',
          meaningFr: 'Crépuscule doux',
          exampleMg: 'Mody ny omby rehefa somambisamby',
          exampleFr: 'Les boeufs rentrent au crépuscule',
        },
      ];
      const result = validateRakiTenyBatch(validWords);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('doit valider avec succès un lot de devinettes (ankamantatra)', () => {
      const validRiddles = [
        {
          riddleMg: 'Jereo aho hijereko anao ?',
          correctAnswer: 'Fitaratra',
        },
      ];
      const result = validateRiddlesBatch(validRiddles);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  // ─── 2. Rejet de JSON invalide ─────────────────────────────────────────────
  describe('2. Rejet de données JSON invalides', () => {
    it('doit rejeter un format non-tableau pour les proverbes', () => {
      const result = validateMalagasyItemsBatch({ notAnArray: true } as any);
      expect(result.isValid).toBe(false);
      expect(result.issues[0].message).toContain('tableau');
    });

    it('doit rejeter un format invalide pour les quiz', () => {
      const result = validateQuizBatch('string invalid' as any);
      expect(result.isValid).toBe(false);
    });
  });

  // ─── 3. Rejet des champs obligatoires manquants ────────────────────────────
  describe('3. Rejet des champs obligatoires manquants', () => {
    it('doit détecter un proverbe sans traduction française ni sens', () => {
      const invalidItem = [
        {
          malagasy: 'Ohabolana iray',
          french: '',
          meaning: '   ',
        },
      ];
      const result = validateMalagasyItemsBatch(invalidItem);
      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'french')).toBe(true);
      expect(result.issues.some((i) => i.field === 'meaning')).toBe(true);
    });

    it('doit rejeter une question Vrai/Faux sans champ isTrue booléen', () => {
      const invalidTf = [
        {
          promptMg: 'Marina ve izany ?',
          isTrue: 'oui' as any, // Doit être un booléen strict
        },
      ];
      const result = validateTrueFalseBatch(invalidTf);
      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'isTrue')).toBe(true);
    });

    it('doit rejeter une question de quiz sans choix ou sans prompt', () => {
      const invalidQuiz = [
        {
          promptFr: '',
          choices: ['Seul choix'],
          correctAnswerIndex: 0,
        },
      ];
      const result = validateQuizBatch(invalidQuiz);
      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'prompt')).toBe(true);
      expect(result.issues.some((i) => i.field === 'choices')).toBe(true);
    });

    it('doit rejeter une devinette sans énigme malgache ou sans bonne réponse', () => {
      const invalidRiddles = [
        {
          riddleMg: '',
          correctAnswer: '   ',
        },
      ];
      const result = validateRiddlesBatch(invalidRiddles);
      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'riddleMg')).toBe(true);
      expect(result.issues.some((i) => i.field === 'correctAnswer')).toBe(true);
    });
  });

  // ─── 4. Gestion des identifiants et contenus dupliqués ─────────────────────
  describe('4. Gestion des doublons', () => {
    it('doit ignorer le second élément identique en mémoire pour éviter tout doublon', async () => {
      // Mock findFirst qui retourne null pour le premier et pour les autres
      prismaMock.malagasyItem.findFirst.mockResolvedValue(null);
      prismaMock.malagasyItem.findUnique.mockResolvedValue(null);
      prismaMock.malagasyItem.create.mockResolvedValue({ id: 'item_1', slug: 'item-1' });

      // Dossier temporaire contenant des doublons
      const tempDir = path.resolve(__dirname, 'temp-test-data');
      fs.mkdirSync(tempDir, { recursive: true });
      const duplicateData = [
        { malagasy: 'Teny mitovy', french: 'Texte identique', meaning: 'Sens 1' },
        { malagasy: 'Teny mitovy', french: 'Texte identique', meaning: 'Sens 1 doublon' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(duplicateData));

      try {
        const themeMap = new Map<string, string>();
        const stats = await seedMalagasyItems(prismaMock as any, tempDir, themeMap);

        expect(stats.created).toBe(1);
        expect(stats.skipped).toBe(1);
        expect(prismaMock.malagasyItem.create).toHaveBeenCalledTimes(1);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 5. Insertion d'un nouveau contenu ─────────────────────────────────────
  describe('5. Insertion de nouveau contenu', () => {
    it('doit créer un nouveau MalagasyItem quand il n existe pas', async () => {
      prismaMock.malagasyItem.findFirst.mockResolvedValue(null);
      prismaMock.malagasyItem.findUnique.mockResolvedValue(null);
      prismaMock.malagasyItem.create.mockResolvedValue({ id: 'new_id', slug: 'slug-test' });

      const tempDir = path.resolve(__dirname, 'temp-test-insert');
      fs.mkdirSync(tempDir, { recursive: true });
      const itemData = [
        { id: 'p_101', malagasy: 'Ny ketsa tsy mba maniry an-tany efitra', french: 'Le riz ne pousse pas au désert', meaning: 'Chaque chose a son milieu' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(itemData));

      try {
        const stats = await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(stats.created).toBe(1);
        expect(prismaMock.malagasyItem.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              id: 'p_101',
              malagasy: 'Ny ketsa tsy mba maniry an-tany efitra',
              status: 'PUBLISHED',
            }),
          }),
        );
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 6. Réexécution sans création de doublons (Idempotence) ────────────────
  describe('6. Idempotence lors de réexécutions successives', () => {
    it('ne doit rien recréer si le contenu existe déjà à l identique', async () => {
      const existingItem = {
        id: 'p_101',
        slug: 'slug-p-101',
        malagasy: 'Ny ketsa tsy mba maniry an-tany efitra',
        french: 'Le riz ne pousse pas au désert',
        meaning: 'Chaque chose a son milieu',
        example: null,
        phonetic: null,
        category: 'PROVERBE',
        origins: [],
        difficulty: 'EASY',
      };

      prismaMock.malagasyItem.findFirst.mockResolvedValue(existingItem);

      const tempDir = path.resolve(__dirname, 'temp-test-idempotent');
      fs.mkdirSync(tempDir, { recursive: true });
      const itemData = [
        { id: 'p_101', malagasy: 'Ny ketsa tsy mba maniry an-tany efitra', french: 'Le riz ne pousse pas au désert', meaning: 'Chaque chose a son milieu', category: 'PROVERBE' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(itemData));

      try {
        const stats = await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(stats.created).toBe(0);
        expect(stats.updated).toBe(0);
        expect(stats.unchanged).toBe(1);
        expect(prismaMock.malagasyItem.create).not.toHaveBeenCalled();
        expect(prismaMock.malagasyItem.update).not.toHaveBeenCalled();
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 7. Mise à jour de contenu de référence modifié dans Git ───────────────
  describe('7. Mise à jour des contenus de référence modifiés', () => {
    it('doit mettre à jour la traduction si elle a été enrichie dans le dépôt', async () => {
      const existingItem = {
        id: 'p_101',
        slug: 'slug-p-101',
        malagasy: 'Ny ketsa tsy mba maniry an-tany efitra',
        french: 'Ancienne traduction',
        meaning: 'Chaque chose a son milieu',
        example: null,
        phonetic: null,
        category: 'PROVERBE',
        origins: [],
        difficulty: 'EASY',
      };

      prismaMock.malagasyItem.findFirst.mockResolvedValue(existingItem);
      prismaMock.malagasyItem.update.mockResolvedValue({ ...existingItem, french: 'Traduction enrichie et soignée' });

      const tempDir = path.resolve(__dirname, 'temp-test-update');
      fs.mkdirSync(tempDir, { recursive: true });
      const itemData = [
        { id: 'p_101', malagasy: 'Ny ketsa tsy mba maniry an-tany efitra', french: 'Traduction enrichie et soignée', meaning: 'Chaque chose a son milieu', category: 'PROVERBE' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(itemData));

      try {
        const stats = await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(stats.created).toBe(0);
        expect(stats.updated).toBe(1);
        expect(prismaMock.malagasyItem.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: 'p_101' },
            data: expect.objectContaining({
              french: 'Traduction enrichie et soignée',
            }),
          }),
        );
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 8. Préservation des compteurs opérationnels ───────────────────────────
  describe('8. Préservation des statistiques et données opérationnelles', () => {
    it('ne doit jamais écraser viewCount, likesCount ou reportCount lors d un update', async () => {
      const existingItem = {
        id: 'p_101',
        malagasy: 'Proverbe populaire',
        french: 'Ancien texte',
        meaning: 'Sens',
        viewCount: 1542,
        likesCount: 230,
        shareCount: 45,
        reportCount: 0,
      };

      prismaMock.malagasyItem.findFirst.mockResolvedValue(existingItem);
      prismaMock.malagasyItem.update.mockResolvedValue({ ...existingItem, french: 'Nouveau texte' });

      const tempDir = path.resolve(__dirname, 'temp-test-counters');
      fs.mkdirSync(tempDir, { recursive: true });
      const itemData = [
        { id: 'p_101', malagasy: 'Proverbe populaire', french: 'Nouveau texte', meaning: 'Sens' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(itemData));

      try {
        await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(prismaMock.malagasyItem.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.not.objectContaining({
              viewCount: expect.anything(),
              likesCount: expect.anything(),
              shareCount: expect.anything(),
            }),
          }),
        );
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 9. Absence de suppression de données utilisateur ─────────────────────
  describe('9. Protection des données utilisateurs', () => {
    it('ne doit appeler ni delete ni deleteMany sur les tables de données', async () => {
      const tempDir = path.resolve(__dirname, 'temp-test-nodelete');
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify([]));

      try {
        await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(prismaMock.malagasyItem.delete).not.toHaveBeenCalled();
        expect(prismaMock.malagasyItem.deleteMany).not.toHaveBeenCalled();
        expect(prismaMock.user.deleteMany).not.toHaveBeenCalled();
        expect(prismaMock.favorite.deleteMany).not.toHaveBeenCalled();
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 10. Gestion d une indisponibilité PostgreSQL ─────────────────────────
  describe('10. Gestion des erreurs de connexion', () => {
    it('doit comptabiliser l erreur proprement sans crasher silencieusement', async () => {
      prismaMock.malagasyItem.findFirst.mockRejectedValue(new Error('Connection lost to PostgreSQL'));

      const tempDir = path.resolve(__dirname, 'temp-test-error');
      fs.mkdirSync(tempDir, { recursive: true });
      const itemData = [
        { id: 'err_1', malagasy: 'Teny fitsapana', french: 'Texte test', meaning: 'Sens' },
      ];
      fs.writeFileSync(path.join(tempDir, 'malagasy-items.data.json'), JSON.stringify(itemData));

      try {
        const stats = await seedMalagasyItems(prismaMock as any, tempDir, new Map());
        expect(stats.errors).toBe(1);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  // ─── 11. Vérification des fichiers réels du corpus ─────────────────────────
  describe('11. Intégrité du corpus réel Kanto MG', () => {
    it('doit trouver et valider le corpus réel de proverbes et citations', () => {
      expect(fs.existsSync(path.join(realSeedDataDir, 'malagasy-items.data.json'))).toBe(true);
      expect(fs.existsSync(path.join(realSeedDataDir, 'citations.data.json'))).toBe(true);
      expect(fs.existsSync(path.join(realSeedDataDir, 'raki-teny.data.json'))).toBe(true);
      expect(fs.existsSync(path.join(realSeedDataDir, 'quiz-verified.data.json'))).toBe(true);
      expect(fs.existsSync(path.join(realSeedDataDir, 'true-false-verified.data.json'))).toBe(true);
      expect(fs.existsSync(path.join(realSeedDataDir, 'riddles.data.json'))).toBe(true);
    });

    it('doit insérer de nouvelles devinettes de manière idempotente via seedRiddles', async () => {
      prismaMock.riddleQuestion.findFirst.mockResolvedValue(null);
      prismaMock.riddleQuestion.create.mockResolvedValue({ id: 'riddle_1' });

      const tempDir = path.resolve(__dirname, 'temp-test-riddles');
      fs.mkdirSync(tempDir, { recursive: true });
      const testRiddles = [
        {
          riddleMg: 'Jereo aho hijereko anao ?',
          riddleFr: 'Regarde-moi pour que je te regarde ?',
          options: ['Fitaratra', 'Rano'],
          correctAnswer: 'Fitaratra',
          acceptedAnswers: ['fitaratra', 'miroir'],
          explanation: 'Ny fitaratra',
        },
      ];
      fs.writeFileSync(path.join(tempDir, 'riddles.data.json'), JSON.stringify(testRiddles));

      try {
        const stats = await seedRiddles(prismaMock as any, tempDir);
        expect(stats.created).toBe(1);
        expect(stats.errors).toBe(0);
        expect(prismaMock.riddleQuestion.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              riddleMg: 'Jereo aho hijereko anao ?',
              correctAnswer: 'Fitaratra',
            }),
          }),
        );
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});

