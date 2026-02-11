import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateIdentificationTypeDto } from '../dtos/create-identification-type.dto';

@Injectable()
export class IdentificationTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllIdentificationTypes() {
    return await this.prisma.identification_type.findMany({
      where: {},
      orderBy: { code: 'asc' },
    });
  }

  async getIdentificationTypeByCode(code: string) {
    return await this.prisma.identification_type.findUnique({
      where: { code },
    });
  }

  async createIdentificationType(dto: CreateIdentificationTypeDto) {
    return await this.prisma.identification_type.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async updateIdentificationType(
    id: number,
    dto: Partial<CreateIdentificationTypeDto>,
  ) {
    return await this.prisma.identification_type.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async upsertIdentificationType(
    partial: Partial<CreateIdentificationTypeDto>,
  ) {
    return await this.prisma.identification_type.upsert({
      where: { code: partial.code },
      update: { name: partial.name },
      create: {
        code: partial.code!,
        name: partial.name!,
      },
    });
  }
}
