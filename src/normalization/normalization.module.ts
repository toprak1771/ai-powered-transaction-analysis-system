import { Module } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { AIService } from 'src/services/ai_service';
import { NormalizationController } from './normalization.controller';

@Module({
  controllers: [NormalizationController],
  providers: [NormalizationService,AIService],
})
export class NormalizationModule {}
