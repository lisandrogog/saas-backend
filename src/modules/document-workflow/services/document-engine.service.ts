import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocumentEngineDto } from '../dtos/create-document-engine.dto';

@Injectable()
export class DocumentEngineService {
  constructor(private prisma: PrismaService) {}

  async getDocumentEngines() {
    return await this.prisma.document_engine.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getDocumentEngineByCode(code: string, documentTypeId?: number) {
    return await this.prisma.document_engine.findMany({
      where: {
        code,
        ...(documentTypeId !== undefined
          ? { document_type_id: documentTypeId }
          : {}),
      },
    });
  }

  async createDocumentEngine(dto: CreateDocumentEngineDto) {
    return await this.prisma.document_engine.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        document_type_id: dto.documentTypeId,
        initial_state_id: dto.initialStateId,
        is_default: dto.isDefault ?? false,
      },
    });
  }

  async updateDocumentEngine(
    id: string,
    dto: Partial<CreateDocumentEngineDto>,
  ) {
    return await this.prisma.document_engine.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        document_type_id: dto.documentTypeId,
        initial_state_id: dto.initialStateId,
      },
    });
  }
}
