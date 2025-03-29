import { Character, Skill, Skills } from "@prisma/client";
import {
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILL_ABILITY_MAP,
} from "@/constants/maps";
import { getModifier } from "@/utils/utils";

export const getSkillModifier = (
  character: Character & { skills: Skill[] },
  skillName: Skills,
) => {
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
  const selectedSkill = character.skills.find(
    ({ skill }) => skill === skillName,
  );
  const proficiencyModifier = selectedSkill?.isExpert
    ? proficiencyBonus * 2
    : selectedSkill?.isProficient
      ? proficiencyBonus
      : 0;
  const bonusModifier = selectedSkill?.modifier ?? 0;
  const abilityModifier = getModifier(character[SKILL_ABILITY_MAP[skillName]]);

  return abilityModifier + proficiencyModifier + bonusModifier;
};
