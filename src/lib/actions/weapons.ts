"use server";
import "server-only";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateWeaponAmmunitionCount = async (
  weaponId: number,
  ammunitionCount?: number,
) => {
  const validation = z
    .object({
      ammunitionCount: z.number().min(0).max(20),
    })
    .safeParse({
      ammunitionCount,
    });

  if (validation.success) {
    await prisma.weapon.update({
      where: { id: weaponId },
      data: { ammunitionCount: validation.data.ammunitionCount },
    });
    revalidatePath("/characters");
  } else {
    console.error(validation.error);
  }
};
