import { IsUUID, IsNumber } from 'class-validator';

export class BaseOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
