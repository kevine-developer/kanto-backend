export class FindItemsQueryDto {
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  themeSlug?: string;
  search?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}
