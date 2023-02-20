-- AlterTable
ALTER TABLE "published_recipe_ingredients" ADD COLUMN "note" TEXT;

-- AlterTable
ALTER TABLE "published_recipe_instructions" ADD COLUMN "note" TEXT;

-- AlterTable
ALTER TABLE "published_recipes" ADD COLUMN "main_image_url" TEXT;
ALTER TABLE "published_recipes" ADD COLUMN "prelude_serialized" TEXT;
