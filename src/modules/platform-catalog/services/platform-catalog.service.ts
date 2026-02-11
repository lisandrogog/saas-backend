import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlatformCatalogService {
  constructor(private prisma: PrismaService) {}

  async getPlatformSubModules(platformCode: string) {
    return await this.prisma.platform.findUnique({
      where: { code: platformCode },
      include: {
        app_module: {
          where: {},
          orderBy: { item_order: 'asc', code: 'asc' },
          include: {
            app_sub_module: {
              where: {},
              orderBy: { item_order: 'asc', code: 'asc' },
            },
          },
        },
      },
    });
  }

  async getAllPlatformsSubModules() {
    return await this.prisma.platform.findMany({
      where: {},
      orderBy: { code: 'asc' },
      include: {
        app_module: {
          where: {},
          orderBy: { item_order: 'asc', code: 'asc' },
          include: {
            app_sub_module: {
              where: {},
              orderBy: { item_order: 'asc', code: 'asc' },
            },
          },
        },
      },
    });
  }
}
