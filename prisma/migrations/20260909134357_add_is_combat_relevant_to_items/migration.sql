-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "isCombatRelevant" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MagicItem" ADD COLUMN     "isCombatRelevant" BOOLEAN NOT NULL DEFAULT false;
