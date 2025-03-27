"use server";
import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
