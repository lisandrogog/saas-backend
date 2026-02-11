import { BaseCodeNameDto } from '@modules/shared/dtos/base-code-name.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateAppSubModuleDto extends BaseCodeNameDto {
  @IsNumber()
  appModuleId: number;

  @IsOptional()
  @IsNumber()
  itemOrder?: number;
}
