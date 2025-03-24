/*
  Warnings:

  - Added the required column `className` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Classes" AS ENUM ('ARTIFICER', 'BARBARIAN', 'BARD', 'CLERIC', 'DRUID', 'FIGHTER', 'MONK', 'PALADIN', 'RANGER', 'ROGUE', 'SORCERER', 'WARLOCK', 'WIZARD');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "className" "Classes" NOT NULL;

-- add a default to className for existing entries

