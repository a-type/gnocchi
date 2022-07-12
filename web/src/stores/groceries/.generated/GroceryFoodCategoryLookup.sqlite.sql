-- SIGNED-SOURCE: <eb7bf20daeb7903847df28a923a305ea>
CREATE TABLE
  IF NOT EXISTS "groceryfoodcategorylookup" (
    "id" bigint NOT NULL,
    "categoryId" bigint NOT NULL,
    primary key ("id")
  )