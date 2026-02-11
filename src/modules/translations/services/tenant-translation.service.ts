import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateTenantTranslationDto } from '../dtos/create-tenant-translation.dto';

@Injectable()
export class TenantTranslationService {
  constructor(private prisma: PrismaService) {}

  async getTenantTranslationByCode(code: string, tenantId: string) {
    const base = await this.prisma.base_translation.findUnique({
      where: { code },
    });

    if (!base) return null;

    const tenantTranslation = await this.prisma.tenant_translation.findFirst({
      where: { base_translation_id: base.id, tenant_id: tenantId },
    });

    if (tenantTranslation) {
      return {
        code: base.code,
        value: tenantTranslation.custom_value,
      };
    }

    return {
      code: base.code,
      value: base.default_value,
    };
  }

  async getTenantTranslations(tenantId: string) {
    const baseTranslations = await this.prisma.base_translation.findMany({
      orderBy: { code: 'asc' },
    });

    const tenantTranslations = await this.prisma.tenant_translation.findMany({
      where: { tenant_id: tenantId },
    });

    const tenantTranslationsMap = new Map(
      tenantTranslations.map((t) => [t.base_translation_id, t]),
    );

    return baseTranslations.map((base) => {
      const tenantTranslation = tenantTranslationsMap.get(base.id);
      return {
        code: base.code,
        value: tenantTranslation
          ? tenantTranslation.custom_value
          : base.default_value,
      };
    });
  }

  async upsertTenantTranslation(dto: CreateTenantTranslationDto) {
    return await this.prisma.tenant_translation.upsert({
      where: {
        tenant_id_base_translation_id: {
          base_translation_id: dto.baseTranslationId,
          tenant_id: dto.tenantId,
        },
      },
      update: {
        custom_value: dto.customValue,
      },
      create: {
        id: uuidv7(),
        base_translation_id: dto.baseTranslationId,
        tenant_id: dto.tenantId,
        custom_value: dto.customValue,
      },
    });
  }
}
