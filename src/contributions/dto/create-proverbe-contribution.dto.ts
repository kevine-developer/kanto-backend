export class CreateProverbeContributionDto {
  category!: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  textMg!: string;
  textFr!: string;
  meaning!: string;
  region?: string;
}
