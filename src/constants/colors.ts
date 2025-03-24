import { Classes } from "@prisma/client";

export const classColors = {
  [Classes.ARTIFICER]: { background: "#33937F", foreground: "#ffffff" },
  [Classes.BARBARIAN]: { background: "#C41E3A", foreground: "#000000" },
  [Classes.BARD]: { background: "#ff7eff", foreground: "#000000" },
  [Classes.CLERIC]: { background: "#ffffff", foreground: "#000000" },
  [Classes.DRUID]: { background: "#ff7d0a", foreground: "#ffffff" },
  [Classes.FIGHTER]: { background: "#c79c6e", foreground: "#000000" },
  [Classes.MONK]: { background: "#00ff96", foreground: "#000000" },
  [Classes.PALADIN]: { background: "#f58cba", foreground: "#0b0a09" },
  [Classes.RANGER]: { background: "#aad372", foreground: "#000000" },
  [Classes.ROGUE]: { background: "#fff569", foreground: "#000000" },
  [Classes.SORCERER]: { background: "#A330C9", foreground: "#ffffff" },
  [Classes.WARLOCK]: { background: "#8788EE", foreground: "#000000" },
  [Classes.WIZARD]: { background: "#69ccf0", foreground: "#000000" },
};
