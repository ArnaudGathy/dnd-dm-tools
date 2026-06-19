-- Remove the OTHER value from the SpellAction enum.
-- Existing rows using OTHER are migrated to ACTION first, then the enum is
-- recreated without OTHER (Postgres cannot drop an enum value in place).

-- 1. Migrate existing data off OTHER.
UPDATE "Spell" SET "actionType" = 'ACTION' WHERE "actionType" = 'OTHER';

-- 2. Recreate the enum without OTHER.
ALTER TYPE "SpellAction" RENAME TO "SpellAction_old";

CREATE TYPE "SpellAction" AS ENUM ('ACTION', 'BONUS_ACTION', 'REACTION');

ALTER TABLE "Spell" ALTER COLUMN "actionType" TYPE "SpellAction" USING ("actionType"::text::"SpellAction");

DROP TYPE "SpellAction_old";
