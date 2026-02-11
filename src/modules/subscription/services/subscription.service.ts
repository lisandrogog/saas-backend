import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  // get all platforms with their modules and submodules for a tenant
  async getAllTenantModules(tenantId: string) {
    return await this.prisma.platform.findMany({
      where: {
        app_module: {
          some: {
            tenant_module: {
              some: { tenant_id: tenantId },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
      include: {
        app_module: {
          where: {
            tenant_module: {
              some: { tenant_id: tenantId },
            },
          },
          orderBy: { item_order: 'asc', code: 'asc' },
          include: {
            app_sub_module: {
              orderBy: { item_order: 'asc', code: 'asc' },
            },
          },
        },
      },
    });
  }

  // get Unique platform with their modules and submodules for a tenant filtered by platform code
  async getTenantModulesByPlatform(tenantId: string, platformCode: string) {
    return await this.prisma.platform.findUnique({
      where: {
        code: platformCode,
        app_module: {
          some: {
            tenant_module: {
              some: { tenant_id: tenantId },
            },
          },
        },
      },
      include: {
        app_module: {
          where: {
            tenant_module: {
              some: { tenant_id: tenantId },
            },
          },
          orderBy: { item_order: 'asc', code: 'asc' },
          include: {
            app_sub_module: {
              where: {},
              orderBy: { item_order: 'asc', code: 'asc' },
            },
          },
        },
      },
    });
  }

  // get all document engines with their items, states and actions assigned to a tenant
  async getAllTenantDocumentEngines(tenantId: string) {
    return await this.prisma.tenant_document_engine.findMany({
      where: { tenant_id: tenantId },
      include: {
        document_engine: {
          include: {
            document_type: {
              include: {
                movement_type: true,
              },
            },
            document_engine_item: {
              include: {
                document_status_document_engine_item_from_state_idTodocument_status: true,
                document_status_document_engine_item_to_state_idTodocument_status: true,
                document_action: true,
              },
            },
          },
        },
      },
    });
  }

  // get document engines with their items, states and actions assigned to a tenant filtered by document type
  async getTenantDocumentEnginesByDocumentType(
    tenantId: string,
    documentTypeId: number,
  ) {
    return await this.prisma.document_engine.findMany({
      where: {
        document_type_id: documentTypeId,
        tenant_document_engine: {
          some: { tenant_id: tenantId },
        },
      },
      include: {
        document_type: {
          include: {
            movement_type: true,
          },
        },
        document_engine_item: {
          include: {
            document_status_document_engine_item_from_state_idTodocument_status: true,
            document_status_document_engine_item_to_state_idTodocument_status: true,
            document_action: true,
          },
        },
      },
    });
  }
}
