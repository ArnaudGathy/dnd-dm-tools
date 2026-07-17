import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Participant } from "@/types/types";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { CheckIcon, Dices, Swords } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// The whole point of this dialog is to fill the party's initiative without ever leaving the
// keyboard: type a number, press Space/Enter, next player. Order is reshuffled on every open so
// the DM can't slip into asking the table in the same sequence every fight.
const shuffle = (participants: Participant[]) => {
  const shuffled = [...participants];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const UNSET_INIT = -1;

// Same convention as the "Gagne duel" button on a combat row: the winner of a tie is nudged
// above the loser by 0.2, which sorts them apart without touching the number the table rolled.
const DUEL_STEP = 0.2;

type TieGroup = { value: number; players: Participant[] };

const getTieGroups = (order: Participant[], values: Record<string, string>): TieGroup[] => {
  const byValue = new Map<number, Participant[]>();
  for (const player of order) {
    const raw = values[player.uuid]?.trim();
    if (!raw) {
      continue;
    }
    const value = Number(raw);
    if (Number.isNaN(value)) {
      continue;
    }
    byValue.set(value, [...(byValue.get(value) ?? []), player]);
  }

  return [...byValue.entries()]
    .filter(([, tied]) => tied.length > 1)
    .map(([value, tied]) => ({ value, players: tied }))
    .sort((a, b) => b.value - a.value);
};

export const InitiativePrompt = ({
  players,
  onSubmit,
  onClose,
}: {
  players: Participant[];
  onSubmit: (initiatives: Record<string, number>) => void;
  onClose: () => void;
}) => {
  const [order] = useState(() => shuffle(players));
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      order.map((player) => [player.uuid, player.init === UNSET_INIT ? "" : String(player.init)]),
    ),
  );
  const [index, setIndex] = useState(0);

  // Set once every player has a number: null means we're still on the input step.
  const [tieGroups, setTieGroups] = useState<TieGroup[] | null>(null);
  const [groupIndex, setGroupIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [duelWinners, setDuelWinners] = useState<Record<string, number>>({});
  const isBreakingTies = tieGroups !== null;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isBreakingTies) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [index, isBreakingTies]);

  const currentPlayer = order[index];
  const isLast = index === order.length - 1;
  const filledCount = order.filter((player) => values[player.uuid]?.trim()).length;

  const submit = useCallback(
    (resolvedTies: Record<string, number>) => {
      const initiatives: Record<string, number> = {};
      for (const player of order) {
        const value = values[player.uuid]?.trim();
        if (value) {
          initiatives[player.uuid] = resolvedTies[player.uuid] ?? Number(value);
        }
      }
      onSubmit(initiatives);
    },
    [order, values, onSubmit],
  );

  // Ties are resolved after the whole party is in, so the DM answers "qui commence ?" once he
  // can see every number — not while he's still collecting them.
  const handleFinish = useCallback(() => {
    const groups = getTieGroups(order, values);
    if (groups.length === 0) {
      submit({});
      return;
    }
    setTieGroups(groups);
    setGroupIndex(0);
    setPicked([]);
    setDuelWinners({});
  }, [order, values, submit]);

  const handleValidate = () => {
    if (isLast) {
      handleFinish();
      return;
    }
    setIndex((current) => current + 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleValidate();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    // Backspace on an already empty field walks back to fix the previous player, so a
    // mistyped number never costs a trip to the mouse.
    if (e.key === "Backspace" && !values[currentPlayer.uuid] && index > 0) {
      e.preventDefault();
      setIndex((current) => current - 1);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        setIndex((current) => Math.max(current - 1, 0));
      } else {
        setIndex((current) => Math.min(current + 1, order.length - 1));
      }
    }
  };

  const currentGroup = tieGroups?.[groupIndex];
  // Memoized because the tie-breaking keyboard effect depends on it: rebuilt inline, it
  // would re-bind the document listener on every render.
  const remainingInGroup = useMemo(
    () => currentGroup?.players.filter((player) => !picked.includes(player.uuid)) ?? [],
    [currentGroup, picked],
  );

  const handlePick = useCallback(
    (uuid: string) => {
      if (!tieGroups || !currentGroup) {
        return;
      }
      const nextPicked = [...picked, uuid];
      const stillTied = currentGroup.players.filter((player) => !nextPicked.includes(player.uuid));

      // Down to one candidate, its rank is decided by elimination — asking would be a keystroke
      // for nothing (and with the common 2-player tie, that's the whole prompt in one press).
      if (stillTied.length === 1) {
        nextPicked.push(stillTied[0].uuid);
      } else if (stillTied.length > 1) {
        setPicked(nextPicked);
        return;
      }

      const resolved = { ...duelWinners };
      nextPicked.forEach((pickedUuid, rank) => {
        const offset = (nextPicked.length - 1 - rank) * DUEL_STEP;
        resolved[pickedUuid] = Math.round((currentGroup.value + offset) * 10) / 10;
      });

      if (groupIndex === tieGroups.length - 1) {
        submit(resolved);
        return;
      }
      setDuelWinners(resolved);
      setPicked([]);
      setGroupIndex((current) => current + 1);
    },
    [tieGroups, currentGroup, picked, duelWinners, groupIndex, submit],
  );

  // The tie step has no input to hang a handler on, so it listens on the document — safe because
  // CombatModule's own space handler stands down while this dialog is open.
  useEffect(() => {
    if (!isBreakingTies) {
      return;
    }
    const onDocumentKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        if (picked.length > 0) {
          setPicked((current) => current.slice(0, -1));
        } else {
          setTieGroups(null);
        }
        return;
      }
      const digit = Number(e.key);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= remainingInGroup.length) {
        e.preventDefault();
        handlePick(remainingInGroup[digit - 1].uuid);
      }
    };
    document.addEventListener("keydown", onDocumentKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown, true);
    };
  }, [isBreakingTies, picked.length, remainingInGroup, handlePick, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 animate-in fade-in-0"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl border border-white/10 bg-neutral-950 px-10 py-12 shadow-2xl">
        <Button
          variant="ghost"
          size="xs"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <XMarkIcon className="size-5" />
        </Button>

        {isBreakingTies && currentGroup ? (
          <>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Swords className="size-5" />
              <span className="text-sm uppercase tracking-widest">
                Égalité — {groupIndex + 1}/{tieGroups.length}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl text-muted-foreground">
                Initiative{" "}
                <span className="font-bold tabular-nums text-foreground">{currentGroup.value}</span>
              </span>
              <span className="text-center text-5xl font-bold tracking-tight">
                Qui agit en premier ?
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {remainingInGroup.map((player, playerIndex) => (
                <button
                  key={player.uuid}
                  type="button"
                  onClick={() => handlePick(player.uuid)}
                  className="flex items-center gap-3 rounded-xl border-2 border-white/15 bg-white/5 px-6 py-4 text-3xl font-bold transition hover:border-red-500 hover:bg-red-500/10"
                >
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-base font-semibold tabular-nums text-muted-foreground">
                    {playerIndex + 1}
                  </span>
                  {player.name}
                </button>
              ))}
            </div>

            {picked.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {picked.map((uuid, rank) => {
                  const player = currentGroup.players.find((p) => p.uuid === uuid);
                  return (
                    <span
                      key={uuid}
                      className="flex items-center gap-2 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-1 text-sm"
                    >
                      <span className="font-semibold tabular-nums">{rank + 1}.</span>
                      {player?.name}
                    </span>
                  );
                })}
              </div>
            )}

            <span className="text-xs text-muted-foreground">
              Chiffre pour choisir · Retour arrière pour annuler · Échap pour fermer
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Dices className="size-5" />
              <span className="text-sm uppercase tracking-widest">
                Initiative — {filledCount}/{order.length}
              </span>
            </div>

            <div className="flex flex-col items-center gap-6">
              <span className="text-center text-6xl font-bold tracking-tight">
                {currentPlayer.name}
              </span>
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                aria-label={`Initiative de ${currentPlayer.name}`}
                autoFocus
                className="no-spinner h-28 w-48 rounded-xl border-2 border-white/15 bg-white/5 text-center text-6xl font-bold tabular-nums outline-none focus:border-red-500"
                value={values[currentPlayer.uuid] ?? ""}
                onChange={(e) =>
                  setValues((current) => ({ ...current, [currentPlayer.uuid]: e.target.value }))
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {order.map((player, playerIndex) => {
                const value = values[player.uuid]?.trim();
                return (
                  <button
                    key={player.uuid}
                    type="button"
                    onClick={() => setIndex(playerIndex)}
                    className={clsx(
                      "flex items-center gap-2 rounded-lg border px-3 py-1 text-sm transition",
                      playerIndex === index
                        ? "border-red-500/60 bg-red-500/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                    )}
                  >
                    {player.name}
                    {value && <span className="font-semibold tabular-nums">{value}</span>}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button size="lg" onClick={handleFinish}>
                <CheckIcon className="size-5" />
                Lancer le combat
              </Button>
              <span className="text-xs text-muted-foreground">
                Espace ou Entrée pour valider · Retour arrière pour revenir · Échap pour annuler
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
