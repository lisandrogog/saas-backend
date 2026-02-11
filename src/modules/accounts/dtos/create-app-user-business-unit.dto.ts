import { IsUUID } from 'class-validator';

export class CreateAppUserBusinessUnitDto {
  @IsUUID()
  appUserId: string;

  @IsUUID()
  businessUnitId: string;
}
