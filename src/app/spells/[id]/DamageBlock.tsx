import { entries } from "remeda";
import { StatCell } from "@/app/creatures/StatCell";
import { cn } from "@/lib/utils";

export const DamageBlock = ({
  damages,
  label,
  tiny,
}: {
  damages?: Record<number, string>;
  label: string;
  tiny?: boolean;
}) => {
  if (!damages) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1", { "gap-0": tiny })}>
      <div>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div
        className={cn("flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4", {
          "gap-x-2 gap-y-0 md:gap-x-4 md:gap-y-2": tiny,
        })}
      >
        {entries(damages).map(([level, damage]) => (
          <StatCell key={level} name={level} stat={damage} isInline />
        ))}
      </div>
    </div>
  );
};
