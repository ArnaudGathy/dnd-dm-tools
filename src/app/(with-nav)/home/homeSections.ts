import {
  Book,
  BookOpenText,
  FileText,
  HeartPulse,
  LayoutDashboard,
  PawPrint,
  SquareUserIcon,
  SwordsIcon,
} from "lucide-react";
import { ElementType } from "react";

export type HomeSection = {
  to: string;
  label: string;
  description: string;
  icon: ElementType;
  openInNewTab?: boolean;
};

// Sections accessibles au MJ (admin) — reprend la navigation principale.
export const adminSections: HomeSection[] = [
  {
    to: "/encounters",
    label: "Rencontres",
    description: "Vos combats préparés, prêts à être lancés.",
    icon: SwordsIcon,
  },
  {
    to: "/dm-tools",
    label: "Outils MJ",
    description: "Écrans de jeu et gestion réservés au MJ.",
    icon: LayoutDashboard,
  },
  {
    to: "/creatures",
    label: "Créatures",
    description: "Parcourez le bestiaire et ses statblocks.",
    icon: PawPrint,
  },
  {
    to: "/spells",
    label: "Sorts",
    description: "Recherchez et filtrez tous les sorts.",
    icon: Book,
  },
  {
    to: "/characters",
    label: "Personnages",
    description: "Fiches, sorts et inventaires des personnages.",
    icon: SquareUserIcon,
  },
  {
    to: "/rules",
    label: "Règles",
    description: "Vos règles maison et références de jeu.",
    icon: FileText,
  },
];

// Sections accessibles aux joueurs connectés.
export const playerSections: HomeSection[] = [
  {
    to: "/characters",
    label: "Personnages",
    description: "Accédez à vos fiches de personnage.",
    icon: SquareUserIcon,
  },
  {
    to: "/spells",
    label: "Sorts",
    description: "Recherchez et filtrez tous les sorts.",
    icon: Book,
  },
  {
    to: "/rules",
    label: "Règles",
    description: "Les règles maison et références de jeu.",
    icon: FileText,
  },
];

// Écrans de jeu temps réel du MJ (ouverts dans un nouvel onglet).
export const gameScreens: HomeSection[] = [
  {
    to: "/tracker/character",
    label: "Suivi de combat",
    description: "Suivi des points de vie des personnages en temps réel.",
    icon: HeartPulse,
    openInNewTab: true,
  },
  {
    to: "/dm-screen",
    label: "DM Screen",
    description: "Écran du MJ : stats des personnages, conditions et références.",
    icon: BookOpenText,
    openInNewTab: true,
  },
];
