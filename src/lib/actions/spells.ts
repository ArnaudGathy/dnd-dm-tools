"use server";
import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSpellDataFromENName2024 } from "@/lib/external-apis/aidedd";
import { z } from "zod";

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

  const spellData = await getSpellDataFromENName2024(kebabCasedSpellName);

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
  return { message: "Sort ajouté avec succès !", error: "" };
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
