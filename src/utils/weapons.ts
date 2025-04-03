import { WeaponDamageType } from "@prisma/client";
import {
  Droplet,
  Droplets,
  Eye,
  Flame,
  Gavel,
  Skull,
  Snowflake,
  Sun,
  Sword,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

export const getDamageTypeIconAndColor = (damageType: WeaponDamageType) => {
  switch (damageType) {
    case WeaponDamageType.BLUDGEONING:
      return { icon: Gavel, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.SLASHING:
      return { icon: Sword, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.PIERCING:
      return { icon: Target, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.ACID:
      return { icon: Droplet, color: "oklch(0.841 0.238 128.85)" };
    case WeaponDamageType.COLD:
      return { icon: Snowflake, color: "oklch(0.828 0.111 230.318)" };
    case WeaponDamageType.LIGHTNING:
      return { icon: Zap, color: "oklch(0.546 0.245 262.881)" };
    case WeaponDamageType.POISON:
      return { icon: Droplets, color: "oklch(0.606 0.25 292.717)" };
    case WeaponDamageType.FIRE:
      return { icon: Flame, color: "oklch(0.646 0.222 41.116)" };
    case WeaponDamageType.FORCE:
      return { icon: Wand2, color: "oklch(0.592 0.249 0.584)" };
    case WeaponDamageType.NECROTIC:
      return { icon: Skull, color: "oklch(0.845 0.143 164.978)" };
    case WeaponDamageType.PSYCHIC:
      return { icon: Eye, color: "oklch(0.833 0.145 321.434)" };
    case WeaponDamageType.RADIANT:
      return { icon: Sun, color: "oklch(0.879 0.169 91.605)" };
  }
};
