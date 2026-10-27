"use client";

import { useTransition } from "react";
import { Flame } from "lucide-react";
import { CharacterById, cn } from "@/lib/utils";
import { applyRageTempHp } from "@/lib/actions/characters";
import { BARBARIAN_RAGE_DAMAGE_PER_LEVEL } from "@/constants/maps";
import { getRageTempHP } from "@/utils/stats/rage";
import { useRageStatus } from "@/hooks/useRageStatus";

/** HUD tile that switches the Barbarian's Rage on/off (stored on this device).
 *  Same footprint as a HudTile, but a button: lit red while raging. */
export default function RageToggle({ character }: { character: CharacterById }) {
  const [isPending, startTransition] = useTransition();
  const [isRaging, setIsRaging] = useRageStatus(character);
  const rageTempHP = getRageTempHP(character);

  const toggle = () => {
    setIsRaging(!isRaging);
    if (!isRaging && rageTempHP > 0) {
      startTransition(() => void applyRageTempHp(character.id));
    }
  };

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isRaging}
      title={
        isRaging
          ? "Terminer la rage"
          : `Entrer en rage : +${BARBARIAN_RAGE_DAMAGE_PER_LEVEL[character.level]} dégâts (FOR)${rageTempHP > 0 ? `, ${rageTempHP} PV temporaires` : ""}`
      }
      onClick={toggle}
      className={cn(
        "flex min-w-[4.75rem] flex-auto flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors disabled:opacity-60",
        isRaging ? "bg-red-600 text-white hover:bg-red-600/90" : "bg-muted hover:bg-muted/70",
      )}
    >
      <Flame
        className={cn("size-4 shrink-0 stroke-[2.5px]", isRaging ? "text-white" : "text-red-500")}
      />
      <span className="text-xl font-bold leading-none">{isRaging ? "ON" : "OFF"}</span>
      <span
        className={cn(
          "text-tiny font-semibold uppercase leading-tight tracking-wide",
          isRaging ? "text-white/80" : "text-muted-foreground",
        )}
      >
        Rage
      </span>
    </button>
  );
}
