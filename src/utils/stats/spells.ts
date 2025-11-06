import { Character } from "@prisma/client";
import {
  CLASS_SPELLS_PREPARED_PROGRESSION_MAP,
  CLASS_SPELLS_WHEN_TO_PREPARE_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  SPELLCASTING_MODIFIER_MAP,
} from "@/constants/maps";
import { addSignToNumber, getModifier } from "@/utils/utils";
import { CharacterById, SpellsCreaturesCount } from "@/lib/utils";

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
      spellCastingAbilityModifier + PROFICIENCY_BONUS_BY_LEVEL[character.level] + magicAttackBonus,
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

export const getSpellsToPreparePerDay = (character: Character) => {
  const spellsByLevel = CLASS_SPELLS_PREPARED_PROGRESSION_MAP[character.className];
  const preparationInfo = CLASS_SPELLS_WHEN_TO_PREPARE_MAP[character.className];

  if (spellsByLevel.length === 0 || preparationInfo === null) {
    return null;
  }

  return { total: spellsByLevel[character.level - 1], ...preparationInfo };
};

export const getHasSpells = ({
  className,
  _count,
}: { className: CharacterById["className"] } & SpellsCreaturesCount) => {
  return !!SPELLCASTING_MODIFIER_MAP[className] || _count.spellsOnCharacters > 0;
};
