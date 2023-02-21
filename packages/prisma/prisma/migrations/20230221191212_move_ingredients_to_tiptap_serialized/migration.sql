/*
  Warnings:

  - You are about to drop the `published_recipe_instructions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "published_recipes" ADD COLUMN "instructions_serialized" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "published_recipe_instructions";
PRAGMA foreign_keys=on;
