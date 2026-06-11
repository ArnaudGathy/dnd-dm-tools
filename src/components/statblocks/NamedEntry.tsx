import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared label style for every statblock row/entry name, so Général, Traits, Actions and the
// spell stats all read consistently. Bright + medium to stand out against dimmed bodies.
export const statLabelClassName = "text-sm font-medium text-neutral-100";

// Statblock entry: name in a fixed left column, description on the right. Two columns keep
// the vertical footprint tight (a whole statblock fits without scrolling) while the bright
// name vs. dimmed description gives each entry clear separation. Stacks on mobile.
export const NamedEntry = ({ name, children }: { name: string; children?: ReactNode }) => {
  return (
    <div className="flex flex-col gap-0.5 md:flex-row md:items-start md:gap-4">
      <span className={cn(statLabelClassName, "md:w-[150px] md:shrink-0")}>{name}</span>
      {children && <div className="flex-1 leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
};
