import { Test, TestingModule } from '@nestjs/testing';
import { PatternDetectionController } from './pattern_detection.controller';
import { PatternDetectionService } from './pattern_detection.service';

describe('PatternDetectionController', () => {
  let controller: PatternDetectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatternDetectionController],
      providers: [PatternDetectionService],
    }).compile();

    controller = module.get<PatternDetectionController>(PatternDetectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
