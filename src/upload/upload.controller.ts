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
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { CreateUploadDto } from "./dto/create-upload.dto";
import { UpdateUploadDto } from "./dto/update-upload.dto";
import { Multer } from "src/services/multer";
import XLSX from "xlsx";
import { convertExcelDateToJSDate } from "src/utils/date";
import { AIService } from "src/services/ai_service";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly multerService: Multer,
    private readonly aiService: AIService,
  ) {}

  @Post()
  async create(
    @Body() createUploadDto: CreateUploadDto,
    @Req() request,
    @Res() res,
    @Next() next,
  ) {
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
    const patternsData:any = await this.aiService.detectPatternWithAI(convertedData);
    const normalizationData:any = await this.aiService.normalizeTransactionArray(convertedData);
    console.log("patternsData:",patternsData);
    console.log("normalizationData:",normalizationData);
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
