-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- Data migration: keep the current (alphabetical) sheet order as the initial custom order.
UPDATE "Weapon" AS w
SET "position" = ranked.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "characterId" ORDER BY lower("name"), "id") - 1 AS rn
  FROM "Weapon"
) AS ranked
WHERE w."id" = ranked."id";
