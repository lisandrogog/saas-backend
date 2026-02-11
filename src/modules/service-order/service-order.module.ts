import { Module } from '@nestjs/common';
import { ServiceOrderController } from './controllers/service-order.controller';
import { ServiceOrderService } from './services/service-order.service';
import { ServicesService } from './services/service.service';
import { ServiceOrderItemService } from './services/service-order-item.service';

@Module({
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService, ServicesService, ServiceOrderItemService],
  exports: [ServiceOrderService, ServicesService, ServiceOrderItemService],
})
export class ServiceOrderModule {}
