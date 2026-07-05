"use client";

import { MONEY_TYPE_MAP } from "@/constants/maps";
import { Money, MoneyType } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coins, Delete, Minus, Plus } from "lucide-react";
import { updateMoney } from "@/lib/actions/money";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AMOUNT_MAX_DIGITS = 5;

type MoneyVerb = "spend" | "gain" | "set";

const COIN_STYLES: Record<MoneyType, { text: string; bar: string; tint: string }> = {
  [MoneyType.GOLD]: {
    text: "text-amber-400",
    bar: "border-l-amber-500",
    tint: "bg-amber-500/[0.07]",
  },
  [MoneyType.SILVER]: {
    text: "text-slate-300",
    bar: "border-l-slate-400",
    tint: "bg-slate-400/[0.07]",
  },
  [MoneyType.COPPER]: {
    text: "text-orange-400",
    bar: "border-l-orange-500",
    tint: "bg-orange-500/[0.07]",
  },
};

/**
 * Coin purse control, calculator-style like HPForm: compose the amount the DM
 * announced on the keypad, then spend it with a verb (Dépenser / Gagner /
 * Total exact). Each verb previews the resulting total before committing.
 */
export default function MoneyForm({ money }: { money: Money }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const [isPending, setIsPending] = useState(false);

  const coin = COIN_STYLES[money.type];
  const amount = amountStr === "" ? 0 : parseInt(amountStr, 10);
  const hasAmount = amountStr !== "";

  // Client-side mirror of the resulting totals, used only for button previews.
  const projections: Record<MoneyVerb, number> = {
    spend: Math.max(0, money.quantity - amount),
    gain: money.quantity + amount,
    set: amount,
  };

  const applyVerb = async (verb: MoneyVerb) => {
    if (!hasAmount || isPending) {
      return;
    }
    setIsPending(true);
    try {
      await updateMoney(money.id, projections[verb]);
      setAmountStr("");
      setIsOpen(false);
    } catch (e) {
      console.error(e);
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

  const verbPreview = (verb: MoneyVerb) =>
    hasAmount && (
      <span className="text-xs font-semibold tabular-nums opacity-80">→ {projections[verb]}</span>
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
      <PopoverTrigger className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-muted px-2 py-2 transition-colors hover:bg-white/10">
        <Coins className={cn("size-4 shrink-0 stroke-[2.5px]", coin.text)} />
        <span className="truncate text-xl font-bold tabular-nums leading-none">
          {money.quantity}
        </span>
        <span className={cn("mt-0.5 text-tiny font-semibold uppercase tracking-wide", coin.text)}>
          {MONEY_TYPE_MAP[money.type]}
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 max-w-[calc(100vw-1rem)] overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <header
          className={cn(
            "flex items-center justify-between gap-2 border-l-4 px-3 py-2",
            coin.bar,
            coin.tint,
          )}
        >
          <span className="flex items-center gap-2">
            <Coins className={cn("size-3.5 shrink-0 stroke-[2.5px]", coin.text)} />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              {MONEY_TYPE_MAP[money.type]}
            </span>
          </span>
          <span className="text-sm font-bold tabular-nums text-muted-foreground">
            {money.quantity}
          </span>
        </header>

        <div className="flex flex-col gap-2.5 p-3">
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
              disabled={!hasAmount || amount > money.quantity || isPending}
              title="Dépenser ce montant"
              onClick={() => {
                void applyVerb("spend");
              }}
            >
              <span className="flex items-center gap-1">
                <Minus className="size-3.5" /> Dépenser
              </span>
              {verbPreview("spend")}
            </Button>
            <Button
              theme="green"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount || isPending}
              title="Gagner ce montant"
              onClick={() => {
                void applyVerb("gain");
              }}
            >
              <span className="flex items-center gap-1">
                <Plus className="size-3.5" /> Gagner
              </span>
              {verbPreview("gain")}
            </Button>
          </div>

          <Button
            theme="neutral"
            size="xs"
            disabled={!hasAmount || isPending}
            title="Définir le total exact, sans tenir compte de l'actuel"
            onClick={() => {
              void applyVerb("set");
            }}
          >
            {hasAmount ? `Total = ${amount}` : "Total exact"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
