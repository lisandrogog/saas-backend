import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async getSystemTenant() {
    return await this.prisma.tenant.findFirst({
      where: { code: 'system_admin' },
    });
  }

  async getTenantsWithUnits() {
    return await this.prisma.tenant.findMany({
      where: {},
      include: {
        business_unit: {
          where: { removed_at: null },
          orderBy: { code: 'asc' },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async getRolesWithPermissions(tenantId: string) {
    return await this.prisma.role.findMany({
      where: { tenant_id: tenantId, removed_at: null },
      include: {
        permission: {
          where: { removed_at: null },
          orderBy: { item_order: 'asc' },
        },
      },
      orderBy: { item_order: 'asc' },
    });
  }
}
