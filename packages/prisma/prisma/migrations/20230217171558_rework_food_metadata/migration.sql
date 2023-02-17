/*
 Warnings:
 
 - You are about to drop the column `food_name` on the `default_food_category_assignments` table. All the data in the column will be lost.
 - Reset all food data.
 
 */
-- CreateTable
CREATE TABLE "food_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canonicalName" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "is_perishable" BOOLEAN NOT NULL DEFAULT false,
    "is_staple" BOOLEAN NOT NULL DEFAULT false,
    "expires_after_days" INTEGER
);

-- CreateTable
CREATE TABLE "food_names" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "food_id" TEXT NOT NULL,
    CONSTRAINT "food_names_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "published_recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_id" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,
    "publisher_id" TEXT,
    "unpublished_at" DATETIME,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "published_recipes_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "profiles" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "published_recipe_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "published_recipe_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "unit" TEXT,
    "food" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "comments" TEXT NOT NULL DEFAULT '[]',
    "index" INTEGER NOT NULL,
    CONSTRAINT "published_recipe_ingredients_published_recipe_id_fkey" FOREIGN KEY ("published_recipe_id") REFERENCES "published_recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "published_recipe_instructions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "published_recipe_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    CONSTRAINT "published_recipe_instructions_published_recipe_id_fkey" FOREIGN KEY ("published_recipe_id") REFERENCES "published_recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
DROP TABLE "default_food_category_assignments";

CREATE TABLE "default_food_category_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "default_food_category_assignments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "default_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "default_food_category_assignments_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food_data" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "default_food_category_assignments_category_id_food_id_key" ON "default_food_category_assignments"("category_id", "food_id");

-- CreateIndex
CREATE UNIQUE INDEX "published_recipes_slug_key" ON "published_recipes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "published_recipes_recipe_id_library_id_key" ON "published_recipes"("recipe_id", "library_id");
