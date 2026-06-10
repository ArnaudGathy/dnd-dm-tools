-- AlterTable: convert Campaign.owner from a single text value to a text[] array,
-- preserving the existing value as the first element of the array.
ALTER TABLE "Campaign" ALTER COLUMN "owner" DROP DEFAULT;
ALTER TABLE "Campaign" ALTER COLUMN "owner" SET DATA TYPE TEXT[] USING ARRAY["owner"];
ALTER TABLE "Campaign" ALTER COLUMN "owner" SET DEFAULT ARRAY['arno.firefox@gmail.com']::TEXT[];
