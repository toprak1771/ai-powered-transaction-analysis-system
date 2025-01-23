import { Injectable } from '@nestjs/common';
import { CreateNormalizationServices } from './dto/create-normalization.dto';
import { Prisma,Normalization, PrismaClient } from '@prisma/client';
import { UpdateNormalizationDto } from './dto/update-normalization.dto';


@Injectable()
export class NormalizationService {
  private prisma:PrismaClient;
  public normalization:PrismaClient['normalization'];

  constructor(prismaClient:PrismaClient){
    this.prisma = prismaClient || new PrismaClient();
    this.normalization = this.prisma.normalization;
  }

  async create(createNormalizationServices: CreateNormalizationServices):Promise<Normalization> {
    const createdNormalization:Normalization = await this.normalization.create({
      data:createNormalizationServices,
    });
    return createdNormalization;
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
