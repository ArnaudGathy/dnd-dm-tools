import { Abilities, Character, Classes, Subclasses } from "@prisma/client";
import { getModifier } from "@/utils/utils";
import {
  ABILITY_NAME_MAP_TO_FR,
  MONK_MARTIAL_DICE_PER_LEVEL,
  PROFICIENCY_BONUS_BY_LEVEL,
  ROGUE_BACKSTAB_DICE_PER_LEVEL,
  ROGUE_SOULKNIFE_DICE_PER_LEVEL,
} from "@/constants/maps";
import { getSpellSaveDC } from "@/utils/stats/spells";

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

export const getSubMartialClassDCModifier = (character: Character) => {
  if (character.className === Classes.MONK) {
    const modifier = getModifier(character.dexterity);
    const name = ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY];
    return { modifier, name };
  }
  throw new Error("Invalid class to compute martial DC");
};

export const getSubMartialClassDC = (character: Character) => {
  if (character.className === Classes.MONK) {
    const base = 8;
    const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
    const { name, modifier } = getSubMartialClassDCModifier(character);

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

export const getSaveDC = (character: Character) => {
  const martialDC = getMartialClassDC(character);
  if (martialDC) {
    return martialDC.total;
  }
  return getSpellSaveDC(character).total;
};

export const getClassDice = (character: Character) => {
  if (character.className === Classes.MONK) {
    return {
      value: MONK_MARTIAL_DICE_PER_LEVEL[character.level],
      name: "Dé d'arts martiaux",
    };
  }
  if (character.className === Classes.ROGUE) {
    return {
      value: ROGUE_BACKSTAB_DICE_PER_LEVEL[character.level],
      name: "Dés d'attaque sournoise",
    };
  }
  return undefined;
};

export const getSubClassDice = (character: Character) => {
  if (character.className === Classes.ROGUE && character.subclassName === Subclasses.SOULKNIFE) {
    return {
      value: ROGUE_SOULKNIFE_DICE_PER_LEVEL[character.level],
      name: "Dés d'énergie d'âme acérée",
    };
  }
};
