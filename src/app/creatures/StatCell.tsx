import { ReactNode } from "react";
import { clsx } from "clsx";

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
    <div className="flex">
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
