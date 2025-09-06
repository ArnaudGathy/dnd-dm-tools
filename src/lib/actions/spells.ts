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

export const updateSpellFlagAction = async ({
  flagName,
  spellId,
  characterId,
  newState,
}: {
  flagName: keyof Prisma.SpellsOnCharactersUpdateInput;
  spellId: string;
  characterId: number;
  newState: boolean;
}) => {
  await prisma.spellsOnCharacters.update({
    where: {
      spellId_characterId: {
        characterId,
        spellId,
      },
    },
    data: {
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
