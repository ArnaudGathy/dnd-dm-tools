import { entries } from "remeda";
import { StatCell } from "@/app/creatures/StatCell";

export const DamageBlock = ({
  damages,
  label,
}: {
  damages?: Record<number, string>;
  label: string;
}) => {
  if (!damages) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4">
        {entries(damages).map(([level, damage]) => (
          <StatCell key={level} name={level} stat={damage} isInline />
        ))}
      </div>
    </div>
  );
};
