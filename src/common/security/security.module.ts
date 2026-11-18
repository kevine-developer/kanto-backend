import { Global, Module } from '@nestjs/common';
import { ContentAccessControlService } from './content-access-control.service.js';
import { AccountStatusGuard } from '../guards/account-status.guard.js';

@Global()
@Module({
  providers: [ContentAccessControlService, AccountStatusGuard],
  exports: [ContentAccessControlService, AccountStatusGuard],
})
export class SecurityModule {}
