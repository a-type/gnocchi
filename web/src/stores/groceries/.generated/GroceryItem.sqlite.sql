-- SIGNED-SOURCE: <4695ac777516af66787941462809ecc7>
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
    primary key ("id")
  )