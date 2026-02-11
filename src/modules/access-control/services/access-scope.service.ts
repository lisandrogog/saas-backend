import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAccessScopeDto } from '../dtos/create-access-scope.dto';

@Injectable()
export class AccessScopeService {
  constructor(private prisma: PrismaService) {}

  async getAllAccessScopes() {
    return await this.prisma.access_scope.findMany({
      where: {},
      orderBy: { item_order: 'asc' },
    });
  }

  async getAccessScopeByCode(code: string) {
    return await this.prisma.access_scope.findUnique({
      where: { code },
    });
  }

  async createAccessScope(dto: CreateAccessScopeDto) {
    return await this.prisma.access_scope.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder || 0,
      },
    });
  }

  async updateAccessScope(id: number, dto: Partial<CreateAccessScopeDto>) {
    return await this.prisma.access_scope.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder,
      },
    });
  }

  async upsertAccessScope(partial: Partial<CreateAccessScopeDto>) {
    return await this.prisma.access_scope.upsert({
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
