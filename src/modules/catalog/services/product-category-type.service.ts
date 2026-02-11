import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateProductCategoryTypeDto } from '../dtos/create-product-category-type.dto';

@Injectable()
export class ProductCategoryTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllProductCategoryTypes() {
    return await this.prisma.product_category_type.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getProductCategoryTypeById(id: number) {
    return await this.prisma.product_category_type.findUnique({
      where: { id },
    });
  }

  async getProductCategoryTypeByCode(code: string) {
    return await this.prisma.product_category_type.findUnique({
      where: { code },
    });
  }

  async createProductCategoryType(dto: CreateProductCategoryTypeDto) {
    return await this.prisma.product_category_type.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async updateProductCategoryType(
    id: number,
    dto: Partial<CreateProductCategoryTypeDto>,
  ) {
    return await this.prisma.product_category_type.update({
      where: { id },
      data: dto,
    });
  }

  async upsertProductCategoryType(dto: Partial<CreateProductCategoryTypeDto>) {
    return await this.prisma.product_category_type.upsert({
      where: { code: dto.code },
      update: { name: dto.name! },
      create: {
        code: dto.code!,
        name: dto.name!,
      },
    });
  }
}
