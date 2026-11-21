import { Global, Module } from '@nestjs/common';
import { ContentAccessControlService } from './content-access-control.service.js';
import { AccountStatusGuard } from '../guards/account-status.guard.js';
import { DomainSeparationMiddleware } from './domain-separation.middleware.js';

@Global()
@Module({
  providers: [
    ContentAccessControlService,
    AccountStatusGuard,
    DomainSeparationMiddleware,
  ],
  exports: [
    ContentAccessControlService,
    AccountStatusGuard,
    DomainSeparationMiddleware,
  ],
})
export class SecurityModule {}
