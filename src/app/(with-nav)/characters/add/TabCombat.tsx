import { UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import WeaponsArray from "@/app/(with-nav)/characters/add/(items)/WeaponsArray";
import ArmorsArray from "@/app/(with-nav)/characters/add/(items)/ArmorsArray";
import { Shield, Swords } from "lucide-react";

export default function TabCombat({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start">
      <SectionPanel accent="red" icon={Swords} title="Armes">
        <WeaponsArray form={form} />
      </SectionPanel>

      <SectionPanel accent="sky" icon={Shield} title="Armures">
        <ArmorsArray form={form} />
      </SectionPanel>
    </div>
  );
}
