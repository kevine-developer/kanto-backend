import { CreateKabaryStepDto } from './create-kabary.dto.js';

export class UpdateKabaryDto {
  title?: string;
  titleFr?: string;
  occasion?: string;
  occasionFr?: string;
  speakerRoleMg?: string;
  recipientRoleMg?: string;
  region?: string;
  concludingProverbMg?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  steps?: CreateKabaryStepDto[];
}
