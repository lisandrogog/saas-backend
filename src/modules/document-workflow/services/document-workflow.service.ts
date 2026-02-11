/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '@core/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplyActionDto } from '@modules/document-common/dtos/aply-action.dto';

@Injectable()
export class DocumentWorkflowService {
  constructor(private prisma: PrismaService) {}

  async applyAction(applyActionDto: ApplyActionDto) {
    const {
      tenantId,
      businessUnitId,
      documentId,
      documentType,
      actionCode,
      userId,
    } = applyActionDto;

    const model = this.prisma[documentType];

    const document = await model.findFirst({
      where: {
        id: documentId,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      include: { document_status: true },
    });

    if (!document) {
      throw new BadRequestException('Documento no encontrado');
    }

    if (document.document_status.is_final) {
      throw new BadRequestException(
        'El documento está en un estado final y no puede modificarse.',
      );
    }

    const transitions = await this.prisma.document_engine_item.findMany({
      where: {
        document_action: { code: actionCode!.toLowerCase() },
        from_state_id: document.document_status_id,
        document_engine: {
          document_type: { code: documentType.toLowerCase() },
          tenant_document_engine: { some: { tenant_id: tenantId } },
        },
      },
      include: {
        document_status_document_engine_item_to_state_idTodocument_status: true,
      },
    });

    if (!transitions || transitions.length === 0) {
      throw new BadRequestException(
        `La acción "${actionCode}" no es válida para el estado actual "${document.document_status.code}".`,
      );
    }

    if (transitions.length > 1) {
      throw new BadRequestException(
        `Existen múltiples transiciones para la acción "${actionCode}" desde el estado actual "${document.document_status.code}". Contacta al administrador.`,
      );
    }

    const transition = transitions[0];

    if (
      !transition.allow_backwards &&
      transition.to_state_id < document.document_status_id
    ) {
      throw new BadRequestException(
        `La acción "${actionCode}" no permite retroceder a un estado anterior.`,
      );
    }

    return await model.update({
      where: {
        id: documentId,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      data: {
        document_status_id: transition.to_state_id,
        updated_at: new Date(),
        updated_by: userId,
        ...(transition
          .document_status_document_engine_item_to_state_idTodocument_status
          .is_posted && { is_posted: true }),
      },
    });
  }

  async getAvailableActions(
    dto: Omit<ApplyActionDto, 'actionCode' | 'userId'>,
  ) {
    const { tenantId, businessUnitId, documentId, documentType } = dto;

    const model = this.prisma[documentType];

    const document = await model.findFirst({
      where: {
        id: documentId,
        tenant_id: tenantId,
        business_unit_id: businessUnitId,
        removed_at: null,
      },
      select: { document_status_id: true },
    });

    if (!document) {
      throw new BadRequestException('Documento no encontrado');
    }

    const transitions = await this.prisma.document_engine_item.findMany({
      where: {
        from_state_id: document.document_status_id,
        document_engine: {
          document_type: { code: documentType.toLowerCase() },
          tenant_document_engine: { some: { tenant_id: tenantId } },
        },
      },
      include: {
        document_action: true,
        document_status_document_engine_item_to_state_idTodocument_status: true,
      },
    });

    // 3. Formateamos para el frontend
    return transitions.map((item) => ({
      actionCode: item.document_action.code,
      actionName: item.document_action.name,
      targetStatus:
        item.document_status_document_engine_item_to_state_idTodocument_status
          .name,
      isBackwards: item.allow_backwards,
    }));
  }
}
