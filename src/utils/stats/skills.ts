import { Character, Classes, SavingThrow, Skills } from "@prisma/client";
import {
  ABILITY_NAME_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILL_ABILITY_MAP,
} from "@/constants/maps";
import { addSignToNumber, getModifier } from "@/utils/utils";
import { AbilityNameType } from "@/types/types";
import { CharacterById } from "@/lib/utils";

export const getSkillSpecial = (
  character: CharacterById,
  skillName: Skills,
) => {
  if (
    character.className === Classes.DRUID &&
    character.capacities.some(({ name }) =>
      name.toLowerCase().includes("ordre primitif (mage)"),
    ) &&
    (skillName === Skills.ARCANA || skillName === Skills.NATURE)
  ) {
    return {
      skillSpecial: getModifier(character.wisdom),
      skillSpecialName: "Ordre primitif (mage)",
    };
  }
  return { skillSpecial: 0, skillSpecialName: undefined };
};

export const getSkillModifier = (
  character: CharacterById,
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
      : character.className === Classes.BARD && character.level >= 2
        ? Math.floor(proficiencyBonus / 2)
        : 0;
  const bonusModifier = selectedSkill?.modifier ?? 0;
  const abilityModifier = getModifier(character[SKILL_ABILITY_MAP[skillName]]);
  const { skillSpecial, skillSpecialName } = getSkillSpecial(
    character,
    skillName,
  );

  return {
    abilityModifier,
    proficiencyModifier,
    isProficient: selectedSkill?.isProficient,
    isExpert: selectedSkill?.isExpert,
    bonusModifier,
    skillSpecial,
    skillSpecialName,
    total: abilityModifier + proficiencyModifier + bonusModifier + skillSpecial,
  };
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

  return addSignToNumber(abilityModifier + proficiencyModifier + bonusModifier);
};
