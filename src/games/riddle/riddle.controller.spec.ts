import { Test, TestingModule } from '@nestjs/testing';
import { RiddleController } from './riddle.controller.js';
import { RiddleService } from './riddle.service.js';

describe('RiddleController', () => {
  let controller: RiddleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiddleController],
      providers: [
        {
          provide: RiddleService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RiddleController>(RiddleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
