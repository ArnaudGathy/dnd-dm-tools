import { updateSpellFlagAction } from "@/lib/actions/spells";
import { SpellWithFlags } from "@/lib/api/spells";
import { CharacterById, cn } from "@/lib/utils";
import { Classes } from "@prisma/client";
import {
  getUsability,
  USABILITY_CONFIG,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";
import { Star } from "lucide-react";

export const SpellStatusButton = ({
  spell,
  character,
}: {
  spell: SpellWithFlags;
  character: CharacterById;
}) => {
  const isWizard = character.className === Classes.WIZARD;
  const usability = getUsability(spell, isWizard);
  const config = USABILITY_CONFIG[usability];

  // Free spells are locked on — usability comes from the config/class, not a
  // click. Render a non-interactive star instead of a toggle.
  if (usability === "free") {
    return (
      <span
        title={`${config.label} — ${config.hint}`}
        className="flex size-5 shrink-0 items-center justify-center"
      >
        <Star className="size-3.5 fill-amber-500 text-amber-500" />
      </span>
    );
  }

  const isPrepared = usability === "prepared";

  return (
    <form
      action={async () => {
        "use server";
        await updateSpellFlagAction({
          characterId: character.id,
          spellId: spell.id,
          flagName: "isPrepared",
          newState: !spell.isPrepared,
        });
      }}
      className="flex items-center"
    >
      <button
        type="submit"
        title={
          isPrepared
            ? `${config.label} — cliquer pour oublier`
            : `${config.label} — cliquer pour préparer`
        }
        className="group/toggle flex size-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <span
          className={cn(
            "size-3 rounded-full transition-colors",
            isPrepared
              ? "bg-sky-500"
              : "border-2 border-muted-foreground/40 group-hover/toggle:border-muted-foreground",
          )}
        />
      </button>
    </form>
  );
};
