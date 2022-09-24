/*
  Warnings:

  - A unique constraint covering the columns `[category_id,food_name]` on the table `default_food_category_assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "default_food_category_assignments_category_id_food_name_key" ON "default_food_category_assignments"("category_id", "food_name");
