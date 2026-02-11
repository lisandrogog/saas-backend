import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBusinessUnitDto } from '../dtos/create-business-unit.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class BusinessUnitService {
  constructor(private prisma: PrismaService) {}

  async createBusinessUnit(dto: CreateBusinessUnitDto, userId?: string) {
    const businessUnitId = uuidv7();

    return await this.prisma.business_unit.create({
      data: {
        id: businessUnitId,
        tenant_id: dto.tenantId,
        business_name: dto.businessName,
        code: dto.code,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        active: dto.active ?? true,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async getBusinessUnitById(tenantId: string, id: string) {
    return await this.prisma.business_unit.findFirst({
      where: { id, tenant_id: tenantId, removed_at: null },
    });
  }

  async getBusinessUnitByCode(tenantId: string, code: string) {
    return await this.prisma.business_unit.findFirst({
      where: { code, tenant_id: tenantId, removed_at: null },
    });
  }

  async getBusinessUnits(tenantId: string) {
    return await this.prisma.business_unit.findMany({
      where: { tenant_id: tenantId, removed_at: null },
      orderBy: { code: 'asc' },
    });
  }

  async updateBusinessUnit(
    tenantId: string,
    id: string,
    dto: Partial<CreateBusinessUnitDto>,
    userId?: string,
  ) {
    return await this.prisma.business_unit.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        business_name: dto.businessName,
        code: dto.code,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        active: dto.active,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeBusinessUnit(tenantId: string, id: string, userId?: string) {
    return await this.prisma.business_unit.update({
      where: { id, tenant_id: tenantId },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
