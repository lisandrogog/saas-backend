import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePlatformDto } from '../dtos/create-platform.dto';

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async getAllPlatforms() {
    return await this.prisma.platform.findMany({
      where: {},
      orderBy: { code: 'asc' },
    });
  }

  async getPlatformByCode(code: string) {
    return await this.prisma.platform.findUnique({
      where: { code },
    });
  }

  async createPlatform(dto: CreatePlatformDto) {
    return await this.prisma.platform.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async updatePlatform(id: number, dto: Partial<CreatePlatformDto>) {
    return await this.prisma.platform.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async upsertPlatform(partial: Partial<CreatePlatformDto>) {
    return await this.prisma.platform.upsert({
      where: { code: partial.code },
      update: { name: partial.name },
      create: {
        code: partial.code!,
        name: partial.name!,
      },
    });
  }

  async getPlatformModules(platformCode: string) {
    return await this.prisma.platform.findUnique({
      where: { code: platformCode },
      include: {
        app_module: {
          where: {},
          orderBy: { item_order: 'asc', code: 'asc' },
        },
      },
    });
  }
}
