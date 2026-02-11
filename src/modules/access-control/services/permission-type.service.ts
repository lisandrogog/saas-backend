import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePermissionTypeDto } from '../dtos/create-permission-type.dto';

@Injectable()
export class PermissionTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllPermissionTypes() {
    return await this.prisma.permission_type.findMany({
      where: {},
      orderBy: { item_order: 'asc' },
    });
  }

  async getPermissionTypeByCode(code: string) {
    return await this.prisma.permission_type.findUnique({
      where: { code },
    });
  }

  async createPermissionType(dto: CreatePermissionTypeDto) {
    return await this.prisma.permission_type.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder || 0,
      },
    });
  }

  async updatePermissionType(
    id: number,
    dto: Partial<CreatePermissionTypeDto>,
  ) {
    return await this.prisma.permission_type.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder,
      },
    });
  }

  async upsertPermissionType(partial: Partial<CreatePermissionTypeDto>) {
    return await this.prisma.permission_type.upsert({
      where: { code: partial.code },
      update: {
        name: partial.name,
        description: partial.description,
        item_order: partial.itemOrder,
      },
      create: {
        code: partial.code!,
        name: partial.name!,
        description: partial.description,
        item_order: partial.itemOrder || 0,
      },
    });
  }
}
