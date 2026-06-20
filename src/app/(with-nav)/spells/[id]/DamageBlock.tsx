import { entries } from "remeda";
import { StatTile } from "@/app/(with-nav)/spells/[id]/StatTile";

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
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {entries(damages).map(([level, damage]) => (
          <StatTile key={level} label={level} value={damage} />
        ))}
      </div>
    </div>
  );
};
