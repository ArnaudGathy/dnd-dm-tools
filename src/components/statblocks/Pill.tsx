import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Shared badge used across the statblock (tags, spell slots, attack stats) so everything
// reads as one consistent visual system. Extra props (incl. ref) are spread on the span
// so a Pill can be used as a Radix asChild trigger (e.g. inside a tooltip).
export const Pill = ({ children, className, ...props }: ComponentProps<"span">) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-normal rounded-md border border-neutral-700 bg-neutral-800/40 px-2 py-1 align-middle text-sm leading-none",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
