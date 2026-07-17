import { cn } from "@/lib/utils";

// Same thresholds as the character sheet's HPForm bar, so a half-dead grung and a
// half-dead PC read the same color across the app.
export const getHpBarColor = (currentHp: number, maxHp: number) =>
  cn("bg-green-500", {
    "bg-orange-500": currentHp <= maxHp * 0.5,
    "bg-red-500": currentHp <= maxHp * 0.2,
    "bg-stone-500": currentHp <= 0,
  });
