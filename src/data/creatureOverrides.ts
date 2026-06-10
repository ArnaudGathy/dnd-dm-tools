import { Creature } from "@/types/types";

export const creatureOverrides: Partial<Record<string, Partial<Creature>>> = {
  bandit: {
    actions: [
      {
        hit: "4 (1d6 + 1) dégâts tranchant.",
        modifier: "+3",
        name: "Cimeterre",
        reach: "1.5 m",
        type: "Melee",
      },
      {
        hit: "4 (1d8 + 1) dégâts perçants.",
        modifier: "+3",
        name: "Pistolet à silex",
        reach: "24/96 m",
        type: "Distance",
      },
    ],
  },
  "sea-hag": {
    name: "Guenaude marine",
    traits: [
      {
        name: "Coven Magic",
        description:
          "A 6 case de 2 autres sorcières, elle peut lancer les sorts : (spell save DC 11) Augury, Find Familiar, Identify, Locate Object, Scrying, or Unseen Servant.",
      },
      {
        name: "Vile apparence",
        description:
          "Quiconque débute son tour à 6 cases de la sorcière et voit sa vraie forme => JdS SAG 11 (immune) ou être effrayé jusqu'au début de son prochain tour.",
      },
    ],
  },
  "axe-beak": {
    name: "Bec-de-Hache",
  },
  "will-o--wisp": {
    name: "Feu follet",
    bonusActions: undefined,
    behavior: "Traverse tout. Shock sur Golem.",
  },
  gargoyle: {
    actions: [
      {
        name: "Multiattack",
        description: "The gargoyle makes two Claw attacks.",
      },
      {
        name: "Claw",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "7 (2d4 + 2) Slashing damage.",
      },
      {
        name: "Attraper au filet",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "0 (S'enfuit avec la cible dans le filet. Nécessite 2 gargouilles)",
      },
    ],
  },
  assassin: {
    name: "Sac de clous",
    alignment: "Chaotic Neutral",
    languages: ["Commun", "Nain", "Argot des voleurs"],
    speed: {
      walk: "9 m",
      climb: "7.5 m",
    },
    senses: {
      passivePerception: 16,
      darkvision: "18m",
    },
    traits: [
      {
        name: "Agilité féline",
        description:
          "Double la vitesse de déplacement. Recharge après avoir bougé 0 cases en 1 tour.",
      },
      {
        name: "Évasion",
        description: "JdS DEX dégats 1/2 ou aucun. Si pas incapacité",
      },
      {
        name: "Marque de l'assassin",
        description: "Première attaque du combat : 20d6 + 2d8 + 4",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "3x épée ou arc",
      },
      {
        name: "Epee courte",
        type: "Melee",
        modifier: "+7",
        reach: "1.5 m",
        hit: "7 (1d6 + 4) dégâts perçants, +5d6 poison et empoisonné jusqu'au début du prochain tour de l'assassin.",
      },
      {
        name: "Arc long",
        type: "Ranged",
        modifier: "+7",
        reach: "45/180 m ",
        hit: "7 (1d8+ 4) dégâts perçants, +6d6 poison",
      },
    ],
    bonusActions: [
      {
        name: "Cunning Action",
        description:
          "Sprint, désengagement ou furtivité. Se déplace puis se cache. Jet Discrétion(+10) DD 15, résultat = DD perception à réussir, avantage jet d'attaque suivante, désavantage attaque si pas vu.",
      },
    ],
  },
  ghast: {
    traits: [
      {
        name: "Puanteur",
        description:
          "Au début du tour, a portée de CàC : JdS CON 10 (immunisé) ou empoisonné jusqu'au début de son prochain tour.",
      },
    ],
    actions: [
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "7 (1d8 + 3) perçant +2d8 Necrotic",
      },
      {
        name: "Griffe",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "10 (2d6 + 3) Tranchant. JdS CON 10 ou paralysé jusqu'à la fin de son prochain tour.",
      },
    ],
  },
  "steam-mephit": {
    traits: [
      {
        name: "Forme brouillée",
        description: "Désavantage aux attaquants, sauf si incapacité.",
      },
      {
        name: "Explosion de mort",
        description: "A la mort, explose sur 1 case de portée. JdS DEX 10 (moiti) ou 2d4 feu",
      },
    ],
    actions: [
      {
        name: "Griffe",
        type: "Melee",
        modifier: "+2",
        reach: "1.5 m",
        hit: "2 (1d4) dégâts tranchants +1d4 feu.",
      },
      {
        name: "Souffle de vapeur (Recharge 6)",
        description:
          "Cone de 3 cases. JdS CON 10 (moitié) ou 2d4 feu et vitesse -2 cases jusqu'à la fin du prochaine tour du méphite.",
      },
    ],
  },
  "yuan-ti-malison-type-1": {
    id: "_yuan-ti-malison-type-1",
    name: "Yuan-ti Malison 1 - Ray",
    size: "Medium",
    type: "Monstrosity",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    senses: {
      darkvision: "18 m",
      passivePerception: 13,
    },
    skills: {},
    traits: [
      {
        name: "Magic Resistance",
        description:
          "The yuan-ti has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x Morsure ou poison (au choix)",
      },
      {
        hit: "5 (1d4 + 3) Piercing damage plus 7 (2d6) Poison damage.",
        name: "Morsure",
        type: "Melee",
        reach: "1.5 m",
        modifier: "+5",
      },
      {
        name: "Poison Ray",
        reach: "36 m",
        type: "Ranged",
        modifier: "+5",
        hit: "12 (2d8 + 3) Poison damage",
      },
    ],
    abilities: {
      wisdom: 16,
      charisma: 12,
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 14,
    },
    alignment: "Neutral Evil",
    hitPoints: "66 (12d8 + 12)",
    languages: ["abyssal", "common", "draconic"],
    armorClass: "12",
    immunities: ["poison", "poisoned"],
    savingThrows: {
      wisdom: "+3",
      charisma: "+1",
      strength: "+3",
      dexterity: "+2",
      constitution: "+1",
      intelligence: "+2",
    },
    challengeRating: 3,
    bonusActions: [],
  },
  "yuan-ti-malison-type-2": {
    id: "_yuan-ti-malison-type-2",
    name: "Yuan-ti Malison 2 - bras",
    size: "Medium",
    type: "Monstrosity",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    senses: {
      darkvision: "18 m",
      passivePerception: 13,
    },
    skills: {},
    traits: [
      {
        name: "Magic Resistance",
        description:
          "The yuan-ti has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x Morsure",
      },
      {
        hit: "7 (1d8 + 3) Piercing damage plus 7 (2d6) Poison damage.",
        name: "Morsure",
        type: "Melee",
        reach: "3 m",
        modifier: "+5",
      },
    ],
    abilities: {
      wisdom: 16,
      charisma: 12,
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 14,
    },
    alignment: "Neutral Evil",
    hitPoints: "66 (12d8 + 12)",
    languages: ["abyssal", "common", "draconic"],
    armorClass: "12",
    immunities: ["poison", "poisoned"],
    savingThrows: {
      wisdom: "+3",
      charisma: "+1",
      strength: "+3",
      dexterity: "+2",
      constitution: "+1",
      intelligence: "+2",
    },
    challengeRating: 3,
    bonusActions: [],
  },
  "yuan-ti-malison-type-3": {
    id: "_yuan-ti-malison-type-3",
    name: "Yuan-ti Malison 3 - Constrictor",
    size: "Medium",
    type: "Monstrosity",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    senses: {
      darkvision: "18 m",
      passivePerception: 13,
    },
    skills: {},
    traits: [
      {
        name: "Magic Resistance",
        description:
          "The yuan-ti has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x poison burst",
      },
      {
        hit: "12 (2d8 + 3) Poison damage.",
        name: "Poison Burst",
        type: "Melee or Ranged",
        reach: "1.5 m ou portée 36 m",
        modifier: "+5",
      },
      {
        name: "Constrict",
        description:
          "JdS FOR 13, M ou S CàC, 4d8+3 dégats contondants, aggripé et entravé. Escape DD13.",
      },
    ],
    abilities: {
      wisdom: 16,
      charisma: 12,
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 14,
    },
    alignment: "Neutral Evil",
    hitPoints: "66 (12d8 + 12)",
    languages: ["abyssal", "common", "draconic"],
    armorClass: "12",
    immunities: ["poison", "poisoned"],
    bonusActions: [],
    savingThrows: {
      wisdom: "+3",
      charisma: "+1",
      strength: "+3",
      dexterity: "+2",
      constitution: "+1",
      intelligence: "+2",
    },
    challengeRating: 3,
  },
  "giant-constrictor-snake": {
    name: "Azi Mas",
    abilities: {
      strength: 19,
      dexterity: 14,
      constitution: 12,
      intelligence: 10,
      wisdom: 10,
      charisma: 3,
    },
    languages: ["Common"],
    traits: [
      {
        name: "Éveillé",
        description: "Serpent éveillé par magie : intelligent et capable de parler le commun.",
      },
    ],
  },
  "yuan-ti-infiltrator": {
    id: "_yuan-ti-infiltrator",
    name: "Yuan-ti Sang-pur",
    size: "Medium",
    type: "Monstrosity",
    speed: {
      walk: "9 m",
    },
    senses: {
      darkvision: "18 m",
      passivePerception: 14,
    },
    skills: {
      stealth: "+3",
      deception: "+5",
      perception: "+4",
    },
    traits: [
      {
        name: "Magic Resistance",
        description:
          "The yuan-ti has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x Scimitar",
      },
      {
        hit: "4 (1d6 + 1) Slashing damage.",
        name: "Scimitar",
        type: "Melee",
        reach: "1.5 m",
        modifier: "+3",
      },
      {
        name: "Poison Ray",
        reach: "36 m",
        type: "Ranged",
        modifier: "+4",
        hit: "12 (2d6 + 2) Poison damage",
      },
    ],
    abilities: {
      wisdom: 14,
      charisma: 12,
      strength: 11,
      dexterity: 12,
      constitution: 11,
      intelligence: 13,
    },
    alignment: "Neutral Evil",
    hitPoints: "40 (9d8)",
    languages: ["abyssal", "common", "draconic"],
    armorClass: "11",
    immunities: ["poison", "poisoned"],
    savingThrows: {
      wisdom: "+2",
      charisma: "+1",
      dexterity: "+1",
      intelligence: "+1",
    },
    challengeRating: 1,
  },
};
