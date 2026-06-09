-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_CURSED_ONE';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_DEMIGOD';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_DOOMED_ONE';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_DRAGON_SLAYER';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_GIFTED_ONE';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_HAUNTED_ONE';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_LOST_ONE';
ALTER TYPE "Backgrounds" ADD VALUE 'OOTDL_VANISHED_ONE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Races" ADD VALUE 'OOTDL_AUTOMATAI';
ALTER TYPE "Races" ADD VALUE 'OOTDL_GYGAN';
ALTER TYPE "Races" ADD VALUE 'OOTDL_JANCAN';
ALTER TYPE "Races" ADD VALUE 'OOTDL_MYRMEKES';
ALTER TYPE "Races" ADD VALUE 'OOTDL_NYMPH';
ALTER TYPE "Races" ADD VALUE 'OOTDL_NYXIAN';
ALTER TYPE "Races" ADD VALUE 'OOTDL_THYLEAN_CENTAUR';
ALTER TYPE "Races" ADD VALUE 'OOTDL_THYLEAN_MEDUSA';
ALTER TYPE "Races" ADD VALUE 'OOTDL_THYLEAN_MINOTAUR';
ALTER TYPE "Races" ADD VALUE 'OOTDL_THYLEAN_SATYR';
ALTER TYPE "Races" ADD VALUE 'OOTDL_THYLEAN_SIREN';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_HERCULEAN_PATH';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_COLLEGE_OF_EPIC_POETRY';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_PROPHECY_DOMAIN';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_CIRCLE_OF_SACRIFICE';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_CIRCLE_OF_THE_WYRM';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_DRAGON_KNIGHT';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_HOPLITE';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_WARRIOR_OF_THE_SHIELD';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_OATH_OF_THE_DRAGONLORD';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_AMAZON';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_ODYSSEAN';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_DIVINE_SORCERY';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_THE_FATES';
ALTER TYPE "Subclasses" ADD VALUE 'OOTDL_ACADEMY_PHILOSOPHER';
