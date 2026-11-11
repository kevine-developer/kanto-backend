import { SetMetadata } from '@nestjs/common';
import { PartnerApiScope } from '../dto/partner-api-key.dto.js';

export const PARTNER_SCOPES_KEY = 'partner_scopes';
export const RequirePartnerScopes = (...scopes: PartnerApiScope[]) =>
  SetMetadata(PARTNER_SCOPES_KEY, scopes);
