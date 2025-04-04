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
  PartyId,
  Races,
  Skills,
  Subclasses,
  WeaponDamageDices,
  WeaponDamageType,
} from "@prisma/client";
import { AbilityNameType } from "@/types/types";

export const CLASS_MAP = {
  [Classes.ARTIFICER]: "Artificier",
  [Classes.BARBARIAN]: "Barbare",
  [Classes.BARD]: "Barde",
  [Classes.CLERIC]: "Clerc",
  [Classes.DRUID]: "Druide",
  [Classes.FIGHTER]: "Guerrier",
  [Classes.MONK]: "Moine",
  [Classes.PALADIN]: "Paladin",
  [Classes.RANGER]: "Rôdeur",
  [Classes.ROGUE]: "Roublard",
  [Classes.SORCERER]: "Ensorceleur",
  [Classes.WARLOCK]: "Sorcier",
  [Classes.WIZARD]: "Mage",
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
  [Subclasses.ARMORER]: "Porteguerre",
  [Subclasses.ARTILLERIST]: "Artilleur",
  [Subclasses.BATTLE_SMITH]: "Forgeron de bataille",

  // Barbare
  [Subclasses.PATH_OF_THE_BERSERKER]: "Voie du Berserker",
  [Subclasses.PATH_OF_THE_WILD_HEART]: "Voie du Coeur Sauvage",
  [Subclasses.PATH_OF_THE_STORM_HERALD]: "Voie du Héraut des Tempêtes",
  [Subclasses.PATH_OF_THE_ZEALOT]: "Voie du Zélote",

  // Barde
  [Subclasses.COLLEGE_OF_VALOR]: "Collège de la Vaillance",
  [Subclasses.COLLEGE_OF_LORE]: "Collège du Savoir",
  [Subclasses.COLLEGE_OF_SWORDS]: "Collège des Épées",
  [Subclasses.COLLEGE_OF_WHISPERS]: "Collège des Murmures",
  [Subclasses.COLLEGE_OF_GLAMOUR]: "Collège de la séduction",

  // Clerc
  [Subclasses.LIFE_DOMAIN]: "Domaine de la Vie",
  [Subclasses.LIGHT_DOMAIN]: "Domaine de la Lumière",
  [Subclasses.WAR_DOMAIN]: "Domaine de la Guerre",
  [Subclasses.TRICKERY_DOMAIN]: "Domaine de la Fourberie",
  [Subclasses.KNOWLEDGE_DOMAIN]: "Domaine de la Connaissance",
  [Subclasses.NATURE_DOMAIN]: "Domaine de la Nature",
  [Subclasses.TEMPEST_DOMAIN]: "Domaine de la Tempête",
  [Subclasses.DEATH_DOMAIN]: "Domaine de la Mort",

  // Druide
  [Subclasses.CIRCLE_OF_THE_LAND]: "Cercle de la Terre",
  [Subclasses.CIRCLE_OF_THE_MOON]: "Cercle de la Lune",
  [Subclasses.CIRCLE_OF_SPORES]: "Cercle des Spores",
  [Subclasses.CIRCLE_OF_WILD_FIRE]: "Cercle des Feux Sauvages",

  // Guerrier
  [Subclasses.CHAMPION]: "Champion",
  [Subclasses.BATTLE_MASTER]: "Maître de guerre",
  [Subclasses.ELDRITCH_KNIGHT]: "Chevalier occulte",
  [Subclasses.ARCANE_ARCHER]: "Archer arcanique",
  [Subclasses.CAVALIER]: "Cavalier",
  [Subclasses.SAMURAI]: "Samouraï",

  // Moine
  [Subclasses.WAY_OF_THE_OPEN_HAND]: "Voie de la Main Ouverte",
  [Subclasses.WAY_OF_SHADOW]: "Voie de l’Ombre",
  [Subclasses.WAY_OF_THE_ELEMENTS]: "Voie des Quatre Éléments",
  [Subclasses.WAY_OF_MERCY]: "Voie de la Miséricorde",

  // Paladin
  [Subclasses.OATH_OF_DEVOTION]: "Serment de Dévotion",
  [Subclasses.OATH_OF_THE_ANCESTORS]: "Serment des Ancêtres",
  [Subclasses.OATH_OF_VENGEANCE]: "Serment de Vengeance",
  [Subclasses.OATH_OF_GLORY]: "Serment de Gloire",
  [Subclasses.OATH_OF_THE_CROWN]: "Serment de la Couronne",

  // Rôdeur
  [Subclasses.HUNTER]: "Chasseur",
  [Subclasses.BEAST_MASTER]: "Maître des bêtes",
  [Subclasses.GLOOM_STALKER]: "Traqueur des Ténèbres",
  [Subclasses.SWARMKEEPER]: "Gardien de Nuée",

  // Roublard
  [Subclasses.THIEF]: "Voleur",
  [Subclasses.ASSASSIN]: "Assassin",
  [Subclasses.ARCANE_TRICKSTER]: "Arnaqueur arcanique",
  [Subclasses.SOULKNIFE]: "Lame psychique",
  [Subclasses.INQUISITIVE]: "Inquisiteur",

  // Ensorceleur
  [Subclasses.DRACONIC_BLOODLINE]: "Lignée draconique",
  [Subclasses.WILD_MAGIC]: "Magie sauvage",
  [Subclasses.STORM_SORCERY]: "Magie des tempêtes",
  [Subclasses.DIVINE_SOUL]: "Âme divine",

  // Sorcier
  [Subclasses.THE_ARCHFEY]: "L'Archifée",
  [Subclasses.THE_FIEND]: "Le Fiélon",
  [Subclasses.THE_GREAT_OLD_ONE]: "Le Grand Ancien",
  [Subclasses.THE_GENIE]: "Le Génie",
  [Subclasses.THE_HEXBLADE]: "La Lame maudite",

  // Mage
  [Subclasses.SCHOOL_OF_EVOCATION]: "École d'évocation",
  [Subclasses.SCHOOL_OF_ABJURATION]: "École d'abjuration",
  [Subclasses.SCHOOL_OF_ILLUSION]: "École d'illusion",
  [Subclasses.SCHOOL_OF_DIVINATION]: "École de divination",
  [Subclasses.SCHOOL_OF_NECROMANCY]: "École de nécromancie",
  [Subclasses.SCHOOL_OF_TRANSMUTATION]: "École de transmutation",
  [Subclasses.SCHOOL_OF_CONJURATION]: "École de conjuration",
  [Subclasses.SCHOOL_OF_ENCHANTMENT]: "École d'enchantement",
};

export const RACE_MAP = {
  [Races.AASIMAR]: "Aasimar",
  [Races.DRAGONBORN]: "Sangdragon",
  [Races.DWARF]: "Nain",
  [Races.ELF]: "Elfe",
  [Races.GNOME]: "Gnome",
  [Races.GOLIATH]: "Goliath",
  [Races.HALFLING]: "Halfelin",
  [Races.HALF_ELF]: "Semi-elfe",
  [Races.HALF_ORC]: "Semi-orc",
  [Races.HUMAN]: "Humain",
  [Races.ORC]: "Orc",
  [Races.TIEFLING]: "Tiefelin",
};

export const SPEED_BY_RACE_MAP = {
  [Races.AASIMAR]: 30,
  [Races.DRAGONBORN]: 30,
  [Races.DWARF]: 25,
  [Races.ELF]: 30,
  [Races.GNOME]: 25,
  [Races.GOLIATH]: 30,
  [Races.HALFLING]: 25,
  [Races.HALF_ELF]: 30,
  [Races.HALF_ORC]: 30,
  [Races.HUMAN]: 30,
  [Races.ORC]: 30,
  [Races.TIEFLING]: 30,
};

export const SIZE_BY_RACE_MAP = {
  [Races.AASIMAR]: "M", // Moyen
  [Races.DRAGONBORN]: "M", // Moyen
  [Races.DWARF]: "M", // Moyen (petit gabarit mais catégorie "M")
  [Races.ELF]: "M", // Moyen
  [Races.GNOME]: "P", // Petit
  [Races.GOLIATH]: "M", // Moyen (grand gabarit mais reste "M")
  [Races.HALFLING]: "P", // Petit
  [Races.HALF_ELF]: "M", // Moyen
  [Races.HALF_ORC]: "M", // Moyen
  [Races.HUMAN]: "M", // Moyen
  [Races.ORC]: "M", // Moyen
  [Races.TIEFLING]: "M", // Moyen
};

export const BACKGROUND_MAP = {
  [Backgrounds.ACOLYTE]: "Acolyte",
  [Backgrounds.ARTISAN]: "Artisan",
  [Backgrounds.CHARLATAN]: "Charlatan",
  [Backgrounds.CRIMINAL]: "Criminel",
  [Backgrounds.ENTERTAINER]: "Artiste",
  [Backgrounds.FARMER]: "Fermier",
  [Backgrounds.GUARD]: "Garde",
  [Backgrounds.GUIDE]: "Sauvageon",
  [Backgrounds.HERMIT]: "Ermite",
  [Backgrounds.MERCHANT]: "Marchand",
  [Backgrounds.NOBLE]: "Noble",
  [Backgrounds.SAGE]: "Sage",
  [Backgrounds.SAILOR]: "Marin",
  [Backgrounds.SCRIBE]: "Scribe",
  [Backgrounds.SOLDIER]: "Soldat",
  [Backgrounds.WAYFARER]: "Enfant des rues",
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
};

export const PARTY_MAP = {
  [PartyId.MIFA]: "La mifa",
  [PartyId.PAINTERS]: "Les peintres",
};

export const CHARACTER_STATUS_MAP = {
  [CharacterStatus.DEAD]: "Mort",
  [CharacterStatus.ACTIVE]: "Actif",
  [CharacterStatus.RETIRED]: "Retraité",
};

export const ABILITIES_MAP = {
  dexterity: "Dexterité",
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
  [Skills.ANIMAL_HANDLING]: "Dressage",
  [Skills.STEALTH]: "Discrétion",
  [Skills.SLEIGHT_OF_HAND]: "Escamotage",
  [Skills.HISTORY]: "Histoire",
  [Skills.INTIMIDATION]: "Intimidation",
  [Skills.INVESTIGATION]: "Investigation",
  [Skills.MEDICINE]: "Médecine",
  [Skills.NATURE]: "Nature",
  [Skills.PERCEPTION]: "Perception",
  [Skills.PERFORMANCE]: "Représentation",
  [Skills.INSIGHT]: "Perspicacité",
  [Skills.PERSUASION]: "Persuasion",
  [Skills.RELIGION]: "Religion",
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

export const WEAPON_DAMAGE_TYPE_MAP: { [key in WeaponDamageType]: string } = {
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

export const DAMAGE_TYPE_COLORS: Record<WeaponDamageType, string> = {
  [WeaponDamageType.BLUDGEONING]: "gray-400",
  [WeaponDamageType.SLASHING]: "gray-400",
  [WeaponDamageType.PIERCING]: "gray-400",
  [WeaponDamageType.ACID]: "lime-200",
  [WeaponDamageType.COLD]: "cyan-400",
  [WeaponDamageType.FIRE]: "orange-500",
  [WeaponDamageType.FORCE]: "red-500",
  [WeaponDamageType.LIGHTNING]: "blue-700",
  [WeaponDamageType.NECROTIC]: "emerald-300",
  [WeaponDamageType.POISON]: "lime-600",
  [WeaponDamageType.PSYCHIC]: "fuchsia-400",
  [WeaponDamageType.RADIANT]: "amber-300",
};

export const AMMUNITION_TYPE_MAP: Record<AmmunitionType, string> = {
  [AmmunitionType.BOLT]: "Carreaux",
  [AmmunitionType.ARROW]: "Flèches",
  [AmmunitionType.FIREARM_BULLET]: "Balles",
  [AmmunitionType.SLING_BULLET]: "Billes",
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

export const CLASS_SPELL_PROGRESSION_MAP: Record<
  Classes,
  Array<Record<number, number>>
> = {
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
