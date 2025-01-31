import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseArrayPipe, ValidationPipe } from '@nestjs/common';
import { CreatePatternDetectionDto } from './pattern_detection/dto/create-pattern_detection.dto';
import * as dotenv from "dotenv";

dotenv.config();
async function bootstrap() {


  const app = await NestFactory.create(AppModule);

  console.log('OPEN_AI_KEY:', process.env.OPEN_AI_KEY ? 'Yüklendi' : 'Tanımsız');

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}));
  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
