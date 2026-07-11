import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import InventoryArray from "@/app/(with-nav)/characters/add/(items)/InventoryArray";
import WealthArray from "@/app/(with-nav)/characters/add/(items)/WealthArray";
import { Backpack, Coins } from "lucide-react";

export default function TabInventory({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-[22rem_1fr] md:items-start">
      <SectionPanel accent="amber" icon={Coins} title="Monnaies">
        <WealthArray form={form} />
      </SectionPanel>

      <SectionPanel accent="amber" icon={Backpack} title="Inventaire">
        <InventoryArray form={form} />
      </SectionPanel>
    </div>
  );
}
