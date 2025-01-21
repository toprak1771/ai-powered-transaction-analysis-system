import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatternDetectionService } from './pattern_detection.service';
import { CreatePatternDetectionDto,CreatePatternDetectionTransactionsDto } from './dto/create-pattern_detection.dto';
import { UpdatePatternDetectionDto } from './dto/update-pattern_detection.dto';
import { AIService } from 'src/services/ai_service';

@Controller('pattern-detection')
export class PatternDetectionController {
  constructor(private readonly patternDetectionService: PatternDetectionService,private readonly aiService:AIService) {}

  @Post()
  async create(@Body() createPatternDetectionDto: CreatePatternDetectionTransactionsDto) {
    console.log("createPatternDetectionDto:",createPatternDetectionDto);
    const patterns = await this.aiService.detectPatternWithAI(createPatternDetectionDto.transactions);
    console.log("patterns:",patterns);
    //return this.patternDetectionService.create(createPatternDetectionDto);
  }

  @Get()
  findAll() {
    return this.patternDetectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patternDetectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatternDetectionDto: UpdatePatternDetectionDto) {
    return this.patternDetectionService.update(+id, updatePatternDetectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patternDetectionService.remove(+id);
  }
}
