import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared "tactical dashboard" presentation primitives for the character sheet.
 * Every tab is built from these so the tabs stay visually coherent: each domain
 * gets an accent color, panels carry an icon + uppercase header, and stat values
 * are surfaced either as scannable tiles or label-leader-value rows.
 */

export type Accent =
  | "red"
  | "indigo"
  | "sky"
  | "amber"
  | "emerald"
  | "pink"
  | "violet"
  | "slate"
  | "teal";

type AccentClasses = { bar: string; icon: string; tint: string; text: string };

export const ACCENTS: Record<Accent, AccentClasses> = {
  red: {
    bar: "border-l-red-500",
    icon: "text-red-400",
    tint: "bg-red-500/[0.07]",
    text: "text-red-400",
  },
  indigo: {
    bar: "border-l-indigo-500",
    icon: "text-indigo-400",
    tint: "bg-indigo-500/[0.07]",
    text: "text-indigo-400",
  },
  sky: {
    bar: "border-l-sky-500",
    icon: "text-sky-400",
    tint: "bg-sky-500/[0.07]",
    text: "text-sky-400",
  },
  amber: {
    bar: "border-l-amber-500",
    icon: "text-amber-400",
    tint: "bg-amber-500/[0.07]",
    text: "text-amber-400",
  },
  emerald: {
    bar: "border-l-emerald-500",
    icon: "text-emerald-400",
    tint: "bg-emerald-500/[0.07]",
    text: "text-emerald-400",
  },
  pink: {
    bar: "border-l-pink-500",
    icon: "text-pink-400",
    tint: "bg-pink-500/[0.07]",
    text: "text-pink-400",
  },
  violet: {
    bar: "border-l-violet-500",
    icon: "text-violet-400",
    tint: "bg-violet-500/[0.07]",
    text: "text-violet-400",
  },
  teal: {
    bar: "border-l-teal-500",
    icon: "text-teal-400",
    tint: "bg-teal-500/[0.07]",
    text: "text-teal-400",
  },
  slate: {
    bar: "border-l-slate-500",
    icon: "text-slate-400",
    tint: "bg-slate-500/[0.07]",
    text: "text-slate-400",
  },
};

/** A bordered panel with an accent header (icon + uppercase title) and a body. */
export function SectionPanel({
  accent = "slate",
  icon: Icon,
  title,
  action,
  className,
  contentClassName,
  children,
}: {
  accent?: Accent;
  icon?: ElementType;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <header
        className={cn(
          "flex h-8 shrink-0 items-center justify-between gap-2 border-l-4 px-3",
          a.bar,
          a.tint,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {Icon && <Icon className={cn("size-4 shrink-0 stroke-[2.5px]", a.icon)} />}
          <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
            {title}
          </span>
        </div>
        {/* Action buttons must be size="icon" (~24px) so they fit inside the compact
            header instead of stretching it. */}
        {action && <div className="-mr-1 flex shrink-0 items-center">{action}</div>}
      </header>
      <div className={cn("flex flex-col gap-1 p-3", contentClassName)}>{children}</div>
    </section>
  );
}

/** A label · dotted-leader · value row — the unified stat-list primitive. */
export function StatLine({
  label,
  value,
  className,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 py-0.5", className)}>
      <div className="flex min-w-0 items-center gap-1">{label}</div>
      <div className="mx-1 h-3 min-w-[1rem] flex-1 border-b border-dashed border-muted-foreground/30" />
      <div
        className={cn(
          "min-w-0 break-words text-right text-base font-bold tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** A compact tile: icon over a big value over a small label. Used for key stats. */
export function StatTile({
  icon: Icon,
  iconColor,
  accent = "slate",
  value,
  label,
  className,
  children,
}: {
  icon?: ElementType;
  iconColor?: string;
  accent?: Accent;
  value?: ReactNode;
  label?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-muted px-2 py-3 text-center",
        className,
      )}
    >
      {Icon && <Icon className={cn("size-5 stroke-[2.5px]", iconColor ?? a.icon)} />}
      {value !== undefined && (
        <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
      )}
      {label && (
        <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
