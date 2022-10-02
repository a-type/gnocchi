/*
  Warnings:

  - You are about to drop the column `subscription_cancelled_at` on the `plans` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "subscription_expires_at" DATETIME,
    "subscription_canceled_at" DATETIME,
    "subscription_status" TEXT
);
INSERT INTO "new_plans" ("created_at", "deleted_at", "id", "stripe_customer_id", "stripe_subscription_id", "subscription_expires_at", "subscription_status", "updated_at") SELECT "created_at", "deleted_at", "id", "stripe_customer_id", "stripe_subscription_id", "subscription_expires_at", "subscription_status", "updated_at" FROM "plans";
DROP TABLE "plans";
ALTER TABLE "new_plans" RENAME TO "plans";
CREATE UNIQUE INDEX "plans_stripe_subscription_id_key" ON "plans"("stripe_subscription_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
