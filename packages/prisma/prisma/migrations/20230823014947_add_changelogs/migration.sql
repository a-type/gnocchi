-- CreateTable
CREATE TABLE "ChangelogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "image_url" TEXT,
    "important" BOOLEAN NOT NULL DEFAULT false
);
