-- AlterTable: Ajout des champs imageUrl et category sur les decks UGC (UserQuizSet)
ALTER TABLE "user_quiz_sets" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "user_quiz_sets" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'culture_generale';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_quiz_sets_category_idx" ON "user_quiz_sets"("category");
