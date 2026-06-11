import { getDistanceInSquares, replaceMetersWithSquares } from "@/utils/utils";
import { Dices, Ruler, Swords, Target } from "lucide-react";
import { Action } from "@/types/types";
import { NamedEntry } from "@/components/statblocks/NamedEntry";
import { Pill } from "@/components/statblocks/Pill";
import { cn } from "@/lib/utils";

export const ActionBlock = ({ action }: { action: Action }) => {
  if (action.description) {
    return <NamedEntry name={action.name}>{action.description}</NamedEntry>;
  }

  const isUnCommonReach = action.reach && getDistanceInSquares(action.reach) > 1;
  const hitDice = action.hit && (action.hit.match(/(?<=\().*?(?=\))/)?.[0] ?? "");
  const hitType = action.hit && (action.hit.match(/(?<=\)).*/)?.[0] ?? "").trim();

  // type is free-form and mixes FR/EN ("Melee", "Ranged", "Melee or Ranged", "Distance").
  const typeLower = action.type?.toLowerCase() ?? "";
  const isMelee = /melee|corps/.test(typeLower);
  const isRanged = /ranged|distance/.test(typeLower);
  // A pure melee attack at 1 square is the default 5 ft reach — redundant, so hide it.
  const isDefaultMeleeReach = isMelee && !isRanged && !isUnCommonReach;

  return (
    <NamedEntry name={action.name}>
      <span className="mr-1 inline-flex flex-wrap items-center gap-1.5 align-middle">
        {action.type &&
          (isMelee || isRanged ? (
            <span
              className="inline-flex items-center gap-1 text-muted-foreground"
              title={action.type}
            >
              {isMelee && <Swords className="size-4 shrink-0" />}
              {isRanged && <Target className="size-4 shrink-0" />}
            </span>
          ) : (
            <span className="italic text-muted-foreground">{action.type}</span>
          ))}
        {action.modifier && <Pill className="text-indigo-300">{action.modifier}</Pill>}
        {action.reach && !isDefaultMeleeReach && (
          <Pill className={cn(isUnCommonReach && "border-primary/50 text-primary")}>
            <Ruler className="size-3.5 shrink-0" />
            {replaceMetersWithSquares(action.reach)}
          </Pill>
        )}
        {hitDice && (
          <Pill className="text-indigo-300">
            <Dices className="size-3.5 shrink-0" />
            {hitDice}
          </Pill>
        )}
      </span>
      {hitType && <span className="text-muted-foreground">{hitType}</span>}
    </NamedEntry>
  );
};
