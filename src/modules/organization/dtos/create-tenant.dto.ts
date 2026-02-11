import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
  IsEmail,
} from 'class-validator';

export class CreateTenantDto {
  @IsNumber()
  identificationTypeId: number;

  @IsString()
  identificationNumber: string;

  @IsString()
  businessName: string;

  @IsString()
  code: string;

  @IsNumber()
  industryId: number;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
