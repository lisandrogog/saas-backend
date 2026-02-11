import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { CreateTenantDocumentEngineDto } from '../dtos/create-tenant-document-engine.dto';

@Injectable()
export class TenantDocumentEngineService {
  constructor(private prisma: PrismaService) {}

  async getTenantDocumentEngines(tenantId: string) {
    return await this.prisma.tenant_document_engine.findMany({
      where: { tenant_id: tenantId },
    });
  }

  async assignDocumentEngineToTenant(dto: CreateTenantDocumentEngineDto) {
    const tenantDocumentEngineId = uuidv7();

    return await this.prisma.tenant_document_engine.create({
      data: {
        id: tenantDocumentEngineId,
        tenant_id: dto.tenantId,
        document_engine_id: dto.documentEngineId,
        created_at: new Date(),
      },
    });
  }

  async removeDocumentEngineFromTenant(id: string) {
    return await this.prisma.tenant_document_engine.delete({
      where: { id },
    });
  }
}
