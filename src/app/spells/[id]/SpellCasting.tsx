import { StatCell } from "@/app/creatures/StatCell";
import { convertFromFeetToSquares } from "@/utils/utils";
import { APISpell } from "@/types/schemas";
import { cn } from "@/lib/utils";

export default function SpellCasting({
  spell,
  tiny,
}: {
  spell: APISpell;
  tiny?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-4",
        { "gap-0 md:gap-x-4 md:gap-y-2": tiny },
      )}
    >
      {spell.casting_time && (
        <StatCell
          name="Incantation"
          stat={spell.casting_time}
          highlightClassName={
            spell.casting_time.includes("bonus action")
              ? "text-orange-400"
              : spell.casting_time.includes("reaction")
                ? "text-purple-400"
                : undefined
          }
          isInline
        />
      )}
      {spell.range && (
        <StatCell
          name="Portée"
          stat={convertFromFeetToSquares(spell.range)}
          isInline
        />
      )}
      {spell.duration && (
        <StatCell
          name="Durée"
          stat={`${spell.duration}${spell.concentration ? " (c)" : ""}`}
          isInline
          highlightClassName={
            spell.concentration ? "text-yellow-500" : undefined
          }
        />
      )}

      {spell.components && (
        <StatCell
          name="Composants"
          stat={`${spell.components.join(", ")}${spell.material && !tiny ? ` + ${spell.material}` : ""}`}
          highlightClassName="truncate"
          isInline
        />
      )}
    </div>
  );
}
