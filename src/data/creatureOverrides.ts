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
};
