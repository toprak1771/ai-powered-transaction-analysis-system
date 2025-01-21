import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseArrayPipe, ValidationPipe } from '@nestjs/common';
import { CreatePatternDetectionDto } from './pattern_detection/dto/create-pattern_detection.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}));
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
