import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PublicDisplayNameTypeDto } from './create-review.dto.js';

export class UpdatePublicationConsentDto {
  @IsBoolean()
  isPublicationAuthorized: boolean;

  @IsOptional()
  @IsEnum(PublicDisplayNameTypeDto)
  publicDisplayNameType?: PublicDisplayNameTypeDto;
}

export class UpdateDisplayNamePreferenceDto {
  @IsEnum(PublicDisplayNameTypeDto)
  publicDisplayNameType: PublicDisplayNameTypeDto;
}
