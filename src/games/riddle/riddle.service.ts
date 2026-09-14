import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RiddleService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuestions(level?: number) {
    if (level) {
      return this.prisma.riddleQuestion.findMany({
        where: { level, status: 'PUBLISHED' },
      });
    }
    return this.prisma.riddleQuestion.findMany({
      where: { status: 'PUBLISHED' },
    });
  }

  async startSession(
    userId: string | undefined,
    level: number | undefined,
    questionCount: number = 5,
  ) {
    const whereClause: any = { status: 'PUBLISHED' };
    if (level) {
      whereClause.level = level;
    }

    const availableQuestions = await this.prisma.riddleQuestion.findMany({
      where: whereClause,
      select: { id: true },
    });

    // Shuffle and pick
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);

    const session = await this.prisma.riddleSession.create({
      data: {
        userId,
        totalQuestions: selected.length,
      },
    });

    const fullQuestions = await this.prisma.riddleQuestion.findMany({
      where: { id: { in: selected.map((q) => q.id) } },
    });

    return {
      session,
      questions: fullQuestions,
    };
  }

  async answerQuestion(
    sessionId: string,
    questionId: string,
    userAnswer: string | null,
  ) {
    const question = await this.prisma.riddleQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new NotFoundException('Question not found');

    const isCorrect = userAnswer === question.correctAnswer;

    await this.prisma.riddleAnswer.create({
      data: {
        sessionId,
        questionId,
        userAnswer,
        isCorrect,
      },
    });

    // Update global stats
    await this.prisma.riddleQuestion.update({
      where: { id: questionId },
      data: {
        timesPlayed: { increment: 1 },
        timesCorrect: isCorrect ? { increment: 1 } : undefined,
      },
    });

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  async finishSession(sessionId: string, durationSeconds: number) {
    const answers = await this.prisma.riddleAnswer.findMany({
      where: { sessionId },
    });

    const score = answers.filter((a) => a.isCorrect).length;
    let currentStreak = 0;
    let maxStreak = 0;

    for (const a of answers) {
      if (a.isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Give 10 XP per correct answer
    const xpEarned = score * 10;

    const session = await this.prisma.riddleSession.update({
      where: { id: sessionId },
      data: {
        score,
        streakMax: maxStreak,
        durationSeconds,
        isCompleted: true,
        xpEarned,
      },
    });

    if (session.userId && xpEarned > 0) {
      // Find or create UserProgress, add XP, create XpTransaction (basic implementation)
      await this.prisma.userProgress.upsert({
        where: { userId: session.userId },
        update: { totalXp: { increment: xpEarned } },
        create: { userId: session.userId, totalXp: xpEarned },
      });
      await this.prisma.xpTransaction.create({
        data: {
          userId: session.userId,
          amount: xpEarned,
          source: 'GAME_RIDDLE',
          description: `Gained ${xpEarned} XP from Riddle session`,
        },
      });
    }

    return session;
  }
}
