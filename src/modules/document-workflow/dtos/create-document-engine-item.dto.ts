import { IsOptional, IsUUID } from 'class-validator';

export class CreateDocumentEngineItemDto {
  @IsUUID()
  documentEngineId: string;

  fromStateId: number;

  toStateId: number;

  @IsOptional()
  allowBackwards: boolean;

  actionId: number;
}
