/*
  Warnings:

  - You are about to drop the column `dice` on the `MagicItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MagicItem" DROP COLUMN "dice";

-- DropEnum
DROP TYPE "MagicItemDice";
