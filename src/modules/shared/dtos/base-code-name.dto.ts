import { IsString } from 'class-validator';

export class BaseCodeNameDto {
  @IsString()
  code: string;

  @IsString()
  name: string;
}
