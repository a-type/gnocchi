-- CreateTable
CREATE TABLE "default_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "default_food_category_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "food_name" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "default_food_category_assignments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "default_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "plan_id" TEXT NOT NULL,
    "is_product_admin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "profiles_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("created_at", "email", "friendly_name", "full_name", "id", "imageUrl", "plan_id", "updated_at") SELECT "created_at", "email", "friendly_name", "full_name", "id", "imageUrl", "plan_id", "updated_at" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "default_food_category_assignments_food_name_idx" ON "default_food_category_assignments"("food_name");
