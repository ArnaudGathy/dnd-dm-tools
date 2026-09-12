"use server";
import "server-only";

import { z } from "zod";
import { kebabCaseify } from "@/utils/utils";
import { getSummaryCreatureFromEN } from "@/lib/external-apis/aidedd";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { restrictToAdmins } from "@/lib/utils";
import { creatureSchema } from "@/types/schemas";
import { Prisma } from "@prisma/client";

export const clearCreatureCache = async ({
  creatureId,
  pathToRevalidate,
}: {
  creatureId: string;
  pathToRevalidate?: string;
}) => {
  await restrictToAdmins();

  await prisma.cachedCreature.deleteMany({
    where: { id: creatureId },
  });

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }
};

export async function setCreatureFavorite({
  characterId,
  creatureId,
  currentState,
}: {
  characterId: number;
  creatureId: string;
  currentState: boolean;
}) {
  await prisma.creaturesOnCharacters.update({
    where: {
      creatureId_characterId: {
        creatureId,
        characterId,
      },
    },
    data: {
      isFavorite: !currentState,
    },
  });

  revalidatePath(`/characters/${characterId}/creatures`);
}

export const tryToAddCreature = async (
  prevState: { error?: string; message?: string },
  formData: FormData,
) => {
  const validation = z
    .object({
      creatureName: z.string(),
      characterId: z.coerce.number(),
    })
    .safeParse({
      creatureName: formData.get("creatureName"),
      characterId: formData.get("characterId"),
    });

  if (!validation.success) {
    console.error(validation.error);
    throw new Error("Could not validate spell name");
  }

  const kebabCasedSpellName = kebabCaseify(validation.data.creatureName);

  const creatureData = await getSummaryCreatureFromEN(kebabCasedSpellName);

  if (!creatureData) {
    return {
      error: `Aucune créature trouvée avec ce nom : ${kebabCasedSpellName}`,
    };
  }

  const existingCreature = await prisma.creature.findUnique({
    where: {
      id: creatureData.id,
    },
  });

  let creatureId = existingCreature?.id;
  const characterId = validation.data.characterId;
  const existingCreatureForCharacter = await prisma.creaturesOnCharacters.findUnique({
    where: {
      creatureId_characterId: {
        characterId,
        creatureId: creatureData.id,
      },
    },
  });

  if (!!existingCreatureForCharacter) {
    return { error: "Cette créature existe déjà pour ce personnage." };
  }

  if (!creatureId) {
    const createdCreature = await prisma.creature.create({
      data: creatureData,
    });
    creatureId = createdCreature.id;
  }

  await prisma.creaturesOnCharacters.create({
    data: {
      creatureId,
      characterId,
      isFavorite: false,
    },
  });

  revalidatePath(`/characters/${characterId}/creatures`);

  return {
    message: `Créature "${creatureData.name}" ajouté avec succès !`,
    error: "",
  };
};
export const deleteCreatureAction = async ({
  creatureId,
  characterId,
}: {
  creatureId: string;
  characterId: number;
}) => {
  await prisma.creaturesOnCharacters.delete({
    where: {
      creatureId_characterId: {
        characterId,
        creatureId,
      },
    },
  });
  revalidatePath(`/characters/${characterId}/creatures`);
};

/**
 * Overwrites the cached JSON of a DB-hosted (AideDD) creature. Only rows that already
 * exist in CachedCreature can be edited — local creatures live in source code and
 * creature overrides would silently win over any edit made here.
 */
export const updateCreatureJson = async ({
  creatureId,
  json,
  pathToRevalidate,
}: {
  creatureId: string;
  json: string;
  pathToRevalidate?: string;
}): Promise<{ error?: string; message?: string }> => {
  await restrictToAdmins();

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(json);
  } catch {
    return { error: "JSON invalide : impossible de parser le contenu." };
  }

  const validation = creatureSchema.safeParse(parsedJson);
  if (!validation.success) {
    const issues = validation.error.issues
      .slice(0, 5)
      .map((issue) => `${issue.path.join(".") || "(racine)"} : ${issue.message}`)
      .join("\n");
    return { error: `Le JSON ne correspond pas au schéma d'une créature :\n${issues}` };
  }

  if (validation.data.id !== creatureId) {
    return { error: `L'id doit rester "${creatureId}".` };
  }

  const existing = await prisma.cachedCreature.findUnique({ where: { id: creatureId } });
  if (!existing) {
    return { error: "Cette créature n'est pas stockée en base de données." };
  }

  try {
    await prisma.cachedCreature.update({
      where: { id: creatureId },
      data: { data: validation.data as Prisma.InputJsonValue },
    });
  } catch (error) {
    console.error(`Failed to update cached creature "${creatureId}":`, error);
    return { error: "Impossible de sauvegarder la créature." };
  }

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return { message: `Créature "${validation.data.name}" mise à jour.`, error: "" };
};
