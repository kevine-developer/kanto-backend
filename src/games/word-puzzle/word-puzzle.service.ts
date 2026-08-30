import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateLevelDto,
  UpdateLevelDto,
  CreateSentenceDto,
  UpdateSentenceDto,
} from './dto/word-puzzle.dto.js';
import { INITIAL_WORD_PUZZLE_LEVELS } from './seeds/word-puzzle.seed.js';

@Injectable()
export class WordPuzzleService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────────────────────
  // API PUBLIQUE (APPLICATION MOBILE)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Récupère la liste de tous les niveaux disponibles pour l'application mobile.
   */
  async getPublicLevels() {
    const levels = await this.prisma.wordPuzzleLevel.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { levelNumber: 'asc' },
      include: {
        _count: {
          select: { sentences: { where: { status: 'PUBLISHED' } } },
        },
      },
    });

    return levels.map((lvl) => ({
      id: lvl.id,
      levelNumber: lvl.levelNumber,
      titleMg: lvl.titleMg,
      titleFr: lvl.titleFr,
      description: lvl.description,
      difficulty: lvl.difficulty,
      passThreshold: lvl.passThreshold,
      totalSentences: lvl.totalSentences,
      availableSentencesCount: lvl._count.sentences,
    }));
  }

  /**
   * Récupère les 10 phrases d'un niveau pour une session de jeu.
   */
  async getLevelSentences(levelNumber: number) {
    const level = await this.prisma.wordPuzzleLevel.findUnique({
      where: { levelNumber },
      include: {
        sentences: {
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
        totalSentences: level.totalSentences,
      },
      sentences: level.sentences.map((s) => ({
        id: s.id,
        orderIndex: s.orderIndex,
        malagasy: s.malagasy,
        french: s.french,
        hint: s.hint,
        explanationMg: s.explanationMg,
        explanationFr: s.explanationFr,
      })),
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // API ADMIN (DASHBOARD NEXT.JS)
  // ──────────────────────────────────────────────────────────────────────────

  async getAllLevelsAdmin() {
    return this.prisma.wordPuzzleLevel.findMany({
      orderBy: { levelNumber: 'asc' },
      include: {
        _count: {
          select: { sentences: true },
        },
      },
    });
  }

  async getLevelAdmin(id: string) {
    const level = await this.prisma.wordPuzzleLevel.findUnique({
      where: { id },
      include: {
        sentences: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!level) throw new NotFoundException('Niveau introuvable');
    return level;
  }

  async createLevel(dto: CreateLevelDto) {
    const existing = await this.prisma.wordPuzzleLevel.findUnique({
      where: { levelNumber: dto.levelNumber },
    });
    if (existing) {
      throw new BadRequestException(`Le niveau ${dto.levelNumber} existe déjà`);
    }

    return this.prisma.wordPuzzleLevel.create({
      data: {
        levelNumber: dto.levelNumber,
        titleMg: dto.titleMg,
        titleFr: dto.titleFr,
        description: dto.description,
        difficulty: dto.difficulty || 'EASY',
        passThreshold: dto.passThreshold ?? 5,
        totalSentences: dto.totalSentences ?? 10,
        status: dto.status || 'PUBLISHED',
      },
    });
  }

  async updateLevel(id: string, dto: UpdateLevelDto) {
    return this.prisma.wordPuzzleLevel.update({
      where: { id },
      data: dto,
    });
  }

  async deleteLevel(id: string) {
    return this.prisma.wordPuzzleLevel.delete({
      where: { id },
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STATISTIQUES GLOBALES DU JEU
  // ──────────────────────────────────────────────────────────────────────────

  async getStatsAdmin() {
    const [totalLevels, publishedLevels, totalSentences] = await Promise.all([
      this.prisma.wordPuzzleLevel.count(),
      this.prisma.wordPuzzleLevel.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.wordPuzzleSentence.count(),
    ]);

    const levelsWithCounts = await this.prisma.wordPuzzleLevel.findMany({
      include: {
        _count: { select: { sentences: true } },
      },
    });

    const readyLevelsCount = levelsWithCounts.filter(
      (l) => l._count.sentences >= 10,
    ).length;

    return {
      totalLevels,
      publishedLevels,
      readyLevelsCount,
      totalSentences,
      averageSentencesPerLevel:
        totalLevels > 0 ? (totalSentences / totalLevels).toFixed(1) : 0,
      passThreshold: 5,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VALIDATION DU CONTENU DU PUZZLE
  // ──────────────────────────────────────────────────────────────────────────

  private validateAndCleanSentence(rawText: string): {
    cleanedText: string;
    words: string[];
  } {
    const cleanedText = rawText.trim().replace(/\s+/g, ' ');
    const words = cleanedText
      .replace(/[.,!?;:]/g, '')
      .trim()
      .split(/\s+/);

    if (words.length < 2) {
      throw new BadRequestException(
        'Une phrase de puzzle doit comporter au moins 2 mots pour pouvoir être jouée.',
      );
    }
    if (words.length > 20) {
      throw new BadRequestException(
        'Une phrase de puzzle ne devrait pas dépasser 20 mots pour garantir une bonne jouabilité mobile.',
      );
    }

    return { cleanedText, words };
  }

  // ── GESTION DES PHRASES ──

  async createSentence(dto: CreateSentenceDto) {
    const level = await this.prisma.wordPuzzleLevel.findUnique({
      where: { id: dto.levelId },
      include: { _count: { select: { sentences: true } } },
    });
    if (!level) throw new NotFoundException('Niveau introuvable');

    const { cleanedText } = this.validateAndCleanSentence(dto.malagasy);
    const orderIndex = dto.orderIndex || level._count.sentences + 1;

    return this.prisma.wordPuzzleSentence.create({
      data: {
        levelId: dto.levelId,
        orderIndex,
        malagasy: cleanedText,
        french: dto.french.trim(),
        hint: dto.hint?.trim() || null,
        explanationMg: dto.explanationMg?.trim() || null,
        explanationFr: dto.explanationFr?.trim() || null,
        status: dto.status || 'PUBLISHED',
      },
    });
  }

  async updateSentence(id: string, dto: UpdateSentenceDto) {
    const dataToUpdate: Record<string, unknown> = { ...dto };

    if (dto.malagasy) {
      const { cleanedText } = this.validateAndCleanSentence(dto.malagasy);
      dataToUpdate.malagasy = cleanedText;
    }
    if (dto.french) dataToUpdate.french = dto.french.trim();
    if (dto.hint !== undefined) dataToUpdate.hint = dto.hint?.trim() || null;
    if (dto.explanationMg !== undefined)
      dataToUpdate.explanationMg = dto.explanationMg?.trim() || null;
    if (dto.explanationFr !== undefined)
      dataToUpdate.explanationFr = dto.explanationFr?.trim() || null;

    return this.prisma.wordPuzzleSentence.update({
      where: { id },
      data: dataToUpdate as any,
    });
  }

  async deleteSentence(id: string) {
    const sentence = await this.prisma.wordPuzzleSentence.findUnique({
      where: { id },
    });
    if (!sentence) throw new NotFoundException('Phrase introuvable');

    const levelId = sentence.levelId;

    await this.prisma.wordPuzzleSentence.delete({
      where: { id },
    });

    const remaining = await this.prisma.wordPuzzleSentence.findMany({
      where: { levelId },
      orderBy: { orderIndex: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      const targetOrder = i + 1;
      if (remaining[i].orderIndex !== targetOrder) {
        await this.prisma.wordPuzzleSentence.update({
          where: { id: remaining[i].id },
          data: { orderIndex: targetOrder },
        });
      }
    }

    return { message: 'Phrase supprimée et ordre réindexé avec succès' };
  }

  async moveSentence(id: string, direction: 'up' | 'down') {
    const sentence = await this.prisma.wordPuzzleSentence.findUnique({
      where: { id },
    });
    if (!sentence) throw new NotFoundException('Phrase introuvable');

    const sentences = await this.prisma.wordPuzzleSentence.findMany({
      where: { levelId: sentence.levelId },
      orderBy: { orderIndex: 'asc' },
    });

    const currIdx = sentences.findIndex((s) => s.id === id);
    if (currIdx === -1) return sentence;

    const targetIdx = direction === 'up' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= sentences.length) {
      return sentence;
    }

    const neighbor = sentences[targetIdx];

    await this.prisma.$transaction([
      this.prisma.wordPuzzleSentence.update({
        where: { id: sentence.id },
        data: { orderIndex: neighbor.orderIndex },
      }),
      this.prisma.wordPuzzleSentence.update({
        where: { id: neighbor.id },
        data: { orderIndex: sentence.orderIndex },
      }),
    ]);

    return { message: 'Ordre mis à jour' };
  }

  async reorderSentences(levelId: string, sentenceIds: string[]) {
    const level = await this.prisma.wordPuzzleLevel.findUnique({
      where: { id: levelId },
      select: { id: true },
    });
    if (!level) {
      throw new NotFoundException('Niveau introuvable');
    }

    const transactions = sentenceIds.map((id, index) =>
      this.prisma.wordPuzzleSentence.updateMany({
        where: { id, levelId },
        data: { orderIndex: index + 1 },
      }),
    );

    await this.prisma.$transaction(transactions);
    return { message: 'Phrases réordonnées avec succès' };
  }

  /**
   * Initialisation automatique des 2 premiers niveaux avec 10 phrases chacun.
   */
  async seedInitialLevels() {
    const count = await this.prisma.wordPuzzleLevel.count();
    if (count > 0) return { message: 'Les niveaux existent déjà' };

    const createdLevels: any[] = [];

    for (const lvl of INITIAL_WORD_PUZZLE_LEVELS) {
      const created = await this.prisma.wordPuzzleLevel.create({
        data: {
          levelNumber: lvl.levelNumber,
          titleMg: lvl.titleMg,
          titleFr: lvl.titleFr,
          description: lvl.description,
          difficulty: lvl.difficulty,
          passThreshold: lvl.passThreshold,
          totalSentences: lvl.totalSentences,
          status: 'PUBLISHED',
          sentences: {
            create: lvl.sentences.map((s) => ({
              orderIndex: s.orderIndex,
              malagasy: s.malagasy,
              french: s.french,
              hint: s.hint,
              explanationMg: s.explanationMg,
              explanationFr: s.explanationFr,
            })),
          },
        },
      });
      createdLevels.push(created);
    }

    return {
      message: 'Niveaux et phrases initialisés avec succès',
      createdLevels,
    };
  }
}
