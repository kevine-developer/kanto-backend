import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
      bodyParser: {
        json: { limit: '5mb' },
        urlencoded: { limit: '5mb', extended: true },
        rawBody: true,
      },
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
