import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Partner, PartnerApiKey } from '../../../generated/prisma/client.js';

export interface AuthenticatedPartnerRequest {
  partner: Partner;
  apiKey?: PartnerApiKey;
  partnerScopes?: string[];
}

export const CurrentPartner = createParamDecorator(
  (data: keyof Partner | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<AuthenticatedPartnerRequest>();
    const partner = request.partner;
    if (!partner) return null;
    return data ? partner[data] : partner;
  },
);

export const CurrentApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<AuthenticatedPartnerRequest>();
    return request.apiKey ?? null;
  },
);
