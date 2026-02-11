import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTenantModuleDto } from '../dtos/create-tenant-module.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class TenantModuleService {
  constructor(private prisma: PrismaService) {}

  async getTenantModules(tenantId: string) {
    return await this.prisma.tenant_module.findMany({
      where: { tenant_id: tenantId },
    });
  }

  async assignModuleToTenant(dto: CreateTenantModuleDto) {
    const tenantModuleId = uuidv7();

    return await this.prisma.tenant_module.create({
      data: {
        id: tenantModuleId,
        tenant_id: dto.tenantId,
        app_module_id: dto.appModuleId,
        active: dto.active ?? true,
        expires_at: dto.expiresAt,
        created_at: new Date(),
      },
    });
  }

  async updateTenantModule(id: string, dto: Partial<CreateTenantModuleDto>) {
    return await this.prisma.tenant_module.update({
      where: { id },
      data: {
        active: dto.active,
        expires_at: dto.expiresAt,
        updated_at: new Date(),
      },
    });
  }
}
