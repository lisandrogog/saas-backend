import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAppSubModuleDto } from '../dtos/create-app-sub-module.dto';

@Injectable()
export class AppSubModuleService {
  constructor(private prisma: PrismaService) {}

  async getAppSubModules(appModuleId: number) {
    return await this.prisma.app_sub_module.findMany({
      where: { app_module_id: appModuleId },
      orderBy: { item_order: 'asc', code: 'asc' },
    });
  }

  async getAppSubModuleByCode(appModuleId: number, code: string) {
    return await this.prisma.app_sub_module.findUnique({
      where: { app_module_id_code: { app_module_id: appModuleId, code } },
    });
  }

  async createAppSubModule(dto: CreateAppSubModuleDto) {
    return await this.prisma.app_sub_module.create({
      data: {
        app_module_id: dto.appModuleId,
        code: dto.code,
        name: dto.name,
        item_order: dto.itemOrder || 0,
      },
    });
  }

  async updateAppSubModule(id: number, dto: Partial<CreateAppSubModuleDto>) {
    return await this.prisma.app_sub_module.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        item_order: dto.itemOrder,
      },
    });
  }

  async upsertAppSubModule(partial: Partial<CreateAppSubModuleDto>) {
    return await this.prisma.app_sub_module.upsert({
      where: {
        app_module_id_code: {
          app_module_id: partial.appModuleId!,
          code: partial.code!,
        },
      },
      update: { name: partial.name, item_order: partial.itemOrder },
      create: {
        app_module_id: partial.appModuleId!,
        code: partial.code!,
        name: partial.name!,
        item_order: partial.itemOrder || 0,
      },
    });
  }
}
