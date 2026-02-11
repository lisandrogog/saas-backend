import { Module } from '@nestjs/common';
import { CatalogController } from './controllers/catalog.controller';
import { CatalogService } from './services/catalog.service';
import { ProductCategoryService } from './services/product-category.service';
import { ProductService } from './services/product.service';
import { ProductBusinessUnitService } from './services/product-business-unit.service';
import { ProductCategoryTypeService } from './services/product-category-type.service';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    ProductCategoryService,
    ProductService,
    ProductBusinessUnitService,
    ProductCategoryTypeService,
  ],
  exports: [
    CatalogService,
    ProductCategoryService,
    ProductService,
    ProductBusinessUnitService,
    ProductCategoryTypeService,
  ],
})
export class CatalogModule {}
