import { Condition } from "@/types/types";

export const conditions: Condition[] = [
  {
    title: "À Terre",
    icon: "prone",
    description: "Vous êtes à terre",
    bullets: [
      "Votre seule option de déplacement est de ramper, sauf si vous vous relevez (coute la moitié des mouvements).",
      "Vous avez un désavantage sur les jets d'attaque.",
      "Les jets d'attaque contre vous ont l'avantage si l'attaquant est à 1 case de vous, sinon les jets d'attaque ont un désavantage.",
    ],
  },
  {
    title: "Assourdi",
    icon: "deafened",
    description: "Vous ne pouvez pas entendre",
    bullets: ["Vous échouez automatiquement à tout test de caractéristique nécessitant l'ouïe."],
  },
  {
    title: "Attrapé",
    icon: "grappled",
    description: "Vous êtes attrapé",
    bullets: [
      "Votre vitesse devient 0, et vous ne pouvez pas bénéficier de bonus de vitesse.",
      "La condition prend fin si vous réussissez un jet de FOR en opposition à celui de votre cible ou si votre agresseur est neutralisé.",
      "La condition prend aussi fin si vous êtes déplacé hors de portée de votre agresseur.",
    ],
  },
  {
    title: "Aveuglé",
    icon: "blinded",
    description: "Vous ne pouvez pas voir",
    bullets: [
      "Vous échouez automatiquement à tout test de caractéristique nécessitant la vue.",
      "Vous avez un désavantage sur vos jets d'attaque.",
      "Les jets d'attaque contre vous ont l'avantage.",
    ],
  },
  {
    title: "Charmé",
    icon: "charmed",
    description: "Vous êtes charmé par une autre créature",
    bullets: [
      "Vous ne pouvez pas attaquer votre charmeur ni le cibler avec des capacités ou des effets magiques nuisibles.",
      "Votre charmeur a l'avantage sur les tests de caractéristique pour interagir socialement avec vous.",
    ],
  },
  {
    title: "Effrayé",
    icon: "frightened",
    description: "Vous êtes effrayé",
    bullets: [
      "Vous avez un désavantage sur les tests de caractéristique et les jets d'attaque tant que la source de votre peur est dans votre ligne de vue.",
      "Vous ne pouvez pas vous déplacer volontairement vers la source de votre peur.",
    ],
  },
  {
    title: "Empoisonné",
    icon: "poisoned",
    description: "Vous êtes empoisonné",
    bullets: ["Vous avez un désavantage sur les jets d'attaque et les tests de caractéristique."],
  },
  {
    title: "Entravé",
    icon: "restrained",
    description: "Vous êtes entravé",
    bullets: [
      "Votre vitesse devient 0, et vous ne pouvez pas bénéficier de bonus de vitesse.",
      "Vous avez un désavantage sur les jets d'attaque.",
      "Les jets d'attaque contre vous ont l'avantage.",
      "Vous avez un désavantage sur les jets de sauvegarde de Dextérité.",
    ],
  },
  {
    title: "Épuisé",
    icon: "exhausted",
    description: "L'épuisement est mesuré en six niveaux",
    bullets: [
      "Voir niveaux sur écran du MD",
      "Vous subissez l'effet de votre niveau actuel d'épuisement ainsi que tous les niveaux inférieurs.",
      "Terminer un repos long réduit votre niveau d'épuisement de 1, à condition d'avoir mangé et bu.",
      "Être ramené à la vie réduit également le niveau d'épuisement d'une créature de 1.",
    ],
  },
  {
    title: "Étourdi",
    icon: "stunned",
    description: "Vous êtes étourdi",
    bullets: [
      "Vous êtes incapacités, ne pouvez pas bouger et ne pouvez parler que de manière hésitante.",
      "Les jets d'attaque contre vous ont l'avantage.",
      "Vous échouez automatiquement aux jets de sauvegarde de Force et de Dextérité.",
    ],
  },
  {
    title: "Incapacité",
    icon: "incapacitated",
    description: "Vous ne pouvez pas effectuer d'actions ou de réactions",
    bullets: [],
  },
  {
    title: "Inconscient",
    icon: "unconscious",
    description: "Vous êtes inconscient",
    bullets: [
      "Vous êtes incapacités, ne pouvez pas bouger ni parler, et n'êtes pas conscient de votre environnement.",
      "Vous laissez tomber tout ce que vous tenez et tombez à terre.",
      "Les jets d'attaque contre vous ont l'avantage.",
      "Toute attaque qui vous touche est un coup critique si l'attaquant est à 1 case de vous.",
      "Vous échouez automatiquement aux jets de sauvegarde de Force et de Dextérité.",
    ],
  },
  {
    title: "Invisible",
    icon: "invisible",
    description: "Vous ne pouvez pas être vu sans l'aide de magie ou d'un sens particulier",
    bullets: [
      "Pour se cacher, vous êtes considéré comme fortement obscurci.",
      "Vous pouvez toujours être détecté par les bruits que vous faites ou vos traces.",
      "Vous avez l'avantage sur les jets d'attaque.",
      "Les jets d'attaque contre vous ont un désavantage.",
    ],
  },
  {
    title: "Paralysé",
    icon: "paralyzed",
    description: "Vous ne pouvez rien faire",
    bullets: [
      "Vous êtes incapacités et ne pouvez ni bouger ni parler.",
      "Les jets d'attaque contre vous ont l'avantage.",
      "Toute attaque qui vous touche est un coup critique si l'attaquant est à 1 case de vous.",
      "Vous échouez automatiquement aux jets de sauvegarde de Force et de Dextérité.",
    ],
  },
  {
    title: "Pétrifié",
    icon: "petrified",
    description:
      "Vous êtes transformé, ainsi que tout objet non magique que vous portez ou transportez, en une substance solide inanimée (généralement de la pierre).",
    bullets: [
      "Votre poids est multiplié par dix, et vous cessez de vieillir.",
      "Vous êtes incapacités, ne pouvez ni bouger ni parler et n'êtes pas conscient de votre environnement.",
      "Les jets d'attaque contre vous ont l'avantage.",
      "Vous échouez automatiquement aux jets de sauvegarde de Force et de Dextérité.",
      "Vous avez une résistance à tous les types de dégâts.",
      "Vous êtes immunisé contre le poison et les maladies, bien qu'un poison ou une maladie déjà présents dans votre système soient seulement suspendus, pas neutralisés.",
    ],
  },
];
