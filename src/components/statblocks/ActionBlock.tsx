import { StatCell } from "@/components/statblocks/StatCell";
import { getDistanceInSquares, replaceMetersWithSquares } from "@/utils/utils";
import { clsx } from "clsx";
import { Action } from "@/types/types";

export const ActionBlock = ({ action }: { action: Action }) => {
  if (action.description) {
    return <StatCell key={action.name} name={action.name} stat={action.description} />;
  }

  const isUnCommonReach = action.reach && getDistanceInSquares(action.reach) > 1;
  const hitDice = action.hit && (action.hit.match(/(?<=\().*?(?=\))/)?.[0] ?? "");
  const hitType = action.hit && (action.hit.match(/(?<=\)).*/)?.[0] ?? "").trim();

  const attackDescription = (
    <>
      {action.type && <span className="italic">{action.type}</span>}
      {action.modifier && <span className="text-indigo-400">{action.modifier}</span>}
      {action.reach && (
        <span className={clsx({ "text-primary": isUnCommonReach })}>
          {replaceMetersWithSquares(action.reach)}
        </span>
      )}
      {action.hit && (
        <span>
          <span className="text-indigo-400">{hitDice}</span> {hitType && <span>({hitType})</span>}
        </span>
      )}
    </>
  );

  return <StatCell key={action.name} name={action.name} stat={attackDescription} />;
};
