-- DropForeignKey
ALTER TABLE "MagicItem" DROP CONSTRAINT "MagicItem_characterId_fkey";

-- AlterTable
ALTER TABLE "MagicItem" ALTER COLUMN "characterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MagicItem" ADD CONSTRAINT "MagicItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
