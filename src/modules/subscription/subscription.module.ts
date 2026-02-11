import { Module } from '@nestjs/common';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { TenantModuleService } from './services/tenant-module.service';
import { TenantDocumentEngineService } from './services/tenant-document-engine.service';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    TenantModuleService,
    TenantDocumentEngineService,
  ],
  exports: [
    SubscriptionService,
    TenantModuleService,
    TenantDocumentEngineService,
  ],
})
export class SubscriptionModule {}
