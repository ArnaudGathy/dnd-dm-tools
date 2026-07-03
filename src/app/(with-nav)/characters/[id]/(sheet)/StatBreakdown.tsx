import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ACCENTS, Accent } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

/**
 * Popover body for "how was this number computed?" breakdowns — a miniature
 * SectionPanel: accent header matching the source panel, dotted-leader rows
 * (one per contribution), and an emphasized total. Rendered inside a
 * PopoverComponent with `breakdownContentClassName` so the header tint reaches
 * the popover's rounded edges.
 */

export const breakdownContentClassName = "min-w-[13rem] max-w-[18rem] overflow-hidden p-0";

export type BreakdownRow = {
  label: ReactNode;
  value: ReactNode;
  /** Optional inline color (e.g. damage-type color) applied to the whole row. */
  color?: string;
};

export default function StatBreakdown({
  accent = "slate",
  icon: Icon,
  title,
  rows = [],
  total,
  totalLabel = "Total",
  note,
}: {
  accent?: Accent;
  icon?: ElementType;
  title: ReactNode;
  rows?: (BreakdownRow | false | null | undefined)[];
  total?: ReactNode;
  totalLabel?: ReactNode;
  /** Prose footer — used alone for explanation-only popovers. */
  note?: ReactNode;
}) {
  const a = ACCENTS[accent];
  const visibleRows = rows.filter((row): row is BreakdownRow => !!row);

  return (
    <div className="flex flex-col">
      <header className={cn("flex items-center gap-2 border-l-4 px-3 py-2", a.bar, a.tint)}>
        {Icon && <Icon className={cn("size-3.5 shrink-0 stroke-[2.5px]", a.icon)} />}
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
          {title}
        </span>
      </header>

      {(visibleRows.length > 0 || total !== undefined || note) && (
        <div className="flex flex-col px-3 py-2">
          {visibleRows.map((row, index) => (
            <div
              key={index}
              className="flex items-baseline gap-2 py-0.5"
              style={row.color ? { color: row.color } : undefined}
            >
              <span className={cn("text-sm", !row.color && "text-muted-foreground")}>
                {row.label}
              </span>
              <span className="mx-0.5 h-3 min-w-[1rem] flex-1 border-b border-dashed border-muted-foreground/30" />
              <span className="text-sm font-semibold tabular-nums">{row.value}</span>
            </div>
          ))}

          {total !== undefined && (
            <div
              className={cn(
                "flex items-baseline justify-between gap-2",
                visibleRows.length > 0 && "mt-1 border-t border-border pt-1.5",
              )}
            >
              <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
                {totalLabel}
              </span>
              <span className={cn("text-lg font-bold tabular-nums", a.text)}>{total}</span>
            </div>
          )}

          {note && (
            <div
              className={cn(
                "text-sm leading-snug text-muted-foreground",
                (visibleRows.length > 0 || total !== undefined) &&
                  "mt-1 border-t border-border pt-1.5",
              )}
            >
              {note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
