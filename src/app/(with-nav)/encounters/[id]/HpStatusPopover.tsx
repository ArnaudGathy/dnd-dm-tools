import { ReactNode, useState } from "react";
import { Condition, Participant } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { conditions } from "@/data/conditions";
import { ChevronDown, Delete, Heart, NotebookPen } from "lucide-react";
import { ConditionImage } from "@/app/(with-nav)/encounters/[id]/ConditionImage";
import { getHpBarColor } from "@/app/(with-nav)/encounters/[id]/hpDisplay";

const AMOUNT_MAX_DIGITS = 3;

/**
 * Combat-side sibling of the character sheet's HPForm: compose one amount on the
 * keypad, spend it with a verb (Dégâts / Soins / PV exacts / Max PV) — each verb
 * previews the resulting pool before committing. Conditions and the free-text
 * note live in the same panel so one popover covers a participant's whole state.
 */
export const HpStatusPopover = ({
  participant,
  onApplyDelta,
  onSetCurrentHp,
  onSetMaxHp,
  onToggleCondition,
  onSetNote,
  children,
}: {
  participant: Participant;
  onApplyDelta: (participant: Participant, amount: number, mode: "sub" | "add") => void;
  onSetCurrentHp: (participant: Participant, value: number) => void;
  onSetMaxHp: (participant: Participant, value: number) => void;
  onToggleCondition: (participant: Participant, condition: Condition) => void;
  onSetNote: (participant: Participant, note: string) => void;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const [note, setNote] = useState("");
  const [areConditionsOpen, setAreConditionsOpen] = useState(false);

  const currentHp = parseInt(participant.currentHp, 10) || 0;
  const maxHp = parseInt(participant.hp, 10) || 0;
  const amount = amountStr === "" ? 0 : parseInt(amountStr, 10);
  const hasAmount = amountStr !== "";
  const hpPercent = maxHp > 0 ? Math.max(0, Math.min(100, (currentHp / maxHp) * 100)) : 0;

  // Client-side mirror of handleChangeHp's math, used only for the button previews.
  const projections = {
    damage: Math.max(currentHp - amount, 0),
    heal: Math.min(currentHp + amount, maxHp),
  };

  const pushDigit = (digit: number) => {
    setAmountStr((current) => {
      const next = `${current}${digit}`.replace(/^0+(?=\d)/, "");
      return next.length > AMOUNT_MAX_DIGITS ? current : next;
    });
  };

  const applyDelta = (mode: "sub" | "add") => {
    if (!hasAmount) {
      return;
    }
    onApplyDelta(participant, amount, mode);
    setAmountStr("");
  };

  const applySet = (setter: (participant: Participant, value: number) => void) => {
    if (!hasAmount) {
      return;
    }
    setter(participant, amount);
    setAmountStr("");
  };

  const commitNote = () => {
    if (!note.trim()) {
      return;
    }
    onSetNote(participant, note);
    setNote("");
  };

  const verbPreview = (value: number) =>
    hasAmount && (
      <span className="text-xs font-semibold tabular-nums opacity-80">{`→ ${value}`}</span>
    );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setAmountStr("");
          setNote("");
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={8}
        className="max-h-[min(85vh,44rem)] w-[21rem] max-w-[calc(100vw-1rem)] overflow-y-auto p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-l-4 border-l-red-500 bg-popover px-3 py-2">
          <span className="flex min-w-0 items-center gap-2">
            <Heart className="size-3.5 shrink-0 stroke-[2.5px] text-red-400" />
            {participant.color && (
              <span
                className="size-3.5 shrink-0 rounded-sm ring-1 ring-inset ring-white/25"
                style={{ backgroundColor: participant.color }}
              />
            )}
            <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              {participant.name}
            </span>
          </span>
          <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
            {`${currentHp} / ${maxHp}`}
          </span>
        </header>

        <div className="flex flex-col gap-2.5 p-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full", getHpBarColor(currentHp, maxHp))}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between rounded-lg bg-muted px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
              disabled={!hasAmount}
              onClick={() => applyDelta("sub")}
            >
              <span>Dégâts</span>
              {verbPreview(projections.damage)}
            </Button>
            <Button
              theme="green"
              className="h-10 flex-col gap-0 leading-tight"
              disabled={!hasAmount}
              onClick={() => applyDelta("add")}
            >
              <span>Soins</span>
              {verbPreview(projections.heal)}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Button
              theme="neutral"
              size="xs"
              disabled={!hasAmount || amount > maxHp}
              title="Définir le total exact de PV"
              onClick={() => applySet(onSetCurrentHp)}
            >
              {hasAmount ? `PV = ${amount}` : "PV exacts"}
            </Button>
            <Button
              theme="white"
              size="xs"
              disabled={!hasAmount}
              title="Définir le maximum de PV"
              onClick={() => applySet(onSetMaxHp)}
            >
              {hasAmount ? `Max = ${amount}` : "Max PV"}
            </Button>
          </div>

          <div className="mt-1 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setAreConditionsOpen((open) => !open)}
              aria-expanded={areConditionsOpen}
              className="flex items-center justify-between gap-2 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-amber-400/90">
                  États
                </span>
                {(participant.conditions?.length ?? 0) > 0 && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold tabular-nums text-amber-200">
                    {participant.conditions?.length}
                  </span>
                )}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  areConditionsOpen && "rotate-180",
                )}
              />
            </button>
            {areConditionsOpen && (
              <div className="grid grid-cols-2 gap-1">
                {conditions.map((condition) => {
                  const isActive = participant.conditions?.some((c) => c.title === condition.title);
                  return (
                    <button
                      key={condition.title}
                      type="button"
                      onClick={() => onToggleCondition(participant, condition)}
                      className={cn(
                        "flex h-8 items-center gap-2 rounded-md border border-transparent bg-muted px-2 text-left transition-colors hover:bg-muted/70",
                        isActive && "border-amber-500/60 bg-amber-500/10",
                      )}
                    >
                      <ConditionImage className="size-5 shrink-0" condition={condition} />
                      <span
                        className={cn(
                          "truncate text-xs",
                          isActive ? "font-semibold text-amber-200" : "text-foreground/80",
                        )}
                      >
                        {condition.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <NotebookPen className="size-4 shrink-0 text-muted-foreground" />
            <Input
              className="h-8 flex-1"
              placeholder="Note (poison 3 tours, mi-PV…)"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitNote();
                }
              }}
            />
            <Button theme="neutral" size="xs" disabled={!note.trim()} onClick={commitNote}>
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
