import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEmail,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateBusinessPartnerDto {
  @IsUUID()
  tenantId: string;

  @IsNumber()
  identificationTypeId: number;

  @IsString()
  identificationNumber: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isCustomer: boolean;

  @IsOptional()
  @IsBoolean()
  isAgent: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  extraData?: Record<string, any>;
}
