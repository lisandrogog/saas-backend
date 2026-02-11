import { BaseCodeNameDto } from '@modules/shared/dtos/base-code-name.dto';

export class CreateDocumentStatusDto extends BaseCodeNameDto {
  isEditable: boolean;

  isFinal: boolean;

  isPosted: boolean;
}
