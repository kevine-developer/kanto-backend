import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateMissingWordLevelDto,
  CreateMissingWordQuestionDto,
  UpdateMissingWordLevelDto,
  UpdateMissingWordQuestionDto,
} from './dto/missing-word.dto.js';
import { INITIAL_MISSING_WORD_LEVELS } from './seeds/missing-word.seed.js';

@Injectable()
export class MissingWordService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────────────────────
  // API PUBLIQUE (APPLICATION MOBILE)
  // ──────────────────────────────────────────────────────────────────────────

  async getPublicLevels() {
    return this.prisma.missingWordLevel.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { levelNumber: 'asc' },
      select: {
        id: true,
        levelNumber: true,
        titleMg: true,
        titleFr: true,
        description: true,
        difficulty: true,
        passThreshold: true,
        totalQuestions: true,
        _count: {
          select: {
            questions: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });
  }

  async getLevelQuestions(levelNumber: number) {
    const level = await this.prisma.missingWordLevel.findUnique({
      where: { levelNumber },
      include: {
        questions: {
          where: { status: 'PUBLISHED' },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!level) {
      throw new NotFoundException(`Niveau ${levelNumber} introuvable`);
    }

    return {
      level: {
        id: level.id,
        levelNumber: level.levelNumber,
        titleMg: level.titleMg,
        titleFr: level.titleFr,
        difficulty: level.difficulty,
        passThreshold: level.passThreshold,
        totalQuestions: level.totalQuestions,
      },
      questions: level.questions.map((q) => ({
        id: q.id,
        orderIndex: q.orderIndex,
        template: q.template,
        correctWord: q.correctWord,
        choices: q.choices,
        french: q.french,
        explanation: q.explanation,
        hint: q.hint,
      })),
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // API ADMIN (DASHBOARD NEXT.JS)
  // ──────────────────────────────────────────────────────────────────────────

  async getAllLevelsAdmin() {
    return this.prisma.missingWordLevel.findMany({
      orderBy: { levelNumber: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  async getLevelAdmin(id: string) {
    const level = await this.prisma.missingWordLevel.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!level) {
      throw new NotFoundException('Niveau introuvable');
    }

    return level;
  }

  async createLevel(dto: CreateMissingWordLevelDto) {
    const existing = await this.prisma.missingWordLevel.findUnique({
      where: { levelNumber: dto.levelNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Le niveau numéro ${dto.levelNumber} existe déjà.`,
      );
    }

    return this.prisma.missingWordLevel.create({
      data: {
        levelNumber: dto.levelNumber,
        titleMg: dto.titleMg.trim(),
        titleFr: dto.titleFr?.trim() || null,
        description: dto.description?.trim() || null,
        difficulty: dto.difficulty || 'EASY',
        passThreshold: dto.passThreshold || 5,
        totalQuestions: dto.totalQuestions || 10,
        status: dto.status || 'PUBLISHED',
      },
    });
  }

  async updateLevel(id: string, dto: UpdateMissingWordLevelDto) {
    await this.getLevelAdmin(id);

    return this.prisma.missingWordLevel.update({
      where: { id },
      data: {
        ...(dto.titleMg && { titleMg: dto.titleMg.trim() }),
        ...(dto.titleFr !== undefined && {
          titleFr: dto.titleFr?.trim() || null,
        }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() || null,
        }),
        ...(dto.difficulty && { difficulty: dto.difficulty }),
        ...(dto.passThreshold !== undefined && {
          passThreshold: dto.passThreshold,
        }),
        ...(dto.totalQuestions !== undefined && {
          totalQuestions: dto.totalQuestions,
        }),
        ...(dto.status && { status: dto.status }),
      },
    });
  }

  async deleteLevel(id: string) {
    await this.getLevelAdmin(id);

    await this.prisma.missingWordLevel.delete({
      where: { id },
    });

    return { message: 'Niveau supprimé avec succès' };
  }

  async getStatsAdmin() {
    const [totalLevels, totalQuestions, publishedQuestions] = await Promise.all(
      [
        this.prisma.missingWordLevel.count(),
        this.prisma.missingWordQuestion.count(),
        this.prisma.missingWordQuestion.count({
          where: { status: 'PUBLISHED' },
        }),
      ],
    );

    return {
      totalLevels,
      totalQuestions,
      publishedQuestions,
    };
  }

  // ── GESTION DES QUESTIONS ──

  async createQuestion(dto: CreateMissingWordQuestionDto) {
    const level = await this.prisma.missingWordLevel.findUnique({
      where: { id: dto.levelId },
      include: { _count: { select: { questions: true } } },
    });
    if (!level) throw new NotFoundException('Niveau introuvable');

    if (dto.correctWord.trim().length < 3) {
      throw new BadRequestException(
        'Le mot manquant doit contenir au moins 3 caractères.',
      );
    }

    const orderIndex = dto.orderIndex || level._count.questions + 1;

    return this.prisma.missingWordQuestion.create({
      data: {
        levelId: dto.levelId,
        orderIndex,
        template: dto.template,
        correctWord: dto.correctWord.trim(),
        choices: dto.choices.map((c) => c.trim()),
        french: dto.french.trim(),
        explanation: dto.explanation?.trim() || null,
        hint: dto.hint?.trim() || null,
        status: dto.status || 'PUBLISHED',
      },
    });
  }

  async updateQuestion(id: string, dto: UpdateMissingWordQuestionDto) {
    const existing = await this.prisma.missingWordQuestion.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Question introuvable');

    if (dto.correctWord && dto.correctWord.trim().length < 3) {
      throw new BadRequestException(
        'Le mot manquant doit contenir au moins 3 caractères.',
      );
    }

    return this.prisma.missingWordQuestion.update({
      where: { id },
      data: {
        ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
        ...(dto.template && { template: dto.template }),
        ...(dto.correctWord && { correctWord: dto.correctWord.trim() }),
        ...(dto.choices && { choices: dto.choices.map((c) => c.trim()) }),
        ...(dto.french && { french: dto.french.trim() }),
        ...(dto.explanation !== undefined && {
          explanation: dto.explanation?.trim() || null,
        }),
        ...(dto.hint !== undefined && { hint: dto.hint?.trim() || null }),
        ...(dto.status && { status: dto.status }),
      },
    });
  }

  async deleteQuestion(id: string) {
    const question = await this.prisma.missingWordQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException('Question introuvable');

    await this.prisma.missingWordQuestion.delete({ where: { id } });

    // Réordonner les questions restantes
    const remaining = await this.prisma.missingWordQuestion.findMany({
      where: { levelId: question.levelId },
      orderBy: { orderIndex: 'asc' },
    });

    const updates = remaining.map((q, idx) =>
      this.prisma.missingWordQuestion.update({
        where: { id: q.id },
        data: { orderIndex: idx + 1 },
      }),
    );
    await this.prisma.$transaction(updates);

    return { message: 'Question supprimée avec succès' };
  }

  async moveQuestion(id: string, direction: 'up' | 'down') {
    const current = await this.prisma.missingWordQuestion.findUnique({
      where: { id },
    });
    if (!current) throw new NotFoundException('Question introuvable');

    const targetOrder =
      direction === 'up' ? current.orderIndex - 1 : current.orderIndex + 1;
    if (targetOrder < 1) return { message: 'Déjà en première position' };

    const sibling = await this.prisma.missingWordQuestion.findFirst({
      where: { levelId: current.levelId, orderIndex: targetOrder },
    });

    if (!sibling) return { message: 'Déplacement impossible' };

    await this.prisma.$transaction([
      this.prisma.missingWordQuestion.update({
        where: { id: current.id },
        data: { orderIndex: targetOrder },
      }),
      this.prisma.missingWordQuestion.update({
        where: { id: sibling.id },
        data: { orderIndex: current.orderIndex },
      }),
    ]);

    return { message: 'Ordre mis à jour' };
  }

  async reorderQuestions(levelId: string, questionIds: string[]) {
    const level = await this.prisma.missingWordLevel.findUnique({
      where: { id: levelId },
      select: { id: true },
    });
    if (!level) {
      throw new NotFoundException('Niveau introuvable');
    }

    const transactions = questionIds.map((id, index) =>
      this.prisma.missingWordQuestion.updateMany({
        where: { id, levelId },
        data: { orderIndex: index + 1 },
      }),
    );

    await this.prisma.$transaction(transactions);
    return { message: 'Questions réordonnées avec succès' };
  }

  /**
   * Initialisation automatique des 5 premiers niveaux avec 10 questions chacun (50 au total).
   */
  async seedInitialLevels() {
    const count = await this.prisma.missingWordLevel.count();
    if (count > 0) return { message: 'Les niveaux existent déjà' };

    for (const lvl of INITIAL_MISSING_WORD_LEVELS) {
      const createdLevel = await this.prisma.missingWordLevel.create({
        data: {
          levelNumber: lvl.levelNumber,
          titleMg: lvl.titleMg,
          titleFr: lvl.titleFr,
          description: lvl.description,
          difficulty: lvl.difficulty,
          passThreshold: 5,
          totalQuestions: 10,
          status: 'PUBLISHED',
        },
      });

      for (let i = 0; i < lvl.questions.length; i++) {
        const q = lvl.questions[i];
        await this.prisma.missingWordQuestion.create({
          data: {
            levelId: createdLevel.id,
            orderIndex: i + 1,
            template: q.template,
            correctWord: q.correctWord,
            choices: q.choices,
            french: q.french,
            explanation: q.explanation,
            status: 'PUBLISHED',
          },
        });
      }
    }

    return {
      message: '50 questions réparties sur 5 niveaux créées avec succès',
    };
  }
}
