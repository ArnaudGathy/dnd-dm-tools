"use client";

import { MouseEvent, useTransition } from "react";
import { LoaderCircle, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pins an inventory / magic item to the Combat tab's "Objets de combat" panel.
 * Lives inside the row that opens the edit popover, so it swallows the click —
 * tapping the swords toggles, tapping anywhere else still edits.
 */
export default function CombatRelevanceToggle({
  isCombatRelevant,
  toggleAction,
  className,
}: {
  isCombatRelevant: boolean;
  toggleAction: (isCombatRelevant: boolean) => Promise<void>;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    startTransition(async () => {
      await toggleAction(!isCombatRelevant);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isCombatRelevant}
      title={isCombatRelevant ? "Retirer de l'onglet combat" : "Afficher dans l'onglet combat"}
      aria-label={isCombatRelevant ? "Retirer de l'onglet combat" : "Afficher dans l'onglet combat"}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/10",
        isCombatRelevant ? "text-red-400" : "text-muted-foreground/30 hover:text-muted-foreground",
        className,
      )}
    >
      {isPending ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : (
        <Swords className={cn("size-3.5", isCombatRelevant && "stroke-[2.5px]")} />
      )}
    </button>
  );
}
