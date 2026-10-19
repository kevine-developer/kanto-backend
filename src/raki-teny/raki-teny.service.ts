import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRakiTenyDto } from './dto/create-raki-teny.dto.js';
import { UpdateRakiTenyDto } from './dto/update-raki-teny.dto.js';
import { QueryRakiTenyDto } from './dto/query-raki-teny.dto.js';
import {
  calculatePagination,
  formatPaginatedResponse,
} from '../common/utils/pagination.util.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class RakiTenyService {
  private readonly logger = new Logger(RakiTenyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRakiTenyDto) {
    const { page, limit, skip } = calculatePagination({
      page: query.page,
      limit: query.limit,
    });

    const where: Prisma.RakiTenyWordWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.rarity) {
      where.rarity = query.rarity;
    }

    if (query.category && query.category !== 'all') {
      where.category = query.category;
    }

    if (query.letter && query.letter.toUpperCase() !== 'ALL') {
      where.word = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
    }

    if (query.search && query.search.trim().length > 0) {
      const q = query.search.trim();
      where.OR = [
        { word: { contains: q, mode: 'insensitive' } },
        { meaningMg: { contains: q, mode: 'insensitive' } },
        { meaningFr: { contains: q, mode: 'insensitive' } },
        { exampleMg: { contains: q, mode: 'insensitive' } },
        { exampleFr: { contains: q, mode: 'insensitive' } },
        { contextUsage: { contains: q, mode: 'insensitive' } },
        { etymology: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.rakiTenyWord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ word: 'asc' }],
      }),
      this.prisma.rakiTenyWord.count({ where }),
    ]);

    const result = formatPaginatedResponse(items, total, page, limit);
    return {
      ...result,
      pagination: result.meta,
    };
  }

  async findOne(idOrSlug: string) {
    const word = await this.prisma.rakiTenyWord.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!word) {
      throw new NotFoundException(
        `Mot rare introuvable pour l'identifiant : ${idOrSlug}`,
      );
    }

    return word;
  }

  async getDailyWord() {
    const total = await this.prisma.rakiTenyWord.count({
      where: { status: 'PUBLISHED' },
    });

    if (total === 0) {
      throw new NotFoundException('Aucun mot rare disponible dans la base.');
    }

    const today = new Date();
    const dayIndex = Math.floor(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).getTime() /
        (1000 * 60 * 60 * 24),
    );
    const skip = Math.abs(dayIndex) % total;

    const words = await this.prisma.rakiTenyWord.findMany({
      where: { status: 'PUBLISHED' },
      skip,
      take: 1,
      orderBy: { createdAt: 'asc' },
    });

    return words[0];
  }

  async create(data: CreateRakiTenyDto) {
    const baseSlug = slugify(data.word);
    let uniqueSlug = baseSlug;
    let count = 1;

    while (
      await this.prisma.rakiTenyWord.findUnique({
        where: { slug: uniqueSlug },
      })
    ) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const word = await this.prisma.rakiTenyWord.create({
      data: {
        slug: uniqueSlug,
        word: data.word.trim(),
        phonetic: data.phonetic?.trim() || null,
        category: data.category?.trim() || 'nature_temps',
        wordClassMg: data.wordClassMg.trim(),
        wordClassFr: data.wordClassFr.trim(),
        rarity: data.rarity || 'VERY_RARE',
        rarityLabelMg: data.rarityLabelMg.trim(),
        rarityLabelFr: data.rarityLabelFr.trim(),
        meaningMg: data.meaningMg.trim(),
        meaningFr: data.meaningFr.trim(),
        exampleMg: data.exampleMg.trim(),
        exampleFr: data.exampleFr.trim(),
        contextUsage: data.contextUsage?.trim() || '',
        etymology: data.etymology?.trim() || null,
        audioUrl: data.audioUrl?.trim() || null,
        isFeatured: data.isFeatured ?? false,
        status: data.status || 'PUBLISHED',
      },
    });

    this.logger.log(`Nouveau mot rare créé : ${word.word} (${word.id})`);
    return word;
  }

  async update(id: string, data: UpdateRakiTenyDto) {
    await this.findOne(id);

    const updateData: Prisma.RakiTenyWordUpdateInput = {};

    if (data.word !== undefined) {
      updateData.word = data.word.trim();
      updateData.slug = slugify(data.word);
    }
    if (data.phonetic !== undefined) {
      updateData.phonetic = data.phonetic?.trim() || null;
    }
    if (data.category !== undefined) {
      updateData.category = data.category?.trim() || 'nature_temps';
    }
    if (data.wordClassMg !== undefined) {
      updateData.wordClassMg = data.wordClassMg.trim();
    }
    if (data.wordClassFr !== undefined) {
      updateData.wordClassFr = data.wordClassFr.trim();
    }
    if (data.rarity !== undefined) {
      updateData.rarity = data.rarity;
    }
    if (data.rarityLabelMg !== undefined) {
      updateData.rarityLabelMg = data.rarityLabelMg.trim();
    }
    if (data.rarityLabelFr !== undefined) {
      updateData.rarityLabelFr = data.rarityLabelFr.trim();
    }
    if (data.meaningMg !== undefined) {
      updateData.meaningMg = data.meaningMg.trim();
    }
    if (data.meaningFr !== undefined) {
      updateData.meaningFr = data.meaningFr.trim();
    }
    if (data.exampleMg !== undefined) {
      updateData.exampleMg = data.exampleMg.trim();
    }
    if (data.exampleFr !== undefined) {
      updateData.exampleFr = data.exampleFr.trim();
    }
    if (data.contextUsage !== undefined) {
      updateData.contextUsage = data.contextUsage.trim();
    }
    if (data.etymology !== undefined) {
      updateData.etymology = data.etymology?.trim() || null;
    }
    if (data.audioUrl !== undefined) {
      updateData.audioUrl = data.audioUrl?.trim() || null;
    }
    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const updated = await this.prisma.rakiTenyWord.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Mot rare mis à jour : ${updated.word} (${updated.id})`);
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.rakiTenyWord.delete({
      where: { id },
    });
    this.logger.log(`Mot rare supprimé : ${deleted.word} (${deleted.id})`);
    return {
      success: true,
      message: `Mot "${deleted.word}" supprimé avec succès.`,
    };
  }

  async incrementView(id: string) {
    return await this.prisma.rakiTenyWord.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true },
    });
  }

  async incrementLike(id: string) {
    return await this.prisma.rakiTenyWord.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
      select: { id: true, likesCount: true },
    });
  }
}
