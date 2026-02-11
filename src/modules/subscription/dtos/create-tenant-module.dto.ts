import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateTenantModuleDto {
  @IsUUID()
  tenantId: string;

  @IsNumber()
  appModuleId: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
