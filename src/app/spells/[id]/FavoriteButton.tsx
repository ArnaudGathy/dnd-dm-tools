import { updateSpellFavoriteAction } from "@/lib/actions/spells";
import { SpellVersion } from "@prisma/client";
import { ReactNode } from "react";

export const FavoriteButton = ({
  onIcon,
  offIcon,
  isFavorite,
  spellId,
  spellVersion,
  characterId,
}: {
  offIcon: ReactNode;
  onIcon: ReactNode;
  isFavorite: boolean;
  spellId: string;
  spellVersion: SpellVersion;
  characterId: number;
}) => {
  return (
    <form
      action={async () => {
        "use server";
        await updateSpellFavoriteAction({
          characterId: characterId,
          spellId: spellId,
          spellVersion: spellVersion,
          currentIsFavoriteState: isFavorite,
        });
      }}
      className="flex items-center"
    >
      <button type="submit">{isFavorite ? onIcon : offIcon}</button>
    </form>
  );
};
