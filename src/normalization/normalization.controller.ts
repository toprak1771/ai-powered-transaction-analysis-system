import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Next,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { NormalizationService } from "./normalization.service";
import { CreateNormalizationDto } from "./dto/create-normalization.dto";
import { UpdateNormalizationDto } from "./dto/update-normalization.dto";
import { CreateNormalizationAi } from "./entities/normalization.entity";
import { AIService } from "src/services/ai_service";
import { Normalization, Prisma, PrismaClient } from "@prisma/client";

@Controller("analyze")
export class NormalizationController {
  private readonly _normalizationService: NormalizationService;
  constructor(
    private readonly normalizationService: NormalizationService,
    private readonly aiService: AIService,
  ) {
    this._normalizationService = new NormalizationService(new PrismaClient());
  }

  @Post('merchant')
  async create(
    @Body() createNormalizationDto: CreateNormalizationDto,
    @Req() request,
    @Res() res,
    @Next() next,
  ): Promise<void> {
    try {
      const response: CreateNormalizationAi =
      await this.aiService.normalizeTransaction(createNormalizationDto);

    const createdNormalization: Normalization =
      await this.normalizationService.create({
        description: createNormalizationDto.description,
        ...response,
      });
    return res.status(201).json({
      data: createdNormalization,
      message: "Successfully created normalization data.",
    });
    } catch (error:any) {
      console.log("error:",error.message);
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
    }
 
  }

  @Get("merchant")
  async findAll( @Req() request,
  @Res() res,
  @Next() next,):Promise<void> {
    try {
      const getAllNormalization:Normalization[] = await this._normalizationService.findAll();
      return res.status(200).json({
        data:getAllNormalization
      })
    } catch (error:any) {
      console.log("error:",error.message);
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
    }
  }

}
