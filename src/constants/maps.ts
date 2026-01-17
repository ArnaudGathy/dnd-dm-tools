import {
  Abilities,
  Alignment,
  AmmunitionType,
  ArmorType,
  Backgrounds,
  CampaignId,
  CharacterStatus,
  Classes,
  MoneyType,
  MagicItemRarity,
  PartyId,
  Races,
  Skills,
  Subclasses,
  WeaponDamageDices,
  WeaponDamageType,
  WeaponType,
} from "@prisma/client";
import { AbilityNameType } from "@/types/types";

export const CLASS_MAP = {
  [Classes.ARTIFICER]: "Artificier",
  [Classes.BARBARIAN]: "Barbare",
  [Classes.BARD]: "Barde",
  [Classes.CLERIC]: "Clerc",
  [Classes.DRUID]: "Druide",
  [Classes.SORCERER]: "Ensorceleur",
  [Classes.FIGHTER]: "Guerrier",
  [Classes.WIZARD]: "Magicien",
  [Classes.MONK]: "Moine",
  [Classes.WARLOCK]: "Occultiste",
  [Classes.PALADIN]: "Paladin",
  [Classes.RANGER]: "Rôdeur",
  [Classes.ROGUE]: "Roublard",
};

export const HIT_DICE_MAP = {
  [Classes.ARTIFICER]: "d8",
  [Classes.BARBARIAN]: "d12",
  [Classes.BARD]: "d8",
  [Classes.CLERIC]: "d8",
  [Classes.DRUID]: "d8",
  [Classes.FIGHTER]: "d10",
  [Classes.MONK]: "d8",
  [Classes.PALADIN]: "d10",
  [Classes.RANGER]: "d10",
  [Classes.ROGUE]: "d8",
  [Classes.SORCERER]: "d6",
  [Classes.WARLOCK]: "d8",
  [Classes.WIZARD]: "d6",
};

export const LEVEL_UP_HP_MAP = {
  [Classes.SORCERER]: 4,
  [Classes.WIZARD]: 4,
  [Classes.ARTIFICER]: 5,
  [Classes.BARD]: 5,
  [Classes.CLERIC]: 5,
  [Classes.DRUID]: 5,
  [Classes.MONK]: 5,
  [Classes.ROGUE]: 5,
  [Classes.WARLOCK]: 5,
  [Classes.FIGHTER]: 6,
  [Classes.PALADIN]: 6,
  [Classes.RANGER]: 6,
  [Classes.BARBARIAN]: 7,
};

export const BASE_HP_PER_CLASS_MAP = {
  [Classes.ARTIFICER]: 8,
  [Classes.BARBARIAN]: 12,
  [Classes.BARD]: 8,
  [Classes.CLERIC]: 8,
  [Classes.DRUID]: 8,
  [Classes.FIGHTER]: 10,
  [Classes.MONK]: 8,
  [Classes.PALADIN]: 10,
  [Classes.RANGER]: 10,
  [Classes.ROGUE]: 8,
  [Classes.SORCERER]: 6,
  [Classes.WARLOCK]: 8,
  [Classes.WIZARD]: 6,
};

export const SPELLCASTING_MODIFIER_MAP: {
  [key in Classes]: AbilityNameType | null;
} = {
  [Classes.ARTIFICER]: "intelligence",
  [Classes.BARD]: "charisma",
  [Classes.CLERIC]: "wisdom",
  [Classes.DRUID]: "wisdom",
  [Classes.PALADIN]: "charisma",
  [Classes.RANGER]: "wisdom",
  [Classes.SORCERER]: "charisma",
  [Classes.WARLOCK]: "charisma",
  [Classes.WIZARD]: "intelligence",
  [Classes.BARBARIAN]: null,
  [Classes.FIGHTER]: null,
  [Classes.MONK]: null,
  [Classes.ROGUE]: null,
};

export const SUBCLASS_MAP = {
  // Artificier
  [Subclasses.ALCHEMIST]: "Alchimiste",
  [Subclasses.ARTILLERIST]: "Artilleur",
  [Subclasses.BATTLE_SMITH]: "Forgeron de bataille",
  [Subclasses.ARMORER]: "Porteguerre",

  // Barbare
  [Subclasses.PATH_OF_THE_BERSERKER]: "Voie du Berserker",
  [Subclasses.PATH_OF_THE_WILD_HEART]: "Voie du Coeur sauvage",
  [Subclasses.PATH_OF_THE_WORLD_TREE]: "Voie de l'Arbre-Monde",
  [Subclasses.PATH_OF_THE_ZEALOT]: "Voie du Zélateur",

  // Barde
  [Subclasses.COLLEGE_OF_DANCE]: "Collège de la danse",
  [Subclasses.COLLEGE_OF_LORE]: "Collège du Savoir",
  [Subclasses.COLLEGE_OF_GLAMOUR]: "Collège de la séduction",
  [Subclasses.COLLEGE_OF_VALOR]: "Collège de la Vaillance",

  // Clerc
  [Subclasses.LIFE_DOMAIN]: "Domaine de la Vie",
  [Subclasses.LIGHT_DOMAIN]: "Domaine de la Lumière",
  [Subclasses.TRICKERY_DOMAIN]: "Domaine de la Ruse",
  [Subclasses.WAR_DOMAIN]: "Domaine de la Guerre",

  // Druide
  [Subclasses.CIRCLE_OF_THE_LAND]: "Cercle de la Terre",
  [Subclasses.CIRCLE_OF_THE_MOON]: "Cercle de la Lune",
  [Subclasses.CIRCLE_OF_THE_SEA]: "Cercle des Mers",
  [Subclasses.CIRCLE_OF_THE_STARS]: "Cercle des Astres",

  // Guerrier
  [Subclasses.CHAMPION]: "Champion",
  [Subclasses.ELDRITCH_KNIGHT]: "Chevalier occulte",
  [Subclasses.BATTLE_MASTER]: "Maître de guerre",
  [Subclasses.PSI_WARRIOR]: "Soldat Psi",

  // Moine
  [Subclasses.WAY_OF_THE_OPEN_HAND]: "Credo de la Paume",
  [Subclasses.WAY_OF_MERCY]: "Credo de la Miséricorde",
  [Subclasses.WAY_OF_SHADOW]: "Credo de l’Ombre",
  [Subclasses.WAY_OF_THE_ELEMENTS]: "Credo des éléments",

  // Paladin
  [Subclasses.OATH_OF_THE_ANCIENTS]: "Serment des Anciens",
  [Subclasses.OATH_OF_DEVOTION]: "Serment de Dévotion",
  [Subclasses.OATH_OF_GLORY]: "Serment de Gloire",
  [Subclasses.OATH_OF_VENGEANCE]: "Serment de Vengeance",

  // Rôdeur
  [Subclasses.BEAST_MASTER]: "Belluaire",
  [Subclasses.HUNTER]: "Chasseur",
  [Subclasses.FEY_WANDERER]: "Vagabond féerique",
  [Subclasses.GLOOM_STALKER]: "Traqueur des Ténèbres",

  // Roublard
  [Subclasses.ARCANE_TRICKSTER]: "Arnaqueur arcanique",
  [Subclasses.ASSASSIN]: "Assassin",
  [Subclasses.SOULKNIFE]: "Âme acérée",
  [Subclasses.THIEF]: "Voleur",

  // Ensorceleur
  [Subclasses.CLOCKWORK]: "Sorcellerie mécanique",
  [Subclasses.DRACONIC]: "Sorcellerie draconique",
  [Subclasses.ABERRANT]: "Sorcellerie aberrante",
  [Subclasses.WILD_MAGIC]: "Sorcellerie sauvage",

  // Ocultiste
  [Subclasses.THE_ARCHFEY]: "Protecteur Archifée",
  [Subclasses.THE_GREAT_OLD_ONE]: "Protecteur Grand Ancien",
  [Subclasses.THE_FIEND]: "Protecteur Fiélon",
  [Subclasses.THE_CELESTIAL]: "Protecteur Céleste",

  // Mage
  [Subclasses.SCHOOL_OF_ABJURATION]: "Abjurateur",
  [Subclasses.SCHOOL_OF_DIVINATION]: "Devin",
  [Subclasses.SCHOOL_OF_EVOCATION]: "Évocateur",
  [Subclasses.SCHOOL_OF_ILLUSION]: "Illustioniste",
};

export const SUBCLASSES_BY_CLASS: Record<Classes, Subclasses[]> = {
  [Classes.ARTIFICER]: [
    Subclasses.ALCHEMIST,
    Subclasses.ARMORER,
    Subclasses.ARTILLERIST,
    Subclasses.BATTLE_SMITH,
  ],
  [Classes.BARBARIAN]: [
    Subclasses.PATH_OF_THE_BERSERKER,
    Subclasses.PATH_OF_THE_WILD_HEART,
    Subclasses.PATH_OF_THE_ZEALOT,
    Subclasses.PATH_OF_THE_WORLD_TREE,
  ],
  [Classes.BARD]: [
    Subclasses.COLLEGE_OF_VALOR,
    Subclasses.COLLEGE_OF_LORE,
    Subclasses.COLLEGE_OF_GLAMOUR,
    Subclasses.COLLEGE_OF_DANCE,
  ],
  [Classes.CLERIC]: [
    Subclasses.LIFE_DOMAIN,
    Subclasses.LIGHT_DOMAIN,
    Subclasses.WAR_DOMAIN,
    Subclasses.TRICKERY_DOMAIN,
  ],
  [Classes.DRUID]: [
    Subclasses.CIRCLE_OF_THE_LAND,
    Subclasses.CIRCLE_OF_THE_MOON,
    Subclasses.CIRCLE_OF_THE_SEA,
    Subclasses.CIRCLE_OF_THE_STARS,
  ],
  [Classes.FIGHTER]: [
    Subclasses.CHAMPION,
    Subclasses.BATTLE_MASTER,
    Subclasses.ELDRITCH_KNIGHT,
    Subclasses.PSI_WARRIOR,
  ],
  [Classes.MONK]: [
    Subclasses.WAY_OF_THE_OPEN_HAND,
    Subclasses.WAY_OF_SHADOW,
    Subclasses.WAY_OF_THE_ELEMENTS,
    Subclasses.WAY_OF_MERCY,
  ],
  [Classes.PALADIN]: [
    Subclasses.OATH_OF_DEVOTION,
    Subclasses.OATH_OF_THE_ANCIENTS,
    Subclasses.OATH_OF_VENGEANCE,
    Subclasses.OATH_OF_GLORY,
  ],
  [Classes.RANGER]: [
    Subclasses.HUNTER,
    Subclasses.BEAST_MASTER,
    Subclasses.GLOOM_STALKER,
    Subclasses.FEY_WANDERER,
  ],
  [Classes.ROGUE]: [
    Subclasses.THIEF,
    Subclasses.ASSASSIN,
    Subclasses.ARCANE_TRICKSTER,
    Subclasses.SOULKNIFE,
  ],
  [Classes.SORCERER]: [
    Subclasses.DRACONIC,
    Subclasses.WILD_MAGIC,
    Subclasses.CLOCKWORK,
    Subclasses.ABERRANT,
  ],
  [Classes.WARLOCK]: [
    Subclasses.THE_ARCHFEY,
    Subclasses.THE_FIEND,
    Subclasses.THE_GREAT_OLD_ONE,
    Subclasses.THE_CELESTIAL,
  ],
  [Classes.WIZARD]: [
    Subclasses.SCHOOL_OF_EVOCATION,
    Subclasses.SCHOOL_OF_ABJURATION,
    Subclasses.SCHOOL_OF_ILLUSION,
    Subclasses.SCHOOL_OF_DIVINATION,
  ],
};

export const RACE_MAP = {
  [Races.AASIMAR]: "Aasimar",
  [Races.ELF]: "Elfe",
  [Races.GNOME]: "Gnome",
  [Races.GOLIATH]: "Goliath",
  [Races.HALFLING]: "Halfelin",
  [Races.HUMAN]: "Humain",
  [Races.DWARF]: "Nain",
  [Races.ORC]: "Orc",
  [Races.DRAGONBORN]: "Drakéide",
  [Races.TABAXI]: "Tabaxi",
  [Races.TIEFLING]: "Tiefelin",
};

export const SPEED_BY_RACE_MAP = {
  [Races.AASIMAR]: 30,
  [Races.DRAGONBORN]: 30,
  [Races.DWARF]: 25,
  [Races.ELF]: 30,
  [Races.GNOME]: 25,
  [Races.GOLIATH]: 35,
  [Races.HALFLING]: 25,
  [Races.HUMAN]: 30,
  [Races.ORC]: 30,
  [Races.TIEFLING]: 30,
  [Races.TABAXI]: 30,
};

export const MONK_SPEED_IN_SQUARE: Record<number, number> = {
  1: 0,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
  11: 4,
  12: 4,
  13: 4,
  14: 5,
  15: 5,
  16: 5,
  17: 5,
  18: 6,
  19: 6,
  20: 6,
};

export const ROGUE_SOULKNIFE_PSI_DICES_PER_LEVEL: Record<number, number> = {
  1: 0,
  2: 0,
  3: 4,
  4: 4,
  5: 6,
  6: 6,
  7: 6,
  8: 6,
  9: 8,
  10: 8,
  11: 8,
  12: 8,
  13: 10,
  14: 10,
  15: 10,
  16: 10,
  17: 12,
  18: 12,
  19: 12,
  20: 12,
};

export const RANGER_HUNTERS_MARK_PER_LEVEL: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export const CLERIC_CHANNEL_DIVINITY_PER_LEVEL: Record<number, number> = {
  1: 0,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
  17: 3,
  18: 4,
  19: 4,
  20: 4,
};

export const DRUID_WILD_SHAPE_PER_LEVEL: Record<number, number> = {
  1: 0,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
  17: 4,
  18: 4,
  19: 4,
  20: 4,
};

export const MONK_MARTIAL_DICE_PER_LEVEL: Record<number, string> = {
  1: "1d6",
  2: "1d6",
  3: "1d6",
  4: "1d6",
  5: "1d8",
  6: "1d8",
  7: "1d8",
  8: "1d8",
  9: "1d8",
  10: "1d8",
  11: "1d10",
  12: "1d10",
  13: "1d10",
  14: "1d10",
  15: "1d10",
  16: "1d10",
  17: "1d12",
  18: "1d12",
  19: "1d12",
  20: "1d12",
};

export const ROGUE_BACKSTAB_DICE_PER_LEVEL: Record<number, string> = {
  1: "1d6",
  2: "1d6",
  3: "2d6",
  4: "2d6",
  5: "3d6",
  6: "3d6",
  7: "4d6",
  8: "4d6",
  9: "5d6",
  10: "5d6",
  11: "6d6",
  12: "6d6",
  13: "7d6",
  14: "7d6",
  15: "8d6",
  16: "8d6",
  17: "9d6",
  18: "9d6",
  19: "10d6",
  20: "10d6",
};

export const ROGUE_SOULKNIFE_DICE_PER_LEVEL: Record<number, string | undefined> = {
  1: undefined,
  2: undefined,
  3: "4d6",
  4: "4d6",
  5: "6d8",
  6: "6d8",
  7: "6d8",
  8: "6d8",
  9: "8d8",
  10: "8d8",
  11: "8d10",
  12: "8d10",
  13: "10d10",
  14: "10d10",
  15: "10d10",
  16: "10d10",
  17: "12d12",
  18: "12d12",
  19: "12d12",
  20: "12d12",
};

export const SIZE_BY_RACE_MAP = {
  [Races.AASIMAR]: "M", // Moyen
  [Races.DRAGONBORN]: "M", // Moyen
  [Races.DWARF]: "M", // Moyen (petit gabarit mais catégorie "M")
  [Races.ELF]: "M", // Moyen
  [Races.GNOME]: "P", // Petit
  [Races.GOLIATH]: "M", // Moyen (grand gabarit mais reste "M")
  [Races.HALFLING]: "P", // Petit
  [Races.HUMAN]: "M", // Moyen
  [Races.ORC]: "M", // Moyen
  [Races.TIEFLING]: "M", // Moyen
  [Races.TABAXI]: "M", // Moyen
};

export const BACKGROUND_MAP = {
  [Backgrounds.ACOLYTE]: "Acolyte",
  [Backgrounds.ANTHROPOLOGIST]: "Anthropologue",
  [Backgrounds.ARCHEOLOGIST]: "Archéologue",
  [Backgrounds.ARTISAN]: "Artisan",
  [Backgrounds.ENTERTAINER]: "Artiste",
  [Backgrounds.CHARLATAN]: "Charlatan",
  [Backgrounds.CRIMINAL]: "Criminel",
  [Backgrounds.HERMIT]: "Ermite",
  [Backgrounds.FARMER]: "Fermier",
  [Backgrounds.GUARD]: "Garde",
  [Backgrounds.GUIDE]: "Guide",
  [Backgrounds.MERCHANT]: "Marchand",
  [Backgrounds.SAILOR]: "Marin",
  [Backgrounds.NOBLE]: "Noble",
  [Backgrounds.SAGE]: "Sage",
  [Backgrounds.SCRIBE]: "Scribe",
  [Backgrounds.SOLDIER]: "Soldat",
  [Backgrounds.WAYFARER]: "Voyageur",
};

export const ALIGNMENT_MAP = {
  [Alignment.LAWFUL_GOOD]: "Loyal Bon",
  [Alignment.NEUTRAL_GOOD]: "Neutre Bon",
  [Alignment.CHAOTIC_GOOD]: "Chaotique Bon",
  [Alignment.LAWFUL_NEUTRAL]: "Loyal Neutre",
  [Alignment.NEUTRAL]: "Neutre",
  [Alignment.CHAOTIC_NEUTRAL]: "Chaotique Neutre",
  [Alignment.LAWFUL_EVIL]: "Loyal Mauvais",
  [Alignment.NEUTRAL_EVIL]: "Neutre Mauvais",
  [Alignment.CHAOTIC_EVIL]: "Chaotique Mauvais",
};

export const CAMPAIGN_MAP = {
  [CampaignId.PHANDELVER]: "Les tréfonds de Phancreux",
  [CampaignId.DRAGONS]: "Les dragons de l'île aux tempêtes",
  [CampaignId.TOMB]: "La tombe de l'annihilation",
  [CampaignId.NETHERDEEP]: "Call of the Netherdeep",
};

export const PARTY_MAP = {
  [PartyId.MIFA]: "La mifa",
  [PartyId.PAINTERS]: "Les peintres",
  [PartyId.ANTHONY]: "Le groupe d'Anthony",
};

export const CHARACTER_STATUS_MAP = {
  [CharacterStatus.DEAD]: "Mort",
  [CharacterStatus.ACTIVE]: "Actif",
  [CharacterStatus.RETIRED]: "Retraité",
  [CharacterStatus.BACKUP]: "Backup",
};

export const ABILITIES_MAP = {
  dexterity: "Dextérité",
  constitution: "Constitution",
  strength: "Force",
  intelligence: "Intelligence",
  wisdom: "Sagesse",
  charisma: "Charisme",
};

export const ABILITY_NAME_MAP: { [key in AbilityNameType]: Abilities } = {
  strength: Abilities.STRENGTH,
  dexterity: Abilities.DEXTERITY,
  constitution: Abilities.CONSTITUTION,
  intelligence: Abilities.INTELLIGENCE,
  wisdom: Abilities.WISDOM,
  charisma: Abilities.CHARISMA,
};

export const ABILITIES_MAP_TO_NAME: { [key in Abilities]: AbilityNameType } = {
  [Abilities.STRENGTH]: "strength",
  [Abilities.DEXTERITY]: "dexterity",
  [Abilities.CONSTITUTION]: "constitution",
  [Abilities.INTELLIGENCE]: "intelligence",
  [Abilities.WISDOM]: "wisdom",
  [Abilities.CHARISMA]: "charisma",
};

export const ABILITY_NAME_MAP_TO_FR: { [key in Abilities]: string } = {
  [Abilities.STRENGTH]: "FOR",
  [Abilities.DEXTERITY]: "DEX",
  [Abilities.CONSTITUTION]: "CON",
  [Abilities.INTELLIGENCE]: "INT",
  [Abilities.WISDOM]: "SAG",
  [Abilities.CHARISMA]: "CHA",
};

export const SKILL_ABILITY_MAP: { [key in Skills]: AbilityNameType } = {
  [Skills.ATHLETICS]: "strength",

  [Skills.ACROBATICS]: "dexterity",
  [Skills.SLEIGHT_OF_HAND]: "dexterity",
  [Skills.STEALTH]: "dexterity",

  [Skills.ARCANA]: "intelligence",
  [Skills.HISTORY]: "intelligence",
  [Skills.INVESTIGATION]: "intelligence",
  [Skills.NATURE]: "intelligence",
  [Skills.RELIGION]: "intelligence",

  [Skills.ANIMAL_HANDLING]: "wisdom",
  [Skills.INSIGHT]: "wisdom",
  [Skills.MEDICINE]: "wisdom",
  [Skills.PERCEPTION]: "wisdom",
  [Skills.SURVIVAL]: "wisdom",

  [Skills.DECEPTION]: "charisma",
  [Skills.INTIMIDATION]: "charisma",
  [Skills.PERFORMANCE]: "charisma",
  [Skills.PERSUASION]: "charisma",
};

export const SKILL_NAME_MAP: { [key in Skills]: string } = {
  [Skills.ACROBATICS]: "Acrobatie",
  [Skills.ARCANA]: "Arcanes",
  [Skills.ATHLETICS]: "Athlétisme",
  [Skills.STEALTH]: "Discrétion",
  [Skills.ANIMAL_HANDLING]: "Dressage",
  [Skills.SLEIGHT_OF_HAND]: "Escamotage",
  [Skills.HISTORY]: "Histoire",
  [Skills.INTIMIDATION]: "Intimidation",
  [Skills.INVESTIGATION]: "Investigation",
  [Skills.MEDICINE]: "Médecine",
  [Skills.NATURE]: "Nature",
  [Skills.PERCEPTION]: "Perception",
  [Skills.INSIGHT]: "Perspicacité",
  [Skills.PERSUASION]: "Persuasion",
  [Skills.RELIGION]: "Religion",
  [Skills.PERFORMANCE]: "Représentation",
  [Skills.SURVIVAL]: "Survie",
  [Skills.DECEPTION]: "Tromperie",
};

export const PROFICIENCY_BONUS_BY_LEVEL: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export const WEAPON_DICE_MAP = {
  [WeaponDamageDices.D4]: "d4",
  [WeaponDamageDices.D6]: "d6",
  [WeaponDamageDices.D8]: "d8",
  [WeaponDamageDices.D10]: "d10",
  [WeaponDamageDices.D12]: "d12",
};

export const WEAPON_DAMAGE_TYPE_MAP_SENTENCE: {
  [key in WeaponDamageType]: string;
} = {
  [WeaponDamageType.BLUDGEONING]: "contondants",
  [WeaponDamageType.SLASHING]: "tranchants",
  [WeaponDamageType.PIERCING]: "perforants",
  [WeaponDamageType.ACID]: "d'acide",
  [WeaponDamageType.COLD]: "de froid",
  [WeaponDamageType.FIRE]: "de feu",
  [WeaponDamageType.FORCE]: "de force",
  [WeaponDamageType.LIGHTNING]: "de foudre",
  [WeaponDamageType.NECROTIC]: "nécrotiques",
  [WeaponDamageType.POISON]: "de poison",
  [WeaponDamageType.PSYCHIC]: "psychiques",
  [WeaponDamageType.RADIANT]: "radiants",
};

export const WEAPON_DAMAGE_TYPE_MAP: { [key in WeaponDamageType]: string } = {
  [WeaponDamageType.ACID]: "Acide",
  [WeaponDamageType.BLUDGEONING]: "Contondants",
  [WeaponDamageType.FIRE]: "Feu",
  [WeaponDamageType.FORCE]: "Force",
  [WeaponDamageType.LIGHTNING]: "Foudre",
  [WeaponDamageType.COLD]: "Froid",
  [WeaponDamageType.NECROTIC]: "Nécrotiques",
  [WeaponDamageType.PIERCING]: "Perforants",
  [WeaponDamageType.POISON]: "Poison",
  [WeaponDamageType.PSYCHIC]: "Psychiques",
  [WeaponDamageType.RADIANT]: "Radiants",
  [WeaponDamageType.SLASHING]: "Tranchants",
};

export const AMMUNITION_TYPE_MAP: Record<AmmunitionType, string> = {
  [AmmunitionType.FIREARM_BULLET]: "Balles",
  [AmmunitionType.SLING_BULLET]: "Billes",
  [AmmunitionType.BOLT]: "Carreaux",
  [AmmunitionType.ARROW]: "Flèches",
  [AmmunitionType.NEEDLES]: "Fléchèttes",
};

export const MONEY_TYPE_MAP: { [key in MoneyType]: string } = {
  [MoneyType.GOLD]: "Or",
  [MoneyType.SILVER]: "Argent",
  [MoneyType.COPPER]: "Cuivre",
};

export const ARMOR_TYPE_MAP: { [key in ArmorType]: string } = {
  [ArmorType.LIGHT]: "Légère",
  [ArmorType.MEDIUM]: "Intermédiaire",
  [ArmorType.HEAVY]: "Lourde",
  [ArmorType.SHIELD]: "Bouclier",
};

export const WEAPON_TYPE_MAP: { [key in WeaponType]: string } = {
  [WeaponType.MELEE]: "Melee",
  [WeaponType.THROWN]: "Melee + lancer",
  [WeaponType.RANGED]: "Distance",
};

export const PACT_MAGIC_PROGRESSION: Array<Record<number, number>> = [
  { 1: 1 }, // index 0 = Level 1
  { 1: 2 },
  { 2: 2 },
  { 2: 2 },
  { 3: 2 },
  { 3: 2 },
  { 4: 2 },
  { 4: 2 },
  { 5: 2 },
  { 5: 2 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 4 },
  { 5: 4 },
  { 5: 4 },
  { 5: 4 },
];

export const HALF_CASTER_PROGRESSION: Array<Record<number, number>> = [
  { 1: 2 }, // index 0 = level 1
  { 1: 2 },
  { 1: 3 },
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
];

export const FULL_CASTER_PROGRESSION: Array<Record<number, number>> = [
  { 1: 2 }, // index 0 = Level 1
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
];

export const CLASS_SPELL_PROGRESSION_MAP: Record<Classes, Array<Record<number, number>>> = {
  [Classes.BARD]: FULL_CASTER_PROGRESSION,
  [Classes.CLERIC]: FULL_CASTER_PROGRESSION,
  [Classes.DRUID]: FULL_CASTER_PROGRESSION,
  [Classes.SORCERER]: FULL_CASTER_PROGRESSION,
  [Classes.WIZARD]: FULL_CASTER_PROGRESSION,
  [Classes.PALADIN]: HALF_CASTER_PROGRESSION,
  [Classes.RANGER]: HALF_CASTER_PROGRESSION,
  [Classes.ARTIFICER]: HALF_CASTER_PROGRESSION,
  [Classes.WARLOCK]: PACT_MAGIC_PROGRESSION,
  [Classes.BARBARIAN]: [],
  [Classes.FIGHTER]: [],
  [Classes.MONK]: [],
  [Classes.ROGUE]: [],
};

export const PREPARED_SPELLS_PROGRESSION_WIZARD: number[] = [
  4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25,
];

export const MAGIC_ITEM_RARITY_MAP: Record<MagicItemRarity, string> = {
  [MagicItemRarity.COMMON]: "Commun",
  [MagicItemRarity.UNCOMMON]: "Inhabituel",
  [MagicItemRarity.RARE]: "Rare",
  [MagicItemRarity.EPIC]: "Épique",
  [MagicItemRarity.LEGENDARY]: "Légendaire",
  [MagicItemRarity.ARTIFACT]: "Artefact",
};

export const MAGIC_ITEM_RARITY_COLOR_MAP: Record<MagicItemRarity, string> = {
  [MagicItemRarity.COMMON]: "text-white",
  [MagicItemRarity.UNCOMMON]: "text-green-500",
  [MagicItemRarity.RARE]: "text-blue-500",
  [MagicItemRarity.EPIC]: "text-purple-500",
  [MagicItemRarity.LEGENDARY]: "text-orange-500",
  [MagicItemRarity.ARTIFACT]: "text-red-500",
};

export const PREPARED_SPELLS_PROGRESSION: number[] = [
  4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22,
];
export const PREPARED_SPELLS_PROGRESSION_PALADIN_RANGER: number[] = [
  2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15,
];

export const CLASS_SPELLS_PREPARED_PROGRESSION_MAP: Record<Classes, number[]> = {
  [Classes.BARD]: [], // Known spells
  [Classes.SORCERER]: [], // Known spells
  [Classes.WARLOCK]: [], // Known spells
  [Classes.CLERIC]: PREPARED_SPELLS_PROGRESSION,
  [Classes.DRUID]: PREPARED_SPELLS_PROGRESSION,
  [Classes.WIZARD]: PREPARED_SPELLS_PROGRESSION_WIZARD,
  [Classes.ARTIFICER]: PREPARED_SPELLS_PROGRESSION,
  [Classes.PALADIN]: PREPARED_SPELLS_PROGRESSION_PALADIN_RANGER,
  [Classes.RANGER]: PREPARED_SPELLS_PROGRESSION_PALADIN_RANGER,
  [Classes.FIGHTER]: [], // No spells
  [Classes.ROGUE]: [], // No spells
  [Classes.BARBARIAN]: [], // No spells
  [Classes.MONK]: [], // No spells
};

const SPELL_PREPARATION = {
  when: "Long repos",
  dailyAmount: "∞",
};
const SPELL_PREPARATION_PALADIN_RANGER = {
  when: "Long repos",
  dailyAmount: "1 seul",
};
export const CLASS_SPELLS_WHEN_TO_PREPARE_MAP: Record<
  Classes,
  { when: string; dailyAmount: string } | null
> = {
  [Classes.BARD]: null,
  [Classes.SORCERER]: null,
  [Classes.WARLOCK]: null,
  [Classes.CLERIC]: SPELL_PREPARATION,
  [Classes.DRUID]: SPELL_PREPARATION,
  [Classes.WIZARD]: SPELL_PREPARATION,
  [Classes.ARTIFICER]: SPELL_PREPARATION,
  [Classes.PALADIN]: SPELL_PREPARATION_PALADIN_RANGER,
  [Classes.RANGER]: SPELL_PREPARATION_PALADIN_RANGER,
  [Classes.FIGHTER]: null,
  [Classes.ROGUE]: null,
  [Classes.BARBARIAN]: null,
  [Classes.MONK]: null,
};
