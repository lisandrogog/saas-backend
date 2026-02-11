import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentType } from '../../../common/enums/document-type.enum';

export class ApplyActionDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  businessUnitId: string;

  @IsUUID()
  documentId: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsOptional()
  @IsString()
  actionCode?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
