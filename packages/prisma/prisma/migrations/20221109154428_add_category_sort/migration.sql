-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_default_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sort_key" TEXT NOT NULL DEFAULT 'a0'
);
INSERT INTO "new_default_categories" ("id", "name") SELECT "id", "name" FROM "default_categories";
DROP TABLE "default_categories";
ALTER TABLE "new_default_categories" RENAME TO "default_categories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
