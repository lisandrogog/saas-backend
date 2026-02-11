import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEmail,
  IsUUID,
} from 'class-validator';

export class CreateBusinessUnitDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  businessName: string;

  @IsString()
  code: string;

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
  active?: boolean;
}
