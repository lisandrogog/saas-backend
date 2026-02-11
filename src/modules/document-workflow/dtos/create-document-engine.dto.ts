import { BaseCodeNameDto } from '@modules/shared/dtos/base-code-name.dto';
import { IsOptional } from 'class-validator';

export class CreateDocumentEngineDto extends BaseCodeNameDto {
  @IsOptional()
  description: string;

  documentTypeId: number;

  initialStateId: number;

  @IsOptional()
  isDefault: boolean;
}
