export class ImportItemRowDto {
  malagasy!: string;
  french!: string;
  meaning!: string;
  example?: string;
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  isFeatured?: boolean;
  dialectName?: string;
  dialectText?: string;
}

export class ImportItemsBatchDto {
  items!: ImportItemRowDto[];
  skipDuplicates?: boolean;
}

export interface ImportItemsResult {
  totalReceived: number;
  importedCount: number;
  duplicatesSkipped: number;
  errorsCount: number;
  errors: Array<{
    row: number;
    text: string;
    reason: string;
  }>;
}
