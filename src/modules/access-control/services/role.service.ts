import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getRoles(tenantId: string) {
    return await this.prisma.role.findMany({
      where: { tenant_id: tenantId, removed_at: null },
      orderBy: { item_order: 'asc' },
    });
  }

  async getRoleByCode(tenantId: string, code: string) {
    return await this.prisma.role.findFirst({
      where: { tenant_id: tenantId, code, removed_at: null },
    });
  }

  async createRole(tenantId: string, dto: CreateRoleDto, userId?: string) {
    return await this.prisma.role.create({
      data: {
        tenant_id: tenantId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder || 0,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async updateRole(id: string, dto: Partial<CreateRoleDto>, userId?: string) {
    return await this.prisma.role.update({
      where: { id, removed_at: null },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeRole(id: string, userId?: string) {
    return await this.prisma.role.update({
      where: { id, removed_at: null },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
