"use server";
import "server-only";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateMoney = async (moneyId: number, formData: FormData) => {
  const validation = z
    .object({
      quantity: z.coerce.number().min(0),
    })
    .safeParse({
      quantity: formData.get("quantity"),
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
