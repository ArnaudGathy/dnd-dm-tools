import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Section wrapper for the statblock: a colored accent bar + label header, then content.
// `accentClassName` is a text-color class; the bar inherits it via bg-current so a single
// prop tints both. Defaults to neutral for non-special sections.
export const StatSection = ({
  title,
  subtitle,
  accentClassName = "text-neutral-300",
  contentClassName,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  accentClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}) => {
  return (
    <section className="border-t-2 pt-4">
      <div className={cn("mb-3 flex items-center gap-2", accentClassName)}>
        <span className="h-4 w-1 shrink-0 rounded-full bg-current" aria-hidden />
        <h5 className="text-sm font-semibold uppercase tracking-wider">{title}</h5>
        {subtitle && <span className="text-xs font-normal text-muted-foreground">{subtitle}</span>}
      </div>
      <div className={cn("flex flex-col gap-2", contentClassName)}>{children}</div>
    </section>
  );
};
