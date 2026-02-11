import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '../dtos/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getPermissionsByRoleId(roleId: string) {
    return await this.prisma.permission.findMany({
      where: { role_id: roleId, removed_at: null },
      orderBy: { item_order: 'asc' },
    });
  }

  async getPermissionById(id: string) {
    return await this.prisma.permission.findFirst({
      where: { id, removed_at: null },
    });
  }

  async createPermission(dto: CreatePermissionDto, userId?: string) {
    return await this.prisma.permission.create({
      data: {
        role_id: dto.roleId,
        app_sub_module_id: dto.subModuleId,
        access_scope_id: dto.accessScopeId,
        permission_type_id: dto.permissionTypeId,
        item_order: dto.itemOrder || 0,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async updatePermission(
    id: string,
    dto: Partial<CreatePermissionDto>,
    userId?: string,
  ) {
    return await this.prisma.permission.update({
      where: { id, removed_at: null },
      data: {
        app_sub_module_id: dto.subModuleId,
        access_scope_id: dto.accessScopeId,
        permission_type_id: dto.permissionTypeId,
        item_order: dto.itemOrder,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removePermission(id: string, userId?: string) {
    return await this.prisma.permission.update({
      where: { id, removed_at: null },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
