-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_type" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "profile_id" TEXT NOT NULL,
    CONSTRAINT "accounts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("access_token", "created_at", "id", "profile_id", "provider", "provider_account_id", "refresh_token", "token_type", "type", "updated_at") SELECT "access_token", "created_at", "id", "profile_id", "provider", "provider_account_id", "refresh_token", "token_type", "type", "updated_at" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
