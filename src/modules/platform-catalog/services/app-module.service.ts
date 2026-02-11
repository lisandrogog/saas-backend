import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAppModuleDto } from '../dtos/create-app-module.dto';

@Injectable()
export class AppModuleService {
  constructor(private prisma: PrismaService) {}

  async getAppModules(platformId: number) {
    return await this.prisma.app_module.findMany({
      where: { platform_id: platformId },
      orderBy: { item_order: 'asc', code: 'asc' },
    });
  }

  async getAppModuleByCode(platformId: number, code: string) {
    return await this.prisma.app_module.findUnique({
      where: { platform_id_code: { platform_id: platformId, code } },
    });
  }

  async createAppModule(dto: CreateAppModuleDto) {
    return await this.prisma.app_module.create({
      data: {
        platform_id: dto.platformId,
        code: dto.code,
        name: dto.name,
        item_order: dto.itemOrder || 0,
      },
    });
  }

  async updateAppModule(id: number, dto: Partial<CreateAppModuleDto>) {
    return await this.prisma.app_module.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        item_order: dto.itemOrder,
      },
    });
  }

  async upsertAppModule(partial: Partial<CreateAppModuleDto>) {
    return await this.prisma.app_module.upsert({
      where: {
        platform_id_code: {
          platform_id: partial.platformId!,
          code: partial.code!,
        },
      },
      update: { name: partial.name, item_order: partial.itemOrder },
      create: {
        platform_id: partial.platformId!,
        code: partial.code!,
        name: partial.name!,
        item_order: partial.itemOrder || 0,
      },
    });
  }

  async getAppModuleSubModules(platformId: number, code: string) {
    return await this.prisma.app_module.findUnique({
      where: {
        platform_id_code: { platform_id: platformId, code: code },
      },
      include: {
        app_sub_module: {
          where: {},
          orderBy: { item_order: 'asc', code: 'asc' },
        },
      },
    });
  }
}
