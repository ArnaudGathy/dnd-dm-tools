-- CreateEnum
CREATE TYPE "SpellAction" AS ENUM ('ACTION', 'BONUS_ACTION', 'REACTION', 'OTHER');

-- CreateEnum
CREATE TYPE "SpellClass" AS ENUM ('BARDE', 'CLERC', 'DRUIDE', 'ENSORCELEUR', 'GUERRIER', 'MAGICIEN', 'MOINE', 'PALADIN', 'RODEUR', 'ROUBLARD', 'OCCULTISTE', 'ARTIFICIER');

-- AlterTable
ALTER TABLE "Spell" ADD COLUMN     "actionType" "SpellAction",
ADD COLUMN     "castingTime" TEXT,
ADD COLUMN     "classes" "SpellClass"[],
ADD COLUMN     "concentration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "school" TEXT;
