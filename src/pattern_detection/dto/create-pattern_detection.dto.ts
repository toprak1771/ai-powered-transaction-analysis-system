import { IsNotEmpty, IsString, IsNumber,IsArray,ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreatePatternDetectionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}

export class CreatePatternDetectionTransactionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatternDetectionDto)
  transactions: CreatePatternDetectionDto[];
}