import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async getOrderById(tenantId: string, businessUnitId: string, id: string) {
    const order = await this.prisma.purchase_order.findUniqueOrThrow({
      where: {
        id,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      include: {
        purchase_order_item: {
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

    const productIds = order.purchase_order_item.map((item) => item.product_id);

    const productBusinessUnits =
      await this.prisma.product_business_unit.findMany({
        where: {
          product_id: { in: productIds },
          business_unit_id: businessUnitId,
        },
      });

    const mappedOrder = {
      ...order,
      purchase_order_item: order.purchase_order_item.map((item) => ({
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
