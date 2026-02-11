import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto, userId?: string) {
    const productId = uuidv7();

    return await this.prisma.product.create({
      data: {
        id: productId,
        tenant_id: dto.tenantId,
        product_category_id: dto.categoryId,
        code: dto.code,
        name: dto.name,
        base_price: dto.basePrice || 0,
        base_cost: dto.baseCost || 0,
        active: dto.active ?? true,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async getProductById(tenantId: string, id: string) {
    return await this.prisma.product.findFirst({
      where: { id, tenant_id: tenantId, removed_at: null },
    });
  }

  async getProductByCode(tenantId: string, code: string) {
    return await this.prisma.product.findFirst({
      where: { tenant_id: tenantId, code, removed_at: null },
    });
  }

  async getProductsByCategory(tenantId: string, categoryId: string) {
    return await this.prisma.product.findMany({
      where: {
        tenant_id: tenantId,
        product_category_id: categoryId,
        removed_at: null,
      },
      orderBy: { code: 'asc' },
    });
  }

  async updateProduct(
    tenantId: string,
    id: string,
    dto: Partial<CreateProductDto>,
    userId?: string,
  ) {
    return await this.prisma.product.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        product_category_id: dto.categoryId,
        code: dto.code,
        name: dto.name,
        base_price: dto.basePrice,
        base_cost: dto.baseCost,
        active: dto.active,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeProduct(tenantId: string, id: string, userId?: string) {
    return await this.prisma.product.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
