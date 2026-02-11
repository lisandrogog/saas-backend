import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateServiceOrderItemDto } from '../dtos/create-service-order-item.dto';

@Injectable()
export class ServiceOrderItemService {
  constructor(private prisma: PrismaService) {}

  async getItems(tenantId: string, businessUnitId: string, orderId: string) {
    const orderItems = await this.prisma.service_order_item.findMany({
      where: {
        service_order: {
          id: orderId,
          tenant_id: tenantId,
          business_unit_id: businessUnitId,
          removed_at: null,
        },
      },
      include: {
        product: {
          include: {
            product_category: {
              include: {
                product_category_type: true,
              },
            },
          },
        },
      },
    });

    const productIds = orderItems.map((item) => item.product_id);

    const productBusinessUnits =
      await this.prisma.product_business_unit.findMany({
        where: {
          product_id: { in: productIds },
          business_unit_id: businessUnitId,
        },
      });

    const mappedItems = orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        product_business_unit: productBusinessUnits.find(
          (productBbu) => productBbu.product_id === item.product_id,
        ),
      },
    }));

    return mappedItems;
  }

  async getItemById(tenantId: string, businessUnitId: string, itemId: string) {
    const item = await this.prisma.service_order_item.findFirstOrThrow({
      where: {
        id: itemId,
        service_order: {
          tenant_id: tenantId,
          business_unit_id: businessUnitId,
          removed_at: null,
        },
      },
      include: {
        product: {
          include: {
            product_category: {
              include: {
                product_category_type: true,
              },
            },
          },
        },
      },
    });

    const productBusinessUnit =
      await this.prisma.product_business_unit.findFirst({
        where: {
          product_id: item.product_id,
          business_unit_id: businessUnitId,
        },
      });

    return {
      ...item,
      product: {
        ...item.product,
        product_business_unit: productBusinessUnit,
      },
    };
  }

  async createItem(dto: CreateServiceOrderItemDto) {
    const id = uuidv7();

    return await this.prisma.service_order_item.create({
      data: {
        id,
        service_order_id: dto.orderId,
        product_id: dto.productId,
        quantity: dto.quantity,
        unit_price: dto.unitPrice,
      },
    });
  }

  async updateItem(id: string, dto: Partial<CreateServiceOrderItemDto>) {
    return await this.prisma.service_order_item.update({
      where: { id },
      data: {
        product_id: dto.productId,
        quantity: dto.quantity,
        unit_price: dto.unitPrice,
      },
    });
  }

  async deleteItem(id: string) {
    return await this.prisma.service_order_item.delete({
      where: { id },
    });
  }
}
