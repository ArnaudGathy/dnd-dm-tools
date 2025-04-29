"use server";
import "server-only";

import prisma from "@/lib/prisma";
import {
  backendInventoryItemSchema,
  InventoryFormSchema,
} from "@/app/characters/add/utils";
import { revalidatePath } from "next/cache";

export const addInventoryItem = async (
  data: InventoryFormSchema,
  characterId: number,
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

  revalidatePath("/characters");
};

export const deleteInventoryItem = async (itemId: number) => {
  await prisma.inventoryItem.delete({
    where: { id: itemId },
  });
  revalidatePath("/characters");
};
