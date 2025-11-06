import { entries } from "remeda";
import { ABILITY_NAME_MAP } from "@/constants/maps";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Asterisk } from "lucide-react";
import { CharacterById, cn } from "@/lib/utils";
import { getSavingThrowModifier } from "@/utils/stats/skills";
import SheetCard from "@/components/ui/SheetCard";

export default function SavingThrows({
  className,
  character,
}: {
  className?: string;
  character: CharacterById;
}) {
  const savingThrows = {
    charisma: "Charisme",
    constitution: "Constitution",
    dexterity: "Dextérité",
    strength: "Force",
    intelligence: "Intelligence",
    wisdom: "Sagesse",
  };

  return (
    <SheetCard className={cn("flex flex-col", className)}>
      <span className="mb-2 self-center text-2xl font-bold">Sauvegardes</span>
      {entries(savingThrows).map(([ability, displayName]) => {
        const selectedSavingThrow = character.savingThrows.find(
          ({ ability: abilityName }) => abilityName === ABILITY_NAME_MAP[ability],
        );
        return (
          <div key={ability} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>{displayName}</span>
              {selectedSavingThrow?.isProficient && (
                <PopoverComponent definition="Sauvegarde maîtrisée : bonus de maitrise appliqué">
                  <Asterisk className="size-4 text-indigo-500" />
                </PopoverComponent>
              )}
            </div>
            <div className="mx-1 flex h-3 w-full border-b border-dashed border-muted-foreground opacity-25" />
            <span
              className={cn("w-4 text-right text-lg font-bold", {
                "text-indigo-500": selectedSavingThrow?.isProficient,
              })}
            >
              {getSavingThrowModifier(character, ability)}
            </span>
          </div>
        );
      })}
    </SheetCard>
  );
}
