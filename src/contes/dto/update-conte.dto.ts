import { CreateParagraphDto } from './create-conte.dto.js';

export class UpdateConteDto {
  title?: string;
  titleFr?: string;
  subtitle?: string;
  subtitleFr?: string;
  author?: string;
  moralMg?: string;
  moralFr?: string;
  illustration?: string;
  audioUrlMg?: string;
  audioUrlFr?: string;
  isHumanVoiceMg?: boolean;
  isHumanVoiceFr?: boolean;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  paragraphs?: CreateParagraphDto[];
}
