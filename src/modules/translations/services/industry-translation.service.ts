import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateIndustryTranslationDto } from '../dtos/create-industry-translation.dto';

@Injectable()
export class IndustryTranslationService {
  constructor(private prisma: PrismaService) {}

  async getIndustryTranslationByCode(code: string, industryId: number) {
    const base = await this.prisma.base_translation.findUnique({
      where: { code },
    });

    if (!base) return null;

    const industryTranslation =
      await this.prisma.industry_translation.findFirst({
        where: { base_translation_id: base.id, industry_id: industryId },
      });

    if (industryTranslation) {
      return {
        code: base.code,
        value: industryTranslation.custom_value,
      };
    }

    return {
      code: base.code,
      value: base.default_value,
    };
  }

  async getIndustryTranslations(industryId: number) {
    const baseTranslations = await this.prisma.base_translation.findMany({
      orderBy: { code: 'asc' },
    });

    const industryTranslations =
      await this.prisma.industry_translation.findMany({
        where: { industry_id: industryId },
      });

    const industryTranslationsMap = new Map(
      industryTranslations.map((t) => [t.base_translation_id, t]),
    );

    return baseTranslations.map((base) => {
      const industryTranslation = industryTranslationsMap.get(base.id);
      return {
        code: base.code,
        value: industryTranslation
          ? industryTranslation.custom_value
          : base.default_value,
      };
    });
  }

  async upsertIndustryTranslation(dto: CreateIndustryTranslationDto) {
    return await this.prisma.industry_translation.upsert({
      where: {
        industry_id_base_translation_id: {
          base_translation_id: dto.baseTranslationId,
          industry_id: dto.industryId,
        },
      },
      update: {
        custom_value: dto.customValue,
      },
      create: {
        id: uuidv7(),
        base_translation_id: dto.baseTranslationId,
        industry_id: dto.industryId,
        custom_value: dto.customValue,
      },
    });
  }
}
