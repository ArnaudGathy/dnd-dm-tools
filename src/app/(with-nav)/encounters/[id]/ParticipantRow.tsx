import { ReactNode } from "react";
import { clsx } from "clsx";
import { Condition, Participant } from "@/types/types";
import { getInitiativeFromParticipant } from "@/utils/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipComponent } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ConditionImage } from "@/app/(with-nav)/encounters/[id]/ConditionImage";
import { HpStatusPopover } from "@/app/(with-nav)/encounters/[id]/HpStatusPopover";
import { getHpBarColor } from "@/app/(with-nav)/encounters/[id]/hpDisplay";
import { CheckIcon, Dices, RefreshCcw, Swords, User, Wind } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Sentinel for "initiative never set" — kept out of the sort order and displayed as "—".
export const DEFAULT_INIT = -999;

// Players join the tracker with init -1 until the initiative prompt fills it in.
const PLAYER_UNSET_INIT = -1;

const MAX_VISIBLE_CONDITIONS = 3;

// "Stirge (2)" → the duplicate marker reads quieter than the name itself.
const ParticipantName = ({ name }: { name: string }) => {
  const match = name.match(/^(.*?)\s*(\(.*\))$/);
  if (!match) {
    return name;
  }
  return (
    <>
      {match[1]} <span className="font-normal text-muted-foreground">{match[2]}</span>
    </>
  );
};

const formatInit = (init: number) => {
  if (init === DEFAULT_INIT || init === PLAYER_UNSET_INIT) {
    return "—";
  }
  return Number.isInteger(init) ? String(init) : init.toFixed(1);
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
    {children}
  </span>
);

const ConditionChip = ({ condition, onRemove }: { condition: Condition; onRemove: () => void }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" className="shrink-0 rounded transition-transform hover:scale-110">
        <ConditionImage className="size-5" condition={condition} />
      </button>
    </PopoverTrigger>
    <PopoverContent
      className="w-[26rem] max-w-[calc(100vw-1rem)] p-0"
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <header className="flex items-center justify-between gap-2 border-l-4 border-l-amber-500 bg-amber-500/[0.07] px-3 py-2">
        <span className="flex items-center gap-2">
          <ConditionImage className="size-5" condition={condition} />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/90">
            {condition.title}
          </span>
        </span>
        <Button theme="neutral" size="xs" className="h-6 px-2 text-xs" onClick={onRemove}>
          Retirer
        </Button>
      </header>
      <div className="flex flex-col gap-2 p-3">
        {condition.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{condition.description}</p>
        )}
        {condition.bullets && condition.bullets.length > 0 && (
          <ul className="list-inside list-disc space-y-1.5 text-sm leading-5">
            {condition.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </PopoverContent>
  </Popover>
);

export const ParticipantRow = ({
  participant,
  isActiveTurn,
  otherPlayers,
  spellAccess,
  onUpdateInit,
  onSwapInit,
  onRemove,
  onMarkActive,
  onApplyHpDelta,
  onSetCurrentHp,
  onSetMaxHp,
  onToggleCondition,
  onSetNote,
}: {
  participant: Participant;
  isActiveTurn: boolean;
  otherPlayers: Participant[];
  spellAccess?: ReactNode;
  onUpdateInit: (participant: Participant, value: number) => void;
  onSwapInit: (a: Participant, b: Participant) => void;
  onRemove: (participant: Participant) => void;
  onMarkActive: (participant: Participant) => void;
  onApplyHpDelta: (participant: Participant, amount: number, mode: "sub" | "add") => void;
  onSetCurrentHp: (participant: Participant, value: number) => void;
  onSetMaxHp: (participant: Participant, value: number) => void;
  onToggleCondition: (participant: Participant, condition: Condition) => void;
  onSetNote: (participant: Participant, note: string) => void;
}) => {
  const isEnvironment = participant.id === -99;
  const isDead = participant.currentHp === "0";
  const hasHp = participant.hp !== "";
  const currentHp = parseInt(participant.currentHp, 10) || 0;
  const maxHp = parseInt(participant.hp, 10) || 0;
  const hpPercent = maxHp > 0 ? Math.max(0, Math.min(100, (currentHp / maxHp) * 100)) : 0;

  const visibleConditions = participant.conditions?.slice(0, MAX_VISIBLE_CONDITIONS) ?? [];
  const overflowConditions = participant.conditions?.slice(MAX_VISIBLE_CONDITIONS) ?? [];

  const nameClassName = clsx("truncate text-sm font-medium", {
    "text-red-400/90 line-through": isDead,
    "italic text-muted-foreground": isEnvironment,
  });

  const hasStatBlock = participant.isNPC && !isEnvironment;

  // The whole row is the scroll-to-stat-block target; clicks on the row's own
  // controls (init pill, HP bar, chips, remove…) must not steal the navigation.
  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasStatBlock || (event.target as HTMLElement).closest("button, a, input")) {
      return;
    }
    document
      .getElementById(String(participant.id))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      onClick={handleRowClick}
      className={clsx("group relative flex h-9 items-center gap-2 pl-3 pr-1.5 transition-colors", {
        "bg-red-500/10 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.35)]": isActiveTurn,
        "hover:bg-white/[0.03]": !isActiveTurn,
        "opacity-40": isDead,
        "pointer-events-none [&>*:not(#markActive)]:opacity-40": participant.inactive,
        "cursor-pointer": hasStatBlock,
      })}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Initiative"
            className={clsx(
              "flex h-7 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold tabular-nums transition-colors",
              isActiveTurn
                ? "bg-red-500 text-white"
                : "bg-white/[0.04] text-foreground/90 hover:bg-white/10",
            )}
          >
            {formatInit(participant.init)}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-60 p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <header className="flex items-center gap-2 border-l-4 border-l-red-500 bg-red-500/[0.07] px-3 py-2">
            <Dices className="size-3.5 shrink-0 text-red-400" />
            <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              {`Initiative · ${participant.name}`}
            </span>
          </header>
          <div className="flex flex-col gap-2.5 p-3">
            <Input
              type="number"
              className="h-9 text-center text-base font-bold tabular-nums"
              value={
                participant.init === DEFAULT_INIT || participant.init === PLAYER_UNSET_INIT
                  ? ""
                  : participant.init
              }
              onChange={(e) => onUpdateInit(participant, Number(e.target.value))}
              onFocus={(event) => event.target.select()}
            />
            {participant.isNPC ? (
              <div className="grid grid-cols-2 gap-1">
                <Button
                  theme="neutral"
                  size="xs"
                  onClick={() =>
                    onUpdateInit(participant, getInitiativeFromParticipant(participant))
                  }
                >
                  <Dices />
                  Relancer
                </Button>
                <Button
                  theme="neutral"
                  size="xs"
                  title="Relance et garde le meilleur"
                  onClick={() => {
                    const newRoll = getInitiativeFromParticipant(participant);
                    if (newRoll > participant.init) {
                      onUpdateInit(participant, newRoll);
                    }
                  }}
                >
                  <RefreshCcw />
                  Avantage
                </Button>
              </div>
            ) : (
              otherPlayers.length > 0 && (
                <div className="flex flex-col gap-1">
                  <SectionLabel>Échanger avec</SectionLabel>
                  <div className="flex flex-wrap gap-1">
                    {otherPlayers.map((other) => (
                      <Button
                        key={other.uuid}
                        theme="neutral"
                        size="xs"
                        className="h-7 px-2 text-xs"
                        disabled={participant.init === PLAYER_UNSET_INIT}
                        onClick={() => onSwapInit(participant, other)}
                      >
                        {other.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            )}
            <Button
              theme="red"
              size="xs"
              title="Passe devant en cas d'égalité (+0.2)"
              disabled={participant.init === PLAYER_UNSET_INIT}
              onClick={() => onUpdateInit(participant, participant.init + 0.2)}
            >
              <Swords />
              Gagne duel
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* The mini-figure token: same color as the figurine on the battle map, so it
          must read at a glance. Players deliberately get no color (see User icon). */}
      <span className="flex size-7 shrink-0 items-center justify-center">
        {isEnvironment ? (
          <Wind className="size-4 text-muted-foreground" />
        ) : participant.isNPC ? (
          <span
            className="size-7 rounded-md ring-1 ring-inset ring-white/25"
            style={{
              backgroundColor: participant.color,
              boxShadow: `0 0 10px ${participant.color}59`,
            }}
          />
        ) : (
          <User className="size-4 text-muted-foreground" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <TooltipComponent definition={participant.name}>
          <span className={nameClassName}>
            <ParticipantName name={participant.name} />
          </span>
        </TooltipComponent>

        {(visibleConditions.length > 0 || overflowConditions.length > 0) && (
          <div className="flex shrink-0 items-center gap-1">
            {visibleConditions.map((condition) => (
              <ConditionChip
                key={condition.title}
                condition={condition}
                onRemove={() => onToggleCondition(participant, condition)}
              />
            ))}
            {overflowConditions.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-5 min-w-5 items-center justify-center rounded bg-white/10 px-1 text-[10px] font-bold tabular-nums text-muted-foreground hover:bg-white/20"
                  >
                    {`+${overflowConditions.length}`}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex w-64 flex-col gap-1 p-2"
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  {overflowConditions.map((condition) => (
                    <div
                      key={condition.title}
                      className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5"
                    >
                      <ConditionImage className="size-5 shrink-0" condition={condition} />
                      <span className="flex-1 truncate text-xs font-medium">{condition.title}</span>
                      <button
                        type="button"
                        title="Retirer"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => onToggleCondition(participant, condition)}
                      >
                        <XMarkIcon className="size-4" />
                      </button>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>

      {hasHp ? (
        <HpStatusPopover
          participant={participant}
          onApplyDelta={onApplyHpDelta}
          onSetCurrentHp={onSetCurrentHp}
          onSetMaxHp={onSetMaxHp}
          onToggleCondition={onToggleCondition}
          onSetNote={onSetNote}
        >
          <button
            type="button"
            title="PV et états"
            className="flex w-[35%] shrink-0 items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white/5"
          >
            <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className={cn("block h-full rounded-full", getHpBarColor(currentHp, maxHp))}
                style={{ width: `${hpPercent}%` }}
              />
            </span>
            <span className="w-14 shrink-0 text-right tabular-nums leading-none">
              <span className="text-sm font-bold">{currentHp}</span>
              <span className="text-xs text-muted-foreground">{`/${maxHp}`}</span>
            </span>
          </button>
        </HpStatusPopover>
      ) : (
        <div className="flex w-[35%] shrink-0 items-center justify-end">{spellAccess}</div>
      )}

      {participant.inactive ? (
        <Button
          variant="ghost"
          size="xs"
          id="markActive"
          title="Rejoint le combat"
          className="pointer-events-auto h-7 w-7 shrink-0 p-0"
          onClick={() => onMarkActive(participant)}
        >
          <CheckIcon className="size-4" />
        </Button>
      ) : (
        <ConfirmDialog
          description="Supprimer cet élément est irréversible."
          onConfirm={() => onRemove(participant)}
        >
          <Button
            variant="ghost"
            size="xs"
            title="Retirer du combat"
            className="h-7 w-7 shrink-0 p-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
          >
            <XMarkIcon className="size-4" />
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
};
