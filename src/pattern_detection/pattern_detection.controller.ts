import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Next,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PatternDetectionService } from "./pattern_detection.service";
import { CreatePatternDetectionTransactionsDto } from "./dto/create-pattern_detection.dto";
import { UpdatePatternDetectionDto } from "./dto/update-pattern_detection.dto";
import { AIService } from "src/services/ai_service";
import { ResultPatternDetection } from "src/types/ai.type";
import { DetectedPatterns } from "@prisma/client";

@Controller("analyze")
export class PatternDetectionController {
  constructor(
    private readonly patternDetectionService: PatternDetectionService,
    private readonly aiService: AIService,
  ) {}

  @Post("patterns")
  async create(
    @Body()
    CreatePatternDetectionTransactionsDto: CreatePatternDetectionTransactionsDto,
    @Req() request,
    @Res() res,
    @Next() next,
  ) {
    try {
      const patterns: ResultPatternDetection[] =
        await this.aiService.detectPatternWithAI(
          CreatePatternDetectionTransactionsDto.transactions,
        );

      const createdPatterns: DetectedPatterns[] =
        await this.patternDetectionService.createMany(patterns);
      return res.status(201).json({
        data: createdPatterns,
      });
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("patterns")
  async findAll(@Req() request, @Res() res, @Next() next): Promise<void> {
    try {
      const getAllDetectedPatterns: DetectedPatterns[] =
        await this.patternDetectionService.findAll();
      return res.status(200).json({
        data: getAllDetectedPatterns,
      });
    } catch (error) {
      console.log("error:", error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
