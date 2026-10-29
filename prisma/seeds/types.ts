/**
 * Types et interfaces pour le système de seeds Prisma Kanto MG
 */

export interface SeedCategoryStats {
  category: string;
  totalInFile: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: number;
}

export interface ValidationIssue {
  itemIndex: number;
  identifier?: string;
  field?: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  issues: ValidationIssue[];
}
