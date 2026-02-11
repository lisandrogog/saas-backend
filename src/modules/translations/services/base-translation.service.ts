import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBaseTranslationDto } from '../dtos/create-base-translation.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class BaseTranslationService {
  constructor(private prisma: PrismaService) {}

  async getBaseTranslationByCode(code: string) {
    return await this.prisma.base_translation.findUnique({
      where: { code },
    });
  }

  async getBaseTranslations() {
    return await this.prisma.base_translation.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async createBaseTranslation(dto: CreateBaseTranslationDto) {
    const id = uuidv7();
    return await this.prisma.base_translation.create({
      data: {
        id,
        code: dto.code,
        default_value: dto.defaultValue,
      },
    });
  }

  async updateBaseTranslation(
    id: string,
    dto: Partial<CreateBaseTranslationDto>,
  ) {
    return await this.prisma.base_translation.update({
      where: { id },
      data: {
        code: dto.code,
        default_value: dto.defaultValue,
      },
    });
  }

  async upsertBaseTranslation(dto: Partial<CreateBaseTranslationDto>) {
    return await this.prisma.base_translation.upsert({
      where: { code: dto.code },
      update: {
        default_value: dto.defaultValue,
      },
      create: {
        id: uuidv7(),
        code: dto.code!,
        default_value: dto.defaultValue!,
      },
    });
  }
}
