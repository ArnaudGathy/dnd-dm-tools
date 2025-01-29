import { ReactNode } from "react";
import { clsx } from "clsx";

export const StatCell = ({
  name,
  stat,
  isHighlighted = false,
}: {
  name: ReactNode;
  stat: ReactNode;
  isHighlighted?: boolean;
}) => {
  return (
    <div className="flex">
      <span className={clsx("mr-2 text-nowrap text-muted-foreground")}>
        {name}
      </span>
      <span
        className={clsx("space-x-4", {
          "text-indigo-400": isHighlighted,
        })}
      >
        {stat}
      </span>
    </div>
  );
};
