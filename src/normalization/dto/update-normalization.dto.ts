import { PartialType } from '@nestjs/mapped-types';
import { CreateNormalizationDto } from './create-normalization.dto';

export class UpdateNormalizationDto extends PartialType(CreateNormalizationDto) {}
