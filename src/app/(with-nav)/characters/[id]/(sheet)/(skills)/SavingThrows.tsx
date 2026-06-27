import { entries } from "remeda";
import { ABILITY_NAME_MAP, ABILITY_NAME_MAP_TO_FR } from "@/constants/maps";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Asterisk, ShieldCheck } from "lucide-react";
import { CharacterById, cn } from "@/lib/utils";
import { getSavingThrowModifier } from "@/utils/stats/skills";
import { addSignToNumber } from "@/utils/utils";
import { SectionPanel, StatLine } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function SavingThrows({
  className,
  character,
}: {
  className?: string;
  character: CharacterById;
}) {
  const savingThrows = {
    strength: "Force",
    dexterity: "Dextérité",
    constitution: "Constitution",
    intelligence: "Intelligence",
    wisdom: "Sagesse",
    charisma: "Charisme",
  };

  return (
    <SectionPanel accent="teal" icon={ShieldCheck} title="Sauvegardes" className={className}>
      {entries(savingThrows).map(([ability, displayName]) => {
        const selectedSavingThrow = character.savingThrows.find(
          ({ ability: abilityName }) => abilityName === ABILITY_NAME_MAP[ability],
        );
        const savingThrowDetails = getSavingThrowModifier(character, ability);

        return (
          <StatLine
            key={ability}
            label={
              <span className="flex items-center gap-1">
                {displayName}
                {selectedSavingThrow?.isProficient && (
                  <PopoverComponent definition="Sauvegarde maîtrisée : bonus de maitrise appliqué">
                    <Asterisk className="size-3.5 text-teal-400" />
                  </PopoverComponent>
                )}
              </span>
            }
            value={
              <PopoverComponent
                definition={
                  <div>
                    <span className="font-bold">
                      JdS de {ABILITY_NAME_MAP_TO_FR[ABILITY_NAME_MAP[ability]]}
                    </span>
                    <div>
                      <span>{`${displayName} : `}</span>
                      <span>{savingThrowDetails.abilityModifier}</span>
                    </div>
                    {savingThrowDetails.proficiencyModifier > 0 && (
                      <div>
                        <span>Bonus de maîtrise : </span>
                        <span>{savingThrowDetails.proficiencyModifier}</span>
                      </div>
                    )}
                    {savingThrowDetails.protectionRingModifier > 0 && (
                      <div>
                        <span>Anneau de protection : </span>
                        <span>{savingThrowDetails.protectionRingModifier}</span>
                      </div>
                    )}
                    {savingThrowDetails.bonusModifier > 0 && (
                      <div>
                        <span>Bonus (autres) : </span>
                        <span>{savingThrowDetails.bonusModifier}</span>
                      </div>
                    )}
                  </div>
                }
              >
                <span className={cn({ "text-teal-400": selectedSavingThrow?.isProficient })}>
                  {addSignToNumber(savingThrowDetails.total)}
                </span>
              </PopoverComponent>
            }
          />
        );
      })}
    </SectionPanel>
  );
}
