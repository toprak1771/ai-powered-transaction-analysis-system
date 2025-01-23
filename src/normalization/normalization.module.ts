import { Module } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { AIService } from 'src/services/ai_service';
import { NormalizationController } from './normalization.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [NormalizationController],
  providers: [NormalizationService,AIService,PrismaClient],
})
export class NormalizationModule {}
