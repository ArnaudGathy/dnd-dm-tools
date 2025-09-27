import { Creature } from "@/types/types";

export const localCreatures: Record<string, Creature> = {
  pterafolk: {
    name: "Ptérosaurien",
    id: "pterafolk",
    type: "Monstrosity",
    size: "Large",
    alignment: "Neutral Evil",
    challengeRating: 1,
    armorClass: 13,
    hitPoints: "31",
    speed: {
      walk: "9 m",
      fly: "15 m",
    },
    abilities: {
      strength: 15,
      dexterity: 13,
      constitution: 12,
      intelligence: 9,
      wisdom: 10,
      charisma: 11,
    },
    skills: {
      perception: "+2",
      survival: "+2",
    },
    languages: ["Common"],
    senses: {
      passivePerception: 12,
    },
    traits: [
      {
        name: "Terror Dive",
        description:
          "Piqué en vol d'au moins 9m de haut, attaque au javelin, cause l'effet frightened si touché.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "Soit 3 attaques, morsure + 2 griffes. Ou 2 attaques au javelin",
      },
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "7 (2d4 + 2) piercing damage.",
      },
      {
        name: "Griffes",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) slashing damage.",
      },
      {
        name: "Javelin",
        type: "Melee or Ranged",
        modifier: "+4",
        reach: "1.5 m",
        hit: "9 (2d6 + 2) piercing damage.",
        description: "Range 9 m / 36 m, one target.",
      },
    ],
  },
};
