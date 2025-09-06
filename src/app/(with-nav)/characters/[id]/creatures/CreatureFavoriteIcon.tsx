import { Heart } from "lucide-react";
import { FlatCreature } from "@/lib/api/creatures";
import { CharacterById, cn } from "@/lib/utils";
import { setCreatureFavorite } from "@/lib/actions/creatures";

export default function CreatureFavoriteIcon({
  character,
  creature,
}: {
  character: CharacterById;
  creature: FlatCreature;
}) {
  const className = creature.isFavorite ? "text-red-500" : "text-neutral-600";
  return (
    <form
      action={async () => {
        "use server";
        await setCreatureFavorite({
          characterId: character.id,
          creatureId: creature.id,
          currentState: creature.isFavorite,
        });
      }}
      className="flex items-center"
    >
      <button type="submit">
        <Heart className={cn("size-5", className)} />
      </button>
    </form>
  );
}
