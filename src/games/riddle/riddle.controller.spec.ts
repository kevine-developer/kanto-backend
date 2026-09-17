import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { RiddleController } from './riddle.controller.js';
import { RiddleService } from './riddle.service.js';
import {
  buildRiddleSession,
  buildRiddleQuestion,
} from '../../test-utils/builders/session.builder.js';

describe('RiddleController', () => {
  let controller: RiddleController;
  let riddleServiceMock: {
    startSession: jest.Mock<(...args: any[]) => Promise<any>>;
    answerQuestion: jest.Mock<(...args: any[]) => Promise<any>>;
    finishSession: jest.Mock<(...args: any[]) => Promise<any>>;
    getQuestions: jest.Mock<(...args: any[]) => Promise<any>>;
  };

  beforeEach(async () => {
    riddleServiceMock = {
      startSession: jest.fn<(...args: any[]) => Promise<any>>(),
      answerQuestion: jest.fn<(...args: any[]) => Promise<any>>(),
      finishSession: jest.fn<(...args: any[]) => Promise<any>>(),
      getQuestions: jest.fn<(...args: any[]) => Promise<any>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiddleController],
      providers: [{ provide: RiddleService, useValue: riddleServiceMock }],
    }).compile();

    controller = module.get<RiddleController>(RiddleController);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // startSession
  // ─────────────────────────────────────────────────────────────────────────

  describe('startSession', () => {
    it('should call riddleService.startSession with userId from session', async () => {
      const session = { user: { id: 'user-1' } } as any;
      const expected = { session: buildRiddleSession('user-1'), questions: [] };
      riddleServiceMock.startSession.mockResolvedValue(expected);

      const result = await controller.startSession(
        { level: 2, questionCount: 5 },
        session,
      );

      expect(riddleServiceMock.startSession).toHaveBeenCalledWith(
        'user-1',
        2,
        5,
      );
      expect(result).toBe(expected);
    });

    it('should call startSession with userId=undefined when no session (anonymous)', async () => {
      const expected = { session: buildRiddleSession(null), questions: [] };
      riddleServiceMock.startSession.mockResolvedValue(expected);

      await controller.startSession({ level: 1, questionCount: 3 }, undefined);

      expect(riddleServiceMock.startSession).toHaveBeenCalledWith(
        undefined,
        1,
        3,
      );
    });

    it('should default questionCount to 5 when not provided in body', async () => {
      riddleServiceMock.startSession.mockResolvedValue({
        session: {},
        questions: [],
      });

      await controller.startSession({}, undefined);

      expect(riddleServiceMock.startSession).toHaveBeenCalledWith(
        undefined,
        undefined,
        5,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // answerQuestion
  // ─────────────────────────────────────────────────────────────────────────

  describe('answerQuestion', () => {
    it('should delegate to riddleService.answerQuestion with body params', async () => {
      const expected = {
        isCorrect: true,
        correctAnswer: 'Antananarivo',
        explanation: 'Capitale.',
      };
      riddleServiceMock.answerQuestion.mockResolvedValue(expected);

      const result = await controller.answerQuestion({
        sessionId: 'sess-1',
        questionId: 'q-1',
        userAnswer: 'Antananarivo',
      });

      expect(riddleServiceMock.answerQuestion).toHaveBeenCalledWith(
        'sess-1',
        'q-1',
        'Antananarivo',
      );
      expect(result).toBe(expected);
    });

    it('should pass null userAnswer when not provided', async () => {
      riddleServiceMock.answerQuestion.mockResolvedValue({ isCorrect: false });

      await controller.answerQuestion({
        sessionId: 'sess-1',
        questionId: 'q-1',
      });

      expect(riddleServiceMock.answerQuestion).toHaveBeenCalledWith(
        'sess-1',
        'q-1',
        undefined,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // finishSession
  // ─────────────────────────────────────────────────────────────────────────

  describe('finishSession', () => {
    it('should delegate to riddleService.finishSession with body params', async () => {
      const completedSession = buildRiddleSession('user-1', {
        isCompleted: true,
        score: 4,
      });
      riddleServiceMock.finishSession.mockResolvedValue(completedSession);

      const result = await controller.finishSession({
        sessionId: 'sess-1',
        durationSeconds: 120,
      });

      expect(riddleServiceMock.finishSession).toHaveBeenCalledWith(
        'sess-1',
        120,
      );
      expect(result).toBe(completedSession);
    });

    it('should default durationSeconds to 0 when not provided', async () => {
      riddleServiceMock.finishSession.mockResolvedValue({});

      await controller.finishSession({ sessionId: 'sess-1' });

      expect(riddleServiceMock.finishSession).toHaveBeenCalledWith('sess-1', 0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getQuestions
  // ─────────────────────────────────────────────────────────────────────────

  describe('getQuestions', () => {
    it('should return all questions when no level query param', async () => {
      const questions = [buildRiddleQuestion(), buildRiddleQuestion()];
      riddleServiceMock.getQuestions.mockResolvedValue(questions);

      const result = await controller.getQuestions(undefined);

      expect(riddleServiceMock.getQuestions).toHaveBeenCalledWith(undefined);
      expect(result).toBe(questions);
    });

    it('should parse level string to integer and filter questions', async () => {
      const questions = [buildRiddleQuestion({ level: 2 })];
      riddleServiceMock.getQuestions.mockResolvedValue(questions);

      const result = await controller.getQuestions('2');

      expect(riddleServiceMock.getQuestions).toHaveBeenCalledWith(2);
      expect(result).toBe(questions);
    });

    it('should handle level "0" (falsy) as undefined', async () => {
      riddleServiceMock.getQuestions.mockResolvedValue([]);

      // parseInt('0', 10) = 0 → truthy check: '0' is truthy, so parseInt is called
      await controller.getQuestions('0');

      expect(riddleServiceMock.getQuestions).toHaveBeenCalledWith(0);
    });
  });
});
