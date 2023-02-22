/*
  Warnings:

  - Made the column `publisher_id` on table `published_recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_published_recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_id" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    "unpublished_at" DATETIME,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "prelude_serialized" TEXT,
    "main_image_url" TEXT,
    "instructions_serialized" TEXT,
    CONSTRAINT "published_recipes_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_published_recipes" ("id", "instructions_serialized", "library_id", "main_image_url", "prelude_serialized", "published_at", "publisher_id", "recipe_id", "slug", "title", "unpublished_at", "version") SELECT "id", "instructions_serialized", "library_id", "main_image_url", "prelude_serialized", "published_at", "publisher_id", "recipe_id", "slug", "title", "unpublished_at", "version" FROM "published_recipes";
DROP TABLE "published_recipes";
ALTER TABLE "new_published_recipes" RENAME TO "published_recipes";
CREATE UNIQUE INDEX "published_recipes_slug_key" ON "published_recipes"("slug");
CREATE UNIQUE INDEX "published_recipes_recipe_id_library_id_key" ON "published_recipes"("recipe_id", "library_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
