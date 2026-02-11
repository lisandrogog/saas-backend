import { BaseCodeNameDto } from '@modules/shared/dtos/base-code-name.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppUserStatusDto extends BaseCodeNameDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  itemOrder?: number;
}
