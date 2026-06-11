import { getDistanceInSquares, replaceMetersWithSquares } from "@/utils/utils";
import { Dices, Ruler, Swords, Target } from "lucide-react";
import { Action } from "@/types/types";
import { NamedEntry } from "@/components/statblocks/NamedEntry";
import { Pill } from "@/components/statblocks/Pill";
import { cn } from "@/lib/utils";

// A `hit` string is free-form prose that can carry several damage rolls, e.g.
// "5 (1d4 + 3) dégâts perçants + 7 (2d6) poison." We split it into ordered parts:
// each parenthetical that contains a dice expression becomes a "dice" pill (its
// leading average number is dropped), everything else stays inline text. Non-dice
// parentheticals like "(DD 14)" or "(Recharge 5–6)" are left untouched as text.
const isDiceExpression = (value: string) => /\d+d\d+/i.test(value);

const parseHit = (hit: string): { type: "text" | "dice"; value: string }[] => {
  const parts: { type: "text" | "dice"; value: string }[] = [];
  const regex = /(\d+\s*)?\(([^)]+)\)/g;
  let cursor = 0;
  let text = "";
  let match: RegExpExecArray | null;

  while ((match = regex.exec(hit)) !== null) {
    const [full, , content] = match;
    text += hit.slice(cursor, match.index);
    cursor = match.index + full.length;

    if (isDiceExpression(content)) {
      if (text.trim()) parts.push({ type: "text", value: text.trim() });
      text = "";
      parts.push({ type: "dice", value: content.trim() });
    } else {
      // Not a damage roll — keep the average number and parens as literal text.
      text += full;
    }
  }

  text += hit.slice(cursor);
  if (text.trim()) parts.push({ type: "text", value: text.trim() });

  return parts;
};

export const ActionBlock = ({ action }: { action: Action }) => {
  if (action.description) {
    return <NamedEntry name={action.name}>{action.description}</NamedEntry>;
  }

  const isUnCommonReach = action.reach && getDistanceInSquares(action.reach) > 1;
  const hitParts = action.hit ? parseHit(action.hit) : [];

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
          <Pill className={cn(isUnCommonReach && "text-amber-400")}>
            <Ruler className="size-3.5 shrink-0" />
            {replaceMetersWithSquares(action.reach)}
          </Pill>
        )}
        {hitParts.map((part, index) =>
          part.type === "dice" ? (
            <Pill key={index} className="text-red-500">
              <Dices className="size-3.5 shrink-0" />
              {part.value}
            </Pill>
          ) : (
            <span key={index} className="text-muted-foreground">
              {part.value}
            </span>
          ),
        )}
      </span>
    </NamedEntry>
  );
};
