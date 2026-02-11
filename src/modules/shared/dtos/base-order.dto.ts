import { IsOptional, IsUUID, IsNumber, IsDate } from 'class-validator';

export class BaseOrderDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  businessUnitId: string;

  @IsUUID()
  customerId: string;

  @IsUUID()
  agentId: string;

  @IsNumber()
  documentStatusId: number;

  @IsNumber()
  documentTypeId: number;

  @IsOptional()
  @IsDate()
  scheduledAt: Date;
}
