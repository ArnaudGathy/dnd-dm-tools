import { Character, SavingThrow, Skill, Skills } from "@prisma/client";
import {
  ABILITY_NAME_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILL_ABILITY_MAP,
} from "@/constants/maps";
import { getModifier } from "@/utils/utils";
import { AbilityNameType } from "@/types/types";

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

export const getSavingThrowModifier = (
  character: Character & { savingThrows: SavingThrow[] },
  ability: AbilityNameType,
) => {
  const selectedSavingThrow = character.savingThrows.find(
    ({ ability: abilityName }) => abilityName === ABILITY_NAME_MAP[ability],
  );
  const proficiencyModifier = selectedSavingThrow?.isProficient
    ? PROFICIENCY_BONUS_BY_LEVEL[character.level]
    : 0;
  const bonusModifier = selectedSavingThrow?.modifier ?? 0;
  const abilityModifier = getModifier(character[ability]);

  return abilityModifier + proficiencyModifier + bonusModifier;
};
