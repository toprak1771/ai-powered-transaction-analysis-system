import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { CreateNormalizationDto } from './dto/create-normalization.dto';
import { UpdateNormalizationDto } from './dto/update-normalization.dto';
import { AIService } from 'src/services/ai_service';

@Controller('normalization')
export class NormalizationController {
  constructor(private readonly normalizationService: NormalizationService,private readonly aiService:AIService) {}

  @Post()
  async create(@Body() createNormalizationDto: CreateNormalizationDto) {
    console.log("createNormalizationDto:",createNormalizationDto);
    const response = await this.aiService.normalizeTransaction(createNormalizationDto);
    return this.normalizationService.create(createNormalizationDto);
  }

  @Get()
  findAll() {
    return this.normalizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.normalizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNormalizationDto: UpdateNormalizationDto) {
    return this.normalizationService.update(+id, updateNormalizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.normalizationService.remove(+id);
  }
}
