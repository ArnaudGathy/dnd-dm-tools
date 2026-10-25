-- AlterTable
ALTER TABLE "CharacterNote" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- Data migration: keep the current (creation) order as the initial custom order.
UPDATE "CharacterNote" AS n
SET "position" = ranked.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "characterId" ORDER BY "createdAt", "id") - 1 AS rn
  FROM "CharacterNote"
) AS ranked
WHERE n."id" = ranked."id";
