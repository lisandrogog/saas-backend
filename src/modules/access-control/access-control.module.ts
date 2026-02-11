import { Module } from '@nestjs/common';
import { AccessControlController } from './controllers/access-control.controller';
import { AccessControlService } from './services/access-control.service';
import { AccessScopeService } from './services/access-scope.service';
import { PermissionTypeService } from './services/permission-type.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';

@Module({
  controllers: [AccessControlController],
  providers: [
    AccessControlService,
    AccessScopeService,
    PermissionTypeService,
    PermissionService,
    RoleService,
  ],
  exports: [
    AccessControlService,
    AccessScopeService,
    PermissionTypeService,
    PermissionService,
    RoleService,
  ],
})
export class AccessControlModule {}
