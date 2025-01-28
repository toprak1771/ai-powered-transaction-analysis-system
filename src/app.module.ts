import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NormalizationModule } from './normalization/normalization.module';
import { PatternDetectionModule } from './pattern_detection/pattern_detection.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [NormalizationModule,ConfigModule.forRoot({isGlobal:true}), PatternDetectionModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
