import { Module } from '@nestjs/common';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { PurchaseOrderService } from './service/purchase-order.service';
import { PurchaseOrderItemService } from './service/purchase-order-item.service';
import { PurchaseService } from './service/purchase.service';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PurchaseService, PurchaseOrderItemService],
  exports: [PurchaseOrderService, PurchaseService, PurchaseOrderItemService],
})
export class PurchaseOrderModule {}
