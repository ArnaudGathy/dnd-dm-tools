import { CLASS_SPELL_PROGRESSION_MAP } from "@/constants/maps";
import { Character } from "@prisma/client";
import { entries } from "remeda";
import { cn } from "@/lib/utils";

const SingleSlot = ({ isExpanded }: { isExpanded?: boolean }) => (
  <div
    className={cn("size-5 rounded border-2 border-sky-100 bg-sky-500", {
      "border-sky-900 bg-transparent": isExpanded,
    })}
  ></div>
);

export default function SpellSlots({ character }: { character: Character }) {
  const spellSlots = CLASS_SPELL_PROGRESSION_MAP[character.className];

  if (spellSlots.length === 0) {
    return null;
  }

  const spellSlotsForCurrentLevel = spellSlots[character.level - 1];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {entries(spellSlotsForCurrentLevel).map(([level, slots]) => (
        <div key={level} className="flex flex-col gap-1">
          <span className="self-center text-sm text-muted-foreground">{`Niv. ${level}`}</span>
          <div className="flex w-11 flex-wrap gap-1">
            {Array(slots)
              .fill(0)
              .map((_, index) => (
                <SingleSlot key={index} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
