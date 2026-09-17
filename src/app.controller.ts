import { Controller, Get, Header, Headers, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { renderEmailVerificationPage } from './auth/views/email-verification.view.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getHello(
    @Headers('accept') acceptHeader = '',
    @Query('error') error?: string,
    @Query('email') email?: string,
  ): string {
    // Si la requête provient d'un navigateur Web ou d'une redirection d'erreur Better-Auth
    if (error || acceptHeader.includes('text/html')) {
      return renderEmailVerificationPage({
        error,
        email,
        isLanding: !error,
      });
    }
    return this.appService.getHello();
  }

  @Get('email-verified')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getEmailVerified(
    @Query('error') error?: string,
    @Query('email') email?: string,
  ): string {
    return renderEmailVerificationPage({ error, email });
  }

  @Get('auth/email-verified')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getAuthEmailVerified(
    @Query('error') error?: string,
    @Query('email') email?: string,
  ): string {
    return renderEmailVerificationPage({ error, email });
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'kanto-backend',
    };
  }
}
