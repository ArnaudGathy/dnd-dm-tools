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
};
