import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocumentActionDto } from '../dtos/create-document-action.dto';

@Injectable()
export class DocumentActionService {
  constructor(private prisma: PrismaService) {}

  async getAllDocumentActions() {
    return await this.prisma.document_action.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async getDocumentActionByCode(code: string) {
    return await this.prisma.document_action.findUnique({
      where: { code },
    });
  }

  async createDocumentAction(dto: CreateDocumentActionDto) {
    return await this.prisma.document_action.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async updateDocumentAction(
    id: number,
    dto: Partial<CreateDocumentActionDto>,
  ) {
    return await this.prisma.document_action.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async upsertDocumentAction(partial: Partial<CreateDocumentActionDto>) {
    return await this.prisma.document_action.upsert({
      where: { code: partial.code! },
      update: {
        name: partial.name,
      },
      create: {
        code: partial.code!,
        name: partial.name!,
      },
    });
  }
}
