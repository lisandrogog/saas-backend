import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';
import { AccountsService } from './services/accounts.service';
import { AppUserStatusService } from './services/app-user-status.service';
import { AppUserService } from './services/app-user.service';
import { AppUserBusinessUnitService } from './services/app-user-business-unit.service';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AppUserStatusService,
    AppUserService,
    AppUserBusinessUnitService,
  ],
  exports: [
    AccountsService,
    AppUserStatusService,
    AppUserService,
    AppUserBusinessUnitService,
  ],
})
export class AccountsModule {}
