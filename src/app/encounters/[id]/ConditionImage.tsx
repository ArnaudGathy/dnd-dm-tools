import { Condition } from "@/types/types";
import { TooltipComponent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const ConditionImage = ({
  condition,
  className,
  onClick,
}: {
  condition: Condition;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <TooltipComponent definition={condition.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="icon"
        className={cn("size-10", className)}
        src={`../conditions/${condition.icon}.png`}
        onClick={onClick}
      />
    </TooltipComponent>
  );
};
