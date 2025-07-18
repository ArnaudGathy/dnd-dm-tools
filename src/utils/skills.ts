import {
  Abilities,
  Armor,
  ArmorType,
  Capacity,
  Character,
  Classes,
  SavingThrow,
  Skill,
  Skills,
  Subclasses,
  Weapon,
  WeaponDamage,
} from "@prisma/client";
import {
  ABILITIES_MAP_TO_NAME,
  ABILITY_NAME_MAP,
  ABILITY_NAME_MAP_TO_FR,
  CLASS_SPELLS_PREPARED_PROGRESSION_MAP,
  CLASS_SPELLS_WHEN_TO_PREPARE_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  SKILL_ABILITY_MAP,
  SPEED_BY_RACE_MAP,
  SPELLCASTING_MODIFIER_MAP,
  WEAPON_DICE_MAP,
} from "@/constants/maps";
import {
  addSignToNumber,
  convertFeetDistanceIntoSquares,
  getModifier,
} from "@/utils/utils";
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
      : character.className === Classes.BARD && character.level >= 2
        ? Math.floor(proficiencyBonus / 2)
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

  return addSignToNumber(abilityModifier + proficiencyModifier + bonusModifier);
};

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

export const getSpellCastingModifier = (character: Character) => {
  const spellCastingStat = SPELLCASTING_MODIFIER_MAP[character.className];
  const spellCastingAbilityModifier = spellCastingStat
    ? getModifier(character[spellCastingStat])
    : 0;
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
  const magicAttackBonus = character.magicAttackBonus;

  return {
    spellCastingStat: spellCastingStat ?? "n/a",
    proficiencyBonus,
    spellCastingAbilityModifier,
    magicAttackBonus,
    total: addSignToNumber(
      spellCastingAbilityModifier +
        PROFICIENCY_BONUS_BY_LEVEL[character.level] +
        magicAttackBonus,
    ),
  };
};

export const getSpellSaveDC = (character: Character) => {
  const baseValue = 8;
  const spellCastingStat = SPELLCASTING_MODIFIER_MAP[character.className];
  const spellCastingAbilityModifier = spellCastingStat
    ? getModifier(character[spellCastingStat])
    : 0;
  const proficiencyBonus = PROFICIENCY_BONUS_BY_LEVEL[character.level];
  const magicDCBonus = character.magicDCBonus;

  return {
    baseValue,
    spellCastingStat: spellCastingStat ?? "n/a",
    proficiencyBonus,
    spellCastingAbilityModifier,
    magicDCBonus,
    total:
      baseValue +
      spellCastingAbilityModifier +
      PROFICIENCY_BONUS_BY_LEVEL[character.level] +
      magicDCBonus,
  };
};

export const getInitiativeModifier = (
  character: Character & { capacities: Capacity[] },
) => {
  const initiativeBonus = character.initiativeBonus;
  const dexterityModifier = getModifier(character.dexterity);

  const hasAlertFeat = !!character.capacities.find(
    ({ name }) =>
      name.toLowerCase().includes("vigilant") ||
      name.toLowerCase().includes("alert"),
  );
  const alertModifier = hasAlertFeat
    ? PROFICIENCY_BONUS_BY_LEVEL[character.level]
    : 0;

  return {
    initiativeBonus,
    dexterityModifier,
    alertModifier,
    total: addSignToNumber(initiativeBonus + dexterityModifier + alertModifier),
  };
};

export const getMovementSpeed = (character: Character) => {
  const raceSpeed = convertFeetDistanceIntoSquares(
    SPEED_BY_RACE_MAP[character.race],
  );
  const movementSpeedBonus = convertFeetDistanceIntoSquares(
    character.movementSpeedBonus,
  );

  return {
    raceSpeed,
    movementSpeedBonus,
    total: raceSpeed + movementSpeedBonus,
  };
};

const getWeaponAbilityModifier = (character: Character, weapon: Weapon) => {
  const modifierName = weapon.abilityModifier;
  const abilityModifier = getModifier(
    character[ABILITIES_MAP_TO_NAME[weapon.abilityModifier]],
  );
  return { abilityModifier, modifierName };
};

export const getWeaponAttackBonus = (character: Character, weapon: Weapon) => {
  const proficiencyBonus = weapon.isProficient
    ? PROFICIENCY_BONUS_BY_LEVEL[character.level]
    : 0;
  const attackBonus = weapon.attackBonus ?? 0;
  const { modifierName, abilityModifier } = getWeaponAbilityModifier(
    character,
    weapon,
  );

  return {
    proficiencyBonus,
    attackBonus,
    abilityModifier,
    modifierName,
    total: addSignToNumber(proficiencyBonus + abilityModifier + attackBonus),
  };
};

export const getWeaponDamage = (
  character: Character,
  damage: WeaponDamage,
  weapon: Weapon,
) => {
  const dices = `${damage.numberOfDices}${WEAPON_DICE_MAP[damage.dice]}`;
  const {
    modifierName: baseModifierName,
    abilityModifier: baseAbilityModifier,
  } = getWeaponAbilityModifier(character, weapon);
  const modifierName = damage.isBaseDamage ? baseModifierName : null;
  const abilityModifier = damage.isBaseDamage ? baseAbilityModifier : 0;
  const flatBonus = damage.flatBonus ?? 0;
  const damageBonus = flatBonus + abilityModifier;

  return {
    flatBonus,
    modifierName,
    abilityModifier,
    totalString: `${dices}${damageBonus >= 1 ? `+${damageBonus}` : damageBonus < 0 ? damageBonus : ""}`,
  };
};

export const getSpellsToPreparePerDay = (character: Character) => {
  const spellsByLevel =
    CLASS_SPELLS_PREPARED_PROGRESSION_MAP[character.className];
  const preparationInfo = CLASS_SPELLS_WHEN_TO_PREPARE_MAP[character.className];

  if (spellsByLevel.length === 0 || preparationInfo === null) {
    return null;
  }

  return { total: spellsByLevel[character.level - 1], ...preparationInfo };
};

const getMartialClassDCModifier = (character: Character) => {
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

export const getBonusHP = (
  capacities: { name: Capacity["name"] }[],
  level: number,
) => {
  if (
    capacities.find(
      ({ name }) =>
        name.toLowerCase().includes("tough") ||
        name.toLowerCase().includes("robuste"),
    )
  ) {
    return level * 2;
  }
};
