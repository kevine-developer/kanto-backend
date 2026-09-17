import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VintanaController } from './vintana.controller.js';
import { VintanaService } from './vintana.service.js';
import {
  buildVintanaSign,
  buildVintanaForecast,
} from '../test-utils/builders/session.builder.js';

describe('VintanaController', () => {
  let controller: VintanaController;
  let vintanaServiceMock: {
    getAllSigns: jest.Mock<(...args: any[]) => Promise<any>>;
    getSign: jest.Mock<(...args: any[]) => Promise<any>>;
    getTodayForecasts: jest.Mock<(...args: any[]) => Promise<any>>;
  };

  beforeEach(async () => {
    vintanaServiceMock = {
      getAllSigns: jest.fn<(...args: any[]) => Promise<any>>(),
      getSign: jest.fn<(...args: any[]) => Promise<any>>(),
      getTodayForecasts: jest.fn<(...args: any[]) => Promise<any>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VintanaController],
      providers: [{ provide: VintanaService, useValue: vintanaServiceMock }],
    }).compile();

    controller = module.get<VintanaController>(VintanaController);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getAllSigns
  // ─────────────────────────────────────────────────────────────────────────

  describe('getAllSigns', () => {
    it('should return all zodiac signs from service', async () => {
      const signs = [buildVintanaSign(), buildVintanaSign()];
      vintanaServiceMock.getAllSigns.mockResolvedValue(signs);

      const result = await controller.getAllSigns();

      expect(vintanaServiceMock.getAllSigns).toHaveBeenCalledTimes(1);
      expect(result).toBe(signs);
    });

    it('should return empty array when no signs exist', async () => {
      vintanaServiceMock.getAllSigns.mockResolvedValue([]);

      const result = await controller.getAllSigns();

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getTodayForecast
  // ─────────────────────────────────────────────────────────────────────────

  describe('getTodayForecast', () => {
    it('should return today forecasts from service', async () => {
      const forecasts = [
        buildVintanaForecast('sign-1'),
        buildVintanaForecast('sign-2'),
      ];
      vintanaServiceMock.getTodayForecasts.mockResolvedValue(forecasts);

      const result = await controller.getTodayForecast();

      expect(vintanaServiceMock.getTodayForecasts).toHaveBeenCalledTimes(1);
      expect(result).toBe(forecasts);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getSign
  // ─────────────────────────────────────────────────────────────────────────

  describe('getSign', () => {
    it('should return the sign when found', async () => {
      const sign = buildVintanaSign({ id: 'sign-alahamady' });
      vintanaServiceMock.getSign.mockResolvedValue(sign);

      const result = await controller.getSign('sign-alahamady');

      expect(vintanaServiceMock.getSign).toHaveBeenCalledWith('sign-alahamady');
      expect(result).toBe(sign);
    });

    it('should propagate NotFoundException from service', async () => {
      vintanaServiceMock.getSign.mockRejectedValue(
        new NotFoundException('Sign not found'),
      );

      await expect(controller.getSign('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should pass the id param directly to the service', async () => {
      const testId = 'some-uuid-1234';
      vintanaServiceMock.getSign.mockResolvedValue(
        buildVintanaSign({ id: testId }),
      );

      await controller.getSign(testId);

      expect(vintanaServiceMock.getSign).toHaveBeenCalledWith(testId);
    });
  });
});
