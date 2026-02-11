import { Module } from '@nestjs/common';
import { CommonController } from './controllers/common.controller';
import { CommonService } from './services/common.service';
import { IndustryService } from './services/industry.service';
import { IdentificationTypeService } from './services/identification-type.service';

@Module({
  controllers: [CommonController],
  providers: [CommonService, IndustryService, IdentificationTypeService],
  exports: [CommonService, IndustryService, IdentificationTypeService],
})
export class CommonModule {}
