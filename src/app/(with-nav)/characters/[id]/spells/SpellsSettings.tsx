"use client";

import PopoverComponent from "@/components/ui/PopoverComponent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Settings } from "lucide-react";
import { updateSpellFlagAction } from "@/lib/actions/spells";
import { Themes } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";

type FlagName =
  | "isPrepared"
  | "isAlwaysPrepared"
  | "hasLongRestCast"
  | "canBeSwappedOnLongRest"
  | "canBeSwappedOnLevelUp";

export default function SpellsSettings({
  characterId,
  spellId,
  isAlwaysPrepared,
  hasLongRestCast,
  canBeSwappedOnLongRest,
  canBeSwappedOnLevelUp,
  isPrepared,
}: {
  characterId: number;
  spellId: string;
  isAlwaysPrepared: boolean;
  hasLongRestCast: boolean;
  canBeSwappedOnLongRest: boolean;
  canBeSwappedOnLevelUp: boolean;
  isPrepared: boolean;
}) {
  const flags: {
    name: FlagName;
    label: string;
    checked: boolean;
    theme: Themes;
    text: string;
  }[] = [
    {
      name: "isPrepared",
      label: "Préparé",
      checked: isPrepared,
      theme: "sky",
      text: "text-sky-500",
    },
    {
      name: "isAlwaysPrepared",
      label: "Toujours préparé",
      checked: isAlwaysPrepared,
      theme: "amber",
      text: "text-amber-500",
    },
    {
      name: "hasLongRestCast",
      label: "1 lancement / long repos",
      checked: hasLongRestCast,
      theme: "lime",
      text: "text-lime-500",
    },
    {
      name: "canBeSwappedOnLongRest",
      label: "Échangeable / long repos",
      checked: canBeSwappedOnLongRest,
      theme: "rose",
      text: "text-rose-500",
    },
    {
      name: "canBeSwappedOnLevelUp",
      label: "Échangeable / level up",
      checked: canBeSwappedOnLevelUp,
      theme: "purple",
      text: "text-purple-500",
    },
  ];

  return (
    <PopoverComponent
      definition={
        <div className="flex min-w-[220px] flex-col gap-3">
          <h1 className="text-sm font-semibold">Configuration du sort</h1>
          <div className="flex flex-col gap-2.5">
            {flags.map((flag) => (
              <div key={flag.name} className="flex items-center justify-between gap-4">
                <Label htmlFor={`${flag.name}-${spellId}`} className={`text-sm ${flag.text}`}>
                  {flag.label}
                </Label>
                <Switch
                  id={`${flag.name}-${spellId}`}
                  theme={flag.theme}
                  checked={flag.checked}
                  onCheckedChange={async (checked) => {
                    await updateSpellFlagAction({
                      characterId,
                      spellId,
                      flagName: flag.name,
                      newState: checked,
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <span
        title="Configurer le sort"
        className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Settings className="size-4" />
      </span>
    </PopoverComponent>
  );
}
