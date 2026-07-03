import { ElementType, ReactNode } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";
import { breakdownContentClassName } from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";

/** Compact stat tile: big value over a tiny label, tap for the breakdown.
 *  `definition` is expected to be a StatBreakdown — the popover is unpadded so
 *  the breakdown's accent header reaches the rounded edges. */
export default function HudTile({
  icon: Icon,
  iconColor,
  value,
  valueClassName,
  label,
  definition,
  className,
}: {
  icon?: ElementType;
  iconColor?: string;
  value: ReactNode;
  valueClassName?: string;
  label: ReactNode;
  definition: ReactNode;
  className?: string;
}) {
  return (
    <PopoverComponent
      definition={definition}
      contentClassName={breakdownContentClassName}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-muted px-2 py-2 transition-colors hover:bg-muted/70",
        className,
      )}
    >
      {Icon && <Icon className={cn("size-4 shrink-0 stroke-[2.5px]", iconColor)} />}
      <span className={cn("text-xl font-bold tabular-nums leading-none", valueClassName)}>
        {value}
      </span>
      <span className="line-clamp-2 max-w-full text-center text-tiny font-semibold uppercase leading-tight tracking-wide text-muted-foreground">
        {label}
      </span>
    </PopoverComponent>
  );
}
