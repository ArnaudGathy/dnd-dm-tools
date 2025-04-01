import SheetCard from "@/components/ui/SheetCard";
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
    <SheetCard className={cn("flex flex-col items-center", className)}>
      <div className="w-full truncate pb-2 text-center text-base text-muted-foreground">
        {label}
      </div>
      <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
        <span>{value}</span>
      </div>
    </SheetCard>
  );
}
