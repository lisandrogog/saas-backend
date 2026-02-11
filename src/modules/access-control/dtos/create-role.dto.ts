import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  itemOrder?: number;
}
