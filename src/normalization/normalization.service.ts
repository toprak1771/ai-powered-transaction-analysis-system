import { Injectable } from '@nestjs/common';
import { CreateNormalizationDto } from './dto/create-normalization.dto';
import { UpdateNormalizationDto } from './dto/update-normalization.dto';

@Injectable()
export class NormalizationService {
  create(createNormalizationDto: CreateNormalizationDto) {
    return 'This action adds a new normalization';
  }

  findAll() {
    return `This action returns all normalization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} normalization`;
  }

  update(id: number, updateNormalizationDto: UpdateNormalizationDto) {
    return `This action updates a #${id} normalization`;
  }

  remove(id: number) {
    return `This action removes a #${id} normalization`;
  }
}
