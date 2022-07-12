-- SIGNED-SOURCE: <acb9ef81d8e70f6fdcb0d94c0d4791ed>
CREATE TABLE
  IF NOT EXISTS "groceryinput" (
    "id" bigint NOT NULL,
    "itemId" bigint NOT NULL,
    "text" text NOT NULL,
    primary key ("id")
  )