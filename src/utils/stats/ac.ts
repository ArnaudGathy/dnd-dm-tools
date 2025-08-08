import {
  Abilities,
  Armor,
  ArmorType,
  Character,
  Classes,
} from "@prisma/client";
import { getModifier } from "@/utils/utils";
import { ABILITY_NAME_MAP_TO_FR } from "@/constants/maps";

const getAcModifierByArmor = (character: Character, armor?: Armor) => {
  if (!armor) {
    if (character.className === Classes.BARBARIAN) {
      return {
        abilityACModifier:
          getModifier(character.constitution) +
          getModifier(character.dexterity),
        modifierName: `${ABILITY_NAME_MAP_TO_FR[Abilities.CONSTITUTION]} & ${ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY]}`,
      };
    }
    if (character.className === Classes.MONK) {
      return {
        abilityACModifier:
          getModifier(character.wisdom) + getModifier(character.dexterity),
        modifierName: `${ABILITY_NAME_MAP_TO_FR[Abilities.WISDOM]} & ${ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY]}`,
      };
    }
  }

  if (!armor || armor.type === ArmorType.LIGHT) {
    return {
      abilityACModifier: getModifier(character.dexterity),
      modifierName: ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY],
    };
  }

  if (armor.type === ArmorType.MEDIUM) {
    return {
      abilityACModifier: Math.min(2, getModifier(character.dexterity)),
      modifierName: ABILITY_NAME_MAP_TO_FR[Abilities.DEXTERITY],
    };
  }

  return { abilityACModifier: 0, modifierName: "Aucun" };
};

export const getTotalAC = (character: Character & { armors: Armor[] }) => {
  const equippedArmors = character.armors.filter(
    ({ isEquipped }) => isEquipped,
  );
  const equippedBodyArmor = equippedArmors.find(
    ({ type }) => type !== ArmorType.SHIELD,
  );
  const armorAC = !!equippedBodyArmor ? equippedBodyArmor.AC : 10;
  const armorName = !!equippedBodyArmor ? equippedBodyArmor.name : "Base";
  const { abilityACModifier, modifierName } = getAcModifierByArmor(
    character,
    equippedBodyArmor,
  );
  const equippedShield = equippedArmors.find(
    ({ type }) => type === ArmorType.SHIELD,
  );
  const shieldAc = !!equippedShield ? equippedShield.AC : 0;

  return {
    armorAC,
    armorName,
    abilityACModifier,
    modifierName,
    shieldAc,
    ACBonus: character.ACBonus,
    total: armorAC + abilityACModifier + shieldAc + character.ACBonus,
  };
};
