export class CreateKabaryStepContributionDto {
  stepNumber!: number;
  stepNameMg!: string;
  stepNameFr!: string;
  textMg!: string;
  textFr!: string;
  explanationMg?: string;
  explanationFr?: string;
}

export class CreateKabaryContributionDto {
  title!: string;
  titleFr?: string;
  occasion!: string;
  occasionFr?: string;
  speakerRoleMg?: string;
  speakerRoleFr?: string;
  recipientRoleMg?: string;
  recipientRoleFr?: string;
  region?: string;
  concludingProverbMg?: string;
  steps!: CreateKabaryStepContributionDto[];
}
