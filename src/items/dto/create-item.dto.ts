export class CreateDialectVariantDto {
  dialectName!: string;
  text!: string;
  notes?: string;
}

export class CreateItemDto {
  malagasy!: string;
  french!: string;
  meaning!: string;
  example?: string;
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  isFeatured?: boolean;
  dialectVariants?: CreateDialectVariantDto[];
}
