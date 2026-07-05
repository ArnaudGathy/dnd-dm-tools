"use client";

import { CharacterById, cn } from "@/lib/utils";
import { Coins, ShieldHalf, Swords } from "lucide-react";
import MoneyForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/MoneyForm";
import InventoryItems from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/InventoryItems";
import MagicItems from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/MagicItems";
import WeaponCard from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/WeaponCard";
import ArmorCard from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/ArmorCard";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

/**
 * Inventory tab, two zones: Sac on the left (bourse + inventaire + objets
 * magiques, what you carry) and Équipement on the right (armes + armures,
 * what you wear). The purse stays a compact one-row panel — money is edited
 * often but read rarely, it doesn't deserve hero space.
 */
export default function Inventory({ character }: { character: CharacterById }) {
  const hasEquipment = character.weapons.length > 0 || character.armors.length > 0;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 p-0 md:p-4",
        hasEquipment && "md:grid md:grid-cols-2 md:items-start",
      )}
    >
      <div className="flex flex-col gap-4">
        <SectionPanel
          accent="amber"
          icon={Coins}
          title="Bourse"
          contentClassName="grid grid-cols-3 gap-2 p-2"
        >
          {character.wealth.map((money) => (
            <MoneyForm key={money.id} money={money} />
          ))}
        </SectionPanel>

        <InventoryItems character={character} />
        <MagicItems character={character} />
      </div>

      {hasEquipment && (
        <div className="flex flex-col gap-4">
          {character.weapons.length > 0 && (
            <SectionPanel accent="red" icon={Swords} title="Armes" contentClassName="gap-3">
              {character.weapons.map((weapon) => (
                <WeaponCard key={weapon.id} character={character} weapon={weapon} />
              ))}
            </SectionPanel>
          )}

          {character.armors.length > 0 && (
            <SectionPanel accent="slate" icon={ShieldHalf} title="Armures" contentClassName="gap-3">
              {character.armors.map((armor) => (
                <ArmorCard key={armor.id} character={character} armor={armor} />
              ))}
            </SectionPanel>
          )}
        </div>
      )}
    </div>
  );
}
