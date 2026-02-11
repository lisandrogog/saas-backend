import { Module } from '@nestjs/common';
import { PartnersController } from './controllers/partners.controller';
import { PartnersService } from './services/partners.service';

@Module({
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
