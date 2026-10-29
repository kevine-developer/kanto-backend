export class ImportItemRowDto {
  malagasy!: string;
  french!: string;
  meaning!: string;
  example?: string;
  category?: 'PROVERBE' | 'EXPRESSION' | 'DICTON';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  isFeatured?: boolean;
  phonetic?: string;
  origins?: string[] | string;
  themes?: string[] | string;
  dialectName?: string;
  dialectText?: string;
  dialectVariants?: Array<{
    dialectName: string;
    text: string;
    notes?: string;
  }>;
}

export class ImportItemsBatchDto {
  items!: ImportItemRowDto[];
  skipDuplicates?: boolean;
}

export class CheckDuplicatesDto {
  texts!: string[];
}

export interface CheckDuplicatesResultDto {
  duplicates: string[];
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
