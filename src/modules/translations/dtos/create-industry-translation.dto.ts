import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateIndustryTranslationDto {
  @IsNumber()
  industryId: number;

  @IsUUID()
  baseTranslationId: string;

  @IsString()
  customValue: string;
}
