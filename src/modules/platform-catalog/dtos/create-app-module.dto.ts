import { BaseCodeNameDto } from '@modules/shared/dtos/base-code-name.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateAppModuleDto extends BaseCodeNameDto {
  @IsNumber()
  platformId: number;

  @IsOptional()
  @IsNumber()
  itemOrder?: number;
}
