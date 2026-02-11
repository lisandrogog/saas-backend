import { IsString } from 'class-validator';

export class CreateBaseTranslationDto {
  @IsString()
  code: string;

  @IsString()
  defaultValue: string;
}
