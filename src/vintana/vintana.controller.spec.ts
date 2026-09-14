import { Test, TestingModule } from '@nestjs/testing';
import { VintanaController } from './vintana.controller.js';
import { VintanaService } from './vintana.service.js';

describe('VintanaController', () => {
  let controller: VintanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VintanaController],
      providers: [
        {
          provide: VintanaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<VintanaController>(VintanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
