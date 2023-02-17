-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_food_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canonicalName" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "is_perishable" BOOLEAN,
    "is_staple" BOOLEAN,
    "expires_after_days" INTEGER
);
INSERT INTO "new_food_data" ("canonicalName", "created_at", "expires_after_days", "id", "is_perishable", "is_staple", "updated_at") SELECT "canonicalName", "created_at", "expires_after_days", "id", "is_perishable", "is_staple", "updated_at" FROM "food_data";
DROP TABLE "food_data";
ALTER TABLE "new_food_data" RENAME TO "food_data";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
