import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateProductBusinessUnitDto } from '../dtos/create-product-business-unit.dto';

@Injectable()
export class ProductBusinessUnitService {
  constructor(private prisma: PrismaService) {}

  async createProductBusinessUnit(dto: CreateProductBusinessUnitDto) {
    const id = uuidv7();

    return await this.prisma.product_business_unit.create({
      data: {
        id,
        product_id: dto.productId,
        business_unit_id: dto.businessUnitId,
        price: dto.price || 0,
        cost: dto.cost || 0,
        stock: dto.stock || 0,
        active: dto.active ?? true,
        ...(dto.extraData ? { extra_data: JSON.stringify(dto.extraData) } : {}),
        created_at: new Date(),
      },
    });
  }

  async getProductBusinessUnitByProductId(
    businessUnitId: string,
    productId: string,
  ) {
    return await this.prisma.product_business_unit.findFirst({
      where: { product_id: productId, business_unit_id: businessUnitId },
      include: {
        product: true,
      },
    });
  }

  async getProductBusinessUnitByCode(
    businessUnitId: string,
    productCode: string,
  ) {
    return await this.prisma.product_business_unit.findFirst({
      where: {
        business_unit_id: businessUnitId,
        product: { code: productCode },
      },
      include: {
        product: true,
      },
    });
  }

  async updateProductBusinessUnit(
    businessUnitId: string,
    productId: string,
    dto: Partial<CreateProductBusinessUnitDto>,
  ) {
    return await this.prisma.product_business_unit.update({
      where: {
        product_id_business_unit_id: {
          product_id: productId,
          business_unit_id: businessUnitId,
        },
      },
      data: {
        price: dto.price,
        cost: dto.cost,
        stock: dto.stock,
        active: dto.active,
        ...(dto.extraData ? { extra_data: JSON.stringify(dto.extraData) } : {}),
      },
    });
  }

  async deleteProductBusinessUnit(businessUnitId: string, productId: string) {
    return await this.prisma.product_business_unit.delete({
      where: {
        product_id_business_unit_id: {
          product_id: productId,
          business_unit_id: businessUnitId,
        },
      },
    });
  }
}
