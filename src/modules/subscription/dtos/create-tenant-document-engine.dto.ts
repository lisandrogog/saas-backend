import { IsUUID } from 'class-validator';

export class CreateTenantDocumentEngineDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  documentEngineId: string;
}
