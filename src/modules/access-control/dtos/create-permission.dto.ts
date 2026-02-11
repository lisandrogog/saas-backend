import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsUUID()
  roleId: string;

  @IsNumber()
  subModuleId: number;

  @IsNumber()
  accessScopeId: number;

  @IsNumber()
  permissionTypeId: number;

  @IsOptional()
  @IsNumber()
  itemOrder?: number;
}
