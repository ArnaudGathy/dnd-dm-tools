"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, WandSparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { APISpell } from "@/types/schemas";
import { getSpellDetailsAction } from "@/lib/actions/spells";
import SpellQuickView from "@/components/spells/SpellQuickView";

/** The spell name in the combat tab opens the full description in place — the
 *  same quick view as the encounter tracker — instead of navigating away.
 *  Details are fetched on first open and kept for the rest of the session. */
export default function SpellDetailsPopover({
  spellId,
  spellName,
}: {
  spellId: string;
  spellName: string;
}) {
  const [details, setDetails] = useState<APISpell | null>(null);
  const [hasError, setHasError] = useState(false);

  const onOpenChange = async (open: boolean) => {
    if (!open || details) {
      return;
    }
    setHasError(false);
    const result = await getSpellDetailsAction({ spellId });
    if (!result) {
      setHasError(true);
      return;
    }
    setDetails(result);
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger className="min-w-0 flex-1 truncate text-left text-sm transition-colors hover:text-sky-400">
        {spellName}
      </PopoverTrigger>

      <PopoverContent className="flex max-h-[75vh] w-[min(92vw,36rem)] flex-col gap-0 p-0">
        <header className="flex items-center justify-between gap-2 border-l-4 border-l-sky-500 bg-sky-500/[0.07] px-3 py-2">
          <span className="flex min-w-0 items-center gap-2">
            <WandSparkles className="size-3.5 shrink-0 text-sky-400" />
            <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              {spellName}
            </span>
          </span>

          <Link
            href={`/spells/${spellId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Page complète
            <ExternalLink className="size-3" />
          </Link>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {hasError ? (
            <div className="px-2 py-4 text-sm text-red-500">Impossible de charger ce sort.</div>
          ) : !details ? (
            <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {`Chargement de ${spellName}…`}
            </div>
          ) : (
            <SpellQuickView spell={details} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
