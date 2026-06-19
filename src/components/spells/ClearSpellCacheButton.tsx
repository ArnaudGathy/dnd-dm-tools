"use client";

import { RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { clearSpellCache } from "@/lib/actions/spells";
import { cn } from "@/lib/utils";

export default function ClearSpellCacheButton({ spellId }: { spellId: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await clearSpellCache({ spellId, pathToRevalidate: pathname });
        toast.success("Cache du sort vidé. Rechargement depuis AideDD au prochain affichage.");
      } catch {
        toast.error("Impossible de vider le cache du sort.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title="Vider le cache AideDD"
      className="ml-2 flex items-center text-xs text-muted-foreground underline disabled:opacity-50"
    >
      <RefreshCcw className={cn("size-3", isPending && "animate-spin")} />
    </button>
  );
}
