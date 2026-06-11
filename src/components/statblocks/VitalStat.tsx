import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Headline vital (PV / CA / FP) shown as a compact card, matching the ability-score cards
// below it so the top of the statblock reads as one cohesive dashboard.
export const VitalStat = ({
  label,
  value,
  icon: Icon,
  valueClassName,
  iconClassName,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  valueClassName?: string;
  iconClassName?: string;
}) => {
  return (
    <div className="flex min-w-[84px] flex-col gap-1 rounded-lg bg-muted px-3 py-2">
      <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className={cn("size-3.5", iconClassName)} />}
        {label}
      </span>
      <span className={cn("text-xl font-semibold leading-none", valueClassName)}>{value}</span>
    </div>
  );
};
