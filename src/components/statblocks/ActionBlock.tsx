import { getDistanceInSquares, replaceMetersWithSquares } from "@/utils/utils";
import { Info, Ruler, Swords, Target } from "lucide-react";
import { Action } from "@/types/types";
import { NamedEntry } from "@/components/statblocks/NamedEntry";
import { Pill } from "@/components/statblocks/Pill";
import { TooltipComponent } from "@/components/ui/tooltip";
import { TOOLTIP_DELAY, parseActionText, renderParts } from "@/components/statblocks/richText";

// Compact display for dual melee/ranged reach: "1.5 m ou distance 6/18 m" reads
// "1 ou 4/12 cases" — the "distance"/"portée" wording goes, and only the last
// converted value keeps its "cases" unit.
const formatReach = (reach: string) =>
  replaceMetersWithSquares(reach)
    .replace(/\s+ou\s+(?:distance|portée)\s+/i, " ou ")
    .replace(/ cases(?=.* cases)/g, "");

// Escape hatch from the formatted pills: a dedicated icon whose tooltip dumps every raw
// action field exactly as written in the data file.
const RawActionTooltip = ({ action }: { action: Action }) => {
  const fields = (["type", "modifier", "reach", "hit", "description"] as const).filter(
    (field) => action[field],
  );
  return (
    <TooltipComponent
      delayDuration={TOOLTIP_DELAY}
      contentClassName="max-w-md"
      definition={
        <div className="flex flex-col gap-1">
          {fields.map((field) => (
            <div key={field}>
              <span className="font-medium">{field} : </span>
              {action[field]}
            </div>
          ))}
        </div>
      }
    >
      <Info className="inline size-4 shrink-0 cursor-help align-middle text-muted-foreground/50" />
    </TooltipComponent>
  );
};

export const ActionBlock = ({ action }: { action: Action }) => {
  if (action.description) {
    const descriptionParts = parseActionText(action.description);
    return (
      <NamedEntry name={action.name}>
        {descriptionParts.some((part) => part.kind !== "text") ? (
          <span>
            {renderParts(descriptionParts)} <RawActionTooltip action={action} />
          </span>
        ) : (
          action.description
        )}
      </NamedEntry>
    );
  }

  const isUnCommonReach = action.reach && getDistanceInSquares(action.reach) > 1;
  const hitParts = action.hit ? parseActionText(action.hit) : [];

  // type is free-form and mixes FR/EN ("Melee", "Ranged", "Melee or Ranged", "Distance").
  const typeLower = action.type?.toLowerCase() ?? "";
  const isMelee = /melee|corps/.test(typeLower);
  const isRanged = /ranged|distance/.test(typeLower);
  // A pure melee attack at 1 square is the default 5 ft reach — redundant, so hide it.
  const isDefaultMeleeReach = isMelee && !isRanged && !isUnCommonReach;

  return (
    <NamedEntry name={action.name}>
      <span className="mr-1">
        {action.type && !isMelee && !isRanged && (
          <span className="italic text-muted-foreground">{action.type}</span>
        )}{" "}
        {action.modifier && (
          <Pill className="whitespace-nowrap text-indigo-300">{action.modifier}</Pill>
        )}{" "}
        {action.reach && !isDefaultMeleeReach && (
          // The attack type lives on the pill itself: Swords for an abnormal melee
          // reach (> 1 case, the default is hidden), Target for ranged. Melee + ranged
          // interleaves each icon with its own value: "⚔ 1 ◎ 4/12 cases".
          <TooltipComponent delayDuration={TOOLTIP_DELAY} definition={action.type ?? "Portée"}>
            <Pill className="whitespace-nowrap text-amber-400">
              {(() => {
                const reach = formatReach(action.reach);
                const dualReach = isMelee && isRanged ? reach.split(/\s+ou\s+/) : [];
                if (dualReach.length === 2) {
                  return (
                    <>
                      <Swords className="size-3.5 shrink-0" />
                      {dualReach[0]}
                      <Target className="size-3.5 shrink-0" />
                      {dualReach[1]}
                    </>
                  );
                }
                return (
                  <>
                    {isMelee && <Swords className="size-3.5 shrink-0" />}
                    {isRanged && <Target className="size-3.5 shrink-0" />}
                    {!isMelee && !isRanged && <Ruler className="size-3.5 shrink-0" />}
                    {reach}
                  </>
                );
              })()}
            </Pill>
          </TooltipComponent>
        )}{" "}
        {renderParts(hitParts)} <RawActionTooltip action={action} />
      </span>
    </NamedEntry>
  );
};
