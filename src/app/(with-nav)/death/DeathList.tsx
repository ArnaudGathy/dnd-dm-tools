"use client";

import { useEffect } from "react";
import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";
import { useCharacterTracker, type CharacterTracking } from "@/hooks/useCharacterTracker";
import { Button } from "@/components/ui/button";
import { Heart, RotateCcw, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

type DeathStatus = "dying" | "stable" | "dead";

const getStatus = (success: number, failure: number): DeathStatus => {
  if (failure >= 3) return "dead";
  if (success >= 3) return "stable";
  return "dying";
};

const statusMeta: Record<DeathStatus, { label: string; dot: string; text: string }> = {
  dying: { label: "En train de mourir", dot: "bg-amber-400", text: "text-amber-400" },
  stable: { label: "Stabilisé", dot: "bg-green-400", text: "text-green-400" },
  dead: { label: "Mort", dot: "bg-red-400", text: "text-red-400" },
};

function Segment({
  kind,
  active,
  onClick,
}: {
  kind: "failure" | "success";
  active: boolean;
  onClick: () => void;
}) {
  const Icon = kind === "failure" ? Skull : Heart;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 flex-1 items-center justify-center rounded-md transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? kind === "failure"
            ? "bg-red-500/90 shadow-[0_0_12px] shadow-red-500/40"
            : "bg-green-500/90 shadow-[0_0_12px] shadow-green-500/40"
          : "bg-muted/60",
      )}
    >
      <Icon
        className={cn(
          "size-5 transition-colors",
          active ? "fill-white/90 stroke-white" : "stroke-stone-500",
        )}
      />
    </button>
  );
}

export default function DeathList() {
  const { charactersData, setCharactersData } = useCharacterTracker();

  const group = useGroupFromCampaign();

  useEffect(() => {
    if (!group.length || charactersData === null) return;

    const existing = charactersData.filter((c) => c != null);

    const missing = group.filter((char) => !existing.some((c) => c.characterName === char.name));

    if (missing.length > 0) {
      setCharactersData([
        ...existing,
        ...missing.map((char) => ({
          characterName: char.name,
          success: 0,
          failure: 0,
          currentHP: 0,
          currentTempHP: 0,
          maximumHP: 0,
        })),
      ]);
    }
  }, [group, charactersData, setCharactersData]);

  // Clear death tracking once a character recovers (HP back above 0), so the
  // next time they drop to 0 they start a fresh death-save situation.
  useEffect(() => {
    if (charactersData === null) return;

    const needsReset = (char: CharacterTracking | null) =>
      char != null && char.currentHP > 0 && (char.success > 0 || char.failure > 0);

    if (charactersData.some(needsReset)) {
      setCharactersData(
        charactersData.map((char) =>
          needsReset(char) ? { ...char, success: 0, failure: 0 } : char,
        ),
      );
    }
  }, [charactersData, setCharactersData]);

  if (!group.length) {
    return <div className="mt-8 text-muted-foreground">Select a group</div>;
  }

  const hasCharacters = !!charactersData?.length;

  const handleSetCount = (
    characterName: string,
    type: "failure" | "success" | "both",
    total: number,
  ) => {
    if (hasCharacters) {
      setCharactersData(
        charactersData?.map((char) => {
          if (char.characterName !== characterName) {
            return char;
          }
          if (type === "both") {
            return { ...char, success: total, failure: total };
          }
          return { ...char, [type]: total };
        }),
      );
    }
  };

  if (!hasCharacters) {
    return <div className="mt-8 text-muted-foreground">Ajouter un personnage.</div>;
  }

  const dyingCharacters = (charactersData ?? []).filter((char) => char.currentHP <= 0);

  if (!dyingCharacters.length) {
    return (
      <div className="mt-8 text-muted-foreground">
        Personne n&apos;est à terre. Les jets de sauvegarde apparaîtront quand un personnage tombera
        à 0 PV.
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      {dyingCharacters.map(({ characterName, success, failure }) => {
        const status = getStatus(success, failure);
        const meta = statusMeta[status];
        const isDead = status === "dead";
        const isStable = status === "stable";

        const setCount = (type: "failure" | "success", level: number, current: number) =>
          handleSetCount(characterName, type, current === level ? level - 1 : level);

        return (
          <div
            key={characterName}
            className={cn(
              "flex items-center gap-5 rounded-xl border bg-card px-5 py-3 transition-colors",
              isDead && "border-red-500/50 bg-red-950/10",
              isStable && "border-green-500/50 bg-green-950/10",
            )}
          >
            {/* Identity */}
            <div className="w-48 shrink-0">
              <h3 className="truncate text-xl font-semibold leading-tight">{characterName}</h3>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", meta.dot)} />
                <span className={cn("text-xs font-medium", meta.text)}>{meta.label}</span>
              </div>
            </div>

            {/* Tug-of-war meter: death pulls left, life pulls right */}
            <div className="flex flex-1 items-center gap-1.5">
              {([3, 2, 1] as const).map((level) => (
                <Segment
                  key={`f${level}`}
                  kind="failure"
                  active={failure >= level}
                  onClick={() => setCount("failure", level, failure)}
                />
              ))}
              <div className="mx-1 h-9 w-px shrink-0 bg-border" />
              {([1, 2, 3] as const).map((level) => (
                <Segment
                  key={`s${level}`}
                  kind="success"
                  active={success >= level}
                  onClick={() => setCount("success", level, success)}
                />
              ))}
            </div>

            {/* Roll outcomes */}
            <div className="flex shrink-0 items-center gap-2">
              <Button
                theme="red"
                size="sm"
                onClick={() => handleSetCount(characterName, "failure", Math.min(3, failure + 2))}
              >
                1
              </Button>
              <Button
                theme="amber"
                size="sm"
                onClick={() => handleSetCount(characterName, "failure", Math.min(3, failure + 1))}
              >
                2-9
              </Button>
              <Button
                theme="green"
                size="sm"
                onClick={() => handleSetCount(characterName, "success", Math.min(3, success + 1))}
              >
                10-19
              </Button>
              <Button
                theme="indigo"
                size="sm"
                onClick={() => handleSetCount(characterName, "success", 3)}
              >
                20
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Reset"
                className="ml-1 size-9"
                onClick={() => handleSetCount(characterName, "both", 0)}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
