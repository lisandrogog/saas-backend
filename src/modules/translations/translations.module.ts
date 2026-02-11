import { Module } from '@nestjs/common';
import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';
import { BaseTranslationService } from './services/base-translation.service';
import { IndustryTranslationService } from './services/industry-translation.service';
import { TenantTranslationService } from './services/tenant-translation.service';

@Module({
  controllers: [TranslationsController],
  providers: [
    TranslationsService,
    BaseTranslationService,
    TenantTranslationService,
    IndustryTranslationService,
  ],
  exports: [
    TranslationsService,
    BaseTranslationService,
    TenantTranslationService,
    IndustryTranslationService,
  ],
})
export class TranslationsModule {}
