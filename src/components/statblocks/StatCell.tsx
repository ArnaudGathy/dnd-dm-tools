import { ReactNode } from "react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

export const StatCell = ({
  name,
  stat,
  isHighlighted = false,
  highlightClassName,
  isInline = false,
  spacing = "150px",
}: {
  name: ReactNode;
  stat: ReactNode;
  isHighlighted?: boolean;
  highlightClassName?: string;
  isInline?: boolean;
  spacing?: string;
}) => {
  return (
    <div
      className={cn("flex items-center md:flex-row md:items-start", {
        "flex-col": !isInline,
      })}
    >
      <span
        style={{ minWidth: isInline ? undefined : spacing }}
        className="mr-2 text-center text-muted-foreground md:text-left"
      >
        {name}
      </span>
      <span
        className={clsx(
          "space-x-4 text-center md:text-left",
          {
            "text-indigo-400": isHighlighted,
          },
          highlightClassName,
        )}
      >
        {stat}
      </span>
    </div>
  );
};
