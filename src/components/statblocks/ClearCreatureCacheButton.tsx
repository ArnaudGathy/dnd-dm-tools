"use client";

import { RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { clearCreatureCache } from "@/lib/actions/creatures";
import { cn } from "@/lib/utils";

export default function ClearCreatureCacheButton({ creatureId }: { creatureId: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await clearCreatureCache({ creatureId, pathToRevalidate: pathname });
        toast.success(
          "Cache de la créature vidé. Rechargement depuis AideDD au prochain affichage.",
        );
      } catch {
        toast.error("Impossible de vider le cache de la créature.");
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
