import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductCategoryDto {
  @IsUUID()
  tenantId: string;

  categoryTypeId: number;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
