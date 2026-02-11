import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getAllProductsByBusinessUnitId(businessUnitId: string) {
    return await this.prisma.product_business_unit.findMany({
      where: { business_unit_id: businessUnitId },
      include: {
        product: true,
      },
      orderBy: {
        product: { code: 'asc' },
      },
    });
  }

  // This method is used to get all product categories that have products associated with a specific business unit
  async getAllProductCategoriesByBusinessUnitId(
    tenantId: string,
    businessUnitId: string,
  ) {
    return await this.prisma.product_category.findMany({
      where: {
        tenant_id: tenantId,
        removed_at: null,
        product: {
          some: {
            removed_at: null,
            product_business_unit: {
              some: { business_unit_id: businessUnitId },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async getAllCatalogByBusinessUnitId(
    tenantId: string,
    businessUnitId: string,
  ) {
    return await this.prisma.product_category.findMany({
      where: {
        tenant_id: tenantId,
        removed_at: null,
        product: {
          some: {
            removed_at: null,
            product_business_unit: {
              some: { business_unit_id: businessUnitId },
            },
          },
        },
      },
      include: {
        product: {
          where: { removed_at: null },
          include: {
            product_business_unit: {
              where: { business_unit_id: businessUnitId },
            },
          },
          orderBy: { code: 'asc' },
        },
      },
      orderBy: { code: 'asc' },
    });
  }
}
