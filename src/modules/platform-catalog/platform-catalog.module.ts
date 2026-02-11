import { Module } from '@nestjs/common';
import { PlatformCatalogController } from './controllers/platform-catalog.controller';
import { PlatformCatalogService } from './services/platform-catalog.service';
import { PlatformService } from './services/platform.service';
import { AppModuleService } from './services/app-module.service';
import { AppSubModuleService } from './services/app-sub-module.service';

@Module({
  controllers: [PlatformCatalogController],
  providers: [
    PlatformCatalogService,
    PlatformService,
    AppModuleService,
    AppSubModuleService,
  ],
  exports: [
    PlatformCatalogService,
    PlatformService,
    AppModuleService,
    AppSubModuleService,
  ],
})
export class PlatformCatalogModule {}
