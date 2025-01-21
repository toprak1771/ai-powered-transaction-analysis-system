import { Module } from '@nestjs/common';
import { PatternDetectionService } from './pattern_detection.service';
import { PatternDetectionController } from './pattern_detection.controller';
import { AIService } from 'src/services/ai_service';

@Module({
  controllers: [PatternDetectionController],
  providers: [PatternDetectionService,AIService],
})
export class PatternDetectionModule {}
