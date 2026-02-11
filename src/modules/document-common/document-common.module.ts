import { Module } from '@nestjs/common';

import { DocumentActionService } from './services/document-action.service';
import { DocumentStatusService } from './services/document-status.service';
import { DocumentTypeService } from './services/document-type.service';
import { MovementTypeService } from './services/movement-type.service';
import { DocumentCommonController } from './controllers/document-common.controller';
import { DocumentCommonService } from './services/document-common.service';

@Module({
  controllers: [DocumentCommonController],
  providers: [
    DocumentCommonService,
    DocumentActionService,
    MovementTypeService,
    DocumentTypeService,
    DocumentStatusService,
  ],
  exports: [
    DocumentCommonService,
    DocumentActionService,
    MovementTypeService,
    DocumentTypeService,
    DocumentStatusService,
  ],
})
export class DocumentCommonModule {}
