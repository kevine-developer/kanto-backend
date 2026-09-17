import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RiddleService } from './riddle.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../../test-utils/mock-prisma.factory.js';
import {
  buildRiddleQuestion,
  buildRiddleSession,
  buildRiddleAnswer,
} from '../../test-utils/builders/session.builder.js';

describe('RiddleService', () => {
  let service: RiddleService;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiddleService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RiddleService>(RiddleService);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getQuestions
  // ─────────────────────────────────────────────────────────────────────────

  describe('getQuestions', () => {
    it('should return all published questions when no level is specified', async () => {
      const questions = [buildRiddleQuestion(), buildRiddleQuestion()];
      prismaMock.riddleQuestion.findMany.mockResolvedValue(questions);

      const result = await service.getQuestions();

      expect(prismaMock.riddleQuestion.findMany).toHaveBeenCalledWith({
        where: { status: 'PUBLISHED' },
      });
      expect(result).toEqual(questions);
    });

    it('should filter by level when level is provided', async () => {
      const questions = [buildRiddleQuestion({ level: 2 })];
      prismaMock.riddleQuestion.findMany.mockResolvedValue(questions);

      const result = await service.getQuestions(2);

      expect(prismaMock.riddleQuestion.findMany).toHaveBeenCalledWith({
        where: { level: 2, status: 'PUBLISHED' },
      });
      expect(result).toEqual(questions);
    });

    it('should return empty array when no published questions exist', async () => {
      prismaMock.riddleQuestion.findMany.mockResolvedValue([]);

      const result = await service.getQuestions();

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // startSession
  // ─────────────────────────────────────────────────────────────────────────

  describe('startSession', () => {
    it('should create a session with randomly selected questions', async () => {
      const questions = Array.from({ length: 10 }, () => buildRiddleQuestion());
      const session = buildRiddleSession('user-1');

      prismaMock.riddleQuestion.findMany
        .mockResolvedValueOnce(questions.map((q) => ({ id: q.id }))) // IDs disponibles
        .mockResolvedValueOnce(questions.slice(0, 5)); // Questions complètes

      prismaMock.riddleSession.create.mockResolvedValue(session);

      const result = await service.startSession('user-1', undefined, 5);

      expect(result.session).toBeDefined();
      expect(result.questions).toBeDefined();
      expect(prismaMock.riddleSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'user-1' }),
        }),
      );
    });

    it('should create a session for anonymous user (userId = undefined)', async () => {
      const questions = [buildRiddleQuestion()];
      const session = buildRiddleSession(null);

      prismaMock.riddleQuestion.findMany
        .mockResolvedValueOnce([{ id: questions[0].id }])
        .mockResolvedValueOnce(questions);
      prismaMock.riddleSession.create.mockResolvedValue(session);

      const result = await service.startSession(undefined, undefined, 1);

      expect(result.session.userId).toBeNull();
    });

    it('should filter questions by level when provided', async () => {
      const levelQuestions = [buildRiddleQuestion({ level: 3 })];
      const session = buildRiddleSession('user-1');

      prismaMock.riddleQuestion.findMany
        .mockResolvedValueOnce([{ id: levelQuestions[0].id }])
        .mockResolvedValueOnce(levelQuestions);
      prismaMock.riddleSession.create.mockResolvedValue(session);

      await service.startSession('user-1', 3, 1);

      expect(prismaMock.riddleQuestion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ level: 3 }),
        }),
      );
    });

    it('should default to 5 questions when questionCount is not provided', async () => {
      const questions = Array.from({ length: 10 }, () => buildRiddleQuestion());
      const session = buildRiddleSession('user-1');

      prismaMock.riddleQuestion.findMany
        .mockResolvedValueOnce(questions.map((q) => ({ id: q.id })))
        .mockResolvedValueOnce(questions.slice(0, 5));
      prismaMock.riddleSession.create.mockResolvedValue({
        ...session,
        totalQuestions: 5,
      });

      const result = await service.startSession('user-1');

      expect(result.session.totalQuestions).toBe(5);
    });

    /**
     * TEST DE RÉGRESSION — Bug #1
     * Lorsqu'aucune question n'est disponible, une session est quand même créée
     * avec totalQuestions: 0. Ce comportement est incorrect et peut produire
     * un état incohérent (session complète sans aucune question).
     *
     * Ce test documente le comportement actuel (bug).
     * La correction attendue : lancer une NotFoundException si aucune question.
     */
    it('[BUG #1] should create session with totalQuestions=0 when no questions available (regression)', async () => {
      prismaMock.riddleQuestion.findMany.mockResolvedValueOnce([]); // Aucune question dispo
      const emptySession = buildRiddleSession('user-1', { totalQuestions: 0 });
      prismaMock.riddleSession.create.mockResolvedValue(emptySession);
      prismaMock.riddleQuestion.findMany.mockResolvedValueOnce([]); // questions complètes = []

      // Comportement actuel : session créée avec 0 questions
      const result = await service.startSession('user-1', undefined, 5);
      expect(result.session.totalQuestions).toBe(0);
      expect(result.questions).toHaveLength(0);

      // ⚠️ Comportement attendu (post-correction) : NotFoundException
      // À activer après correction du bug dans riddle.service.ts
    });

    it('should select at most questionCount questions', async () => {
      const manyQuestions = Array.from({ length: 20 }, () =>
        buildRiddleQuestion(),
      );
      const session = buildRiddleSession('user-1', { totalQuestions: 5 });

      prismaMock.riddleQuestion.findMany
        .mockResolvedValueOnce(manyQuestions.map((q) => ({ id: q.id })))
        .mockResolvedValueOnce(manyQuestions.slice(0, 5));
      prismaMock.riddleSession.create.mockResolvedValue(session);

      const result = await service.startSession('user-1', undefined, 5);

      // La session créée a 5 questions
      expect(result.session.totalQuestions).toBe(5);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // answerQuestion
  // ─────────────────────────────────────────────────────────────────────────

  describe('answerQuestion', () => {
    it('should return isCorrect=true when user answer matches the correct answer', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      const result = await service.answerQuestion(
        'session-1',
        question.id,
        'Antananarivo',
      );

      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswer).toBe('Antananarivo');
    });

    it('should return isCorrect=false when user answer is wrong', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      const result = await service.answerQuestion(
        'session-1',
        question.id,
        'Toamasina',
      );

      expect(result.isCorrect).toBe(false);
      expect(result.correctAnswer).toBe('Antananarivo');
    });

    it('should return the explanation in the response', async () => {
      const question = buildRiddleQuestion({
        correctAnswer: 'Antananarivo',
        explanation: 'Capital historique depuis le XVIIe siècle.',
      });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      const result = await service.answerQuestion(
        'session-1',
        question.id,
        'Antananarivo',
      );

      expect(result.explanation).toBe(
        'Capital historique depuis le XVIIe siècle.',
      );
    });

    it('should return isCorrect=false when userAnswer is null', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      const result = await service.answerQuestion(
        'session-1',
        question.id,
        null,
      );

      expect(result.isCorrect).toBe(false);
    });

    it('should throw NotFoundException when question does not exist', async () => {
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(null);

      await expect(
        service.answerQuestion('session-1', 'nonexistent-id', 'Antananarivo'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should increment timesPlayed on the question', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      await service.answerQuestion('session-1', question.id, 'Antananarivo');

      expect(prismaMock.riddleQuestion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timesPlayed: { increment: 1 },
          }),
        }),
      );
    });

    it('should increment timesCorrect only when answer is correct', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      await service.answerQuestion('session-1', question.id, 'Antananarivo');

      expect(prismaMock.riddleQuestion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timesCorrect: { increment: 1 },
          }),
        }),
      );
    });

    it('should NOT increment timesCorrect when answer is wrong', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      await service.answerQuestion('session-1', question.id, 'Toamasina');

      expect(prismaMock.riddleQuestion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timesCorrect: undefined,
          }),
        }),
      );
    });

    it('should persist the answer in riddleAnswer table', async () => {
      const question = buildRiddleQuestion({ correctAnswer: 'Antananarivo' });
      prismaMock.riddleQuestion.findUnique.mockResolvedValue(question);
      prismaMock.riddleAnswer.create.mockResolvedValue({});
      prismaMock.riddleQuestion.update.mockResolvedValue(question);

      await service.answerQuestion('session-42', question.id, 'Antananarivo');

      expect(prismaMock.riddleAnswer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            sessionId: 'session-42',
            questionId: question.id,
            userAnswer: 'Antananarivo',
            isCorrect: true,
          }),
        }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // finishSession
  // ─────────────────────────────────────────────────────────────────────────

  describe('finishSession', () => {
    it('should calculate score as the number of correct answers', async () => {
      const sessionId = 'session-1';
      const answers = [
        buildRiddleAnswer(sessionId, 'q1', { isCorrect: true }),
        buildRiddleAnswer(sessionId, 'q2', { isCorrect: false }),
        buildRiddleAnswer(sessionId, 'q3', { isCorrect: true }),
      ];
      const updatedSession = buildRiddleSession('user-1', {
        id: sessionId,
        score: 2,
        isCompleted: true,
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);
      prismaMock.userProgress.upsert.mockResolvedValue({});
      prismaMock.xpTransaction.create.mockResolvedValue({});

      await service.finishSession(sessionId, 60);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ score: 2 }),
        }),
      );
    });

    it('should calculate XP as 10 per correct answer', async () => {
      const sessionId = 'session-1';
      const answers = [
        buildRiddleAnswer(sessionId, 'q1', { isCorrect: true }),
        buildRiddleAnswer(sessionId, 'q2', { isCorrect: true }),
        buildRiddleAnswer(sessionId, 'q3', { isCorrect: false }),
      ];
      // score = 2, xpEarned = 20
      const updatedSession = buildRiddleSession('user-1', {
        id: sessionId,
        score: 2,
        xpEarned: 20,
        userId: 'user-1',
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);
      prismaMock.userProgress.upsert.mockResolvedValue({});
      prismaMock.xpTransaction.create.mockResolvedValue({});

      await service.finishSession(sessionId, 90);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ xpEarned: 20 }),
        }),
      );
    });

    it('should calculate max streak correctly', async () => {
      const sessionId = 'session-1';
      const answers = [
        buildRiddleAnswer(sessionId, 'q1', { isCorrect: true }),
        buildRiddleAnswer(sessionId, 'q2', { isCorrect: true }),
        buildRiddleAnswer(sessionId, 'q3', { isCorrect: false }),
        buildRiddleAnswer(sessionId, 'q4', { isCorrect: true }),
      ];
      // maxStreak = 2 (q1, q2)
      const updatedSession = buildRiddleSession('user-1', {
        id: sessionId,
        score: 3,
        streakMax: 2,
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);
      prismaMock.userProgress.upsert.mockResolvedValue({});
      prismaMock.xpTransaction.create.mockResolvedValue({});

      await service.finishSession(sessionId, 120);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ streakMax: 2 }),
        }),
      );
    });

    it('should compute streakMax=0 for all wrong answers', async () => {
      const sessionId = 'session-1';
      const answers = [
        buildRiddleAnswer(sessionId, 'q1', { isCorrect: false }),
        buildRiddleAnswer(sessionId, 'q2', { isCorrect: false }),
      ];
      const updatedSession = buildRiddleSession(null, {
        id: sessionId,
        score: 0,
        streakMax: 0,
        userId: null,
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);

      await service.finishSession(sessionId, 30);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ score: 0, streakMax: 0 }),
        }),
      );
      // Aucun XP accordé, aucun upsert
      expect(prismaMock.userProgress.upsert).not.toHaveBeenCalled();
    });

    it('should NOT update userProgress when userId is null (anonymous session)', async () => {
      const sessionId = 'session-anon';
      const answers = [buildRiddleAnswer(sessionId, 'q1', { isCorrect: true })];
      const updatedSession = buildRiddleSession(null, {
        id: sessionId,
        score: 1,
        xpEarned: 10,
        userId: null,
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);

      await service.finishSession(sessionId, 45);

      expect(prismaMock.userProgress.upsert).not.toHaveBeenCalled();
      expect(prismaMock.xpTransaction.create).not.toHaveBeenCalled();
    });

    it('should update userProgress when userId is present and XP > 0', async () => {
      const sessionId = 'session-user';
      const answers = [buildRiddleAnswer(sessionId, 'q1', { isCorrect: true })];
      const updatedSession = buildRiddleSession('user-99', {
        id: sessionId,
        score: 1,
        xpEarned: 10,
        userId: 'user-99',
      });

      prismaMock.riddleAnswer.findMany.mockResolvedValue(answers);
      prismaMock.riddleSession.update.mockResolvedValue(updatedSession);
      prismaMock.userProgress.upsert.mockResolvedValue({});
      prismaMock.xpTransaction.create.mockResolvedValue({});

      await service.finishSession(sessionId, 50);

      expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-99' },
          update: { totalXp: { increment: 10 } },
        }),
      );
    });

    it('should mark session as completed', async () => {
      const sessionId = 'session-1';
      prismaMock.riddleAnswer.findMany.mockResolvedValue([]);
      prismaMock.riddleSession.update.mockResolvedValue(
        buildRiddleSession(null, {
          id: sessionId,
          isCompleted: true,
          userId: null,
        }),
      );

      await service.finishSession(sessionId, 0);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isCompleted: true }),
        }),
      );
    });

    it('should persist durationSeconds correctly', async () => {
      const sessionId = 'session-1';
      prismaMock.riddleAnswer.findMany.mockResolvedValue([]);
      prismaMock.riddleSession.update.mockResolvedValue(
        buildRiddleSession(null, { id: sessionId, userId: null }),
      );

      await service.finishSession(sessionId, 123);

      expect(prismaMock.riddleSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ durationSeconds: 123 }),
        }),
      );
    });
  });
});
