import { Test, TestingModule } from '@nestjs/testing';
import { NormalizationController } from './normalization.controller';
import { NormalizationService } from './normalization.service';

describe('NormalizationController', () => {
  let controller: NormalizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormalizationController],
      providers: [NormalizationService],
    }).compile();

    controller = module.get<NormalizationController>(NormalizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
