-- CreateTable
CREATE TABLE "temporary_accesses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "claimed_at" DATETIME,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "plan_id" TEXT NOT NULL,
    CONSTRAINT "temporary_accesses_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "temporary_accesses_code_key" ON "temporary_accesses"("code");
