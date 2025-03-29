import {
  Alignment,
  Backgrounds,
  CampaignId,
  CharacterStatus,
  Classes,
  PartyId,
  Races,
  Skills,
  Subclasses,
} from "@prisma/client";

type Abilities =
  | "intelligence"
  | "charisma"
  | "wisdom"
  | "strength"
  | "constitution"
  | "dexterity";

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
  [key in Classes]: Abilities | null;
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

export const SKILL_ABILITY_MAP: { [key in Skills]: Abilities } = {
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
