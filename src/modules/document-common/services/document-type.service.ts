import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocumentTypeDto } from '../dtos/create-document-type.dto';

@Injectable()
export class DocumentTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllDocumentTypes() {
    return await this.prisma.document_type.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getDocumentTypeByCode(code: string) {
    return await this.prisma.document_type.findUnique({
      where: { code },
    });
  }

  async createDocumentType(dto: CreateDocumentTypeDto) {
    return await this.prisma.document_type.create({
      data: {
        code: dto.code,
        name: dto.name,
        movement_type_id: dto.movementTypeId,
      },
    });
  }

  async updateDocumentType(id: number, dto: Partial<CreateDocumentTypeDto>) {
    return await this.prisma.document_type.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        movement_type_id: dto.movementTypeId,
      },
    });
  }

  async upsertDocumentType(partial: Partial<CreateDocumentTypeDto>) {
    return await this.prisma.document_type.upsert({
      where: { code: partial.code! },
      update: {
        name: partial.name,
        movement_type_id: partial.movementTypeId,
      },
      create: {
        code: partial.code!,
        name: partial.name!,
        movement_type_id: partial.movementTypeId!,
      },
    });
  }
}
