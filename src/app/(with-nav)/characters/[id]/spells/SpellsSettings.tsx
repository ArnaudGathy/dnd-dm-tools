"use client";

import PopoverComponent from "@/components/ui/PopoverComponent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Circle, type LucideIcon, Settings, Star } from "lucide-react";
import { updateSpellFlagAction } from "@/lib/actions/spells";
import { Themes } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { PLANNING_MARKERS } from "@/app/(with-nav)/characters/[id]/spells/spellStatus";
import { cn } from "@/lib/utils";

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
  const values: Record<FlagName, boolean> = {
    isPrepared,
    isAlwaysPrepared,
    hasLongRestCast,
    canBeSwappedOnLongRest,
    canBeSwappedOnLevelUp,
  };

  const availability: {
    name: FlagName;
    label: string;
    theme: Themes;
    text: string;
    Icon: LucideIcon;
  }[] = [
    { name: "isPrepared", label: "Préparé", theme: "sky", text: "text-sky-500", Icon: Circle },
    {
      name: "isAlwaysPrepared",
      label: "Toujours préparé",
      theme: "amber",
      text: "text-amber-500",
      Icon: Star,
    },
  ];

  const renderRow = ({
    name,
    label,
    theme,
    text,
    Icon,
  }: {
    name: FlagName;
    label: string;
    theme: Themes;
    text: string;
    Icon: LucideIcon;
  }) => (
    <div key={name} className="flex items-center justify-between gap-4">
      <Label htmlFor={`${name}-${spellId}`} className={cn("flex items-center gap-2 text-sm", text)}>
        <Icon className="size-4" />
        {label}
      </Label>
      <Switch
        id={`${name}-${spellId}`}
        theme={theme}
        checked={values[name]}
        onCheckedChange={async (checked) => {
          await updateSpellFlagAction({ characterId, spellId, flagName: name, newState: checked });
        }}
      />
    </div>
  );

  return (
    <PopoverComponent
      definition={
        <div className="flex min-w-[260px] flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Disponibilité
            </h2>
            {availability.map(renderRow)}
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Configuration
            </h2>
            {PLANNING_MARKERS.map(({ flag, Icon, label }) =>
              renderRow({
                name: flag,
                label,
                theme: "neutral",
                text: "text-muted-foreground",
                Icon,
              }),
            )}
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
