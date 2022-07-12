-- SIGNED-SOURCE: <32d4d4347d7fc7f131c9be9773e6fdff>
CREATE TABLE
  IF NOT EXISTS "grocerylist" (
    "id" bigint NOT NULL,
    "name" text NOT NULL,
    primary key ("id")
  )