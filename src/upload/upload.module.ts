import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Multer } from 'src/services/multer';
import { AIService } from 'src/services/ai_service';
import { NormalizationModule } from 'src/normalization/normalization.module';
import { PatternDetectionModule } from 'src/pattern_detection/pattern_detection.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[NormalizationModule,PatternDetectionModule,UserModule],
  controllers: [UploadController],
  providers: [UploadService,Multer,AIService],
})
export class UploadModule {}
