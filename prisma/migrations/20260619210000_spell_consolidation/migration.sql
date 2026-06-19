-- Drop the raw casting time column (the raw value is still available in Spell.data;
-- only the derived actionType column is kept for filtering).
ALTER TABLE "Spell" DROP COLUMN "castingTime";

-- Switch the spell classes column from the bespoke SpellClass enum to the shared
-- Classes enum. The column is dropped and recreated; values are reprojected from
-- Spell.data afterwards (scripts/reproject-spell-columns.ts).
ALTER TABLE "Spell" DROP COLUMN "classes";
ALTER TABLE "Spell" ADD COLUMN "classes" "Classes"[];

-- Remove the now-unused SpellClass enum.
DROP TYPE "SpellClass";

-- Drop the CachedSpell table — its payload now lives in Spell.data.
DROP TABLE "CachedSpell";
