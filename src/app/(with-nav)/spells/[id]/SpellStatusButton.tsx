import { updateSpellFlagAction } from "@/lib/actions/spells";
import { SpellWithFlags } from "@/lib/api/spells";
import {
  Sparkles,
  SquareCheckBig,
  SquarePlus,
  WandSparkles,
} from "lucide-react";
import { CharacterById, cn } from "@/lib/utils";
import { Classes } from "@prisma/client";

export const SpellStatusButton = ({
  spell,
  character,
}: {
  spell: SpellWithFlags;
  character: CharacterById;
}) => {
  const isSpellPrepared =
    spell.isPrepared ||
    spell.isAlwaysPrepared ||
    (character.className === Classes.WIZARD && spell.isRitual);

  const getColor = () => {
    if (!isSpellPrepared) {
      return "text-neutral-600";
    }

    if (spell.canBeSwappedOnLongRest) {
      return "text-rose-500";
    }
    if (spell.canBeSwappedOnLevelUp) {
      return "text-purple-500";
    }

    if (spell.isAlwaysPrepared) {
      return "text-amber-500";
    }

    if (spell.hasLongRestCast) {
      return "text-fuchsia-500";
    }

    if (spell.isRitual) {
      return "text-emerald-500";
    }

    return "text-sky-500";
  };

  const getIcon = () => {
    const classes = cn(getColor(), "size-5");
    if (spell.hasLongRestCast) {
      return <WandSparkles className={classes} />;
    }
    if (spell.isRitual) {
      return <Sparkles className={classes} />;
    }
    if (isSpellPrepared) {
      return <SquareCheckBig className={classes} />;
    }

    return <SquarePlus className={classes} />;
  };

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
      <button type="submit">{getIcon()}</button>
    </form>
  );
};
