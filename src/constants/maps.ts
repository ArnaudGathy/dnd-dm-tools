import {
  CampaignId,
  CharacterStatus,
  Classes,
  PartyId,
  Races,
} from "@prisma/client";

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
