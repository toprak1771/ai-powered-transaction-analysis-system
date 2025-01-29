import { Module } from '@nestjs/common';
import { PatternDetectionService } from './pattern_detection.service';
import { PatternDetectionController } from './pattern_detection.controller';
import { AIService } from 'src/services/ai_service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PatternDetectionController],
  providers: [PatternDetectionService,AIService,PrismaClient],
  exports: [PatternDetectionService]
})
export class PatternDetectionModule {}
