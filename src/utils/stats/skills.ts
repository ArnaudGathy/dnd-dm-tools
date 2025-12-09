import {
  Capacity,
  Character,
  Classes,
  InventoryItem,
  SavingThrow,
  Skill,
  Skills,
} from "@prisma/client";
import { ABILITY_NAME_MAP, PROFICIENCY_BONUS_BY_LEVEL, SKILL_ABILITY_MAP } from "@/constants/maps";
import { getModifier } from "@/utils/utils";
import { AbilityNameType } from "@/types/types";

export const getSkillSpecial = (
  character: Character & { capacities: Capacity[] },
  skillName: Skills,
) => {
  if (
    character.className === Classes.DRUID &&
    character.capacities.some(({ name }) => name.toLowerCase().includes("ordre primitif (mage)")) &&
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
  character: Character & { skills: Skill[]; capacities: Capacity[] },
  skillName: Skills,
) => {
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
  const selectedSkill = character.skills.find(({ skill }) => skill === skillName);
  const proficiencyModifier = selectedSkill?.isExpert
    ? proficiencyBonus * 2
    : selectedSkill?.isProficient
      ? proficiencyBonus
      : character.className === Classes.BARD && character.level >= 2
        ? Math.floor(proficiencyBonus / 2)
        : 0;
  const bonusModifier = selectedSkill?.modifier ?? 0;
  const abilityModifier = getModifier(character[SKILL_ABILITY_MAP[skillName]]);
  const { skillSpecial, skillSpecialName } = getSkillSpecial(character, skillName);

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

export const getPassivePerception = (
  character: Character & { skills: Skill[]; capacities: Capacity[] },
) => {
  return 8 + getSkillModifier(character, Skills.PERCEPTION).total;
};

export const getSavingThrowModifier = (
  character: Character & { savingThrows: SavingThrow[]; inventory: InventoryItem[] },
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
  const protectionRingModifier = character.inventory.find(({ name }) =>
    name.toLowerCase().includes("anneau de protection"),
  )
    ? 1
    : 0;

  return {
    proficiencyModifier,
    bonusModifier,
    abilityModifier,
    protectionRingModifier,
    total: abilityModifier + proficiencyModifier + bonusModifier + protectionRingModifier,
  };
};
