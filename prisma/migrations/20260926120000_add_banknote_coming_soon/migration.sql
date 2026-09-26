-- AlterTable Banknote to support "Contenu à venir" (Coming Soon) & optional descriptions
ALTER TABLE "banknotes" ADD COLUMN IF NOT EXISTS "isComingSoon" BOOLEAN NOT NULL DEFAULT false;

-- Allow nullable descriptions when only images are provided
ALTER TABLE "banknotes" ALTER COLUMN "obverseDescriptionFr" DROP NOT NULL;
ALTER TABLE "banknotes" ALTER COLUMN "obverseDescriptionMg" DROP NOT NULL;
ALTER TABLE "banknotes" ALTER COLUMN "reverseDescriptionFr" DROP NOT NULL;
ALTER TABLE "banknotes" ALTER COLUMN "reverseDescriptionMg" DROP NOT NULL;
ALTER TABLE "banknotes" ALTER COLUMN "symbolismFr" DROP NOT NULL;
ALTER TABLE "banknotes" ALTER COLUMN "symbolismMg" DROP NOT NULL;

-- Default colors and values
ALTER TABLE "banknotes" ALTER COLUMN "colorLight" SET DEFAULT '#2C4075';
ALTER TABLE "banknotes" ALTER COLUMN "colorDark" SET DEFAULT '#3E5AA1';
ALTER TABLE "banknotes" ALTER COLUMN "valueAriary" SET DEFAULT 0;
ALTER TABLE "banknotes" ALTER COLUMN "valueFmg" SET DEFAULT 0;
