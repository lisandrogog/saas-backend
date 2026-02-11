import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAppUserStatusDto } from '../dtos/create-app-user-status.dto';

@Injectable()
export class AppUserStatusService {
  constructor(private prisma: PrismaService) {}

  async getAllAppUserStatuses() {
    return await this.prisma.app_user_status.findMany({
      where: {},
      orderBy: { item_order: 'asc' },
    });
  }

  async getAppUserStatusByCode(code: string) {
    return await this.prisma.app_user_status.findUnique({
      where: { code },
    });
  }

  async createAppUserStatus(dto: CreateAppUserStatusDto) {
    return await this.prisma.app_user_status.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        item_order: dto.itemOrder || 0,
      },
    });
  }

  async updateAppUserStatus(id: number, dto: Partial<CreateAppUserStatusDto>) {
    return await this.prisma.app_user_status.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        item_order: dto.itemOrder,
      },
    });
  }

  async upsertAppUserStatus(partial: Partial<CreateAppUserStatusDto>) {
    return await this.prisma.app_user_status.upsert({
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
