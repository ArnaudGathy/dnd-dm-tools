import { Encounter } from "@/types/types";

export const encounters: Encounter[] = [
  {
    name: "Quartier des entrepôts - Ankylo",
    id: 61,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P1",
    },
    ennemies: {
      "1": [
        {
          id: "ankylosaurus",
          color: "orange",
        },
      ],
    },
    informations: [
      "Ajouter Rokah au combat.",
      "Rokah endort la créature avec sa sarbacane quand ça tourne au vinaigre",
    ],
    youtubeId: "fqW--C1hxl8",
  },
  {
    name: "Cave - Gorge de Malar",
    id: 62,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "zombie",
          color: "#d3bf69",
        },
      ],
    },
    youtubeId: "2GX9lVHfnxs",
  },
  {
    name: "Taverne - Bandits",
    id: 63,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P3",
    },
    ennemies: {
      "1": [
        {
          id: "bandit",
          color: "#f10000",
        },
        {
          id: "bandit",
          color: "#1c8811",
        },
        {
          id: "bandit",
          color: "#1383c5",
        },
        {
          id: "bandit",
          color: "#fd7400",
        },
      ],
    },
    youtubeId: "NYtPB459e6Y",
  },
  {
    name: "Plage - pirates",
    id: 65,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Fort Beluarian",
      mapMarker: "FB1",
    },
    ennemies: {
      "1": [
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#CA9F63",
        },
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#6F8451",
        },
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#49535F",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#CA9F63",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#6F8451",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#49535F",
        },
      ],
    },
    informations: ["Lorsque plus que 2 en vie, prennent la fuite vers le bateau."],
    loots: [
      "Carte (physique a donner)",
      "7po 15pa",
      "plume de ptéranodon (décorative)",
      "une caisse de poudre noire de 30kg",
    ],
    youtubeId: "2GX9lVHfnxs",
  },
  {
    name: "Goules & zombies",
    id: 66,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Fort Beluarian",
      mapMarker: "FB2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "zombie",
          color: "#d3bf69",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#1fa483",
        },
        {
          id: "ghoul",
          variant: "femme",
          color: "#8dd549",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#A0A667",
        },
      ],
    },
    informations: ["Voir comportement sur Notion."],
    loots: [
      "20 po par tête de goule",
      "10 po par tête de zombie",
      "1 amulette mécanique",
      "1 joueur roll 1d100 dans la table de loots",
    ],
    youtubeId: "w54512C_A2k",
  },
  {
    name: "Guenaudes marines",
    id: 64,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC1",
    },
    ennemies: {
      "1": [
        {
          id: "sea-hag",
          color: "#817D98",
        },
        {
          id: "sea-hag",
          color: "#788892",
        },
        {
          id: "sea-hag",
          color: "#96766D",
        },
      ],
    },
    informations: [
      "Déguisement DD13. Baihu OK",
      "Utilise vile apparence dès que qqun est à portée",
    ],
    loots: [
      "Fiole de Venin de serpent (JdS CON 11 (moitié) ou 3d6 dmg)",
      "Un étrange masque en bois peint, serti de 9 gemmes (10po chacune)",
      "Une carte indiquant Mbala (pointer sur la carte des joueurs.",
      "Elle est annotée avec les textes suivants :",
      "La vieille ne dort jamais",
      "Ce qui pourrit en haut nourrit ce qui rampe en bas",
    ],
    youtubeId: "8Q7cioftmKs",
  },
  {
    name: "Goules & zombies",
    id: 67,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#1fa483",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#A0A667",
        },
      ],
    },
    youtubeId: "5iMeaTItPhE",
  },
  {
    name: "Ptérosaurien dans la glace",
    id: 68,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC3",
    },
    ennemies: {
      "1": ["_pterafolk", "_pterafolk", "_pterafolk"],
    },
    informations: [
      "Artus Cimber pop au 2eme ou 3eme tour et lance glacification sur un ptérosaurien qui se fracasse en 1000 morceaux au sol.",
    ],
    youtubeId: "5iMeaTItPhE",
  },
  {
    name: "Totem de guerre Batiri",
    id: 69,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC4",
    },
    ennemies: {
      "1": [
        {
          id: "_batiri-battle-stack",
          color: "#aad09a",
        },
        {
          id: "_batiri-battle-stack",
          color: "#d08403",
        },
      ],
    },
    youtubeId: "06QeWIOvHHI",
  },
  {
    name: "Troupe de chasse Batari",
    id: 70,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Camp Vertu",
      mapMarker: "CV1",
    },
    ennemies: {
      "1": [
        {
          id: "_deinonychus",
          color: "#30850e",
        },
        {
          id: "_deinonychus",
          color: "#d52c06",
        },
        {
          id: "goblin-warrior",
          color: "#a88204",
        },
        {
          id: "goblin-warrior",
          color: "#025e13",
        },
        {
          id: "axe-beak",
          color: "#09255e",
        },
        {
          id: "axe-beak",
          color: "#efb500",
        },
      ],
    },
    youtubeId: "jFGq3nwApvA",
  },
  {
    name: "Lianes assassines",
    id: 71,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC5",
    },
    ennemies: {
      "1": [
        {
          id: "_assassin-vine",
          color: "#699846",
        },
        {
          id: "_assassin-vine",
          color: "#5E4737",
        },
        {
          id: "swarm-of-bats",
          color: "#C64C38",
        },
        {
          id: "swarm-of-bats",
          color: "#7D9D85",
        },
        {
          id: "swarm-of-bats",
          color: "#3D444A",
        },
        {
          id: "swarm-of-insects",
          color: "#4D8E31",
        },
        {
          id: "swarm-of-insects",
          color: "#6B5032",
        },
        {
          id: "swarm-of-insects",
          color: "#40204A",
        },
      ],
    },
    youtubeId: "morqY2DkGuk",
  },
  {
    name: "Village de Yellyark",
    id: 72,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Yellyark",
      mapMarker: "Y1",
    },
    ennemies: {
      "1": [
        {
          id: "swarm-of-insects",
          color: "#4D8E31",
        },
        {
          id: "swarm-of-insects",
          variant: "1",
          color: "#6B5032",
        },
        {
          id: "swarm-of-insects",
          color: "#40204A",
        },
        {
          id: "swarm-of-insects",
          color: "#8D9190",
        },
        {
          id: "swarm-of-insects",
          color: "#496B5D",
        },
        {
          id: "swarm-of-insects",
          variant: "2",
          color: "#6B5032",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#ff0000",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#463636",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#7a00ff",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#296c0b",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#ff0000",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#463636",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#7a00ff",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#296c0b",
        },
        { id: "goblin-boss", color: "#6B5032" },
      ],
    },
    youtubeId: "jFGq3nwApvA",
  },
  {
    name: "Attrape-homme",
    id: 73,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Nangaloré",
      mapMarker: "NG1",
    },
    ennemies: {
      "1": [
        {
          id: "_mantrap",
          color: "#BB564E",
        },
        {
          id: "_yellow-musk-creeper",
          color: "#F4ED37",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#566142",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#566142",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#B89250",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#B89250",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#BC5D8C",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#BC5D8C",
        },
      ],
    },
    informations: ["3 zombies pop au 1er tour", "3 zombies au 2eme tour"],
  },
  {
    name: "Zalkoré",
    id: 74,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Nangaloré",
      mapMarker: "NG2",
    },
    ennemies: {
      "1": [
        {
          id: "_zalkore",
          color: "#85BE43",
        },
        {
          id: "_eblis",
          color: "#B66F40",
        },
        {
          id: "_eblis",
          color: "#31384D",
        },
        {
          id: "_eblis",
          color: "#5F9EBF",
        },
        {
          id: "_meme-poupou",
          color: "#AF512B",
        },
        {
          id: "_flesh-golem",
          color: "#814F3D",
        },
        {
          id: "will-o--wisp",
          color: "#76D8DB",
        },
        {
          id: "will-o--wisp",
          color: "#CC61C2",
        },
        {
          id: "will-o--wisp",
          color: "#E3BA50",
        },
        {
          id: "_chaudron",
          shouldHideInInitiativeTracker: true,
        },
      ],
    },
    youtubeId: "Ud7e2Qvm5Mg",
  },
  {
    name: "Treant",
    id: 75,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC6",
    },
    ennemies: {
      "1": [
        {
          id: "_treant",
          color: "#E6D645",
        },
        {
          id: "_treant-weak-spot",
          variant: "3",
          color: "#fff300",
        },
        {
          id: "_treant-weak-spot",
          variant: "2",
          color: "#0015ff",
        },
        {
          id: "_treant-weak-spot",
          variant: "1",
          color: "#fd0000",
        },
        {
          id: "_zombie-triceratops",
          color: "#A8943F",
        },
        {
          id: "_zombie-triceratops",
          color: "#905954",
        },
        {
          id: "zombie",
          color: "#237785",
        },
        {
          id: "zombie",
          color: "#669727",
        },
      ],
    },
    youtubeId: "n8bmE76sETo",
  },
];
