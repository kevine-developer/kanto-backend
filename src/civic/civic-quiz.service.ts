import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { FindCivicQuizQueryDto, RandomQuizQueryDto } from './dto/find-civic-quiz.dto.js';
import { CreateCivicQuizDto } from './dto/create-civic-quiz.dto.js';
import { UpdateCivicQuizDto } from './dto/update-civic-quiz.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';
import { CACHE_KEYS } from '../common/constants/cache.constant.js';

@Injectable()
export class CivicQuizService {
  private readonly logger = new Logger(CivicQuizService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateCache(id?: string) {
    await this.redis.delByPattern(CACHE_KEYS.CIVIC_QUIZ_LIST_PATTERN);
    if (id) await this.redis.del(`${CACHE_KEYS.CIVIC_QUIZ_DETAIL_PREFIX}${id}`);
  }

  async create(data: CreateCivicQuizDto) {
    const question = await this.prisma.civicQuizQuestion.create({
      data: {
        category: data.category,
        prompt: data.prompt,
        choices: data.choices,
        answerIndex: data.answerIndex,
        explanation: data.explanation,
        difficulty: data.difficulty || 'EASY',
        tags: data.tags || [],
        status: 'PUBLISHED',
      },
    });

    await this.invalidateCache(question.id);
    this.logger.log(`✨ [CivicQuiz] Question de quiz créée (ID: ${question.id})`);
    return question;
  }

  async update(id: string, data: UpdateCivicQuizDto) {
    const existing = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    const question = await this.prisma.civicQuizQuestion.update({
      where: { id },
      data: {
        category: data.category !== undefined ? data.category : undefined,
        prompt: data.prompt !== undefined ? data.prompt : undefined,
        choices: data.choices !== undefined ? data.choices : undefined,
        answerIndex: data.answerIndex !== undefined ? data.answerIndex : undefined,
        explanation: data.explanation !== undefined ? data.explanation : undefined,
        difficulty: data.difficulty !== undefined ? data.difficulty : undefined,
        tags: data.tags !== undefined ? data.tags : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });

    await this.invalidateCache(question.id);
    this.logger.log(`✏️ [CivicQuiz] Question de quiz mise à jour (ID: ${question.id})`);
    return question;
  }

  async remove(id: string) {
    const existing = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    await this.prisma.civicQuizQuestion.delete({
      where: { id },
    });

    await this.invalidateCache(id);
    this.logger.log(`🗑️ [CivicQuiz] Question de quiz supprimée (ID: ${id})`);
    return { success: true, message: 'Question supprimée avec succès' };
  }

  async findAll(query: FindCivicQuizQueryDto) {
    const { page = 1, limit = 20, category, difficulty, tag } = query;
    const { skip, limit: takeLimit, page: currentPage } = calculatePagination({ page, limit });

    const cacheKey = `${CACHE_KEYS.CIVIC_QUIZ_LIST_PREFIX}${currentPage}:${takeLimit}:${category || ''}:${difficulty || ''}:${tag || ''}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const where: Prisma.CivicQuizQuestionWhereInput = {
      status: 'PUBLISHED',
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.civicQuizQuestion.count({ where }),
      this.prisma.civicQuizQuestion.findMany({
        where,
        skip,
        take: takeLimit,
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const result = formatPaginatedResponse(items, total, currentPage, takeLimit);
    await this.redis.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.CIVIC_QUIZ_DETAIL_PREFIX}${id}`;
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const question = await this.prisma.civicQuizQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question de quiz "${id}" introuvable`);
    }

    await this.redis.set(cacheKey, question, 600); // 10 min TTL
    return question;
  }

  async getRandomQuestions(query: RandomQuizQueryDto) {
    const { category, difficulty, count = 10 } = query;

    const where: Prisma.CivicQuizQuestionWhereInput = {
      status: 'PUBLISHED',
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
    };

    const allQuestions = await this.prisma.civicQuizQuestion.findMany({
      where,
    });

    // Mélange aléatoire (Fisher-Yates)
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }

  async recordAnswer(id: string, isCorrect: boolean) {
    await this.prisma.civicQuizQuestion.update({
      where: { id },
      data: {
        timesPlayed: { increment: 1 },
        ...(isCorrect ? { timesCorrect: { increment: 1 } } : {}),
      },
    }).catch(() => null);

    return { success: true };
  }
}
