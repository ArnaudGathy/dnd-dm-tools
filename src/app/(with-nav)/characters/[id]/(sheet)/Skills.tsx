import { CharacterById, cn } from "@/lib/utils";
import { entries } from "remeda";
import { PROFICIENCY_BONUS_BY_LEVEL, SKILL_NAME_MAP } from "@/constants/maps";
import SheetCard from "@/components/ui/SheetCard";
import { Asterisk, Crown } from "lucide-react";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { Skills as SkillList } from "@prisma/client";
import { addSignToNumber, getModifier } from "@/utils/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import SavingThrows from "@/app/(with-nav)/characters/[id]/(sheet)/(skills)/SavingThrows";
import { getSkillModifier } from "@/utils/stats/skills";

export default function Skills({ character }: { character: CharacterById }) {
  const abilities = {
    Charisme: character.charisma,
    Constitution: character.constitution,
    Dextérité: character.dexterity,
    Force: character.strength,
    Intelligence: character.intelligence,
    Sagesse: character.wisdom,
  };

  return (
    <div className="flex w-full flex-col gap-4 p-0 md:grid md:grid-flow-col md:grid-cols-[1fr_1fr_1fr_auto] md:grid-rows-[auto] md:p-4 2xl:w-[70%]">
      <SheetCard className="row-span-4 flex flex-col">
        <span className="mb-2 self-center text-2xl font-bold">Compétences</span>
        {entries(SKILL_NAME_MAP).map(([skill, skillName]) => {
          const selectedSkill = character.skills.find(
            (characterSkill) => characterSkill.skill === skill,
          );

          return (
            <div key={skill} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">{skillName}</span>
                {selectedSkill?.isProficient && !selectedSkill?.isExpert && (
                  <PopoverComponent definition="Compétence maîtrisée : bonus de maitrise appliqué">
                    <Asterisk className="size-4 text-indigo-500" />
                  </PopoverComponent>
                )}
                {selectedSkill?.isExpert && (
                  <PopoverComponent definition="Compétence expertisée : bonus de maitrise doublé">
                    <Crown className="size-4 text-primary" />
                  </PopoverComponent>
                )}
              </div>

              <div className="mx-1 flex h-3 w-full border-b border-dashed border-muted-foreground opacity-25" />
              <span
                className={cn("text-lg font-bold", {
                  "text-indigo-500": selectedSkill?.isProficient,
                  "text-primary": selectedSkill?.isExpert,
                })}
              >
                {addSignToNumber(getSkillModifier(character, skill))}
              </span>
            </div>
          );
        })}
      </SheetCard>

      <SheetCard className="row-span-2 flex flex-col">
        <span className="mb-2 self-center text-2xl font-bold">
          Caractéristiques
        </span>
        {entries(abilities).map(([name, value]) => {
          const modifier = getModifier(value);
          return (
            <div key={name} className="flex items-center justify-between">
              <span className="text-muted-foreground">{name}</span>
              <div className="mx-1 flex h-3 w-full border-b border-dashed border-muted-foreground opacity-25" />
              <span className="w-4 text-right text-lg font-bold">
                {addSignToNumber(modifier)}
              </span>
            </div>
          );
        })}
      </SheetCard>

      <SavingThrows character={character} className="row-span-2" />

      <SheetCard className="row-span-4 flex flex-col">
        <span className="mb-2 self-center text-2xl font-bold">Maîtrises</span>
        <div className="flex flex-col gap-1">
          {character.proficiencies.map((proficiency) => (
            <div key={proficiency}>{proficiency}</div>
          ))}
        </div>
      </SheetCard>

      <SheetSingleData
        label="Bonus de maîtrise"
        value={`+${PROFICIENCY_BONUS_BY_LEVEL[character.level]}`}
      />

      <SheetSingleData
        label="Perception passive"
        value={8 + getSkillModifier(character, SkillList.PERCEPTION)}
      />
    </div>
  );
}
