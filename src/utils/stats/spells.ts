import { Character, Classes } from "@prisma/client";
import {
  ABILITIES_MAP_TO_NAME,
  CLASS_SPELL_PROGRESSION_MAP,
  CLASS_SPELLS_PREPARED_PROGRESSION_MAP,
  CLASS_SPELLS_WHEN_TO_PREPARE_MAP,
  PROFICIENCY_BONUS_BY_LEVEL,
  SPELLCASTING_MODIFIER_MAP,
} from "@/constants/maps";
import { addSignToNumber, getModifier } from "@/utils/utils";
import { CharacterById, SpellsCreaturesCount } from "@/lib/utils";
import { AbilityNameType } from "@/types/types";

/** Ability a character casts with. The class always wins; `spellCastingAbility`
 *  only kicks in for classes without innate spellcasting, where the spells come
 *  from a species or a feat (e.g. a tiefling fighter casting with Sagesse). */
export const getSpellCastingStat = (
  character: Pick<Character, "className" | "spellCastingAbility">,
): AbilityNameType | null =>
  SPELLCASTING_MODIFIER_MAP[character.className] ??
  (character.spellCastingAbility ? ABILITIES_MAP_TO_NAME[character.spellCastingAbility] : null);

export const getSpellCastingModifier = (character: Character) => {
  const spellCastingStat = getSpellCastingStat(character);
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
  const spellCastingStat = getSpellCastingStat(character);
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

// A "prepared-from-list" class auto-shows its whole class spell list for the
// spell levels it can cast, and prepares from it: Cleric, Druid, Paladin,
// Ranger.
//
// Wizards are deliberately EXCLUDED: they also prepare daily (non-empty entry in
// CLASS_SPELLS_PREPARED_PROGRESSION_MAP, so they still get a prepared-per-day
// budget via getSpellsToPreparePerDay), but only from a limited known spellbook
// rather than the full class list. So they keep the manual-add behaviour of
// "known" classes — only spells they've added appear, and only those rituals
// count as free.
//
// "Known" classes (Bard, Sorcerer, Warlock) and non-casters have an empty entry
// and add spells manually without a prepared budget.
export const isPreparedListClass = (className: Classes) =>
  className !== Classes.WIZARD && CLASS_SPELLS_PREPARED_PROGRESSION_MAP[className].length > 0;

// Highest spell-slot level the character can currently cast, derived from the
// per-level slot progression. Used to bound the auto-listed class spell list.
// Returns 0 if the class has no slots at this level (e.g. non-casters).
export const getMaxCastableSpellLevel = (character: Pick<Character, "className" | "level">) => {
  const slots = CLASS_SPELL_PROGRESSION_MAP[character.className]?.[character.level - 1];
  if (!slots) {
    return 0;
  }
  const levels = Object.keys(slots).map(Number);
  return levels.length > 0 ? Math.max(...levels) : 0;
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
  spellCastingAbility,
  _count,
}: Pick<CharacterById, "className" | "spellCastingAbility"> & SpellsCreaturesCount) => {
  return !!getSpellCastingStat({ className, spellCastingAbility }) || _count.spellsOnCharacters > 0;
};
