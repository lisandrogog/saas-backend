import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateProductBusinessUnitDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  businessUnitId: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  extraData?: Record<string, any>;
}
