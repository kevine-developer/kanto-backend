import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsIn,
  IsInt,
  Min,
  ArrayMinSize,
  MinLength,
} from 'class-validator';

export class RegisterBetaTesterDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  email: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsArray({ message: 'Veuillez sélectionner au moins une plateforme.' })
  @ArrayMinSize(1, {
    message:
      'Veuillez sélectionner au moins une plateforme (Android, iOS ou les deux).',
  })
  @IsIn(['ANDROID', 'IOS'], {
    each: true,
    message: 'Les plateformes acceptées sont ANDROID et/ou IOS.',
  })
  platforms: ('ANDROID' | 'IOS')[];

  @IsBoolean({
    message: 'Vous devez accepter les conditions de participation.',
  })
  termsAccepted: boolean;

  /**
   * Protection anti-spam Honeypot
   */
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdatePlatformsDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  email: string;

  @IsArray({ message: 'Veuillez sélectionner au moins une plateforme.' })
  @ArrayMinSize(1, {
    message: 'Veuillez sélectionner au moins une plateforme.',
  })
  @IsIn(['ANDROID', 'IOS'], { each: true })
  platforms: ('ANDROID' | 'IOS')[];
}

export class UnsubscribeBetaDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  email: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class VerifyBetaTesterDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  email: string;
}

export class SubmitFeedbackDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  email: string;

  @IsString()
  @IsIn(
    [
      'BUG',
      'UI_UX',
      'PERFORMANCE',
      'NAVIGATION',
      'CONTENT',
      'SUGGESTION',
      'OTHER',
    ],
    { message: 'Catégorie de retour non reconnue.' },
  )
  category: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @MinLength(10, {
    message: 'La description doit comporter au moins 10 caractères.',
  })
  description: string;

  @IsString()
  @IsIn(['ANDROID', 'IOS', 'ALL'])
  platform: 'ANDROID' | 'IOS' | 'ALL';

  @IsOptional()
  @IsString()
  appVersion?: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @IsOptional()
  @IsString()
  screenshotUrl?: string;
}

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  @IsIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class CreateBetaGroupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsArray()
  @IsIn(['ANDROID', 'IOS'], { each: true })
  targetPlatforms?: string[];

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateBetaGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsArray()
  @IsIn(['ANDROID', 'IOS'], { each: true })
  targetPlatforms?: string[];

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreateBetaVersionDto {
  @IsString()
  version: string;

  @IsInt()
  @Min(1)
  buildNumber: number;

  @IsString()
  @IsIn(['ANDROID', 'IOS', 'ALL'])
  platform: 'ANDROID' | 'IOS' | 'ALL';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  releaseNotes?: string;

  @IsOptional()
  @IsString()
  knownIssues?: string;

  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  notifyTesters?: boolean;
}

export class UpdateBetaVersionDto {
  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsInt()
  buildNumber?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ANDROID', 'IOS', 'ALL'])
  platform?: 'ANDROID' | 'IOS' | 'ALL';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  releaseNotes?: string;

  @IsOptional()
  @IsString()
  knownIssues?: string;

  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateEmailTemplateDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsOptional()
  @IsString()
  contentHtml?: string;

  @IsOptional()
  @IsString()
  contentText?: string;

  @IsOptional()
  @IsString()
  buttonText?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @IsOptional()
  @IsString()
  secondaryButtonText?: string;

  @IsOptional()
  @IsString()
  secondaryButtonUrl?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SendCustomEmailDto {
  @IsOptional()
  @IsString()
  templateCode?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  contentHtml?: string;

  @IsOptional()
  targetFilter?: {
    platforms?: ('ANDROID' | 'IOS')[];
    status?: string;
    groupId?: string;
    testerIds?: string[];
  };

  @IsOptional()
  @IsEmail()
  testEmail?: string;
}

export class BulkActionDto {
  @IsArray()
  @ArrayMinSize(1)
  testerIds: string[];

  @IsString()
  @IsIn([
    'INVITE_ANDROID',
    'INVITE_IOS',
    'INVITE_BOTH',
    'ASSIGN_GROUP',
    'CHANGE_STATUS',
    'DELETE',
  ])
  action:
    | 'INVITE_ANDROID'
    | 'INVITE_IOS'
    | 'INVITE_BOTH'
    | 'ASSIGN_GROUP'
    | 'CHANGE_STATUS'
    | 'DELETE';

  @IsOptional()
  @IsString()
  targetGroupId?: string;

  @IsOptional()
  @IsString()
  targetStatus?: string;
}

export class UpdateAutomationConfigDto {
  @IsOptional()
  @IsBoolean()
  autoConfirmRegistration?: boolean;

  @IsOptional()
  @IsBoolean()
  autoInviteOnApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  autoNotifyNewVersions?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  reminderIntervalDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  feedbackRequestDays?: number;

  @IsOptional()
  @IsString()
  playStoreWebLink?: string;

  @IsOptional()
  @IsString()
  playStoreAppLink?: string;

  @IsOptional()
  @IsString()
  testFlightPublicLink?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;
}

export class UpdateTesterStatusDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SendPlayInviteDto {
  @IsOptional()
  @IsString()
  message?: string;
}

export class BulkInviteDto {
  @IsArray()
  testerIds: string[];
}
