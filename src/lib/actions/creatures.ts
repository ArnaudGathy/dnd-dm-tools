"use server";
import "server-only";

import { z } from "zod";
import { kebabCaseify } from "@/utils/utils";
import { getSummaryCreatureFromEN } from "@/lib/external-apis/aidedd";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      error: `Aucune creéature trouvée avec ce nom : ${kebabCasedSpellName}`,
    };
  }

  const existingCreature = await prisma.creature.findUnique({
    where: {
      id: creatureData.id,
    },
  });

  let creatureId = existingCreature?.id;
  const characterId = validation.data.characterId;
  const existingCreatureForCharacter =
    await prisma.creaturesOnCharacters.findUnique({
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
