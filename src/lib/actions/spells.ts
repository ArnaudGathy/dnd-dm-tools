"use server";
import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  getSpellDataFromENName,
  getSpellDataFromFRName,
} from "@/lib/external-apis/aidedd";
import { z } from "zod";
import { Spell, SpellVersion } from "@prisma/client";

export const updateSpellFavoriteAction = async ({
  spellId,
  spellVersion,
  characterId,
  currentIsFavoriteState,
}: {
  spellId: string;
  spellVersion: SpellVersion;
  characterId: number;
  currentIsFavoriteState: boolean;
}) => {
  await prisma.spellsOnCharacters.update({
    where: {
      spellId_spellVersion_characterId: {
        characterId,
        spellId,
        spellVersion,
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
      spellVersion: z.nativeEnum(SpellVersion),
    })
    .safeParse({
      spellName: formData.get("spellName"),
      characterId: formData.get("characterId"),
      spellVersion: formData.get("spellVersion"),
    });

  if (!validation.success) {
    console.error(validation.error);
    throw new Error("Could not validate spell name");
  }

  const kebabCasedSpellName = kebabCaseify(validation.data.spellName);

  let spellData: Spell | null;
  if (validation.data.spellVersion === SpellVersion.V2024) {
    spellData = null;
  } else {
    spellData = await getSpellDataFromFRName(kebabCasedSpellName);
    if (!spellData) {
      spellData = await getSpellDataFromENName(kebabCasedSpellName);
    }
  }

  if (!spellData) {
    return { error: `Aucun sort trouvé avec ce nom : ${kebabCasedSpellName}` };
  }

  const existingSpell = await prisma.spell.findUnique({
    where: {
      id_version: {
        id: spellData.id,
        version: spellData.version,
      },
    },
  });

  let spellId = existingSpell?.id;
  const characterId = validation.data.characterId;
  const existingSpellForCharacter = await prisma.spellsOnCharacters.findUnique({
    where: {
      spellId_spellVersion_characterId: {
        characterId,
        spellId: spellData.id,
        spellVersion: spellData.version,
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
  spellVersion,
}: {
  spellId: string;
  characterId: number;
  spellVersion: SpellVersion;
}) => {
  await prisma.spellsOnCharacters.delete({
    where: {
      spellId_spellVersion_characterId: {
        characterId,
        spellId,
        spellVersion,
      },
    },
  });
  revalidatePath("/characters");
};
