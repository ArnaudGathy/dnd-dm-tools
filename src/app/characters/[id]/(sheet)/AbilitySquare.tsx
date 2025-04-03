import { addSignToNumber, getModifier } from "@/utils/utils";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { ABILITIES_MAP } from "@/constants/maps";
import { AbilityNameType } from "@/types/types";
import { cn } from "@/lib/utils";

export default function AbilitySquare({
  name,
  value,
  className,
}: {
  name: AbilityNameType;
  value: number;
  className?: string;
}) {
  const modifier = addSignToNumber(getModifier(value));
  return (
    <SheetSingleData
      key={name}
      className={cn(className)}
      label={ABILITIES_MAP[name]}
      value={
        <div className="flex flex-row items-center gap-4 md:flex-col md:gap-0">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-base font-medium text-muted-foreground">
            {modifier}
          </span>
        </div>
      }
    />
  );
}
