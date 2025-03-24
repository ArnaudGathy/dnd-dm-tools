import { ReactNode } from "react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

export const StatCell = ({
  name,
  stat,
  isHighlighted = false,
  highlightClassName,
  isInline = false,
}: {
  name: ReactNode;
  stat: ReactNode;
  isHighlighted?: boolean;
  highlightClassName?: string;
  isInline?: boolean;
}) => {
  return (
    <div className={cn("flex md:flex-row", { "flex-col": !isInline })}>
      <span
        className={clsx("mr-2 text-muted-foreground", {
          "min-w-[150px]": !isInline,
        })}
      >
        {name}
      </span>
      <span
        className={clsx(
          "space-x-4",
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
