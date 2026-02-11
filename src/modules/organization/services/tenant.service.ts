import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from '../dtos/create-tenant.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(dto: CreateTenantDto, userId?: string) {
    const tenantId = uuidv7();

    return await this.prisma.tenant.create({
      data: {
        id: tenantId,
        identification_type_id: dto.identificationTypeId,
        identification_number: dto.identificationNumber,
        business_name: dto.businessName,
        code: dto.code,
        industry_id: dto.industryId,
        email: dto.email,
        phone: dto.phone,
        active: dto.active ?? true,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async getTenantById(id: string) {
    return await this.prisma.tenant.findFirst({
      where: { id },
    });
  }

  async getTenantByCode(code: string) {
    return await this.prisma.tenant.findFirst({
      where: { code },
    });
  }

  async getTenantByIdentification(
    identificationTypeId: number,
    identificationNumber: string,
  ) {
    return await this.prisma.tenant.findFirst({
      where: {
        identification_type_id: identificationTypeId,
        identification_number: identificationNumber,
      },
    });
  }

  async getAllTenants() {
    return await this.prisma.tenant.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async updateTenant(
    id: string,
    dto: Partial<CreateTenantDto>,
    userId?: string,
  ) {
    return await this.prisma.tenant.update({
      where: { id },
      data: {
        identification_type_id: dto.identificationTypeId,
        identification_number: dto.identificationNumber,
        business_name: dto.businessName,
        code: dto.code,
        industry_id: dto.industryId,
        email: dto.email,
        phone: dto.phone,
        active: dto.active,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }
}
