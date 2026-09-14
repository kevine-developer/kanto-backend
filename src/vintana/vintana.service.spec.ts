import { Test, TestingModule } from '@nestjs/testing';
import { VintanaService } from './vintana.service.js';

describe('VintanaService', () => {
  let service: VintanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VintanaService],
    }).compile();

    service = module.get<VintanaService>(VintanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
