import { IsString, IsUUID } from 'class-validator';

export class CreateTenantTranslationDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  baseTranslationId: string;

  @IsString()
  customValue: string;
}
