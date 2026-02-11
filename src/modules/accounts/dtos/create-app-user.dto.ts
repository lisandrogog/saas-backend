import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppUserDto {
  @IsUUID()
  businessPartnerId: string;

  @IsUUID()
  roleId: string;

  @IsNumber()
  appUserStatusId: number;

  @IsString()
  username: string;

  @IsString()
  passwordHash: string;

  @IsOptional()
  profileData?: Record<string, any>;
}
