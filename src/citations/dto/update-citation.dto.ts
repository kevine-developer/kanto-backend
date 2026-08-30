export class UpdateCitationDto {
  citationMg?: string;
  citationFr?: string;
  sourceName?: string;
  contexte?: string;
  authorName?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}
