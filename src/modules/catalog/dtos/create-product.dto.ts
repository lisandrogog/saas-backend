import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsNumber()
  baseCost: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
