import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { TenantService } from './services/tenant.service';
import { BusinessUnitService } from './services/business-unit.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, TenantService, BusinessUnitService],
  exports: [OrganizationService, TenantService, BusinessUnitService],
})
export class OrganizationModule {}
