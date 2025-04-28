import InfoCell from "@/app/characters/[id]/(sheet)/(weapons)/InfoCell";
import { Weapon } from "@prisma/client";

export default function ExtraEffects({ weapon }: { weapon: Weapon }) {
  if (!weapon.extraEffects) {
    return null;
  }

  return <InfoCell name="Effets" value={weapon.extraEffects} />;
}
