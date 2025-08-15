import { ABILITY_NAME_MAP_TO_FR } from "@/constants/maps";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Asterisk } from "lucide-react";
import { Weapon } from "@prisma/client";

export default function Name({ weapon }: { weapon: Weapon }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-lg font-bold">{weapon.name}</span>

      <div className="mt-1 flex items-center">
        <span className="text-sm text-muted-foreground">
          {ABILITY_NAME_MAP_TO_FR[weapon.abilityModifier]}
        </span>
        {weapon.isProficient && (
          <PopoverComponent definition="Arme maîtrisée">
            <Asterisk className="size-4 text-indigo-500" />
          </PopoverComponent>
        )}
      </div>
    </div>
  );
}
