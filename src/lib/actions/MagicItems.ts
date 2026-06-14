"use server";
import "server-only";

import prisma from "@/lib/prisma";
import { backendMagicItemSchema, MagicItemFormSchema } from "@/app/(with-nav)/characters/add/utils";
import { revalidatePath } from "next/cache";

export const addMagicItem = async (
  data: MagicItemFormSchema,
  characterId: number | null,
  itemId?: number,
) => {
  const validated = backendMagicItemSchema.safeParse(data);

  if (!validated.success) {
    console.error(validated.error);
    return JSON.stringify(validated.error, null, 2);
  }

  const item = {
    name: validated.data.name,
    description: validated.data.description,
    charges: validated.data.charges,
    rarity: validated.data.rarity,
    isAttuned: validated.data.isAttuned,
    characterId: characterId,
  };

  if (itemId) {
    await prisma.magicItem.update({
      where: { id: itemId },
      data: item,
    });
  } else {
    await prisma.magicItem.create({
      data: item,
    });
  }

  if (characterId) {
    revalidatePath(`/characters/${characterId}`);
  } else {
    revalidatePath("/magic-items");
  }
};

export const assignMagicItemToCharacter = async ({
  itemId,
  characterId,
}: {
  itemId: number;
  characterId: number;
}) => {
  await prisma.magicItem.update({
    where: { id: itemId },
    data: { characterId },
  });

  revalidatePath("/magic-items");
  revalidatePath(`/characters/${characterId}`);
};

export const transferMagicItem = async ({
  itemId,
  fromCharacterId,
  toCharacterId,
}: {
  itemId: number;
  fromCharacterId: number;
  toCharacterId: number;
}) => {
  await prisma.magicItem.update({
    where: { id: itemId },
    data: { characterId: toCharacterId },
  });

  revalidatePath(`/characters/${fromCharacterId}`);
  revalidatePath(`/characters/${toCharacterId}`);
};

export const deleteMagicItem = async (itemId: number) => {
  await prisma.magicItem.delete({
    where: { id: itemId },
  });
  revalidatePath("/characters");
  revalidatePath("/magic-items");
};
