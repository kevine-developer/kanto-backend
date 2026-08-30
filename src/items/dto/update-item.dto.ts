import { CreateDialectVariantDto } from './create-item.dto.js';

export class UpdateItemDto {
  malagasy?: string;
  french?: string;
  meaning?: string;
  example?: string;
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  isFeatured?: boolean;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  dialectVariants?: CreateDialectVariantDto[];
}
