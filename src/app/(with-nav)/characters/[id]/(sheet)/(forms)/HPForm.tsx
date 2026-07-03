"use client";

import { Delete, Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { drainTempHp, resetHp, setHp, setTempHp } from "@/lib/actions/characters";
import { CharacterById, cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

const AMOUNT_MAX_DIGITS = 3;

type HpVerb = "damage" | "heal" | "tempAdd" | "tempRemove" | "set";

/** Compact "17+5" readout of an (hp, temp) pair. `tempClassName` defaults to
 *  teal but must be overridden to inherit on colored surfaces (verb buttons). */
function HpValue({
  hp,
  temp,
  tempClassName = "text-teal-500",
}: {
  hp: number;
  temp: number;
  tempClassName?: string;
}) {
  return (
    <span className="tabular-nums">
      <span>{hp}</span>
      {temp > 0 && <span className={tempClassName}>{`+${temp}`}</span>}
    </span>
  );
}

/**
 * HP control panel, calculator-style: compose one amount on the keypad, then
 * spend it with a verb (Dégâts / Soins / ±Temp / PV exacts). Each verb button
 * previews the resulting pool before committing, and committing closes the
 * panel — the common case is a single number per turn.
 */
export default function HPForm({ character }: { character: CharacterById }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const [isPending, setIsPending] = useState(false);

  const maxHP = character.maximumHP;
  const currentHP = character.currentHP;
  const currentTemp = character.currentTempHP;
  const amount = amountStr === "" ? 0 : parseInt(amountStr, 10);
  const hasAmount = amountStr !== "";

  const clampHp = (hp: number) => Math.max(0, Math.min(hp, maxHP));
  // Client-side mirror of the server math, used only for the button previews.
  const projections: Record<HpVerb, { hp: number; temp: number }> = {
    damage: {
      hp: clampHp(currentHP - Math.max(amount - currentTemp, 0)),
      temp: Math.max(currentTemp - amount, 0),
    },
    heal: { hp: clampHp(currentHP + amount), temp: currentTemp },
    tempAdd: { hp: currentHP, temp: currentTemp + amount },
    tempRemove: { hp: currentHP, temp: Math.max(currentTemp - amount, 0) },
    set: { hp: clampHp(amount), temp: currentTemp },
  };

  const applyVerb = async (verb: HpVerb) => {
    if (!hasAmount || isPending) {
      return;
    }
    setIsPending(true);
    try {
      if (verb === "damage") {
        await drainTempHp({ characterId: character.id, maxHp: maxHP, amount });
      } else if (verb === "heal") {
        await setHp(character.id, maxHP, currentHP + amount);
      } else if (verb === "tempAdd") {
        await setTempHp(character.id, currentTemp + amount);
      } else if (verb === "tempRemove") {
        await setTempHp(character.id, currentTemp - amount);
      } else {
        await setHp(character.id, maxHP, amount);
      }
      setAmountStr("");
      setIsOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  const handleResetToMax = async () => {
    if (isPending) {
      return;
    }
    setIsPending(true);
    try {
      await resetHp(character.id, maxHP);
      setAmountStr("");
      setIsOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  const pushDigit = (digit: number) => {
    setAmountStr((current) => {
      const next = `${current}${digit}`.replace(/^0+(?=\d)/, "");
      return next.length > AMOUNT_MAX_DIGITS ? current : next;
    });
  };

  const baseHP = Math.min(currentHP, maxHP);
  const hpRatio = maxHP > 0 ? baseHP / maxHP : 0;
  const hpPercent = Math.max(0, Math.min(100, hpRatio * 100));
  // Temp HP segment only fills whatever room is left in the track.
  const tempPercent = Math.min((currentTemp / Math.max(maxHP, 1)) * 100, 100 - hpPercent);
  // The bar alone carries the health-state color; the numeric value stays neutral.
  const hpBarColor = cn("bg-green-500", {
    "bg-orange-500": currentHP <= maxHP * 0.5,
    "bg-red-500": currentHP <= maxHP * 0.2,
    "bg-stone-500": currentHP <= 0,
  });

  const verbPreview = (verb: HpVerb) =>
    hasAmount && (
      <span className="text-xs font-semibold opacity-80">
        {"→ "}
        <HpValue hp={projections[verb].hp} temp={projections[verb].temp} tempClassName="" />
      </span>
    );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setAmountStr("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex min-w-0 flex-col justify-center gap-2 rounded-lg bg-muted px-4 py-3 text-left transition-colors hover:bg-muted/70 md:min-w-[16rem] md:flex-1"
        >
          <div className="flex w-full items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
              <Heart className="size-4 stroke-[2.5px] text-red-400" />
              Points de vie
            </span>
            <div className="text-2xl font-bold tabular-nums leading-none">
              <HpValue hp={baseHP} temp={currentTemp} />
              <span className="text-base font-semibold text-muted-foreground">{` / ${maxHP}`}</span>
            </div>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-background/60">
            <div className={hpBarColor} style={{ width: `${hpPercent}%` }} />
            {tempPercent > 0 && (
              <div className="bg-teal-500" style={{ width: `${tempPercent}%` }} />
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 max-w-[calc(100vw-1rem)] overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <header className="flex items-center justify-between gap-2 border-l-4 border-l-red-500 bg-red-500/[0.07] px-3 py-2">
          <span className="flex items-center gap-2">
            <Heart className="size-3.5 shrink-0 stroke-[2.5px] text-red-400" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              Points de vie
            </span>
          </span>
          <span className="text-sm font-bold text-muted-foreground">
            <HpValue hp={baseHP} temp={currentTemp} />
            {` / ${maxHP}`}
          </span>
        </header>

        <div className="flex flex-col gap-2.5 p-3">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className={hpBarColor} style={{ width: `${hpPercent}%` }} />
            {tempPercent > 0 && (
              <div className="bg-teal-500" style={{ width: `${tempPercent}%` }} />
            )}
          </div>

          <div className="flex items-baseline justify-between rounded-lg bg-muted px-3 py-1.5">
            <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
              Montant
            </span>
            <span
              className={cn(
                "text-2xl font-bold tabular-nums leading-none",
                !hasAmount && "text-muted-foreground/50",
              )}
            >
              {amount}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                className="h-9 rounded-md bg-muted text-base font-semibold tabular-nums transition-colors hover:bg-muted/70 active:bg-white/10"
                onClick={() => pushDigit(digit)}
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              className="h-9 rounded-md bg-muted text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/70 active:bg-white/10"
              title="Effacer le montant"
              onClick={() => setAmountStr("")}
            >
              C
            </button>
            <button
              type="button"
              className="h-9 rounded-md bg-muted text-base font-semibold tabular-nums transition-colors hover:bg-muted/70 active:bg-white/10"
              onClick={() => pushDigit(0)}
            >
              0
            </button>
            <button
              type="button"
              className="flex h-9 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-muted/70 active:bg-white/10"
              title="Effacer le dernier chiffre"
              onClick={() => setAmountStr((current) => current.slice(0, -1))}
            >
              <Delete className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Button
              theme="red"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount || isPending}
              onClick={() => {
                void applyVerb("damage");
              }}
            >
              <span>Dégâts</span>
              {verbPreview("damage")}
            </Button>
            <Button
              theme="green"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount || isPending}
              onClick={() => {
                void applyVerb("heal");
              }}
            >
              <span>Soins</span>
              {verbPreview("heal")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Button
              theme="teal"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount || isPending}
              title="Recevoir des PV temporaires"
              onClick={() => {
                void applyVerb("tempAdd");
              }}
            >
              <span>+ Temporaire</span>
              {verbPreview("tempAdd")}
            </Button>
            <Button
              theme="orange"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount || isPending}
              title="Retirer des PV temporaires (fin d'effet)"
              onClick={() => {
                void applyVerb("tempRemove");
              }}
            >
              <span>− Temporaire</span>
              {verbPreview("tempRemove")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Button
              theme="neutral"
              size="xs"
              disabled={!hasAmount || isPending}
              title="Définir le total exact de PV"
              onClick={() => {
                void applyVerb("set");
              }}
            >
              {hasAmount ? `PV = ${amount}` : "PV exacts"}
            </Button>
            <Button
              theme="white"
              size="xs"
              disabled={isPending}
              title="Remettre les PV au maximum"
              onClick={() => {
                void handleResetToMax();
              }}
            >
              <RotateCcw /> MAX
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
