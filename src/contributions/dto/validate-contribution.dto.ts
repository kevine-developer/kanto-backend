import { IsBoolean } from 'class-validator';

export class ValidateContributionDto {
  @IsBoolean()
  approve!: boolean;
}
