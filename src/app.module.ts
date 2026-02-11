import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '@core/prisma.service';
import { OrganizationModule } from '@modules/organization/organization.module';
import { CatalogModule } from '@modules/catalog/catalog.module';
import { SalesOrderModule } from '@modules/sales-order/sales-order.module';
import { PartnersModule } from '@modules/partners/partners.module';
import { CommonModule } from '@modules/common/common.module';
import { ServiceOrderModule } from '@modules/service-order/service-order.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TranslationsModule } from '@modules/translations/translations.module';
import { UtilsModule } from '@modules/utils/utils.module';
import { HashService } from '@modules/utils/services/hash.service';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { PlatformCatalogModule } from './modules/platform-catalog/platform-catalog.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { DocumentCommonModule } from './modules/document-common/document-common.module';
import { DocumentWorkflowModule } from '@modules/document-workflow/document-workflow.module';

@Module({
  imports: [
    OrganizationModule,
    CatalogModule,
    SalesOrderModule,
    PartnersModule,
    CommonModule,
    ServiceOrderModule,
    AuthModule,
    TranslationsModule,
    UtilsModule,
    AccessControlModule,
    PlatformCatalogModule,
    SubscriptionModule,
    AccountsModule,
    DocumentWorkflowModule,
    PurchaseOrderModule,
    DocumentCommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HashService],
})
export class AppModule {}
