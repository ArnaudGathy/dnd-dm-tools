import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SheetSingleData({
  className,
  label,
  value,
}: {
  className?: string;
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-lg bg-muted px-2 py-3 text-center",
        className,
      )}
    >
      <div className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center justify-center text-2xl font-bold tabular-nums">
        {value}
      </div>
    </div>
  );
}
