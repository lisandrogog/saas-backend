import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateIndustryDto } from '../dtos/create-industry.dto';

@Injectable()
export class IndustryService {
  constructor(private prisma: PrismaService) {}

  async getAllIndustries() {
    return await this.prisma.industry.findMany({
      where: {},
      orderBy: { code: 'asc' },
    });
  }

  async getIndustryByCode(code: string) {
    return await this.prisma.industry.findUnique({
      where: { code },
    });
  }

  async createIndustry(dto: CreateIndustryDto) {
    return await this.prisma.industry.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async updateIndustry(id: number, dto: Partial<CreateIndustryDto>) {
    return await this.prisma.industry.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async upsertIndustry(partial: Partial<CreateIndustryDto>) {
    return await this.prisma.industry.upsert({
      where: { code: partial.code },
      update: { name: partial.name },
      create: {
        code: partial.code!,
        name: partial.name!,
      },
    });
  }
}
