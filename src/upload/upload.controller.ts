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
import { UploadService } from "./upload.service";
import { CreateUploadDto } from "./dto/create-upload.dto";
import { UpdateUploadDto } from "./dto/update-upload.dto";
import { Multer } from "src/services/multer";
import XLSX from "xlsx";
import { convertExcelDateToJSDate } from "src/utils/date";
import { AIService } from "src/services/ai_service";
import { NormalizationService } from "src/normalization/normalization.service";
import { PatternDetectionService } from "src/pattern_detection/pattern_detection.service";
import { UserService } from "src/user/user.service";
import { ResultPatternDetection, Transaction } from "src/types/ai.type";
import { DetectedPatterns, Normalization, User } from "@prisma/client";
import { CreateNormalizationAiwithDesc } from "src/normalization/entities/normalization.entity";
import { CreateUser } from "src/user/entities/user.entity";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly multerService: Multer,
    private readonly aiService: AIService,
    private readonly normalizationService: NormalizationService,
    private readonly patternDetectionService: PatternDetectionService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() createUploadDto: CreateUploadDto,
    @Req() request,
    @Res() res,
    @Next() next,
  ) {
    try {
      const uploadFiles: any = await this.multerService.handleArrayUploadFile(
        request,
        res,
        "dataset",
      );

      const workbook = XLSX.readFile(uploadFiles.files[0].path);

      const sheetName = workbook.SheetNames[0];

      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const convertedData = dataExcel.map((item: any) => ({
        ...item,
        date: convertExcelDateToJSDate(item.date),
      }));

      const createdUser: CreateUser = {};
      let total_spend: number = 0;
      const merchantsArray: any = [];
      for (const transation of convertedData) {
        total_spend += transation.amount;
        if (!merchantsArray.includes(transation.description)) {
          merchantsArray.push(transation.description);
        }
      }

      createdUser.transactions = convertedData.length;
      createdUser.total_spend = Number(total_spend.toFixed(2));
      createdUser.average_transactions = Number(
        (createdUser.total_spend / createdUser.transactions).toFixed(2),
      );
      createdUser.merchants = merchantsArray.length;

      const _createdUser: User = await this.userService.create(createdUser);

      const normalizationData: CreateNormalizationAiwithDesc[] =
        await this.aiService.normalizeTransactionArray(convertedData);

      const createdNormalizationData: Normalization[] =
        await this.normalizationService.createMany(normalizationData);

      const patternsData: ResultPatternDetection[] =
        await this.aiService.detectPatternWithAI(convertedData);

      const cratedPatternsData: DetectedPatterns[] =
        await this.patternDetectionService.createMany(patternsData);

      res
        .status(200)
        .json({ message: "Added csv file and detected patterns succesfully." });
      return;
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.uploadService.remove(+id);
  }
}
