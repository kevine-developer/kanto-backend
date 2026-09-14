import { Test, TestingModule } from '@nestjs/testing';
import { VintanaService } from './vintana.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('VintanaService', () => {
  let service: VintanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VintanaService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VintanaService>(VintanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
