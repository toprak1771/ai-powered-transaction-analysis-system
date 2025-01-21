import { Test, TestingModule } from '@nestjs/testing';
import { PatternDetectionService } from './pattern_detection.service';

describe('PatternDetectionService', () => {
  let service: PatternDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatternDetectionService],
    }).compile();

    service = module.get<PatternDetectionService>(PatternDetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
