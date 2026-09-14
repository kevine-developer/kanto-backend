import { Test, TestingModule } from '@nestjs/testing';
import { RiddleService } from './riddle.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('RiddleService', () => {
  let service: RiddleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiddleService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RiddleService>(RiddleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
