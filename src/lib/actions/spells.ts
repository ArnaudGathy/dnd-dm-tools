"use server";
import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  getEnSpellIdFromFrName,
  getSpellDataFromFrName,
  getSummarySpellFromFR,
} from "@/lib/external-apis/aidedd";
import { z } from "zod";
import { SummaryAPISpell } from "@/types/schemas";
import { Prisma } from "@prisma/client";
import { kebabCaseify } from "@/utils/utils";
import { getSessionData, restrictToAdmins } from "@/lib/utils";
import { getMaxCastableSpellLevel, isPreparedListClass } from "@/utils/stats/spells";

export const clearSpellCache = async ({
  spellId,
  pathToRevalidate,
}: {
  spellId: string;
  pathToRevalidate?: string;
}) => {
  await restrictToAdmins();

  // Drop the cached payload so the next render refetches it from AideDD and
  // repopulates the projected columns. The Spell row itself is kept (it's the
  // FK target for SpellsOnCharacters).
  await prisma.spell.update({
    where: { id: spellId },
    data: { data: Prisma.DbNull },
  });

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }
};

type SpellFlagName =
  | "isFavorite"
  | "isPrepared"
  | "isAlwaysPrepared"
  | "hasLongRestCast"
  | "canBeSwappedOnLongRest"
  | "canBeSwappedOnLevelUp";

export const updateSpellFlagAction = async ({
  flagName,
  spellId,
  characterId,
  newState,
}: {
  flagName: SpellFlagName;
  spellId: string;
  characterId: number;
  newState: boolean;
}) => {
  // Upsert, not update: prepared-from-list classes have no row for an
  // auto-listed spell until they prepare/configure it, so the first toggle
  // must create the row. Known classes already have a row, so this updates it.
  await prisma.spellsOnCharacters.upsert({
    where: {
      spellId_characterId: {
        characterId,
        spellId,
      },
    },
    update: {
      [flagName]: newState,
    },
    create: {
      spellId,
      characterId,
      [flagName]: newState,
    },
  });

  revalidatePath(`/characters/${characterId}/spells`);
};

export const tryToAddSpell = async (
  prevState: { error?: string; message?: string },
  formData: FormData,
) => {
  const validation = z
    .object({
      spellName: z.string(),
      characterId: z.coerce.number(),
    })
    .safeParse({
      spellName: formData.get("spellName"),
      characterId: formData.get("characterId"),
    });

  if (!validation.success) {
    console.error(validation.error);
    throw new Error("Could not validate spell name");
  }

  const kebabCasedSpellName = kebabCaseify(validation.data.spellName);

  let spellData: SummaryAPISpell | null;

  const frSummary = await getSummarySpellFromFR(kebabCasedSpellName);

  if (frSummary) {
    const enSpellId = await getEnSpellIdFromFrName(kebabCasedSpellName);
    spellData = { ...frSummary, id: enSpellId };
  } else {
    const { frId, enId } = await getSpellDataFromFrName(kebabCasedSpellName);
    const frSummary = await getSummarySpellFromFR(frId);
    if (enId && frSummary) {
      spellData = { ...frSummary, id: enId };
    } else {
      spellData = null;
    }
  }

  if (!spellData) {
    return { error: `Aucun sort trouvé avec ce nom : ${kebabCasedSpellName}` };
  }

  const existingSpell = await prisma.spell.findUnique({
    where: {
      id: spellData.id,
    },
  });

  let spellId = existingSpell?.id;
  const characterId = validation.data.characterId;
  const existingSpellForCharacter = await prisma.spellsOnCharacters.findUnique({
    where: {
      spellId_characterId: {
        characterId,
        spellId: spellData.id,
      },
    },
  });

  if (!!existingSpellForCharacter) {
    return { error: "Ce sort existe déjà sur ce personnage." };
  }

  if (!spellId) {
    const createdSpell = await prisma.spell.create({
      data: spellData,
    });
    spellId = createdSpell.id;
  }

  await prisma.spellsOnCharacters.create({
    data: {
      spellId,
      characterId,
      isFavorite: false,
    },
  });

  revalidatePath(`/characters/${characterId}/spells`);
  return {
    message: `Sort "${spellData.name}" ajouté avec succès !`,
    error: "",
  };
};

// Add already-existing spells (picked from the global /spells list) to a
// character's list in one go. Unlike tryToAddSpell, the spells are known to
// exist in the Spell table, so no AideDD lookup is needed.
export const addSpellsToCharacter = async ({
  characterId,
  spellIds,
}: {
  characterId: number;
  spellIds: string[];
}) => {
  const validation = z
    .object({
      characterId: z.number().int(),
      spellIds: z.array(z.string()).min(1),
    })
    .safeParse({ characterId, spellIds });

  if (!validation.success) {
    return { error: "Données invalides." };
  }

  const character = await prisma.character.findUnique({
    where: { id: validation.data.characterId },
    include: { campaign: { select: { owner: true } } },
  });

  if (!character) {
    return { error: "Personnage introuvable." };
  }

  // Authorisation mirrors getValidCharacter: owner, campaign DM, or super admin.
  const { userMail, isSuperAdmin } = await getSessionData();
  const canEdit =
    isSuperAdmin ||
    userMail === character.owner ||
    (!!userMail && character.campaign.owner.includes(userMail));

  if (!canEdit) {
    return { error: "Action non autorisée." };
  }

  const spells = await prisma.spell.findMany({
    where: { id: { in: validation.data.spellIds } },
    select: { id: true, level: true, classes: true },
  });

  // For prepared-from-list classes, a spell already on the auto-list is
  // available without a row — skip it so we don't recreate the redundant
  // leftovers we just cleaned up.
  let autoListed = 0;
  let toInsert = spells;
  if (isPreparedListClass(character.className)) {
    const maxLevel = getMaxCastableSpellLevel(character);
    toInsert = spells.filter((spell) => {
      const isAutoListed =
        spell.level >= 1 && spell.level <= maxLevel && spell.classes.includes(character.className);
      if (isAutoListed) {
        autoListed += 1;
      }
      return !isAutoListed;
    });
  }

  // skipDuplicates leaves spells already on the character untouched.
  const created = await prisma.spellsOnCharacters.createMany({
    data: toInsert.map((spell) => ({ characterId: character.id, spellId: spell.id })),
    skipDuplicates: true,
  });

  revalidatePath(`/characters/${character.id}/spells`);

  return {
    added: created.count,
    alreadyPresent: toInsert.length - created.count,
    autoListed,
    characterName: character.name,
  };
};

export const deleteSpellAction = async ({
  spellId,
  characterId,
}: {
  spellId: string;
  characterId: number;
}) => {
  await prisma.spellsOnCharacters.delete({
    where: {
      spellId_characterId: {
        characterId,
        spellId,
      },
    },
  });
  revalidatePath(`/characters/${characterId}/spells`);
};
