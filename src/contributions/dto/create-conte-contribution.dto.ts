export class CreateConteParagraphContributionDto {
  paragraphNumber!: number;
  textMg!: string;
  textFr!: string;
}

export class CreateConteContributionDto {
  title!: string;
  titleFr!: string;
  moralMg?: string;
  moralFr?: string;
  source?: string;
  paragraphs!: CreateConteParagraphContributionDto[];
}
