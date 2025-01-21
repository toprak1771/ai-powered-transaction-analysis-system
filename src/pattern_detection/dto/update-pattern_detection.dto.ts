import { PartialType } from '@nestjs/mapped-types';
import { CreatePatternDetectionDto } from './create-pattern_detection.dto';

export class UpdatePatternDetectionDto extends PartialType(CreatePatternDetectionDto) {}
