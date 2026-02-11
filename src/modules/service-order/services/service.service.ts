import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getOrderById(tenantId: string, businessUnitId: string, id: string) {
    const order = await this.prisma.service_order.findUniqueOrThrow({
      where: {
        id,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      include: {
        service_order_item: {
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
        },
      },
    });

    const productIds = order.service_order_item.map((item) => item.product_id);

    const productBusinessUnits =
      await this.prisma.product_business_unit.findMany({
        where: {
          product_id: { in: productIds },
          business_unit_id: businessUnitId,
        },
      });

    const mappedOrder = {
      ...order,
      service_order_item: order.service_order_item.map((item) => ({
        ...item,
        product: {
          ...item.product,
          product_business_unit: productBusinessUnits.find(
            (productBbu) => productBbu.product_id === item.product_id,
          ),
        },
      })),
    };

    return mappedOrder;
  }
}
