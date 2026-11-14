import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.js';
import { PasswordResetSecurityMiddleware } from './middlewares/password-reset-security.middleware.js';
import { MobileAdminAccessMiddleware } from './middlewares/mobile-admin-access.middleware.js';

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
  providers: [PasswordResetSecurityMiddleware, MobileAdminAccessMiddleware],
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

    consumer
      .apply(MobileAdminAccessMiddleware)
      .forRoutes(
        { path: 'api/auth/sign-in/{*path}', method: RequestMethod.POST },
        { path: 'auth/sign-in/{*path}', method: RequestMethod.POST },
        { path: 'api/auth/sign-in', method: RequestMethod.POST },
        { path: 'auth/sign-in', method: RequestMethod.POST },
        { path: 'sign-in/{*path}', method: RequestMethod.POST },
      );
  }
}
