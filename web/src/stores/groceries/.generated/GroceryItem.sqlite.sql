-- SIGNED-SOURCE: <348b44e65edb70cfd8a8a7fa52d48172>
CREATE TABLE
  IF NOT EXISTS "groceryitem" (
    "id" bigint NOT NULL,
    "listId" bigint NOT NULL,
    "categoryId" bigint NOT NULL,
    "createdAt" bigint NOT NULL,
    "totalQuantity" float NOT NULL,
    "purchasedQuantity" float NOT NULL,
    "unit" text NOT NULL,
    "name" text NOT NULL,
    "sortKey" text NOT NULL,
    primary key ("id")
  )