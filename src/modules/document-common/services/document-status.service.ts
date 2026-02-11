import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocumentStatusDto } from '../dtos/create-document-status.dto';

@Injectable()
export class DocumentStatusService {
  constructor(private prisma: PrismaService) {}

  async getAllDocumentStatuses() {
    return await this.prisma.document_status.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getDocumentStatusByCode(code: string) {
    return await this.prisma.document_status.findUnique({
      where: { code },
    });
  }

  async createDocumentStatus(dto: CreateDocumentStatusDto) {
    return await this.prisma.document_status.create({
      data: {
        code: dto.code,
        name: dto.name,
        is_editable: dto.isEditable ?? false,
        is_final: dto.isFinal ?? false,
        is_posted: dto.isPosted ?? false,
      },
    });
  }

  async updateDocumentStatus(
    id: number,
    dto: Partial<CreateDocumentStatusDto>,
  ) {
    return await this.prisma.document_status.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        is_editable: dto.isEditable,
        is_final: dto.isFinal,
        is_posted: dto.isPosted,
      },
    });
  }

  async upsertDocumentStatus(partial: Partial<CreateDocumentStatusDto>) {
    return await this.prisma.document_status.upsert({
      where: { code: partial.code! },
      update: {
        name: partial.name,
        is_editable: partial.isEditable,
        is_final: partial.isFinal,
        is_posted: partial.isPosted,
      },
      create: {
        code: partial.code!,
        name: partial.name!,
        is_editable: partial.isEditable ?? false,
        is_final: partial.isFinal ?? false,
        is_posted: partial.isPosted ?? false,
      },
    });
  }
}
