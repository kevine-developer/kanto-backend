import { Test, TestingModule } from '@nestjs/testing';
import { VintanaController } from './vintana.controller.js';

describe('VintanaController', () => {
  let controller: VintanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VintanaController],
    }).compile();

    controller = module.get<VintanaController>(VintanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
