import { Module } from '@nestjs/common';
import { SalesOrderController } from './controllers/sales-order.controller';
import { SalesOrderService } from './services/sales-order.service';
import { SalesService } from './services/sales.service';
import { SalesOrderItemService } from './services/sales-order-item.service';

@Module({
  controllers: [SalesOrderController],
  providers: [SalesOrderService, SalesOrderItemService, SalesService],
  exports: [SalesOrderService, SalesOrderItemService, SalesService],
})
export class SalesOrderModule {}
