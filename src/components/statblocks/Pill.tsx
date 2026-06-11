import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared badge used across the statblock (tags, spell slots, attack stats) so everything
// reads as one consistent visual system.
export const Pill = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-normal rounded-md border border-neutral-700 bg-neutral-800/40 px-2 py-1 align-middle text-sm leading-none",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
