import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Multer } from 'src/services/multer';
import { AIService } from 'src/services/ai_service';

@Module({
  controllers: [UploadController],
  providers: [UploadService,Multer,AIService],
})
export class UploadModule {}
