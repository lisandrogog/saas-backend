import { Module } from '@nestjs/common';
import { UtilsController } from './controllers/utils.controller';
import { UtilsService } from './services/utils.service';
import { HashService } from './services/hash.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService, HashService],
  exports: [UtilsService, HashService],
})
export class UtilsModule {}
