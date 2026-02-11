import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocumentEngineItemDto } from '../dtos/create-document-engine-item.dto';

@Injectable()
export class DocumentEngineItemService {
  constructor(private prisma: PrismaService) {}

  async getDocumentEngineItems(documentEngineId: string) {
    return await this.prisma.document_engine_item.findMany({
      where: { document_engine_id: documentEngineId },
    });
  }

  async createDocumentEngineItem(dto: CreateDocumentEngineItemDto) {
    return await this.prisma.document_engine_item.create({
      data: {
        document_engine_id: dto.documentEngineId,
        from_state_id: dto.fromStateId,
        to_state_id: dto.toStateId,
        document_action_id: dto.actionId,
        allow_backwards: dto.allowBackwards ?? false,
      },
    });
  }

  async updateDocumentEngineItem(
    id: string,
    dto: Partial<CreateDocumentEngineItemDto>,
  ) {
    return await this.prisma.document_engine_item.update({
      where: { id },
      data: {
        document_engine_id: dto.documentEngineId,
        from_state_id: dto.fromStateId,
        to_state_id: dto.toStateId,
        document_action_id: dto.actionId,
        ...(dto.allowBackwards !== undefined
          ? { allow_backwards: dto.allowBackwards }
          : {}),
      },
    });
  }
}
