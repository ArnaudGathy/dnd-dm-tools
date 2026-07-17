"use server";
import "server-only";

import prisma from "@/lib/prisma";
import {
  backendInventoryItemSchema,
  InventoryFormSchema,
} from "@/app/(with-nav)/characters/add/utils";
import { revalidatePath } from "next/cache";

export const addInventoryItem = async (
  data: InventoryFormSchema,
  characterId: number | null,
  itemId?: number,
) => {
  const validated = backendInventoryItemSchema.safeParse(data);

  if (!validated.success) {
    console.error(validated.error);
    return JSON.stringify(validated.error, null, 2);
  }

  const item = {
    name: validated.data.name,
    description: validated.data.description,
    quantity: validated.data.quantity,
    value: validated.data.value,
    characterId: characterId,
  };

  if (itemId) {
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: item,
    });
  } else {
    await prisma.inventoryItem.create({
      data: item,
    });
  }

  if (characterId) {
    revalidatePath(`/characters/${characterId}`);
  } else {
    revalidatePath("/inventory-items");
  }
};

export const assignInventoryItemToCharacter = async ({
  itemId,
  characterId,
}: {
  itemId: number;
  characterId: number;
}) => {
  await prisma.inventoryItem.update({
    where: { id: itemId },
    data: { characterId },
  });

  revalidatePath("/inventory-items");
  revalidatePath(`/characters/${characterId}`);
};

export const transferInventoryItem = async ({
  itemId,
  fromCharacterId,
  toCharacterId,
  quantity,
}: {
  itemId: number;
  fromCharacterId: number;
  toCharacterId: number;
  quantity: number;
}) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return;
  }

  const amount = Math.max(1, Math.min(Math.trunc(quantity), item.quantity));

  if (amount >= item.quantity) {
    // Transfer the whole stack: just reassign it to the target character.
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { characterId: toCharacterId },
    });
  } else {
    // Split the stack: decrement the source, create a new stack on the target.
    await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: item.quantity - amount },
      }),
      prisma.inventoryItem.create({
        data: {
          name: item.name,
          description: item.description,
          value: item.value,
          quantity: amount,
          characterId: toCharacterId,
        },
      }),
    ]);
  }

  revalidatePath(`/characters/${fromCharacterId}`);
  revalidatePath(`/characters/${toCharacterId}`);
};

export const deleteInventoryItem = async (itemId: number) => {
  await prisma.inventoryItem.delete({
    where: { id: itemId },
  });
  revalidatePath("/characters");
  revalidatePath("/inventory-items");
};
