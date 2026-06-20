import { updateSpellFlagAction } from "@/lib/actions/spells";
import { SpellWithFlags } from "@/lib/api/spells";
import { CharacterById, cn } from "@/lib/utils";
import { Classes } from "@prisma/client";
import {
  CATEGORY_CONFIG,
  getSpellCategory,
  isSpellUsable,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";

export const SpellStatusButton = ({
  spell,
  character,
}: {
  spell: SpellWithFlags;
  character: CharacterById;
}) => {
  const isWizard = character.className === Classes.WIZARD;
  const usable = isSpellUsable(spell, isWizard);
  const category = getSpellCategory(spell, isWizard);
  const config = CATEGORY_CONFIG[category];

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
        title={`${config.label} — cliquer pour ${usable ? "oublier" : "préparer"}`}
        className="group/toggle flex size-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
      >
        <span
          className={cn(
            "size-3 rounded-full transition-colors",
            usable
              ? config.fill
              : "border-2 border-muted-foreground/40 group-hover/toggle:border-muted-foreground",
          )}
        />
      </button>
    </form>
  );
};
