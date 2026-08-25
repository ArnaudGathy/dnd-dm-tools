"use client";

import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { ComponentType } from "react";

// The header that opens/closes a pile of collapsed participants or stat blocks ("Inactifs",
// "Morts"). Shared so the tracker column and the stat block column read identically.
export const PileToggle = ({
  label,
  count,
  icon: Icon,
  isOpen,
  onToggle,
  className,
}: {
  label: string;
  count: number;
  icon: ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={clsx(
      "flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-foreground",
      className,
    )}
  >
    <ChevronRight className={clsx("size-3.5 transition-transform", { "rotate-90": isOpen })} />
    <Icon className="size-3.5" />
    {`${label} (${count})`}
    <span className="h-px flex-1 bg-white/10" />
  </button>
);
