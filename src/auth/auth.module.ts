import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';
import { PasswordResetSecurityMiddleware } from './middlewares/password-reset-security.middleware.js';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
      disableTrustedOriginsCors: true,
      bodyParser: {
        json: { limit: '5mb' },
        urlencoded: { limit: '5mb', extended: true },
        rawBody: true,
      },
    }),
  ],
  providers: [PasswordResetSecurityMiddleware],
  exports: [BetterAuthModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordResetSecurityMiddleware)
      .forRoutes(
        { path: 'api/auth/reset-password', method: RequestMethod.POST },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'reset-password', method: RequestMethod.POST },
      );
  }
}
