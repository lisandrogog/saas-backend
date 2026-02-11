import { Module } from '@nestjs/common';
import { DocumentWorkflowController } from './controllers/document-workflow.controller';
import { DocumentWorkflowService } from './services/document-workflow.service';
import { DocumentEngineService } from './services/document-engine.service';
import { DocumentEngineItemService } from './services/document-engine-item.service';

@Module({
  controllers: [DocumentWorkflowController],
  providers: [
    DocumentWorkflowService,
    DocumentEngineService,
    DocumentEngineItemService,
  ],
  exports: [
    DocumentWorkflowService,
    DocumentEngineService,
    DocumentEngineItemService,
  ],
})
export class DocumentWorkflowModule {}
