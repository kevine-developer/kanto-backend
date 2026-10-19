import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RakiTenyService } from './raki-teny.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';

describe('RakiTenyService', () => {
  let service: RakiTenyService;
  let prismaMock: PrismaMock;

  const sampleWord = {
    id: 'somambisamby-id',
    slug: 'somambisamby',
    word: 'Somambisamby',
    phonetic: 'sou-mam-bi-sam-by',
    category: 'nature_temps',
    wordClassMg: 'Mpamari-toetra',
    wordClassFr: 'Adjectif',
    rarity: 'POETIC',
    rarityLabelMg: 'Haisoratra & Kanto',
    rarityLabelFr: 'Poétique & Évocateur',
    meaningMg: 'Fotoana manalasala eo anelanelan ny mazava sy ny maizina',
    meaningFr: 'Le crépuscule ou la pénombre douce',
    exampleMg: 'Mody an-tanàna ny mpamboly rehefa somambisamby.',
    exampleFr: 'Les paysans rentrent au village au crépuscule.',
    contextUsage: 'Poésie et littérature',
    etymology: 'Avy amin ny somambo',
    isFeatured: true,
    viewCount: 12,
    likesCount: 5,
    status: 'PUBLISHED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RakiTenyService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RakiTenyService>(RakiTenyService);
  });

  describe('create', () => {
    it('devrait créer un nouveau mot rare et générer son slug', async () => {
      prismaMock.rakiTenyWord.findUnique.mockResolvedValue(null);
      prismaMock.rakiTenyWord.create.mockResolvedValue(sampleWord);

      const result = await service.create({
        word: 'Somambisamby',
        phonetic: 'sou-mam-bi-sam-by',
        category: 'nature_temps',
        wordClassMg: 'Mpamari-toetra',
        wordClassFr: 'Adjectif',
        rarity: 'POETIC' as any,
        rarityLabelMg: 'Haisoratra & Kanto',
        rarityLabelFr: 'Poétique & Évocateur',
        meaningMg: 'Fotoana manalasala...',
        meaningFr: 'Le crépuscule...',
        exampleMg: 'Mody...',
        exampleFr: 'Les paysans...',
        contextUsage: 'Poésie et récits littéraires',
      });

      expect(result).toEqual(sampleWord);
      expect(prismaMock.rakiTenyWord.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('devrait retourner les mots avec pagination', async () => {
      prismaMock.rakiTenyWord.count.mockResolvedValue(1);
      prismaMock.rakiTenyWord.findMany.mockResolvedValue([sampleWord]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([sampleWord]);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('devrait appliquer le filtre alphabétique letter', async () => {
      prismaMock.rakiTenyWord.count.mockResolvedValue(1);
      prismaMock.rakiTenyWord.findMany.mockResolvedValue([sampleWord]);

      const result = await service.findAll({ letter: 'S' });

      expect(result.data).toHaveLength(1);
      expect(prismaMock.rakiTenyWord.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            word: { startsWith: 'S', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner le mot par id ou slug', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(sampleWord);

      const result = await service.findOne('somambisamby');

      expect(result).toEqual(sampleWord);
      expect(prismaMock.rakiTenyWord.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ id: 'somambisamby' }, { slug: 'somambisamby' }],
        },
      });
    });

    it('devrait lever NotFoundException si le mot n existe pas', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(null);

      await expect(service.findOne('inconnu')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour le mot', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(sampleWord);
      prismaMock.rakiTenyWord.update.mockResolvedValue({
        ...sampleWord,
        meaningFr: 'Nouveau sens',
      });

      const result = await service.update(sampleWord.id, {
        meaningFr: 'Nouveau sens',
      });

      expect(result.meaningFr).toBe('Nouveau sens');
      expect(prismaMock.rakiTenyWord.update).toHaveBeenCalledTimes(1);
    });

    it('devrait lever NotFoundException si le mot à modifier est introuvable', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(null);

      await expect(
        service.update('inexistant', { meaningFr: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer le mot existant', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(sampleWord);
      prismaMock.rakiTenyWord.delete.mockResolvedValue(sampleWord);

      const result = await service.remove(sampleWord.id);

      expect(result.success).toBe(true);
      expect(prismaMock.rakiTenyWord.delete).toHaveBeenCalledWith({
        where: { id: sampleWord.id },
      });
    });

    it('devrait lever NotFoundException si le mot à supprimer est introuvable', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(null);

      await expect(service.remove('inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('incrementView & incrementLike', () => {
    it('devrait incrémenter le compteur de vues', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(sampleWord);
      prismaMock.rakiTenyWord.update.mockResolvedValue({
        ...sampleWord,
        viewCount: 13,
      });

      const result = await service.incrementView(sampleWord.id);

      expect(result.viewCount).toBe(13);
      expect(prismaMock.rakiTenyWord.update).toHaveBeenCalledWith({
        where: { id: sampleWord.id },
        data: { viewCount: { increment: 1 } },
        select: { id: true, viewCount: true },
      });
    });

    it('devrait incrémenter le compteur de likes', async () => {
      prismaMock.rakiTenyWord.findFirst.mockResolvedValue(sampleWord);
      prismaMock.rakiTenyWord.update.mockResolvedValue({
        ...sampleWord,
        likesCount: 6,
      });

      const result = await service.incrementLike(sampleWord.id);

      expect(result.likesCount).toBe(6);
      expect(prismaMock.rakiTenyWord.update).toHaveBeenCalledWith({
        where: { id: sampleWord.id },
        data: { likesCount: { increment: 1 } },
        select: { id: true, likesCount: true },
      });
    });
  });
});
