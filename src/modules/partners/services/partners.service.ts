import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBusinessPartnerDto } from '../dtos/create-business-partner.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async createPartner(dto: CreateBusinessPartnerDto, userId?: string) {
    const partnerId = uuidv7();

    return await this.prisma.business_partner.create({
      data: {
        id: partnerId,
        tenant_id: dto.tenantId,
        identification_type_id: dto.identificationTypeId,
        identification_number: dto.identificationNumber,
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        is_customer: dto.isCustomer ?? false,
        is_agent: dto.isAgent ?? false,
        active: dto.active ?? true,
        ...(dto.extraData ? { extra_data: JSON.stringify(dto.extraData) } : {}),
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async getPartnerById(tenantId: string, id: string) {
    return await this.prisma.business_partner.findFirst({
      where: { id, tenant_id: tenantId, removed_at: null },
    });
  }

  async getPartnerByIdentification(
    tenantId: string,
    identificationTypeId: number,
    identificationNumber: string,
  ) {
    return await this.prisma.business_partner.findFirst({
      where: {
        tenant_id: tenantId,
        identification_type_id: identificationTypeId,
        identification_number: identificationNumber,
        removed_at: null,
      },
    });
  }

  async getPartners(tenantId: string) {
    return await this.prisma.business_partner.findMany({
      where: { tenant_id: tenantId, removed_at: null },
      orderBy: { first_name: 'asc', last_name: 'asc' },
    });
  }

  async updatePartner(
    tenantId: string,
    id: string,
    dto: Partial<CreateBusinessPartnerDto>,
    userId?: string,
  ) {
    return await this.prisma.business_partner.update({
      where: { id, tenant_id: tenantId, removed_at: null },
      data: {
        identification_type_id: dto.identificationTypeId,
        identification_number: dto.identificationNumber,
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        is_customer: dto.isCustomer,
        is_agent: dto.isAgent,
        active: dto.active,
        ...(dto.extraData ? { extra_data: JSON.stringify(dto.extraData) } : {}),
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removePartner(tenantId: string, id: string, userId?: string) {
    return await this.prisma.business_partner.update({
      where: { id, tenant_id: tenantId },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
