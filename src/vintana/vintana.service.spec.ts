import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VintanaService } from './vintana.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  createPrismaMock,
  type PrismaMock,
} from '../test-utils/mock-prisma.factory.js';
import {
  buildVintanaSign,
  buildVintanaForecast,
} from '../test-utils/builders/session.builder.js';

describe('VintanaService', () => {
  let service: VintanaService;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VintanaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<VintanaService>(VintanaService);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getAllSigns
  // ─────────────────────────────────────────────────────────────────────────

  describe('getAllSigns', () => {
    it('should return all zodiac signs', async () => {
      const signs = [buildVintanaSign(), buildVintanaSign()];
      prismaMock.vintanaSign.findMany.mockResolvedValue(signs);

      const result = await service.getAllSigns();

      expect(result).toEqual(signs);
      expect(prismaMock.vintanaSign.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no signs exist', async () => {
      prismaMock.vintanaSign.findMany.mockResolvedValue([]);

      const result = await service.getAllSigns();

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getSign
  // ─────────────────────────────────────────────────────────────────────────

  describe('getSign', () => {
    it('should return the sign when it exists', async () => {
      const sign = buildVintanaSign({ id: 'sign-alahamady' });
      prismaMock.vintanaSign.findUnique.mockResolvedValue(sign);

      const result = await service.getSign('sign-alahamady');

      expect(result).toEqual(sign);
      expect(prismaMock.vintanaSign.findUnique).toHaveBeenCalledWith({
        where: { id: 'sign-alahamady' },
      });
    });

    it('should throw NotFoundException when sign does not exist', async () => {
      prismaMock.vintanaSign.findUnique.mockResolvedValue(null);

      await expect(service.getSign('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException with meaningful message', async () => {
      prismaMock.vintanaSign.findUnique.mockResolvedValue(null);

      try {
        await service.getSign('bad-id');
      } catch (err) {
        expect((err as NotFoundException).message).toContain('Sign not found');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getTodayForecasts
  // ─────────────────────────────────────────────────────────────────────────

  describe('getTodayForecasts', () => {
    it('should return existing forecasts when all signs have forecasts', async () => {
      const sign1 = buildVintanaSign({ id: 'sign-1' });
      const sign2 = buildVintanaSign({ id: 'sign-2' });
      const forecasts = [
        buildVintanaForecast('sign-1'),
        buildVintanaForecast('sign-2'),
      ];

      prismaMock.vintanaForecast.findMany.mockResolvedValue(forecasts);
      prismaMock.vintanaSign.findMany.mockResolvedValue([sign1, sign2]);

      const result = await service.getTodayForecasts();

      expect(result).toHaveLength(2);
      // Aucune création nécessaire car tous les signes ont déjà un forecast
      expect(prismaMock.vintanaForecast.create).not.toHaveBeenCalled();
    });

    it('should generate forecasts for signs that have no forecast today', async () => {
      const sign1 = buildVintanaSign({ id: 'sign-1' });
      const sign2 = buildVintanaSign({ id: 'sign-2', nameMg: 'Adaoro' });
      const existingForecast = buildVintanaForecast('sign-1');
      const newForecast = buildVintanaForecast('sign-2');

      // Seulement sign-1 a un forecast existant
      prismaMock.vintanaForecast.findMany.mockResolvedValue([existingForecast]);
      prismaMock.vintanaSign.findMany.mockResolvedValue([sign1, sign2]);
      prismaMock.vintanaForecast.create.mockResolvedValue(newForecast);

      const result = await service.getTodayForecasts();

      // Forecast créé pour sign-2
      expect(prismaMock.vintanaForecast.create).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
    });

    it('should generate all forecasts when none exist today', async () => {
      const signs = [
        buildVintanaSign({ id: 'sign-1', nameMg: 'Alahamady' }),
        buildVintanaSign({ id: 'sign-2', nameMg: 'Adaoro' }),
        buildVintanaSign({ id: 'sign-3', nameMg: 'Adizaoza' }),
      ];
      const generatedForecasts = signs.map((s) => buildVintanaForecast(s.id));

      prismaMock.vintanaForecast.findMany.mockResolvedValue([]); // Aucun forecast existant
      prismaMock.vintanaSign.findMany.mockResolvedValue(signs);
      prismaMock.vintanaForecast.create
        .mockResolvedValueOnce(generatedForecasts[0])
        .mockResolvedValueOnce(generatedForecasts[1])
        .mockResolvedValueOnce(generatedForecasts[2]);

      const result = await service.getTodayForecasts();

      expect(prismaMock.vintanaForecast.create).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
    });

    it('should include sign relation in generated forecast', async () => {
      const sign = buildVintanaSign({ id: 'sign-1' });
      prismaMock.vintanaForecast.findMany.mockResolvedValue([]);
      prismaMock.vintanaSign.findMany.mockResolvedValue([sign]);
      prismaMock.vintanaForecast.create.mockResolvedValue(
        buildVintanaForecast('sign-1'),
      );

      await service.getTodayForecasts();

      expect(prismaMock.vintanaForecast.create).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { sign: true },
        }),
      );
    });

    it('should include mood in generated forecast', async () => {
      const sign = buildVintanaSign({ id: 'sign-1' });
      prismaMock.vintanaForecast.findMany.mockResolvedValue([]);
      prismaMock.vintanaSign.findMany.mockResolvedValue([sign]);
      prismaMock.vintanaForecast.create.mockResolvedValue(
        buildVintanaForecast('sign-1'),
      );

      await service.getTodayForecasts();

      expect(prismaMock.vintanaForecast.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ mood: 'Positif' }),
        }),
      );
    });

    it('should return an empty array when no signs exist (no forecasts, no signs)', async () => {
      prismaMock.vintanaForecast.findMany.mockResolvedValue([]);
      prismaMock.vintanaSign.findMany.mockResolvedValue([]);

      const result = await service.getTodayForecasts();

      expect(result).toHaveLength(0);
      expect(prismaMock.vintanaForecast.create).not.toHaveBeenCalled();
    });

    /**
     * TEST DE RÉGRESSION — Bug #4
     * La génération des forecasts n'est pas dans une transaction.
     * Deux requêtes simultanées peuvent créer des doublons de forecasts par signe.
     *
     * Ce test documente le comportement attendu (race condition non couverte).
     * Recommandation : envelopper la vérification+création dans une transaction Prisma
     * ou utiliser upsert avec une contrainte unique sur (signId, date).
     */
    it('[BUG #4] should not create duplicate forecasts when signs already have one (non-atomic risk)', async () => {
      const sign = buildVintanaSign({ id: 'sign-1' });
      const existing = buildVintanaForecast('sign-1');

      prismaMock.vintanaForecast.findMany.mockResolvedValue([existing]);
      prismaMock.vintanaSign.findMany.mockResolvedValue([sign]);

      const result = await service.getTodayForecasts();

      // Le cas nominal est correct : pas de création si déjà existant
      expect(prismaMock.vintanaForecast.create).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);

      // ⚠️ Risque : si deux requêtes arrivent en même temps avant création,
      // les deux peuvent passer la vérification `forecasts.length < signs.length`
      // et créer deux fois le même forecast (violation de contrainte possible).
      // Fix recommandé : transaction + upsert avec unique(signId, date).
    });
  });
});
