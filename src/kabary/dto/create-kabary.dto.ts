export class CreateKabaryStepDto {
  stepNumber?: number;
  stepNameMg!: string;
  stepNameFr!: string;
  explanationFr?: string;
  textMg!: string;
  textFr!: string;
}

export class CreateKabaryDto {
  title!: string;
  titleFr!: string;
  occasion!: string;
  occasionFr?: string;
  speakerRoleMg?: string;
  recipientRoleMg?: string;
  region?: string;
  concludingProverbMg?: string;
  steps?: CreateKabaryStepDto[];
}
