import { CampaignId, Classes, PartyId } from "@prisma/client";

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

export const CAMPAIGN_MAP = {
  [CampaignId.PHANDELVER]: "Les tréfonds de Phancreux",
  [CampaignId.DRAGONS]: "Les dragons de l'île aux tempêtes",
  [CampaignId.TOMB]: "La tombe de l'annihilation",
};

export const PARTY_MAP = {
  [PartyId.MIFA]: "La mifa",
  [PartyId.PAINTERS]: "Les peintres",
};
