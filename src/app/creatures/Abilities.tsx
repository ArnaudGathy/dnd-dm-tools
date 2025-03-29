import { entries } from "remeda";
import { getModifier, shortenAbilityName } from "@/utils/utils";
import { Characteristics } from "@/types/types";

export default function Abilities({
  abilities,
}: {
  abilities: Record<Characteristics, number>;
}) {
  return entries(abilities).map(([name, value]) => {
    const modifier = getModifier(value);
    return (
      <div
        key={name}
        className="flex flex-col items-center rounded-lg bg-muted p-2 md:px-4 md:py-2"
      >
        <div className="text-muted-foreground">{shortenAbilityName(name)}</div>
        <div className="flex items-center gap-1 text-sm md:gap-2 md:text-base">
          <span>{value}</span>
          <span className="text-indigo-400">
            {Math.sign(modifier) === 1 ? `+${modifier}` : modifier}
          </span>
        </div>
      </div>
    );
  });
}
