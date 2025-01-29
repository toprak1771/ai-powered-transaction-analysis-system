import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateNormalizationServices } from "./dto/create-normalization.dto";
import { Normalization, PrismaClient } from "@prisma/client";
import { UpdateNormalizationDto } from "./dto/update-normalization.dto";

@Injectable()
export class NormalizationService {
  private prisma: PrismaClient;
  public normalization: PrismaClient["normalization"];

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
    this.normalization = this.prisma.normalization;
  }

  async create(
    createNormalizationServices: CreateNormalizationServices,
  ): Promise<Normalization> {
    try {
      const createdNormalization: Normalization =
        await this.normalization.create({
          data: createNormalizationServices,
        });
      return createdNormalization;
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createMany(
    createNormalizationMany: CreateNormalizationServices[],
  ): Promise<Normalization[]> {
    try {
      const createdNormalizationMany: Normalization[] =
        await this.normalization.createManyAndReturn({
          data: createNormalizationMany,
        });

      return createdNormalizationMany;
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Normalization[]> {
    try {
      const getAllNormalization: Normalization[] =
        await this.normalization.findMany();
      return getAllNormalization;
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
