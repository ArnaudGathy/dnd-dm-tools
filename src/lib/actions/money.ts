"use server";
import "server-only";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateMoney = async (moneyId: number, moneyValue: number) => {
  const validation = z
    .object({
      quantity: z.number().min(0),
    })
    .safeParse({
      quantity: moneyValue,
    });

  if (validation.success) {
    await prisma.money.update({
      where: { id: moneyId },
      data: { quantity: validation.data.quantity },
    });
    revalidatePath("/characters");
  } else {
    console.error(validation.error);
  }
};
