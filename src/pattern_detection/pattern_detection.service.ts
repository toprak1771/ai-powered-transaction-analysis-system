import { Injectable } from '@nestjs/common';
import { CreatePatternDetectionDto } from './dto/create-pattern_detection.dto';
import { UpdatePatternDetectionDto } from './dto/update-pattern_detection.dto';
import { PrismaClient,DetectedPatterns } from '@prisma/client';
import { ResultPatternDetection } from 'src/types/ai.type';

@Injectable()
export class PatternDetectionService {
  private prisma:PrismaClient;
  private detectedPattern:PrismaClient['detectedPatterns'];
  constructor(prismaClient:PrismaClient){
    this.prisma = prismaClient;
    this.detectedPattern = this.prisma.detectedPatterns;
  }

  async createMany(createPatternDetection:ResultPatternDetection[]):Promise<DetectedPatterns[]> {
    try {
      const createdManyPatterDetection:DetectedPatterns[] = await this.detectedPattern.createManyAndReturn({
        data:createPatternDetection
      });
  
      return createdManyPatterDetection;
    } catch (error:any) {
      console.log("error:",error);
    }
   
  }

  create(createPatternDetectionDto: CreatePatternDetectionDto) {
    return 'This action adds a new patternDetection';
  }

  async findAll():Promise<DetectedPatterns[]> {
    try {
      const getAllDetectedPatterns: DetectedPatterns[] = await this.detectedPattern.findMany({});
      return getAllDetectedPatterns;
    } catch (error) {
      console.log("error:",error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} patternDetection`;
  }

  update(id: number, updatePatternDetectionDto: UpdatePatternDetectionDto) {
    return `This action updates a #${id} patternDetection`;
  }

  remove(id: number) {
    return `This action removes a #${id} patternDetection`;
  }
}
