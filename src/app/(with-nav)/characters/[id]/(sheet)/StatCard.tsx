import { ElementType, ReactNode } from "react";
import SheetCard from "@/components/ui/SheetCard";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";

export default function StatCard({
  value,
  definition,
  icon: Icon,
  iconColor = "text-muted-foreground",
}: {
  icon: ElementType;
  value: ReactNode;
  definition: ReactNode;
  iconColor?: string;
}) {
  return (
    <SheetCard className="flex items-center justify-center">
      <PopoverComponent definition={definition}>
        <div className="flex min-w-16 flex-col items-center gap-2">
          <Icon className={cn("stroke-[2.5px]", iconColor)} />
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </PopoverComponent>
    </SheetCard>
  );
}
