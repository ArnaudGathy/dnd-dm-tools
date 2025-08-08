import { Abilities, Character, Classes, Subclasses } from "@prisma/client";
import { getModifier } from "@/utils/utils";
import {
  ABILITY_NAME_MAP_TO_FR,
  PROFICIENCY_BONUS_BY_LEVEL,
} from "@/constants/maps";

export const getMartialClassDCModifier = (character: Character) => {
  if (
    character.className === Classes.FIGHTER &&
    character.subclassName === Subclasses.BATTLE_MASTER
  ) {
    const modifier = getModifier(character.strength);
    const name = ABILITY_NAME_MAP_TO_FR[Abilities.STRENGTH];
    return { modifier, name };
  }

  if (character.className === Classes.MONK) {
    const modifier = getModifier(character.wisdom);
    const name = ABILITY_NAME_MAP_TO_FR[Abilities.WISDOM];
    return { modifier, name };
  }

  if (character.className === Classes.ROGUE) {
    const modifier = getModifier(character.dexterity);
    const name = ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY];
    return { modifier, name };
  }
  throw new Error("Invalid class to compute martial DC");
};

export const getMartialClassDC = (character: Character) => {
  if (
    (character.className === Classes.FIGHTER &&
      character.subclassName === Subclasses.BATTLE_MASTER) ||
    character.className === Classes.MONK ||
    character.className === Classes.ROGUE
  ) {
    const base = 8;
    const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
    const { name, modifier } = getMartialClassDCModifier(character);

    return {
      base,
      proficiencyBonus,
      modifier,
      modifierName: name,
      total: base + proficiencyBonus + modifier,
    };
  }
  return null;
};
