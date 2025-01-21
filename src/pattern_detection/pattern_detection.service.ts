import { Injectable } from '@nestjs/common';
import { CreatePatternDetectionDto } from './dto/create-pattern_detection.dto';
import { UpdatePatternDetectionDto } from './dto/update-pattern_detection.dto';

@Injectable()
export class PatternDetectionService {
  create(createPatternDetectionDto: CreatePatternDetectionDto) {
    return 'This action adds a new patternDetection';
  }

  findAll() {
    return `This action returns all patternDetection`;
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
