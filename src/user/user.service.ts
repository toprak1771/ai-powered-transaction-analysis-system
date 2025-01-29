import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaClient, User } from "@prisma/client";
import { CreateUser } from "./entities/user.entity";

@Injectable()
export class UserService {
  private prisma: PrismaClient;
  private user: PrismaClient["user"];
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.user = this.prisma.user;
  }

  async create(createUser: CreateUser): Promise<User> {
    try {
      const createdUser: User = await this.user.create({ data: createUser });
      return createdUser;
    } catch (error: any) {
      console.log("error:", error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(): Promise<User> {
    try {
      const getUser: User = (
        await this.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
        })
      )[0];

      return getUser;
    } catch (error) {
      console.log("error:", error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
