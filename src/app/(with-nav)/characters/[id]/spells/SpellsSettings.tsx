"use client";

import PopoverComponent from "@/components/ui/PopoverComponent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Settings } from "lucide-react";
import { updateSpellFlagAction } from "@/lib/actions/spells";

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
  return (
    <PopoverComponent
      definition={
        <div className="flex min-w-[200px] flex-col gap-2">
          <h1 className="text-lg font-bold">Configuration</h1>
          <div className="flex items-center gap-2">
            <Switch
              id="isPrepared"
              theme="sky"
              checked={isPrepared}
              onCheckedChange={async (checked) => {
                await updateSpellFlagAction({
                  characterId: characterId,
                  spellId: spellId,
                  flagName: "isPrepared",
                  newState: checked,
                });
              }}
            />
            <Label htmlFor="isPrepared" className="text-sm text-sky-500">
              Préparé
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isAlwaysPrepared"
              theme="amber"
              checked={isAlwaysPrepared}
              onCheckedChange={async (checked) => {
                await updateSpellFlagAction({
                  characterId: characterId,
                  spellId: spellId,
                  flagName: "isAlwaysPrepared",
                  newState: checked,
                });
              }}
            />
            <Label htmlFor="isAlwaysPrepared" className="text-sm text-amber-500">
              Toujours préparé
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="hasLongRestCast"
              theme="green"
              checked={hasLongRestCast}
              onCheckedChange={async (checked) => {
                await updateSpellFlagAction({
                  characterId: characterId,
                  spellId: spellId,
                  flagName: "hasLongRestCast",
                  newState: checked,
                });
              }}
            />
            <Label htmlFor="hasLongRestCast" className="text-sm text-green-500">
              Un lancement par long repos
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="canBeSwappedOnLongRest"
              theme="rose"
              checked={canBeSwappedOnLongRest}
              onCheckedChange={async (checked) => {
                await updateSpellFlagAction({
                  characterId: characterId,
                  spellId: spellId,
                  flagName: "canBeSwappedOnLongRest",
                  newState: checked,
                });
              }}
            />
            <Label htmlFor="canBeSwappedOnLongRest" className="text-sm text-rose-500">
              Changement lors d&apos;un long repos
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="canBeSwappedOnLevelUp"
              theme="purple"
              checked={canBeSwappedOnLevelUp}
              onCheckedChange={async (checked) => {
                await updateSpellFlagAction({
                  characterId: characterId,
                  spellId: spellId,
                  flagName: "canBeSwappedOnLevelUp",
                  newState: checked,
                });
              }}
            />
            <Label htmlFor="canBeSwappedOnLevelUp" className="text-sm text-purple-500">
              Changement lors d&apos;un lvl up
            </Label>
          </div>
        </div>
      }
    >
      <Settings className="size-5 stroke-[1.5px]" />
    </PopoverComponent>
  );
}
