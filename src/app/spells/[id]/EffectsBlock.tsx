import { typedConditions } from "@/utils/utils";
import { ConditionImage } from "@/app/encounters/[id]/ConditionImage";
import { StatCell } from "@/app/creatures/StatCell";

export const EffectsBlock = ({ effects }: { effects: string[] }) => {
  return (
    <StatCell
      name="Effets"
      stat={
        <span className="flex gap-2">
          {effects.map((effect) => {
            const condition = typedConditions.find((c) => c.icon === effect);
            return condition ? (
              <ConditionImage condition={condition} className="size-6" />
            ) : (
              <span>{effect}</span>
            );
          })}
        </span>
      }
    />
  );
};
