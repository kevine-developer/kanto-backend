export class CreateSlideDto {
  title!: string;
  titleMg!: string;
  subtitle?: string;
  description!: string;
  imageUrl?: string;
  accentColor?: string;
  iconName?: string;
  isActive?: boolean;
  order?: number;
}

export class UpdateSlideDto {
  title?: string;
  titleMg?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string | null;
  accentColor?: string;
  iconName?: string;
  isActive?: boolean;
  order?: number;
}

export class ReorderSlidesDto {
  slideIds!: string[];
}

export class UploadOnboardingImageDto {
  imageBase64!: string;
  fileName?: string;
}
