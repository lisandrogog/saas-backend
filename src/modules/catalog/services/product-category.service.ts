import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateProductCategoryDto } from '../dtos/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async createProductCategory(dto: CreateProductCategoryDto, userId?: string) {
    const categoryId = uuidv7();

    return await this.prisma.product_category.create({
      data: {
        id: categoryId,
        product_category_type_id: dto.categoryTypeId,
        tenant_id: dto.tenantId,
        code: dto.code,
        name: dto.name,
        active: dto.active ?? true,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async getProductCategoryById(tenantId: string, id: string) {
    return await this.prisma.product_category.findFirst({
      where: { id, tenant_id: tenantId, removed_at: null },
    });
  }

  async getProductCategoryByCode(tenantId: string, code: string) {
    return await this.prisma.product_category.findFirst({
      where: { tenant_id: tenantId, code, removed_at: null },
    });
  }

  async getProductCategories(tenantId: string) {
    return await this.prisma.product_category.findMany({
      where: { tenant_id: tenantId, removed_at: null },
      orderBy: { code: 'asc' },
    });
  }

  async getProductCategoriesByTypeId(tenantId: string, categoryTypeId: number) {
    return await this.prisma.product_category.findMany({
      where: {
        tenant_id: tenantId,
        product_category_type_id: categoryTypeId,
        removed_at: null,
      },
      orderBy: { code: 'asc' },
    });
  }

  async updateProductCategory(
    tenantId: string,
    id: string,
    dto: Partial<CreateProductCategoryDto>,
    userId?: string,
  ) {
    return await this.prisma.product_category.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        product_category_type_id: dto.categoryTypeId,
        code: dto.code,
        name: dto.name,
        active: dto.active,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeProductCategory(tenantId: string, id: string, userId?: string) {
    return await this.prisma.product_category.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
