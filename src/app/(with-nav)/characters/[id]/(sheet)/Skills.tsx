import { CharacterById, cn } from "@/lib/utils";
import { entries } from "remeda";
import { PROFICIENCY_BONUS_BY_LEVEL, SKILL_ABILITY_MAP, SKILL_NAME_MAP } from "@/constants/maps";
import { Asterisk, Award, Crown, Eye, ListChecks, ScrollText, Sparkles } from "lucide-react";
import { addSignToNumber, getModifier, shortenAbilityName } from "@/utils/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import SavingThrows from "@/app/(with-nav)/characters/[id]/(sheet)/(skills)/SavingThrows";
import { getPassivePerception, getSkillModifier } from "@/utils/stats/skills";
import { SectionPanel, StatLine, StatTile } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function Skills({ character }: { character: CharacterById }) {
  const abilities = {
    Force: character.strength,
    Dextérité: character.dexterity,
    Constitution: character.constitution,
    Intelligence: character.intelligence,
    Sagesse: character.wisdom,
    Charisme: character.charisma,
  };

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:grid-cols-4 md:items-start md:p-4 2xl:w-[85%]">
      <SectionPanel accent="indigo" icon={ListChecks} title="Compétences">
        {entries(SKILL_NAME_MAP).map(([skill, skillName]) => {
          const selectedSkill = character.skills.find(
            (characterSkill) => characterSkill.skill === skill,
          );
          const skillAbilityName = shortenAbilityName(SKILL_ABILITY_MAP[skill]);
          const skillDetails = getSkillModifier(character, skill);

          return (
            <StatLine
              key={skill}
              label={
                <span className="flex items-center gap-1 truncate">
                  <span className="truncate">{skillName}</span>
                  <span className="text-tiny uppercase text-muted-foreground">
                    {skillAbilityName}
                  </span>
                  {selectedSkill?.isProficient && !selectedSkill?.isExpert && (
                    <PopoverComponent definition="Compétence maîtrisée : bonus de maitrise appliqué">
                      <Asterisk className="size-3.5 text-indigo-400" />
                    </PopoverComponent>
                  )}
                  {selectedSkill?.isExpert && (
                    <PopoverComponent definition="Compétence expertisée : bonus de maitrise doublé">
                      <Crown className="size-3.5 text-primary" />
                    </PopoverComponent>
                  )}
                </span>
              }
              value={
                <PopoverComponent
                  definition={
                    <div>
                      <span className="font-bold">Bonus de {skillName}</span>
                      <div>
                        <span>Caractéristique ({skillAbilityName}) : </span>
                        <span>{skillDetails.abilityModifier}</span>
                      </div>
                      {skillDetails.proficiencyModifier > 0 && (
                        <div>
                          <span>{skillDetails.isExpert ? "Expertise : " : "Maîtrise : "}</span>
                          <span>{skillDetails.proficiencyModifier}</span>
                        </div>
                      )}
                      {skillDetails.skillSpecial > 0 && skillDetails.skillSpecialName && (
                        <div>
                          <span>{`${skillDetails.skillSpecialName} : `}</span>
                          <span>{skillDetails.skillSpecial}</span>
                        </div>
                      )}
                      {skillDetails.bonusModifier > 0 && (
                        <div>
                          <span>{"Bonus (autres) : "}</span>
                          <span>{skillDetails.bonusModifier}</span>
                        </div>
                      )}
                    </div>
                  }
                >
                  <span
                    className={cn({
                      "text-indigo-400": selectedSkill?.isProficient,
                      "text-primary": selectedSkill?.isExpert,
                    })}
                  >
                    {addSignToNumber(skillDetails.total)}
                  </span>
                </PopoverComponent>
              }
            />
          );
        })}
      </SectionPanel>

      <div className="flex flex-col gap-4">
        <SectionPanel accent="violet" icon={Sparkles} title="Caractéristiques">
          {entries(abilities).map(([name, value]) => (
            <StatLine key={name} label={name} value={addSignToNumber(getModifier(value))} />
          ))}
        </SectionPanel>

        <SavingThrows character={character} />
      </div>

      <SectionPanel accent="slate" icon={ScrollText} title="Maîtrises">
        {character.proficiencies.map((proficiency) => (
          <div key={proficiency} className="text-sm leading-snug">
            {proficiency}
          </div>
        ))}
      </SectionPanel>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
        <StatTile
          icon={Award}
          accent="indigo"
          value={`+${PROFICIENCY_BONUS_BY_LEVEL[character.level]}`}
          label="Bonus de maîtrise"
          className="border border-border bg-card py-4"
        />
        <StatTile
          icon={Eye}
          accent="indigo"
          value={getPassivePerception(character)}
          label="Perception passive"
          className="border border-border bg-card py-4"
        />
      </div>
    </div>
  );
}
