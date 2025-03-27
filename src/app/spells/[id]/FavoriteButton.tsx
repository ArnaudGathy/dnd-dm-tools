import { updateSpellFavoriteAction } from "@/lib/actions/spells";
import { ReactNode } from "react";

export const FavoriteButton = ({
  onIcon,
  offIcon,
  isFavorite,
  spellId,
  characterId,
}: {
  offIcon: ReactNode;
  onIcon: ReactNode;
  isFavorite: boolean;
  spellId: string;
  characterId: number;
}) => {
  return (
    <form
      action={async () => {
        "use server";
        await updateSpellFavoriteAction({
          characterId: characterId,
          spellId: spellId,
          currentIsFavoriteState: isFavorite,
        });
      }}
    >
      <button type="submit">{isFavorite ? onIcon : offIcon}</button>
    </form>
  );
};
