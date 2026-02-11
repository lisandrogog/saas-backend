import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateServiceOrderDto } from '../dtos/create-service-order.dto';

@Injectable()
export class ServiceOrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(tenantId: string, businessUnitId: string) {
    return await this.prisma.service_order.findMany({
      where: {
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createOrder(dto: CreateServiceOrderDto, userId?: string) {
    const id = uuidv7();

    return await this.prisma.service_order.create({
      data: {
        id,
        tenant_id: dto.tenantId,
        business_unit_id: dto.businessUnitId,
        customer_id: dto.customerId,
        agent_id: dto.agentId,
        document_status_id: dto.documentStatusId,
        document_type_id: dto.documentTypeId,
        scheduled_at: dto.scheduledAt,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async updateOrder(
    id: string,
    dto: Partial<CreateServiceOrderDto>,
    userId?: string,
  ) {
    return await this.prisma.service_order.update({
      where: {
        id,
        tenant_id: dto.tenantId!,
        business_unit_id: dto.businessUnitId!,
        removed_at: null,
      },
      data: {
        customer_id: dto.customerId,
        agent_id: dto.agentId,
        document_status_id: dto.documentStatusId,
        document_type_id: dto.documentTypeId,
        scheduled_at: dto.scheduledAt,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeOrder(
    id: string,
    tenantId: string,
    businessUnitId: string,
    userId?: string,
  ) {
    return await this.prisma.service_order.update({
      where: {
        id,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
