"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "skills:maitrises:open";

/** Maîtrises is reference info: open by default, but the player's collapse choice
 *  is remembered across visits via localStorage. */
export default function CollapsibleProficiencies({ proficiencies }: { proficiencies: string[] }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setOpen(stored === "true");
    }
  }, []);

  const toggle = () =>
    setOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-tiny font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground/80"
      >
        <ScrollText className="size-4 shrink-0 stroke-[2.5px] text-slate-400" />
        Maîtrises
        <ChevronDown
          className={cn("ml-auto size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
          {proficiencies.map((proficiency) => (
            <div
              key={proficiency}
              className="rounded-md bg-muted px-3 py-1.5 text-sm leading-snug text-muted-foreground"
            >
              {proficiency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
