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

export const updateSpellFavoriteAction = async ({
  spellId,
  characterId,
  currentIsFavoriteState,
}: {
  spellId: string;
  characterId: number;
  currentIsFavoriteState: boolean;
}) => {
  await prisma.spellsOnCharacters.update({
    where: {
      spellId_characterId: {
        characterId,
        spellId,
      },
    },
    data: {
      isFavorite: !currentIsFavoriteState,
    },
  });

  revalidatePath("/characters");
};

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

  revalidatePath("/characters");
};

const kebabCaseify = (input: string) => {
  return input
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, "") // Trim leading/trailing dashes
    .replace(/--+/g, "-") // Replace multiple dashes with a single one
    .toLowerCase(); // Convert to lowercase
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

  revalidatePath("/characters");
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
  revalidatePath("/characters");
};
