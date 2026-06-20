import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A label/value tile used across the spell stat block — single values (casting
// time, range, duration) and tag collections (components, classes) all share this
// card shell so the whole block reads as one consistent language.
export const StatTile = ({
  icon,
  label,
  value,
  valueClassName,
  className,
}: {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1.5 rounded-md border bg-secondary/30 px-3 py-2",
        className,
      )}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className={cn("text-sm font-medium", valueClassName)}>{value}</div>
    </div>
  );
};

// A flat chip that sits inside a StatTile (V/S/M components, classes). No border of
// its own — the tile provides the frame — so nested cards never fight each other.
export const Chip = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded bg-background/60 px-2 py-1 text-xs font-medium",
      className,
    )}
  >
    {children}
  </span>
);
