-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_default_food_category_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "food_name" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "default_food_category_assignments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "default_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_default_food_category_assignments" ("category_id", "food_name", "id", "votes") SELECT "category_id", "food_name", "id", "votes" FROM "default_food_category_assignments";
DROP TABLE "default_food_category_assignments";
ALTER TABLE "new_default_food_category_assignments" RENAME TO "default_food_category_assignments";
CREATE INDEX "default_food_category_assignments_food_name_idx" ON "default_food_category_assignments"("food_name");
CREATE UNIQUE INDEX "default_food_category_assignments_category_id_food_name_key" ON "default_food_category_assignments"("category_id", "food_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
