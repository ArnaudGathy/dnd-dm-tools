import { ElementType, ReactNode } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";

export default function StatCard({
  value,
  label,
  definition,
  icon: Icon,
  iconColor = "text-muted-foreground",
}: {
  icon: ElementType;
  value: ReactNode;
  label?: ReactNode;
  definition: ReactNode;
  iconColor?: string;
}) {
  return (
    <PopoverComponent
      definition={definition}
      className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-muted px-2 py-3 transition-colors hover:bg-muted/70"
    >
      <Icon className={cn("size-5 stroke-[2.5px]", iconColor)} />
      <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
      {label && (
        <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
    </PopoverComponent>
  );
}
