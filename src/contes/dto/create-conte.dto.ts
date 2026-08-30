export class CreateParagraphDto {
  paragraphNumber?: number;
  textMg!: string;
  textFr!: string;
}

export class CreateConteDto {
  title!: string;
  titleFr!: string;
  subtitle?: string;
  subtitleFr?: string;
  author?: string;
  moralMg?: string;
  moralFr?: string;
  illustration?: string;
  paragraphs?: CreateParagraphDto[];
}
