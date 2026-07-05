"use client";

import { AMMUNITION_TYPE_MAP } from "@/constants/maps";
import { Weapon } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Box, Check, LoaderCircle, Minus, Plus } from "lucide-react";
import { updateWeaponAmmunitionCount } from "@/lib/actions/weapons";
import { useEffect, useRef, useState } from "react";

/** Matches the 0–20 clamp enforced by updateWeaponAmmunitionCount. */
const MAX_AMMUNITION = 20;
const SAVE_DEBOUNCE_MS = 700;

/**
 * Ammunition as a split chip stepper: − / + spend or retrieve one per click
 * (the at-the-table rhythm), optimistic with a debounced save so a burst of
 * clicks lands as a single update. The label opens a popover to set the exact
 * total when retrieving arrows in bulk after a fight.
 */
export default function AmmunitionForm({ weapon }: { weapon: Weapon }) {
  const [count, setCount] = useState(weapon.ammunitionCount ?? 0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exactValue, setExactValue] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCount = useRef(count);
  const hasPendingSave = useRef(false);
  const weaponId = weapon.id;

  // Re-sync after revalidation (or an edit from another surface).
  useEffect(() => {
    setCount(weapon.ammunitionCount ?? 0);
  }, [weapon.ammunitionCount]);

  // Flush a pending debounced save if the component unmounts mid-burst.
  useEffect(() => {
    return () => {
      if (hasPendingSave.current) {
        clearTimeout(timer.current);
        void updateWeaponAmmunitionCount(weaponId, latestCount.current);
      }
    };
  }, [weaponId]);

  if (!weapon.ammunitionType || weapon.ammunitionCount === null) {
    return null;
  }

  const save = async (next: number) => {
    hasPendingSave.current = false;
    setIsSaving(true);
    try {
      await updateWeaponAmmunitionCount(weaponId, next);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const adjust = (delta: number) => {
    const next = Math.min(MAX_AMMUNITION, Math.max(0, count + delta));
    if (next === count) {
      return;
    }
    setCount(next);
    latestCount.current = next;
    hasPendingSave.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(latestCount.current), SAVE_DEBOUNCE_MS);
  };

  const handleExact = async () => {
    const next = Math.min(MAX_AMMUNITION, Math.max(0, Math.floor(Number(exactValue) || 0)));
    clearTimeout(timer.current);
    setCount(next);
    latestCount.current = next;
    await save(next);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setExactValue(String(count));
    }
  };

  const stepperButtonClassName =
    "flex items-center px-1.5 transition-colors hover:bg-background/60 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-md bg-background/40 text-xs font-medium text-foreground/80">
      <button
        type="button"
        aria-label="Dépenser une munition"
        className={stepperButtonClassName}
        disabled={count <= 0}
        onClick={() => adjust(-1)}
      >
        <Minus className="size-3.5" />
      </button>

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger className="flex items-center gap-1 border-x border-white/10 px-2 py-1 transition-colors hover:bg-background/60">
          {isSaving ? (
            <LoaderCircle className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <Box className="size-3.5 text-muted-foreground" />
          )}
          <span className="tabular-nums">
            {count} {AMMUNITION_TYPE_MAP[weapon.ammunitionType]}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-56 overflow-hidden p-0">
          <header className="flex items-center gap-2 border-l-4 border-l-red-500 bg-red-500/[0.07] px-3 py-2">
            <Box className="size-3.5 shrink-0 stroke-[2.5px] text-red-400" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              {AMMUNITION_TYPE_MAP[weapon.ammunitionType]}
            </span>
            <span className="ml-auto text-xs font-bold tabular-nums text-muted-foreground">
              {count}/{MAX_AMMUNITION}
            </span>
          </header>
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
                Total exact
              </span>
              <Input
                type="number"
                min={0}
                max={MAX_AMMUNITION}
                className="h-8"
                value={exactValue}
                name="ammunitionCount"
                onChange={(e) => setExactValue(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-8 shrink-0"
                disabled={isSaving}
                onClick={handleExact}
              >
                {isSaving ? <LoaderCircle className="animate-spin" /> : <Check />}
              </Button>
            </div>
            <span className="text-tiny text-muted-foreground">
              De 0 à {MAX_AMMUNITION} munitions.
            </span>
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        aria-label="Récupérer une munition"
        className={stepperButtonClassName}
        disabled={count >= MAX_AMMUNITION}
        onClick={() => adjust(1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
